import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../state/AppData';
import { useSync } from '../hooks/useSync';
import { account, loadMeta, saveMeta } from '../lib/sync';
import { Alert, Button, Card, Field, inputClass } from './ui';

/** Optional account for syncing progress across devices. Passwords are never stored in the browser. */
export function SyncPanel() {
  const { data } = useAppData();
  const sync = useSync();
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [auto, setAuto] = useState(loadMeta().auto);
  const [delPw, setDelPw] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const meta = loadMeta();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = mode === 'register' ? await account.register(email, password) : await account.login(email, password);
      if (r.status === 200 || r.status === 201) {
        sync.signedIn(r.body.email);
        setPassword('');
        await sync.run(data);
      } else setErr(r.body.message ?? 'Something went wrong.');
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
      setPassword('');
    }
  };

  const outcomeText = () => {
    const o = sync.last;
    if (!o) return null;
    if (o.kind === 'pushed') return 'This device’s progress was saved to your account.';
    if (o.kind === 'pulled') return 'Progress from your account was loaded onto this device.';
    if (o.kind === 'up-to-date') return 'Everything is up to date.';
    if (o.kind === 'error') return o.message;
    if (o.kind === 'logged-out') return 'Your session ended — please log in again.';
    return null;
  };

  return (
    <Card>
      <h2 className="font-semibold">Account &amp; sync (optional)</h2>
      <p className="mt-1 text-sm text-muted">
        Create a free account on this SurSadhana server to use your progress on your phone and laptop. Recordings stay on each device. <Link to="/privacy" className="text-primary underline">Privacy</Link>
      </p>

      {!sync.email ? (
        <form className="mt-4 space-y-3" onSubmit={submit}>
          <div className="flex gap-2" role="group" aria-label="Account mode">
            {(['register', 'login'] as const).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={`rounded-lg px-3 py-1.5 text-sm ${mode === m ? 'bg-primary text-on-primary' : 'bg-surface-2'}`}>
                {m === 'register' ? 'Create account' : 'Log in'}
              </button>
            ))}
          </div>
          <Field label="Email" htmlFor="acc-email">
            <input id="acc-email" type="email" autoComplete="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200} />
          </Field>
          <Field label="Password" htmlFor="acc-pw" hint={mode === 'register' ? 'At least 8 characters. Use a password you don’t use elsewhere.' : undefined}>
            <input id="acc-pw" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} maxLength={200} />
          </Field>
          {err && <Alert tone="danger">{err}</Alert>}
          <Button type="submit" disabled={busy || !email || password.length < 8}>
            {busy ? 'Please wait…' : mode === 'register' ? 'Create account & sync' : 'Log in & sync'}
          </Button>
        </form>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-sm">
            Signed in as <strong>{sync.email}</strong>
            {meta.syncedAt && <span className="text-muted"> · last synced {new Date(meta.syncedAt).toLocaleString()}</span>}
          </p>
          {sync.conflict ? (
            <Alert tone="warning" title={sync.conflict.firstSync ? 'Your account already has progress' : 'Progress changed on two devices'}>
              <p>
                {sync.conflict.firstSync
                  ? 'This device also has progress. Choose which one to keep — the other copy will be replaced.'
                  : 'Both this device and another device changed since the last sync. Choose which copy to keep.'}{' '}
                Account copy saved {new Date(sync.conflict.server.updatedAt).toLocaleString()} ({Object.values(sync.conflict.server.data.lessons).filter((l) => l.completedAt).length} lessons completed); this device: {Object.values(data.lessons).filter((l) => l.completedAt).length} lessons completed.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => sync.resolve('device')} disabled={sync.busy}>
                  Keep this device’s progress
                </Button>
                <Button size="sm" variant="secondary" onClick={() => sync.resolve('server')} disabled={sync.busy}>
                  Use the account copy
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted">Tip: export your progress first (below) if you want a backup of the copy you replace.</p>
            </Alert>
          ) : (
            outcomeText() && <Alert tone={sync.last?.kind === 'error' ? 'warning' : 'success'}>{outcomeText()}</Alert>
          )}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" icon="repeat" onClick={() => sync.run(data)} disabled={sync.busy}>
              {sync.busy ? 'Syncing…' : 'Sync now'}
            </Button>
            <Button size="sm" variant="ghost" onClick={sync.signOut}>
              Log out
            </Button>
          </div>
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
              Delete my account and its server copy
            </button>
          ) : (
            <form
              className="flex flex-wrap items-end gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const r = await account.remove(delPw).catch(() => ({ status: 0, body: { message: 'Server unreachable.' } }));
                setDelPw('');
                if (r.status === 204) {
                  await sync.signOut();
                  setShowDelete(false);
                } else setErr(r.body.message ?? 'Could not delete the account.');
              }}
            >
              <Field label="Confirm with your password" htmlFor="del-pw">
                <input id="del-pw" type="password" autoComplete="current-password" className={inputClass} value={delPw} onChange={(e) => setDelPw(e.target.value)} />
              </Field>
              <Button type="submit" size="sm" variant="danger" disabled={!delPw}>
                Delete account
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowDelete(false)}>
                Cancel
              </Button>
              {err && <p className="w-full text-sm text-danger">{err}</p>}
            </form>
          )}
          <p className="text-xs text-muted">Your progress on this device is kept when you log out or delete the account.</p>
        </div>
      )}
    </Card>
  );
}
