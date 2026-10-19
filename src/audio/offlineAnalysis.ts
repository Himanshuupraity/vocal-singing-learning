import { analyzeFrame, median, OctaveSmoother, type PitchFrame } from './pitchAnalysis';
import { freqToSwara, swaraLabel, type Tonic } from '../music/theory';

export interface RecordingAnalysis {
  durationSec: number;
  frames: PitchFrame[];
  voicedSec: number;
  /** most-sung swaras with time share and average tuning */
  swaras: { token: string; label: string; sec: number; avgCents: number }[];
  /** typical wobble while holding a note (median |Δcents| between consecutive frames of the same swara) */
  steadinessCents: number | null;
  lowestToken: string | null;
  highestToken: string | null;
}

/** Runs the same YIN analysis used live over a whole recording (mono samples). */
export function analyzeSamples(samples: Float32Array, sampleRate: number, tonic: Tonic, hopSec = 0.05, win = 2048): RecordingAnalysis {
  const hop = Math.max(1, Math.round(hopSec * sampleRate));
  const frames: PitchFrame[] = [];
  const sm = new OctaveSmoother();
  for (let start = 0; start + win <= samples.length; start += hop) {
    const f = analyzeFrame(samples.subarray(start, start + win), sampleRate, start / sampleRate);
    if (f.status === 'voiced' && f.freq) f.freq = sm.push(f.freq);
    else if (f.status === 'silent') sm.reset();
    frames.push(f);
  }
  const voiced = frames.filter((f) => f.status === 'voiced' && f.freq);
  const by = new Map<string, { n: number; cents: number[] }>();
  const deltas: number[] = [];
  let prev: { token: string; cents: number } | null = null;
  let lowest: { token: string; semis: number } | null = null;
  let highest: { token: string; semis: number } | null = null;
  for (const f of frames) {
    if (f.status !== 'voiced' || !f.freq) {
      prev = null;
      continue;
    }
    const { token, cents } = freqToSwara(f.freq, tonic);
    const e = by.get(token) ?? { n: 0, cents: [] };
    e.n++;
    e.cents.push(cents);
    by.set(token, e);
    if (prev && prev.token === token) deltas.push(Math.abs(cents - prev.cents));
    prev = { token, cents };
    const semis = 12 * Math.log2(f.freq);
    if (!lowest || semis < lowest.semis) lowest = { token, semis };
    if (!highest || semis > highest.semis) highest = { token, semis };
  }
  // Ignore swaras touched only briefly (< 0.25 s) — usually transitions.
  const swaras = [...by.entries()]
    .map(([token, e]) => ({ token, label: swaraLabel(token), sec: e.n * hopSec, avgCents: Math.round(median(e.cents)) }))
    .filter((s) => s.sec >= 0.25)
    .sort((a, b) => b.sec - a.sec);
  return {
    durationSec: samples.length / sampleRate,
    frames,
    voicedSec: voiced.length * hopSec,
    swaras,
    steadinessCents: deltas.length >= 10 ? Math.round(median(deltas) * 10) / 10 : null,
    lowestToken: lowest?.token ?? null,
    highestToken: highest?.token ?? null,
  };
}

/** Decodes an audio Blob (webm/mp4/ogg) and returns mono samples. */
export async function decodeToMono(blob: Blob): Promise<{ samples: Float32Array; sampleRate: number }> {
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctor();
  try {
    const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
    const out = new Float32Array(buf.length);
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const ch = buf.getChannelData(c);
      for (let i = 0; i < ch.length; i++) out[i] += ch[i] / buf.numberOfChannels;
    }
    return { samples: out, sampleRate: buf.sampleRate };
  } finally {
    void ctx.close();
  }
}
