import express, { Router, type Request, type Response, type NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { hashPassword, verifyPassword, type Store } from '../lib/store';

const COOKIE = 'ss_session';
const TTL = 180 * 24 * 3600 * 1000;
/** A 4-digit PIN has only 10,000 values, so wrong guesses lock the profile for a while. */
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;

const Name = z
  .string()
  .trim()
  .min(1, 'Please enter a name.')
  .max(30, 'Names can be up to 30 characters.')
  .regex(/^[\p{L}\p{M}\p{N} .'-]+$/u, 'Use letters, numbers and spaces only.');
const Pin = z.string().regex(/^\d{4}$/, 'The PIN must be exactly 4 digits.');

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

const lockedMessage = (until: number) => `Too many wrong PINs. Try again in ${Math.max(1, Math.ceil((until - Date.now()) / 60000))} minutes.`;

/**
 * Learner profiles for using the same progress on several devices. Anyone can
 * see the list of names; opening one needs its PIN. Sessions use an httpOnly
 * cookie (never readable by page scripts), and state-changing requests need a
 * custom header that cross-site forms cannot send (CSRF protection).
 */
export function accountRouter(store: Store) {
  const r = Router();
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'rate_limited', message: 'Too many attempts. Please wait 15 minutes.' } });

  const csrf = (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && req.get('X-SurSadhana') !== '1') return res.status(403).json({ error: 'forbidden' });
    next();
  };
  const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = readCookie(req, COOKIE);
    const id = token ? await store.sessionProfile(token) : undefined;
    if (!id) return res.status(401).json({ error: 'unauthenticated', message: 'Please choose your name again.' });
    res.locals.profileId = id;
    res.locals.token = token;
    next();
  };

  r.use('/profiles', csrf);
  r.use('/auth', csrf);
  r.use('/sync', csrf);

  r.get('/profiles', async (_req, res) => {
    res.json({ profiles: await store.listProfiles(), persistent: store.persistent });
  });

  r.post('/profiles', authLimiter, async (req, res) => {
    const p = z.object({ name: Name, pin: Pin }).safeParse(req.body);
    if (!p.success) return res.status(400).json({ error: 'invalid_request', message: p.error.issues[0]?.message ?? 'Invalid name or PIN.' });
    const id = await store.createProfile(p.data.name, await hashPassword(p.data.pin));
    if (!id) return res.status(409).json({ error: 'exists', message: 'That name is already taken. Pick it from the list, or use a different name.' });
    setSession(req, res, await store.createSession(id, TTL));
    res.status(201).json({ id, name: p.data.name });
  });

  r.post('/profiles/:id/unlock', authLimiter, async (req, res) => {
    const pin = Pin.safeParse(req.body?.pin);
    const prof = await store.profileById(String(req.params.id));
    if (!prof) return res.status(404).json({ error: 'not_found', message: 'That learner no longer exists.' });
    if (prof.lockedUntil > Date.now()) return res.status(423).json({ error: 'locked', message: lockedMessage(prof.lockedUntil) });
    if (!pin.success || !(await verifyPassword(pin.data, prof.pinHash))) {
      const f = await store.recordFailure(prof.id, MAX_FAILS, LOCK_MS);
      if (f.lockedUntil > Date.now()) return res.status(423).json({ error: 'locked', message: lockedMessage(f.lockedUntil) });
      const left = MAX_FAILS - f.failed;
      return res.status(401).json({ error: 'wrong_pin', message: `Wrong PIN. ${left} ${left === 1 ? 'try' : 'tries'} left.` });
    }
    if (prof.failed) await store.clearFailures(prof.id);
    setSession(req, res, await store.createSession(prof.id, TTL));
    res.json({ id: prof.id, name: prof.name });
  });

  r.get('/auth/me', auth, async (_req, res) => {
    const prof = await store.profileById(res.locals.profileId);
    if (!prof) return res.status(401).json({ error: 'unauthenticated' });
    const p = await store.getProgress(prof.id);
    res.json({ id: prof.id, name: prof.name, sync: p ? { version: p.version, updatedAt: p.updatedAt } : null });
  });

  r.post('/auth/logout', async (req, res) => {
    const token = readCookie(req, COOKIE);
    if (token) await store.deleteSession(token);
    res.clearCookie(COOKIE, { path: '/api' });
    res.status(204).end();
  });

  r.post('/profiles/me/pin', authLimiter, auth, async (req, res) => {
    const p = z.object({ currentPin: z.string().max(10), newPin: Pin }).safeParse(req.body);
    if (!p.success) return res.status(400).json({ error: 'invalid_request', message: p.error.issues[0]?.message ?? 'Invalid PIN.' });
    const prof = await store.profileById(res.locals.profileId);
    if (!prof) return res.status(401).json({ error: 'unauthenticated' });
    if (prof.lockedUntil > Date.now()) return res.status(423).json({ error: 'locked', message: lockedMessage(prof.lockedUntil) });
    // A wrong current PIN counts towards the same lockout as opening the profile.
    if (!(await verifyPassword(p.data.currentPin, prof.pinHash))) {
      const f = await store.recordFailure(prof.id, MAX_FAILS, LOCK_MS);
      if (f.lockedUntil > Date.now()) return res.status(423).json({ error: 'locked', message: lockedMessage(f.lockedUntil) });
      return res.status(401).json({ error: 'wrong_pin', message: 'Current PIN is incorrect.' });
    }
    if (p.data.newPin === p.data.currentPin) return res.status(400).json({ error: 'same_pin', message: 'The new PIN is the same as the current one.' });
    await store.changePin(prof.id, await hashPassword(p.data.newPin), res.locals.token);
    res.status(204).end();
  });

  r.delete('/profiles/me', authLimiter, auth, async (req, res) => {
    const pin = Pin.safeParse(req.body?.pin);
    const prof = await store.profileById(res.locals.profileId);
    if (!prof || !pin.success || !(await verifyPassword(pin.data, prof.pinHash))) return res.status(401).json({ error: 'wrong_pin', message: 'PIN is incorrect.' });
    await store.deleteProfile(prof.id);
    res.clearCookie(COOKIE, { path: '/api' });
    res.status(204).end();
  });

  r.get('/sync', auth, async (_req, res) => {
    const p = await store.getProgress(res.locals.profileId);
    if (!p) return res.status(404).json({ error: 'none' });
    res.json({ data: JSON.parse(p.data), version: p.version, updatedAt: p.updatedAt });
  });

  r.put('/sync', express.json({ limit: '3mb' }), auth, async (req, res) => {
    const p = z.object({ data: z.record(z.string(), z.unknown()), baseVersion: z.number().int().min(0) }).safeParse(req.body);
    if (!p.success || typeof p.data.data.version !== 'number' || typeof p.data.data.profile !== 'object') return res.status(400).json({ error: 'invalid_request', message: 'Invalid progress data.' });
    const out = await store.putProgress(res.locals.profileId, JSON.stringify(p.data.data), p.data.baseVersion);
    if (!out.ok) {
      const cur = (await store.getProgress(res.locals.profileId))!;
      return res.status(409).json({ error: 'conflict', message: 'Your progress changed on another device.', server: { data: JSON.parse(cur.data), version: cur.version, updatedAt: cur.updatedAt } });
    }
    res.json({ version: out.version, updatedAt: out.updatedAt });
  });

  return r;
}
