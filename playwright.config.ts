import { defineConfig, devices } from '@playwright/test';

const PORT = 4319;

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  webServer: {
    // Production build served by the real Express server, with an in-memory account DB.
    command: `npm run build && cross-env NODE_ENV=production PORT=${PORT} DATA_DIR=:memory: ANTHROPIC_API_KEY= YOUTUBE_API_KEY= tsx server/index.ts`,
    url: `http://localhost:${PORT}/api/status`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], launchOptions: { args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] }, permissions: ['microphone'] },
    },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
});
