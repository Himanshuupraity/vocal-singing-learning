import { describe, expect, it } from 'vitest';
import { defaultData, SESSION_LENGTHS, type AppData, type PitchAttemptRecord } from '../src/storage/schema';
import { generateRiyaz } from '../src/lib/riyaz';
import { streak, lessonStatus, canCompleteLesson, isLevelUnlocked, nextRecommendedLesson, lessonContext, insights, pitchTrend } from '../src/lib/progress';
import { LEVELS } from '../src/curriculum';
import { EXERCISES } from '../src/data/exercises';
import { addDays, localDate } from '../src/lib/dates';

const attempt = (over: Partial<PitchAttemptRecord>): PitchAttemptRecord => ({
  id: Math.random().toString(), at: new Date().toISOString(), context: 'studio', target: 'S', tonic: 'C3', targetFreq: 130.8,
  medianCents: 5, withinPct: 90, stabilityCents: 10, octaveOffset: 0, tolerance: 50, matched: true, reliable: true, ...over,
});

describe('riyaz generator', () => {
  for (const m of SESSION_LENGTHS) {
    it(`allocates exactly ${m} minutes`, () => {
      const plan = generateRiyaz(defaultData(), m, '2026-10-12');
      expect(plan.blocks.reduce((s, b) => s + b.minutes, 0)).toBe(m);
      expect(plan.blocks.every((b) => b.minutes >= 1)).toBe(true);
      expect(plan.blocks[0].category).toBe('warmup');
      expect(plan.blocks.at(-1)!.category).toBe('reflection');
    });
  }

  it('adds pitch time for weak swaras from real data', () => {
    const d = defaultData();
    for (let i = 0; i < 5; i++) d.pitchAttempts.push(attempt({ target: 'G', matched: false, medianCents: -80 }));
    const plan = generateRiyaz(d, 20);
    expect(plan.adjustments.join(' ')).toMatch(/G/);
  });

  it('softens the plan after reported strain', () => {
    const d = defaultData();
    d.sessions.push({ id: 'x', date: localDate(), startedAt: '', minutes: 10, kind: 'riyaz', exercisesCompleted: [], exercisesSkipped: [], comfort: 'discomfort' });
    const plan = generateRiyaz(d, 30);
    expect(plan.adjustments.join(' ')).toMatch(/strain/);
    expect(plan.blocks.some((b) => b.category === 'technique')).toBe(false);
  });

  it('uses the Long Note tool when recent long notes were unsteady', () => {
    const d = defaultData();
    d.longNotes = [1, 2, 3].map((i) => ({ id: String(i), at: new Date().toISOString(), swara: 'S', sec: 8, steadinessCents: 50, inTunePct: 40 }));
    const plan = generateRiyaz(d, 30);
    expect(plan.blocks.find((b) => b.category === 'breath')?.exercise?.id).toBe('br-longnote');
    expect(plan.adjustments.join(' ')).toMatch(/long-note/);
  });

  it('adds sargam dictation after low dictation scores', () => {
    const d = defaultData();
    d.earTests.push({ id: 'e', at: new Date().toISOString(), context: 'studio', questions: 10, correct: 3, kind: 'dictation' });
    const plan = generateRiyaz(d, 30);
    expect(plan.blocks.find((b) => b.category === 'listening')?.exercise?.id).toBe('li-dictation');
  });

  it('continues the Alankar Trainer at the tempo reached', () => {
    const d = defaultData();
    d.lessons = Object.fromEntries(LEVELS[0].lessons.map((l) => [l.id, { completedAt: new Date().toISOString(), quizAttempts: 1, selfChecks: [], practiceCount: 1 }]));
    d.checkpoints = { 1: { passedAt: new Date().toISOString(), selfChecks: [] } };
    d.alankars = { 'three:shuddh': { bestBpm: 60, lastBpm: 70, lastPct: 65, at: new Date().toISOString() } };
    const plan = generateRiyaz(d, 30);
    expect(plan.level).toBeGreaterThanOrEqual(2);
    expect(plan.blocks.find((b) => b.category === 'alankar')?.exercise?.id).toBe('al-trainer');
    expect(plan.adjustments.join(' ')).toMatch(/70 bpm/);
  });

  it('every exercise in the library opens a real tool', () => {
    const tools = new Set(['pitch-match', 'sargam', 'drone', 'metronome', 'taal', 'keyboard', 'recorder', 'ear-training', 'alankar-trainer', 'long-note', 'meend', 'raag', 'none']);
    for (const e of EXERCISES) expect(tools.has(e.tool), e.id).toBe(true);
  });
});

describe('streaks', () => {
  const withDays = (days: string[]): AppData => {
    const d = defaultData();
    d.sessions = days.map((date, i) => ({ id: String(i), date, startedAt: '', minutes: 10, kind: 'riyaz', exercisesCompleted: [], exercisesSkipped: [] }));
    return d;
  };
  it('counts consecutive days ending today', () => {
    const t = '2026-10-12';
    expect(streak(withDays([t, addDays(t, -1), addDays(t, -2)]), t).current).toBe(3);
  });
  it('keeps the streak alive until today ends', () => {
    const t = '2026-10-12';
    expect(streak(withDays([addDays(t, -1), addDays(t, -2)]), t).current).toBe(2);
  });
  it('resets after a missed day and tracks best', () => {
    const t = '2026-10-12';
    const s = streak(withDays([addDays(t, -5), addDays(t, -4), addDays(t, -3), addDays(t, -2)]), t);
    expect(s.current).toBe(0);
    expect(s.best).toBe(4);
  });
});

describe('unlocking', () => {
  const l1 = LEVELS[0].lessons;

  it('starts with only the first lesson available', () => {
    const d = defaultData();
    expect(lessonStatus(d, l1[0])).toBe('available');
    if (l1[1]) expect(lessonStatus(d, l1[1])).toBe('locked');
    expect(isLevelUnlocked(d, 2)).toBe(false);
    expect(nextRecommendedLesson(d)?.id).toBe(l1[0]?.id);
  });

  it('does not allow completion by clicking through', () => {
    const d = defaultData();
    if (!l1[0]) return;
    expect(canCompleteLesson(d, l1[0])).toBe(false);
  });

  it('allows completion when quiz and practical are genuinely met', () => {
    const lesson = l1.find((l) => l.practical?.kind === 'pitch-match');
    if (!lesson || lesson.practical?.kind !== 'pitch-match') return;
    const d = defaultData();
    d.lessons[lesson.id] = { quizBest: 100, quizAttempts: 1, selfChecks: [], practiceCount: 0 };
    expect(canCompleteLesson(d, lesson)).toBe(false);
    for (let i = 0; i < lesson.practical.minAttempts; i++) d.pitchAttempts.push(attempt({ context: lessonContext(lesson.id), target: lesson.practical.targets[0] }));
    expect(canCompleteLesson(d, lesson)).toBe(true);
  });

  it('unlocks the next lesson after completion', () => {
    if (l1.length < 2) return;
    const d = defaultData();
    d.lessons[l1[0].id] = { completedAt: new Date().toISOString(), quizAttempts: 1, selfChecks: [], practiceCount: 0 };
    expect(lessonStatus(d, l1[1])).toBe('available');
  });
});

describe('insights & trends', () => {
  it('returns no trend without real data', () => {
    expect(pitchTrend(defaultData())).toBeNull();
    expect(insights(defaultData())).toEqual([]);
  });
});
