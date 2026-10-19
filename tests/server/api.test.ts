// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../server/app';
import { loadConfig } from '../../server/config';
import { formatIsoDuration } from '../../server/routes/youtube';
import { ApiError as GeminiApiError } from '@google/genai';
import os from 'node:os';
import path from 'node:path';

process.env.DATA_DIR = ':memory:';
process.env.LOG_DIR = path.join(os.tmpdir(), 'sursadhana-test-logs');

const noKeys = loadConfig({ ANTHROPIC_API_KEY: 'your-anthropic-api-key-here', YOUTUBE_API_KEY: '' } as NodeJS.ProcessEnv);
const withKeys = loadConfig({ ANTHROPIC_API_KEY: 'sk-test', YOUTUBE_API_KEY: 'yt-test' } as NodeJS.ProcessEnv);
const geminiOnly = loadConfig({ GEMINI_API_KEY: 'gm-test' } as NodeJS.ProcessEnv);

const jsonRes = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('config', () => {
  it('treats placeholder keys as missing', () => {
    expect(noKeys.anthropicKey).toBeNull();
    expect(noKeys.youtubeKey).toBeNull();
    expect(noKeys.claudeModel).toBe('claude-opus-5-5');
    expect(noKeys.tutorProvider).toBeNull();
  });

  it('picks Claude when both keys are set, else Gemini', () => {
    expect(loadConfig({ ANTHROPIC_API_KEY: 'sk-test', GEMINI_API_KEY: 'gm-test' } as NodeJS.ProcessEnv).tutorProvider).toBe('claude');
    expect(geminiOnly.tutorProvider).toBe('gemini');
    expect(geminiOnly.geminiModel).toBe('gemini-flash-latest');
    expect(loadConfig({ GEMINI_API_KEY: 'your-gemini-api-key-here' } as NodeJS.ProcessEnv).tutorProvider).toBeNull();
  });
});

describe('status', () => {
  it('reports configuration without exposing secrets', async () => {
    const r = await request(createApp(withKeys)).get('/api/status');
    expect(r.body.tutor.configured).toBe(true);
    expect(JSON.stringify(r.body)).not.toContain('sk-test');
    expect(JSON.stringify(r.body)).not.toContain('yt-test');
  });

  it('reports the Gemini provider and model', async () => {
    const r = await request(createApp(geminiOnly)).get('/api/status');
    expect(r.body.tutor).toEqual({ configured: true, provider: 'gemini', model: 'gemini-flash-latest', voice: true });
    expect(JSON.stringify(r.body)).not.toContain('gm-test');
  });
});

