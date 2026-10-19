import { useEffect, useRef, useState } from 'react';
import { playSequence, type SequenceHandle } from '../../audio/sequencer';
import { DICTATION_LEVELS, makeDictation, scoreDictation } from '../../music/dictation';
import { swaraLabel, type SwaraToken } from '../../music/theory';
import { useAppData } from '../../state/AppData';
import { uid } from '../../lib/dates';
import { Alert, Button, ProgressBar, cx, inputClass } from '../ui';

const BPM = 72;

/**
 * Sargam dictation: Sa plays, then a short phrase; the learner writes it down
 * by tapping the swaras. This is the core skill behind learning songs by ear.
 */
export function SargamDictation({ context, questions = 10, onComplete }: { context: string; questions?: number; onComplete?: (pct: number) => void }) {
  const { data, update } = useAppData();
  const [level, setLevel] = useState(0);
  const [q, setQ] = useState<ReturnType<typeof makeDictation> | null>(null);
  const [given, setGiven] = useState<SwaraToken[]>([]);
  const [n, setN] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof scoreDictation> | null>(null);
  const [finished, setFinished] = useState(false);
  const [playing, setPlaying] = useState(false);
  const h = useRef<SequenceHandle | null>(null);

  useEffect(() => () => h.current?.stop(), []);

  const play = async (notes: SwaraToken[], withSa = true) => {
    h.current?.stop();
    setPlaying(true);
    h.current = await playSequence(withSa ? ['S', '-', '-', ...notes] : notes, data.profile.tonic, BPM, { timbre: data.settings.demoTimbre });
    await h.current.done;
    setPlaying(false);
  };

  const ask = (lv = level) => {
    const nq = makeDictation(lv);
    setQ(nq);
    setGiven([]);
    setResult(null);
    void play(nq.notes);
  };

  const start = () => {
    setN(0);
    setCorrect(0);
    setFinished(false);
    ask();
  };

  const tap = (t: SwaraToken) => {
    if (!q || result) return;
    const g = [...given, t];
    setGiven(g);
    if (g.length < q.notes.length) return;
    const r = scoreDictation(q.notes, g);
    setResult(r);
    const c = correct + (r.allRight ? 1 : 0);
    setCorrect(c);
    if (n + 1 >= questions) {
      setFinished(true);
      update((d) => void d.earTests.push({ id: uid(), at: new Date().toISOString(), context, questions, correct: c, kind: 'dictation' }));
      onComplete?.(Math.round((c / questions) * 100));
    }
  };

  const next = () => {
    setN((x) => x + 1);
    ask();
  };

  const pct = Math.round((correct / questions) * 100);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">You’ll hear Sa, a short pause, then a few notes. Tap the swaras you heard, in order. This is how you learn a song by ear — start easy and move up a level when you score 80% or more.</p>
      <label className="block max-w-sm space-y-1.5 text-sm">
        <span className="font-medium">Level</span>
        <select
          className={inputClass}
          value={level}
          onChange={(e) => {
            setLevel(Number(e.target.value));
            setQ(null);
            setFinished(false);
          }}
        >
          {DICTATION_LEVELS.map((L, i) => (
            <option key={L.name} value={i}>
              {i + 1}. {L.name}
            </option>
          ))}
        </select>
      </label>

      {!q ? (
        <Button icon="ear" onClick={start}>
          Start {questions} phrases
        </Button>
      ) : (
        <div className="space-y-3 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>
              Phrase {Math.min(n + 1, questions)} of {questions}
            </span>
            <span>Fully right: {correct}</span>
          </div>
          <ProgressBar value={((n + (result ? 1 : 0)) / questions) * 100} label="Test progress" />

          <ol className="flex min-h-12 flex-wrap gap-1.5" aria-label="Your answer">
            {q.notes.map((t, i) => {
              const g = given[i];
              const ok = result?.perNote[i];
              return (
                <li key={i} className={cx('min-w-12 rounded-lg border px-2 py-2 text-center font-mono text-sm', !g ? 'border-dashed border-border text-muted' : !result ? 'border-primary bg-primary-soft text-primary' : ok ? 'border-success bg-success-soft text-success' : 'border-danger bg-danger-soft text-danger')}>
                  {g ? swaraLabel(g) : '?'}
                  {result && !ok && <span className="block text-[11px]">was {swaraLabel(t)}</span>}
                </li>
              );
            })}
          </ol>

          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Swaras">
            {q.choices.map((t) => (
              <button key={t} type="button" onClick={() => tap(t)} disabled={!!result} className="min-w-12 rounded-lg bg-surface-2 px-2 py-2 font-mono text-sm hover:bg-border disabled:opacity-50">
                {swaraLabel(t)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" icon="repeat" onClick={() => play(q.notes)} disabled={playing}>
              Play again
            </Button>
            {!result && given.length > 0 && (
              <Button size="sm" variant="ghost" onClick={() => setGiven((g) => g.slice(0, -1))}>
                Undo
              </Button>
            )}
            {result && (
              <Button size="sm" variant="ghost" icon="play" onClick={() => play(q.notes, false)} disabled={playing}>
                Hear the answer
              </Button>
            )}
            {result && !finished && (
              <Button size="sm" icon="arrow" onClick={next}>
                Next phrase
              </Button>
            )}
          </div>
          {result && !finished && <Alert tone={result.allRight ? 'success' : 'warning'}>{result.allRight ? 'All notes right!' : `${result.correct} of ${q.notes.length} notes right. Play the answer and sing it back once before moving on.`}</Alert>}
          {finished && (
            <Alert tone={pct >= 80 ? 'success' : 'info'} title={`${correct}/${questions} phrases fully right (${pct}%)`}>
              Saved to your progress.{' '}
              {pct >= 80 && level < DICTATION_LEVELS.length - 1 ? (
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    setLevel(level + 1);
                    setN(0);
                    setCorrect(0);
                    setFinished(false);
                    ask(level + 1);
                  }}
                >
                  Try level {level + 2}
                </button>
              ) : (
                <button type="button" className="underline" onClick={start}>
                  Practise this level again
                </button>
              )}
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
