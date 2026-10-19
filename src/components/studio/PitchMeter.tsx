import { useEffect, useRef } from 'react';
import type { PitchFrame } from '../../audio/pitchAnalysis';
import { centsBetween } from '../../music/theory';
import { cx } from '../ui';

/** Needle meter: −100…+100 cents relative to the target. */
export function CentsMeter({ cents, tolerance = 50 }: { cents: number | null; tolerance?: number }) {
  const clamped = cents === null ? 0 : Math.max(-100, Math.min(100, cents));
  const inTol = cents !== null && Math.abs(cents) <= tolerance;
  const label = cents === null ? 'No voice detected' : `${Math.round(cents)} cents ${cents < 0 ? 'flat' : cents > 0 ? 'sharp' : ''}`;
  return (
    <div className="w-full" role="meter" aria-valuemin={-100} aria-valuemax={100} aria-valuenow={cents === null ? undefined : Math.round(cents)} aria-label="Pitch deviation from target" aria-valuetext={label}>
      <div className="relative h-10 rounded-xl bg-surface-2">
        <div className="absolute inset-y-0 rounded-xl bg-success-soft" style={{ left: `${50 - tolerance / 2}%`, right: `${50 - tolerance / 2}%` }} />
        <div className="absolute inset-y-1 left-1/2 w-px bg-success" />
        {cents !== null && (
          <div className={cx('absolute inset-y-0 w-1.5 -translate-x-1/2 rounded-full transition-[left] duration-75', inTol ? 'bg-success' : 'bg-danger')} style={{ left: `${50 + clamped / 2}%` }} />
        )}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted">
        <span>−100 (flat)</span>
        <span>on target</span>
        <span>+100 (sharp)</span>
      </div>
    </div>
  );
}

/** Scrolling pitch trace (last ~8 s) vs the target line. */
export function PitchTrace({ frames, targetFreq, height = 140 }: { frames: PitchFrame[]; targetFreq: number | null; height?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    c.width = w * dpr;
    c.height = height * dpr;
    const g = c.getContext('2d');
    if (!g) return;
    g.scale(dpr, dpr);
    const css = getComputedStyle(document.documentElement);
    g.clearRect(0, 0, w, height);
    const range = 400; // ±400 cents visible
    const y = (cents: number) => height / 2 - (cents / range) * (height / 2);
    // semitone grid
    g.strokeStyle = css.getPropertyValue('--border');
    g.lineWidth = 1;
    for (let s = -3; s <= 3; s++) {
      g.beginPath();
      g.moveTo(0, y(s * 100));
      g.lineTo(w, y(s * 100));
      g.stroke();
    }
    g.strokeStyle = css.getPropertyValue('--success');
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(0, height / 2);
    g.lineTo(w, height / 2);
    g.stroke();
    if (!targetFreq || frames.length === 0) return;
    const tEnd = frames[frames.length - 1].t;
    const span = 8;
    g.fillStyle = css.getPropertyValue('--primary');
    for (const f of frames) {
      if (f.status !== 'voiced' || !f.freq) continue;
      let cents = centsBetween(f.freq, targetFreq);
      cents -= Math.round(cents / 1200) * 1200; // fold octaves for display
      const x = w - ((tEnd - f.t) / span) * w;
      if (x < 0) continue;
      g.beginPath();
      g.arc(x, Math.max(2, Math.min(height - 2, y(cents))), 2.5, 0, Math.PI * 2);
      g.fill();
    }
  }, [frames, targetFreq, height]);
  return <canvas ref={ref} className="w-full rounded-xl bg-surface-2/60" style={{ height }} role="img" aria-label="Pitch trace over the last 8 seconds. The green line is the target note; dots are your detected pitch." />;
}
