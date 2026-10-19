import { useMemo, useState } from 'react';
import { PitchMatcher } from './PitchMatcher';
import { SequenceMatcher } from './SequenceMatcher';
import { makeInterval, makeSequence } from '../../lib/patterns';
import { useAppData } from '../../state/AppData';
import { currentLevel } from '../../lib/progress';
import { swaraLabel, type SwaraToken } from '../../music/theory';
import { Badge, Button, cx } from '../ui';
import { pitchTrend } from '../../lib/progress';

const DIFFICULTY: { id: string; label: string; targets: SwaraToken[]; tolerance: number; desc: string }[] = [
  { id: 'beginner', label: 'Beginner', targets: ['S', 'R', 'G', 'P'], tolerance: 50, desc: 'Sa, Re, Ga, Pa · ±50 cents' },
  { id: 'scale', label: 'Full scale', targets: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"], tolerance: 45, desc: 'All shuddh notes · ±45 cents' },
  { id: 'chromatic', label: 'All 12 swaras', targets: ['S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N'], tolerance: 35, desc: 'Komal & teevra too · ±35 cents' },
  { id: 'wide', label: 'Three octaves', targets: ['.P', '.D', '.N', 'S', 'G', 'P', "S'"], tolerance: 40, desc: 'Mandra to taar Sa — only if comfortable' },
];

type GameKind = 'single' | 'interval' | 'sequence';

export function PitchGame() {
  const { data } = useAppData();
  const [kind, setKind] = useState<GameKind>('single');
  const lvl = currentLevel(data);
  const [mode, setMode] = useState(DIFFICULTY[0].id);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState<{ n: number; matched: number; streak: number; best: number }>({ n: 0, matched: 0, streak: 0, best: 0 });
  const d = DIFFICULTY.find((x) => x.id === mode)!;
  const trend = useMemo(() => {
    const t = pitchTrend({ ...data, pitchAttempts: data.pitchAttempts.filter((a) => a.context === 'game') });
    return t;
  }, [data]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Pitch-Matching Game</h3>
        <p className="text-sm text-muted">A random note plays — match it. Build a streak of matched notes. Results are saved so you can see improvement over weeks.</p>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Game type">
        {([
          ['single', 'Single notes'],
          ['interval', 'Intervals (2 notes)'],
          ['sequence', 'Short sequences'],
        ] as const).map(([k, l]) => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => (setKind(k), setRound((r) => r + 1))} className={cx('rounded-lg px-3 py-1.5 text-sm font-medium', kind === k ? 'bg-accent text-white dark:text-black' : 'bg-surface-2')}>
            {l}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {DIFFICULTY.map((x, i) => (
          <button key={x.id} type="button" aria-pressed={mode === x.id} onClick={() => (setMode(x.id), setRound((r) => r + 1), setScore({ n: 0, matched: 0, streak: 0, best: 0 }))} className={cx('rounded-xl px-3 py-2 text-left text-sm', mode === x.id ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
            <span className="block font-medium">
              {x.label} {i > lvl && <span className="text-xs opacity-80">(stretch)</span>}
            </span>
            <span className="block text-xs opacity-80">{x.desc}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge tone="primary">Attempts: {score.n}</Badge>
        <Badge tone="success">Matched: {score.matched}</Badge>
        <Badge tone="accent">Streak: {score.streak}</Badge>
        <Badge>Best streak: {score.best}</Badge>
      </div>
      {kind !== 'single' ? (
        <SequenceMatcher
          key={`${kind}-${mode}-${round}`}
          label={kind === 'interval' ? 'Interval: sing both notes' : 'Sequence: sing each note in order'}
          context="game"
          tolerance={d.tolerance}
          generate={() => (kind === 'interval' ? makeInterval(d.targets) : makeSequence(d.targets, lvl >= 2 ? 4 : 3))}
          onRound={(rs) => {
            const rel = rs.filter((r) => r.reliable);
            if (!rel.length) return;
            const all = rel.length === rs.length && rel.every((r) => r.matched);
            setScore((s) => ({ n: s.n + 1, matched: s.matched + (all ? 1 : 0), streak: all ? s.streak + 1 : 0, best: Math.max(s.best, all ? s.streak + 1 : 0) }));
          }}
        />
      ) : (
      <PitchMatcher
        key={`${mode}-${round}`}
        title={`Targets: ${d.targets.map(swaraLabel).join(' ')}`}
        targets={d.targets}
        tolerance={d.tolerance}
        context="game"
        order="random"
        onAttempt={(r) => {
          if (!r.reliable) return;
          setScore((s) => {
            const streak = r.matched ? s.streak + 1 : 0;
            return { n: s.n + 1, matched: s.matched + (r.matched ? 1 : 0), streak, best: Math.max(s.best, streak) };
          });
        }}
      />
      )}
      {trend && trend.length > 1 && (
        <div className="rounded-xl bg-surface-2 p-3 text-sm">
          <p className="font-medium">Your game trend (weekly)</p>
          <ul className="mt-1 space-y-0.5 text-muted">
            {trend.map((t) => (
              <li key={t.week}>
                Week of {t.week}: {t.matchedPct}% matched over {t.attempts} attempts (avg {t.avgAbsCents} cents off)
              </li>
            ))}
          </ul>
        </div>
      )}
      <Button variant="ghost" size="sm" onClick={() => (setRound((r) => r + 1), setScore({ n: 0, matched: 0, streak: 0, best: 0 }))}>
        Reset round
      </Button>
    </div>
  );
}
