# Mesin Matematika GradieKAn (Python)

Parser, solver, pemeriksa jawaban, dan pembangun bank soal cerita. Spesifikasi lengkap: [docs/MODELING_ENGINE.md](../../docs/MODELING_ENGINE.md).

## Persiapan

```bash
cd services/math-engine
python -m venv .venv
.venv\Scripts\activate          # Windows PowerShell  (macOS/Linux: source .venv/bin/activate)
pip install -e ".[dev]"
```

## Perintah

| Perintah | Fungsi |
|---|---|
| `python -m mathengine build-content` | YAML di `content/problems/` → JSON di `apps/web/src/content/generated/` |
| `python -m mathengine validate --strict` | Cek semua soal tanpa menulis file |
| `python -m mathengine export-schemas` | Pydantic → JSON Schema di `shared/schemas/` |
| `python -m mathengine parse "teks soal"` | Coba parser soal cerita |
| `uvicorn mathengine.api:app --reload` | API di http://localhost:8000/docs |
| `pytest -q` | Semua test |
| `ruff check .` | Lint |

## Struktur

| Modul | Isi |
|---|---|
| `numfmt.py` | Pecahan eksak & format angka Indonesia ("Rp12.000", "1,5") |
| `units.py` | Satuan & konversi |
| `schemas.py` | Model data Pydantic (sumber tunggal skema) |
| `linear.py` | Model `y = mx + c`: dari titik, naik/mendatar, prediksi, invers, titik potong |
| `solver.py` + `explainer.py` | Penyelesaian T1–T10 dengan langkah 5 tahap, micro-step, dan 3 tingkat *hint* |
| `checker.py` | Diagnosis jawaban siswa (`RATE_INITIAL_SWAP`, `SIGN_DIRECTION`, …) |
| `parser/` | Soal cerita bahasa Indonesia → model (berbasis aturan; bertanya jika ragu) |
| `content.py` | Pembangun bank soal + variasi angka + anotasi Diketahui/Ditanya/pengecoh |
| `cli.py`, `api.py` | Antarmuka baris perintah & FastAPI |

## Catatan

- Semua hitungan memakai pecahan eksak (`fractions.Fraction`; SymPy untuk persamaan siswa), bukan desimal.
- Test properti memakai perulangan acak ber-*seed* dari pustaka standar. Pustaka `hypothesis` tidak dipakai karena DLL bawaannya diblokir oleh Windows Smart App Control di laptop pengembang.
