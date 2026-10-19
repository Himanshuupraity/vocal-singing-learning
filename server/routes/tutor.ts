import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import type { ServerConfig } from '../config';
import { SONG_PLAN_SYSTEM, TUTOR_SYSTEM } from '../lib/tutorPrompt';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(6000),
});

export const TutorRequest = z.object({
  messages: z.array(MessageSchema).min(1).max(16),
  /** Structured learner context built by the client (never the whole database). */
  context: z.record(z.string(), z.unknown()).refine((c) => JSON.stringify(c).length <= 12000, 'context too large'),
  language: z.enum(['hinglish', 'english', 'hindi']),
});

export const SongPlanRequest = z.object({
  song: z.object({
    title: z.string().min(1).max(200),
    artist: z.string().max(200).default(''),
    album: z.string().max(200).optional(),
    year: z.string().max(10).optional(),
  }),
  learner: z.object({ level: z.number().int().min(1).max(4), tonic: z.string().max(10), completedTopics: z.array(z.string().max(120)).max(60) }),
  language: z.enum(['hinglish', 'english', 'hindi']),
});

/** Models that accept server-side refusal fallbacks (fallbacks: "default"). */
const FALLBACK_MODELS = new Set(['claude-opus-5-5', 'claude-opus-5', 'claude-fable-5-1', 'claude-sonnet-5-5']);

export type ClientFactory = (apiKey: string) => Anthropic;

function sse(res: import('express').Response) {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();
  return (event: string, data: unknown) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function friendlyError(e: unknown): { status: number; message: string } {
  if (e instanceof Anthropic.AuthenticationError) return { status: 502, message: 'The server’s Claude API key was rejected. Check ANTHROPIC_API_KEY in .env.' };
  if (e instanceof Anthropic.PermissionDeniedError) return { status: 502, message: 'The Claude API key does not have permission for this model.' };
  if (e instanceof Anthropic.NotFoundError) return { status: 502, message: 'The configured Claude model was not found. Check CLAUDE_MODEL in .env.' };
  if (e instanceof Anthropic.RateLimitError) return { status: 429, message: 'The tutor is busy right now (rate limited). Please wait a minute and try again.' };
  if (e instanceof Anthropic.BadRequestError) return { status: 400, message: 'The tutor could not process that request.' };
  if (e instanceof Anthropic.APIConnectionTimeoutError) return { status: 504, message: 'The tutor took too long to respond. Please try again.' };
  if (e instanceof Anthropic.APIConnectionError) return { status: 502, message: 'Could not reach the Claude API. Check the server’s internet connection.' };
  if (e instanceof Anthropic.APIError) return { status: 502, message: `Claude API error (${e.status ?? 'unknown'}). Please try again.` };
  return { status: 500, message: 'Unexpected tutor error. Please try again.' };
}

async function streamClaude(
  client: Anthropic,
  cfg: ServerConfig,
  params: { system: Anthropic.Beta.BetaTextBlockParam[]; messages: Anthropic.Beta.BetaMessageParam[]; maxTokens: number },
  res: import('express').Response,
  req: import('express').Request,
) {
  const send = sse(res);
  const abort = new AbortController();
  req.on('close', () => abort.abort());
  try {
    const useFallback = FALLBACK_MODELS.has(cfg.claudeModel);
    const stream = client.beta.messages.stream(
      {
        model: cfg.claudeModel,
        max_tokens: params.maxTokens,
        system: params.system,
        messages: params.messages,
        output_config: { effort: 'medium' },
        ...(useFallback ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const } : {}),
      },
      { signal: abort.signal, timeout: 90_000 },
    );
    stream.on('text', (delta) => send('delta', { text: delta }));
    const final = await stream.finalMessage();
    if (final.stop_reason === 'refusal') {
      send('error', { message: 'The tutor could not answer that request. Try rephrasing it as a singing question.' });
    } else {
      send('done', { stopReason: final.stop_reason, model: final.model });
    }
  } catch (e) {
    if (abort.signal.aborted) return;
    const fe = friendlyError(e);
    console.error('[tutor]', (e as Error).message);
    send('error', { message: fe.message });
  } finally {
    res.end();
  }
}

export function tutorRouter(cfg: ServerConfig, makeClient: ClientFactory = (apiKey) => new Anthropic({ apiKey, maxRetries: 2 })) {
  const r = Router();
  let client: Anthropic | null = null;
  const getClient = () => (client ??= makeClient(cfg.anthropicKey!));

  r.post('/tutor', async (req, res) => {
    if (!cfg.anthropicKey) return res.status(503).json({ error: 'not_configured', message: 'The AI tutor is not configured on the server (ANTHROPIC_API_KEY missing).' });
    const parsed = TutorRequest.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_request', message: parsed.error.issues[0]?.message ?? 'Invalid request' });
    const { messages, context, language } = parsed.data;
    if (messages[0].role !== 'user') messages.shift();
    if (!messages.length || messages[messages.length - 1].role !== 'user') return res.status(400).json({ error: 'invalid_request', message: 'The last message must be from the learner.' });

    const learnerContext = `LEARNER CONTEXT (measured and saved by the app; values are real data, not guesses)\nPreferred language: ${language}\n${JSON.stringify(context, null, 1)}`;
    await streamClaude(
      getClient(),
      cfg,
      {
        system: [
          { type: 'text', text: TUTOR_SYSTEM, cache_control: { type: 'ephemeral' } },
          { type: 'text', text: learnerContext },
        ],
        messages,
        maxTokens: 4000,
      },
      res,
      req,
    );
  });

  r.post('/songs/plan', async (req, res) => {
    if (!cfg.anthropicKey) return res.status(503).json({ error: 'not_configured', message: 'AI song plans need ANTHROPIC_API_KEY on the server.' });
    const parsed = SongPlanRequest.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_request', message: parsed.error.issues[0]?.message ?? 'Invalid request' });
    const { song, learner, language } = parsed.data;
    const prompt = `Song metadata (from the iTunes catalogue or typed by the learner):\n${JSON.stringify(song)}\n\nLearner: SurSadhana level ${learner.level}, current Sa ${learner.tonic}. Completed topics: ${learner.completedTopics.join('; ') || 'none yet'}.\nLanguage: ${language}.\n\nWrite the learning plan.`;
    await streamClaude(
      getClient(),
      cfg,
      { system: [{ type: 'text', text: SONG_PLAN_SYSTEM, cache_control: { type: 'ephemeral' } }], messages: [{ role: 'user', content: prompt }], maxTokens: 3000 },
      res,
      req,
    );
  });

  return r;
}
