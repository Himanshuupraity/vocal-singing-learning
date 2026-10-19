import express, { Router, type Request, type Response, type NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { Store, hashPassword, verifyPassword } from '../lib/store';

const COOKIE = 'ss_session';
const TTL = 30 * 24 * 3600 * 1000;
const Creds = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(200),
});

function readCookie(req: Request, name: string) {
  const h = req.headers.cookie;
  if (!h) return undefined;
  for (const part of h.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return undefined;
}

function setSession(req: Request, res: Response, token: string) {
  res.cookie(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: req.secure, maxAge: TTL, path: '/api' });
}

/**
 * Optional account sync. Auth uses an httpOnly session cookie (never readable
 * by page scripts) and requires a custom header on state-changing requests,
 * which cross-site forms cannot send (CSRF protection).
 */
export function accountRouter(store: Store) {
  const r = Router();
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'rate_limited', message: 'Too many attempts. Please wait 15 minutes.' } });

  const csrf = (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && req.get('X-SurSadhana') !== '1') return res.status(403).json({ error: 'forbidden' });
    next();
  };
  const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = readCookie(req, COOKIE);
    const uid = token ? store.sessionUser(token) : undefined;
    if (!uid) return res.status(401).json({ error: 'unauthenticated', message: 'Please log in.' });
    res.locals.userId = uid;
    res.locals.token = token;
    next();
  };

  r.use('/auth', csrf);
  r.use('/sync', csrf);

  r.post('/auth/register', authLimiter, async (req, res) => {
    const p = Creds.safeParse(req.body);
    if (!p.success) return res.status(400).json({ error: 'invalid_request', message: p.error.issues[0]?.message ?? 'Invalid email or password.' });
    if (store.userByEmail(p.data.email)) return res.status(409).json({ error: 'exists', message: 'An account with this email already exists. Log in instead.' });
    const id = store.createUser(p.data.email, await hashPassword(p.data.password));
    setSession(req, res, store.createSession(id, TTL));
    res.status(201).json({ email: p.data.email });
  });

  r.post('/auth/login', authLimiter, async (req, res) => {
    const p = Creds.safeParse(req.body);
    const fail = () => res.status(401).json({ error: 'invalid_credentials', message: 'Email or password is incorrect.' });
    if (!p.success) return fail();
    const u = store.userByEmail(p.data.email);
    // Verify against a dummy hash when the user doesn't exist to keep timing similar.
    const ok = await verifyPassword(p.data.password, u?.pw_hash ?? 'scrypt$16384$AAAAAAAAAAAAAAAAAAAAAA==$' + 'A'.repeat(86) + '==');
    if (!u || !ok) return fail();
    setSession(req, res, store.createSession(u.id, TTL));
    res.json({ email: u.email });
  });

  r.post('/auth/logout', (req, res) => {
    const token = readCookie(req, COOKIE);
    if (token) store.deleteSession(token);
    res.clearCookie(COOKIE, { path: '/api' });
    res.status(204).end();
  });

  r.get('/auth/me', auth, (_req, res) => {
    const u = store.userById(res.locals.userId);
    if (!u) return res.status(401).json({ error: 'unauthenticated' });
    const p = store.getProgress(u.id);
    res.json({ email: u.email, createdAt: u.created_at, sync: p ? { version: p.version, updatedAt: p.updated_at } : null });
  });

  r.delete('/auth/account', authLimiter, auth, async (req, res) => {
    const pw = z.object({ password: z.string().max(200) }).safeParse(req.body);
    const u = store.userById(res.locals.userId);
    if (!u || !pw.success || !(await verifyPassword(pw.data.password, u.pw_hash))) return res.status(401).json({ error: 'invalid_credentials', message: 'Password is incorrect.' });
    store.deleteUser(u.id);
    res.clearCookie(COOKIE, { path: '/api' });
    res.status(204).end();
  });

  r.get('/sync', auth, (_req, res) => {
    const p = store.getProgress(res.locals.userId);
    if (!p) return res.status(404).json({ error: 'none' });
    res.json({ data: JSON.parse(p.data), version: p.version, updatedAt: p.updated_at });
  });

  r.put('/sync', express.json({ limit: '3mb' }), auth, (req, res) => {
    const p = z.object({ data: z.record(z.string(), z.unknown()), baseVersion: z.number().int().min(0) }).safeParse(req.body);
    if (!p.success || typeof p.data.data.version !== 'number' || typeof p.data.data.profile !== 'object') return res.status(400).json({ error: 'invalid_request', message: 'Invalid progress data.' });
    const out = store.putProgress(res.locals.userId, JSON.stringify(p.data.data), p.data.baseVersion);
    if (!out.ok) {
      const cur = store.getProgress(res.locals.userId)!;
      return res.status(409).json({ error: 'conflict', message: 'Your progress changed on another device.', server: { data: JSON.parse(cur.data), version: cur.version, updatedAt: cur.updated_at } });
    }
    res.json({ version: out.version, updatedAt: out.updatedAt });
  });

  return r;
}
