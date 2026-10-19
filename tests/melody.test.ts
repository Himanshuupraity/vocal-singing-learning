import type { PitchFrame } from '../src/audio/pitchAnalysis';
import { compareTracks, guessSaPitchClass, notesToSargam, scoreNoteWindow, segmentNotes, semitonesToToken, type NoteEvent } from '../src/music/melody';
import { scaleName, suggestSa } from '../src/music/range';
import { ragaNoteStatus } from '../src/music/raga';
import { RAGAS, getRaga } from '../src/data/ragas';
import { midiToFreq, noteToMidi, parseSwara, SWARA_SEMITONES, tonicLabel } from '../src/music/theory';
import { dayanFreq, strokesOf } from '../src/audio/tabla';
import { markerLabel, TAALS, TAAL_IDS, beatRole } from '../src/music/taal';
import { getLesson } from '../src/curriculum';

const C3 = { note: 'C' as const, octave: 3 };
const HOP = 0.05;

/** Frames for a melody given as [midi | null (silence), seconds][], with an optional cents wobble. */
function track(parts: [number | null, number][], wobble = 0): PitchFrame[] {
  const out: PitchFrame[] = [];
  let t = 0;
  for (const [midi, sec] of parts) {
    for (let i = 0; i < Math.round(sec / HOP); i++, t += HOP) {
      if (midi === null) out.push({ t, status: 'silent', level: 0 });
      else out.push({ t, status: 'voiced', level: 0.1, freq: midiToFreq(midi + (wobble * Math.sin(i)) / 100), confidence: 0.95 });
    }
  }
  return out;
}

describe('segmentNotes', () => {
  it('finds held notes, keeps vibrato inside one note and drops short slides', () => {
    const notes = segmentNotes(track([[48, 0.6], [50, 0.05], [52, 0.6], [null, 0.3], [52, 0.5]], 30));
    expect(notes.map((n) => n.midi)).toEqual([48, 52, 52]);
    expect(notes[0].dur).toBeCloseTo(0.6, 1);
    expect(Math.abs(notes[0].cents)).toBeLessThan(35);
  });

  it('reports the median offset in cents', () => {
    const fr = track([[48.2, 1]]);
    const [n] = segmentNotes(fr);
    expect(n.midi).toBe(48);
    expect(n.cents).toBe(20);
  });
});

describe('sargam from a melody', () => {
  const ev = (midis: number[], last = 1): NoteEvent[] => midis.map((m, i) => ({ midi: m, start: i, dur: i === midis.length - 1 ? last : 0.5, cents: 0 }));

  it('names semitones as sargam tokens with octave marks', () => {
    expect(semitonesToToken(0)).toBe('S');
    expect(semitonesToToken(-1)).toBe('.N');
    expect(semitonesToToken(12)).toBe("S'");
    expect(semitonesToToken(6)).toBe('M');
  });

  it('guesses Sa for a major-like phrase ending on Sa (D = 2)', () => {
    // D E F# G A G F# E D in D major
    expect(guessSaPitchClass(ev([62, 64, 66, 67, 69, 67, 66, 64, 62], 1.5))).toBe(2);
  });

  it('guesses Sa for a Kafi/minor-like phrase ending on Sa (A = 9)', () => {
    // A B C D E D C B A (A minor / Kafi-like: komal Ga)
    expect(guessSaPitchClass(ev([57, 59, 60, 62, 64, 62, 60, 59, 57], 1.5))).toBe(9);
  });

  it('converts to sargam relative to the chosen Sa, keeping notes in the middle octave', () => {
    expect(notesToSargam(ev([62, 64, 66, 67, 69, 74]), 2)).toEqual(['S', 'R', 'G', 'm', 'P', "S'"]);
    expect(notesToSargam(ev([57, 59, 60]), 9)).toEqual(['S', 'R', 'g']);
    expect(notesToSargam(ev([61, 62]), 2)).toEqual(['.N', 'S']);
  });
});

describe('range → Sa suggestion', () => {
  it('puts Sa about a fourth above the low note when the range is wide enough', () => {
    const { tonic, reason } = suggestSa(noteToMidi('G', 2), noteToMidi('G', 4));
    expect(tonicLabel(tonic)).toBe('C3');
    expect(reason).toBe('fits');
  });

  it('moves Sa down for a narrow range so taar Sa stays reachable', () => {
    const { tonic } = suggestSa(noteToMidi('A', 2), noteToMidi('C#', 4));
    expect(tonicLabel(tonic)).toBe('C#3');
    const narrow = suggestSa(noteToMidi('C', 3), noteToMidi('C', 4));
    expect(tonicLabel(narrow.tonic)).toBe('D#3');
    expect(narrow.reason).toBe('narrow');
  });

  it('gives harmonium scale names', () => {
    expect(scaleName('C')).toBe('Safed 1');
    expect(scaleName('C#')).toBe('Kaali 1');
    expect(scaleName('F#')).toBe('Kaali 3');
    expect(scaleName('B')).toBe('Safed 7');
  });
});

