// Charlotte Voice Agent — Service Worker
// Caches the app shell for offline loading of the UI.

const CACHE_NAME = "charlotte-voice-v1";
const SHELL = [
    "/app/",
    "/app/index.html",
    "/app/style.css",
    "/app/app.js",
    "/app/manifest.json",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((k) => k !== CACHE_NAME)
                    .map((k) => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // Only cache GET requests for app shell
    if (event.request.method !== "GET") return;
    const url = new URL(event.request.url);
    if (!url.pathname.startsWith("/app/")) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
