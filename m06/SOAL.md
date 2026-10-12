# Pertemuan 6 — Event, State, dan Penyimpanan

**Yang kalian kerjakan:** satu berkas, `script.js`. Baca komentar
`// TODO` di tiap fungsi sebelum menulis kode.

**Cara kerja:**

```
npm install     # sekali di awal
npm run levels  # lihat level mana yang hijau
```

> Kalau `npm install` menampilkan peringatan "N vulnerabilities", abaikan
> saja — **jangan** jalankan `npm audit fix --force`. Itu bisa membuat
> `npm run levels` error total.

Semua merah di awal.

**Lihat hasilnya di browser** lewat Live Server (bukan klik dua kali
`index.html`) — sama seperti Pertemuan 5.

**Aturan bertanya:** sebelum memanggil dosen/asdos —
(1) baca pesan test sampai habis, (2) coba link dokumentasi di level itu,
(3) tanya partner, (4) tanya meja sebelah.

**File yang kalian sentuh:** hanya `script.js`. Jangan ubah `index.html` atau folder `test/`.

---

## Dasar — semua harus sampai sini

### Level 1 — target vs currentTarget

Tombol "Aksi cepat" punya ikon bintang di dalamnya. Coba klik TEPAT di
ikonnya (bukan area tombol di sekitarnya), lalu `console.log(event)` di
dalam listener-nya (boleh sementara, untuk eksperimen).

Ada dua properti event yang sering tertukar: satu menunjuk elemen yang
BENAR-BENAR diklik (bisa jadi ikon di dalam tombol), satu lagi menunjuk
elemen tempat listener-nya DIPASANG (selalu sama, tidak peduli bagian mana
yang diklik).

**Baca dulu:**
- MDN — `Event.target` vs `Event.currentTarget`:
  <https://developer.mozilla.org/en-US/docs/Web/API/Event/target> dan
  <https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget>

### Level 2 — Bubbling — buktikan lalu hentikan

Bayangkan dua kotak bersarang, dan ada listener klik di kotak LUAR. Kalau
kalian klik kotak DALAM, apakah listener di kotak luar juga ikut
terpanggil? Coba tebak dulu, baru buktikan dengan `console.log` di kedua
listener.

Ada satu method di objek event yang bisa menghentikan event "naik" ke
elemen induknya.

**Baca dulu:**
- MDN — event bubbling: <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling>
- MDN — `Event.stopPropagation()`: <https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation>

### Level 3 — Satu objek state untuk seluruh aplikasi

Coba panggil `render(sebuahObjekLain)` dengan objek yang isinya beda dari
`state` yang biasa. Kalau tampilannya tetap sama seperti sebelumnya
(tidak ikut berubah), berarti `render` diam-diam masih membaca dari
variabel lama, bukan dari argumen yang diterimanya.

**Baca dulu:**
- MDN — parameter fungsi di JavaScript:
  <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions>

---

## Inti — Level 7 = lulus pertemuan ini

### Level 4 — Delegasi event untuk elemen baru

Tiap kartu buku punya tombol "+ Tambah ke bacaan". Kartu-kartu itu dibuat
ULANG setiap kali `render()` dipanggil (misalnya karena pencarian). Kalau
listener klik dipasang satu-satu ke tiap tombol saat kartu dibuat, tombol
yang baru muncul belakangan tidak akan punya listener sama sekali.

Ada teknik untuk memasang SATU listener di elemen induk yang tidak pernah
diganti, lalu memeriksa dari `event.target` apakah yang diklik adalah
tombol yang dimaksud.

**Baca dulu:**
- MDN — delegasi event: <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling#event_delegation>
- MDN — `Element.closest()`: <https://developer.mozilla.org/en-US/docs/Web/API/Element/closest>

### Level 5 — Setiap perubahan state memanggil render

Coba panggil `tambahKeBacaan(...)` dari Console setelah halaman dimuat.
Data di `state.daftarBacaan` bertambah (cek lewat `console.log`), tapi
apakah tampilannya ikut berubah tanpa kalian reload manual?

**Baca dulu:**
- (tidak ada link khusus — ini soal disiplin memanggil fungsi yang sudah
  kalian buat di Pertemuan 5, di titik yang tepat)

### Level 6 — localStorage bertahan setelah ditutup

`state` yang cuma disimpan di variabel JavaScript akan HILANG setiap kali
halaman di-refresh — coba buktikan sendiri (tambah item, lalu refresh
manual, lihat hilang). Browser punya penyimpanan sederhana yang bertahan
walau halaman ditutup.

**Baca dulu:**
- MDN — Web Storage API (localStorage):
  <https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API>

### Level 7 — JSON rusak tidak boleh crash

Buka DevTools → Application → Local Storage → ubah manual isi datanya
jadi teks yang bukan JSON valid (misalnya hapus tanda kurung kurawal
penutup). Reload halaman. Apa yang terjadi?

Kalau seluruh halaman jadi putih kosong / error di Console, itu tandanya
kode kalian tidak siap menghadapi data yang rusak — padahal ini bisa
terjadi kapan saja di dunia nyata (versi lama aplikasi, orang iseng lewat
DevTools, dst).

**Baca dulu:**
- MDN — `try...catch`: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch>
- MDN — `JSON.parse()`: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse>

---

## Lanjut — tidak wajib

### Level 8 — Validasi sebelum masuk state

Coba `tambahKeBacaan({ judul: '' })` dari Console — buku tanpa judul itu
seharusnya DITOLAK, bukan malah masuk ke daftar. Coba juga tambahkan buku
yang SAMA dua kali berturut-turut — apakah dia dobel di daftar?

**Baca dulu:**
- MDN — `Array.prototype.some()`: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some>

### Level 9 — Keadaan kosong di setiap daftar

Hapus semua item di daftar bacaan (lewat Console: `state.daftarBacaan = []`
lalu panggil `render(state)`). Area daftar bacaan jadi kosong melompong —
pengguna tidak tahu apakah ini normal atau ada yang error.

**Baca dulu:**
- (tidak ada link khusus — pola yang sama seperti Level 10 di Pertemuan 5)

### Level 10 ⭐ — Daftar bacaan yang bertahan

Ini bukan fungsi baru — ini bukti bahwa Level 6 dan 7 benar-benar
tersambung dengan benar. Coba alur ini manual: tambah buku ke daftar
bacaan, tutup tab, buka lagi `index.html` dari awal. Apakah daftarnya
masih ada?

Supaya itu terjadi, saat halaman pertama kali dimuat, kode kalian harus
membaca dulu data yang tersimpan SEBELUM menampilkan apa pun ke layar.

**Baca dulu:**
- (gabungan Level 6 dan 7 — tidak ada link baru)

---

## Kalau macet

Baca pesan test sampai habis. Vitest menunjukkan nilai yang **diharapkan**
dan yang **diterima**.

Contoh:

```
× Level 5  Setiap perubahan state memanggil render
  → expected +0 to be 1
```

Artinya: setelah memanggil `tambahKeBacaan`, jumlah item di
`#daftar-bacaan` tidak bertambah — kemungkinan besar `render(state)`
belum dipanggil di akhir fungsi itu.
