import { describe, it, expect, beforeAll, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

const path = (relatif) => fileURLToPath(new URL(relatif, import.meta.url));

// ---------------------------------------------------- caches palsu (mock)

function buatCachesPalsu() {
  const toko = new Map(); // nama cache -> Map(url -> respons)

  function bukaCache(nama) {
    if (!toko.has(nama)) toko.set(nama, new Map());
    const simpanan = toko.get(nama);
    return {
      addAll: async (urls) => {
        for (const u of urls) simpanan.set(u, { dari: 'cache', url: u });
      },
      put: async (req, res) => {
        simpanan.set(typeof req === 'string' ? req : req.url, res);
      },
      match: async (req) => {
        const url = typeof req === 'string' ? req : req.url;
        return simpanan.get(url);
      },
    };
  }

  return {
    open: async (nama) => bukaCache(nama),
    match: async (req) => {
      const url = typeof req === 'string' ? req : req.url;
      for (const simpanan of toko.values()) {
        if (simpanan.has(url)) return simpanan.get(url);
      }
      return undefined;
    },
    keys: async () => [...toko.keys()],
    delete: async (nama) => toko.delete(nama),
  };
}

let pendengar;
let cachesPalsu;

beforeAll(async () => {
  pendengar = {};
  cachesPalsu = buatCachesPalsu();

  global.self = { addEventListener: (jenis, fn) => { pendengar[jenis] = fn; } };
  global.caches = cachesPalsu;
  global.fetch = vi.fn();

  await import('../sw.js');
});

function eventWaitUntil() {
  const event = {};
  event.waitUntil = (p) => { event._p = p; };
  return event;
}

function eventFetch(request) {
  const event = { request };
  event.respondWith = (p) => { event._respons = p; };
  return event;
}

describe('Taman Baca — Pertemuan 9', () => {
  // --------------------------------------------------------------- DASAR
  it('Level 1  Manifest: nama, ikon, standalone', () => {
    const isi = JSON.parse(readFileSync(path('../manifest.json'), 'utf8'));

    expect(isi.name?.length).toBeGreaterThan(3);
    expect(['App', 'Untitled', 'Nama Aplikasi']).not.toContain(isi.name);
    expect(isi.display).toBe('standalone');

    expect(Array.isArray(isi.icons)).toBe(true);
    expect(isi.icons.length).toBeGreaterThanOrEqual(1);
    for (const ikon of isi.icons) {
      expect(ikon.src).toBeTruthy();
      expect(ikon.sizes).toBeTruthy();
      expect(ikon.type).toBeTruthy();
    }
  });

  it('Level 2  Daftarkan service worker', async () => {
    // `navigator` sudah ada sebagai properti bawaan Node (getter-only),
    // jadi harus ditimpa lewat vi.stubGlobal, bukan assignment biasa.
    const daftarkan = vi.fn().mockResolvedValue({});
    vi.stubGlobal('navigator', { serviceWorker: { register: daftarkan } });

    await import('../app.js');

    expect(daftarkan).toHaveBeenCalled();
    expect(daftarkan.mock.calls[0][0]).toContain('sw.js');

    vi.unstubAllGlobals();
  });

  it('Level 3  Siklus install, activate, fetch', () => {
    expect(typeof pendengar.install).toBe('function');
    expect(typeof pendengar.activate).toBe('function');
    expect(typeof pendengar.fetch).toBe('function');
  });

  // ---------------------------------------------------------------- INTI
  it('Level 4  Cache aset saat install', async () => {
    const event = eventWaitUntil();
    pendengar.install(event);
    await event._p;

    expect(await cachesPalsu.match('/index.html')).toBeTruthy();
    expect(await cachesPalsu.match('/style.css')).toBeTruthy();
    expect(await cachesPalsu.match('/offline.html')).toBeTruthy();
  });

  it('Level 5  Strategi cache-first', async () => {
    global.fetch.mockClear();

    const event = eventFetch({ url: '/style.css', mode: 'no-cors' });
    pendengar.fetch(event);
    const hasil = await event._respons;

    expect(hasil).toEqual({ dari: 'cache', url: '/style.css' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('Level 6  Strategi network-first', async () => {
    const responsJaringan = { dari: 'jaringan', url: '/api/data' };
    global.fetch = vi.fn().mockResolvedValue(responsJaringan);

    const event = eventFetch({ url: '/api/data', mode: 'no-cors' });
    pendengar.fetch(event);
    const hasil = await event._respons;

    expect(hasil).toBe(responsJaringan);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // kalau jaringan gagal, jatuh ke cache
    const cache = await cachesPalsu.open('cache-tambahan');
    await cache.put('/api/lama', { dari: 'cache', url: '/api/lama' });
    global.fetch = vi.fn().mockRejectedValue(new Error('offline'));

    const eventGagal = eventFetch({ url: '/api/lama', mode: 'no-cors' });
    pendengar.fetch(eventGagal);
    const hasilGagal = await eventGagal._respons;

    expect(hasilGagal).toEqual({ dari: 'cache', url: '/api/lama' });
  });

  it('Level 7  Pilih strategi yang tepat — dan alasannya', async () => {
    global.fetch = vi.fn().mockResolvedValue({ dari: 'jaringan', url: '/api/lain' });

    // aset statis (sudah di-cache Level 4) -> cache-first, TIDAK memanggil jaringan
    const eventAset = eventFetch({ url: '/index.html', mode: 'no-cors' });
    pendengar.fetch(eventAset);
    await eventAset._respons;
    expect(global.fetch).not.toHaveBeenCalled();

    // permintaan lain -> network-first, HARUS memanggil jaringan
    const eventLain = eventFetch({ url: '/api/lain', mode: 'no-cors' });
    pendengar.fetch(eventLain);
    await eventLain._respons;
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  // -------------------------------------------------------------- LANJUT
  it('Level 8  Halaman offline sebagai cadangan', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('offline'));

    const event = eventFetch({ url: '/artikel-baru', mode: 'navigate' });
    pendengar.fetch(event);
    const hasil = await event._respons;

    expect(hasil).toEqual({ dari: 'cache', url: '/offline.html' });
  });

  it('Level 9  Perbarui cache, bersihkan yang usang', async () => {
    await cachesPalsu.open('taman-baca-v0'); // cache usang peninggalan versi lama
    expect(await cachesPalsu.keys()).toContain('taman-baca-v0');

    const namaSebelum = await cachesPalsu.keys();

    const event = eventWaitUntil();
    pendengar.activate(event);
    await event._p;

    const namaSesudah = await cachesPalsu.keys();
    expect(namaSesudah).not.toContain('taman-baca-v0');
    expect(namaSesudah.length).toBeGreaterThanOrEqual(1);
    expect(namaSesudah.length).toBeLessThan(namaSebelum.length);
  });

  it.skip('Level 10 ⭐ Lolos audit Lighthouse PWA', () => {
    // Lighthouse butuh Chrome headless sungguhan menyajikan halaman lewat
    // HTTP — di luar jangkauan vitest/jsdom di CI ringan ini. Level
    // TERAKHIR, jadi tidak memotong angka "tertinggi" level lain di
    // ringkas-level.js. Dicek manual oleh asdos lewat CEK-VISUAL.md.
  });
});
