import { useEffect, useRef, useState } from 'react';
import { useMicPitch } from '../../hooks/useMicPitch';
import { median, type PitchFrame } from '../../audio/pitchAnalysis';
import { freqToMidiFloat, midiToFreq, midiToNoteName, freqToSwara, swaraLabel, tonicMidi, tonicLabel, type Tonic } from '../../music/theory';
import { scaleName, suggestSa } from '../../music/range';
import { playFreq } from '../../audio/synth';
import { ensureRunning } from '../../audio/context';
import type { RangeRecord } from '../../storage/schema';
import { useAppData } from '../../state/AppData';
import { uid } from '../../lib/dates';
import { Alert, Button, cx } from '../ui';
import { MicPanel } from './MicPanel';

const HOLD_SEC = 4;

/**
 * Measures the lowest and highest notes the learner can hold COMFORTABLY.
 * We take the median of clearly voiced frames during a steady hold, so a
 * brief squeak or growl doesn't count. Nothing here labels a voice type.
 */
export function RangeFinder() {
  const { data, update } = useAppData();
  const mic = useMicPitch();
  const [step, setStep] = useState<'low' | 'high' | 'done'>('low');
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [low, setLow] = useState<number | null>(null);
  const [high, setHigh] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const frames = useRef<PitchFrame[]>([]);
  const cap = useRef(false);
  const tonic = data.profile.tonic;
  const last = data.ranges.at(-1);

  useEffect(() => mic.subscribe((f) => cap.current && frames.current.push(f)), [mic]);

  const capture = async () => {
    if (mic.state !== 'on') await mic.start();
    setMsg(null);
    frames.current = [];
    cap.current = true;
    setCapturing(true);
    setCountdown(HOLD_SEC);
    for (let s = 1; s <= HOLD_SEC; s++) window.setTimeout(() => setCountdown(HOLD_SEC - s), s * 1000);
    window.setTimeout(() => {
      cap.current = false;
      setCapturing(false);
      const v = frames.current.filter((f) => f.status === 'voiced' && f.freq).map((f) => freqToMidiFloat(f.freq!));
      if (v.length < 20) {
        setMsg('Not enough steady, clear voice was detected. Hold one comfortable note on “aa” or “oo” for the whole 4 seconds.');
        return;
      }
      const m = Math.round(median(v));
      if (step === 'low') {
        setLow(m);
        setStep('high');
      } else {
        if (low !== null && m <= low) {
          setMsg('That note was not higher than your low note. Try a comfortable higher note.');
          return;
        }
        setHigh(m);
        setStep('done');
        update((d) => void d.ranges.push({ id: uid(), at: new Date().toISOString(), lowMidi: low!, highMidi: m }));
      }
    }, HOLD_SEC * 1000);
  };

  const reset = () => {
    setLow(null);
    setHigh(null);
    setStep('low');
    setMsg(null);
  };

  const live = mic.frame?.status === 'voiced' && mic.frame.freq ? midiToNoteName(Math.round(freqToMidiFloat(mic.frame.freq))).label : null;
  const sa = tonicMidi(tonic);
  const r = high !== null && low !== null ? { lowMidi: low, highMidi: high } : last;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Comfortable Range Finder</h3>
        <p className="text-sm text-muted">
          Find the lowest and highest notes you can hold <strong>comfortably</strong> — not the extreme notes you can just about reach. Comfortable range grows slowly with gentle practice; it is not a voice-type label.
        </p>
      </div>
      <Alert tone="warning" title="Stay comfortable">Never push or strain. If a note scratches, feels tight or makes you cough, it is outside your comfortable range — come back towards the middle.</Alert>
      <MicPanel mic={mic} purpose="measure your comfortable low and high notes" />

      <ol className="grid gap-3 sm:grid-cols-2">
        {(['low', 'high'] as const).map((k) => {
          const val = k === 'low' ? low : high;
          const on = step === k;
          return (
            <li key={k} className={cx('rounded-2xl border p-4', on ? 'border-primary' : 'border-border')}>
              <p className="font-medium">{k === 'low' ? '1. Your comfortable LOW note' : '2. Your comfortable HIGH note'}</p>
              <p className="mt-1 text-sm text-muted">
                {k === 'low' ? 'Slide gently down on “aa” until it starts to feel weak or gravelly, then come up a little and hold that note.' : 'Slide gently up on “oo” or “aa” until it starts to feel effortful, then come down a little and hold that note softly.'}
              </p>
              {val !== null ? (
                <p className="mt-2 text-lg font-semibold">
                  {midiToNoteName(val).label} <span className="text-sm font-normal text-muted">({midiToFreq(val).toFixed(0)} Hz · {swaraLabel(freqToSwara(midiToFreq(val), tonic).token)} with Sa = {tonicLabel(tonic)})</span>
                </p>
              ) : on ? (
                <Button className="mt-3" icon="mic" onClick={capture} disabled={capturing || !!mic.unsupported}>
                  {capturing ? `Hold it… ${countdown}s` : 'Hold & measure (4s)'}
                </Button>
              ) : null}
            </li>
          );
        })}
      </ol>
      {mic.state === 'on' && <p className="text-sm text-muted" aria-live="off">Live: {live ?? '—'}</p>}
      {msg && <Alert tone="warning">{msg}</Alert>}

      {r && (
        <div className="rounded-2xl bg-surface-2 p-4 text-sm">
          <p className="font-semibold">
            {step === 'done' ? 'Your comfortable range today' : 'Your last measured range'}: {midiToNoteName(r.lowMidi).label} – {midiToNoteName(r.highMidi).label} ({r.highMidi - r.lowMidi} semitones ≈ {((r.highMidi - r.lowMidi) / 12).toFixed(1)} octaves)
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            <li>
              Your Sa ({tonicLabel(tonic)}) is {sa - r.lowMidi} semitones above your low note
              {sa < r.lowMidi ? ' — that is below your comfortable range; consider a higher Sa.' : sa - r.lowMidi < 3 ? ' — quite close to the bottom; a slightly higher Sa may feel easier.' : '.'}
            </li>
            <li>
              Upper Sa (Sa&apos;) is {sa + 12 <= r.highMidi ? 'within' : 'above'} your comfortable range
              {sa + 12 > r.highMidi ? ' — that is normal for beginners. Practise only up to where it stays easy; or try a lower Sa.' : '.'}
            </li>
            <li>Many beginners’ comfortable range is around 1–1.5 octaves and widens gradually with gentle practice.</li>
          </ul>
          {step === 'done' && (
            <Button className="mt-3" size="sm" variant="ghost" onClick={reset}>
              Measure again
            </Button>
          )}
        </div>
      )}
      {r && <SaSuggestion low={r.lowMidi} high={r.highMidi} current={tonic} />}
      {data.ranges.length > 1 && <RangeHistory ranges={data.ranges} />}
    </div>
  );
}

