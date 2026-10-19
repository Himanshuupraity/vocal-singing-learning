import type { Raga } from '../data/ragas';
import { semitonesToToken } from './melody';
import { SWARA_SEMITONES, tonicMidi, type SwaraToken, type Tonic } from './theory';

export type RagaNoteStatus = 'in' | 'touch' | 'out';

/** Whether a note (MIDI) belongs to the raga, is only a light touch, or is varjit (not used). */
export function ragaNoteStatus(raga: Raga, midi: number, tonic: Tonic): { token: SwaraToken; status: RagaNoteStatus } {
  const rel = midi - tonicMidi(tonic);
  const pc = ((rel % 12) + 12) % 12;
  const has = (letters: string[]) => letters.some((l) => SWARA_SEMITONES[l as keyof typeof SWARA_SEMITONES] === pc);
  return { token: semitonesToToken(rel), status: has(raga.notes) ? 'in' : has(raga.touches ?? []) ? 'touch' : 'out' };
}

/** The raga's notes with "-" pauses removed, for scoring one note at a time. */
export const singable = (notes: SwaraToken[]) => notes.filter((t) => t !== '-');
