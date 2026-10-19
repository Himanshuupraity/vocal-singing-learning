import { isValidSwaraToken, WESTERN_NOTES } from '../music/theory';
import { defaultData, LIMITS, SCHEMA_VERSION, SESSION_LENGTHS, type AppData } from './schema';

type Json = Record<string, unknown>;
const isObj = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);
const arr = <T>(v: unknown, cap: number): T[] => (Array.isArray(v) ? (v.slice(-cap) as T[]) : []);
const obj = <T>(v: unknown): Record<string, T> => (isObj(v) ? (v as Record<string, T>) : {});

export interface LoadResult {
  data: AppData;
  /** set when stored data was unreadable/invalid and had to be reset or repaired */
  warning?: string;
}

/**
 * Migrates any older/partial/corrupted stored object to the current schema.
 * Unknown or malformed fields fall back to defaults; valid fields are kept.
 */
export function migrate(raw: unknown): LoadResult {
  if (!isObj(raw)) return { data: defaultData(), warning: 'Saved data was unreadable, so a fresh profile was started.' };
  const d = defaultData();
  let warning: string | undefined;
  const version = typeof raw.version === 'number' ? raw.version : 0;
  if (version > SCHEMA_VERSION) {
    warning = 'Your saved data comes from a newer version of SurSadhana. Some information may not display correctly.';
  }

  // --- version 0 → 1 (pre-release shape had `progress.completed: string[]`) ---
  if (version < 1 && isObj(raw.progress) && Array.isArray((raw.progress as Json).completed)) {
    for (const id of (raw.progress as Json).completed as unknown[]) {
      if (typeof id === 'string') d.lessons[id] = { completedAt: new Date(0).toISOString(), quizAttempts: 0, selfChecks: [], practiceCount: 0 };
    }
  }

  const p = isObj(raw.profile) ? raw.profile : {};
  d.profile = { ...d.profile, ...(p as object) } as AppData['profile'];
  if (!SESSION_LENGTHS.includes(d.profile.dailyMinutes)) d.profile.dailyMinutes = 20;
  if (!['hinglish', 'english', 'hindi'].includes(d.profile.language)) d.profile.language = 'hinglish';
  const t = d.profile.tonic as unknown;
  if (!isObj(t) || !WESTERN_NOTES.includes(t.note as never) || typeof t.octave !== 'number' || t.octave < 1 || t.octave > 5) {
    d.profile.tonic = defaultData().profile.tonic;
  }

  d.settings = { ...d.settings, ...(isObj(raw.settings) ? raw.settings : {}) } as AppData['settings'];
  if (typeof d.settings.errorReports !== 'boolean') d.settings.errorReports = true;
  if (d.settings.demoTimbre !== 'voice') d.settings.demoTimbre = 'reed';
  if (d.settings.referenceTimbre !== 'voice') d.settings.referenceTimbre = 'pure';
  if (d.settings.reminderTime !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(d.settings.reminderTime)) d.settings.reminderTime = undefined;
  if (typeof d.settings.droneVolume !== 'number' || d.settings.droneVolume < 0 || d.settings.droneVolume > 1) d.settings.droneVolume = 0.5;

  const lessons = obj<Json>(raw.lessons);
  for (const [id, lp] of Object.entries(lessons)) {
    if (!isObj(lp)) continue;
    d.lessons[id] = {
      completedAt: typeof lp.completedAt === 'string' ? lp.completedAt : undefined,
      quizBest: typeof lp.quizBest === 'number' ? lp.quizBest : undefined,
      quizAttempts: typeof lp.quizAttempts === 'number' ? lp.quizAttempts : 0,
      selfChecks: Array.isArray(lp.selfChecks) ? (lp.selfChecks.filter((x) => typeof x === 'string') as string[]) : [],
      lastVisited: typeof lp.lastVisited === 'string' ? lp.lastVisited : undefined,
      practiceCount: typeof lp.practiceCount === 'number' ? lp.practiceCount : 0,
    };
  }
  d.checkpoints = obj(raw.checkpoints) as AppData['checkpoints'];
  d.pitchAttempts = arr(raw.pitchAttempts, LIMITS.pitchAttempts);
  d.earTests = arr(raw.earTests, LIMITS.earTests);
  d.rhythm = arr(raw.rhythm, LIMITS.rhythm);
  d.sessions = arr(raw.sessions, LIMITS.sessions);
  d.selfAssessments = arr(raw.selfAssessments, 200);
  const v = isObj(raw.videos) ? raw.videos : {};
  d.videos = { watched: obj(v.watched), favorites: obj(v.favorites) };
  d.songs = obj(raw.songs);
  for (const s of Object.values(d.songs)) {
    s.phrases = Array.isArray(s.phrases) ? s.phrases : [];
    s.steps = isObj(s.steps) ? s.steps : {};
    s.notes = typeof s.notes === 'string' ? s.notes : '';
    s.practiceMinutes = typeof s.practiceMinutes === 'number' ? s.practiceMinutes : 0;
  }
  const tu = isObj(raw.tutor) ? raw.tutor : {};
  d.tutor = { messages: arr(tu.messages, LIMITS.tutorMessages), memory: arr(tu.memory, LIMITS.tutorMemory) };
  d.ranges = arr<AppData['ranges'][number]>(raw.ranges, 100).filter((r) => r && typeof r.lowMidi === 'number' && typeof r.highMidi === 'number');
  d.alankars = Object.fromEntries(Object.entries(obj<AppData['alankars'][string]>(raw.alankars)).filter(([, v]) => isObj(v) && typeof v.bestBpm === 'number' && typeof v.lastBpm === 'number'));
  d.longNotes = arr<AppData['longNotes'][number]>(raw.longNotes, LIMITS.longNotes).filter((r) => isObj(r) && typeof r.sec === 'number' && typeof r.at === 'string');
  d.weeklyNotes = arr<AppData['weeklyNotes'][number]>(raw.weeklyNotes, LIMITS.weeklyNotes).filter((n) => isObj(n) && typeof n.text === 'string' && typeof n.from === 'string');
  d.patterns = arr<AppData['patterns'][number]>(raw.patterns, LIMITS.patterns).filter(
    (p) => isObj(p) && typeof p.id === 'string' && typeof p.name === 'string' && Array.isArray(p.notes) && p.notes.length > 0 && p.notes.every((t) => typeof t === 'string' && isValidSwaraToken(t)),
  );
  if (isObj(raw.baseline)) d.baseline = raw.baseline as unknown as AppData['baseline'];
  if (typeof raw.createdAt === 'string') d.createdAt = raw.createdAt;
  d.version = SCHEMA_VERSION;
  return { data: d, warning };
}
