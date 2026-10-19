import { useEffect, useRef, useState } from 'react';
import { openMic, MicError, MIC_ERROR_HELP, micSupport } from '../../audio/mic';
import { recordingStore, type RecordingEntry } from '../../storage/recordings';
import { useAppData } from '../../state/AppData';
import { uid } from '../../lib/dates';
import { Alert, Button, EmptyState, Field, inputClass } from '../ui';
import { RecordingAnalysisView } from './RecordingAnalysisView';

function pickMime() {
  const opts = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  return typeof MediaRecorder !== 'undefined' ? opts.find((m) => MediaRecorder.isTypeSupported?.(m)) ?? '' : '';
}

export function RecordingJournal({ defaultExercise = '' }: { defaultExercise?: string }) {
  const { data, update } = useAppData();
  const consent = data.settings.recordingConsent;
  const [list, setList] = useState<RecordingEntry[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [exercise, setExercise] = useState(defaultExercise);
  const rec = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const startedAt = useRef(0);
  const tick = useRef<number | null>(null);
  const urls = useRef(new Map<string, string>());

  const refresh = async () => {
    try {
      setList(await recordingStore.list());
      setLoadErr(null);
    } catch (e) {
      setLoadErr((e as Error).message);
    }
  };
  useEffect(() => {
    void refresh();
    const u = urls.current;
    return () => {
      u.forEach((x) => URL.revokeObjectURL(x));
      rec.current?.stream.getTracks().forEach((t) => t.stop());
      if (tick.current) clearInterval(tick.current);
    };
  }, []);

  const urlFor = (r: RecordingEntry) => {
    let u = urls.current.get(r.id);
    if (!u) {
      u = URL.createObjectURL(r.blob);
      urls.current.set(r.id, u);
    }
    return u;
  };

  const start = async () => {
    setErr(null);
    if (typeof MediaRecorder === 'undefined') return setErr('Recording is not supported in this browser.');
    const sup = micSupport();
    if (sup) return setErr(MIC_ERROR_HELP[sup]);
    try {
      const stream = await openMic(data.settings.micDeviceId);
      const mime = pickMime();
      const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunks.current = [];
      mr.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: mr.mimeType || 'audio/webm' });
        const dur = (performance.now() - startedAt.current) / 1000;
        try {
          await recordingStore.add({
            id: uid(),
            createdAt: new Date().toISOString(),
            label: label.trim() || `Practice ${new Date().toLocaleString()}`,
            exercise: exercise.trim(),
            notes: '',
            durationSec: Math.round(dur),
            mimeType: blob.type,
            sizeBytes: blob.size,
            blob,
          });
          setLabel('');
          await refresh();
        } catch (e) {
          setErr(`Could not save the recording: ${(e as Error).message}`);
        }
      };
      mr.start(1000);
      rec.current = mr;
      startedAt.current = performance.now();
      setElapsed(0);
      tick.current = window.setInterval(() => setElapsed(Math.round((performance.now() - startedAt.current) / 1000)), 500);
      setRecording(true);
    } catch (e) {
      setErr(e instanceof MicError ? e.message : 'Could not start recording.');
    }
  };

  const stop = () => {
    rec.current?.stop();
    rec.current = null;
    if (tick.current) clearInterval(tick.current);
    setRecording(false);
  };

  const remove = async (id: string) => {
    await recordingStore.remove(id);
    const u = urls.current.get(id);
    if (u) URL.revokeObjectURL(u);
    urls.current.delete(id);
    await refresh();
  };

  if (!consent) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recording Journal</h3>
        <Alert tone="info" title="Before you record">
          <ul className="list-disc space-y-1 pl-4">
            <li>Recordings use your microphone only while you press Record.</li>
            <li>They are saved <strong>only in this browser</strong> (IndexedDB on this device). They are never uploaded, shared or sent to the AI tutor.</li>
            <li>Clearing your browser data, or using private browsing, can delete them. You can delete any recording at any time, or all of them in Settings.</li>
          </ul>
        </Alert>
        <Button onClick={() => update((d) => void (d.settings.recordingConsent = true))}>I understand — enable the Recording Journal</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Recording Journal</h3>
        <p className="text-sm text-muted">Record, listen back kindly, and note what to improve. Stored only in this browser.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Label" htmlFor="rec-label">
          <input id="rec-label" className={inputClass} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Long Sa with drone" maxLength={80} />
        </Field>
        <Field label="Exercise" htmlFor="rec-ex">
          <input id="rec-ex" className={inputClass} value={exercise} onChange={(e) => setExercise(e.target.value)} placeholder="e.g. Alankar groups of 3" maxLength={80} />
        </Field>
      </div>
      <div className="flex items-center gap-3">
        {recording ? (
          <Button variant="danger" icon="stop" onClick={stop}>
            Stop ({elapsed}s)
          </Button>
        ) : (
          <Button icon="record" onClick={start}>
            Record
          </Button>
        )}
        {recording && (
          <span className="inline-flex items-center gap-2 text-sm text-danger" role="status">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-danger" /> Recording…
          </span>
        )}
      </div>
      {err && <Alert tone="danger">{err}</Alert>}
      {loadErr && <Alert tone="warning">Recordings can&apos;t be loaded: {loadErr}</Alert>}

      {list.length === 0 ? (
        <EmptyState icon="record" title="No recordings yet">
          Try recording 30 seconds of your current exercise, then listen back.
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {list.map((r) => (
            <li key={r.id} className="rounded-xl border border-border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{r.label}</p>
                  <p className="text-xs text-muted">
                    {new Date(r.createdAt).toLocaleString()} · {r.durationSec}s{r.exercise && ` · ${r.exercise}`}
                  </p>
                </div>
                <Button size="sm" variant="ghost" icon="trash" onClick={() => remove(r.id)} aria-label={`Delete recording ${r.label}`}>
                  Delete
                </Button>
              </div>
              <audio controls preload="none" src={urlFor(r)} className="mt-2 w-full" />
              <div className="mt-2">
                <RecordingAnalysisView blob={r.blob} />
              </div>
              <label className="mt-2 block text-xs text-muted">
                Notes
                <textarea
                  className={`${inputClass} mt-1`}
                  rows={2}
                  defaultValue={r.notes}
                  maxLength={1000}
                  placeholder="What went well? What will you try next time?"
                  onBlur={(e) => e.target.value !== r.notes && recordingStore.update(r.id, { notes: e.target.value })}
                />
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
