import { expect, test, type Page } from '@playwright/test';
import { collectErrors, seedLearner } from './helpers';

const SA = 130.81; // C3, the seeded learner's Sa
const hz = (semis: number, cents = 0) => SA * Math.pow(2, (semis + cents / 100) / 12);

/** Replaces the microphone with a "singer" that loops a melody: [frequency (0 = silence), seconds][]. */
async function fakeSinger(page: Page, melody: [number, number][]) {
  await page.addInitScript((m) => {
    navigator.mediaDevices.getUserMedia = async () => {
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      g.gain.value = 0;
      let t = ctx.currentTime + 0.05;
      for (let loop = 0; loop < 40; loop++)
        for (const [f, sec] of m) {
          if (f) o.frequency.setValueAtTime(f, t);
          g.gain.setValueAtTime(f ? 0.3 : 0, t);
          t += sec;
        }
      const d = ctx.createMediaStreamDestination();
      o.connect(g).connect(d);
      o.start();
      return d.stream;
    };
  }, melody);
}

const chromiumOnly = (name: string) => test.skip(name !== 'chromium', 'fake media devices are a Chromium feature');

test('new studio tools render without errors', async ({ page }) => {
  const errors = collectErrors(page);
  await seedLearner(page);
  for (const [path, heading] of [
    ['/studio/raag', 'Raag Practice'],
    ['/studio/compare', 'Sur Graph'],
    ['/studio/coach', 'Live Coach'],
    ['/studio/song', 'Song → Exercise'],
    ['/studio/taal', 'Metronome & Taal'],
  ]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('raag free singing flags a varjit note (shuddh Ma in Yaman)', async ({ page }, info) => {
  chromiumOnly(info.project.name);
  await seedLearner(page);
  await fakeSinger(page, [[hz(5), 2]]); // shuddh Ma
  await page.goto('/studio/raag');
  await page.getByRole('button', { name: 'Free singing check' }).click();
  await page.getByRole('button', { name: 'Turn on microphone' }).click();
  await expect(page.getByText('Not used in Raag Yaman')).toBeVisible({ timeout: 8000 });
  await expect(page.getByText(/varjit slip/)).toBeVisible();
  // The same note is fine in Bilawal.
  await page.getByRole('button', { name: 'Bilawal (Alhaiya)' }).click();
  await page.getByRole('button', { name: 'Free singing check' }).click();
  await page.getByRole('button', { name: 'Turn on microphone' }).click();
  await expect(page.getByText('In Raag Bilawal (Alhaiya)')).toBeVisible({ timeout: 8000 });
});

test('live coach says "a little lower" when the voice is sharp', async ({ page }, info) => {
  chromiumOnly(info.project.name);
  await seedLearner(page);
  await fakeSinger(page, [[hz(0, 45), 3]]);
  await page.goto('/studio/coach');
  await page.getByRole('button', { name: 'Turn on microphone' }).click();
  await expect(page.getByText('A little lower ↓')).toBeVisible({ timeout: 8000 });
  await expect(page.getByText(/\+4\d cents/)).toBeVisible();
});

test('live AI coach sends a snippet only after consent and shows the tip', async ({ page }, info) => {
  chromiumOnly(info.project.name);
  await seedLearner(page);
  await fakeSinger(page, [[hz(0), 3]]);
  await page.route('**/api/status', (r) => r.fulfill({ json: { ok: true, tutor: { configured: true, provider: 'gemini', model: 'g', voice: true }, youtube: { configured: false }, songs: { configured: true } } }));
  let sent: Record<string, unknown> | null = null;
  await page.route('**/api/tutor/coach', async (r) => {
    sent = r.request().postDataJSON();
    await r.fulfill({ status: 200, headers: { 'content-type': 'text/event-stream' }, body: 'event: delta\ndata: {"text":"Sa bahut steady hai — ab thoda khula aa banaiye."}\n\nevent: done\ndata: {}\n\n' });
  });
  await page.goto('/studio/coach');
  await page.getByRole('button', { name: 'Turn on microphone' }).click();
  await page.getByRole('button', { name: 'Turn on AI coach' }).click();
  await expect(page.getByText('Send snippets of your singing to the AI?')).toBeVisible();
  await page.getByRole('button', { name: 'Turn on', exact: true }).click();
  await expect(page.getByText(/Next AI tip in/)).toBeVisible();
  await page.waitForTimeout(6000);
  expect(sent).toBeNull();
  await page.getByRole('button', { name: 'Tip now' }).click();
  await expect(page.getByText('Sa bahut steady hai — ab thoda khula aa banaiye.')).toBeVisible({ timeout: 10_000 });
  const body = sent as unknown as { audio: string; target: string; measured: { voicedSec: number } };
  expect(Buffer.from(body.audio, 'base64').subarray(0, 4).toString('latin1')).toBe('RIFF');
  expect(body.target).toBe('Holding Sa over the tanpura');
  expect(body.measured.voicedSec).toBeGreaterThan(4);
});

test('sur graph scores each note of a sung pattern', async ({ page }, info) => {
  chromiumOnly(info.project.name);
  await seedLearner(page);
  await fakeSinger(page, [[hz(0), 3]]); // only ever sings Sa
  await page.goto('/studio/compare');
  await page.getByLabel('Pattern').selectOption({ label: 'Yaman aroha' });
  await page.getByLabel('Speed').selectOption('80');
  await page.getByRole('button', { name: 'Turn on microphone' }).click();
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByText(/of 7 notes in tune/)).toBeVisible({ timeout: 25_000 });
  const results = page.getByRole('list', { name: 'Result per note' }).getByRole('listitem');
  await expect(results).toHaveCount(7);
  await expect(results.last()).toContainText('Sa'); // taar Sa is matched an octave apart
  await expect(page.getByText(/^1 of 7 notes in tune$/)).toBeVisible();
});

test('song → exercise: hum a tune, get its sargam, save and reuse it', async ({ page }, info) => {
  chromiumOnly(info.project.name);
  await seedLearner(page);
  // A phrase in D (Sa = D): Sa Re Ga Pa … Ga Re Sa, with short gaps.
  const D = 146.83;
  const st = (n: number) => D * Math.pow(2, n / 12);
  await fakeSinger(page, [
    [st(0), 0.5],
    [0, 0.15],
    [st(2), 0.5],
    [0, 0.15],
    [st(4), 0.5],
    [0, 0.15],
    [st(7), 0.6],
    [0, 0.15],
    [st(4), 0.5],
    [0, 0.15],
    [st(2), 0.5],
    [0, 0.15],
    [st(0), 1.2],
    [0, 1],
  ]);
  await page.goto('/studio/song');
  await page.getByRole('button', { name: 'Turn on microphone' }).click();
  await page.getByRole('button', { name: 'Start humming' }).click();
  await page.waitForTimeout(5200);
  await page.getByRole('button', { name: 'Done — find the notes' }).click();
  await expect(page.getByLabel('The tune’s Sa:')).toHaveValue('2');
  const chips = page.getByRole('list', { name: 'Detected sargam' }).getByRole('button');
  await expect(chips.first()).toHaveText('Sa');
  await expect(chips.nth(3)).toHaveText('Pa');
  await page.getByLabel('Exercise name').fill('Test phrase');
  await page.getByRole('button', { name: 'Save as my exercise' }).click();
  await expect(page.getByRole('heading', { name: 'My exercises' })).toBeVisible();
  await page.goto('/studio/sargam');
  await expect(page.getByLabel('Pattern').locator('optgroup[label="My exercises"] option')).toHaveText(['Test phrase']);
});

test('taal plays on the tabla, and new taals are available', async ({ page }) => {
  const errors = collectErrors(page);
  await seedLearner(page);
  await page.goto('/studio/taal?taal=rupak');
  await expect(page.getByText('X (sam · wave)')).toBeVisible();
  await expect(page.getByLabel('Sound')).toHaveValue('tabla');
  await page.getByLabel('Play the tanpura too').check();
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await page.getByLabel('Mode').selectOption('jhaptaal');
  await expect(page.getByText('Dhi').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('range finder suggests a Sa and shows range history', async ({ page }) => {
  await seedLearner(page, {
    ranges: [
      { id: 'a', at: '2026-08-01T10:00:00.000Z', lowMidi: 45, highMidi: 60 },
      { id: 'b', at: '2026-10-01T10:00:00.000Z', lowMidi: 43, highMidi: 64 },
    ],
  });
  await page.goto('/studio/range');
  await expect(page.getByText(/Suggested Sa for this range: C3/)).toBeVisible();
  await expect(page.getByText('This is already your Sa.')).toBeVisible();
  await expect(page.getByText(/grown by 6 semitones/)).toBeVisible();
});
