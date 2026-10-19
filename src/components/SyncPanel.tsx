import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppData } from '../state/AppData';
import { useSync } from '../hooks/useSync';
import { account, loadMeta, saveMeta, type ProfileSummary } from '../lib/sync';
import { Alert, Button, Card, Field, inputClass } from './ui';
import { NewLearnerForm, ProfileButton, UnlockForm } from './LearnerForms';

/** Saves this device's progress under a learner name + PIN, so any device can open it. */
export function SyncPanel() {
  const { data } = useAppData();
  const sync = useSync();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [list, setList] = useState<{ profiles: ProfileSummary[]; persistent: boolean } | null>(null);
  const [picked, setPicked] = useState<ProfileSummary | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [auto, setAuto] = useState(loadMeta().auto);
  const [delPin, setDelPin] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const meta = loadMeta();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === '#account') document.getElementById('account')?.scrollIntoView({ block: 'start' });
  }, [hash]);

  useEffect(() => {
    if (sync.name) return;
    account
      .profiles()
      .then((r) => r.status === 200 && setList(r.body))
      .catch(() => setErr('Can’t reach the SurSadhana server. Your progress is still saved on this device.'));
  }, [sync.name]);

  const outcomeText = () => {
    const o = sync.last;
    if (!o) return null;
    if (o.kind === 'pushed') return 'This device’s progress was saved to your name.';
    if (o.kind === 'pulled') return 'Your saved progress was loaded onto this device.';
    if (o.kind === 'up-to-date') return 'Everything is up to date.';
    if (o.kind === 'error') return o.message;
    if (o.kind === 'logged-out') return 'Please choose your name again to keep syncing.';
    return null;
  };

  const switchLearner = async () => {
    setErr(null);
    const r = await sync.switchLearner();
    if (r.ok) navigate('/', { replace: true });
    else setErr(r.message);
  };

  return (
    <Card>
      <h2 id="account" className="scroll-mt-24 font-semibold">
        Your name &amp; sync
      </h2>
      <p className="mt-1 text-sm text-muted">
        Save your progress under your name and a 4-digit PIN. On any other phone or laptop, open SurSadhana, tap your name and enter the PIN. Recordings stay on each device. <Link to="/privacy" className="text-primary underline">Privacy</Link>
      </p>

      {!sync.name ? (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2" role="group" aria-label="Save or open">
            {(
              [
                ['new', 'Save as a new learner'],
                ['existing', 'I already have a name'],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => {
                  setMode(m);
                  setPicked(null);
                }}
                className={`rounded-lg px-3 py-1.5 text-sm ${mode === m ? 'bg-primary text-on-primary' : 'bg-surface-2'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {err && <Alert tone="warning">{err}</Alert>}
          {mode === 'new' ? (
            <NewLearnerForm initialName={data.profile.name} persistent={list?.persistent ?? true} />
          ) : picked ? (
            <UnlockForm profile={picked} onCancel={() => setPicked(null)} />
          ) : list && list.profiles.length ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {list.profiles.map((p) => (
                <li key={p.id}>
                  <ProfileButton profile={p} onClick={() => setPicked(p)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No learners saved yet.</p>
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-sm">
            Signed in as <strong>{sync.name}</strong>
            {meta.syncedAt && <span className="text-muted"> · last synced {new Date(meta.syncedAt).toLocaleString()}</span>}
          </p>
          {sync.conflict ? (
            <Alert tone="warning" title={sync.conflict.firstSync ? 'Your name already has saved progress' : 'Progress changed on two devices'}>
              <p>
                {sync.conflict.firstSync
                  ? 'This device also has progress. Choose which one to keep — the other copy will be replaced.'
                  : 'Both this device and another device changed since the last sync. Choose which copy to keep.'}{' '}
                Saved copy from {new Date(sync.conflict.server.updatedAt).toLocaleString()} ({Object.values(sync.conflict.server.data.lessons).filter((l) => l.completedAt).length} lessons completed); this device: {Object.values(data.lessons).filter((l) => l.completedAt).length} lessons completed.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => sync.resolve('device')} disabled={sync.busy}>
                  Keep this device’s progress
                </Button>
                <Button size="sm" variant="secondary" onClick={() => sync.resolve('server')} disabled={sync.busy}>
                  Use the saved copy
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted">Tip: export your progress first (below) if you want a backup of the copy you replace.</p>
            </Alert>
          ) : (
            outcomeText() && <Alert tone={sync.last?.kind === 'error' ? 'warning' : 'success'}>{outcomeText()}</Alert>
          )}
          {err && <Alert tone="warning">{err}</Alert>}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" icon="repeat" onClick={() => sync.run(data)} disabled={sync.busy}>
              {sync.busy ? 'Syncing…' : 'Sync now'}
            </Button>
            <Button size="sm" variant="ghost" onClick={switchLearner} disabled={sync.busy}>
              Switch learner
            </Button>
          </div>
          <p className="text-xs text-muted">Switch learner saves your progress, then clears this device for someone else. Your progress stays under your name.</p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={auto}
              onChange={(e) => {
                setAuto(e.target.checked);
                saveMeta({ ...loadMeta(), auto: e.target.checked });
              }}
            />
            Sync automatically after changes
          </label>
          {!showDelete ? (
            <button type="button" className="text-xs text-danger underline" onClick={() => setShowDelete(true)}>
              Remove my name and its saved copy
            </button>
          ) : (
            <form
              className="flex flex-wrap items-end gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const r = await account.remove(delPin).catch(() => ({ status: 0, body: { message: 'Server unreachable.' } }));
                setDelPin('');
                if (r.status === 204) {
                  await sync.signOut();
                  setShowDelete(false);
                } else setErr(r.body.message ?? 'Could not remove your name.');
              }}
            >
              <Field label="Confirm with your PIN" htmlFor="del-pin">
                <input id="del-pin" type="password" inputMode="numeric" maxLength={4} autoComplete="off" className={`${inputClass} max-w-[10rem]`} value={delPin} onChange={(e) => setDelPin(e.target.value.replace(/\D/g, '').slice(0, 4))} />
              </Field>
              <Button type="submit" size="sm" variant="danger" disabled={delPin.length !== 4}>
                Remove
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowDelete(false)}>
                Cancel
              </Button>
            </form>
          )}
          <p className="text-xs text-muted">Your progress on this device is kept when you remove your name.</p>
        </div>
      )}
    </Card>
  );
}
