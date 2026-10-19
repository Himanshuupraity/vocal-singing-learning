import type { AttemptResult } from '../audio/pitchAnalysis';
import { tonicLabel, type SwaraToken, type Tonic } from '../music/theory';
import type { AppData } from '../storage/schema';
import { uid } from './dates';

export function pitchRecord(r: AttemptResult, target: SwaraToken, tonic: Tonic, context: string) {
  return {
    id: uid(),
    at: new Date().toISOString(),
    context,
    target,
    tonic: tonicLabel(tonic),
    targetFreq: r.targetFreq,
    medianCents: Number.isFinite(r.medianCents) ? Math.round(r.medianCents * 10) / 10 : 0,
    withinPct: r.withinPct,
    stabilityCents: Number.isFinite(r.stabilityCents) ? Math.round(r.stabilityCents) : 0,
    octaveOffset: r.octaveOffset,
    tolerance: r.tolerance,
    matched: r.matched,
    reliable: r.reliable,
  } satisfies AppData['pitchAttempts'][number];
}
