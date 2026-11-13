# Rencana Analitik dan Riset

Dokumen ini menjelaskan **data apa yang dicatat aplikasi**, bagaimana data itu menjawab kolom "Cara Menguji Fitur" pada Matriks Analisis, serta rancangan uji coba dengan siswa.

## 1. Pertanyaan Riset (usulan)

1. **RQ1 (Kegunaan):** Seberapa mudah aplikasi digunakan siswa SMP dan fitur mana yang paling sering dipakai?
2. **RQ2 (Beban kognitif):** Bagaimana persepsi beban kognitif (IL, EL, GL) siswa saat belajar gradien menggunakan aplikasi?
3. **RQ3 (Hasil belajar):** Apakah terjadi peningkatan kemampuan menentukan gradien setelah menggunakan aplikasi?
4. **RQ4 (Kemandirian):** Apakah ketergantungan pada bantuan (*hint*) menurun seiring latihan?
5. **RQ5 (Literasi):** Apakah terjadi peningkatan literasi matematika siswa (soal bergaya AKM) setelah menggunakan aplikasi?
6. **RQ6 (Pemodelan):** Tahap siklus pemodelan mana (Pahami, Rumuskan, Selesaikan, Tafsirkan, Periksa) yang paling sulit bagi siswa, dan apakah kemampuan pemodelan meningkat?

## 2. Tahapan Uji Coba

| Tahap | Peserta | Tujuan | Instrumen |
|---|---|---|---|
| T1 Uji kegunaan formatif (prototipe v0.1) | 3–5 siswa kelas VIII/IX | Menemukan masalah UI; validasi tema riset | *Think-aloud*, observasi, SUS, wawancara singkat |
| T2 Validasi ahli | 2–3 ahli (materi, media) | Kelayakan materi & media | Lembar validasi ahli (skala Likert) |
| T3 Uji coba terbatas (v0.5) | 8–15 siswa | Kepraktisan & revisi | SUS, kuesioner beban kognitif, log aplikasi |
| T4 Uji efektivitas (v1.0) | 1 kelas (± 30 siswa) | RQ2–RQ4 | Pretest–posttest, kuesioner beban kognitif, log aplikasi |

Desain T4 yang disarankan: *one-group pretest–posttest*, atau dua kelompok (aplikasi vs pembelajaran biasa) jika sekolah mengizinkan. Model pengembangan dapat mengikuti ADDIE atau 4D sesuai ketentuan program studi.

**Tambahan untuk T1 (soal cerita):** siswa mengerjakan 2 soal cerita di §2b sambil *think-aloud*. Tujuannya memvalidasi kebutuhan literasi dan pemodelan yang belum tergali pada wawancara awal.

## 2b. Soal Think-aloud Soal Cerita (Uji Kegunaan T1)

**Prosedur (± 20 menit per siswa)**
1. Jelaskan: "Kerjakan sambil mengucapkan apa yang kamu pikirkan. Tidak ada jawaban yang salah tentang cara berpikirmu."
2. Berikan Soal 1 di kertas (tanpa aplikasi) dan rekam suara dengan izin. Fasilitator hanya berkata "Terus, apa yang kamu pikirkan?" bila siswa diam lebih dari 10 detik.
3. Berikan Soal 2 dengan prosedur yang sama.
4. Lakukan wawancara singkat (pertanyaan di akhir bagian ini).
5. Nilai dengan rubrik pemodelan ([MATH_LITERACY §8](MATH_LITERACY.md)) dan isi lembar observasi.

### Soal 1: Ojek ke Sekolah
*Jenis T2 + T8 (laju + nilai awal, invers) · Konteks personal · Level konteks K-B · Penerapan → Penalaran*

> Tarif ojek daring di kota Dimas adalah Rp4.000 untuk biaya awal, ditambah Rp2.500 setiap kilometer. Jarak rumah Dimas ke sekolah 6 km.
> a. Tuliskan model matematika yang menyatakan hubungan biaya dengan jarak tempuh.
> b. Berapa biaya yang harus dibayar Dimas untuk pergi ke sekolah?
> c. Suatu hari Dimas hanya membawa uang Rp24.000. Paling jauh berapa kilometer Dimas dapat naik ojek?

**Kunci jawaban**

