/**
 * Karplus–Strong plucked-string synthesis with an allpass fractional delay
 * (Jaffe & Smith 1983) so the string is accurately in tune, plus a gentle
 * "jawari" brightness (a soft nonlinearity inside the loop that keeps
 * regenerating upper harmonics, like the tanpura's curved bridge).
 * Pure function: returns mono samples, unit-tested for tuning.
 */
export function renderPluck(freq: number, sampleRate: number, seconds: number, opts: { decay?: number; jawari?: number; seed?: number } = {}): Float32Array<ArrayBuffer> {
  const { jawari = 0.35 } = opts;
  // Per-period loss so every string rings ~60 dB down at about 90% of `seconds`, whatever its pitch.
  const decay = opts.decay ?? Math.min(0.99995, Math.pow(10, -3 / (seconds * 0.9 * freq)));
  let seed = opts.seed ?? 1;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  const P = sampleRate / freq; // desired period in samples
  // two-point average adds 0.5 sample of delay
  const N = Math.max(2, Math.floor(P - 0.5 - 0.1));
  const frac = P - 0.5 - N;
  const C = (1 - frac) / (1 + frac); // allpass coefficient for fractional delay
  const len = Math.round(seconds * sampleRate);
  const out = new Float32Array(len);
  const line = new Float32Array(N);
  // excitation: filtered noise burst (softer pluck = fewer highs)
  let lp = 0;
  let pk = 0;
  for (let i = 0; i < N; i++) {
    lp = 0.6 * lp + 0.4 * rand();
    line[i] = lp;
    pk = Math.max(pk, Math.abs(lp));
  }
  for (let i = 0; i < N; i++) line[i] /= pk || 1;
  let idx = 0;
  let prev = 0;
  let apX = 0;
  let apY = 0;
  for (let n = 0; n < len; n++) {
    const cur = line[idx];
    let v = 0.5 * (cur + prev) * decay;
    prev = cur;
    // allpass fractional delay
    const y = C * v + apX - C * apY;
    apX = v;
    apY = y;
    line[idx] = y;
    idx = (idx + 1) % N;
    out[n] = cur;
  }
  // jawari buzz (outside the loop so tuning stays exact): a level-dependent soft
  // nonlinearity adds bright upper partials that bloom with the pluck and fade with it.
  if (jawari > 0) {
    let env = 0;
    for (let i = 0; i < len; i++) {
      env = Math.max(Math.abs(out[i]), env * 0.9995);
      const x = out[i] / (env || 1);
      out[i] += jawari * env * (x * Math.abs(x) - 0.3 * x * x * x);
    }
  }
  // remove DC, normalise
  let mean = 0;
  for (let i = 0; i < len; i++) mean += out[i];
  mean /= len;
  let peak = 0;
  for (let i = 0; i < len; i++) {
    out[i] -= mean;
    peak = Math.max(peak, Math.abs(out[i]));
  }
  if (peak > 0) for (let i = 0; i < len; i++) out[i] /= peak;
  return out;
}
