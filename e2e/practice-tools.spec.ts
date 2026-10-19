import { expect, test, type Page } from '@playwright/test';
import { collectErrors, seedLearner } from './helpers';

const SA = 130.81; // C3, the seeded learner's Sa
const hz = (semis: number) => SA * Math.pow(2, semis / 12);

type Step = { f: number; sec: number; glide?: boolean; lfo?: { hz: number; to: number } };

/** Replaces the microphone with a scripted "singer". Steps: hold f for sec; glide = slide to f; f = 0 is silence; lfo swings between f and `to`. */
async function singer(page: Page, steps: Step[]) {
  await page.addInitScript((s: Step[]) => {
    navigator.mediaDevices.getUserMedia = async () => {
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      g.gain.value = 0;
      let t = ctx.currentTime + 0.05;
      let prev = 0;
      for (let loop = 0; loop < 20; loop++)
        for (const st of s) {
          if (st.lfo) {
            for (let k = 0, up = true; k < st.sec * st.lfo.hz * 2; k++, up = !up) o.frequency.exponentialRampToValueAtTime(up ? st.lfo.to : st.f, t + (k + 1) / (st.lfo.hz * 2));
            g.gain.setValueAtTime(0.3, t);
          } else if (st.glide) {
            // A ramp starts from the previous event, so pin the held note first.
            if (prev) o.frequency.setValueAtTime(prev, t);
            o.frequency.exponentialRampToValueAtTime(st.f, t + st.sec);
            g.gain.setValueAtTime(0.3, t);
          } else {
            if (st.f) o.frequency.setValueAtTime(st.f, t);
            g.gain.setValueAtTime(st.f ? 0.3 : 0, t);
          }
          t += st.sec;
          if (st.f) prev = st.f;
        }
      const d = ctx.createMediaStreamDestination();
      o.connect(g).connect(d);
      o.start();
      return d.stream;
    };
  }, steps);
}

const chromiumOnly = (name: string) => test.skip(name !== 'chromium', 'fake media devices are a Chromium feature');

test('practice tools render without errors', async ({ page }) => {
  const errors = collectErrors(page);
  await seedLearner(page);
  for (const [path, heading] of [
    ['/studio/alankar', 'Alankar Trainer'],
    ['/studio/meend', 'Meend & Gamak'],
    ['/studio/breath', 'Long Note (Breath)'],
  ]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }
  await page.goto('/studio/ear');
  await page.getByRole('button', { name: 'Sargam dictation' }).click();
  await expect(page.getByLabel('Level')).toBeVisible();
  expect(errors).toEqual([]);
});

test('alankar trainer checks every note and slows down after a poor run', async ({ page }, info) => {
  chromiumOnly(info.project.name);
  await seedLearner(page);
  await singer(page, [{ f: hz(0), sec: 5 }]); // only ever sings Sa
  await page.goto('/studio/alankar');
  await page.getByRole('combobox', { name: /^Alankar/ }).selectOption('skip');
  await page.getByLabel('Tempo in beats per minute').fill('90');
  await page.getByLabel('Play it once before I sing').uncheck();
  await page.getByRole('button', { name: 'Turn on microphone' }).click();
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByText(/% in tune at 90 bpm/)).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('list', { name: 'Result per note' }).getByRole('listitem')).toHaveCount(12);
  await expect(page.getByRole('button', { name: 'Go to 80 bpm' })).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('sursadhana:data')!).alankars['skip:shuddh']);
  expect(saved).toMatchObject({ lastBpm: 80, bestBpm: 0 });
});

