import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../state/AppData';
import { generateRiyaz, type RiyazBlock } from '../lib/riyaz';
import { SESSION_LENGTHS, type PracticeSession, type SessionLength } from '../storage/schema';
import { localDate, uid } from '../lib/dates';
import { Alert, Badge, Button, Card, LinkButton, PageHeader, ProgressBar, cx, inputClass } from '../components/ui';
import { studioPath } from './Studio';
import { PitchMatcher } from '../components/studio/PitchMatcher';
import { SargamPlayer } from '../components/studio/SargamPlayer';
import { MetronomeTool } from '../components/studio/MetronomeTool';
import { EarTraining } from '../components/studio/EarTraining';
import { DroneTool } from '../components/studio/DroneTool';
import { AlankarTrainer } from '../components/studio/AlankarTrainer';
import { LongNote } from '../components/studio/LongNote';
import { MeendPractice } from '../components/studio/MeendPractice';
import { RaagPractice } from '../components/studio/RaagPractice';
import { minutesByDate, streak } from '../lib/progress';

type BlockState = 'pending' | 'done' | 'skipped';

function fmt(sec: number) {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function BlockTool({ block }: { block: RiyazBlock }) {
  const ex = block.exercise;
  if (!ex) return null;
  switch (ex.tool) {
    case 'pitch-match':
      return <PitchMatcher targets={ex.targets ?? ['S']} context="riyaz" title="Pitch Matcher" />;
    case 'sargam':
      return <SargamPlayer initialPattern={ex.pattern?.filter((t) => t !== '-')} initialBpm={ex.bpm} />;
    case 'taal':
    case 'metronome':
      return <MetronomeTool initialTaal={ex.id === 'rh-dadra' ? 'dadra' : ex.id === 'rh-teentaal' ? 'teentaal' : ex.id.startsWith('rh-') && ex.id !== 'rh-tap' ? 'keharwa' : null} initialBpm={ex.bpm ?? 70} context="riyaz" />;
    case 'ear-training':
      return <EarTraining context="riyaz" initialKind={ex.id === 'li-higher-lower' ? 'higher-lower' : ex.id === 'li-dictation' ? 'dictation' : 'same-different'} />;
    case 'alankar-trainer':
      return <AlankarTrainer />;
    case 'long-note':
      return <LongNote />;
    case 'meend':
      return <MeendPractice initialMode={ex.id === 'tq-gamak' ? 'gamak' : 'meend'} />;
    case 'raag':
      return <RaagPractice initialMode="free" />;
    case 'drone':
      return <DroneTool />;
    case 'recorder':
      return <LinkButton to="/studio/record" variant="secondary" icon="record">Open Recording Journal</LinkButton>;
    default:
      return null;
  }
}

export default function Riyaz() {
  const { data, update } = useAppData();
  const [minutes, setMinutes] = useState<SessionLength>(data.profile.dailyMinutes);
  const plan = useMemo(() => generateRiyaz(data, minutes), [data.profile, data.lessons, data.checkpoints, minutes]); // eslint-disable-line react-hooks/exhaustive-deps
  const [running, setRunning] = useState(false);
  const [idx, setIdx] = useState(0);
  const [states, setStates] = useState<BlockState[]>([]);
  const [remaining, setRemaining] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reps, setReps] = useState(1);
  const [summary, setSummary] = useState<PracticeSession | null>(null);
  const [reflection, setReflection] = useState('');
  const [comfort, setComfort] = useState<PracticeSession['comfort']>();
  const elapsed = useRef(0);
  const startedAt = useRef('');

  const block = plan.blocks[idx];

  useEffect(() => {
    if (!running || paused) return;
    const iv = window.setInterval(() => {
      elapsed.current += 1;
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(iv);
  }, [running, paused]);

  const start = () => {
    setStates(plan.blocks.map(() => 'pending'));
    setIdx(0);
    setRemaining(plan.blocks[0].minutes * 60);
    setReps(1);
    elapsed.current = 0;
    startedAt.current = new Date().toISOString();
    setSummary(null);
    setReflection('');
    setComfort(undefined);
    setRunning(true);
    setPaused(false);
  };

  const go = (next: number, mark: BlockState) => {
    setStates((s) => s.map((x, i) => (i === idx ? mark : x)));
    if (next >= plan.blocks.length) return finish(mark);
    setIdx(next);
    setReps(1);
    setRemaining(plan.blocks[next].minutes * 60);
  };

  const finish = (lastMark?: BlockState) => {
    const final = states.map((x, i) => (i === idx && lastMark ? lastMark : x));
    const s: PracticeSession = {
      id: uid(),
      date: localDate(),
      startedAt: startedAt.current,
      minutes: Math.round((elapsed.current / 60) * 10) / 10,
      planned: minutes,
      kind: 'riyaz',
      exercisesCompleted: plan.blocks.filter((_, i) => final[i] === 'done').map((b) => b.title),
      exercisesSkipped: plan.blocks.filter((_, i) => final[i] === 'skipped').map((b) => b.title),
    };
    setStates(final);
    setSummary(s);
    setRunning(false);
  };

  const saveSummary = () => {
    if (!summary) return;
    const s = { ...summary, reflection: reflection.trim().slice(0, 1000) || undefined, comfort };
    if (s.minutes >= 0.5) update((d) => void d.sessions.push(s));
    setSummary({ ...s, id: s.minutes >= 0.5 ? 'saved' : 'too-short' });
  };

  const st = streak(data);
  const todayMin = minutesByDate(data)[localDate()] ?? 0;

  if (summary) {
    const saved = summary.id === 'saved' || summary.id === 'too-short';
    return (
      <div className="space-y-6">
        <PageHeader title="Session summary" />
        <Card>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted">Time practised</p>
              <p className="text-2xl font-semibold">{summary.minutes} min</p>
            </div>
            <div>
              <p className="text-xs text-muted">Completed</p>
              <p className="text-2xl font-semibold">{summary.exercisesCompleted.length}/{plan.blocks.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Skipped</p>
              <p className="text-2xl font-semibold">{summary.exercisesSkipped.length}</p>
            </div>
          </div>
          {summary.exercisesCompleted.length > 0 && <p className="mt-3 text-sm">✓ {summary.exercisesCompleted.join(' · ')}</p>}
        </Card>
        {!saved ? (
          <Card>
            <h2 className="font-semibold">Reflection</h2>
            <fieldset className="mt-3">
              <legend className="text-sm font-medium">How does your throat feel?</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {([
                  ['comfortable', 'Comfortable'],
                  ['some-strain', 'A little tired / strained'],
                  ['discomfort', 'Discomfort or pain'],
                ] as const).map(([v, l]) => (
                  <button key={v} type="button" aria-pressed={comfort === v} onClick={() => setComfort(v)} className={cx('rounded-xl px-3 py-2 text-sm', comfort === v ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
                    {l}
                  </button>
                ))}
              </div>
            </fieldset>
            {comfort === 'discomfort' && (
              <Alert className="mt-3" tone="danger" title="Please rest your voice">
                Stop singing for today. Sip water, avoid shouting, whispering and throat-clearing. If pain or hoarseness lasts more than about two weeks, or you lose your voice suddenly, see a doctor (ENT). Next time, sing more softly and for shorter periods.
              </Alert>
            )}
            <label className="mt-4 block text-sm font-medium" htmlFor="refl">
              What felt better today? What will you focus on next?
            </label>
            <textarea id="refl" className={`${inputClass} mt-1`} rows={3} value={reflection} onChange={(e) => setReflection(e.target.value)} maxLength={1000} />
            <Button className="mt-3" onClick={saveSummary}>
              Save session
            </Button>
            {summary.minutes < 0.5 && <p className="mt-2 text-xs text-muted">Sessions shorter than 30 seconds aren&apos;t saved.</p>}
          </Card>
        ) : summary.id === 'too-short' ? (
          <Alert tone="info" title="Session too short to record">
            Sessions under 30 seconds aren&apos;t added to your practice history. Start again whenever you&apos;re ready.
          </Alert>
        ) : (
          <Alert tone="success" title="Session saved">
            Well done. Today: {Math.round(todayMin)} min. Recommended next: {plan.blocks.find((b) => b.lesson)?.title ?? 'continue your current lesson'} — or ask the tutor for tomorrow&apos;s plan.
          </Alert>
        )}
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setSummary(null)}>
            Back to planner
          </Button>
          <LinkButton to="/" variant="ghost">
            Dashboard
          </LinkButton>
        </div>
      </div>
    );
  }

  if (running && block) {
    const pct = ((idx + (1 - remaining / (block.minutes * 60))) / plan.blocks.length) * 100;
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted">
            Exercise {idx + 1} of {plan.blocks.length}
          </p>
          <Button variant="ghost" size="sm" icon="stop" onClick={() => finish()}>
            Stop session
          </Button>
        </div>
        <ProgressBar value={pct} label="Session progress" />
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <Badge tone="primary" className="capitalize">
                {block.category}
              </Badge>
              <h1 className="mt-2 font-display text-2xl font-semibold">{block.title}</h1>
              <p className="mt-1 text-muted">{block.objective}</p>
            </div>
            <div className="text-center">
              <p className={cx('font-mono text-4xl font-semibold tabular-nums', remaining === 0 && 'text-success')} aria-live="off">
                {fmt(remaining)}
              </p>
              <p className="text-xs text-muted">{remaining === 0 ? 'Time’s up — move on when ready' : paused ? 'Paused' : 'remaining'}</p>
            </div>
          </div>
          <ol className="mt-4 list-decimal space-y-1.5 pl-5">
            {block.instructions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          {block.exercise?.safety && <Alert className="mt-3" tone="warning">{block.exercise.safety}</Alert>}
          {block.lesson && (
            <LinkButton className="mt-3" variant="secondary" to={`/learn/lesson/${block.lesson.id}`}>
              Open the lesson
            </LinkButton>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button variant="secondary" icon={paused ? 'play' : 'pause'} onClick={() => setPaused((p) => !p)}>
              {paused ? 'Resume' : 'Pause'}
            </Button>
            <Button variant="secondary" icon="repeat" onClick={() => (setReps((r) => r + 1), setRemaining(block.minutes * 60))}>
              Repeat ({reps})
            </Button>
            <Button variant="ghost" icon="skip" onClick={() => go(idx + 1, 'skipped')}>
              Skip
            </Button>
            <Button icon="check" onClick={() => go(idx + 1, 'done')}>
              {idx + 1 === plan.blocks.length ? 'Done — finish' : 'Done — next'}
            </Button>
          </div>
        </Card>
        {block.exercise && block.exercise.tool !== 'none' && (
          <Card>
            <BlockTool block={block} />
          </Card>
        )}
        <Card>
          <h2 className="text-sm font-semibold">Checklist</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {plan.blocks.map((b, i) => (
              <li key={b.id + i} className={cx('flex items-center gap-2', i === idx && 'font-semibold')}>
                <span aria-hidden>{states[i] === 'done' ? '✓' : states[i] === 'skipped' ? '↷' : i === idx ? '▶' : '○'}</span>
                {b.title} · {b.minutes} min
                <span className="sr-only">{states[i]}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Daily Riyaz" subtitle="A practice routine built from your level, current lesson and real results. It's a guide, not a rule — skip, repeat or stop whenever you need." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <fieldset>
            <legend className="text-sm font-medium">How long today?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {SESSION_LENGTHS.map((m) => (
                <button key={m} type="button" aria-pressed={minutes === m} onClick={() => setMinutes(m)} className={cx('rounded-xl px-4 py-2 text-sm font-medium', minutes === m ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
                  {m} min
                </button>
              ))}
            </div>
          </fieldset>
          <h2 className="mt-5 text-lg font-semibold">Today&apos;s objective</h2>
          <p className="text-muted">{plan.objective}</p>
          {plan.adjustments.length > 0 && (
            <Alert className="mt-3" tone="info" title="Personalised for you">
              <ul className="list-disc pl-4">
                {plan.adjustments.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </Alert>
          )}
          <ol className="mt-4 space-y-2">
            {plan.blocks.map((b, i) => (
              <li key={b.id + i} className="flex items-start gap-3 rounded-xl border border-border p-3">
                <span className="grid h-9 w-12 shrink-0 place-items-center rounded-lg bg-primary-soft text-sm font-semibold text-primary">{b.minutes}′</span>
                <div className="min-w-0">
                  <p className="font-medium">{b.title}</p>
                  <p className="text-sm text-muted">{b.objective}</p>
                  {b.exercise && b.exercise.tool !== 'none' && (
                    <Link className="text-xs text-primary underline" to={studioPath(b.exercise.tool, { pattern: b.exercise.pattern, bpm: b.exercise.bpm, targets: b.exercise.targets })}>
                      Open tool separately
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <Button size="lg" className="mt-5" icon="play" onClick={start}>
            Start {minutes}-minute session
          </Button>
        </Card>
        <div className="space-y-4">
          <Card>
            <p className="text-xs uppercase tracking-wide text-muted">Today</p>
            <p className="text-2xl font-semibold">{Math.round(todayMin)} / {data.profile.dailyMinutes} min</p>
            <ProgressBar value={(todayMin / data.profile.dailyMinutes) * 100} label="Today's practice goal" tone="success" />
            <p className="mt-3 text-sm text-muted">Current streak: {st.current} day{st.current === 1 ? '' : 's'}. A missed day is fine — just come back.</p>
          </Card>
          <Alert tone="warning" title="Practise comfortably">
            Warm up first, sing at a gentle volume, and stop if anything hurts. Pain is never part of practice.
          </Alert>
        </div>
      </div>
    </>
  );
}
