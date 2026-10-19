import { useId } from 'react';
import { TONIC_CHOICES, tonicLabel, midiToFreq, tonicMidi, type Tonic } from '../music/theory';
import { useAppData } from '../state/AppData';
import { inputClass } from './ui';

export function useTonic(): [Tonic, (t: Tonic) => void] {
  const { data, update } = useAppData();
  return [
    data.profile.tonic,
    (t) =>
      update((d) => {
        d.profile.tonic = t;
        d.profile.tonicSource = 'chosen';
      }),
  ];
}

export function TonicPicker({ label = 'Your Sa (tonic)', compact }: { label?: string; compact?: boolean }) {
  const [tonic, setTonic] = useTonic();
  const id = useId();
  return (
    <div className={compact ? 'flex items-center gap-2' : 'space-y-1.5'}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        className={`${inputClass} ${compact ? 'w-auto' : ''}`}
        value={tonicLabel(tonic)}
        onChange={(e) => {
          const t = TONIC_CHOICES.find((x) => tonicLabel(x) === e.target.value);
          if (t) setTonic(t);
        }}
      >
        {TONIC_CHOICES.map((t) => (
          <option key={tonicLabel(t)} value={tonicLabel(t)}>
            {tonicLabel(t)} ({Math.round(midiToFreq(tonicMidi(t)))} Hz)
          </option>
        ))}
      </select>
    </div>
  );
}
