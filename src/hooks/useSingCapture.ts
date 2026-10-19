import { useEffect, useRef, useState } from 'react';
import type { useMicPitch } from './useMicPitch';
import { relSemitones, type TrackPoint } from '../music/melody';
import type { Tonic } from '../music/theory';

/** Voiced frames in a row (~0.25 s) before an attempt counts as started. */
const START_FRAMES = 5;

/**
 * Records one sung attempt as a pitch track (semitones above Sa). Recording
 * waits for the voice, then stops by itself once the singer has been quiet for
 * `silenceSec` (after at least `minSec` of singing), or after `maxSec`.
 */
export function useSingCapture(mic: ReturnType<typeof useMicPitch>, tonic: Tonic, opts: { maxSec: number; minSec?: number; silenceSec?: number; onDone: (points: TrackPoint[]) => void }) {
  const [state, setState] = useState<'idle' | 'waiting' | 'singing'>('idle');
  const [points, setPoints] = useState<TrackPoint[]>([]);
  const pts = useRef<TrackPoint[]>([]);
  const st = useRef<'idle' | 'waiting' | 'singing'>('idle');
  const lastVoice = useRef(0);
  const o = useRef(opts);
  o.current = opts;

  const finish = () => {
    if (st.current === 'idle') return;
    st.current = 'idle';
    setState('idle');
    o.current.onDone(pts.current);
  };

  useEffect(
    () =>
      mic.subscribe((f) => {
        if (st.current === 'idle') return;
        const voiced = f.status === 'voiced' && !!f.freq;
        if (st.current === 'waiting') {
          // Start only once the voice has lasted a moment, so a click or cough doesn't count as singing.
          if (!voiced) {
            pts.current = [];
            return;
          }
          pts.current.push({ t: f.t, semis: relSemitones(f.freq!, tonic) });
          if (pts.current.length < START_FRAMES) return;
          st.current = 'singing';
          setState('singing');
          lastVoice.current = f.t;
          setPoints([...pts.current]);
          return;
        }
        if (voiced) {
          lastVoice.current = f.t;
          pts.current.push({ t: f.t, semis: relSemitones(f.freq!, tonic) });
          setPoints([...pts.current]);
        }
        const sung = pts.current.length ? f.t - pts.current[0].t : 0;
        if (sung >= o.current.maxSec || (sung >= (o.current.minSec ?? 1) && f.t - lastVoice.current >= (o.current.silenceSec ?? 0.7))) finish();
      }),
    [mic, tonic],
  );

  const start = async () => {
    if (mic.state !== 'on') await mic.start();
    pts.current = [];
    setPoints([]);
    st.current = 'waiting';
    setState('waiting');
  };
  const t0 = points[0]?.t ?? 0;
  return { state, start, stop: finish, points: points.map((p) => ({ ...p, t: p.t - t0 })) };
}
