import { describe, it, expect, beforeAll, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

let mod;

beforeAll(async () => {
  const path = (relatif) => fileURLToPath(new URL(relatif, import.meta.url));
  const html = readFileSync(path('../index.html'), 'utf8');
  const body = /<body>([\s\S]*)<\/body>/i.exec(html)[1];
  document.body.innerHTML = body;

  localStorage.clear();
  mod = await import('../script.js');
});

const kartu = () => [...document.querySelectorAll('#katalog article')];
const klik = (el) => el.dispatchEvent(new Event('click', { bubbles: true }));

describe('Taman Baca — Pertemuan 6', () => {
  // --------------------------------------------------------------- DASAR
  it('Level 1  target vs currentTarget', () => {
    const ikon = document.querySelector('#tombol-cepat .ikon');
    klik(ikon);

    expect(mod.catatanEvent.target).toBe(ikon);
    expect(mod.catatanEvent.currentTarget).toBe(document.querySelector('#aksi-cepat'));
  });

  it('Level 2  Bubbling — buktikan lalu hentikan', () => {
    mod.hitungKlik.luar = 0;
    mod.hitungKlik.dalam = 0;

    klik(document.querySelector('#tombol-tanpa-stop'));
    expect(mod.hitungKlik.dalam).toBe(1);
    expect(mod.hitungKlik.luar).toBe(1); // event sampai ke #area-bubbling

    klik(document.querySelector('#tombol-stop'));
    expect(mod.hitungKlik.dalam).toBe(2);
    expect(mod.hitungKlik.luar).toBe(1); // dihentikan, tidak bertambah lagi
  });

  it('Level 3  Satu objek state untuk seluruh aplikasi', () => {
    const stateUji = { katalog: mod.state.katalog.slice(0, 2), daftarBacaan: [] };
    mod.render(stateUji);
    expect(kartu().length).toBe(2);

    mod.render(mod.state); // kembalikan ke kondisi penuh untuk test berikutnya
  });

  // ---------------------------------------------------------------- INTI
  it('Level 4  Delegasi event untuk elemen baru', () => {
    mod.render(mod.state);

    // Tombol ini dibuat manual, TANPA lewat render() — mensimulasikan
    // elemen yang baru ditambahkan ke halaman setelah listener dipasang.
    const kartuBaru = document.createElement('article');
    const tombolBaru = document.createElement('button');
    tombolBaru.type = 'button';
    tombolBaru.dataset.aksi = 'tambah-bacaan';
    tombolBaru.dataset.judul = 'Buku Simulasi';
    tombolBaru.dataset.penulis = 'Penulis Simulasi';
    tombolBaru.dataset.harga = '1000';
    kartuBaru.append(tombolBaru);
    document.querySelector('#katalog').append(kartuBaru);

    const sebelum = mod.state.daftarBacaan.length;
    klik(tombolBaru);

    expect(mod.state.daftarBacaan.length).toBe(sebelum + 1);
    expect(mod.state.daftarBacaan.some((b) => b.judul === 'Buku Simulasi')).toBe(true);
  });

  it('Level 5  Setiap perubahan state memanggil render', () => {
    mod.render(mod.state);
    const sebelum = document.querySelectorAll('#daftar-bacaan li').length;

    mod.tambahKeBacaan({ judul: 'Cantik Itu Luka', penulis: 'Eka Kurniawan', harga: 55000 });

    const sesudah = document.querySelectorAll('#daftar-bacaan li').length;
    expect(sesudah).toBe(sebelum + 1);
  });

  it('Level 6  localStorage bertahan setelah ditutup', () => {
    mod.tambahKeBacaan({ judul: 'Negeri 5 Menara', penulis: 'Ahmad Fuadi', harga: 40000 });

    const tersimpan = JSON.parse(localStorage.getItem('taman-baca:daftar-bacaan'));
    expect(Array.isArray(tersimpan)).toBe(true);
    expect(tersimpan.some((b) => b.judul === 'Negeri 5 Menara')).toBe(true);
  });

  it('Level 7  JSON rusak tidak boleh crash', () => {
    localStorage.setItem('taman-baca:daftar-bacaan', '{ bukan json valid ][');

    let hasil;
    expect(() => { hasil = mod.muatDaftarBacaan(); }).not.toThrow();
    expect(Array.isArray(hasil)).toBe(true);
  });

  // -------------------------------------------------------------- LANJUT
  it('Level 8  Validasi sebelum masuk state', () => {
    mod.state.daftarBacaan = [];
    mod.render(mod.state);

    mod.tambahKeBacaan({ judul: '', penulis: 'Tanpa Judul', harga: 0 });
    expect(mod.state.daftarBacaan.length).toBe(0);

    mod.tambahKeBacaan({ judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', harga: 45000 });
    expect(mod.state.daftarBacaan.length).toBe(1);

    mod.tambahKeBacaan({ judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', harga: 45000 });
    expect(mod.state.daftarBacaan.length).toBe(1); // duplikat ditolak
  });

  it('Level 9  Keadaan kosong di setiap daftar', () => {
    mod.state.daftarBacaan = [];
    mod.render(mod.state);

    const daftar = document.querySelector('#daftar-bacaan');
    expect(daftar.children.length).toBeGreaterThanOrEqual(1);
    expect(daftar.textContent.toLowerCase()).toContain('belum ada');
  });

  it('Level 10  Daftar bacaan yang bertahan', async () => {
    localStorage.setItem(
      'taman-baca:daftar-bacaan',
      JSON.stringify([{ judul: 'Buku Tersimpan', penulis: 'Penulis X', harga: 10000 }]),
    );

    vi.resetModules();
    document.querySelector('#katalog').textContent = '';
    document.querySelector('#daftar-bacaan').textContent = '';
    const modBaru = await import('../script.js');

    expect(modBaru.state.daftarBacaan.some((b) => b.judul === 'Buku Tersimpan')).toBe(true);
    expect(document.querySelector('#daftar-bacaan').textContent).toContain('Buku Tersimpan');
  });
});
