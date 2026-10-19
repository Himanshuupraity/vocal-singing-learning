import { ensureRunning } from './context';
import { playFreq, type Timbre } from './synth';
import { midiToFreq, swaraToMidi, type SwaraToken, type Tonic } from '../music/theory';

export interface SequenceHandle {
  stop: () => void;
  done: Promise<void>;
}

/**
 * Plays a sargam sequence with sample-accurate timing.
 * onNote(index) fires (approximately) as each note sounds, for UI highlighting.
 */
export async function playSequence(
  notes: SwaraToken[],
  tonic: Tonic,
  bpm: number,
  opts: { onNote?: (i: number) => void; timbre?: Timbre; legato?: number; loop?: boolean } = {},
): Promise<SequenceHandle> {
  const ctx = await ensureRunning();
  const beat = 60 / bpm;
  const legato = opts.legato ?? 0.92;
  let stopped = false;
  const stops: (() => void)[] = [];
  const timers: number[] = [];
  let resolveDone!: () => void;
  const done = new Promise<void>((r) => (resolveDone = r));

  const scheduleCycle = (start: number) => {
    notes.forEach((tok, i) => {
      const when = start + i * beat;
      const midi = swaraToMidi(tok, tonic);
      if (midi !== null) stops.push(playFreq(midiToFreq(midi), { when, duration: beat * legato, timbre: opts.timbre }));
      timers.push(window.setTimeout(() => !stopped && opts.onNote?.(i), Math.max(0, (when - ctx.currentTime) * 1000)));
    });
    const end = start + notes.length * beat;
    timers.push(
      window.setTimeout(() => {
        if (stopped) return;
        if (opts.loop) scheduleCycle(end);
        else {
          opts.onNote?.(-1);
          resolveDone();
        }
      }, Math.max(0, (end - ctx.currentTime - (opts.loop ? 0.2 : 0)) * 1000)),
    );
  };
  scheduleCycle(ctx.currentTime + 0.08);

  return {
    stop: () => {
      stopped = true;
      timers.forEach(clearTimeout);
      stops.forEach((s) => s());
      opts.onNote?.(-1);
      resolveDone();
    },
    done,
  };
}
