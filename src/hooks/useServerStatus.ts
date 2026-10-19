import { timeoutSignal } from '../lib/timeout';
import { useEffect, useState } from 'react';

export interface ServerStatus {
  reachable: boolean;
  tutor: { configured: boolean; provider?: 'claude' | 'gemini' | null; model: string | null; voice?: boolean };
  youtube: { configured: boolean };
  songs: { configured: boolean; provider?: string };
}

let cached: Promise<ServerStatus> | null = null;

export function fetchStatus(force = false): Promise<ServerStatus> {
  if (!cached || force) {
    cached = fetch('/api/status', { signal: timeoutSignal(5000) })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const j = await r.json();
        return { reachable: true, ...j } as ServerStatus;
      })
      .catch(() => ({ reachable: false, tutor: { configured: false, model: null }, youtube: { configured: false }, songs: { configured: false } }));
  }
  return cached;
}

export function useServerStatus() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  useEffect(() => {
    let alive = true;
    fetchStatus().then((s) => alive && setStatus(s));
    return () => {
      alive = false;
    };
  }, []);
  return status;
}
