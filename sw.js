const CACHE_VERSION = 'green-route-v53';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest.json',
  './css/app.css?v=2',
  './icons/icon.svg',
  './icons/icon-maskable.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './data/route.js?v=1',
  './js/main.js?v=51',
  './data/route.json',
  './assets/images/step-1-fasad-v2.jpg',
  './assets/images/step-2-vhod-v2.jpg',
  './assets/images/step-3-ohrana-v2.jpg',
  './assets/images/step-4-shkafchik-v2.jpg',
  './assets/images/step-5-6-razdevalki-v2.jpg',
  './assets/images/step-7-koridor-v2.jpg',
  './assets/images/step-8-prachechnaya-v2.jpg',
  './assets/images/step-9-lift-v2.jpg',
  './assets/images/step-10-dver-v2.jpg',
  './assets/images/step-11-green-v2.jpg'
];

async function addAllSafe(cacheName, assets) {
  const cache = await caches.open(cacheName);
  await Promise.all(assets.map(async asset => {
    try { await cache.add(asset); }
    catch (e) { console.warn('[SW] Failed to cache:', asset, e); }
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil(addAllSafe(SHELL_CACHE, SHELL_ASSETS));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => !k.startsWith(CACHE_VERSION))
      .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, './index.html'));
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // JS, CSS и JSON: сначала сеть, иначе после обновления файлов
  // браузер продолжал бы отдавать старый код из кеша.
  event.respondWith(networkFirst(request));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response?.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
      return response;
    }
  } catch (e) {
    // офлайн — отдаём копию из кеша
  }
  const cached = await cache.match(request);
  if (cached) return cached;
  if (fallbackUrl) {
    const shell = await cache.match(fallbackUrl);
    if (shell) return shell;
  }
  return new Response('Оффлайн. Откройте приложение после первого онлайн-запуска.', {
    status: 503,
    statusText: 'Offline',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
