// @vitest-environment node
import request from 'supertest';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { createApp } from '../../server/app';
import { loadConfig } from '../../server/config';
import { hashPassword, verifyPassword } from '../../server/lib/store';

const cfg = loadConfig({} as NodeJS.ProcessEnv);
const H = { 'X-SurSadhana': '1' };
const PW = 'correct horse 42';
const sample = (name: string) => ({ version: 1, profile: { name }, lessons: {} });

function agent() {
  return request.agent(createApp(cfg, { dataDir: ':memory:', logDir: path.join(os.tmpdir(), 'ss-logs') }));
}

describe('password hashing', () => {
  it('hashes with scrypt and verifies', async () => {
    const h = await hashPassword(PW);
    expect(h.startsWith('scrypt$')).toBe(true);
    expect(h).not.toContain(PW);
    expect(await verifyPassword(PW, h)).toBe(true);
    expect(await verifyPassword('wrong password', h)).toBe(false);
  });
});

describe('accounts & sync', () => {
  it('requires the CSRF header on state-changing requests', async () => {
    const a = agent();
    const r = await a.post('/api/auth/register').send({ email: 'a@example.com', password: PW });
    expect(r.status).toBe(403);
  });

  it('registers, sets an httpOnly cookie, and reports me', async () => {
    const a = agent();
    const r = await a.post('/api/auth/register').set(H).send({ email: 'A@Example.com', password: PW });
    expect(r.status).toBe(201);
    const cookie = String(r.headers['set-cookie']);
    expect(cookie).toMatch(/ss_session=/);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Lax/i);
    const me = await a.get('/api/auth/me');
    expect(me.body.email).toBe('a@example.com');
    expect(me.body.sync).toBeNull();
  });

  it('rejects short passwords, duplicate emails and wrong logins', async () => {
    const a = agent();
    expect((await a.post('/api/auth/register').set(H).send({ email: 'b@example.com', password: 'short' })).status).toBe(400);
    expect((await a.post('/api/auth/register').set(H).send({ email: 'b@example.com', password: PW })).status).toBe(201);
    expect((await a.post('/api/auth/register').set(H).send({ email: 'b@example.com', password: PW })).status).toBe(409);
    const bad = await a.post('/api/auth/login').set(H).send({ email: 'b@example.com', password: 'nope nope nope' });
    expect(bad.status).toBe(401);
    expect(bad.body.message).toBe('Email or password is incorrect.');
    const unknown = await a.post('/api/auth/login').set(H).send({ email: 'nobody@example.com', password: PW });
    expect(unknown.body.message).toBe('Email or password is incorrect.');
  });

  it('syncs with optimistic versioning and reports conflicts', async () => {
    const a = agent();
    await a.post('/api/auth/register').set(H).send({ email: 'c@example.com', password: PW });
    expect((await a.get('/api/sync')).status).toBe(404);
    const p1 = await a.put('/api/sync').set(H).send({ data: sample('one'), baseVersion: 0 });
    expect(p1.body.version).toBe(1);
    const g = await a.get('/api/sync');
    expect(g.body.data.profile.name).toBe('one');
    const stale = await a.put('/api/sync').set(H).send({ data: sample('stale'), baseVersion: 0 });
    expect(stale.status).toBe(409);
    expect(stale.body.server.version).toBe(1);
    const p2 = await a.put('/api/sync').set(H).send({ data: sample('two'), baseVersion: 1 });
    expect(p2.body.version).toBe(2);
    expect((await a.put('/api/sync').set(H).send({ data: { nope: 1 }, baseVersion: 2 })).status).toBe(400);
  });

  it('accepts large progress payloads (up to ~3MB)', async () => {
    const a = agent();
    await a.post('/api/auth/register').set(H).send({ email: 'big@example.com', password: PW });
    const data = { ...sample('big'), pitchAttempts: Array.from({ length: 3000 }, (_, i) => ({ id: String(i), note: 'x'.repeat(200) })) };
    expect((await a.put('/api/sync').set(H).send({ data, baseVersion: 0 })).status).toBe(200);
  });

  it('blocks sync when logged out and after logout', async () => {
    const a = agent();
    expect((await a.get('/api/sync')).status).toBe(401);
    await a.post('/api/auth/register').set(H).send({ email: 'd@example.com', password: PW });
    await a.post('/api/auth/logout').set(H);
    expect((await a.get('/api/auth/me')).status).toBe(401);
    const login = await a.post('/api/auth/login').set(H).send({ email: 'd@example.com', password: PW });
    expect(login.status).toBe(200);
    expect((await a.get('/api/auth/me')).status).toBe(200);
  });

  it('deletes the account and its data only with the correct password', async () => {
    const a = agent();
    await a.post('/api/auth/register').set(H).send({ email: 'e@example.com', password: PW });
    await a.put('/api/sync').set(H).send({ data: sample('x'), baseVersion: 0 });
    expect((await a.delete('/api/auth/account').set(H).send({ password: 'wrong wrong' })).status).toBe(401);
    expect((await a.delete('/api/auth/account').set(H).send({ password: PW })).status).toBe(204);
    expect((await a.post('/api/auth/login').set(H).send({ email: 'e@example.com', password: PW })).status).toBe(401);
  });
});

describe('client error reports', () => {
  it('stores a report as a JSON line and validates input', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ss-err-'));
    const app = createApp(cfg, { dataDir: ':memory:', logDir: dir });
    expect((await request(app).post('/api/client-errors').send({ message: 'boom', source: 'react', path: '/x' })).status).toBe(204);
    expect((await request(app).post('/api/client-errors').send({ nope: true })).status).toBe(400);
    const lines = fs.readFileSync(path.join(dir, 'client-errors.log'), 'utf8').trim().split('\n');
    expect(JSON.parse(lines[0]).message).toBe('boom');
  });
});
