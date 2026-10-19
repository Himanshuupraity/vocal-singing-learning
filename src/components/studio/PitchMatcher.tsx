import { useEffect, useMemo, useRef, useState } from 'react';
import { useMicPitch } from '../../hooks/useMicPitch';
import { describeFreq, explainAttempt, scoreAttempt, verdictFor, type AttemptResult, type PitchFrame } from '../../audio/pitchAnalysis';
import { playFreq } from '../../audio/synth';
import { ensureRunning } from '../../audio/context';
import { centsBetween, freqToSwara, swaraLabel, swaraToFreq, tonicLabel, type SwaraToken } from '../../music/theory';
import { useAppData } from '../../state/AppData';
import { pitchRecord } from '../../lib/record';
import { Alert, Badge, Button, cx } from '../ui';
import { MicPanel } from './MicPanel';
import { CentsMeter, PitchTrace } from './PitchMeter';

type Phase = 'ready' | 'reference' | 'singing' | 'result';

const CAPTURE_SEC = 4;

export interface PitchMatcherProps {
  targets: SwaraToken[];
  /** where results are saved, e.g. "studio", "lesson:l1-x", "checkpoint:1" */
  context: string;
  tolerance?: number;
  title?: string;
  onAttempt?: (r: AttemptResult, target: SwaraToken) => void;
  /** pick targets in order (default) or randomly */
  order?: 'sequential' | 'random';
}

