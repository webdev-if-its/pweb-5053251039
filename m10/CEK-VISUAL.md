# Cek Visual — Pertemuan 9

`npm run levels` menguji perilaku service worker lewat simulasi (event
install/activate/fetch dipanggil langsung, `self`/`caches`/`fetch`
dipalsukan). Itu cukup untuk Level 1-9. Level 10 butuh Chrome sungguhan dan
halaman yang benar-benar disajikan lewat server — di luar jangkauan test
otomatis di repo ini.

## Level 10 — Lolos audit Lighthouse PWA

- [ ] Jalankan halaman lewat server lokal (Live Server, atau `npx serve`)
      — service worker **tidak** bisa didaftarkan lewat `file://`
- [ ] Buka DevTools → Lighthouse → centang kategori "Progressive Web App" →
      Analyze page load
- [ ] Skor PWA harus lolos semua kriteria inti: manifest valid, service
      worker terdaftar, halaman merespons saat offline
- [ ] Coba juga: matikan koneksi di tab Network DevTools, refresh halaman —
      apakah halaman (atau `offline.html`) tetap muncul, bukan pesan error
      browser bawaan ("Tidak ada koneksi internet")?

**Lolos kalau:** audit Lighthouse PWA tidak menunjukkan kegagalan pada
kriteria inti, dan halaman tetap terbuka saat koneksi dimatikan.

---

Kalau ada mahasiswa yang lolos `npm run levels` sampai Level 9 tapi gagal di
sini, itu berarti ada detail yang lolos dari test simulasi (paling sering:
path aset yang salah, atau service worker yang gagal ter-scope dengan
benar). Catat di kolom "catatan" saat melapor ke dosen.
