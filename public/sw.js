/* SurSadhana service worker — offline support.
 * - Built assets (hashed filenames) are cached on first use (cache-first).
 * - Page navigations are network-first with the cached app shell as offline fallback.
 * - /api/* requests are never cached (AI, YouTube, song search need the network).
 */
const VERSION = 'v1';
const SHELL = `sursadhana-shell-${VERSION}`;
const ASSETS = `sursadhana-assets-${VERSION}`;
const PRECACHE = ['/', '/manifest.webmanifest', '/favicon.svg', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('sursadhana-') && ![SHELL, ASSETS].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put('/', copy));
          return res;
        })
        .catch(() => caches.match('/').then((r) => r || new Response('Offline', { status: 503 }))),
    );
    return;
  }

  if (url.pathname.startsWith('/assets/') || /\.(png|svg|webmanifest|woff2?)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSETS).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});

// Clicking a reminder notification focuses/opens the app on Daily Riyaz.
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
      const c = cs.find((x) => 'focus' in x);
      if (c) return c.focus().then(() => c.navigate('/riyaz'));
      return self.clients.openWindow('/riyaz');
    }),
  );
});
