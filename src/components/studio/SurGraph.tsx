import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMicPitch } from '../../hooks/useMicPitch';
import { playSequence, type SequenceHandle } from '../../audio/sequencer';
import { playFreq } from '../../audio/synth';
import { ensureRunning } from '../../audio/context';
import { analyzeSamples, decodeToMono } from '../../audio/offlineAnalysis';
import { compareTracks, relSemitones, scoreNoteWindow, type TrackPoint } from '../../music/melody';
import { swaraLabel, swaraToMidi, tonicMidi, type SwaraToken, type Tonic } from '../../music/theory';
import { RAGAS } from '../../data/ragas';
import { recordingStore, type RecordingEntry } from '../../storage/recordings';
import { useAppData } from '../../state/AppData';
import { Alert, Button, cx, inputClass } from '../ui';
import { MicPanel } from './MicPanel';
import { PitchCompareChart, type TargetBand } from './PitchCompareChart';
import { PRESETS } from './SargamPlayer';

/** Seconds of a recording or file that are analysed for comparison. */
const MAX_SEC = 90;

export function SurGraph({ initialPattern }: { initialPattern?: string }) {
  const [mode, setMode] = useState<'pattern' | 'recordings'>('pattern');
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Sur Graph</h3>
        <p className="text-sm text-muted">See your pitch drawn next to the notes you were meant to sing — or next to your teacher’s recording — so you can see exactly where you went above or below the sur.</p>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Compare with">
        {(
          [
            ['pattern', 'Sing a pattern'],
            ['recordings', 'Compare with a teacher’s recording'],
          ] as const
        ).map(([m, label]) => (
          <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={cx('rounded-lg px-3 py-1.5 text-sm', mode === m ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
            {label}
          </button>
        ))}
      </div>
      {mode === 'pattern' ? <PatternCompare initialPattern={initialPattern} /> : <RecordingCompare />}
    </div>
  );
}

function usePatternOptions() {
  const { data } = useAppData();
  return useMemo(
    () => [
      { group: 'My exercises', items: data.patterns.map((p) => ({ id: `my:${p.id}`, label: p.name, notes: p.notes })) },
      { group: 'Sargam', items: PRESETS.map((p) => ({ id: `sargam:${p.id}`, label: p.label, notes: p.notes })) },
      ...RAGAS.map((r) => ({
        group: `Raag ${r.name}`,
        items: [
          { id: `raag:${r.id}:aroha`, label: `${r.name} aroha`, notes: r.aroha },
          { id: `raag:${r.id}:avaroha`, label: `${r.name} avaroha`, notes: r.avaroha },
          ...r.phrases.map((p, i) => ({ id: `raag:${r.id}:${i}`, label: `${r.name}: ${p.label}`, notes: p.notes })),
        ],
      })),
    ].filter((g) => g.items.length),
    [data.patterns],
  );
}

type Phase = 'ready' | 'reference' | 'countin' | 'singing' | 'result';

function bandsFor(notes: SwaraToken[], tonic: Tonic, beat: number): (TargetBand & { token: SwaraToken })[] {
  const sa = tonicMidi(tonic);
  return notes.flatMap((t, i) => {
    const m = swaraToMidi(t, tonic);
    return m === null ? [] : [{ token: t, start: i * beat, dur: beat, semis: m - sa }];
  });
}

function PatternCompare({ initialPattern }: { initialPattern?: string }) {
  const { data } = useAppData();
  const tonic = data.profile.tonic;
  const groups = usePatternOptions();
  const all = groups.flatMap((g) => g.items);
  const [sel, setSel] = useState(() => (initialPattern && all.some((o) => o.id === initialPattern) ? initialPattern : all.find((o) => o.id.startsWith('sargam:'))!.id));
  const [bpm, setBpm] = useState(50);
  const [guide, setGuide] = useState(false);
  const [phase, setPhase] = useState<Phase>('ready');
  const [cursor, setCursor] = useState<number | null>(null);
  const [mine, setMine] = useState<TrackPoint[]>([]);
  const [scores, setScores] = useState<ReturnType<typeof scoreNoteWindow>[] | null>(null);
  const mic = useMicPitch();
  const opt = all.find((o) => o.id === sel) ?? all[0];
  const beat = 60 / bpm;
  const bands = useMemo(() => bandsFor(opt.notes, tonic, beat), [opt.notes, tonic, beat]);
  const duration = opt.notes.length * beat;
  const t0 = useRef(0);
  const capturing = useRef(false);
  const timers = useRef<number[]>([]);
  const raf = useRef(0);
  const seq = useRef<SequenceHandle | null>(null);
  const points = useRef<TrackPoint[]>([]);
  const runId = useRef(0);

  const stopAll = () => {
    runId.current++;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    cancelAnimationFrame(raf.current);
    seq.current?.stop();
    capturing.current = false;
  };
  useEffect(() => stopAll, []);
  useEffect(() => {
    stopAll();
    setPhase('ready');
    setMine([]);
    setScores(null);
    setCursor(null);
  }, [sel, bpm, tonic]);

  useEffect(
    () =>
      mic.subscribe((f) => {
        if (!capturing.current || f.status !== 'voiced' || !f.freq) return;
        points.current.push({ t: (performance.now() - t0.current) / 1000, semis: relSemitones(f.freq, tonic) });
        setMine([...points.current]);
      }),
    [mic, tonic],
  );

  const runCursor = () => {
    const tick = () => {
      const t = (performance.now() - t0.current) / 1000;
      setCursor(Math.min(t, duration));
      if (t < duration) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const finish = () => {
    capturing.current = false;
    setCursor(null);
    const res = bands.map((b) => {
      // Middle 70% of each note's slot: ignore the slide in and out.
      const inner = points.current.filter((p) => p.t >= b.start + b.dur * 0.2 && p.t < b.start + b.dur * 0.9).map((p) => p.semis);
      return scoreNoteWindow(inner, b.semis);
    });
    setScores(res);
    setPhase('result');
  };

  const start = async () => {
    if (mic.state !== 'on') await mic.start();
    stopAll();
    setScores(null);
    setMine([]);
    points.current = [];
    const run = runId.current;
    const ctx = await ensureRunning();
    // 1. The reference plays while the cursor shows where it is.
    setPhase('reference');
    t0.current = performance.now();
    runCursor();
    seq.current = await playSequence(opt.notes, tonic, bpm, { timbre: data.settings.demoTimbre });
    await seq.current.done;
    if (run !== runId.current) return;
    // 2. Two count-in clicks.
    setPhase('countin');
    setCursor(null);
    for (let i = 0; i < 2; i++) playFreq(1400, { when: ctx.currentTime + 0.1 + i * beat, duration: 0.05, timbre: 'pure', volume: 0.25 });
    timers.current.push(
      window.setTimeout(async () => {
        // 3. Your turn, on the same timeline.
        setPhase('singing');
        t0.current = performance.now();
        capturing.current = true;
        runCursor();
        if (guide && run === runId.current) seq.current = await playSequence(opt.notes, tonic, bpm, { timbre: 'pure' });
        timers.current.push(window.setTimeout(finish, duration * 1000 + 300));
      }, (0.1 + 2 * beat) * 1000),
    );
  };

  const reliable = scores?.filter((s) => s.reliable) ?? [];
  const matched = reliable.filter((s) => s.matched).length;
  const signed = reliable.map((s) => s.cents);
  const avg = signed.length ? Math.round(signed.reduce((a, b) => a + b, 0) / signed.length) : 0;
  const worst = scores ? bands.map((b, i) => ({ b, s: scores[i] })).filter((x) => x.s.reliable && !x.s.matched).sort((a, z) => Math.abs(z.s.cents) - Math.abs(a.s.cents))[0] : undefined;
  const busy = phase === 'reference' || phase === 'countin' || phase === 'singing';

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1.5 text-sm sm:col-span-2">
          <span className="font-medium">Pattern</span>
          <select className={inputClass} value={opt.id} onChange={(e) => setSel(e.target.value)} disabled={busy}>
            {groups.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.items.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Speed</span>
          <select className={inputClass} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} disabled={busy}>
            <option value={40}>Very slow (40 bpm)</option>
            <option value={50}>Slow (50 bpm)</option>
            <option value={65}>Medium (65 bpm)</option>
            <option value={80}>Faster (80 bpm)</option>
          </select>
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={guide} onChange={(e) => setGuide(e.target.checked)} disabled={busy} /> Play soft guide notes while I sing (only with headphones — otherwise the mic hears the guide)
      </label>
      <MicPanel mic={mic} purpose="draw your pitch next to the pattern" />

      <PitchCompareChart
        bands={bands}
        mine={mine}
        duration={duration}
        cursor={cursor}
        label={`Target notes ${opt.notes.filter((t) => t !== '-').map(swaraLabel).join(' ')} as bands, with your sung pitch as dots: green inside the band, red outside.`}
      />
      <p className="text-xs text-muted">Bands = the notes to sing (±50 cents). Your dots turn green inside a band and red outside. Singing the pattern an octave lower or higher is fine — it’s drawn on the target octave.</p>

      <p className="min-h-6 text-sm font-medium" aria-live="polite">
        {phase === 'ready' && 'Press Start: listen to the pattern once, then sing it on the same beat.'}
        {phase === 'reference' && 'Listen…'}
        {phase === 'countin' && 'Your turn in 2… 1…'}
        {phase === 'singing' && <span className="text-primary">Sing now, following the moving line.</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button icon="mic" onClick={start} disabled={busy || !!mic.unsupported}>
          {phase === 'result' ? 'Try again' : 'Start'}
        </Button>
        {busy && (
          <Button
            variant="ghost"
            onClick={() => {
              stopAll();
              setPhase('ready');
              setCursor(null);
            }}
          >
            Stop
          </Button>
        )}
      </div>

      {scores && (
        <div className="space-y-3">
          <ol className="flex flex-wrap gap-1.5" aria-label="Result per note">
            {bands.map((b, i) => {
              const s = scores[i];
              return (
                <li key={i} className={cx('min-w-12 rounded-lg px-2 py-1 text-center font-mono text-sm', !s.reliable ? 'bg-surface-2 text-muted' : s.matched ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger')}>
                  {swaraLabel(b.token)}
                  <span className="block text-[11px]">{s.reliable ? `${s.cents > 0 ? '+' : ''}${s.cents}¢` : 'unclear'}</span>
                </li>
              );
            })}
          </ol>
          <Alert tone={reliable.length && matched === bands.length ? 'success' : 'info'} title={`${matched} of ${bands.length} notes in tune`}>
            {reliable.length < bands.length && 'Some notes were too short or unclear to measure — sing a little louder and hold each note for its whole slot. '}
            {worst && `Biggest miss: ${swaraLabel(worst.b.token)}, ${Math.abs(worst.s.cents)} cents ${worst.s.cents < 0 ? 'low' : 'high'}. `}
            {reliable.length >= 3 && Math.abs(avg) >= 25 && `Overall you sang a little ${avg < 0 ? 'low (flat) — aim each note a touch higher' : 'high (sharp) — relax and aim a touch lower'}. `}
            {reliable.length && matched === bands.length ? 'Every note in tune — try a faster speed next.' : ''}
          </Alert>
        </div>
      )}
    </div>
  );
}

type Source = { kind: 'rec'; id: string } | { kind: 'file'; file: File } | null;

async function trackOf(blob: Blob, tonic: Tonic): Promise<TrackPoint[]> {
  const { samples, sampleRate } = await decodeToMono(blob);
  const a = analyzeSamples(samples.subarray(0, Math.floor(MAX_SEC * sampleRate)), sampleRate, tonic);
  const pts = a.frames.filter((f) => f.status === 'voiced' && f.freq).map((f) => ({ t: f.t, semis: relSemitones(f.freq!, tonic) }));
  // Start both tracks at their first sung note.
  const first = pts[0]?.t ?? 0;
  return pts.map((p) => ({ ...p, t: p.t - first }));
}

function SourcePicker({ id, label, recordings, value, onChange }: { id: string; label: string; recordings: RecordingEntry[]; value: Source; onChange: (s: Source) => void }) {
  return (
    <fieldset className="space-y-1.5 text-sm">
      <legend className="font-medium">{label}</legend>
      <select
        id={id}
        aria-label={`${label}: recording`}
        className={inputClass}
        value={value?.kind === 'rec' ? value.id : value?.kind === 'file' ? 'file' : ''}
        onChange={(e) => onChange(e.target.value ? (e.target.value === 'file' ? value : { kind: 'rec', id: e.target.value }) : null)}
      >
        <option value="">Choose a recording…</option>
        {recordings.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label || 'Untitled'} · {new Date(r.createdAt).toLocaleDateString()} · {Math.round(r.durationSec)}s
          </option>
        ))}
        {value?.kind === 'file' && <option value="file">File: {value.file.name}</option>}
      </select>
      <label className="flex flex-wrap items-center gap-2 text-xs text-muted">
        or an audio file:
        <input type="file" accept="audio/*" className="text-xs" onChange={(e) => e.target.files?.[0] && onChange({ kind: 'file', file: e.target.files[0] })} />
      </label>
    </fieldset>
  );
}

function RecordingCompare() {
  const { data } = useAppData();
  const tonic = data.profile.tonic;
  const [recs, setRecs] = useState<RecordingEntry[]>([]);
  const [refSrc, setRefSrc] = useState<Source>(null);
  const [mySrc, setMySrc] = useState<Source>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [tracks, setTracks] = useState<{ ref: TrackPoint[]; mine: TrackPoint[] } | null>(null);
  const [offset, setOffset] = useState(0);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    if (data.settings.recordingConsent) recordingStore.list().then(setRecs).catch(() => setRecs([]));
  }, [data.settings.recordingConsent]);

  const blobOf = (s: Source) => (s?.kind === 'file' ? s.file : recs.find((r) => r.id === (s as { id: string }).id)?.blob);

  const run = async () => {
    setErr(null);
    setBusy(true);
    setTracks(null);
    try {
      const [a, b] = [blobOf(refSrc), blobOf(mySrc)];
      if (!a || !b) throw new Error('Choose both recordings first.');
      const [ref, mine] = [await trackOf(a, tonic), await trackOf(b, tonic)];
      if (ref.length < 10 || mine.length < 10) throw new Error(`No clear singing was found in ${ref.length < 10 ? 'the reference' : 'your recording'}.`);
      setOffset(0);
      setShift(0);
      setTracks({ ref, mine });
    } catch (e) {
      setErr((e as Error).message || 'This audio could not be decoded in this browser.');
    } finally {
      setBusy(false);
    }
  };

  const shown = useMemo(() => (tracks ? { ref: tracks.ref.map((p) => ({ ...p, semis: p.semis + shift })), mine: tracks.mine.map((p) => ({ ...p, t: p.t + offset })) } : null), [tracks, shift, offset]);
  const cmp = useMemo(() => (tracks ? compareTracks(tracks.ref, tracks.mine, offset, shift) : null), [tracks, offset, shift]);
  // Fold my octave onto the reference for drawing, so a lower voice sits on the same lines.
  const mineDrawn = shown && cmp ? shown.mine.map((p) => ({ ...p, semis: p.semis - cmp.octave * 12 })) : (shown?.mine ?? []);
  const duration = shown ? Math.max(...shown.ref.map((p) => p.t), ...shown.mine.map((p) => p.t)) + 0.5 : 1;
  const keyHint = cmp && Math.abs(cmp.medianCents) >= 80 ? Math.round(cmp.medianCents / 100) : 0;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Pick your teacher’s (or any reference) recording and your own. Both are analysed here on your device — nothing is uploaded. Record them in the{' '}
        <Link to="/studio/record" className="text-primary underline">
          Recording Journal
        </Link>{' '}
        or choose audio files (e.g. a clip your teacher sent). Best with the same phrase sung alone, without music.
      </p>
      {!data.settings.recordingConsent && <Alert tone="info">Turn on the Recording Journal to pick saved recordings here; audio files work without it.</Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <SourcePicker id="cmp-ref" label="Reference (teacher)" recordings={recs} value={refSrc} onChange={setRefSrc} />
        <SourcePicker id="cmp-mine" label="Your recording" recordings={recs} value={mySrc} onChange={setMySrc} />
      </div>
      <Button icon="chart" onClick={run} disabled={busy || !refSrc || !mySrc}>
        {busy ? 'Analysing…' : 'Compare'}
      </Button>
      {err && <Alert tone="warning">{err}</Alert>}

      {shown && (
        <div className="space-y-3">
          <PitchCompareChart reference={shown.ref} mine={mineDrawn} duration={duration} label="The reference singer’s pitch and your pitch over time, as two sets of dots on sargam lines relative to your Sa." />
          <p className="flex flex-wrap gap-4 text-xs text-muted">
            <span>
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-accent" /> Reference
            </span>
            <span>
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary" /> You
            </span>
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium">Line up in time: {offset > 0 ? '+' : ''}
                {offset.toFixed(1)}s</span>
              <input type="range" min={-5} max={5} step={0.1} value={offset} onChange={(e) => setOffset(Number(e.target.value))} className="w-full" aria-label="Shift your recording in time" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium">Reference Sa shift: {shift > 0 ? '+' : ''}
                {shift} semitones</span>
              <input type="range" min={-6} max={6} step={1} value={shift} onChange={(e) => setShift(Number(e.target.value))} className="w-full" aria-label="Shift the reference up or down in semitones" />
            </label>
          </div>
          {cmp ? (
            <Alert tone={cmp.withinPct >= 70 ? 'success' : 'info'} title={`${cmp.withinPct}% of the time within half a semitone of the reference`}>
              Typical difference: {cmp.medianAbsCents} cents.{' '}
              {cmp.octave !== 0 && `Your voice is ${Math.abs(cmp.octave)} octave${Math.abs(cmp.octave) > 1 ? 's' : ''} ${cmp.octave < 0 ? 'lower' : 'higher'} than the reference, so it was compared an octave apart — that’s fine. `}
              {keyHint !== 0 ? `You are about ${Math.abs(keyHint)} semitone${Math.abs(keyHint) > 1 ? 's' : ''} ${keyHint > 0 ? 'above' : 'below'} the reference throughout — if the reference was sung on a different Sa, set the Sa shift to ${keyHint > 0 ? '+' : ''}${keyHint}.` : Math.abs(cmp.medianCents) >= 25 ? `Overall you were a little ${cmp.medianCents < 0 ? 'low (flat)' : 'high (sharp)'}.` : ''}
            </Alert>
          ) : (
            <Alert tone="info">The two recordings don’t overlap in time yet — move the time slider until the shapes line up.</Alert>
          )}
          <p className="text-xs text-muted">Both start at their first sung note. If you sang slower or faster than the reference, the lines drift apart; slide them to line up the part you want to check.</p>
        </div>
      )}
    </div>
  );
}
