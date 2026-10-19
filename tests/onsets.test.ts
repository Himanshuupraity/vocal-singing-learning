import { detectOnsets, offsetsToBeats } from '../src/audio/onsets';

describe('onset detection', () => {
  it('detects each sung syllable once', () => {
    const levels: { t: number; rms: number }[] = [];
    for (let t = 0; t < 3000; t += 10) {
      const inNote = [0, 1000, 2000].some((s) => t >= s + 20 && t < s + 400);
      levels.push({ t, rms: inNote ? 0.1 + (t % 30 === 0 ? 0.05 : 0) : 0.005 });
    }
    expect(detectOnsets(levels)).toEqual([20, 1020, 2020]);
  });
  it('ignores sustained flutter (hysteresis)', () => {
    const levels = Array.from({ length: 100 }, (_, i) => ({ t: i * 10, rms: i % 2 ? 0.05 : 0.035 }));
    expect(detectOnsets(levels)).toHaveLength(1);
  });
  it('matches onsets to beats', () => {
    expect(offsetsToBeats([1010, 1990, 3500], [1000, 2000, 3000], 1000)).toEqual([10, -10]);
  });
});
