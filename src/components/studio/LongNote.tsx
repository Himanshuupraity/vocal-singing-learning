import { useEffect, useState } from 'react';
import { analyzeLongNote, foldTo, type LongNoteResult } from '../../music/meend';
import { swaraLabel, swaraToMidi, tonicMidi, type SwaraToken } from '../../music/theory';
import { useMicPitch } from '../../hooks/useMicPitch';
import { useDrone } from '../../hooks/useDrone';
import { useSingCapture } from '../../hooks/useSingCapture';
import { useAppData } from '../../state/AppData';
import { uid } from '../../lib/dates';
import type { LongNoteRecord } from '../../storage/schema';
import { Alert, Badge, Button, inputClass } from '../ui';
import { MicPanel } from './MicPanel';
import { PitchCompareChart } from './PitchCompareChart';

const NOTES: SwaraToken[] = ['S', 'R', 'G', 'P', '.P', '.D', 'N'];

/**
 * Long-note (kharaj / sustained Sa) breath test: how long a note can be held
 * comfortably, how steady it stays and how much of it is in tune. Records
 * build into a history so breath control growth is visible.
 */
export function LongNote() {
  const { data, update } = useAppData();
  const tonic = data.profile.tonic;
  const mic = useMicPitch();
  const drone = useDrone();
  const [swara, setSwara] = useState<SwaraToken>('S');
  const [res, setRes] = useState<LongNoteResult | null>(null);
  const target = swaraToMidi(swara, tonic)! - tonicMidi(tonic);
  const cap = useSingCapture(mic, tonic, {
    maxSec: 90,
    minSec: 1,
    silenceSec: 0.6,
    onDone: (p) => {
      const r = analyzeLongNote(p, target);
      setRes(r);
      if (r && r.sec >= 2) update((d) => void d.longNotes.push({ id: uid(), at: new Date().toISOString(), swara, sec: r.sec, steadinessCents: r.steadinessCents, inTunePct: r.inTunePct }));
    },
  });

  useEffect(() => setRes(null), [swara]);

  const elapsed = cap.points.length ? cap.points[cap.points.length - 1].t : 0;
  const mine = data.longNotes;
  const best = mine.length ? Math.max(...mine.map((r) => r.sec)) : 0;
  const isBest = res && res.sec >= best && mine.length > 1;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Long Note (Breath)</h3>
        <p className="text-sm text-muted">Take a calm, low breath and hold one note on “aa” for as long as it stays <strong>comfortable</strong> — steady and in tune. Stop before you run out of air. Long-note riyaz (like kharaj on Sa) builds breath control and a steady voice.</p>
      </div>
      <Alert tone="warning" title="Comfort first">Don’t squeeze out the last bit of air or push from the throat. If you feel dizzy, tight or start coughing, stop and rest. Beginners often hold 10–15 seconds; 20–30 comes with weeks of practice.</Alert>

      <div className="flex flex-wrap items-end gap-3">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Note</span>
          <select className={inputClass} value={swara} onChange={(e) => setSwara(e.target.value)} disabled={cap.state !== 'idle'}>
            {NOTES.map((n) => (
              <option key={n} value={n}>
                {swaraLabel(n)}
              </option>
            ))}
          </select>
        </label>
        <Button variant={drone.on ? 'secondary' : 'primary'} icon={drone.on ? 'pause' : 'wave'} onClick={drone.toggle}>
          {drone.on ? 'Stop tanpura' : 'Play tanpura'}
        </Button>
      </div>
      <MicPanel mic={mic} purpose="time how long you hold the note" />

      <div className="flex flex-wrap items-center gap-4">
        {cap.state === 'idle' ? (
          <Button size="lg" icon="mic" onClick={cap.start} disabled={!!mic.unsupported}>
            {res ? 'Try again' : 'Start'}
          </Button>
        ) : (
          <Button size="lg" variant="ghost" icon="stop" onClick={cap.stop}>
            Done
          </Button>
        )}
        <p className="font-mono text-4xl font-semibold tabular-nums" aria-live="off">
          {elapsed.toFixed(1)}s
        </p>
        {best > 0 && <Badge tone="accent">Best: {best.toFixed(1)}s</Badge>}
      </div>
      <p className="min-h-6 text-sm font-medium" aria-live="polite">
        {cap.state === 'waiting' && `Breathe in, then sing ${swaraLabel(swara)}…`}
        {cap.state === 'singing' && <span className="text-primary">Hold it… the timer stops when you stop.</span>}
      </p>
      {(cap.state !== 'idle' || cap.points.length > 0) && <PitchCompareChart bands={[{ start: 0, dur: Math.max(10, elapsed + 2), semis: target }]} mine={foldTo(cap.points, target)} duration={Math.max(10, elapsed + 2)} tolerance={25} height={160} label={`Your held note against ${swaraLabel(swara)} (±25 cents band).`} />}

      {cap.state === 'idle' && res && (
        <Alert tone={res.inTunePct >= 70 && res.steadinessCents <= 30 ? 'success' : 'info'} title={`${res.sec.toFixed(1)} seconds${isBest ? ' — a new personal best!' : ''}`}>
          In tune (±25 cents) {res.inTunePct}% of the time · steadiness {res.steadinessCents} cents spread (lower = steadier) · average {res.cents > 0 ? '+' : ''}
          {res.cents} cents.{' '}
          {res.steadinessCents > 40 ? 'The note wavered — let the breath out slowly and evenly, like a thin stream. ' : ''}
          {res.cents < -25 ? 'It sagged flat — keep the energy up as the breath runs low. ' : res.cents > 25 ? 'It drifted sharp — relax the throat. ' : ''}
          {res.sec < 2 && 'Too short to save — hold the note a little longer.'}
        </Alert>
      )}
      {cap.state === 'idle' && !res && cap.points.length > 0 && <Alert tone="warning">Not enough clear singing was heard. Sing a little louder, closer to the mic.</Alert>}

      {mine.length > 1 && <History records={mine} />}
    </div>
  );
}

