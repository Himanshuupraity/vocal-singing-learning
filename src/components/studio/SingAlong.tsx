import { useEffect, useMemo, useRef, useState } from 'react';
import { useMicPitch } from '../../hooks/useMicPitch';
import { playSequence, type SequenceHandle } from '../../audio/sequencer';
import { playFreq } from '../../audio/synth';
import { ensureRunning } from '../../audio/context';
import { relSemitones, scoreNoteWindow, type TrackPoint } from '../../music/melody';
import { swaraLabel, swaraToMidi, tonicMidi, type SwaraToken, type Tonic } from '../../music/theory';
import { useAppData } from '../../state/AppData';
import { Alert, Button, cx } from '../ui';
import { MicPanel } from './MicPanel';
import { PitchCompareChart, type TargetBand } from './PitchCompareChart';

export interface SingAlongResult {
  scores: ReturnType<typeof scoreNoteWindow>[];
  matched: number;
  total: number;
  pct: number;
}

type Phase = 'ready' | 'reference' | 'countin' | 'singing' | 'result';

function bandsFor(notes: SwaraToken[], tonic: Tonic, beat: number): (TargetBand & { token: SwaraToken })[] {
  const sa = tonicMidi(tonic);
  return notes.flatMap((t, i) => {
    const m = swaraToMidi(t, tonic);
    return m === null ? [] : [{ token: t, start: i * beat, dur: beat, semis: m - sa }];
  });
}

/**
 * Plays a timed pattern, then the learner sings it on the same beat while
 * their pitch is drawn over the target notes; each note is scored. Used by
 * the Sur Graph and the Alankar trainer. Remount (change `key`) to reset.
 */
