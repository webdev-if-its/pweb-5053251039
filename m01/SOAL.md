# Pertemuan 1 — Struktur Dokumen dan Semantik

**Yang kalian kerjakan:** satu halaman, `index.html`. Halaman itu sudah ada.
Tampilannya "terlihat oke" di browser — tapi strukturnya hampir semua salah.

Ini bukan bug yang kelihatan. Bug ini baru terasa kalau halaman dibuka pakai
alat bantu, misalnya pembaca layar (screen reader), atau alat pengembang di
browser.

**Cara kerja di pertemuan ini agak beda:** untuk tiap level, kalian harus
CARI DULU apa yang salah, baru perbaiki. Nama tag/atribut solusinya sengaja
tidak saya sebutkan langsung — itu memang bagian dari latihan.

Tiap level punya:
1. Cara mengecek masalahnya (biasanya lewat browser/DevTools)
2. Link dokumentasi resmi untuk dibaca

Urutannya: baca, coba, cari solusinya sendiri, lalu jalankan `npm run levels`
untuk cek apakah dugaan kalian benar.

**Cara kerja:**

```
npm install     # sekali di awal
npm run levels  # lihat level mana yang hijau
```

> Kalau `npm install` menampilkan peringatan "N vulnerabilities", abaikan
> saja — **jangan** jalankan `npm audit fix --force`. Perintah itu bisa
> membuat `vitest` naik ke versi yang belum cocok, dan `npm run levels`
> jadi error semua.

Semua merah di awal. Itu memang seharusnya.

**Aturan bertanya:** sebelum memanggil dosen/asdos —
(1) baca pesan test sampai habis, (2) coba buka link dokumentasi di level
itu, (3) tanya partner, (4) tanya meja sebelah.

**File yang kalian sentuh:** hanya `index.html`. Jangan ubah folder `test/`.

---

## Dasar — semua harus sampai sini

### Level 1 — Dokumen yang sah

Buka `index.html`, tekan `F12`, lalu buka tab **Console**. Ketik ini dan
tekan Enter:

```js
document.compatMode
```

Kalau hasilnya `"BackCompat"`, artinya browser sedang bingung: ia tidak
yakin halaman ini HTML "modern" atau bukan, jadi ia pakai cara render lama
yang kurang rapi. Ada satu baris di paling atas dokumen yang menentukan hal
ini.

Lihat juga tab browser kalian. Judulnya kosong atau asal-asalan — itu
masalah lain yang juga perlu dibetulkan.

Ada satu hal lagi: bahasa dokumen ini belum diatur. Ini biasanya tidak
kedengaran bedanya kalau kalian coba pakai pembaca layar bawaan Windows/Mac,
karena suara Bahasa Indonesia biasanya belum terpasang di komputer
kebanyakan orang. Jadi jangan andalkan telinga untuk yang satu ini.

Cara paling pasti untuk mengeceknya: buka DevTools → panel **Lighthouse** →
centang *Accessibility* → klik *Analyze page load*. Salah satu pemeriksaan
otomatisnya memang soal ini.

> Walau tidak kedengaran bedanya di laptop kalian, pengaturan bahasa ini
> tetap penting: dipakai oleh mesin pencari, alat terjemahan, dan pembaca
> layar yang memang sudah punya suara Bahasa Indonesia. "Tidak kedengaran
> di laptop saya" bukan berarti "tidak berguna".

**Baca dulu:**
- MDN — Doctype: <https://developer.mozilla.org/en-US/docs/Glossary/Doctype>
- MDN — atribut global `lang`:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang>
- MDN — elemen `<title>`:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title>

### Level 2 — Heading berjenjang

Buka DevTools (`F12`) → tab Elements → panel *Accessibility* (sudah ada
bawaan di Chrome/Edge). Cari bagian "Heading" di situ.

Judul-judul besar di halaman ini ("Tentang Kami", "Jam Buka", dst.) tidak
akan muncul sama sekali di panel itu — padahal di layar mereka terlihat
besar dan tebal, seperti judul.

Cari tahu: elemen apa yang membuat sesuatu benar-benar dianggap "judul" oleh
browser? Bukan cuma terlihat besar karena CSS, tapi benar-benar tercatat
sebagai judul.

Satu aturan lagi: level judul itu bertingkat (judul besar, lalu judul lebih
kecil di bawahnya, dst). Hanya boleh ada **satu** judul paling besar di
halaman ini, dan tingkatannya tidak boleh meloncat.

**Baca dulu:**
- MDN — elemen heading (`h1`–`h6`):
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements>
- W3Schools — HTML Headings (lebih santai kalau MDN terasa berat):
  <https://www.w3schools.com/html/html_headings.asp>

### Level 3 — Paragraf dan daftar

Buka bagian "Jam Buka" lewat DevTools. Tiga baris jam bukanya dipisahkan
pakai elemen kosong, diulang dua kali. Itu bukan cara yang benar untuk
membuat sebuah DAFTAR.

Di layar, ini memang terlihat seperti daftar. Tapi browser dan pembaca
layar tidak akan tahu ini daftar — karena memang bukan daftar sungguhan.

Ada juga teks biasa yang belum dibungkus elemen apa pun.

**Baca dulu:**
- MDN — elemen `<p>`:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p>
- MDN — daftar HTML (`<ul>`, `<ol>`, `<dl>`):
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul>

---

## Inti — Level 7 = lulus pertemuan ini

### Level 4 — Tautan yang bermakna

Bayangkan seseorang memakai pembaca layar, lalu menekan tombol pintasan
"tampilkan semua tautan di halaman ini". Coba bayangkan apa yang akan
terdengar untuk halaman kita sekarang — beberapa tautan akan terbaca sama
persis, dan tidak memberi tahu tautan itu menuju ke mana.

