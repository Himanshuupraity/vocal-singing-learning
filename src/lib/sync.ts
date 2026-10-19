import { migrate } from '../storage/migrate';
import type { AppData } from '../storage/schema';
import { hashString } from './dates';

/**
 * Whole-document sync with optimistic versioning. We never silently overwrite:
 * if both this device and the server changed since the last sync, the learner
 * chooses which copy to keep.
 */
export interface SyncMeta {
  email?: string;
  version?: number;
  syncedAt?: string;
  hashAtSync?: number;
  auto: boolean;
}

const KEY = 'sursadhana:sync';
const HDR = { 'Content-Type': 'application/json', 'X-SurSadhana': '1' };

export function loadMeta(): SyncMeta {
  try {
    return { auto: true, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
  } catch {
    return { auto: true };
  }
}
export function saveMeta(m: SyncMeta) {
  try {
    localStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    /* ignore */
  }
}

export const dataHash = (d: AppData) => hashString(JSON.stringify(d));

async function api<T>(url: string, init: RequestInit = {}): Promise<{ status: number; body: T }> {
  let r: Response;
  try {
    r = await fetch(url, { credentials: 'same-origin', ...init, headers: { ...HDR, ...(init.headers ?? {}) } });
  } catch {
    throw new Error('Can’t reach the SurSadhana server. Your progress is still saved on this device.');
  }
  const body = r.status === 204 ? ({} as T) : await r.json().catch(() => ({}) as T);
  return { status: r.status, body };
}

export const account = {
  me: () => api<{ email: string; sync: { version: number; updatedAt: string } | null; message?: string }>('/api/auth/me'),
  register: (email: string, password: string) => api<{ email: string; message?: string }>('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) => api<{ email: string; message?: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => api('/api/auth/logout', { method: 'POST' }),
  remove: (password: string) => api<{ message?: string }>('/api/auth/account', { method: 'DELETE', body: JSON.stringify({ password }) }),
};

export type SyncOutcome =
  | { kind: 'pushed' | 'pulled' | 'up-to-date'; data?: AppData }
  | { kind: 'conflict'; server: { data: AppData; version: number; updatedAt: string }; firstSync: boolean }
  | { kind: 'logged-out' }
  | { kind: 'error'; message: string };

function isFresh(d: AppData) {
  return !d.profile.onboarded || (Object.keys(d.lessons).length === 0 && d.sessions.length === 0 && d.pitchAttempts.length === 0 && Object.keys(d.songs).length === 0);
}

export async function push(local: AppData, baseVersion: number): Promise<SyncOutcome> {
  const r = await api<{ version: number; updatedAt: string; server?: { data: unknown; version: number; updatedAt: string }; message?: string }>('/api/sync', {
    method: 'PUT',
    body: JSON.stringify({ data: local, baseVersion }),
  });
  if (r.status === 401) return { kind: 'logged-out' };
  if (r.status === 409 && r.body.server) return { kind: 'conflict', server: { ...r.body.server, data: migrate(r.body.server.data).data }, firstSync: false };
  if (r.status !== 200) return { kind: 'error', message: r.body.message ?? `Sync failed (${r.status}).` };
  saveMeta({ ...loadMeta(), version: r.body.version, syncedAt: r.body.updatedAt, hashAtSync: dataHash(local) });
  return { kind: 'pushed' };
}

export function acceptServer(server: { data: AppData; version: number; updatedAt: string }) {
  saveMeta({ ...loadMeta(), version: server.version, syncedAt: server.updatedAt, hashAtSync: dataHash(server.data) });
  return server.data;
}

export async function syncNow(local: AppData): Promise<SyncOutcome> {
  try {
    const meta = loadMeta();
    const r = await api<{ data: unknown; version: number; updatedAt: string; message?: string }>('/api/sync');
    if (r.status === 401) return { kind: 'logged-out' };
    if (r.status === 404) return push(local, 0);
    if (r.status !== 200) return { kind: 'error', message: r.body.message ?? `Sync failed (${r.status}).` };
    const server = { data: migrate(r.body.data).data, version: r.body.version, updatedAt: r.body.updatedAt };
    if (meta.version === undefined) {
      if (isFresh(local)) return { kind: 'pulled', data: acceptServer(server) };
      return { kind: 'conflict', server, firstSync: true };
    }
    const localChanged = dataHash(local) !== meta.hashAtSync;
    const serverChanged = server.version !== meta.version;
    if (!localChanged && !serverChanged) return { kind: 'up-to-date' };
    if (localChanged && !serverChanged) return push(local, server.version);
    if (!localChanged && serverChanged) return { kind: 'pulled', data: acceptServer(server) };
    return { kind: 'conflict', server, firstSync: false };
  } catch (e) {
    return { kind: 'error', message: (e as Error).message };
  }
}
