# Pertemuan 2 — CSS: Selector, Box Model, Spesifisitas

**Yang kalian kerjakan:** dua berkas, `index.html` dan `style.css`. Sama
seperti pertemuan lalu, tiap level punya gejala yang perlu kalian selidiki
dulu — nama properti CSS-nya sengaja tidak selalu disebut langsung di sini.
Coba, cari lewat DevTools, baca link dokumentasi kalau perlu.

**Cara kerja:**

```
npm install     # sekali di awal
npm run levels  # lihat level mana yang hijau
```

> Kalau `npm install` menampilkan peringatan "N vulnerabilities", abaikan
> saja — **jangan** jalankan `npm audit fix --force`. Itu bisa membuat
> `npm run levels` error total.

Semua merah di awal. Sebagian level juga butuh cek visual manual bersama
asdos — lihat `CEK-VISUAL.md`.

**Cara melihat hasilnya:** buka `index.html` langsung di browser (klik dua
kali sudah cukup, tidak ada JavaScript di pertemuan ini).

**Aturan bertanya:** sebelum memanggil dosen/asdos —
(1) baca pesan test sampai habis, (2) coba link dokumentasi di level itu,
(3) tanya partner, (4) tanya meja sebelah.

**File yang kalian sentuh:** `index.html` dan `style.css`. Jangan ubah folder `test/`.

---

## Dasar — semua harus sampai sini

### Level 1 — Stylesheet eksternal terhubung

Buka DevTools (`F12`) → tab **Network** → centang **CSS** di filter → muat
ulang halaman. Cari baris yang statusnya merah (404). File itu memang tidak
ada.

Bandingkan nama file yang diminta di baris merah itu, dengan nama file
CSS yang benar-benar ada di folder pertemuan ini.

**Baca dulu:**
- MDN — cara menghubungkan CSS ke HTML:
  <https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Getting_started/How_CSS_works>

### Level 2 — Selector elemen, class, id

CSS punya beberapa cara memilih elemen mana yang mau di-style: lewat nama
tag-nya, lewat class-nya, atau lewat id-nya. Ketiganya beda simbol, dan beda
"kekuatan" (dibahas lagi di Level 7).

Coba tambahkan gaya apa saja ke halaman ini, tapi pastikan kalian sudah
pernah pakai ketiga cara itu minimal sekali.

**Baca dulu:**
- MDN — jenis-jenis selector CSS:
  <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Basic_selectors>

### Level 3 — Box model: padding, border, margin

Klik kanan kotak "Rak Fiksi" → Inspect. Di panel Elements, cari tab
**Computed** — ada diagram kotak kecil di situ (box model). Semua
angkanya sekarang 0.

Kotak itu perlu tiga jenis jarak sekaligus: jarak dari tepinya sendiri ke
isinya, garis tepi yang terlihat, dan jarak ke elemen lain di sekitarnya.
Cari tahu properti apa untuk masing-masing.

**Baca dulu:**
- MDN — model kotak CSS: <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_sizing/Box_model>

---

## Inti — Level 7 = lulus pertemuan ini

### Level 4 — border-box — dua tangkapan layar

Ukur lebar kotak "Rak Fiksi" lewat DevTools SEBELUM kalian mengerjakan
Level 3 (kalau sudah terlanjur, kerjakan dulu Level 3, catat lebarnya, baru
lanjut ke sini). Sekarang bandingkan lebarnya SESUDAH padding dan border
ditambahkan.

Ambil screenshot kedua kondisi itu. Cari tahu: kenapa lebar kotaknya
berubah walau kalian tidak mengubah `width`? Ada satu properti CSS yang
mengatur supaya padding dan border tidak menambah lebar total.

**Baca dulu:**
- MDN — `box-sizing`: <https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing>

### Level 5 — Turunan vs anak langsung

Buka bagian "Jam Buka". Ada daftar yang di dalamnya ada daftar lagi
(bersarang). Coba buat aturan CSS untuk item-item dalam daftar itu — kalau
kalian pakai selector yang "terlalu luas", item yang bersarang dua level
di dalam ikut ke-style juga, padahal harusnya cuma anak langsungnya saja.

