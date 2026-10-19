import type { Page } from '@playwright/test';

/** Seeds an onboarded learner so tests can start on any page. */
export async function seedLearner(page: Page, extra: Record<string, unknown> = {}) {
  await page.addInitScript((extraJson) => {
    if (localStorage.getItem('sursadhana:data')) return;
    const now = new Date().toISOString();
    localStorage.setItem(
      'sursadhana:data',
      JSON.stringify({
        version: 1,
        createdAt: now,
        profile: { onboarded: true, name: 'Test', experience: 'none', language: 'english', dailyMinutes: 20, favoriteSongs: '', favoriteSingers: '', focus: 'both', hasMic: true, hasHeadphones: true, tonic: { note: 'C', octave: 3 }, tonicSource: 'chosen', startedAt: now },
        ...JSON.parse(extraJson),
      }),
    );
  }, JSON.stringify(extra));
}

export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  return errors;
}
