# Pertemuan 5 — JavaScript Dasar dan DOM

**Yang kalian kerjakan:** satu berkas, `script.js`. Sebagian fungsi di
dalamnya punya bug kecil, sebagian lagi baru separuh jadi (tandanya
komentar `// TODO` di dalam kode). Baca dulu komentar di tiap fungsi
sebelum menulis apa pun.

**Cara kerja:**

```
npm install     # sekali di awal
npm run levels  # lihat level mana yang hijau
```

> Kalau `npm install` menampilkan peringatan "N vulnerabilities", abaikan
> saja — **jangan** jalankan `npm audit fix --force`. Itu bisa membuat
> `npm run levels` error total.

Semua merah di awal. Itu memang seharusnya.

**Lihat hasilnya di browser:** `index.html` memuat `script.js` sebagai
*module*. Modul ES tidak jalan kalau file dibuka langsung lewat `file://`
(klik dua kali) — pakai ekstensi **Live Server** di VS Code, atau jalankan
`npx serve` di folder ini.

**Aturan bertanya:** sebelum memanggil dosen/asdos —
(1) baca pesan test sampai habis, (2) coba link dokumentasi di level itu,
(3) tanya partner, (4) tanya meja sebelah.

**File yang kalian sentuh:** hanya `script.js`. Jangan ubah `index.html` atau folder `test/`.

---

## Dasar — semua harus sampai sini

### Level 1 — formatRupiah — nol tetap "Rp 0"

Buka Console di DevTools, ketik `formatRupiah(0)` (kalau belum bisa,
coba dulu lewat `npm run levels` untuk lihat pesan errornya). Hasilnya
salah — bukan `"Rp 0"`.

Coba tebak dulu: kondisi `if` di fungsi itu mengecek apa? Lalu coba nilai
lain: `formatRupiah(undefined)`. Apa bedanya dengan `formatRupiah(0)`?
Kenapa keduanya masuk ke cabang `if` yang sama, padahal maksudnya beda?

**Baca dulu:**
- MDN — nilai "falsy" di JavaScript: <https://developer.mozilla.org/en-US/docs/Glossary/Falsy>

### Level 2 — Saring array tanpa mengubah aslinya

Ada beberapa method array yang mengembalikan array BARU (aslinya tidak
berubah), dan ada yang mengubah array itu sendiri secara langsung
(disebut "mutating"). Coba jalankan `katalog.length` sebelum dan sesudah
memanggil fungsi saring — kalau angkanya berubah, berarti kalian pakai
method yang salah jenis.

**Baca dulu:**
- MDN — `Array.prototype.filter()`: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter>

### Level 3 — querySelector mengubah satu elemen

`document.querySelector(...)` mengambil SATU elemen dari halaman —
persis seperti yang biasa kalian pakai di DevTools Console untuk
mengecek elemen. Cari elemen judul pengumuman, lalu ubah teksnya.

**Baca dulu:**
- MDN — `document.querySelector()`: <https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector>

---

## Inti — Level 7 = lulus pertemuan ini

### Level 4 — querySelectorAll untuk banyak elemen

`querySelector` cuma mengembalikan satu elemen (yang pertama ketemu).
Untuk mengecek/mengubah BANYAK elemen sekaligus (semua `<li>` di daftar
pengumuman, misalnya), ada method lain yang mengembalikan daftar semua
elemen yang cocok.

Perhatikan juga: fungsi ini bisa dipanggil berkali-kali. Cari cara supaya
tanda yang ditambahkan tidak menumpuk kalau dipanggil dua kali.

**Baca dulu:**
- MDN — `document.querySelectorAll()`: <https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll>

### Level 5 — Buat elemen — textContent, bukan innerHTML

Ada dua cara memasukkan teks ke sebuah elemen: `innerHTML` (yang
mem-parsing string sebagai HTML) dan `textContent` (yang selalu
memperlakukan string sebagai teks polos). Kalau string itu berasal dari
input pengguna, `innerHTML` bisa jadi celah keamanan (XSS) — orang bisa
menyisipkan `<script>` lewat situ.

Buat kartu buku dengan `document.createElement` dan `textContent` untuk
tiap bagiannya.

**Baca dulu:**
- MDN — `Document.createElement()`: <https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement>
- MDN — kenapa `textContent` lebih aman dari `innerHTML`:
  <https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#security_considerations>

### Level 6 — Render seluruh katalog dari array

Gabungkan yang sudah kalian pelajari: `document.createElement` (Level 5)
dipanggil berulang lewat sebuah loop, satu kali untuk tiap buku di array
`katalog`. Kosongkan dulu wadahnya sebelum mengisi ulang — supaya
tidak dobel kalau fungsi ini dipanggil lagi nanti.

**Baca dulu:**
- MDN — `for...of`: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of>

### Level 7 — Klik kartu ke-2 menampilkan kartu ke-2

Tiap kartu yang dibuat perlu tahu "aku mewakili buku yang mana", supaya
saat diklik, ia tahu detail buku siapa yang harus ditampilkan. Ada satu
konsep JavaScript yang membuat sebuah fungsi "mengingat" nilai dari luar
dirinya, walau dipanggil belakangan (saat diklik, bukan saat dibuat).

**Baca dulu:**
- MDN — `EventTarget.addEventListener()`: <https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener>
- MDN — closure: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures>

---

## Lanjut — tidak wajib

### Level 8 — Form tanpa memuat ulang halaman

Coba isi form pencarian dan tekan Enter atau tombol submit sekarang —
halaman langsung memuat ulang (kalian bisa lihat dari address bar
berkedip atau state hilang). Perilaku bawaan `<form>` memang begitu:
kirim data lalu reload.

Ada satu method di objek event yang bisa membatalkan perilaku bawaan itu.

**Baca dulu:**
- MDN — `Event.preventDefault()`: <https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault>

### Level 9 — Pencarian menyaring katalog

Setelah Level 8, form-nya sudah tidak reload — tapi juga belum melakukan
apa-apa. Ambil nilai yang diketik di kolom pencarian, saring `katalog`
yang judulnya cocok, lalu tampilkan pakai fungsi `render` yang sudah
kalian buat di Level 6 — jangan menulis kode tampilan baru di sini.

**Baca dulu:**
- MDN — `HTMLInputElement.value`: <https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement>

### Level 10 ⭐ — Satu fungsi render(data) untuk semuanya

Coba panggil `render([])` (array kosong) langsung dari Console. Apa yang
terjadi ke halaman? Kalau area katalog jadi kosong melompong tanpa
pesan apa pun, itu pengalaman yang membingungkan buat pengguna — mereka
tidak tahu apakah ini bug atau memang tidak ada hasil.

`render` yang sama (dipakai di Level 6 dan Level 9) harus bisa menangani
kondisi ini dengan baik, tanpa kalian membuat fungsi tampilan terpisah
khusus untuk kasus kosong.

**Baca dulu:**
- MDN — kondisi (`if`/`else`) di JavaScript:
  <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else>

---

## Kalau macet

Baca pesan test sampai habis. Vitest menunjukkan nilai yang **diharapkan**
dan yang **diterima**.

Contoh:

```
× Level 6  Render seluruh katalog dari array
  → expected +0 to be 5
```

Artinya: `#katalog` masih kosong (0 kartu), padahal seharusnya berisi 5.
