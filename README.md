# GradieKAn: Belajar Gradien, Literasi, dan Pemodelan Soal Cerita

> Nama aplikasi: **GradieKAn**. Nama ini juga dipakai untuk file APK, judul PWA, dan `capacitor.config.json`.

Aplikasi belajar matematika untuk siswa SMP (Kelas VIII, Kurikulum Merdeka Fase D) dengan tiga tujuan:

1. **Memahami kemiringan (gradien) garis lurus** dengan beban kognitif yang terkelola.
2. **Menumbuhkembangkan literasi matematika** (PISA 2022 & AKM Numerasi).
3. **Memodelkan berbagai soal cerita** menjadi model matematika `y = mx + c`, menyelesaikannya, lalu menafsirkan dan memeriksa hasilnya.

Desain aplikasi berpijak pada **Cognitive Load Theory**. Setiap fitur dapat dilacak ke temuan wawancara siswa (kode IL/EL/GL/K/DS) atau ke indikator literasi (LM-1 s.d. LM-9).

| | |
|---|---|
| **Platform** | Web (PWA) dan Android (APK lewat Capacitor) |
| **Bahasa pemrograman** | **JavaScript** (aplikasi: React + Vite) dan **Python** (mesin matematika & pemodelan: SymPy + FastAPI) |
| **Mode** | *Offline-first*, tanpa akun; hanya fitur "Modelkan Soalku" yang membutuhkan internet |
| **Status** | Tahap perencanaan; belum ada kode |

## Peta Dokumen

| Dokumen | Untuk apa |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Panduan kerja Claude Code / pengembang: stack, perintah, struktur, aturan desain wajib |
| [docs/PRD.md](docs/PRD.md) | Kebutuhan produk: masalah, tujuan, persona, *user stories*, prioritas |
| [docs/RESEARCH_SYNTHESIS.md](docs/RESEARCH_SYNTHESIS.md) | Sintesis wawancara dan landasan teori beban kognitif |
| [docs/MATH_LITERACY.md](docs/MATH_LITERACY.md) | Kerangka literasi matematika, siklus pemodelan 5 tahap, jenis soal cerita T1–T10, rubrik |
| [docs/MODELING_ENGINE.md](docs/MODELING_ENGINE.md) | Spesifikasi mesin pemodelan Python: parser, solver, checker, API |
| [docs/TRACEABILITY_MATRIX.md](docs/TRACEABILITY_MATRIX.md) | Jejak temuan/indikator → fitur → *user story* → uji |
| [docs/FEATURES.md](docs/FEATURES.md) | Spesifikasi rinci fitur F-01 s.d. F-33 |
| [docs/CONTENT_SPEC.md](docs/CONTENT_SPEC.md) | Tujuan pembelajaran, modul M0–M8, format konten, miskonsepsi |
| [docs/UX_UI_GUIDELINES.md](docs/UX_UI_GUIDELINES.md) | Prinsip tampilan, warna, tipografi, aksesibilitas, *wireframe* |
| [docs/INFORMATION_ARCHITECTURE.md](docs/INFORMATION_ARCHITECTURE.md) | Peta layar dan alur navigasi |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arsitektur JavaScript + Python, model data, keputusan teknis (ADR) |
| [docs/ANALYTICS_RESEARCH_PLAN.md](docs/ANALYTICS_RESEARCH_PLAN.md) | Data yang dicatat, desain uji coba, instrumen, etika |
| [docs/TEST_PLAN.md](docs/TEST_PLAN.md) | Strategi pengujian JS, Python, E2E, dan uji kegunaan |
| [docs/ROADMAP.md](docs/ROADMAP.md) | *Milestone* dan *checklist* pengerjaan |
| [docs/GLOSSARY.md](docs/GLOSSARY.md) | Daftar istilah |

**Urutan baca yang disarankan:** RESEARCH_SYNTHESIS → MATH_LITERACY → PRD → TRACEABILITY_MATRIX → FEATURES → CONTENT_SPEC → UX_UI_GUIDELINES → ARCHITECTURE → MODELING_ENGINE → ROADMAP.

## Sumber Data Riset

- Laporan Hasil Wawancara: siswa S01, kelas 9F, 8 November 2026, 15 menit, dengan persetujuan narasumber. Pewawancara: Eka Elsanti.
- Simpan PDF laporan di `docs/research/LAPORAN_HASIL_WAWANCARA.pdf`. Data identitas atau foto siswa tidak boleh masuk ke repositori publik; cukup gunakan kode siswa (S01).

## Memulai (setelah tahap M0 di ROADMAP selesai)

Prasyarat: Node.js 20+, Python 3.12+, Android Studio (untuk APK).

```bash
npm install                                   # dependensi JavaScript
cd services/math-engine && python -m venv .venv
.venv\Scripts\activate                        # Windows PowerShell
pip install -e ".[dev]" && cd ../..

npm run build:content   # Python: bangun bank soal cerita
npm run dev:web         # aplikasi di http://localhost:5173
npm run dev:api         # API Python di http://localhost:8000/docs
npm run test:all        # semua test JavaScript + Python
npm run build:web && npx cap sync android     # siapkan APK Android
```

## Pemilik

Eka Elsanti (NIM 2225250059, Kelas 3A), mahasiswa.
