import type { MySong, SongStatus } from '../storage/schema';

export interface SongSearchResult {
  id: string;
  title: string;
  artist: string;
  album: string;
  year?: string;
  artwork?: string;
  genre?: string;
  url?: string;
  source: 'itunes';
}

/** The phrase-by-phrase workflow every song follows. */
export const SONG_STEPS: { id: string; title: string; detail: string }[] = [
  { id: 'listen', title: 'Open a legitimate reference recording', detail: 'Use the official video or a streaming service. Listen to the whole song 2–3 times without singing.' },
  { id: 'sa', title: 'Choose a comfortable Sa', detail: 'The original key may not suit your voice. Find the song’s home note by ear or with the keyboard, then pick a karaoke track in a key that’s comfortable for you.' },
  { id: 'phrases', title: 'Split the song into phrases', detail: 'Add each phrase below (e.g. “Mukhda line 1”, “Antara high line”) with a timestamp from the video.' },
  { id: 'technique', title: 'Review the related techniques', detail: 'Check the lessons suggested on this page (breath planning, meend, murki…).' },
  { id: 'simplified', title: 'Practise a simplified version', detail: 'Hum each phrase or sing it on “aa” or sargam before adding words. Remove ornaments at first.' },
  { id: 'sing', title: 'Sing each phrase at a comfortable pitch', detail: 'Sing along softly with the reference. Record yourself in the Recording Journal.' },
  { id: 'pitch', title: 'Check tricky notes with pitch analysis', detail: 'Use the Pitch Matcher or Keyboard on long or difficult notes.' },
  { id: 'review', title: 'Mark phrases done and review difficult ones', detail: 'Tick phrases as you master them; flag difficult ones to revisit first next time.' },
  { id: 'full', title: 'Sing the full song', detail: 'With karaoke or accompaniment, at your comfortable key. Record and listen back.' },
];

export function newSong(r: Pick<MySong, 'title' | 'artist'> & Partial<MySong>, status: SongStatus = 'want'): MySong {
  return {
    id: r.id ?? `manual-${Date.now()}`,
    title: r.title.trim().slice(0, 150),
    artist: (r.artist ?? '').trim().slice(0, 150),
    album: r.album,
    year: r.year,
    artwork: r.artwork,
    source: r.source ?? 'manual',
    sourceUrl: r.sourceUrl,
    status,
    addedAt: new Date().toISOString(),
    practiceMinutes: 0,
    steps: {},
    phrases: [],
    notes: '',
  };
}

export function songProgress(s: MySong) {
  const stepDone = SONG_STEPS.filter((x) => s.steps[x.id]).length;
  const phr = s.phrases.length ? s.phrases.filter((p) => p.done).length / s.phrases.length : 0;
  return Math.round(((stepDone / SONG_STEPS.length) * 0.6 + phr * 0.4) * 100);
}

export function songNextAction(s: MySong): string {
  const nextStep = SONG_STEPS.find((x) => !s.steps[x.id]);
  const difficult = s.phrases.filter((p) => p.difficult && !p.done);
  if (difficult.length) return `Practise the difficult phrase “${difficult[0].label}”.`;
  if (nextStep) return nextStep.title + '.';
  const open = s.phrases.find((p) => !p.done);
  if (open) return `Work on phrase “${open.label}”.`;
  return 'Sing the full song with karaoke and record a take.';
}

export function songSearchQueries(title: string, artist: string) {
  const base = `${title} ${artist}`.trim();
  return {
    original: `${base} official video`,
    tutorial: `${title} singing tutorial`,
    karaoke: `${title} karaoke with lyrics`,
    beginner: `${title} song easy singing lesson for beginners hindi`,
  };
}
