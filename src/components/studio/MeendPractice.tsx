import { useEffect, useRef, useState } from 'react';
import { playGlide, playOscillation } from '../../audio/synth';
import { analyzeGlide, analyzeOscillation, foldTo, type GlideResult, type OscillationResult } from '../../music/meend';
import type { TrackPoint } from '../../music/melody';
import { swaraLabel, swaraToFreq, swaraToMidi, tonicMidi, type SwaraToken } from '../../music/theory';
import { useMicPitch } from '../../hooks/useMicPitch';
import { useSingCapture } from '../../hooks/useSingCapture';
import { useAppData } from '../../state/AppData';
import { Alert, Button, cx, inputClass } from '../ui';
import { MicPanel } from './MicPanel';
import { PitchCompareChart } from './PitchCompareChart';

const GLIDES: [SwaraToken, SwaraToken][] = [
  ['S', 'G'],
  ['G', 'S'],
  ['S', 'P'],
  ['P', 'S'],
  ['G', 'P'],
  ['P', "S'"],
  ["S'", 'P'],
  ['N', 'R'],
];
const SWINGS: [SwaraToken, SwaraToken][] = [
  ['R', 'G'],
  ['m', 'P'],
  ['P', 'D'],
  ['D', 'N'],
  ['N', "S'"],
];
const SPEEDS = { andolan: { label: 'Slow sway (andolan)', hz: 1 }, gamak: { label: 'Faster shake (gamak)', hz: 3 } };

