import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RAGAS, type Raga, type RagaId } from '../../data/ragas';
import { playSequence, type SequenceHandle } from '../../audio/sequencer';
import { freqToMidiFloat, swaraLabel, SWARA_LETTERS, SWARA_SEMITONES, type SwaraToken } from '../../music/theory';
import { ragaNoteStatus, singable, type RagaNoteStatus } from '../../music/raga';
import { useMicPitch } from '../../hooks/useMicPitch';
import { useDrone } from '../../hooks/useDrone';
import { useAppData } from '../../state/AppData';
import { Alert, Badge, Button, cx, inputClass } from '../ui';
import { MicPanel } from './MicPanel';
import { SequenceMatcher } from './SequenceMatcher';

/** A note must be held this long before the free-singing check counts it (shorter = a passing slide). */
const HOLD_SEC = 0.3;

const STATUS_STYLE: Record<RagaNoteStatus, string> = {
  in: 'bg-success-soft text-success',
  touch: 'bg-warning-soft text-warning',
  out: 'bg-danger-soft text-danger',
};

export function RaagPractice({ initialMode = 'phrases' }: { initialMode?: 'phrases' | 'free' }) {
  const [ragaId, setRagaId] = useState<RagaId>('yaman');
  const raga = RAGAS.find((r) => r.id === ragaId)!;
  const [mode, setMode] = useState<'phrases' | 'free'>(initialMode);
  const drone = useDrone(raga.firstString);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Raag Practice</h3>
        <p className="text-sm text-muted">Hear a raag’s aroha, avaroha and pakad over the tanpura, sing them back with a pitch check, or sing freely and let the app catch notes the raag doesn’t use (varjit swar). An introduction — a raag is learned over years of listening and training with a guru.</p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a raag">
        {RAGAS.map((r) => (
          <button key={r.id} type="button" aria-pressed={r.id === ragaId} onClick={() => setRagaId(r.id)} className={cx('rounded-xl px-4 py-2 text-sm font-medium', r.id === ragaId ? 'bg-primary text-on-primary' : 'bg-surface-2 hover:bg-border')}>
            {r.name}
          </button>
        ))}
      </div>

      <RagaCard raga={raga} />

      <div className="flex flex-wrap items-center gap-3">
        <Button variant={drone.on ? 'secondary' : 'primary'} icon={drone.on ? 'pause' : 'wave'} onClick={drone.toggle}>
          {drone.on ? 'Stop tanpura' : 'Play tanpura'}
        </Button>
        <span className="text-xs text-muted">Use headphones with the tanpura, so the mic hears only you.</span>
      </div>

      <div className="flex gap-2" role="group" aria-label="Practice mode">
        {(
          [
            ['phrases', 'Sing the phrases'],
            ['free', 'Free singing check'],
          ] as const
        ).map(([m, label]) => (
          <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={cx('rounded-lg px-3 py-1.5 text-sm', mode === m ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
            {label}
          </button>
        ))}
      </div>
      {mode === 'phrases' ? <PhrasePractice key={raga.id} raga={raga} /> : <FreeSinging key={raga.id} raga={raga} />}
    </div>
  );
}

function RagaCard({ raga }: { raga: Raga }) {
  return (
    <div className="grid gap-4 rounded-2xl border border-border p-4 sm:grid-cols-2">
      <div className="space-y-2 text-sm">
        <p>
          <span className="text-muted">Thaat:</span> {raga.thaat}
        </p>
        <div>
          <p className="text-muted">Notes</p>
          <ul className="mt-1 flex flex-wrap gap-1.5" aria-label={`Notes of raag ${raga.name}`}>
            {SWARA_LETTERS.map((l) => {
              const used = raga.notes.includes(l);
              const touch = raga.touches?.includes(l);
              if (!used && !touch) return null;
              return (
                <li key={l} className={cx('rounded-lg px-2 py-1 font-mono text-xs', l === raga.vadi || l === raga.samvadi ? 'bg-primary text-on-primary' : touch ? 'bg-warning-soft text-warning' : 'bg-surface-2')}>
                  {swaraLabel(l)}
                  {l === raga.vadi ? ' · vadi' : l === raga.samvadi ? ' · samvadi' : touch ? ' · touch' : ''}
                </li>
              );
            })}
          </ul>
          <p className="mt-1 text-xs text-muted">Not used (varjit): {SWARA_LETTERS.filter((l) => !raga.notes.includes(l) && !raga.touches?.includes(l)).map(swaraLabel).join(', ') || 'none'}</p>
        </div>
        <p>
          <span className="text-muted">Time:</span> {raga.time}
        </p>
        <p>
          <span className="text-muted">Mood:</span> {raga.mood}
        </p>
      </div>
      <div className="space-y-2 text-sm">
        <p>
          <span className="text-muted">Aroha:</span> <span className="font-mono">{raga.aroha.filter((t) => t !== '-').map(swaraLabel).join(' ')}</span>
        </p>
        <p>
          <span className="text-muted">Avaroha:</span> <span className="font-mono">{raga.avaroha.filter((t) => t !== '-').map(swaraLabel).join(' ')}</span>
        </p>
        <ul className="list-disc space-y-1 pl-5 text-muted">
          {raga.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <Link to={`/learn/lesson/${raga.lessonId}`} className="inline-block font-medium text-primary underline">
          Read the full Raag {raga.name} lesson
        </Link>
      </div>
    </div>
  );
}

function PhrasePractice({ raga }: { raga: Raga }) {
  const { data } = useAppData();
  const options: { id: string; label: string; notes: SwaraToken[] }[] = [
    { id: 'aroha', label: 'Aroha (ascent)', notes: raga.aroha },
    { id: 'avaroha', label: 'Avaroha (descent)', notes: raga.avaroha },
    ...raga.phrases.map((p, i) => ({ id: `p${i}`, label: `Phrase: ${p.label}`, notes: p.notes })),
  ];
  const [sel, setSel] = useState('aroha');
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const handle = useRef<SequenceHandle | null>(null);
  const opt = options.find((o) => o.id === sel) ?? options[0];

  useEffect(() => () => handle.current?.stop(), []);

  const play = async () => {
    if (playing) {
      handle.current?.stop();
      setPlaying(false);
      return;
    }
    handle.current = await playSequence(opt.notes, data.profile.tonic, 60, { onNote: setActive, timbre: data.settings.demoTimbre });
    setPlaying(true);
    void handle.current.done.then(() => setPlaying(false));
  };

  return (
    <div className="space-y-4">
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium">What to practise</span>
        <select
          className={inputClass}
          value={sel}
          onChange={(e) => {
            handle.current?.stop();
            setSel(e.target.value);
          }}
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <ol className="flex flex-wrap gap-1.5" aria-label="Notes">
        {opt.notes.map((t, i) => (
          <li key={i} className={cx('min-w-10 rounded-lg px-2 py-2 text-center font-mono text-sm', t === '-' ? 'text-muted' : i === active ? 'scale-110 bg-primary text-on-primary' : 'bg-surface-2')}>
            {t === '-' ? '·' : swaraLabel(t)}
          </li>
        ))}
      </ol>
      <Button variant="secondary" icon={playing ? 'stop' : 'play'} onClick={play}>
        {playing ? 'Stop' : 'Listen slowly'}
      </Button>
      <div className="rounded-2xl bg-surface-2/50 p-3">
        <p className="mb-2 text-sm font-medium">Now sing it — each note is checked</p>
        <SequenceMatcher key={sel} generate={() => singable(opt.notes)} context={`raag:${raga.id}`} label={`Raag ${raga.name} · ${opt.label}`} />
      </div>
    </div>
  );
}

interface Held {
  token: SwaraToken;
  status: RagaNoteStatus;
  sec: number;
}

/** Sing anything in the raag; every held note is labelled as in the raag, a light touch, or varjit. */
function FreeSinging({ raga }: { raga: Raga }) {
  const { data } = useAppData();
  const tonic = data.profile.tonic;
  const mic = useMicPitch();
  const [now, setNow] = useState<{ token: SwaraToken; status: RagaNoteStatus } | null>(null);
  const [held, setHeld] = useState<Record<string, Held>>({});
  const [slips, setSlips] = useState<SwaraToken[]>([]);
  const run = useRef<{ midi: number; start: number; last: number; counted: boolean } | null>(null);

  useEffect(
    () =>
      mic.subscribe((f) => {
        if (f.status !== 'voiced' || !f.freq) {
          if (run.current && f.t - run.current.last > 0.15) {
            run.current = null;
            setNow(null);
          }
          return;
        }
        const m = freqToMidiFloat(f.freq);
        const r = run.current;
        if (r && Math.abs(m - r.midi) < 0.7) r.last = f.t;
        else run.current = { midi: Math.round(m), start: f.t, last: f.t, counted: false };
        const cur = run.current!;
        if (cur.last - cur.start < HOLD_SEC) return;
        const n = ragaNoteStatus(raga, cur.midi, tonic);
        setNow(n);
        setHeld((h) => ({ ...h, [n.token]: { ...n, sec: (h[n.token]?.sec ?? 0) + (cur.counted ? 0.05 : cur.last - cur.start) } }));
        if (!cur.counted && n.status === 'out') setSlips((s) => [...s.slice(-7), n.token]);
        cur.counted = true;
      }),
    [mic, raga, tonic],
  );

  const reset = () => {
    setHeld({});
    setSlips([]);
    setNow(null);
  };

  const order = (t: string) => {
    const dots = (t.match(/\./g) ?? []).length;
    const ticks = (t.match(/'/g) ?? []).length;
    return (ticks - dots) * 12 + SWARA_SEMITONES[t.replace(/[.']/g, '') as keyof typeof SWARA_SEMITONES];
  };
  const list = Object.values(held).sort((a, b) => order(a.token) - order(b.token));
  const total = list.reduce((s, h) => s + h.sec, 0);
  const outSec = list.filter((h) => h.status === 'out').reduce((s, h) => s + h.sec, 0);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Sing slow phrases in Raag {raga.name} — alap on “aa”, or sargam. Each note you hold for a moment is coloured: green = in the raag, amber = a light touch only, red = not used in this raag.</p>
      <MicPanel mic={mic} purpose={`check that you stay within the notes of Raag ${raga.name}`} />
      {mic.state === 'on' && (
        <>
          <div className={cx('grid min-h-28 place-items-center rounded-2xl text-center', now ? STATUS_STYLE[now.status] : 'bg-surface-2 text-muted')} aria-live="polite">
            {now ? (
              <div>
                <p className="font-mono text-4xl font-semibold">{swaraLabel(now.token)}</p>
                <p className="text-sm">{now.status === 'in' ? `In Raag ${raga.name}` : now.status === 'touch' ? 'Only a light touch in this raag' : `Not used in Raag ${raga.name}`}</p>
              </div>
            ) : (
              <p className="text-sm">Hold a note…</p>
            )}
          </div>
          {list.length > 0 && (
            <div className="space-y-2">
              <ul className="flex flex-wrap gap-1.5" aria-label="Notes you held">
                {list.map((h) => (
                  <li key={h.token} className={cx('rounded-lg px-2 py-1 font-mono text-xs', STATUS_STYLE[h.status])}>
                    {swaraLabel(h.token)} · {h.sec.toFixed(1)}s
                  </li>
                ))}
              </ul>
              {slips.length ? (
                <Alert tone="warning" title={`${slips.length} varjit ${slips.length === 1 ? 'slip' : 'slips'} (${Math.round((outSec / Math.max(total, 0.1)) * 100)}% of the time)`}>
                  Recent: {slips.map(swaraLabel).join(', ')}. Play the aroha again and sing along slowly to settle the raag’s notes in your ear.
                </Alert>
              ) : (
                <p className="text-sm text-success">No varjit notes so far.</p>
              )}
              <Button size="sm" variant="ghost" icon="repeat" onClick={reset}>
                Start over
              </Button>
            </div>
          )}
          <p className="text-xs text-muted">
            <Badge tone="info">Note</Badge> This checks which notes you use, not the raag’s phrasing (chalan) or ornaments — a raag can use only its own notes and still not sound like itself.
          </p>
        </>
      )}
    </div>
  );
}
