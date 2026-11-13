const CACHE = "kunix-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./fonts/cairo-400-ar.woff2",
  "./fonts/cairo-400-lat.woff2",
  "./fonts/cairo-400-ext.woff2",
  "./fonts/cairo-600-ar.woff2",
  "./fonts/cairo-600-lat.woff2",
  "./fonts/cairo-600-ext.woff2",
  "./fonts/cairo-700-ar.woff2",
  "./fonts/cairo-700-lat.woff2",
  "./fonts/cairo-700-ext.woff2",
  "./fonts/cairo-800-ar.woff2",
  "./fonts/cairo-800-lat.woff2",
  "./fonts/cairo-800-ext.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
