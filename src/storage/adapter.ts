import { migrate, type LoadResult } from './migrate';
import type { AppData } from './schema';

/**
 * Storage abstraction. The first version persists to localStorage; a cloud
 * adapter (e.g. account-based sync) can implement the same interface later.
 * Never store passwords or API secrets through this layer.
 */
export interface StorageAdapter {
  load(): LoadResult;
  save(data: AppData): void;
  clear(): void;
}

export const STORAGE_KEY = 'sursadhana:data';

export class LocalStorageAdapter implements StorageAdapter {
  constructor(private key = STORAGE_KEY, private store: Storage | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined) {}

  load(): LoadResult {
    if (!this.store) return migrate({});
    let text: string | null = null;
    try {
      text = this.store.getItem(this.key);
    } catch {
      return { ...migrate({}), warning: 'Browser storage is blocked (private mode or site settings). Progress will not be saved.' };
    }
    if (!text) return { data: migrate({}).data };
    try {
      return migrate(JSON.parse(text));
    } catch {
      // keep a copy of the corrupted data so nothing is silently destroyed
      try {
        this.store.setItem(`${this.key}:corrupt:${Date.now()}`, text);
      } catch {
        /* quota */
      }
      return { data: migrate({}).data, warning: 'Saved progress was corrupted and could not be read. A backup copy was kept and a fresh profile started.' };
    }
  }

  save(data: AppData) {
    if (!this.store) return;
    try {
      this.store.setItem(this.key, JSON.stringify(data));
    } catch (e) {
      throw new Error(`Could not save progress (${(e as Error).name === 'QuotaExceededError' ? 'browser storage is full' : 'storage unavailable'}).`);
    }
  }

  clear() {
    this.store?.removeItem(this.key);
  }
}

export function exportData(data: AppData): string {
  return JSON.stringify({ app: 'SurSadhana', exportedAt: new Date().toISOString(), data }, null, 2);
}

export function importData(text: string): LoadResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('This file is not valid JSON.');
  }
  const p = parsed as { app?: string; data?: unknown };
  if (!p || p.app !== 'SurSadhana' || !p.data) throw new Error('This file is not a SurSadhana progress export.');
  return migrate(p.data);
}
