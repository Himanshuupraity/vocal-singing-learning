import { useMemo, useState } from 'react';
import { useAppData } from '../state/AppData';
import { LEVELS } from '../curriculum';
import { completionStats, currentLevel, insights, minutesByDate, pitchTrend, streak, swaraAccuracy, totalMinutes } from '../lib/progress';
import { formatMinutes, localDate, uid, weekStart } from '../lib/dates';
import { Alert, Badge, Button, Card, LinkButton, PageHeader, ProgressBar, Stat, cx, inputClass } from '../components/ui';
import { PracticeCalendar, PracticeBars, TrendLine } from '../components/charts';
import { midiToNoteName, swaraLabel } from '../music/theory';
import { Link } from 'react-router-dom';

const QUESTIONS: { id: string; text: string }[] = [
  { id: 'match-sa', text: 'I can identify and match Sa more consistently.' },
  { id: 'sargam-slow', text: 'I can sing the current sargam pattern slowly.' },
  { id: 'hold-note', text: 'I can hold a comfortable note steadily.' },
  { id: 'beat', text: 'I can follow a simple beat.' },
  { id: 'comfort', text: 'I practise without discomfort.' },
];
const SCALE = ['Not yet', 'Sometimes', 'Mostly', 'Yes, reliably'];

function SelfAssessment() {
  const { data, update } = useAppData();
  const week = weekStart(localDate());
  const existing = data.selfAssessments.find((s) => s.weekOf === week);
  const [answers, setAnswers] = useState<Record<string, number>>(existing?.answers ?? {});
  const [difficult, setDifficult] = useState(existing?.difficult ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [saved, setSaved] = useState(false);
  const acc = swaraAccuracy(data);
  const saAcc = acc.find((a) => a.target === 'S');
  const rh = data.rhythm.at(-1);
  const strain = data.sessions.slice(-7).filter((s) => s.comfort && s.comfort !== 'comfortable').length;

  const measured: Record<string, string | null> = {
    'match-sa': saAcc && saAcc.attempts >= 3 ? `Measured: ${saAcc.matchedPct}% of ${saAcc.attempts} recent Sa attempts matched.` : null,
    'hold-note': (() => {
      const r = data.pitchAttempts.filter((a) => a.reliable).slice(-30);
      if (r.length < 3) return null;
      const avg = Math.round(r.reduce((s, a) => s + a.stabilityCents, 0) / r.length);
      return `Measured: your held notes typically wobble across about ${avg} cents (lower = steadier; under ~30 is quite steady).`;
    })(),
    beat: rh ? `Measured: last tap test ${rh.onBeatPct}% on the beat.` : null,
    comfort: data.sessions.some((s) => s.comfort) ? `You reported strain in ${strain} of your last 7 sessions.` : null,
  };

  const save = () => {
    update((d) => {
      const rec = { id: existing?.id ?? uid(), at: new Date().toISOString(), weekOf: week, answers, difficult: difficult.trim().slice(0, 300), notes: notes.trim().slice(0, 1000) };
      d.selfAssessments = [...d.selfAssessments.filter((s) => s.weekOf !== week), rec];
    });
    setSaved(true);
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Weekly self-assessment</h2>
        <Badge>Week of {week}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted">Your own view, shown next to measured results where they exist. It helps the tutor and planner — it never unlocks levels by itself.</p>
      <div className="mt-4 space-y-4">
        {QUESTIONS.map((q) => (
          <fieldset key={q.id}>
            <legend className="text-sm font-medium">{q.text}</legend>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {SCALE.map((l, i) => (
                <button key={l} type="button" aria-pressed={answers[q.id] === i} onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))} className={cx('rounded-lg px-3 py-1.5 text-sm', answers[q.id] === i ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
                  {l}
                </button>
              ))}
            </div>
            {measured[q.id] && <p className="mt-1 text-xs text-info">{measured[q.id]}</p>}
          </fieldset>
        ))}
        <label className="block text-sm font-medium">
          Which exercise feels difficult?
          <input className={`${inputClass} mt-1`} value={difficult} onChange={(e) => setDifficult(e.target.value)} maxLength={300} />
        </label>
        <label className="block text-sm font-medium">
          Notes
          <textarea className={`${inputClass} mt-1`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} />
        </label>
        {answers.comfort === 0 && (
          <Alert tone="warning" title="Practising with discomfort">
            Please reduce volume and session length, warm up gently, and rest. If discomfort or hoarseness lasts more than about two weeks, see a doctor (ENT).
          </Alert>
        )}
        <Button onClick={save} disabled={Object.keys(answers).length < QUESTIONS.length}>
          {existing ? 'Update this week’s check-in' : 'Save check-in'}
        </Button>
        {saved && <p className="text-sm text-success" role="status">Saved ✓</p>}
      </div>
    </Card>
  );
}

