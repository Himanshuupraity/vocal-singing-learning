import { expect, test } from '@playwright/test';
import { collectErrors, seedLearner } from './helpers';

test('first visit: onboarding → dashboard, progress survives reload', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Namaste! Welcome to SurSadhana' })).toBeVisible();
  await page.getByLabel(/What should we call you/).fill('Meera');
  for (let i = 0; i < 7; i++) await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Skip for now' }).click();
  await expect(page.getByRole('heading', { name: /Namaste, Meera/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: /Namaste, Meera/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test('lesson cannot be completed by clicking through; passing the quiz unlocks the next lesson', async ({ page }) => {
  await seedLearner(page);
  await page.goto('/learn/lesson/l1-what-is-singing');
  const complete = page.getByRole('button', { name: 'Mark as complete' });
  await expect(complete).toBeDisabled();
  // Answer wrongly first
  const groups = page.locator('fieldset');
  const n = await groups.count();
  for (let i = 0; i < n; i++) await groups.nth(i).getByRole('radio').first().check();
  await page.getByRole('button', { name: 'Check answers' }).click();
  // Read the correct answers from the feedback, then retake correctly
  const correct: number[] = [];
  for (let i = 0; i < n; i++) {
    const labels = groups.nth(i).locator('label');
    const c = await labels.count();
    for (let j = 0; j < c; j++) if ((await labels.nth(j).getAttribute('class'))?.includes('border-success')) correct.push(j);
  }
  await page.getByRole('button', { name: 'Retake quiz' }).click();
  for (let i = 0; i < n; i++) await groups.nth(i).getByRole('radio').nth(correct[i]).check();
  await page.getByRole('button', { name: 'Check answers' }).click();
  await expect(complete).toBeEnabled();
  await complete.click();
  await expect(page.getByText(/Completed on/)).toBeVisible();
  await page.goto('/learn');
  await expect(page.getByRole('link', { name: /Pitch, Swar and Sur/ })).toBeVisible();
});

test('locked lessons are blocked', async ({ page }) => {
  await seedLearner(page);
  await page.goto('/learn/lesson/l3-raag-yaman');
  await expect(page.getByText(/is locked/)).toBeVisible();
});

test('every main page renders without errors', async ({ page }) => {
  const errors = collectErrors(page);
  await seedLearner(page);
  for (const path of ['/', '/learn', '/riyaz', '/studio/pitch', '/studio/drone', '/studio/sargam', '/studio/taal', '/studio/game', '/studio/ear', '/studio/keyboard', '/studio/record', '/studio/range', '/tutor', '/songs', '/videos', '/progress', '/settings', '/privacy', '/learn/checkpoint/1']) {
    await page.goto(path);
    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.getByText('Something went wrong on this page')).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test('audio tools start without errors (drone, sargam, metronome)', async ({ page }) => {
  const errors = collectErrors(page);
  await seedLearner(page);
  await page.goto('/studio/drone');
  await page.getByRole('button', { name: 'Play drone' }).click();
  await expect(page.getByRole('button', { name: 'Pause drone' })).toBeVisible();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'Pause drone' }).click();
  await page.goto('/studio/sargam');
  await page.getByRole('button', { name: 'Play pattern' }).click();
  await expect(page.locator('[aria-current="true"]')).toBeVisible({ timeout: 5000 });
  await page.getByRole('button', { name: 'Stop' }).click();
  await page.goto('/studio/taal');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  expect(errors).toEqual([]);
});

test('daily riyaz session runs and can be stopped', async ({ page }) => {
  await seedLearner(page);
  await page.goto('/riyaz');
  await page.getByRole('button', { name: '10 min' }).click();
  await page.getByRole('button', { name: /Start 10-minute session/ }).click();
  await expect(page.getByText(/Exercise 1 of/)).toBeVisible();
  await page.getByRole('button', { name: /Done — next/ }).click();
  await page.getByRole('button', { name: 'Skip' }).click();
  await page.getByRole('button', { name: 'Stop session' }).click();
  await expect(page.getByRole('heading', { name: 'Session summary' })).toBeVisible();
});

test('tutor works in honest demo mode without an API key, with instant safety guidance', async ({ page }) => {
  await seedLearner(page);
  await page.goto('/tutor');
  await expect(page.getByText(/AI tutor not configured/)).toBeVisible();
  await page.getByRole('button', { name: 'My throat hurts after practice' }).click();
  await expect(page.getByText('Please stop singing for now')).toBeVisible();
  await page.getByRole('button', { name: "Give me today's exercise" }).click();
  await expect(page.getByText(/Demo mode — this is not an AI response/)).toBeVisible();
});

test('videos can be saved by URL and marked watched without a YouTube key', async ({ page }) => {
  await seedLearner(page);
  await page.goto('/videos');
  await page.getByText('Mark watched').first().click();
  await expect(page.getByText('Watched').first()).toBeVisible();
  await page.getByRole('button', { name: /Saved \(0\)/ }).click();
  await page.getByLabel('YouTube link').fill('https://youtu.be/dQw4w9WgXcQ');
  await page.getByLabel('Title (optional)').fill('Test video');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByText('Test video')).toBeVisible();
  await page.getByLabel('YouTube link').fill('https://evil.example/watch?v=dQw4w9WgXcQ');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('doesn’t look like a YouTube');
});

test('Hindi explanations are available on lessons', async ({ page }) => {
  await seedLearner(page);
  await page.goto('/learn/lesson/l1-what-is-singing');
  await page.getByRole('button', { name: 'हिन्दी' }).click();
  await expect(page.locator('[lang="hi"]').first()).toContainText(/[ऀ-ॿ]/);
});
