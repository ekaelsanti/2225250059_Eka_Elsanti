# Spesifikasi Fitur

Setiap fitur memiliki: **Sumber riset**, **Tujuan CLT**, **Perilaku**, **Kriteria penerimaan** (*Given/When/Then*), **Kasus tepi**, dan **Event**. Warna dan istilah mengikuti [UX_UI_GUIDELINES.md](UX_UI_GUIDELINES.md). Nama event mengikuti [ANALYTICS_RESEARCH_PLAN.md](ANALYTICS_RESEARCH_PLAN.md).

Prioritas: **M** = Must, **S** = Should, **C** = Could.

---

## Ringkasan

| ID | Nama | Sumber | CLT | Prioritas |
|---|---|---|---|---|
| F-01 | Onboarding Bertahap | K01 | IL ↓ | M |
| F-02 | Contoh Bergambar Step-by-Step | K02 | EL ↓, GL ↑ | M |
| F-03 | Quick Recap | K03 | IL ↓ | M |
| F-04 | Scaffolding Aritmetika Negatif + Validasi Otomatis | IL01 | IL ↓ | M |
| F-05 | Input Known/Asked Berwarna | IL02 | IL ↓, EL ↓ | M |
| F-06 | Visualisasi Rise over Run | IL03 | IL ↓ | M |
| F-07 | Slider m Real-time | IL04 | IL ↓, GL ↑ | M |
| F-08 | Perbandingan Persamaan Side-by-side | IL05 | IL ↓ | S |
| F-09 | Chunking + Penanda Info Penting | EL01 | EL ↓ | M |
| F-10 | Alur Step-by-Step Input | EL02 | EL ↓ | M |
| F-11 | Skema Warna Konsisten | EL03 | EL ↓ | M |
| F-12 | Navigasi Self-paced + Poin Inti | EL04 | EL ↓ | M |
| F-13 | Auto-highlight Diketahui/Ditanya | EL05 | EL ↓ | S |
| F-14 | Bidang Kartesius Interaktif | GL01 | GL ↑ | M |
| F-15 | Visual Validation ("Cek di Grafik") | GL02 | GL ↑ | M |
| F-16 | Fading Hints | GL03 | GL ↑, IL ↓ | M |
| F-17 | "Jelaskan Langkahmu" | GL04 | GL ↑ | S |
| F-18 | Contoh Analog On-demand | GL05 | GL ↑ | M |
| F-19 | Latihan Terintegrasi Contoh Visual | DS01 | GL ↑ | M |
| F-20 | Micro-step Hitung + Tooltip Peringatan | DS02 | IL ↓ | M |
| F-21 | Bantuan Opsional On-demand | DS03 | EL ↓ | M |
| F-22 | Mode Peneliti & Ekspor Data | — | — | M |
| F-23 | Ringkasan Progres | — | — | C |
| F-24 | Siklus Pemodelan Terpandu | Literasi; EL01, K01 | EL ↓, GL ↑ | M |
| F-25 | Penentu Variabel & Satuan | Literasi; IL02 | IL ↓ | M |
| F-26 | Representasi Ganda Tersinkron | Literasi; EL02, GL02 | GL ↑ | M |
| F-27 | Pemeriksa Model | Literasi; GL03 | GL ↑ | M |
| F-28 | Penyelesai & Penjelas Langkah | Literasi; K02, DS02 | IL ↓ | M |
| F-29 | Tafsirkan & Periksa Kewajaran | Literasi; GL02 | GL ↑ | M |
| F-30 | Bank Soal Literasi Kontekstual | Literasi; DS01, GL05 | GL ↑ | M |
| F-31 | Input Soal Cerita Bebas (online) | Literasi | GL ↑ | S |
| F-32 | Kamus Konteks | Literasi; EL05 | EL ↓ | S |
| F-33 | Buat Soal Ceritaku (*problem posing*) | Literasi; GL04 | GL ↑ | C |

---

## F-01 Onboarding Bertahap
**Sumber:** K01. Materi terasa susah sebelum dijelaskan.
**Tujuan:** Menurunkan kecemasan awal dan memberi gambaran "apa yang akan dipelajari" sebelum masuk ke rumus.

**Perilaku**
- Muncul saat aplikasi dibuka pertama kali. Isinya 4 layar pendek, masing-masing 1 gambar dan maksimal 2 kalimat:
  1. "Kemiringan ada di sekitarmu" (tangga, jalan menanjak, perosotan).
  2. "Garis bisa naik, turun, atau datar" (animasi garis sederhana).
  3. "Kita akan belajar pelan-pelan, satu langkah setiap layar."
  4. "Bantuan selalu ada di tombol 💡, pakai kalau perlu saja."
- Indikator titik (●○○○) dan tombol "Lanjut". Tombol "Lewati" tersedia.
- Dapat dibuka kembali dari menu Pengaturan → "Lihat pengenalan".

**Kriteria penerimaan**
- *Given* aplikasi dibuka pertama kali, *when* layar dimuat, *then* layar onboarding 1 tampil.
- *Given* siswa di layar 4, *when* menekan "Mulai", *then* status `onboardingDone = true` tersimpan dan Beranda tampil.
- *Given* onboarding sudah selesai, *when* aplikasi dibuka lagi, *then* onboarding tidak tampil.

**Kasus tepi:** penyimpanan lokal dihapus menyebabkan onboarding tampil lagi (diterima).
**Event:** `onboarding_step{index}`, `onboarding_complete`, `onboarding_skip{at_index}`.

---

## F-02 Contoh Bergambar Step-by-Step
**Sumber:** K02. Guru menggambar garis dan memberi contoh soal.
**Tujuan:** *Worked example effect*. Siswa mempelajari pola penyelesaian sebelum mencoba sendiri.

