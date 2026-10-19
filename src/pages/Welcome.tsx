import { lazy, Suspense, useEffect, useState } from 'react';
import { useSync } from '../hooks/useSync';
import { account, type ProfileSummary } from '../lib/sync';
import { Card, Spinner } from '../components/ui';
import { NewLearnerForm, ProfileButton, UnlockForm } from '../components/LearnerForms';

const Onboarding = lazy(() => import('./Onboarding'));

type View = { k: 'pick' } | { k: 'pin'; p: ProfileSummary } | { k: 'new' } | { k: 'onboard' };

/**
 * First screen on a device that has no progress yet: "Who's practising?".
 * Picking a name and typing its PIN loads that learner's progress here;
 * a new learner saves a name + PIN and then goes through onboarding.
 */
export default function Welcome() {
  const sync = useSync();
  const [list, setList] = useState<{ profiles: ProfileSummary[]; persistent: boolean } | 'offline' | null>(null);
  const [view, setView] = useState<View>({ k: 'pick' });

  useEffect(() => {
    let alive = true;
    account
      .profiles()
      .then((r) => alive && setList(r.status === 200 && Array.isArray(r.body.profiles) ? r.body : 'offline'))
      .catch(() => alive && setList('offline'));
    return () => {
      alive = false;
    };
  }, []);

  const spinner = (
    <div className="grid min-h-[50vh] place-items-center">
      <Spinner />
    </div>
  );

  if (sync.busy) return spinner;

  // Signed in (a new learner, or one whose saved progress is still empty), skipped, or no server: set up on this device.
  if (sync.name || view.k === 'onboard' || list === 'offline') {
    return (
      <Suspense fallback={spinner}>
        <Onboarding initialName={sync.name ?? ''} />
      </Suspense>
    );
  }
  if (!list) return spinner;

  const showNew = view.k === 'new' || list.profiles.length === 0;

  return (
    <div className="min-h-screen bg-bg px-4 py-8 sm:py-16">
      <div className="mx-auto max-w-xl">
        <p className="text-center font-display text-2xl font-semibold text-primary">SurSadhana</p>
        <p className="mb-6 text-center text-sm text-muted">Your Journey from First Sur to Confident Singing.</p>
        <Card>
          {view.k === 'pin' ? (
            <>
              <h1 className="font-display text-2xl font-semibold">Namaste, {view.p.name}!</h1>
              <p className="mt-1 text-sm text-muted">Enter your PIN to open your progress on this device.</p>
              <div className="mt-4">
                <UnlockForm profile={view.p} onCancel={() => setView({ k: 'pick' })} />
              </div>
            </>
          ) : showNew ? (
            <>
              <h1 className="font-display text-2xl font-semibold">{list.profiles.length ? 'New learner' : 'Namaste! Welcome to SurSadhana'}</h1>
              <p className="mt-1 text-sm text-muted">Save your name and a PIN so you can continue your progress on any phone or laptop.</p>
              <div className="mt-4">
                <NewLearnerForm persistent={list.persistent} onCancel={list.profiles.length ? () => setView({ k: 'pick' }) : undefined} />
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display text-2xl font-semibold">Who’s practising?</h1>
              <p className="mt-1 text-sm text-muted">Tap your name to continue where you left off.</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {list.profiles.map((p) => (
                  <li key={p.id}>
                    <ProfileButton profile={p} onClick={() => setView({ k: 'pin', p })} />
                  </li>
                ))}
                <li>
                  <button type="button" onClick={() => setView({ k: 'new' })} className="flex h-full w-full items-center gap-3 rounded-xl border border-dashed border-border p-3 text-left hover:border-primary hover:bg-primary-soft">
                    <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-2 text-xl">
                      +
                    </span>
                    <span className="font-medium">New learner</span>
                  </button>
                </li>
              </ul>
            </>
          )}
          {view.k !== 'pin' && (
            <p className="mt-6 text-center text-sm">
              <button type="button" className="text-muted underline" onClick={() => setView({ k: 'onboard' })}>
                Continue without a name (progress stays on this device only)
              </button>
            </p>
          )}
        </Card>
        <p className="mt-4 text-center text-xs text-muted">Names on this screen are visible to anyone who opens this website. Your progress needs your PIN.</p>
      </div>
    </div>
  );
}
