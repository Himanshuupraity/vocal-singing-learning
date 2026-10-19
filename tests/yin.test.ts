import { describe, expect, it } from 'vitest';
import { yin } from '../src/audio/yin';
import { analyzeFrame, OctaveSmoother, scoreAttempt, verdictFor, type PitchFrame } from '../src/audio/pitchAnalysis';

const SR = 44100;
const N = 2048;

function tone(freq: number, opts: { harmonics?: number[]; noise?: number; amp?: number } = {}) {
  const { harmonics = [1], noise = 0, amp = 0.5 } = opts;
  const b = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let v = 0;
    harmonics.forEach((h, k) => (v += h * Math.sin((2 * Math.PI * freq * (k + 1) * i) / SR)));
    b[i] = amp * v + noise * (Math.random() * 2 - 1);
  }
  return b;
}

const cents = (a: number, b: number) => 1200 * Math.log2(a / b);

describe('YIN pitch detection', () => {
  for (const f of [82.41, 110, 130.81, 196, 261.63, 329.63, 440, 659.25, 880]) {
    it(`detects a pure ${f} Hz tone within 5 cents`, () => {
      const r = yin(tone(f), { sampleRate: SR });
      expect(r).not.toBeNull();
      expect(Math.abs(cents(r!.freq, f))).toBeLessThan(5);
      expect(r!.confidence).toBeGreaterThan(0.9);
    });
  }

  it('detects the fundamental of a harmonically rich (voice-like) tone', () => {
    const f = 146.83;
    const r = yin(tone(f, { harmonics: [0.6, 1, 0.8, 0.5, 0.3, 0.2] }), { sampleRate: SR });
    expect(Math.abs(cents(r!.freq, f))).toBeLessThan(10);
  });

  it('handles moderate noise', () => {
    const f = 220;
    const r = yin(tone(f, { noise: 0.05 }), { sampleRate: SR });
    expect(Math.abs(cents(r!.freq, f))).toBeLessThan(10);
  });

  it('reports low confidence for white noise', () => {
    const b = new Float32Array(N).map(() => Math.random() * 2 - 1);
    const r = yin(b, { sampleRate: SR });
    expect(r === null || r.confidence < 0.85).toBe(true);
  });
});

describe('frame gating', () => {
  it('treats silence as silent, not as an error', () => {
    expect(analyzeFrame(new Float32Array(N), SR, 0).status).toBe('silent');
  });
  it('treats noise as unvoiced', () => {
    const b = new Float32Array(N).map(() => (Math.random() * 2 - 1) * 0.3);
    expect(analyzeFrame(b, SR, 0).status).not.toBe('voiced');
  });
  it('marks a clean tone as voiced', () => {
    expect(analyzeFrame(tone(220), SR, 0).status).toBe('voiced');
  });
});

describe('octave smoothing', () => {
  it('folds isolated octave jumps back', () => {
    const s = new OctaveSmoother();
    [200, 201, 199, 200].forEach((f) => s.push(f));
    expect(s.push(400)).toBeCloseTo(200, 0);
    expect(s.push(100)).toBeCloseTo(200, 0);
  });
});

describe('attempt scoring', () => {
  const frames = (freqs: number[]): PitchFrame[] => freqs.map((f, i) => ({ t: i * 0.046, status: 'voiced', freq: f, confidence: 0.95, level: 0.1 }));
  const target = 261.63;

  it('matches an accurate held note', () => {
    const r = scoreAttempt(frames(Array(40).fill(target * Math.pow(2, 10 / 1200))), target);
    expect(r.reliable).toBe(true);
    expect(r.matched).toBe(true);
    expect(Math.round(r.medianCents)).toBe(10);
  });

  it('flags a flat note', () => {
    const r = scoreAttempt(frames(Array(40).fill(target * Math.pow(2, -80 / 1200))), target);
    expect(r.matched).toBe(false);
    expect(verdictFor(r.medianCents)).toBe('flat');
  });

  it('accepts the same swara an octave lower and reports the offset', () => {
    const r = scoreAttempt(frames(Array(40).fill(target / 2)), target);
    expect(r.matched).toBe(true);
    expect(r.octaveOffset).toBe(-1);
  });

  it('does not score silence-only attempts', () => {
    const silent: PitchFrame[] = Array(40).fill(0).map((_, i) => ({ t: i, status: 'silent', level: 0 }));
    const r = scoreAttempt(silent, target);
    expect(r.reliable).toBe(false);
    expect(r.matched).toBe(false);
  });

  it('marks very short attempts unreliable', () => {
    const r = scoreAttempt(frames(Array(8).fill(target)), target);
    expect(r.reliable).toBe(false);
  });
});