export function MeendPractice() {
  const [mode, setMode] = useState<'meend' | 'gamak'>('meend');
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Meend &amp; Gamak</h3>
        <p className="text-sm text-muted">Ornaments make Indian singing sound Indian. Practise a <strong>meend</strong> (a smooth glide that lands exactly on the next swara) or a <strong>gamak / andolan</strong> (a controlled swing between two swaras). The graph shows your voice against the ideal shape.</p>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Ornament">
        {(
          [
            ['meend', 'Meend (glide)'],
            ['gamak', 'Gamak / andolan (swing)'],
          ] as const
        ).map(([m, label]) => (
          <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={cx('rounded-lg px-3 py-1.5 text-sm', mode === m ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
            {label}
          </button>
        ))}
      </div>
      {mode === 'meend' ? <Meend /> : <Gamak />}
    </div>
  );
}

const pairId = (p: [SwaraToken, SwaraToken]) => p.join('>');

function Meend() {
  const { data } = useAppData();
  const tonic = data.profile.tonic;
  const mic = useMicPitch();
  const [pair, setPair] = useState(GLIDES[0]);
  const [dur, setDur] = useState(2);
  const [res, setRes] = useState<GlideResult | null>(null);
  const [from, to] = pair;
  const sa = tonicMidi(tonic);
  const a = swaraToMidi(from, tonic)! - sa;
  const b = swaraToMidi(to, tonic)! - sa;
  const cap = useSingCapture(mic, tonic, { maxSec: 8, minSec: 1.5, onDone: (p) => setRes(p.length >= 6 ? analyzeGlide(p, a, b) : null) });

  useEffect(() => setRes(null), [pair, dur, tonic]);

  // The ideal shape: hold ~1 s, glide evenly, hold ~1 s.
  const ideal: TrackPoint[] = Array.from({ length: Math.round((2 + dur) / 0.05) }, (_, i) => {
    const t = i * 0.05;
    const x = Math.min(1, Math.max(0, (t - 1) / dur));
    return { t, semis: a + (b - a) * x };
  });
  const good = res && res.startCents !== null && Math.abs(res.startCents) <= 30 && res.landed && Math.abs(res.landCents ?? 99) <= 30 && !res.stops.length && !res.reversals && !res.breaks && !res.overshootCents;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Glide</span>
          <select className={inputClass} value={pairId(pair)} onChange={(e) => setPair(GLIDES.find((g) => pairId(g) === e.target.value)!)}>
            {GLIDES.map((g) => (
              <option key={pairId(g)} value={pairId(g)}>
                {swaraLabel(g[0])} → {swaraLabel(g[1])}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Glide speed</span>
          <select className={inputClass} value={dur} onChange={(e) => setDur(Number(e.target.value))}>
            <option value={3}>Very slow (3 s)</option>
            <option value={2}>Slow (2 s)</option>
            <option value={1.2}>Medium (1.2 s)</option>
          </select>
        </label>
      </div>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-muted">
        <li>Listen to the glide.</li>
        <li>
          Hold {swaraLabel(from)} for about a second, glide smoothly on “aa” — passing through the notes in between, not stopping on them — and land on {swaraLabel(to)}. Hold it, then stop.
        </li>
      </ol>
      <MicPanel mic={mic} purpose="draw your glide" />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" icon="play" onClick={() => playGlide(from, to, tonic, dur)}>
          Listen
        </Button>
        {cap.state === 'idle' ? (
          <Button icon="mic" onClick={cap.start} disabled={!!mic.unsupported}>
            {res ? 'Sing again' : 'Sing it'}
          </Button>
        ) : (
          <Button variant="ghost" icon="stop" onClick={cap.stop}>
            Done
          </Button>
        )}
      </div>
      <p className="min-h-6 text-sm font-medium" aria-live="polite">
        {cap.state === 'waiting' && `Start on ${swaraLabel(from)} whenever you’re ready…`}
        {cap.state === 'singing' && <span className="text-primary">Glide… it stops by itself when you stop singing.</span>}
      </p>
      <PitchCompareChart reference={ideal} mine={foldTo(cap.points, a)} duration={Math.max(2 + dur, ...cap.points.map((p) => p.t)) + 0.3} label={`The ideal glide from ${swaraLabel(from)} to ${swaraLabel(to)} and your voice, over time.`} />
      <p className="text-xs text-muted">Amber line = the ideal glide; dots = your voice (drawn in the same octave).</p>
      {cap.state === 'idle' && res && (
        <Alert tone={good ? 'success' : 'info'} title={good ? 'Smooth meend — well landed!' : 'Here’s what the graph shows'}>
          <ul className="list-disc space-y-1 pl-5">
            <li>{res.startCents === null ? `Hold ${swaraLabel(from)} steadily for a moment before you glide.` : Math.abs(res.startCents) <= 30 ? `Started on ${swaraLabel(from)} in tune.` : `Started ${Math.abs(res.startCents)} cents ${res.startCents < 0 ? 'low' : 'high'} on ${swaraLabel(from)}.`}</li>
            <li>{!res.landed ? `Didn’t settle on ${swaraLabel(to)} — keep going until you arrive, then hold it.` : Math.abs(res.landCents!) <= 30 ? `Landed on ${swaraLabel(to)} in tune.` : `Landed ${Math.abs(res.landCents!)} cents ${res.landCents! < 0 ? 'low' : 'high'} of ${swaraLabel(to)}.`}</li>
            {res.stops.length > 0 && <li>Stopped on {res.stops.map((s) => swaraLabel(stepToken(s))).join(', ')} on the way — that’s singing steps. Let the voice slide through without resting.</li>}
            {res.reversals > 0 && <li>The pitch turned back {res.reversals} time{res.reversals > 1 ? 's' : ''}. Keep moving in one direction.</li>}
            {res.breaks > 0 && <li>The voice jumped instead of gliding. Sing softer and slower through that part.</li>}
            {res.overshootCents > 0 && <li>Went {res.overshootCents} cents past {swaraLabel(to)} before settling — slow down as you arrive.</li>}
            {res.landed && <li>Glide took {res.glideSec} s.</li>}
          </ul>
        </Alert>
      )}
      {cap.state === 'idle' && !res && cap.points.length > 0 && <Alert tone="warning">Not enough clear singing to analyse. Sing a little louder, closer to the mic.</Alert>}
    </div>
  );
}

const stepToken = (semis: number) => {
  const letters = ['S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N'];
  const pc = ((semis % 12) + 12) % 12;
  return letters[pc] + (semis >= 12 ? "'" : '');
};

function Gamak() {
  const { data } = useAppData();
  const tonic = data.profile.tonic;
  const mic = useMicPitch();
  const [pair, setPair] = useState(SWINGS[0]);
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>('andolan');
  const [res, setRes] = useState<OscillationResult | null | 'none'>(null);
  const demo = useRef<{ stop: () => void } | null>(null);
  const [lower, upper] = pair;
  const sa = tonicMidi(tonic);
  const lo = swaraToMidi(lower, tonic)! - sa;
  const hi = swaraToMidi(upper, tonic)! - sa;
  const hz = SPEEDS[speed].hz;
  const cap = useSingCapture(mic, tonic, { maxSec: 6, minSec: 2, onDone: (p) => setRes(analyzeOscillation(p, lo, hi) ?? 'none') });

  useEffect(() => setRes(null), [pair, speed, tonic]);
  useEffect(() => () => demo.current?.stop(), []);

  const ideal: TrackPoint[] = Array.from({ length: 120 }, (_, i) => ({ t: i * 0.05, semis: lo + (hi - lo) * (0.5 - 0.5 * Math.cos(2 * Math.PI * hz * i * 0.05)) }));
  const r = res && res !== 'none' ? res : null;
  const sizeOk = r && Math.abs(r.extentSemis - (hi - lo)) <= 0.5;
  const rateOk = r && r.rateHz >= hz * 0.6 && r.rateHz <= hz * 1.6;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Swing between</span>
          <select className={inputClass} value={pairId(pair)} onChange={(e) => setPair(SWINGS.find((g) => pairId(g) === e.target.value)!)}>
            {SWINGS.map((g) => (
              <option key={pairId(g)} value={pairId(g)}>
                {swaraLabel(g[0])} ↔ {swaraLabel(g[1])}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Speed</span>
          <select className={inputClass} value={speed} onChange={(e) => setSpeed(e.target.value as keyof typeof SPEEDS)}>
            {Object.entries(SPEEDS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}, ~{v.hz} per second
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-sm text-muted">
        Swing your voice evenly between {swaraLabel(lower)} and {swaraLabel(upper)} on “aa” for about 5 seconds. Touch both notes each time — not too wide, not too narrow — and keep the swings even. Real gamak and andolan shapes differ between ragas and gharanas; this trains control.
      </p>
      <MicPanel mic={mic} purpose="measure your swings" />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          icon="play"
          onClick={async () => {
            demo.current?.stop();
            demo.current = await playOscillation(swaraToFreq(lower, tonic)!, swaraToFreq(upper, tonic)!, hz, 4);
          }}
        >
          Listen
        </Button>
        {cap.state === 'idle' ? (
          <Button icon="mic" onClick={cap.start} disabled={!!mic.unsupported}>
            {res ? 'Sing again' : 'Sing it'}
          </Button>
        ) : (
          <Button variant="ghost" icon="stop" onClick={cap.stop}>
            Done
          </Button>
        )}
      </div>
      <p className="min-h-6 text-sm font-medium" aria-live="polite">
        {cap.state === 'waiting' && 'Start whenever you’re ready…'}
        {cap.state === 'singing' && <span className="text-primary">Keep swinging… (up to 6 seconds)</span>}
      </p>
      <PitchCompareChart reference={ideal} mine={foldTo(cap.points, (lo + hi) / 2)} duration={6} label={`The ideal swing between ${swaraLabel(lower)} and ${swaraLabel(upper)} and your voice.`} />
      {cap.state === 'idle' && res === 'none' && <Alert tone="warning">I couldn’t find clear swings. Make each swing a little bigger and slower, and sing on an open “aa”.</Alert>}
      {cap.state === 'idle' && r && (
        <Alert tone={sizeOk && rateOk && r.regularityPct >= 70 ? 'success' : 'info'} title={`${r.cycles} swings, about ${r.rateHz} per second`}>
          <ul className="list-disc space-y-1 pl-5">
            <li>{rateOk ? 'Good speed for this exercise.' : r.rateHz < hz ? `Slower than the target (~${hz} per second) — that’s fine to start; speed up gradually.` : `Faster than the target (~${hz} per second) — slow down and make each swing clear.`}</li>
            <li>{sizeOk ? `Swing size matches ${swaraLabel(lower)}–${swaraLabel(upper)}.` : r.extentSemis < hi - lo ? `Swings too narrow (${r.extentSemis} semitones; target ${hi - lo}) — reach all the way to both notes.` : `Swings too wide (${r.extentSemis} semitones; target ${hi - lo}) — don’t go past the two notes.`}</li>
            <li>Evenness: {r.regularityPct}% {r.regularityPct >= 70 ? '— nice and even.' : '— some swings were rushed or held; keep a steady pulse.'}</li>
            {Math.abs(r.topCents) > 40 && <li>Tops were {Math.abs(r.topCents)} cents {r.topCents < 0 ? 'below' : 'above'} {swaraLabel(upper)}.</li>}
            {Math.abs(r.bottomCents) > 40 && <li>Bottoms were {Math.abs(r.bottomCents)} cents {r.bottomCents < 0 ? 'below' : 'above'} {swaraLabel(lower)}.</li>}
          </ul>
        </Alert>
      )}
    </div>
  );
}
