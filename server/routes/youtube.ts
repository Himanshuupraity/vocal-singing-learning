import { Router } from 'express';
import { z } from 'zod';
import type { ServerConfig } from '../config';

export interface VideoResult {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration?: string;
  embeddable: boolean;
  url: string;
  publishedAt?: string;
}

const Query = z.object({
  q: z.string().trim().min(2).max(150),
  lang: z.enum(['hinglish', 'english', 'hindi']).optional(),
  max: z.coerce.number().int().min(1).max(12).default(8),
});

/** ISO-8601 PT#H#M#S → "h:mm:ss" / "m:ss" */
export function formatIsoDuration(iso: string): string | undefined {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return undefined;
  const [h, mi, s] = [Number(m[1] ?? 0), Number(m[2] ?? 0), Number(m[3] ?? 0)];
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${String(mi).padStart(2, '0')}:${ss}` : `${mi}:${ss}`;
}

const decode = (s: string) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

export function youtubeRouter(cfg: ServerConfig, fetchImpl: typeof fetch = fetch) {
  const r = Router();
  const cache = new Map<string, { at: number; data: VideoResult[] }>();
  let quotaBlockedUntil = 0;
  const TTL = 6 * 60 * 60 * 1000;

  r.get('/youtube/search', async (req, res) => {
    if (!cfg.youtubeKey) return res.status(503).json({ error: 'not_configured', message: 'YouTube search is not configured (YOUTUBE_API_KEY missing).' });
    const parsed = Query.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_request', message: 'Search query must be 2–150 characters.' });
    const { q, lang, max } = parsed.data;
    const key = `${q}|${lang}|${max}`;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL) return res.json({ results: hit.data, cached: true });
    if (Date.now() < quotaBlockedUntil) return res.status(429).json({ error: 'quota', message: 'The daily YouTube API quota has been used up. Use the "Search on YouTube" links until it resets.' });

    try {
      const sp = new URLSearchParams({ part: 'snippet', type: 'video', maxResults: String(max), q, safeSearch: 'strict', key: cfg.youtubeKey, regionCode: 'IN' });
      if (lang === 'english') sp.set('relevanceLanguage', 'en');
      else if (lang) sp.set('relevanceLanguage', 'hi');
      const sr = await fetchImpl(`https://www.googleapis.com/youtube/v3/search?${sp}`, { signal: AbortSignal.timeout(10_000) });
      if (!sr.ok) {
        const body = (await sr.json().catch(() => ({}))) as { error?: { errors?: { reason?: string }[] } };
        const reason = body.error?.errors?.[0]?.reason;
        if (sr.status === 403 && (reason === 'quotaExceeded' || reason === 'dailyLimitExceeded')) {
          quotaBlockedUntil = Date.now() + 60 * 60 * 1000;
          return res.status(429).json({ error: 'quota', message: 'The daily YouTube API quota has been used up. Use the "Search on YouTube" links until it resets.' });
        }
        if (sr.status === 400 || sr.status === 403) return res.status(502).json({ error: 'upstream', message: 'YouTube rejected the request — check that YOUTUBE_API_KEY is valid and the YouTube Data API v3 is enabled.' });
        return res.status(502).json({ error: 'upstream', message: `YouTube search failed (${sr.status}).` });
      }
      const sj = (await sr.json()) as { items?: { id?: { videoId?: string }; snippet?: { title: string; channelTitle: string; publishedAt: string; thumbnails?: Record<string, { url: string }> } }[] };
      const items = (sj.items ?? []).filter((i) => i.id?.videoId && i.snippet);
      const ids = items.map((i) => i.id!.videoId!);
      const details = new Map<string, { duration?: string; embeddable: boolean }>();
      if (ids.length) {
        const vp = new URLSearchParams({ part: 'contentDetails,status', id: ids.join(','), key: cfg.youtubeKey });
        const vr = await fetchImpl(`https://www.googleapis.com/youtube/v3/videos?${vp}`, { signal: AbortSignal.timeout(10_000) });
        if (vr.ok) {
          const vj = (await vr.json()) as { items?: { id: string; contentDetails?: { duration?: string }; status?: { embeddable?: boolean } }[] };
          for (const v of vj.items ?? []) details.set(v.id, { duration: v.contentDetails?.duration ? formatIsoDuration(v.contentDetails.duration) : undefined, embeddable: v.status?.embeddable ?? false });
        }
      }
      const results: VideoResult[] = items.map((i) => {
        const id = i.id!.videoId!;
        const s = i.snippet!;
        const d = details.get(id);
        return {
          id,
          title: decode(s.title),
          channel: decode(s.channelTitle),
          thumbnail: s.thumbnails?.medium?.url ?? s.thumbnails?.default?.url ?? '',
          duration: d?.duration,
          embeddable: d?.embeddable ?? false,
          url: `https://www.youtube.com/watch?v=${id}`,
          publishedAt: s.publishedAt,
        };
      });
      cache.set(key, { at: Date.now(), data: results });
      res.json({ results });
    } catch (e) {
      const timeout = (e as Error).name === 'TimeoutError';
      res.status(timeout ? 504 : 502).json({ error: 'upstream', message: timeout ? 'YouTube took too long to respond.' : 'Could not reach YouTube.' });
    }
  });
  return r;
}
