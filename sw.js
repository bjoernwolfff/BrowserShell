const CACHE_NAME = 'duckmini-v1';
const FILES = ['/', '/index.html', '/manifest.json', '/icons/icon-192.png', '/icons/apple-touch-icon.png'];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  if (evt.request.method !== 'GET') return;
  evt.respondWith(
    caches.match(evt.request).then(cached => cached || fetch(evt.request).catch(()=> caches.match('/')))
  );
});
