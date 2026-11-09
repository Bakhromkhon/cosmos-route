const CACHE_VERSION = 'green-route-v61';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const MEDIA_CACHE = `${CACHE_VERSION}-media`;

// Минимум для мгновенного старта приложения.
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest.json',
  './css/app.css?v=7',
  './js/main.js?v=59',
  './data/route.js?v=1',
  './data/route.json',
  './icons/icon.svg',
  './icons/icon-maskable.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './assets/fonts/manrope-normal-cyrillic.woff2',
  './assets/fonts/manrope-normal-latin.woff2',
  './assets/fonts/inter-normal-cyrillic.woff2',
  './assets/brand/cosmos-color.svg',
  './assets/brand/cosmos-inverse.svg',
  './assets/brand/cosmos-white.svg',
  './assets/images/step-1-fasad-v2-1000.webp'
];

const IMAGE_SLUGS = [
  'step-1-fasad-v2', 'step-2-vhod-v2', 'step-3-ohrana-v2', 'step-4-shkafchik-v2',
  'step-5-6-razdevalki-v2', 'step-7-koridor-v2', 'step-8-prachechnaya-v2',
  'step-9-lift-v2', 'step-10-dver-v2', 'step-11-green-v2'
];

// Догружается в фоне после установки: не тормозит первый запуск,
// но офлайн-маршрут и аудио становятся доступны через несколько секунд.
const DEFERRED_ASSETS = [
  ...IMAGE_SLUGS.flatMap(slug => [
    `./assets/images/${slug}-1000.webp`,
    `./assets/images/${slug}-1400.webp`
  ]),
  ...Array.from({ length: 10 }, (_, i) => `./assets/audio/step-${String(i + 1).padStart(2, '0')}.mp3`)
];

async function addAllSafe(cacheName, assets) {
  const cache = await caches.open(cacheName);
  await Promise.all(assets.map(async asset => {
    try { await cache.add(asset); }
    catch (e) { console.warn('[SW] Failed to cache:', asset, e); }
  }));
}

// Последовательная фоновая догрузка: не конкурирует с первой загрузкой страницы.
async function warmUp(cacheName, assets) {
  const cache = await caches.open(cacheName);
  for (const asset of assets) {
    try {
      if (await cache.match(asset)) continue;
      const response = await fetch(asset, { cache: 'no-cache' });
      if (response && response.ok) await cache.put(asset, response.clone());
    } catch (e) {
      return; // офлайн: продолжим при следующем запуске
    }
    await new Promise(resolve => setTimeout(resolve, 90));
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(addAllSafe(SHELL_CACHE, SHELL_ASSETS));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => !key.startsWith(CACHE_VERSION))
      .map(key => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

let warmUpStarted = false;

// Догрузка медиа запускается со страницы, когда та простаивает,
// чтобы не конкурировать с первой загрузкой приложения.
async function startWarmUp() {
  if (warmUpStarted) return;
  warmUpStarted = true;
  await warmUp(SHELL_CACHE, DEFERRED_ASSETS);
}

self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data.type === 'WARM_UP') startWarmUp();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, './index.html', 1800));
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // MP3: поддерживаем Range requests (Safari / iOS, включая офлайн-режим).
  if (request.destination === 'audio' || url.pathname.includes('/assets/audio/')) {
    event.respondWith(serveAudio(request));
    return;
  }

  if (request.destination === 'font') {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
    return;
  }

  // JS, CSS и JSON: сначала сеть, иначе после обновления файлов
  // браузер продолжал бы отдавать старый код из кеша.
  event.respondWith(networkFirst(request));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const fallback = await caches.match(request);
    if (fallback) return fallback;
    throw error;
  }
}

function offlineResponse(fallbackUrl) {
  return caches.match(fallbackUrl).then(shell => shell || new Response(
    'Оффлайн. Откройте приложение после первого онлайн-запуска.',
    { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  ));
}

// Сеть с таймаутом: на медленном мобильном интернете приложение
// открывается из кеша, не дожидаясь ответа сервера.
async function networkFirst(request, fallbackUrl, timeoutMs) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then(response => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (!cached) {
    const response = await network;
    return response || offlineResponse(fallbackUrl || request.url);
  }

  if (!timeoutMs) {
    const response = await network;
    return response || cached;
  }

  const timeout = new Promise(resolve => setTimeout(() => resolve(null), timeoutMs));
  const winner = await Promise.race([network, timeout]);
  return winner || cached;
}


// Аудиоплееры посылают Range: bytes=0-.
// CacheStorage хранит полные 200-ответы, поэтому диапазон нарезаем сами.
async function serveAudio(request) {
  let full = await caches.match(request, { ignoreVary: true });
  if (!full) full = await caches.match(request.url, { ignoreVary: true });

  if (!full) {
    try {
      const result = await fetch(new Request(request.url));
      if (!result.ok || result.status !== 200) return result;
      const cache = await caches.open(MEDIA_CACHE);
      await cache.put(request.url, result.clone());
      full = result;
    } catch (error) {
      return new Response('Аудиофайл недоступен офлайн', { status: 503 });
    }
  }

  const range = request.headers.get('Range');
  if (!range) return full;

  const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!match) return full;

  const bytes = await full.arrayBuffer();
  const size = bytes.byteLength;
  const start = match[1] ? parseInt(match[1], 10) : 0;
  const end = match[2] ? Math.min(parseInt(match[2], 10), size - 1) : size - 1;

  if (Number.isNaN(start) || start >= size) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }

  return new Response(bytes.slice(start, end + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(end - start + 1),
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes'
    }
  });
}

