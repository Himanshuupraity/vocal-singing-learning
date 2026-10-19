import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLevel, LEVELS } from '../curriculum';
import type { LevelId } from '../curriculum/types';
import { useAppData } from '../state/AppData';
import { checkpointContext, checkpointRequirements, isLevelUnlocked } from '../lib/progress';
import { Alert, Badge, Card, EmptyState, Icon, LinkButton, cx } from '../components/ui';
import { PracticalBlock } from '../components/PracticalBlock';

export default function CheckpointPage() {
  const { level: lp } = useParams();
  const levelId = Number(lp) as LevelId;
  const { data, update } = useAppData();
  const valid = LEVELS.some((l) => l.id === levelId);
  const reqs = valid ? checkpointRequirements(data, levelId) : [];
  const allMet = reqs.length > 0 && reqs.every((r) => r.met);
  const passed = valid && !!data.checkpoints[levelId]?.passedAt;

  // Record the pass as soon as every requirement is genuinely met.
  useEffect(() => {
    if (valid && allMet && !passed) {
      update((d) => {
        const c = (d.checkpoints[levelId] ??= { selfChecks: [] });
        c.passedAt = new Date().toISOString();
      });
    }
  }, [valid, allMet, passed, levelId, update]);

  if (!valid) return <EmptyState page title="Checkpoint not found" action={<LinkButton to="/learn">Learning Path</LinkButton>} />;
  if (!isLevelUnlocked(data, levelId)) return <EmptyState page icon="lock" title="This level is locked" action={<LinkButton to="/learn">Learning Path</LinkButton>} />;
  const level = getLevel(levelId);
  const ticked = data.checkpoints[levelId]?.selfChecks ?? [];
  const ctx = checkpointContext(levelId);

  return (
    <div className="space-y-6">
      <div>
        <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
          <Icon name="back" className="h-4 w-4" /> Learning Path
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold">{level.checkpoint.title}</h1>
        <p className="mt-2 max-w-3xl text-muted">{level.checkpoint.description}</p>
      </div>
      {passed ? (
        <Alert tone="success" title={levelId < 4 ? `Level ${levelId + 1} is unlocked!` : 'Congratulations — you have completed every level!'}>
          {levelId < 4 ? (
            <>
              You can keep practising here any time.{' '}
              <Link className="underline" to="/learn">
                Go to Level {levelId + 1}
              </Link>
            </>
          ) : (
            'Singing is a lifelong journey — keep your daily riyaz, learn new songs, and consider a human teacher for detailed feedback.'
          )}
        </Alert>
      ) : (
        <Alert tone="info">Take your time. There is no deadline and no penalty for retrying — only reliable, measured attempts count.</Alert>
      )}

      <Card>
        <h2 className="text-lg font-semibold">Requirements</h2>
        <ul className="mt-3 space-y-2">
          {reqs.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Icon name={r.met ? 'check' : 'x'} className={cx('mt-0.5 h-4 w-4 shrink-0', r.met ? 'text-success' : 'text-muted')} />
              <span>
                <strong>{r.label}:</strong> {r.detail}
              </span>
            </li>
          ))}
        </ul>
        {!reqs[0].met && (
          <LinkButton className="mt-3" variant="secondary" size="sm" to="/learn">
            See remaining lessons
          </LinkButton>
        )}
      </Card>

      {level.checkpoint.requirements.map((p, i) => (
        <Card key={i}>
          <div className="mb-3 flex items-center gap-2">
            <Badge tone="primary">Part {i + 1}</Badge>
          </div>
          <PracticalBlock
            practical={p}
            context={ctx}
            ticked={ticked}
            state={reqs[i + 1]}
            onToggle={(item, on) =>
              update((d) => {
                const c = (d.checkpoints[levelId] ??= { selfChecks: [] });
                c.selfChecks = on ? [...new Set([...c.selfChecks, item])] : c.selfChecks.filter((x) => x !== item);
              })
            }
          />
        </Card>
      ))}
    </div>
  );
}