| Bagian | Jawaban | Tahap |
|---|---|---|
| Variabel | x = jarak tempuh (km), y = biaya (rupiah) | Rumuskan |
| a | `y = 2.500x + 4.000` (m = 2.500 rupiah/km, c = 4.000 rupiah) | Rumuskan |
| b | y = 2.500 × 6 + 4.000 = 15.000 + 4.000 = **Rp19.000** | Selesaikan, Tafsirkan |
| c | 24.000 = 2.500x + 4.000 → 20.000 = 2.500x → x = **8 km** | Selesaikan (invers), Tafsirkan |
| Periksa | Cek: 2.500 × 8 + 4.000 = 24.000 ✔; jarak 8 km masuk akal untuk ojek | Periksa |

**Yang diamati:** apakah siswa memisahkan biaya awal dari biaya per km; kesalahan khas `RATE_INITIAL_SWAP` (y = 4.000x + 2.500), `MISSING_INITIAL` (y = 2.500x), atau menjawab bagian c dengan 24.000 ÷ 2.500 = 9,6 km (lupa mengurangi biaya awal); apakah jawaban ditulis dengan satuan.

### Soal 2: Bensin Motor Pak Wayan
*Jenis T6 (laju menurun, m pecahan negatif) + evaluasi domain · Konteks personal/saintifik · Level konteks K-C (ada informasi pengecoh) · Penerapan → Penalaran*

> Pukul 07.00 Pak Wayan berangkat dari Denpasar dengan sepeda motor. Saat berangkat, tangki motornya berisi 4 liter bensin. Motor itu menghabiskan 1 liter bensin setiap menempuh 40 km. Harga bensin di Denpasar Rp10.000 per liter.
> a. Tuliskan model matematika yang menyatakan sisa bensin terhadap jarak yang ditempuh.
> b. Berapa liter sisa bensin setelah Pak Wayan menempuh 100 km?
> c. Setelah menempuh berapa kilometer bensinnya habis?
> d. Apakah model ini masih dapat dipakai untuk menghitung sisa bensin setelah 200 km? Jelaskan alasanmu.

**Kunci jawaban**

| Bagian | Jawaban | Tahap |
|---|---|---|
| Pahami | Informasi **pengecoh**: pukul 07.00, "Denpasar", dan harga bensin Rp10.000 per liter tidak diperlukan | Pahami |
| Variabel | x = jarak tempuh (km), y = sisa bensin (liter) | Rumuskan |
| a | `y = −(1/40)x + 4` (m = −1/40 liter/km karena bensin **berkurang**; c = 4 liter) | Rumuskan |
| b | y = −(1/40) × 100 + 4 = −2,5 + 4 = **1,5 liter** | Selesaikan, Tafsirkan |
| c | 0 = −(1/40)x + 4 → (1/40)x = 4 → x = **160 km** | Selesaikan (invers) |
| d | **Tidak.** Untuk x = 200 hasilnya y = −1 liter. Sisa bensin tidak mungkin negatif; bensin sudah habis di 160 km, sehingga model hanya berlaku untuk 0 ≤ x ≤ 160 | Periksa (domain) |

**Yang diamati:** apakah siswa terkecoh memakai harga bensin; kesalahan `SIGN_DIRECTION` (y = (1/40)x + 4); kesulitan laju pecahan (IL03) dan tanda negatif (IL01, IL04); apakah siswa menyadari ketidakwajaran pada bagian d tanpa dibantu (LM-7).

### Pertanyaan wawancara setelah kedua soal
1. "Bagian mana yang paling sulit: memahami cerita, menentukan x dan y, membuat persamaan, menghitung, atau menuliskan arti jawaban?"
2. "Bagaimana kamu tahu angka mana yang penting dan mana yang tidak?"
3. "Kalau di aplikasi, bantuan apa yang kamu inginkan untuk soal seperti ini?"
4. "Apakah kamu pernah memeriksa apakah jawabanmu masuk akal? Bagaimana caranya?"
5. "Soal 2 lebih sulit atau lebih mudah dari Soal 1? Kenapa?"

### Lembar observasi (per siswa, per soal)

