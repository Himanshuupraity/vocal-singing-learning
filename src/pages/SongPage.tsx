import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../state/AppData';
import { SONG_STEPS, songNextAction, songProgress, songSearchQueries } from '../lib/songs';
import { youtubeSearchUrl } from '../lib/youtube';
import { fetchStatus } from '../hooks/useServerStatus';
import { streamPost, ApiError } from '../lib/sse';
import { currentLevel } from '../lib/progress';
import { ALL_LESSONS, getLesson } from '../curriculum';
import { tonicLabel } from '../music/theory';
import { uid } from '../lib/dates';
import { usePracticeTimer } from '../hooks/usePracticeTimer';
import { Alert, Badge, Button, Card, EmptyState, ExternalLink, Icon, LinkButton, ProgressBar, Spinner, cx, inputClass } from '../components/ui';
import { Markdown } from '../components/ui/Markdown';
import type { SongStatus } from '../storage/schema';

/** Lessons most useful before learning any film song (ids that exist in the curriculum). */
const PREP_LESSONS = ['l1-find-your-sa', 'l1-listen-before-singing', 'l3-breath-for-phrases', 'l3-learning-by-ear', 'l3-meend', 'l3-gamak-murki-khatka', 'l3-hindi-urdu-diction', 'l4-karaoke-accompaniment'];

