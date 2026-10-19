import type { LevelId } from '../curriculum/types';
import { DEFAULT_TONIC, type SwaraToken, type Tonic } from '../music/theory';
import type { TaalId } from '../music/taal';

export const SCHEMA_VERSION = 1;

export type Language = 'hinglish' | 'english' | 'hindi';
export type Focus = 'bollywood' | 'classical' | 'both';
export type Experience = 'none' | 'a-little' | 'some-training';
export type SessionLength = 10 | 15 | 20 | 30 | 45 | 60;
export const SESSION_LENGTHS: SessionLength[] = [10, 15, 20, 30, 45, 60];

export interface Profile {
  onboarded: boolean;
  name: string;
  experience: Experience;
  language: Language;
  dailyMinutes: SessionLength;
  favoriteSongs: string;
  favoriteSingers: string;
  focus: Focus;
  hasMic: boolean | null;
  hasHeadphones: boolean | null;
  tonic: Tonic;
  tonicSource: 'default' | 'chosen' | 'finder';
  startedAt: string;
}

export interface Settings {
  theme: 'system' | 'light' | 'dark';
  droneVolume: number;
  /** User agreed that recordings may be saved in this browser */
  recordingConsent: boolean;
  /** Microphone deviceId preference */
  micDeviceId?: string;
  /** Sound used for demos & the sargam player */
  demoTimbre: 'reed' | 'voice';
  /** Sound used for pitch-matching reference notes */
  referenceTimbre: 'pure' | 'voice';
  /** Daily practice reminder (local time HH:MM) — shown while the app is open, plus optional calendar file */
  reminderTime?: string;
  /** Send anonymous crash reports to our own server */
  errorReports: boolean;
}

export interface LessonProgress {
  completedAt?: string;
  quizBest?: number;
  quizAttempts: number;
  selfChecks: string[];
  lastVisited?: string;
  practiceCount: number;
}

export interface CheckpointProgress {
  passedAt?: string;
  selfChecks: string[];
}

/** One scored pitch-matching attempt (only reliable attempts count toward progress). */
export interface PitchAttemptRecord {
  id: string;
  at: string;
  context: string;
  target: SwaraToken;
  tonic: string;
  targetFreq: number;
  medianCents: number;
  withinPct: number;
  stabilityCents: number;
  octaveOffset: number;
  tolerance: number;
  matched: boolean;
  reliable: boolean;
}

export interface EarTestRecord {
  id: string;
  at: string;
  context: string;
  questions: number;
  correct: number;
  kind: 'same-different' | 'higher-lower' | 'swara-id';
}

export interface RhythmRecord {
  id: string;
  at: string;
  context: string;
  bpm: number;
  taal: TaalId | null;
  taps: number;
  /** mean absolute offset from the beat, ms */
  meanAbsOffsetMs: number;
  /** % of taps within ±80ms */
  onBeatPct: number;
  /** 'tap' = tap-along test; 'sing' = sung syllables measured by the mic (latency-compensated steadiness) */
  mode?: 'tap' | 'sing';
}

export interface PracticeSession {
  id: string;
  /** local date YYYY-MM-DD */
  date: string;
  startedAt: string;
  minutes: number;
  kind: 'riyaz' | 'studio' | 'lesson' | 'song';
  planned?: number;
  exercisesCompleted: string[];
  exercisesSkipped: string[];
  reflection?: string;
  comfort?: 'comfortable' | 'some-strain' | 'discomfort';
}

export interface SelfAssessment {
  id: string;
  at: string;
  weekOf: string;
  answers: Record<string, number>;
  difficult: string;
  notes: string;
}

export interface VideoMeta {
  key: string;
  title: string;
  channel?: string;
  url: string;
  thumbnail?: string;
  savedAt: string;
}

export type SongStatus = 'want' | 'learning' | 'comfortable';

export interface SongPhrase {
  id: string;
  label: string;
  /** optional reference timestamp in the original video (mm:ss), entered by the learner */
  timestamp?: string;
  difficult: boolean;
  done: boolean;
  notes: string;
}

export interface MySong {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: string;
  artwork?: string;
  source: 'itunes' | 'manual';
  sourceUrl?: string;
  status: SongStatus;
  addedAt: string;
  lastPracticed?: string;
  practiceMinutes: number;
  steps: Record<string, boolean>;
  phrases: SongPhrase[];
  notes: string;
  comfortableSa?: string;
  /** AI-generated learning plan (clearly labelled as AI estimate in UI) */
  aiPlan?: { generatedAt: string; text: string };
}

export interface TutorMessage {
  role: 'user' | 'assistant';
  content: string;
  at: string;
  demo?: boolean;
}

export interface RangeRecord {
  id: string;
  at: string;
  /** MIDI note numbers of the lowest / highest comfortably held notes */
  lowMidi: number;
  highMidi: number;
}

export interface BaselineResult {
  at: string;
  pitchMatchedPct: number | null;
  earScorePct: number | null;
  rhythmOnBeatPct: number | null;
  comfortableLow?: string;
  comfortableHigh?: string;
}

export interface AppData {
  version: number;
  createdAt: string;
  profile: Profile;
  settings: Settings;
  lessons: Record<string, LessonProgress>;
  checkpoints: Partial<Record<LevelId, CheckpointProgress>>;
  pitchAttempts: PitchAttemptRecord[];
  earTests: EarTestRecord[];
  rhythm: RhythmRecord[];
  sessions: PracticeSession[];
  selfAssessments: SelfAssessment[];
  videos: { watched: Record<string, string>; favorites: Record<string, VideoMeta> };
  songs: Record<string, MySong>;
  tutor: { messages: TutorMessage[]; memory: string[] };
  baseline?: BaselineResult;
  ranges: RangeRecord[];
}

export function defaultData(now = new Date()): AppData {
  return {
    version: SCHEMA_VERSION,
    createdAt: now.toISOString(),
    profile: {
      onboarded: false,
      name: '',
      experience: 'none',
      language: 'hinglish',
      dailyMinutes: 20,
      favoriteSongs: '',
      favoriteSingers: '',
      focus: 'both',
      hasMic: null,
      hasHeadphones: null,
      tonic: DEFAULT_TONIC,
      tonicSource: 'default',
      startedAt: now.toISOString(),
    },
    settings: { theme: 'system', droneVolume: 0.5, recordingConsent: false, demoTimbre: 'reed', referenceTimbre: 'pure', errorReports: true },
    lessons: {},
    checkpoints: {},
    pitchAttempts: [],
    earTests: [],
    rhythm: [],
    sessions: [],
    selfAssessments: [],
    videos: { watched: {}, favorites: {} },
    songs: {},
    tutor: { messages: [], memory: [] },
    ranges: [],
  };
}

/** Caps to keep localStorage well under browser quotas (~5MB). */
export const LIMITS = { pitchAttempts: 3000, earTests: 500, rhythm: 500, sessions: 2000, tutorMessages: 60, tutorMemory: 30 };
