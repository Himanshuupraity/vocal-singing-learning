import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../state/AppData';
import { exportData, importData } from '../storage/adapter';
import { defaultData, SESSION_LENGTHS, type Focus, type Language, type SessionLength } from '../storage/schema';
import { recordingStore } from '../storage/recordings';
import { useServerStatus } from '../hooks/useServerStatus';
import { Alert, Badge, Button, Card, Field, PageHeader, cx, inputClass } from '../components/ui';
import { TonicPicker } from '../components/TonicPicker';
import { SaFinder } from '../components/SaFinder';
import { buildReminderIcs } from '../lib/reminders';
import { SyncPanel } from '../components/SyncPanel';

export default function Settings() {
  const { data, update, replace } = useAppData();
  const status = useServerStatus();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ tone: 'success' | 'danger' | 'info'; text: string } | null>(null);
  const [confirm, setConfirm] = useState<'reset' | 'recordings' | null>(null);
  const [showFinder, setShowFinder] = useState(false);
  const p = data.profile;

  const doExport = () => {
    const blob = new Blob([exportData(data)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sursadhana-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setMsg({ tone: 'success', text: 'Progress exported. Keep the file somewhere safe. (Recordings are not included.)' });
  };

  const doImport = async (f: File) => {
    try {
      if (f.size > 5_000_000) throw new Error('That file is too large to be a SurSadhana export.');
      const r = importData(await f.text());
      replace(r.data);
      setMsg({ tone: 'success', text: `Progress imported.${r.warning ? ' ' + r.warning : ''}` });
    } catch (e) {
      setMsg({ tone: 'danger', text: (e as Error).message });
    }
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Preferences, your Sa, data controls and API status." />
      {msg && (
        <div className="mb-4">
          <Alert tone={msg.tone}>{msg.text}</Alert>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Preferences</h2>
          <div className="mt-4 space-y-4">
            <Field label="Name" htmlFor="s-name">
              <input id="s-name" className={inputClass} value={p.name} maxLength={40} onChange={(e) => update((d) => void (d.profile.name = e.target.value))} />
            </Field>
            <Field label="Explanation language" htmlFor="s-lang" hint="Lesson explanations are available in Hinglish, English and Hindi (हिन्दी).">
              <select id="s-lang" className={inputClass} value={p.language} onChange={(e) => update((d) => void (d.profile.language = e.target.value as Language))}>
                <option value="hinglish">Hinglish</option>
                <option value="english">English</option>
                <option value="hindi">Hindi (हिन्दी)</option>
              </select>
            </Field>
            <Field label="Daily practice goal" htmlFor="s-min">
              <select id="s-min" className={inputClass} value={p.dailyMinutes} onChange={(e) => update((d) => void (d.profile.dailyMinutes = Number(e.target.value) as SessionLength))}>
                {SESSION_LENGTHS.map((m) => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Focus" htmlFor="s-focus">
              <select id="s-focus" className={inputClass} value={p.focus} onChange={(e) => update((d) => void (d.profile.focus = e.target.value as Focus))}>
                <option value="both">Bollywood + classical foundations</option>
                <option value="bollywood">Mostly Bollywood singing</option>
                <option value="classical">Mostly classical foundations</option>
              </select>
            </Field>
            <Field label="Favourite songs / singers" htmlFor="s-fav">
              <input id="s-fav" className={inputClass} value={p.favoriteSongs} maxLength={300} onChange={(e) => update((d) => void (d.profile.favoriteSongs = e.target.value))} />
            </Field>
            <Field label="Sound for demos & sargam player" htmlFor="s-timbre" hint="Both are synthesized in your browser — the voice-like option imitates an “aa” vowel; it is not a recording of a singer.">
              <select id="s-timbre" className={inputClass} value={data.settings.demoTimbre} onChange={(e) => update((d) => void (d.settings.demoTimbre = e.target.value as 'reed' | 'voice'))}>
                <option value="reed">Harmonium-like reed</option>
                <option value="voice">Voice-like “aa”</option>
              </select>
            </Field>
            <fieldset>
              <legend className="text-sm font-medium">Theme</legend>
              <div className="mt-1.5 flex gap-2">
                {(['system', 'light', 'dark'] as const).map((t) => (
                  <button key={t} type="button" aria-pressed={data.settings.theme === t} onClick={() => update((d) => void (d.settings.theme = t))} className={cx('rounded-lg px-3 py-1.5 text-sm capitalize', data.settings.theme === t ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Your Sa (tonic)</h2>
          <p className="mt-1 text-sm text-muted">Every drone, demo and pitch target uses this note. It&apos;s a personal reference — not a voice-type label.</p>
          <div className="mt-3">
            <TonicPicker />
          </div>
          <Button className="mt-3" variant="secondary" size="sm" onClick={() => setShowFinder((x) => !x)}>
            {showFinder ? 'Hide Sa Finder' : 'Help me find a comfortable Sa'}
          </Button>
          {showFinder && (
            <div className="mt-3">
              <SaFinder />
            </div>
          )}
        </Card>

        <SyncPanel />

        <Card>
          <h2 className="font-semibold">Daily reminder</h2>
          <p className="mt-1 text-sm text-muted">Pick a practice time. While SurSadhana is open (or installed), you&apos;ll get a reminder if you haven&apos;t practised yet. For reminders even when the app is closed, add it to your phone&apos;s calendar.</p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <Field label="Reminder time" htmlFor="s-rem">
              <input
                id="s-rem"
                type="time"
                className={`${inputClass} w-36`}
                value={data.settings.reminderTime ?? ''}
                onChange={(e) => update((d) => void (d.settings.reminderTime = e.target.value || undefined))}
              />
            </Field>
            {data.settings.reminderTime && (
              <Button size="sm" variant="ghost" onClick={() => update((d) => void (d.settings.reminderTime = undefined))}>
                Turn off
              </Button>
            )}
          </div>
          {data.settings.reminderTime && (
            <div className="mt-3 flex flex-wrap gap-2">
              {'Notification' in window && Notification.permission !== 'granted' && (
                <Button
                  size="sm"
                  variant="secondary"
                  icon="info"
                  disabled={Notification.permission === 'denied'}
                  onClick={async () => {
                    const r = await Notification.requestPermission();
                    setMsg({ tone: r === 'granted' ? 'success' : 'info', text: r === 'granted' ? 'Notifications enabled.' : 'Notifications were not allowed — you’ll still see an in-app reminder.' })
                  }}
                >
                  {Notification.permission === 'denied' ? 'Notifications blocked in browser settings' : 'Allow notifications'}
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                icon="calendar"
                onClick={() => {
                  const blob = new Blob([buildReminderIcs(data.settings.reminderTime!, data.profile.dailyMinutes)], { type: 'text/calendar' });
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = 'sursadhana-riyaz-reminder.ics';
                  a.click();
                  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
                }}
              >
                Add to my calendar (.ics)
              </Button>
            </div>
          )}
          <p className="mt-3 text-xs text-muted">Install SurSadhana like an app: in Chrome/Edge use “Install app” in the address bar; on iPhone use Share → “Add to Home Screen”. Lessons and practice tools then work offline too.</p>
        </Card>

        <Card>
          <h2 className="font-semibold">Your data</h2>
          <Alert className="mt-3" tone="info">
            Progress is saved in <strong>this browser</strong> (localStorage). It survives refreshes and restarts, but not clearing site data or private browsing. To use it on other devices, create an account above — or export a backup file.
          </Alert>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button icon="download" variant="secondary" onClick={doExport}>
              Export my progress
            </Button>
            <Button icon="upload" variant="secondary" onClick={() => fileRef.current?.click()}>
              Import progress
            </Button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])} />
          </div>
          <div className="mt-6 space-y-3 border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium">Recordings</p>
              <p className="text-xs text-muted">Stored in this browser&apos;s IndexedDB; never uploaded. Consent: {data.settings.recordingConsent ? 'given' : 'not given'}.</p>
              {confirm === 'recordings' ? (
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={async () => {
                      try {
                        await recordingStore.clear();
                        setMsg({ tone: 'success', text: 'All recordings deleted.' });
                      } catch (e) {
                        setMsg({ tone: 'danger', text: (e as Error).message });
                      }
                      setConfirm(null);
                    }}
                  >
                    Yes, delete all recordings
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirm(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" icon="trash" onClick={() => setConfirm('recordings')}>
                    Delete saved recordings
                  </Button>
                  {data.settings.recordingConsent && (
                    <Button size="sm" variant="ghost" onClick={() => update((d) => void (d.settings.recordingConsent = false))}>
                      Withdraw recording consent
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">Reset learning data</p>
              <p className="text-xs text-muted">Deletes all lessons, results, sessions, songs and tutor history in this browser and restarts onboarding.</p>
              {confirm === 'reset' ? (
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      replace(defaultData());
                      setConfirm(null);
                    }}
                  >
                    Yes, erase everything
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirm(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button className="mt-2" size="sm" variant="secondary" icon="trash" onClick={() => setConfirm('reset')}>
                  Reset my learning data
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Features &amp; API status</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center justify-between gap-2">
              Server {status === null ? <Badge>checking…</Badge> : status.reachable ? <Badge tone="success">reachable</Badge> : <Badge tone="warning">not reachable</Badge>}
            </li>
            <li className="flex items-center justify-between gap-2">
              AI Vocal Tutor (Claude) {status?.tutor.configured ? <Badge tone="success">configured</Badge> : <Badge tone="warning">needs ANTHROPIC_API_KEY</Badge>}
            </li>
            <li className="flex items-center justify-between gap-2">
              YouTube live results {status?.youtube.configured ? <Badge tone="success">configured</Badge> : <Badge tone="warning">needs YOUTUBE_API_KEY</Badge>}
            </li>
            <li className="flex items-center justify-between gap-2">
              Song search (iTunes catalogue) {status?.reachable ? <Badge tone="success">available</Badge> : <Badge tone="warning">server needed</Badge>}
            </li>
            <li className="flex items-center justify-between gap-2">
              Lessons, riyaz, drone, pitch tools, recordings <Badge tone="success">work offline in the browser</Badge>
            </li>
          </ul>
          <p className="mt-3 text-xs text-muted">API keys live only in the server&apos;s <code>.env</code> file — never in the browser. See README for setup.</p>
          <label className="mt-4 flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-0.5" checked={data.settings.errorReports} onChange={(e) => update((d) => void (d.settings.errorReports = e.target.checked))} />
            <span>Send anonymous crash reports to the SurSadhana server (error message, page, browser — no personal data). <Link to="/privacy" className="text-primary underline">Privacy policy</Link></span>
          </label>
        </Card>
      </div>
    </>
  );
}