**Perilaku**
- Setiap modul (M2–M6) memiliki 1–2 contoh soal sebelum latihan.
- Grafik tampil di atas; langkah penyelesaian di bawah, **satu langkah per tekan "Lanjut"**.
- Setiap langkah menyorot elemen grafik terkait. Contohnya, saat langkah "Δy = 5 − 2" tampil, garis vertikal Δy pada grafik ikut menyala.
- Struktur langkah standar untuk gradien dua titik:
  1. Tulis yang diketahui (titik 1 biru, titik 2 oranye).
  2. Tulis rumus `m = (y₂ − y₁) / (x₂ − x₁)`.
  3. Hitung pembilang (Δy) dengan *micro-step* (F-20).
  4. Hitung penyebut (Δx).
  5. Bagi dan sederhanakan.
  6. Cek di grafik (F-15).
- Tersedia **fading** (lihat F-19): contoh lengkap → contoh dengan satu langkah dikosongkan → latihan mandiri.

**Kriteria penerimaan**
- *Given* siswa membuka contoh, *when* menekan "Lanjut", *then* hanya satu langkah baru yang muncul dan langkah sebelumnya tetap terlihat dalam keadaan redup.
- *Given* langkah aktif menyebut Δy, *then* segmen Δy pada grafik disorot dengan warna `rise`.
- Tombol "Kembali" menampilkan langkah sebelumnya.

**Event:** `example_step_view{example_id, step}`, `example_complete{example_id, duration_ms}`.

---

## F-03 Quick Recap
**Sumber:** K03. Masih mengenali garis tetapi "lupa-lupa ingat".
**Tujuan:** Mengaktifkan skema lama sebelum materi baru (*retrieval*).

**Perilaku**
- Kartu *recap* 1 layar di awal modul M2–M6 dan dapat dibuka kapan saja lewat tombol 📌 "Ingat Lagi".
- Isi: gambar bidang Kartesius berlabel (sumbu x, sumbu y, titik asal, contoh titik (3, 2)), rumus inti modul, dan 1 kalimat poin inti.
- Kuis ingat singkat opsional (2 soal pilihan ganda), misalnya "Sumbu mana yang mendatar?"

**Kriteria penerimaan**
- *Given* siswa memulai modul, *then* kartu recap tampil dengan tombol "Sudah ingat, lanjut" dan "Coba kuis singkat".
- *Given* siswa di tengah latihan, *when* menekan 📌, *then* recap tampil sebagai *bottom sheet* tanpa menghilangkan isian jawaban.

**Event:** `recap_open{module, source=auto|button}`, `recap_quiz_answer{correct}`.

---

## F-04 Scaffolding Aritmetika Negatif + Validasi Otomatis
**Sumber:** IL01. Kesulitan pada angka negatif.
**Tujuan:** Memastikan prasyarat bilangan bulat dan menangkap kesalahan tanda sedini mungkin.

**Perilaku**
- **Modul M0 (opsional):** 5–8 soal pemanasan bilangan bulat, misalnya `3 − (−2)` dan `−4 − 5`, dengan visual **garis bilangan** yang menunjukkan lompatan.
- **Integer Helper:** tombol kecil `±` di samping setiap isian hitungan. Membukanya menampilkan garis bilangan mini untuk operasi yang sedang dikerjakan.
- **Validasi otomatis per langkah:** setiap isian (Δy, Δx, hasil) diperiksa saat siswa menekan "Cek". Jika salah dan `errorClassifier` mendeteksi `SIGN_ERROR`, tampil umpan balik spesifik:
  > "Hampir! Perhatikan tandanya. 3 − (−2) artinya 3 **ditambah** 2."

**Kriteria penerimaan**
- *Given* jawaban Δy benar nilainya tetapi berlawanan tanda, *then* `error_type = SIGN_ERROR` dan umpan balik tanda tampil.
- *Given* siswa membuka Integer Helper untuk `a − b`, *then* garis bilangan menampilkan titik a dan lompatan sebesar b ke arah yang benar.

**Kasus tepi:** isian kosong atau bukan angka akan memunculkan pesan "Isi dengan angka, ya" tanpa dihitung sebagai percobaan salah.
**Event:** `integer_helper_open`, `answer_submit{step, correct, error_type, attempt}`.

---

## F-05 Input Known/Asked Berwarna
**Sumber:** IL02. Menentukan titik dan memasukkan ke rumus, rawan tertukar.
**Tujuan:** Memisahkan "mengidentifikasi data" dari "menghitung", dan mencegah salah pasang variabel.

**Perilaku**
- Langkah 1 setiap soal dua titik adalah formulir **Diketahui / Ditanya**:
  ```
  Diketahui:
    Titik 1  ( x₁ = [  ] , y₁ = [  ] )   ← kotak biru
    Titik 2  ( x₂ = [  ] , y₂ = [  ] )   ← kotak oranye
  Ditanya:  m = ?                        ← hijau
  ```
- Titik pada grafik dan teks soal memakai warna yang sama dengan kotaknya.
- Rumus pada langkah berikutnya menampilkan nilai yang **sudah tersubstitusi dengan warna yang sama**, misalnya `m = (5 − 2)/(4 − 1)` dengan 5 dan 4 berwarna oranye, 2 dan 1 berwarna biru.
- **Validasi:** siswa boleh menukar titik 1 dan 2 (hasil m tetap sama). Sistem hanya menandai salah jika x dan y diambil dari titik berbeda (`MIXED_ORDER`), misalnya `(y₂ − y₁)/(x₁ − x₂)`.

**Kriteria penerimaan**
- *Given* siswa mengisi titik 1 = (4, 5) dan titik 2 = (1, 2) untuk soal A(1,2), B(4,5), *then* jawaban diterima.
- *Given* siswa mengisi x₁ dari A tetapi y₁ dari B, *then* `error_type = SWAP_POINTS` dan pesan "Pastikan x₁ dan y₁ berasal dari titik yang sama" tampil.

**Event:** `known_asked_submit{correct, error_type}`.

---

## F-06 Visualisasi Rise over Run
**Sumber:** IL03. Gradien pecahan membingungkan; prasyarat koordinat.
**Tujuan:** Memberi makna visual untuk `m = Δy/Δx`, termasuk untuk pecahan.

