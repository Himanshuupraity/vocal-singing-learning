import { useEffect, useRef, useState } from 'react';
import { analyzeSamples, decodeToMono, type RecordingAnalysis } from '../../audio/offlineAnalysis';
import { freqToMidiFloat, swaraLabel, tonicMidi, tonicLabel, SWARA_LETTERS } from '../../music/theory';
import { useAppData } from '../../state/AppData';
import { Alert, Button, Spinner } from '../ui';

/** Whole-recording pitch trace with sargam grid lines relative to the learner's Sa. */
function Trace({ a, saMidi }: { a: RecordingAnalysis; saMidi: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const voiced = a.frames.filter((f) => f.status === 'voiced' && f.freq);
  const rel = voiced.map((f) => freqToMidiFloat(f.freq!) - saMidi);
  const lo = Math.floor(Math.min(...rel, 0)) - 1;
  const hi = Math.ceil(Math.max(...rel, 12)) + 1;
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    const h = 220;
    c.width = w * dpr;
    c.height = h * dpr;
    const g = c.getContext('2d')!;
    g.scale(dpr, dpr);
    const css = getComputedStyle(document.documentElement);
    const left = 38;
    const y = (s: number) => h - 8 - ((s - lo) / (hi - lo)) * (h - 16);
    const x = (t: number) => left + (t / Math.max(0.1, a.durationSec)) * (w - left - 6);
    g.font = '10px Inter, sans-serif';
    for (let s = lo; s <= hi; s++) {
      const pc = ((s % 12) + 12) % 12;
      const isSa = pc === 0;
      if (![0, 2, 4, 5, 7, 9, 11].includes(pc)) continue;
      g.strokeStyle = isSa ? css.getPropertyValue('--success') : css.getPropertyValue('--border');
      g.lineWidth = isSa ? 1.5 : 1;
      g.beginPath();
      g.moveTo(left, y(s));
      g.lineTo(w, y(s));
      g.stroke();
      g.fillStyle = css.getPropertyValue('--muted');
      const oct = Math.floor(s / 12);
      g.fillText(swaraLabel((oct < 0 ? '.'.repeat(-oct) : '') + SWARA_LETTERS[pc] + (oct > 0 ? "'".repeat(oct) : '')), 2, y(s) + 3);
    }
    g.fillStyle = css.getPropertyValue('--primary');
    voiced.forEach((f, i) => {
      g.beginPath();
      g.arc(x(f.t), y(rel[i]), 1.8, 0, Math.PI * 2);
      g.fill();
    });
  }, [a, lo, hi, rel, saMidi, voiced]);
  return <canvas ref={ref} className="w-full rounded-xl bg-surface" style={{ height: 220 }} role="img" aria-label="Pitch of your recording over time, with sargam lines. The green line is Sa." />;
}

export function RecordingAnalysisView({ blob }: { blob: Blob }) {
  const { data } = useAppData();
  const tonic = data.profile.tonic;
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [a, setA] = useState<RecordingAnalysis | null>(null);
  const [err, setErr] = useState('');

  const run = async () => {
    setState('busy');
    try {
      const { samples, sampleRate } = await decodeToMono(blob);
      await new Promise((r) => setTimeout(r, 0));
      setA(analyzeSamples(samples, sampleRate, tonic));
      setState('done');
    } catch (e) {
      setErr((e as Error).message || 'This recording could not be decoded in this browser.');
      setState('error');
    }
  };

  if (state === 'idle') return <Button size="sm" variant="secondary" icon="chart" onClick={run}>Analyse pitch</Button>;
  if (state === 'busy') return <Spinner label="Analysing…" />;
  if (state === 'error') return <Alert tone="warning">Couldn&apos;t analyse: {err}</Alert>;
  if (!a) return null;
  if (a.voicedSec < 0.5) return <Alert tone="info">No clear sung notes were found in this recording.</Alert>;
  return (
    <div className="mt-2 space-y-2 rounded-xl bg-surface-2 p-3">
      <Trace a={a} saMidi={tonicMidi(tonic)} />
      <ul className="grid gap-1 text-sm sm:grid-cols-2">
        <li>Clear singing: {a.voicedSec.toFixed(1)}s of {a.durationSec.toFixed(1)}s</li>
        <li>
          Range used: {a.lowestToken ? swaraLabel(a.lowestToken) : '—'} to {a.highestToken ? swaraLabel(a.highestToken) : '—'} (Sa = {tonicLabel(tonic)})
        </li>
        {a.steadinessCents !== null && <li>Note steadiness: typical frame-to-frame wobble {a.steadinessCents} cents (lower = steadier)</li>}
      </ul>
      <p className="text-sm font-medium">Notes you spent the most time on</p>
      <ul className="flex flex-wrap gap-1.5">
        {a.swaras.slice(0, 10).map((s) => (
          <li key={s.token} className="rounded-lg bg-surface px-2 py-1 font-mono text-xs">
            {s.label} · {s.sec.toFixed(1)}s · {s.avgCents > 0 ? '+' : ''}
            {s.avgCents}¢
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted">Cents show how far you were, on average, from the exact swara (relative to your current Sa). This measures pitch only — not tone, words or expression. If you changed your Sa since recording, the swara names will shift.</p>
    </div>
  );
}
