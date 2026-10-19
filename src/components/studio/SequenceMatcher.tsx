import { useEffect, useRef, useState } from 'react';
import { useMicPitch } from '../../hooks/useMicPitch';
import { scoreAttempt, type AttemptResult, type PitchFrame } from '../../audio/pitchAnalysis';
import { playSequence } from '../../audio/sequencer';
import { swaraLabel, swaraToFreq, type SwaraToken } from '../../music/theory';
import { useAppData } from '../../state/AppData';
import { pitchRecord } from '../../lib/record';
import { Alert, Button, cx } from '../ui';
import { MicPanel } from './MicPanel';

const NOTE_SEC = 1.6;

/**
 * Guided multi-note matching (intervals and short sequences).
 * The reference plays, then each note gets its own timed window, so every
 * note is scored separately with the same reliable-frame rules as single notes.
 */
export function SequenceMatcher({ generate, context, tolerance = 50, label, onRound }: { generate: () => SwaraToken[]; context: string; tolerance?: number; label: string; onRound?: (results: AttemptResult[]) => void }) {
  const { data, update } = useAppData();
  const tonic = data.profile.tonic;
  const mic = useMicPitch();
  const [seq, setSeq] = useState<SwaraToken[]>(() => generate());
  const [phase, setPhase] = useState<'ready' | 'reference' | 'singing' | 'result'>('ready');
  const [active, setActive] = useState(-1);
  const [results, setResults] = useState<AttemptResult[]>([]);
  const windows = useRef<PitchFrame[][]>([]);
  const cur = useRef(-1);
  const timers = useRef<number[]>([]);

  useEffect(() => mic.subscribe((f) => {
    if (cur.current >= 0) windows.current[cur.current]?.push(f);
  }), [mic]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const playRef = async () => {
    setPhase('reference');
    const h = await playSequence(seq, tonic, 60 / 1.1, { onNote: setActive, timbre: 'pure' });
    await h.done;
    setActive(-1);
  };

  const start = async () => {
    if (mic.state !== 'on') await mic.start();
    setResults([]);
    await playRef();
    windows.current = seq.map(() => []);
    setPhase('singing');
    seq.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => {
          cur.current = i;
          setActive(i);
        }, 800 + i * NOTE_SEC * 1000),
      );
    });
    timers.current.push(window.setTimeout(finish, 800 + seq.length * NOTE_SEC * 1000));
  };

  const finish = () => {
    cur.current = -1;
    setActive(-1);
    const rs = seq.map((t, i) => scoreAttempt(windows.current[i], swaraToFreq(t, tonic)!, tolerance, 0.05));
    setResults(rs);
    setPhase('result');
    update((d) => {
      rs.forEach((r, i) => r.voicedFrames > 0 && d.pitchAttempts.push(pitchRecord(r, seq[i], tonic, context)));
    });
    onRound?.(rs);
  };

  const next = () => {
    setSeq(generate());
    setResults([]);
    setPhase('ready');
  };

  const matched = results.filter((r) => r.matched).length;

  return (
    <div className="space-y-4">
      <MicPanel mic={mic} purpose="detect each note you sing" />
      <div className="rounded-2xl border border-border p-4">
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <ol className="mt-2 flex flex-wrap gap-2" aria-label="Notes to sing">
          {seq.map((t, i) => {
            const r = results[i];
            return (
              <li key={i} className={cx('min-w-14 rounded-xl px-3 py-2 text-center font-mono text-lg transition-all', active === i ? 'scale-110 bg-primary text-on-primary' : r ? (r.matched ? 'bg-success-soft text-success' : r.reliable ? 'bg-danger-soft text-danger' : 'bg-surface-2 text-muted') : 'bg-surface-2')}>
                {swaraLabel(t)}
                {r && <span className="block text-[11px]">{r.reliable ? `${r.medianCents > 0 ? '+' : ''}${Math.round(r.medianCents)}¢` : 'unclear'}</span>}
              </li>
            );
          })}
        </ol>
        <p className="mt-3 min-h-6 text-sm" aria-live="polite">
          {phase === 'ready' && 'Listen to the whole pattern, then sing each note when it lights up.'}
          {phase === 'reference' && 'Listen…'}
          {phase === 'singing' && active >= 0 && <strong className="text-primary">Sing {swaraLabel(seq[active])} now ({active + 1}/{seq.length})</strong>}
          {phase === 'singing' && active < 0 && 'Get ready…'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" icon="play" onClick={playRef} disabled={phase === 'singing' || phase === 'reference'}>
            Hear pattern
          </Button>
          <Button icon="mic" onClick={start} disabled={phase === 'singing' || phase === 'reference' || !!mic.unsupported}>
            {phase === 'result' ? 'Try again' : 'Start'}
          </Button>
          {phase === 'result' && (
            <Button variant="ghost" icon="arrow" onClick={next}>
              New pattern
            </Button>
          )}
        </div>
      </div>
      {phase === 'result' && (
        <Alert tone={matched === seq.length ? 'success' : 'info'} title={`${matched} of ${seq.length} notes matched`}>
          {results.some((r) => !r.reliable) && 'Some notes were too short or unclear to measure — hold each note for the whole highlighted time. '}
          {results.map((r, i) => (r.reliable && !r.matched ? `${swaraLabel(seq[i])} was ${Math.abs(Math.round(r.medianCents))} cents ${r.medianCents < 0 ? 'flat' : 'sharp'}. ` : '')).join('')}
          {matched === seq.length && 'Every note in tune — well done!'}
        </Alert>
      )}
    </div>
  );
}