test('sargam dictation: answer a phrase and see which notes were right', async ({ page }) => {
  await seedLearner(page);
  await page.goto('/studio/ear');
  await page.getByRole('button', { name: 'Sargam dictation' }).click();
  await page.getByRole('button', { name: 'Start 10 phrases' }).click();
  const swaras = page.getByRole('group', { name: 'Swaras' });
  for (let i = 0; i < 3; i++) await swaras.getByRole('button', { name: 'Sa', exact: true }).click();
  await expect(page.getByText(/notes right|All notes right/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Hear the answer' })).toBeVisible();
  await page.getByRole('button', { name: 'Next phrase' }).click();
  await expect(page.getByText('Phrase 2 of 10')).toBeVisible();
});

test('meend: a smooth Sa → Pa glide is recognised as well landed', async ({ page }, info) => {
  chromiumOnly(info.project.name);
  await seedLearner(page);
  await singer(page, [
    { f: 0, sec: 1.5 },
    { f: hz(0), sec: 1 },
    { f: hz(7), sec: 1.8, glide: true },
    { f: hz(7), sec: 1.2 },
    { f: 0, sec: 3 },
  ]);
  await page.goto('/studio/meend');
  await page.getByRole('combobox', { name: /^Glide(?! speed)/ }).selectOption('S>P');
  await page.getByRole('button', { name: 'Turn on microphone' }).click();
  await page.getByRole('button', { name: 'Sing it' }).click();
  await expect(page.getByText('Smooth meend — well landed!')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/Landed on Pa in tune/)).toBeVisible();
});

test('meend: stepping through the notes is called out', async ({ page }, info) => {
  chromiumOnly(info.project.name);
  await seedLearner(page);
  await singer(page, [
    { f: 0, sec: 1.5 },
    { f: hz(0), sec: 1 },
    { f: hz(2), sec: 0.6 },
    { f: hz(4), sec: 0.6 },
    { f: hz(7), sec: 1.2 },
    { f: 0, sec: 3 },
  ]);
  await page.goto('/studio/meend');
  await page.getByRole('combobox', { name: /^Glide(?! speed)/ }).selectOption('S>P');
  await page.getByRole('button', { name: 'Turn on microphone' }).click();
  await page.getByRole('button', { name: 'Sing it' }).click();
  await expect(page.getByText(/Stopped on Re, Ga on the way/)).toBeVisible({ timeout: 15_000 });
});

test('gamak: swings between Re and Ga are counted', async ({ page }, info) => {
  chromiumOnly(info.project.name);
  await seedLearner(page);
  await singer(page, [
    { f: 0, sec: 1 },
    { f: hz(2), sec: 7, lfo: { hz: 1, to: hz(4) } },
    { f: 0, sec: 2 },
  ]);
  await page.goto('/studio/meend');
  await page.getByRole('button', { name: 'Gamak / andolan (swing)' }).click();
  await page.getByRole('button', { name: 'Turn on microphone' }).click();
  await page.getByRole('button', { name: 'Sing it' }).click();
  await expect(page.getByText(/swings, about 1 per second/)).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('Good speed for this exercise.')).toBeVisible();
});

test('long note: times the hold, saves it and shows the best', async ({ page }, info) => {
  chromiumOnly(info.project.name);
  await seedLearner(page);
  await singer(page, [
    { f: 0, sec: 1 },
    { f: hz(0), sec: 4 },
    { f: 0, sec: 3 },
  ]);
  await page.goto('/studio/breath');
  await page.getByRole('button', { name: 'Turn on microphone' }).click();
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByText(/^(3|4)\.\d seconds/)).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/In tune \(±25 cents\) 100%/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/Best: (3|4)\.\ds/)).toBeVisible();
});

