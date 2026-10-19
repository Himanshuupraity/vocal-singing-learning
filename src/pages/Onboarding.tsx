import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../state/AppData';
import { Button, Card, Field, inputClass, cx } from '../components/ui';
import { SESSION_LENGTHS, type Experience, type Focus, type Language, type SessionLength } from '../storage/schema';
import { TONIC_CHOICES, tonicLabel, type Tonic } from '../music/theory';

type Answers = {
  name: string;
  experience: Experience;
  language: Language;
  dailyMinutes: SessionLength;
  favoriteSongs: string;
  favoriteSingers: string;
  focus: Focus;
  hasMic: boolean | null;
  hasHeadphones: boolean | null;
  tonicChoice: 'help' | string;
};

function Choice<T extends string | number | boolean | null>({ value, current, onChange, label, desc }: { value: T; current: T; onChange: (v: T) => void; label: string; desc?: string }) {
  const on = value === current;
  return (
    <button type="button" aria-pressed={on} onClick={() => onChange(value)} className={cx('w-full rounded-xl border p-3 text-left transition-colors', on ? 'border-primary bg-primary-soft' : 'border-border bg-surface hover:bg-surface-2')}>
      <span className="block font-medium">{label}</span>
      {desc && <span className="mt-0.5 block text-sm text-muted">{desc}</span>}
    </button>
  );
}