| Tahap | Teramati? (✔/✖) | Kesalahan / ucapan penting | Kode (IL/EL/GL/LM) |
|---|---|---|---|
| Pahami: menemukan pertanyaan & info relevan | | | |
| Rumuskan: x, y, satuan | | | |
| Rumuskan: m dan c | | | |
| Selesaikan | | | |
| Tafsirkan (dengan satuan) | | | |
| Periksa kewajaran | | | |

Hasil T1 dikodekan dengan kode yang sama seperti laporan wawancara awal (IL/EL/GL/DS), ditambah kode LM-1 s.d. LM-9, lalu dipakai untuk merevisi fitur F-24–F-33 sebelum rilis v0.5. Kedua soal ini **tidak dimasukkan** ke bank soal aplikasi agar tidak bocor ke siswa yang nanti mengikuti uji coba.

## 3. Instrumen

| Instrumen | Kegunaan | Keterangan |
|---|---|---|
| Pretest/Posttest | Hasil belajar | 10 soal setara (TP-2 s.d. TP-6); dikerjakan di kertas atau di aplikasi dengan mode tanpa bantuan |
| Skala usaha mental Paas (1992) | Beban kognitif keseluruhan per set | 1 butir, 9 poin; tampil di aplikasi setelah set latihan (mode riset) |
| Kuesioner beban kognitif Leppink dkk. (2013) | Memisahkan IL, EL, GL | 10 butir, skala 0–10; perlu diadaptasi ke bahasa Indonesia dan konteks gradien |
| System Usability Scale (SUS) | Kegunaan | 10 butir; gunakan versi bahasa Indonesia yang sudah divalidasi |
| Lembar observasi | Perilaku saat uji kegunaan | Diturunkan dari kolom "Cara Menguji Fitur" (lihat §5) |
| Log aplikasi | Perilaku belajar objektif | Lihat §4 |
| Tes literasi matematika | Literasi (RQ5) | 12 soal per paket: **4 soal AKM resmi + 8 soal buatan sendiri**. Dua paket setara (A untuk pretest, B untuk posttest). Kisi-kisi di §3b |
| Rubrik pemodelan | Pemodelan (RQ6) | Rubrik 4 aspek × 0–2 di [MATH_LITERACY §8](MATH_LITERACY.md); 2 penilai |

## 3b. Kisi-kisi Tes Literasi Matematika

Tes memakai **campuran soal AKM resmi dan soal buatan sendiri**:
- **Soal AKM resmi** memberi acuan yang sudah terstandar dan dapat dibandingkan dengan kerangka nasional.
- **Soal buatan sendiri** memastikan semua indikator literasi dan jenis soal cerita (T1–T10) yang dilatih aplikasi ikut terukur.

### Komposisi per paket (12 soal)

| Sumber | Jumlah | Ketentuan |
|---|---|---|
| AKM resmi | 4 | Diambil hanya dari **contoh soal AKM Numerasi yang dipublikasikan resmi** oleh Pusat Asesmen Pendidikan (Kemendikbudristek) untuk jenjang SMP. Pilih soal dengan konten **Aljabar (relasi & fungsi/pola linear)** atau yang memuat laju perubahan. Soal disalin apa adanya (tanpa diubah), dicantumkan sumbernya (judul dokumen, tahun, nomor soal), dan dicatat di `docs/research/sumber-soal-akm.md` |
| Buatan sendiri | 8 | Ditulis mengikuti format AKM (stimulus + beberapa pertanyaan), mencakup jenis T1–T10 yang belum terwakili soal AKM resmi |

> Soal AKM resmi **tidak boleh dikarang ulang** atau diklaim sebagai buatan sendiri. Jika jumlah contoh soal resmi yang relevan kurang dari 8 (4 untuk paket A dan 4 untuk paket B), gunakan soal resmi yang sama di kedua paket dan catat sebagai keterbatasan, atau tambah porsi soal buatan sendiri.

### Sebaran per paket

| Dimensi | Kategori | Jumlah soal |
|---|---|---|
| Level kognitif | Pemahaman / Penerapan / Penalaran | 4 / 5 / 3 |
| Konteks | Personal / Sosial-budaya / Saintifik | 5 / 4 / 3 |
| Bentuk | PG / PG kompleks / Menjodohkan / Isian / Uraian | 3 / 2 / 2 / 3 / 2 |
| Indikator | LM-1 s.d. LM-9 | setiap indikator ≥ 1 soal |

