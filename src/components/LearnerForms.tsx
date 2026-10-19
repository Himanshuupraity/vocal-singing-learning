import { useState } from 'react';
import { useAppData } from '../state/AppData';
import { useSync } from '../hooks/useSync';
import { account, type ProfileSummary, type SyncOutcome } from '../lib/sync';
import { Alert, Button, Field, inputClass } from './ui';

const onlyDigits = (v: string) => v.replace(/\D/g, '').slice(0, 4);

function PinInput({ id, value, onChange, autoFocus }: { id: string; value: string; onChange: (v: string) => void; autoFocus?: boolean }) {
  return (
    <input
      id={id}
      type="password"
      inputMode="numeric"
      autoComplete="off"
      pattern="\d{4}"
      maxLength={4}
      className={`${inputClass} max-w-[10rem] text-center text-lg tracking-[0.5em]`}
      value={value}
      onChange={(e) => onChange(onlyDigits(e.target.value))}
      autoFocus={autoFocus}
      required
    />
  );
}

export function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?';
}

/** After the server accepts a name + PIN: remember the learner here and sync straight away. */
function useSignIn() {
  const { data } = useAppData();
  const sync = useSync();
  return async (name: string): Promise<SyncOutcome | undefined> => {
    sync.signedIn(name);
    return sync.run(data);
  };
}

/** Creates a learner profile and saves this device's progress under it. */
export function NewLearnerForm({ initialName = '', persistent = true, onDone, onCancel }: { initialName?: string; persistent?: boolean; onDone?: (o: SyncOutcome | undefined) => void; onCancel?: () => void }) {
  const signIn = useSignIn();
  const [name, setName] = useState(initialName);
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const mismatch = pin2.length === 4 && pin !== pin2;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await account.create(name.trim(), pin);
      if (r.status === 201) {
        const outcome = await signIn(r.body.name);
        onDone?.(outcome);
      }
      else setErr(r.body.message ?? 'Something went wrong.');
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={submit}>
      {!persistent && (
        <Alert tone="warning" title="This server can’t keep learners yet">
          Names and progress saved now may disappear. The site owner needs to connect a database (DATABASE_URL).
        </Alert>
      )}
      <Field label="Your name" htmlFor="nl-name" hint="This is shown on the welcome screen of every device.">
        <input id="nl-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={30} autoComplete="given-name" required />
      </Field>
      <div className="flex flex-wrap gap-4">
        <Field label="Choose a 4-digit PIN" htmlFor="nl-pin">
          <PinInput id="nl-pin" value={pin} onChange={setPin} />
        </Field>
        <Field label="Type the PIN again" htmlFor="nl-pin2">
          <PinInput id="nl-pin2" value={pin2} onChange={setPin2} />
        </Field>
      </div>
      <p className="text-xs text-muted">You’ll need this PIN to open your progress on another device. Don’t use your bank or phone PIN.</p>
      {mismatch && <p className="text-sm text-danger">The two PINs don’t match.</p>}
      {err && <Alert tone="danger">{err}</Alert>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={busy || !name.trim() || pin.length !== 4 || pin !== pin2}>
          {busy ? 'Please wait…' : 'Save my progress'}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Back
          </Button>
        )}
      </div>
    </form>
  );
}

/** Opens an existing learner on this device with their PIN. */
export function UnlockForm({ profile, onDone, onCancel }: { profile: ProfileSummary; onDone?: (o: SyncOutcome | undefined) => void; onCancel?: () => void }) {
  const signIn = useSignIn();
  const [pin, setPin] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await account.unlock(profile.id, pin);
      if (r.status === 200) {
        const outcome = await signIn(r.body.name);
        onDone?.(outcome);
      }
      else {
        setErr(r.body.message ?? 'Could not open this learner.');
        setPin('');
      }
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={submit}>
      <Field label={`PIN for ${profile.name}`} htmlFor="ul-pin">
        <PinInput id="ul-pin" value={pin} onChange={setPin} autoFocus />
      </Field>
      {err && <Alert tone="danger">{err}</Alert>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={busy || pin.length !== 4}>
          {busy ? 'Opening…' : 'Open my progress'}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Back
          </Button>
        )}
      </div>
    </form>
  );
}

export function ProfileButton({ profile, onClick }: { profile: ProfileSummary; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3 text-left transition-colors hover:border-primary hover:bg-primary-soft">
      <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary font-semibold text-on-primary">
        {initials(profile.name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-medium">{profile.name}</span>
        <span className="block text-xs text-muted">{profile.lastActive ? `Last practised ${new Date(profile.lastActive).toLocaleDateString()}` : 'No progress saved yet'}</span>
      </span>
    </button>
  );
}

/** Changes the signed-in learner's PIN. Other devices then need the new PIN. */
export function ChangePinForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [current, setCurrent] = useState('');
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const mismatch = pin2.length === 4 && pin !== pin2;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await account.changePin(current, pin);
      if (r.status === 204) onDone();
      else {
        setErr(r.body.message ?? 'Could not change the PIN.');
        setCurrent('');
      }
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="space-y-3 rounded-xl border border-border p-3" onSubmit={submit}>
      <Field label="Current PIN" htmlFor="cp-current">
        <PinInput id="cp-current" value={current} onChange={setCurrent} autoFocus />
      </Field>
      <div className="flex flex-wrap gap-4">
        <Field label="New PIN" htmlFor="cp-new">
          <PinInput id="cp-new" value={pin} onChange={setPin} />
        </Field>
        <Field label="Type the new PIN again" htmlFor="cp-new2">
          <PinInput id="cp-new2" value={pin2} onChange={setPin2} />
        </Field>
      </div>
      {mismatch && <p className="text-sm text-danger">The two new PINs don’t match.</p>}
      {err && <Alert tone="danger">{err}</Alert>}
      <p className="text-xs text-muted">Other phones or laptops signed in as you will be asked for the new PIN.</p>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" disabled={busy || current.length !== 4 || pin.length !== 4 || pin !== pin2}>
          {busy ? 'Saving…' : 'Change PIN'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
