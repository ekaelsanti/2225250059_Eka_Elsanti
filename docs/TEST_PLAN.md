# Rencana Pengujian

## 1. Strategi

| Lapisan | Alat | Cakupan | Target |
|---|---|---|---|
| Unit (JavaScript) | Vitest | `apps/web/src/math/`, `src/engine/`, validasi konten (Ajv) | Cakupan baris ≥ 90% untuk `math/` |
| Unit (Python) | pytest (+ test properti dengan `random` ber-seed) | `mathengine/` solver, checker, parser, explainer, units | Cakupan ≥ 90% |
| Vektor uji bersama | pytest **dan** Vitest | `shared/test-vectors/*.json` | 100% identik |
| API | pytest + FastAPI TestClient | `/v1/*` | Semua endpoint |
| Komponen | Vitest + Testing Library | StepRunner, KnownAskedForm, HintSheet, CartesianPlane (interaksi) | Semua fitur Must |
| E2E | Playwright (Chromium, viewport 360×640 & 1280×800) | Alur utama | 5 skenario kritis |
| Perangkat | Android fisik (min. 2: Android 8–9 RAM 2–3 GB, Android 13+) | Performa, sentuh, *offline*, tombol *back* | Checklist §5 |
| Uji kegunaan | Siswa (T1, T3) | Skenario UT-xx | Lihat §6 |

## 2. Unit Test Kritis

| ID | Fungsi | Kasus |
|---|---|---|
| UNIT-01 | `fraction` | `fraction(6,4) = 3/2`; `fraction(3,-6) = -1/2`; `fraction(0,5) = 0/1`; `fraction(1,0)` → throw |
| UNIT-02 | `parseAnswer` | `"3/2"`, `"-7/3"`, `"1,5"`, `"1.5"`, `" -2 "`, `"tak terdefinisi"`; input tidak valid → `null` |
| UNIT-03 | `slopeFromPoints` | (1,2),(4,5) → 1; (−1,4),(2,−2) → −2; (0,1),(4,4) → 3/4; (2,1),(2,5) → `'undefined'`; (1,3),(5,3) → 0; urutan titik dibalik → hasil sama |
| UNIT-04 | `classifyError` | Tiap `ErrorType` di [CONTENT_SPEC §8](CONTENT_SPEC.md) minimal 2 kasus; jawaban benar tidak pernah diklasifikasikan sebagai error |
| UNIT-05 | `slopeFromEquation` | `y=2x+1` → 2; `y=3−2x` → −2; `2y=4x+6` → 2; `3x+2y−6=0` → −3/2; `x=4` → `'undefined'` |
| UNIT-06 | `hintEngine` | Level berurutan 1→3; *template* terisi; *fading cap* setelah 2 soal tanpa *hint* |
| UNIT-07 | `generator` | 1000 *seed* per level: memenuhi batasan level, Δx ≠ 0, titik dalam rentang, deterministik untuk *seed* sama |
| UNIT-08 | `perpendicularSlope` | 2 → −1/2; −3/4 → 4/3; 0 → `'undefined'` |
| UNIT-09 | Validasi konten | Semua JSON di `content/generated/` dan `content/modules/` lolos Ajv terhadap `shared/schemas/` |
| UNIT-10 | `modelCheck` (JS) | Bentuk setara diterima; `RATE_INITIAL_SWAP`, `MISSING_INITIAL`, `SIGN_DIRECTION` terdeteksi sesuai vektor bersama |

## 2b. Test Python (mesin pemodelan)

