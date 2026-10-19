import { useState } from 'react';
import type { QuizQuestion } from '../curriculum/types';
import { Alert, Button, cx } from './ui';
import { QUIZ_PASS_PCT } from '../lib/progress';

export function Quiz({ questions, onSubmit, best }: { questions: QuizQuestion[]; onSubmit: (pct: number) => void; best?: number }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const score = answers.filter((a, i) => a === questions[i].answerIndex).length;
  const pct = Math.round((score / questions.length) * 100);

  const submit = () => {
    setSubmitted(true);
    onSubmit(pct);
  };
  const retry = () => {
    setAnswers(questions.map(() => null));
    setSubmitted(false);
  };

  return (
    <div className="space-y-5">
      {best !== undefined && !submitted && <p className="text-sm text-muted">Your best so far: {best}% (pass mark {QUIZ_PASS_PCT}%).</p>}
      {questions.map((q, qi) => (
        <fieldset key={qi} className="space-y-2">
          <legend className="font-medium">
            {qi + 1}. {q.question}
          </legend>
          {q.options.map((o, oi) => {
            const chosen = answers[qi] === oi;
            const correct = q.answerIndex === oi;
            return (
              <label
                key={oi}
                className={cx(
                  'flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors',
                  submitted ? (correct ? 'border-success bg-success-soft' : chosen ? 'border-danger bg-danger-soft' : 'border-border') : chosen ? 'border-primary bg-primary-soft' : 'border-border hover:bg-surface-2',
                )}
              >
                <input type="radio" name={`q${qi}`} className="mt-0.5" checked={chosen} disabled={submitted} onChange={() => setAnswers((a) => a.map((x, i) => (i === qi ? oi : x)))} />
                <span>{o}</span>
              </label>
            );
          })}
          {submitted && (
            <p className={cx('text-sm', answers[qi] === q.answerIndex ? 'text-success' : 'text-text')}>
              {answers[qi] === q.answerIndex ? '✓ ' : '✗ '}
              {q.explanation}
            </p>
          )}
        </fieldset>
      ))}
      {!submitted ? (
        <Button onClick={submit} disabled={answers.some((a) => a === null)}>
          Check answers
        </Button>
      ) : (
        <Alert tone={pct >= QUIZ_PASS_PCT ? 'success' : 'warning'} title={`You scored ${score}/${questions.length} (${pct}%)`}>
          {pct >= QUIZ_PASS_PCT ? 'Passed! ' : `You need ${QUIZ_PASS_PCT}% to pass — read the explanations above and try again. `}
          <button type="button" className="underline" onClick={retry}>
            Retake quiz
          </button>
        </Alert>
      )}
    </div>
  );
}
