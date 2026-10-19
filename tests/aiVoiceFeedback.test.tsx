import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { defaultData } from '../src/storage/schema';
import type { RecordingEntry } from '../src/storage/recordings';

// jsdom has no AudioContext: decode to a steady sung C4 (~261.6 Hz) instead.
vi.mock('../src/audio/offlineAnalysis', async (orig) => {
  const real = await orig<typeof import('../src/audio/offlineAnalysis')>();
  return {
    ...real,
    decodeToMono: async () => {
      const rate = 44100;
      const samples = new Float32Array(rate * 3).map((_, i) => 0.5 * Math.sin((2 * Math.PI * 261.63 * i) / rate));
      return { samples, sampleRate: rate };
    },
  };
});

const rec: RecordingEntry = { id: 'r1', createdAt: '2026-10-19T08:00:00Z', label: 'Morning riyaz', exercise: 'Sa — akar', notes: '', durationSec: 3, mimeType: 'audio/webm', sizeBytes: 10, blob: new Blob(['x']) };

function serve(voice: boolean) {
  const sent: { url: string; body?: Record<string, unknown> }[] = [];
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    sent.push({ url, body: init?.body ? JSON.parse(String(init.body)) : undefined });
    if (url === '/api/tutor/voice') {
      const sse = 'event: delta\ndata: {"text":"## What went well\\n- Aapka **Sa** steady tha."}\n\nevent: done\ndata: {"stopReason":"end_turn"}\n\n';
      return new Response(sse, { status: 200, headers: { 'content-type': 'text/event-stream' } });
    }
    return new Response(JSON.stringify({ ok: true, tutor: { configured: true, provider: 'gemini', model: 'g', voice }, youtube: { configured: false }, songs: { configured: true } }), { status: 200 });
  }) as never;
  return sent;
}

async function renderIt() {
  vi.resetModules();
  // fresh modules per test (the status fetch is cached per page load), so the provider must come from the same registry
  const { AiVoiceFeedback } = await import('../src/components/studio/AiVoiceFeedback');
  const { AppDataProvider } = await import('../src/state/AppData');
  const { LocalStorageAdapter } = await import('../src/storage/adapter');
  const d = defaultData();
  d.profile.onboarded = true;
  d.profile.language = 'hinglish';
  localStorage.setItem('sursadhana:data', JSON.stringify(d));
  return render(
    <AppDataProvider adapter={new LocalStorageAdapter()}>
      <AiVoiceFeedback recording={rec} />
    </AppDataProvider>,
  );
}

beforeEach(() => localStorage.clear());

describe('AI voice feedback', () => {
  it('asks before sending, then sends the clip as WAV with measurements and shows the reply', async () => {
    const sent = serve(true);
    await renderIt();
    await userEvent.click(await screen.findByRole('button', { name: 'Get AI voice feedback' }));
    expect(screen.getByText(/Google Gemini/, { selector: 'strong' })).toBeInTheDocument();
    expect(sent.some((s) => s.url === '/api/tutor/voice')).toBe(false);
    await userEvent.click(screen.getByRole('button', { name: 'Send to AI' }));
    expect(await screen.findByText(/steady tha/)).toBeInTheDocument();
    const req = sent.find((s) => s.url === '/api/tutor/voice')!.body!;
    expect(String(req.audio).startsWith('UklGR')).toBe(true);
    expect(req).toMatchObject({ mimeType: 'audio/wav', language: 'hinglish', label: 'Morning riyaz', exercise: 'Sa — akar' });
    const m = req.measured as { voicedSec: number; swaras: { label: string }[] };
    expect(m.voicedSec).toBeGreaterThan(2);
    expect(m.swaras.length).toBeGreaterThan(0);
  });

  it('cancel sends nothing', async () => {
    const sent = serve(true);
    await renderIt();
    await userEvent.click(await screen.findByRole('button', { name: 'Get AI voice feedback' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(sent.some((s) => s.url === '/api/tutor/voice')).toBe(false);
    expect(screen.getByRole('button', { name: 'Get AI voice feedback' })).toBeInTheDocument();
  });

  it('explains when the server has no Gemini key', async () => {
    serve(false);
    await renderIt();
    expect(await screen.findByText(/needs a Gemini key/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Get AI voice feedback' })).toBeNull();
  });
});
