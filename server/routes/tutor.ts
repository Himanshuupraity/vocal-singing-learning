import express, { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { ApiError as GeminiApiError, FinishReason, GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import type { ServerConfig } from '../config';
import { LIVE_COACH_SYSTEM, SONG_PLAN_SYSTEM, TUTOR_SYSTEM, VOICE_FEEDBACK_SYSTEM } from '../lib/tutorPrompt';

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

/** ~60 s of 16 kHz mono 16-bit WAV is ~1.9 MB, ~2.6 MB as base64. */
const MAX_AUDIO_B64 = 3_500_000;
/** ~25 s of the same WAV, for live-coach snippets. */
const MAX_COACH_B64 = 1_100_000;

export const VoiceFeedbackRequest = z.object({
  audio: z.string().min(100).max(MAX_AUDIO_B64).regex(/^[A-Za-z0-9+/]+={0,2}$/, 'Audio must be base64.'),
  mimeType: z.literal('audio/wav'),
  language: z.enum(['hinglish', 'english', 'hindi']),
  exercise: z.string().max(200).default(''),
  label: z.string().max(200).default(''),
  level: z.number().int().min(1).max(4),
  tonic: z.string().max(10),
  measured: z.object({
    durationSec: z.number().min(0).max(600),
    voicedSec: z.number().min(0).max(600),
    lowest: z.string().max(12).nullable(),
    highest: z.string().max(12).nullable(),
    steadinessCents: z.number().nullable(),
    swaras: z.array(z.object({ label: z.string().max(12), sec: z.number(), avgCents: z.number() })).max(12),
  }),
});

/** A short snippet from the Live Coach, plus the last few tips so the coach doesn't repeat itself. */
export const CoachRequest = VoiceFeedbackRequest.extend({
  audio: z.string().min(100).max(MAX_COACH_B64).regex(/^[A-Za-z0-9+/]+={0,2}$/, 'Audio must be base64.'),
  target: z.string().max(40).default(''),
  previous: z.array(z.string().max(500)).max(3).default([]),
});

const isWav = (b64: string) => {
  const head = Buffer.from(b64.slice(0, 16), 'base64');
  return head.subarray(0, 4).toString('latin1') === 'RIFF' && head.subarray(8, 12).toString('latin1') === 'WAVE';
};

function describeMeasured(m: z.infer<typeof VoiceFeedbackRequest>['measured']) {
  return `App measurements of this clip: ${m.durationSec.toFixed(1)}s long, ${m.voicedSec.toFixed(1)}s of clear singing; range ${m.lowest ?? '—'} to ${m.highest ?? '—'}; steadiness ${m.steadinessCents === null ? 'not measured' : `${m.steadinessCents} cents typical wobble (lower = steadier)`}.
Swaras held longest (time, average offset from the exact swara): ${m.swaras.map((s) => `${s.label} ${s.sec.toFixed(1)}s ${s.avgCents > 0 ? '+' : ''}${Math.round(s.avgCents)}¢`).join('; ') || 'none detected'}.`;
}

export type ClientFactory = (apiKey: string) => Anthropic;
export type GeminiFactory = (apiKey: string) => GoogleGenAI;

type ChatMessage = z.infer<typeof MessageSchema>;
/** One prompt, written once and sent to whichever provider is configured. */
interface TutorPrompt { system: string; context?: string; messages: ChatMessage[]; maxTokens: number; audio?: { mimeType: string; data: string } }

function sse(res: import('express').Response) {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();
  return (event: string, data: unknown) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

/**
 * Aborts the upstream call if the browser goes away mid-stream. Listens on the
 * response: a request's own 'close' also fires once its body has been read,
 * which would cancel every request that carries a large body.
 */
function onClientGone(res: import('express').Response, fn: () => void) {
  res.on('close', () => {
    if (!res.writableEnded) fn();
  });
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
  prompt: TutorPrompt,
  res: import('express').Response,
  req: import('express').Request,
) {
  const params = {
    system: [
      { type: 'text', text: prompt.system, cache_control: { type: 'ephemeral' } },
      ...(prompt.context ? [{ type: 'text', text: prompt.context }] : []),
    ] as Anthropic.Beta.BetaTextBlockParam[],
    messages: prompt.messages,
    maxTokens: prompt.maxTokens,
  };
  const send = sse(res);
  const abort = new AbortController();
  onClientGone(res, () => abort.abort());
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

function friendlyGeminiError(e: unknown): { status: number; message: string } {
  if (e instanceof GeminiApiError) {
    if (/api key/i.test(e.message) || e.status === 401 || e.status === 403) return { status: 502, message: 'The server’s Gemini API key was rejected. Check GEMINI_API_KEY in .env.' };
    if (e.status === 404) return { status: 502, message: 'The configured Gemini model was not found. Check GEMINI_MODEL in .env.' };
    if (e.status === 429) return { status: 429, message: 'The tutor is busy right now (rate limited). Please wait a minute and try again.' };
    if (e.status === 400) return { status: 400, message: 'The tutor could not process that request.' };
    return { status: 502, message: `Gemini API error (${e.status ?? 'unknown'}). Please try again.` };
  }
  return { status: 502, message: 'Could not reach the Gemini API, or it took too long. Please try again.' };
}

/** Finish reasons that mean Gemini withheld the answer rather than finished it. */
const GEMINI_BLOCKED = new Set<string>([FinishReason.SAFETY, FinishReason.RECITATION, FinishReason.BLOCKLIST, FinishReason.PROHIBITED_CONTENT, FinishReason.SPII]);

async function streamGemini(
  ai: GoogleGenAI,
  cfg: ServerConfig,
  prompt: TutorPrompt,
  res: import('express').Response,
  req: import('express').Request,
) {
  const send = sse(res);
  const abort = new AbortController();
  onClientGone(res, () => abort.abort());
  try {
    const stream = await ai.models.generateContentStream({
      model: cfg.geminiModel,
      contents: prompt.messages.map((m, i) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        // Audio, when sent, rides along with the last learner message.
        parts: [...(prompt.audio && i === prompt.messages.length - 1 ? [{ inlineData: prompt.audio }] : []), { text: m.content }],
      })),
      config: {
        systemInstruction: [prompt.system, prompt.context].filter(Boolean).join('\n\n'),
        // Thinking tokens count against this limit on Gemini, so leave headroom.
        maxOutputTokens: prompt.maxTokens * 2,
        abortSignal: abort.signal,
        httpOptions: { timeout: 90_000 },
      },
    });
    let finish: string | undefined;
    let model: string | undefined;
    let blocked = false;
    for await (const chunk of stream) {
      if (chunk.promptFeedback?.blockReason) blocked = true;
      const text = chunk.text;
      if (text) send('delta', { text });
      finish = chunk.candidates?.[0]?.finishReason ?? finish;
      model = chunk.modelVersion ?? model;
    }
    if (blocked || (finish && GEMINI_BLOCKED.has(finish))) {
      send('error', { message: 'The tutor could not answer that request. Try rephrasing it as a singing question.' });
    } else {
      send('done', { stopReason: finish === FinishReason.MAX_TOKENS ? 'max_tokens' : 'end_turn', model: model ?? cfg.geminiModel });
    }
  } catch (e) {
    if (abort.signal.aborted) return;
    const fe = friendlyGeminiError(e);
    console.error('[tutor]', (e as Error).message);
    send('error', { message: fe.message });
  } finally {
    res.end();
  }
}

export function tutorRouter(
  cfg: ServerConfig,
  makeClient: ClientFactory = (apiKey) => new Anthropic({ apiKey, maxRetries: 2 }),
  makeGemini: GeminiFactory = (apiKey) => new GoogleGenAI({ apiKey, httpOptions: { retryOptions: { attempts: 3 } } }),
) {
  const r = Router();
  let client: Anthropic | null = null;
  let gemini: GoogleGenAI | null = null;
  const run = (prompt: TutorPrompt, res: import('express').Response, req: import('express').Request) =>
    cfg.tutorProvider === 'claude'
      ? streamClaude((client ??= makeClient(cfg.anthropicKey!)), cfg, prompt, res, req)
      : streamGemini((gemini ??= makeGemini(cfg.geminiKey!)), cfg, prompt, res, req);

  r.post('/tutor', async (req, res) => {
    if (!cfg.tutorProvider) return res.status(503).json({ error: 'not_configured', message: 'The AI tutor is not configured on the server (set ANTHROPIC_API_KEY or GEMINI_API_KEY).' });
    const parsed = TutorRequest.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_request', message: parsed.error.issues[0]?.message ?? 'Invalid request' });
    const { messages, context, language } = parsed.data;
    if (messages[0].role !== 'user') messages.shift();
    if (!messages.length || messages[messages.length - 1].role !== 'user') return res.status(400).json({ error: 'invalid_request', message: 'The last message must be from the learner.' });

    const learnerContext = `LEARNER CONTEXT (measured and saved by the app; values are real data, not guesses)\nPreferred language: ${language}\n${JSON.stringify(context, null, 1)}`;
    await run({ system: TUTOR_SYSTEM, context: learnerContext, messages, maxTokens: 4000 }, res, req);
  });

  r.post('/songs/plan', async (req, res) => {
    if (!cfg.tutorProvider) return res.status(503).json({ error: 'not_configured', message: 'AI song plans need ANTHROPIC_API_KEY or GEMINI_API_KEY on the server.' });
    const parsed = SongPlanRequest.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_request', message: parsed.error.issues[0]?.message ?? 'Invalid request' });
    const { song, learner, language } = parsed.data;
    const prompt = `Song metadata (from the iTunes catalogue or typed by the learner):\n${JSON.stringify(song)}\n\nLearner: SurSadhana level ${learner.level}, current Sa ${learner.tonic}. Completed topics: ${learner.completedTopics.join('; ') || 'none yet'}.\nLanguage: ${language}.\n\nWrite the learning plan.`;
    await run({ system: SONG_PLAN_SYSTEM, messages: [{ role: 'user', content: prompt }], maxTokens: 3000 }, res, req);
  });

  r.post('/tutor/voice', express.json({ limit: '4mb' }), async (req, res) => {
    // Only Gemini accepts audio, so this works whenever a Gemini key is set, whichever model runs the chat.
    if (!cfg.geminiKey) return res.status(503).json({ error: 'not_configured', message: 'AI voice feedback needs GEMINI_API_KEY on the server.' });
    const parsed = VoiceFeedbackRequest.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_request', message: parsed.error.issues[0]?.message ?? 'Invalid request' });
    const v = parsed.data;
    if (!isWav(v.audio)) return res.status(400).json({ error: 'invalid_request', message: 'The recording must be a WAV file.' });
    const prompt = `Learner: SurSadhana level ${v.level}, Sa = ${v.tonic}. Language: ${v.language}.
Recording: "${v.label || 'untitled'}"${v.exercise ? `, exercise: ${v.exercise}` : ''}.
${describeMeasured(v.measured)}

Listen to the recording and give your feedback.`;
    await streamGemini(
      (gemini ??= makeGemini(cfg.geminiKey)),
      cfg,
      { system: VOICE_FEEDBACK_SYSTEM, messages: [{ role: 'user', content: prompt }], maxTokens: 1500, audio: { mimeType: v.mimeType, data: v.audio } },
      res,
      req,
    );
  });

  r.post('/tutor/coach', express.json({ limit: '1500kb' }), async (req, res) => {
    if (!cfg.geminiKey) return res.status(503).json({ error: 'not_configured', message: 'The live AI coach needs GEMINI_API_KEY on the server.' });
    const parsed = CoachRequest.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_request', message: parsed.error.issues[0]?.message ?? 'Invalid request' });
    const v = parsed.data;
    if (!isWav(v.audio)) return res.status(400).json({ error: 'invalid_request', message: 'The snippet must be a WAV file.' });
    const prompt = `Learner: SurSadhana level ${v.level}, Sa = ${v.tonic}. Language: ${v.language}.
What they are practising: ${v.target || 'free singing over the tanpura'}.
${describeMeasured(v.measured)}
${v.previous.length ? `Your last tips (don't repeat them; say if things improved):\n${v.previous.map((t) => `- ${t}`).join('\n')}` : 'This is your first tip in this session.'}

Listen to the last few seconds and give one live tip.`;
    await streamGemini(
      (gemini ??= makeGemini(cfg.geminiKey)),
      cfg,
      { system: LIVE_COACH_SYSTEM, messages: [{ role: 'user', content: prompt }], maxTokens: 300, audio: { mimeType: v.mimeType, data: v.audio } },
      res,
      req,
    );
  });

  return r;
}
