import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppData } from '../state/AppData';
import { useServerStatus } from '../hooks/useServerStatus';
import { weeklyReport, type WeekMetric, type WeeklyReport } from '../lib/weekly';
import { currentLevel } from '../lib/progress';
import { ApiError, streamPost } from '../lib/sse';
import { Alert, Button, Card, Icon, Spinner, cx } from './ui';
import { Markdown } from './ui/Markdown';

const fmtDay = (d: string) => new Date(d + 'T00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

function Metric({ label, m, unit = '' }: { label: string; m: WeekMetric; unit?: string }) {
  const diff = m.thisWeek !== null && m.lastWeek !== null ? m.thisWeek - m.lastWeek : null;
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-xl font-semibold tabular-nums">{m.thisWeek === null ? '—' : `${m.thisWeek}${unit}`}</p>
      <p className={cx('text-xs', diff === null || diff === 0 ? 'text-muted' : diff > 0 ? 'text-success' : 'text-warning')}>
        {m.lastWeek === null ? (m.thisWeek === null ? 'No data yet' : 'No data the week before') : diff === 0 ? `Same as before (${m.lastWeek}${unit})` : `${diff! > 0 ? '▲' : '▼'} ${Math.abs(diff!)}${unit} vs ${m.lastWeek}${unit}`}
      </p>
    </div>
  );
}

/** Plain text of the report, to paste into WhatsApp for a teacher or a friend. */
export function reportText(r: WeeklyReport, name: string) {
  const line = (label: string, m: WeekMetric, unit = '') => (m.thisWeek === null ? null : `${label}: ${m.thisWeek}${unit}${m.lastWeek !== null ? ` (before: ${m.lastWeek}${unit})` : ''}`);
  return [
    `🎵 SurSadhana — ${name ? `${name}’s ` : ''}week ${fmtDay(r.from)}–${fmtDay(r.to)}`,
    line('Practice', r.minutes, ' min'),
    line('Days practised', r.daysPractised, '/7'),
    line('Pitch matched', r.pitchMatched, '%'),
    line('Longest note', r.longNote, 's'),
    line('Sargam dictation', r.dictation, '%'),
    line('Rhythm on beat', r.rhythm, '%'),
    r.alankars.length ? `Alankars: ${r.alankars.map((a) => `${a.name} ${a.bpm} bpm`).join(', ')}` : null,
    r.lessonsCompleted.length ? `Lessons: ${r.lessonsCompleted.join(', ')}` : null,
    `Next week: ${r.focus}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function WeeklyReportCard() {
  const { data, update } = useAppData();
  const status = useServerStatus();
  const r = useMemo(() => weeklyReport(data), [data]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const { hash } = useLocation();
  const saved = [...data.weeklyNotes].reverse().find((n) => n.to === r.to);

  useEffect(() => {
    if (hash === '#week') document.getElementById('week')?.scrollIntoView({ block: 'start' });
  }, [hash]);
  useEffect(() => () => abort.current?.abort(), []);

  const ask = async () => {
    setErr(null);
    setText('');
    setBusy(true);
    abort.current = new AbortController();
    let full = '';
    try {
      const { wins, focus, ...numbers } = r;
      await streamPost('/api/tutor/weekly', { report: { ...numbers, appWins: wins, appFocus: focus }, level: currentLevel(data), language: data.profile.language }, (t) => setText((full += t)), abort.current.signal);
      if (full.trim()) update((d) => void d.weeklyNotes.push({ from: r.from, to: r.to, text: full.trim(), at: new Date().toISOString() }));
      setText('');
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setErr((e as ApiError).message);
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reportText(r, data.profile.name));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="week" className="scroll-mt-24 text-lg font-semibold">
            Weekly report
          </h2>
          <p className="text-sm text-muted">
            {fmtDay(r.from)} – {fmtDay(r.to)}, compared with the 7 days before. Only measured results — nothing estimated.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={copy}>
          {copied ? 'Copied' : 'Copy for WhatsApp'}
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
        <Metric label="Practice" m={r.minutes} unit=" min" />
        <Metric label="Days practised" m={r.daysPractised} unit="/7" />
        <Metric label="Pitch matched" m={r.pitchMatched} unit="%" />
        <Metric label="Longest note" m={r.longNote} unit="s" />
        <Metric label="Sargam dictation" m={r.dictation} unit="%" />
        <Metric label="Rhythm on beat" m={r.rhythm} unit="%" />
      </div>
      {r.wins.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">What went well</p>
          <ul className="mt-1 space-y-1 text-sm">
            {r.wins.map((w) => (
              <li key={w} className="flex gap-2">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Alert className="mt-4" tone={r.strainSessions >= 2 ? 'warning' : 'info'} title="Focus for next week">
        {r.focus}
      </Alert>

      <div className="mt-4 space-y-2">
        {(text || (saved && !busy)) && (
          <div className="rounded-xl bg-surface-2 p-4">
            <Markdown text={text || saved!.text} />
            {!text && saved && <p className="mt-2 text-xs text-muted">Written by the AI coach on {new Date(saved.at).toLocaleString()} from the numbers above.</p>}
          </div>
        )}
        {busy && !text && <Spinner label="Writing your weekly note…" />}
        {err && <Alert tone="warning">{err}</Alert>}
        {status?.reachable && status.tutor.configured ? (
          busy ? (
            <Button size="sm" variant="ghost" onClick={() => abort.current?.abort()}>
              Stop
            </Button>
          ) : (
            <Button size="sm" icon="sparkle" onClick={ask} disabled={!r.minutes.thisWeek && !r.minutes.lastWeek}>
              {saved ? 'Write a new note' : 'Get a weekly note from the AI coach'}
            </Button>
          )
        ) : status?.reachable ? (
          <p className="text-xs text-muted">An AI-written weekly note needs the AI tutor to be set up on the server.</p>
        ) : null}
        {!r.minutes.thisWeek && !r.minutes.lastWeek && <p className="text-xs text-muted">Practise a little first — the note is written from your real results.</p>}
      </div>
    </Card>
  );
}

/** One-line summary for the dashboard. */
export function WeekAtAGlance() {
  const { data } = useAppData();
  const r = useMemo(() => weeklyReport(data), [data]);
  if (!r.minutes.thisWeek && !r.minutes.lastWeek) return null;
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">This week</p>
          <p className="font-semibold">
            {r.minutes.thisWeek ?? 0} min on {r.daysPractised.thisWeek ?? 0} day{r.daysPractised.thisWeek === 1 ? '' : 's'}
            {r.pitchMatched.thisWeek !== null && ` · ${r.pitchMatched.thisWeek}% in tune`}
            {r.longNote.thisWeek !== null && ` · longest note ${r.longNote.thisWeek}s`}
          </p>
          <p className="text-sm text-muted">Next: {r.focus}</p>
        </div>
        <Link to="/progress#week" className="text-sm font-medium text-primary underline">
          Weekly report
        </Link>
      </div>
    </Card>
  );
}
