import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Persistence for learner profiles and their synced progress. Only learning
 * data is stored — never recordings. Two backends share one SQL dialect subset:
 * Postgres (DATABASE_URL, used on hosts like Vercel where the disk is not kept)
 * and Node's built-in SQLite (local development and tests).
 */
export interface Profile {
  id: string;
  name: string;
  pinHash: string;
  failed: number;
  lockedUntil: number;
  createdAt: string;
}
export interface ProfileSummary {
  id: string;
  name: string;
  lastActive: string | null;
}
export interface Progress {
  data: string;
  version: number;
  updatedAt: string;
}

export interface Store {
  readonly persistent: boolean;
  listProfiles(): Promise<ProfileSummary[]>;
  /** Returns null when the name is already taken (case-insensitive). */
  createProfile(name: string, pinHash: string): Promise<string | null>;
  profileById(id: string): Promise<Profile | undefined>;
  /** Counts a wrong PIN; locks the profile for `lockMs` once `max` is reached. */
  recordFailure(id: string, max: number, lockMs: number): Promise<{ failed: number; lockedUntil: number }>;
  clearFailures(id: string): Promise<void>;
  deleteProfile(id: string): Promise<void>;
  createSession(profileId: string, ttlMs: number): Promise<string>;
  sessionProfile(token: string): Promise<string | undefined>;
  deleteSession(token: string): Promise<void>;
  getProgress(profileId: string): Promise<Progress | undefined>;
  /** Optimistic concurrency: only writes if the stored version equals baseVersion (0 = none yet). */
  putProgress(profileId: string, data: string, baseVersion: number): Promise<{ ok: true; version: number; updatedAt: string } | { ok: false }>;
}

