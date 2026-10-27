// PERTEMUAN 7 — fetch dan Asynchronous
//
// Kode ini mencari buku lewat API publik Open Library. Sebagian fungsi
// punya bug, sebagian lain baru separuh jadi (komentar TODO). Perbaiki dan
// lengkapi bertahap, Level 1 sampai 10.
//
// Baca SOAL.md, lalu jalankan:  npm run levels
// File yang kalian sentuh: hanya file ini. Jangan ubah index.html atau test/.
// Lihat hasilnya lewat Live Server (bukan klik dua kali index.html).

const JEDA_DEBOUNCE = 300;

// ---------------------------------------------------------------- LEVEL 1

// BUG: fungsi ini `return urutan` sebelum setTimeout dan Promise sempat
// berjalan. Menandai fungsi `async` TIDAK membuatnya otomatis menunggu
// kode asinkron lain yang dijadwalkan di dalamnya — ia hanya menunggu
// setiap `await` yang ditulis eksplisit.
export async function urutanEksekusi() {
  const urutan = [];
  urutan.push('sinkron');

  setTimeout(() => urutan.push('setTimeout'), 0);
  Promise.resolve().then(() => urutan.push('promise'));

  await new Promise ((resolve) => setTimeout(resolve , 10));

  return urutan;
}

// ------------------------------------------------------------ LEVEL 2–4

// TODO — perbaiki fungsi ini supaya:
// - Level 2: benar-benar mengembalikan array berbentuk
//   { judul, penulis, tahun }, diambil dari `docs` hasil Open Library
//   (bentuk asli tiap item: { title, author_name: [...], first_publish_year }).
//   Kalau `author_name` tidak ada, pakai 'Tidak diketahui'.
// - Level 3: ditulis dengan async/await, bukan rantai .then().
// - Level 4: fetch() TIDAK menolak (reject) promise-nya untuk status error
//   seperti 404/500 — hanya untuk kegagalan jaringan. Periksa
//   `response.ok`; kalau false, `throw new Error(...)` sendiri.
export async function ambilBuku(kataKunci) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(kataKunci)}&limit=5`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Gagal mengambil data buku');
  }

  const json = await response.json();

  return json.docs.map((buku) => ({
    judul: buku.title,
    penulis: buku.author_name?.[0] ?? 'Tidak diketahui',
    tahun: buku.first_publish_year
  }));
}


// -------------------------------------------------------------- RENDER
// Sudah lengkap — pola yang sama seperti render() di Pertemuan 5: satu
// fungsi, dipanggil untuk semua kondisi hasil pencarian.

function buatKartuHasil(buku) {
  const kartu = document.createElement('article');

  const judul = document.createElement('h3');
  judul.textContent = buku.judul;

  const info = document.createElement('p');
  info.textContent = `${buku.penulis} — ${buku.tahun ?? 'tahun tidak diketahui'}`;

  kartu.append(judul, info);
  return kartu;
}

export function render(data) {
  const wadah = document.querySelector('#hasil-pencarian');
  wadah.textContent = '';
  for (const buku of data) {
    wadah.append(buatKartuHasil(buku));
  }
}

// -------------------------------------------------------------- LEVEL 5–7, 10

let permintaanTerakhir = 0;

// TODO lengkapi fungsi ini:
// - Level 5: sebelum memanggil ambilBuku, set #status-pencarian jadi
//   "Memuat...".
// - Level 6: setelah berhasil, panggil render(data) untuk menampilkan hasil.
// - Level 7: tiga keadaan harus tampak di #status-pencarian —
//     * "Memuat..." selama menunggu
//     * "Tidak ada buku ditemukan." kalau hasilnya array kosong
//     * "Gagal memuat data. Coba lagi." kalau ambilBuku menolak/melempar
// - Level 10: pencarian bisa dipanggil lagi sebelum yang sebelumnya
//   selesai (mis. karena mengetik cepat). Respons yang datang belakangan
//   dari pencarian yang SUDAH USANG tidak boleh menimpa hasil pencarian
//   yang lebih baru. Variabel `permintaanTerakhir` di atas sudah disiapkan
//   untuk itu — beri setiap pemanggilan nomor urut, dan sebelum memakai
//   hasilnya (baik sukses maupun gagal), periksa apakah nomor itu masih
//   yang paling baru.
export async function cariDanRender(kataKunci) {
  const nomorPermintaan = ++permintaanTerakhir;
  const status = document.querySelector('#status-pencarian');

  status.textContent = 'Memuat...';

  try {
    const data = await ambilBuku(kataKunci);

    if (nomorPermintaan !== permintaanTerakhir) {
      return;
    }

    render(data);

    if (data.length === 0) {
      status.textContent = 'Tidak ada buku ditemukan.';
    } else {
      status.textContent = '';
    }
  } catch (error) {
    if (nomorPermintaan !== permintaanTerakhir) {
      return;
    }

    status.textContent = 'Gagal memuat data. Coba lagi.';
  }
}

// ------------------------------------------------------------- LEVEL 8–9

// TODO: pasang listener 'input' pada #input-cari-online.
// - Level 8: tiap ketikan (lewat cariDanRender) memicu pencarian baru.
// - Level 9: debounce JEDA_DEBOUNCE (300ms) — jangan panggil cariDanRender
//   di setiap huruf. Tunggu sampai pengguna berhenti mengetik selama
//   JEDA_DEBOUNCE, baru cari.
export function pasangPencarianOnline() {
  const input = document.querySelector('#input-cari-online');
  let timerDebounce;

  input.addEventListener('input', () => {
    clearTimeout(timerDebounce);

    const kataKunci = input.value.trim();

    if (kataKunci === '') {
      return;
    }

    timerDebounce = setTimeout(() => {
      cariDanRender(kataKunci);
    }, JEDA_DEBOUNCE);
  });
}

// -------------------------------------------------------------- BOOTSTRAP

pasangPencarianOnline();
