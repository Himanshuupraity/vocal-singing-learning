# SurSadhana

**Your Journey from First Sur to Confident Singing.**

SurSadhana is a singing-education web app for absolute beginners who want to sing Bollywood songs confidently and build Hindustani classical foundations. It includes a four-level curriculum (62 lessons), a daily riyaz planner, working audio tools (drone, sargam player, metronome/taal, keyboard), a real-time microphone pitch detector, an AI vocal tutor powered by Claude, a Bollywood song-learning workflow, a YouTube video library, and progress tracking.

---

## Quick start

Requirements: **Node.js 22.13+** (uses the built-in `node:sqlite`; tested on Node 26) and a recent Chrome, Edge, Firefox or Safari (iOS 16+).

```bash
npm install
cp .env.example .env        # optional — add API keys (see below)
npm run dev                 # web on http://localhost:5173, API on http://localhost:8787
```

Open http://localhost:5173. The first visit starts onboarding.

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server + Express API (with hot reload) |
| `npm test` | Unit, component and API tests (Vitest) |
| `npm run test:e2e` | Browser tests with Playwright: Chromium, desktop Safari (WebKit), iPhone (WebKit), plus axe accessibility audit |
| `npm run test:all` | Type-check + unit + end-to-end |
| `npm run typecheck` | TypeScript check for app + server |
| `npm run build` | Type-check and build the frontend into `dist/` |
| `npm start` | Production: Express serves the API **and** `dist/` on `PORT` |

---

## What works without any API keys

Everything except live AI answers and live YouTube results:

- Onboarding, optional baseline measurement
- Learning Path: 4 levels, 62 lessons with **Hinglish, English and Hindi (Devanagari)** explanations, audio demos, guided steps, quizzes, practicals, checkpoints and unlocking
- Comfortable **Range Finder**, **Sa Finder**, interval & sequence pitch matching (Pitch Game)
- Sing-in-rhythm test (mic onset detection) in addition to the tap-along test
- Recording Journal with **pitch analysis of saved recordings**
- Physically-modelled tanpura drone and optional voice-like “aa” demo sound
- Installable **PWA** with offline support, daily reminders (in-app/notifications) and a calendar (.ics) reminder
- Optional **accounts & cross-device sync** (self-hosted SQLite — no third-party service)
- Self-hosted crash reporting and a privacy policy page
- Daily Riyaz planner and session runner (timer, skip / repeat / stop, checklist, summary, reflection)
- Practice Studio: tanpura-style drone, pitch matcher, sargam player, metronome & taal (Teentaal, Keharwa, Dadra), tap-along rhythm test, pitch game, ear training, virtual keyboard, Recording Journal
- Bollywood song search (iTunes Search API needs no key), song pages, phrase tracker, My Songs
- Video Library with precise **“Search on YouTube”** links
- Dashboard, Progress & Reports, weekly self-assessment, export / import / reset

## Features that need API keys (server-side only)

| Feature | Env var | Without it |
|---|---|---|
| AI Vocal Tutor + AI song analysis | `ANTHROPIC_API_KEY` (optional `CLAUDE_MODEL`, default `claude-opus-5-5`) | Clearly labelled **demo mode** with built-in guidance — never fake AI answers. “My throat hurts” safety guidance always works offline. |
| Live YouTube results (titles, thumbnails, channels, durations, embeds) | `YOUTUBE_API_KEY` (YouTube Data API v3) | “Search on YouTube” links that open real YouTube search results |

Keys are read **only** by the Express server from `.env`. They are never sent to, or stored in, the browser. Check status any time on **Settings → Features & API status**.

### AI tutor setup
1. Create a key at https://console.anthropic.com.
2. Put it in `.env`: `ANTHROPIC_API_KEY=sk-ant-...`
3. Restart `npm run dev`. The server log shows `AI tutor: configured`.

The tutor uses `claude-opus-5-5` with streaming, prompt caching for the fixed system prompt, server-side refusal fallbacks, a 90-second timeout, input validation (zod) and a per-IP rate limit (`TUTOR_RATE_LIMIT` requests per 15 minutes, default 40).

### YouTube setup
1. In Google Cloud Console, enable **YouTube Data API v3** and create an API key (restrict it to that API).
2. Put it in `.env`: `YOUTUBE_API_KEY=...` and restart.

Each search costs about 101 quota units (search + video details), so the default 10,000/day quota allows ~95 searches. Results are cached for 6 hours. When the quota runs out, the app shows a notice and falls back to search links.

---

## Architecture

