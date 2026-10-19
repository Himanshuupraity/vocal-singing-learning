import { useState } from 'react';
import { playPair } from '../../audio/synth';
import { midiToFreq, tonicMidi } from '../../music/theory';
import { useAppData } from '../../state/AppData';
import { uid } from '../../lib/dates';
import { Alert, Button, ProgressBar, cx } from '../ui';

type Kind = 'same-different' | 'higher-lower';
interface Q {
  a: number;
  b: number;
  answer: 'same' | 'different' | 'higher' | 'lower';
}

/** Gap in semitones (as a fraction) — adapts to performance for higher/lower. */
function makeQ(kind: Kind, baseMidi: number, difficulty: number): Q {
  const root = baseMidi + Math.floor(Math.random() * 8);
  if (kind === 'same-different') {
    const same = Math.random() < 0.45;
    const gap = same ? 0 : (Math.random() < 0.5 ? -1 : 1) * Math.max(0.5, [3, 2, 1, 1, 0.5][Math.min(4, difficulty)]);
    return { a: midiToFreq(root), b: midiToFreq(root + gap), answer: same ? 'same' : 'different' };
  }
  const gap = Math.max(1, [5, 4, 3, 2, 1][Math.min(4, difficulty)]);
  const up = Math.random() < 0.5;
  return { a: midiToFreq(root), b: midiToFreq(root + (up ? gap : -gap)), answer: up ? 'higher' : 'lower' };
}

export function EarTraining({ context = 'studio', initialKind = 'same-different', questions = 10, onComplete, lockKind }: { context?: string; initialKind?: Kind; questions?: number; onComplete?: (pct: number) => void; lockKind?: boolean }) {
  const { data, update } = useAppData();
  const base = tonicMidi(data.profile.tonic);
  const [kind, setKind] = useState<Kind>(initialKind);
  const [n, setN] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [q, setQ] = useState<Q | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [finished, setFinished] = useState(false);
  const [playing, setPlaying] = useState(false);

  const play = async (question = q) => {
    if (!question) return;
    setPlaying(true);
    const p = await playPair(question.a, question.b);
    window.setTimeout(() => setPlaying(false), 2300);
    return p;
  };

  const startNew = () => {
    setN(0);
    setCorrect(0);
    setFinished(false);
    setFeedback(null);
    const nq = makeQ(kind, base, 0);
    setQ(nq);
    void play(nq);
  };

  const answer = (a: Q['answer']) => {
    if (!q || feedback) return;
    const ok = a === q.answer;
    const c = correct + (ok ? 1 : 0);
    setCorrect(c);
    const cents = Math.round(1200 * Math.log2(q.b / q.a));
    setFeedback({ ok, text: ok ? `Correct — ${q.answer === 'same' ? 'they were the same note' : `the gap was ${Math.abs(cents)} cents`}.` : `Not this time — the answer was “${q.answer}”${cents ? ` (gap ${Math.abs(cents)} cents)` : ''}. Listen again, then continue.` });
    const done = n + 1 >= questions;
    if (done) {
      setFinished(true);
      const pct = Math.round((c / questions) * 100);
      update((d) => void d.earTests.push({ id: uid(), at: new Date().toISOString(), context, questions, correct: c, kind }));
      onComplete?.(pct);
    }
  };

  const next = () => {
    const difficulty = Math.floor((correct / Math.max(1, n + 1)) * 4);
    const nq = makeQ(kind, base, difficulty);
    setN((x) => x + 1);
    setQ(nq);
    setFeedback(null);
    void play(nq);
  };

  const opts: Q['answer'][] = kind === 'same-different' ? ['same', 'different'] : ['higher', 'lower'];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Ear Training</h3>
        <p className="text-sm text-muted">Listening carefully comes before singing in tune. Two notes play — answer the question.</p>
      </div>
      {!lockKind && (
        <div className="flex gap-2">
          {(['same-different', 'higher-lower'] as Kind[]).map((k) => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => (setKind(k), setQ(null), setFinished(false))} className={cx('rounded-lg px-3 py-1.5 text-sm', kind === k ? 'bg-primary text-on-primary' : 'bg-surface-2')}>
              {k === 'same-different' ? 'Same or different?' : 'Higher or lower?'}
            </button>
          ))}
        </div>
      )}
      {!q ? (
        <Button icon="ear" onClick={startNew}>
          Start {questions} questions
        </Button>
      ) : (
        <div className="space-y-3 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>
              Question {Math.min(n + 1, questions)} of {questions}
            </span>
            <span>Score: {correct}</span>
          </div>
          <ProgressBar value={((n + (feedback ? 1 : 0)) / questions) * 100} label="Test progress" />
          <p className="font-medium">{kind === 'same-different' ? 'Were the two notes the same or different?' : 'Was the second note higher or lower than the first?'}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" icon="repeat" onClick={() => play()} disabled={playing}>
              Play again
            </Button>
            {opts.map((o) => (
              <Button key={o} onClick={() => answer(o)} disabled={!!feedback} className="capitalize">
                {o}
              </Button>
            ))}
          </div>
          {feedback && <Alert tone={feedback.ok ? 'success' : 'warning'}>{feedback.text}</Alert>}
          {feedback && !finished && (
            <Button variant="ghost" icon="arrow" onClick={next}>
              Next question
            </Button>
          )}
          {finished && (
            <Alert tone={correct / questions >= 0.7 ? 'success' : 'info'} title={`You scored ${correct}/${questions} (${Math.round((correct / questions) * 100)}%)`}>
              Saved to your progress. {correct / questions < 0.7 ? 'Listening improves with short, regular practice — try again tomorrow.' : 'Great listening!'}{' '}
              <button type="button" className="underline" onClick={startNew}>
                Take another test
              </button>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
