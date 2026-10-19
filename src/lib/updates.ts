/**
 * Noticing a newer deploy. The running bundle knows its own build id; the
 * server's /version.json has the latest. When they differ — or a lazily
 * loaded page fails because its old file is gone — the app offers a refresh.
 */
export const CHUNK_ERROR = /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Failed to load module script/i;

export function isChunkError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : typeof e === 'string' ? e : String((e as { message?: unknown })?.message ?? '');
  return CHUNK_ERROR.test(msg);
}

export async function newerBuildAvailable(current: string, fetchImpl: typeof fetch = fetch): Promise<boolean> {
  try {
    const r = await fetchImpl('/version.json', { cache: 'no-store' });
    if (!r.ok) return false;
    const j = (await r.json()) as { id?: unknown };
    return typeof j.id === 'string' && j.id !== '' && j.id !== current;
  } catch {
    return false;
  }
}