**Perilaku**
- Pada grafik garis, tombol "Tampilkan naik/jalan" menggambar segitiga siku-siku dari titik 1 ke titik 2:
  - Segmen horizontal **Δx** (sian) berlabel "jalan 3 ke kanan".
  - Segmen vertikal **Δy** (magenta) berlabel "naik 2" atau "turun 2".
- Pecahan `m = 2/3` dibaca sebagai "setiap jalan 3 ke kanan, naik 2". Kalimat ini selalu tampil di bawah pecahan.
- Animasi langkah: dari sebuah titik, jalan 3 kotak lalu naik 2 kotak, diulang 2 kali untuk menunjukkan pola yang konsisten.
- Grid selalu tampil dengan satuan bilangan bulat agar siswa bisa menghitung kotak.

**Kriteria penerimaan**
- *Given* garis melalui (0,0) dan (3,2), *when* tombol ditekan, *then* segitiga dengan label "jalan 3, naik 2" tampil dan pecahan 2/3 berwarna hijau.
- *Given* gradien negatif, *then* label menjadi "turun" dan segmen Δy mengarah ke bawah.

**Event:** `riserun_toggle{on}`, `riserun_animate`.

---

## F-07 Slider m Real-time
**Sumber:** IL04. Banyak angka negatif; bingung arah miring.
**Tujuan:** Membangun intuisi hubungan tanda/besar m dengan arah dan kecuraman garis.

**Perilaku**
- Slider m dari −5 sampai 5 dengan langkah 0,5 (juga pecahan umum: 1/2, 1/3, 2/3). Slider c dapat diaktifkan pada modul M5.
- Garis `y = mx + c` diperbarui **seketika** saat slider digeser.
- Label status di atas grafik:
  - m > 0 → "Naik dari kiri ke kanan ↗"
  - m < 0 → "Turun dari kiri ke kanan ↘"
  - m = 0 → "Datar →"
- Mode tantangan "Tebak Arah": sistem memberi nilai m, siswa memilih gambar garis yang sesuai dari 4 pilihan, lalu slider menunjukkan jawaban.

**Kriteria penerimaan**
- *Given* slider berada di −2, *then* garis turun dan label menampilkan "Turun dari kiri ke kanan".
- Pembaruan grafik < 16 ms per perubahan di perangkat uji.
- Slider dapat dioperasikan dengan keyboard (panah) dan sentuhan.

**Event:** `slider_change{param, value}` (di-*debounce* 300 ms), `direction_guess{m, answer, correct}`.

---

## F-08 Perbandingan Persamaan Side-by-side
**Sumber:** IL05 (Matriks Analisis). Tertukar bentuk persamaan `y = mx + c`.
**Tujuan:** Mengenali pola m dan c lewat kontras.

**Perilaku**
- Kartu berdampingan (vertikal di ponsel), masing-masing berisi persamaan dan grafiknya:
  - `y = 2x + 1`, `y = −2x + 1`, `y = 2x − 3`
  - Bagian m diwarnai hijau dan c diwarnai ungu.
- Variasi bentuk: `y = 3 − 2x` dan `2y = 4x + 6`, dengan langkah "ubah ke bentuk y = mx + c" sebagai *micro-step*.
- Bentuk umum `ax + by + c = 0` → `m = −a/b`, ditunjukkan sebagai kartu terpisah.
- Latihan identifikasi: ketuk bagian persamaan yang merupakan m.

**Kriteria penerimaan**
- *Given* persamaan `y = 3 − 2x`, *when* siswa mengetuk "3", *then* umpan balik menjelaskan "3 adalah c; m adalah angka yang menempel pada x, yaitu −2".

**Event:** `identify_mc_answer{equation_id, tapped, correct, duration_ms}`.

---

## F-09 Chunking + Penanda Info Penting
**Sumber:** EL01. Penjelasan panjang membingungkan, sehingga siswa bertanya ulang ke guru.
**Tujuan:** Mengurangi EL dengan *segmenting* dan *signaling*.

**Perilaku**
- Materi dibagi menjadi *chunk*; satu *chunk* = satu layar = satu ide.
- Batas per layar: ≤ 1 gambar utama, ≤ 3 kalimat, ≤ 1 rumus.
- Komponen **`KeyPoint`** (kotak berlatar kuning muda dengan ikon ⭐) untuk informasi yang wajib diingat; maksimal 1 per layar.
- Bilah progres modul di atas (mis. "Langkah 3 dari 8").

**Kriteria penerimaan**
- Linter konten (test) gagal jika sebuah *chunk* melebihi batas di atas.

**Event:** `step_view{module, chunk, duration_ms}`, `step_back`.

---

## F-10 Alur Step-by-Step Input
**Sumber:** EL02. Rumus menumpuk tanpa langkah jelas.
**Tujuan:** Mencegah *split-attention*; siswa fokus pada satu sub-tugas.

**Perilaku**
- `StepRunner` menampilkan satu isian aktif. Langkah selesai diringkas di atasnya dalam satu baris redup yang bisa diketuk untuk dilihat ulang.
- Tombol "Cek" per langkah. Langkah berikutnya baru terbuka setelah langkah aktif benar atau siswa memilih "Tunjukkan jawaban" (setelah *hint* level 3).
- Layout: grafik selalu terlihat (*sticky* di atas pada ponsel, di kiri pada layar lebar).

**Kriteria penerimaan**
- *Given* soal dua titik, *then* urutan langkah adalah: Diketahui → Rumus → Δy → Δx → Bagi/Sederhanakan → Cek grafik.
- Hanya satu isian yang dapat diedit pada satu waktu.

**Event:** `step_complete{problem_id, step, attempts, duration_ms}`.

---

## F-11 Skema Warna Konsisten
**Sumber:** EL03. Warna tidak mengganggu, malah menarik.
**Tujuan:** *Signaling* dan *contiguity*. Warna menjadi "lem" antara teks, rumus, dan grafik.

