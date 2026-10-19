import type { Lesson, Level, LevelId } from './types';
import { level1 } from './levels/level1';
import { level2 } from './levels/level2';
import { level3 } from './levels/level3';
import { level4 } from './levels/level4';

export const LEVELS: Level[] = [level1, level2, level3, level4];

export const ALL_LESSONS: Lesson[] = LEVELS.flatMap((l) => l.lessons);

const lessonIndex = new Map(ALL_LESSONS.map((l, i) => [l.id, i]));

export function getLesson(id: string): Lesson | undefined {
  const i = lessonIndex.get(id);
  return i === undefined ? undefined : ALL_LESSONS[i];
}

export function getLevel(id: LevelId): Level {
  return LEVELS[id - 1];
}

/** The lesson after `id` in curriculum order, if any. */
export function nextLessonAfter(id: string): Lesson | undefined {
  const i = lessonIndex.get(id);
  return i === undefined ? undefined : ALL_LESSONS[i + 1];
}

export function lessonOrder(id: string): number {
  return lessonIndex.get(id) ?? -1;
}
