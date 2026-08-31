import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { JSDOM } from 'jsdom';

let doc;

beforeAll(() => {
  const path = (relatif) => fileURLToPath(new URL(relatif, import.meta.url));
  const html = readFileSync(path('../index.html'), 'utf8');
  doc = new JSDOM(html).window.document;
});

const teks = (el) => (el?.textContent || '').trim();

describe('Kartu Perkenalan — Pertemuan 0', () => {
  it('Level 1  Judul halaman', () => {
    const title = teks(doc.querySelector('title'));
    expect(title.length).toBeGreaterThan(3);
    expect(title.toLowerCase()).not.toBe('untitled');
  });

  it('Level 2  Nama kalian', () => {
    const nama = teks(doc.querySelector('#nama'));
    expect(nama.length).toBeGreaterThan(2);
    expect(nama).not.toBe('Nama Kalian Di Sini');
  });

  it('Level 3  NRP kalian', () => {
    const nrp = teks(doc.querySelector('#nrp'));
    expect(nrp).not.toContain('0000000000');
    expect(/\d{5,}/.test(nrp)).toBe(true);
  });

  it('Level 4  Satu kalimat perkenalan', () => {
    const bio = teks(doc.querySelector('#bio'));
    expect(bio.length).toBeGreaterThan(15);
    expect(bio).not.toBe('Tulis satu kalimat tentang diri kalian di sini.');
  });

  it('Level 5  Tautan ke profil GitHub kalian', () => {
    const link = doc.querySelector('#github');
    expect(link).toBeTruthy();

    const href = link.getAttribute('href');
    expect(href).toBeTruthy();
    expect(/^https:\/\/github\.com\/[\w-]+\/?$/.test(href)).toBe(true);
  });
});
