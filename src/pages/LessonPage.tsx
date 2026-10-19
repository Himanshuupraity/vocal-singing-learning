import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLesson, nextLessonAfter } from '../curriculum';
import { useAppData } from '../state/AppData';
import { canCompleteLesson, lessonContext, lessonRequirements, lessonStatus } from '../lib/progress';
import { Alert, Badge, Button, Card, EmptyState, ExternalLink, Icon, LinkButton, cx } from '../components/ui';
import { DemoPlayer } from '../components/DemoPlayer';
import { Quiz } from '../components/Quiz';
import { PracticalBlock } from '../components/PracticalBlock';
import { studioPath } from './Studio';
import { youtubeSearchUrl } from '../lib/youtube';
import { usePracticeTimer } from '../hooks/usePracticeTimer';
import { swaraLabel } from '../music/theory';
import { SaFinder } from '../components/SaFinder';
import { WatchedToggle } from '../components/WatchedToggle';

export default function LessonPage() {
  const { lessonId = '' } = useParams();
  const lesson = getLesson(lessonId);
  const { data, update } = useAppData();
  const [lang, setLang] = useState<'hinglish' | 'english' | 'hindi'>(data.profile.language);
  const [quizKey, setQuizKey] = useState(0);
  const [stepsDone, setStepsDone] = useState<number[]>([]);
  const practiceRef = useRef<HTMLDivElement>(null);
  const status = lesson ? lessonStatus(data, lesson) : 'locked';
  usePracticeTimer('lesson', lesson?.title, !!lesson && status !== 'locked');

  useEffect(() => {
    if (!lesson || status === 'locked') return;
    update((d) => {
      const lp = (d.lessons[lesson.id] ??= { quizAttempts: 0, selfChecks: [], practiceCount: 0 });
      lp.lastVisited = new Date().toISOString();
    });
    setStepsDone([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  if (!lesson) return <EmptyState page title="Lesson not found" action={<LinkButton to="/learn">Back to Learning Path</LinkButton>} />;
  if (status === 'locked') {
    return (
      <EmptyState page icon="lock" title={`“${lesson.title}” is locked`} action={<LinkButton to="/learn">Back to Learning Path</LinkButton>}>
        Complete the previous lesson (or the previous level&apos;s checkpoint) first. Each lesson builds on the one before it.
      </EmptyState>
    );
  }

  const lp = data.lessons[lesson.id];
  const reqs = lessonRequirements(data, lesson);
  const canComplete = canCompleteLesson(data, lesson);
  const done = !!lp?.completedAt;
  const next = nextLessonAfter(lesson.id);
  const ctx = lessonContext(lesson.id);
  const ip = lesson.independentPractice;
  const shownLang = lang === 'hindi' && !lesson.explanation.hindi ? 'hinglish' : lang;

  const toggleCheck = (item: string, on: boolean) =>
    update((d) => {
      const p = (d.lessons[lesson.id] ??= { quizAttempts: 0, selfChecks: [], practiceCount: 0 });
      p.selfChecks = on ? [...new Set([...p.selfChecks, item])] : p.selfChecks.filter((x) => x !== item);
    });

  const markComplete = () =>
    update((d) => {
      const p = (d.lessons[lesson.id] ??= { quizAttempts: 0, selfChecks: [], practiceCount: 0 });
      p.completedAt = new Date().toISOString();
    });

  const practiceAgain = () => {
    update((d) => {
      const p = (d.lessons[lesson.id] ??= { quizAttempts: 0, selfChecks: [], practiceCount: 0 });
      p.practiceCount += 1;
    });
    setStepsDone([]);
    setQuizKey((k) => k + 1);
    practiceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <article className="space-y-6">
      <div>
        <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
          <Icon name="back" className="h-4 w-4" /> Learning Path
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge tone="primary">Level {lesson.level}</Badge>
          <Badge>{lesson.module}</Badge>
          <Badge>~{lesson.estMinutes} min</Badge>
          {done && <Badge tone="success">Completed</Badge>}
        </div>
        <h1 className="mt-2 font-display text-3xl font-semibold">{lesson.title}</h1>
        <p className="mt-2 text-muted">
          <strong className="text-text">Objective:</strong> {lesson.objective}
        </p>
      </div>

      {lesson.safetyNote && (
        <Alert tone="warning" title="Vocal safety">
          {lesson.safetyNote}
        </Alert>
      )}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Explanation</h2>
          <div role="group" aria-label="Explanation language" className="flex rounded-xl bg-surface-2 p-1 text-sm">
            {(['hinglish', 'english', 'hindi'] as const)
              .filter((l) => l !== 'hindi' || lesson.explanation.hindi)
              .map((l) => (
                <button key={l} type="button" aria-pressed={shownLang === l} onClick={() => setLang(l)} className={cx('rounded-lg px-3 py-1', shownLang === l ? 'bg-surface shadow-sm' : 'text-muted')} lang={l === 'hindi' ? 'hi' : undefined}>
                  {l === 'hinglish' ? 'Hinglish' : l === 'english' ? 'English' : 'हिन्दी'}
                </button>
              ))}
          </div>
        </div>
        <div className="prose-lesson mt-3 max-w-3xl" lang={shownLang === 'hindi' ? 'hi' : 'en'}>
          {(lesson.explanation[shownLang] ?? lesson.explanation.hinglish).split(/\n\n+/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-accent-soft p-4 text-sm">
          <p className="font-semibold">Why this matters</p>
          <p className="mt-1">{lesson.whyItMatters}</p>
        </div>
        {lesson.traditionNote && (
          <div className="mt-3 rounded-xl bg-info-soft p-4 text-sm">
            <p className="font-semibold">A note on tradition &amp; simplification</p>
            <p className="mt-1">{lesson.traditionNote}</p>
          </div>
        )}
      </Card>

      {lesson.demos.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold">Listen: audio demonstrations</h2>
          <p className="text-sm text-muted">Played at your Sa. Use headphones if you can.</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {lesson.demos.map((d, i) => (
              <DemoPlayer key={i} demo={d} />
            ))}
          </div>
        </Card>
      )}

      {lesson.id === 'l1-find-your-sa' && <SaFinder />}

      <div ref={practiceRef}>
        <Card>
          <h2 className="text-lg font-semibold">Guided practice</h2>
          <ol className="mt-3 space-y-2">
            {lesson.guidedSteps.map((s, i) => (
              <li key={i}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl p-2 hover:bg-surface-2">
                  <input type="checkbox" className="mt-1" checked={stepsDone.includes(i)} onChange={(e) => setStepsDone((x) => (e.target.checked ? [...x, i] : x.filter((y) => y !== i)))} />
                  <span className={cx(stepsDone.includes(i) && 'text-muted line-through')}>
                    <span className="font-semibold">{i + 1}.</span> {s}
                  </span>
                </label>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold">Practise on your own · {ip.durationMin} min</h2>
        <p className="mt-2">{ip.instructions}</p>
        {ip.pattern && (
          <div className="mt-3 flex flex-wrap gap-1">
            {ip.pattern.map((t, i) => (
              <span key={i} className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
                {swaraLabel(t)}
              </span>
            ))}
          </div>
        )}
        {ip.tool !== 'none' && (
          <LinkButton className="mt-4" variant="secondary" icon="mic" to={studioPath(ip.tool, { pattern: ip.pattern, bpm: ip.bpm, targets: ip.tool === 'pitch-match' ? ip.pattern?.filter((t) => t !== '-') : undefined })}>
            Open in Practice Studio
          </LinkButton>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Common mistakes &amp; fixes</h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {lesson.mistakes.map((m, i) => (
            <li key={i} className="rounded-xl border border-border p-3 text-sm">
              <p className="font-medium text-danger">✗ {m.mistake}</p>
              <p className="mt-1">
                <span className="font-medium text-success">✓ Fix:</span> {m.fix}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Quiz</h2>
        <div className="mt-3">
          <Quiz
            key={quizKey}
            questions={lesson.quiz}
            best={lp?.quizBest}
            onSubmit={(pct) =>
              update((d) => {
                const p = (d.lessons[lesson.id] ??= { quizAttempts: 0, selfChecks: [], practiceCount: 0 });
                p.quizAttempts += 1;
                p.quizBest = Math.max(p.quizBest ?? 0, pct);
              })
            }
          />
        </div>
      </Card>

      {lesson.practical && (
        <Card>
          <h2 className="text-lg font-semibold">Practical assessment</h2>
          <div className="mt-3">
            <PracticalBlock practical={lesson.practical} context={ctx} ticked={lp?.selfChecks ?? []} onToggle={toggleCheck} state={reqs[1]} />
          </div>
        </Card>
      )}

      <Card className="border-primary/40">
        <h2 className="text-lg font-semibold">Complete this lesson</h2>
        <ul className="mt-3 space-y-2">
          {reqs.map((r) => (
            <li key={r.label} className="flex items-start gap-2 text-sm">
              <Icon name={r.met ? 'check' : 'x'} className={cx('mt-0.5 h-4 w-4 shrink-0', r.met ? 'text-success' : 'text-muted')} />
              <span>
                <strong>{r.label}:</strong> {r.detail}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          {done ? (
            <Badge tone="success" className="px-3 py-2 text-sm">
              <Icon name="check" className="h-4 w-4" /> Completed on {new Date(lp!.completedAt!).toLocaleDateString()}
            </Badge>
          ) : (
            <Button icon="check" onClick={markComplete} disabled={!canComplete} title={canComplete ? undefined : 'Meet the requirements above first'}>
              Mark as complete
            </Button>
          )}
          <Button variant="secondary" icon="repeat" onClick={practiceAgain}>
            Practice again
          </Button>
          <LinkButton variant="ghost" icon="chat" to={`/tutor?lesson=${lesson.id}`}>
            Ask the tutor about this lesson
          </LinkButton>
        </div>
        {!done && !canComplete && <p className="mt-2 text-xs text-muted">The button unlocks when every requirement is met — so you move on with real skill, not just by clicking through.</p>}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Videos on YouTube</h2>
        <p className="text-sm text-muted">Search links for this topic — pick a clear demonstration from a credible teacher. You can also browse these in the Video Library.</p>
        <ul className="mt-3 space-y-2">
          {lesson.videoQueries.map((q) => (
            <li key={q} className="flex flex-wrap items-center gap-3">
              <ExternalLink href={youtubeSearchUrl(q)}>Search YouTube: “{q}”</ExternalLink>
              <WatchedToggle query={q} />
            </li>
          ))}
        </ul>
        <LinkButton className="mt-3" variant="ghost" size="sm" to={`/videos?q=${encodeURIComponent(lesson.videoQueries[0])}`}>
          Find videos in the Video Library
        </LinkButton>
      </Card>

      <Card className="bg-primary-soft">
        <h2 className="text-lg font-semibold">Next step</h2>
        <p className="mt-1">{lesson.nextStep}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {next && next.level === lesson.level ? (
            <LinkButton to={`/learn/lesson/${next.id}`} icon="arrow">
              {done ? `Next: ${next.title}` : `Up next: ${next.title}`}
            </LinkButton>
          ) : (
            <LinkButton to={`/learn/checkpoint/${lesson.level}`} icon="arrow">
              Level {lesson.level} checkpoint
            </LinkButton>
          )}
        </div>
      </Card>
    </article>
  );
}
