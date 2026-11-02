// PERTEMUAN 9 — Service Worker dan PWA

const NAMA_CACHE = 'taman-baca-v1';
const ASET_UTAMA = ['/', '/index.html', '/style.css', '/offline.html'];

// Menyesuaikan jalur aset dengan lokasi aplikasi.
function urlAset(aset) {
  if (self.registration && self.registration.scope) {
    return new URL(aset.replace(/^\//, ''), self.registration.scope).href;
  }

  return aset;
}

function adalahAsetStatis(request) {
  return ASET_UTAMA.some(
    (aset) => request.url === aset || request.url.endsWith(aset)
  );
}

// Level 5 — cache-first
async function cacheFirst(request) {
  const response = await caches.match(request);

  if (response) {
    return response;
  }

  return fetch(request);
}

// Level 6 — network-first
async function networkFirst(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const response = await caches.match(request);

    if (response) {
      return response;
    }

    throw error;
  }
}

// Level 3 dan 4 — install dan simpan aset utama
self.addEventListener('install', (event) => {
  console.log('Service Worker: install');

  event.waitUntil(
    caches.open(NAMA_CACHE).then((cache) => {
      return cache.addAll(ASET_UTAMA.map(urlAset));
    })
  );
});

// Level 3 dan 9 — hapus cache lama
self.addEventListener('activate', (event) => {
  console.log('Service Worker: activate');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== NAMA_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Level 3, 7, dan 8 — fetch, pemilihan strategi, dan halaman offline
self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (adalahAsetStatis(request)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(
      networkFirst(request).catch(async (error) => {
        if (request.mode === 'navigate') {
          const offlinePage = await caches.match(urlAset('/offline.html'));

          if (offlinePage) {
            return offlinePage;
          }
        }

        throw error;
      })
    );
  }
});