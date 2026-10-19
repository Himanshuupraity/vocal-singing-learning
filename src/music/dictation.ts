import { RAGAS } from '../data/ragas';
import { makeSequence } from '../lib/patterns';
import type { SwaraToken } from './theory';

/**
 * Sargam dictation levels: which swaras can appear (and are offered as
 * answer buttons) and how many notes each phrase has. Phrases move mostly
 * stepwise, like real melodies.
 */
export const DICTATION_LEVELS: { name: string; choices: SwaraToken[]; length: number; scales?: SwaraToken[][] }[] = [
  { name: 'Sa to Pa, 3 notes', choices: ['S', 'R', 'G', 'm', 'P'], length: 3 },
  { name: 'Full octave, 3 notes', choices: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"], length: 3 },
  { name: 'Full octave, 4 notes', choices: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"], length: 4 },
  {
    name: 'Komal & teevra swaras, 4 notes',
    choices: ['S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N', "S'"],
    length: 4,
    // Phrases come from one raag's notes at a time, so they still sound musical.
    scales: RAGAS.filter((r) => r.notes.length >= 7).map((r) => [...r.notes, "S'"]),
  },
  { name: 'Full octave, 5 notes', choices: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"], length: 5 },
];

export function makeDictation(level: number, rnd = Math.random): { notes: SwaraToken[]; choices: SwaraToken[] } {
  const L = DICTATION_LEVELS[Math.max(0, Math.min(DICTATION_LEVELS.length - 1, level))];
  const pool = L.scales ? L.scales[Math.floor(rnd() * L.scales.length)] : L.choices;
  return { notes: makeSequence(pool, L.length, rnd), choices: L.choices };
}

export function scoreDictation(answer: SwaraToken[], given: SwaraToken[]) {
  const perNote = answer.map((n, i) => given[i] === n);
  const correct = perNote.filter(Boolean).length;
  return { correct, perNote, allRight: correct === answer.length && given.length === answer.length };
}
