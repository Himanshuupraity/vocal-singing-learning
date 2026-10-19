import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

const Report = z.object({
  message: z.string().max(500),
  stack: z.string().max(2000).optional().default(''),
  source: z.string().max(50),
  path: z.string().max(200),
  ua: z.string().max(200).optional().default(''),
});

/** Self-hosted crash reporting: appends JSON lines to logs/client-errors.log (no third-party service). */
export function clientErrorsRouter(logDir = process.env.LOG_DIR || path.resolve('logs')) {
  const r = Router();
  r.post('/client-errors', (req, res) => {
    const p = Report.safeParse(req.body);
    if (!p.success) return res.status(400).json({ error: 'invalid_request' });
    const line = JSON.stringify({ at: new Date().toISOString(), ...p.data }) + '\n';
    console.warn('[client-error]', p.data.source, p.data.path, p.data.message);
    try {
      fs.mkdirSync(logDir, { recursive: true });
      fs.appendFileSync(path.join(logDir, 'client-errors.log'), line);
    } catch {
      /* logging must never break the app */
    }
    res.status(204).end();
  });
  return r;
}
