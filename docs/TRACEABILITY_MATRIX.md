# Matriks Keterlacakan (*Traceability Matrix*)

Dokumen ini menghubungkan setiap temuan wawancara ke fitur, *user story*, cara uji, dan data yang dicatat. Tujuannya agar setiap keputusan desain dapat dipertanggungjawabkan secara akademis dan setiap fitur dapat dievaluasi.

**Cara membaca:** Kode → Interpretasi → Fitur (F-xx) → User Story (US-xx) → Indikator Uji (dari Matriks Analisis laporan) → Event Log (lihat [ANALYTICS_RESEARCH_PLAN.md](ANALYTICS_RESEARCH_PLAN.md)) → Test Case (lihat [TEST_PLAN.md](TEST_PLAN.md)).

## Matriks Utama

| Kode | Interpretasi (CLT) | Fitur | US | Indikator uji | Event log utama | Test |
|---|---|---|---|---|---|---|
| K01 | *Scaffolding* pengenalan awal | **F-01** Onboarding Bertahap | US-01 | Amati kecemasan/respons siswa saat pertama membuka aplikasi | `onboarding_step`, `onboarding_complete`, `onboarding_skip` | UT-01 |
| K02 | Penyampaian visual & terstruktur | **F-02** Contoh Bergambar Step-by-Step | US-02 | Siswa menyelesaikan latihan setelah melihat contoh visual | `example_step_view`, `example_complete` | UT-02 |
| K03 | Penguatan skema memori (*recall*) | **F-03** Quick Recap | US-03 | Uji ingatan komponen grafik setelah *recap* | `recap_open`, `recap_quiz_answer` | UT-03 |
| IL01 | Prasyarat & interaktivitas | **F-04** Scaffolding Aritmetika Negatif + Validasi Otomatis | US-04 | Kemampuan menyelesaikan soal dengan nilai negatif | `answer_submit{error_type=SIGN_ERROR}`, `integer_helper_open` | UT-04, UNIT-03 |
| IL02 | Pemetaan variabel rumus | **F-05** Input Known/Asked Berwarna | US-05 | Apakah siswa masih salah memasukkan koordinat | `answer_submit{error_type=SWAP_POINTS\|MIXED_ORDER}` | UT-05, UNIT-04 |
| IL03 | Beban prosedural pecahan | **F-06** Visualisasi Rise over Run | US-06 | Siswa menjelaskan arti gradien pecahan setelah melihat grafik | `riserun_toggle`, `reflection_submit{context=fraction}` | UT-06 |
| IL04 | Konsep arah & tanda | **F-07** Slider m Real-time | US-07 | Siswa menebak arah garis dari nilai m | `slider_change`, `direction_guess` | UT-07 |
| IL05 | Pengenalan pola persamaan | **F-08** Perbandingan Persamaan Side-by-side | US-08 | Kecepatan & ketepatan identifikasi m dan c | `identify_mc_answer{duration_ms}` | UT-08 |
| EL01 | Penyajian membebani | **F-09** Chunking + Penanda Info Penting | US-09 | Amati kebingungan (*overload*) saat membaca | `step_view{duration_ms}`, `step_back`, `self_rating` | UT-09 |
| EL02 | Pemisahan sumber informasi | **F-10** Alur Step-by-Step Input | US-10 | Kejelasan alur pengerjaan soal | `step_complete`, `step_back` | UT-10 |
| EL03 | Visual penarik perhatian | **F-11** Skema Warna Konsisten | US-11 | Warna membantu penyorotan atau mengganggu | (kuesioner) `self_rating`, SUS | UT-11 |
| EL04 | Penyampaian terarah | **F-12** Navigasi Self-paced + Poin Inti | US-12 | Mengikuti materi tanpa merasa terburu-buru | `step_view{duration_ms}`, `keypoint_open` | UT-12 |
| EL05 | Penyajian bahasa membebani | **F-13** Auto-highlight Diketahui/Ditanya | US-13 | Menemukan data relevan tanpa petunjuk | `highlight_toggle`, `known_asked_correct` | UT-13 |
| GL01 | Interaktivitas penguatan konsep | **F-14** Bidang Kartesius Interaktif | US-14 | Siswa menggambar grafik dan menjelaskan alasannya | `graph_drag`, `graph_task_submit` | UT-14 |
| GL02 | Refleksi & pemahaman visual | **F-15** Visual Validation ("Cek di Grafik") | US-15 | Siswa mendeteksi kesalahan sendiri via grafik | `visual_validation_used`, `self_correction` | UT-15 |
| GL03 | Bantuan pembentukan skema | **F-16** Fading Hints | US-16 | Jumlah tingkat *hint* yang diperlukan | `hint_open{level}` | UT-16, UNIT-06 |
| GL04 | Elaborasi/penalaran | **F-17** "Jelaskan Langkahmu" | US-17 | Kualitas penjelasan sebelum vs sesudah | `reflection_submit{text}` | UT-17 |
| GL05 | Transfer & analogi | **F-18** Tombol "Contoh Analog" | US-18 | Menerapkan strategi contoh ke soal baru | `analog_example_open`, `answer_submit` sesudahnya | UT-18 |
| DS01 | Ekspektasi bantuan siswa | **F-19** Latihan Terintegrasi Contoh Visual | US-19 | Pemahaman setelah menggunakan contoh visual | `practice_complete{score}` | UT-19 |
| DS02 | Pengurangan kesalahan teknis | **F-20** Micro-step Hitung + Tooltip Peringatan | US-20 | Penurunan kesalahan aritmetika | `microstep_open`, `sign_warning_shown`, `answer_submit{error_type}` | UT-20, UNIT-03 |
| DS03 | Personalisasi fleksibel | **F-21** Bantuan Opsional On-demand | US-21 | Frekuensi bantuan: siswa mahir vs lambat | semua event `*_open` | UT-21 |

