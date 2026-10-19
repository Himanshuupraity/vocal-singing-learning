import { useEffect, useMemo, useRef, useState } from 'react';
import { playSequence, type SequenceHandle } from '../../audio/sequencer';
import { ALANKARS, ALANKAR_SCALES, makeAlankar, nextBpm } from '../../music/alankar';
import { swaraLabel, tonicLabel } from '../../music/theory';
import { useAppData } from '../../state/AppData';
import { Alert, Badge, Button, cx, inputClass } from '../ui';
import { SingAlong, type SingAlongResult } from './SingAlong';

/**
 * Alankar (palta) trainer: pick a shape and a scale, sing it on the beat with
 * every note checked, and the tempo steps up after each clean run. The best
 * clean tempo per alankar is saved.
 */
export function AlankarTrainer() {
  const { data, update } = useAppData();
  const [alId, setAlId] = useState('three');
  const [scaleId, setScaleId] = useState('shuddh');
  const [part, setPart] = useState<'both' | 'aroha' | 'avaroha'>('aroha');
  const key = `${alId}:${scaleId}`;
  const saved = data.alankars[key];
  const [bpm, setBpm] = useState(saved?.lastBpm ?? 50);
  const [listenFirst, setListenFirst] = useState(true);
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<{ pct: number; bpm: number; next: number } | null>(null);
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  const h = useRef<SequenceHandle | null>(null);

  const al = ALANKARS.find((a) => a.id === alId)!;
  const scale = ALANKAR_SCALES.find((s) => s.id === scaleId)!;
  const { aroha, avaroha } = useMemo(() => makeAlankar(scale.notes, al.shape), [scale, al]);
  const notes = part === 'aroha' ? aroha : part === 'avaroha' ? avaroha : [...aroha, ...avaroha];
  const groupLen = al.shape.length;

  // Switching alankar or scale resumes at the tempo you last reached there.
  useEffect(() => {
    setBpm(data.alankars[key]?.lastBpm ?? 50);
    setLast(null);
  }, [key]);
  useEffect(() => () => h.current?.stop(), []);

  const onResult = (r: SingAlongResult) => {
    const nb = nextBpm(bpm, r.pct);
    setLast({ pct: r.pct, bpm, next: nb });
    update((d) => {
      const prev = d.alankars[key];
      d.alankars[key] = { bestBpm: Math.max(prev?.bestBpm ?? 0, r.pct >= 80 ? bpm : 0), lastBpm: nb, lastPct: r.pct, at: new Date().toISOString() };
    });
  };

  const listen = async () => {
    if (playing) {
      h.current?.stop();
      return setPlaying(false);
    }
    h.current = await playSequence(notes, data.profile.tonic, bpm, { timbre: data.settings.demoTimbre });
    setPlaying(true);
    void h.current.done.then(() => setPlaying(false));
  };

  const best = Object.entries(data.alankars)
    .filter(([k, v]) => k.endsWith(`:${scaleId}`) && v.bestBpm > 0)
    .map(([k, v]) => ({ al: ALANKARS.find((a) => a.id === k.split(':')[0]), bpm: v.bestBpm }))
    .filter((x) => x.al);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Alankar Trainer</h3>
        <p className="text-sm text-muted">Alankars (paltas) train sur, laya and agility together. Sing on the beat — every note is checked. After a clean run (80% or more in tune) the tempo goes up by 10 bpm; after a hard one it comes down. Accuracy first, speed later.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Alankar</span>
          <select className={inputClass} value={alId} onChange={(e) => setAlId(e.target.value)} disabled={busy}>
            {ALANKARS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} — {a.example}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Notes</span>
          <select className={inputClass} value={scaleId} onChange={(e) => setScaleId(e.target.value)} disabled={busy}>
            {ALANKAR_SCALES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Part</span>
          <select className={inputClass} value={part} onChange={(e) => setPart(e.target.value as typeof part)} disabled={busy}>
            <option value="aroha">Aroha (up)</option>
            <option value="avaroha">Avaroha (down)</option>
            <option value="both">Aroha + avaroha</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium">Tempo: {bpm} bpm</span>
        <input type="range" min={40} max={160} step={5} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} aria-label="Tempo in beats per minute" disabled={busy} />
        {saved?.bestBpm ? <Badge tone="success">Best clean run: {saved.bestBpm} bpm</Badge> : null}
      </div>

      <ol className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-sm" aria-label="Notes of this alankar">
        {Array.from({ length: Math.ceil(notes.length / groupLen) }, (_, g) => (
          <li key={g} className="rounded-lg bg-surface-2 px-2 py-1">
            {notes
              .slice(g * groupLen, g * groupLen + groupLen)
              .map(swaraLabel)
              .join(' ')}
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" icon={playing ? 'stop' : 'play'} onClick={listen} disabled={busy}>
          {playing ? 'Stop' : 'Listen'}
        </Button>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={listenFirst} onChange={(e) => setListenFirst(e.target.checked)} disabled={busy} /> Play it once before I sing
        </label>
      </div>

      <SingAlong key={`${key}|${part}|${bpm}|${listenFirst}|${tonicLabel(data.profile.tonic)}|${run}`} notes={notes} bpm={bpm} listenFirst={listenFirst} onBusy={setBusy} onResult={onResult} />

      {last && (
        <Alert tone={last.pct >= 80 ? 'success' : 'info'} title={last.pct >= 80 ? `Clean run at ${last.bpm} bpm!` : `${last.pct}% in tune at ${last.bpm} bpm`}>
          {last.next > last.bpm ? `Next: ${last.next} bpm. ` : last.next < last.bpm ? `Let’s slow down to ${last.next} bpm and get every note clean first. ` : 'Stay at this tempo until it’s clean. '}
          <button
            type="button"
            className="underline"
            onClick={() => {
              setBpm(last.next);
              setLast(null);
              setRun((r) => r + 1);
            }}
          >
            {last.next === last.bpm ? 'Try again' : `Go to ${last.next} bpm`}
          </button>
        </Alert>
      )}

      {best.length > 0 && (
        <div className="text-sm">
          <p className="font-medium">Your best clean tempos ({scale.name})</p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {best.map((b) => (
              <li key={b.al!.id} className={cx('rounded-lg px-2 py-1 text-xs', b.al!.id === alId ? 'bg-primary-soft text-primary' : 'bg-surface-2')}>
                {b.al!.name}: {b.bpm} bpm
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-muted">Breathe at the end of a group, not in the middle. Fast alankars are sung lightly — if your throat tightens, drop the tempo.</p>
    </div>
  );
}