export function PitchMatcher({ targets, context, tolerance = 50, title = 'Pitch Matcher', onAttempt, order = 'sequential' }: PitchMatcherProps) {
  const { data, update } = useAppData();
  const tonic = data.profile.tonic;
  const mic = useMicPitch();
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('ready');
  const [countdown, setCountdown] = useState(0);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [trace, setTrace] = useState<PitchFrame[]>([]);
  const [session, setSession] = useState<{ target: string; matched: boolean; reliable: boolean; cents: number }[]>([]);
  const captured = useRef<PitchFrame[]>([]);
  const timers = useRef<number[]>([]);

  const target = targets[idx % targets.length];
  const targetFreq = useMemo(() => swaraToFreq(target, tonic)!, [target, tonic]);

  useEffect(() => mic.subscribe((f) => {
    setTrace((t) => [...t.slice(-180), f]);
    if (phaseRef.current === 'singing') captured.current.push(f);
  }), [mic]);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const playRef = async () => {
    await ensureRunning();
    playFreq(targetFreq, { duration: 1.6, timbre: data.settings.referenceTimbre, volume: 0.4 });
  };

  const attempt = async () => {
    if (mic.state !== 'on') await mic.start();
    setResult(null);
    setPhase('reference');
    await playRef();
    timers.current.push(
      window.setTimeout(() => {
        captured.current = [];
        setPhase('singing');
        setCountdown(CAPTURE_SEC);
        for (let s = 1; s <= CAPTURE_SEC; s++) timers.current.push(window.setTimeout(() => setCountdown(CAPTURE_SEC - s), s * 1000));
        timers.current.push(window.setTimeout(finish, CAPTURE_SEC * 1000));
      }, 2000),
    );
  };

  const finish = () => {
    const r = scoreAttempt(captured.current, targetFreq, tolerance, 0.05);
    setResult(r);
    setPhase('result');
    if (r.voicedFrames > 0) {
      update((d) => void d.pitchAttempts.push(pitchRecord(r, target, tonic, context)));
      setSession((s) => [...s, { target, matched: r.matched, reliable: r.reliable, cents: r.medianCents }]);
    }
    onAttempt?.(r, target);
  };

  const next = () => {
    setResult(null);
    setPhase('ready');
    setIdx((i) => (order === 'random' ? Math.floor(Math.random() * targets.length) : i + 1));
  };

  const cancel = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase('ready');
  };

  // Live readout
  const live = mic.frame?.status === 'voiced' && mic.frame.freq ? mic.frame.freq : null;
  const liveCents = live ? (() => {
    const c = centsBetween(live, targetFreq);
    return c - Math.round(c / 1200) * 1200;
  })() : null;
  const liveNote = live ? describeFreq(live) : null;
  const liveSwara = live ? freqToSwara(live, tonic) : null;
  const reliable = session.filter((s) => s.reliable);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-muted">
            Reference
            <select className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text" value={data.settings.referenceTimbre} onChange={(e) => update((d) => void (d.settings.referenceTimbre = e.target.value as 'pure' | 'voice'))}>
              <option value="pure">Pure tone</option>
              <option value="voice">Voice-like “aa”</option>
            </select>
          </label>
          <Badge tone="info">Sa = {tonicLabel(tonic)} · tolerance ±{tolerance} cents</Badge>
        </div>
      </div>

      <MicPanel mic={mic} purpose="detect the pitch of your singing" />

      {targets.length > 1 && (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Choose target note">
          {targets.map((t, i) => (
            <button
              key={`${t}-${i}`}
              type="button"
              onClick={() => phase !== 'singing' && (setIdx(i), setResult(null), setPhase('ready'))}
              aria-pressed={i === idx % targets.length}
              className={cx('rounded-lg px-2.5 py-1 font-mono text-sm', i === idx % targets.length ? 'bg-primary text-on-primary' : 'bg-surface-2 text-muted hover:text-text')}
            >
              {swaraLabel(t)}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Target</p>
          <p className="mt-1 text-3xl font-semibold">{swaraLabel(target)}</p>
          <p className="text-sm text-muted">
            {describeFreq(targetFreq).label} · {targetFreq.toFixed(1)} Hz
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" icon="play" onClick={playRef} disabled={phase === 'singing' || phase === 'reference'}>
              Play reference
            </Button>
            {phase === 'ready' || phase === 'result' ? (
              <Button icon="mic" onClick={attempt} disabled={!!mic.unsupported}>
                {phase === 'result' ? 'Try again' : 'Start attempt'}
              </Button>
            ) : (
              <Button variant="ghost" onClick={cancel}>Cancel</Button>
            )}
            {phase === 'result' && targets.length > 1 && (
              <Button variant="ghost" icon="arrow" onClick={next}>
                Next note
              </Button>
            )}
          </div>
          <p className="mt-3 min-h-10 text-sm" aria-live="polite">
            {phase === 'ready' && '1. Listen to the reference.  2. Sing the same note on “aa” and hold it steadily.'}
            {phase === 'reference' && 'Listen carefully… hum it quietly in your head.'}
            {phase === 'singing' && <span className="font-semibold text-primary">Sing now and hold the note… {countdown}s</span>}
          </p>
        </div>

        <div className="rounded-2xl border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-muted">You (live)</p>
          {mic.state !== 'on' ? (
            <p className="mt-2 text-sm text-muted">Turn on the microphone to see your pitch.</p>
          ) : (
            <>
              <p className="mt-1 text-3xl font-semibold" aria-live="off">
                {liveSwara ? swaraLabel(liveSwara.token) : '—'}
              </p>
              <p className="text-sm text-muted">
                {liveNote ? `${liveNote.label} · ${live!.toFixed(1)} Hz` : mic.frame?.status === 'unvoiced' ? 'Sound detected, but not a clear sung note' : 'Listening… (silence)'}
              </p>
              <div className="mt-3">
                <CentsMeter cents={liveCents} tolerance={tolerance} />
              </div>
            </>
          )}
        </div>
      </div>

      {mic.state === 'on' && <PitchTrace frames={trace} targetFreq={targetFreq} />}

      {result && (
        <Alert tone={!result.reliable ? 'warning' : result.matched ? 'success' : 'info'} title={!result.reliable ? 'Not enough clear singing to measure' : result.matched ? 'Matched!' : verdictFor(result.medianCents, tolerance) === 'flat' ? 'A little low (flat)' : verdictFor(result.medianCents, tolerance) === 'sharp' ? 'A little high (sharp)' : 'Close, but unsteady'}>
          <p>{explainAttempt(result)}</p>
          {result.reliable && (
            <p className="mt-1 text-xs text-muted">
              Median {result.medianCents > 0 ? '+' : ''}
              {Math.round(result.medianCents)} cents · {result.withinPct}% of the held note within ±{tolerance} cents · spread {Math.round(result.stabilityCents)} cents ·{' '}
              {(result.voicedFrames * 0.05).toFixed(1)}s of clear voice measured
            </p>
          )}
        </Alert>
      )}

      {session.length > 0 && (
        <div className="rounded-xl bg-surface-2 p-3 text-sm">
          <p className="font-medium">This session</p>
          <p className="text-muted">
            {reliable.length} measured attempt{reliable.length === 1 ? '' : 's'} · {reliable.filter((s) => s.matched).length} matched
            {reliable.length > 0 && ` (${Math.round((reliable.filter((s) => s.matched).length / reliable.length) * 100)}%)`}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {session.slice(-20).map((s, i) => (
              <span key={i} className={cx('rounded px-1.5 py-0.5 font-mono text-xs', !s.reliable ? 'bg-surface text-muted' : s.matched ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger')}>
                {swaraLabel(s.target)} {s.reliable ? `${s.cents > 0 ? '+' : ''}${Math.round(s.cents)}¢` : '?'}
              </span>
            ))}
          </div>
        </div>
      )}

      <details className="text-sm text-muted">
        <summary className="cursor-pointer font-medium text-text">How is this measured?</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Your voice&apos;s fundamental frequency is estimated with the YIN algorithm about 20 times per second.</li>
          <li>Silence, breaths and noisy or unclear frames are ignored — they are never counted as mistakes.</li>
          <li>The first 0.3 s of each note is skipped so natural “settling in” isn&apos;t penalised.</li>
          <li>
            <strong>Cents</strong>: 100 cents = one semitone (one key on a piano). An attempt is <strong>matched</strong> when your median pitch is within ±{tolerance} cents and at least 60% of the held note stays in that range.
          </li>
          <li>Singing the same swara an octave higher or lower still counts — the app tells you which octave you used.</li>
          <li>This measures note-matching only. It cannot judge tone quality, pronunciation, rhythm or expression.</li>
        </ul>
      </details>
    </div>
  );
}
