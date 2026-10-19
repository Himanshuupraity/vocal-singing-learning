// @vitest-environment node
import request from 'supertest';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { createApp } from '../../server/app';
import { loadConfig } from '../../server/config';
import { PGlite } from '@electric-sql/pglite';
import { hashPassword, verifyPassword, SqlStore, sqliteQuery, type Store } from '../../server/lib/store';

const cfg = loadConfig({} as NodeJS.ProcessEnv);
const H = { 'X-SurSadhana': '1' };
const PW = 'correct horse 42';
const sample = (name: string) => ({ version: 1, profile: { name }, lessons: {} });

describe('password hashing', () => {
  it('hashes with scrypt and verifies', async () => {
    const h = await hashPassword(PW);
    expect(h.startsWith('scrypt$')).toBe(true);
    expect(h).not.toContain(PW);
    expect(await verifyPassword(PW, h)).toBe(true);
    expect(await verifyPassword('wrong password', h)).toBe(false);
  });
});

/** The same suite runs on SQLite (local) and on a real Postgres engine (the Vercel path). */
const backends: [string, () => Store][] = [
  ['sqlite', () => new SqlStore(sqliteQuery(':memory:'), false)],
  [
    'postgres',
    () => {
      const db = new PGlite();
      return new SqlStore(async (sql, params) => (await db.query<Record<string, unknown>>(sql, params)).rows, true);
    },
  ],
];

