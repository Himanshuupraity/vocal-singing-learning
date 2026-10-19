import { ALL_LESSONS, LEVELS, getLevel } from '../curriculum';
import type { Lesson, LevelId, PracticalCheck } from '../curriculum/types';
import type { AppData } from '../storage/schema';
import { addDays, localDate } from './dates';

export const QUIZ_PASS_PCT = 70;

export type LessonStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface RequirementState {
  label: string;
  met: boolean;
  detail: string;
  /** true when the requirement is self-reported rather than measured */
  selfReported?: boolean;
}

export function lessonContext(id: string) {
  return `lesson:${id}`;
}
export function checkpointContext(level: LevelId) {
  return `checkpoint:${level}`;
}

/** Evaluate a practical check against saved, measured results for a context. */
export function evaluatePractical(data: AppData, p: PracticalCheck, context: string, ticked: string[]): RequirementState {
  if (p.kind === 'pitch-match') {
    const attempts = data.pitchAttempts.filter((a) => a.context === context && a.reliable && p.targets.includes(a.target));
    const recent = attempts.slice(-Math.max(p.minAttempts, 10));
    const success = recent.length ? Math.round((recent.filter((a) => Math.abs(a.medianCents) <= p.toleranceCents && a.withinPct >= 60).length / recent.length) * 100) : 0;
    const met = attempts.length >= p.minAttempts && success >= p.minSuccessPct;
    return {
      label: 'Pitch matching (measured)',
      met,
      detail: `${p.description} — ${attempts.length}/${p.minAttempts} reliable attempts, ${success}% matched within ±${p.toleranceCents} cents (need ${p.minSuccessPct}%).`,
    };
  }
  if (p.kind === 'ear-test') {
    const tests = data.earTests.filter((t) => t.context === context && t.questions >= p.minQuestions);
    const best = tests.reduce((m, t) => Math.max(m, Math.round((t.correct / t.questions) * 100)), 0);
    return {
      label: 'Listening test (measured)',
      met: best >= p.minScorePct,
      detail: `${p.description} — best score ${tests.length ? best + '%' : 'not attempted'} (need ${p.minScorePct}% on ${p.minQuestions}+ questions).`,
    };
  }
  const done = p.items.filter((i) => ticked.includes(i)).length;
  return {
    label: 'Self-check (your own honest report)',
    met: done === p.items.length,
    detail: `${p.description} — ${done}/${p.items.length} ticked.`,
    selfReported: true,
  };
}

export function lessonRequirements(data: AppData, lesson: Lesson): RequirementState[] {
  const lp = data.lessons[lesson.id];
  const best = lp?.quizBest;
  const reqs: RequirementState[] = [
    {
      label: 'Quiz',
      met: (best ?? 0) >= QUIZ_PASS_PCT,
      detail: best === undefined ? `Not attempted yet (pass mark ${QUIZ_PASS_PCT}%).` : `Best score ${best}% (pass mark ${QUIZ_PASS_PCT}%).`,
    },
  ];
  if (lesson.practical) reqs.push(evaluatePractical(data, lesson.practical, lessonContext(lesson.id), lp?.selfChecks ?? []));
  return reqs;
}

export function canCompleteLesson(data: AppData, lesson: Lesson) {
  return lessonRequirements(data, lesson).every((r) => r.met);
}

export function isLessonComplete(data: AppData, id: string) {
  return !!data.lessons[id]?.completedAt;
}

export function checkpointRequirements(data: AppData, level: LevelId): RequirementState[] {
  const lvl = getLevel(level);
  const done = lvl.lessons.filter((l) => isLessonComplete(data, l.id)).length;
  const reqs: RequirementState[] = [
    { label: 'All lessons in this level', met: done === lvl.lessons.length, detail: `${done}/${lvl.lessons.length} lessons completed.` },
  ];
  const ticked = data.checkpoints[level]?.selfChecks ?? [];
  lvl.checkpoint.requirements.forEach((r) => reqs.push(evaluatePractical(data, r, checkpointContext(level), ticked)));
  return reqs;
}

export function isLevelUnlocked(data: AppData, level: LevelId): boolean {
  if (level === 1) return true;
  return !!data.checkpoints[(level - 1) as LevelId]?.passedAt;
}

export function lessonStatus(data: AppData, lesson: Lesson): LessonStatus {
  if (isLessonComplete(data, lesson.id)) return 'completed';
  if (!isLevelUnlocked(data, lesson.level)) return 'locked';
  const lessons = getLevel(lesson.level).lessons;
  const i = lessons.findIndex((l) => l.id === lesson.id);
  if (i > 0 && !isLessonComplete(data, lessons[i - 1].id)) return 'locked';
  const lp = data.lessons[lesson.id];
  return lp && (lp.quizAttempts > 0 || lp.lastVisited) ? 'in-progress' : 'available';
}

/** Highest unlocked level. Learners always start at Level 1. */
export function currentLevel(data: AppData): LevelId {
  let lvl: LevelId = 1;
  for (const l of LEVELS) if (isLevelUnlocked(data, l.id)) lvl = l.id;
  return lvl;
}

