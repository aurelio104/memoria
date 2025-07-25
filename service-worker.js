const CACHE_NAME = 'bam-memoria-cache-v1';

const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './game.js',
  './manifest.json',
  './assets/icon180.png',
  './assets/icon192.png',
  './assets/icon512.png',
  './assets/apple-touch-icon.png',
  './assets/start.mp3',
  './assets/move.mp3',
  './assets/win.mp3',
  './assets/fondo.mp4',
  './assets/pagina_1.mp4',
  './assets/Cuadro.mp4',
  './assets/star.png',
  './assets/logo-BAM.png',
  './assets/again.png',
  './assets/back.jpg',
  './assets/imagen.1.1.jpg',
  './assets/imagen.2.1.jpg',
  './assets/imagen.3.1.jpg',
  './assets/imagen.4.1.jpg',
  './assets/imagen.5.1.jpg',
  './assets/imagen.6.1.jpg',
  './assets/imagen.7.1.jpg',
  './assets/imagen.8.1.jpg'
];

// 📦 Instala el cache inicial
self.addEventListener('install', event => {
  self.skipWaiting(); // ⚡️ Forzar activación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 🚀 Intercepta las peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// 🧼 Limpieza de versiones anteriores
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});