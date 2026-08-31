#!/usr/bin/env node
/**
 * Membaca output JSON Jest/Vitest, mengelompokkan test berdasarkan "Level N",
 * lalu menentukan level tertinggi yang HIJAU BERURUTAN dari 1.
 *
 * Sengaja berurutan: Level 8 hijau tapi Level 3 merah TIDAK dihitung sampai 8,
 * karena level dirancang menumpuk. Kalau Level 3 merah, Level 8 kemungkinan
 * hijau karena alasan yang salah.
 *
 * Pemakaian: node ringkas-level.js <file-json> <nama-pertemuan>
 * Keluaran : satu baris JSON ke stdout.
 */
const fs = require('fs');

const [, , fileJson, pertemuan = '?'] = process.argv;

function kosong(catatan) {
  return { pertemuan, tertinggi: 0, total: 0, lulus: 0, catatan };
}

let laporan;
try {
  laporan = JSON.parse(fs.readFileSync(fileJson, 'utf8'));
} catch {
  console.log(JSON.stringify(kosong('hasil test tidak terbaca')));
  process.exit(0);
}

const level = new Map(); // nomor -> { total, lulus }

for (const berkas of laporan.testResults || []) {
  for (const t of berkas.assertionResults || []) {
    const cocok = /Level\s+(\d+)/i.exec(t.title || t.fullName || '');
    if (!cocok) continue;
    const n = Number(cocok[1]);
    if (!level.has(n)) level.set(n, { total: 0, lulus: 0 });
    const l = level.get(n);
    l.total += 1;
    if (t.status === 'passed') l.lulus += 1;
  }
}

if (level.size === 0) {
  console.log(JSON.stringify(kosong('tidak ada test bernama "Level N"')));
  process.exit(0);
}

let tertinggi = 0;
for (const n of [...level.keys()].sort((a, b) => a - b)) {
  const l = level.get(n);
  if (l.lulus === l.total) tertinggi = n;
  else break; // berhenti di level merah pertama
}

console.log(
  JSON.stringify({
    pertemuan,
    tertinggi,
    total: laporan.numTotalTests || 0,
    lulus: laporan.numPassedTests || 0,
    catatan: '',
  }),
);
