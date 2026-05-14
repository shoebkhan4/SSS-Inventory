/* =============================================
   SSC Industrial Inventory — Service Worker
   Phase 4: Offline PWA support
   Caches the app shell so it loads instantly
   and works offline (Firestore handles its own
   offline persistence independently).
   ============================================= */

var CACHE_NAME = "ssc-inventory-v1";

/* Resources to precache on install */
var PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event) {
  var url = new URL(event.request.url);

  /* Only intercept same-origin GET requests for the app shell.
     Firebase/Firestore requests use their own transport and must
     NOT be intercepted by the service worker. */
  if (event.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  /* Network-first strategy: try the network, fall back to cache */
  event.respondWith(
    fetch(event.request).then(function(response) {
      /* Cache a fresh copy of the response */
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
