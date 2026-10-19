import { analyzeSamples, type RecordingAnalysis } from '../audio/offlineAnalysis';
import { encodeWav, resample, toBase64 } from '../audio/wav';
import { currentLevel } from './progress';
import { swaraLabel, tonicLabel } from '../music/theory';
import type { AppData } from '../storage/schema';

/**
 * The body for the AI voice endpoints (/api/tutor/voice and /api/tutor/coach):
 * the clip as 16 kHz WAV (at most `maxSec`) plus the app's own pitch
 * measurements of it, which the AI is told to trust over its ear.
 */
export function voicePayload(samples: Float32Array, sampleRate: number, data: AppData, meta: { label?: string; exercise?: string; maxSec: number }): { analysis: RecordingAnalysis; body: Record<string, unknown> } {
  const a = analyzeSamples(samples, sampleRate, data.profile.tonic);
  return {
    analysis: a,
    body: {
      audio: toBase64(encodeWav(resample(samples, sampleRate, undefined, meta.maxSec))),
      mimeType: 'audio/wav',
      language: data.profile.language,
      exercise: meta.exercise ?? '',
      label: meta.label ?? '',
      level: currentLevel(data),
      tonic: tonicLabel(data.profile.tonic),
      measured: {
        durationSec: Math.min(a.durationSec, 600),
        voicedSec: Math.min(a.voicedSec, 600),
        lowest: a.lowestToken ? swaraLabel(a.lowestToken) : null,
        highest: a.highestToken ? swaraLabel(a.highestToken) : null,
        steadinessCents: a.steadinessCents,
        swaras: a.swaras.slice(0, 12).map((s) => ({ label: s.label, sec: Math.round(s.sec * 10) / 10, avgCents: s.avgCents })),
      },
    },
  };
}
