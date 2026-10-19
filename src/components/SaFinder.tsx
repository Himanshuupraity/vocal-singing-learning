import { useEffect, useRef, useState } from 'react';
import { useMicPitch } from '../hooks/useMicPitch';
import { median, type PitchFrame } from '../audio/pitchAnalysis';
import { freqToMidiFloat, midiToNoteName, tonicLabel, tonicMidi, TONIC_CHOICES, midiToFreq, type Tonic } from '../music/theory';
import { playFreq } from '../audio/synth';
import { ensureRunning } from '../audio/context';
import { useAppData } from '../state/AppData';
import { MicPanel } from './studio/MicPanel';
import { Alert, Button, cx } from './ui';

const nearestTonic = (midi: number): Tonic => TONIC_CHOICES.reduce((best, t) => (Math.abs(tonicMidi(t) - midi) < Math.abs(tonicMidi(best) - midi) ? t : best), TONIC_CHOICES[0]);

/**
 * Helps a beginner find a comfortable Sa from their relaxed speaking/humming pitch.
 * The suggestion is only a starting point; the learner chooses by comfort.
 */
export function SaFinder() {
  const { data, update } = useAppData();
  const mic = useMicPitch();
  const [phase, setPhase] = useState<'idle' | 'listening' | 'choose'>('idle');
  const [suggest, setSuggest] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const frames = useRef<PitchFrame[]>([]);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => mic.subscribe((f) => phaseRef.current === 'listening' && frames.current.push(f)), [mic]);

  const listen = async () => {
    if (mic.state !== 'on') await mic.start();
    frames.current = [];
    setMsg(null);
    setPhase('listening');
    window.setTimeout(() => {
      const v = frames.current.filter((f) => f.status === 'voiced' && f.freq).map((f) => freqToMidiFloat(f.freq!));
      if (v.length < 15) {
        setPhase('idle');
        setMsg('I couldn’t hear enough clear voice. Hum a little louder, closer to the mic, for the full 6 seconds.');
        return;
      }
      const m = Math.round(median(v));
      const t = nearestTonic(m);
      setSuggest(tonicMidi(t));
      setPicked(tonicMidi(t));
      setPhase('choose');
    }, 6000);
  };

  const candidates = suggest === null ? [] : [-2, -1, 0, 1, 2].map((o) => suggest + o).filter((m) => TONIC_CHOICES.some((t) => tonicMidi(t) === m));

  const hear = async (m: number) => {
    await ensureRunning();
    setPicked(m);
    playFreq(midiToFreq(m), { duration: 2, timbre: 'reed' });
  };

  const save = () => {
    if (picked === null) return;
    const t = nearestTonic(picked);
    update((d) => {
      d.profile.tonic = t;
      d.profile.tonicSource = 'finder';
    });
    setMsg(`Saved! Your Sa is now ${tonicLabel(t)}. Every tool and demo will use it. You can change it any time in Settings.`);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border p-4">
      <h3 className="text-lg font-semibold">Sa Finder</h3>
      <p className="text-sm text-muted">
        Relax, and hum “mmm” or say “hello, how are you” in your normal, easy speaking voice — no effort. We&apos;ll measure the middle of that pitch and suggest a Sa near it. Your final choice should simply feel comfortable — not too low, not straining.
      </p>
      <MicPanel mic={mic} purpose="measure your comfortable speaking/humming pitch" />
      <Button icon="mic" onClick={listen} disabled={phase === 'listening' || !!mic.unsupported}>
        {phase === 'listening' ? 'Listening… keep humming (6s)' : suggest === null ? 'Measure my comfortable pitch' : 'Measure again'}
      </Button>
      {msg && <Alert tone={msg.startsWith('Saved') ? 'success' : 'warning'}>{msg}</Alert>}
      {phase === 'choose' && suggest !== null && (
        <div className="space-y-3">
          <p className="text-sm">
            Your relaxed pitch was around <strong>{midiToNoteName(suggest).label}</strong>. Tap each option to hear it, then sing “Sa” on it. Choose the one that feels easiest to hold for 5 seconds.
          </p>
          <div className="flex flex-wrap gap-2">
            {candidates.map((m) => (
              <button key={m} type="button" onClick={() => hear(m)} aria-pressed={picked === m} className={cx('rounded-xl px-4 py-2 text-sm font-medium', picked === m ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
                {midiToNoteName(m).label}
                {m === suggest && ' (suggested)'}
              </button>
            ))}
          </div>
          <Button onClick={save} disabled={picked === null}>
            Use {picked !== null ? midiToNoteName(picked).label : ''} as my Sa
          </Button>
          <p className="text-xs text-muted">Current Sa: {tonicLabel(data.profile.tonic)}. There is no “correct” Sa for a voice type or gender — only what is comfortable for you today. It may shift slightly as your voice develops.</p>
        </div>
      )}
    </div>
  );
}
