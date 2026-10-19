import { createApp } from './app';
import { loadConfig } from './config';

// Vercel function entry. Only /tmp is writable there, and it is wiped between
// cold starts, so account sync and crash logs do not persist on this host.
export default createApp(loadConfig(), {
  dataDir: process.env.DATA_DIR || '/tmp/sursadhana/data',
  logDir: process.env.LOG_DIR || '/tmp/sursadhana/logs',
});