export function nextRecommendedLesson(data: AppData): Lesson | undefined {
  return ALL_LESSONS.find((l) => lessonStatus(data, l) === 'in-progress') ?? ALL_LESSONS.find((l) => lessonStatus(data, l) === 'available');
}

export function completionStats(data: AppData) {
  const total = ALL_LESSONS.length;
  const done = ALL_LESSONS.filter((l) => isLessonComplete(data, l.id)).length;
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

// ---------- Practice stats ----------

export function minutesByDate(data: AppData): Record<string, number> {
  const m: Record<string, number> = {};
  for (const s of data.sessions) m[s.date] = (m[s.date] ?? 0) + s.minutes;
  return m;
}

/**
 * Current streak = consecutive practice days ending today, or ending yesterday
 * if today hasn't been practised yet (so the streak isn't "lost" mid-day).
 */
export function streak(data: AppData, today = localDate()): { current: number; best: number } {
  const days = new Set(Object.entries(minutesByDate(data)).filter(([, v]) => v > 0).map(([k]) => k));
  let cur = 0;
  let d = days.has(today) ? today : addDays(today, -1);
  while (days.has(d)) {
    cur++;
    d = addDays(d, -1);
  }
  const sorted = [...days].sort();
  let best = 0;
  let run = 0;
  let prev = '';
  for (const day of sorted) {
    run = prev && addDays(prev, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  }
  return { current: cur, best };
}

export function totalMinutes(data: AppData) {
  return data.sessions.reduce((s, x) => s + x.minutes, 0);
}

/** Pitch-matching trend by week (only reliable attempts). Returns null when there isn't enough real data. */
export function pitchTrend(data: AppData, weeks = 8) {
  const rel = data.pitchAttempts.filter((a) => a.reliable);
  if (rel.length < 3) return null;
  const buckets = new Map<string, { n: number; matched: number; absCents: number }>();
  for (const a of rel) {
    const wk = weekKey(a.at);
    const b = buckets.get(wk) ?? { n: 0, matched: 0, absCents: 0 };
    b.n++;
    if (a.matched) b.matched++;
    b.absCents += Math.abs(a.medianCents);
    buckets.set(wk, b);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-weeks)
    .map(([week, b]) => ({ week, attempts: b.n, matchedPct: Math.round((b.matched / b.n) * 100), avgAbsCents: Math.round(b.absCents / b.n) }));
}

function weekKey(iso: string) {
  const d = new Date(iso);
  const dow = (d.getDay() + 6) % 7;
  return localDate(new Date(d.getFullYear(), d.getMonth(), d.getDate() - dow));
}

/** Per-swara accuracy across recent attempts, used for "areas to practise". */
export function swaraAccuracy(data: AppData, recent = 200) {
  const m = new Map<string, { n: number; matched: number; cents: number }>();
  for (const a of data.pitchAttempts.filter((x) => x.reliable).slice(-recent)) {
    const e = m.get(a.target) ?? { n: 0, matched: 0, cents: 0 };
    e.n++;
    if (a.matched) e.matched++;
    e.cents += a.medianCents;
    m.set(a.target, e);
  }
  return [...m.entries()].map(([target, e]) => ({ target, attempts: e.n, matchedPct: Math.round((e.matched / e.n) * 100), avgCents: Math.round(e.cents / e.n) }));
}

export interface Insight {
  kind: 'strength' | 'practice';
  text: string;
}

/** Strengths / areas needing practice — derived only from real saved results. */
export function insights(data: AppData): Insight[] {
  const out: Insight[] = [];
  const acc = swaraAccuracy(data).filter((s) => s.attempts >= 3);
  for (const s of acc) {
    if (s.matchedPct >= 75) out.push({ kind: 'strength', text: `Matching ${s.target} — ${s.matchedPct}% of ${s.attempts} recent attempts matched.` });
    else if (s.matchedPct < 50) out.push({ kind: 'practice', text: `Matching ${s.target} — ${s.matchedPct}% matched; on average ${Math.abs(s.avgCents)} cents ${s.avgCents < 0 ? 'flat' : 'sharp'}.` });
  }
  const ear = data.earTests.slice(-5);
  if (ear.length) {
    const pct = Math.round((ear.reduce((s, t) => s + t.correct, 0) / ear.reduce((s, t) => s + t.questions, 0)) * 100);
    out.push({ kind: pct >= 75 ? 'strength' : 'practice', text: `Listening tests — ${pct}% correct over your last ${ear.length} test${ear.length > 1 ? 's' : ''}.` });
  }
  const rh = data.rhythm.slice(-5);
  if (rh.length) {
    const pct = Math.round(rh.reduce((s, r) => s + r.onBeatPct, 0) / rh.length);
    out.push({ kind: pct >= 70 ? 'strength' : 'practice', text: `Rhythm tapping — ${pct}% of taps on the beat (±80 ms) in recent tests.` });
  }
  const strain = data.sessions.slice(-7).filter((s) => s.comfort === 'discomfort' || s.comfort === 'some-strain').length;
  if (strain >= 2) out.push({ kind: 'practice', text: `You reported strain in ${strain} recent sessions — keep volume gentle, shorten sessions and rest. If discomfort persists, consult a doctor/ENT.` });
  return out;
}