describe('low voices', () => {
  it('detects 62 Hz (deep kharaj range) through analyzeFrame', () => {
    const f = 62.5;
    const b = new Float32Array(4096);
    for (let i = 0; i < b.length; i++) b[i] = 0.4 * Math.sin((2 * Math.PI * f * i) / SR);
    const fr = analyzeFrame(b.subarray(0, 2048), SR, 0);
    expect(fr.status).toBe('voiced');
    expect(Math.abs(cents(fr.freq!, f))).toBeLessThan(10);
  });
});

import { analyzeSamples } from '../src/audio/offlineAnalysis';

describe('offline recording analysis', () => {
  it('finds the sung swaras and their tuning in a synthetic recording', () => {
    const sr = 22050;
    const tonic = { note: 'C' as const, octave: 3 };
    const sa = 130.81;
    const seg = (f: number, sec: number, amp = 0.4) => Float32Array.from({ length: Math.round(sec * sr) }, (_, i) => amp * Math.sin((2 * Math.PI * f * i) / sr));
    const parts = [seg(sa, 1.5), seg(0, 0.5, 0), seg(sa * Math.pow(2, 4 / 12) * Math.pow(2, -20 / 1200), 1.5), seg(sa * 1.5, 1)];
    const all = new Float32Array(parts.reduce((s, p) => s + p.length, 0));
    let o = 0;
    for (const p of parts) (all.set(p, o), (o += p.length));
    const a = analyzeSamples(all, sr, tonic);
    const tokens = a.swaras.map((s) => s.token);
    expect(tokens).toEqual(expect.arrayContaining(['S', 'G', 'P']));
    const ga = a.swaras.find((s) => s.token === 'G')!;
    expect(ga.avgCents).toBeGreaterThan(-25);
    expect(ga.avgCents).toBeLessThan(-15);
    expect(a.voicedSec).toBeGreaterThan(3.3);
    expect(a.voicedSec).toBeLessThan(4.2);
    expect(a.lowestToken).toBe('S');
    expect(a.highestToken).toBe('P');
  });
});

import { renderPluck } from '../src/audio/pluck';

describe('Karplus–Strong tanpura string', () => {
  for (const f of [65.41, 130.81, 196, 261.63, 392]) {
    it(`is tuned within 3 cents at ${f} Hz`, () => {
      const sr = 44100;
      const s = renderPluck(f, sr, 1.5);
      expect(s.some((x) => !Number.isFinite(x))).toBe(false);
      const r = yin(s.subarray(Math.round(0.5 * sr), Math.round(0.5 * sr) + 4096), { sampleRate: sr, minFreq: 50 });
      expect(r).not.toBeNull();
      expect(Math.abs(cents(r!.freq, f))).toBeLessThan(3);
    });
  }
  it('decays over time (a pluck, not a sustained tone)', () => {
    const s = renderPluck(130.81, 44100, 4);
    const rmsAt = (t: number) => Math.sqrt(s.subarray(t * 44100, t * 44100 + 4410).reduce((a, x) => a + x * x, 0) / 4410);
    expect(rmsAt(3)).toBeLessThan(rmsAt(0.2));
  });
});
