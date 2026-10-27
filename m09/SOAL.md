# Pertemuan 9 — fetch dan Asynchronous

**Yang kalian kerjakan:** satu berkas, `script.js`. Halaman ini mencari
buku lewat API publik Open Library. Baca komentar `// TODO` di tiap
fungsi sebelum menulis kode.

**Cara kerja:**

```
npm install     # sekali di awal
npm run levels  # lihat level mana yang hijau
```

> Kalau `npm install` menampilkan peringatan "N vulnerabilities", abaikan
> saja — **jangan** jalankan `npm audit fix --force`. Itu bisa membuat
> `npm run levels` error total.

Semua merah di awal. **Test tidak memanggil internet sungguhan** — semua
`fetch` digantikan (mock) supaya hasilnya konsisten dan cepat. Kalau
kalian coba di browser sungguhan lewat Live Server, itu baru memanggil
Open Library beneran.

**Aturan bertanya:** sebelum memanggil dosen/asdos —
(1) baca pesan test sampai habis, (2) coba link dokumentasi di level itu,
(3) tanya partner, (4) tanya meja sebelah.

**File yang kalian sentuh:** hanya `script.js`. Jangan ubah `index.html` atau folder `test/`.

---

## Dasar — semua harus sampai sini

### Level 1 — Prediksi urutan eksekusi

Tulis di kertas dulu, SEBELUM menjalankan apa pun:

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```

Urutan apa yang menurut kalian akan tercetak? Baru coba jalankan di
Console DevTools, dan bandingkan dengan tebakan kalian.

**Baca dulu:**
- MDN — event loop di JavaScript: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop>

### Level 2 — Ambil JSON dari API

Coba jalankan `fetch('https://openlibrary.org/search.json?q=bumi')` di
Console (butuh internet). Hasilnya bukan langsung data — kalian dapat
objek `Response`, dan perlu satu langkah lagi untuk mengambil isinya
sebagai JSON.

Data mentah dari Open Library bentuknya beda dari yang kita mau
tampilkan (`{ title, author_name, first_publish_year }` vs
`{ judul, penulis, tahun }`) — perlu diubah bentuknya juga.

**Baca dulu:**
- MDN — `fetch()`: <https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch>
- MDN — `Response.json()`: <https://developer.mozilla.org/en-US/docs/Web/API/Response/json>

### Level 3 — Tulis ulang dengan async/await

`fetch(...).then(...).then(...)` dan `async function` dengan `await` di
dalamnya, secara perilaku sama — cuma beda cara menulisnya. Tulis ulang
fungsi Level 2 kalian pakai `async`/`await`.

**Baca dulu:**
- MDN — `async`/`await`: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function>

---

## Inti — Level 7 = lulus pertemuan ini

### Level 4 — Periksa response.ok — catch tidak cukup

Coba `fetch()` ke URL yang sengaja salah/tidak ada datanya (misalnya
`https://openlibrary.org/search.json?q=` diikuti karakter aneh yang
menghasilkan 404). Cek `response.status` — apakah promise-nya ditolak
(reject), atau tetap "berhasil" secara teknis walau isinya kosong/error?

**Baca dulu:**
- MDN — memeriksa keberhasilan fetch: <https://developer.mozilla.org/en-US/docs/Web/API/Response/ok>

### Level 5 — Indikator memuat

Coba cari buku di halaman sungguhan (lewat Live Server) dengan koneksi
internet yang agak lambat (DevTools → Network → Throttling). Berapa lama
jeda antara kalian mengetik dan hasil muncul? Apakah ada tanda apa pun ke
pengguna bahwa aplikasi sedang bekerja, atau layar terlihat diam saja?

**Baca dulu:**
- (tidak ada link khusus — soal disiplin urutan: set status dulu SEBELUM
  memanggil fungsi yang butuh waktu)

### Level 6 — Render hasil pakai fungsi render m05

Fungsi `render(data)` di file ini sudah lengkap — pola yang sama seperti
Pertemuan 5. Pastikan hasil pencarian ditampilkan lewat fungsi ini, bukan
kode tampilan baru.

**Baca dulu:**
- (lihat kembali Pertemuan 5, Level 6 dan 10)

### Level 7 — Tiga keadaan: memuat, kosong, gagal

Ada tiga kondisi berbeda yang bisa terjadi saat mencari: masih menunggu,
sudah selesai tapi hasilnya nol, atau gagal total (jaringan putus).
Coba pikirkan: pesan apa yang paling membantu pengguna untuk
masing-masing kondisi itu?

**Baca dulu:**
- (gabungan Level 4, 5, 6 — tidak ada link baru)

---

## Lanjut — tidak wajib

### Level 8 — Cari saat mengetik

Coba lihat kotak pencarian Google atau marketplace — hasilnya berubah
SAAT kalian mengetik, tanpa perlu menekan Enter. Ada event yang terpicu
setiap kali isi sebuah `<input>` berubah.

**Baca dulu:**
- MDN — event `input`: <https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event>

### Level 9 — Debounce 300ms

Kalau pencarian langsung jalan di SETIAP huruf yang diketik (Level 8
polos), coba ketik kata 5 huruf dengan cepat — berapa kali `fetch`
terpanggil? Kebanyakan dari permintaan itu langsung dibuang percuma
karena keburu diketik lagi.

Ada pola umum untuk menunda eksekusi sampai pengguna "berhenti" melakukan
sesuatu selama waktu tertentu.

**Baca dulu:**
- MDN — `setTimeout()` dan `clearTimeout()`:
  <https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout>
- CSS-Tricks — penjelasan debounce (konsepnya berlaku juga di luar CSS):
  <https://css-tricks.com/debouncing-throttling-explained-examples/>

### Level 10 ⭐ — Respons yang saling mendahului

Bayangkan: kalian ketik "a" (pencarian lambat karena hasilnya banyak),
lalu buru-buru ketik lagi jadi "ab" (pencarian ini kebetulan lebih
cepat). Permintaan MANA yang akan selesai duluan — yang pertama dikirim,
atau yang keduanya?

Kalau jawaban yang pertama ("a", lambat) datang BELAKANGAN dan menimpa
hasil "ab" yang sudah tampil duluan, pengguna melihat hasil yang salah.
Cari cara untuk menandai permintaan mana yang PALING BARU, dan abaikan
saja jawaban dari permintaan yang sudah usang.

**Baca dulu:**
- MDN — `Promise`: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise>

---

## Kalau macet

Baca pesan test sampai habis. Vitest menunjukkan nilai yang **diharapkan**
dan yang **diterima**.

Contoh:

```
× Level 4  Periksa response.ok — catch tidak cukup
  → promise resolved "undefined" instead of rejecting
```

Kalau ini gagal, artinya `ambilBuku` tidak melempar error sama sekali
untuk respons gagal — cek lagi apakah `response.ok` benar-benar
diperiksa.
