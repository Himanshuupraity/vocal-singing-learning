import { useMemo, useState } from 'react';
import { playFreq } from '../../audio/synth';
import { ensureRunning } from '../../audio/context';
import { freqToSwara, midiToFreq, midiToNoteName, swaraLabel, tonicMidi } from '../../music/theory';
import { useAppData } from '../../state/AppData';
import { useMicPitch } from '../../hooks/useMicPitch';
import { describeFreq } from '../../audio/pitchAnalysis';
import { Button, cx } from '../ui';
import { MicPanel } from './MicPanel';

const START = 48; // C3
const KEYS = 25; // two octaves + 1

export function VirtualKeyboard() {
  const { data } = useAppData();
  const tonic = data.profile.tonic;
  const [startMidi, setStart] = useState(START);
  const [last, setLast] = useState<number | null>(null);
  const [showSargam, setShowSargam] = useState(true);
  const [compare, setCompare] = useState(false);
  const mic = useMicPitch();
  const sa = tonicMidi(tonic);

  const keys = useMemo(() => Array.from({ length: KEYS }, (_, i) => startMidi + i), [startMidi]);
  const whites = keys.filter((m) => !midiToNoteName(m).name.includes('#'));

  const press = async (m: number) => {
    await ensureRunning();
    playFreq(midiToFreq(m), { duration: 1.2 });
    setLast(m);
  };

  const voice = mic.frame?.status === 'voiced' && mic.frame.freq ? describeFreq(mic.frame.freq) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">Virtual Keyboard</h3>
          <p className="text-sm text-muted">An optional learning aid. Hindustani training doesn&apos;t require a keyboard, but it helps you see note relationships.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setStart((s) => Math.max(24, s - 12))} aria-label="Shift keyboard down an octave">
            Octave −
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setStart((s) => Math.min(72, s + 12))} aria-label="Shift keyboard up an octave">
            Octave +
          </Button>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={showSargam} onChange={(e) => setShowSargam(e.target.checked)} /> Show sargam names (relative to your Sa)
      </label>

      <div className="overflow-x-auto pb-2">
        <div className="relative h-44 select-none" style={{ width: whites.length * 44 }} role="group" aria-label="Piano keys">
          {whites.map((m, i) => (
            <button
              key={m}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                press(m);
              }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), press(m))}
              aria-label={`${midiToNoteName(m).label}${m === sa ? ', your Sa' : ''}, ${midiToFreq(m).toFixed(1)} hertz`}
              className={cx('absolute top-0 flex h-44 w-11 flex-col items-center justify-end rounded-b-lg border border-border pb-2 text-[10px] text-zinc-700 transition-colors', last === m ? 'bg-accent-soft' : 'bg-white hover:bg-zinc-100', m === sa && 'ring-2 ring-inset ring-primary')}
              style={{ left: i * 44 }}
            >
              {showSargam && <span className="font-semibold text-[#7c2d3a]">{swaraLabel(freqToSwara(midiToFreq(m), tonic).token)}</span>}
              <span>{midiToNoteName(m).label}</span>
            </button>
          ))}
          {keys
            .filter((m) => midiToNoteName(m).name.includes('#'))
            .map((m) => {
              const leftWhite = whites.findIndex((w) => w === m - 1);
              return (
                <button
                  key={m}
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    press(m);
                  }}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), press(m))}
                  aria-label={`${midiToNoteName(m).label}${m === sa ? ', your Sa' : ''}, ${midiToFreq(m).toFixed(1)} hertz`}
                  className={cx('absolute top-0 z-10 flex h-28 w-7 flex-col items-center justify-end rounded-b-md pb-1 text-[9px] text-white', last === m ? 'bg-primary' : 'bg-zinc-800 hover:bg-zinc-700', m === sa && 'ring-2 ring-primary')}
                  style={{ left: leftWhite * 44 + 30 }}
                >
                  {showSargam && <span>{swaraLabel(freqToSwara(midiToFreq(m), tonic).token)}</span>}
                </button>
              );
            })}
        </div>
      </div>

      {last !== null && (
        <p className="text-sm" aria-live="polite">
          Played <strong>{midiToNoteName(last).label}</strong> — {midiToFreq(last).toFixed(2)} Hz — which is <strong>{swaraLabel(freqToSwara(midiToFreq(last), tonic).token)}</strong> when Sa = {midiToNoteName(sa).label}.
        </p>
      )}

      <div className="rounded-2xl border border-border p-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={compare} onChange={(e) => (setCompare(e.target.checked), !e.target.checked && mic.stop())} /> Compare with my voice
        </label>
        {compare && (
          <div className="mt-3 space-y-3">
            <MicPanel mic={mic} purpose="show which key your voice is closest to" />
            {mic.state === 'on' && (
              <p className="text-sm" aria-live="polite">
                {voice ? (
                  <>
                    Your voice: <strong>{voice.label}</strong> ({mic.frame!.freq!.toFixed(1)} Hz, {voice.cents > 0 ? '+' : ''}
                    {Math.round(voice.cents)} cents){last !== null && ` — ${voice.midi === last ? 'same key as the last one you played ✓' : `${Math.abs(voice.midi - last)} semitone(s) ${voice.midi > last ? 'above' : 'below'} the last key`}`}
                  </>
                ) : (
                  'Sing or hum a note…'
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
