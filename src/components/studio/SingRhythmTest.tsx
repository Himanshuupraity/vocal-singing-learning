import { useEffect, useRef, useState } from 'react';
import { Metronome } from '../../audio/metronome';
import { detectOnsets, offsetsToBeats, startLevelMeter } from '../../audio/onsets';
import { MicError, MIC_ERROR_HELP } from '../../audio/mic';
import { median } from '../../audio/pitchAnalysis';
import { useAppData } from '../../state/AppData';
import { uid } from '../../lib/dates';
import { Alert, Button } from '../ui';

const COUNT_IN = 4;
const TOTAL = 16;

/**
 * Sing a short "ta" on every click. Microphones and speakers add a fixed delay
 * that differs per device, so we report:
 *  - steadiness: % of syllables within ±80 ms of YOUR typical offset (device-independent), and
 *  - your typical offset (which includes device latency, so it's only indicative).
 */
export function SingRhythmTest({ bpm, context = 'studio' }: { bpm: number; context?: string }) {
  const { data, update } = useAppData();
  const [phase, setPhase] = useState<'idle' | 'countin' | 'singing' | 'done'>('idle');
  const [beatNo, setBeatNo] = useState(0);
  const [res, setRes] = useState<{ steady: number; typical: number; n: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const met = useRef<Metronome | null>(null);
  const meter = useRef<Awaited<ReturnType<typeof startLevelMeter>> | null>(null);
  const beats = useRef<number[]>([]);

  useEffect(() => () => (met.current?.stop(), meter.current?.stop()), []);

  const finish = () => {
    met.current?.stop();
    const levels = meter.current?.levels ?? [];
    meter.current?.stop();
    meter.current = null;
    const scored = beats.current.slice(COUNT_IN);
    const beatMs = 60000 / bpm;
    const onsets = detectOnsets(levels.filter((l) => l.t >= scored[0] - beatMs / 2));
    const offs = offsetsToBeats(onsets, scored, beatMs);
    if (offs.length < 6) {
      setRes({ steady: 0, typical: 0, n: offs.length });
      setPhase('done');
      return;
    }
    const typical = median(offs);
    const steady = Math.round((offs.filter((o) => Math.abs(o - typical) <= 80).length / TOTAL) * 100);
    setRes({ steady, typical: Math.round(typical), n: offs.length });
    setPhase('done');
    update((d) => void d.rhythm.push({ id: uid(), at: new Date().toISOString(), context, bpm, taal: null, taps: offs.length, meanAbsOffsetMs: Math.round(offs.reduce((s, o) => s + Math.abs(o - typical), 0) / offs.length), onBeatPct: steady, mode: 'sing' }));
  };

  const start = async () => {
    setErr(null);
    setRes(null);
    try {
      meter.current = await startLevelMeter(data.settings.micDeviceId);
    } catch (e) {
      setErr(e instanceof MicError ? e.message : MIC_ERROR_HELP.unknown);
      return;
    }
    beats.current = [];
    let n = 0;
    setPhase('countin');
    met.current = new Metronome({
      bpm,
      taal: null,
      beatsPerBar: 4,
      volume: 0.9,
      accentFirst: true,
      onBeat: () => {
        beats.current.push(performance.now());
        n++;
        setBeatNo(n);
        if (n === COUNT_IN) setPhase('singing');
        if (n === COUNT_IN + TOTAL) window.setTimeout(finish, (60000 / bpm) * 0.6);
      },
    });
    await met.current.start();
  };

  return (
    <div className="rounded-2xl border border-border p-4">
      <h4 className="font-semibold">Sing-in-rhythm test</h4>
      <p className="text-sm text-muted">
        After 4 count-in clicks, sing a short, crisp “ta” (or “Sa”) exactly on each of the next {TOTAL} clicks at {bpm} bpm. Use headphones so the clicks don&apos;t reach the mic. Uses your microphone; nothing is recorded or uploaded.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {phase === 'idle' || phase === 'done' ? (
          <Button icon="mic" onClick={start}>
            {phase === 'done' ? 'Sing test again' : 'Start sing test'}
          </Button>
        ) : (
          <p className="text-lg font-semibold text-primary" aria-live="polite">
            {phase === 'countin' ? `Count-in… ${beatNo}` : `Sing! ${beatNo - COUNT_IN}/${TOTAL}`}
          </p>
        )}
      </div>
      {err && <Alert className="mt-3" tone="danger">{err}</Alert>}
      {res && (
        <Alert className="mt-3" tone={res.n < 6 ? 'warning' : res.steady >= 70 ? 'success' : 'info'} title={res.n < 6 ? 'Not enough clear syllables were detected' : `Steadiness: ${res.steady}% of syllables evenly in time (±80 ms)`}>
          {res.n < 6
            ? 'Sing a little louder and crisper (short “ta”), close to the mic, and use headphones.'
            : `Your syllables landed about ${Math.abs(res.typical)} ms ${res.typical >= 0 ? 'after' : 'before'} the click on average — part of this is normal microphone/speaker delay on your device, so focus on the steadiness score. Measures timing only.`}
        </Alert>
      )}
    </div>
  );
}
