import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { useAppData } from '../state/AppData';
import { account, acceptServer, loadMeta, push, saveMeta, syncNow, type SyncOutcome } from '../lib/sync';
import { defaultData, type AppData } from '../storage/schema';

interface SyncState {
  /** Name of the learner profile this device is signed in to. */
  name: string | null;
  checked: boolean;
  busy: boolean;
  last?: SyncOutcome;
  conflict?: Extract<SyncOutcome, { kind: 'conflict' }>;
}

let state: SyncState = { name: loadMeta().name ?? null, checked: false, busy: false };
const subs = new Set<() => void>();
const set = (p: Partial<SyncState>) => {
  state = { ...state, ...p };
  subs.forEach((f) => f());
};
const subscribe = (f: () => void) => (subs.add(f), () => void subs.delete(f));

/** Shared sync status + actions. Auto-sync runs in the background when enabled (see useAutoSync). */
export function useSync() {
  const s = useSyncExternalStore(subscribe, () => state);
  const { data, replace } = useAppData();

  const apply = useCallback(
    (o: SyncOutcome) => {
      if (o.kind === 'pulled' && o.data) replace(o.data);
      if (o.kind === 'logged-out') {
        saveMeta({ ...loadMeta(), name: undefined });
        set({ name: null });
      }
      set({ last: o, busy: false, conflict: o.kind === 'conflict' ? o : undefined });
      return o;
    },
    [replace],
  );

  const run = useCallback(async (d: AppData) => {
    if (state.busy || !state.name) return;
    set({ busy: true });
    return apply(await syncNow(d));
  }, [apply]);

  const resolve = useCallback(
    async (keep: 'device' | 'server') => {
      const c = state.conflict;
      if (!c) return;
      set({ busy: true });
      if (keep === 'server') {
        replace(acceptServer(c.server));
        set({ busy: false, conflict: undefined, last: { kind: 'pulled' } });
      } else apply(await push(data, c.server.version));
    },
    [apply, data, replace],
  );

  const signedIn = useCallback((name: string) => {
    saveMeta({ ...loadMeta(), name, version: undefined, hashAtSync: undefined });
    set({ name, checked: true });
  }, []);

  const signOut = useCallback(async () => {
    await account.logout().catch(() => {});
    saveMeta({ auto: loadMeta().auto });
    set({ name: null, conflict: undefined, last: undefined });
  }, []);

  /**
   * Hands this device to another learner: saves this learner's latest progress
   * first, and only clears the device when that save went through.
   */
  const switchLearner = useCallback(async (): Promise<{ ok: true } | { ok: false; message: string }> => {
    if (state.name) {
      const o = await run(data);
      if (!o || (o.kind !== 'pushed' && o.kind !== 'pulled' && o.kind !== 'up-to-date'))
        return { ok: false, message: o?.kind === 'conflict' ? 'Progress changed on another device. Choose which copy to keep first.' : o?.kind === 'error' ? o.message : 'Could not save your progress. Try again.' };
    }
    await signOut();
    replace(defaultData());
    return { ok: true };
  }, [data, replace, run, signOut]);

  return { ...s, run, resolve, signedIn, signOut, switchLearner };
}

/** Checks the session once, then syncs automatically (debounced) after changes. */
export function useAutoSync() {
  const { data } = useAppData();
  const { run, name } = useSync();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (state.checked) return;
    account
      .me()
      .then((r) => {
        if (r.status === 200) {
          if (loadMeta().name !== r.body.name) saveMeta({ ...loadMeta(), name: r.body.name });
          set({ name: r.body.name, checked: true });
        } else if (r.status === 401) {
          saveMeta({ ...loadMeta(), name: undefined });
          set({ name: null, checked: true });
        } else set({ checked: true });
      })
      .catch(() => set({ checked: true }));
  }, []);

  useEffect(() => {
    if (!name || !loadMeta().auto || state.conflict) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => void run(data), 6000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [data, name, run]);
}
