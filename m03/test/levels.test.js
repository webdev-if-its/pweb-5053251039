import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { JSDOM } from 'jsdom';

let css = '';
let doc;
let aturan;

const path = (relatif) => fileURLToPath(new URL(relatif, import.meta.url));

beforeAll(() => {
  const html = readFileSync(path('../index.html'), 'utf8');
  // Komentar dibuang dulu — supaya contoh kode di komentar TODO tidak ikut
  // kecocokan regex dan bikin level lolos padahal belum dikerjakan.
  css = readFileSync(path('../style.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  doc = new JSDOM(html, { url: 'https://tamanbaca.local/' }).window.document;
  aturan = ambilAturan(css);
});

function ambilAturan(teks) {
  const hasil = [];
  const regex = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = regex.exec(teks))) {
    hasil.push({ selektor: m[1].trim(), deklarasi: m[2].trim() });
  }
  return hasil;
}

function cariAturan(namaSelektor) {
  return aturan.find((a) => a.selektor.split(',').some((s) => s.trim() === namaSelektor));
}

describe('Taman Baca — Pertemuan 3', () => {
  // --------------------------------------------------------------- DASAR
  it('Level 1  Flex container, tiga kartu berjajar', () => {
    const kartuFlex = cariAturan('.kartu-flex');
    expect(kartuFlex).toBeTruthy();
    expect(/display\s*:\s*flex/i.test(kartuFlex.deklarasi)).toBe(true);

    expect(doc.querySelectorAll('.kartu-flex > .kartu').length).toBe(3);
  });

  it('Level 2  Lima varian justify-content', () => {
    const kartuFlex = cariAturan('.kartu-flex');
    const nilaiValid = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'];
    const cocok = /justify-content\s*:\s*([\w-]+)/i.exec(kartuFlex.deklarasi);
    expect(cocok).toBeTruthy();
    expect(nilaiValid).toContain(cocok[1]);
  });

  it('Level 3  align-items pada tinggi berbeda', () => {
    const kartuFlex = cariAturan('.kartu-flex');
    expect(/align-items\s*:\s*[\w-]+/i.test(kartuFlex.deklarasi)).toBe(true);
  });

  // ---------------------------------------------------------------- INTI
  it('Level 4  Sidebar tetap 250px, konten mengisi', () => {
    const tataLetak = cariAturan('.tata-letak');
    expect(tataLetak).toBeTruthy();
    expect(/display\s*:\s*flex/i.test(tataLetak.deklarasi)).toBe(true);

    const sidebar = cariAturan('.sidebar');
    expect(sidebar).toBeTruthy();
    expect(/(flex(-basis)?|width)\s*:\s*[^;]*250px/i.test(sidebar.deklarasi)).toBe(true);
    // tidak boleh ikut melebar
    expect(/flex(-grow)?\s*:\s*(?!0)[1-9]/i.test(sidebar.deklarasi)).toBe(false);

    const konten = cariAturan('.konten');
    expect(konten).toBeTruthy();
    expect(/flex(-grow)?\s*:\s*(1\b|[1-9][^;]*)/i.test(konten.deklarasi)).toBe(true);
  });

  it('Level 5  Sumbu berpindah — prediksi dulu', () => {
    const infoKontak = cariAturan('.info-kontak');
    expect(infoKontak).toBeTruthy();
    expect(/display\s*:\s*flex/i.test(infoKontak.deklarasi)).toBe(true);
    expect(/flex-direction\s*:\s*column/i.test(infoKontak.deklarasi)).toBe(true);
  });

  it('Level 6  Grid tiga kolom dengan fr', () => {
    const kisi = cariAturan('.kisi');
    expect(kisi).toBeTruthy();
    expect(/display\s*:\s*grid/i.test(kisi.deklarasi)).toBe(true);

    const kolom = /grid-template-columns\s*:\s*([^;]+)/i.exec(kisi.deklarasi)?.[1];
    expect(kolom).toBeTruthy();
    expect(kolom).toMatch(/fr/i);
  });

  it('Level 7  gap, bukan margin', () => {
    const kisi = cariAturan('.kisi');
    expect(/gap\s*:\s*(?!0\b)[^;]+/i.test(kisi.deklarasi)).toBe(true);

    const kartuGrid = cariAturan('.kartu-grid');
    expect(kartuGrid).toBeTruthy();
    expect(/margin/i.test(kartuGrid.deklarasi)).toBe(false);
  });

  // -------------------------------------------------------------- LANJUT
  it('Level 8  Kartu unggulan memakan 2 kolom', () => {
    const unggulan = cariAturan('.unggulan');
    expect(unggulan).toBeTruthy();
    expect(/grid-column\s*:\s*(span\s*2\b|1\s*\/\s*3)/i.test(unggulan.deklarasi)).toBe(true);
  });

  it('Level 9  repeat + minmax', () => {
    const kisi = cariAturan('.kisi');
    const kolom = /grid-template-columns\s*:\s*([^;]+)/i.exec(kisi.deklarasi)?.[1] || '';
    expect(/repeat\(/i.test(kolom)).toBe(true);
    expect(/minmax\(/i.test(kolom)).toBe(true);
  });

  it('Level 10 ⭐ Responsif tanpa satu pun @media', () => {
    expect(/@media/i.test(css)).toBe(false);

    const kisi = cariAturan('.kisi');
    const kolom = /grid-template-columns\s*:\s*([^;]+)/i.exec(kisi.deklarasi)?.[1] || '';
    expect(/repeat\(\s*auto-(fit|fill)/i.test(kolom)).toBe(true);
  });
});
