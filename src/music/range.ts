import { TONIC_CHOICES, tonicMidi, type Tonic, type WesternNote } from './theory';

/**
 * Harmonium "scale" names many Indian teachers and karaoke apps use:
 * white keys counted as Safed 1–7 and black keys as Kaali 1–5, starting from C.
 */
const SCALE_NAMES: Record<WesternNote, string> = {
  C: 'Safed 1',
  'C#': 'Kaali 1',
  D: 'Safed 2',
  'D#': 'Kaali 2',
  E: 'Safed 3',
  F: 'Safed 4',
  'F#': 'Kaali 3',
  G: 'Safed 5',
  'G#': 'Kaali 4',
  A: 'Safed 6',
  'A#': 'Kaali 5',
  B: 'Safed 7',
};

export const scaleName = (note: WesternNote) => SCALE_NAMES[note];

/**
 * Suggests a Sa from a comfortable range (MIDI numbers). The aim is that the
 * notes beginners use most — mandra Pa up to taar Sa — fit inside the range:
 * Sa about 5 semitones above the low note (so mandra Pa is the lowest note),
 * moved down when taar Sa would be above the high note, but never closer than
 * 3 semitones to the bottom. Returns the nearest Sa the app offers.
 */
export function suggestSa(lowMidi: number, highMidi: number): { tonic: Tonic; reason: 'fits' | 'narrow' } {
  let target = lowMidi + 5;
  let reason: 'fits' | 'narrow' = 'fits';
  if (target + 12 > highMidi) {
    target = Math.max(lowMidi + 3, highMidi - 12);
    if (target + 12 > highMidi) reason = 'narrow';
  }
  const tonic = TONIC_CHOICES.reduce((best, t) => (Math.abs(tonicMidi(t) - target) < Math.abs(tonicMidi(best) - target) ? t : best), TONIC_CHOICES[0]);
  return { tonic, reason };
}