function History({ records }: { records: LongNoteRecord[] }) {
  const list = records.slice(-14);
  const max = Math.max(...list.map((r) => r.sec), 10);
  const weekAgo = Date.now() - 7 * 86400_000;
  const thisWeek = records.filter((r) => Date.parse(r.at) >= weekAgo);
  const before = records.filter((r) => Date.parse(r.at) < weekAgo);
  const bestOf = (xs: LongNoteRecord[]) => (xs.length ? Math.max(...xs.map((r) => r.sec)) : 0);
  return (
    <figure className="rounded-2xl border border-border p-4">
      <p className="text-sm font-semibold">Your long notes</p>
      <div className="mt-3 flex h-32 items-end gap-1.5" aria-hidden>
        {list.map((r) => (
          <div key={r.id} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] tabular-nums text-muted">{Math.round(r.sec)}</span>
            <div className="flex h-24 w-full items-end rounded-md bg-surface-2">
              <div className="w-full rounded-md bg-primary" style={{ height: `${(r.sec / max) * 100}%`, opacity: 0.4 + (r.inTunePct / 100) * 0.6 }} />
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-xs text-muted">
        Seconds held, last {list.length} tries (darker = more in tune).{' '}
        {thisWeek.length > 0 && before.length > 0 ? `This week’s best ${bestOf(thisWeek).toFixed(1)}s vs ${bestOf(before).toFixed(1)}s before.` : ''}
      </figcaption>
      <table className="sr-only">
        <caption>Long note history</caption>
        <tbody>
          {list.map((r) => (
            <tr key={r.id}>
              <th scope="row">{new Date(r.at).toLocaleString()}</th>
              <td>
                {swaraLabel(r.swara)} held {r.sec} seconds, {r.inTunePct}% in tune
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
