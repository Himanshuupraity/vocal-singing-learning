import { useEffect, useRef, useState } from 'react';
import { useMicPitch } from '../../hooks/useMicPitch';
import { useDrone } from '../../hooks/useDrone';
import { useServerStatus } from '../../hooks/useServerStatus';
import { median } from '../../audio/pitchAnalysis';
import { decodeToMono } from '../../audio/offlineAnalysis';
import { relSemitones, type TrackPoint } from '../../music/melody';
import { freqToSwara, swaraLabel, swaraToMidi, tonicMidi, type SwaraToken } from '../../music/theory';
import { voicePayload } from '../../lib/voicePayload';
import { ApiError, streamPost } from '../../lib/sse';
import { useAppData } from '../../state/AppData';
import type { Language } from '../../storage/schema';
import { Alert, Button, cx, inputClass } from '../ui';
import { MicPanel } from './MicPanel';
import { CentsMeter } from './PitchMeter';
import { PitchCompareChart } from './PitchCompareChart';

const TARGETS: SwaraToken[] = ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"];
/** Within this many cents counts as in tune for the live cue. */
const IN_TUNE = 25;
const WINDOW_SEC = 10;
const AI_EVERY_SEC = 30;
/** Seconds of audio the AI hears each time. */
const AI_SNIPPET_SEC = 20;

const CUES: Record<Language, { up: string; down: string; ok: string; wobble: string; steady: string }> = {
  hinglish: { up: 'Thoda upar ↑', down: 'Thoda neeche ↓', ok: 'Bilkul sahi ✓', wobble: 'Awaaz hil rahi hai — saans dheere chhodiye', steady: 'Steady' },
  hindi: { up: 'थोड़ा ऊपर ↑', down: 'थोड़ा नीचे ↓', ok: 'बिल्कुल सही ✓', wobble: 'आवाज़ हिल रही है — साँस धीरे छोड़िए', steady: 'स्थिर' },
  english: { up: 'A little higher ↑', down: 'A little lower ↓', ok: 'Spot on ✓', wobble: 'Wobbling — let the breath out slowly', steady: 'Steady' },
};

interface Live {
  token: SwaraToken;
  cents: number;
  wobble: number;
}

/**
 * Live sur-saath: instant on-screen (and optionally spoken) pitch cues from
 * the app's own pitch detector — fast enough to correct a note while you're
 * still holding it — plus, if the learner turns it on, a short tip from the
 * AI coach every 30 seconds after it listens to the last few seconds.
 */
