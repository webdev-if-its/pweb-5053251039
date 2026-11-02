# Pertemuan 9 — Service Worker dan PWA

**Yang kalian kerjakan:** tiga berkas — `manifest.json`, `app.js`, dan
`sw.js`. Baca komentar `// TODO` di tiap fungsi sebelum menulis kode.

**Cara kerja:**

```
npm install     # sekali di awal
npm run levels  # lihat level mana yang hijau
```

> Kalau `npm install` menampilkan peringatan "N vulnerabilities", abaikan
> saja — **jangan** jalankan `npm audit fix --force`. Itu bisa membuat
> `npm run levels` error total.

Semua merah di awal. **Test tidak menjalankan browser sungguhan** — event
`install`/`activate`/`fetch` dipanggil langsung oleh test, dan `caches`
serta `fetch` "dipalsukan" (mock) supaya hasilnya konsisten dan cepat.

**Untuk mencoba di browser sungguhan:** service worker **tidak bisa**
didaftarkan lewat `file://` (klik dua kali). Pakai Live Server atau
`npx serve`, sama seperti Pertemuan 5-7.

**Aturan bertanya:** sebelum memanggil dosen/asdos —
(1) baca pesan test sampai habis, (2) coba link dokumentasi di level itu,
(3) tanya partner, (4) tanya meja sebelah.

**File yang kalian sentuh:** `manifest.json`, `app.js`, `sw.js`. Jangan ubah folder `test/`.

---

## Dasar — semua harus sampai sini

### Level 1 — Manifest: nama, ikon, standalone

Buka lewat Live Server, DevTools → tab **Application** → panel
**Manifest**. Chrome akan menunjukkan apa saja yang kurang dari
`manifest.json` kalian — nama yang terlalu umum, ikon yang belum ada,
atau mode tampilan yang belum diatur.

**Baca dulu:**
- MDN — Web App Manifest: <https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest>

### Level 2 — Daftarkan service worker

DevTools → Application → panel **Service Workers**. Sekarang kosong,
tidak ada apa-apa terdaftar di situ. Ada satu method di objek `navigator`
yang mendaftarkan sebuah file JavaScript sebagai service worker.

**Baca dulu:**
- MDN — `ServiceWorkerContainer.register()`:
  <https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register>

### Level 3 — Siklus install, activate, fetch

Service worker punya tiga momen penting dalam hidupnya: saat pertama
dipasang, saat mengambil alih halaman, dan setiap kali halaman meminta
sesuatu (gambar, CSS, data). Masing-masing momen itu bisa "didengarkan"
lewat event terpisah.

**Baca dulu:**
- MDN — siklus hidup service worker:
  <https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Service_workers/Service_worker_lifecycle>

---

## Inti — Level 7 = lulus pertemuan ini

### Level 4 — Cache aset saat install

DevTools → Application → panel **Cache Storage**. Setelah Level 2-3
selesai dan halaman di-reload, cache-nya masih kosong. Saat service
worker pertama kali dipasang, ini momen yang tepat untuk menyimpan
aset-aset penting supaya bisa dipakai lagi nanti tanpa jaringan.

**Baca dulu:**
- MDN — Cache API: <https://developer.mozilla.org/en-US/docs/Web/API/Cache>

### Level 5 — Strategi cache-first

Bayangkan: setelah aset di-cache (Level 4), kalian matikan internet
(DevTools → Network → Offline) dan reload. Untuk file yang jarang
berubah (CSS, ikon), lebih cepat dan lebih tahan-offline kalau diambil
dari cache DULU — baru kalau tidak ada, coba jaringan.

**Baca dulu:**
- MDN — strategi caching service worker (baca bagian Cache-first):
  <https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Serving>

### Level 6 — Strategi network-first

Untuk data yang sering berubah, urutannya dibalik: coba jaringan DULU
(supaya dapat versi terbaru), dan kalau gagal (offline), baru jatuh ke
versi lama yang tersimpan di cache.

**Baca dulu:**
- MDN — strategi caching service worker (baca bagian Network-first):
  <https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Serving>

### Level 7 — Pilih strategi yang tepat — dan alasannya

Tidak semua permintaan cocok pakai strategi yang sama. Pikirkan: dari
Level 5 dan 6, permintaan seperti apa yang cocok pakai cache-first, dan
yang mana yang cocok network-first? Siap-siap ditanya asdos alasannya —
ini bagian yang tidak dinilai otomatis oleh `npm run levels`.

**Baca dulu:**
- (gabungan Level 5 dan 6 — tidak ada link baru)

---

## Lanjut — tidak wajib

### Level 8 — Halaman offline sebagai cadangan

Matikan internet (DevTools → Network → Offline), lalu coba buka halaman
yang belum pernah kalian kunjungi sebelumnya (yang belum ke-cache).
Browser biasanya menampilkan halaman error bawaan yang tidak ramah.

Kalau ada halaman "maaf, sedang offline" yang sudah disiapkan (lihat
`offline.html`), service worker bisa menampilkan itu sebagai cadangan.

**Baca dulu:**
- (gabungan konsep cache-first dan network-first — tidak ada link baru)

### Level 9 — Perbarui cache, bersihkan yang usang

DevTools → Application → Cache Storage. Bayangkan kalian naikkan versi
aplikasi berkali-kali — kalau cache versi lama tidak pernah dihapus, daftar
di panel itu akan menumpuk selamanya, memenuhi penyimpanan pengguna.

Ada momen di siklus hidup service worker (lihat Level 3) yang tepat untuk
membersihkan cache yang sudah tidak dipakai.

**Baca dulu:**
- MDN — `CacheStorage.keys()` dan `CacheStorage.delete()`:
  <https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage>

### Level 10 ⭐ — Lolos audit Lighthouse PWA

Ini **tidak dites otomatis** di `npm run levels` (butuh Chrome sungguhan
menyajikan halaman lewat server). Lihat `CEK-VISUAL.md` untuk langkah
pengecekannya bersama asdos.

**Baca dulu:**
- web.dev — checklist PWA: <https://web.dev/articles/pwa-checklist>

---

## Kalau macet

Baca pesan test sampai habis. Vitest menunjukkan nilai yang **diharapkan**
dan yang **diterima**.

Contoh:

```
× Level 5  Strategi cache-first
  → pendengar.fetch is not a function
```

Artinya: listener `'fetch'` belum didaftarkan sama sekali di `sw.js`
(Level 3 belum selesai) — Level 5 tidak bisa diuji tanpa itu.
