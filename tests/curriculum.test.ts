import { describe, expect, it } from 'vitest';
import { LEVELS, ALL_LESSONS } from '../src/curriculum';
import { isValidSwaraToken } from '../src/music/theory';
import { TAALS } from '../src/music/taal';
import type { AudioDemo, PracticalCheck } from '../src/curriculum/types';

function demoTokens(d: AudioDemo): string[] {
  switch (d.kind) {
    case 'note': return [d.swara];
    case 'sequence': return d.notes;
    case 'compare': return [d.a, d.b];
    case 'glide': return [d.from, d.to];
    default: return [];
  }
}

function checkPractical(p: PracticalCheck, where: string) {
  expect(p.description, where).toBeTruthy();
  if (p.kind === 'pitch-match') {
    expect(p.targets.length, where).toBeGreaterThan(0);
    p.targets.forEach((t) => expect(isValidSwaraToken(t), `${where} target ${t}`).toBe(true));
    expect(p.minAttempts, where).toBeGreaterThan(0);
    expect(p.minSuccessPct, where).toBeGreaterThan(0);
    expect(p.minSuccessPct, where).toBeLessThanOrEqual(100);
    expect(p.toleranceCents, where).toBeGreaterThanOrEqual(10);
    expect(p.toleranceCents, where).toBeLessThanOrEqual(50);
  } else if (p.kind === 'ear-test') {
    expect(p.minQuestions, where).toBeGreaterThan(0);
  } else {
    expect(p.items.length, where).toBeGreaterThan(0);
  }
}

describe('curriculum content', () => {
  it('has four levels in order', () => {
    expect(LEVELS.map((l) => l.id)).toEqual([1, 2, 3, 4]);
  });

  it('has unique lesson ids', () => {
    const ids = ALL_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const level of LEVELS) {
    describe(`Level ${level.id}: ${level.title}`, () => {
      it('has substantial lessons and a checkpoint', () => {
        expect(level.lessons.length).toBeGreaterThanOrEqual(6);
        expect(level.checkpoint.requirements.length).toBeGreaterThan(0);
        level.checkpoint.requirements.forEach((r) => checkPractical(r, `L${level.id} checkpoint`));
      });

      for (const lesson of level.lessons) {
        it(`lesson ${lesson.id} is complete and valid`, () => {
          const w = lesson.id;
          expect(lesson.level).toBe(level.id);
          expect(lesson.id).toMatch(new RegExp(`^l${level.id}-[a-z0-9-]+$`));
          expect(lesson.title.length).toBeGreaterThan(3);
          expect(lesson.objective.length).toBeGreaterThan(10);
          expect(lesson.explanation.hinglish.length, w).toBeGreaterThan(200);
          expect(lesson.explanation.english.length, w).toBeGreaterThan(200);
          expect(lesson.explanation.hindi?.length ?? 0, `${w} hindi`).toBeGreaterThan(200);
          expect(lesson.explanation.hindi, `${w} hindi script`).toMatch(/[\u0900-\u097F]/);
          expect(lesson.whyItMatters.length).toBeGreaterThan(20);
          expect(lesson.guidedSteps.length, w).toBeGreaterThanOrEqual(3);
          expect(lesson.mistakes.length, w).toBeGreaterThanOrEqual(2);
          expect(lesson.quiz.length, w).toBeGreaterThanOrEqual(3);
          lesson.quiz.forEach((q, i) => {
            expect(q.options.length, `${w} q${i}`).toBeGreaterThanOrEqual(2);
            expect(q.answerIndex, `${w} q${i}`).toBeGreaterThanOrEqual(0);
            expect(q.answerIndex, `${w} q${i}`).toBeLessThan(q.options.length);
            expect(q.explanation.length, `${w} q${i}`).toBeGreaterThan(5);
          });
          expect(lesson.videoQueries.length, w).toBeGreaterThanOrEqual(1);
          expect(lesson.nextStep.length).toBeGreaterThan(5);
          expect(lesson.independentPractice.durationMin).toBeGreaterThan(0);
          (lesson.independentPractice.pattern ?? []).forEach((t) =>
            expect(isValidSwaraToken(t), `${w} pattern token "${t}"`).toBe(true),
          );
          lesson.demos.forEach((d) => {
            demoTokens(d).forEach((t) => expect(isValidSwaraToken(t), `${w} demo token "${t}"`).toBe(true));
            if (d.kind === 'taal') expect(TAALS[d.taal], w).toBeDefined();
            if (d.kind === 'sequence') expect(d.bpm, w).toBeGreaterThan(20);
          });
          if (lesson.practical) checkPractical(lesson.practical, w);
        });
      }
    });
  }
});
