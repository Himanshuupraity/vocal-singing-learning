// Writes .vercel/output (Vercel Build Output API v3) from the Vite build in
// dist/ plus the Express API bundled into a single Node function.
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const out = '.vercel/output';
const fn = path.join(out, 'functions/api.func');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(fn, { recursive: true });
fs.cpSync('dist', path.join(out, 'static'), { recursive: true });

await build({
  entryPoints: ['server/vercel.ts'],
  outfile: path.join(fn, 'index.mjs'),
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  // Express and friends are CommonJS and call require() at runtime.
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
  logLevel: 'warning',
});

fs.writeFileSync(path.join(fn, '.vc-config.json'), JSON.stringify({
  runtime: 'nodejs22.x',
  handler: 'index.mjs',
  launcherType: 'Nodejs',
  shouldAddHelpers: false,
  maxDuration: 60,
}, null, 2));

fs.writeFileSync(path.join(out, 'config.json'), JSON.stringify({
  version: 3,
  routes: [
    { src: '^/api(?:/.*)?$', dest: '/api' },
    { src: '^/assets/(.*)$', headers: { 'cache-control': 'public, max-age=31536000, immutable' }, continue: true },
    { handle: 'filesystem' },
    { src: '/(.*)', dest: '/index.html' },
  ],
}, null, 2));

console.log('Vercel output written to', out);
