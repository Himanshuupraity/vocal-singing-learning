import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Tiny persistence layer for optional account sync, using Node's built-in
 * SQLite (no external service or API key). Only learning data is stored —
 * never recordings.
 */
export class Store {
  db: DatabaseSync;
  constructor(dataDir: string) {
    if (dataDir !== ':memory:') fs.mkdirSync(dataDir, { recursive: true });
    this.db = new DatabaseSync(dataDir === ':memory:' ? ':memory:' : path.join(dataDir, 'sursadhana.db'));
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, pw_hash TEXT NOT NULL, created_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS progress (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, data TEXT NOT NULL, version INTEGER NOT NULL, updated_at TEXT NOT NULL);
    `);
  }

  createUser(email: string, pwHash: string) {
    const id = crypto.randomUUID();
    this.db.prepare('INSERT INTO users (id, email, pw_hash, created_at) VALUES (?, ?, ?, ?)').run(id, email, pwHash, new Date().toISOString());
    return id;
  }
  userByEmail(email: string) {
    return this.db.prepare('SELECT id, email, pw_hash FROM users WHERE email = ?').get(email) as { id: string; email: string; pw_hash: string } | undefined;
  }
  userById(id: string) {
    return this.db.prepare('SELECT id, email, pw_hash, created_at FROM users WHERE id = ?').get(id) as { id: string; email: string; pw_hash: string; created_at: string } | undefined;
  }
  deleteUser(id: string) {
    this.db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }

  createSession(userId: string, ttlMs: number) {
    const token = crypto.randomBytes(32).toString('base64url');
    this.db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(hashToken(token), userId, Date.now() + ttlMs);
    this.db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());
    return token;
  }
  sessionUser(token: string) {
    const row = this.db.prepare('SELECT user_id, expires_at FROM sessions WHERE token_hash = ?').get(hashToken(token)) as { user_id: string; expires_at: number } | undefined;
    if (!row || row.expires_at < Date.now()) return undefined;
    return row.user_id;
  }
  deleteSession(token: string) {
    this.db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
  }

  getProgress(userId: string) {
    return this.db.prepare('SELECT data, version, updated_at FROM progress WHERE user_id = ?').get(userId) as { data: string; version: number; updated_at: string } | undefined;
  }
  /** Optimistic concurrency: only writes if the stored version equals baseVersion (0 = none yet). */
  putProgress(userId: string, data: string, baseVersion: number): { ok: true; version: number; updatedAt: string } | { ok: false } {
    const cur = this.getProgress(userId);
    if ((cur?.version ?? 0) !== baseVersion) return { ok: false };
    const version = baseVersion + 1;
    const updatedAt = new Date().toISOString();
    this.db.prepare('INSERT INTO progress (user_id, data, version, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, version = excluded.version, updated_at = excluded.updated_at').run(userId, data, version, updatedAt);
    return { ok: true, version, updatedAt };
  }
}

export const hashToken = (t: string) => crypto.createHash('sha256').update(t).digest('hex');

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

export function hashPassword(pw: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  return new Promise((resolve, reject) =>
    crypto.scrypt(pw, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p }, (err, key) => (err ? reject(err) : resolve(`scrypt$${SCRYPT.N}$${salt.toString('base64')}$${key.toString('base64')}`))),
  );
}

export function verifyPassword(pw: string, stored: string): Promise<boolean> {
  const [alg, n, saltB64, keyB64] = stored.split('$');
  if (alg !== 'scrypt' || !saltB64 || !keyB64) return Promise.resolve(false);
  const expected = Buffer.from(keyB64, 'base64');
  return new Promise((resolve) =>
    crypto.scrypt(pw, Buffer.from(saltB64, 'base64'), expected.length, { N: Number(n), r: SCRYPT.r, p: SCRYPT.p }, (err, key) => resolve(!err && crypto.timingSafeEqual(key, expected))),
  );
}
