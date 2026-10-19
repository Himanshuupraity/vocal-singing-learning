import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { PitchFrame } from '../../audio/pitchAnalysis';
import { analyzeSamples, decodeToMono } from '../../audio/offlineAnalysis';
import { playSequence, type SequenceHandle } from '../../audio/sequencer';
import { guessSaPitchClass, notesToSargam, relSemitones, segmentNotes } from '../../music/melody';
import { swaraLabel, tonicMidi, WESTERN_NOTES, type SwaraToken } from '../../music/theory';
import { useMicPitch } from '../../hooks/useMicPitch';
import { useAppData } from '../../state/AppData';
import { uid } from '../../lib/dates';
import { Alert, Button, cx, inputClass } from '../ui';
import { MicPanel } from './MicPanel';
import { PitchCompareChart } from './PitchCompareChart';
import { SequenceMatcher } from './SequenceMatcher';

const MAX_SEC = 45;
const MAX_NOTES = 40;

/**
 * Turns a song phrase into a sargam exercise. The learner hums/sings the tune
 * or picks an audio clip; the app finds the held notes, guesses the song's Sa,
 * and writes the phrase in sargam — which then plays on the learner's own Sa.
 * Everything runs on this device; no audio is uploaded or kept.
 */
export function SongToExercise({ songId }: { songId?: string }) {
  const { data, update } = useAppData();
  const mic = useMicPitch();
  const [source, setSource] = useState<'hum' | 'file'>('hum');
  const [frames, setFrames] = useState<PitchFrame[] | null>(null);
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [saPc, setSaPc] = useState(0);
  const [removed, setRemoved] = useState<Set<number>>(new Set());
  const [name, setName] = useState('');
  const [linkSong, setLinkSong] = useState(songId && data.songs[songId] ? songId : '');
  const [saved, setSaved] = useState<string | null>(null);
  const live = useRef<PitchFrame[]>([]);
  const capturing = useRef(false);
  const stopTimer = useRef(0);

  useEffect(() => mic.subscribe((f) => capturing.current && live.current.push(f)), [mic]);
  useEffect(() => () => clearTimeout(stopTimer.current), []);

  const notes = useMemo(() => (frames ? segmentNotes(frames).slice(0, MAX_NOTES) : []), [frames]);
  const sargam = useMemo(() => notesToSargam(notes, saPc), [notes, saPc]);
  const kept = sargam.map((t, i) => ({ t, i })).filter((x) => !removed.has(x.i));

  const load = (fr: PitchFrame[]) => {
    const ns = segmentNotes(fr);
    if (ns.length < 2) {
      setErr('I couldn’t find clear held notes. Hum or sing the tune slowly on “aa” or “la”, one clear note at a time, without background music.');
      setFrames(null);
      return;
    }
    setFrames(fr);
    setSaPc(guessSaPitchClass(ns.slice(0, MAX_NOTES)));
    setRemoved(new Set());
    setSaved(null);
    if (!name && linkSong) setName(`${data.songs[linkSong]?.title ?? 'Song'} – phrase`);
  };

  const toggleHum = async () => {
    setErr(null);
    if (listening) {
      clearTimeout(stopTimer.current);
      capturing.current = false;
      setListening(false);
      load(live.current);
      return;
    }
    if (mic.state !== 'on') await mic.start();
    live.current = [];
    capturing.current = true;
    setListening(true);
    stopTimer.current = window.setTimeout(() => {
      capturing.current = false;
      setListening(false);
      load(live.current);
    }, MAX_SEC * 1000);
  };

  const fromFile = async (file: File) => {
    setErr(null);
    setBusy(true);
    try {
      const { samples, sampleRate } = await decodeToMono(file);
      load(analyzeSamples(samples.subarray(0, Math.floor(MAX_SEC * sampleRate)), sampleRate, data.profile.tonic).frames);
    } catch {
      setErr('This file could not be read in this browser. Try an MP3, M4A or WAV file.');
    } finally {
      setBusy(false);
    }
  };

  const save = () => {
    const id = uid();
    const exNotes = kept.map((x) => x.t);
    update((d) => void d.patterns.push({ id, name: name.trim().slice(0, 80) || 'My song phrase', notes: exNotes, source: 'song', songId: linkSong || undefined, createdAt: new Date().toISOString() }));
    setSaved(id);
  };

  const trackPts = frames?.filter((f) => f.status === 'voiced' && f.freq).map((f) => ({ t: f.t, semis: relSemitones(f.freq!, data.profile.tonic) })) ?? [];
  const t0 = trackPts[0]?.t ?? 0;
  const songSaOffset = (tonicMidi(data.profile.tonic) % 12) - saPc;
  const savedPattern = data.patterns.find((p) => p.id === saved);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Song → Exercise</h3>
        <p className="text-sm text-muted">Hum or sing a phrase of a song you’re learning (or pick a short audio clip). The app finds its notes, writes them in sargam, and turns them into an exercise that plays on <strong>your</strong> Sa — so you can practise the tune note by note.</p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Where the tune comes from">
        {(
          [
            ['hum', 'Hum / sing it'],
            ['file', 'Use an audio clip'],
          ] as const
        ).map(([m, label]) => (
          <button key={m} type="button" aria-pressed={source === m} onClick={() => setSource(m)} className={cx('rounded-lg px-3 py-1.5 text-sm', source === m ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
            {label}
          </button>
        ))}
      </div>

      {source === 'hum' ? (
        <div className="space-y-3">
          <MicPanel mic={mic} purpose="find the notes of the tune you hum" />
          <Button icon={listening ? 'stop' : 'mic'} onClick={toggleHum} disabled={!!mic.unsupported}>
            {listening ? 'Done — find the notes' : 'Start humming'}
          </Button>
          <p className="text-xs text-muted">Hum slowly on “aa”, “la” or “mm”, holding each note a little, up to {MAX_SEC} seconds. Any key is fine.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Audio clip (first {MAX_SEC} seconds are used)</span>
            <input type="file" accept="audio/*" onChange={(e) => e.target.files?.[0] && fromFile(e.target.files[0])} className="block text-sm" />
          </label>
          <p className="text-xs text-muted">Works best with a voice alone — your own recording, an a-cappella clip or a teacher’s demo. With full film music behind the voice, the detector often picks up instruments and the notes come out wrong. The clip is analysed on this device and not saved.</p>
        </div>
      )}
      {busy && <p className="text-sm text-muted">Finding the notes…</p>}
      {err && <Alert tone="warning">{err}</Alert>}

      {frames && notes.length > 0 && (
        <div className="space-y-4 rounded-2xl border border-border p-4">
          <PitchCompareChart
            mine={trackPts.map((p) => ({ ...p, t: p.t - t0 }))}
            bands={notes.map((n) => ({ start: n.start - t0, dur: n.dur, semis: n.midi - tonicMidi(data.profile.tonic) }))}
            duration={Math.max(1, (trackPts.at(-1)?.t ?? 1) - t0 + 0.3)}
            label={`Detected notes as bands over the pitch of the tune: ${sargam.map(swaraLabel).join(' ')}`}
          />
          <label className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium">The tune’s Sa:</span>
            <select className={`${inputClass} w-auto`} value={saPc} onChange={(e) => setSaPc(Number(e.target.value))}>
              {WESTERN_NOTES.map((n, i) => (
                <option key={n} value={i}>
                  {n}
                  {i === guessSaPitchClass(notes) ? ' (guess)' : ''}
                </option>
              ))}
            </select>
            <span className="text-xs text-muted">The guess is often right when the phrase ends on Sa. If the sargam looks odd, try the note the tune feels “at home” on.</span>
          </label>
          <div>
            <p className="text-sm font-medium">Sargam ({kept.length} notes) — tap a note to remove a mistake</p>
            <ol className="mt-2 flex flex-wrap gap-1.5" aria-label="Detected sargam">
              {sargam.map((t, i) => (
                <li key={i}>
                  <button
                    type="button"
                    aria-pressed={!removed.has(i)}
                    aria-label={`${swaraLabel(t)}${removed.has(i) ? ' (removed)' : ''}`}
                    onClick={() => setRemoved((r) => (r.has(i) ? new Set([...r].filter((x) => x !== i)) : new Set([...r, i])))}
                    className={cx('min-w-11 rounded-lg px-2 py-2 font-mono text-sm', removed.has(i) ? 'bg-surface-2 text-muted line-through' : 'bg-primary-soft text-primary')}
                  >
                    {swaraLabel(t)}
                  </button>
                </li>
              ))}
            </ol>
            {songSaOffset !== 0 && <p className="mt-1 text-xs text-muted">The exercise plays on your Sa ({WESTERN_NOTES[tonicMidi(data.profile.tonic) % 12]}), not the tune’s — the notes keep the same shape, just moved to a key that suits you.</p>}
          </div>
          <PreviewButton notes={kept.map((x) => x.t)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm">
              <span className="font-medium">Exercise name</span>
              <input className={inputClass} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mukhda line 1" />
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="font-medium">From song (optional)</span>
              <select className={inputClass} value={linkSong} onChange={(e) => setLinkSong(e.target.value)}>
                <option value="">— none —</option>
                {Object.values(data.songs).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Button icon="plus" onClick={save} disabled={kept.length < 2 || !!saved}>
            {saved ? 'Saved to My exercises' : 'Save as my exercise'}
          </Button>
          {savedPattern && (
            <Alert tone="success" title="Saved">
              Practise it in the{' '}
              <Link className="underline" to={`/studio/sargam?p=${encodeURIComponent(savedPattern.notes.join(','))}`}>
                Sargam Player
              </Link>{' '}
              or the{' '}
              <Link className="underline" to={`/studio/compare?pattern=${encodeURIComponent(`my:${savedPattern.id}`)}`}>
                Sur Graph
              </Link>
              , or sing it below with a pitch check.
            </Alert>
          )}
        </div>
      )}

      {savedPattern && (
        <div className="rounded-2xl bg-surface-2/50 p-3">
          <SequenceMatcher key={savedPattern.id} generate={() => savedPattern.notes} context={`pattern:${savedPattern.id}`} label={savedPattern.name} />
        </div>
      )}

      <MyExercises />
    </div>
  );
}

function PreviewButton({ notes }: { notes: SwaraToken[] }) {
  const { data } = useAppData();
  const [playing, setPlaying] = useState(false);
  const h = useRef<SequenceHandle | null>(null);
  useEffect(() => () => h.current?.stop(), []);
  const toggle = async () => {
    if (playing) {
      h.current?.stop();
      return setPlaying(false);
    }
    h.current = await playSequence(notes, data.profile.tonic, 70, { timbre: data.settings.demoTimbre });
    setPlaying(true);
    void h.current.done.then(() => setPlaying(false));
  };
  return (
    <Button variant="secondary" icon={playing ? 'stop' : 'play'} onClick={toggle} disabled={notes.length === 0}>
      {playing ? 'Stop' : 'Hear it on my Sa'}
    </Button>
  );
}

function MyExercises() {
  const { data, update } = useAppData();
  if (!data.patterns.length) return null;
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">My exercises</h4>
      <ul className="space-y-2">
        {[...data.patterns].reverse().map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm">
            <div className="min-w-0">
              <p className="font-medium">{p.name}</p>
              <p className="truncate font-mono text-xs text-muted">{p.notes.map(swaraLabel).join(' ')}</p>
              {p.songId && data.songs[p.songId] && (
                <Link to={`/songs/${encodeURIComponent(p.songId)}`} className="text-xs text-primary underline">
                  {data.songs[p.songId].title}
                </Link>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link className="text-sm text-primary underline" to={`/studio/sargam?p=${encodeURIComponent(p.notes.join(','))}`}>
                Sargam Player
              </Link>
              <Link className="text-sm text-primary underline" to={`/studio/compare?pattern=${encodeURIComponent(`my:${p.id}`)}`}>
                Sur Graph
              </Link>
              <button type="button" className="text-sm text-danger underline" onClick={() => update((d) => void (d.patterns = d.patterns.filter((x) => x.id !== p.id)))} aria-label={`Delete ${p.name}`}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
