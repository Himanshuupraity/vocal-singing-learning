import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Icon, cx, type IconName } from './ui';
import { useAppData } from '../state/AppData';
import { tonicLabel } from '../music/theory';
import { useReminder } from '../hooks/useReminder';
import { useUpdateAvailable } from '../hooks/useUpdateAvailable';
import { useAutoSync, useSync } from '../hooks/useSync';

export const NAV: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Dashboard', icon: 'home' },
  { to: '/learn', label: 'Learning Path', icon: 'path' },
  { to: '/riyaz', label: 'Daily Riyaz', icon: 'calendar' },
  { to: '/studio', label: 'Practice Studio', icon: 'mic' },
  { to: '/tutor', label: 'AI Vocal Tutor', icon: 'chat' },
  { to: '/songs', label: 'Bollywood Songs', icon: 'film' },
  { to: '/videos', label: 'Video Library', icon: 'video' },
  { to: '/progress', label: 'Progress & Reports', icon: 'chart' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

const MOBILE_PRIMARY = ['/', '/learn', '/riyaz', '/studio', '/tutor'];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-9 w-9 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="9" className="fill-primary" />
        <path d="M6 20c4-8 8-8 10 0s6 8 10 0" stroke="#f5d48a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
      <div className="leading-tight">
        <p className="font-display text-lg font-semibold">SurSadhana</p>
        <p className="text-[11px] text-muted">From first sur to confident singing</p>
      </div>
    </div>
  );
}

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {NAV.map((n) => (
        <li key={n.to}>
          <NavLink
            to={n.to}
            end={n.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cx('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-surface-2 hover:text-text')
            }
          >
            <Icon name={n.icon} />
            {n.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

/** Who is learning on this device, and the way to hand it to someone else. */
function LearnerBox({ onNavigate }: { onNavigate?: () => void }) {
  const { data } = useAppData();
  const sync = useSync();
  const navigate = useNavigate();
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const switchLearner = async () => {
    setErr(null);
    setBusy(true);
    const r = await sync.switchLearner();
    setBusy(false);
    if (r.ok) navigate('/', { replace: true });
    else {
      setErr(r.message);
      navigate('/settings');
      onNavigate?.();
    }
  };

  return (
    <div className="rounded-xl bg-surface-2 p-3 text-xs text-muted">
      {sync.name ? (
        <>
          <p className="text-sm text-text">
            Namaste, <span className="font-semibold">{sync.name}</span>
          </p>
          <p className="mt-0.5">Progress saved to your name.</p>
          <button type="button" className="mt-1 underline" onClick={switchLearner} disabled={busy}>
            {busy ? 'Saving…' : 'Switch learner'}
          </button>
          {err && <p className="mt-1 text-danger">{err}</p>}
        </>
      ) : (
        <>
          <p>Progress is saved in this browser only.</p>
          <NavLink to="/settings#account" className="mt-1 inline-block font-medium text-primary underline" onClick={onNavigate}>
            Save under your name
          </NavLink>
        </>
      )}
      <p className="mt-2">
        Your Sa: <span className="font-semibold text-text">{tonicLabel(data.profile.tonic)}</span> ·{' '}
        <NavLink to="/privacy" className="underline" onClick={onNavigate}>
          Privacy
        </NavLink>
      </p>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { data, loadWarning, saveError, dismissWarning } = useAppData();
  const [menuOpen, setMenuOpen] = useState(false);
  const reminder = useReminder();
  const update = useUpdateAvailable();
  const [updateLater, setUpdateLater] = useState(false);
  useAutoSync();
  const sync = useSync();
  const loc = useLocation();
  useEffect(() => {
    setMenuOpen(false);
    document.getElementById('main')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  return (
    <div className="min-h-screen bg-bg">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-surface px-4 py-5 lg:flex">
        <Brand />
        <nav aria-label="Main" className="mt-8 flex-1 overflow-y-auto">
          <NavItems />
        </nav>
        <LearnerBox />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <button type="button" onClick={() => setMenuOpen(true)} className="rounded-lg p-2 hover:bg-surface-2" aria-label="Open menu" aria-expanded={menuOpen}>
          <Icon name="menu" />
        </button>
      </header>
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-72 overflow-y-auto bg-surface p-4 shadow-xl">
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={() => setMenuOpen(false)} className="rounded-lg p-2 hover:bg-surface-2" aria-label="Close menu">
                <Icon name="x" />
              </button>
            </div>
            <nav aria-label="Main mobile">
              <NavItems onNavigate={() => setMenuOpen(false)} />
            </nav>
            <div className="mt-4">
              <LearnerBox onNavigate={() => setMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <main id="main" tabIndex={-1} className="px-4 pb-28 pt-6 outline-none sm:px-6 lg:ml-64 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-6xl">
          {loadWarning && (
            <div className="mb-4">
              <Alert tone="warning" title="About your saved data">
                {loadWarning}{' '}
                <button type="button" className="underline" onClick={dismissWarning}>
                  Dismiss
                </button>
              </Alert>
            </div>
          )}
          {update && !updateLater && (
            <div className="mb-4">
              <Alert tone="info" title="A new version of SurSadhana is ready" icon="sparkle">
                Refresh to get the latest tools and fixes. Your progress is saved.{' '}
                <button type="button" className="font-medium underline" onClick={() => window.location.reload()}>
                  Refresh now
                </button>{' '}
                ·{' '}
                <button type="button" className="underline" onClick={() => setUpdateLater(true)}>
                  Later
                </button>
              </Alert>
            </div>
          )}
          {reminder.due && loc.pathname !== '/riyaz' && (
            <div className="mb-4">
              <Alert tone="info" title="Time for today’s riyaz 🎵" icon="calendar">
                Your {data.profile.dailyMinutes}-minute plan is ready.{' '}
                <NavLink to="/riyaz" className="font-medium underline">
                  Start now
                </NavLink>{' '}
                ·{' '}
                <button type="button" className="underline" onClick={reminder.dismiss}>
                  Not today
                </button>
              </Alert>
            </div>
          )}
          {sync.conflict && loc.pathname !== '/settings' && (
            <div className="mb-4">
              <Alert tone="warning" title="Sync needs your decision">
                Your progress changed on two devices.{' '}
                <NavLink to="/settings" className="font-medium underline">
                  Choose which copy to keep
                </NavLink>
              </Alert>
            </div>
          )}
                    {saveError && (
            <div className="mb-4">
              <Alert tone="danger" title="Progress is not being saved">
                {saveError} Export your progress from Settings to keep a copy.
              </Alert>
            </div>
          )}
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav aria-label="Quick" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {NAV.filter((n) => MOBILE_PRIMARY.includes(n.to)).map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => cx('flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium', isActive ? 'text-primary' : 'text-muted')}>
            <Icon name={n.icon} />
            {n.label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
