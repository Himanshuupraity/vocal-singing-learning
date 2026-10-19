import { getAudioContext, getMaster, ensureRunning } from './context';
import { midiToFreq, swaraToMidi, type SwaraToken, type Tonic } from '../music/theory';

const waveCache = new WeakMap<AudioContext, Record<string, PeriodicWave>>();

/** Harmonic recipes. "reed" is a soft harmonium-like timbre; "pure" is close to a sine (easiest to pitch-match). */
const RECIPES: Record<string, number[]> = {
  reed: [1, 0.55, 0.42, 0.3, 0.22, 0.16, 0.11, 0.08, 0.05, 0.03],
  pure: [1, 0.15, 0.05],
  string: [1, 0.7, 0.55, 0.5, 0.42, 0.36, 0.3, 0.26, 0.22, 0.18, 0.15, 0.12, 0.1, 0.08, 0.06, 0.05],
};

/** 'voice' = formant-synthesized “aa” vowel (synthesized, not a recording of a singer). */
export type Timbre = keyof typeof RECIPES | 'voice';

export function periodicWave(ctx: AudioContext, timbre: keyof typeof RECIPES): PeriodicWave {
  let cache = waveCache.get(ctx);
  if (!cache) waveCache.set(ctx, (cache = {}));
  if (!cache[timbre]) {
    const h = RECIPES[timbre];
    const real = new Float32Array(h.length + 1);
    const imag = new Float32Array(h.length + 1);
    h.forEach((a, i) => (imag[i + 1] = a));
    cache[timbre] = ctx.createPeriodicWave(real, imag);
  }
  return cache[timbre];
}

export interface NoteOptions {
  when?: number;
  duration: number;
  volume?: number;
  timbre?: Timbre;
  destination?: AudioNode;
}

/** Plays one note; returns a stop function. Times are AudioContext seconds. */
/** Formants of an open “aa” vowel (approximate averages for adult singers). */
const AA_FORMANTS: [number, number, number][] = [
  [730, 8, 1],
  [1090, 10, 0.5],
  [2440, 14, 0.22],
];

function playVoice(ctx: AudioContext, freq: number, when: number, duration: number, volume: number, destination: AudioNode): () => void {
  const osc = ctx.createOscillator();
  osc.setPeriodicWave(periodicWave(ctx, 'string'));
  osc.frequency.setValueAtTime(freq, when);
  // natural vibrato that starts after the note settles (~5.5 Hz, ±12 cents)
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 5.5;
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(0, when);
  lfoGain.gain.linearRampToValueAtTime(0, when + Math.min(0.5, duration * 0.4));
  lfoGain.gain.linearRampToValueAtTime(12, when + Math.min(0.9, duration * 0.7));
  lfo.connect(lfoGain).connect(osc.detune);
  const out = ctx.createGain();
  const attack = 0.06;
  const release = Math.min(0.2, duration * 0.3);
  out.gain.setValueAtTime(0.0001, when);
  out.gain.exponentialRampToValueAtTime(volume, when + attack);
  out.gain.setValueAtTime(volume, Math.max(when + attack, when + duration - release));
  out.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  for (const [f, q, gain] of AA_FORMANTS) {
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = f;
    bp.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = gain * 2.2;
    osc.connect(bp).connect(g).connect(out);
  }
  const body = ctx.createGain();
  body.gain.value = 0.25;
  osc.connect(body).connect(out);
  out.connect(destination);
  osc.start(when);
  lfo.start(when);
  osc.stop(when + duration + 0.05);
  lfo.stop(when + duration + 0.05);
  return () => {
    try {
      const now = ctx.currentTime;
      out.gain.cancelScheduledValues(now);
      out.gain.setValueAtTime(out.gain.value, now);
      out.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.stop(now + 0.06);
      lfo.stop(now + 0.06);
    } catch {
      /* already stopped */
    }
  };
}

export function playFreq(freq: number, opts: NoteOptions): () => void {
  const ctx = getAudioContext();
  const { when = ctx.currentTime, duration, volume = 0.35, timbre = 'reed', destination = getMaster() } = opts;
  if (timbre === 'voice') return playVoice(ctx, freq, when, duration, volume, destination);
  const osc = ctx.createOscillator();
  osc.setPeriodicWave(periodicWave(ctx, timbre));
  osc.frequency.setValueAtTime(freq, when);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = Math.min(6000, freq * 8);
  const g = ctx.createGain();
  const attack = 0.03;
  const release = Math.min(0.15, duration * 0.3);
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(volume, when + attack);
  g.gain.setValueAtTime(volume, Math.max(when + attack, when + duration - release));
  g.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  osc.connect(lp).connect(g).connect(destination);
  osc.start(when);
  osc.stop(when + duration + 0.05);
  return () => {
    try {
      const now = ctx.currentTime;
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(g.gain.value, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.stop(now + 0.06);
    } catch {
      /* already stopped */
    }
  };
}

export async function playSwara(token: SwaraToken, tonic: Tonic, duration = 1.2, timbre: Timbre = 'reed') {
  await ensureRunning();
  const midi = swaraToMidi(token, tonic);
  if (midi === null) return () => {};
  return playFreq(midiToFreq(midi), { duration, timbre });
}

/** Smooth glide (meend-like) between two swaras. */
export async function playGlide(from: SwaraToken, to: SwaraToken, tonic: Tonic, duration: number) {
  const ctx = await ensureRunning();
  const a = swaraToMidi(from, tonic);
  const b = swaraToMidi(to, tonic);
  if (a === null || b === null) return () => {};
  const now = ctx.currentTime;
  const total = duration + 0.8;
  const osc = ctx.createOscillator();
  osc.setPeriodicWave(periodicWave(ctx, 'reed'));
  osc.frequency.setValueAtTime(midiToFreq(a), now);
  osc.frequency.setValueAtTime(midiToFreq(a), now + 0.4);
  osc.frequency.exponentialRampToValueAtTime(midiToFreq(b), now + 0.4 + duration);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.32, now + 0.04);
  g.gain.setValueAtTime(0.32, now + total - 0.15);
  g.gain.exponentialRampToValueAtTime(0.0001, now + total);
  osc.connect(g).connect(getMaster());
  osc.start(now);
  osc.stop(now + total + 0.05);
  return () => {
    try {
      osc.stop();
    } catch {
      /* noop */
    }
  };
}

/** Plays two notes one after another (for same/different ear training). */
export async function playPair(a: number, b: number, noteDur = 0.9, gap = 0.35) {
  const ctx = await ensureRunning();
  const t = ctx.currentTime + 0.05;
  const s1 = playFreq(a, { when: t, duration: noteDur, timbre: 'pure' });
  const s2 = playFreq(b, { when: t + noteDur + gap, duration: noteDur, timbre: 'pure' });
  return { stop: () => (s1(), s2()), endsAt: t + noteDur * 2 + gap };
}