describe('ragas', () => {
  it('match their curriculum lessons and use only their own notes', () => {
    for (const r of RAGAS) {
      expect(getLesson(r.lessonId), r.id).toBeDefined();
      for (const t of [...r.aroha, ...r.avaroha, ...r.phrases.flatMap((p) => p.notes)]) {
        const p = parseSwara(t);
        if (!p) continue;
        expect([...r.notes, ...(r.touches ?? [])], `${r.id} ${t}`).toContain(p.letter);
      }
      expect(r.notes).toContain(r.vadi);
      expect(r.notes).toContain(r.samvadi);
    }
  });

  it('flags varjit notes and accepts light touches', () => {
    const sa = noteToMidi('C', 3);
    const yaman = getRaga('yaman')!;
    expect(ragaNoteStatus(yaman, sa + SWARA_SEMITONES.M, C3)).toEqual({ token: 'M', status: 'in' });
    expect(ragaNoteStatus(yaman, sa + SWARA_SEMITONES.m, C3).status).toBe('out');
    expect(ragaNoteStatus(getRaga('bhupali')!, sa - 1, C3)).toEqual({ token: '.N', status: 'out' });
    expect(ragaNoteStatus(getRaga('bilawal')!, sa + 10, C3).status).toBe('touch');
  });
});

describe('taals and tabla', () => {
  it('every taal has a consistent structure', () => {
    for (const id of TAAL_IDS) {
      const t = TAALS[id];
      expect(t.theka).toHaveLength(t.matras);
      expect(t.vibhags.reduce((a, b) => a + b, 0)).toBe(t.matras);
      expect(t.markers).toHaveLength(t.vibhags.length);
      expect(beatRole(t, 0)).toBe('sam');
    }
    expect(markerLabel(TAALS.rupak, 0)).toBe('X (sam · wave)');
    expect(markerLabel(TAALS.jhaptaal, 2)).toBe('0 (khali · wave)');
  });

  it('knows which bols use the bass drum', () => {
    expect(strokesOf('Dha')).toEqual(['na', 'ge']);
    expect(strokesOf('Dhin')).toEqual(['tin', 'ge']);
    expect(strokesOf('Tin')).toEqual(['tin']);
    expect(strokesOf('Ka')).toEqual(['ka']);
    for (const id of TAAL_IDS) for (const b of TAALS[id].theka) expect(strokesOf(b).length, b).toBeGreaterThan(0);
  });

  it('tunes the dayan to Sa in the tabla range', () => {
    expect(dayanFreq(130.81)).toBeCloseTo(261.63, 1);
    expect(dayanFreq(523.25)).toBeCloseTo(261.63, 1);
  });
});

describe('comparing pitch', () => {
  it('scores a note window, allowing another octave', () => {
    expect(scoreNoteWindow([4.1, 4.2, 4.15], 4)).toEqual({ cents: 15, matched: true, reliable: true });
    expect(scoreNoteWindow([-7.6, -7.6, -7.6], 4).matched).toBe(true);
    expect(scoreNoteWindow([4.8, 4.7, 4.75], 4)).toMatchObject({ cents: 75, matched: false });
    expect(scoreNoteWindow([4], 4).reliable).toBe(false);
  });

  it('compares two tracks with an offset, a key shift and an octave apart', () => {
    const ref = Array.from({ length: 40 }, (_, i) => ({ t: i * 0.05, semis: i < 20 ? 0 : 4 }));
    // Same tune an octave lower, 0.5 s later, 20 cents sharp.
    const mine = ref.map((p) => ({ t: p.t + 0.5, semis: p.semis - 12 + 0.2 }));
    const c = compareTracks(ref, mine, -0.5)!;
    expect(c).toMatchObject({ octave: -1, medianCents: 20, medianAbsCents: 20, withinPct: 100 });
    // A reference sung two semitones higher, shifted back down.
    const high = ref.map((p) => ({ ...p, semis: p.semis + 2 }));
    expect(compareTracks(high, ref, 0, -2)!.medianAbsCents).toBe(0);
    expect(compareTracks(ref, [{ t: 0, semis: 0 }])).toBeNull();
  });
});
