# pweb-template

Repo tugas mata kuliah Pemrograman Web semester 3 — soal latihan berjenjang
(Level 1–10) per pertemuan, dengan autograding lewat `npm run levels`. Di
**pertemuan biasa**, level adalah **penanda progres, bukan nilai** — tidak
ada bobot atau ranking.

m00 mengenalkan cara kerja sistem ini (5 level yang sangat mudah — bukan
materi web). Materi utamanya dimulai m01: semua pertemuan membangun satu
situs yang sama, **Taman Baca RW 04** (perpustakaan warga fiktif). m01
membuat kerangka HTML semantiknya, m02–m04 menggayakan dengan CSS dan
membuatnya responsif/aksesibel, m05–m07 menambah interaksi JavaScript dan
data, m08 UTS (studi kasus kumulatif m01–m07), m09 menjadikannya PWA.

Pertemuan baru dibagikan **satu per minggu**, mengikuti jadwal kelas — lihat
[Mengambil pertemuan baru](#mengambil-pertemuan-baru-tiap-minggu) di bawah.
Kalau folder pertemuan minggu ini belum ada di repo kalian, itu bukan bug —
memang belum saatnya dirilis.

## Cara kerja tiap pertemuan

Masuk ke folder pertemuan (`m01`, `m02`, dst.), baca `SOAL.md`, lalu:

```bash
npm install
npm run levels
```

Semua level merah di awal — itu memang seharusnya. Kerjakan bertahap;
level menumpuk di file yang sama, bukan latihan terpisah.

> **Kalau `npm install` menampilkan peringatan "N vulnerabilities":**
> abaikan saja, dan **jangan** menjalankan `npm audit fix --force`.
> Peringatan itu datang dari dependency development-only (alat testing),
> bukan risiko nyata untuk tugas lokal ini — sementara `--force` akan
> melompati `vitest` ke versi major baru yang belum kompatibel dan
> menyebabkan error `Cannot find native binding` saat `npm run levels`.
> Kalau sudah terlanjur, jalankan `git checkout -- package.json` di folder
> pertemuan itu, hapus `node_modules` dan `package-lock.json`, lalu
> `npm install` ulang.

## Mengambil pertemuan baru tiap minggu

Repo kalian ini **tidak otomatis sinkron** dengan repo dosen — setiap ada
pertemuan baru dirilis, kalian yang menariknya sendiri. Cukup dua baris,
dan aman dijalankan kapan pun (tidak akan menimpa folder pertemuan lain
yang sudah kalian kerjakan):

```bash
git fetch https://github.com/webdev-if-its/pweb-template.git main
git checkout FETCH_HEAD -- m02
```

Ganti `m02` dengan nama folder pertemuan yang baru diumumkan, lalu commit
seperti biasa:

```bash
git add m02
git commit -m "Tarik pertemuan m02"
```

> **Kalau dosen memperbaiki sesuatu di pertemuan yang SUDAH kalian
> kerjakan** (misalnya ada bug di test), jangan jalankan perintah di atas
> untuk folder itu — itu akan menimpa pekerjaan kalian. Dosen/asdos akan
> menyebutkan berkas spesifik mana yang perlu diganti (biasanya cuma
> `test/levels.test.js`), bukan seluruh folder.

## Struktur

```
m00/ … m09/                satu folder per pertemuan (m00 = pengenalan
│                          sistem; folder yang belum dirilis
│                          memang belum ada di repo kalian)
├── SOAL.md                dibaca mahasiswa — kriteria hijau tiap level
├── CEK-VISUAL.md           (m02–m04, m09) checklist manual untuk hal yang
│                           tidak bisa dijangkau autograder
├── index.html / *.js/css   starter code — sengaja belum selesai
├── test/levels.test.js     autograder — JANGAN diubah
└── package.json

scripts/ringkas-level.js      membaca hasil test, tentukan level tertinggi
                               yang hijau BERURUTAN dari 1 (progres, BUKAN
                               dipakai untuk menilai UTS m08 — lihat di
                               bawah)
scripts/jalankan-levels.js    dipakai `npm run levels` tiap pertemuan —
                               tampilan disederhanakan (nama level + alasan
                               singkat), tanpa dump diff/stack trace penuh
.github/workflows/levels.yml   jalan tiap push, tidak berhenti walau merah
```

## Kontrak progres

Nama test **selalu** berformat `Level N  <deskripsi>` (N = 1–10) — ada
skrip yang mem-parsing ini dengan regex `/Level\s+(\d+)/i`. Setiap
`package.json` pertemuan punya dua skrip:

```json
"levels":    "node ../scripts/jalankan-levels.js",
"levels:ci": "vitest run --reporter=json --outputFile=../.hasil/HASIL.json"
```

`scripts/ringkas-level.js` mengelompokkan hasil per `Level N` dan berhenti
di level merah PERTAMA — Level 8 hijau saat Level 3 masih merah tetap
dihitung sebagai level 2, karena level dirancang menumpuk.