describe('tutor', () => {
  it('returns 503 not_configured without a key', async () => {
    const r = await request(createApp(noKeys)).post('/api/tutor').send({ messages: [{ role: 'user', content: 'hi' }], context: {}, language: 'english' });
    expect(r.status).toBe(503);
    expect(r.body.error).toBe('not_configured');
  });

  it('validates input', async () => {
    const r = await request(createApp(withKeys)).post('/api/tutor').send({ messages: [], context: {}, language: 'klingon' });
    expect(r.status).toBe(400);
  });

  it('rejects oversized context', async () => {
    const r = await request(createApp(withKeys)).post('/api/tutor').send({ messages: [{ role: 'user', content: 'hi' }], context: { x: 'a'.repeat(13000) }, language: 'english' });
    expect(r.status).toBe(400);
  });

  it('streams text from Claude as SSE with system prompt + learner context', async () => {
    const calls: unknown[] = [];
    const fakeClient = {
      beta: {
        messages: {
          stream: (params: unknown) => {
            calls.push(params);
            const handlers: Record<string, (t: string) => void> = {};
            return {
              on(ev: string, cb: (t: string) => void) {
                handlers[ev] = cb;
                return this;
              },
              async finalMessage() {
                handlers.text?.('Namaste! ');
                handlers.text?.('Sa is your home note.');
                return { stop_reason: 'end_turn', model: 'claude-opus-5-5' };
              },
            };
          },
        },
      },
    };
    const app = createApp(withKeys, { makeClient: () => fakeClient as never });
    const r = await request(app).post('/api/tutor').send({ messages: [{ role: 'user', content: 'What is Sa?' }], context: { level: 1 }, language: 'hinglish' });
    expect(r.status).toBe(200);
    expect(r.text).toContain('event: delta');
    expect(r.text).toContain('Sa is your home note.');
    expect(r.text).toContain('event: done');
    const p = calls[0] as { model: string; system: { text: string }[]; fallbacks: string };
    expect(p.model).toBe('claude-opus-5-5');
    expect(p.fallbacks).toBe('default');
    expect(p.system[0].text).toMatch(/Vocal health/);
    expect(p.system[1].text).toMatch(/"level": 1/);
  });

  const fakeGemini = (chunks: unknown[] | Error, calls: unknown[] = []) => ({
    models: {
      generateContentStream: async (params: unknown) => {
        calls.push(params);
        if (chunks instanceof Error) throw chunks;
        return (async function* () {
          yield* chunks;
        })();
      },
    },
  });
  const geminiChunk = (text: string, finishReason?: string) => ({ text, candidates: [{ finishReason }], modelVersion: 'gemini-test-001' });

  it('streams Gemini text as SSE with the system prompt and mapped roles', async () => {
    const calls: unknown[] = [];
    const app = createApp(geminiOnly, { makeGemini: () => fakeGemini([geminiChunk('Namaste! '), geminiChunk('Sa is your home note.', 'STOP')], calls) as never });
    const r = await request(app)
      .post('/api/tutor')
      .send({ messages: [{ role: 'user', content: 'Hi' }, { role: 'assistant', content: 'Hello' }, { role: 'user', content: 'What is Sa?' }], context: { level: 1 }, language: 'hinglish' });
    expect(r.status).toBe(200);
    expect(r.text).toContain('Sa is your home note.');
    expect(r.text).toContain('event: done');
    expect(r.text).toContain('gemini-test-001');
    const p = calls[0] as { model: string; contents: { role: string }[]; config: { systemInstruction: string } };
    expect(p.model).toBe('gemini-flash-latest');
    expect(p.contents.map((c) => c.role)).toEqual(['user', 'model', 'user']);
    expect(p.config.systemInstruction).toMatch(/Vocal health/);
    expect(p.config.systemInstruction).toMatch(/"level": 1/);
  });

  it('turns a Gemini safety stop into an error event', async () => {
    const app = createApp(geminiOnly, { makeGemini: () => fakeGemini([geminiChunk('', 'SAFETY')]) as never });
    const r = await request(app).post('/api/tutor').send({ messages: [{ role: 'user', content: 'hi' }], context: {}, language: 'english' });
    expect(r.text).toContain('event: error');
    expect(r.text).not.toContain('event: done');
  });

  it('explains a rejected Gemini key', async () => {
    const err = new GeminiApiError({ message: 'API key not valid. Please pass a valid API key.', status: 400 });
    const app = createApp(geminiOnly, { makeGemini: () => fakeGemini(err) as never });
    const r = await request(app).post('/api/songs/plan').send({ song: { title: 'Tum Hi Ho', artist: 'Arijit Singh' }, learner: { level: 1, tonic: 'C', completedTopics: [] }, language: 'english' });
    expect(r.text).toContain('event: error');
    expect(r.text).toContain('GEMINI_API_KEY');
  });
});

