import { useEffect, useMemo, useRef, useState } from 'react';
import { playSequence, type SequenceHandle } from '../../audio/sequencer';
import { playSwara } from '../../audio/synth';
import { swaraLabel, swaraToFreq, type SwaraToken } from '../../music/theory';
import { useAppData } from '../../state/AppData';
import { EXERCISES } from '../../data/exercises';
import { Alert, Button, cx, inputClass } from '../ui';
import { TonicPicker } from '../TonicPicker';

const SCALE: SwaraToken[] = ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"];

export const PRESETS: { id: string; label: string; notes: SwaraToken[]; note?: string }[] = [
  { id: 'aroha', label: 'Aroha (ascending)', notes: SCALE },
  { id: 'avaroha', label: 'Avaroha (descending)', notes: [...SCALE].reverse() },
  { id: 'both', label: 'Aroha + avaroha', notes: [...SCALE, ...[...SCALE].reverse().slice(1)] },
  { id: 'five', label: 'Sa to Pa and back', notes: ['S', 'R', 'G', 'm', 'P', 'm', 'G', 'R', 'S'] },
  ...EXERCISES.filter((e) => e.tool === 'sargam' && e.pattern && e.category !== 'breath').map((e) => ({ id: e.id, label: e.title, notes: e.pattern!.filter((t) => t !== '-') })),
];

const SPEEDS = [
  { label: 'Slow', bpm: 50 },
  { label: 'Medium', bpm: 75 },
  { label: 'Faster', bpm: 100 },
];

export function SargamPlayer({ initialPattern, initialBpm }: { initialPattern?: SwaraToken[]; initialBpm?: number }) {
  const { data } = useAppData();
  const tonic = data.profile.tonic;
  const [presetId, setPresetId] = useState(initialPattern ? 'custom' : 'both');
  const [bpm, setBpm] = useState(initialBpm ?? 50);
  const [loop, setLoop] = useState(false);
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const handle = useRef<SequenceHandle | null>(null);

  const notes = useMemo(() => (presetId === 'custom' && initialPattern ? initialPattern : PRESETS.find((p) => p.id === presetId)?.notes ?? SCALE), [presetId, initialPattern]);

  useEffect(() => () => handle.current?.stop(), []);
  useEffect(() => {
    handle.current?.stop();
    setPlaying(false);
  }, [notes, bpm, tonic, loop]);

  const play = async () => {
    setErr(null);
    try {
      handle.current?.stop();
      const h = await playSequence(notes, tonic, bpm, { onNote: setActive, loop, timbre: data.settings.demoTimbre });
      handle.current = h;
      setPlaying(true);
      h.done.then(() => setPlaying(false));
    } catch (e) {
      setErr((e as Error).message);
    }
  };
  const stop = () => {
    handle.current?.stop();
    setPlaying(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Sargam Player</h3>
        <p className="text-sm text-muted">Sing along with each highlighted note. Start slow; speed up only when every note is clear and in tune.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1.5 text-sm sm:col-span-2">
          <span className="font-medium">Pattern</span>
          <select className={inputClass} value={presetId} onChange={(e) => setPresetId(e.target.value)}>
            {initialPattern && <option value="custom">This lesson&apos;s pattern</option>}
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <TonicPicker />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Speed:</span>
        {SPEEDS.map((s) => (
          <button key={s.label} type="button" aria-pressed={bpm === s.bpm} onClick={() => setBpm(s.bpm)} className={cx('rounded-lg px-3 py-1.5 text-sm', bpm === s.bpm ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
            {s.label}
          </button>
        ))}
        <label className="ml-2 flex items-center gap-2 text-sm">
          <input type="range" min={30} max={160} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} aria-label="Tempo in beats per minute" />
          <span className="w-16 tabular-nums">{bpm} bpm</span>
        </label>
        <label className="ml-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} /> Repeat
        </label>
      </div>

      <ol className="flex flex-wrap gap-1.5" aria-label="Notes in this pattern">
        {notes.map((n, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => playSwara(n, tonic, 0.9, data.settings.demoTimbre)}
              title={`${swaraLabel(n)} — ${swaraToFreq(n, tonic)?.toFixed(1)} Hz. Click to hear.`}
              className={cx('min-w-11 rounded-lg px-2 py-2 text-center font-mono text-sm transition-all', i === active ? 'scale-110 bg-primary text-on-primary shadow' : 'bg-surface-2 hover:bg-border')}
              aria-current={i === active ? 'true' : undefined}
            >
              {swaraLabel(n)}
            </button>
          </li>
        ))}
      </ol>

      <div className="flex gap-2">
        {playing ? (
          <Button icon="stop" variant="secondary" onClick={stop}>
            Stop
          </Button>
        ) : (
          <Button icon="play" onClick={play}>
            Play pattern
          </Button>
        )}
      </div>
      {err && <Alert tone="danger">{err}</Alert>}
      <p className="text-xs text-muted">
        Notes use equal temperament (like a keyboard or harmonium). Classical singers tune some swaras very slightly differently (shruti) — your teacher and the tanpura will guide that later. “(k)” = komal, “(t)” = teevra, a dot before the name = lower octave, an apostrophe after = upper octave.
      </p>
    </div>
  );
}
