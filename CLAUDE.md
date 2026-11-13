# CLAUDE.md

Panduan untuk Claude Code (dan pengembang manusia) saat bekerja di repositori ini. Baca seluruh file ini sebelum menulis kode.

## 1. Tentang Proyek

**GradieKAn** adalah aplikasi belajar matematika untuk siswa SMP Kelas VIII dengan tiga tujuan:
1. Memahami dan menghitung **kemiringan (gradien) garis lurus** (modul M0–M6).
2. **Menumbuhkembangkan literasi matematika** (kerangka PISA 2022 & AKM Numerasi).
3. **Memodelkan berbagai soal cerita** menjadi model matematika `y = mx + c`, menyelesaikannya, dan menafsirkan hasilnya (modul M7–M8).

Aplikasi berjalan di web (PWA) dan Android (Capacitor). Semua desain berpijak pada **Cognitive Load Theory**: kurangi beban yang tidak perlu (EL), kelola kerumitan materi (IL), dan dorong pembentukan skema (GL).

Sumber kebenaran:
- Kebutuhan produk: [docs/PRD.md](docs/PRD.md)
- Spesifikasi fitur: [docs/FEATURES.md](docs/FEATURES.md)
- Literasi & siklus pemodelan: [docs/MATH_LITERACY.md](docs/MATH_LITERACY.md)
- Mesin pemodelan Python: [docs/MODELING_ENGINE.md](docs/MODELING_ENGINE.md)
- Arsitektur: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Konten: [docs/CONTENT_SPEC.md](docs/CONTENT_SPEC.md)
- Tampilan: [docs/UX_UI_GUIDELINES.md](docs/UX_UI_GUIDELINES.md)
- Jejak riset ke fitur: [docs/TRACEABILITY_MATRIX.md](docs/TRACEABILITY_MATRIX.md)

Jika kode dan dokumen bertentangan, ikuti dokumen dan laporkan pertentangannya.

## 2. Bahasa Pemrograman dan Stack

Proyek memakai **dua bahasa**: **JavaScript** dan **Python**.

| Bagian | Bahasa | Teknologi |
|---|---|---|
| Aplikasi siswa `apps/web/` | **JavaScript** (ES2022 + JSX, **bukan TypeScript**) | React 18, Vite, Tailwind CSS, React Router, Zustand, KaTeX, Dexie, Ajv, vite-plugin-pwa, Capacitor 6 |
| Mesin matematika `services/math-engine/` | **Python 3.12** | SymPy, FastAPI, Pydantic v2, Uvicorn |
| Test JS | JavaScript | Vitest, Testing Library, Playwright |
| Test Python | Python | pytest (test properti memakai `random` ber-seed; `hypothesis` diblokir Smart App Control) |
| Kualitas | — | ESLint + Prettier (JS); ruff (Python) |

Pembagian tanggung jawab:
- **Python** adalah acuan kebenaran matematika: menyelesaikan model, memeriksa kesetaraan persamaan, membangun bank soal dan langkah penyelesaian, serta mem-*parse* soal cerita.
- **JavaScript** menangani tampilan, interaksi, grafik, dan pemeriksaan jawaban offline terhadap data hasil Python.
- **Jangan** menulis ulang logika aljabar simbolik di JavaScript. Jika butuh kemampuan baru, tambahkan di Python lalu bangun ulang konten atau panggil API.

## 3. Perintah

Jalankan dari akar repositori (Windows PowerShell atau Git Bash).

```bash
# Persiapan sekali
npm install                                   # dependensi JS (workspace)
cd services/math-engine
python -m venv .venv
.venv\Scripts\activate                        # Git Bash: source .venv/Scripts/activate
pip install -e ".[dev]"
cd ../..

# Harian
npm run build:content    # Python: YAML soal → apps/web/src/content/generated/*.json
npm run dev:web          # aplikasi web di http://localhost:5173
npm run dev:api          # API Python di http://localhost:8000/docs

# Pemeriksaan
npm run test:web         # Vitest
npm run test:e2e         # Playwright
npm run test:py          # pytest (services/math-engine)
npm run lint             # ESLint + ruff
npm run test:all         # semua di atas

# Rilis
npm run build:web
npx cap sync android && npx cap open android
```

Sebelum menyatakan tugas selesai: `npm run lint && npm run test:all`.
Jika mengubah skema Pydantic, jalankan `python -m mathengine.cli export-schemas` lalu `npm run build:content`.

## 4. Struktur Folder (ringkas)

```
apps/web/src/      app/ screens/ features/ components/ math/ engine/ content/ api/ analytics/ store/ styles/
services/math-engine/mathengine/   numfmt.py units.py schemas.py linear.py solver.py explainer.py checker.py parser/ content.py cli.py api.py
scripts/py.mjs     menjalankan Python dari .venv (dipakai skrip npm, lintas OS)
content/problems/  sumber soal cerita (YAML)
shared/schemas/    JSON Schema (dihasilkan) · shared/test-vectors/ kasus uji bersama JS ↔ Python
docs/              dokumen perencanaan
```

Lihat rincian di [docs/ARCHITECTURE.md §2](docs/ARCHITECTURE.md). **Jangan mengedit** `apps/web/src/content/generated/` dan `shared/schemas/` secara manual; keduanya dihasilkan oleh Python.

## 5. Aturan Desain Beban Kognitif (WAJIB)

Kode di dalam kurung menunjuk temuan wawancara.

