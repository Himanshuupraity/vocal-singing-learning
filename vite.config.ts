/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Identifies this build; the running app compares it with /version.json to notice a newer deploy. */
const BUILD_ID = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || new Date().toISOString();

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'sursadhana-version',
      apply: 'build',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ id: BUILD_ID }) });
      },
    },
  ],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:8787' },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