Cari tahu: ada simbol khusus di CSS untuk membatasi selector supaya cuma
menyasar anak LANGSUNG, tidak sampai ke cucu.

**Baca dulu:**
- MDN — combinator CSS (turunan vs anak langsung):
  <https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator>
  dan
  <https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator>

### Level 6 — :hover dan :focus-visible

Arahkan mouse ke tombol "Lihat koleksi" — tidak ada yang berubah. Klik di
tempat lain dulu, lalu tekan Tab sampai fokus sampai ke tombol itu — juga
tidak ada tanda apa pun kalau tombol itu sedang aktif.

Keduanya butuh aturan terpisah: satu untuk kondisi mouse di atasnya, satu
lagi untuk kondisi fokus keyboard. Judul level ini sudah menyebutkan nama
keduanya — tinggal cari tahu cara pakainya.

**Baca dulu:**
- MDN — `:hover`: <https://developer.mozilla.org/en-US/docs/Web/CSS/:hover>
- MDN — `:focus-visible`: <https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible>

### Level 7 — Kalahkan aturan tanpa !important

Klik kanan teks pengumuman → Inspect. Di panel Styles, kalian akan lihat
warna abu-abunya berasal dari satu aturan (`p.pengumuman`). **Jangan hapus
atau ubah aturan itu.**

Tugas kalian: buat teks itu berubah warna, dengan menambahkan aturan BARU
yang "lebih kuat" — bukan lewat `!important` (dilarang untuk level ini),
tapi lewat pemilihan selector yang tepat.

**Baca dulu:**
- MDN — spesifisitas CSS: <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity>

---

## Lanjut — tidak wajib

### Level 8 — Satuan rem untuk teks

Buka pengaturan browser kalian, cari "ukuran font" (font size), lalu
naikkan. Refresh halaman ini — teks yang ukurannya ditulis pakai satuan
`px` **tidak ikut berubah** sama sekali, padahal pengguna sudah minta teks
lebih besar.

Ganti semua ukuran teks di file ini supaya pakai satuan yang mengikuti
preferensi itu.

**Baca dulu:**
- MDN — satuan panjang CSS (px vs rem vs em):
  <https://developer.mozilla.org/en-US/docs/Web/CSS/length>

### Level 9 — Variabel CSS di :root

Bayangkan warna hijau khas Taman Baca dipakai di lima tempat berbeda di
`style.css`. Suatu saat kalian mau ganti jadi warna lain — berarti harus
ganti manual di lima tempat, dan gampang ada yang kelewat.

CSS punya cara menyimpan satu nilai supaya bisa dipakai berulang-ulang dari
satu tempat. Cari tahu caranya, lalu pakai untuk minimal satu warna di file
ini.

**Baca dulu:**
- MDN — variabel CSS (custom properties):
  <https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties>

### Level 10 ⭐ — Tema gelap dengan mengubah 3 nilai

Coba di DevTools: tab **Rendering** (buka lewat menu titik tiga → More
tools) → cari **Emulate CSS media feature prefers-color-scheme** → pilih
`dark`. Sebagian besar browser dan OS sekarang punya mode gelap bawaan.

Tantangannya: pakai variabel dari Level 9, buat halaman ini berubah total
skema warnanya (latar, teks, aksen) saat mode gelap aktif — dengan hanya
mengubah **3 nilai variabel**, bukan menulis ulang seluruh selector.

**Baca dulu:**
- MDN — `prefers-color-scheme`:
  <https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme>

---

## Kalau macet

Baca pesan test sampai habis. Vitest menunjukkan nilai yang **diharapkan**
dan yang **diterima**.

Contoh:

```
× Level 10 ⭐ Tema gelap dengan mengubah 3 nilai
  → expected 2 to be 3
```

Artinya: jumlah variabel yang diubah di dalam mode gelap belum tepat 3
(mungkin kurang, mungkin lebih).