describe('voice feedback', () => {
  const wav = (bytes = 2000) => {
    const b = Buffer.alloc(44 + bytes);
    b.write('RIFF', 0, 'latin1');
    b.writeUInt32LE(36 + bytes, 4);
    b.write('WAVE', 8, 'latin1');
    return b.toString('base64');
  };
  const body = (audio = wav()) => ({
    audio,
    mimeType: 'audio/wav',
    language: 'hinglish',
    exercise: 'Sa Re Ga Ma — akar',
    label: 'Morning riyaz',
    level: 1,
    tonic: 'C3',
    measured: { durationSec: 12.3, voicedSec: 9.8, lowest: 'S', highest: 'P', steadinessCents: 7.5, swaras: [{ label: 'Sa', sec: 3.2, avgCents: -12 }] },
  });
  const fake = (calls: unknown[]) => ({
    models: {
      generateContentStream: async (p: unknown) => {
        calls.push(p);
        return (async function* () {
          yield { text: 'Aapka Sa steady tha.', candidates: [{ finishReason: 'STOP' }], modelVersion: 'gemini-test' };
        })();
      },
    },
  });

  it('needs a Gemini key even when Claude runs the chat', async () => {
    const claudeOnly = loadConfig({ ANTHROPIC_API_KEY: 'sk-test' } as NodeJS.ProcessEnv);
    const r = await request(createApp(claudeOnly)).post('/api/tutor/voice').send(body());
    expect(r.status).toBe(503);
    expect((await request(createApp(claudeOnly)).get('/api/status')).body.tutor.voice).toBe(false);
  });

  it('rejects audio that is not a WAV file, or too large', async () => {
    const app = createApp(geminiOnly, { makeGemini: () => fake([]) as never });
    expect((await request(app).post('/api/tutor/voice').send(body(Buffer.from('not a wav file at all, just text '.repeat(10)).toString('base64')))).status).toBe(400);
    expect((await request(app).post('/api/tutor/voice').send(body(wav(2_700_000)))).status).toBe(400);
  });

  it('does not cancel the AI call once the (large) request body has been read', async () => {
    // Regression: listening on the request's 'close' aborted every call right after the body was parsed.
    const slow = {
      models: {
        generateContentStream: async (p: { config: { abortSignal: AbortSignal } }) => {
          await new Promise((r) => setTimeout(r, 50));
          if (p.config.abortSignal.aborted) throw Object.assign(new Error('aborted'), { name: 'AbortError' });
          return (async function* () {
            yield { text: 'Still listening.', candidates: [{ finishReason: 'STOP' }] };
          })();
        },
      },
    };
    const r = await request(createApp(geminiOnly, { makeGemini: () => slow as never })).post('/api/tutor/voice').send(body(wav(400_000)));
    expect(r.text).toContain('Still listening.');
    expect(r.text).toContain('event: done');
  });

  it('sends the clip and the app measurements to Gemini and streams the feedback', async () => {
    const calls: unknown[] = [];
    const both = loadConfig({ ANTHROPIC_API_KEY: 'sk-test', GEMINI_API_KEY: 'gm-test' } as NodeJS.ProcessEnv);
    const app = createApp(both, { makeGemini: () => fake(calls) as never, makeClient: () => { throw new Error('Claude must not be used for audio'); } });
    const r = await request(app).post('/api/tutor/voice').send(body());
    expect(r.status).toBe(200);
    expect(r.text).toContain('Aapka Sa steady tha.');
    expect(r.text).toContain('event: done');
    const p = calls[0] as { contents: { parts: ({ inlineData?: { mimeType: string; data: string } } & { text?: string })[] }[]; config: { systemInstruction: string } };
    expect(p.contents[0].parts[0].inlineData).toEqual({ mimeType: 'audio/wav', data: body().audio });
    expect(p.contents[0].parts[1].text).toMatch(/Sa 3\.2s -12¢/);
    expect(p.contents[0].parts[1].text).toMatch(/Sa = C3/);
    expect(p.config.systemInstruction).toMatch(/source of truth for pitch/);
  });

  describe('live coach', () => {
    it('needs a Gemini key', async () => {
      const claudeOnly = loadConfig({ ANTHROPIC_API_KEY: 'sk-test' } as NodeJS.ProcessEnv);
      expect((await request(createApp(claudeOnly)).post('/api/tutor/coach').send(body())).status).toBe(503);
    });

    it('accepts only short WAV snippets', async () => {
      const app = createApp(geminiOnly, { makeGemini: () => fake([]) as never });
      expect((await request(app).post('/api/tutor/coach').send(body(Buffer.from('plain text, not audio '.repeat(10)).toString('base64')))).status).toBe(400);
      // ~40 s of audio is too long for a live tip (the body parser or the schema refuses it).
      expect((await request(app).post('/api/tutor/coach').send(body(wav(1_300_000)))).status).toBeGreaterThanOrEqual(400);
    });

    it('sends the snippet, the target and the previous tips, and streams one short tip', async () => {
      const calls: unknown[] = [];
      const app = createApp(geminiOnly, { makeGemini: () => fake(calls) as never });
      const r = await request(app)
        .post('/api/tutor/coach')
        .send({ ...body(wav(200_000)), target: 'Holding Sa', previous: ['Open your mouth a little more on "aa".'] });
      expect(r.status).toBe(200);
      expect(r.text).toContain('Aapka Sa steady tha.');
      const p = calls[0] as { contents: { parts: ({ inlineData?: unknown } & { text?: string })[] }[]; config: { systemInstruction: string; maxOutputTokens: number } };
      expect(p.contents[0].parts[0].inlineData).toBeDefined();
      expect(p.contents[0].parts[1].text).toMatch(/Holding Sa/);
      expect(p.contents[0].parts[1].text).toMatch(/Open your mouth a little more/);
      expect(p.config.systemInstruction).toMatch(/ONE short spoken-style tip/);
      expect(p.config.maxOutputTokens).toBeLessThanOrEqual(600);
    });
  });
});