## Fitur Pendukung Riset (tanpa kode wawancara)

| Fitur | US | Tujuan |
|---|---|---|
| **F-22** Mode Peneliti & Ekspor Data | US-22 | Mengisi kode peserta; ekspor log CSV/JSON |
| **F-23** Ringkasan Progres | US-23 | Melihat modul yang selesai dan akurasi per modul |

## Fitur Literasi Matematika & Pemodelan

Fitur ini berasal dari **tujuan pengembang** (literasi matematika dan pemodelan soal cerita) dan didukung temuan wawancara terkait. Indikator LM-x ada di [MATH_LITERACY §7](MATH_LITERACY.md).

| Fitur | US | Tahap pemodelan | Indikator | Kode wawancara pendukung | Event utama | Test |
|---|---|---|---|---|---|---|
| **F-24** Siklus Pemodelan Terpandu | US-24 | Semua | LM-1–7 | EL01, K01, EL04 | `modeling_stage_*` | UT-24, E2E-06 |
| **F-25** Penentu Variabel & Satuan | US-25 | Rumuskan | LM-2 | IL02 | `variable_define` | UT-25, PY-04 |
| **F-26** Representasi Ganda | US-26 | Rumuskan/Periksa | LM-8 | EL02, GL01, GL02 | `representation_switch`, `matching_submit` | UT-26 |
| **F-27** Pemeriksa Model | US-27 | Rumuskan | LM-3, LM-4 | GL03 | `model_submit` | UT-27, PY-03, VEC-01 |
| **F-28** Penyelesai & Penjelas | US-28 | Selesaikan | LM-5 | K02, DS02, IL01 | `solve_step_submit`, `full_solution_open` | UT-28, PY-02 |
| **F-29** Tafsirkan & Periksa | US-29 | Tafsirkan/Periksa | LM-6, LM-7 | GL02 | `interpret_submit`, `reasonableness_answer` | UT-29 |
| **F-30** Bank Soal Literasi | US-30 | Semua | LM-1–8 | DS01, GL05 | `wordproblem_*` | UT-30, PY-06 |
| **F-31** Input Soal Bebas | US-31 | Pahami/Rumuskan | LM-1–4 | EL05 | `free_input_*` | UT-31, PY-05, API-01 |
| **F-32** Kamus Konteks | US-32 | Pahami | LM-1 | EL05, EL01 | `glossary_open` | UT-32 |
| **F-33** Buat Soal Ceritaku | US-33 | (kebalikan) | LM-9 | GL04 | `posing_submit` | UT-33 |

Fitur lama yang juga mendukung literasi: F-13 Sorot Diketahui/Ditanya (LM-1), F-15 Cek di Grafik (LM-7), F-17 Jelaskan Langkahmu (LM-9), dan F-18 Contoh Analog (transfer antarkonteks).

## Pemetaan Balik: Prinsip Desain → Fitur

| Prinsip ([RESEARCH_SYNTHESIS §5](RESEARCH_SYNTHESIS.md)) | Fitur |
|---|---|
| P1 Gambar dulu, rumus kemudian | F-02, F-03, F-06, F-19 |
| P2 Satu langkah per layar | F-09, F-10 |
| P3 Warna konsisten | F-05, F-11 |
| P4 Hitung pelan | F-04, F-20 |
| P5 Selalu bisa dicek di grafik | F-14, F-15 |
| P6 Bantuan bertingkat, opsional, memudar | F-16, F-18, F-21 |
| P7 Tanpa tekanan waktu | F-12 |
| P8 Siswa membuat | F-14, F-17 |
| P9 Contoh serupa terjangkau | F-18, F-19 |

## Pemetaan Fitur → Modul Konten

| Modul ([CONTENT_SPEC](CONTENT_SPEC.md)) | Fitur utama yang aktif |
|---|---|
| M0 Cek Prasyarat | F-04, F-14, F-21 |
| M1 Apa itu Kemiringan | F-01, F-09, F-12 |
| M2 Gradien dari Grafik | F-06, F-14, F-02 |
| M3 Arah Gradien | F-07, F-14 |
| M4 Gradien dari Dua Titik | F-05, F-10, F-20, F-15, F-16, F-18 |
| M5 Gradien dari Persamaan | F-08, F-13, F-15 |
| M6 Sejajar & Tegak Lurus | F-07, F-14, F-15, F-17 |
| M7 Pemodelan Soal Cerita | F-24–F-30, F-32, F-13, F-15, F-16, F-18, F-20 |
| M8 Membandingkan Dua Model | F-24, F-26–F-29, F-17, F-33 |
| Modelkan Soalku | F-31, F-24 |
| Latihan Campuran | F-19, F-16, F-18, F-17, F-30 |
