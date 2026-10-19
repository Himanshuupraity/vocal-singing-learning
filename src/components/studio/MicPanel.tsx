import type { useMicPitch } from '../../hooks/useMicPitch';
import { Alert, Button, inputClass } from '../ui';
import { MIC_ERROR_HELP } from '../../audio/mic';

/** Start/stop + permission/error/device UI shared by mic-based tools. */
export function MicPanel({ mic, purpose }: { mic: ReturnType<typeof useMicPitch>; purpose: string }) {
  if (mic.unsupported) return <Alert tone="danger" title="Microphone not available">{MIC_ERROR_HELP[mic.unsupported]}</Alert>;
  return (
    <div className="space-y-3">
      {mic.state !== 'on' && (
        <div className="rounded-xl bg-info-soft p-4 text-sm">
          <p className="font-medium text-text">This tool uses your microphone to {purpose}.</p>
          <p className="mt-1 text-muted">
            Audio is analysed live inside your browser and is never uploaded or saved. Headphones help, so the reference note doesn&apos;t leak back into the mic.
          </p>
          <Button className="mt-3" icon="mic" onClick={() => mic.start()} disabled={mic.state === 'starting'}>
            {mic.state === 'starting' ? 'Asking for permission…' : mic.state === 'error' ? 'Try the microphone again' : 'Turn on microphone'}
          </Button>
        </div>
      )}
      {mic.error && <Alert tone="danger" title="Microphone problem">{mic.error.message}</Alert>}
      {mic.deviceNotice && <Alert tone="warning">{mic.deviceNotice}</Alert>}
      {mic.state === 'on' && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 text-success">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> Mic on
          </span>
          {mic.devices.length > 1 && (
            <select aria-label="Microphone" className={`${inputClass} w-auto max-w-60`} value={mic.deviceId ?? ''} onChange={(e) => mic.chooseDevice(e.target.value)}>
              <option value="">Default microphone</option>
              {mic.devices.map((d, i) => (
                <option key={d.deviceId || i} value={d.deviceId}>
                  {d.label || `Microphone ${i + 1}`}
                </option>
              ))}
            </select>
          )}
          <Button size="sm" variant="ghost" onClick={mic.stop}>
            Turn off
          </Button>
        </div>
      )}
    </div>
  );
}
