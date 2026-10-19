import type { SwaraToken } from '../music/theory';
import type { Language } from '../storage/schema';

/** What plays during a step, so the learner has something to follow. */
export type WarmupGuide =
  | { kind: 'none' }
  | { kind: 'breath'; inSec: number; outSec: number }
  | { kind: 'drone' }
  /** a soft pattern on the learner's Sa, repeated, with the tanpura */
  | { kind: 'pattern'; notes: SwaraToken[]; bpm: number }
  /** smooth slides up and back, like a siren */
  | { kind: 'siren'; from: SwaraToken; to: SwaraToken; sec: number };

export interface WarmupStep {
  id: string;
  sec: number;
  title: Record<Language, string>;
  /** what to do, shown on screen */
  how: Record<Language, string>;
  /** a short cue that is spoken aloud at the start of the step */
  say: Record<Language, string>;
  guide: WarmupGuide;
}

export interface WarmupRoutine {
  id: 'quick' | 'standard' | 'gentle' | 'cooldown';
  name: string;
  description: string;
  steps: WarmupStep[];
}

const S = {
  posture: (sec: number): WarmupStep => ({
    id: 'posture',
    sec,
    title: { english: 'Posture & release', hinglish: 'Posture aur dheela shareer', hindi: 'मुद्रा और ढीला शरीर' },
    how: {
      english: 'Stand or sit tall. Roll your shoulders back slowly, drop them. Gently turn your head left and right. Unclench your jaw.',
      hinglish: 'Seedhe khade ya baithiye. Kandhe dheere se peeche ghumaiye aur neeche chhod dijiye. Sir ko dheere se daayein-baayein ghumaiye. Jabda dheela.',
      hindi: 'सीधे खड़े या बैठिए। कंधे धीरे से पीछे घुमाइए और नीचे छोड़ दीजिए। सिर को धीरे से दाएँ-बाएँ घुमाइए। जबड़ा ढीला रखिए।',
    },
    say: { english: 'Stand tall. Roll your shoulders and relax.', hinglish: 'सीधे खड़े होइए, कंधे घुमाइए और ढीले छोड़िए।', hindi: 'सीधे खड़े होइए, कंधे घुमाइए और ढीले छोड़िए।' },
    guide: { kind: 'none' },
  }),
  breath: (sec: number): WarmupStep => ({
    id: 'breath',
    sec,
    title: { english: 'Slow breathing', hinglish: 'Dheemi saans', hindi: 'धीमी साँस' },
    how: {
      english: 'Breathe in quietly through the nose as the circle grows — belly and lower ribs expand, shoulders stay still. Breathe out on a soft "sss" as it shrinks.',
      hinglish: 'Gola bade to naak se chupchaap saans lijiye — pet aur neeche ki pasliyan phailein, kandhe na uthein. Gola chhota ho to halki "sss" ke saath saans chhodiye.',
      hindi: 'गोला बड़ा हो तो नाक से चुपचाप साँस लीजिए — पेट और नीचे की पसलियाँ फैलें, कंधे न उठें। गोला छोटा हो तो हल्की "स्स्स" के साथ साँस छोड़िए।',
    },
    say: { english: 'Breathe in slowly, then out on a soft hiss.', hinglish: 'धीरे से साँस लीजिए, फिर हल्की स्स्स के साथ छोड़िए।', hindi: 'धीरे से साँस लीजिए, फिर हल्की स्स्स के साथ छोड़िए।' },
    guide: { kind: 'breath', inSec: 4, outSec: 6 },
  }),
  yawn: (sec: number): WarmupStep => ({
    id: 'yawn',
    sec,
    title: { english: 'Yawn–sigh', hinglish: 'Ubaasi aur aah', hindi: 'उबासी और आह' },
    how: {
      english: 'Start a gentle yawn to open the back of the throat, then let it go on a soft, falling "haaah". Repeat slowly.',
      hinglish: 'Halki ubaasi lijiye taaki gala andar se khule, phir neeche girti hui halki "haaah" ke saath chhod dijiye. Dheere-dheere dohraiye.',
      hindi: 'हल्की उबासी लीजिए ताकि गला अंदर से खुले, फिर नीचे गिरती हुई हल्की "हाआह" के साथ छोड़ दीजिए। धीरे-धीरे दोहराइए।',
    },
    say: { english: 'Gentle yawn, then a soft sigh down.', hinglish: 'हल्की उबासी, फिर नीचे की ओर हल्की आह।', hindi: 'हल्की उबासी, फिर नीचे की ओर हल्की आह।' },
    guide: { kind: 'none' },
  }),
  hum: (sec: number, low = false): WarmupStep => ({
    id: low ? 'hum-low' : 'hum',
    sec,
    title: { english: 'Humming on Sa', hinglish: 'Sa par gungunana', hindi: 'सा पर गुनगुनाना' },
    how: {
      english: `Lips lightly closed, teeth apart. Hum "mmm" softly ${low ? 'on Sa and the notes just below it' : 'along with the notes'} — feel a buzz on your lips and nose.`,
      hinglish: `Hont halke band, daant alag. Halka "mmm" gungunaiye ${low ? 'Sa aur uske theek neeche ke swaron par' : 'swaron ke saath'} — hothon aur naak par jhanjhanahat mehsoos kijiye.`,
      hindi: `होंठ हल्के बंद, दाँत अलग। हल्का "म्म्म" गुनगुनाइए ${low ? 'सा और उसके ठीक नीचे के स्वरों पर' : 'स्वरों के साथ'} — होंठों और नाक पर झनझनाहट महसूस कीजिए।`,
    },
    say: { english: 'Hum softly with the notes.', hinglish: 'स्वरों के साथ हल्का गुनगुनाइए।', hindi: 'स्वरों के साथ हल्का गुनगुनाइए।' },
    guide: low ? { kind: 'pattern', notes: ['S', '-', '.N', '-', '.D', '-', '.N', '-'], bpm: 50 } : { kind: 'pattern', notes: ['S', '-', 'R', '-', 'S', '-', '-', '-'], bpm: 60 },
  }),
  trill: (sec: number): WarmupStep => ({
    id: 'trill',
    sec,
    title: { english: 'Lip trills', hinglish: 'Lip trill (brrr)', hindi: 'होंठों की थरथराहट (ब्र्र्र)' },
    how: {
      english: 'Blow through relaxed lips so they flutter ("brrr"), add a soft voice and follow the little hill of notes. Fingertips on the cheeks help. Can’t trill? Do it on "vvv".',
      hinglish: 'Dheele hothon se hawa chhodiye taaki woh thartharaayein ("brrr"), halki awaaz jodiye aur swaron ki chhoti pahadi ke saath chaliye. Gaalon par ungliyan madad karti hain. Na ho to "vvv" par kijiye.',
      hindi: 'ढीले होंठों से हवा छोड़िए ताकि वे थरथराएँ ("ब्र्र्र"), हल्की आवाज़ जोड़िए और स्वरों की छोटी पहाड़ी के साथ चलिए। गालों पर उँगलियाँ मदद करती हैं। न हो तो "व्व्व" पर कीजिए।',
    },
    say: { english: 'Lip trills. Follow the notes up and down.', hinglish: 'होंठों से ब्र्र्र कीजिए, स्वरों के साथ ऊपर-नीचे।', hindi: 'होंठों से ब्र्र्र कीजिए, स्वरों के साथ ऊपर-नीचे।' },
    guide: { kind: 'pattern', notes: ['S', 'R', 'G', 'm', 'P', 'm', 'G', 'R', 'S', '-'], bpm: 90 },
  }),
  siren: (sec: number, top: SwaraToken = 'P'): WarmupStep => ({
    id: 'siren',
    sec,
    title: { english: 'Sirens on "oo"', hinglish: '"oo" par siren', hindi: '"ऊ" पर सायरन' },
    how: {
      english: 'A soft "oo", sliding smoothly up and back down with the guide. Keep it quiet and easy — never reach or push for the top.',
      hinglish: 'Halka "oo", guide ke saath dheere se upar aur wapas neeche fisaliye. Awaaz dheemi aur aasaan — upar ke liye kabhi zor mat lagaiye.',
      hindi: 'हल्का "ऊ", गाइड के साथ धीरे से ऊपर और वापस नीचे फिसलिए। आवाज़ धीमी और आसान — ऊपर के लिए कभी ज़ोर मत लगाइए।',
    },
    say: { english: 'Soft oo, slide up and back down.', hinglish: 'हल्का ऊ, धीरे से ऊपर और वापस नीचे।', hindi: 'हल्का ऊ, धीरे से ऊपर और वापस नीचे।' },
    guide: { kind: 'siren', from: 'S', to: top, sec: 2.5 },
  }),
  sargam: (sec: number): WarmupStep => ({
    id: 'sargam',
    sec,
    title: { english: '"Ma-ma-ma" on five notes', hinglish: 'Paanch swaron par "ma-ma-ma"', hindi: 'पाँच स्वरों पर "मा-मा-मा"' },
    how: {
      english: 'Sing "ma" on each note, Sa to Pa and back, lightly and clearly — the voice is now ready.',
      hinglish: 'Har swar par "ma" gaiye, Sa se Pa aur wapas, halke aur saaf — ab awaaz taiyaar hai.',
      hindi: 'हर स्वर पर "मा" गाइए, सा से प तक और वापस, हल्के और साफ़ — अब आवाज़ तैयार है।',
    },
    say: { english: 'Sing ma on each note.', hinglish: 'हर स्वर पर मा गाइए।', hindi: 'हर स्वर पर मा गाइए।' },
    guide: { kind: 'pattern', notes: ['S', 'R', 'G', 'm', 'P', 'm', 'G', 'R', 'S', '-', '-', '-'], bpm: 80 },
  }),
  slidesDown: (sec: number): WarmupStep => ({
    id: 'slides-down',
    sec,
    title: { english: 'Downward hum slides', hinglish: 'Neeche ki or hum slide', hindi: 'नीचे की ओर गुनगुनाती स्लाइड' },
    how: {
      english: 'Hum softly from a comfortable middle note sliding down, like a gentle sigh. Let the voice settle.',
      hinglish: 'Aaraam wale beech ke swar se halka gungunate hue neeche fisaliye, jaise halki aah. Awaaz ko shaant hone dijiye.',
      hindi: 'आराम वाले बीच के स्वर से हल्का गुनगुनाते हुए नीचे फिसलिए, जैसे हल्की आह। आवाज़ को शांत होने दीजिए।',
    },
    say: { english: 'Hum softly, sliding down.', hinglish: 'हल्का गुनगुनाते हुए नीचे फिसलिए।', hindi: 'हल्का गुनगुनाते हुए नीचे फिसलिए।' },
    guide: { kind: 'siren', from: 'G', to: '.P', sec: 3 },
  }),
  water: (sec: number): WarmupStep => ({
    id: 'water',
    sec,
    title: { english: 'Sip water & rest', hinglish: 'Paani aur aaraam', hindi: 'पानी और आराम' },
    how: {
      english: 'Sip some room-temperature water. Notice how your throat feels. No whispering or throat-clearing.',
      hinglish: 'Saadha (thanda nahi) paani ghoont-ghoont piyiye. Dekhiye gala kaisa mehsoos ho raha hai. Fusfusana ya gala saaf karna nahi.',
      hindi: 'सादा (ठंडा नहीं) पानी घूँट-घूँट पीजिए। देखिए गला कैसा महसूस हो रहा है। फुसफुसाना या गला साफ़ करना नहीं।',
    },
    say: { english: 'Sip some water and rest.', hinglish: 'थोड़ा पानी पीजिए और आराम कीजिए।', hindi: 'थोड़ा पानी पीजिए और आराम कीजिए।' },
    guide: { kind: 'none' },
  }),
};

export const WARMUPS: WarmupRoutine[] = [
  { id: 'quick', name: 'Quick (3 min)', description: 'Short on time — the essentials.', steps: [S.breath(30), S.hum(35), S.trill(45), S.siren(40), S.sargam(30)] },
  { id: 'standard', name: 'Standard (5 min)', description: 'The full warm-up before riyaz.', steps: [S.posture(30), S.breath(45), S.yawn(30), S.hum(45), S.trill(60), S.siren(50), S.sargam(40)] },
  { id: 'gentle', name: 'Gentle (4 min)', description: 'After strain or a tired voice: softer, lower, no high notes.', steps: [S.posture(30), S.breath(60), S.yawn(40), S.hum(50, true), S.siren(40, 'G'), S.water(20)] },
  { id: 'cooldown', name: 'Cool-down (2 min)', description: 'After singing, to settle the voice.', steps: [S.slidesDown(40), S.yawn(30), S.breath(30), S.water(20)] },
];

export const routineSeconds = (r: WarmupRoutine) => r.steps.reduce((s, x) => s + x.sec, 0);
