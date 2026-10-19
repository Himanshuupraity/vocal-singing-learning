import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { LocalStorageAdapter, type StorageAdapter } from '../storage/adapter';
import { LIMITS, type AppData } from '../storage/schema';

interface Ctx {
  data: AppData;
  /** Immutable-style update; draft is a deep clone you may mutate. */
  update: (fn: (draft: AppData) => void) => void;
  replace: (d: AppData) => void;
  loadWarning?: string;
  saveError?: string;
  dismissWarning: () => void;
}

const AppDataContext = createContext<Ctx | null>(null);

export function AppDataProvider({ children, adapter }: { children: ReactNode; adapter?: StorageAdapter }) {
  const store = useMemo(() => adapter ?? new LocalStorageAdapter(), [adapter]);
  const initial = useMemo(() => store.load(), [store]);
  const [data, setData] = useState<AppData>(initial.data);
  const [loadWarning, setLoadWarning] = useState(initial.warning);
  const [saveError, setSaveError] = useState<string>();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      store.save(data);
      setSaveError(undefined);
    } catch (e) {
      setSaveError((e as Error).message);
    }
  }, [data, store]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('sursadhana:data') && !e.key.includes(':corrupt:')) setData(store.load().data);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [store]);

  const update = useCallback((fn: (d: AppData) => void) => {
    setData((prev) => {
      const draft = structuredClone(prev);
      fn(draft);
      draft.pitchAttempts = draft.pitchAttempts.slice(-LIMITS.pitchAttempts);
      draft.earTests = draft.earTests.slice(-LIMITS.earTests);
      draft.rhythm = draft.rhythm.slice(-LIMITS.rhythm);
      draft.sessions = draft.sessions.slice(-LIMITS.sessions);
      draft.tutor.messages = draft.tutor.messages.slice(-LIMITS.tutorMessages);
      draft.tutor.memory = draft.tutor.memory.slice(-LIMITS.tutorMemory);
      return draft;
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({ data, update, replace: setData, loadWarning, saveError, dismissWarning: () => setLoadWarning(undefined) }),
    [data, update, loadWarning, saveError],
  );
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const c = useContext(AppDataContext);
  if (!c) throw new Error('useAppData must be used inside AppDataProvider');
  return c;
}
