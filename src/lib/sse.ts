export class ApiError extends Error {
  constructor(public code: string, message: string, public status?: number) {
    super(message);
  }
}

/**
 * POSTs JSON and consumes a text/event-stream response (event: delta|done|error).
 */
export async function streamPost(url: string, body: unknown, onDelta: (t: string) => void, signal?: AbortSignal): Promise<void> {
  let res: Response;
  try {
    res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal });
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e;
    throw new ApiError('offline', 'Could not reach the SurSadhana server. Is it running?');
  }
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new ApiError(j.error ?? 'error', j.message ?? `Request failed (${res.status}).`, res.status);
  }
  if (!res.body) throw new ApiError('error', 'Empty response.');
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  const idle = { t: 0 as number | undefined };
  const resetIdle = (reject: (e: Error) => void) => {
    clearTimeout(idle.t);
    idle.t = window.setTimeout(() => {
      reader.cancel().catch(() => {});
      reject(new ApiError('timeout', 'The tutor stopped responding. Please try again.'));
    }, 60_000);
  };
  await new Promise<void>((resolve, reject) => {
    resetIdle(reject);
    (async () => {
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          resetIdle(reject);
          buf += dec.decode(value, { stream: true });
          let i: number;
          while ((i = buf.indexOf('\n\n')) >= 0) {
            const raw = buf.slice(0, i);
            buf = buf.slice(i + 2);
            const ev = /^event: (.*)$/m.exec(raw)?.[1];
            const data = /^data: (.*)$/m.exec(raw)?.[1];
            if (!ev || !data) continue;
            const payload = JSON.parse(data);
            if (ev === 'delta') onDelta(payload.text);
            else if (ev === 'error') throw new ApiError('upstream', payload.message);
          }
        }
        clearTimeout(idle.t);
        resolve();
      } catch (e) {
        clearTimeout(idle.t);
        reject(e);
      }
    })();
  });
}
