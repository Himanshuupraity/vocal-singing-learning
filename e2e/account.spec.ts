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
  const code = (await pa.getByLabel(/^Recovery code/).textContent())!.trim();
  expect(code).toMatch(/^[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}$/);
  await pa.getByLabel('I’ve saved my recovery code').check();
  await pa.getByRole('button', { name: /I’ve saved it/ }).click();
  await expect(pa.getByText('This device’s progress was saved to your name.')).toBeVisible();
  expect(await pa.evaluate(() => JSON.stringify(localStorage))).not.toContain(code);
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

test('forgot PIN: the recovery code sets a new PIN on another device', async ({ browser }) => {
  const name = `E2R ${Date.now().toString(36)}`;
  const a = await browser.newContext();
  const pa = await a.newPage();
  await seedLearner(pa);
  await pa.goto('/settings#account');
  await pa.getByLabel('Your name').fill(name);
  await pa.getByLabel('Choose a 4-digit PIN').fill('1111');
  await pa.getByLabel('Type the PIN again').fill('1111');
  await pa.getByRole('button', { name: 'Save my progress' }).click();
  const code = (await pa.getByLabel(/^Recovery code/).textContent())!.trim();
  await pa.getByLabel('I’ve saved my recovery code').check();
  await pa.getByRole('button', { name: /I’ve saved it/ }).click();
  await expect(pa.getByText(/Signed in as/)).toBeVisible();

  const b = await browser.newContext();
  const pb = await b.newPage();
  await pb.goto('/');
  await pb.getByRole('button', { name: new RegExp(name) }).click();
  await pb.getByRole('button', { name: 'Forgot PIN?' }).click();
  await pb.getByLabel(/^Recovery code/).fill(code.toLowerCase());
  await pb.getByLabel('New PIN', { exact: true }).fill('2222');
  await pb.getByLabel('Type the new PIN again').fill('2222');
  await pb.getByRole('button', { name: 'Set new PIN' }).click();
  await expect(pb.getByText('Your PIN is changed — here is your new recovery code')).toBeVisible();
  await pb.getByLabel('I’ve saved my recovery code').check();
  await pb.getByRole('button', { name: /I’ve saved it/ }).click();
  // No progress was saved under this name yet, so the new device continues to onboarding with the name filled in.
  await expect(pb.getByLabel(/What should we call you/)).toHaveValue(name);
  expect(JSON.parse((await pb.evaluate(() => localStorage.getItem('sursadhana:sync'))) ?? '{}').name).toBe(name);
  await a.close();
  await b.close();
});