export function LiveCoach() {
  const { data } = useAppData();
  const tonic = data.profile.tonic;
  const lang = data.profile.language;
  const mic = useMicPitch();
  const drone = useDrone();
  const status = useServerStatus();
  const [target, setTarget] = useState<SwaraToken | 'any'>('S');
  const [live, setLive] = useState<Live | null>(null);
  const [points, setPoints] = useState<TrackPoint[]>([]);
  const [now, setNow] = useState(0);
  const [stats, setStats] = useState({ voiced: 0, inTune: 0 });
  const [speak, setSpeak] = useState(false);
  const recent = useRef<number[]>([]);
  const all = useRef<TrackPoint[]>([]);
  const offSince = useRef<number | null>(null);
  const lastSpoken = useRef(0);
  const speakRef = useRef(speak);
  speakRef.current = speak;

  const targetSemis = target === 'any' ? null : swaraToMidi(target, tonic)! - tonicMidi(tonic);

  useEffect(() => {
    recent.current = [];
    setStats({ voiced: 0, inTune: 0 });
  }, [target, tonic]);

  useEffect(
    () =>
      mic.subscribe((f) => {
        setNow(f.t);
        if (f.status !== 'voiced' || !f.freq) {
          if (recent.current.length && f.status === 'silent') recent.current = [];
          setLive(null);
          offSince.current = null;
          return;
        }
        const semis = relSemitones(f.freq, tonic);
        all.current.push({ t: f.t, semis });
        if (all.current.length > (WINDOW_SEC + 1) * 20) all.current.splice(0, 20);
        setPoints([...all.current]);
        let token: SwaraToken;
        let cents: number;
        if (targetSemis === null) {
          const s = freqToSwara(f.freq, tonic);
          token = s.token;
          cents = s.cents;
        } else {
          const d = semis - targetSemis;
          token = target as SwaraToken;
          cents = (d - Math.round(d / 12) * 12) * 100;
        }
        recent.current = [...recent.current.slice(-29), cents];
        const last = recent.current.slice(-6);
        const c = median(last);
        const sorted = [...recent.current].sort((a, b) => a - b);
        const wobble = sorted.length >= 10 ? sorted[Math.floor(sorted.length * 0.75)] - sorted[Math.floor(sorted.length * 0.25)] : 0;
        setLive({ token, cents: c, wobble });
        const ok = Math.abs(c) <= IN_TUNE;
        setStats((s) => ({ voiced: s.voiced + 1, inTune: s.inTune + (ok ? 1 : 0) }));
        // Spoken cue only after being off for a while, and not too often.
        if (ok) offSince.current = null;
        else offSince.current ??= f.t;
        if (speakRef.current && offSince.current !== null && f.t - offSince.current > 1.2 && f.t - lastSpoken.current > 5) {
          lastSpoken.current = f.t;
          say(c < 0 ? CUES[lang].up : CUES[lang].down, lang);
        }
      }),
    [mic, tonic, target, targetSemis, lang],
  );

  const cue = live ? (Math.abs(live.cents) <= IN_TUNE ? CUES[lang].ok : live.cents < 0 ? CUES[lang].up : CUES[lang].down) : null;
  const shown = points.filter((p) => p.t > now - WINDOW_SEC).map((p) => ({ ...p, t: p.t - (now - WINDOW_SEC) }));

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Live Coach</h3>
        <p className="text-sm text-muted">Sing with the tanpura and get help while you sing: the app tells you instantly if you are above or below the sur, and the AI coach can listen every {AI_EVERY_SEC} seconds and give you one tip for tone, breath and steadiness.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">What are you singing?</span>
          <select className={inputClass} value={target} onChange={(e) => setTarget(e.target.value as SwaraToken | 'any')}>
            {TARGETS.map((t) => (
              <option key={t} value={t}>
                Holding {swaraLabel(t)}
              </option>
            ))}
            <option value="any">Anything (nearest swara)</option>
          </select>
        </label>
        <div className="flex flex-wrap items-end gap-2">
          <Button variant={drone.on ? 'secondary' : 'primary'} icon={drone.on ? 'pause' : 'wave'} onClick={drone.toggle}>
            {drone.on ? 'Stop tanpura' : 'Play tanpura'}
          </Button>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={speak} onChange={(e) => setSpeak(e.target.checked)} /> Speak the cues out loud (use headphones, so the mic doesn’t hear the voice)
      </label>
      <MicPanel mic={mic} purpose="tell you instantly whether you are on the sur" />

      {mic.state === 'on' && (
        <div className="space-y-3">
          <div className={cx('grid min-h-32 place-items-center rounded-2xl text-center', !live ? 'bg-surface-2 text-muted' : Math.abs(live.cents) <= IN_TUNE ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning')} aria-live="polite">
            {live ? (
              <div>
                <p className="font-mono text-4xl font-semibold">{swaraLabel(live.token)}</p>
                <p className="text-lg font-semibold">{cue}</p>
                <p className="text-xs">
                  {live.cents > 0 ? '+' : ''}
                  {Math.round(live.cents)} cents · {live.wobble > 40 ? CUES[lang].wobble : CUES[lang].steady}
                </p>
              </div>
            ) : (
              <p className="text-sm">{target === 'any' ? 'Sing any note…' : `Sing ${swaraLabel(target)}…`}</p>
            )}
          </div>
          <CentsMeter cents={live ? live.cents : null} tolerance={IN_TUNE} />
          <PitchCompareChart
            mine={shown}
            bands={targetSemis === null ? [] : [{ start: 0, dur: WINDOW_SEC, semis: targetSemis }]}
            duration={WINDOW_SEC}
            tolerance={IN_TUNE}
            height={180}
            label={`Your pitch over the last ${WINDOW_SEC} seconds${target === 'any' ? '' : `, with ${swaraLabel(target)} as a band`}.`}
          />
          {stats.voiced >= 20 && (
            <p className="text-sm">
              In tune (±{IN_TUNE} cents) <strong>{Math.round((stats.inTune / stats.voiced) * 100)}%</strong> of the time you sang, over {Math.round(stats.voiced / 20)} s.
            </p>
          )}
        </div>
      )}

      {status?.reachable && (status.tutor.voice ? <AiCoach mic={mic} target={target === 'any' ? 'Free singing over the tanpura' : `Holding ${swaraLabel(target)} over the tanpura`} speak={speak} /> : <p className="text-xs text-muted">The AI coach needs a Gemini key on the server. The instant cues above work without it.</p>)}
    </div>
  );
}

function say(text: string, lang: Language) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[↑↓✓—]/g, ''));
  u.lang = lang === 'english' ? 'en-IN' : 'hi-IN';
  u.rate = 1.05;
  window.speechSynthesis.speak(u);
}

