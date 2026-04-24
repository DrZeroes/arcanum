const CACHE_NAME = 'arcanum-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './css/mobile.css',
  './js/combat.js',
  './js/monde.js',
  './js/codex.js',
  './js/fiche.js',
  './js/multiplayer.js',
  './js/main.js',
  './js/magie.js',
  './js/items.js',
  './js/compagnons.js',
  './js/inventaire.js',
  './js/audio.js',
  './js/carte.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Ne pas intercepter Firebase, Google APIs, ou requêtes POST
  const url = e.request.url;
  if (e.request.method !== 'GET') return;
  if (url.includes('firebase') || url.includes('googleapis') || url.includes('gstatic')) return;

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
