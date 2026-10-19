import 'dotenv/config';

const placeholder = (v?: string) => !v || /^your-.*-here$/.test(v) || v.trim() === '';

export interface ServerConfig {
  anthropicKey: string | null;
  claudeModel: string;
  youtubeKey: string | null;
  port: number;
  tutorRateLimit: number;
}

export function loadConfig(env = process.env): ServerConfig {
  return {
    anthropicKey: placeholder(env.ANTHROPIC_API_KEY) ? null : env.ANTHROPIC_API_KEY!,
    claudeModel: env.CLAUDE_MODEL?.trim() || 'claude-opus-5-5',
    youtubeKey: placeholder(env.YOUTUBE_API_KEY) ? null : env.YOUTUBE_API_KEY!,
    port: Number(env.PORT) || 8787,
    tutorRateLimit: Number(env.TUTOR_RATE_LIMIT) || 40,
  };
}
