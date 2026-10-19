import { useEffect, useRef } from 'react';
import type { TrackPoint } from '../../music/melody';
import { semitonesToToken } from '../../music/melody';
import { swaraLabel } from '../../music/theory';

/** A target note of a timed pattern: drawn as a band ±tolerance around the exact swara. */
export interface TargetBand {
  start: number;
  dur: number;
  semis: number;
}

/**
 * Pitch over time on sargam lines (relative to the learner's Sa).
 * - `bands`: target notes of a pattern (accent bands); your dots turn green
 *   inside a band and red outside it.
 * - `reference`: another singer's pitch track (accent dots), e.g. a teacher.
 * - `mine`: the learner's pitch track (primary dots).
 */
export function PitchCompareChart({ bands = [], reference = [], mine, duration, cursor = null, tolerance = 50, height = 240, label }: { bands?: TargetBand[]; reference?: TrackPoint[]; mine: TrackPoint[]; duration: number; cursor?: number | null; tolerance?: number; height?: number; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const g = c.getContext('2d');
    if (!g) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    c.width = w * dpr;
    c.height = height * dpr;
    g.scale(dpr, dpr);
    g.clearRect(0, 0, w, height);
    const css = getComputedStyle(document.documentElement);
    const col = (n: string) => css.getPropertyValue(n).trim();

    const bandAt = (t: number) => bands.find((b) => t >= b.start && t < b.start + b.dur);
    // Fold my dots onto the band's octave, so singing an octave lower still lines up.
    const fold = (p: TrackPoint) => {
      const b = bandAt(p.t);
      return b ? p.semis - Math.round((p.semis - b.semis) / 12) * 12 : p.semis;
    };
    const ys = [...bands.map((b) => b.semis), ...reference.map((p) => p.semis), ...mine.map(fold)];
    let lo = Math.floor(Math.min(0, ...ys)) - 2;
    let hi = Math.ceil(Math.max(12, ...ys)) + 2;
    lo = Math.max(lo, -24);
    hi = Math.min(hi, 36);
    const left = 40;
    const y = (s: number) => height - 10 - ((s - lo) / (hi - lo)) * (height - 20);
    const x = (t: number) => left + (t / Math.max(0.5, duration)) * (w - left - 6);

    g.font = '10px Inter, sans-serif';
    for (let s = lo; s <= hi; s++) {
      const pc = ((s % 12) + 12) % 12;
      if (![0, 2, 4, 5, 7, 9, 11].includes(pc)) continue;
      g.strokeStyle = pc === 0 ? col('--success') : col('--border');
      g.lineWidth = pc === 0 ? 1.5 : 1;
      g.beginPath();
      g.moveTo(left, y(s));
      g.lineTo(w, y(s));
      g.stroke();
      g.fillStyle = col('--muted');
      g.fillText(swaraLabel(semitonesToToken(s)), 2, y(s) + 3);
    }

    const tol = tolerance / 100;
    g.fillStyle = col('--accent');
    g.globalAlpha = 0.3;
    for (const b of bands) g.fillRect(x(b.start), y(b.semis + tol), Math.max(2, x(b.start + b.dur) - x(b.start) - 2), y(b.semis - tol) - y(b.semis + tol));
    g.globalAlpha = 1;
    g.strokeStyle = col('--accent');
    g.lineWidth = 2;
    for (const b of bands) {
      g.beginPath();
      g.moveTo(x(b.start), y(b.semis));
      g.lineTo(x(b.start + b.dur) - 2, y(b.semis));
      g.stroke();
    }

    g.fillStyle = col('--accent');
    for (const p of reference) {
      g.beginPath();
      g.arc(x(p.t), y(p.semis), 1.8, 0, Math.PI * 2);
      g.fill();
    }

    for (const p of mine) {
      const s = fold(p);
      const b = bandAt(p.t);
      g.fillStyle = !b ? col('--primary') : Math.abs(s - b.semis) <= tol ? col('--success') : col('--danger');
      g.beginPath();
      g.arc(x(p.t), y(s), 2.4, 0, Math.PI * 2);
      g.fill();
    }

    if (cursor !== null) {
      g.strokeStyle = col('--text');
      g.globalAlpha = 0.4;
      g.beginPath();
      g.moveTo(x(cursor), 0);
      g.lineTo(x(cursor), height);
      g.stroke();
      g.globalAlpha = 1;
    }
  }, [bands, reference, mine, duration, cursor, tolerance, height]);

  return <canvas ref={ref} className="w-full rounded-xl bg-surface-2/60" style={{ height }} role="img" aria-label={label} />;
}
