import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppData } from '../state/AppData';
import { newSong, songNextAction, songProgress, type SongSearchResult } from '../lib/songs';
import { Alert, Badge, Button, Card, EmptyState, Field, PageHeader, ProgressBar, Spinner, cx, inputClass } from '../components/ui';
import type { MySong, SongStatus } from '../storage/schema';

const STATUS_LABEL: Record<SongStatus, string> = { want: 'Want to learn', learning: 'Learning now', comfortable: 'Can sing comfortably' };

export default function Songs() {
  const { data, update } = useAppData();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SongSearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState(false);
  const [mTitle, setMTitle] = useState('');
  const [mArtist, setMArtist] = useState('');
  const [filter, setFilter] = useState<SongStatus | 'all'>('all');

  // Debounced suggestions while typing.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults(null);
      setError(null);
      return;
    }
    const ctl = new AbortController();
    const t = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await fetch(`/api/songs/search?${new URLSearchParams({ q: term })}`, { signal: ctl.signal });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.message ?? 'Search failed.');
        setResults(j.results);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setError((e as Error).message === 'Failed to fetch' ? 'The song catalogue is unreachable (is the server running?). You can still add a song manually.' : (e as Error).message);
          setResults(null);
        }
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      clearTimeout(t);
      ctl.abort();
    };
  }, [q]);

  const add = (s: MySong) => {
    update((d) => void (d.songs[s.id] ??= s));
    nav(`/songs/${encodeURIComponent(s.id)}`);
  };

  const songs = Object.values(data.songs).sort((a, b) => (b.lastPracticed ?? b.addedAt).localeCompare(a.lastPracticed ?? a.addedAt));
  const shown = filter === 'all' ? songs : songs.filter((s) => s.status === filter);

  return (
    <>
      <PageHeader title="Bollywood Songs" subtitle="Search any song, get a phrase-by-phrase learning workflow, and track your progress. We never show lyrics — follow along with the official video." />
      <Card>
        <label htmlFor="song-q" className="text-sm font-medium">
          Search for a song
        </label>
        <input id="song-q" className={`${inputClass} mt-1`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Kesariya, Tum Hi Ho, Lag Ja Gale" maxLength={100} autoComplete="off" />
        <p className="mt-1 text-xs text-muted">Song metadata from the iTunes catalogue (India). Credits are shown exactly as the catalogue lists them.</p>
        <div className="mt-3" aria-live="polite">
          {loading && <Spinner label="Searching the catalogue…" />}
          {error && <Alert tone="warning">{error}</Alert>}
          {results && results.length === 0 && !loading && <p className="text-sm text-muted">No matches. Check the spelling, try the film name, or add the song manually.</p>}
          {results && results.length > 0 && (
            <ul className="divide-y divide-border">
              {results.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-2">
                  {r.artwork ? <img src={r.artwork} alt="" className="h-12 w-12 rounded-lg object-cover" loading="lazy" /> : <div className="h-12 w-12 rounded-lg bg-surface-2" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{r.title}</p>
                    <p className="truncate text-xs text-muted">
                      {r.artist} · {r.album}
                      {r.year && ` · ${r.year}`}
                    </p>
                  </div>
                  {data.songs[r.id] ? (
                    <Link to={`/songs/${encodeURIComponent(r.id)}`} className="text-sm text-primary underline">
                      Open
                    </Link>
                  ) : (
                    <Button size="sm" icon="plus" onClick={() => add(newSong({ id: r.id, title: r.title, artist: r.artist, album: r.album, year: r.year, artwork: r.artwork, source: 'itunes', sourceUrl: r.url }))}>
                      Add
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="button" className="mt-3 text-sm text-primary underline" onClick={() => setManual((m) => !m)}>
          {manual ? 'Hide manual entry' : 'Can’t find it? Add a song manually'}
        </button>
        {manual && (
          <form
            className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              if (mTitle.trim()) add(newSong({ title: mTitle, artist: mArtist }));
            }}
          >
            <Field label="Song title" htmlFor="m-title">
              <input id="m-title" className={inputClass} value={mTitle} onChange={(e) => setMTitle(e.target.value)} maxLength={150} required />
            </Field>
            <Field label="Singer / film (optional)" htmlFor="m-artist">
              <input id="m-artist" className={inputClass} value={mArtist} onChange={(e) => setMArtist(e.target.value)} maxLength={150} />
            </Field>
            <Button type="submit" disabled={!mTitle.trim()}>
              Add song
            </Button>
          </form>
        )}
      </Card>

      <section className="mt-8" aria-labelledby="my-songs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="my-songs" className="font-display text-2xl font-semibold">
            My Songs
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'want', 'learning', 'comfortable'] as const).map((f) => (
              <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={cx('rounded-lg px-3 py-1 text-sm', filter === f ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
                {f === 'all' ? `All (${songs.length})` : `${STATUS_LABEL[f]} (${songs.filter((s) => s.status === f).length})`}
              </button>
            ))}
          </div>
        </div>
        {shown.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon="film" title={songs.length ? 'No songs in this list' : 'Your song library is empty'}>
              {songs.length ? 'Try another filter.' : data.profile.favoriteSongs ? `You mentioned: ${data.profile.favoriteSongs}. Search for one above to start!` : 'Search for a song you love to begin.'}
            </EmptyState>
          </div>
        ) : (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {shown.map((s) => {
              const p = songProgress(s);
              return (
                <li key={s.id}>
                  <Link to={`/songs/${encodeURIComponent(s.id)}`} className="block rounded-2xl border border-border bg-surface p-4 hover:bg-surface-2">
                    <div className="flex items-start gap-3">
                      {s.artwork ? <img src={s.artwork} alt="" className="h-14 w-14 rounded-lg object-cover" /> : <div className="grid h-14 w-14 place-items-center rounded-lg bg-primary-soft text-primary">♪</div>}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{s.title}</p>
                        <p className="truncate text-xs text-muted">{s.artist}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Badge tone={s.status === 'comfortable' ? 'success' : s.status === 'learning' ? 'accent' : 'neutral'}>{STATUS_LABEL[s.status]}</Badge>
                          {s.phrases.some((x) => x.difficult && !x.done) && <Badge tone="warning">{s.phrases.filter((x) => x.difficult && !x.done).length} difficult</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={p} label={`${s.title} progress`} />
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      {s.lastPracticed ? `Last practised ${new Date(s.lastPracticed).toLocaleDateString()}` : 'Not practised yet'} · Next: {songNextAction(s)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