export default function SongPage() {
  const { songId = '' } = useParams();
  const id = decodeURIComponent(songId);
  const { data, update } = useAppData();
  const nav = useNavigate();
  const song = data.songs[id];
  const [phraseLabel, setPhraseLabel] = useState('');
  const [phraseTs, setPhraseTs] = useState('');
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const [planText, setPlanText] = useState('');
  const [planBusy, setPlanBusy] = useState(false);
  const [planErr, setPlanErr] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const abort = useRef<AbortController | null>(null);
  usePracticeTimer('song', song?.title, !!song);

  useEffect(() => {
    fetchStatus().then((s) => setAiAvailable(s.tutor.configured));
    return () => abort.current?.abort();
  }, []);

  // Track practice on this song when the page is used.
  useEffect(() => {
    if (!song) return;
    const iv = window.setInterval(() => update((d) => {
      const s = d.songs[id];
      if (s && document.visibilityState === 'visible') {
        s.practiceMinutes += 1;
        s.lastPracticed = new Date().toISOString();
      }
    }), 60_000);
    return () => clearInterval(iv);
  }, [id, song, update]);

  if (!song) return <EmptyState page title="Song not found" action={<LinkButton to="/songs">Back to Bollywood Songs</LinkButton>}>It may have been removed from My Songs.</EmptyState>;

  const qs = songSearchQueries(song.title, song.artist);
  const set = (fn: (s: typeof song) => void) => update((d) => d.songs[id] && fn(d.songs[id]));
  const prep = PREP_LESSONS.map(getLesson).filter((l): l is NonNullable<typeof l> => !!l);

  const genPlan = async () => {
    setPlanErr(null);
    setPlanText('');
    setPlanBusy(true);
    abort.current = new AbortController();
    let full = '';
    try {
      await streamPost(
        '/api/songs/plan',
        {
          song: { title: song.title, artist: song.artist, album: song.album, year: song.year },
          learner: { level: currentLevel(data), tonic: tonicLabel(data.profile.tonic), completedTopics: ALL_LESSONS.filter((l) => data.lessons[l.id]?.completedAt).map((l) => l.title).slice(-40) },
          language: data.profile.language,
        },
        (t) => {
          full += t;
          setPlanText(full);
        },
        abort.current.signal,
      );
      set((s) => void (s.aiPlan = { generatedAt: new Date().toISOString(), text: full }));
      setPlanText('');
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setPlanErr((e as ApiError).message);
    } finally {
      setPlanBusy(false);
    }
  };

  const progress = songProgress(song);

  return (
    <div className="space-y-6">
      <Link to="/songs" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
        <Icon name="back" className="h-4 w-4" /> Bollywood Songs
      </Link>

      <Card>
        <div className="flex flex-wrap items-start gap-4">
          {song.artwork ? <img src={song.artwork.replace('100x100', '200x200')} alt="" className="h-24 w-24 rounded-xl object-cover" /> : <div className="grid h-24 w-24 place-items-center rounded-xl bg-primary-soft text-3xl text-primary">♪</div>}
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-semibold">{song.title}</h1>
            <p className="text-muted">
              {song.artist || 'Artist not entered'}
              {song.album && ` · ${song.album}`}
              {song.year && ` · ${song.year}`}
            </p>
            <p className="mt-1 text-xs text-muted">
              {song.source === 'itunes' ? 'Credits from the iTunes catalogue.' : 'Added manually — credits not verified.'}
              {song.sourceUrl && (
                <>
                  {' '}
                  <ExternalLink href={song.sourceUrl}>Catalogue page</ExternalLink>
                </>
              )}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label htmlFor="song-status" className="text-sm font-medium">
                Status
              </label>
              <select id="song-status" className={`${inputClass} w-auto`} value={song.status} onChange={(e) => set((s) => void (s.status = e.target.value as SongStatus))}>
                <option value="want">Want to learn</option>
                <option value="learning">Learning now</option>
                <option value="comfortable">Can sing comfortably</option>
              </select>
            </div>
          </div>
          <div className="w-full sm:w-48">
            <p className="text-xs text-muted">Song progress</p>
            <p className="text-2xl font-semibold">{progress}%</p>
            <ProgressBar value={progress} label="Song progress" tone="accent" />
            <p className="mt-1 text-xs text-muted">{Math.round(song.practiceMinutes)} min practised</p>
          </div>
        </div>
        <Alert className="mt-4" tone="info" title="Recommended next action">
          {songNextAction(song)}
        </Alert>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Find it on YouTube</h2>
        <p className="text-sm text-muted">These open real YouTube searches. Use official uploads and licensed karaoke tracks — we never download or extract audio.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            ['Original song', qs.original],
            ['Singing tutorial', qs.tutorial],
            ['Karaoke / instrumental', qs.karaoke],
            ['Beginner explanation', qs.beginner],
          ].map(([label, q]) => (
            <a key={label} href={youtubeSearchUrl(q)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border p-3 text-sm hover:bg-surface-2">
              <span>
                <span className="block font-medium">{label}</span>
                <span className="block text-xs text-muted">“{q}”</span>
              </span>
              <Icon name="external" className="h-4 w-4 text-muted" />
            </a>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">Lyrics aren&apos;t shown here (copyright). Follow along with the official video.</p>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Song analysis &amp; learning plan</h2>
          <Badge tone="warning">AI-generated · estimates</Badge>
        </div>
        <p className="mt-1 text-sm text-muted">
          Difficulty, techniques, raga influence, range and tricky parts can&apos;t be looked up from a reliable database, so this section is written by the AI tutor and clearly marks what is an estimate. Verify by listening — the original key may not suit your voice; you can always transpose.
        </p>
        {song.aiPlan && !planText && (
          <div className="mt-3 rounded-xl bg-surface-2 p-4">
            <Markdown text={song.aiPlan.text} />
            <p className="mt-2 text-xs text-muted">Generated {new Date(song.aiPlan.generatedAt).toLocaleString()}</p>
          </div>
        )}
        {planText && (
          <div className="mt-3 rounded-xl bg-surface-2 p-4">
            <Markdown text={planText} />
          </div>
        )}
        {planErr && <Alert className="mt-3" tone="danger">{planErr}</Alert>}
        <div className="mt-3">
          {aiAvailable === null ? (
            <Spinner />
          ) : aiAvailable ? (
            planBusy ? (
              <Button variant="secondary" onClick={() => abort.current?.abort()}>
                Stop
              </Button>
            ) : (
              <Button icon="sparkle" onClick={genPlan}>
                {song.aiPlan ? 'Regenerate plan' : 'Generate learning plan'}
              </Button>
            )
          ) : (
            <Alert tone="info">
              AI song analysis needs the tutor to be configured (<code>ANTHROPIC_API_KEY</code> or <code>GEMINI_API_KEY</code>). Everything else on this page works without it — follow the step-by-step workflow below.
            </Alert>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Step-by-step workflow</h2>
        <ol className="mt-3 space-y-2">
          {SONG_STEPS.map((st, i) => (
            <li key={st.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 hover:bg-surface-2">
                <input type="checkbox" className="mt-1" checked={!!song.steps[st.id]} onChange={(e) => set((s) => void (s.steps[st.id] = e.target.checked))} />
                <span>
                  <span className={cx('font-medium', song.steps[st.id] && 'text-muted line-through')}>
                    {i + 1}. {st.title}
                  </span>
                  <span className="block text-sm text-muted">{st.detail}</span>
                  {st.id === 'pitch' && (
                    <Link to="/studio/pitch" className="text-xs text-primary underline">
                      Open Pitch Matcher
                    </Link>
                  )}
                  {st.id === 'sing' && (
                    <Link to="/studio/record" className="ml-0 text-xs text-primary underline">
                      Open Recording Journal
                    </Link>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ol>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="font-medium">Your comfortable Sa for this song</span>
            <input className={`${inputClass} mt-1`} value={song.comfortableSa ?? ''} onChange={(e) => set((s) => void (s.comfortableSa = e.target.value.slice(0, 20)))} placeholder={`e.g. ${tonicLabel(data.profile.tonic)} or "karaoke −2"`} />
          </label>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Phrases</h2>
        <p className="text-sm text-muted">Break the song into short phrases. Use labels (not lyrics) and the video timestamp, e.g. “Mukhda line 1 — 0:42”.</p>
        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const label = phraseLabel.trim().slice(0, 60);
            if (!label) return;
            set((s) => void s.phrases.push({ id: uid(), label, timestamp: /^\d{1,2}:\d{2}(:\d{2})?$/.test(phraseTs.trim()) ? phraseTs.trim() : undefined, difficult: false, done: false, notes: '' }));
            setPhraseLabel('');
            setPhraseTs('');
          }}
        >
          <label className="sr-only" htmlFor="ph-label">
            Phrase label
          </label>
          <input id="ph-label" className={`${inputClass} flex-1`} style={{ minWidth: 180 }} value={phraseLabel} onChange={(e) => setPhraseLabel(e.target.value)} placeholder="Phrase label, e.g. Antara 1 – high line" maxLength={60} />
          <label className="sr-only" htmlFor="ph-ts">
            Timestamp
          </label>
          <input id="ph-ts" className={`${inputClass} w-28`} value={phraseTs} onChange={(e) => setPhraseTs(e.target.value)} placeholder="mm:ss" maxLength={8} />
          <Button type="submit" icon="plus" disabled={!phraseLabel.trim()}>
            Add
          </Button>
        </form>
        {song.phrases.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No phrases yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {[...song.phrases].sort((a, b) => Number(b.difficult && !b.done) - Number(a.difficult && !a.done)).map((p) => (
              <li key={p.id} className={cx('rounded-xl border p-3', p.difficult && !p.done ? 'border-warning/50 bg-warning-soft' : 'border-border')}>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex flex-1 items-center gap-2">
                    <input type="checkbox" checked={p.done} onChange={(e) => set((s) => void (s.phrases.find((x) => x.id === p.id)!.done = e.target.checked))} />
                    <span className={cx('font-medium', p.done && 'text-muted line-through')}>{p.label}</span>
                    {p.timestamp && <Badge>{p.timestamp}</Badge>}
                  </label>
                  <Button size="sm" variant="ghost" aria-pressed={p.difficult} onClick={() => set((s) => void (s.phrases.find((x) => x.id === p.id)!.difficult = !p.difficult))}>
                    {p.difficult ? '★ Difficult' : '☆ Mark difficult'}
                  </Button>
                  <Button size="sm" variant="ghost" icon="trash" aria-label={`Remove phrase ${p.label}`} onClick={() => set((s) => void (s.phrases = s.phrases.filter((x) => x.id !== p.id)))} />
                </div>
                <input className={`${inputClass} mt-2`} placeholder="Notes for this phrase (breath point, tricky note…)" defaultValue={p.notes} maxLength={300} onBlur={(e) => set((s) => void (s.phrases.find((x) => x.id === p.id)!.notes = e.target.value))} aria-label={`Notes for ${p.label}`} />
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 rounded-xl bg-surface-2 p-3 text-sm">
          <p className="font-medium">Turn a phrase into a sargam exercise</p>
          <p className="text-muted">Hum a phrase of this song; the app finds its notes and makes an exercise on your own Sa.</p>
          <LinkButton to={`/studio/song?song=${encodeURIComponent(song.id)}`} size="sm" variant="secondary" className="mt-2">
            Make an exercise
          </LinkButton>
          {data.patterns.some((p) => p.songId === song.id) && (
            <ul className="mt-2 space-y-1">
              {data.patterns
                .filter((p) => p.songId === song.id)
                .map((p) => (
                  <li key={p.id}>
                    <Link className="text-primary underline" to={`/studio/compare?pattern=${encodeURIComponent(`my:${p.id}`)}`}>
                      {p.name}
                    </Link>{' '}
                    <span className="font-mono text-xs text-muted">{p.notes.length} notes</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Lessons that help</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {prep.map((l) => (
            <li key={l.id}>
              <Link to={`/learn/lesson/${l.id}`} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm hover:bg-surface-2">
                <span>
                  {l.title} <span className="text-muted">· Level {l.level}</span>
                </span>
                {data.lessons[l.id]?.completedAt ? <Badge tone="success">Done</Badge> : <Icon name="arrow" className="h-4 w-4 text-muted" />}
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Practice notes</h2>
        <textarea className={`${inputClass} mt-2`} rows={4} defaultValue={song.notes} maxLength={3000} onBlur={(e) => set((s) => void (s.notes = e.target.value))} placeholder="Your notes on this song…" aria-label="Practice notes" />
        <div className="mt-4 flex flex-wrap gap-2">
          <LinkButton variant="secondary" icon="chat" to="/tutor">
            Ask the tutor about this song
          </LinkButton>
          {confirmDelete ? (
            <>
              <Button variant="danger" onClick={() => (update((d) => void delete d.songs[id]), nav('/songs'))}>
                Yes, remove from My Songs
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="ghost" icon="trash" onClick={() => setConfirmDelete(true)}>
              Remove song
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
