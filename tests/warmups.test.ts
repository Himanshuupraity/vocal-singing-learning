import { WARMUPS, routineSeconds } from '../src/data/warmups';
import { isValidSwaraToken, parseSwara } from '../src/music/theory';

describe('warm-up routines', () => {
  it('last about as long as their names say', () => {
    const mins = Object.fromEntries(WARMUPS.map((r) => [r.id, routineSeconds(r) / 60]));
    expect(mins.quick).toBeCloseTo(3, 0);
    expect(mins.standard).toBeCloseTo(5, 0);
    expect(mins.gentle).toBeCloseTo(4, 0);
    expect(mins.cooldown).toBeCloseTo(2, 0);
  });

  it('have every step in all three languages, with valid notes', () => {
    for (const r of WARMUPS)
      for (const s of r.steps) {
        for (const lang of ['english', 'hinglish', 'hindi'] as const) {
          expect(s.title[lang], `${r.id}/${s.id} ${lang}`).toBeTruthy();
          expect(s.how[lang]).toBeTruthy();
          expect(s.say[lang]).toBeTruthy();
        }
        if (s.guide.kind === 'pattern') expect(s.guide.notes.every(isValidSwaraToken)).toBe(true);
        if (s.guide.kind === 'siren') expect([s.guide.from, s.guide.to].every(isValidSwaraToken)).toBe(true);
      }
  });

  it('keeps the gentle routine low and soft', () => {
    const gentle = WARMUPS.find((r) => r.id === 'gentle')!;
    const highest = Math.max(
      ...gentle.steps.flatMap((s) => (s.guide.kind === 'pattern' ? s.guide.notes : s.guide.kind === 'siren' ? [s.guide.from, s.guide.to] : [])).filter((t) => t !== '-').map((t) => parseSwara(t)!.semitones),
    );
    expect(highest).toBeLessThanOrEqual(4); // up to Ga
    expect(gentle.steps.some((s) => s.id === 'trill' || s.id === 'sargam')).toBe(false);
  });
});
