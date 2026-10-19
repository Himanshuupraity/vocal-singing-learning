import { useEffect, useRef, useState } from 'react';
import { Drone, type FirstString } from '../audio/drone';
import { useAppData } from '../state/AppData';

/** A tanpura that follows the learner's Sa, for tools that sing over a drone. */
export function useDrone(firstString: FirstString = 'P') {
  const { data } = useAppData();
  const tonic = data.profile.tonic;
  const volume = data.settings.droneVolume * 0.7;
  const ref = useRef<Drone | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => () => ref.current?.stop(), []);
  useEffect(() => {
    if (ref.current?.playing) void ref.current.update({ tonic, firstString });
  }, [tonic, firstString]);
  useEffect(() => ref.current?.setVolume(volume), [volume]);

  const stop = () => {
    ref.current?.stop();
    setOn(false);
  };
  const toggle = async () => {
    if (on) return stop();
    ref.current = new Drone({ tonic, volume, mode: 'tanpura', firstString, cycleSec: 4.5 });
    await ref.current.start();
    setOn(true);
  };
  return { on, toggle, stop };
}
