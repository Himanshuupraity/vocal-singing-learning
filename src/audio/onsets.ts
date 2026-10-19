import { ensureRunning } from './context';
import { openMic } from './mic';
import { captureFrames } from './capture';

/**
 * Note-onset detection from loudness: an onset is when the level rises above
 * `on` after having been below `off` (hysteresis), with a refractory gap so
 * one sung syllable counts once. Pure function — unit tested.
 */
export function detectOnsets(levels: { t: number; rms: number }[], opts: { on?: number; off?: number; minGapMs?: number } = {}): number[] {
  const { on = 0.04, off = 0.02, minGapMs = 180 } = opts;
  const out: number[] = [];
  let armed = true;
  for (const { t, rms } of levels) {
    if (armed && rms >= on && (!out.length || t - out[out.length - 1] >= minGapMs)) {
      out.push(t);
      armed = false;
    } else if (!armed && rms < off) armed = true;
  }
  return out;
}

/** Polls mic loudness every ~10 ms; returns samples with performance.now() timestamps. */
export async function startLevelMeter(deviceId?: string) {
  const ctx = await ensureRunning();
  const stream = await openMic(deviceId);
  const src = ctx.createMediaStreamSource(stream);
  const levels: { t: number; rms: number }[] = [];
  // 512-sample window every ~10 ms, captured on the audio thread.
  const stopCapture = await captureFrames(ctx, src, 512, 10, (buf) => {
    let s = 0;
    for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
    levels.push({ t: performance.now(), rms: Math.sqrt(s / buf.length) });
  });
  return {
    levels,
    stop: () => {
      stopCapture();
      src.disconnect();
      stream.getTracks().forEach((t) => t.stop());
    },
  };
}

/** Matches onsets to the nearest beat (within half a beat); returns signed offsets in ms. */
export function offsetsToBeats(onsets: number[], beats: number[], beatMs: number): number[] {
  const out: number[] = [];
  const used = new Set<number>();
  for (const o of onsets) {
    let best = -1;
    for (let i = 0; i < beats.length; i++) if (!used.has(i) && (best < 0 || Math.abs(o - beats[i]) < Math.abs(o - beats[best]))) best = i;
    if (best >= 0 && Math.abs(o - beats[best]) < beatMs / 2) {
      used.add(best);
      out.push(o - beats[best]);
    }
  }
  return out;
}
