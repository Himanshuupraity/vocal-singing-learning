import { migrate } from '../storage/migrate';
import type { AppData } from '../storage/schema';
import { hashString } from './dates';

/**
 * Whole-document sync with optimistic versioning. We never silently overwrite:
 * if both this device and the server changed since the last sync, the learner
 * chooses which copy to keep.
 */
export interface SyncMeta {
  /** The learner profile this device is signed in to. */
  name?: string;
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

export interface ProfileSummary {
  id: string;
  name: string;
  lastActive: string | null;
}

export const account = {
  profiles: () => api<{ profiles: ProfileSummary[]; persistent: boolean; message?: string }>('/api/profiles'),
  me: () => api<{ id: string; name: string; sync: { version: number; updatedAt: string } | null; message?: string }>('/api/auth/me'),
  create: (name: string, pin: string) => api<{ id: string; name: string; message?: string }>('/api/profiles', { method: 'POST', body: JSON.stringify({ name, pin }) }),
  unlock: (id: string, pin: string) => api<{ id: string; name: string; message?: string }>(`/api/profiles/${encodeURIComponent(id)}/unlock`, { method: 'POST', body: JSON.stringify({ pin }) }),
  logout: () => api('/api/auth/logout', { method: 'POST' }),
  changePin: (currentPin: string, newPin: string) => api<{ message?: string }>('/api/profiles/me/pin', { method: 'POST', body: JSON.stringify({ currentPin, newPin }) }),
  remove: (pin: string) => api<{ message?: string }>('/api/profiles/me', { method: 'DELETE', body: JSON.stringify({ pin }) }),
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
    // Nothing saved yet: upload this device's progress, but never a blank, not-yet-onboarded copy.
    if (r.status === 404) return isFresh(local) ? { kind: 'up-to-date' } : push(local, 0);
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