export function SingAlong({ notes, bpm, guide = false, listenFirst = true, onBusy, onResult }: { notes: SwaraToken[]; bpm: number; guide?: boolean; listenFirst?: boolean; onBusy?: (busy: boolean) => void; onResult?: (r: SingAlongResult) => void }) {
  const { data } = useAppData();
  const tonic = data.profile.tonic;
  const [phase, setPhase] = useState<Phase>('ready');
  const [cursor, setCursor] = useState<number | null>(null);
  const [mine, setMine] = useState<TrackPoint[]>([]);
  const [scores, setScores] = useState<ReturnType<typeof scoreNoteWindow>[] | null>(null);
  const mic = useMicPitch();
  const opt = { notes };
  const beat = 60 / bpm;
  const bands = useMemo(() => bandsFor(opt.notes, tonic, beat), [opt.notes, tonic, beat]);
  const duration = opt.notes.length * beat;
  const t0 = useRef(0);
  const capturing = useRef(false);
  const timers = useRef<number[]>([]);
  const raf = useRef(0);
  const seq = useRef<SequenceHandle | null>(null);
  const points = useRef<TrackPoint[]>([]);
  const runId = useRef(0);

  const stopAll = () => {
    runId.current++;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    cancelAnimationFrame(raf.current);
    seq.current?.stop();
    capturing.current = false;
  };
  useEffect(() => stopAll, []);
  const busy = phase === 'reference' || phase === 'countin' || phase === 'singing';
  useEffect(() => onBusy?.(busy), [busy, onBusy]);

  useEffect(
    () =>
      mic.subscribe((f) => {
        if (!capturing.current || f.status !== 'voiced' || !f.freq) return;
        points.current.push({ t: (performance.now() - t0.current) / 1000, semis: relSemitones(f.freq, tonic) });
        setMine([...points.current]);
      }),
    [mic, tonic],
  );

  const runCursor = () => {
    const tick = () => {
      const t = (performance.now() - t0.current) / 1000;
      setCursor(Math.min(t, duration));
      if (t < duration) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const finish = () => {
    capturing.current = false;
    setCursor(null);
    const res = bands.map((b) => {
      // Middle 70% of each note's slot: ignore the slide in and out.
      const inner = points.current.filter((p) => p.t >= b.start + b.dur * 0.2 && p.t < b.start + b.dur * 0.9).map((p) => p.semis);
      return scoreNoteWindow(inner, b.semis);
    });
    setScores(res);
    setPhase('result');
    const ok = res.filter((r) => r.matched).length;
    onResult?.({ scores: res, matched: ok, total: res.length, pct: res.length ? Math.round((ok / res.length) * 100) : 0 });
  };

  const start = async () => {
    if (mic.state !== 'on') await mic.start();
    stopAll();
    setScores(null);
    setMine([]);
    points.current = [];
    const run = runId.current;
    const ctx = await ensureRunning();
    // 1. The reference plays while the cursor shows where it is.
    if (listenFirst) {
      setPhase('reference');
      t0.current = performance.now();
      runCursor();
      seq.current = await playSequence(opt.notes, tonic, bpm, { timbre: data.settings.demoTimbre });
      await seq.current.done;
      if (run !== runId.current) return;
    }
    // 2. Two count-in clicks.
    setPhase('countin');
    setCursor(null);
    for (let i = 0; i < 2; i++) playFreq(1400, { when: ctx.currentTime + 0.1 + i * beat, duration: 0.05, timbre: 'pure', volume: 0.25 });
    timers.current.push(
      window.setTimeout(async () => {
        // 3. Your turn, on the same timeline.
        setPhase('singing');
        t0.current = performance.now();
        capturing.current = true;
        runCursor();
        if (guide && run === runId.current) seq.current = await playSequence(opt.notes, tonic, bpm, { timbre: 'pure' });
        timers.current.push(window.setTimeout(finish, duration * 1000 + 300));
      }, (0.1 + 2 * beat) * 1000),
    );
  };

  const reliable = scores?.filter((s) => s.reliable) ?? [];
  const matched = reliable.filter((s) => s.matched).length;
  const signed = reliable.map((s) => s.cents);
  const avg = signed.length ? Math.round(signed.reduce((a, b) => a + b, 0) / signed.length) : 0;
  const worst = scores ? bands.map((b, i) => ({ b, s: scores[i] })).filter((x) => x.s.reliable && !x.s.matched).sort((a, z) => Math.abs(z.s.cents) - Math.abs(a.s.cents))[0] : undefined;

  return (
    <div className="space-y-4">
      <MicPanel mic={mic} purpose="draw your pitch next to the pattern" />

      <PitchCompareChart
        bands={bands}
        mine={mine}
        duration={duration}
        cursor={cursor}
        label={`Target notes ${opt.notes.filter((t) => t !== '-').map(swaraLabel).join(' ')} as bands, with your sung pitch as dots: green inside the band, red outside.`}
      />
      <p className="text-xs text-muted">Bands = the notes to sing (±50 cents). Your dots turn green inside a band and red outside. Singing the pattern an octave lower or higher is fine — it’s drawn on the target octave.</p>

      <p className="min-h-6 text-sm font-medium" aria-live="polite">
        {phase === 'ready' && (listenFirst ? 'Press Start: listen to the pattern once, then sing it on the same beat.' : 'Press Start: after two clicks, sing the pattern on the beat.')}
        {phase === 'reference' && 'Listen…'}
        {phase === 'countin' && 'Your turn in 2… 1…'}
        {phase === 'singing' && <span className="text-primary">Sing now, following the moving line.</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button icon="mic" onClick={start} disabled={busy || !!mic.unsupported}>
          {phase === 'result' ? 'Try again' : 'Start'}
        </Button>
        {busy && (
          <Button
            variant="ghost"
            onClick={() => {
              stopAll();
              setPhase('ready');
              setCursor(null);
            }}
          >
            Stop
          </Button>
        )}
      </div>

      {scores && (
        <div className="space-y-3">
          <ol className="flex flex-wrap gap-1.5" aria-label="Result per note">
            {bands.map((b, i) => {
              const s = scores[i];
              return (
                <li key={i} className={cx('min-w-12 rounded-lg px-2 py-1 text-center font-mono text-sm', !s.reliable ? 'bg-surface-2 text-muted' : s.matched ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger')}>
                  {swaraLabel(b.token)}
                  <span className="block text-[11px]">{s.reliable ? `${s.cents > 0 ? '+' : ''}${s.cents}¢` : 'unclear'}</span>
                </li>
              );
            })}
          </ol>
          <Alert tone={reliable.length && matched === bands.length ? 'success' : 'info'} title={`${matched} of ${bands.length} notes in tune`}>
            {reliable.length < bands.length && 'Some notes were too short or unclear to measure — sing a little louder and hold each note for its whole slot. '}
            {worst && `Biggest miss: ${swaraLabel(worst.b.token)}, ${Math.abs(worst.s.cents)} cents ${worst.s.cents < 0 ? 'low' : 'high'}. `}
            {reliable.length >= 3 && Math.abs(avg) >= 25 && `Overall you sang a little ${avg < 0 ? 'low (flat) — aim each note a touch higher' : 'high (sharp) — relax and aim a touch lower'}. `}
            {reliable.length && matched === bands.length ? 'Every note in tune — try a faster speed next.' : ''}
          </Alert>
        </div>
      )}
    </div>
  );
}