**Perilaku**
- Semua komponen mengambil warna dari `tokens.js` (lihat [UX_UI_GUIDELINES §3](UX_UI_GUIDELINES.md)).
- Komponen `ColoredVar` merender variabel dan nilainya dengan warna peran (`point1`, `point2`, `slope`, `intercept`, `rise`, `run`).
- Setiap elemen berwarna juga memiliki label teks atau subskrip, sehingga tetap terbaca oleh siswa buta warna.
- Pengaturan: "Mode warna" Standar / Ramah buta warna (palet alternatif).

**Kriteria penerimaan**
- Tidak ada kode warna *hex* di komponen (dicek ESLint *rule* kustom atau *grep* di CI).
- Kontras setiap warna teks terhadap latar ≥ 4,5:1.

**Event:** `setting_change{key=colorMode}`.

---

## F-12 Navigasi Self-paced + Poin Inti
**Sumber:** EL04. Penjelasan santai, berurutan, dan diberi tahu mana yang penting.
**Tujuan:** *Pacing principle*. Tidak ada tekanan waktu.

**Perilaku**
- Tidak ada *timer*, hitung mundur, atau *auto-advance* di seluruh aplikasi.
- Tombol "Kembali" dan "Lanjut" selalu tersedia di posisi tetap (bawah layar, mudah dijangkau jempol).
- Daftar isi modul memungkinkan lompat ke *chunk* mana pun yang sudah dibuka.
- Ringkasan "Poin Inti" di akhir modul berisi semua `KeyPoint` modul tersebut.

**Kriteria penerimaan**
- *Grep* kode: tidak ada `setTimeout`/`setInterval` untuk memajukan langkah.
- *Given* siswa keluar di tengah modul, *when* kembali, *then* posisi terakhir dipulihkan.

**Event:** `keypoint_summary_open{module}`, `resume_position{module, chunk}`.

---

## F-13 Auto-highlight Diketahui/Ditanya
**Sumber:** EL05. Mencari apa yang ditanyakan terlebih dahulu.
**Tujuan:** Mempercepat ekstraksi informasi pada soal cerita.

**Perilaku**
- Soal cerita memiliki anotasi di JSON (rentang teks `known` dan `asked`).
- Tombol 🔍 "Sorot Info" (opsional) menyorot data yang diketahui (garis bawah berwarna sesuai variabel) dan kalimat pertanyaan (latar hijau muda).
- Mode latihan: siswa mengetuk sendiri kalimat yang ditanyakan, lalu sistem memberi umpan balik.

**Kriteria penerimaan**
- *Given* soal cerita dengan anotasi, *when* 🔍 ditekan, *then* semua rentang `known` dan `asked` tersorot dan bisa dimatikan lagi.

**Event:** `highlight_toggle{problem_id, on}`, `asked_tap{correct}`.

---

## F-14 Bidang Kartesius Interaktif
**Sumber:** GL01. Paham saat menggambar grafik.
**Tujuan:** Aktivitas generatif yang membangun skema.

**Perilaku**
- Komponen `CartesianPlane` (SVG), rentang default −10..10, grid 1 satuan, label sumbu.
- Siswa menempatkan titik dengan mengetuk grid; titik **snap** ke koordinat bulat. Titik dapat digeser (*drag*). Koordinat tampil di dekat titik.
- Dua titik otomatis membentuk garis (diperpanjang ke tepi).
- Jenis tugas:
  1. "Plot titik A(2, −3)".
  2. "Gambar garis melalui (0,1) dengan gradien 2".
  3. "Gambar garis yang sejajar/tegak lurus dengan garis ini".
- Alternatif aksesibel: isian koordinat numerik.
- *Pinch-zoom* dinonaktifkan; tersedia tombol perbesar/perkecil rentang.

**Kriteria penerimaan**
- *Given* tugas gradien 2 melalui (0,1), *when* siswa menempatkan titik kedua di (1,3) atau (2,5) atau (−1,−1), *then* jawaban benar.
- Pegangan titik ≥ 44 px area sentuh.

**Event:** `graph_point_place{x,y}`, `graph_drag`, `graph_task_submit{task_id, correct}`.

---

## F-15 Visual Validation ("Cek di Grafik")
**Sumber:** GL02. Tahu jawaban benar dari melihat grafik.
**Tujuan:** Refleksi dan *self-monitoring*.

**Perilaku**
- Setelah siswa memasukkan nilai m (benar atau salah), tombol 📈 "Cek di Grafik" menggambar:
  - garis sebenarnya melalui titik-titik soal (abu-abu tebal), dan
  - garis dengan **gradien jawaban siswa** dari titik 1 (hijau putus-putus).
- Jika garis berimpit, tampil "Garismu tepat melewati kedua titik ✔". Jika tidak, tampil "Garismu tidak melewati titik B. Coba periksa lagi tandanya/hitunganmu."
- Siswa dapat mengubah jawabannya setelah melihat grafik. Koreksi seperti ini dicatat sebagai `self_correction`.

**Kriteria penerimaan**
- *Given* titik (1,2), (4,5) dan jawaban siswa m = −1, *then* garis putus-putus turun dan tidak melewati (4,5).
- *Given* siswa mengubah jawaban menjadi benar setelah validasi, *then* event `self_correction` tercatat.

**Event:** `visual_validation_used{problem_id, answer_correct}`, `self_correction{problem_id}`.

---

## F-16 Fading Hints
**Sumber:** GL03. Bertanya ke guru tentang maksud soal dan cara yang dipakai.
**Tujuan:** *Scaffolding* yang memudar menuju kemandirian.

**Perilaku**
- Tombol 💡 "Butuh petunjuk?" tersedia di setiap langkah latihan. Ada 3 tingkat yang dibuka berurutan:
  | Level | Isi | Contoh (langkah Δy) |
  |---|---|---|
  | 1 Strategi | Arahkan ke ide/rumus | "Δy adalah selisih nilai y. Rumusnya y₂ − y₁." |
  | 2 Proses | Tunjukkan substitusi | "y₂ = 5 dan y₁ = −2, jadi Δy = 5 − (−2)." |
  | 3 Hampir jawaban | Langkah terakhir | "5 − (−2) = 5 + 2 = …" |
