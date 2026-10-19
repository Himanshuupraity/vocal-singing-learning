import { ALANKARS, ALANKAR_SCALES, makeAlankar, nextBpm } from '../src/music/alankar';
import { analyzeGlide, analyzeLongNote, analyzeOscillation } from '../src/music/meend';
import { DICTATION_LEVELS, makeDictation, scoreDictation } from '../src/music/dictation';
import { EXERCISES } from '../src/data/exercises';
import { isValidSwaraToken } from '../src/music/theory';
import type { TrackPoint } from '../src/music/melody';

const HOP = 0.05;
/** A pitch track from [semitones, seconds] segments; a segment given as [a, b, sec] glides linearly from a to b. */
function track(parts: ([number, number] | [number, number, number])[], start = 0): TrackPoint[] {
  const out: TrackPoint[] = [];
  let t = start;
  for (const p of parts) {
    const [a, b, sec] = p.length === 3 ? p : [p[0], p[0], p[1]];
    const n = Math.round(sec / HOP);
    for (let i = 0; i < n; i++, t += HOP) out.push({ t, semis: a + ((b - a) * i) / Math.max(1, n - 1) });
  }
  return out;
}

describe('alankars', () => {
  const shuddh = ALANKAR_SCALES[0].notes;

  it('match the hand-written alankars in the exercise library', () => {
    for (const [id, shape] of [
      ['al-3', [0, 1, 2]],
      ['al-4', [0, 1, 2, 3]],
      ['al-skip', [0, 2]],
    ] as const) {
      const a = makeAlankar(shuddh, [...shape]);
      expect([...a.aroha, ...a.avaroha], id).toEqual(EXERCISES.find((e) => e.id === id)!.pattern);
    }
  });

  it('builds every alankar on every scale with valid notes, never above taar Sa', () => {
    for (const sc of ALANKAR_SCALES)
      for (const al of ALANKARS) {
        const { aroha, avaroha } = makeAlankar(sc.notes, al.shape);
        expect(aroha.length, `${sc.id}/${al.id}`).toBeGreaterThan(0);
        expect([...aroha, ...avaroha].every(isValidSwaraToken)).toBe(true);
        expect(aroha[0]).toBe('S');
        expect(avaroha[0]).toBe("S'");
      }
    expect(makeAlankar(['S', 'R', 'G', 'P', 'D'], [0, 1]).aroha).toEqual(['S', 'R', 'R', 'G', 'G', 'P', 'P', 'D', 'D', "S'"]);
  });

  it('raises the tempo after a clean run and lowers it after a poor one', () => {
    expect(nextBpm(60, 85)).toBe(70);
    expect(nextBpm(60, 65)).toBe(60);
    expect(nextBpm(60, 30)).toBe(50);
    expect(nextBpm(40, 0)).toBe(40);
    expect(nextBpm(160, 100)).toBe(160);
  });
});

describe('meend analysis', () => {
  it('passes a clean glide from Sa to Pa', () => {
    const r = analyzeGlide(track([[0, 1], [0, 7, 1.5], [7, 1]]), 0, 7);
    expect(r.landed).toBe(true);
    expect(r.startCents).toBe(0);
    expect(r.landCents).toBe(0);
    expect(r.stops).toEqual([]);
    expect(r.reversals).toBe(0);
    expect(r.breaks).toBe(0);
    expect(r.overshootCents).toBe(0);
    expect(r.glideSec).toBeGreaterThan(1);
  });

  it('notices stopping on the notes in between (steps instead of a glide)', () => {
    const r = analyzeGlide(track([[0, 1], [2, 0.5], [4, 0.5], [5, 0.4], [7, 1]]), 0, 7);
    expect(r.stops).toEqual([2, 4, 5]);
    expect(r.breaks).toBe(0);
  });

  it('notices overshooting and not landing, an octave lower too', () => {
    const over = analyzeGlide(track([[-12, 1], [-12, -4, 0.8], [-4, -5, 0.3], [-5, 1]]), 0, 7);
    expect(over.landed).toBe(true);
    expect(over.overshootCents).toBeGreaterThanOrEqual(90);
    const short = analyzeGlide(track([[7, 1], [7, 1.5, 1], [1.5, 1]]), 7, 0);
    expect(short.landed).toBe(false);
    expect(short.landCents).toBeNull();
  });

  it('counts a voice break as a sudden jump', () => {
    expect(analyzeGlide(track([[0, 1], [0, 2, 0.4], [6, 7, 0.4], [7, 1]]), 0, 7).breaks).toBe(1);
  });
});

describe('gamak / andolan analysis', () => {
  const wave = (lower: number, upper: number, hz: number, sec: number): TrackPoint[] =>
    Array.from({ length: Math.round(sec / HOP) }, (_, i) => ({ t: i * HOP, semis: (lower + upper) / 2 + ((upper - lower) / 2) * Math.sin(2 * Math.PI * hz * i * HOP) }));

  it('measures speed, size and evenness of the swings', () => {
    const r = analyzeOscillation(wave(2, 4, 2, 4), 2, 4)!;
    expect(r.rateHz).toBeCloseTo(2, 0);
    expect(r.cycles).toBeGreaterThanOrEqual(6);
    expect(r.extentSemis).toBeCloseTo(2, 0);
    expect(r.regularityPct).toBeGreaterThan(80);
    expect(Math.abs(r.topCents)).toBeLessThan(20);
  });

  it('reports swings that are too narrow', () => {
    const r = analyzeOscillation(wave(2.5, 3.5, 2, 4), 2, 4)!;
    expect(r.extentSemis).toBeCloseTo(1, 0);
    expect(r.topCents).toBeLessThan(-30);
  });

  it('returns null for a steady note', () => {
    expect(analyzeOscillation(track([[3, 3]]), 2, 4)).toBeNull();
  });
});

describe('long note', () => {
  it('times the longest unbroken hold and its steadiness', () => {
    const r = analyzeLongNote([...track([[0.1, 2]]), ...track([[0.1, 12]], 3)], 0)!;
    expect(r.sec).toBeCloseTo(12, 0);
    expect(r.cents).toBe(10);
    expect(r.inTunePct).toBe(100);
    expect(r.steadinessCents).toBeLessThan(5);
  });

  it('counts an octave-lower hold against the same swara', () => {
    expect(analyzeLongNote(track([[-11.6, 5]]), 0)!.cents).toBe(40);
  });
});

describe('sargam dictation', () => {
  it('makes phrases of the level’s length from its notes', () => {
    DICTATION_LEVELS.forEach((L, level) => {
      for (let i = 0; i < 30; i++) {
        const d = makeDictation(level);
        expect(d.notes).toHaveLength(L.length);
        expect(d.notes.every((n) => d.choices.includes(n)), d.notes.join(' ')).toBe(true);
      }
    });
    expect(makeDictation(0).choices).toEqual(['S', 'R', 'G', 'm', 'P']);
  });

  it('scores each position', () => {
    expect(scoreDictation(['S', 'R', 'G'], ['S', 'G', 'G'])).toEqual({ correct: 2, perNote: [true, false, true], allRight: false });
    expect(scoreDictation(['S', 'R'], ['S', 'R']).allRight).toBe(true);
  });
});
