import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { defaultData } from '../src/storage/schema';

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

function saved(name: string) {
  const d = defaultData();
  d.profile.onboarded = true;
  d.profile.name = name;
  d.lessons['l1-what-is-singing'] = { completedAt: new Date().toISOString(), quizAttempts: 1, quizBest: 100, selfChecks: [], practiceCount: 0 };
  return d;
}

/** A fake server with one saved learner, Meera, whose PIN is 2468. */
function serve(profiles: { id: string; name: string; lastActive: string | null }[]) {
  const calls: string[] = [];
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    const method = init?.method ?? 'GET';
    calls.push(`${method} ${url}`);
    if (url === '/api/profiles' && method === 'GET') return json(200, { profiles, persistent: true });
    if (url === '/api/profiles' && method === 'POST') return json(201, { id: 'p2', name: JSON.parse(String(init!.body)).name });
    if (url === '/api/profiles/p1/unlock') return JSON.parse(String(init!.body)).pin === '2468' ? json(200, { id: 'p1', name: 'Meera' }) : json(401, { message: 'Wrong PIN. 4 tries left.' });
    if (url === '/api/sync' && method === 'GET') return profiles.length ? json(200, { data: saved('Meera'), version: 3, updatedAt: '2026-10-18T10:00:00Z' }) : json(404, { error: 'none' });
    return json(200, { ok: true, tutor: { configured: false, model: null }, youtube: { configured: false }, songs: { configured: true } });
  }) as never;
  return calls;
}

/** Fresh modules per test: sync state is module-level, like it is per page load in the browser. */
async function renderApp(path = '/') {
  vi.resetModules();
  const { App } = await import('../src/App');
  const { AppDataProvider } = await import('../src/state/AppData');
  const { LocalStorageAdapter } = await import('../src/storage/adapter');
  return render(
    <AppDataProvider adapter={new LocalStorageAdapter()}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </AppDataProvider>,
  );
}

beforeAll(() => {
  window.matchMedia ??= ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as never;
  window.scrollTo = () => {};
  HTMLElement.prototype.scrollIntoView = () => {};
});
beforeEach(() => localStorage.clear());

describe('Who’s practising? (new device)', () => {
  it('lists saved learners and opens one with the right PIN', async () => {
    serve([{ id: 'p1', name: 'Meera', lastActive: '2026-10-18T10:00:00Z' }]);
    await renderApp();
    expect(await screen.findByText('Who’s practising?')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Meera/ }));
    await userEvent.type(screen.getByLabelText('PIN for Meera'), '1111');
    await userEvent.click(screen.getByRole('button', { name: 'Open my progress' }));
    expect(await screen.findByText('Wrong PIN. 4 tries left.')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('PIN for Meera'), '2468');
    await userEvent.click(screen.getByRole('button', { name: 'Open my progress' }));
    expect(await screen.findAllByText(/Namaste, Meera/)).not.toHaveLength(0);
    await waitFor(() => expect(localStorage.getItem('sursadhana:data')).toBeTruthy());
    const data = JSON.parse(localStorage.getItem('sursadhana:data')!);
    expect(data.profile.name).toBe('Meera');
    expect(data.lessons['l1-what-is-singing'].completedAt).toBeTruthy();
    expect(localStorage.getItem('sursadhana:sync')).not.toContain('2468');
  });

  it('a new learner saves a name + PIN, then onboards with the name filled in', async () => {
    const calls = serve([]);
    await renderApp();
    expect(await screen.findByText('Namaste! Welcome to SurSadhana')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Your name'), 'Asha');
    await userEvent.type(screen.getByLabelText('Choose a 4-digit PIN'), '1357');
    await userEvent.type(screen.getByLabelText('Type the PIN again'), '1357');
    await userEvent.click(screen.getByRole('button', { name: 'Save my progress' }));
    expect(await screen.findByLabelText(/What should we call you/)).toHaveValue('Asha');
    // the blank, not-yet-onboarded device must not be uploaded over anything
    expect(calls).not.toContain('PUT /api/sync');
  });

  it('shows the recovery code once before continuing', async () => {
    serve([]);
    const base = globalThis.fetch;
    globalThis.fetch = (async (url: string, init?: RequestInit) =>
      url === '/api/profiles' && init?.method === 'POST' ? json(201, { id: 'p2', name: 'Asha', recoveryCode: 'ABCDE-FGHJK-MNPQR' }) : base(url, init)) as never;
    await renderApp();
    await screen.findByText('Namaste! Welcome to SurSadhana');
    await userEvent.type(screen.getByLabelText('Your name'), 'Asha');
    await userEvent.type(screen.getByLabelText('Choose a 4-digit PIN'), '1357');
    await userEvent.type(screen.getByLabelText('Type the PIN again'), '1357');
    await userEvent.click(screen.getByRole('button', { name: 'Save my progress' }));
    expect(await screen.findByText('ABCDE-FGHJK-MNPQR')).toBeInTheDocument();
    const go = screen.getByRole('button', { name: /I’ve saved it/ });
    expect(go).toBeDisabled();
    await userEvent.click(screen.getByLabelText('I’ve saved my recovery code'));
    await userEvent.click(go);
    expect(await screen.findByLabelText(/What should we call you/)).toHaveValue('Asha');
  });

  it('falls back to plain onboarding when the server is unreachable', async () => {
    globalThis.fetch = (async () => {
      throw new TypeError('offline');
    }) as never;
    await renderApp();
    expect(await screen.findByLabelText(/What should we call you/)).toHaveValue('');
  });
});

describe('Change PIN (Settings)', () => {
  it('changes the PIN with the current one and confirms it', async () => {
    localStorage.setItem('sursadhana:data', JSON.stringify(saved('Meera')));
    localStorage.setItem('sursadhana:sync', JSON.stringify({ name: 'Meera', auto: false }));
    const sent: unknown[] = [];
    globalThis.fetch = (async (url: string, init?: RequestInit) => {
      if (url === '/api/auth/me') return json(200, { id: 'p1', name: 'Meera', sync: null });
      if (url === '/api/profiles/me/pin') {
        const body = JSON.parse(String(init!.body));
        sent.push(body);
        return body.currentPin === '2468' ? new Response(null, { status: 204 }) : json(401, { message: 'Current PIN is incorrect.' });
      }
      return json(200, { ok: true, tutor: { configured: false, model: null }, youtube: { configured: false }, songs: { configured: true } });
    }) as never;
    await renderApp('/settings');
    await userEvent.click(await screen.findByRole('button', { name: 'Change PIN' }));
    await userEvent.type(screen.getByLabelText('Current PIN'), '1111');
    await userEvent.type(screen.getByLabelText('New PIN'), '9753');
    await userEvent.type(screen.getByLabelText('Type the new PIN again'), '9753');
    await userEvent.click(screen.getByRole('button', { name: 'Change PIN' }));
    expect(await screen.findByText('Current PIN is incorrect.')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Current PIN'), '2468');
    await userEvent.click(screen.getByRole('button', { name: 'Change PIN' }));
    expect(await screen.findByText(/PIN changed/)).toBeInTheDocument();
    expect(sent.at(-1)).toEqual({ currentPin: '2468', newPin: '9753' });
    expect(JSON.stringify(localStorage)).not.toMatch(/9753|2468/);
  });
});
