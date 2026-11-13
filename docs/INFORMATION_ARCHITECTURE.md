# Arsitektur Informasi dan Alur Navigasi

## 1. Peta Layar

| Rute | Layar | Fitur utama |
|---|---|---|
| `/onboarding` | Onboarding (4 layar) | F-01 |
| `/` | Beranda (daftar modul, lanjutkan) | F-23 |
| `/module/:id/recap` | Quick Recap | F-03 |
| `/module/:id/learn/:chunk` | Materi per chunk | F-09, F-11, F-12, F-06, F-07 |
| `/module/:id/example/:exId` | Contoh step-by-step | F-02 |
| `/module/:id/practice/:setId` | Latihan | F-04, F-05, F-10, F-13–F-16, F-18–F-21 |
| `/module/:id/reflect` | Jelaskan Langkahmu | F-17 |
| `/module/:id/summary` | Poin Inti & hasil | F-12 |
| `/module/M7/problem/:id` dan `/module/M8/problem/:id` | Soal cerita dengan siklus pemodelan 5 tahap | F-24–F-30, F-32 |
| `/stories` | Bank Soal Cerita (filter jenis T, konteks, level) | F-30 |
| `/model-my-problem` | Modelkan Soalku (input soal bebas, online) | F-31 |
| `/posing` | Buat Soal Ceritaku | F-33 |
| `/explore` | Lab Grafik (slider m/c bebas) | F-07, F-14 |
| `/notes` | Catatanku (refleksi tersimpan, poin inti) | F-17 |
| `/progress` | Progresku | F-23 |
| `/settings` | Pengaturan (ukuran huruf, mode warna, peringatan tanda, tingkat bantuan) | F-11, F-20, F-21 |
| `/research` | Mode Peneliti (tersembunyi) | F-22 |

*Bottom sheet* (bukan rute): Hint (F-16), Contoh Analog (F-18), Recap (F-03), Micro-step (F-20), Integer Helper (F-04).

## 2. Alur Utama

```mermaid
flowchart TD
  Start([Buka aplikasi]) --> Q{Pertama kali?}
  Q -- Ya --> OB[Onboarding F-01]
  Q -- Tidak --> Home
  OB --> Home[Beranda]
  Home --> Mod[Pilih / Lanjutkan modul]
  Mod --> Recap[Quick Recap F-03]
  Recap --> Learn[Materi chunk 1..n F-09]
  Learn --> Ex[Contoh step-by-step F-02]
  Ex --> Prac[Latihan F-19]
  Prac --> Refl{Prompt refleksi?}
  Refl -- Tawarkan --> R[Jelaskan Langkahmu F-17]
  Refl -- Lewati --> Sum
  R --> Sum[Poin Inti & Hasil]
  Sum --> Home
  Home --> Lab[Lab Grafik]
  Home --> Notes[Catatanku]
  Home --> Set[Pengaturan]
```

## 3. Alur Satu Soal (Gradien Dua Titik)

```mermaid
flowchart TD
  S([Soal tampil + grafik]) --> K[Langkah 1: Diketahui/Ditanya F-05]
  K --> F[Langkah 2: Pilih/tulis rumus]
  F --> DY[Langkah 3: Hitung Δy]
  DY --> DX[Langkah 4: Hitung Δx]
  DX --> M[Langkah 5: m = Δy/Δx, sederhanakan]
  M --> V[Langkah 6: Cek di Grafik F-15]
  V --> E{Benar?}
  E -- Ya --> N([Soal berikutnya])
  E -- Tidak --> Fix[Ubah jawaban → self_correction]
  Fix --> M

  subgraph Bantuan["Bantuan opsional di setiap langkah"]
    H1[💡 Hint L1→L2→L3 F-16]
    H2[📖 Contoh Analog F-18]
    H3[🔢 Micro-step F-20]
    H4[± Garis bilangan F-04]
    H5[📌 Recap F-03]
  end
```

Setiap langkah: isi → **Cek** → umpan balik spesifik (errorClassifier) → benar: lanjut; salah: coba lagi (bantuan ditawarkan setelah 2 kali salah, tidak dipaksa).

## 3b. Alur Satu Soal Cerita (Siklus Pemodelan)

```mermaid
flowchart TD
  S([Soal cerita tampil]) --> P1["① Pahami: ketuk pertanyaan, pilih info relevan (F-13, F-32)"]
  P1 --> P2a["② Rumuskan: tentukan x, y, dan satuan (F-25)"]
  P2a --> P2b["② Rumuskan: laju m dan nilai awal c (F-26)"]
  P2b --> P2c["② Rumuskan: susun y = mx + c (F-27)"]
  P2c --> P3["③ Selesaikan: substitusi dan hitung (F-28, F-20)"]
  P3 --> P4["④ Tafsirkan: kalimat jawaban + satuan (F-29)"]
  P4 --> P5{"⑤ Periksa: wajar? cocok di grafik/tabel?"}
  P5 -- Ya --> Done([Soal selesai, refleksi opsional F-17])
  P5 -- Tidak --> P2c
```

## 3c. Alur Modelkan Soalku (online)

```mermaid
flowchart TD
  In([Ketik/tempel soal]) --> Net{Online?}
  Net -- Tidak --> Off[Pesan: fitur perlu internet]
  Net -- Ya --> API[POST /v1/parse]
  API --> R{Status}
  R -- ok --> Cycle[Masuk siklus pemodelan F-24]
  R -- needs_confirmation --> Ask[Tanya pengguna: peran angka yang ragu] --> Cycle
  R -- unsupported --> Info[Jelaskan jenis soal yang didukung + contoh]
```

## 4. Navigasi Global

- **Ponsel:** *top app bar* (kembali, judul, progres) + tombol navigasi bawah per layar. Tidak ada *bottom tab bar* di dalam modul agar fokus.
- **Beranda:** akses ke Lab Grafik, Catatanku, Progresku, dan Pengaturan.
- Tombol *back* Android = langkah sebelumnya. Keluar dari modul meminta konfirmasi; posisi otomatis tersimpan.

## 5. Status yang Disimpan

| Kunci | Isi |
|---|---|
| `onboardingDone` | boolean |
| `progress[moduleId]` | `{ status, lastChunk, practiceBest, completedAt }` |
| `settings` | `{ fontScale, colorMode, signWarning, helpLevel }` |
| `notes[]` | refleksi siswa |
| `posedProblems[]` | soal cerita buatan siswa (F-33) |
| `wordProblemProgress[id]` | `{ stageReached, completed, assisted }` |
| `research` | `{ participantCode, group, enabled }` |
| `events[]` | log analytics (IndexedDB) |
