# Cek Visual — Pertemuan 3

`npm run levels` memeriksa properti CSS-nya ada dan sesuai pola yang benar
lewat parsing teks — bukan tata letak sungguhan (jsdom tidak menjalankan
layout). Ini pertemuan paling "visual" dari semuanya — hampir semua level
di sini layak dilihat langsung. Maksimal 10 detik per kriteria per
mahasiswa.

## Level 1–3 — Kartu flex

- [ ] Tiga kartu koleksi unggulan berjajar ke SAMPING (bukan bertumpuk ke
      bawah)?
- [ ] Ada jarak yang masuk akal di antara ketiganya (efek dari
      justify-content)?
- [ ] Kartu kedua teksnya lebih panjang/tinggi — apakah ketiganya tetap
      terlihat rapi sejajar (bukan salah satu "mengambang" aneh)?

## Level 4 — Sidebar tetap, konten mengisi

- [ ] Lebarkan/sempitkan jendela browser — sidebar tetap sama lebarnya
      (kira-kira 250px), sementara area konten yang melebar/menyempit?

## Level 5 — Sumbu berpindah

- [ ] Tiga baris info kontak tersusun ke BAWAH (bukan ke samping)?

## Level 6–9 — Grid koleksi

- [ ] Di layar lebar (desktop), koleksi tersusun jadi beberapa kolom
      (bukan satu kolom memanjang ke bawah)?
- [ ] Ada jarak yang konsisten antar kartu, tanpa jarak ganda yang aneh di
      salah satu sisi (indikasi ada margin yang seharusnya tidak ada)?
- [ ] Kartu "Buku Unggulan Bulan Ini" terlihat lebih LEBAR dari kartu lain
      (memakan 2 kolom)?

## Level 10 — Responsif tanpa @media

- [ ] Sempitkan jendela browser pelan-pelan (atau DevTools device
      toolbar) — apakah jumlah kolom grid berkurang otomatis mengikuti
      lebar, TANPA patahan yang aneh (kartu terpotong, tumpang tindih)?
- [ ] Di 320px, apakah grid-nya jadi satu kolom yang rapi (bukan tetap
      memaksa banyak kolom yang jadi sempit sekali)?

---

Kalau ada yang lolos `npm run levels` tapi gagal salah satu di atas, catat
di kolom "catatan" saat melapor ke dosen — kemungkinan besar nilai
propertinya "benar secara pola" tapi kurang pas (misalnya minmax terlalu
kecil/besar).
