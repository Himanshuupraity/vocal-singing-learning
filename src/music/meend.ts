import { median } from '../audio/pitchAnalysis';
import type { TrackPoint } from './melody';

/** Half a semitone either side of a note counts as being "on" it. */
const BAND = 0.5;

export interface GlideResult {
  /** cents off the starting note while holding it (null if it was never held) */
  startCents: number | null;
  /** cents off the target note where the voice settled (null if it never settled there) */
  landCents: number | null;
  landed: boolean;
  /** seconds spent travelling between the two notes */
  glideSec: number;
  /** in-between notes (semitones above Sa) where the voice stopped instead of gliding through */
  stops: number[];
  /** times the pitch went back the wrong way by more than ~40 cents */
  reversals: number;
  /** sudden jumps of more than 2.5 semitones (a break or a skipped glide) */
  breaks: number;
  /** how far the voice went past the target before settling, in cents */
  overshootCents: number;
}

/** Moves a track by whole octaves so it sits around `ref` (singing a meend an octave lower is fine). */
export function foldTo(points: TrackPoint[], ref: number): TrackPoint[] {
  if (!points.length) return points;
  const head = points.slice(0, Math.max(3, Math.floor(points.length / 5))).map((p) => p.semis);
  const oct = Math.round((median(head) - ref) / 12) * 12;
  return points.map((p) => ({ ...p, semis: p.semis - oct }));
}

/**
 * Analyses a sung meend from `from` to `to` (semitones above Sa): hold the
 * first note, glide, land on the second and hold it. A good meend starts and
 * lands in tune, travels in one direction without stopping on the notes in
 * between, and doesn't overshoot.
 */
export function analyzeGlide(raw: TrackPoint[], from: number, to: number): GlideResult {
  const pts = foldTo(raw, from);
  const empty: GlideResult = { startCents: null, landCents: null, landed: false, glideSec: 0, stops: [], reversals: 0, breaks: 0, overshootCents: 0 };
  if (pts.length < 6) return empty;
  const dir = Math.sign(to - from) || 1;
  const near = (v: number, n: number) => Math.abs(v - n) <= BAND;

  let startEnd = 0;
  while (startEnd < pts.length && near(pts[startEnd].semis, from)) startEnd++;
  let landStart = pts.length;
  while (landStart > 0 && near(pts[landStart - 1].semis, to)) landStart--;
  const held = (xs: TrackPoint[]) => xs.length >= 3;
  const startPts = pts.slice(0, startEnd);
  const landPts = pts.slice(landStart);
  const landed = held(landPts);
  const middle = pts.slice(startEnd, landed ? landStart : pts.length);

  let reversals = 0;
  let breaks = 0;
  let extreme = pts[Math.max(0, startEnd - 1)].semis;
  for (let i = 0; i < middle.length; i++) {
    const v = middle[i].semis;
    const prev = i ? middle[i - 1] : pts[Math.max(0, startEnd - 1)];
    if (Math.abs(v - prev.semis) > 2.5 && middle[i].t - prev.t < 0.15) breaks++;
    if ((v - extreme) * dir > 0) extreme = v;
    else if ((extreme - v) * dir > 0.4) {
      reversals++;
      extreme = v;
    }
  }

  // Stops: a run of ≥ 0.25 s parked on one in-between semitone.
  const stops: number[] = [];
  const lo = Math.min(from, to);
  const hi = Math.max(from, to);
  for (let i = 0; i < middle.length; ) {
    const n = Math.round(middle[i].semis);
    let j = i;
    while (j < middle.length && Math.abs(middle[j].semis - n) <= 0.3) j++;
    const sec = j > i ? middle[j - 1].t - middle[i].t : 0;
    if (n > lo && n < hi && sec >= 0.25 && !stops.includes(n)) stops.push(n);
    i = Math.max(j, i + 1);
  }

  const past = landed ? Math.max(0, ...pts.slice(startEnd).map((p) => (p.semis - to) * dir)) : 0;
  const glideStart = startPts.length ? startPts[startPts.length - 1].t : pts[0].t;
  const glideEnd = landed ? landPts[0].t : pts[pts.length - 1].t;
  return {
    startCents: held(startPts) ? Math.round((median(startPts.map((p) => p.semis)) - from) * 100) : null,
    landCents: landed ? Math.round((median(landPts.map((p) => p.semis)) - to) * 100) : null,
    landed,
    glideSec: Math.max(0, Math.round((glideEnd - glideStart) * 10) / 10),
    stops,
    reversals,
    breaks,
    overshootCents: past > 0.4 ? Math.round(past * 100) : 0,
  };
}

