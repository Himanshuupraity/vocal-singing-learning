import { Link } from 'react-router-dom';
import { LEVELS } from '../curriculum';
import { useAppData } from '../state/AppData';
import { checkpointRequirements, isLevelUnlocked, lessonStatus, type LessonStatus } from '../lib/progress';
import { Badge, Card, Icon, PageHeader, ProgressBar, cx } from '../components/ui';

const STATUS: Record<LessonStatus, { label: string; tone: 'neutral' | 'primary' | 'success' | 'accent' }> = {
  locked: { label: 'Locked', tone: 'neutral' },
  available: { label: 'Start', tone: 'primary' },
  'in-progress': { label: 'In progress', tone: 'accent' },
  completed: { label: 'Completed', tone: 'success' },
};

export default function LearningPath() {
  const { data } = useAppData();
  return (
    <>
      <PageHeader
        title="Learning Path"
        subtitle="Four levels from first sur to advanced foundations. Durations are flexible guidelines — you move on by showing the skill (quizzes and practicals), never by the calendar. Completed lessons are always open to revisit."
      />
      <div className="space-y-6">
        {LEVELS.map((level) => {
          const unlocked = isLevelUnlocked(data, level.id);
          const done = level.lessons.filter((l) => data.lessons[l.id]?.completedAt).length;
          const cp = data.checkpoints[level.id]?.passedAt;
          const reqs = checkpointRequirements(data, level.id);
          const modules = [...new Set(level.lessons.map((l) => l.module))];
          return (
            <Card key={level.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    Level {level.id} · {level.suggestedDuration}
                  </p>
                  <h2 className="font-display text-2xl font-semibold">{level.title}</h2>
                  <p className="text-sm text-muted">{level.subtitle}</p>
                </div>
                {!unlocked ? (
                  <Badge>
                    <Icon name="lock" className="h-3.5 w-3.5" /> Pass the Level {level.id - 1} checkpoint to unlock
                  </Badge>
                ) : cp ? (
                  <Badge tone="success">
                    <Icon name="check" className="h-3.5 w-3.5" /> Checkpoint passed
                  </Badge>
                ) : (
                  <Badge tone="primary">
                    {done}/{level.lessons.length} lessons
                  </Badge>
                )}
              </div>
              <p className="mt-3 max-w-3xl text-sm">{level.description}</p>
              <div className="mt-3">
                <ProgressBar value={(done / level.lessons.length) * 100} label={`Level ${level.id} progress`} />
              </div>
              {modules.map((m) => (
                <div key={m} className="mt-5">
                  <h3 className="mb-2 text-sm font-semibold text-muted">{m}</h3>
                  <ol className="grid gap-2 md:grid-cols-2">
                    {level.lessons
                      .filter((l) => l.module === m)
                      .map((l) => {
                        const st = lessonStatus(data, l);
                        const content = (
                          <>
                            <span className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-full', st === 'completed' ? 'bg-success-soft text-success' : st === 'locked' ? 'bg-surface-2 text-muted' : 'bg-primary-soft text-primary')}>
                              <Icon name={st === 'completed' ? 'check' : st === 'locked' ? 'lock' : 'book'} className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium">{l.title}</span>
                              <span className="block text-xs text-muted">~{l.estMinutes} min{l.practical ? ` · ${l.practical.kind === 'self-check' ? 'self-check' : 'measured practical'}` : ''}</span>
                            </span>
                            <Badge tone={STATUS[st].tone}>{STATUS[st].label}</Badge>
                          </>
                        );
                        return (
                          <li key={l.id} className="min-w-0">
                            {st === 'locked' ? (
                              <div className="flex items-center gap-3 rounded-xl border border-border p-3" aria-disabled="true" title="Complete the previous lesson to unlock">
                                {content}
                              </div>
                            ) : (
                              <Link to={`/learn/lesson/${l.id}`} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-surface-2">
                                {content}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                  </ol>
                </div>
              ))}
              {unlocked && (
                <Link to={`/learn/checkpoint/${level.id}`} className="mt-5 flex items-center justify-between rounded-xl bg-accent-soft p-4 hover:opacity-90">
                  <span>
                    <span className="block font-semibold">{level.checkpoint.title}</span>
                    <span className="block text-sm text-muted">
                      {cp ? 'Passed — revisit any time' : `${reqs.filter((r) => r.met).length}/${reqs.length} requirements met`}
                    </span>
                  </span>
                  <Icon name="arrow" />
                </Link>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
