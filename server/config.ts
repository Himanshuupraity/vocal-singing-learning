import 'dotenv/config';

const placeholder = (v?: string) => !v || /^your-.*-here$/.test(v) || v.trim() === '';

export type TutorProvider = 'claude' | 'gemini';

export interface ServerConfig {
  anthropicKey: string | null;
  claudeModel: string;
  geminiKey: string | null;
  geminiModel: string;
  /** Which AI powers the tutor: Claude when its key is set, else Gemini, else none. */
  tutorProvider: TutorProvider | null;
  youtubeKey: string | null;
  /** Postgres for learner profiles; without it they live in a local SQLite file. */
  databaseUrl: string | null;
  port: number;
  tutorRateLimit: number;
}

export function loadConfig(env = process.env): ServerConfig {
  const anthropicKey = placeholder(env.ANTHROPIC_API_KEY) ? null : env.ANTHROPIC_API_KEY!;
  const geminiKey = placeholder(env.GEMINI_API_KEY) ? null : env.GEMINI_API_KEY!;
  return {
    anthropicKey,
    claudeModel: env.CLAUDE_MODEL?.trim() || 'claude-opus-5-5',
    geminiKey,
    geminiModel: env.GEMINI_MODEL?.trim() || 'gemini-flash-latest',
    tutorProvider: anthropicKey ? 'claude' : geminiKey ? 'gemini' : null,
    youtubeKey: placeholder(env.YOUTUBE_API_KEY) ? null : env.YOUTUBE_API_KEY!,
    databaseUrl: env.DATABASE_URL?.trim() || env.POSTGRES_URL?.trim() || null,
    port: Number(env.PORT) || 8787,
    tutorRateLimit: Number(env.TUTOR_RATE_LIMIT) || 40,
  };
}

export function tutorModel(cfg: ServerConfig): string | null {
  return cfg.tutorProvider === 'claude' ? cfg.claudeModel : cfg.tutorProvider === 'gemini' ? cfg.geminiModel : null;
}