export default function Progress() {
  const { data } = useAppData();
  const byDate = useMemo(() => minutesByDate(data), [data]);
  const stats = completionStats(data);
  const st = streak(data);
  const trend = pitchTrend(data, 12);
  const acc = swaraAccuracy(data).sort((a, b) => a.target.localeCompare(b.target));
  const ins = insights(data);
  const lvl = currentLevel(data);
  const achievements = [
    { label: 'First riyaz', got: data.sessions.length > 0 },
    { label: 'Found my Sa', got: data.profile.tonicSource !== 'default' },
    { label: '3-day streak', got: st.best >= 3 },
    { label: '7-day streak', got: st.best >= 7 },
    { label: 'First lesson completed', got: stats.done > 0 },
    { label: '10 matched notes', got: data.pitchAttempts.filter((a) => a.matched).length >= 10 },
    { label: '5 hours of practice', got: totalMinutes(data) >= 300 },
    { label: 'Level 1 complete', got: !!data.checkpoints[1]?.passedAt },
    { label: 'First song added', got: Object.keys(data.songs).length > 0 },
  ];

  return (
    <>
      <PageHeader title="Progress & Reports" subtitle="Everything here comes from your saved practice. Where there's no data yet, we say so instead of guessing." actions={<LinkButton to="/baseline" variant="secondary" size="sm">{data.baseline ? 'Retake starting measurement' : 'Take starting measurement'}</LinkButton>} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Current level" value={lvl} sub={LEVELS[lvl - 1].title} icon="path" />
        <Stat label="Course" value={`${stats.pct}%`} sub={`${stats.done}/${stats.total} lessons`} icon="book" />
        <Stat label="Streak" value={st.current} sub={`Best ${st.best} days`} icon="flame" />
        <Stat label="Total practice" value={formatMinutes(totalMinutes(data))} sub={`${data.sessions.length} sessions`} icon="calendar" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Practice calendar</h2>
          <div className="mt-3 max-w-sm">
            <PracticeCalendar byDate={byDate} />
          </div>
          <div className="mt-5">
            <PracticeBars byDate={byDate} goal={data.profile.dailyMinutes} days={14} />
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Level progress</h2>
          <ul className="mt-3 space-y-3">
            {LEVELS.map((l) => {
              const d = l.lessons.filter((x) => data.lessons[x.id]?.completedAt).length;
              return (
                <li key={l.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>
                      Level {l.id}: {l.title}
                    </span>
                    <span className="text-muted">
                      {d}/{l.lessons.length} {data.checkpoints[l.id]?.passedAt && '· checkpoint ✓'}
                    </span>
                  </div>
                  <ProgressBar value={(d / l.lessons.length) * 100} label={`Level ${l.id}`} />
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Pitch matching</h2>
          <p className="text-xs text-muted">Matched = median within the exercise tolerance and ≥60% of the held note in range. Only reliable (clearly voiced) attempts count. This measures note-matching only — not tone, rhythm or expression.</p>
          {trend && trend.length >= 2 && <TrendLine points={trend.map((t) => ({ x: t.week, y: t.matchedPct }))} label="% matched per week" />}
          {acc.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No measured attempts yet. <Link className="text-primary underline" to="/studio/pitch">Try the Pitch Matcher</Link>.</p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted">
                  <th className="py-1 font-medium">Swara</th>
                  <th className="font-medium">Attempts</th>
                  <th className="font-medium">Matched</th>
                  <th className="font-medium">Avg offset</th>
                </tr>
              </thead>
              <tbody>
                {acc.map((a) => (
                  <tr key={a.target} className="border-t border-border">
                    <td className="py-1.5 font-mono">{swaraLabel(a.target)}</td>
                    <td>{a.attempts}</td>
                    <td className={cx(a.matchedPct >= 70 ? 'text-success' : a.matchedPct < 50 ? 'text-danger' : '')}>{a.matchedPct}%</td>
                    <td>
                      {a.avgCents > 0 ? '+' : ''}
                      {a.avgCents}¢ {Math.abs(a.avgCents) > 15 ? (a.avgCents < 0 ? '(flat)' : '(sharp)') : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
        <Card>
          <h2 className="font-semibold">Listening &amp; rhythm</h2>
          {data.earTests.length === 0 && data.rhythm.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No listening or rhythm results yet. Try Ear Training and the tap-along test in the Studio.</p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-sm">
              {data.earTests.slice(-5).reverse().map((t) => (
                <li key={t.id}>
                  {new Date(t.at).toLocaleDateString()} · {t.kind === 'same-different' ? 'Same/different' : 'Higher/lower'}: <strong>{Math.round((t.correct / t.questions) * 100)}%</strong> ({t.correct}/{t.questions})
                </li>
              ))}
              {data.rhythm.slice(-5).reverse().map((r) => (
                <li key={r.id}>
                  {new Date(r.at).toLocaleDateString()} · {r.mode === 'sing' ? `Sing-in-rhythm at ${r.bpm} bpm: ` : `Tap test at ${r.bpm} bpm: `}<strong>{r.onBeatPct}%</strong> {r.mode === 'sing' ? 'steady' : `on beat (avg ${r.meanAbsOffsetMs} ms off)`}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 rounded-xl bg-surface-2 p-3 text-sm">
            <p className="font-medium">Comfortable range</p>
            {data.ranges.length === 0 ? (
              <p className="text-muted">
                Not measured yet — <Link className="text-primary underline" to="/studio/range">use the Range Finder</Link>.
              </p>
            ) : (
              <ul className="text-muted">
                {data.ranges.slice(-4).reverse().map((r) => (
                  <li key={r.id}>
                    {new Date(r.at).toLocaleDateString()}: {midiToNoteName(r.lowMidi).label}–{midiToNoteName(r.highMidi).label} ({r.highMidi - r.lowMidi} semitones)
                  </li>
                ))}
              </ul>
            )}
          </div>
          {data.baseline && (
            <div className="mt-4 rounded-xl bg-surface-2 p-3 text-sm">
              <p className="font-medium">Starting measurement ({new Date(data.baseline.at).toLocaleDateString()})</p>
              <p className="text-muted">
                Pitch matched: {data.baseline.pitchMatchedPct ?? '—'}% · Listening: {data.baseline.earScorePct ?? '—'}% · Rhythm on beat: {data.baseline.rhythmOnBeatPct ?? '—'}%
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Strengths &amp; areas to practise</h2>
          {ins.length === 0 ? (
            <p className="mt-2 text-sm text-muted">These appear after a few measured exercises.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm">
              {ins.map((i, k) => (
                <li key={k} className="flex gap-2">
                  <Badge tone={i.kind === 'strength' ? 'success' : 'warning'}>{i.kind === 'strength' ? 'Strength' : 'Practise'}</Badge>
                  {i.text}
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="font-semibold">Achievements</h2>
          <p className="text-xs text-muted">Encouragement only — nothing is taken away if you miss a day.</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {achievements.map((a) => (
              <li key={a.label}>
                <Badge tone={a.got ? 'accent' : 'neutral'}>
                  {a.got ? '★' : '☆'} {a.label}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4">
        <SelfAssessment />
      </div>

      {data.selfAssessments.length > 1 && (
        <Card className="mt-4">
          <h2 className="font-semibold">Past check-ins</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {data.selfAssessments.slice(-8).reverse().map((s) => (
              <li key={s.id}>
                Week of {s.weekOf}: {QUESTIONS.map((q) => `${q.id.replace('-', ' ')} ${SCALE[s.answers[q.id]] ?? '—'}`).join(' · ')}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