### Matriks soal buatan sendiri (8 soal; paket B memakai struktur sama dengan konteks dan angka berbeda)

| No | Jenis | Konteks | Level | Bentuk | Indikator utama |
|---|---|---|---|---|---|
| 1 | T1 harga per satuan | Personal (belanja di pasar) | Pemahaman | PG | LM-1, LM-3 |
| 2 | T3 dua data | Sosial-budaya (tarif PDAM) | Penerapan | Isian | LM-3, LM-4 |
| 3 | T4 tabel | Saintifik (tinggi tanaman) | Pemahaman | Menjodohkan (tabel ↔ grafik ↔ persamaan) | LM-8 |
| 4 | T5 grafik | Personal (perjalanan jarak–waktu) | Penerapan | PG kompleks | LM-3, LM-8 |
| 5 | T6 laju menurun | Saintifik (suhu turun / air menguap) | Penerapan | Isian | LM-4, LM-5 |
| 6 | T7 kemiringan fisik | Sosial-budaya (ramp kursi roda di sekolah) | Penerapan | Isian | LM-5, LM-6 |
| 7 | T9 bandingkan dua paket | Personal (paket kuota internet) | Penalaran | Uraian | LM-5, LM-6, LM-7 |
| 8 | T8 invers + domain | Sosial-budaya (tabungan kelas untuk study tour) | Penalaran | Uraian | LM-6, LM-7, LM-9 |

