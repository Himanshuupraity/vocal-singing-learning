import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppData } from '../state/AppData';
import { fetchStatus, type ServerStatus } from '../hooks/useServerStatus';
import { buildTutorContext } from '../lib/tutorContext';
import { streamPost, ApiError } from '../lib/sse';
import { THROAT_HURTS_GUIDANCE } from '../data/safety';
import { getLesson } from '../curriculum';
import { nextRecommendedLesson } from '../lib/progress';
import { generateRiyaz } from '../lib/riyaz';
import { Alert, Badge, Button, Card, Icon, PageHeader, Spinner, cx, inputClass } from '../components/ui';
import { Markdown } from '../components/ui/Markdown';
import type { TutorMessage } from '../storage/schema';

const REMEMBER_RE = /^\s*REMEMBER:\s*(.+)$/im;

export function stripMemory(text: string) {
  const m = REMEMBER_RE.exec(text);
  return { text: text.replace(/\n?\s*REMEMBER:.*$/im, '').trimEnd(), memory: m?.[1]?.trim().slice(0, 160) };
}

interface QuickAction {
  id: string;
  label: string;
  prompt: (lessonTitle?: string) => string;
}

const QUICK: QuickAction[] = [
  { id: 'explain', label: 'Explain this lesson again', prompt: (t) => `Please explain the lesson "${t ?? 'my current lesson'}" again in a simpler way, with an everyday example. Then give me one tiny exercise to check I understood.` },
  { id: 'today', label: "Give me today's exercise", prompt: () => 'Based on my level, recent results and practice history, what exact exercise should I practise today? Give step-by-step instructions and which in-app tool to use.' },
  { id: 'sa', label: 'Help me find my Sa', prompt: () => 'Help me find a comfortable Sa (tonic) for my voice, step by step, using the app’s tools. I don’t know my vocal range.' },
  { id: 'pitch', label: 'Explain my pitch results', prompt: () => 'Please explain my measured pitch-matching results in simple words: what the numbers mean, where I go flat or sharp, and what exercises will help. Be honest about what the measurements can and cannot tell.' },
  { id: 'high', label: 'How do I improve my high notes?', prompt: () => 'How can I safely improve my high notes over time? I don’t want to strain my voice.' },
  { id: 'song', label: 'Help me learn a Bollywood song', prompt: () => 'Help me plan how to learn a Bollywood song at my level. Ask me which song if I haven’t mentioned one, and suggest how to break it into phrases.' },
  { id: 'plan20', label: 'Make a 20-minute riyaz plan', prompt: () => 'Make me a 20-minute riyaz plan for today, minute by minute, tailored to my level and results.' },
  { id: 'quiz', label: 'Test my understanding', prompt: () => 'Give me a short revision quiz (4–5 questions, one at a time is fine) on what I have learned so far. Wait for my answers before revealing them.' },
  { id: 'throat', label: 'My throat hurts after practice', prompt: () => 'My throat hurts after practice. What should I do?' },
];

function demoReply(action: string | null, data: ReturnType<typeof useAppData>['data']): string {
  const head = '**Demo mode — this is not an AI response.** The AI tutor isn’t configured on this server, so here is built-in guidance from the app instead.\n\n';
  const setup = '\n\n*To enable the real AI tutor, add* `ANTHROPIC_API_KEY` *to the server’s* `.env` *file and restart it (see README → “AI tutor setup”).*';
  const next = nextRecommendedLesson(data);
  switch (action) {
    case 'today': {
      const plan = generateRiyaz(data, data.profile.dailyMinutes);
      return head + `Your app-generated plan for today (${plan.totalMinutes} min):\n` + plan.blocks.map((b, i) => `${i + 1}. **${b.title}** — ${b.minutes} min: ${b.objective}`).join('\n') + '\n\nOpen **Daily Riyaz** to run it with a timer.' + setup;
    }
    case 'sa':
      return head + 'Open the lesson **“Finding Your Comfortable Sa”** in the Learning Path — it has a **Sa Finder** that measures your relaxed speaking pitch and lets you choose a comfortable Sa by ear.' + setup;
    case 'explain':
      return head + (next ? `Your current lesson is **${next.title}**. Each lesson has a Hinglish and an English explanation — try switching languages, play the audio demos, and read “Common mistakes & fixes”.` : 'Open the Learning Path to revisit any lesson.') + setup;
    case 'pitch':
      return head + 'Open **Progress & Reports** to see your per-swara accuracy. “Cents” measure distance from the target: 100 cents = one semitone; negative = flat (too low), positive = sharp (too high).' + setup;
    default:
      return head + 'The lessons, Daily Riyaz, Practice Studio and Video Library all work without the AI tutor.' + setup;
  }
}

