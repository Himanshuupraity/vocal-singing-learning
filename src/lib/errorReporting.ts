let installed = false;
let sent = 0;

function enabled() {
  try {
    const d = JSON.parse(localStorage.getItem('sursadhana:data') ?? '{}');
    return d?.settings?.errorReports !== false;
  } catch {
    return true;
  }
}

/** Sends a minimal, anonymous crash report to our own server (no third-party service, no personal data). */
export function reportError(err: unknown, source: string) {
  if (!enabled() || sent >= 10) return;
  sent++;
  const e = err instanceof Error ? err : new Error(String(err));
  const body = JSON.stringify({
    message: e.message.slice(0, 500),
    stack: (e.stack ?? '').split('\n').slice(0, 8).join('\n').slice(0, 2000),
    source,
    path: location.pathname.slice(0, 200),
    ua: navigator.userAgent.slice(0, 200),
  });
  try {
    if (navigator.sendBeacon?.('/api/client-errors', new Blob([body], { type: 'application/json' }))) return;
  } catch {
    /* fall through */
  }
  fetch('/api/client-errors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
}

export function installErrorReporting() {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  window.addEventListener('error', (ev) => reportError(ev.error ?? ev.message, 'window.error'));
  window.addEventListener('unhandledrejection', (ev) => reportError(ev.reason, 'unhandledrejection'));
}
