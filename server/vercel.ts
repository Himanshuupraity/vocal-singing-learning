import { createApp } from './app';
import { loadConfig } from './config';

// Vercel function entry. Only /tmp is writable there, and it is wiped between
// cold starts: learner profiles need DATABASE_URL (Postgres) to persist here,
// and crash logs are not kept.
export default createApp(loadConfig(), {
  dataDir: process.env.DATA_DIR || '/tmp/sursadhana/data',
  logDir: process.env.LOG_DIR || '/tmp/sursadhana/logs',
});
