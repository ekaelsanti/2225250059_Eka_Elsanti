# Product Requirements Document (PRD): GradieKAn

| Atribut | Nilai |
|---|---|
| Tanggal | 10 November 2026 |
| Pemilik | Eka Elsanti |
| Status | Perencanaan |
| Versi | 1.1 (draf): menambahkan literasi matematika, pemodelan soal cerita, dan stack JavaScript + Python |
| Dokumen terkait | [RESEARCH_SYNTHESIS](RESEARCH_SYNTHESIS.md), [MATH_LITERACY](MATH_LITERACY.md), [MODELING_ENGINE](MODELING_ENGINE.md), [FEATURES](FEATURES.md), [TRACEABILITY_MATRIX](TRACEABILITY_MATRIX.md) |

---

## 1. Ringkasan

GradieKAn adalah aplikasi web dan Android untuk siswa SMP dengan tiga tujuan:

1. **Memahami dan menghitung kemiringan (gradien) garis lurus** dengan beban kognitif yang terkelola: gambar dulu, rumus kemudian; langkah kecil; warna konsisten; bantuan bertingkat yang hanya muncul jika diminta.
2. **Menumbuhkembangkan literasi matematika** (PISA 2022, AKM Numerasi): merumuskan, menerapkan, menafsirkan, dan mengevaluasi matematika dalam konteks nyata.
3. **Memodelkan berbagai soal cerita** ke dalam model matematika linear (`y = mx + c`), menyelesaikannya, dan menafsirkan hasilnya melalui siklus pemodelan 5 tahap.

Aplikasi dibangun dengan **JavaScript** (aplikasi web/Android) dan **Python** (mesin matematika dan pemodelan berbasis SymPy).

## 2. Latar Belakang dan Masalah

Wawancara dengan siswa S01 (kelas 9F, sudah mempelajari materi di kelas VIII) menunjukkan:

1. **Materi terasa menakutkan sebelum dijelaskan**, padahal setelah dijelaskan bertahap ternyata mudah (K01).
2. **Kesulitan utama ada pada operasi bilangan negatif** dan pada banyaknya langkah yang harus diproses bersamaan: menentukan titik, memasukkan ke rumus, lalu menghitung (IL01, IL02, IL04).
3. **Kesalahan lebih sering karena tergesa-gesa dan keliru hitung** daripada salah konsep (IL05, DS02).
4. **Siswa sangat bergantung pada gambar dan contoh soal** untuk memahami dan memvalidasi jawaban (K02, EL02, GL02, GL05, DS01).
5. **Saat bingung, siswa langsung bertanya ke guru** dan belum mampu belajar mandiri (EL01, GL03).
6. **Siswa memahami lebih dalam saat menggambar grafik sendiri dan saat menjelaskan ke teman** (GL01, GL04).
7. **Kebutuhan bantuan berbeda-beda tiap siswa** (DS03).

8. **Literasi matematika siswa Indonesia masih perlu ditingkatkan.** Hasil PISA dan Asesmen Nasional menunjukkan banyak siswa kesulitan mengubah situasi nyata menjadi model matematika dan menafsirkan hasilnya. Pada materi ini, siswa terbiasa menghitung gradien dari titik yang sudah diberikan, tetapi jarang memaknai gradien sebagai **laju perubahan** dalam konteks (tarif per km, kecepatan, harga per kg). Strategi S01 "mencari apa yang ditanyakan dulu" (EL05) dan "melihat contoh sebelumnya" (GL05) menunjukkan kebutuhan dukungan untuk memahami soal cerita.

**Pernyataan masalah:** Siswa SMP kesulitan menyelesaikan soal gradien secara mandiri karena beban kognitif intrinsik (bilangan negatif, banyak langkah) dan ekstrinsik (penjelasan panjang dan menumpuk) yang tinggi. Mereka juga belum punya alat untuk memvalidasi jawaban sendiri tanpa guru, dan belum terlatih memodelkan soal cerita kontekstual ke dalam bentuk matematika.

## 3. Tujuan dan Metrik Keberhasilan