- Setelah level 3, tombol "Tunjukkan jawaban" tersedia. Soal ditandai "dibantu" dan tidak dihitung sebagai mandiri.
- **Fading antar-soal:** dalam satu set latihan, jika siswa menyelesaikan 2 soal berturut-turut tanpa *hint*, soal berikutnya hanya menampilkan *hint* level 1–2 sampai siswa meminta lagi. Ini disesuaikan dengan `hintEngine`.
- Isi *hint* disimpan di JSON per langkah dengan *template* nilai (`{y2}`, `{y1}`).

**Kriteria penerimaan**
- *Given* siswa menekan 💡 sekali, *then* hanya level 1 yang tampil, disertai tombol "Petunjuk berikutnya".
- *Given* soal diselesaikan dengan *hint* level 2, *then* `hint_max_level = 2` tercatat pada `step_complete`.

**Event:** `hint_open{problem_id, step, level}`, `solution_reveal{problem_id, step}`.

---

## F-17 "Jelaskan Langkahmu"
**Sumber:** GL04. Lebih paham saat menjelaskan ke teman.
**Tujuan:** *Self-explanation prompt*.

**Perilaku**
- Muncul **sebagai tawaran** (bisa dilewati) setelah soal tertentu yang ditandai di JSON, sekitar 1 per set latihan:
  > "Bayangkan temanmu bingung. Jelaskan dengan kata-katamu: kenapa gradiennya negatif?"
- Input: teks bebas (maks. 300 karakter) **atau** menyusun kalimat dari kepingan kata (lebih mudah di ponsel).
- Setelah dikirim, tampil "Contoh penjelasan" dari guru untuk dibandingkan. Penjelasan siswa tidak dinilai otomatis.
- Semua penjelasan tersimpan dan dapat dilihat siswa di "Catatanku".

**Kriteria penerimaan**
- *Given* siswa menekan "Lewati", *then* tidak ada penalti dan soal berikutnya tampil.
- *Given* siswa mengirim penjelasan, *then* teks tersimpan lokal dan contoh penjelasan tampil.

**Event:** `reflection_prompt_shown{prompt_id}`, `reflection_submit{prompt_id, text, mode}`, `reflection_skip`.

---

## F-18 Contoh Analog On-demand
**Sumber:** GL05. Melihat contoh sebelumnya yang berkaitan beserta gambarnya.
**Tujuan:** *Analogical transfer*.

**Perilaku**
- Tombol 📖 "Lihat Contoh Serupa" di setiap soal latihan.
- Membuka *bottom sheet* berisi contoh terselesaikan dengan **struktur sama tetapi angka berbeda**, termasuk grafiknya. Contoh dipilih dari tag soal yang sama (mis. `two-points`, `negative-both`).
- Contoh dapat dibuka langkah demi langkah (komponen sama dengan F-02).
- Isian jawaban siswa tetap utuh saat *sheet* ditutup.

**Kriteria penerimaan**
- *Given* soal dengan tag `two-points, negative-dx`, *then* contoh analog yang tampil memiliki tag yang sama dan nilai yang berbeda.

**Event:** `analog_example_open{problem_id, example_id}`, `analog_example_close{duration_ms}`.

---

## F-19 Latihan Terintegrasi Contoh Visual
**Sumber:** DS01. "Gambar, contoh soal."
**Tujuan:** Transisi dari contoh ke latihan mandiri (*completion problems*).

**Perilaku**
- Setiap set latihan modul berisi 6–10 soal dengan urutan *fading*:
  1. 1 contoh lengkap (F-02).
  2. 2 soal **sebagian terisi** (*completion*): satu atau dua langkah dikosongkan.
  3. Soal mandiri penuh dengan tingkat kesulitan naik (L1 → L4, lihat [CONTENT_SPEC §5](CONTENT_SPEC.md)).
- Grafik interaktif hadir di setiap soal.
- Akhir set: skor, waktu total (hanya informasi, bukan target), dan tombol "Ulangi dengan soal baru" (soal dibuat oleh generator).

**Kriteria penerimaan**
- *Given* set latihan baru, *then* urutan jenis soal mengikuti pola di atas.
- *Given* "Ulangi", *then* angka soal berbeda dari set sebelumnya.

**Event:** `practice_start{module, set_id}`, `practice_complete{module, set_id, score, hints_used, duration_ms}`.

---

## F-20 Micro-step Hitung + Tooltip Peringatan
**Sumber:** DS02. Perhitungan bagi/kurang harus dijelaskan perlahan.
**Tujuan:** Mengurangi kesalahan prosedural.

**Perilaku**
- Tombol 🔢 "Hitung pelan-pelan" pada langkah Δy, Δx, dan bagi. Tombol ini memecah operasi menjadi sub-langkah:
  ```
  Δy = y₂ − y₁
     = 5 − (−2)        ← substitusi (warna titik)
     = 5 + 2           ← "kurang negatif = tambah"
     = 7
  ```
  ```
  m = 7 / −3
    = −7/3             ← "positif dibagi negatif = negatif"
  ```
  ```
  m = 6 / 4
    = (6 ÷ 2)/(4 ÷ 2)  ← FPB 2
    = 3/2
  ```
- **Tooltip peringatan otomatis** (satu-satunya bantuan yang muncul tanpa diminta): saat isian melibatkan pengurangan bilangan negatif, ikon ⚠ kecil muncul di samping isian dengan teks "Ada tanda negatif di sini, hati-hati ya". Tooltip dapat ditutup dan dimatikan di Pengaturan.
- Aturan tanda tersedia sebagai kartu referensi.

**Kriteria penerimaan**
- *Given* operasi `5 − (−2)`, *then* micro-step menampilkan baris `5 + 2`.
- *Given* `m = 6/4`, *then* sistem menerima `3/2`, `6/4`, dan `1,5`. Namun, jika jawaban belum sederhana, sistem menampilkan "Benar! Bisa disederhanakan jadi 3/2" (bukan salah).
- *Given* pengaturan `signWarning = off`, *then* tooltip tidak muncul.

