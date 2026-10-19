import { ensureRunning } from './context';
import { analyzeFrame, OctaveSmoother, type PitchFrame } from './pitchAnalysis';
import { captureFrames } from './capture';

export type MicErrorKind = 'unsupported' | 'insecure' | 'denied' | 'not-found' | 'in-use' | 'disconnected' | 'unknown';

export class MicError extends Error {
  constructor(public kind: MicErrorKind, message: string) {
    super(message);
  }
}

export const MIC_ERROR_HELP: Record<MicErrorKind, string> = {
  unsupported: 'This browser cannot access the microphone. Please use a recent Chrome, Edge, Firefox or Safari.',
  insecure: 'Microphone access needs a secure page (https:// or localhost).',
  denied: 'Microphone permission was denied. Click the lock/site-settings icon in the address bar, allow the microphone, then try again.',
  'not-found': 'No microphone was found. Plug in a microphone or headset and try again.',
  'in-use': 'The microphone is being used by another app or tab. Close it and try again.',
  disconnected: 'The microphone was disconnected. Reconnect it and press Start again.',
  unknown: 'Could not start the microphone. Please try again.',
};

function toMicError(e: unknown): MicError {
  const name = (e as { name?: string })?.name;
  if (name === 'NotAllowedError' || name === 'SecurityError') return new MicError('denied', MIC_ERROR_HELP.denied);
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return new MicError('not-found', MIC_ERROR_HELP['not-found']);
  if (name === 'NotReadableError' || name === 'AbortError') return new MicError('in-use', MIC_ERROR_HELP['in-use']);
  return new MicError('unknown', MIC_ERROR_HELP.unknown);
}

export function micSupport(): MicErrorKind | null {
  if (typeof window === 'undefined') return 'unsupported';
  if (!window.isSecureContext) return 'insecure';
  if (!navigator.mediaDevices?.getUserMedia) return 'unsupported';
  return null;
}

export async function listInputDevices(): Promise<MediaDeviceInfo[]> {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  const all = await navigator.mediaDevices.enumerateDevices();
  return all.filter((d) => d.kind === 'audioinput');
}

export async function openMic(deviceId?: string): Promise<MediaStream> {
  const s = micSupport();
  if (s) throw new MicError(s, MIC_ERROR_HELP[s]);
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        // Browser voice processing distorts pitch; we disable it for analysis.
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
  } catch (e) {
    throw toMicError(e);
  }
}

export interface PitchTrackerHandle {
  stop: () => void;
  stream: MediaStream;
  sampleRate: number;
  frameDurSec: number;
}

/**
 * Opens the mic and calls onFrame ~20 times/second with a gated, octave-smoothed pitch frame.
 * Handles device unplug (track "ended") by calling onError('disconnected').
 */
export async function startPitchTracker(
  onFrame: (f: PitchFrame) => void,
  opts: { deviceId?: string; onError?: (e: MicError) => void; stream?: MediaStream } = {},
): Promise<PitchTrackerHandle> {
  const ctx = await ensureRunning();
  const stream = opts.stream ?? (await openMic(opts.deviceId));
  const src = ctx.createMediaStreamSource(stream);
  const smoother = new OctaveSmoother();
  const start = performance.now();
  let stopped = false;

  const stopCapture = await captureFrames(ctx, src, 2048, 50, (buf) => {
    if (stopped) return;
    const f = analyzeFrame(buf, ctx.sampleRate, (performance.now() - start) / 1000);
    if (f.status === 'voiced' && f.freq) f.freq = smoother.push(f.freq);
    else if (f.status === 'silent') smoother.reset();
    onFrame(f);
  });

  const track = stream.getAudioTracks()[0];
  const onEnded = () => {
    if (!stopped) opts.onError?.(new MicError('disconnected', MIC_ERROR_HELP.disconnected));
  };
  track?.addEventListener('ended', onEnded);

  return {
    stream,
    sampleRate: ctx.sampleRate,
    frameDurSec: 0.05,
    stop: () => {
      stopped = true;
      stopCapture();
      track?.removeEventListener('ended', onEnded);
      src.disconnect();
      if (!opts.stream) stream.getTracks().forEach((t) => t.stop());
    },
  };
}