| ID | Tujuan | Metrik | Target uji coba |
|---|---|---|---|
| G1 | Siswa mampu menghitung gradien dengan benar secara mandiri | Skor posttest − pretest (soal gradien) | *N-gain* ≥ 0,3 (kategori sedang) |
| G2 | Mengurangi kesalahan hitung tanda negatif | Proporsi `error_type = SIGN_ERROR` pada percobaan pertama, sesi awal vs akhir | Turun ≥ 30% |
| G3 | Beban kognitif ekstrinsik terasa rendah | Skor EL pada kuesioner beban kognitif (Leppink dkk., 2013) | Rata-rata EL ≤ 4 dari 10 |
| G4 | Siswa makin mandiri | Rata-rata tingkat *hint* per soal, latihan awal vs akhir | Menurun |
| G5 | Aplikasi mudah digunakan | System Usability Scale (SUS) | ≥ 68 |
| G6 | Siswa dapat memvalidasi jawaban sendiri | % siswa yang mendeteksi kesalahan sendiri lewat grafik pada tugas uji | ≥ 60% |
| G7 | Literasi matematika meningkat | Skor tes literasi (soal AKM resmi + buatan sendiri; pretest–posttest) | *N-gain* ≥ 0,3 |
| G8 | Siswa mampu memodelkan soal cerita | Skor rubrik pemodelan (Merumuskan, Menerapkan, Menafsirkan, Mengevaluasi; maks. 8) | Rata-rata posttest ≥ 6 |
| G9 | Model buatan siswa makin tepat | % `model_submit` benar pada percobaan pertama, set awal vs akhir | Naik ≥ 25 poin persen |
| G10 | Parser soal cerita andal | Akurasi parser pada korpus uji T1–T8 | ≥ 85% benar; 0% salah tanpa konfirmasi |

Detail pengukuran ada di [ANALYTICS_RESEARCH_PLAN.md](ANALYTICS_RESEARCH_PLAN.md).

## 4. Pengguna dan Persona

### P1. Siswa (pengguna utama)
- Siswa SMP kelas VIII–IX, usia 13–15 tahun, belajar dengan ponsel Android kelas menengah ke bawah atau laptop/PC sekolah.
- **Diturunkan dari S01:** belajar dengan mencatat dan memperhatikan gambar guru; ingat bentuk garis tetapi lupa rumus; sering keliru pada bilangan negatif; mencari "apa yang ditanyakan" terlebih dahulu pada soal panjang; terbantu warna; lebih paham saat menggambar dan menjelaskan.
- **Kebutuhan:** penjelasan santai dan berurutan, contoh bergambar, cara cek jawaban sendiri, bantuan hanya saat perlu.

### P2. Guru Matematika (pengguna sekunder)
- Memakai aplikasi sebagai media pembelajaran di kelas atau tugas rumah.
- **Kebutuhan:** materi selaras dengan buku/LKS kelas VIII; dapat melihat ringkasan progres siswa di perangkat siswa; dapat **memasukkan soal cerita sendiri** dari buku/LKS untuk dimodelkan aplikasi; dapat menulis soal baru dalam format YAML sederhana.

### P3. Peneliti/Pengembang (Eka Elsanti)
- Menguji apakah fitur berbasis CLT efektif.
- **Kebutuhan:** log interaksi yang dapat diekspor (CSV/JSON), mode peneliti untuk mengisi kode peserta, dan data yang dapat dipetakan ke setiap fitur.

## 5. Ruang Lingkup

### 5.1 Dalam lingkup (MVP)
Materi Kemiringan Garis Lurus:
1. Cek prasyarat singkat: bilangan bulat negatif, koordinat Kartesius, pecahan.
2. Konsep kemiringan dalam konteks sehari-hari.
3. Gradien dari grafik (*rise over run*).
4. Arah gradien: positif, negatif, nol, tak terdefinisi.
5. Gradien dari dua titik.
6. Gradien dari persamaan `y = mx + c` dan `ax + by + c = 0`.
7. Gradien garis sejajar dan tegak lurus.
8. **Pemodelan soal cerita linear (M7):** jenis T1–T8, yaitu proporsional, laju + nilai awal, dua data, tabel, grafik, laju menurun, kemiringan fisik, dan invers.
9. **Membandingkan dua model (M8):** jenis T9–T10, yaitu perbandingan paket/titik potong dan sejajar/tegak lurus dalam konteks.
10. **Literasi matematika** terintegrasi di semua modul: soal kontekstual bergaya AKM, siklus pemodelan 5 tahap, dan indikator LM-1 s.d. LM-9 ([MATH_LITERACY](MATH_LITERACY.md)).
11. **Input soal cerita bebas** lewat API Python (online, opsional).

Platform: web (PWA, dapat dipasang dan dipakai *offline*) dan APK Android.
Bahasa pemrograman: **JavaScript** (aplikasi) dan **Python** (mesin matematika & pemodelan).

