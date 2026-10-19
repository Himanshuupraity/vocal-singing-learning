import { useEffect, useRef, useState } from 'react';
import { WARMUPS, routineSeconds, type WarmupRoutine, type WarmupStep } from '../../data/warmups';
import { Drone } from '../../audio/drone';
import { playSequence, type SequenceHandle } from '../../audio/sequencer';
import { playFreq, playGlide } from '../../audio/synth';
import { ensureRunning } from '../../audio/context';
import { useAppData } from '../../state/AppData';
import type { Language } from '../../storage/schema';
import { Alert, Button, ProgressBar, cx } from '../ui';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;

/** Speaks a cue in the learner's language when the device has a Hindi voice; otherwise in English. */
function speak(step: WarmupStep, lang: Language) {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  const hindi = lang !== 'english' && voices.some((v) => v.lang.toLowerCase().startsWith('hi'));
  const u = new SpeechSynthesisUtterance(hindi ? step.say[lang] : step.say.english);
  u.lang = hindi ? 'hi-IN' : 'en-IN';
  u.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/**
 * Guided warm-up / cool-down: one step at a time with a timer, spoken cues,
 * and a sound to follow (tanpura, a soft note pattern on Sa, or a siren slide).
 */
export function WarmUp({ initialRoutine = 'standard', onDone }: { initialRoutine?: WarmupRoutine['id']; onDone?: () => void }) {
  const { data } = useAppData();
  const lang = data.profile.language;
  const tonic = data.profile.tonic;
  const [routineId, setRoutineId] = useState<WarmupRoutine['id']>(initialRoutine);
  const routine = WARMUPS.find((r) => r.id === routineId)!;
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(routine.steps[0].sec);
  const [done, setDone] = useState(false);
  const [voice, setVoice] = useState(true);
  const [sound, setSound] = useState(true);
  const step = routine.steps[idx];
  const elapsedInStep = step.sec - left;
  const voiceRef = useRef(voice);
  voiceRef.current = voice;

  useEffect(() => {
    setRunning(false);
    setIdx(0);
    setLeft(WARMUPS.find((r) => r.id === routineId)!.steps[0].sec);
    setDone(false);
  }, [routineId]);

  // The clock: move to the next step when a step's time is up.
  useEffect(() => {
    if (!running || paused) return;
    const iv = window.setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(iv);
  }, [running, paused]);
  useEffect(() => {
    if (!running || left > 0) return;
    playFreq(880, { duration: 0.25, timbre: 'pure', volume: 0.15 });
    if (idx + 1 < routine.steps.length) {
      setIdx(idx + 1);
      setLeft(routine.steps[idx + 1].sec);
    } else {
      setRunning(false);
      setDone(true);
      onDone?.();
    }
  }, [left, running, idx, routine, onDone]);

  // Spoken cue at the start of each step.
  useEffect(() => {
    if (running && voiceRef.current) speak(step, lang);
  }, [running, idx, step, lang]);

  // The sound to follow during the step.
  useEffect(() => {
    if (!running || paused || !sound) return;
    const g = step.guide;
    let alive = true;
    const live: { seq: SequenceHandle | null; drone: Drone | null } = {
      seq: null,
      drone: null,
    };
    const timers: number[] = [];
    const stops: (() => void)[] = [];
    const withDrone = async () => {
      live.drone = new Drone({
        tonic,
        volume: data.settings.droneVolume * 0.5,
        mode: 'tanpura',
        firstString: 'P',
        cycleSec: 4.5,
      });
      await live.drone.start();
    };
    void (async () => {
      await ensureRunning();
      if (!alive) return;
      if (g.kind === 'drone') await withDrone();
      if (g.kind === 'pattern') {
        await withDrone();
        live.seq = await playSequence(g.notes, tonic, g.bpm, {
          loop: true,
          timbre: 'reed',
        });
      }
      if (g.kind === 'siren') {
        const once = async () => {
          if (!alive) return;
          stops.push(await playGlide(g.from, g.to, tonic, g.sec));
          timers.push(window.setTimeout(async () => alive && stops.push(await playGlide(g.to, g.from, tonic, g.sec)), (g.sec + 0.9) * 1000));
          timers.push(window.setTimeout(once, (g.sec + 0.9) * 2000 + 1200));
        };
        void once();
      }
      if (!alive) {
        live.seq?.stop();
        live.drone?.stop();
      }
    })();
    return () => {
      alive = false;
      live.seq?.stop();
      live.drone?.stop();
      timers.forEach(clearTimeout);
      stops.forEach((s) => s());
    };
  }, [running, paused, sound, idx, step, tonic, data.settings.droneVolume]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const total = routineSeconds(routine);
  const doneSec = routine.steps.slice(0, idx).reduce((s, x) => s + x.sec, 0) + elapsedInStep;
  const breath = step.guide.kind === 'breath' ? step.guide : null;
  const inPhase = breath ? elapsedInStep % (breath.inSec + breath.outSec) < breath.inSec : false;

  const start = () => {
    setIdx(0);
    setLeft(routine.steps[0].sec);
    setDone(false);
    setPaused(false);
    setRunning(true);
  };
  const go = (to: number) => {
    if (to < 0) return;
    if (to >= routine.steps.length) return setLeft(0);
    setIdx(to);
    setLeft(routine.steps[to].sec);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Guided Warm-up</h3>
        <p className="text-sm text-muted">Follow along, step by step. Everything is soft and easy — a warm voice sings in tune more easily and doesn’t get tired. Stop if anything feels tight or painful.</p>
      </div>

      {running ? (
        <p className="text-sm font-medium">{routine.name}</p>
      ) : (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Routine">
          {WARMUPS.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={r.id === routineId}
              onClick={() => setRoutineId(r.id)}
              className={cx('rounded-xl px-3 py-2 text-left text-sm', r.id === routineId ? 'bg-primary text-on-primary' : 'bg-surface-2 hover:bg-border')}
            >
              <span className="block font-medium">{r.name}</span>
              <span className={cx('block text-xs', r.id === routineId ? 'opacity-90' : 'text-muted')}>{r.description}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={voice} onChange={(e) => setVoice(e.target.checked)} /> Speak the instructions
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /> Play guide sounds (tanpura, notes, slides)
        </label>
      </div>

      {done ? (
        <Alert tone="success" title={routine.id === 'cooldown' ? 'Cool-down done' : 'Warm-up done — your voice is ready'}>
          {routine.id === 'cooldown' ? 'Rest your voice for a while and drink some water.' : 'Now go on to your riyaz.'}{' '}
          <button type="button" className="underline" onClick={start}>
            Do it again
          </button>
        </Alert>
      ) : (
        <div className="space-y-4 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>
              Step {idx + 1} of {routine.steps.length}
            </span>
            <span className="tabular-nums">
              {fmt(doneSec)} / {fmt(total)}
            </span>
          </div>
          <ProgressBar value={(doneSec / total) * 100} label="Warm-up progress" />
          <div className="flex flex-wrap items-center gap-6">
            {breath && running ? (
              <div className="grid h-36 w-36 shrink-0 place-items-center" aria-live="polite">
                <div
                  className={cx('grid place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary transition-all ease-in-out', inPhase ? 'h-36 w-36' : 'h-16 w-16')}
                  style={{
                    transitionDuration: `${(inPhase ? breath.inSec : breath.outSec) * 1000}ms`,
                  }}
                >
                  {inPhase ? 'In' : 'Out… sss'}
                </div>
              </div>
            ) : (
              <p className={cx('font-mono text-5xl font-semibold tabular-nums', left <= 5 && running && 'text-primary')} aria-live="off">
                {fmt(running ? left : step.sec)}
              </p>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-xl font-semibold">{step.title[lang]}</h4>
              <p className="mt-1">{step.how[lang]}</p>
              {breath && running && <p className="mt-1 text-sm text-muted">{fmt(left)} left in this step</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {!running ? (
              <Button size="lg" icon="play" onClick={start}>
                Start {routine.name.toLowerCase()}
              </Button>
            ) : (
              <>
                <Button variant="secondary" icon={paused ? 'play' : 'pause'} onClick={() => setPaused((p) => !p)}>
                  {paused ? 'Resume' : 'Pause'}
                </Button>
                <Button variant="ghost" icon="back" onClick={() => go(idx - 1)} disabled={idx === 0}>
                  Back
                </Button>
                <Button variant="ghost" icon="skip" onClick={() => go(idx + 1)}>
                  {idx + 1 === routine.steps.length ? 'Finish' : 'Next step'}
                </Button>
              </>
            )}
          </div>
          <ol className="space-y-1 text-sm" aria-label="Steps">
            {routine.steps.map((s, i) => (
              <li key={s.id + i} className={cx('flex justify-between gap-2', i === idx && running ? 'font-semibold text-primary' : i < idx && running ? 'text-muted line-through' : 'text-muted')}>
                <span>
                  {i + 1}. {s.title[lang]}
                </span>
                <span className="tabular-nums">{fmt(s.sec)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      <p className="text-xs text-muted">
        Guide sounds follow your Sa. Spoken instructions use your device’s voice
        {lang !== 'english' ? ' (Hindi if your phone has a Hindi voice, otherwise English)' : ''}.
      </p>
    </div>
  );
}
