// MockExams service worker.
//
// Scope is deliberately narrow: cache the app shell and static assets so the
// site opens on a poor connection, and serve a clear offline page otherwise.
//
// Deliberately NOT cached:
//   * anything under /api/ — exam sessions, grading and credits must be live,
//     and a stale answer or score is worse than an error
//   * exam pages themselves, so a timed attempt is never started offline with
//     a clock the server cannot see

const VERSION = "mockexams-v1";
const OFFLINE_URL = "/offline";

const PRECACHE = [OFFLINE_URL, "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function isCacheable(url) {
  if (url.pathname.startsWith("/api/")) return false;
  // A timed exam must never start from cache.
  if (url.pathname.includes("/take")) return false;
  return url.origin === self.location.origin;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (!isCacheable(url)) return;

  // Navigations: network first, falling back to cache, then the offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Static assets: cache first, since they are content-hashed by Next.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok && response.type === "basic") {
            const copy = response.clone();
            caches.open(VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});
