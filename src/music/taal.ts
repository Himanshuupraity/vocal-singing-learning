/**
 * Taal definitions. Vibhag = section; tali = clap (accent); khali = wave (empty).
 * Sam is the first beat (marked X in Bhatkhande notation); khali is marked 0.
 */
export type TaalId = 'teentaal' | 'keharwa' | 'dadra' | 'rupak' | 'jhaptaal';

export interface TaalDef {
  id: TaalId;
  name: string;
  matras: number;
  vibhags: number[];
  /** per vibhag: 'X' = sam (tali), number = tali number, 0 = khali */
  markers: ('X' | 0 | 1 | 2 | 3)[];
  /** Rupak's sam falls on a khali (wave) instead of a clap. */
  samIsKhali?: boolean;
  theka: string[];
  description: string;
}

export const TAALS: Record<TaalId, TaalDef> = {
  teentaal: {
    id: 'teentaal',
    name: 'Teentaal',
    matras: 16,
    vibhags: [4, 4, 4, 4],
    markers: ['X', 2, 0, 3],
    theka: ['Dha', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Tin', 'Tin', 'Ta', 'Ta', 'Dhin', 'Dhin', 'Dha'],
    description: '16 matras in four vibhags of 4. Claps on 1 (sam), 5 and 13; a wave (khali) on 9.',
  },
  keharwa: {
    id: 'keharwa',
    name: 'Keharwa',
    matras: 8,
    vibhags: [4, 4],
    markers: ['X', 0],
    theka: ['Dha', 'Ge', 'Na', 'Ti', 'Na', 'Ka', 'Dhi', 'Na'],
    description: '8 matras in two vibhags of 4. Clap on 1 (sam), wave (khali) on 5. Very common in Bollywood and light music.',
  },
  dadra: {
    id: 'dadra',
    name: 'Dadra',
    matras: 6,
    vibhags: [3, 3],
    markers: ['X', 0],
    theka: ['Dha', 'Dhi', 'Na', 'Dha', 'Tu', 'Na'],
    description: '6 matras in two vibhags of 3. Clap on 1 (sam), wave (khali) on 4. Has a lilting, waltz-like feel.',
  },
  rupak: {
    id: 'rupak',
    name: 'Rupak',
    matras: 7,
    vibhags: [3, 2, 2],
    markers: ['X', 1, 2],
    samIsKhali: true,
    theka: ['Tin', 'Tin', 'Na', 'Dhi', 'Na', 'Dhi', 'Na'],
    description: '7 matras in vibhags of 3, 2 and 2. Unusually, sam (beat 1) is a wave (khali), not a clap; claps fall on 4 and 6. Common in bhajans, ghazals and film songs.',
  },
  jhaptaal: {
    id: 'jhaptaal',
    name: 'Jhaptaal',
    matras: 10,
    vibhags: [2, 3, 2, 3],
    markers: ['X', 2, 0, 3],
    theka: ['Dhi', 'Na', 'Dhi', 'Dhi', 'Na', 'Ti', 'Na', 'Dhi', 'Dhi', 'Na'],
    description: '10 matras in vibhags of 2, 3, 2 and 3. Claps on 1 (sam), 3 and 8; a wave (khali) on 6. Heard in semi-classical songs and bhajans.',
  },
};

export const TAAL_IDS = Object.keys(TAALS) as TaalId[];

/** "X (sam · clap)", "0 (khali · wave)", "2 (tali · clap)" … for a vibhag marker. */
export function markerLabel(taal: TaalDef, vibhag: number): string {
  const mk = taal.markers[vibhag];
  if (mk === 'X') return taal.samIsKhali ? 'X (sam · wave)' : 'X (sam · clap)';
  return mk === 0 ? '0 (khali · wave)' : `${mk} (tali · clap)`;
}

export type BeatRole = 'sam' | 'tali' | 'khali' | 'plain';

export function beatRole(taal: TaalDef, matraIndex: number): BeatRole {
  let start = 0;
  for (let v = 0; v < taal.vibhags.length; v++) {
    if (matraIndex === start) {
      const mk = taal.markers[v];
      return mk === 'X' ? 'sam' : mk === 0 ? 'khali' : 'tali';
    }
    start += taal.vibhags[v];
  }
  return 'plain';
}

export function vibhagOf(taal: TaalDef, matraIndex: number): number {
  let start = 0;
  for (let v = 0; v < taal.vibhags.length; v++) {
    if (matraIndex < start + taal.vibhags[v]) return v;
    start += taal.vibhags[v];
  }
  return taal.vibhags.length - 1;
}
