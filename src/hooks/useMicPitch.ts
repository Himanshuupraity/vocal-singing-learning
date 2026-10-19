import { useCallback, useEffect, useRef, useState } from 'react';
import { MicError, MIC_ERROR_HELP, listInputDevices, micSupport, startPitchTracker, type PitchTrackerHandle } from '../audio/mic';
import type { PitchFrame } from '../audio/pitchAnalysis';
import { useAppData } from '../state/AppData';

export type MicState = 'off' | 'starting' | 'on' | 'error';

/**
 * Microphone + pitch tracking lifecycle. Keeps the latest frame for display and
 * lets callers subscribe to every frame (for capturing attempts).
 */
export function useMicPitch() {
  const { data, update } = useAppData();
  const [state, setState] = useState<MicState>('off');
  const [error, setError] = useState<MicError | null>(null);
  const [frame, setFrame] = useState<PitchFrame | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceNotice, setDeviceNotice] = useState<string | null>(null);
  const handle = useRef<PitchTrackerHandle | null>(null);
  const listeners = useRef(new Set<(f: PitchFrame) => void>());
  const deviceId = data.settings.micDeviceId;

  const stop = useCallback(() => {
    handle.current?.stop();
    handle.current = null;
    setState('off');
    setFrame(null);
  }, []);

  const start = useCallback(
    async (id = deviceId) => {
      handle.current?.stop();
      setError(null);
      setState('starting');
      try {
        handle.current = await startPitchTracker(
          (f) => {
            setFrame(f);
            listeners.current.forEach((l) => l(f));
          },
          {
            deviceId: id,
            onError: (e) => {
              handle.current?.stop();
              handle.current = null;
              setError(e);
              setState('error');
            },
          },
        );
        setState('on');
        setDevices(await listInputDevices());
      } catch (e) {
        const err = e instanceof MicError ? e : new MicError('unknown', MIC_ERROR_HELP.unknown);
        // A saved device may have been unplugged: retry with the default device once.
        if (id && err.kind === 'not-found') {
          update((d) => void (d.settings.micDeviceId = undefined));
          return start(undefined);
        }
        setError(err);
        setState('error');
      }
    },
    [deviceId, update],
  );

  // React to plugging/unplugging devices.
  useEffect(() => {
    const md = navigator.mediaDevices;
    if (!md?.addEventListener) return;
    const onChange = async () => {
      const list = await listInputDevices();
      setDevices(list);
      if (handle.current) setDeviceNotice('Your audio devices changed. If the pitch display stops responding, choose your microphone again below.');
    };
    md.addEventListener('devicechange', onChange);
    return () => md.removeEventListener('devicechange', onChange);
  }, []);

  useEffect(() => () => handle.current?.stop(), []);

  const subscribe = useCallback((fn: (f: PitchFrame) => void) => {
    listeners.current.add(fn);
    return () => void listeners.current.delete(fn);
  }, []);

  const chooseDevice = useCallback(
    (id: string) => {
      update((d) => void (d.settings.micDeviceId = id || undefined));
      setDeviceNotice(null);
      if (handle.current) void start(id || undefined);
    },
    [start, update],
  );

  /** The live microphone stream while the mic is on (e.g. to record a snippet of it). */
  const getStream = useCallback(() => handle.current?.stream ?? null, []);

  return { state, error, frame, start, stop, subscribe, getStream, devices, chooseDevice, deviceId, deviceNotice, unsupported: micSupport() };
}
