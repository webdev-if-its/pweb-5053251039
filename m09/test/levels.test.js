import { describe, it, expect, beforeAll, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

let mod;

beforeAll(async () => {
  const path = (relatif) => fileURLToPath(new URL(relatif, import.meta.url));
  const html = readFileSync(path('../index.html'), 'utf8');
  const body = /<body>([\s\S]*)<\/body>/i.exec(html)[1];
  document.body.innerHTML = body;

  mod = await import('../script.js');
});

function mockFetchSukses(docs) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ docs }),
  });
}

function buatDeferred() {
  let resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

const status = () => document.querySelector('#status-pencarian').textContent.toLowerCase();
const kartuHasil = () => [...document.querySelectorAll('#hasil-pencarian article')];

describe('Taman Baca — Pertemuan 7', () => {
  // --------------------------------------------------------------- DASAR
  it('Level 1  Prediksi urutan eksekusi', async () => {
    const urutan = await mod.urutanEksekusi();
    expect(urutan).toEqual(['sinkron', 'promise', 'setTimeout']);
  });

  it('Level 2  Ambil JSON dari API', async () => {
    mockFetchSukses([
      { title: 'Bumi Manusia', author_name: ['Pramoedya Ananta Toer'], first_publish_year: 1980 },
    ]);

    const hasil = await mod.ambilBuku('bumi');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toContain('bumi');
    expect(hasil).toEqual([
      { judul: 'Bumi Manusia', penulis: 'Pramoedya Ananta Toer', tahun: 1980 },
    ]);
  });

  it('Level 3  Tulis ulang dengan async/await', () => {
    expect(mod.ambilBuku.constructor.name).toBe('AsyncFunction');
  });

  // ---------------------------------------------------------------- INTI
  it('Level 4  Periksa response.ok — catch tidak cukup', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    await expect(mod.ambilBuku('tidak-ada')).rejects.toThrow();
  });

  it('Level 5  Indikator memuat', async () => {
    const tunda = buatDeferred();
    global.fetch = vi.fn().mockReturnValue(tunda.promise);

    const janji = mod.cariDanRender('bumi');
    expect(status()).toContain('memuat');

    tunda.resolve({ ok: true, status: 200, json: async () => ({ docs: [] }) });
    await janji;
  });

  it('Level 6  Render hasil pakai fungsi render m05', async () => {
    mockFetchSukses([
      { title: 'Negeri 5 Menara', author_name: ['Ahmad Fuadi'], first_publish_year: 2009 },
    ]);

    await mod.cariDanRender('menara');

    const kartu = kartuHasil();
    expect(kartu.length).toBe(1);
    expect(kartu[0].textContent).toContain('Negeri 5 Menara');
  });

  it('Level 7  Tiga keadaan: memuat, kosong, gagal', async () => {
    mockFetchSukses([]);
    await mod.cariDanRender('xxxxxxx-tidak-ada');
    expect(status()).toContain('tidak ada');

    global.fetch = vi.fn().mockRejectedValue(new Error('jaringan gagal'));
    await mod.cariDanRender('bumi');
    expect(status()).toContain('gagal');
  });

  // -------------------------------------------------------------- LANJUT
  it('Level 8  Cari saat mengetik', async () => {
    vi.useFakeTimers();
    mockFetchSukses([]);

    const input = document.querySelector('#input-cari-online');
    input.value = 'laskar';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    await vi.advanceTimersByTimeAsync(400);

    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch.mock.calls.at(-1)[0]).toContain('laskar');

    vi.useRealTimers();
  });

  it('Level 9  Debounce 300ms', async () => {
    vi.useFakeTimers();
    mockFetchSukses([]);
    global.fetch.mockClear();

    const input = document.querySelector('#input-cari-online');
    for (const huruf of ['l', 'la', 'las', 'lask']) {
      input.value = huruf;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await vi.advanceTimersByTimeAsync(100); // jeda antar ketikan < 300ms
    }

    expect(global.fetch).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(300);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toContain('lask');

    vi.useRealTimers();
  });

  it('Level 10  Respons yang saling mendahului', async () => {
    const tundaPertama = buatDeferred();
    const tundaKedua = buatDeferred();

    global.fetch = vi
      .fn()
      .mockReturnValueOnce(tundaPertama.promise)
      .mockReturnValueOnce(tundaKedua.promise);

    const janjiPertama = mod.cariDanRender('a'); // lambat
    const janjiKedua = mod.cariDanRender('ab'); // cepat, menyusul

    // yang lebih baru (ab) selesai duluan
    tundaKedua.resolve({
      ok: true,
      status: 200,
      json: async () => ({ docs: [{ title: 'Hasil AB', author_name: ['Penulis AB'] }] }),
    });
    await janjiKedua;

    // yang lebih lama (a) baru selesai belakangan — ini respons usang
    tundaPertama.resolve({
      ok: true,
      status: 200,
      json: async () => ({ docs: [{ title: 'Hasil A', author_name: ['Penulis A'] }] }),
    });
    await janjiPertama;

    const kartu = kartuHasil();
    expect(kartu.length).toBe(1);
    expect(kartu[0].querySelector('h3').textContent).toBe('Hasil AB');
  });
});