export default function Tutor() {
  const { data, update } = useAppData();
  const [sp] = useSearchParams();
  const focusLesson = sp.get('lesson') ?? undefined;
  const lessonTitle = (focusLesson && getLesson(focusLesson)?.title) || nextRecommendedLesson(data)?.title;
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [streaming, setStreaming] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const messages = data.tutor.messages;

  useEffect(() => {
    fetchStatus().then(setStatus);
    return () => abort.current?.abort();
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, streaming]);

  const configured = !!status?.tutor.configured;

  const add = (m: TutorMessage) => update((d) => void d.tutor.messages.push(m));

  const send = async (text: string, action: string | null = null) => {
    const content = text.trim().slice(0, 4000);
    if (!content || busy) return;
    setError(null);
    setInput('');
    add({ role: 'user', content, at: new Date().toISOString() });

    if (action === 'throat') {
      add({ role: 'assistant', content: '_Built-in safety guidance (shown instantly, not generated by AI):_\n\n' + THROAT_HURTS_GUIDANCE, at: new Date().toISOString(), demo: true });
      update((d) => {
        const last = d.sessions.at(-1);
        if (last && !last.comfort) last.comfort = 'discomfort';
      });
      return;
    }
    if (!configured) {
      add({ role: 'assistant', content: demoReply(action, data), at: new Date().toISOString(), demo: true });
      return;
    }

    const history = [...messages.filter((m) => !m.demo), { role: 'user' as const, content }]
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 6000) }));
    while (history.length && history[0].role !== 'user') history.shift();

    setBusy(true);
    setStreaming('');
    abort.current = new AbortController();
    let full = '';
    try {
      await streamPost('/api/tutor', { messages: history, context: buildTutorContext(data, focusLesson), language: data.profile.language }, (t) => {
        full += t;
        setStreaming(stripMemory(full).text);
      }, abort.current.signal);
      const { text: clean, memory } = stripMemory(full);
      if (clean) add({ role: 'assistant', content: clean, at: new Date().toISOString() });
      if (memory) update((d) => void (!d.tutor.memory.includes(memory) && d.tutor.memory.push(memory)));
    } catch (e) {
      if ((e as Error).name === 'AbortError') {
        if (full) add({ role: 'assistant', content: stripMemory(full).text + '\n\n_(stopped)_', at: new Date().toISOString() });
      } else {
        const err = e as ApiError;
        if (err.code === 'not_configured') setStatus((s) => (s ? { ...s, tutor: { configured: false, model: null } } : s));
        setError(err.message || 'Something went wrong.');
      }
    } finally {
      setBusy(false);
      setStreaming('');
    }
  };

  return (
    <>
      <PageHeader
        title="AI Vocal Tutor"
        subtitle="A patient singing teacher that knows your level and real practice results. It can’t hear you — it only sees what the app measured."
        actions={
          messages.length > 0 && (
            <Button variant="ghost" size="sm" icon="trash" onClick={() => update((d) => void (d.tutor.messages = []))}>
              Clear chat
            </Button>
          )
        }
      />
      {status === null ? (
        <Spinner label="Checking tutor status…" />
      ) : !status.reachable ? (
        <Alert tone="warning" title="Server not reachable — demo mode">
          The SurSadhana server isn&apos;t running or can&apos;t be reached, so the AI tutor is unavailable. Quick actions show built-in (non-AI) guidance. Start the server with <code>npm run dev</code>.
        </Alert>
      ) : !configured ? (
        <Alert tone="warning" title="AI tutor not configured — demo mode">
          Add your Claude API key as <code>ANTHROPIC_API_KEY</code> in the server&apos;s <code>.env</code> file and restart. Until then, replies are clearly labelled built-in guidance, never pretend AI answers.
        </Alert>
      ) : (
        <p className="mb-2 flex items-center gap-2 text-sm text-muted">
          <Badge tone="success">Connected</Badge> Powered by Claude ({status.tutor.model}) via the SurSadhana server.
        </p>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_280px]">
        <Card className="flex min-h-[60vh] flex-col p-0">
          <div className="flex-1 space-y-4 overflow-y-auto p-5" aria-live="polite" aria-busy={busy}>
            {messages.length === 0 && !streaming && (
              <div className="py-8 text-center text-muted">
                <Icon name="chat" className="mx-auto h-10 w-10 text-primary" />
                <p className="mt-3 font-medium text-text">Ask anything about singing</p>
                <p className="mt-1 text-sm">“Sur aur swar mein kya fark hai?” · “Why do I go flat on Ga?” · “What is Teentaal?”</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cx('max-w-[85%] rounded-2xl px-4 py-3', m.role === 'user' ? 'bg-primary text-on-primary' : m.demo ? 'border border-warning/40 bg-warning-soft' : 'bg-surface-2')}>
                  {m.role === 'user' ? <p className="whitespace-pre-wrap text-sm">{m.content}</p> : <Markdown text={m.content} />}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-surface-2 px-4 py-3">{streaming ? <Markdown text={streaming} /> : <Spinner label="Guruji is thinking…" />}</div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          {error && (
            <div className="px-5 pb-2">
              <Alert tone="danger">{error}</Alert>
            </div>
          )}
          <form
            className="flex gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <label htmlFor="tutor-input" className="sr-only">
              Your question
            </label>
            <textarea
              id="tutor-input"
              rows={1}
              className={`${inputClass} min-h-11 resize-none`}
              placeholder="Type your question… (Enter to send, Shift+Enter for new line)"
              value={input}
              maxLength={4000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
            />
            {busy ? (
              <Button variant="secondary" onClick={() => abort.current?.abort()}>
                Stop
              </Button>
            ) : (
              <Button type="submit" disabled={!input.trim()}>
                Send
              </Button>
            )}
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold">Quick actions</h2>
            <div className="mt-2 flex flex-col gap-1.5">
              {QUICK.map((q) => (
                <button key={q.id} type="button" disabled={busy} onClick={() => send(q.prompt(lessonTitle), q.id)} className={cx('rounded-xl px-3 py-2 text-left text-sm transition-colors disabled:opacity-50', q.id === 'throat' ? 'bg-danger-soft text-danger hover:opacity-90' : 'bg-surface-2 hover:bg-border')}>
                  {q.label}
                </button>
              ))}
            </div>
            {focusLesson && lessonTitle && <p className="mt-2 text-xs text-muted">Focused on: {lessonTitle}</p>}
          </Card>
          <Card>
            <h2 className="text-sm font-semibold">What the tutor remembers</h2>
            {data.tutor.memory.length === 0 ? (
              <p className="mt-1 text-xs text-muted">Useful facts you share (e.g. a goal song or a recurring difficulty) are saved here, in this browser only. You can delete any of them.</p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {data.tutor.memory.map((m) => (
                  <li key={m} className="flex items-start justify-between gap-2 text-xs">
                    <span>{m}</span>
                    <button type="button" aria-label={`Forget: ${m}`} className="shrink-0 rounded p-0.5 hover:bg-surface-2" onClick={() => update((d) => void (d.tutor.memory = d.tutor.memory.filter((x) => x !== m)))}>
                      <Icon name="x" className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-muted">
              The tutor receives a summary of your level, lessons and measured results — never recordings or raw audio. <Link to="/settings" className="underline">Privacy settings</Link>
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
