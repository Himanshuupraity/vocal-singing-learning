import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useAppData } from '../state/AppData';
import { Alert, Badge, Card, Icon, LinkButton, ProgressRing, Stat } from '../components/ui';
import { completionStats, currentLevel, insights, minutesByDate, nextRecommendedLesson, pitchTrend, streak, totalMinutes } from '../lib/progress';
import { getLevel } from '../curriculum';
import { generateRiyaz } from '../lib/riyaz';
import { formatMinutes, localDate } from '../lib/dates';
import { PracticeBars, TrendLine } from '../components/charts';
import { tonicLabel } from '../music/theory';

function greeting(name: string, lang: string) {
  const h = new Date().getHours();
  const part = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  const n = name ? `, ${name}` : '';
  return lang === 'english' ? `Good ${part}${n}` : `Namaste${n}`;
}

export default function Dashboard() {
  const { data } = useAppData();
  const level = currentLevel(data);
  const lvl = getLevel(level);
  const stats = completionStats(data);
  const next = nextRecommendedLesson(data);
  const st = streak(data);
  const byDate = useMemo(() => minutesByDate(data), [data]);
  const today = localDate();
  const todayMin = byDate[today] ?? 0;
  const plan = useMemo(() => generateRiyaz(data, data.profile.dailyMinutes), [data]);
  const trend = pitchTrend(data);
  const ins = insights(data);
  const songs = Object.values(data.songs);
  const levelDone = lvl.lessons.filter((l) => data.lessons[l.id]?.completedAt).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold">{greeting(data.profile.name, data.profile.language)} 🙏</h1>
        <p className="mt-1 text-muted">
          Level {level}: {lvl.title} · Your Sa is {tonicLabel(data.profile.tonic)}
          {data.profile.tonicSource === 'default' && (
            <>
              {' '}
              (default — <Link to="/learn/lesson/l1-find-your-sa" className="text-primary underline">find your comfortable Sa</Link>)
            </>
          )}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Today&apos;s riyaz</p>
              <h2 className="mt-1 text-xl font-semibold">{todayMin >= data.profile.dailyMinutes ? 'Done for today — wonderful! 🎉' : `${data.profile.dailyMinutes}-minute plan ready`}</h2>
              <p className="mt-1 text-sm text-muted">{plan.objective}</p>
            </div>
            {todayMin > 0 && <Badge tone="success">{Math.round(todayMin)} min practised today</Badge>}
          </div>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {plan.blocks.map((b, i) => (
              <li key={b.id + i} className="flex min-w-0 items-center gap-3 rounded-xl bg-surface-2 px-3 py-2 text-sm">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface text-xs font-semibold">{b.minutes}′</span>
                <span className="truncate">{b.title}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <LinkButton to="/riyaz" icon="play">
              {todayMin > 0 ? 'Practise more' : 'Start today’s riyaz'}
            </LinkButton>
            <LinkButton to="/studio" variant="secondary" icon="mic">
              Open studio
            </LinkButton>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Course progress</p>
          <div className="mt-3 flex items-center gap-4">
            <ProgressRing value={stats.pct} label="Course completion" />
            <div className="text-sm">
              <p>
                <strong>{stats.done}</strong> of {stats.total} lessons
              </p>
              <p className="text-muted">
                Level {level}: {levelDone}/{lvl.lessons.length}
              </p>
            </div>
          </div>
          {next ? (
            <Link to={`/learn/lesson/${next.id}`} className="mt-4 block rounded-xl border border-border p-3 hover:bg-surface-2">
              <p className="text-xs text-muted">Next recommended lesson</p>
              <p className="font-medium">{next.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-primary">
                Continue <Icon name="arrow" className="h-3.5 w-3.5" />
              </p>
            </Link>
          ) : (
            <Link to={`/learn/checkpoint/${level}`} className="mt-4 block rounded-xl border border-border p-3 hover:bg-surface-2">
              <p className="text-xs text-muted">Next step</p>
              <p className="font-medium">Level {level} checkpoint</p>
            </Link>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon="flame" label="Streak" value={`${st.current} day${st.current === 1 ? '' : 's'}`} sub={st.best ? `Best: ${st.best}` : 'Practise today to start one'} />
        <Stat icon="calendar" label="Practice time" value={formatMinutes(totalMinutes(data))} sub={`${data.sessions.length} session${data.sessions.length === 1 ? '' : 's'}`} />
        <Stat icon="check" label="Lessons done" value={stats.done} sub={`${stats.pct}% of course`} />
        <Stat icon="film" label="Songs" value={songs.filter((s) => s.status === 'learning').length} sub={`${songs.filter((s) => s.status === 'comfortable').length} comfortable · ${songs.filter((s) => s.status === 'want').length} wish-list`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">This week</h2>
          <div className="mt-3">
            <PracticeBars byDate={byDate} goal={data.profile.dailyMinutes} />
          </div>
          {st.current === 0 && data.sessions.length > 0 && <p className="mt-2 text-sm text-muted">Missed a few days? That&apos;s okay — any practice today restarts your streak. Consistency matters more than perfection.</p>}
        </Card>
        <Card>
          <h2 className="font-semibold">Pitch-matching trend</h2>
          {trend && trend.length >= 2 ? (
            <TrendLine points={trend.map((t) => ({ x: t.week, y: t.matchedPct }))} label="% of measured attempts matched, per week" />
          ) : (
            <p className="mt-3 text-sm text-muted">
              {trend ? `So far: ${trend[0].matchedPct}% of ${trend[0].attempts} measured attempts matched this week. A trend line appears after two weeks of practice.` : 'No measured pitch attempts yet. Use the Pitch Matcher or Pitch Game — your trend will appear here.'}
            </p>
          )}
          {data.rhythm.length > 0 && <p className="mt-3 text-sm">Latest rhythm tap test: <strong>{data.rhythm[data.rhythm.length - 1].onBeatPct}%</strong> on the beat.</p>}
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold">What your results say</h2>
        {ins.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Insights appear once you&apos;ve done some measured exercises (pitch matching, ear tests, rhythm taps). Nothing here is guessed.</p>
        ) : (
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {ins.map((i, k) => (
              <li key={k} className="flex gap-2 text-sm">
                <Badge tone={i.kind === 'strength' ? 'success' : 'warning'}>{i.kind === 'strength' ? 'Strength' : 'Practise'}</Badge>
                <span>{i.text}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {data.profile.hasMic === false && (
        <Alert tone="info" title="No microphone?">
          You can still follow lessons, use the drone, sargam player, metronome and ear training. Pitch-matching practicals need a microphone — a phone or laptop mic is enough.
        </Alert>
      )}
    </div>
  );
}
