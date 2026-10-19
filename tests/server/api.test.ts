// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../server/app';
import { loadConfig } from '../../server/config';
import { formatIsoDuration } from '../../server/routes/youtube';
import os from 'node:os';
import path from 'node:path';

process.env.DATA_DIR = ':memory:';
process.env.LOG_DIR = path.join(os.tmpdir(), 'sursadhana-test-logs');

const noKeys = loadConfig({ ANTHROPIC_API_KEY: 'your-anthropic-api-key-here', YOUTUBE_API_KEY: '' } as NodeJS.ProcessEnv);
const withKeys = loadConfig({ ANTHROPIC_API_KEY: 'sk-test', YOUTUBE_API_KEY: 'yt-test' } as NodeJS.ProcessEnv);

const jsonRes = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('config', () => {
  it('treats placeholder keys as missing', () => {
    expect(noKeys.anthropicKey).toBeNull();
    expect(noKeys.youtubeKey).toBeNull();
    expect(noKeys.claudeModel).toBe('claude-opus-5-5');
  });
});

describe('status', () => {
  it('reports configuration without exposing secrets', async () => {
    const r = await request(createApp(withKeys)).get('/api/status');
    expect(r.body.tutor.configured).toBe(true);
    expect(JSON.stringify(r.body)).not.toContain('sk-test');
    expect(JSON.stringify(r.body)).not.toContain('yt-test');
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
