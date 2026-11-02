// PERTEMUAN 9 — Service Worker dan PWA
//
// Baca SOAL.md untuk urutan levelnya.
// File yang kalian sentuh: manifest.json, app.js, dan sw.js.

// Level 2 — Mendaftarkan service worker
if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('./sw.js')
.then((registration) => {
console.log('Service Worker berhasil didaftarkan:', registration.scope);
})
.catch((error) => {
console.error('Pendaftaran Service Worker gagal:', error);
});
}