| ID | Modul | Kasus |
|---|---|---|
| PY-01 | `linear.py` | Operasi `Rational` eksak; `c = y1 − m·x1`; tidak ada `float` di hasil |
| PY-02 | `solver.py` | Setiap jenis tugas T1–T10 minimal 3 kasus, misalnya T2 ojek (m = 2500, c = 5000, x = 8 → 25.000); T8 invers (y = 30.000 → x = 10); T6 bensin (m = −1/20 L/km, c = 40 → habis di x = 800); T9 dua paket (titik potong); T7 ramp (1/12 → 8⅓%) |
| PY-03 | `checker.py` | Setiap `errorType` di MODELING_ENGINE §7 minimal 2 kasus; bentuk setara diterima (`y = 5000 + 2500x`, `2500x − y + 5000 = 0`) |
| PY-04 | `checker.py` (variabel) | `VAR_ROLE_SWAP` terdeteksi; satuan dibandingkan setelah konversi |
| PY-05 | `parser/` | Korpus ≥ 100 soal berlabel: akurasi ≥ 85%; **0 kasus salah dengan status `ok`** (kasus ragu harus `needs_confirmation`); angka Indonesia (`Rp12.000`, `2,5`, "setengah") |
| PY-06 | `cli build-content` | Seluruh YAML valid; setiap soal memiliki solusi, 3 *hint* per langkah, anotasi; hasil deterministik (dua kali build → *hash* sama) |
| PY-07 | `explainer.py` | Setiap langkah ≤ 25 kata per kalimat; micro-step untuk operasi negatif dan pembagian |
| PY-08 | *property-based* (2.000 kasus acak ber-seed) | Untuk m, c, x acak: `predict` lalu `inverse` mengembalikan x semula; `solve(two_points)` konsisten dengan `slopeFromPoints` |
| API-01 | `api.py` | `/v1/parse` 200 untuk soal valid; 422 untuk teks > 1.000 karakter; tidak ada log isi permintaan; CORS terbatas |
| VEC-01 | Vektor bersama | `fraction`, `slopeFromPoints`, `modelCheck`, `classifyError` memberi output identik di JS dan Python |

## 3. E2E (Playwright)

| ID | Skenario |
|---|---|
| E2E-01 | Buka pertama kali → onboarding 4 layar → Beranda; buka ulang → langsung Beranda |
| E2E-02 | M4: kerjakan soal dua titik dengan jawaban Δy salah tanda → umpan balik `SIGN_ERROR` → perbaiki → selesai → Cek di Grafik ✔ |
| E2E-03 | Buka *hint* L1→L3 → "Tunjukkan jawaban" → soal ditandai "dibantu" |
| E2E-04 | Mode peneliti: isi kode S99 → kerjakan 1 soal → ekspor CSV berisi event dengan `participantCode=S99` |
| E2E-05 | *Offline*: muat aplikasi, putus jaringan, *reload* → modul tetap dapat dibuka |
| E2E-06 | M7 soal ojek: 5 tahap siklus pemodelan; model `y = 5000x + 2500` → umpan balik `RATE_INITIAL_SWAP` → perbaiki → tafsirkan "Rp25.000" → periksa di grafik ✔ |
| E2E-07 | Modelkan Soalku dengan API *mock*: respons `needs_confirmation` → pengguna memilih peran angka → masuk siklus pemodelan; tanpa jaringan → pesan *offline* |

## 4. Pemeriksaan Aturan Desain (otomatis)

- Tidak ada warna *hex* di `src/components` dan `src/features` (skrip *grep* di CI).
- Tidak ada `setTimeout`/`setInterval` untuk navigasi langkah (*grep* + *review*).
- Linter konten: kalimat ≤ 25 kata, ≤ 3 kalimat per *chunk*.
- Uji kontras token warna (skrip menghitung rasio kontras dari `tokens.js`).

## 5. Checklist Perangkat Android

- [ ] Pemasangan APK berhasil di Android 8 dan 13+
- [ ] Muat awal ≤ 3 detik
- [ ] *Drag* titik grafik halus (tanpa *lag* terasa) di ponsel RAM 2–3 GB
- [ ] Tombol *back* Android = langkah sebelumnya; konfirmasi keluar modul
- [ ] *Keypad* angka menampilkan tanda minus dan pecahan
- [ ] Berfungsi dalam *airplane mode*
- [ ] Ekspor data melalui *share sheet* (WhatsApp/Drive/File)
- [ ] Rotasi layar tidak menghilangkan isian
- [ ] Ukuran huruf sistem "Besar" tidak merusak tata letak

## 6. Skenario Uji Kegunaan (UT)

Setiap skenario dilakukan dengan *think-aloud*. Fasilitator **tidak** membantu kecuali siswa benar-benar macet lebih dari 2 menit. Catat: berhasil/tidak, waktu, bantuan yang dipakai, ucapan penting.

