import { makeInterval, makeSequence } from '../src/lib/patterns';
import { parseSwara } from '../src/music/theory';

describe('pattern generators', () => {
  const targets = ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"];
  it('intervals are two different notes within a Pa', () => {
    for (let k = 0; k < 200; k++) {
      const [a, b] = makeInterval(targets);
      expect(a).not.toBe(b);
      expect(Math.abs(parseSwara(a)!.semitones - parseSwara(b)!.semitones)).toBeLessThanOrEqual(7);
    }
  });
  it('sequences have the requested length, use target notes and never repeat consecutively', () => {
    for (let k = 0; k < 200; k++) {
      const s = makeSequence(targets, 4);
      expect(s).toHaveLength(4);
      s.forEach((t, i) => {
        expect(targets).toContain(t);
        if (i) expect(t).not.toBe(s[i - 1]);
      });
    }
  });
});