interface Tip {
  at: string;
  text: string;
}

/**
 * Every 30 s, the last ~20 s of the mic is recorded on this device and — only
 * after the learner agreed — sent with the app's pitch measurements to Gemini,
 * which replies with one short tip. Silent stretches aren't sent.
 */
function AiCoach({ mic, target, speak }: { mic: ReturnType<typeof useMicPitch>; target: string; speak: boolean }) {
  const { data } = useAppData();
  const [stage, setStage] = useState<'off' | 'confirm' | 'on'>('off');
  const [tips, setTips] = useState<Tip[]>([]);
  const [partial, setPartial] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const [left, setLeft] = useState(AI_EVERY_SEC);
  const [thinking, setThinking] = useState(false);
  const rec = useRef<MediaRecorder | null>(null);
  const leftRef = useRef(AI_EVERY_SEC);
  const busy = useRef(false);
  const tipsRef = useRef<Tip[]>([]);
  tipsRef.current = tips;
  const ctx = useRef({ data, target, speak });
  ctx.current = { data, target, speak };
  const supported = typeof MediaRecorder !== 'undefined';
  const micOn = mic.state === 'on';

  const send = async (blob: Blob) => {
    if (busy.current) return;
    busy.current = true;
    setThinking(true);
    try {
      const { samples, sampleRate } = await decodeToMono(blob);
      const snip = samples.subarray(Math.max(0, samples.length - AI_SNIPPET_SEC * sampleRate));
      const { analysis, body } = voicePayload(snip, sampleRate, ctx.current.data, { label: 'Live coach', maxSec: AI_SNIPPET_SEC });
      if (analysis.voicedSec < 4) {
        setNote('Waiting for more singing before the next AI tip…');
        return;
      }
      setNote(null);
      let text = '';
      await streamPost('/api/tutor/coach', { ...body, target: ctx.current.target, previous: tipsRef.current.slice(0, 3).map((t) => t.text) }, (t) => setPartial((text += t)));
      setPartial('');
      if (text.trim()) {
        setTips((x) => [{ at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), text: text.trim() }, ...x].slice(0, 6));
        if (ctx.current.speak) say(text, ctx.current.data.profile.language);
      }
    } catch (e) {
      setPartial('');
      const err = e as ApiError;
      setNote(err.status === 429 ? 'The AI coach is resting (too many requests). The instant cues keep working; AI tips resume later.' : err.message || 'The AI coach could not answer this time.');
      if (err.status === 429 || err.status === 503) setStage('off');
    } finally {
      busy.current = false;
      setThinking(false);
    }
  };

  // Record in 30 s pieces: each finished piece is a complete file the browser can decode.
  useEffect(() => {
    if (stage !== 'on' || !micOn || !supported) return;
    const stream = mic.getStream();
    if (!stream) return;
    let alive = true;
    const startPiece = () => {
      const r = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      r.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      r.onstop = () => {
        if (chunks.length) void send(new Blob(chunks, { type: r.mimeType }));
        if (alive) startPiece();
      };
      r.start();
      rec.current = r;
      leftRef.current = AI_EVERY_SEC;
      setLeft(AI_EVERY_SEC);
    };
    startPiece();
    const iv = window.setInterval(() => {
      leftRef.current -= 1;
      if (leftRef.current <= 0 && rec.current?.state === 'recording') rec.current.stop();
      else setLeft(Math.max(0, leftRef.current));
    }, 1000);
    return () => {
      alive = false;
      clearInterval(iv);
      if (rec.current?.state === 'recording') {
        rec.current.onstop = null;
        rec.current.stop();
      }
      rec.current = null;
    };
  }, [stage, micOn, supported]);

  if (!supported) return <p className="text-xs text-muted">This browser can’t record audio, so the AI coach isn’t available here. The instant cues above still work.</p>;

  return (
    <div className="space-y-3 rounded-2xl border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold">AI coach</h4>
        {stage === 'on' && (
          <Button size="sm" variant="ghost" onClick={() => setStage('off')}>
            Turn off AI coach
          </Button>
        )}
      </div>
      {stage === 'off' && (
        <>
          <p className="text-sm text-muted">The AI listens to your last {AI_SNIPPET_SEC} seconds every {AI_EVERY_SEC} seconds and gives one tip on tone, breath or steadiness — things the pitch meter can’t hear.</p>
          <Button size="sm" variant="secondary" icon="sparkle" onClick={() => setStage('confirm')}>
            Turn on AI coach
          </Button>
        </>
      )}
      {stage === 'confirm' && (
        <Alert tone="info" title="Send snippets of your singing to the AI?">
          <p>
            While the AI coach is on, every {AI_EVERY_SEC} seconds the last {AI_SNIPPET_SEC} seconds from your microphone and their pitch measurements are sent through the SurSadhana server to <strong>Google Gemini</strong>. Silent stretches are not sent. SurSadhana keeps no copy; Google’s handling is described in the{' '}
            <a className="underline" href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noreferrer">
              Gemini API terms
            </a>
            . Turn it off any time.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setStage('on')}>
              Turn on
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setStage('off')}>
              Cancel
            </Button>
          </div>
        </Alert>
      )}
      {stage === 'on' && (
        <>
          <p className="text-sm text-muted" aria-live="off">
            {!micOn ? 'Turn on the microphone above to start.' : thinking ? 'The AI is listening…' : `Next AI tip in ${left}s`}
          </p>
          {micOn && (
            <Button size="sm" variant="secondary" onClick={() => rec.current?.state === 'recording' && rec.current.stop()}>
              Tip now
            </Button>
          )}
        </>
      )}
      {note && <p className="text-sm text-warning">{note}</p>}
      {(partial || tips.length > 0) && (
        <ol className="space-y-2" aria-live="polite">
          {partial && <li className="rounded-xl bg-primary-soft p-3 text-sm">{partial}</li>}
          {tips.map((t, i) => (
            <li key={`${t.at}-${i}`} className={cx('rounded-xl p-3 text-sm', i === 0 && !partial ? 'bg-primary-soft' : 'bg-surface-2 text-muted')}>
              <span className="mr-2 text-xs text-muted">{t.at}</span>
              {t.text}
            </li>
          ))}
        </ol>
      )}
      <p className="text-xs text-muted">AI tips can be wrong, especially with a phone mic or noise; the pitch numbers come from the app. If anything hurts, stop and rest your voice.</p>
    </div>
  );
}
