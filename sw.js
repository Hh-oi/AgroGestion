// Cambiamos el nombre del caché a v2 para forzar la actualización del logo nuevo
const CACHE_NAME = 'agrogestion-cache-v2';

// Archivos esenciales de la aplicación para guardar en caché
const ASSETS = [
    './',
    './index.html',
    './logo.png',
    './manifest.json',
    './sw.js'
];

// Evento de instalación: guarda los archivos en el nuevo caché
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Nuevo caché v2 creado con éxito');
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting()) // Fuerza al Service Worker a activarse ya
    );
});

// Evento de activación: borra de forma automática el caché viejo v1 para liberar espacio
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Borrando caché antiguo obsoleto:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Toma el control de la página inmediatamente
    );
});

// Evento fetch: sirve los archivos actualizados desde el caché nuevo
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
