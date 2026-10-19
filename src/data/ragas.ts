import type { SwaraLetter, SwaraToken } from '../music/theory';
import type { FirstString } from '../audio/drone';

export type RagaId = 'yaman' | 'bhupali' | 'bilawal' | 'kafi' | 'bhairav';

export interface Raga {
  id: RagaId;
  name: string;
  thaat: string;
  /** Swaras the raga uses (pitch classes; octave marks don't matter). */
  notes: SwaraLetter[];
  /** Notes heard only as a light touch in specific phrases — allowed, but not flagged as wrong. */
  touches?: SwaraLetter[];
  aroha: SwaraToken[];
  avaroha: SwaraToken[];
  /** Characteristic phrases. "-" is a short pause. */
  phrases: { label: string; notes: SwaraToken[] }[];
  vadi: SwaraLetter;
  samvadi: SwaraLetter;
  time: string;
  mood: string;
  /** Tanpura first string that suits the raga. */
  firstString: FirstString;
  /** Easy-to-miss points while singing. */
  tips: string[];
  /** Curriculum lesson that teaches this raga. */
  lessonId: string;
}

/**
 * The five introductory ragas from Level 3, with the same aroha, avaroha and
 * phrases as their lessons. Versions differ between gharanas and books; these
 * follow the commonly taught forms described in those lessons.
 */
export const RAGAS: Raga[] = [
  {
    id: 'yaman',
    name: 'Yaman',
    thaat: 'Kalyan',
    notes: ['S', 'R', 'G', 'M', 'P', 'D', 'N'],
    aroha: ['.N', 'R', 'G', 'M', 'D', 'N', "S'"],
    avaroha: ["S'", 'N', 'D', 'P', 'M', 'G', 'R', 'S'],
    phrases: [
      { label: '.N R G R, .N R S', notes: ['.N', 'R', 'G', '-', 'R', '-', '.N', 'R', 'S'] },
      { label: 'P M G R, .N R S', notes: ['P', 'M', 'G', 'R', '-', '.N', 'R', 'S'] },
      { label: "G M D N S'", notes: ['G', 'M', 'D', 'N', "S'"] },
    ],
    vadi: 'G',
    samvadi: 'N',
    time: 'Evening (first part of the night)',
    mood: 'Serene, devotional and romantic; open and bright',
    firstString: 'P',
    tips: ['Ma is teevra (raised). If you are used to shuddh Ma it is easy to sing it flat — check it on the meter.', 'The ascent often starts from mandra Ni (·Ni Re Ga), rather than from Sa.'],
    lessonId: 'l3-raag-yaman',
  },
  {
    id: 'bhupali',
    name: 'Bhupali',
    thaat: 'Kalyan',
    notes: ['S', 'R', 'G', 'P', 'D'],
    aroha: ['S', 'R', 'G', 'P', 'D', "S'"],
    avaroha: ["S'", 'D', 'P', 'G', 'R', 'S'],
    phrases: [
      { label: 'G R S .D, S R G', notes: ['G', 'R', 'S', '.D', '-', 'S', 'R', 'G'] },
      { label: 'P G, D P G R S', notes: ['P', 'G', '-', 'D', 'P', 'G', 'R', 'S'] },
      { label: "G P D S'", notes: ['G', 'P', 'D', "S'"] },
    ],
    vadi: 'G',
    samvadi: 'D',
    time: 'Evening',
    mood: 'Calm, open, joyful and devotional',
    firstString: 'P',
    tips: ['Only five notes: no Ma and no Ni at all.', 'G→P and D→S\' are wider jumps than in the full scale; tune them carefully.'],
    lessonId: 'l3-raag-bhupali',
  },
  {
    id: 'bilawal',
    name: 'Bilawal (Alhaiya)',
    thaat: 'Bilawal',
    notes: ['S', 'R', 'G', 'm', 'P', 'D', 'N'],
    touches: ['n'],
    aroha: ['S', 'R', 'G', '-', 'R', 'G', 'P', '-', 'D', 'N', "S'"],
    avaroha: ["S'", 'N', 'D', 'P', '-', 'm', 'G', 'm', 'R', 'S'],
    phrases: [
      { label: 'G m R S', notes: ['G', 'm', 'R', 'S'] },
      { label: "G P D N S'", notes: ['G', 'P', 'D', 'N', "S'"] },
      { label: 'D n D P (touch of komal Ni)', notes: ['D', 'n', 'D', 'P'] },
    ],
    vadi: 'D',
    samvadi: 'G',
    time: 'Morning (first part of the day)',
    mood: 'Calm, bright and cheerful',
    firstString: 'P',
    tips: ['Running the plain scale up and down is not the raga — practise the zig-zag phrases.', 'Komal Ni appears only as a light touch in D n D P.'],
    lessonId: 'l3-raag-bilawal',
  },
  {
    id: 'kafi',
    name: 'Kafi',
    thaat: 'Kafi',
    notes: ['S', 'R', 'g', 'm', 'P', 'D', 'n'],
    aroha: ['S', 'R', 'g', 'm', 'P', 'D', 'n', "S'"],
    avaroha: ["S'", 'n', 'D', 'P', 'm', 'g', 'R', 'S'],
    phrases: [
      { label: 'S R g R, m g R S', notes: ['S', 'R', 'g', 'R', '-', 'm', 'g', 'R', 'S'] },
      { label: 'm P D n D P', notes: ['m', 'P', 'D', 'n', 'D', 'P'] },
      { label: 'P m g R S', notes: ['P', 'm', 'g', 'R', 'S'] },
    ],
    vadi: 'P',
    samvadi: 'S',
    time: 'Night (sung freely in hori and thumri)',
    mood: 'Romantic and playful, with a folk sweetness',
    firstString: 'P',
    tips: ['Ga and Ni are komal. Komal Ga drifting up towards shuddh Ga is the most common slip.', 'Light forms sometimes borrow shuddh Ga or Ni; strict khayal avoids them.'],
    lessonId: 'l3-raag-kafi',
  },
  {
    id: 'bhairav',
    name: 'Bhairav',
    thaat: 'Bhairav',
    notes: ['S', 'r', 'G', 'm', 'P', 'd', 'N'],
    aroha: ['S', 'r', 'G', 'm', 'P', 'd', 'N', "S'"],
    avaroha: ["S'", 'N', 'd', 'P', 'm', 'G', 'r', 'S'],
    phrases: [
      { label: 'G m d, d P, G m r, r S', notes: ['G', 'm', 'd', '-', 'd', 'P', '-', 'G', 'm', 'r', '-', 'r', 'S'] },
      { label: "P d N S'", notes: ['P', 'd', 'N', "S'"] },
    ],
    vadi: 'd',
    samvadi: 'r',
    time: 'Dawn',
    mood: 'Serious, devotional and meditative',
    firstString: 'P',
    tips: ['Re and Dha are komal and are traditionally sung a shade lower still, with a slow andolan. The app measures equal-tempered notes, so treat its check as approximate here.', 'r→G and d→N are wide (three-semitone) steps.'],
    lessonId: 'l3-raag-bhairav',
  },
];

export const getRaga = (id: string) => RAGAS.find((r) => r.id === id);