> Menyusun persamaan garis (`y = mx + c`) dari laju dan nilai awal **termasuk** dalam lingkup sebagai bagian dari pemodelan (M7). Menyusun persamaan garis dari satu titik dan gradien secara formal (`y − y₁ = m(x − x₁)`) tetap di luar lingkup v1.

### 5.2 Di luar lingkup (*non-goals*) v1
- Rumus formal `y − y₁ = m(x − x₁)` dan SPLDV penuh dengan metode eliminasi/substitusi (rencana v2; titik potong T9 diselesaikan dengan menyamakan dua model).
- Soal cerita non-linear (kuadrat, eksponen).
- Akun, *login*, sinkronisasi *cloud*, dan dasbor guru *online*.
- *Leaderboard* atau gamifikasi kompetitif.
- iOS.
- AI generatif/*chatbot*; parser soal cerita berbasis aturan (ADR-08).

## 6. Kebutuhan Fungsional (*User Stories*)

Format: **US-xx** — Sebagai [peran], saya ingin [tujuan], agar [manfaat]. Fitur terkait dan kode riset dicantumkan. Kriteria penerimaan lengkap ada di [FEATURES.md](FEATURES.md).

| ID | User story | Fitur | Riset | Prioritas |
|---|---|---|---|---|
| US-01 | Sebagai siswa, saya ingin pengenalan materi yang bertahap saat pertama membuka aplikasi, agar materi tidak terasa menakutkan | F-01 | K01 | Must |
| US-02 | Sebagai siswa, saya ingin contoh soal bergambar yang diselesaikan langkah demi langkah, agar saya bisa meniru caranya | F-02 | K02 | Must |
| US-03 | Sebagai siswa, saya ingin ringkasan singkat komponen grafik dan rumus sebelum latihan, agar ingatan saya segar kembali | F-03 | K03 | Must |
| US-04 | Sebagai siswa, saya ingin dibantu menghitung pengurangan bilangan negatif, agar saya tidak keliru tanda | F-04 | IL01 | Must |
| US-05 | Sebagai siswa, saya ingin kolom isian titik pertama dan kedua yang berwarna berbeda, agar nilai x₁, y₁, x₂, y₂ tidak tertukar | F-05 | IL02 | Must |
| US-06 | Sebagai siswa, saya ingin melihat langkah naik/turun dan ke kanan pada grafik, agar paham arti gradien pecahan | F-06 | IL03 | Must |
| US-07 | Sebagai siswa, saya ingin menggeser nilai m dan langsung melihat kemiringan garis berubah, agar paham arti tanda positif/negatif | F-07 | IL04 | Must |
| US-08 | Sebagai siswa, saya ingin membandingkan beberapa persamaan berdampingan, agar dapat mengenali m dan c | F-08 | IL05 | Should |
| US-09 | Sebagai siswa, saya ingin materi disajikan satu langkah per layar dengan poin penting ditandai, agar tidak pusing | F-09 | EL01 | Must |
| US-10 | Sebagai siswa, saya ingin pengerjaan soal dalam alur isian bertahap yang bersih, agar rumus tidak menumpuk | F-10 | EL02 | Must |
| US-11 | Sebagai siswa, saya ingin warna yang sama untuk variabel yang sama di teks, rumus, dan grafik, agar mudah dihubungkan | F-11 | EL03 | Must |
| US-12 | Sebagai siswa, saya ingin mengatur kecepatan belajar sendiri, agar tidak terburu-buru | F-12 | EL04 | Must |
| US-13 | Sebagai siswa, saya ingin bagian "Diketahui" dan "Ditanya" disorot, agar cepat menemukan inti soal | F-13 | EL05 | Should |
| US-14 | Sebagai siswa, saya ingin menggambar garis sendiri di bidang Kartesius, agar lebih paham | F-14 | GL01 | Must |
| US-15 | Sebagai siswa, saya ingin memeriksa jawaban saya pada grafik, agar yakin jawaban saya benar | F-15 | GL02 | Must |
| US-16 | Sebagai siswa, saya ingin petunjuk bertingkat saat bingung, agar bisa lanjut tanpa langsung diberi jawaban | F-16 | GL03 | Must |
| US-17 | Sebagai siswa, saya ingin menjelaskan langkah saya dengan kata-kata sendiri, agar pemahaman saya semakin kuat | F-17 | GL04 | Should |
| US-18 | Sebagai siswa, saya ingin membuka contoh serupa saat mengerjakan soal baru, agar bisa membandingkan caranya | F-18 | GL05 | Must |
| US-19 | Sebagai siswa, saya ingin latihan yang terintegrasi dengan contoh visual interaktif | F-19 | DS01 | Must |
| US-20 | Sebagai siswa, saya ingin perhitungan bagi/kurang dijelaskan perlahan, agar tidak keliru | F-20 | DS02 | Must |
| US-21 | Sebagai siswa, saya ingin memilih sendiri kapan memakai bantuan | F-21 | DS03 | Must |
| US-22 | Sebagai peneliti, saya ingin mengekspor log penggunaan per peserta ke CSV/JSON, agar dapat dianalisis | F-22 | — | Must |
| US-23 | Sebagai guru, saya ingin melihat ringkasan progres siswa di perangkat, agar tahu modul yang sudah selesai | F-23 | — | Could |
| US-24 | Sebagai siswa, saya ingin dipandu tahap demi tahap (Pahami → Rumuskan → Selesaikan → Tafsirkan → Periksa) saat mengerjakan soal cerita, agar tidak bingung harus mulai dari mana | F-24 | LM, EL01 | Must |
| US-25 | Sebagai siswa, saya ingin menentukan dulu apa arti x dan y beserta satuannya, agar tidak tertukar saat membuat model | F-25 | LM-2, IL02 | Must |
| US-26 | Sebagai siswa, saya ingin melihat cerita, tabel, grafik, dan persamaan yang saling terhubung, agar paham bahwa semuanya menggambarkan situasi yang sama | F-26 | LM-8, EL02 | Must |
| US-27 | Sebagai siswa, saya ingin model yang saya buat diperiksa dan diberi tahu letak kesalahannya, agar bisa memperbaikinya sendiri | F-27 | LM-3/4, GL03 | Must |
| US-28 | Sebagai siswa, saya ingin melihat penyelesaian langkah demi langkah jika saya membutuhkannya | F-28 | LM-5, K02 | Must |
| US-29 | Sebagai siswa, saya ingin menuliskan arti jawaban dalam cerita dan memeriksa apakah masuk akal | F-29 | LM-6/7, GL02 | Must |
| US-30 | Sebagai siswa, saya ingin berlatih banyak jenis soal cerita dari kehidupan sehari-hari | F-30 | LM, DS01 | Must |
| US-31 | Sebagai siswa/guru, saya ingin mengetik soal cerita dari buku sendiri lalu dibantu memodelkannya | F-31 | LM | Should |
| US-32 | Sebagai siswa, saya ingin mengetuk istilah yang tidak saya pahami di soal cerita | F-32 | EL05 | Should |
| US-33 | Sebagai siswa, saya ingin membuat soal cerita sendiri dari sebuah persamaan dan menukarnya dengan teman | F-33 | LM-9, GL04 | Could |

## 7. Kebutuhan Non-Fungsional

| ID | Kategori | Kebutuhan |
|---|---|---|
| NFR-01 | Platform | Berjalan di Chrome/Edge/Firefox versi terbaru dan Android 8.0 (API 26) ke atas |
| NFR-02 | Offline | Seluruh materi dan latihan dapat dipakai tanpa internet setelah pemasangan pertama |
| NFR-03 | Performa | Muat awal ≤ 3 detik di 4G pada ponsel kelas menengah; interaksi grafik ≥ 50 fps; ukuran *bundle* awal ≤ 500 KB gzip |
| NFR-04 | Ukuran APK | ≤ 15 MB |
| NFR-05 | Aksesibilitas | Kontras teks WCAG AA (4,5:1); target sentuh ≥ 48 dp; warna tidak menjadi satu-satunya pembeda; ukuran huruf dapat diperbesar |
| NFR-06 | Privasi | Tidak ada data yang keluar dari perangkat; tidak ada nama asli; ekspor hanya atas tindakan pengguna |
| NFR-07 | Bahasa | Antarmuka berbahasa Indonesia |
| NFR-08 | Ketepatan | Semua pemeriksaan jawaban memakai aritmetika pecahan eksak |
| NFR-09 | Pemeliharaan | Materi dapat diubah lewat JSON dan soal cerita lewat YAML tanpa mengubah kode komponen |
| NFR-10 | Teknologi | Aplikasi ditulis dalam **JavaScript** (React); mesin matematika & pemodelan ditulis dalam **Python** (SymPy, FastAPI) |
| NFR-11 | API | Respons p95 < 500 ms; tersedia ≥ 99% selama periode uji coba; tanpa data identitas siswa; tidak menyimpan isi permintaan |
| NFR-12 | Konsistensi | Hasil pemeriksaan JavaScript dan Python identik pada seluruh vektor uji bersama |
| NFR-13 | Offline | Hanya F-31 yang membutuhkan internet; fitur lain 100% berfungsi offline |

## 8. Prioritas (MoSCoW)

- **Must:** F-01–F-07, F-09–F-12, F-14–F-16, F-18–F-22, F-24–F-30
- **Should:** F-08, F-13, F-17, F-31, F-32
- **Could:** F-23, F-33, mode gelap, pembesaran huruf, efek suara opsional
- **Won't (v1):** akun, *cloud*, iOS, *leaderboard*, LLM

## 9. Asumsi

- Siswa memiliki akses ke ponsel Android atau komputer dengan peramban modern.
- Guru atau peneliti mendampingi pada sesi uji coba pertama.
- Urutan dan cakupan materi selaras dengan buku/LKS Matematika SMP Kelas VIII yang digunakan sekolah.

## 10. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Temuan berasal dari **satu** siswa (n = 1) | Fitur bisa tidak mewakili kebutuhan siswa lain | Perlakukan sebagai hipotesis desain; lakukan uji kegunaan dengan 5–8 siswa sebelum uji efektivitas |
| Fitur bantuan terlalu banyak sehingga justru menambah EL | Tampilan ramai | Semua bantuan tersembunyi di balik tombol (F-21); uji A/B tampilan saat uji kegunaan |
| Interaksi *drag* sulit di layar kecil | Frustrasi | Titik *snap* ke grid; ukuran pegangan ≥ 44 px; alternatif input angka |
| Siswa menebak-nebak sampai benar | Data tidak valid | Hitung jumlah percobaan; setelah 2 kali salah tawarkan *hint* (tidak memaksa) |
| Waktu pengembangan terbatas | MVP tidak selesai | Kerjakan Must terlebih dahulu sesuai [ROADMAP](ROADMAP.md) |
| Soal cerita panjang menaikkan beban ekstrinsik | Siswa kewalahan, bertentangan dengan temuan EL01/EL05 | Kompleksitas konteks bertahap K-A → K-D, Sorot Info, Kamus Konteks, satu tahap per layar ([MATH_LITERACY §5](MATH_LITERACY.md)) |
| Parser salah memahami soal bebas | Kunci jawaban salah | Parser wajib meminta konfirmasi saat ragu; F-31 berstatus Should; bank soal utama dikurasi manusia |
| Dua bahasa (JS + Python) menambah kerumitan | Perilaku berbeda antarbahasa, waktu pengembangan bertambah | Python sebagai acuan kebenaran; vektor uji bersama; skema tunggal Pydantic → JSON Schema |
| Biaya/ketersediaan hosting API Python | F-31 tidak tersedia | Fitur inti offline; gunakan layanan gratis/server kampus; F-31 tidak termasuk alur wajib |

## 11. Rencana Rilis

| Rilis | Isi | Tujuan |
|---|---|---|
| v0.1 Prototipe | Bidang Kartesius, slider m, gradien dua titik dengan *micro-step*; kerangka mesin Python (solver + build-content untuk 10 soal cerita) | Uji kegunaan awal (3–5 siswa) |
| v0.5 Alpha | Modul M0–M7 + fitur Must, termasuk siklus pemodelan dan 60 soal cerita | Uji kegunaan dan revisi |
| v1.0 | M8, fitur Should (termasuk API F-31), 120+ soal cerita, ekspor data, APK | Uji coba efektivitas (gradien + literasi) di kelas |

## 12. Pertanyaan Terbuka

1. Apakah buku/LKS sekolah memakai notasi `y = mx + c` atau `y = mx + b`? (Default: `c`.)
2. Berapa jumlah siswa dan kelas yang tersedia untuk uji coba?
3. Apakah sekolah mengizinkan pemasangan APK di luar Play Store, atau cukup PWA?
4. Apakah diperlukan persetujuan etik dari kampus untuk pengumpulan data siswa?
5. Di mana API Python akan di-*hosting* selama uji coba (layanan gratis, server kampus, atau laptop peneliti di jaringan lokal sekolah)?
6. ~~Sumber soal tes literasi?~~ **Diputuskan:** campuran 4 soal AKM resmi + 8 soal buatan sendiri per paket ([ANALYTICS_RESEARCH_PLAN §3b](ANALYTICS_RESEARCH_PLAN.md)).
