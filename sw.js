// serviceWorkers are what handles PWA-specific functions like caching offline files, sending push notifications etc.

// cache name for Firefox/chrome debug tools
var cacheName = 'PWA_test';
// files to cache when offline
/*var filesToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js'
];*/
var filesToCache = [];
/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
