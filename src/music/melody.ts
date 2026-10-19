import type { PitchFrame } from '../audio/pitchAnalysis';
import { median } from '../audio/pitchAnalysis';
import { freqToMidiFloat, SWARA_LETTERS, tonicMidi, type SwaraToken, type Tonic } from './theory';

/** One held note found in a pitch track. `midi` is the nearest semitone; cents is the median offset from it. */
export interface NoteEvent {
  midi: number;
  start: number;
  dur: number;
  cents: number;
}

/** "S", ".N", "P'", … for a number of semitones above (or below) madhya Sa. */
export function semitonesToToken(n: number): SwaraToken {
  const pc = ((n % 12) + 12) % 12;
  const oct = Math.floor(n / 12);
  const letter = SWARA_LETTERS[pc];
  return oct < 0 ? '.'.repeat(-oct) + letter : letter + "'".repeat(oct);
}

/**
 * Splits a pitch track into held notes. A note continues while the pitch stays
 * within ~70 cents of it (so vibrato and small wobbles don't split it); a gap
 * in clear voice longer than `maxGap` ends it. Notes shorter than `minDur` are
 * dropped: they are almost always slides between notes, not notes.
 */
export function segmentNotes(frames: PitchFrame[], opts: { minDur?: number; maxGap?: number; hop?: number } = {}): NoteEvent[] {
  const minDur = opts.minDur ?? 0.15;
  const maxGap = opts.maxGap ?? 0.1;
  const hop = opts.hop ?? 0.05;
  const out: NoteEvent[] = [];
  let cur: { midi: number; start: number; last: number; vals: number[] } | null = null;
  const close = () => {
    if (!cur) return;
    const dur = cur.last - cur.start + hop;
    if (dur >= minDur) out.push({ midi: cur.midi, start: cur.start, dur, cents: Math.round(median(cur.vals.map((v) => (v - cur!.midi) * 100))) });
    cur = null;
  };
  for (const f of frames) {
    if (f.status !== 'voiced' || !f.freq) {
      if (cur && f.t - cur.last > maxGap) close();
      continue;
    }
    const m = freqToMidiFloat(f.freq);
    if (cur && Math.abs(m - cur.midi) < 0.7 && f.t - cur.last <= maxGap + hop) {
      cur.last = f.t;
      cur.vals.push(m);
      continue;
    }
    close();
    cur = { midi: Math.round(m), start: f.t, last: f.t, vals: [m] };
  }
  close();
  return out;
}

// Krumhansl–Kessler key profiles: how strongly each scale degree belongs to a major / minor key.
const MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

/**
 * Best guess at a melody's Sa (pitch class 0–11, C = 0). Weighs how long each
 * note is held against major- and minor-like scale profiles, and gives the
 * last note extra weight because phrases very often end on Sa. A guess only —
 * the learner can change it.
 */
export function guessSaPitchClass(notes: NoteEvent[]): number {
  if (!notes.length) return 0;
  const hist = new Array(12).fill(0);
  for (const n of notes) hist[((n.midi % 12) + 12) % 12] += Math.min(n.dur, 2);
  const lastPc = ((notes[notes.length - 1].midi % 12) + 12) % 12;
  let best = 0;
  let bestScore = -Infinity;
  for (let c = 0; c < 12; c++) {
    for (const prof of [MAJOR, MINOR]) {
      let score = 0;
      for (let pc = 0; pc < 12; pc++) score += hist[pc] * prof[(pc - c + 12) % 12];
      if (lastPc === c) score *= 1.15;
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }
  }
  return best;
}

/**
 * Turns held notes into sargam, given the melody's Sa (pitch class). The Sa
 * octave is chosen so most notes land in the middle octave.
 */
export function notesToSargam(notes: NoteEvent[], saPc: number): SwaraToken[] {
  if (!notes.length) return [];
  const med = median(notes.map((n) => n.midi));
  const base = saPc + 12 * Math.round((med - saPc - 5) / 12);
  return notes.map((n) => semitonesToToken(n.midi - base));
}

/** Semitones of a frame above madhya Sa (fractional), for drawing and comparing. */
export function relSemitones(freq: number, tonic: Tonic): number {
  return freqToMidiFloat(freq) - tonicMidi(tonic);
}

/** A point of a pitch track: time (s) and semitones above Sa. */
export interface TrackPoint {
  t: number;
  semis: number;
}

/**
 * Scores the pitch sung during one note of a timed pattern. Only the middle of
 * the note's time slot should be passed in, so the slide into and out of the
 * note isn't counted. Singing the same swara in another octave is fine.
 */
export function scoreNoteWindow(semis: number[], target: number, tolerance = 50): { cents: number; matched: boolean; reliable: boolean } {
  if (semis.length < 3) return { cents: NaN, matched: false, reliable: false };
  const raw = median(semis) - target;
  const oct = Math.round(raw / 12) * 12;
  const cents = Math.round((raw - oct) * 100);
  return { cents, matched: Math.abs(cents) <= tolerance, reliable: true };
}

/**
 * Compares two pitch tracks point by point. `mine` is moved by `offset`
 * seconds and the reference by `shift` semitones (for a reference sung on a
 * different Sa). Octave differences — e.g. a teacher with a higher voice —
 * are folded out, as the same swara in another octave is still the same swara.
 */
export function compareTracks(ref: TrackPoint[], mine: TrackPoint[], offset = 0, shift = 0, step = 0.05) {
  const byIdx = new Map<number, number>();
  for (const p of ref) byIdx.set(Math.round(p.t / step), p.semis + shift);
  const diffs: number[] = [];
  for (const p of mine) {
    const r = byIdx.get(Math.round((p.t + offset) / step));
    if (r !== undefined) diffs.push(p.semis - r);
  }
  if (diffs.length < 10) return null;
  const octave = Math.round(median(diffs) / 12) * 12;
  const folded = diffs.map((d) => d - octave);
  const abs = folded.map((d) => Math.abs(d) * 100);
  return {
    points: diffs.length,
    /** whole octaves between the two voices */
    octave: octave / 12,
    medianAbsCents: Math.round(median(abs)),
    withinPct: Math.round((abs.filter((c) => c <= 50).length / abs.length) * 100),
    /** + = you were higher than the reference overall */
    medianCents: Math.round(median(folded) * 100),
  };
}