| ID | Fitur | Tugas untuk siswa | Berhasil jika |
|---|---|---|---|
| UT-01 | F-01 | "Buka aplikasi ini untuk pertama kali." Tanyakan perasaan (emoji) | Siswa menyelesaikan onboarding; respons netral/positif |
| UT-02 | F-02 | "Pelajari contoh ini, lalu kerjakan soal berikutnya." | Soal berikut benar dengan langkah serupa |
| UT-03 | F-03 | Setelah *recap*: "Tunjukkan sumbu x dan titik (3, 2)." | Benar tanpa melihat lagi |
| UT-04 | F-04 | Soal A(−1, 4), B(2, −2) | m = −2 benar (bantuan boleh) |
| UT-05 | F-05 | Isi bagian "Diketahui" untuk soal dua titik | x, y diambil dari titik yang sama |
| UT-06 | F-06 | "Apa arti gradien 2/3 pada grafik ini?" | Menyebut "jalan 3, naik 2" atau setara |
| UT-07 | F-07 | "Kalau m = −3, garisnya ke mana?" sebelum menggeser slider | Tebakan benar |
| UT-08 | F-08 | "Berapa m dan c dari y = 4 − 3x?" | m = −3, c = 4 |
| UT-09 | F-09 | Baca 3 *chunk* M4 lalu ceritakan isinya | Menyebut poin inti tanpa terlihat bingung |
| UT-10 | F-10 | Kerjakan 1 soal dari awal sampai akhir | Tidak bingung "langkah berikutnya apa" |
| UT-11 | F-11 | "Apa arti warna biru dan oranye?" | Menghubungkan warna dengan titik 1/2 |
| UT-12 | F-12 | "Apakah kamu merasa terburu-buru?" | Menjawab tidak |
| UT-13 | F-13 | Soal cerita: "Apa yang ditanyakan?" | Menemukan dalam < 30 detik |
| UT-14 | F-14 | "Gambar garis melalui (0,1) dengan gradien 2, lalu jelaskan." | Benar + alasan "naik 2 jalan 1" |
| UT-15 | F-15 | Beri jawaban salah yang sudah disiapkan → minta cek di grafik | Siswa menyadari dan memperbaiki |
| UT-16 | F-16 | Soal L4 | Catat level *hint* maksimum |
| UT-17 | F-17 | Jawab prompt refleksi | Skor rubrik ≥ 2 |
| UT-18 | F-18 | Soal baru tipe berbeda; amati penggunaan contoh analog | Menerapkan langkah dari contoh |
| UT-19 | F-19 | Selesaikan satu set latihan M4 | Skor ≥ 70% |
| UT-20 | F-20 | Soal dengan `−3 − (−5)` | Δ benar; amati pemakaian micro-step |
| UT-21 | F-21 | Tanya: "Apakah bantuannya mengganggu?" | Tidak mengganggu; siswa tahu letak bantuan |
| UT-24 | F-24 | Kerjakan soal cerita T2 dari awal sampai akhir | Selesai tanpa bertanya "sekarang ngapain?" |
| UT-25 | F-25 | "Apa x dan y pada soal ini?" | Benar beserta satuannya |
| UT-26 | F-26 | "Tunjukkan biaya awal di tabel, grafik, dan persamaan." | Menunjuk ketiganya |
| UT-27 | F-27 | Susun model soal tabungan | Benar ≤ 2 percobaan, atau memperbaiki dari umpan balik |
| UT-28 | F-28 | Soal invers T8 | Benar; amati penggunaan penyelesaian lengkap |
| UT-29 | F-29 | Tuliskan arti jawaban; jawab pertanyaan kewajaran | Kalimat dengan satuan; alasan masuk akal |
| UT-30 | F-30 | Kerjakan 3 soal konteks berbeda (personal, sosial-budaya, saintifik) | ≥ 2 benar |
| UT-31 | F-31 | Ketik soal dari LKS siswa sendiri | Siswa memahami pertanyaan konfirmasi dan menyelesaikan soal |
| UT-32 | F-32 | Soal berisi istilah "debit" | Siswa membuka kamus dan memakainya |
| UT-33 | F-33 | Buat cerita untuk `y = 3000x + 2000` | Cerita memuat nilai awal dan laju yang benar |

## 7. Kriteria Lulus Rilis

| Rilis | Kriteria |
|---|---|
| v0.1 | UNIT-01–05, PY-01, PY-02 (T1–T3) lulus; E2E-02 lulus; dapat diuji di 1 Android |
| v0.5 | Semua unit, PY-01–07, VEC-01 & E2E-01–06 lulus; checklist perangkat ≥ 80%; tidak ada *bug* kritis |
| v1.0 | Semua di atas + PY-08, API-01, E2E-07 + akurasi parser ≥ 85% + SUS T3 ≥ 68 + temuan kegunaan berprioritas tinggi diperbaiki |

## 8. Pelaporan Bug

Format: **Judul** · Langkah reproduksi · Hasil yang diharapkan · Hasil aktual · Perangkat/peramban · Tangkapan layar · Prioritas (Kritis/Tinggi/Sedang/Rendah).