export default function Onboarding() {
  const { update } = useAppData();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({ name: '', experience: 'none', language: 'hinglish', dailyMinutes: 20, favoriteSongs: '', favoriteSingers: '', focus: 'both', hasMic: null, hasHeadphones: null, tonicChoice: 'help' });
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((x) => ({ ...x, [k]: v }));

  const finish = (toBaseline: boolean) => {
    update((d) => {
      const chosen = a.tonicChoice !== 'help' ? TONIC_CHOICES.find((t) => tonicLabel(t) === a.tonicChoice) : undefined;
      d.profile = {
        ...d.profile,
        onboarded: true,
        name: a.name.trim().slice(0, 40),
        experience: a.experience,
        language: a.language,
        dailyMinutes: a.dailyMinutes,
        favoriteSongs: a.favoriteSongs.trim().slice(0, 300),
        favoriteSingers: a.favoriteSingers.trim().slice(0, 300),
        focus: a.focus,
        hasMic: a.hasMic,
        hasHeadphones: a.hasHeadphones,
        tonic: (chosen as Tonic) ?? d.profile.tonic,
        tonicSource: chosen ? 'chosen' : 'default',
        startedAt: new Date().toISOString(),
      };
    });
    navigate(toBaseline ? '/baseline' : '/', { replace: true });
  };

  const steps = [
    {
      title: 'Namaste! Welcome to SurSadhana',
      body: (
        <div className="space-y-4">
          <p className="text-muted">
            This app will teach you singing step by step — from your very first <em>sur</em> to confident Bollywood singing, with Hindustani classical foundations. You don&apos;t need to know any music terms. A few quick questions so we can set things up for you.
          </p>
          <Field label="What should we call you? (optional)" htmlFor="ob-name">
            <input id="ob-name" className={inputClass} value={a.name} onChange={(e) => set('name', e.target.value)} maxLength={40} autoComplete="given-name" />
          </Field>
        </div>
      ),
    },
    {
      title: 'Have you ever learned singing before?',
      body: (
        <div className="space-y-2">
          <Choice value="none" current={a.experience} onChange={(v) => set('experience', v)} label="No, I'm a complete beginner" />
          <Choice value="a-little" current={a.experience} onChange={(v) => set('experience', v)} label="A little — some videos or casual practice" />
          <Choice value="some-training" current={a.experience} onChange={(v) => set('experience', v)} label="Yes, I've had some lessons" />
          <p className="pt-2 text-sm text-muted">Everyone starts at Level 1 so the foundations are solid — you can move faster through lessons you already know by passing their quizzes and practicals.</p>
        </div>
      ),
    },
    {
      title: 'Which language do you prefer for explanations?',
      body: (
        <div className="space-y-2">
          <Choice value="hinglish" current={a.language} onChange={(v) => set('language', v)} label="Hinglish" desc="Hindi + English mix in Roman script — “Sa aapka home note hai”" />
          <Choice value="english" current={a.language} onChange={(v) => set('language', v)} label="English" desc="Simple English explanations" />
          <Choice value="hindi" current={a.language} onChange={(v) => set('language', v)} label="Hindi (हिन्दी)" desc="Lesson explanations in Devanagari Hindi; the AI tutor also replies in Hindi." />
        </div>
      ),
    },
    {
      title: 'How many minutes can you practise daily?',
      body: (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {SESSION_LENGTHS.map((m) => (
              <Choice key={m} value={m} current={a.dailyMinutes} onChange={(v) => set('dailyMinutes', v)} label={`${m} min`} />
            ))}
          </div>
          <p className="text-sm text-muted">Short, regular practice beats long, occasional practice. You can change this any day.</p>
        </div>
      ),
    },
    {
      title: 'What music do you enjoy?',
      body: (
        <div className="space-y-4">
          <Field label="Bollywood songs you love (optional)" htmlFor="ob-songs" hint="e.g. Tum Hi Ho, Kesariya, Lag Ja Gale">
            <input id="ob-songs" className={inputClass} value={a.favoriteSongs} onChange={(e) => set('favoriteSongs', e.target.value)} maxLength={300} />
          </Field>
          <Field label="Singers you enjoy (optional)" htmlFor="ob-singers">
            <input id="ob-singers" className={inputClass} value={a.favoriteSingers} onChange={(e) => set('favoriteSingers', e.target.value)} maxLength={300} />
          </Field>
          <p className="text-sm font-medium">What would you like to focus on?</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Choice value="bollywood" current={a.focus} onChange={(v) => set('focus', v)} label="Bollywood singing" />
            <Choice value="classical" current={a.focus} onChange={(v) => set('focus', v)} label="Classical foundations" />
            <Choice value="both" current={a.focus} onChange={(v) => set('focus', v)} label="Both" />
          </div>
        </div>
      ),
    },
    {
      title: 'Your equipment',
      body: (
        <div className="space-y-4">
          <p className="text-sm font-medium">Do you have a microphone? (A phone/laptop built-in mic is fine.)</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Choice value={true} current={a.hasMic} onChange={(v) => set('hasMic', v)} label="Yes" />
            <Choice value={false} current={a.hasMic} onChange={(v) => set('hasMic', v)} label="No" />
            <Choice value={null} current={a.hasMic} onChange={(v) => set('hasMic', v)} label="Not sure" />
          </div>
          <p className="text-sm font-medium">Do you have headphones or earphones?</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Choice value={true} current={a.hasHeadphones} onChange={(v) => set('hasHeadphones', v)} label="Yes" />
            <Choice value={false} current={a.hasHeadphones} onChange={(v) => set('hasHeadphones', v)} label="No" />
            <Choice value={null} current={a.hasHeadphones} onChange={(v) => set('hasHeadphones', v)} label="Not sure" />
          </div>
          <p className="text-sm text-muted">The microphone lets the app measure your pitch (it&apos;s analysed in your browser, never uploaded). Without one, you can still learn, listen and use the drone, sargam player and metronome.</p>
        </div>
      ),
    },
    {
      title: 'Your starting note (Sa)',
      body: (
        <div className="space-y-3">
          <p className="text-muted">
            <strong>Sa</strong> is your “home” note — every other note is measured from it. A comfortable Sa is different for every voice. You don&apos;t need to know yours: the very first practical lesson will help you find it.
          </p>
          <Choice value="help" current={a.tonicChoice} onChange={(v) => set('tonicChoice', v)} label="Help me find a comfortable Sa (recommended)" />
          <div className="rounded-xl border border-border p-3">
            <label htmlFor="ob-tonic" className="text-sm font-medium">
              I already know my preferred Sa
            </label>
            <select id="ob-tonic" className={`${inputClass} mt-1`} value={a.tonicChoice === 'help' ? '' : a.tonicChoice} onChange={(e) => set('tonicChoice', e.target.value || 'help')}>
              <option value="">— choose —</option>
              {TONIC_CHOICES.map((t) => (
                <option key={tonicLabel(t)} value={tonicLabel(t)}>
                  {tonicLabel(t)}
                </option>
              ))}
            </select>
          </div>
        </div>
      ),
    },
    {
      title: 'You start at Level 1 — Foundations',
      body: (
        <div className="space-y-3 text-muted">
          <p>Would you like a short, optional <strong className="text-text">starting measurement</strong> (about 5 minutes)? It includes a listening test, a few pitch-matching notes and a rhythm tap test.</p>
          <p>It is a starting point to compare against later — <strong className="text-text">not</strong> an evaluation of your voice or talent. You can skip it and take it any time from the Progress page.</p>
        </div>
      ),
    },
  ];

  const last = step === steps.length - 1;
  return (
    <div className="min-h-screen bg-bg px-4 py-8 sm:py-16">
      <div className="mx-auto max-w-xl">
        <p className="text-center font-display text-2xl font-semibold text-primary">SurSadhana</p>
        <p className="mb-6 text-center text-sm text-muted">Your Journey from First Sur to Confident Singing.</p>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Step {step + 1} of {steps.length}
          </p>
          <div className="mt-1 h-1.5 w-full rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">{steps[step].title}</h1>
          <div className="mt-4">{steps[step].body}</div>
          <div className="mt-6 flex flex-wrap justify-between gap-2">
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0} icon="back">
              Back
            </Button>
            {last ? (
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => finish(false)}>
                  Skip for now
                </Button>
                <Button onClick={() => finish(true)}>Take the starting measurement</Button>
              </div>
            ) : (
              <Button onClick={() => setStep((s) => s + 1)} icon="arrow">
                Continue
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
