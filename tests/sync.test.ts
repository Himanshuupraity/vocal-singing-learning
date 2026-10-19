import { syncNow, loadMeta, saveMeta, dataHash } from '../src/lib/sync';
import { defaultData, type AppData } from '../src/storage/schema';

type Srv = { data: AppData; version: number } | null;
let server: Srv = null;

beforeEach(() => {
  localStorage.clear();
  server = null;
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    if (url === '/api/sync' && (!init?.method || init.method === 'GET')) {
      return server ? new Response(JSON.stringify({ ...server, updatedAt: 'now' }), { status: 200 }) : new Response('{}', { status: 404 });
    }
    if (url === '/api/sync' && init?.method === 'PUT') {
      const b = JSON.parse(String(init.body));
      if ((server?.version ?? 0) !== b.baseVersion) return new Response(JSON.stringify({ server: { ...server, updatedAt: 'now' } }), { status: 409 });
      server = { data: b.data, version: b.baseVersion + 1 };
      return new Response(JSON.stringify({ version: server.version, updatedAt: 'now' }), { status: 200 });
    }
    return new Response('{}', { status: 404 });
  }) as never;
});

const learner = (name: string) => {
  const d = defaultData();
  d.profile.onboarded = true;
  d.profile.name = name;
  d.lessons['l1-x'] = { quizAttempts: 1, quizBest: 80, selfChecks: [], practiceCount: 0 };
  return d;
};

describe('sync', () => {
  it('pushes when the server has nothing', async () => {
    expect((await syncNow(learner('A'))).kind).toBe('pushed');
    expect(server?.version).toBe(1);
    expect(loadMeta().version).toBe(1);
  });

  it('pulls into a fresh device', async () => {
    server = { data: learner('Server'), version: 3 };
    const r = await syncNow(defaultData());
    expect(r.kind).toBe('pulled');
    expect(r.kind === 'pulled' && r.data?.profile.name).toBe('Server');
  });

  it('asks before replacing on a first sync with existing local progress', async () => {
    server = { data: learner('Server'), version: 3 };
    const r = await syncNow(learner('Local'));
    expect(r.kind).toBe('conflict');
    expect(r.kind === 'conflict' && r.firstSync).toBe(true);
  });

  it('is up to date when nothing changed, pushes local-only changes, pulls server-only changes', async () => {
    const a = learner('A');
    await syncNow(a);
    expect((await syncNow(a)).kind).toBe('up-to-date');
    const a2 = { ...a, profile: { ...a.profile, name: 'A2' } };
    expect((await syncNow(a2)).kind).toBe('pushed');
    server = { data: learner('B'), version: server!.version + 1 };
    const r = await syncNow(a2);
    expect(r.kind).toBe('pulled');
  });

  it('reports a conflict when both sides changed', async () => {
    const a = learner('A');
    await syncNow(a);
    server = { data: learner('Other device'), version: 2 };
    const r = await syncNow({ ...a, profile: { ...a.profile, name: 'This device' } });
    expect(r.kind).toBe('conflict');
  });

  it('meta stores no secrets', async () => {
    await syncNow(learner('A'));
    saveMeta({ ...loadMeta(), name: 'Asha' });
    const raw = localStorage.getItem('sursadhana:sync')!;
    expect(raw).not.toMatch(/password|token|session/i);
    // Same data → same hash (one object, cloned: two learner() calls can straddle a millisecond in their timestamps).
    const a = learner('A');
    expect(dataHash(a)).toBe(dataHash(structuredClone(a)));
    expect(dataHash(a)).not.toBe(dataHash(learner('B')));
  });
});
