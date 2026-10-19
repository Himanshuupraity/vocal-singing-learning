import { useEffect, useRef } from 'react';
import { useAppData } from '../state/AppData';
import { localDate, uid } from '../lib/dates';
import type { PracticeSession } from '../storage/schema';

/**
 * Counts genuinely active time on a practice page (tab visible + interaction
 * or audio within the last 3 minutes) and saves it as a practice session when
 * the page is left. Sessions under one minute are not saved.
 */
export function usePracticeTimer(kind: PracticeSession['kind'], label?: string, enabled = true) {
  const { update } = useAppData();
  const active = useRef(0);
  const lastTick = useRef(performance.now());
  const lastInteraction = useRef(performance.now());
  const startedAt = useRef(new Date().toISOString());

  useEffect(() => {
    if (!enabled) return;
    const touch = () => (lastInteraction.current = performance.now());
    const evs = ['pointerdown', 'keydown', 'scroll'] as const;
    evs.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    const iv = window.setInterval(() => {
      const now = performance.now();
      if (document.visibilityState === 'visible' && now - lastInteraction.current < 180_000) active.current += now - lastTick.current;
      lastTick.current = now;
    }, 5000);
    const save = () => {
      const minutes = Math.min(120, active.current / 60000);
      active.current = 0;
      if (minutes < 1) return;
      update((d) =>
        void d.sessions.push({
          id: uid(),
          date: localDate(),
          startedAt: startedAt.current,
          minutes: Math.round(minutes * 10) / 10,
          kind,
          exercisesCompleted: label ? [label] : [],
          exercisesSkipped: [],
        }),
      );
    };
    window.addEventListener('pagehide', save);
    return () => {
      evs.forEach((e) => window.removeEventListener(e, touch));
      window.removeEventListener('pagehide', save);
      clearInterval(iv);
      save();
    };
  }, [kind, label, enabled, update]);
}
