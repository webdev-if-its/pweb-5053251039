#!/usr/bin/env node
/**
 * Menjalankan `vitest run` dari folder pertemuan saat ini, tapi
 * menyembunyikan detail teknis (diff lengkap, code frame, stack trace) yang
 * biasanya muncul di bagian "Failed Tests" — mahasiswa cukup lihat nama
 * level, hijau/merah, dan satu baris alasan singkat.
 *
 * Pemakaian (dari package.json tiap pertemuan):
 *   "levels": "node ../scripts/jalankan-levels.js"
 *
 * `npm run levels:watch` dan `levels:ci` TIDAK lewat sini — watch mode butuh
 * output live apa adanya, dan levels:ci butuh JSON utuh untuk
 * ringkas-level.js.
 */
const { spawn } = require('node:child_process');

const bin = process.platform === 'win32' ? 'vitest.cmd' : 'vitest';
const proc = spawn(bin, ['run', '--reporter=verbose'], {
  cwd: process.cwd(),
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe'],
});

// Vitest menulis sebagian laporan ke stdout dan sebagian ke stderr (baris
// gagal biasanya lewat stderr) -- keduanya disaring lewat logika yang sama,
// masing-masing punya penyangga baris sendiri supaya potongan chunk di satu
// stream tidak tercampur dengan stream lainnya.
let sembunyikan = false;

function prosesBaris(baris) {
  if (/Failed Tests/.test(baris)) sembunyikan = true;
  if (/Test Files/.test(baris)) sembunyikan = false;
  if (!sembunyikan) process.stdout.write(baris + '\n');
}

function buatPenyaring() {
  let sisa = '';
  return {
    tulis(chunk) {
      sisa += chunk.toString();
      const baris = sisa.split(/\r?\n/);
      sisa = baris.pop(); // baris terakhir mungkin belum lengkap, simpan dulu
      for (const b of baris) prosesBaris(b);
    },
    selesai() {
      if (sisa) prosesBaris(sisa);
      sisa = '';
    },
  };
}

const penyaringStdout = buatPenyaring();
const penyaringStderr = buatPenyaring();

proc.stdout.on('data', (chunk) => penyaringStdout.tulis(chunk));
proc.stderr.on('data', (chunk) => penyaringStderr.tulis(chunk));

proc.on('close', (code) => {
  penyaringStdout.selesai();
  penyaringStderr.selesai();
  process.exit(code ?? 1);
});
