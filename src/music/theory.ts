/**
 * Core music theory for SurSadhana.
 *
 * Sargam notation used throughout the app (Bhatkhande-style letters):
 *   S  = Sa (shuddh, the tonic — always fixed once chosen)
 *   r  = komal Re      R = shuddh Re
 *   g  = komal Ga      G = shuddh Ga
 *   m  = shuddh Ma     M = teevra Ma
 *   P  = Pa (fixed)
 *   d  = komal Dha     D = shuddh Dha
 *   n  = komal Ni      N = shuddh Ni
 * Octave (saptak) marks:
 *   ".N"  → mandra saptak (lower octave), prefix "."
 *   "S'"  → taar saptak (upper octave), suffix "'"
 *   no mark → madhya saptak (middle octave)
 *   "-"   → rest / hold (one beat of silence in a sequence)
 *
 * We use 12-tone equal temperament for playback. Formal Hindustani practice
 * tunes some swaras slightly differently (shruti), which the lessons explain.
 */

export const SWARA_LETTERS = ['S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N'] as const;
export type SwaraLetter = (typeof SWARA_LETTERS)[number];

/** A sargam token like "S", "r", ".N", "S'", or "-" for a rest. */
export type SwaraToken = string;

export const SWARA_SEMITONES: Record<SwaraLetter, number> = {
  S: 0, r: 1, R: 2, g: 3, G: 4, m: 5, M: 6, P: 7, d: 8, D: 9, n: 10, N: 11,
};

export const SWARA_NAMES: Record<SwaraLetter, { short: string; full: string; type: 'achal' | 'shuddh' | 'komal' | 'teevra' }> = {
  S: { short: 'Sa', full: 'Shadja (Sa)', type: 'achal' },
  r: { short: 'Re♭', full: 'Komal Rishabh (Re)', type: 'komal' },
  R: { short: 'Re', full: 'Shuddh Rishabh (Re)', type: 'shuddh' },
  g: { short: 'Ga♭', full: 'Komal Gandhar (Ga)', type: 'komal' },
  G: { short: 'Ga', full: 'Shuddh Gandhar (Ga)', type: 'shuddh' },
  m: { short: 'Ma', full: 'Shuddh Madhyam (Ma)', type: 'shuddh' },
  M: { short: 'Ma♯', full: 'Teevra Madhyam (Ma)', type: 'teevra' },
  P: { short: 'Pa', full: 'Pancham (Pa)', type: 'achal' },
  d: { short: 'Dha♭', full: 'Komal Dhaivat (Dha)', type: 'komal' },
  D: { short: 'Dha', full: 'Shuddh Dhaivat (Dha)', type: 'shuddh' },
  n: { short: 'Ni♭', full: 'Komal Nishad (Ni)', type: 'komal' },
  N: { short: 'Ni', full: 'Shuddh Nishad (Ni)', type: 'shuddh' },
};

export const WESTERN_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type WesternNote = (typeof WESTERN_NOTES)[number];

export const A4 = 440;

export interface ParsedSwara {
  letter: SwaraLetter;
  /** -1 mandra, 0 madhya, +1 taar (can be ±2 for very low/high) */
  octave: number;
  /** semitones relative to madhya Sa */
  semitones: number;
}

export function parseSwara(token: SwaraToken): ParsedSwara | null {
  const t = token.trim();
  if (!t || t === '-') return null;
  const m = /^(\.*)([SrRgGmMPdDnN])('*)$/.exec(t);
  if (!m) throw new Error(`Invalid sargam token: "${token}"`);
  const letter = m[2] as SwaraLetter;
  const octave = m[3].length - m[1].length;
  return { letter, octave, semitones: SWARA_SEMITONES[letter] + octave * 12 };
}

export function isValidSwaraToken(token: string): boolean {
  if (token === '-') return true;
  try {
    return parseSwara(token) !== null;
  } catch {
    return false;
  }
}

/** Short label used on note chips: Sa, Re, komal Ga shown as "Ga(k)", etc. */
export function swaraLabel(token: SwaraToken): string {
  const p = parseSwara(token);
  if (!p) return '–';
  const n = SWARA_NAMES[p.letter];
  const base = n.short.replace('♭', '').replace('♯', '');
  const suffix = n.type === 'komal' ? '(k)' : n.type === 'teevra' ? '(t)' : '';
  const oct = p.octave < 0 ? '·'.repeat(-p.octave) : p.octave > 0 ? "'".repeat(p.octave) : '';
  return p.octave < 0 ? `${oct}${base}${suffix}` : `${base}${suffix}${oct}`;
}

export function midiToFreq(midi: number): number {
  return A4 * Math.pow(2, (midi - 69) / 12);
}

export function freqToMidiFloat(freq: number): number {
  return 69 + 12 * Math.log2(freq / A4);
}

export function midiToNoteName(midi: number): { name: WesternNote; octave: number; label: string } {
  const rounded = Math.round(midi);
  const name = WESTERN_NOTES[((rounded % 12) + 12) % 12];
  const octave = Math.floor(rounded / 12) - 1;
  return { name, octave, label: `${name}${octave}` };
}

export function noteToMidi(name: WesternNote, octave: number): number {
  return (octave + 1) * 12 + WESTERN_NOTES.indexOf(name);
}

/** Cents between a measured frequency and a reference frequency. */
export function centsBetween(freq: number, ref: number): number {
  return 1200 * Math.log2(freq / ref);
}

/** Tonic (Sa) setting: a western note name + octave, e.g. C#3. */
export interface Tonic {
  note: WesternNote;
  octave: number;
}

export function tonicMidi(t: Tonic): number {
  return noteToMidi(t.note, t.octave);
}

export function tonicLabel(t: Tonic): string {
  return `${t.note}${t.octave}`;
}

export function swaraToMidi(token: SwaraToken, tonic: Tonic): number | null {
  const p = parseSwara(token);
  return p ? tonicMidi(tonic) + p.semitones : null;
}

export function swaraToFreq(token: SwaraToken, tonic: Tonic): number | null {
  const m = swaraToMidi(token, tonic);
  return m === null ? null : midiToFreq(m);
}

/** Name the nearest swara for a frequency relative to the tonic. */
export function freqToSwara(freq: number, tonic: Tonic): { token: SwaraToken; cents: number } {
  const rel = freqToMidiFloat(freq) - tonicMidi(tonic);
  const nearest = Math.round(rel);
  const cents = (rel - nearest) * 100;
  const pc = ((nearest % 12) + 12) % 12;
  const octave = Math.floor(nearest / 12);
  const letter = SWARA_LETTERS[pc];
  const token = octave < 0 ? '.'.repeat(-octave) + letter : letter + "'".repeat(octave);
  return { token, cents };
}

export const DEFAULT_TONIC: Tonic = { note: 'C', octave: 3 };

/** Common singer-friendly tonic suggestions (not prescriptions). */
export const TONIC_CHOICES: Tonic[] = WESTERN_NOTES.flatMap((n) => [
  { note: n, octave: 2 },
  { note: n, octave: 3 },
  { note: n, octave: 4 },
]).filter((t) => {
  const m = tonicMidi(t);
  return m >= noteToMidi('F', 2) && m <= noteToMidi('F', 4);
});

/** Thaat / scale helpers for the 5 introductory ragas and the basic scale. */
export const SHUDDH_SCALE: SwaraToken[] = ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"];
