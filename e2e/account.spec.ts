import { expect, test } from '@playwright/test';
import { seedLearner } from './helpers';

test('save progress under a name + PIN, then open it on a second device', async ({ browser }) => {
  const name = `E2E ${Date.now().toString(36)}`;
  const pin = '4826';

  const a = await browser.newContext();
  const pa = await a.newPage();
  await seedLearner(pa, { lessons: { 'l1-what-is-singing': { completedAt: new Date().toISOString(), quizAttempts: 1, quizBest: 100, selfChecks: [], practiceCount: 0 } } });
  await pa.goto('/settings#account');
  await pa.getByLabel('Your name').fill(name);
  await pa.getByLabel('Choose a 4-digit PIN').fill(pin);
  await pa.getByLabel('Type the PIN again').fill(pin);
  await pa.getByRole('button', { name: 'Save my progress' }).click();
  await expect(pa.getByText('This device’s progress was saved to your name.')).toBeVisible();
  // the PIN must never be persisted in browser storage
  const stored = await pa.evaluate(() => JSON.stringify(localStorage));
  expect(stored).not.toContain(pin);

  const b = await browser.newContext();
  const pb = await b.newPage();
  await pb.goto('/');
  await expect(pb.getByRole('heading', { name: 'Who’s practising?' })).toBeVisible();
  await pb.getByRole('button', { name: new RegExp(name) }).click();
  await pb.getByLabel(`PIN for ${name}`).fill(pin);
  await pb.getByRole('button', { name: 'Open my progress' }).click();
  // inside the app now (not the PIN screen), with the learner's name in the sidebar
  await expect(pb.locator('main#main')).toBeVisible();
  expect(JSON.parse((await pb.evaluate(() => localStorage.getItem('sursadhana:sync'))) ?? '{}').name).toBe(name);
  await pb.goto('/learn');
  await expect(pb.getByText('Completed').first()).toBeVisible();
  await a.close();
  await b.close();
});
