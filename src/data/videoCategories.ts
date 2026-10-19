export interface VideoCategory {
  id: string;
  title: string;
  description: string;
  queries: { en: string; hi: string }[];
}

/** Curated search topics. We never hardcode specific videos or rate them. */
export const VIDEO_CATEGORIES: VideoCategory[] = [
  { id: 'foundations', title: 'Beginner foundations', description: 'What singing is, first steps, practice habits.', queries: [{ en: 'singing lessons for absolute beginners', hi: 'singing kaise sikhe beginners hindi' }, { en: 'how to start learning singing at home', hi: 'ghar par gana kaise sikhe hindi' }] },
  { id: 'sur', title: 'Sur and pitch', description: 'Hearing and matching notes, singing in tune.', queries: [{ en: 'how to sing in tune pitch matching for beginners', hi: 'sur mein kaise gaye hindi' }, { en: 'how to find your singing scale for beginners', hi: 'apna scale kaise pata kare singing hindi' }] },
  { id: 'breath', title: 'Breathing and warm-ups', description: 'Breath support, gentle vocal warm-ups.', queries: [{ en: 'breathing exercises for singing beginners', hi: 'singing ke liye breathing exercise hindi' }, { en: 'vocal warm up for beginners lip trills humming', hi: 'vocal warm up hindi beginners' }] },
  { id: 'sargam', title: 'Sargam', description: 'Sa Re Ga Ma Pa Dha Ni Sa with a tanpura.', queries: [{ en: 'sargam practice for beginners with tanpura', hi: 'sargam kaise gaye beginners hindi' }] },
  { id: 'alankar', title: 'Alankars', description: 'Paltas and note patterns for daily riyaz.', queries: [{ en: 'alankar practice for beginners hindustani', hi: 'sargam alankar for beginners hindi' }] },
  { id: 'voice', title: 'Voice control', description: 'Steady notes, range, registers, tone.', queries: [{ en: 'how to sing high notes without straining', hi: 'high notes kaise gaye bina strain hindi' }, { en: 'vocal exercises for voice control', hi: 'awaaz control karne ki exercise singing hindi' }] },
  { id: 'taal', title: 'Rhythm and taal', description: 'Teentaal, Keharwa, Dadra, clapping.', queries: [{ en: 'teentaal keharwa dadra explained for beginners', hi: 'teen taal keharwa dadra taali khali hindi' }] },
  { id: 'classical', title: 'Hindustani classical', description: 'Riyaz, swaras, gayaki concepts.', queries: [{ en: 'hindustani classical vocal riyaz for beginners', hi: 'shastriya sangeet riyaz beginners hindi' }] },
  { id: 'ragas', title: 'Ragas', description: 'Yaman, Bhupali, Bilawal, Kafi, Bhairav.', queries: [{ en: 'raag yaman for beginners aroha avaroha', hi: 'raag yaman sikhe hindi' }, { en: 'raag bhupali for beginners', hi: 'raag bhupali sikhe hindi' }] },
  { id: 'bollywood', title: 'Bollywood singing', description: 'Film-song style, learning songs step by step.', queries: [{ en: 'how to sing bollywood songs for beginners', hi: 'bollywood gana kaise gaye beginners hindi' }] },
  { id: 'expression', title: 'Pronunciation and expression', description: 'Hindi/Urdu diction, bhav, dynamics.', queries: [{ en: 'hindi urdu pronunciation for singing', hi: 'gaane mein uccharan kaise sudhare' }, { en: 'singing with emotion and expression tips', hi: 'gaane mein bhav kaise laaye hindi' }] },
  { id: 'performance', title: 'Recording and performance', description: 'Mic technique, recording at home, stage confidence.', queries: [{ en: 'microphone technique for singers beginners', hi: 'mic par kaise gaye singing tips hindi' }, { en: 'how to overcome stage fear singing', hi: 'stage fear kaise door kare singing hindi' }] },
];