// page.route() can't see requests once a service worker controls the page (WebKit), so these run without it.
test.describe('with mocked server answers', () => {
  test.use({ serviceWorkers: 'block' });

  test('a newer deploy shows a refresh banner', async ({ page }) => {
    await seedLearner(page);
    await page.goto('/');
    await expect(page.getByText('A new version of SurSadhana is ready')).toHaveCount(0);
    const real = await (await page.request.get('/version.json')).json();
    expect(typeof real.id).toBe('string');
    await page.route('**/version.json', (r) => r.fulfill({ json: { id: 'newer-build' } }));
    await page.goto('/progress');
    await expect(page.getByText('A new version of SurSadhana is ready')).toBeVisible();
    await page.getByRole('button', { name: 'Later' }).click();
    await expect(page.getByText('A new version of SurSadhana is ready')).toHaveCount(0);
  });

  test('weekly report shows the measured week and an AI note', async ({ page }) => {
    const day = (n: number) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
    await seedLearner(page, {
      sessions: [0, 1, 2, 9].map((n, i) => ({ id: String(i), date: day(n), startedAt: '', minutes: 20, kind: 'riyaz', exercisesCompleted: [], exercisesSkipped: [] })),
      longNotes: [{ id: 'l', at: new Date().toISOString(), swara: 'S', sec: 12.5, steadinessCents: 20, inTunePct: 80 }],
    });
    await page.route('**/api/status', (r) => r.fulfill({ json: { ok: true, tutor: { configured: true, provider: 'gemini', model: 'g', voice: true }, youtube: { configured: false }, songs: { configured: true } } }));
    let sent: { report: { minutes: { thisWeek: number } } } | null = null;
    await page.route('**/api/tutor/weekly', async (r) => {
      sent = r.request().postDataJSON();
      await r.fulfill({ status: 200, headers: { 'content-type': 'text/event-stream' }, body: 'event: delta\ndata: {"text":"## Is hafte\\nTeen din riyaz — shabash!"}\n\nevent: done\ndata: {}\n\n' });
    });
    await page.goto('/');
    await expect(page.getByText(/60 min on 3 days/)).toBeVisible();
    await page.getByRole('link', { name: 'Weekly report' }).click();
    await expect(page.getByRole('heading', { name: 'Weekly report' })).toBeVisible();
    await expect(page.getByText('12.5s')).toBeVisible();
    await page.getByRole('button', { name: 'Get a weekly note from the AI coach' }).click();
    await expect(page.getByText('Teen din riyaz — shabash!')).toBeVisible();
    expect(sent!.report.minutes.thisWeek).toBe(60);
    await page.reload();
    await expect(page.getByText('Teen din riyaz — shabash!')).toBeVisible();
  });
});

test('daily riyaz picks the Long Note tool after unsteady long notes and opens it in the session', async ({ page }) => {
  await seedLearner(page, { longNotes: [1, 2, 3].map((i) => ({ id: String(i), at: new Date().toISOString(), swara: 'S', sec: 6, steadinessCents: 60, inTunePct: 30 })) });
  await page.goto('/riyaz');
  await page.getByRole('button', { name: '30 min' }).click();
  await expect(page.getByText(/Extra long-note practice/)).toBeVisible();
  await expect(page.getByText('Long note on Sa').first()).toBeVisible();
});

test('guided warm-up runs step by step, and Daily Riyaz starts with it', async ({ page }) => {
  const errors = collectErrors(page);
  await seedLearner(page);
  await page.goto('/studio/warmup');
  await page.getByRole('button', { name: /Quick \(3 min\)/ }).click();
  await page.getByLabel('Speak the instructions').uncheck();
  await page.getByRole('button', { name: 'Start quick (3 min)' }).click();
  await expect(page.getByText('Out… sss').or(page.getByText('In', { exact: true }))).toBeVisible();
  await page.getByRole('button', { name: 'Next step' }).click();
  await expect(page.getByRole('heading', { name: 'Humming on Sa' })).toBeVisible();
  await page.waitForTimeout(1500); // tanpura + note pattern playing
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /Next step|Finish/ }).click();
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByText('Warm-up done — your voice is ready')).toBeVisible();

  await page.goto('/riyaz');
  await page.getByRole('button', { name: /Start \d+-minute session/ }).click();
  await expect(page.getByRole('heading', { name: 'Guided warm-up' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Start (standard|quick)/ })).toBeVisible();
  expect(errors).toEqual([]);
});
