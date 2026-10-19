import type { Lesson, LevelId } from '../curriculum/types';
import { EXERCISES, type Exercise, type ExerciseCategory } from '../data/exercises';
import type { AppData, SessionLength } from '../storage/schema';
import { hashString, localDate } from './dates';
import { currentLevel, nextRecommendedLesson, swaraAccuracy } from './progress';

export interface RiyazBlock {
  id: string;
  minutes: number;
  category: ExerciseCategory | 'lesson';
  exercise?: Exercise;
  lesson?: Lesson;
  title: string;
  objective: string;
  instructions: string[];
}

export interface RiyazPlan {
  date: string;
  level: LevelId;
  totalMinutes: number;
  objective: string;
  blocks: RiyazBlock[];
  adjustments: string[];
}

type Weights = Partial<Record<RiyazBlock['category'], number>>;

/** Relative time weights per level. These are templates, adjusted per learner below. */
const LEVEL_WEIGHTS: Record<LevelId, Weights> = {
  1: { warmup: 3, breath: 1, listening: 2, sa: 4, sargam: 4, pitch: 3, lesson: 3, rhythm: 1, reflection: 1 },
  2: { warmup: 3, breath: 1, sa: 2, sargam: 2, alankar: 5, pitch: 3, rhythm: 3, lesson: 3, reflection: 1 },
  3: { warmup: 3, breath: 2, sa: 1, alankar: 3, raga: 4, technique: 3, pitch: 2, lesson: 3, song: 2, reflection: 1 },
  4: { warmup: 3, breath: 2, alankar: 3, raga: 3, technique: 4, rhythm: 2, pitch: 2, lesson: 3, song: 3, reflection: 1 },
};

/** Which categories to drop first for short sessions (most essential last). */
const DROP_ORDER: RiyazBlock['category'][] = ['song', 'breath', 'listening', 'rhythm', 'technique', 'raga', 'pitch', 'alankar', 'sargam', 'lesson', 'sa', 'reflection', 'warmup'];

export function generateRiyaz(data: AppData, minutes: SessionLength, date = localDate()): RiyazPlan {
  const level = currentLevel(data);
  const weights: Weights = { ...LEVEL_WEIGHTS[level] };
  const adjustments: string[] = [];
  const lesson = nextRecommendedLesson(data);

  // Personalisation from real history.
  const weak = swaraAccuracy(data).filter((s) => s.attempts >= 3 && s.matchedPct < 50);
  if (weak.length) {
    weights.pitch = (weights.pitch ?? 0) + 2;
    adjustments.push(`Extra pitch-matching time for ${weak.map((w) => w.target).join(', ')} (recent match rate under 50%).`);
  }
  const recentStrain = data.sessions.slice(-3).some((s) => s.comfort === 'discomfort' || s.comfort === 'some-strain');
  if (recentStrain) {
    weights.warmup = (weights.warmup ?? 0) + 2;
    delete weights.technique;
    adjustments.push('You reported strain recently, so this plan has a longer gentle warm-up and no demanding technique work. Sing softly; stop if anything hurts.');
  }
  const rhythmWeak = data.rhythm.slice(-3);
  if (rhythmWeak.length && rhythmWeak.reduce((s, r) => s + r.onBeatPct, 0) / rhythmWeak.length < 60) {
    weights.rhythm = (weights.rhythm ?? 0) + 2;
    adjustments.push('Extra rhythm practice (recent tap-along results under 60% on-beat).');
  }
  if (!lesson) delete weights.lesson;
  if (!Object.values(data.songs).some((s) => s.status === 'learning')) delete weights.song;
  else if (data.profile.focus === 'bollywood') weights.song = (weights.song ?? 1) + 1;
  if (data.profile.focus === 'classical' && weights.raga) weights.raga += 1;

  // Keep at most N blocks so each gets ≥ ~2 minutes.
  const maxBlocks = Math.max(3, Math.min(10, Math.floor(minutes / 2)));
  let cats = (Object.keys(weights) as RiyazBlock['category'][]).filter((c) => (weights[c] ?? 0) > 0);
  for (const c of DROP_ORDER) {
    if (cats.length <= maxBlocks) break;
    if (c !== 'warmup' && c !== 'reflection' && cats.includes(c)) cats = cats.filter((x) => x !== c);
  }

  const totalW = cats.reduce((s, c) => s + (weights[c] ?? 0), 0);
  const order: RiyazBlock['category'][] = ['warmup', 'breath', 'listening', 'sa', 'sargam', 'pitch', 'alankar', 'raga', 'technique', 'rhythm', 'lesson', 'song', 'reflection'];
  cats.sort((a, b) => order.indexOf(a) - order.indexOf(b));

  // Allocate whole minutes (largest-remainder), min 1 each, summing exactly to `minutes`.
  const raw = cats.map((c) => ((weights[c] ?? 0) / totalW) * minutes);
  const alloc = raw.map((r) => Math.max(1, Math.floor(r)));
  let diff = minutes - alloc.reduce((s, x) => s + x, 0);
  const rema = raw.map((r, i) => ({ i, r: r - Math.floor(r) })).sort((a, b) => b.r - a.r);
  for (let k = 0; diff > 0; k = (k + 1) % rema.length, diff--) alloc[rema[k].i]++;
  for (let i = alloc.length - 1; diff < 0 && i >= 0; i--) {
    while (alloc[i] > 1 && diff < 0) {
      alloc[i]--;
      diff++;
    }
  }

  const seed = hashString(date + level);
  const blocks: RiyazBlock[] = cats.map((cat, i) => {
    if (cat === 'lesson' && lesson) {
      return {
        id: `lesson-${lesson.id}`,
        minutes: alloc[i],
        category: 'lesson',
        lesson,
        title: `Current lesson: ${lesson.title}`,
        objective: lesson.objective,
        instructions: [lesson.independentPractice.instructions],
      };
    }
    const pool = EXERCISES.filter((e) => e.category === cat && e.minLevel <= level && (e.maxLevel ?? 4) >= level);
    const preferWeak = cat === 'pitch' && weak.length ? pool.find((e) => e.targets?.some((t) => weak.some((w) => w.target === t))) : undefined;
    const ex = preferWeak ?? pool[(seed + i) % Math.max(1, pool.length)];
    return {
      id: ex?.id ?? `${cat}-${i}`,
      minutes: alloc[i],
      category: cat,
      exercise: ex,
      title: ex?.title ?? cat,
      objective: ex?.objective ?? '',
      instructions: ex?.instructions ?? [],
    };
  });

  const objective =
    level === 1
      ? 'Hear and match Sa, sing slow sargam, and keep the voice relaxed.'
      : level === 2
        ? 'Build steady, in-tune alankars and feel the taal.'
        : level === 3
          ? 'Shape phrases with breath, ornaments and raga colour.'
          : 'Refine speed, expression and performance-readiness.';

  return { date, level, totalMinutes: minutes, objective, blocks, adjustments };
}
