import type { SwaraToken } from '../music/theory';
import type { TaalId } from '../music/taal';

export type LevelId = 1 | 2 | 3 | 4;

/** Explanation offered in two registers. Hinglish = Roman-script Hindi-English mix. */
export interface Bilingual {
  hinglish: string;
  english: string;
  /** Simple Hindi in Devanagari script (musical terms may stay in Roman script). */
  hindi?: string;
}

/**
 * Playable audio demonstration. All demos are synthesized in the browser
 * relative to the learner's chosen Sa, so they always match their tonic.
 */
export type AudioDemo =
  | { kind: 'note'; label: string; swara: SwaraToken; durationSec?: number }
  | { kind: 'sequence'; label: string; notes: SwaraToken[]; bpm: number }
  | { kind: 'compare'; label: string; a: SwaraToken; b: SwaraToken }
  | { kind: 'glide'; label: string; from: SwaraToken; to: SwaraToken; durationSec: number }
  | { kind: 'drone'; label: string }
  | { kind: 'taal'; label: string; taal: TaalId; bpm: number; cycles?: number };

/** The in-app tool a learner should open for an exercise. */
export type PracticeTool =
  | 'pitch-match'
  | 'sargam'
  | 'drone'
  | 'metronome'
  | 'taal'
  | 'keyboard'
  | 'recorder'
  | 'ear-training'
  | 'none';

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

/**
 * How a lesson is judged complete (beyond passing the quiz).
 * - pitch-match: measured by the microphone pitch-matching tool.
 * - ear-test: measured by the in-app same/different listening test.
 * - self-check: things a pitch detector cannot measure (posture, comfort,
 *   breath). Shown to the learner explicitly as self-reported.
 */
export type PracticalCheck =
  | {
      kind: 'pitch-match';
      description: string;
      targets: SwaraToken[];
      minAttempts: number;
      /** % of attempts that must be "matched" (median within ±toleranceCents) */
      minSuccessPct: number;
      toleranceCents: number;
    }
  | { kind: 'ear-test'; description: string; minQuestions: number; minScorePct: number }
  | { kind: 'self-check'; description: string; items: string[] };

export interface Lesson {
  /** stable id, e.g. "l1-what-is-sur" */
  id: string;
  level: LevelId;
  /** module/unit name within the level, e.g. "Understanding Sur" */
  module: string;
  title: string;
  objective: string;
  explanation: Bilingual;
  whyItMatters: string;
  /** Optional note on differing traditions / simplifications. */
  traditionNote?: string;
  demos: AudioDemo[];
  guidedSteps: string[];
  independentPractice: {
    instructions: string;
    durationMin: number;
    tool: PracticeTool;
    /** Optional sargam pattern for the sargam player / pitch tools */
    pattern?: SwaraToken[];
    bpm?: number;
  };
  mistakes: { mistake: string; fix: string }[];
  quiz: QuizQuestion[];
  practical?: PracticalCheck;
  /** Precise YouTube search queries (we never invent specific video links). */
  videoQueries: string[];
  nextStep: string;
  /** Rough minutes to read + do once */
  estMinutes: number;
  /** Optional vocal-safety callout shown prominently */
  safetyNote?: string;
}

export interface LevelCheckpoint {
  title: string;
  description: string;
  /** Measured requirements to unlock the next level (in addition to completing all lessons) */
  requirements: PracticalCheck[];
}

export interface Level {
  id: LevelId;
  title: string;
  subtitle: string;
  /** Flexible guideline only — progress is never gated by time. */
  suggestedDuration: string;
  description: string;
  lessons: Lesson[];
  checkpoint: LevelCheckpoint;
}
