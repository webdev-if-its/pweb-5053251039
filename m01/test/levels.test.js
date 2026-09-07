import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { HtmlValidate } from 'html-validate';

let html = '';
let doc;

beforeAll(() => {
  html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  doc = new JSDOM(html).window.document;
});

const teks = (el) => (el?.textContent || '').trim();

describe('Taman Baca — Pertemuan 1', () => {
  // --------------------------------------------------------------- DASAR
  it('Level 1  Dokumen yang sah', () => {
    expect(html.trim().toLowerCase().startsWith('<!doctype html>')).toBe(true);
    expect(doc.documentElement.getAttribute('lang')).toBe('id');
    expect(doc.head).toBeTruthy();
    expect(teks(doc.querySelector('title')).length).toBeGreaterThan(3);
  });

  it('Level 2  Heading berjenjang', () => {
    const h1 = doc.querySelectorAll('h1');
    expect(h1.length).toBe(1);

    const tingkat = [...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) =>
      Number(h.tagName[1]),
    );
    expect(tingkat.length).toBeGreaterThanOrEqual(3);
    for (let i = 1; i < tingkat.length; i++) {
      // boleh turun sejauh apa pun, tapi naik maksimal satu tingkat
      expect(tingkat[i] - tingkat[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  it('Level 3  Paragraf dan daftar', () => {
    expect(doc.querySelectorAll('p').length).toBeGreaterThanOrEqual(1);

    const daftar = doc.querySelectorAll('ul li, ol li, dl dt');
    expect(daftar.length).toBeGreaterThanOrEqual(3);

    // <br> beruntun adalah tanda daftar dipalsukan
    expect(/<br\s*\/?>\s*<br\s*\/?>/i.test(html)).toBe(false);
  });

  // ---------------------------------------------------------------- INTI
  it('Level 4  Tautan yang bermakna', () => {
    const a = [...doc.querySelectorAll('a[href]')];
    expect(a.length).toBeGreaterThanOrEqual(3);

    const buruk = ['klik di sini', 'di sini', 'klik disini', 'selengkapnya di sini'];
    for (const t of a) {
      expect(buruk).not.toContain(teks(t).toLowerCase());
      expect(teks(t).length).toBeGreaterThan(2);
    }

    const eksternal = a.filter((t) => /^https?:\/\//i.test(t.getAttribute('href')));
    expect(eksternal.length).toBeGreaterThanOrEqual(1);
    for (const t of eksternal) {
      expect((t.getAttribute('rel') || '')).toContain('noopener');
    }
  });

  it('Level 5  Gambar dan alt', () => {
    const img = [...doc.querySelectorAll('img')];
    expect(img.length).toBeGreaterThanOrEqual(2);

    for (const g of img) {
      expect(g.hasAttribute('alt')).toBe(true);
    }

    const bermakna = img.filter((g) => g.getAttribute('alt').trim().length > 8);
    expect(bermakna.length).toBeGreaterThanOrEqual(1);

    // alt yang malas
    for (const g of bermakna) {
      expect(['gambar', 'foto', 'image', 'img']).not.toContain(
        g.getAttribute('alt').trim().toLowerCase(),
      );
    }

    const hiasan = img.filter((g) => g.getAttribute('alt').trim() === '');
    expect(hiasan.length).toBeGreaterThanOrEqual(1);
  });

  it('Level 6  Tabel yang terbaca', () => {
    const tabel = doc.querySelector('table');
    expect(tabel).toBeTruthy();
    expect(tabel.querySelector('thead')).toBeTruthy();

    const th = [...tabel.querySelectorAll('th')];
    expect(th.length).toBeGreaterThanOrEqual(2);
    for (const s of th) {
      expect(['col', 'row', 'colgroup', 'rowgroup']).toContain(s.getAttribute('scope'));
    }
  });

  it('Level 7  Bagian semantik', () => {
    expect(doc.querySelectorAll('header').length).toBeGreaterThanOrEqual(1);
    expect(doc.querySelectorAll('footer').length).toBeGreaterThanOrEqual(1);
    expect(doc.querySelectorAll('main').length).toBe(1);

    const nav = doc.querySelector('nav');
    expect(nav).toBeTruthy();
    // nav berisi menu, bukan membungkus seluruh header
    expect(nav.querySelectorAll('a').length).toBeGreaterThanOrEqual(2);
    expect(nav.querySelector('main')).toBeNull();
  });

  // -------------------------------------------------------------- LANJUT
  it('Level 8  article dan section', () => {
    const article = [...doc.querySelectorAll('article')];
    expect(article.length).toBeGreaterThanOrEqual(2);
    for (const a of article) {
      expect(a.querySelector('h1,h2,h3,h4,h5,h6')).toBeTruthy();
    }
  });

  it('Level 9  Metadata', () => {
    expect(doc.querySelector('meta[charset]')).toBeTruthy();

    const vp = doc.querySelector('meta[name="viewport"]');
    expect(vp?.getAttribute('content')).toContain('width=device-width');

    const desc = doc.querySelector('meta[name="description"]');
    const isi = (desc?.getAttribute('content') || '').trim();
    expect(isi.length).toBeGreaterThan(30);
    expect(isi.toLowerCase()).not.toContain('lorem');
    expect(isi.toLowerCase()).not.toContain('deskripsi halaman');

    expect(doc.querySelector('meta[property="og:title"]')).toBeTruthy();
  });

  it('Level 10 ⭐ Nol warning', async () => {
    const hv = new HtmlValidate({
      extends: ['html-validate:recommended'],
      rules: { 'void-style': 'off' },
    });
    const hasil = await hv.validateString(html);

    const pesan = hasil.results.flatMap((r) => r.messages).map((m) => `${m.line}: ${m.message}`);
    expect(pesan).toEqual([]);
  });
});