**Event:** `microstep_open{problem_id, step}`, `sign_warning_shown`, `sign_warning_dismiss`.

---

## F-21 Bantuan Opsional On-demand
**Sumber:** DS03. Kebutuhan bantuan berbeda tiap siswa.
**Tujuan:** Personalisasi; menghindari *expertise reversal effect* pada siswa mahir.

**Perilaku**
- Semua bantuan (💡 *hint*, 📖 contoh analog, 📌 recap, 🔢 micro-step, 🔍 sorot, ± garis bilangan) berada di **satu bilah bantuan** yang konsisten di bawah isian, dengan ikon dan label pendek.
- Bilah dapat diciutkan menjadi satu tombol "Bantuan" (preferensi tersimpan).
- Tidak ada bantuan yang membuka sendiri, kecuali tooltip ⚠ (F-20) yang dapat dimatikan.
- Pengaturan "Tingkat bantuan": Lengkap / Ringkas (Ringkas = bilah diciutkan secara default).

**Kriteria penerimaan**
- *Given* siswa tidak menekan bantuan apa pun, *then* soal dapat diselesaikan sepenuhnya tanpa *pop-up* bantuan.

**Event:** `helpbar_toggle{collapsed}`, plus semua event `*_open` bantuan.

---

## F-22 Mode Peneliti & Ekspor Data
**Sumber:** Kebutuhan riset (P3).

**Perilaku**
- Masuk dengan menekan logo 5 kali di Pengaturan, lalu memasukkan PIN peneliti (diatur saat build lewat `.env`).
- Fitur:
  - Mengisi **kode peserta** (mis. `S01`) dan **kelompok** (mis. `uji-coba-1`). Nama asli tidak disimpan.
  - Melihat jumlah event dan sesi.
  - **Ekspor** ke CSV dan JSON melalui *Web Share API* / unduhan (web) atau *Share sheet* Capacitor (Android).
  - Menghapus data lokal (dengan konfirmasi ganda).
  - Mengisi skor pretest/posttest secara manual (opsional).
- Kuesioner singkat dalam aplikasi: skala usaha mental Paas (1–9) setelah setiap set latihan, ditampilkan hanya jika mode riset aktif.

**Kriteria penerimaan**
- *Given* 3 sesi tersimpan, *when* ekspor CSV, *then* file berisi satu baris per event dengan kolom sesuai skema di ANALYTICS_RESEARCH_PLAN.

---

## F-23 Ringkasan Progres
**Perilaku**
- Beranda menampilkan kartu modul dengan status (belum/berjalan/selesai) dan bintang akurasi (tanpa peringkat antarsiswa).
- Halaman "Progresku": modul selesai, jumlah soal mandiri, dan jenis kesalahan yang paling sering dibuat beserta tautan ke materi terkait.
- Bagian "Literasiku": capaian per indikator literasi LM-1 s.d. LM-9 (Pahami, Rumuskan, Selesaikan, Tafsirkan, Periksa) dalam bentuk bilah sederhana, beserta saran latihan untuk tahap terlemah.

---

# Bagian B: Literasi Matematika dan Pemodelan Soal Cerita

Fitur F-24 s.d. F-33 mewujudkan tujuan **literasi matematika** dan **pemodelan soal cerita**. Kerangka pedagogis ada di [MATH_LITERACY.md](MATH_LITERACY.md); mesin Python di [MODELING_ENGINE.md](MODELING_ENGINE.md). Kode LM-x merujuk indikator literasi di MATH_LITERACY §7.

## F-24 Siklus Pemodelan Terpandu
**Sumber:** tujuan literasi; EL01 (penjelasan panjang membingungkan), K01 (butuh bertahap).
**Tujuan:** Memecah pemecahan soal cerita menjadi 5 tahap eksplisit agar beban memori kerja tetap terkelola.

**Perilaku**
- *Stepper* di atas layar: **① Pahami → ② Rumuskan → ③ Selesaikan → ④ Tafsirkan → ⑤ Periksa**. Tahap aktif disorot, tahap selesai dicentang.
- Satu tahap = satu layar. Teks soal selalu dapat dibuka lewat tombol 📄 "Lihat soal" (*bottom sheet*), sehingga tidak perlu ditampilkan penuh di setiap tahap.
- Isi tiap tahap:
  1. **Pahami:** baca soal; ketuk kalimat pertanyaan; pilih info yang relevan (ada info pengecoh di level K-C/K-D). (LM-1)
  2. **Rumuskan:** F-25 (variabel & satuan), lalu tentukan laju m dan nilai awal c atau dua data, lalu susun persamaan, diperiksa F-27. (LM-2–4)
  3. **Selesaikan:** substitusi dan hitung dengan `StepRunner` + micro-step. (LM-5)
  4. **Tafsirkan:** F-29, kalimat jawaban dengan satuan. (LM-6)
  5. **Periksa:** F-29, cek kewajaran di grafik/tabel. (LM-7)
- Jika tahap Periksa menemukan hasil tidak wajar, siswa diarahkan kembali ke tahap Rumuskan dengan model sebelumnya tetap tersimpan.
- Mode **Ringkas** (untuk siswa mahir, F-21): tahap 1 dan 5 dapat dilewati; tahap 2–4 digabung menjadi satu layar.

**Kriteria penerimaan**
- *Given* soal T2, *then* urutan tahap 1→5 tampil satu per satu dan tombol "Lanjut" tahap berikutnya aktif setelah tahap aktif benar atau dibantu.
- *Given* siswa di tahap 3, *when* menekan 📄, *then* teks soal lengkap tampil tanpa menghilangkan isian.

**Event:** `modeling_stage_enter{problemId, stage}`, `modeling_stage_complete{stage, attempts, hintMaxLevel, durationMs}`, `modeling_loop_back{fromStage}`.

---

## F-25 Penentu Variabel & Satuan
**Sumber:** literasi (LM-2); IL02 (rawan tertukar).
**Tujuan:** Memisahkan "memberi makna variabel" dari "menyusun persamaan".