```
Browser (React + TypeScript + Vite + Tailwind)
 ├─ Web Audio API ── drone, synth, sequencer, metronome (look-ahead scheduling)
 ├─ getUserMedia ─── YIN pitch detection in the browser (audio never leaves the device)
 ├─ localStorage ─── versioned app data (StorageAdapter interface → cloud sync later)
 ├─ IndexedDB ────── Recording Journal (only with consent)
 └─ fetch /api/* ──► Express server (Node)
                      ├─ POST /api/tutor        → Claude (SSE streaming)
                      ├─ POST /api/songs/plan   → Claude (SSE streaming)
                      ├─ GET  /api/youtube/search → YouTube Data API v3 (cached, quota-aware)
                      ├─ GET  /api/songs/search → iTunes Search API (IN storefront)
                      ├─ /api/auth/*, /api/sync → optional accounts + sync (node:sqlite, scrypt, httpOnly cookie)
                      ├─ POST /api/client-errors → self-hosted crash log (logs/client-errors.log)
                      └─ GET  /api/status       → which features are configured
```

### Folder structure

```
server/
  app.ts               Express app: security headers, rate limits, routes, static hosting
  config.ts            env loading (placeholder values treated as missing)
  lib/tutorPrompt.ts   tutor + song-plan system prompts (pedagogy, honesty, vocal-safety rules)
  routes/              tutor.ts · youtube.ts · songs.ts
src/
  audio/               yin.ts (YIN), pitchAnalysis.ts (gating, scoring), mic.ts, drone.ts,
                       synth.ts, sequencer.ts, metronome.ts, context.ts
  music/               theory.ts (sargam ↔ Western ↔ Hz), taal.ts (taal structures)
  curriculum/          types.ts, levels/level1–4.ts (62 lessons), index.ts
  data/                exercises.ts (riyaz library), videoCategories.ts, safety.ts
  lib/                 progress.ts (unlocking, streaks, insights), riyaz.ts (planner),
                       tutorContext.ts, sse.ts, songs.ts, record.ts, dates.ts
  storage/             schema.ts, migrate.ts, adapter.ts (localStorage), recordings.ts (IndexedDB)
  state/AppData.tsx    React context over the storage adapter
  components/          ui/, studio/ (all practice tools), Layout, DemoPlayer, Quiz, SaFinder…
  pages/               Dashboard, LearningPath, LessonPage, CheckpointPage, Riyaz, Studio,
                       Tutor, Songs, SongPage, Videos, Progress, Settings, Onboarding, Baseline
tests/                 Vitest: pitch detection, scoring, storage/migration, curriculum validity,
                       unlocking, riyaz, streaks, markdown safety, server API, app smoke tests
```

### Data model (browser)

`AppData` (versioned, `SCHEMA_VERSION = 1`) contains `profile` (onboarding answers, language, daily minutes, tonic), `settings`, per-lesson progress (`quizBest`, `selfChecks`, `completedAt`), level `checkpoints`, `pitchAttempts`, `earTests`, `rhythm`, `sessions`, `selfAssessments`, `videos` (watched, favourites), `songs` (status, steps, phrases, notes, AI plan), `tutor` (messages, memory) and an optional `baseline`. `migrate()` repairs missing, corrupted or old data. Corrupted JSON is backed up under a `:corrupt:` key rather than deleted.

---

## How measurement works (and what it can’t do)

- **Pitch:** YIN fundamental-frequency estimation runs about 20×/second. A frame counts as “voiced” only if it is loud enough (RMS ≥ 0.01) **and** periodic (YIN confidence ≥ 0.85). Silence, breaths and noise are ignored, never scored as errors. Isolated octave jumps are smoothed.
- **Attempt score:** the first 0.3 s is skipped. An attempt is **matched** if the median deviation is within the tolerance (±50 cents for beginners, tighter later) **and** ≥ 60% of the held note stays within it. At least 0.6 s of clear voice is needed, or the attempt is “unreliable” and does not count. The same swara in another octave counts, and the octave is reported.
- **Rhythm:** the tap-along test reports the % of taps within ±80 ms of the click and any rushing/dragging tendency. Touchscreen and Bluetooth latency can skew it.
- **Not measured:** tone quality, pronunciation, expression and overall singing ability. Lessons say so, and the tutor is instructed never to claim it heard your voice.

## Progression rules

- Everyone starts at Level 1. A lesson unlocks when the previous one is complete, and a level unlocks when the previous level’s checkpoint is passed.
- **Mark as complete** stays disabled until the quiz is passed (≥70%) **and** the practical is met: measured pitch matching, a measured listening test, or an honest self-check for things a microphone can’t judge (posture, breath, comfort).
- Completed lessons stay open for revision. Time alone never unlocks anything.

---

## Accounts & sync (optional, no API key)

Learners can create an account in **Settings → Account & sync** to use the same progress on several devices.

