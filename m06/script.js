// PERTEMUAN 6 — Event, State, dan Penyimpanan
//
// Kode ini sengaja belum lengkap: sebagian fungsi baru separuh jadi (tanda
// TODO), sebagian lain punya bug yang membuatnya membaca data yang salah.
// Perbaiki dan lengkapi bertahap, Level 1 sampai 10.
//
// Baca SOAL.md, lalu jalankan:  npm run levels
// File yang kalian sentuh: hanya file ini. Jangan ubah index.html atau test/.
// Lihat hasilnya lewat Live Server (bukan klik dua kali index.html) — sama
// seperti Pertemuan 5, karena file ini dimuat sebagai module.

const KUNCI_PENYIMPANAN = 'taman-baca:daftar-bacaan';

// Satu objek untuk seluruh data aplikasi. Level 3 memastikan semua fungsi
// di bawah membaca dan menulis lewat objek ini, bukan variabel lain.
export const state = {
  katalog: [
    { judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', harga: 45000 },
    { judul: 'Bumi Manusia', penulis: 'Pramoedya Ananta Toer', harga: 60000 },
    { judul: 'Cantik Itu Luka', penulis: 'Eka Kurniawan', harga: 55000 },
    { judul: 'Negeri 5 Menara', penulis: 'Ahmad Fuadi', harga: 40000 },
  ],
  daftarBacaan: [],
};

// Dipakai variabel modul di sini secara sengaja — INI BUG Level 3.
// render() di bawah membaca dari sini, bukan dari argumen `state` yang
// diterimanya. Kalau kalian memanggil render(stateLain), tampilannya
// harusnya ikut stateLain, bukan katalog bawaan ini.
const katalogBawaan = state.katalog;

// ------------------------------------------------------ LATIHAN LEVEL 1–2

// Level 1 — TODO: pasang SATU listener klik pada #aksi-cepat (bukan pada
// tombolnya). Di dalam listener, isi catatanEvent.target dengan elemen yang
// benar-benar diklik (event.target), dan catatanEvent.currentTarget dengan
// elemen tempat listener dipasang (event.currentTarget).
export const catatanEvent = { target: null, currentTarget: null };

export function pasangAksiCepat() {
  const aksiCepat = document.querySelector('#aksi-cepat');

  if (!aksiCepat) return;

  aksiCepat.addEventListener('click', function (event) {
    catatanEvent.target = event.target;
    catatanEvent.currentTarget = event.currentTarget;
  });
}

// Level 2 — TODO: buktikan dulu, baru hentikan.
// - listener pada #area-bubbling menambah hitungKlik.luar tiap kali event
//   sampai ke sana (lewat bubbling).
// - listener pada #tombol-tanpa-stop menambah hitungKlik.dalam, TIDAK
//   menghentikan bubbling.
// - listener pada #tombol-stop menambah hitungKlik.dalam JUGA, tapi
//   memanggil event.stopPropagation() supaya tidak sampai ke #area-bubbling.
export const hitungKlik = { luar: 0, dalam: 0 };

export function pasangBuktiBubbling() {
  const areaBubbling = document.querySelector('#area-bubbling');
  const tombolTanpaStop = document.querySelector('#tombol-tanpa-stop');
  const tombolStop = document.querySelector('#tombol-stop');

  if (areaBubbling) {
    areaBubbling.addEventListener('click', function () {
      hitungKlik.luar++;
    });
  }

  if (tombolTanpaStop) {
    tombolTanpaStop.addEventListener('click', function () {
      hitungKlik.dalam++;
    });
  }

  if (tombolStop) {
    tombolStop.addEventListener('click', function (event) {
      hitungKlik.dalam++;
      event.stopPropagation();
    });
  }
}

// --------------------------------------------------------- KATALOG & KARTU

function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

function buatKartuBuku(buku) {
  const kartu = document.createElement('article');

  const judul = document.createElement('h3');
  judul.textContent = buku.judul;

  const penulis = document.createElement('p');
  penulis.textContent = buku.penulis;

  const harga = document.createElement('p');
  harga.textContent = formatRupiah(buku.harga);

  const tombol = document.createElement('button');
  tombol.type = 'button';
  tombol.textContent = '+ Tambah ke bacaan';
  tombol.dataset.aksi = 'tambah-bacaan';
  tombol.dataset.judul = buku.judul;
  tombol.dataset.penulis = buku.penulis;
  tombol.dataset.harga = String(buku.harga);

  kartu.append(judul, penulis, harga, tombol);
  return kartu;
}

// Level 3 — BUG: baris di bawah membaca `katalogBawaan` (lihat komentar di
// atas), bukan `state.katalog`. Perbaiki supaya render benar-benar memakai
// argumen `state` yang diterimanya.
export function render(state) {
  const wadahKatalog = document.querySelector('#katalog');
  wadahKatalog.textContent = '';

  for (const buku of state.katalog) {
    wadahKatalog.append(buatKartuBuku(buku));
  }

  const ringkasan = document.querySelector('#ringkasan');
  ringkasan.textContent = `${state.katalog.length} buku ditemukan`;

  // Level 9 — TODO: render juga #daftar-bacaan dari state.daftarBacaan.
  // Kalau kosong, tampilkan pesan yang jelas (misalnya "Belum ada buku di
  // daftar bacaan.") di dalam #daftar-bacaan — jangan biarkan <ul> kosong
  // melompong tanpa penjelasan apa pun.
  const wadahDaftarBacaan = document.querySelector('#daftar-bacaan');
  wadahDaftarBacaan.textContent = '';

  if (state.daftarBacaan.length === 0) {
    const pesanKosong = document.createElement('li');
    pesanKosong.textContent = 'Belum ada buku di daftar bacaan.';
    wadahDaftarBacaan.append(pesanKosong);
  } else {
    for (const buku of state.daftarBacaan) {
      const item = document.createElement('li');
      item.textContent = `${buku.judul} — ${buku.penulis} — ${formatRupiah(buku.harga)}`;
      wadahDaftarBacaan.append(item);
    }
  }
}

// ------------------------------------------------------------ DAFTAR BACAAN

// Level 4, 5, 6, 8 — TODO lengkapi fungsi ini:
// - Level 8 — validasi: tolak kalau `buku.judul` kosong/hilang, atau kalau
//   judul itu sudah ada di state.daftarBacaan (tidak boleh dobel).
// - tambahkan `buku` ke state.daftarBacaan.
// - Level 6 — simpan state.daftarBacaan ke localStorage (kunci:
//   KUNCI_PENYIMPANAN), sebagai string JSON.
// - Level 5 — panggil render(state) di akhir, supaya tampilan langsung
//   berubah tanpa kode lain perlu memanggilnya lagi.
export function tambahKeBacaan(buku) {
  if (!buku || typeof buku.judul !== 'string' || !buku.judul.trim()) {
    return;
  }

  const sudahAda = state.daftarBacaan.some(
    (item) => item.judul === buku.judul
  );

  if (sudahAda) {
    return;
  }

  state.daftarBacaan.push(buku);

  localStorage.setItem(
    KUNCI_PENYIMPANAN,
    JSON.stringify(state.daftarBacaan)
  );

  render(state);
}

// Level 4 — TODO: pasang SATU listener klik pada #katalog (bukan pada
// setiap tombol satu-satu). Gunakan event.target.closest(...) untuk
// menemukan tombol dengan [data-aksi="tambah-bacaan"] yang diklik — ini
// harus tetap bekerja untuk kartu yang baru muncul setelah render() dipanggil
// ulang, karena listernya menempel di #katalog, bukan di tombol yang lama.
// Ambil data buku dari dataset tombol (judul, penulis, harga), lalu panggil
// tambahKeBacaan(...).
export function pasangDelegasiKatalog() {
  const wadahKatalog = document.querySelector('#katalog');

  if (!wadahKatalog) return;

  wadahKatalog.addEventListener('click', function (event) {
    const tombol = event.target.closest('[data-aksi="tambah-bacaan"]');

    if (!tombol || !wadahKatalog.contains(tombol)) {
      return;
    }

    const buku = {
      judul: tombol.dataset.judul,
      penulis: tombol.dataset.penulis,
      harga: Number(tombol.dataset.harga),
    };

    tambahKeBacaan(buku);
  });
}

// Level 7 — BUG: baris ini crash kalau isi localStorage bukan JSON yang
// valid (coba: localStorage.setItem(KUNCI_PENYIMPANAN, 'bukan json')).
// Bungkus dengan try/catch, dan kalau gagal atau hasilnya bukan array,
// kembalikan array kosong saja — jangan biarkan aplikasi crash.
export function muatDaftarBacaan() {
  try {
    const tersimpan = localStorage.getItem(KUNCI_PENYIMPANAN);

    if (tersimpan === null) {
      return [];
    }

    const hasil = JSON.parse(tersimpan);

    if (!Array.isArray(hasil)) {
      return [];
    }

    return hasil;
  } catch (error) {
    return [];
  }
}

// -------------------------------------------------------------- BOOTSTRAP

state.daftarBacaan = muatDaftarBacaan();
pasangAksiCepat();
pasangBuktiBubbling();
pasangDelegasiKatalog();
render(state);