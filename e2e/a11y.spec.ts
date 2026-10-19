import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { seedLearner } from './helpers';

const PAGES = ['/', '/learn', '/learn/lesson/l1-what-is-singing', '/riyaz', '/studio/pitch', '/studio/drone', '/studio/taal', '/studio/keyboard', '/tutor', '/songs', '/videos', '/progress', '/settings', '/privacy'];

for (const theme of ['light', 'dark'] as const) {
  for (const path of PAGES) {
    test(`a11y (${theme}) ${path}`, async ({ page }, info) => {
      test.skip(info.project.name !== 'chromium', 'axe audit runs once, in Chromium');
      await seedLearner(page, { settings: { theme, droneVolume: 0.5, recordingConsent: false, demoTimbre: 'reed', referenceTimbre: 'pure', errorReports: false } });
      await page.goto(path);
      await expect(page.locator('main h1').first()).toBeVisible();
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const serious = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.help} — ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
    });
  }
}
