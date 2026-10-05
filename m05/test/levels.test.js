import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

let mod;
let sumberKode;

beforeAll(async () => {
  const path = (relatif) => fileURLToPath(new URL(relatif, import.meta.url));

  const html = readFileSync(path('../index.html'), 'utf8');
  const body = /<body>([\s\S]*)<\/body>/i.exec(html)[1];
  document.body.innerHTML = body;

  sumberKode = readFileSync(path('../script.js'), 'utf8');
  mod = await import('../script.js');
});

const kartu = () => [...document.querySelectorAll('#katalog article')];

describe('Taman Baca — Pertemuan 5', () => {
  // --------------------------------------------------------------- DASAR
  it('Level 1  formatRupiah — nol tetap "Rp 0"', () => {
    expect(mod.formatRupiah(0)).toBe('Rp 0');
    expect(mod.formatRupiah(45000)).toBe('Rp 45.000');
  });

  it('Level 2  Saring array tanpa mengubah aslinya', () => {
    const panjangAwal = mod.katalog.length;
    const hasil = mod.saringTersedia(mod.katalog);

    expect(hasil).not.toBe(mod.katalog);
    expect(hasil.length).toBeGreaterThan(0);
    expect(hasil.length).toBeLessThan(panjangAwal);
    expect(hasil.every((b) => b.tersedia)).toBe(true);
    expect(mod.katalog.length).toBe(panjangAwal);
  });

  it('Level 3  querySelector mengubah satu elemen', () => {
    mod.sorotJudulPengumuman();
    const el = document.querySelector('#judul-pengumuman');
    expect(el.textContent).toBe('PENGUMUMAN TERBARU');
  });

  // ---------------------------------------------------------------- INTI
  it('Level 4  querySelectorAll untuk banyak elemen', () => {
    mod.tandaiPengumumanPenting();
    const li = [...document.querySelectorAll('#daftar-pengumuman li')];
    const ditandai = li.filter((l) => l.textContent.trim().startsWith('⚠'));

    expect(ditandai.length).toBe(1);
    expect(ditandai[0].textContent.toLowerCase()).toContain('tutup');

    // panggil dua kali — tidak boleh menumpuk jadi "⚠ ⚠ ..."
    mod.tandaiPengumumanPenting();
    const liLagi = [...document.querySelectorAll('#daftar-pengumuman li')];
    expect(liLagi.filter((l) => l.textContent.trim().startsWith('⚠')).length).toBe(1);
  });

  it('Level 5  Buat elemen — textContent, bukan innerHTML', () => {
    expect(sumberKode).not.toMatch(/innerHTML/);

    const buku = mod.katalog[0];
    const el = mod.buatKartuBuku(buku);

    expect(el.tagName.toLowerCase()).toBe('article');
    const judul = el.querySelector('h1,h2,h3,h4,h5,h6');
    expect(judul?.textContent).toBe(buku.judul);
    expect(el.textContent).toContain(buku.penulis);
    expect(el.textContent).toContain(mod.formatRupiah(buku.harga));
  });

  it('Level 6  Render seluruh katalog dari array', () => {
    mod.render(mod.katalog);
    expect(kartu().length).toBe(mod.katalog.length);

    const ringkasan = document.querySelector('#ringkasan');
    expect(ringkasan.textContent).toContain(String(mod.katalog.length));
  });

  it('Level 7  Klik kartu ke-2 menampilkan kartu ke-2', () => {
    mod.render(mod.katalog);
    kartu()[1].dispatchEvent(new Event('click', { bubbles: true }));

    const panel = document.querySelector('#panel-detail');
    expect(panel.textContent).toContain(mod.katalog[1].judul);
  });

  // -------------------------------------------------------------- LANJUT
  it('Level 8  Form tanpa memuat ulang halaman', () => {
    const form = document.querySelector('#form-cari');
    const event = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('Level 9  Pencarian menyaring katalog', () => {
    mod.render(mod.katalog);

    document.querySelector('#input-cari').value = 'bumi';
    document
      .querySelector('#form-cari')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const hasil = kartu();
    expect(hasil.length).toBe(1);
    expect(hasil[0].textContent).toContain('Bumi Manusia');
  });

  it('Level 10  Satu fungsi render(data) untuk semuanya', () => {
    mod.render([]);

    expect(kartu().length).toBe(0);
    expect(document.querySelector('#katalog').textContent.toLowerCase()).toContain('tidak ada');
    expect(document.querySelector('#ringkasan').textContent).toContain('0');
  });
});
