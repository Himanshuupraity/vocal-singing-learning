import express from 'express';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { tutorModel, type ServerConfig } from './config';
import { tutorRouter, type ClientFactory, type GeminiFactory } from './routes/tutor';
import { youtubeRouter } from './routes/youtube';
import { songsRouter } from './routes/songs';
import { clientErrorsRouter } from './routes/clientErrors';
import { accountRouter } from './routes/account';
import { openStore, type Store } from './lib/store';

export function createApp(cfg: ServerConfig, deps: { makeClient?: ClientFactory; makeGemini?: GeminiFactory; fetchImpl?: typeof fetch; serveStatic?: boolean; logDir?: string; dataDir?: string; store?: Store } = {}) {
  const store = deps.store ?? openStore({ databaseUrl: cfg.databaseUrl, dataDir: deps.dataDir ?? process.env.DATA_DIR ?? 'data' });
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  const smallJson = express.json({ limit: '64kb', type: ['application/json', 'text/plain'] });
  // Sync and voice feedback carry larger bodies and parse them on their own routes.
  app.use((req, res, next) => (['/api/sync', '/api/tutor/voice', '/api/tutor/coach'].includes(req.path) ? next() : smallJson(req, res, next)));
  app.use((_, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: cfg.tutorRateLimit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'rate_limited', message: 'Too many tutor requests. Please take a short break and try again in a few minutes.' },
  });
  const searchLimiter = rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'rate_limited', message: 'Too many searches — please slow down.' } });

  app.get('/api/status', (_, res) => {
    res.json({
      ok: true,
      tutor: { configured: !!cfg.tutorProvider, provider: cfg.tutorProvider, model: tutorModel(cfg), voice: !!cfg.geminiKey },
      youtube: { configured: !!cfg.youtubeKey },
      songs: { configured: true, provider: 'iTunes Search API' },
      accounts: { enabled: true, persistent: store.persistent },
    });
  });

  app.use('/api/tutor', aiLimiter);
  app.use('/api/songs/plan', aiLimiter);
  app.use('/api/youtube', searchLimiter);
  app.use('/api/songs/search', searchLimiter);
  app.use('/api', tutorRouter(cfg, deps.makeClient, deps.makeGemini));
  app.use('/api', youtubeRouter(cfg, deps.fetchImpl));
  app.use('/api', songsRouter(deps.fetchImpl));
  app.use('/api/client-errors', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.use('/api', clientErrorsRouter(deps.logDir));
  app.use('/api', accountRouter(store));
  app.use('/api', (_, res) => res.status(404).json({ error: 'not_found' }));

  if (deps.serveStatic) {
    const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
    if (fs.existsSync(dist)) {
      app.use(express.static(dist, { index: false, maxAge: '1h' }));
      app.get(/^(?!\/api).*/, (_, res) => res.sendFile(path.join(dist, 'index.html')));
    }
  }

  app.use((err: Error & { type?: string }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'too_large', message: 'Request too large.' });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'invalid_json', message: 'Invalid JSON.' });
    console.error(err);
    res.status(500).json({ error: 'server_error', message: 'Unexpected server error.' });
  });
  return app;
}
