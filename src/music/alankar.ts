import { RAGAS } from '../data/ragas';
import { SWARA_SEMITONES, type SwaraLetter, type SwaraToken } from './theory';

/**
 * Alankars (paltas): a short note shape moved step by step up the scale
 * (aroha), then mirrored down it (avaroha). The shape is a list of steps
 * within the scale — [0, 1, 2] gives S R G, R G m, G m P …
 */
export interface AlankarDef {
  id: string;
  name: string;
  shape: number[];
  /** short sung example of the first two groups */
  example: string;
}

export const ALANKARS: AlankarDef[] = [
  { id: 'two', name: 'Pairs', shape: [0, 1], example: 'S R, R G, G m …' },
  { id: 'three', name: 'Groups of three', shape: [0, 1, 2], example: 'S R G, R G m …' },
  { id: 'four', name: 'Groups of four', shape: [0, 1, 2, 3], example: 'S R G m, R G m P …' },
  { id: 'skip', name: 'Skip a note', shape: [0, 2], example: 'S G, R m, G P …' },
  { id: 'turn', name: 'Turn (up and back)', shape: [0, 1, 0], example: 'S R S, R G R …' },
  { id: 'step-back', name: 'Two up, one back', shape: [0, 1, 2, 1], example: 'S R G R, R G m G …' },
  { id: 'jump-three', name: 'Jump of a third and back', shape: [0, 2, 1], example: 'S G R, R m G …' },
  { id: 'zigzag', name: 'Zig-zag (vakra)', shape: [0, 1, 0, 1, 2], example: 'S R S R G, R G R G m …' },
  { id: 'five', name: 'Groups of five', shape: [0, 1, 2, 3, 4], example: 'S R G m P, R G m P D …' },
];

export interface AlankarScale {
  id: string;
  name: string;
  /** madhya-saptak notes in order, without the upper Sa */
  notes: SwaraLetter[];
}

const byPitch = (ls: SwaraLetter[]) => [...ls].sort((a, b) => SWARA_SEMITONES[a] - SWARA_SEMITONES[b]);

/** Shuddh scale plus the scale of each introductory raag (alankars in a raag's notes help settle its komal/teevra swaras). */
export const ALANKAR_SCALES: AlankarScale[] = [
  { id: 'shuddh', name: 'Shuddh swar (Bilawal)', notes: ['S', 'R', 'G', 'm', 'P', 'D', 'N'] },
  ...RAGAS.map((r) => ({ id: r.id, name: `Raag ${r.name} notes`, notes: byPitch(r.notes) })),
];

/** Aroha then avaroha of one alankar on one scale. Groups never go past taar Sa or below Sa. */
export function makeAlankar(scale: SwaraLetter[], shape: number[]): { aroha: SwaraToken[]; avaroha: SwaraToken[] } {
  const up: SwaraToken[] = [...scale, "S'"];
  const down: SwaraToken[] = [...up].reverse();
  const span = Math.max(...shape);
  const walk = (line: SwaraToken[]) => {
    const out: SwaraToken[] = [];
    for (let start = 0; start + span < line.length; start++) for (const o of shape) out.push(line[start + o]);
    return out;
  };
  return { aroha: walk(up), avaroha: walk(down) };
}

/** Next tempo to try: up 10 bpm after a clean run (≥ 80% in tune), down 10 after a poor one (< 50%). */
export function nextBpm(bpm: number, pct: number): number {
  if (pct >= 80) return Math.min(160, bpm + 10);
  if (pct < 50) return Math.max(40, bpm - 10);
  return bpm;
}
