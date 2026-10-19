/**
 * Synthesized tabla strokes for playing a taal's theka.
 *
 * HONEST LABEL: this is an approximation built from tuned sine partials and
 * filtered noise, not a recording of a real tabla. It is close enough to hear
 * the theka (which bols have the bass drum, which are open or closed) and to
 * keep laya while singing.
 *
 * - Dayan (right, treble drum) is tuned to Sa, like a real tabla. Its loaded
 *   centre (syahi) makes its overtones nearly harmonic, so open strokes ring
 *   with partials at 1×, 2×, 3×… the tuning note.
 * - Bayan (left, bass drum) gives the low "ge" boom with a slight upward
 *   pitch bend, or the flat closed "ka".
 */

type Stroke = 'na' | 'tin' | 'tu' | 'ti' | 'ge' | 'ka';

/** Which strokes make up each bol. Dha = Na + Ge, Dhin = Tin + Ge, and so on. */
const BOLS: Record<string, Stroke[]> = {
  na: ['na'],
  ta: ['na'],
  tin: ['tin'],
  tu: ['tu'],
  tun: ['tu'],
  ti: ['ti'],
  te: ['ti'],
  ge: ['ge'],
  ghe: ['ge'],
  ka: ['ka'],
  ke: ['ka'],
  dha: ['na', 'ge'],
  dhin: ['tin', 'ge'],
  dhi: ['tin', 'ge'],
};

export function strokesOf(bol: string): Stroke[] {
  return BOLS[bol.trim().toLowerCase()] ?? ['na'];
}

/** The dayan is tuned to Sa, moved into the octave a tabla is usually tuned in (~220–440 Hz). */
export function dayanFreq(saFreq: number): number {
  let f = saFreq;
  while (f < 220) f *= 2;
  while (f >= 440) f /= 2;
  return f;
}

const noiseCache = new WeakMap<BaseAudioContext, AudioBuffer>();
function noise(ctx: BaseAudioContext): AudioBuffer {
  let b = noiseCache.get(ctx);
  if (!b) {
    b = ctx.createBuffer(1, Math.round(ctx.sampleRate * 0.25), ctx.sampleRate);
    const d = b.getChannelData(0);
    let seed = 7;
    for (let i = 0; i < d.length; i++) {
      seed = (seed * 16807) % 2147483647;
      d[i] = (seed / 2147483647) * 2 - 1;
    }
    noiseCache.set(ctx, b);
  }
  return b;
}

function env(ctx: BaseAudioContext, dest: AudioNode, when: number, peak: number, decay: number): GainNode {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), when + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, when + decay);
  g.connect(dest);
  return g;
}

function partial(ctx: BaseAudioContext, dest: AudioNode, when: number, freq: number, peak: number, decay: number) {
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(freq, when);
  o.connect(env(ctx, dest, when, peak, decay));
  o.start(when);
  o.stop(when + decay + 0.02);
}

function burst(ctx: BaseAudioContext, dest: AudioNode, when: number, peak: number, decay: number, type: BiquadFilterType, freq: number) {
  const src = ctx.createBufferSource();
  src.buffer = noise(ctx);
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  src.connect(f).connect(env(ctx, dest, when, peak, decay));
  src.start(when);
  src.stop(when + decay + 0.02);
}

function stroke(ctx: BaseAudioContext, dest: AudioNode, s: Stroke, when: number, f0: number, vol: number) {
  switch (s) {
    case 'na': // open rim stroke: bright, ringing, rich in overtones
      [1, 0.55, 0.4, 0.28, 0.16].forEach((a, i) => partial(ctx, dest, when, f0 * (i + 1), vol * a * 0.5, 0.75 - i * 0.12));
      burst(ctx, dest, when, vol * 0.12, 0.012, 'highpass', 3000);
      break;
    case 'tin': // softer open stroke on the maidan: rings, fewer overtones
      [1, 0.35, 0.18].forEach((a, i) => partial(ctx, dest, when, f0 * (i + 1), vol * a * 0.42, 0.6 - i * 0.15));
      burst(ctx, dest, when, vol * 0.06, 0.01, 'highpass', 2500);
      break;
    case 'tu': // open centre stroke: mostly the fundamental, long ring
      partial(ctx, dest, when, f0, vol * 0.5, 1.1);
      partial(ctx, dest, when, f0 * 2, vol * 0.1, 0.4);
      break;
    case 'ti': // closed stroke: damped click with a hint of pitch
      partial(ctx, dest, when, f0 * 2, vol * 0.18, 0.06);
      burst(ctx, dest, when, vol * 0.3, 0.05, 'bandpass', 2200);
      break;
    case 'ge': {
      // open bass with the characteristic slight upward bend
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(82, when);
      o.frequency.exponentialRampToValueAtTime(104, when + 0.12);
      o.frequency.exponentialRampToValueAtTime(96, when + 0.7);
      o.connect(env(ctx, dest, when, vol * 0.75, 0.8));
      o.start(when);
      o.stop(when + 0.85);
      burst(ctx, dest, when, vol * 0.15, 0.03, 'lowpass', 400);
      break;
    }
    case 'ka': // closed bass slap: short, flat, no ring
      partial(ctx, dest, when, 70, vol * 0.4, 0.07);
      burst(ctx, dest, when, vol * 0.35, 0.05, 'lowpass', 900);
      break;
  }
}

/** Schedules one bol at `when` (AudioContext seconds). */
export function playBol(ctx: BaseAudioContext, dest: AudioNode, bol: string, when: number, saFreq: number, vol = 1) {
  const f0 = dayanFreq(saFreq);
  for (const s of strokesOf(bol)) stroke(ctx, dest, s, when, f0, vol);
}