Ada juga satu tautan yang membuka situs lain (Google Maps) di tab baru.
Cari tahu: kenapa ini butuh satu atribut tambahan supaya lebih aman?

**Baca dulu:**
- MDN — elemen `<a>`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a>
- MDN — link type `noopener`:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/noopener>

### Level 5 — Gambar dan alt

Matikan gambar di browser kalian (Chrome: Settings → Privacy and security →
Site settings → Images → Don't allow), lalu muat ulang halaman ini.

Untuk foto rak buku, kalian akan lihat kotak kosong tanpa keterangan apa
pun. Informasi itu hilang total buat orang yang tidak bisa melihat
gambarnya.

Untuk gambar garis (dekorasi), harusnya **tidak ada** yang hilang sama
sekali kalau gambar itu dihapus — karena memang cuma hiasan.

Cari tahu: atribut apa yang dipakai untuk memberi teks pengganti pada
gambar? Dan kenapa isinya harus beda untuk gambar yang penting vs gambar
yang cuma hiasan?

**Baca dulu:**
- MDN — elemen `<img>`:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img>
- WebAIM — panduan menulis teks alternatif gambar:
  <https://webaim.org/techniques/alttext/>

### Level 6 — Tabel yang terbaca

Bayangkan tabel koleksi ini punya 50 baris. Kalian pengguna pembaca layar
yang baru pindah fokus ke salah satu sel di tengah tabel. Pembaca layar
harus bisa bilang "kolom Jumlah, baris Novel".

Supaya itu bisa terjadi, pembaca layar perlu tahu sel mana yang jadi JUDUL
kolom/baris, dan sel mana yang cuma isi data biasa.

Cek tabel koleksi sekarang: ada bedanya tidak, antara sel judul dan sel
isi?

**Baca dulu:**
- MDN — elemen `<th>` dan atribut `scope`:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th>
- WebAIM — cara membuat tabel data yang mudah diakses:
  <https://webaim.org/techniques/tables/data>

### Level 7 — Bagian semantik

Pengguna pembaca layar sering berpindah antar bagian penting halaman
(kepala halaman, menu, konten utama, kaki halaman) lewat satu tombol
pintasan saja — tanpa perlu scroll dari atas.

Supaya itu bisa terjadi, tiap bagian itu harus ditandai dengan elemen yang
tepat. Cek halaman ini sekarang: semua bagian dibungkus elemen umum yang
tidak menandakan apa-apa.

Perbaiki supaya ada elemen khusus untuk: kepala halaman, konten utama
(hanya **satu**), kaki halaman, dan menu navigasi (dibungkus terpisah, tidak
ikut seluruh kepala halaman).

**Baca dulu:**
- MDN — `<header>`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header>
- MDN — `<nav>`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav>
- MDN — `<main>`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main>
- MDN — `<footer>`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer>

---

## Lanjut — tidak wajib

### Level 8 — article dan section

Ada dua potongan "berita" di halaman ini. Sekarang keduanya cuma dibungkus
elemen umum dengan label class "berita".

Ada dua elemen semantik yang cocok untuk kasus seperti ini, dan sering
tertukar:
- Satu untuk konten yang bisa berdiri sendiri — tetap masuk akal kalau
  dibaca terpisah, atau dipindah ke halaman lain.
- Satu lagi untuk sekadar mengelompokkan bagian-bagian, yang cuma masuk
  akal dalam konteks halaman ini saja.

Coba tentukan sendiri: mana yang cocok untuk tiap "berita" itu, dan mana
yang cocok untuk mengelompokkan bagian-bagian halaman secara umum?

**Baca dulu:**
- MDN — `<article>`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article>
- MDN — `<section>`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section>

### Level 9 — Metadata

Coba bagikan link halaman ini ke WhatsApp/Telegram (kalau nanti sudah
online), atau cari di Google. Preview yang muncul biasanya diambil dari
beberapa tag `<meta>` yang tersembunyi di bagian `<head>`.

Sekarang halaman ini belum lengkap:
- Pengaturan karakter (encoding) belum jelas
- Tampilannya belum menyesuaikan lebar layar HP
- Tidak ada deskripsi atau judul yang akan muncul di preview media sosial

**Baca dulu:**
- MDN — elemen `<meta>`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta>
- Open Graph Protocol (dipakai untuk preview link di WhatsApp/Facebook):
  <https://ogp.me/>

### Level 10 ⭐ — Nol warning

Jalankan:

```
npm run validate
```

Alat ini (html-validate) memeriksa dokumen kalian sesuai aturan resmi HTML
— jauh lebih ketat daripada sekadar "tampil oke di browser".

Baca tiap baris pesannya sampai habis. Biasanya pesan itu menyebutkan baris
yang bermasalah, dan alasannya. Halaman harus lolos **tanpa satu pun**
pesan — bukan cuma bebas error, tapi juga bebas warning.

**Baca dulu (kalau nama aturannya membingungkan):**
- html-validate — dokumentasi resmi: <https://html-validate.org/>
- W3C Markup Validator (alat pembanding, kadang penjelasannya lebih jelas):
  <https://validator.w3.org/>

---

## Kalau macet

Baca pesan test sampai habis. Vitest menunjukkan nilai yang **diharapkan**
dan yang **diterima**. Dari situ biasanya sudah jelas apa yang kurang —
meski saya sengaja tidak menyebutkan solusinya langsung di sini.

Contoh:

```
× Level 2  Heading berjenjang
  → expected 3 to be 1
```

Artinya: test menghitung ada 3 elemen yang dianggap "judul tertinggi",
padahal seharusnya cuma 1. Dari situ, cari sendiri elemen mana yang
berlebih.
