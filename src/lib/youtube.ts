/** Safe YouTube search URL (we never invent specific video links). */
export function youtubeSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim().slice(0, 150))}`;
}

/** Extracts an 11-character YouTube video id from common URL shapes; null if not a YouTube video link. */
export function parseYouTubeId(input: string): string | null {
  let u: URL;
  try {
    u = new URL(input.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, '');
  let id: string | null = null;
  if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
  else if (host === 'youtube.com' || host === 'music.youtube.com' || host === 'youtube-nocookie.com') {
    if (u.pathname === '/watch') id = u.searchParams.get('v');
    else {
      const m = /^\/(shorts|embed|live)\/([^/?#]+)/.exec(u.pathname);
      id = m?.[2] ?? null;
    }
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

export const queryKey = (q: string) => `q:${q.trim().toLowerCase()}`;
