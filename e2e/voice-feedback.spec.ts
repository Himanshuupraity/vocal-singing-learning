import { expect, test } from '@playwright/test';
import { seedLearner } from './helpers';

test('record a clip, confirm, and send it as WAV for AI voice feedback (Chromium)', async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium', 'fake media devices are a Chromium feature');
  await seedLearner(page, { settings: { recordingConsent: true } });
  // A steady sung Sa (C3) instead of a real mic.
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      o.frequency.value = 130.81;
      const g = ctx.createGain();
      g.gain.value = 0.3;
      const d = ctx.createMediaStreamDestination();
      o.connect(g).connect(d);
      o.start();
      return d.stream;
    };
  });
  // The test server has no Gemini key: report voice feedback as available and answer it here.
  await page.route('**/api/status', (r) => r.fulfill({ json: { ok: true, tutor: { configured: true, provider: 'gemini', model: 'g', voice: true }, youtube: { configured: false }, songs: { configured: true } } }));
  let sent: Record<string, unknown> | null = null;
  await page.route('**/api/tutor/voice', async (r) => {
    sent = r.request().postDataJSON();
    await r.fulfill({ status: 200, headers: { 'content-type': 'text/event-stream' }, body: 'event: delta\ndata: {"text":"Aapka Sa kaafi steady tha."}\n\nevent: done\ndata: {"stopReason":"end_turn"}\n\n' });
  });

  await page.goto('/studio/record');
  await page.getByLabel('Label').fill('Long Sa');
  await page.getByRole('button', { name: 'Record' }).click();
  await page.waitForTimeout(2500);
  await page.getByRole('button', { name: /Stop/ }).click();
  await page.getByRole('button', { name: 'Get AI voice feedback' }).click();
  await expect(page.getByText('Send this recording to the AI?')).toBeVisible();
  expect(sent).toBeNull();
  await page.getByRole('button', { name: 'Send to AI' }).click();
  await expect(page.getByText('Aapka Sa kaafi steady tha.')).toBeVisible();

  const body = sent as unknown as { audio: string; mimeType: string; label: string; measured: { voicedSec: number; swaras: { label: string }[] } };
  expect(body.mimeType).toBe('audio/wav');
  expect(body.label).toBe('Long Sa');
  const wav = Buffer.from(body.audio, 'base64');
  expect(wav.subarray(0, 4).toString('latin1')).toBe('RIFF');
  expect(wav.readUInt32LE(24)).toBe(16000);
  expect(wav.length).toBeGreaterThan(16000 * 2 * 1.5); // at least ~1.5 s of 16 kHz audio
  expect(body.measured.voicedSec).toBeGreaterThan(1);
  expect(body.measured.swaras[0].label).toMatch(/^S/);
});
