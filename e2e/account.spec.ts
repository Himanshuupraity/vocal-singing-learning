import { expect, test } from '@playwright/test';
import { seedLearner } from './helpers';

test('create an account, sync, and load progress on a second device', async ({ browser }) => {
  const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.test`;
  const password = 'e2e-test-password-123';

  const a = await browser.newContext();
  const pa = await a.newPage();
  await seedLearner(pa, { lessons: { 'l1-what-is-singing': { completedAt: new Date().toISOString(), quizAttempts: 1, quizBest: 100, selfChecks: [], practiceCount: 0 } } });
  await pa.goto('/settings');
  await pa.getByLabel('Email').fill(email);
  await pa.getByLabel('Password', { exact: true }).fill(password);
  await pa.getByRole('button', { name: 'Create account & sync' }).click();
  await expect(pa.getByText(`Signed in as`)).toBeVisible();
  await expect(pa.getByText(/saved to your account/)).toBeVisible();
  // the password must never be persisted in browser storage
  const stored = await pa.evaluate(() => JSON.stringify(localStorage));
  expect(stored).not.toContain(password);

  const b = await browser.newContext();
  const pb = await b.newPage();
  await pb.goto('/');
  // fresh device: skip onboarding quickly
  for (let i = 0; i < 7; i++) await pb.getByRole('button', { name: 'Continue' }).click();
  await pb.getByRole('button', { name: 'Skip for now' }).click();
  await pb.goto('/settings');
  await pb.getByRole('button', { name: 'Log in', exact: true }).click();
  await pb.getByLabel('Email').fill(email);
  await pb.getByLabel('Password', { exact: true }).fill(password);
  await pb.getByRole('button', { name: 'Log in & sync' }).click();
  await expect(pb.getByText(/loaded onto this device|Choose which copy/)).toBeVisible();
  if (await pb.getByRole('button', { name: 'Use the account copy' }).isVisible()) await pb.getByRole('button', { name: 'Use the account copy' }).click();
  await pb.goto('/learn');
  await expect(pb.getByText('Completed').first()).toBeVisible();
  await a.close();
  await b.close();
});
