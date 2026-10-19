import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../src/App';
import { AppDataProvider } from '../src/state/AppData';
import { LocalStorageAdapter } from '../src/storage/adapter';
import { defaultData } from '../src/storage/schema';

beforeAll(() => {
  window.matchMedia ??= ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as never;
  window.scrollTo = () => {};
  HTMLElement.prototype.scrollIntoView = () => {};
  globalThis.fetch = (async () => new Response(JSON.stringify({ ok: true, tutor: { configured: false, model: null }, youtube: { configured: false }, songs: { configured: true } }), { status: 200 })) as never;
});
beforeEach(() => localStorage.clear());

function renderApp(path = '/') {
  return render(
    <AppDataProvider adapter={new LocalStorageAdapter()}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </AppDataProvider>,
  );
}

describe('App', () => {
  it('shows onboarding on first visit and saves answers', async () => {
    renderApp();
    expect(await screen.findByText('Namaste! Welcome to SurSadhana')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/What should we call you/), 'Asha');
    for (let i = 0; i < 7; i++) await userEvent.click(screen.getByRole('button', { name: /Continue/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Skip for now' }));
    expect(await screen.findByText(/Namaste, Asha/)).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem('sursadhana:data')!);
    expect(saved.profile.onboarded).toBe(true);
    expect(saved.profile.name).toBe('Asha');
  });

  it('progress survives a reload (re-mount from storage)', async () => {
    const d = defaultData();
    d.profile.onboarded = true;
    d.profile.name = 'Ravi';
    new LocalStorageAdapter().save(d);
    renderApp('/');
    expect(await screen.findByText(/Namaste, Ravi/)).toBeInTheDocument();
  });

  it('blocks locked lessons', async () => {
    const d = defaultData();
    d.profile.onboarded = true;
    new LocalStorageAdapter().save(d);
    renderApp('/learn/lesson/l2-sargam-with-drone');
    expect(await screen.findByText(/is locked/)).toBeInTheDocument();
  });

  it('renders the learning path with all four levels', async () => {
    const d = defaultData();
    d.profile.onboarded = true;
    new LocalStorageAdapter().save(d);
    renderApp('/learn');
    expect(await screen.findByRole('heading', { name: 'Foundations' })).toBeInTheDocument();
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2).toEqual(expect.arrayContaining(['Foundations', 'Building the Voice', 'Intermediate', 'Advanced Foundations']));
  });
});
