/** AbortSignal that fires after `ms` (AbortSignal.timeout isn't available on older Safari). */
export function timeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) return AbortSignal.timeout(ms);
  const c = new AbortController();
  setTimeout(() => c.abort(new DOMException('Timed out', 'TimeoutError')), ms);
  return c.signal;
}
