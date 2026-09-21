# Pertemuan 3 — Layout: Flexbox dan Grid

**Yang kalian kerjakan:** satu berkas, `style.css`. `index.html` sudah jadi
dan tidak berubah. Seperti pertemuan sebelumnya, tiap level punya gejala
yang perlu kalian selidiki dulu lewat DevTools, sebelum menulis kodenya.

**Cara kerja:**

```
npm install     # sekali di awal
npm run levels  # lihat level mana yang hijau
```

> Kalau `npm install` menampilkan peringatan "N vulnerabilities", abaikan
> saja — **jangan** jalankan `npm audit fix --force`. Itu bisa membuat
> `npm run levels` error total.

Semua merah di awal. Pertemuan ini paling banyak butuh cek visual manual —
lihat `CEK-VISUAL.md` sesudah setiap level hijau.

**Cara melihat hasilnya:** buka `index.html` langsung di browser.

**Aturan bertanya:** sebelum memanggil dosen/asdos —
(1) baca pesan test sampai habis, (2) coba link dokumentasi di level itu,
(3) tanya partner, (4) tanya meja sebelah.

**File yang kalian sentuh:** hanya `style.css`. Jangan ubah `index.html` atau folder `test/`.

---

## Dasar — semua harus sampai sini

### Level 1 — Flex container, tiga kartu berjajar

Buka bagian "Koleksi Unggulan". Tiga kartu di situ sekarang tersusun ke
BAWAH, padahal seharusnya berjajar ke SAMPING.

Ada satu properti CSS yang mengubah cara sebuah wadah (`.kartu-flex`)
menyusun anak-anaknya — dari tumpukan biasa jadi baris/kolom yang bisa
diatur.

**Baca dulu:**
- MDN — pengantar Flexbox: <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox>

### Level 2 — Lima varian justify-content

Setelah Level 1 selesai, buka DevTools → pilih `.kartu-flex` → di panel
Styles, coba ubah-ubah nilai propertinya langsung di situ (tanpa perlu
edit file). Ada lima nilai berbeda yang bisa dicoba untuk mengatur posisi
kartu-kartu itu SEPANJANG sumbu utama.

Coba kelima-limanya satu-satu, lihat bedanya, baru putuskan satu yang
paling cocok dan tulis di `style.css`.

**Baca dulu:**
- MDN — `justify-content`: <https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content>

### Level 3 — align-items pada tinggi berbeda

Kartu kedua teksnya lebih panjang dari dua kartu lain, jadi tingginya beda.
Perhatikan bagaimana ketiganya sejajar sekarang — apakah rapi, atau ada
yang terlihat aneh?

Ada properti lain (mirip Level 2, tapi untuk sumbu yang TEGAK LURUS dari
sumbu utama) yang mengatur ini.

**Baca dulu:**
- MDN — `align-items`: <https://developer.mozilla.org/en-US/docs/Web/CSS/align-items>

---

## Inti — Level 7 = lulus pertemuan ini

### Level 4 — Sidebar tetap 250px, konten mengisi

Buka bagian "Halaman Koleksi". Sidebar filter dan area konten sekarang
sama-sama menyusut/melebar mengikuti isinya. Yang diinginkan: sidebar
SELALU 250px lebarnya (tidak peduli isi kontennya), dan area konten
mengisi SISA ruang yang ada.

Ini pola flexbox yang sangat umum — satu sisi tetap, satu sisi fleksibel.
Cari tahu kombinasi properti yang tepat untuk masing-masing sisi.

**Baca dulu:**
- MDN — `flex`, `flex-grow`, `flex-shrink`, `flex-basis`:
  <https://developer.mozilla.org/en-US/docs/Web/CSS/flex>

### Level 5 — Sumbu berpindah — prediksi dulu

**Sebelum menulis kode:** flex container secara default menyusun anaknya
ke SAMPING (`flex-direction: row`). Ada properti untuk membalik itu jadi
ke BAWAH. Coba tebak dulu: kalau sumbu utama berubah dari mendatar ke
tegak, apa yang terjadi ke perilaku `justify-content` dan `align-items`
yang sudah kalian pelajari di Level 2 dan 3?

Buktikan tebakan kalian di bagian "Kontak Kami" — tiga baris info kontak
di situ perlu tersusun ke bawah.

**Baca dulu:**
- MDN — `flex-direction`: <https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction>

### Level 6 — Grid tiga kolom dengan fr

Buka bagian "Semua Koleksi". Kartu-kartunya sekarang tersusun satu per
baris ke bawah. CSS Grid punya cara membagi ruang jadi beberapa KOLOM
sekaligus, dengan satuan yang membagi ruang secara proporsional (bukan
`px` atau `%`).

**Baca dulu:**
- MDN — pengantar CSS Grid: <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids>
- MDN — `grid-template-columns`:
  <https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns>

### Level 7 — gap, bukan margin

Coba beri jarak antar kartu grid pakai `margin` di tiap kartu, lalu
perhatikan di DevTools: jarak di tepi kiri/kanan grid jadi tidak sama
dengan jarak ANTAR kartu (ada margin ganda di tengah). Grid dan Flexbox
punya satu properti khusus untuk kasus ini yang tidak punya masalah itu.

**Baca dulu:**
- MDN — `gap`: <https://developer.mozilla.org/en-US/docs/Web/CSS/gap>

---

## Lanjut — tidak wajib

### Level 8 — Kartu unggulan memakan 2 kolom

Kartu "Buku Unggulan Bulan Ini" seharusnya terlihat lebih lebar dari
kartu lain — memakan dua kolom grid sekaligus, bukan cuma satu.

**Baca dulu:**
- MDN — `grid-column`: <https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column>

### Level 9 — repeat + minmax

Coba lebarkan/sempitkan jendela browser dengan grid tiga kolom tetap dari
Level 6 — di layar sempit, kartunya jadi terlalu kecil dan sesak. Kalian
akan menulis banyak angka manual kalau mau atur jumlah kolom untuk tiap
ukuran layar satu-satu.

Ada satu fungsi CSS yang bisa "mengulang" definisi kolom otomatis, dan satu
fungsi lain yang memberi batas lebar minimum/maksimum tiap kolom — kalau
digabung, jumlah kolomnya menyesuaikan sendiri.

**Baca dulu:**
- MDN — `repeat()`: <https://developer.mozilla.org/en-US/docs/Web/CSS/repeat>
- MDN — `minmax()`: <https://developer.mozilla.org/en-US/docs/Web/CSS/minmax>

### Level 10 ⭐ — Responsif tanpa satu pun @media

Kalau Level 9 sudah benar, coba lebarkan/sempitkan jendela browser pelan-
pelan — jumlah kolom grid berubah sendiri, tanpa kalian menulis breakpoint
apa pun.

**Jangan tambahkan `@media` sama sekali** di file ini. Cari tahu kata kunci
yang membuat `repeat()` menghitung otomatis berapa kolom yang muat,
alih-alih angka tetap.

**Baca dulu:**
- MDN — `repeat()` (baca bagian `auto-fill` dan `auto-fit`):
  <https://developer.mozilla.org/en-US/docs/Web/CSS/repeat>

---

## Kalau macet

Baca pesan test sampai habis. Vitest menunjukkan nilai yang **diharapkan**
dan yang **diterima**.

Contoh:

```
× Level 7  gap, bukan margin
  → expected true to be false
```

Artinya: `.kartu-grid` masih punya properti `margin` — pindahkan jaraknya
ke `gap` pada `.kisi` saja.
