import { expect, test } from '@playwright/test';
import { seedLearner } from './helpers';

test('no horizontal scrolling at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 760 });
  await seedLearner(page);
  for (const path of ['/', '/learn', '/learn/lesson/l1-what-is-singing', '/riyaz', '/studio/pitch', '/studio/taal', '/tutor', '/songs', '/videos', '/progress', '/settings']) {
    await page.goto(path);
    await expect(page.locator('main h1').first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(1);
  }
});
