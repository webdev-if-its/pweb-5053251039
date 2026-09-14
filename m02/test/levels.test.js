import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { JSDOM } from 'jsdom';

let html = '';
let css = '';
let doc;
let aturan;

const path = (relatif) => fileURLToPath(new URL(relatif, import.meta.url));

beforeAll(() => {
  html = readFileSync(path('../index.html'), 'utf8');
  // Komentar dibuang dulu — supaya contoh kode di komentar TODO tidak ikut
  // kecocokan regex dan bikin level lolos padahal belum dikerjakan.
  css = readFileSync(path('../style.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  // url diisi supaya dokumennya tidak "opaque origin" — beberapa
  // pemeriksaan selector jsdom (nwsapi) menyentuh API yang butuh origin
  // sungguhan walau kita tidak memakai localStorage sama sekali di sini.
  doc = new JSDOM(html, { url: 'https://tamanbaca.local/' }).window.document;
  aturan = ambilAturan(css);
});

// -------------------------------------------------------- util parsing CSS
// Parser sederhana: cukup untuk soal ini, TIDAK menangani @media bersarang
// dengan sempurna (aturan di dalam @media diperlakukan mentah sebagai teks
// tambahan, bukan dipecah individual — cukup untuk Level 10 yang hanya
// menghitung kemunculan variabel, bukan mem-parsing rule di dalamnya).

function ambilAturan(teks) {
  const hasil = [];
  const regex = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = regex.exec(teks))) {
    hasil.push({ selektor: m[1].trim(), deklarasi: m[2].trim() });
  }
  return hasil;
}

function ambilBlok(teks, polaAwal) {
  const cocok = polaAwal.exec(teks);
  if (!cocok) return null;
  let i = cocok.index + cocok[0].length; // posisi setelah '{' pembuka
  let dalam = 1;
  const awal = i;
  while (i < teks.length && dalam > 0) {
    if (teks[i] === '{') dalam++;
    else if (teks[i] === '}') dalam--;
    i++;
  }
  return teks.slice(awal, i - 1);
}

function jenisSelektorPertama(selektor) {
  const bagian = selektor.split(',')[0].trim();
  const pertama = bagian.split(/[\s>+~]/)[0];
  if (pertama.startsWith('#')) return 'id';
  if (pertama.startsWith('.')) return 'class';
  if (pertama.startsWith(':') || pertama.startsWith('*') || pertama.startsWith('[')) return 'lain';
  if (/^[a-zA-Z]/.test(pertama)) return 'elemen';
  return 'lain';
}

describe('Taman Baca — Pertemuan 2', () => {
  // --------------------------------------------------------------- DASAR
  it('Level 1  Stylesheet eksternal terhubung', () => {
    const link = doc.querySelector('link[rel="stylesheet"]');
    expect(link).toBeTruthy();

    const href = link.getAttribute('href');
    expect(href).toBeTruthy();

    const lokasi = resolve(dirname(path('../index.html')), href);
    expect(existsSync(lokasi)).toBe(true);
  });

  it('Level 2  Selector elemen, class, id', () => {
    const jenis = aturan.map((a) => jenisSelektorPertama(a.selektor));
    expect(jenis).toContain('elemen');
    expect(jenis).toContain('class');
    expect(jenis).toContain('id');
  });

  it('Level 3  Box model: padding, border, margin', () => {
    const kotak = aturan.find((a) => a.selektor.split(',').some((s) => s.trim() === '.kotak'));
    expect(kotak).toBeTruthy();

    expect(/padding\s*:\s*(?!0\b)(?!0px)(?!0rem)[^;]+/i.test(kotak.deklarasi)).toBe(true);
    expect(/border\s*:\s*(?!none\b)(?!0\b)[^;]+/i.test(kotak.deklarasi)).toBe(true);
    expect(/margin\s*:\s*(?!0\b)(?!0px)(?!0rem)[^;]+/i.test(kotak.deklarasi)).toBe(true);
  });

  // ---------------------------------------------------------------- INTI
  it('Level 4  border-box — dua tangkapan layar', () => {
    expect(/box-sizing\s*:\s*border-box/i.test(css)).toBe(true);
  });

  it('Level 5  Turunan vs anak langsung', () => {
    const cocok = aturan.find(
      (a) => a.selektor.includes('daftar') && a.selektor.includes('>'),
    );
    expect(cocok).toBeTruthy();

    const dicocokkan = [...doc.querySelectorAll(cocok.selektor)];
    const liJebakan = doc.querySelector('.jebakan');

    expect(dicocokkan.length).toBe(2);
    expect(dicocokkan).not.toContain(liJebakan);
  });

  it('Level 6  :hover dan :focus-visible', () => {
    expect(aturan.some((a) => a.selektor.includes('.tombol') && a.selektor.includes(':hover'))).toBe(true);
    expect(
      aturan.some((a) => a.selektor.includes('.tombol') && a.selektor.includes(':focus-visible')),
    ).toBe(true);
  });

  it('Level 7  Kalahkan aturan tanpa !important', () => {
    expect(/!important/i.test(css)).toBe(false);

    const basis = aturan.find((a) => a.selektor.trim() === 'p.pengumuman');
    expect(basis).toBeTruthy(); // aturan dasar tidak boleh dihapus/diubah

    const menang = aturan.find((a) => a.selektor.trim() === '#pengumuman-utama');
    expect(menang).toBeTruthy();

    const warnaBasis = /color\s*:\s*([^;]+)/i.exec(basis.deklarasi)?.[1].trim();
    const warnaMenang = /color\s*:\s*([^;]+)/i.exec(menang.deklarasi)?.[1].trim();
    expect(warnaMenang).toBeTruthy();
    expect(warnaMenang).not.toBe(warnaBasis);
  });

  // -------------------------------------------------------------- LANJUT
  it('Level 8  Satuan rem untuk teks', () => {
    expect(/font-size\s*:\s*[\d.]+px/i.test(css)).toBe(false);
    expect(/font-size\s*:\s*[\d.]+rem/i.test(css)).toBe(true);
  });

  it('Level 9  Variabel CSS di :root', () => {
    const root = aturan.find((a) => a.selektor.trim() === ':root');
    expect(root).toBeTruthy();

    const variabel = [...root.deklarasi.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]);
    expect(variabel.length).toBeGreaterThanOrEqual(1);

    const dipakai = variabel.some((v) => new RegExp(`var\\(\\s*${v}\\s*[,)]`).test(css));
    expect(dipakai).toBe(true);
  });

  it('Level 10 ⭐ Tema gelap dengan mengubah 3 nilai', () => {
    const isiBlok = ambilBlok(css, /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)\s*\{/i);
    expect(isiBlok).toBeTruthy();

    const jumlahVariabel = [...isiBlok.matchAll(/--[\w-]+\s*:/g)].length;
    expect(jumlahVariabel).toBe(3);
  });
});