**Perilaku**
- Dua kartu: **x = …** dan **y = …**. Siswa memilih makna dari daftar besaran yang ditemukan di soal (mis. "jarak tempuh", "biaya", "waktu") beserta satuannya.
- Pertanyaan pemandu: "Mana yang **mempengaruhi**? Mana yang **dipengaruhi**?"
- Setelah benar, label variabel ikut tampil di sumbu grafik dan kepala tabel (mis. "x: jarak (km)").
- Pada level K-A, variabel sudah terisi sebagai contoh (*completion*).

**Kriteria penerimaan**
- *Given* soal ojek, *when* siswa memilih x = biaya dan y = jarak, *then* `errorType = VAR_ROLE_SWAP` dengan umpan balik "Biaya bergantung pada jarak, jadi biaya adalah y."

**Event:** `variable_define{problemId, x, y, correct, errorType}`.

---

## F-26 Representasi Ganda Tersinkron
**Sumber:** literasi (LM-8); EL02 (paham dari gambar), GL02 (validasi dengan grafik).
**Tujuan:** Menghubungkan **teks ↔ tabel ↔ grafik ↔ persamaan** sehingga siswa melihat satu situasi dalam empat bentuk.

**Perilaku**
- Panel dengan 4 tab (ponsel) atau 2×2 (layar lebar): **Cerita · Tabel · Grafik · Persamaan**.
- Mengubah nilai m atau c (slider/isian) memperbarui tabel, grafik, dan persamaan secara serentak.
- Menyorot satu baris tabel ikut menyorot titik di grafik dan bagian cerita yang sesuai.
- Warna peran: laju (hijau) dan nilai awal (ungu) konsisten di keempat representasi; pada grafik, c ditandai titik ungu di sumbu y dan laju ditandai segitiga *rise/run* (F-06).
- Soal **menjodohkan**: pasangkan cerita ↔ grafik ↔ persamaan (seret atau ketuk).

**Kriteria penerimaan**
- *Given* m diubah dari 2.500 ke 3.000, *then* tabel, grafik, dan persamaan berubah dalam < 50 ms.

**Event:** `representation_switch{from, to}`, `matching_submit{correct, pairs}`.

---

## F-27 Pemeriksa Model
**Sumber:** literasi (LM-3, LM-4); GL03 (butuh tahu cara yang dipakai).
**Tujuan:** Umpan balik spesifik atas model buatan siswa.

**Perilaku**
- Siswa menyusun model dengan dua cara (pilihan):
  - **Isian terstruktur:** `y = [ m ] x + [ c ]` dengan kotak hijau dan ungu.
  - **Ketik bebas** dengan `EquationInput` (keypad khusus: x, y, =, +, −, /, angka).
- Pemeriksaan offline: `modelCheck.js` membandingkan dengan `accepted_forms` dan nilai m, c hasil Python. Bentuk setara diterima (`y = 5000 + 2500x`).
- Diagnosis memakai `errorType` di [MODELING_ENGINE §7](MODELING_ENGINE.md) (`RATE_INITIAL_SWAP`, `MISSING_INITIAL`, `SIGN_DIRECTION`, `UNIT_MISMATCH`, `RATE_FROM_TOTAL`, …).
- Grafik model siswa ditumpangkan pada data soal (garis putus-putus hijau) sehingga ketidakcocokan terlihat (F-15).

**Kriteria penerimaan**
- *Given* model benar `y = 2500x + 5000`, *when* siswa mengetik `y = 5000 + 2500x`, *then* diterima.
- *Given* siswa mengetik `y = 5000x + 2500`, *then* `RATE_INITIAL_SWAP` dan umpan balik yang sesuai tampil.

**Event:** `model_submit{problemId, input, mode, correct, errorType, attempt}`.

---

## F-28 Penyelesai & Penjelas Langkah
**Sumber:** literasi (LM-5); K02 (contoh langkah demi langkah), DS02 (perhitungan pelan).
**Tujuan:** Menyelesaikan model dan menampilkan langkah lengkap yang dihasilkan mesin Python.

**Perilaku**
- Di tahap **Selesaikan**, siswa mengerjakan sendiri dengan `StepRunner` (substitusi, lalu hitung). Langkah dan micro-step berasal dari `solution.steps` (dibangun Python).
- Tombol 📘 "Lihat penyelesaian lengkap" (on-demand) menampilkan seluruh langkah 5 tahap, termasuk alasan setiap langkah. Setelah dibuka, soal ditandai "dibantu".
- Jenis tugas yang didukung: hitung laju, nilai awal, susun model, prediksi, invers, titik potong & perbandingan, kemiringan fisik & persen kemiringan, sejajar/tegak lurus (T1–T10).

**Kriteria penerimaan**
- *Given* soal T8 "Berapa km jika membayar Rp30.000?" dengan model `y = 2500x + 5000`, *then* langkah menampilkan `30000 = 2500x + 5000 → 25000 = 2500x → x = 10`, setiap baris satu langkah.

**Event:** `solve_step_submit{problemId, step, correct, errorType}`, `full_solution_open{problemId}`.

---

## F-29 Tafsirkan & Periksa Kewajaran
**Sumber:** literasi (LM-6, LM-7); GL02 (yakin karena melihat grafik).
**Tujuan:** Mengembalikan jawaban matematis ke konteks dan membiasakan evaluasi.

**Perilaku**
- **Tafsirkan:** siswa melengkapi kalimat jawaban dengan kepingan kata atau ketik bebas:
  > "Biaya perjalanan sejauh [8] [km] adalah [Rp25.000]."
  Pemeriksaan: angka dan satuan otomatis; makna dicek dari kata kunci; isian bebas dicatat untuk rubrik.
- **Periksa:** 1–2 pertanyaan kewajaran yang dibangun Python, misalnya:
  - "Jika jaraknya 0 km, berapa biayanya? Masuk akal?"
  - "Cari titik (8, 25.000) di grafik. Apakah ada di garis?" (tombol Cek di Grafik)
  - "Bisakah waktu bernilai negatif?"
