/**
 * Audio-thread capture. Timers (setInterval) are throttled to ~1/s in
 * background tabs, which would break pitch tracking when a learner switches
 * to a YouTube tab to sing along. An AudioWorklet runs on the audio thread
 * and posts sample blocks to the main thread, so capture keeps going.
 * Falls back to timer polling where AudioWorklet isn't available.
 */
const WORKLET = `
class SurCapture extends AudioWorkletProcessor {
  constructor(opts) {
    super();
    this.size = opts.processorOptions.size;
    this.hop = opts.processorOptions.hop;
    this.buf = new Float32Array(this.size);
    this.filled = 0;
    this.sinceHop = 0;
  }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch) {
      const n = ch.length;
      if (this.filled + n <= this.size) { this.buf.set(ch, this.filled); this.filled += n; }
      else { this.buf.copyWithin(0, n); this.buf.set(ch, this.size - n); this.filled = this.size; }
      this.sinceHop += n;
      if (this.filled === this.size && this.sinceHop >= this.hop) {
        this.sinceHop = 0;
        this.port.postMessage(this.buf.slice());
      }
    }
    return true;
  }
}
registerProcessor('sur-capture', SurCapture);
`;

const loaded = new WeakMap<BaseAudioContext, Promise<boolean>>();

function ensureWorklet(ctx: AudioContext): Promise<boolean> {
  let p = loaded.get(ctx);
  if (!p) {
    p = (async () => {
      if (!ctx.audioWorklet || typeof AudioWorkletNode === 'undefined') return false;
      const url = URL.createObjectURL(new Blob([WORKLET], { type: 'application/javascript' }));
      try {
        await ctx.audioWorklet.addModule(url);
        return true;
      } catch {
        return false;
      } finally {
        URL.revokeObjectURL(url);
      }
    })();
    loaded.set(ctx, p);
  }
  return p;
}

/**
 * Calls onFrame(samples) with the latest `size` samples roughly every `hopMs`.
 * Returns a stop function.
 */
export async function captureFrames(ctx: AudioContext, source: AudioNode, size: number, hopMs: number, onFrame: (buf: Float32Array) => void): Promise<() => void> {
  if (await ensureWorklet(ctx)) {
    const node = new AudioWorkletNode(ctx, 'sur-capture', { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 1, processorOptions: { size, hop: Math.max(128, Math.round((hopMs / 1000) * ctx.sampleRate)) } });
    node.port.onmessage = (e: MessageEvent<Float32Array>) => onFrame(e.data);
    // Route through a muted gain so the graph keeps pulling audio without playing the mic.
    const mute = ctx.createGain();
    mute.gain.value = 0;
    source.connect(node).connect(mute).connect(ctx.destination);
    return () => {
      node.port.onmessage = null;
      try {
        source.disconnect(node);
      } catch {
        /* already disconnected */
      }
      node.disconnect();
      mute.disconnect();
    };
  }
  // Fallback: timer polling (may slow down in background tabs).
  const an = ctx.createAnalyser();
  an.fftSize = size;
  an.smoothingTimeConstant = 0;
  source.connect(an);
  const buf = new Float32Array(size);
  const iv = window.setInterval(() => {
    an.getFloatTimeDomainData(buf);
    onFrame(buf.slice());
  }, hopMs);
  return () => {
    clearInterval(iv);
    try {
      source.disconnect(an);
    } catch {
      /* noop */
    }
  };
}