export interface OscillationResult {
  cycles: number;
  rateHz: number;
  /** median distance between the tops and bottoms of the swings, in semitones */
  extentSemis: number;
  /** how even the swings are in time: 100 = perfectly regular */
  regularityPct: number;
  /** where the tops land relative to the upper note, in cents */
  topCents: number;
  /** where the bottoms land relative to the lower note, in cents */
  bottomCents: number;
}

/**
 * Analyses a gamak/andolan-style oscillation between `lower` and `upper`
 * (semitones above Sa): counts the swings, their speed, size and evenness,
 * and how close the tops and bottoms come to the two notes.
 */
export function analyzeOscillation(raw: TrackPoint[], lower: number, upper: number): OscillationResult | null {
  const pts = foldTo(raw, (lower + upper) / 2);
  if (pts.length < 10) return null;
  const peaks: TrackPoint[] = [];
  const troughs: TrackPoint[] = [];
  let up = pts[1].semis >= pts[0].semis;
  let ext = pts[0];
  for (const p of pts) {
    if (up ? p.semis >= ext.semis : p.semis <= ext.semis) ext = p;
    else if (Math.abs(p.semis - ext.semis) > 0.3) {
      (up ? peaks : troughs).push(ext);
      up = !up;
      ext = p;
    }
  }
  if (peaks.length < 2 || troughs.length < 2) return null;
  const top = median(peaks.map((p) => p.semis));
  const bottom = median(troughs.map((p) => p.semis));
  const gaps = peaks.slice(1).map((p, i) => p.t - peaks[i].t);
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const sd = Math.sqrt(gaps.reduce((a, g) => a + (g - mean) ** 2, 0) / gaps.length);
  return {
    cycles: peaks.length,
    rateHz: Math.round((1 / mean) * 10) / 10,
    extentSemis: Math.round((top - bottom) * 10) / 10,
    regularityPct: Math.max(0, Math.round((1 - sd / mean) * 100)),
    topCents: Math.round((top - upper) * 100),
    bottomCents: Math.round((bottom - lower) * 100),
  };
}

export interface LongNoteResult {
  /** longest continuous sung stretch, seconds (gaps under 0.3 s are breaths of air, not stops) */
  sec: number;
  /** cents spread (interquartile range) while holding — lower = steadier */
  steadinessCents: number;
  /** % of the hold within ±25 cents of the target */
  inTunePct: number;
  /** median offset from the target, cents */
  cents: number;
}

/** Scores one long held note against `target` (semitones above Sa). */
export function analyzeLongNote(raw: TrackPoint[], target: number): LongNoteResult | null {
  if (raw.length < 5) return null;
  // Longest run without a gap over 0.3 s.
  let best: TrackPoint[] = [];
  let cur: TrackPoint[] = [raw[0]];
  for (let i = 1; i < raw.length; i++) {
    if (raw[i].t - raw[i - 1].t > 0.3) {
      if (cur.length > best.length) best = cur;
      cur = [];
    }
    cur.push(raw[i]);
  }
  if (cur.length > best.length) best = cur;
  const pts = foldTo(best, target);
  // Skip the first 0.3 s: settling into the note.
  const steady = pts.filter((p) => p.t - pts[0].t >= 0.3);
  const use = steady.length >= 5 ? steady : pts;
  const cents = use.map((p) => (p.semis - target) * 100);
  const sorted = [...cents].sort((a, b) => a - b);
  return {
    sec: Math.round((best[best.length - 1].t - best[0].t) * 10) / 10,
    steadinessCents: Math.round(sorted[Math.floor(sorted.length * 0.75)] - sorted[Math.floor(sorted.length * 0.25)]),
    inTunePct: Math.round((cents.filter((c) => Math.abs(c) <= 25).length / cents.length) * 100),
    cents: Math.round(median(cents)),
  };
}
