import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppData } from '../state/AppData';
import { useServerStatus } from '../hooks/useServerStatus';
import { VIDEO_CATEGORIES } from '../data/videoCategories';
import { nextRecommendedLesson } from '../lib/progress';
import { parseYouTubeId, youtubeSearchUrl } from '../lib/youtube';
import { timeoutSignal } from '../lib/timeout';
import { WatchedToggle } from '../components/WatchedToggle';
import { Alert, Button, Card, EmptyState, ExternalLink, Icon, PageHeader, Spinner, cx, inputClass } from '../components/ui';
import type { VideoMeta } from '../storage/schema';

interface Video {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration?: string;
  embeddable: boolean;
  url: string;
}

function VideoCard({ v }: { v: Video }) {
  const { data, update } = useAppData();
  const [embed, setEmbed] = useState(false);
  const watched = !!data.videos.watched[v.id];
  const fav = !!data.videos.favorites[v.id];
  const meta: VideoMeta = { key: v.id, title: v.title, channel: v.channel, url: v.url, thumbnail: v.thumbnail, savedAt: new Date().toISOString() };
  return (
    <Card as="li" className="flex flex-col p-0">
      {embed && v.embeddable ? (
        <div className="aspect-video overflow-hidden rounded-t-2xl">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?autoplay=1&rel=0`}
            title={v.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : (
        <button type="button" className="group relative block" onClick={() => (v.embeddable ? setEmbed(true) : window.open(v.url, '_blank', 'noopener'))} aria-label={`Play ${v.title}`}>
          {v.thumbnail ? <img src={v.thumbnail} alt="" className="aspect-video w-full rounded-t-2xl object-cover" loading="lazy" /> : <div className="aspect-video rounded-t-2xl bg-surface-2" />}
          <span className="absolute inset-0 grid place-items-center rounded-t-2xl bg-black/0 transition group-hover:bg-black/30">
            <Icon name="play" className="h-10 w-10 text-white opacity-0 drop-shadow group-hover:opacity-100" />
          </span>
          {v.duration && <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 text-xs text-white">{v.duration}</span>}
        </button>
      )}
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-2 font-medium">{v.title}</p>
        <p className="mt-0.5 text-xs text-muted">{v.channel}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
          <Button size="sm" variant={watched ? 'secondary' : 'ghost'} icon="check" onClick={() => update((d) => void (watched ? delete d.videos.watched[v.id] : (d.videos.watched[v.id] = new Date().toISOString())))} aria-pressed={watched}>
            {watched ? 'Watched' : 'Mark watched'}
          </Button>
          <Button size="sm" variant="ghost" icon="heart" onClick={() => update((d) => void (fav ? delete d.videos.favorites[v.id] : (d.videos.favorites[v.id] = meta)))} aria-pressed={fav} className={cx(fav && 'text-primary')}>
            {fav ? 'Saved' : 'Save'}
          </Button>
          <ExternalLink href={v.url} className="ml-auto text-xs">
            YouTube
          </ExternalLink>
        </div>
      </div>
    </Card>
  );
}

export default function Videos() {
  const { data } = useAppData();
  const status = useServerStatus();
  const [sp, setSp] = useSearchParams();
  const hindi = data.profile.language !== 'english';
  const lesson = nextRecommendedLesson(data);
  const [query, setQuery] = useState(sp.get('q') ?? '');
  const [active, setActive] = useState(sp.get('q') ?? '');
  const [results, setResults] = useState<Video[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hideWatched, setHideWatched] = useState(false);
  const [tab, setTab] = useState<'browse' | 'saved'>('browse');
  const live = status?.youtube.configured;

  useEffect(() => {
    if (!active || !live) return;
    let alive = true;
    setLoading(true);
    setError(null);
    fetch(`/api/youtube/search?${new URLSearchParams({ q: active, lang: data.profile.language, max: '9' })}`, { signal: timeoutSignal(15000) })
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.message ?? 'Search failed.');
        return j.results as Video[];
      })
      .then((v) => alive && setResults(v))
      .catch((e) => alive && (setError((e as Error).name === 'TimeoutError' ? 'YouTube search timed out.' : (e as Error).message), setResults(null)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [active, live, data.profile.language]);

  const run = (q: string) => {
    setQuery(q);
    setActive(q);
    setSp(q ? { q } : {});
  };

  const shown = useMemo(() => {
    const seen = new Set<string>();
    return (results ?? []).filter((v) => !seen.has(v.id) && seen.add(v.id) && (!hideWatched || !data.videos.watched[v.id]));
  }, [results, hideWatched, data.videos.watched]);

  const favs = Object.values(data.videos.favorites);

  return (
    <>
      <PageHeader title="Video Library" subtitle="Find clear demonstrations for every topic. We link to genuine YouTube results — no made-up videos or ratings." />
      {status && !live && (
        <Alert tone="info" title="Live YouTube results are off">
          Without a YouTube Data API key the library uses precise <strong>“Search on YouTube”</strong> links instead (they open real YouTube search results). To show videos here, add <code>YOUTUBE_API_KEY</code> to the server&apos;s <code>.env</code> (YouTube Data API v3) and restart.
        </Alert>
      )}
      <div className="mt-4 flex gap-2">
        {(['browse', 'saved'] as const).map((t) => (
          <button key={t} type="button" aria-pressed={tab === t} onClick={() => setTab(t)} className={cx('rounded-xl px-3 py-1.5 text-sm font-medium', tab === t ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
            {t === 'browse' ? 'Browse & search' : `Saved (${favs.length})`}
          </button>
        ))}
      </div>

      {tab === 'saved' ? (
        <>
        <AddVideoForm />
        {favs.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon="heart" title="No saved videos yet">Tap “Save” on any video to keep it here.</EmptyState>
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favs.map((f) => (
              <VideoCard key={f.key} v={{ id: f.key, title: f.title, channel: f.channel ?? '', thumbnail: f.thumbnail ?? '', url: f.url, embeddable: true }} />
            ))}
          </ul>
        )}
        </>
      ) : (
        <>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              run(query.trim());
            }}
          >
            <label htmlFor="vq" className="sr-only">
              Search videos
            </label>
            <input id="vq" className={inputClass} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. sargam alankar for beginners hindi" maxLength={150} />
            <Button type="submit" icon="search" disabled={query.trim().length < 2}>
              Search
            </Button>
          </form>

          {lesson && (
            <Card className="mt-4">
              <p className="text-xs uppercase tracking-wide text-muted">For your current lesson</p>
              <p className="font-medium">{lesson.title}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {lesson.videoQueries.map((q) => (
                  <span key={q} className="inline-flex items-center gap-1">
                    {live ? (
                      <Button size="sm" variant="secondary" onClick={() => run(q)}>
                        {q}
                      </Button>
                    ) : (
                      <>
                        <ExternalLink href={youtubeSearchUrl(q)} className="rounded-lg bg-surface-2 px-2 py-1 text-sm no-underline">
                          {q}
                        </ExternalLink>
                        <WatchedToggle query={q} />
                      </>
                    )}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {active && (
            <section className="mt-6" aria-labelledby="results-h">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 id="results-h" className="font-semibold">
                  Results for “{active}”
                </h2>
                <div className="flex items-center gap-3">
                  {live && (
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={hideWatched} onChange={(e) => setHideWatched(e.target.checked)} /> Hide watched
                    </label>
                  )}
                  <ExternalLink href={youtubeSearchUrl(active)} className="text-sm">
                    Search on YouTube
                  </ExternalLink>
                </div>
              </div>
              {!live ? (
                <p className="mt-2 text-sm text-muted">Live results need a YouTube API key — use the “Search on YouTube” link above.</p>
              ) : loading ? (
                <div className="mt-4">
                  <Spinner label="Searching YouTube…" />
                </div>
              ) : error ? (
                <Alert className="mt-3" tone="warning" title="Couldn’t load videos">
                  {error} You can still <ExternalLink href={youtubeSearchUrl(active)}>search on YouTube directly</ExternalLink>.
                </Alert>
              ) : shown.length === 0 ? (
                <p className="mt-3 text-sm text-muted">No videos to show{hideWatched ? ' (all watched)' : ''}.</p>
              ) : (
                <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {shown.map((v) => (
                    <VideoCard key={v.id} v={v} />
                  ))}
                </ul>
              )}
              {live && shown.length > 0 && <p className="mt-2 text-xs text-muted">Results come from YouTube search and aren&apos;t endorsements. Prefer clear demonstrations from credible teachers at a beginner level.</p>}
            </section>
          )}

          <h2 className="mt-8 font-semibold">Browse by topic</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {VIDEO_CATEGORIES.map((c) => (
              <Card as="li" key={c.id}>
                <p className="font-medium">{c.title}</p>
                <p className="text-sm text-muted">{c.description}</p>
                <div className="mt-3 flex flex-col gap-1.5">
                  {c.queries.map((q) => {
                    const text = hindi ? q.hi : q.en;
                    return live ? (
                      <button key={text} type="button" className="text-left text-sm text-primary hover:underline" onClick={() => run(text)}>
                        <Icon name="search" className="mr-1 inline h-3.5 w-3.5" />
                        {text}
                      </button>
                    ) : (
                      <span key={text} className="flex flex-wrap items-center gap-2">
                        <ExternalLink href={youtubeSearchUrl(text)} className="text-sm">
                          {text}
                        </ExternalLink>
                        <WatchedToggle query={text} />
                      </span>
                    );
                  })}
                </div>
              </Card>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

/** Save a specific YouTube video by URL — no API key needed. */
function AddVideoForm() {
  const { data, update } = useAppData();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  return (
    <Card className="mt-4">
      <h2 className="font-semibold">Save a video you found</h2>
      <p className="text-sm text-muted">Paste a YouTube link (from your search results) to keep it here, watch it embedded and mark it watched.</p>
      <form
        className="mt-3 grid gap-2 sm:grid-cols-[2fr_1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          const id = parseYouTubeId(url);
          if (!id) return setErr('That doesn’t look like a YouTube video link (e.g. https://www.youtube.com/watch?v=…).');
          setErr(null);
          update((d) => {
            d.videos.favorites[id] = { key: id, title: title.trim().slice(0, 120) || 'Saved YouTube video', url: `https://www.youtube.com/watch?v=${id}`, thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`, savedAt: new Date().toISOString() };
          });
          setUrl('');
          setTitle('');
          setOk(true);
        }}
      >
        <label className="sr-only" htmlFor="add-url">YouTube link</label>
        <input id="add-url" className={inputClass} value={url} onChange={(e) => (setUrl(e.target.value), setOk(false))} placeholder="https://www.youtube.com/watch?v=…" maxLength={300} />
        <label className="sr-only" htmlFor="add-title">Title (optional)</label>
        <input id="add-title" className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" maxLength={120} />
        <Button type="submit" icon="plus" disabled={!url.trim()}>Save</Button>
      </form>
      {err && <p className="mt-2 text-sm text-danger" role="alert">{err}</p>}
      {ok && <p className="mt-2 text-sm text-success" role="status">Saved ✓</p>}
      <p className="mt-2 text-xs text-muted">{Object.keys(data.videos.watched).length} resources marked watched so far.</p>
    </Card>
  );
}