- Stored on your server in `DATA_DIR/sursadhana.db` (Node's built-in SQLite): email, an **scrypt** password hash (never the password), and a copy of learning data. Recordings are never synced.
- Sessions use an **httpOnly, SameSite=Lax** cookie (Secure over HTTPS) plus a required custom header on state-changing requests (CSRF protection). Login/registration are rate-limited, and failed logins return the same message whether or not the email exists.
- Sync is whole-document with version numbers. It never silently overwrites: if two devices changed since the last sync, the learner chooses which copy to keep.
- Learners can log out or delete their account (password required). Back up `DATA_DIR` in production.

## Install, offline & reminders

SurSadhana is a Progressive Web App: “Install app” in Chrome/Edge, or Share → “Add to Home Screen” on iPhone. A service worker caches the app shell and assets, so lessons and practice tools work offline (the AI tutor, YouTube and song search still need a connection). Daily reminders appear in-app or as notifications while the app is open. For reminders when it's closed, **Settings → Add to my calendar** downloads a recurring `.ics` event. Web push would need a push service, so it's intentionally not used.

## Privacy

- Mic audio is analysed live in the browser and never uploaded.
- Recordings are saved only after explicit consent, only in this browser’s IndexedDB, and can be deleted individually or all at once (Settings).
- The AI tutor receives a compact summary (level, lesson titles, measured scores, practice stats, saved memory notes), never audio or the full database.
- Progress lives in localStorage on this device unless you create an account. Use **Export** for backups.
- The full policy is in the app at `/privacy`. If you publish the site, add the operator's contact details to it.

## Copyright safeguards

No lyrics, no audio extraction from YouTube, and no unlicensed material. Song pages link to official/karaoke **searches** and use phrase labels and timestamps instead of lyric text. The AI song plan is instructed never to quote lyrics and to mark unverified details (raga, key, range) as estimates.

---

## Deployment

The simplest option is one Node service that serves both the API and the built frontend:

```bash
npm ci
npm run build
PORT=8787 ANTHROPIC_API_KEY=... YOUTUBE_API_KEY=... npm start
```

This works on Render, Railway, Fly.io, a VPS, etc. Set the env vars in the host’s dashboard, never in the frontend. Serve over **HTTPS**, because browsers only allow microphone access on secure origins (or localhost). If you put the static `dist/` on a CDN instead, proxy `/api/*` to the Node service.

## Testing & CI

GitHub Actions (`.github/workflows/ci.yml`) runs type-check, unit tests and Playwright end-to-end tests on every push/PR.

**Playwright (`npm run test:e2e`)** runs in Chromium, desktop Safari (WebKit) and iPhone 13 (WebKit). It covers:
- onboarding, persistence, quiz gating and unlocking
- every page rendering without console errors, and the audio tools
- riyaz sessions, demo tutor mode, and saving videos without a key
- Hindi lessons, account creation and second-device sync
- no horizontal scroll at 375px, mic pitch matching with a synthetic voice (Chromium)
- an **axe WCAG 2.1 AA audit** of 14 pages in light and dark mode

`npm test` runs 165 Vitest tests:
- YIN accuracy on pure and harmonic tones, noise and 62 Hz bass
- silence/noise gating, octave handling and attempt scoring
- storage round-trip, corruption recovery, migration, export/import and IndexedDB recordings
- validation of all 62 lessons (sargam tokens, quiz answers, practical criteria)
- unlocking and anti-click-through rules, the riyaz planner (exact minutes for every length), streaks
- markdown XSS safety and tutor memory extraction
- server routes with mocked Claude/YouTube/iTunes: validation, SSE streaming, quota exhaustion, not-configured states
- app smoke tests: onboarding, persistence across reloads, locked lessons, learning path
- Karplus–Strong string tuning (±3 cents), offline recording analysis, onset detection, interval/sequence generators
- accounts (hashing, CSRF, sessions, conflicts, deletion), client sync logic, reminders/.ics, YouTube URL parsing

## Known limitations

- **Live AI tutor not exercised in development.** No Claude key was available, so `/api/tutor` was verified with a mocked Claude client and demo mode in the browser. Add a key and send one message to confirm.
- **Drone:** physically modelled (Karplus–Strong + jawari-style buzz) and clearly labelled, but still an approximation. A properly licensed tanpura recording would sound most authentic.
- **Demo voices are synthesized.** The optional voice-like “aa” uses formant synthesis. Recordings of a real singer for ornaments (meend, murki, gamak) would teach better.
- **Equal temperament:** notes use 12-TET; lessons explain where classical intonation (shruti) differs, e.g. Bhairav's komal Re/Dha.
- **Song analysis** (difficulty, raga influence, range) is AI-generated and labelled as an estimate. Phrase segmentation is manual.
- **Curriculum review:** all four levels were reviewed for accuracy (21 corrections) and translated to Hindi by AI. A review by a human Hindustani vocal teacher is still recommended before publishing widely.
- **Reminders** fire only while the app is open (or via the calendar file). True background push would need a push service.
- **Sync** keeps one whole copy per account and asks on conflict; it doesn't merge per item.
- **Real-voice testing:** pitch detection was verified with synthetic tones in Chromium and WebKit. Try it with your own voice, ideally with headphones. Very breathy singing, room echo or speakers playing music can reduce accuracy.
- **Rhythm timing** includes device audio latency. The sing-in-rhythm test reports a latency-independent steadiness score, and Bluetooth audio can add delay.
