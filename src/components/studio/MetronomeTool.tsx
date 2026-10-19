import { useEffect, useRef, useState } from 'react';
import { Metronome } from '../../audio/metronome';
import { ensureRunning } from '../../audio/context';
import { TAALS, vibhagOf, type BeatRole, type TaalId } from '../../music/taal';
import { useAppData } from '../../state/AppData';
import { uid } from '../../lib/dates';
import { Alert, Button, cx, inputClass } from '../ui';
import { SingRhythmTest } from './SingRhythmTest';

export function MetronomeTool({ initialTaal = null, initialBpm = 70, context = 'studio' }: { initialTaal?: TaalId | null; initialBpm?: number; context?: string }) {
  const [bpm, setBpm] = useState(initialBpm);
  const [taal, setTaal] = useState<TaalId | null>(initialTaal);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [speak, setSpeak] = useState(false);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState<{ i: number; role: BeatRole } | null>(null);
  const met = useRef<Metronome | null>(null);
  const speakRef = useRef(speak);
  speakRef.current = speak;

  const cycle = taal ? TAALS[taal].matras : beatsPerBar;

  useEffect(() => () => met.current?.stop(), []);
  useEffect(() => {
    met.current?.update({ bpm, taal, beatsPerBar });
  }, [bpm, taal, beatsPerBar]);

  const onBeat = (i: number, role: BeatRole) => {
    setBeat({ i, role });
    if (speakRef.current && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(i + 1));
      u.rate = 1.6;
      u.volume = 0.8;
      window.speechSynthesis.speak(u);
    }
  };

  const toggle = async () => {
    if (running) {
      met.current?.stop();
      setRunning(false);
      setBeat(null);
      return;
    }
    met.current = new Metronome({ bpm, taal, beatsPerBar, volume: 0.9, accentFirst: true, onBeat });
    await met.current.start();
    setRunning(true);
  };

  const def = taal ? TAALS[taal] : null;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Metronome &amp; Taal</h3>
        <p className="text-sm text-muted">
          A <strong>metronome</strong> gives equal, evenly spaced beats. A <strong>taal</strong> is a repeating rhythmic cycle with structure — sam (the first, strongest beat), tali (claps) and khali (a “wave”, the empty section). Different sounds mark each.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Mode</span>
          <select className={inputClass} value={taal ?? 'none'} onChange={(e) => setTaal(e.target.value === 'none' ? null : (e.target.value as TaalId))}>
            <option value="none">Plain metronome</option>
            <option value="keharwa">Keharwa (8)</option>
            <option value="dadra">Dadra (6)</option>
            <option value="teentaal">Teentaal (16)</option>
          </select>
        </label>
        {!taal && (
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">Beats per cycle</span>
            <select className={inputClass} value={beatsPerBar} onChange={(e) => setBeatsPerBar(Number(e.target.value))}>
              {[2, 3, 4, 6, 8].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
        )}
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Tempo: {bpm} bpm</span>
          <input type="range" min={30} max={200} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="w-full" aria-label="Tempo" />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={speak} onChange={(e) => setSpeak(e.target.checked)} /> Speak the beat numbers (works best below ~90 bpm; speech may lag slightly)
      </label>

      {def && <p className="rounded-xl bg-surface-2 p-3 text-sm">{def.description}</p>}

      <div className="flex flex-wrap gap-3" aria-label="Beat cycle">
        {(def ? def.vibhags : [cycle]).map((len, v) => {
          const start = def ? def.vibhags.slice(0, v).reduce((s, x) => s + x, 0) : 0;
          return (
            <div key={v} className="rounded-xl border border-border p-2">
              {def && <p className="mb-1 text-center text-xs font-semibold text-muted">{def.markers[v] === 'X' ? 'X (sam · clap)' : def.markers[v] === 0 ? '0 (khali · wave)' : `${def.markers[v]} (tali · clap)`}</p>}
              <div className="flex gap-1.5">
                {Array.from({ length: len }, (_, k) => {
                  const i = start + k;
                  const on = beat?.i === i;
                  return (
                    <div key={i} className={cx('grid h-12 w-12 place-items-center rounded-lg text-sm transition-colors', on ? (beat?.role === 'sam' ? 'bg-primary text-on-primary' : beat?.role === 'khali' ? 'bg-info text-white' : 'bg-accent text-white') : 'bg-surface-2')}>
                      <div className="text-center leading-tight">
                        <div className="font-semibold">{i + 1}</div>
                        {def && <div className="text-[10px] opacity-80">{def.theka[i]}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">{beat && def ? `Beat ${beat.i + 1}, vibhag ${vibhagOf(def, beat.i) + 1}` : ''}</p>

      <Button size="lg" icon={running ? 'stop' : 'play'} onClick={toggle}>
        {running ? 'Stop' : 'Start'}
      </Button>

      <TapTest bpm={bpm} context={context} disabled={running} />
      {!running && <SingRhythmTest bpm={bpm} context={context} />}
    </div>
  );
}

/** Tap along with 16 clicks; measures timing offsets. Saved as a rhythm result. */
export function TapTest({ bpm, context, disabled, onDone }: { bpm: number; context: string; disabled?: boolean; onDone?: (onBeatPct: number) => void }) {
  const { update } = useAppData();
  const [phase, setPhase] = useState<'idle' | 'countin' | 'tapping' | 'done'>('idle');
  const [result, setResult] = useState<{ mean: number; meanSigned: number; onBeat: number; taps: number } | null>(null);
  const beats = useRef<number[]>([]);
  const taps = useRef<number[]>([]);
  const met = useRef<Metronome | null>(null);
  const COUNT_IN = 4;
  const TOTAL = 16;

  useEffect(() => () => met.current?.stop(), []);

  const finish = () => {
    met.current?.stop();
    const b = beats.current.slice(COUNT_IN);
    const offsets = taps.current
      .map((t) => {
        let best = Infinity;
        for (const x of b) if (Math.abs(t - x) < Math.abs(best)) best = t - x;
        return best;
      })
      .filter((o) => Math.abs(o) < (60000 / bpm) / 2);
    const mean = offsets.length ? offsets.reduce((s, o) => s + Math.abs(o), 0) / offsets.length : 0;
    const meanSigned = offsets.length ? offsets.reduce((s, o) => s + o, 0) / offsets.length : 0;
    const onBeat = Math.round((offsets.filter((o) => Math.abs(o) <= 80).length / TOTAL) * 100);
    setResult({ mean, meanSigned, onBeat, taps: offsets.length });
    setPhase('done');
    if (offsets.length >= 4) {
      update((d) => void d.rhythm.push({ id: uid(), at: new Date().toISOString(), context, bpm, taal: null, taps: offsets.length, meanAbsOffsetMs: Math.round(mean), onBeatPct: onBeat, mode: 'tap' }));
      onDone?.(onBeat);
    }
  };

  const start = async () => {
    await ensureRunning();
    beats.current = [];
    taps.current = [];
    setResult(null);
    setPhase('countin');
    let n = 0;
    met.current = new Metronome({
      bpm,
      taal: null,
      beatsPerBar: 4,
      volume: 0.9,
      accentFirst: true,
      onBeat: () => {
        beats.current.push(performance.now());
        n++;
        if (n === COUNT_IN) setPhase('tapping');
        if (n === COUNT_IN + TOTAL) window.setTimeout(finish, (60000 / bpm) * 0.6);
      },
    });
    await met.current.start();
  };

  const tap = () => {
    if (phase === 'tapping' || phase === 'countin') taps.current.push(performance.now());
  };

  return (
    <div className="rounded-2xl border border-border p-4">
      <h4 className="font-semibold">Tap-along timing test</h4>
      <p className="text-sm text-muted">
        After 4 count-in clicks, tap the big button (or press Space) exactly with each of the next {TOTAL} clicks at {bpm} bpm. This measures timing only.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {phase === 'idle' || phase === 'done' ? (
          <Button onClick={start} disabled={disabled} icon="drum">
            {phase === 'done' ? 'Test again' : 'Start test'}
          </Button>
        ) : (
          <button
            type="button"
            autoFocus
            onPointerDown={(e) => (e.preventDefault(), tap())}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), tap())}
            className="h-24 w-48 rounded-2xl bg-primary text-lg font-semibold text-on-primary active:scale-95"
          >
            {phase === 'countin' ? 'Get ready…' : 'TAP'}
          </button>
        )}
        {disabled && <span className="text-xs text-muted">Stop the metronome above first.</span>}
      </div>
      {result && (
        <Alert className="mt-3" tone={result.taps < 4 ? 'warning' : result.onBeat >= 70 ? 'success' : 'info'} title={result.taps < 4 ? 'Not enough taps were detected' : `${result.onBeat}% of beats hit within ±80 ms`}>
          {result.taps >= 4 && (
            <>
              Average distance from the beat: {Math.round(result.mean)} ms.{' '}
              {Math.abs(result.meanSigned) > 25 ? `You tended to tap ${result.meanSigned < 0 ? 'early (rushing)' : 'late (dragging)'} by about ${Math.abs(Math.round(result.meanSigned))} ms.` : 'No strong tendency to rush or drag.'} (Touchscreens and Bluetooth audio can add some delay.)
            </>
          )}
        </Alert>
      )}
    </div>
  );
}
