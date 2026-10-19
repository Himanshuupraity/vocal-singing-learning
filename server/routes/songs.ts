import { Router } from 'express';
import { z } from 'zod';

export interface SongResult {
  id: string;
  title: string;
  artist: string;
  album: string;
  year?: string;
  artwork?: string;
  genre?: string;
  url?: string;
  source: 'itunes';
}

const Query = z.object({ q: z.string().trim().min(2).max(100), limit: z.coerce.number().int().min(1).max(25).default(15) });

/**
 * Song metadata search via the public iTunes Search API (no key needed).
 * We search the Indian storefront so Bollywood soundtracks are well covered.
 * Credits come straight from the catalogue; we never invent them.
 */
export function songsRouter(fetchImpl: typeof fetch = fetch) {
  const r = Router();
  const cache = new Map<string, { at: number; data: SongResult[] }>();

  r.get('/songs/search', async (req, res) => {
    const parsed = Query.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_request', message: 'Type at least 2 characters.' });
    const { q, limit } = parsed.data;
    const key = `${q.toLowerCase()}|${limit}`;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < 24 * 3600_000) return res.json({ results: hit.data, provider: 'iTunes Search API' });
    try {
      const sp = new URLSearchParams({ term: q, media: 'music', entity: 'song', country: 'IN', limit: String(limit) });
      const r2 = await fetchImpl(`https://itunes.apple.com/search?${sp}`, { signal: AbortSignal.timeout(8000) });
      if (!r2.ok) return res.status(502).json({ error: 'upstream', message: `Song catalogue search failed (${r2.status}).` });
      const j = (await r2.json()) as { results?: Record<string, unknown>[] };
      const seen = new Set<string>();
      const results: SongResult[] = [];
      for (const t of j.results ?? []) {
        if (t.kind !== 'song') continue;
        const title = String(t.trackName ?? '');
        const artist = String(t.artistName ?? '');
        const dedupe = `${title.toLowerCase()}|${artist.toLowerCase()}`;
        if (!title || seen.has(dedupe)) continue;
        seen.add(dedupe);
        results.push({
          id: `itunes-${t.trackId}`,
          title,
          artist,
          album: String(t.collectionName ?? ''),
          year: typeof t.releaseDate === 'string' ? t.releaseDate.slice(0, 4) : undefined,
          artwork: typeof t.artworkUrl100 === 'string' ? t.artworkUrl100 : undefined,
          genre: typeof t.primaryGenreName === 'string' ? t.primaryGenreName : undefined,
          url: typeof t.trackViewUrl === 'string' ? t.trackViewUrl : undefined,
          source: 'itunes',
        });
      }
      cache.set(key, { at: Date.now(), data: results });
      res.json({ results, provider: 'iTunes Search API' });
    } catch (e) {
      const timeout = (e as Error).name === 'TimeoutError';
      res.status(timeout ? 504 : 502).json({ error: 'upstream', message: timeout ? 'The song catalogue took too long to respond.' : 'Could not reach the song catalogue.' });
    }
  });
  return r;
}