- Jika siswa mendeteksi bahwa jawabannya tidak wajar, tersedia tombol "Perbaiki model" → kembali ke Rumuskan (F-24).

**Kriteria penerimaan**
- *Given* jawaban "25000" tanpa satuan, *then* `INTERPRET_NO_UNIT` dan siswa diminta melengkapi makna.

**Event:** `interpret_submit{problemId, text, numberCorrect, unitCorrect}`, `reasonableness_answer{problemId, questionId, answer, correct}`.

---

## F-30 Bank Soal Literasi Kontekstual
**Sumber:** literasi; DS01 (contoh bergambar), GL05 (contoh serupa).
**Tujuan:** Menyediakan variasi soal cerita yang kaya konteks dan selaras dengan AKM Numerasi.

**Perilaku**
- Minimal **120 soal sumber** (YAML) untuk v1.0, masing-masing dengan 3–5 variasi angka hasil generator Python. Komposisinya:
  - Jenis T1–T10 (≥ 8 soal per jenis untuk T1–T8, ≥ 5 untuk T9–T10).
  - Konteks: personal 40%, sosial-budaya 35%, saintifik 25%; konteks lokal Indonesia.
  - Level konteks K-A s.d. K-D; level kognitif pemahaman/penerapan/penalaran.
  - Bentuk: pilihan ganda, PG kompleks, menjodohkan, isian, uraian.
- Stimulus dapat berupa teks, tabel, grafik, atau infografis sederhana (SVG).
- Filter latihan: jenis, konteks, level. Default urutan: K-A → K-D (*fading* dukungan membaca).
- **Contoh Analog (F-18)** untuk soal cerita memilih soal dengan jenis T yang sama tetapi konteks berbeda, sehingga mendorong transfer.

**Kriteria penerimaan**
- `build-content` gagal jika ada soal tanpa anotasi `known`/`asked` atau tanpa solusi. Jika parser memberi hasil berbeda dari model yang ditulis, CLI memberi peringatan yang harus ditinjau.

**Event:** `wordproblem_start{problemId, type, context, contextLevel}`, `wordproblem_complete{problemId, score, hintsUsed, durationMs}`.

---

## F-31 Input Soal Cerita Bebas (online)
**Sumber:** literasi. Siswa/guru memodelkan soal cerita dari buku/LKS sendiri.
**Tujuan:** Memperluas jangkauan pemodelan ke soal apa pun yang masih termasuk jenis T1–T10.

**Perilaku**
- Layar "Modelkan Soalku": siswa/guru mengetik atau menempel teks soal (≤ 1.000 karakter).
- Aplikasi memanggil API `POST /v1/parse`:
  - Jika berhasil (`confidence ≥ 0,7`), siswa **tidak langsung** diberi jawaban. Siswa masuk ke siklus pemodelan (F-24) dengan soal tersebut; model hasil parser dipakai sebagai kunci.
  - Jika `needs_confirmation`, aplikasi bertanya hal yang ragu (mis. "Angka 5.000 itu biaya tetap atau per km?") dan siswa yang memutuskan. Ini sekaligus melatih tahap Rumuskan.
  - Jika tidak dikenali, tampil "Soal ini belum bisa dimodelkan aplikasi. Jenis yang didukung: …" disertai contoh.
- **Offline:** tombol dinonaktifkan dengan keterangan "Fitur ini memerlukan internet."
- Mode guru: tombol "Simpan sebagai soal latihan" → disimpan lokal, dan dapat diekspor sebagai YAML untuk ditambahkan ke bank soal.

**Kriteria penerimaan**
- *Given* teks "Harga 1 kg beras Rp14.000. Berapa harga 3,5 kg?", *then* parser mengenali T1, m = 14.000 rupiah/kg, tugas *predict* x = 7/2.
- *Given* API tidak dapat dijangkau, *then* pesan ramah tampil dalam ≤ 8 detik dan aplikasi tidak macet.
- Tidak ada kode peserta yang terkirim dalam permintaan API.

**Event:** `free_input_submit{length}`, `free_input_result{status, type, confidence}` (teks soal **tidak** dicatat kecuali mode riset diaktifkan peneliti).

---

## F-32 Kamus Konteks
**Sumber:** literasi; EL05 (mencari yang ditanyakan dulu), EL01.
**Tujuan:** Mengurangi beban membaca istilah sehari-hari/ekonomi/sains yang belum dikenal.

**Perilaku**
- Kata/frasa bertanda garis bawah titik-titik di soal (mis. "tarif awal", "per kilometer", "laju", "debit", "cicilan", "kemiringan jalan 8%") dapat diketuk.
- *Popover* berisi: arti singkat (≤ 15 kata) + **peran matematisnya** ("→ ini nilai awal **c**", ditampilkan dengan warna ungu).
- Daftar istilah dikelola di `content/glossary.yaml` dan dibangun bersama bank soal.

**Event:** `glossary_open{term, problemId}`.

---

## F-33 Buat Soal Ceritaku (*problem posing*)
**Sumber:** literasi (LM-9); GL04 (lebih paham saat menjelaskan ke teman).
**Tujuan:** Membalik arah pemodelan, dari model ke cerita, untuk memperdalam pemahaman makna m dan c.

**Perilaku**
- Siswa diberi model/grafik (mis. `y = 3000x + 2000`) dan diminta membuat cerita dengan templat terpandu:
  > "Di [tempat], biaya awal [Rp2.000] dan setiap [satuan] bertambah [Rp3.000]. Pertanyaannya: …"
- Jika online, cerita dapat dicek dengan parser (F-31): apakah model yang dikenali sama dengan model yang diberikan? Jika offline, siswa memeriksa sendiri dengan daftar cek.
- Soal buatan siswa tersimpan di "Catatanku" dan dapat ditukar dengan teman (ekspor teks/QR) untuk saling mengerjakan, sejalan dengan GL04.

**Event:** `posing_submit{modelId, length, parserMatch}`.