/** Suggests a Sa that fits the measured range, with a way to hear it and use it. */
function SaSuggestion({ low, high, current }: { low: number; high: number; current: Tonic }) {
  const { update } = useAppData();
  const { tonic, reason } = suggestSa(low, high);
  const same = tonicLabel(tonic) === tonicLabel(current);
  const hear = async () => {
    await ensureRunning();
    playFreq(midiToFreq(tonicMidi(tonic)), { duration: 2, timbre: 'reed' });
  };
  return (
    <div className="rounded-2xl border border-border p-4 text-sm">
      <p className="font-semibold">
        Suggested Sa for this range: {tonicLabel(tonic)} <span className="font-normal text-muted">(harmonium scale “{scaleName(tonic.note)}”)</span>
      </p>
      <p className="mt-1 text-muted">
        {reason === 'fits'
          ? 'With this Sa, the notes beginners use most — from mandra Pa up to taar Sa — sit inside your comfortable range.'
          : 'Your comfortable range is a little narrow for a full octave above Sa, so this keeps Sa low enough that you only go a little past your high note. That’s fine — range grows gently with practice.'}{' '}
        Try singing “Sa” on it; if it doesn’t feel easy, keep your current Sa or use the Sa Finder.
      </p>
      <p className="mt-1 text-muted">Your current Sa: {tonicLabel(current)} (“{scaleName(current.note)}”).</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" icon="play" onClick={hear}>
          Hear {tonicLabel(tonic)}
        </Button>
        {same ? (
          <span className="self-center text-success">This is already your Sa.</span>
        ) : (
          <Button
            size="sm"
            onClick={() =>
              update((d) => {
                d.profile.tonic = tonic;
                d.profile.tonicSource = 'finder';
              })
            }
          >
            Use {tonicLabel(tonic)} as my Sa
          </Button>
        )}
      </div>
    </div>
  );
}

/** Each measurement as a bar from low to high note, oldest first, so growth is visible. */
function RangeHistory({ ranges }: { ranges: RangeRecord[] }) {
  const list = ranges.slice(-10);
  const lo = Math.min(...list.map((x) => x.lowMidi)) - 1;
  const hi = Math.max(...list.map((x) => x.highMidi)) + 1;
  const W = 320;
  const H = 150;
  const y = (m: number) => H - 18 - ((m - lo) / (hi - lo)) * (H - 30);
  const bw = Math.min(26, (W - 50) / list.length - 6);
  const first = list[0];
  const last = list[list.length - 1];
  const growth = last.highMidi - last.lowMidi - (first.highMidi - first.lowMidi);
  return (
    <figure className="rounded-2xl border border-border p-4">
      <p className="text-sm font-semibold">Your range over time</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-40 w-full" role="img" aria-label={`Comfortable range over ${list.length} measurements: ${list.map((x) => `${new Date(x.at).toLocaleDateString()} ${midiToNoteName(x.lowMidi).label} to ${midiToNoteName(x.highMidi).label}`).join('; ')}`}>
        {[lo + 1, Math.round((lo + hi) / 2), hi - 1].map((m) => (
          <g key={m}>
            <line x1={40} x2={W} y1={y(m)} y2={y(m)} className="stroke-border" strokeDasharray="3 3" />
            <text x={0} y={y(m) + 3} className="fill-muted" fontSize={10}>
              {midiToNoteName(m).label}
            </text>
          </g>
        ))}
        {list.map((x, i) => {
          const cx0 = 50 + i * ((W - 50) / list.length);
          return (
            <g key={x.id}>
              <rect x={cx0} y={y(x.highMidi)} width={bw} height={Math.max(2, y(x.lowMidi) - y(x.highMidi))} rx={4} className={i === list.length - 1 ? 'fill-primary' : 'fill-primary/40'} />
              <text x={cx0 + bw / 2} y={H - 4} textAnchor="middle" className="fill-muted" fontSize={9}>
                {new Date(x.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="text-xs text-muted">
        {growth > 0 ? `Your comfortable range has grown by ${growth} semitone${growth === 1 ? '' : 's'} since ${new Date(first.at).toLocaleDateString()}.` : growth < 0 ? 'Your latest range is a little narrower — that’s normal on a tired or cold day. Measure again when fresh.' : 'Same range as your first measurement here. Range grows slowly; measure again in a few weeks.'}
      </figcaption>
    </figure>
  );
}