type Row = Record<string, unknown>;
/** Runs one parameterised statement ($1, $2 … placeholders) and returns its rows. */
export type Query = (sql: string, params?: unknown[]) => Promise<Row[]>;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS ss_profiles (id TEXT PRIMARY KEY, name TEXT NOT NULL, name_key TEXT NOT NULL UNIQUE, pin_hash TEXT NOT NULL, failed INTEGER NOT NULL DEFAULT 0, locked_until BIGINT NOT NULL DEFAULT 0, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS ss_sessions (token_hash TEXT PRIMARY KEY, profile_id TEXT NOT NULL REFERENCES ss_profiles(id) ON DELETE CASCADE, expires_at BIGINT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS ss_progress (profile_id TEXT PRIMARY KEY REFERENCES ss_profiles(id) ON DELETE CASCADE, data TEXT NOT NULL, version INTEGER NOT NULL, updated_at TEXT NOT NULL)`,
];

export const nameKey = (name: string) => name.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');

/** The one implementation, written against a generic `Query` so both backends run the same SQL. */
export class SqlStore implements Store {
  private ready: Promise<void>;
  constructor(
    private q: Query,
    readonly persistent: boolean,
  ) {
    this.ready = (async () => {
      for (const s of SCHEMA) await q(s);
    })();
  }
  private async run(sql: string, params: unknown[] = []) {
    await this.ready;
    return this.q(sql, params);
  }

  async listProfiles() {
    const rows = await this.run(
      'SELECT p.id, p.name, g.updated_at FROM ss_profiles p LEFT JOIN ss_progress g ON g.profile_id = p.id ORDER BY COALESCE(g.updated_at, p.created_at) DESC LIMIT 100',
    );
    return rows.map((r) => ({ id: String(r.id), name: String(r.name), lastActive: r.updated_at ? String(r.updated_at) : null }));
  }

  async createProfile(name: string, pinHash: string) {
    const id = crypto.randomUUID();
    const rows = await this.run(
      'INSERT INTO ss_profiles (id, name, name_key, pin_hash, created_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (name_key) DO NOTHING RETURNING id',
      [id, name, nameKey(name), pinHash, new Date().toISOString()],
    );
    return rows.length ? id : null;
  }

  async profileById(id: string) {
    const [r] = await this.run('SELECT id, name, pin_hash, failed, locked_until, created_at FROM ss_profiles WHERE id = $1', [id]);
    if (!r) return undefined;
    return { id: String(r.id), name: String(r.name), pinHash: String(r.pin_hash), failed: Number(r.failed), lockedUntil: Number(r.locked_until), createdAt: String(r.created_at) };
  }

  async recordFailure(id: string, max: number, lockMs: number) {
    // One statement, so parallel wrong guesses cannot both slip under the limit.
    const [r] = await this.run(
      `UPDATE ss_profiles SET
         locked_until = CASE WHEN failed + 1 >= $2 THEN $3 ELSE locked_until END,
         failed = CASE WHEN failed + 1 >= $2 THEN 0 ELSE failed + 1 END
       WHERE id = $1 RETURNING failed, locked_until`,
      [id, max, Date.now() + lockMs],
    );
    return { failed: Number(r?.failed ?? 0), lockedUntil: Number(r?.locked_until ?? 0) };
  }

  async clearFailures(id: string) {
    await this.run('UPDATE ss_profiles SET failed = 0, locked_until = 0 WHERE id = $1', [id]);
  }

  async deleteProfile(id: string) {
    await this.run('DELETE FROM ss_profiles WHERE id = $1', [id]);
  }

  async createSession(profileId: string, ttlMs: number) {
    const token = crypto.randomBytes(32).toString('base64url');
    await this.run('INSERT INTO ss_sessions (token_hash, profile_id, expires_at) VALUES ($1, $2, $3)', [hashToken(token), profileId, Date.now() + ttlMs]);
    await this.run('DELETE FROM ss_sessions WHERE expires_at < $1', [Date.now()]);
    return token;
  }

  async sessionProfile(token: string) {
    const [r] = await this.run('SELECT profile_id, expires_at FROM ss_sessions WHERE token_hash = $1', [hashToken(token)]);
    if (!r || Number(r.expires_at) < Date.now()) return undefined;
    return String(r.profile_id);
  }

  async deleteSession(token: string) {
    await this.run('DELETE FROM ss_sessions WHERE token_hash = $1', [hashToken(token)]);
  }

  async getProgress(profileId: string) {
    const [r] = await this.run('SELECT data, version, updated_at FROM ss_progress WHERE profile_id = $1', [profileId]);
    return r ? { data: String(r.data), version: Number(r.version), updatedAt: String(r.updated_at) } : undefined;
  }

  async putProgress(profileId: string, data: string, baseVersion: number) {
    const version = baseVersion + 1;
    const updatedAt = new Date().toISOString();
    // Each branch is a single conditional statement, so two devices racing cannot both win.
    const rows =
      baseVersion === 0
        ? await this.run('INSERT INTO ss_progress (profile_id, data, version, updated_at) VALUES ($1, $2, $3, $4) ON CONFLICT (profile_id) DO NOTHING RETURNING version', [profileId, data, version, updatedAt])
        : await this.run('UPDATE ss_progress SET data = $2, version = $3, updated_at = $4 WHERE profile_id = $1 AND version = $5 RETURNING version', [profileId, data, version, updatedAt, baseVersion]);
    return rows.length ? { ok: true as const, version, updatedAt } : { ok: false as const };
  }
}

/** Node's built-in SQLite. `:memory:` for tests; a file under dataDir otherwise. */
export function sqliteQuery(dataDir: string): Query {
  if (dataDir !== ':memory:') fs.mkdirSync(dataDir, { recursive: true });
  const db = new DatabaseSync(dataDir === ':memory:' ? ':memory:' : path.join(dataDir, 'sursadhana.db'));
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  // SQLite accepts $1-style placeholders as named parameters "$1", "$2", …
  return async (sql, params = []) => {
    const named = Object.fromEntries(params.map((v, i) => [`$${i + 1}`, v as never]));
    const stmt = db.prepare(sql);
    if (/^\s*SELECT|\bRETURNING\b/i.test(sql)) return stmt.all(named) as Row[];
    stmt.run(named);
    return [];
  };
}

export async function neonQuery(url: string): Promise<Query> {
  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(url);
  return (text, params = []) => sql.query(text, params) as Promise<Row[]>;
}

/** Postgres when a connection string is configured, otherwise SQLite on local disk. */
export function openStore(opts: { databaseUrl?: string | null; dataDir: string }): Store {
  if (opts.databaseUrl) {
    const q = neonQuery(opts.databaseUrl);
    return new SqlStore(async (s, p) => (await q)(s, p), true);
  }
  return new SqlStore(sqliteQuery(opts.dataDir), opts.dataDir !== ':memory:' && !opts.dataDir.startsWith('/tmp'));
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
