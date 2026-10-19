/**
 * YIN fundamental-frequency estimator.
 *
 * Reference: de Cheveigné & Kawahara (2002), "YIN, a fundamental frequency
 * estimator for speech and music", JASA 111(4). Steps implemented:
 *   1. difference function d(τ)
 *   2. cumulative mean normalized difference d'(τ)
 *   3. absolute threshold — first τ where d'(τ) < threshold, then walk to the local minimum
 *   4. parabolic interpolation around the chosen τ
 * The returned `confidence` is 1 − d'(τ): close to 1 for clean periodic
 * (voiced) input, low for noise. Callers should treat low-confidence frames
 * as unvoiced and ignore them rather than scoring them.
 */
export interface YinOptions {
  sampleRate: number;
  /** YIN absolute threshold; 0.10–0.20 is typical. Lower = stricter. */
  threshold?: number;
  /** Lowest frequency to search (Hz). Human singing fundamental rarely < 60 Hz. */
  minFreq?: number;
  /** Highest frequency to search (Hz). */
  maxFreq?: number;
}

export interface PitchEstimate {
  freq: number;
  confidence: number;
}

export function yin(buffer: Float32Array, opts: YinOptions): PitchEstimate | null {
  const { sampleRate, threshold = 0.15, minFreq = 60, maxFreq = 1400 } = opts;
  const tauMin = Math.max(2, Math.floor(sampleRate / maxFreq));
  const tauMax = Math.min(Math.floor(sampleRate / minFreq), Math.floor(buffer.length / 2));
  if (tauMax <= tauMin + 2) return null;

  const W = buffer.length - tauMax;
  const diff = new Float32Array(tauMax + 1);
  for (let tau = 1; tau <= tauMax; tau++) {
    let sum = 0;
    for (let i = 0; i < W; i++) {
      const delta = buffer[i] - buffer[i + tau];
      sum += delta * delta;
    }
    diff[tau] = sum;
  }

  const cmnd = new Float32Array(tauMax + 1);
  cmnd[0] = 1;
  let running = 0;
  for (let tau = 1; tau <= tauMax; tau++) {
    running += diff[tau];
    cmnd[tau] = running === 0 ? 1 : (diff[tau] * tau) / running;
  }

  let tauEst = -1;
  for (let tau = tauMin; tau <= tauMax; tau++) {
    if (cmnd[tau] < threshold) {
      while (tau + 1 <= tauMax && cmnd[tau + 1] < cmnd[tau]) tau++;
      tauEst = tau;
      break;
    }
  }
  if (tauEst === -1) {
    // No dip under threshold: take the global minimum but report its (low) confidence.
    let best = tauMin;
    for (let tau = tauMin + 1; tau <= tauMax; tau++) if (cmnd[tau] < cmnd[best]) best = tau;
    tauEst = best;
  }

  let betterTau = tauEst;
  if (tauEst > 1 && tauEst < tauMax) {
    const s0 = cmnd[tauEst - 1];
    const s1 = cmnd[tauEst];
    const s2 = cmnd[tauEst + 1];
    const denom = 2 * (2 * s1 - s2 - s0);
    if (denom !== 0) betterTau = tauEst + (s2 - s0) / denom;
  }

  const freq = sampleRate / betterTau;
  const confidence = Math.max(0, Math.min(1, 1 - cmnd[tauEst]));
  if (!Number.isFinite(freq) || freq < minFreq * 0.9 || freq > maxFreq * 1.1) return null;
  return { freq, confidence };
}

export function rms(buffer: Float32Array): number {
  let s = 0;
  for (let i = 0; i < buffer.length; i++) s += buffer[i] * buffer[i];
  return Math.sqrt(s / buffer.length);
}
