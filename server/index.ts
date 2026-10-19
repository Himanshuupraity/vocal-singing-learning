import { createApp } from './app';
import { loadConfig } from './config';

const cfg = loadConfig();
const app = createApp(cfg, { serveStatic: process.env.NODE_ENV === 'production' });

app.listen(cfg.port, () => {
  console.log(`SurSadhana API on http://localhost:${cfg.port}`);
  console.log(`  AI tutor:      ${cfg.anthropicKey ? `configured (${cfg.claudeModel})` : 'NOT configured — set ANTHROPIC_API_KEY (demo mode in UI)'}`);
  console.log(`  YouTube API:   ${cfg.youtubeKey ? 'configured' : 'NOT configured — UI shows "Search on YouTube" links'}`);
  console.log('  Song search:   iTunes Search API (no key needed)');
});