### Validasi instrumen
1. **Validitas isi:** 2–3 ahli (dosen pendidikan matematika, guru matematika SMP) menilai kesesuaian soal dengan indikator; hitung **Aiken's V** (soal dipakai jika V ≥ 0,7). Soal AKM resmi tetap dinilai kesesuaiannya dengan indikator, tetapi isinya tidak diubah.
2. **Keterbacaan:** uji kepada 3–5 siswa di luar sampel; revisi kalimat soal buatan sendiri yang membingungkan.
3. **Uji coba empiris** (kelas lain, ± 30 siswa): tingkat kesukaran, daya beda, dan reliabilitas (Cronbach's alpha ≥ 0,7).
4. **Kesetaraan paket A dan B:** rata-rata skor kedua paket pada uji coba tidak berbeda signifikan.
5. Soal tes **tidak dimasukkan** ke bank soal aplikasi (F-30) agar hasil posttest tidak bias oleh hafalan.

## 4. Skema Event Log

Kolom umum setiap event: `id, ts (ms epoch), sessionId, participantCode, group, appVersion, platform, type`, ditambah kolom spesifik berikut.

| Event | Kolom tambahan | Fitur |
|---|---|---|
| `session_start` / `session_end` | `durationMs` | — |
| `screen_view` | `route` | — |
| `onboarding_step` / `onboarding_complete` / `onboarding_skip` | `index` | F-01 |
| `example_step_view` / `example_complete` | `exampleId, step, durationMs` | F-02 |
| `recap_open` / `recap_quiz_answer` | `moduleId, source, correct` | F-03 |
| `integer_helper_open` | `problemId, step` | F-04 |
| `known_asked_submit` | `problemId, correct, errorType` | F-05 |
| `riserun_toggle` | `on` | F-06 |
| `slider_change` / `direction_guess` | `param, value, correct` | F-07 |
| `identify_mc_answer` | `equationId, tapped, correct, durationMs` | F-08 |
| `step_view` / `step_back` | `moduleId, chunk, durationMs` | F-09, F-12 |
| `step_complete` | `problemId, step, attempts, hintMaxLevel, microStepUsed, durationMs` | F-10 |
| `answer_submit` | `problemId, step, value, correct, errorType, attempt` | F-04, F-05, F-20 |
| `setting_change` | `key, value` | F-11, F-20, F-21 |
| `keypoint_summary_open` | `moduleId` | F-12 |
| `highlight_toggle` / `asked_tap` | `problemId, on, correct` | F-13 |
| `graph_point_place` / `graph_task_submit` | `taskId, x, y, correct` | F-14 |
| `visual_validation_used` / `self_correction` | `problemId, answerCorrect` | F-15 |
| `hint_open` / `solution_reveal` | `problemId, step, level` | F-16 |
| `reflection_prompt_shown` / `reflection_submit` / `reflection_skip` | `promptId, text, mode` | F-17 |
| `analog_example_open` / `analog_example_close` | `problemId, exampleId, durationMs` | F-18 |
| `practice_start` / `practice_complete` | `moduleId, setId, score, hintsUsed, durationMs` | F-19 |
| `microstep_open` / `sign_warning_shown` / `sign_warning_dismiss` | `problemId, step` | F-20 |
| `helpbar_toggle` | `collapsed` | F-21 |
| `mental_effort_rating` | `setId, rating (1–9)` | Riset |
| `modeling_stage_enter` / `modeling_stage_complete` / `modeling_loop_back` | `problemId, stage, attempts, hintMaxLevel, durationMs, fromStage` | F-24 |
| `relevant_info_select` | `problemId, selected, correct, distractorChosen` | F-24 (Pahami) |
| `variable_define` | `problemId, x, y, correct, errorType` | F-25 |
| `representation_switch` / `matching_submit` | `from, to, correct, pairs` | F-26 |
| `model_submit` | `problemId, input, mode, correct, errorType, attempt` | F-27 |
| `solve_step_submit` / `full_solution_open` | `problemId, step, correct, errorType` | F-28 |
| `interpret_submit` / `reasonableness_answer` | `problemId, text, numberCorrect, unitCorrect, questionId, correct` | F-29 |
| `wordproblem_start` / `wordproblem_complete` | `problemId, type, context, contextLevel, cognitiveLevel, score, hintsUsed, durationMs` | F-30 |
| `free_input_submit` / `free_input_result` | `length, status, type, confidence` | F-31 |
| `glossary_open` | `term, problemId` | F-32 |
| `posing_submit` | `modelId, length, parserMatch` | F-33 |

Format ekspor CSV: satu baris per event; kolom spesifik yang tidak relevan dikosongkan. JSON: array event apa adanya.

## 5. Pemetaan Indikator Uji → Data

| Kode | Indikator dari Matriks Analisis | Cara mengukur |
|---|---|---|
| K01 | Kecemasan/respons saat pertama membuka aplikasi | Observasi + 1 pertanyaan emoji (😟😐🙂) setelah onboarding; `onboarding_skip` |
| K02 | Menyelesaikan latihan dengan melihat contoh visual | `practice_complete.score` pada siswa yang membuka vs melewati contoh |
| K03 | Ingatan komponen grafik setelah *recap* | `recap_quiz_answer.correct` |
| IL01 | Menyelesaikan soal dengan nilai negatif | Akurasi soal L2/L4; tren `errorType=SIGN_ERROR` |
| IL02 | Masih salah memasukkan koordinat? | Frekuensi `SWAP_POINTS`, `MIXED_ORDER` |
| IL03 | Menjelaskan arti gradien pecahan | Analisis isi `reflection_submit` untuk prompt pecahan (rubrik §6) |
| IL04 | Menebak arah garis dari nilai m | Akurasi `direction_guess` |
| IL05 | Kecepatan identifikasi m dan c | `identify_mc_answer.durationMs`, akurasi |
| EL01 | Kebingungan saat membaca materi | `step_back` berulang, `durationMs` ekstrem, observasi, skor EL Leppink |
| EL02 | Kejelasan alur pengerjaan | `step_complete.attempts`, observasi, wawancara |
| EL03 | Warna membantu atau mengganggu | Butir kuesioner khusus + wawancara |
| EL04 | Mengikuti materi tanpa terburu-buru | Butir kuesioner "Saya bisa belajar sesuai kecepatan saya" |
| EL05 | Menemukan data relevan tanpa petunjuk | Akurasi `asked_tap`, `known_asked_submit` tanpa `highlight_toggle` |
| GL01 | Menggambar grafik dan menjelaskan alasannya | `graph_task_submit.correct` + wawancara |
| GL02 | Mendeteksi kesalahan sendiri via grafik | Rasio `self_correction` / `visual_validation_used` dengan jawaban awal salah |
| GL03 | Jumlah tingkat *hint* yang diperlukan | Rata-rata `hintMaxLevel` per soal dari waktu ke waktu |
| GL04 | Kualitas penjelasan sebelum vs sesudah | Rubrik §6 pada `reflection_submit` awal vs akhir |
| GL05 | Menerapkan strategi contoh ke soal baru | Akurasi `answer_submit` setelah `analog_example_open` |
| DS01 | Pemahaman setelah contoh visual | Pretest–posttest |
| DS02 | Penurunan kesalahan hitung | Proporsi `SIGN_ERROR` + `ARITH_ERROR` set awal vs akhir |
| DS03 | Frekuensi bantuan: siswa mahir vs lambat | Kelompokkan siswa berdasarkan pretest, lalu bandingkan jumlah event `*_open` |

### 5b. Indikator Literasi → Data

| Indikator ([MATH_LITERACY §7](MATH_LITERACY.md)) | Cara mengukur |
|---|---|
| LM-1 Mengidentifikasi info & pertanyaan | Akurasi `relevant_info_select` (termasuk menghindari pengecoh), `asked_tap` |
| LM-2 Variabel & satuan | Akurasi `variable_define` |
| LM-3/4 Laju, nilai awal, model | Akurasi `model_submit` percobaan pertama; distribusi `errorType` |
| LM-5 Menyelesaikan | Akurasi `solve_step_submit` |
| LM-6 Menafsirkan | `interpret_submit.unitCorrect` + rubrik |
| LM-7 Mengevaluasi | `reasonableness_answer`, `modeling_loop_back` yang berujung benar |
| LM-8 Antarrepresentasi | `matching_submit` |
| LM-9 Mengomunikasikan | Rubrik pada `reflection_submit` dan `posing_submit` |

Analisis per tahap (RQ6): hitung rata-rata `attempts` dan `hintMaxLevel` per `stage` dari `modeling_stage_complete`. Tahap dengan nilai tertinggi adalah tahap tersulit.

## 6. Rubrik Penjelasan Siswa (F-17)

| Skor | Kriteria |
|---|---|
| 0 | Kosong / tidak relevan |
| 1 | Menyebut hasil tanpa alasan ("karena negatif") |
| 2 | Menyebut satu unsur yang benar (arah garis **atau** Δy/Δx) |
| 3 | Menghubungkan arah garis dengan tanda Δy/Δx secara benar |

Dinilai oleh 2 penilai; hitung kesepakatan antarpenilai (mis. Cohen's kappa).

## 7. Analisis Data

- **Hasil belajar:** *N-gain* Hake; uji-t berpasangan atau Wilcoxon (jika data tidak normal).
- **Beban kognitif:** statistik deskriptif per dimensi IL/EL/GL; korelasi dengan *N-gain*.
- **Kemandirian:** tren rata-rata `hintMaxLevel` per urutan soal (grafik garis).
- **Kesalahan:** distribusi `errorType` awal vs akhir.
- **Kegunaan:** skor SUS (rata-rata, kategori Bangor dkk.).
- **Literasi:** *N-gain* tes literasi, dirinci per level kognitif (pemahaman/penerapan/penalaran) dan per konteks.
- **Pemodelan:** skor rubrik per aspek (pretest vs posttest); tahap tersulit dari log (§5b).
- **Kualitatif:** analisis tematik transkrip *think-aloud* dan wawancara dengan kode IL/EL/GL/DS yang sama seperti laporan awal.

## 8. Etika dan Privasi

- **Persetujuan:** *informed consent* dari sekolah, orang tua/wali (siswa di bawah umur), dan *assent* dari siswa.
- **Anonimisasi:** aplikasi hanya menyimpan kode peserta (S01, S02, …). Daftar padanan kode–nama disimpan terpisah oleh peneliti, di luar aplikasi dan repositori.
- **Lokasi data:** di perangkat; diekspor manual oleh peneliti; disimpan di penyimpanan terenkripsi atau berkata sandi.
- **API Python (F-31):** hanya menerima teks soal, tanpa kode peserta; server tidak menyimpan isi permintaan. Ingatkan siswa untuk tidak mengetik data pribadi di kolom soal.
- **Foto/rekaman:** jangan menampilkan wajah atau nama siswa pada laporan publik tanpa izin tertulis; buramkan wajah dan nama pada tangkapan layar.
- **Hak mundur:** siswa boleh berhenti kapan saja; data dapat dihapus melalui Mode Peneliti.
- Periksa apakah kampus mensyaratkan persetujuan komite etik.
