import { useEffect, useRef, useState } from 'react';
import { Drone, type DroneMode, type FirstString } from '../../audio/drone';
import { isAudioSupported } from '../../audio/context';
import { tonicLabel, WESTERN_NOTES, type WesternNote } from '../../music/theory';
import { useAppData } from '../../state/AppData';
import { useTonic } from '../TonicPicker';
import { Alert, Button, cx, inputClass } from '../ui';

export function DroneTool() {
  const { data, update } = useAppData();
  const [tonic, setTonic] = useTonic();
  const [mode, setMode] = useState<DroneMode>('tanpura');
  const [first, setFirst] = useState<FirstString>('P');
  const [tempo, setTempo] = useState(4.5);
  const [playing, setPlaying] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const drone = useRef<Drone | null>(null);
  const volume = data.settings.droneVolume;

  useEffect(() => () => drone.current?.stop(), []);
  useEffect(() => {
    void drone.current?.update({ tonic, mode, firstString: first, cycleSec: tempo });
  }, [tonic, mode, first, tempo]);
  useEffect(() => {
    drone.current?.setVolume(volume);
  }, [volume]);

  const toggle = async () => {
    setErr(null);
    if (playing) {
      drone.current?.stop();
      setPlaying(false);
      return;
    }
    if (!isAudioSupported()) return setErr('Your browser does not support the Web Audio API.');
    try {
      drone.current = new Drone({ tonic, volume, mode, firstString: first, cycleSec: tempo });
      await drone.current.start();
      setPlaying(true);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Tanpura Drone</h3>
          <p className="text-sm text-muted">A continuous reference so your ear always knows where Sa is.</p>
        </div>
        <div className={cx('rounded-2xl px-5 py-3 text-center', playing ? 'bg-primary text-on-primary' : 'bg-surface-2')} aria-live="polite">
          <p className="text-xs uppercase tracking-wide opacity-80">Sa</p>
          <p className="text-2xl font-semibold">{tonicLabel(tonic)}</p>
        </div>
      </div>

      <Alert tone="info">
        This is a <strong>synthesized tanpura-style drone</strong>: each string is a physically-modelled plucked string with a jawari-like buzz, played in the tanpura&apos;s four-string cycle. It is an approximation, not a recording of a real tanpura. The note name is only a reference: a comfortable Sa is different for every singer.
      </Alert>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Choose Sa</legend>
        <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
          {WESTERN_NOTES.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={tonic.note === n}
              onClick={() => setTonic({ note: n as WesternNote, octave: tonic.octave })}
              className={cx('rounded-lg py-2 text-sm font-medium', tonic.note === n ? 'bg-primary text-on-primary' : 'bg-surface-2 hover:bg-border')}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-muted">Octave:</span>
          {[2, 3, 4].map((o) => (
            <button key={o} type="button" aria-pressed={tonic.octave === o} onClick={() => setTonic({ ...tonic, octave: o })} className={cx('rounded-lg px-3 py-1', tonic.octave === o ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
              {o}
            </button>
          ))}
          <span className="text-xs text-muted">(3 suits many lower voices, 4 many higher voices — try both)</span>
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Sound</span>
          <select className={inputClass} value={mode} onChange={(e) => setMode(e.target.value as DroneMode)}>
            <option value="tanpura">Tanpura-style (plucked cycle)</option>
            <option value="sustained">Sustained (shruti-box style)</option>
          </select>
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">First string</span>
          <select className={inputClass} value={first} onChange={(e) => setFirst(e.target.value as FirstString)}>
            <option value="P">Pa (most ragas)</option>
            <option value="m">Ma (ragas without Pa)</option>
            <option value="N">Ni</option>
          </select>
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Pluck speed</span>
          <input type="range" min={3} max={7} step={0.5} value={tempo} onChange={(e) => setTempo(Number(e.target.value))} className="w-full" disabled={mode === 'sustained'} aria-valuetext={`${tempo} seconds per cycle`} />
          <span className="text-xs text-muted">{tempo}s per cycle</span>
        </label>
      </div>

      <label className="block space-y-1.5 text-sm">
        <span className="font-medium">Volume</span>
        <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => update((d) => void (d.settings.droneVolume = Number(e.target.value)))} className="w-full" aria-valuetext={`${Math.round(volume * 100)}%`} />
      </label>

      <Button size="lg" icon={playing ? 'pause' : 'play'} onClick={toggle}>
        {playing ? 'Pause drone' : 'Play drone'}
      </Button>
      {err && <Alert tone="danger">{err}</Alert>}
    </div>
  );
}
