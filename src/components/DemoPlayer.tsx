import { useEffect, useRef, useState } from 'react';
import type { AudioDemo } from '../curriculum/types';
import { playGlide, playSwara, playFreq } from '../audio/synth';
import { playSequence, type SequenceHandle } from '../audio/sequencer';
import { Drone } from '../audio/drone';
import { Metronome } from '../audio/metronome';
import { ensureRunning, isAudioSupported } from '../audio/context';
import { swaraLabel, swaraToFreq } from '../music/theory';
import { TAALS } from '../music/taal';
import { useAppData } from '../state/AppData';
import { Button, cx } from './ui';

/** One playable demonstration, always relative to the learner's Sa. */
export function DemoPlayer({ demo }: { demo: AudioDemo }) {
  const { data } = useAppData();
  const tonic = data.profile.tonic;
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(-1);
  const [err, setErr] = useState<string | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => () => stopRef.current?.(), []);

  const stop = () => {
    stopRef.current?.();
    stopRef.current = null;
    setPlaying(false);
    setActive(-1);
  };

  const play = async () => {
    if (!isAudioSupported()) return setErr('Audio playback is not supported in this browser.');
    setErr(null);
    stop();
    setPlaying(true);
    try {
      const after = (ms: number) => {
        const t = window.setTimeout(() => {
          setPlaying(false);
          setActive(-1);
        }, ms);
        return () => clearTimeout(t);
      };
      switch (demo.kind) {
        case 'note': {
          const d = demo.durationSec ?? 2;
          const s = await playSwara(demo.swara, tonic, d, data.settings.demoTimbre);
          const c = after(d * 1000);
          stopRef.current = () => (s(), c());
          break;
        }
        case 'compare': {
          const ctx = await ensureRunning();
          const a = swaraToFreq(demo.a, tonic)!;
          const b = swaraToFreq(demo.b, tonic)!;
          const t = ctx.currentTime + 0.05;
          setActive(0);
          const s1 = playFreq(a, { when: t, duration: 1.1, timbre: data.settings.demoTimbre });
          const s2 = playFreq(b, { when: t + 1.5, duration: 1.1, timbre: data.settings.demoTimbre });
          const t1 = window.setTimeout(() => setActive(1), 1550);
          const c = after(2700);
          stopRef.current = () => (s1(), s2(), clearTimeout(t1), c());
          break;
        }
        case 'glide': {
          const s = await playGlide(demo.from, demo.to, tonic, demo.durationSec);
          const c = after((demo.durationSec + 0.9) * 1000);
          stopRef.current = () => (s(), c());
          break;
        }
        case 'sequence': {
          const h: SequenceHandle = await playSequence(demo.notes, tonic, demo.bpm, { onNote: setActive, timbre: data.settings.demoTimbre });
          h.done.then(() => setPlaying(false));
          stopRef.current = h.stop;
          break;
        }
        case 'drone': {
          const dr = new Drone({ tonic, volume: data.settings.droneVolume, mode: 'tanpura', firstString: 'P', cycleSec: 4.5 });
          await dr.start();
          const c = after(12000);
          const t = window.setTimeout(() => dr.stop(), 12000);
          stopRef.current = () => (dr.stop(), clearTimeout(t), c());
          break;
        }
        case 'taal': {
          const taal = TAALS[demo.taal];
          const m = new Metronome({ bpm: demo.bpm, taal: demo.taal, beatsPerBar: 4, volume: 0.8, accentFirst: true, onBeat: (i) => setActive(i) });
          await m.start();
          const ms = ((demo.cycles ?? 2) * taal.matras * 60000) / demo.bpm;
          const t = window.setTimeout(() => m.stop(), ms);
          const c = after(ms + 100);
          stopRef.current = () => (m.stop(), clearTimeout(t), c());
          break;
        }
      }
    } catch (e) {
      setErr((e as Error).message || 'Could not play audio.');
      setPlaying(false);
    }
  };

  const chips: string[] =
    demo.kind === 'sequence' ? demo.notes.map(swaraLabel) : demo.kind === 'compare' ? [swaraLabel(demo.a), swaraLabel(demo.b)] : demo.kind === 'taal' ? TAALS[demo.taal].theka : [];

  return (
    <div className="rounded-xl border border-border bg-surface-2/50 p-3">
      <div className="flex items-center gap-3">
        <Button size="sm" variant={playing ? 'secondary' : 'primary'} icon={playing ? 'stop' : 'play'} onClick={playing ? stop : play} aria-label={`${playing ? 'Stop' : 'Play'}: ${demo.label}`}>
          {playing ? 'Stop' : 'Play'}
        </Button>
        <span className="text-sm">{demo.label}</span>
      </div>
      {chips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1" aria-hidden>
          {chips.map((c, i) => (
            <span key={i} className={cx('rounded-md px-1.5 py-0.5 font-mono text-xs transition-colors', active === i ? 'bg-primary text-on-primary' : 'bg-surface text-muted')}>
              {c}
            </span>
          ))}
        </div>
      )}
      {err && <p className="mt-2 text-xs text-danger">{err}</p>}
    </div>
  );
}
