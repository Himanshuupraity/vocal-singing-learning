import { useEffect, useState } from 'react';
import { isChunkError, newerBuildAvailable } from '../lib/updates';

const EVERY_MS = 10 * 60 * 1000;

/** True once a newer version of the site has been deployed than the one running in this tab. */
export function useUpdateAvailable() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    let alive = true;
    const check = () => newerBuildAvailable(__BUILD_ID__).then((n) => alive && n && setAvailable(true));
    const onVisible = () => document.visibilityState === 'visible' && void check();
    const onError = (e: ErrorEvent | PromiseRejectionEvent) => isChunkError('reason' in e ? e.reason : e.error ?? e.message) && setAvailable(true);
    void check();
    const iv = window.setInterval(check, EVERY_MS);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onError);
    return () => {
      alive = false;
      clearInterval(iv);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onError);
    };
  }, []);
  return available;
}
