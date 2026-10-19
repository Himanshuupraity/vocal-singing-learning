/** Single shared AudioContext, created lazily on a user gesture (browser autoplay policy). */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;

export class AudioUnsupportedError extends Error {
  constructor() {
    super('This browser does not support the Web Audio API. Please use a recent Chrome, Edge, Firefox or Safari.');
  }
}

export function isAudioSupported(): boolean {
  return typeof window !== 'undefined' && !!(window.AudioContext || (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext);
}

export function getAudioContext(): AudioContext {
  if (!isAudioSupported()) throw new AudioUnsupportedError();
  if (!ctx || ctx.state === 'closed') {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor({ latencyHint: 'interactive' });
    master = ctx.createGain();
    master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -12;
    comp.ratio.value = 4;
    master.connect(comp).connect(ctx.destination);
  }
  return ctx;
}

/** Resume (needed after the page was backgrounded or on iOS). Call from a click handler. */
export async function ensureRunning(): Promise<AudioContext> {
  const c = getAudioContext();
  if (c.state === 'suspended') await c.resume();
  return c;
}

export function getMaster(): GainNode {
  getAudioContext();
  return master!;
}
