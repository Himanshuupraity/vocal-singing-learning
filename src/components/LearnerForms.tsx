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
  const [created, setCreated] = useState<{ name: string; code: string } | null>(null);
  const mismatch = pin2.length === 4 && pin !== pin2;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await account.create(name.trim(), pin);
      if (r.status === 201) {
        if (r.body.recoveryCode) setCreated({ name: r.body.name, code: r.body.recoveryCode });
        else {
          const outcome = await signIn(r.body.name);
          onDone?.(outcome);
        }
      } else setErr(r.body.message ?? 'Something went wrong.');
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (created) return <RecoveryCodeCard code={created.code} onDone={async () => {
          // Sign in first: optional chaining would skip signIn() entirely when there is no onDone.
          const outcome = await signIn(created.name);
          onDone?.(outcome);
        }} />;

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
  const [forgot, setForgot] = useState(false);

  if (forgot) return <RecoverPinForm profile={profile} onDone={onDone} onCancel={() => setForgot(false)} />;

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
      <button type="button" className="text-sm text-primary underline" onClick={() => setForgot(true)}>
        Forgot PIN?
      </button>
    </form>
  );
}

/** Forgot PIN: the recovery code (given when the name was saved) sets a new PIN. */
function RecoverPinForm({ profile, onDone, onCancel }: { profile: ProfileSummary; onDone?: (o: SyncOutcome | undefined) => void; onCancel: () => void }) {
  const signIn = useSignIn();
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [newCode, setNewCode] = useState<string | null>(null);
  const mismatch = pin2.length === 4 && pin !== pin2;

  if (newCode) return <RecoveryCodeCard code={newCode} replaced onDone={async () => {
          const outcome = await signIn(profile.name);
          onDone?.(outcome);
        }} />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await account.recover(profile.id, code, pin);
      if (r.status === 200 && r.body.recoveryCode) setNewCode(r.body.recoveryCode);
      else setErr(r.body.message ?? 'Could not reset the PIN.');
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={submit}>
      <p className="text-sm text-muted">Enter the recovery code you saved when you created “{profile.name}”, and choose a new PIN. Every other device will be signed out.</p>
      <Field label="Recovery code" htmlFor="rc-code" hint="Looks like ABCDE-FGHJK-MNPQR. Capitals and dashes don’t matter.">
        <input id="rc-code" className={`${inputClass} font-mono uppercase tracking-wider`} value={code} onChange={(e) => setCode(e.target.value.slice(0, 40))} autoComplete="off" autoFocus required />
      </Field>
      <div className="flex flex-wrap gap-4">
        <Field label="New PIN" htmlFor="rc-pin">
          <PinInput id="rc-pin" value={pin} onChange={setPin} />
        </Field>
        <Field label="Type the new PIN again" htmlFor="rc-pin2">
          <PinInput id="rc-pin2" value={pin2} onChange={setPin2} />
        </Field>
      </div>
      {mismatch && <p className="text-sm text-danger">The two PINs don’t match.</p>}
      {err && <Alert tone="danger">{err}</Alert>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={busy || code.replace(/[^A-Za-z0-9]/g, '').length < 15 || pin.length !== 4 || pin !== pin2}>
          {busy ? 'Please wait…' : 'Set new PIN'}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Back
        </Button>
      </div>
    </form>
  );
}

/**
 * Shows a recovery code once, with ways to keep it. The server stores only a
 * hash of it, so this is the only time it can be seen.
 */
export function RecoveryCodeCard({ code, replaced, onDone, doneLabel = 'I’ve saved it — continue' }: { code: string; replaced?: boolean; onDone: () => void; doneLabel?: string }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  const download = () => {
    const blob = new Blob([`SurSadhana recovery code\n\n${code}\n\nUse it on the PIN screen ("Forgot PIN?") to set a new PIN. Keep it private.\n`], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sursadhana-recovery-code.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="space-y-3">
      <Alert tone="warning" title={replaced ? 'Your PIN is changed — here is your new recovery code' : 'Save your recovery code'}>
        If you ever forget your PIN, this code lets you set a new one. It is shown <strong>only now</strong>
        {replaced ? ' (your old code no longer works)' : ''}. Write it down, take a screenshot or download it.
      </Alert>
      <p className="select-all rounded-xl bg-surface-2 p-4 text-center font-mono text-2xl tracking-widest" aria-label={`Recovery code ${code.split('').join(' ')}`}>
        {code}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button size="sm" variant="secondary" icon="download" onClick={download}>
          Download
        </Button>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} /> I’ve saved my recovery code
      </label>
      <Button onClick={onDone} disabled={!saved}>
        {doneLabel}
      </Button>
    </div>
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
