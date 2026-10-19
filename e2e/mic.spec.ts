import { expect, test } from '@playwright/test';
import { seedLearner } from './helpers';

test('microphone pitch matcher runs end-to-end with a fake mic (Chromium)', async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium', 'fake media devices are a Chromium feature');
  await seedLearner(page);
  // Replace the mic with a steady sine at Sa (C3) + 10 cents so the result is predictable.
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      o.frequency.value = 130.81 * Math.pow(2, 10 / 1200);
      const g = ctx.createGain();
      g.gain.value = 0.3;
      const d = ctx.createMediaStreamDestination();
      o.connect(g).connect(d);
      o.start();
      return d.stream;
    };
  });
  await page.goto('/studio/pitch');
  await page.getByRole('button', { name: 'Start attempt' }).click();
  await expect(page.getByText('Matched!')).toBeVisible({ timeout: 12_000 });
  await expect(page.getByText(/Median \+10 cents/)).toBeVisible();
});
