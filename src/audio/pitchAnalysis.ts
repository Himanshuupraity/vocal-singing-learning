import { centsBetween, freqToMidiFloat, midiToNoteName } from '../music/theory';
import { rms, yin } from './yin';

/**
 * Frame-level gating. A frame is only "voiced" (and therefore eligible for
 * scoring) when it is loud enough AND YIN is confident it is periodic.
 * Silence, breaths and background noise are therefore never counted as
 * singing errors.
 */
export const GATE = {
  /** RMS level below which the frame is treated as silence. */
  minRms: 0.01,
  /** Minimum YIN confidence (1 − d') for a voiced frame. */
  minConfidence: 0.85,
};

export type FrameStatus = 'silent' | 'unvoiced' | 'voiced';

export interface PitchFrame {
  t: number;
  status: FrameStatus;
  freq?: number;
  confidence?: number;
  level: number;
}

export function analyzeFrame(buffer: Float32Array, sampleRate: number, t: number, gate = GATE): PitchFrame {
  const level = rms(buffer);
  if (level < gate.minRms) return { t, status: 'silent', level };
  const est = yin(buffer, { sampleRate, minFreq: 50, maxFreq: 1200 });
  if (!est || est.confidence < gate.minConfidence) {
    return { t, status: 'unvoiced', level, confidence: est?.confidence };
  }
  return { t, status: 'voiced', freq: est.freq, confidence: est.confidence, level };
}

/**
 * Smooths octave jumps: if a frame is ~±1200 cents from the median of the
 * recent voiced frames, it is most likely a YIN octave error, so we fold it
 * back. Sustained genuine octave changes win once they dominate the window.
 */
export class OctaveSmoother {
  private recent: number[] = [];
  constructor(private size = 7) {}
  push(freq: number): number {
    let out = freq;
    if (this.recent.length >= 3) {
      const med = median(this.recent);
      const c = centsBetween(freq, med);
      if (Math.abs(c - 1200) < 80) out = freq / 2;
      else if (Math.abs(c + 1200) < 80) out = freq * 2;
    }
    this.recent.push(freq);
    if (this.recent.length > this.size) this.recent.shift();
    return out;
  }
  reset() {
    this.recent = [];
  }
}

export function median(xs: number[]): number {
  if (xs.length === 0) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function describeFreq(freq: number) {
  const midiF = freqToMidiFloat(freq);
  const nearest = Math.round(midiF);
  return { ...midiToNoteName(nearest), midi: nearest, cents: (midiF - nearest) * 100 };
}

export type Verdict = 'on-target' | 'close' | 'flat' | 'sharp';

/** Plain-language interpretation of a cents deviation. */
export function verdictFor(cents: number, tolerance = 50): Verdict {
  const a = Math.abs(cents);
  if (a <= Math.min(20, tolerance)) return 'on-target';
  if (a <= tolerance) return 'close';
  return cents < 0 ? 'flat' : 'sharp';
}

export interface AttemptResult {
  targetFreq: number;
  /** number of voiced frames used */
  voicedFrames: number;
  totalFrames: number;
  /** median cents vs target (after octave handling) */
  medianCents: number;
  /** % of voiced frames within tolerance */
  withinPct: number;
  /** cents spread (interquartile range) — a rough stability measure */
  stabilityCents: number;
  /** whether the voice was an octave (or two) away from the target */
  octaveOffset: number;
  matched: boolean;
  tolerance: number;
  reliable: boolean;
}

/**
 * Scores one pitch-matching attempt.
 *
 * METRIC DEFINITION (shown to learners):
 * - Only voiced frames (loud enough + confidently periodic) are used.
 * - The first 300 ms of voiced sound is skipped, so the natural "settling"
 *   into a note isn't penalised.
 * - Each voiced frame's cents deviation from the target is computed. If the
 *   learner sang the same swara in a different octave, we report that
 *   separately (octaveOffset) and score the pitch class — singing Sa an
 *   octave lower than the reference is still singing Sa.
 * - matched = median deviation within ±tolerance AND at least 60% of frames
 *   within ±tolerance.
 * - The attempt is "reliable" only with ≥ 0.6 s of voiced audio. Unreliable
 *   attempts are not counted toward progress.
 */
export function scoreAttempt(frames: PitchFrame[], targetFreq: number, tolerance = 50, frameDurSec = 0.046): AttemptResult {
  const voiced = frames.filter((f) => f.status === 'voiced' && f.freq);
  const skip = Math.ceil(0.3 / frameDurSec);
  const used = voiced.slice(Math.min(skip, Math.max(0, voiced.length - 5)));
  const rawCents = used.map((f) => centsBetween(f.freq!, targetFreq));
  const base: AttemptResult = {
    targetFreq,
    voicedFrames: used.length,
    totalFrames: frames.length,
    medianCents: NaN,
    withinPct: 0,
    stabilityCents: NaN,
    octaveOffset: 0,
    matched: false,
    tolerance,
    reliable: false,
  };
  if (used.length === 0) return base;
  const octaveOffset = Math.round(median(rawCents) / 1200);
  const cents = rawCents.map((c) => c - octaveOffset * 1200);
  const med = median(cents);
  const within = cents.filter((c) => Math.abs(c) <= tolerance).length / cents.length;
  const sorted = [...cents].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const reliable = used.length * frameDurSec >= 0.6;
  return {
    ...base,
    medianCents: med,
    withinPct: Math.round(within * 100),
    stabilityCents: q3 - q1,
    octaveOffset,
    matched: reliable && Math.abs(med) <= tolerance && within >= 0.6,
    reliable,
  };
}

export function explainAttempt(r: AttemptResult): string {
  if (!r.reliable) {
    return r.voicedFrames === 0
      ? "I couldn't hear a clear sung note. Try singing a little louder and closer to the mic, on an open “aa” sound."
      : 'The note was too short or unsteady to measure reliably. Try holding it for 2–3 seconds.';
  }
  const parts: string[] = [];
  const c = Math.round(r.medianCents);
  if (r.matched) {
    parts.push(Math.abs(c) <= 20 ? `Well matched — your pitch was within ${Math.abs(c)} cents of the target.` : `Matched — you were ${Math.abs(c)} cents ${c < 0 ? 'flat (slightly low)' : 'sharp (slightly high)'}, which is inside the ±${r.tolerance} cent range.`);
  } else if (Math.abs(c) > r.tolerance) {
    parts.push(`Not quite — you were about ${Math.abs(c)} cents ${c < 0 ? 'flat (below)' : 'sharp (above)'} the target. ${c < 0 ? 'Try aiming a little higher.' : 'Try relaxing and aiming a little lower.'}`);
    if (Math.abs(c) > 100) parts.push(`That's more than a semitone away (100 cents = one semitone), so you may be on a neighbouring note.`);
  } else {
    parts.push(`Your average was close (${c > 0 ? '+' : ''}${c} cents), but only ${r.withinPct}% of the held note stayed in range — the pitch wavered. Try a softer, steadier tone.`);
  }
  if (r.octaveOffset !== 0) {
    parts.push(`You sang the same note ${Math.abs(r.octaveOffset)} octave${Math.abs(r.octaveOffset) > 1 ? 's' : ''} ${r.octaveOffset < 0 ? 'lower' : 'higher'} than the reference — that's fine and still counts as the right swara.`);
  }
  return parts.join(' ');
}