describe.each(backends)('learner profiles & sync (%s)', (_name, makeStore) => {
  const app = () => createApp(cfg, { store: makeStore(), logDir: path.join(os.tmpdir(), 'ss-logs') });
  const agent = (a = app()) => request.agent(a);
  const create = (a: ReturnType<typeof agent>, name: string, pin = '1234') => a.post('/api/profiles').set(H).send({ name, pin });

  it('requires the CSRF header on state-changing requests', async () => {
    expect((await agent().post('/api/profiles').send({ name: 'Asha', pin: '1234' })).status).toBe(403);
  });

  it('creates a profile, sets an httpOnly cookie, lists it and reports me', async () => {
    const a = agent();
    const r = await create(a, 'Himanshu');
    expect(r.status).toBe(201);
    const cookie = String(r.headers['set-cookie']);
    expect(cookie).toMatch(/ss_session=/);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Lax/i);
    const me = await a.get('/api/auth/me');
    expect(me.body.name).toBe('Himanshu');
    expect(me.body.sync).toBeNull();
    const list = await a.get('/api/profiles');
    expect(list.body.profiles.map((p: { name: string }) => p.name)).toEqual(['Himanshu']);
    expect(JSON.stringify(list.body)).not.toMatch(/scrypt|pin/i);
  });

  it('validates names and PINs and rejects duplicate names case-insensitively', async () => {
    const a = agent();
    expect((await create(a, 'Riya', '12')).status).toBe(400);
    expect((await create(a, 'Riya', 'abcd')).status).toBe(400);
    expect((await create(a, '<script>', '1234')).status).toBe(400);
    expect((await create(a, '  ', '1234')).status).toBe(400);
    expect((await create(a, 'Riya')).status).toBe(201);
    const dup = await create(a, '  riya ');
    expect(dup.status).toBe(409);
    expect(dup.body.message).toMatch(/already taken/);
  });

  it('opens a profile on a second device only with the right PIN', async () => {
    const server = app();
    const a = agent(server);
    const { body } = await create(a, 'Meera', '4321');
    await a.put('/api/sync').set(H).send({ data: sample('Meera'), baseVersion: 0 });
    const b = agent(server);
    expect((await b.get('/api/sync')).status).toBe(401);
    const wrong = await b.post(`/api/profiles/${body.id}/unlock`).set(H).send({ pin: '0000' });
    expect(wrong.status).toBe(401);
    expect(wrong.body.message).toBe('Wrong PIN. 4 tries left.');
    const ok = await b.post(`/api/profiles/${body.id}/unlock`).set(H).send({ pin: '4321' });
    expect(ok.status).toBe(200);
    expect(ok.body.name).toBe('Meera');
    expect((await b.get('/api/sync')).body.data.profile.name).toBe('Meera');
    expect((await b.post('/api/profiles/nope/unlock').set(H).send({ pin: '4321' })).status).toBe(404);
  });

  it('locks a profile after 5 wrong PINs, even for the right PIN, and resets the count on success', async () => {
    const a = agent();
    const { body } = await create(a, 'Kabir', '1111');
    const unlock = (pin: string) => a.post(`/api/profiles/${body.id}/unlock`).set(H).send({ pin });
    await unlock('2222');
    expect((await unlock('1111')).status).toBe(200);
    expect((await unlock('2222')).body.message).toBe('Wrong PIN. 4 tries left.');
    for (let i = 0; i < 3; i++) await unlock('2222');
    const fifth = await unlock('2222');
    expect(fifth.status).toBe(423);
    expect(fifth.body.message).toMatch(/Too many wrong PINs\. Try again in 15 minutes/);
    expect((await unlock('1111')).status).toBe(423);
  });

  it('syncs with optimistic versioning and reports conflicts', async () => {
    const a = agent();
    await create(a, 'Tara');
    expect((await a.get('/api/sync')).status).toBe(404);
    const p1 = await a.put('/api/sync').set(H).send({ data: sample('one'), baseVersion: 0 });
    expect(p1.body.version).toBe(1);
    expect((await a.get('/api/sync')).body.data.profile.name).toBe('one');
    const stale = await a.put('/api/sync').set(H).send({ data: sample('stale'), baseVersion: 0 });
    expect(stale.status).toBe(409);
    expect(stale.body.server.version).toBe(1);
    const p2 = await a.put('/api/sync').set(H).send({ data: sample('two'), baseVersion: 1 });
    expect(p2.body.version).toBe(2);
    expect((await a.put('/api/sync').set(H).send({ data: sample('old'), baseVersion: 1 })).status).toBe(409);
    expect((await a.put('/api/sync').set(H).send({ data: { nope: 1 }, baseVersion: 2 })).status).toBe(400);
    const list = await a.get('/api/profiles');
    expect(list.body.profiles[0].lastActive).toBe(p2.body.updatedAt);
  });

  it('accepts large progress payloads (up to ~3MB)', async () => {
    const a = agent();
    await create(a, 'Big');
    const data = { ...sample('big'), pitchAttempts: Array.from({ length: 3000 }, (_, i) => ({ id: String(i), note: 'x'.repeat(200) })) };
    expect((await a.put('/api/sync').set(H).send({ data, baseVersion: 0 })).status).toBe(200);
  });

  it('blocks sync after switching learner (logout)', async () => {
    const a = agent();
    expect((await a.get('/api/sync')).status).toBe(401);
    await create(a, 'Dev');
    await a.post('/api/auth/logout').set(H);
    expect((await a.get('/api/auth/me')).status).toBe(401);
  });

  it('changes the PIN only with the current one, and signs out other devices', async () => {
    const server = app();
    const a = agent(server);
    const { body } = await create(a, 'Nisha', '1357');
    const b = agent(server);
    expect((await b.post(`/api/profiles/${body.id}/unlock`).set(H).send({ pin: '1357' })).status).toBe(200);
    const change = (pins: object) => a.post('/api/profiles/me/pin').set(H).send(pins);
    expect((await agent(server).post('/api/profiles/me/pin').set(H).send({ currentPin: '1357', newPin: '2468' })).status).toBe(401);
    expect((await change({ currentPin: '0000', newPin: '2468' })).body.message).toBe('Current PIN is incorrect.');
    expect((await change({ currentPin: '1357', newPin: '24' })).status).toBe(400);
    expect((await change({ currentPin: '1357', newPin: '1357' })).body.error).toBe('same_pin');
    expect((await change({ currentPin: '1357', newPin: '2468' })).status).toBe(204);
    // this device stays signed in; the other one has to enter the new PIN
    expect((await a.get('/api/auth/me')).status).toBe(200);
    expect((await b.get('/api/auth/me')).status).toBe(401);
    expect((await b.post(`/api/profiles/${body.id}/unlock`).set(H).send({ pin: '1357' })).status).toBe(401);
    expect((await b.post(`/api/profiles/${body.id}/unlock`).set(H).send({ pin: '2468' })).status).toBe(200);
  });

  it('deletes a profile and its data only with the correct PIN', async () => {
    const a = agent();
    await create(a, 'Esha', '5555');
    await a.put('/api/sync').set(H).send({ data: sample('x'), baseVersion: 0 });
    expect((await a.delete('/api/profiles/me').set(H).send({ pin: '0000' })).status).toBe(401);
    expect((await a.delete('/api/profiles/me').set(H).send({ pin: '5555' })).status).toBe(204);
    expect((await a.get('/api/profiles')).body.profiles).toEqual([]);
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
