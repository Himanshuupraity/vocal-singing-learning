import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { useAppData } from '../state/AppData';
import { account, acceptServer, loadMeta, push, saveMeta, syncNow, type SyncOutcome } from '../lib/sync';
import type { AppData } from '../storage/schema';

interface SyncState {
  email: string | null;
  checked: boolean;
  busy: boolean;
  last?: SyncOutcome;
  conflict?: Extract<SyncOutcome, { kind: 'conflict' }>;
}

let state: SyncState = { email: loadMeta().email ?? null, checked: false, busy: false };
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
        saveMeta({ ...loadMeta(), email: undefined });
        set({ email: null });
      }
      set({ last: o, busy: false, conflict: o.kind === 'conflict' ? o : undefined });
      return o;
    },
    [replace],
  );

  const run = useCallback(async (d: AppData) => {
    if (state.busy || !state.email) return;
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

  const signedIn = useCallback((email: string) => {
    saveMeta({ ...loadMeta(), email, version: undefined, hashAtSync: undefined });
    set({ email, checked: true });
  }, []);

  const signOut = useCallback(async () => {
    await account.logout().catch(() => {});
    saveMeta({ auto: loadMeta().auto });
    set({ email: null, conflict: undefined, last: undefined });
  }, []);

  return { ...s, run, resolve, signedIn, signOut };
}

/** Checks the session once, then syncs automatically (debounced) after changes. */
export function useAutoSync() {
  const { data } = useAppData();
  const { run, email } = useSync();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (state.checked) return;
    account
      .me()
      .then((r) => {
        if (r.status === 200) {
          if (loadMeta().email !== r.body.email) saveMeta({ ...loadMeta(), email: r.body.email });
          set({ email: r.body.email, checked: true });
        } else set({ email: null, checked: true });
      })
      .catch(() => set({ checked: true }));
  }, []);

  useEffect(() => {
    if (!email || !loadMeta().auto || state.conflict) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => void run(data), 6000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [data, email, run]);
}
