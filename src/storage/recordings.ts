/**
 * Recording Journal storage — IndexedDB, in this browser only.
 * Recordings are never uploaded anywhere.
 */
export interface RecordingMeta {
  id: string;
  createdAt: string;
  label: string;
  exercise: string;
  notes: string;
  durationSec: number;
  mimeType: string;
  sizeBytes: number;
}
export interface RecordingEntry extends RecordingMeta {
  blob: Blob;
}

const DB = 'sursadhana-recordings';
const STORE = 'recordings';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB is not available in this browser.'));
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Could not open recording storage.'));
  });
}

function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = fn(t.objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        t.oncomplete = () => db.close();
      }),
  );
}

export const recordingStore = {
  add: (r: RecordingEntry) => tx('readwrite', (s) => s.put(r)),
  update: async (id: string, patch: Partial<Pick<RecordingMeta, 'label' | 'notes' | 'exercise'>>) => {
    const cur = await tx<RecordingEntry | undefined>('readonly', (s) => s.get(id));
    if (cur) await tx('readwrite', (s) => s.put({ ...cur, ...patch }));
  },
  list: async (): Promise<RecordingEntry[]> => {
    const all = await tx<RecordingEntry[]>('readonly', (s) => s.getAll());
    return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  remove: (id: string) => tx('readwrite', (s) => s.delete(id)),
  clear: () => tx('readwrite', (s) => s.clear()),
};
