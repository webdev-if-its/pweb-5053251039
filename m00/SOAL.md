# Pertemuan 0 — Pengenalan Sistem

Selamat datang! Sebelum masuk ke materi Pemrograman Web yang sesungguhnya
(dimulai Pertemuan 1), pertemuan ini mengenalkan **cara kerja sistem tugas**
di mata kuliah ini — supaya nanti kalian tidak bingung dengan alatnya,
cukup fokus ke materinya.

Levelnya sengaja sangat mudah. Tugas kalian cuma mengisi sebuah "kartu
perkenalan" sederhana (`index.html`) dengan data diri kalian sendiri.

---

## Konsep dasar yang perlu kalian pahami

**Level itu bukan nilai.** Sepanjang semester, tugas kalian dibagi jadi
Level 1 sampai 10 per pertemuan. Warna hijau/merah cuma menunjukkan
progres — bukan angka rapor. (Khusus UTS di Pertemuan 8 nanti beda aturan
— akan dijelaskan terpisah saat itu.)

**Level menumpuk.** Level 2 menambah ke pekerjaan Level 1 di file yang
sama — bukan latihan terpisah-pisah.

**Ada dua cara kalian tahu progres:**
1. `npm run levels` — kalian jalankan sendiri, lihat langsung di layar.
2. GitHub Actions — otomatis jalan tiap kalian `git push`, hasilnya bisa
   dilihat dosen dari jarak jauh. Ini alasan kenapa kalian harus rajin
   push, bukan cuma simpan di laptop sendiri.

---

## Langkah 1 — Pastikan alat sudah terpasang

Buka terminal (Command Prompt/PowerShell di Windows, Terminal di Mac),
lalu jalankan:

```bash
node --version
git --version
```

Kalau muncul nomor versi (bukan pesan "command not found"), alatnya sudah
siap. Kalau belum, minta bantuan asdos — ini normal terjadi di pertemuan
pertama.

## Langkah 2 — Salin repo ini jadi milik kalian sendiri

Ikuti instruksi dari dosen/asdos untuk membuat repo kalian sendiri (lewat
GitHub Classroom atau tombol "Use this template"). Setelah itu, `git clone`
repo hasil salinan kalian ke laptop, lalu buka foldernya di VS Code.

## Langkah 3 — Masuk ke folder ini, install, dan jalankan test

```bash
cd m00
npm install
npm run levels
```

Semua level akan **merah**. Itu memang seharusnya — kalian belum mengisi
apa-apa.

> Kalau `npm install` menampilkan peringatan "N vulnerabilities", abaikan
> saja — **jangan** jalankan `npm audit fix --force`. Itu bisa membuat
> `npm run levels` error total.

## Langkah 4 — Baca pesan test, edit file, ulangi

Buka `m00/index.html` di VS Code. Kalian akan lihat teks-teks contoh
seperti "Nama Kalian Di Sini" — itu memang harus diganti.

Tiap kali kalian mengedit dan menyimpan file, jalankan lagi
`npm run levels` untuk melihat level mana yang sudah hijau. Ulangi sampai
semua 5 level hijau.

---

## Kelima levelnya

### Level 1 — Judul halaman

Ganti isi `<title>` (sekarang tertulis "Untitled") jadi sesuatu yang
bermakna — misalnya nama kalian, atau "Kartu Perkenalan [nama kalian]".

### Level 2 — Nama kalian

Ganti teks di dalam `<h1 id="nama">` dari "Nama Kalian Di Sini" jadi nama
kalian sendiri.

### Level 3 — NRP kalian

Ganti angka di `<p id="nrp">` dari "0000000000" jadi NRP kalian
sungguhan.

### Level 4 — Satu kalimat perkenalan

Ganti teks di `<p id="bio">` jadi satu kalimat sungguhan tentang diri
kalian — bebas, boleh soal hobi, asal daerah, atau apa pun.

### Level 5 — Tautan ke profil GitHub kalian

Ganti atribut `href` pada `<a id="github">` dari `#` jadi alamat profil
GitHub kalian sendiri, contoh: `https://github.com/nama-akun-kalian`.

---

## Langkah 5 — Simpan progres kalian ke GitHub

Setelah semua level hijau, ini bagian yang **tidak dicek otomatis** tapi
**wajib** dilakukan tiap kali kalian selesai mengerjakan sesuatu sepanjang
semester:

```bash
git add m00
git commit -m "Selesaikan pertemuan 0"
git push
```

Setelah `push`, buka repo kalian di GitHub, klik tab **Actions** — akan
ada satu run baru berjalan (atau sudah selesai). Itu tandanya progres
kalian sudah "sampai" ke dosen, meski dosen tidak sedang melihat laptop
kalian langsung.

---

## Langkah 6 — Siap untuk pertemuan berikutnya

Mulai Pertemuan 1, kalian akan menarik folder pertemuan baru dari repo
dosen tiap minggu — caranya ada di `README.md` di folder paling atas repo
kalian (bagian "Mengambil pertemuan baru tiap minggu"). Coba baca sekarang
supaya tidak kaget minggu depan.

---

## Kalau macet

Baca pesan test sampai habis. Vitest menunjukkan nilai yang **diharapkan**
dan yang **diterima**.

Contoh:

```
× Level 2  Nama kalian
  → expected 'Nama Kalian Di Sini' to not be 'Nama Kalian Di Sini'
```

Artinya: teks di `#nama` belum diganti sama sekali — masih persis teks
contohnya.