describe('youtube', () => {
  it('returns not_configured without a key', async () => {
    const r = await request(createApp(noKeys)).get('/api/youtube/search?q=sargam');
    expect(r.status).toBe(503);
  });

  it('maps search + video details', async () => {
    const fetchImpl = vi.fn(async (url: string | URL | Request) => {
      const u = String(url);
      if (u.includes('/search?')) return jsonRes(200, { items: [{ id: { videoId: 'abc' }, snippet: { title: 'Sargam &amp; Alankar', channelTitle: 'Teacher', publishedAt: '2024-01-01', thumbnails: { medium: { url: 'https://i.ytimg.com/x.jpg' } } } }] });
      return jsonRes(200, { items: [{ id: 'abc', contentDetails: { duration: 'PT12M5S' }, status: { embeddable: true } }] });
    });
    const r = await request(createApp(withKeys, { fetchImpl: fetchImpl as never })).get('/api/youtube/search?q=sargam');
    expect(r.status).toBe(200);
    expect(r.body.results[0]).toMatchObject({ id: 'abc', title: 'Sargam & Alankar', duration: '12:05', embeddable: true, url: 'https://www.youtube.com/watch?v=abc' });
  });

  it('handles quota exhaustion gracefully', async () => {
    const fetchImpl = vi.fn(async () => jsonRes(403, { error: { errors: [{ reason: 'quotaExceeded' }] } }));
    const r = await request(createApp(withKeys, { fetchImpl: fetchImpl as never })).get('/api/youtube/search?q=sargam');
    expect(r.status).toBe(429);
    expect(r.body.error).toBe('quota');
  });

  it('formats ISO durations', () => {
    expect(formatIsoDuration('PT1H2M3S')).toBe('1:02:03');
    expect(formatIsoDuration('PT45S')).toBe('0:45');
  });
});

describe('song search', () => {
  it('maps iTunes results and dedupes', async () => {
    const track = { kind: 'song', trackId: 1, trackName: 'Tum Hi Ho', artistName: 'Arijit Singh', collectionName: 'Aashiqui 2', releaseDate: '2013-03-15T00:00:00Z' };
    const fetchImpl = vi.fn(async () => jsonRes(200, { results: [track, { ...track, trackId: 2 }] }));
    const r = await request(createApp(noKeys, { fetchImpl: fetchImpl as never })).get('/api/songs/search?q=tum hi ho');
    expect(r.status).toBe(200);
    expect(r.body.results).toHaveLength(1);
    expect(r.body.results[0]).toMatchObject({ title: 'Tum Hi Ho', artist: 'Arijit Singh', album: 'Aashiqui 2', year: '2013' });
  });

  it('rejects too-short queries', async () => {
    const r = await request(createApp(noKeys)).get('/api/songs/search?q=a');
    expect(r.status).toBe(400);
  });

  it('reports upstream failure', async () => {
    const fetchImpl = vi.fn(async () => jsonRes(500, {}));
    const r = await request(createApp(noKeys, { fetchImpl: fetchImpl as never })).get('/api/songs/search?q=kesariya');
    expect(r.status).toBe(502);
  });
});
