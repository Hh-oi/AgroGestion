const CACHE_NAME = 'agrogestion-v3';
self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(['./', './index.html', './manifest.json', './logo.png']);
        })
    );
});
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => 
            Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))
        ).then(() => self.clients.claim())
    );
});
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
                cache.put(e.request, networkResponse.clone());
                return networkResponse;
            });
        }).catch(() => {
            return caches.match(e.request);
        })
    );
});