1. **Satu langkah per layar** (EL01, EL02). Pada soal cerita: **satu tahap siklus pemodelan per layar** (Pahami → Rumuskan → Selesaikan → Tafsirkan → Periksa).
2. **Tidak ada pengatur waktu atau tekanan waktu** (IL05, EL04).
3. **Semua bantuan opsional dan *on-demand*** (DS03). Pengecualian satu-satunya: *tooltip* peringatan tanda negatif (F-20), yang dapat dimatikan.
4. **Warna variabel konsisten** (EL03, IL02). Ambil dari `styles/tokens.js`, jangan tulis kode warna langsung:
   `point1` biru (x₁, y₁) · `point2` oranye (x₂, y₂) · `slope` hijau (m / laju) · `intercept` ungu (c / nilai awal) · `rise` magenta (Δy) · `run` sian (Δx).
   Pada soal cerita, **laju = hijau** dan **nilai awal = ungu**, baik di teks, tabel, grafik, maupun persamaan.
5. **Warna tidak boleh menjadi satu-satunya pembeda.** Selalu sertakan label.
6. **Setiap hasil bisa diperiksa di grafik/tabel** (GL02).
7. **Gambar/situasi dulu, rumus kemudian** (K02, EL02).
8. **Kalimat pendek**, maksimal ± 25 kata per kalimat instruksi. Teks soal cerita boleh lebih panjang sesuai level konteks (K-A s.d. K-D), tetapi harus memiliki anotasi untuk Sorot Info (F-13).
9. **Umpan balik spesifik dan ramah.** Gunakan `errorType` dari `classifyError` (JS) atau `Diagnosis` (Python). Jangan pernah menampilkan sekadar "Salah!".
10. **Jawaban soal cerita harus ditafsirkan** dengan kalimat dan satuan (tahap Tafsirkan), bukan hanya angka.

## 6. Konvensi Kode

### Umum
- Nama kode, variabel, *commit* dalam **bahasa Inggris**. Teks untuk siswa dalam **bahasa Indonesia** dan disimpan di `strings.id.js` atau berkas konten, bukan ditulis langsung di komponen.
- Setiap fitur diberi komentar ID di file utamanya, mis. `// F-27 Pemeriksa Model (literasi: Rumuskan)`.

### JavaScript
- Komponen fungsi, file `PascalCase.jsx`; *hook* berawalan `use`; modul lain `camelCase.js`.
- Gunakan **JSDoc** untuk mendeskripsikan bentuk data dan fungsi publik. File di `src/math/` diberi `// @ts-check`.
- Matematika eksak: gradien/laju sebagai `{num, den}`. Jangan membandingkan jawaban dengan desimal.
- Fungsi di `src/math/` harus murni dan memiliki unit test.
- Setiap interaksi penting memanggil `track()` dari `src/analytics/events.js`.
- Data dari `content/generated/` dan respons API divalidasi dengan Ajv terhadap `shared/schemas/`.

### Python
- Ikuti PEP 8 (ditegakkan oleh ruff); beri *type hints* di semua fungsi publik.
- Gunakan pecahan eksak (`fractions.Fraction`; SymPy untuk membaca persamaan siswa), jangan `float`, untuk semua hitungan.
- Pydantic adalah satu-satunya definisi skema; jangan menduplikasi struktur di tempat lain.
- Parser harus mengembalikan `needs_confirmation` saat ragu, **jangan menebak**.
- Teks penjelasan yang dihasilkan `explainer.py` memakai gaya bahasa yang sama dengan [CONTENT_SPEC §9](docs/CONTENT_SPEC.md).
- Setiap fungsi solver/checker/parser memiliki test pytest; tambahkan kasus baru ke `shared/test-vectors/` jika perilakunya juga diimplementasikan di JS.

## 7. Larangan

- Jangan menambah *login* atau mengirim data siswa ke server. API hanya menerima teks soal/model, **tanpa** kode peserta.
- Jangan menyimpan nama asli siswa; gunakan kode peserta (mis. `S01`).
- Jangan menambah AI generatif/LLM tanpa persetujuan eksplisit (lihat ADR-08).
- Jangan menambah animasi dekoratif, suara yang berbunyi tanpa aksi siswa, atau *leaderboard*.
  **Pengecualian yang disetujui pemilik proyek (12 Nov 2026):**
  - konfeti singkat (± 1,5 detik) hanya saat menyelesaikan bab materi atau soal cerita (`src/app/celebrate.js`);
  - efek suara lembut sebagai umpan balik aksi siswa: "ting" benar, nada turun pelan untuk salah (bukan "tetot", K01), dan klik slider (`src/app/sound.js`).
  Keduanya wajib bisa dimatikan di Pengaturan, dan konfeti dilewati bila `prefers-reduced-motion`. Jangan menambah perayaan di setiap jawaban benar (menjaga EL).
- Jangan membuat fitur inti yang bergantung pada internet; fitur online harus memiliki pesan *fallback* offline.
- Jangan menambah dependensi besar tanpa mencatat ADR di [docs/ARCHITECTURE.md §8](docs/ARCHITECTURE.md).

## 8. Definition of Done

- [ ] Perilaku sesuai spesifikasi F-xx di `docs/FEATURES.md`, termasuk kasus tepi.
- [ ] Aturan desain di bagian 5 dipatuhi.
- [ ] Test lulus: Vitest untuk JS, pytest untuk Python; vektor uji bersama lulus di kedua bahasa.
- [ ] Event analytics terkait tercatat.
- [ ] Berfungsi di layar 360×640 dan 1280×800, dengan sentuhan (target ≥ 48 dp).
- [ ] Fitur inti berfungsi dalam keadaan offline.
- [ ] `npm run lint && npm run test:all` lulus.
- [ ] Checklist di `docs/ROADMAP.md` diperbarui.
