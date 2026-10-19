import { useEffect, useRef, useState } from 'react';
import { useMicPitch } from '../../hooks/useMicPitch';
import { median, type PitchFrame } from '../../audio/pitchAnalysis';
import { freqToMidiFloat, midiToFreq, midiToNoteName, freqToSwara, swaraLabel, tonicMidi, tonicLabel } from '../../music/theory';
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
      {data.ranges.length > 1 && (
        <p className="text-xs text-muted">
          History: {data.ranges.slice(-5).map((x) => `${new Date(x.at).toLocaleDateString()}: ${midiToNoteName(x.lowMidi).label}–${midiToNoteName(x.highMidi).label}`).join(' · ')}
        </p>
      )}
    </div>
  );
}
