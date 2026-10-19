import { useState } from 'react';
import { useAppData } from '../state/AppData';
import { Alert, Button, Card, LinkButton, PageHeader } from '../components/ui';
import { EarTraining } from '../components/studio/EarTraining';
import { PitchMatcher } from '../components/studio/PitchMatcher';
import { TapTest } from '../components/studio/MetronomeTool';
import { midiToNoteName } from '../music/theory';

const TARGETS = ['S', 'G', 'P', 'R', 'S'];

export default function Baseline() {
  const { data, update } = useAppData();
  const [step, setStep] = useState(0);
  const [ear, setEar] = useState<number | null>(null);
  const [pitch, setPitch] = useState<{ n: number; matched: number }>({ n: 0, matched: 0 });
  const [rhythm, setRhythm] = useState<number | null>(null);

  const save = () => {
    update((d) => {
      d.baseline = {
        at: new Date().toISOString(),
        earScorePct: ear,
        pitchMatchedPct: pitch.n ? Math.round((pitch.matched / pitch.n) * 100) : null,
        rhythmOnBeatPct: rhythm,
        comfortableLow: d.ranges.at(-1) ? midiToNoteName(d.ranges.at(-1)!.lowMidi).label : undefined,
        comfortableHigh: d.ranges.at(-1) ? midiToNoteName(d.ranges.at(-1)!.highMidi).label : undefined,
      };
    });
    setStep(4);
  };

  return (
    <>
      <PageHeader title="Starting measurement" subtitle="About 5 minutes: listening, a few notes, and a rhythm tap. It's a snapshot to compare against later — not a judgement of your voice or talent." />
      {step === 0 && (
        <Card>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Part 1 — listening: 8 “same or different?” questions.</li>
            <li>Part 2 — pitch: try to match 5 notes. Needs a microphone; you can skip it.</li>
            <li>Part 3 — rhythm: tap along with a steady beat.</li>
          </ul>
          <p className="mt-3 text-sm text-muted">Low scores are completely normal at the start. Many people improve noticeably with regular practice.</p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => setStep(1)}>Begin</Button>
            <LinkButton to="/" variant="ghost">
              Skip for now
            </LinkButton>
          </div>
        </Card>
      )}
      {step === 1 && (
        <Card>
          <EarTraining context="baseline" questions={8} lockKind onComplete={setEar} />
          <Button className="mt-4" onClick={() => setStep(2)} variant={ear === null ? 'ghost' : 'primary'}>
            {ear === null ? 'Skip this part' : 'Next: pitch matching'}
          </Button>
        </Card>
      )}
      {step === 2 && (
        <Card>
          {data.profile.hasMic === false && <Alert tone="info">You said you don&apos;t have a microphone — feel free to skip this part.</Alert>}
          <PitchMatcher targets={TARGETS} context="baseline" title="Match each note (5 notes)" onAttempt={(r) => r.reliable && setPitch((p) => ({ n: p.n + 1, matched: p.matched + (r.matched ? 1 : 0) }))} />
          <p className="mt-3 text-sm text-muted">Measured so far: {pitch.n} note(s), {pitch.matched} matched. Press “Next note” after each result.</p>
          <Button className="mt-3" onClick={() => setStep(3)} variant={pitch.n ? 'primary' : 'ghost'}>
            {pitch.n ? 'Next: rhythm' : 'Skip this part'}
          </Button>
        </Card>
      )}
      {step === 3 && (
        <Card>
          <TapTest bpm={70} context="baseline" onDone={setRhythm} />
          <Button className="mt-4" onClick={save}>
            Finish &amp; save
          </Button>
        </Card>
      )}
      {step === 4 && (
        <Alert tone="success" title="Starting measurement saved">
          Listening: {ear ?? '—'}% · Pitch matched: {pitch.n ? Math.round((pitch.matched / pitch.n) * 100) + '%' : 'skipped'} · Rhythm on beat: {rhythm ?? '—'}%. You can retake it any time from Progress & Reports to see how you&apos;ve grown. To also measure your comfortable range, try the Range Finder in the Practice Studio.{' '}
          <LinkButton to="/" size="sm" className="ml-2">
            Go to dashboard
          </LinkButton>
        </Alert>
      )}
    </>
  );
}
