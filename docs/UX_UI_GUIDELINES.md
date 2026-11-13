# Panduan UX/UI

## 1. Prinsip Desain

| # | Prinsip | Penerapan | Riset |
|---|---|---|---|
| 1 | **Gambar dulu, rumus kemudian** | Grafik/ilustrasi di atas, teks dan rumus di bawah | K02, EL02 |
| 2 | **Satu langkah per layar** | `StepRunner`; ≤ 3 kalimat, ≤ 1 rumus, ≤ 1 gambar per layar | EL01 |
| 3 | **Warna = makna** | Warna variabel konsisten di teks, rumus, dan grafik | EL03, IL02 |
| 4 | **Tenang, tanpa tekanan** | Tanpa *timer*, tanpa suara kalah, tanpa animasi mengganggu | IL05, EL04 |
| 5 | **Bantuan ada, tapi diam** | Bilah bantuan konsisten; tidak ada *pop-up* otomatis | DS03 |
| 6 | **Selalu bisa dicek** | Tombol "Cek di Grafik" pada setiap jawaban gradien | GL02 |
| 7 | **Kesalahan adalah petunjuk** | Umpan balik spesifik dan ramah | IL05 |

## 2. Tata Letak

### Ponsel (≥ 360 px)
```
┌──────────────────────────────┐
│ ←  M4 Gradien Dua Titik  3/8 │  ← header + progres
├──────────────────────────────┤
│                              │
│      [ GRAFIK KARTESIUS ]    │  ← sticky, ± 45% tinggi layar
│                              │
├──────────────────────────────┤
│ Langkah 3: Hitung Δy         │
│ Δy = y₂ − y₁                 │  ← satu isian aktif
│    = [ 5 ] − ( [-2] )        │
│    = [    ]          [Cek]   │
├──────────────────────────────┤
│ 💡Petunjuk 📖Contoh 🔢Pelan 📌│  ← bilah bantuan (bisa diciutkan)
├──────────────────────────────┤
│ [ ‹ Kembali ]   [ Lanjut › ] │  ← navigasi tetap di bawah
└──────────────────────────────┘
```

### Layar lebar (≥ 900 px)
Dua kolom: grafik di kiri (55%), langkah dan bantuan di kanan (45%). Lebar konten maksimum 1200 px.

## 3. Sistem Warna

### 3.1 Warna peran variabel (`apps/web/src/styles/tokens.js`)

| Token | Peran | Standar | Ramah buta warna* |
|---|---|---|---|
| `point1` | x₁, y₁, titik 1 | `#2563EB` biru | `#0072B2` |
| `point2` | x₂, y₂, titik 2 | `#EA580C` oranye | `#E69F00` |
| `slope` | m, gradien, garis jawaban | `#16A34A` hijau | `#009E73` |
| `intercept` | c, titik potong sumbu y | `#7C3AED` ungu | `#CC79A7` |
| `rise` | Δy (naik/turun) | `#DB2777` magenta | `#D55E00` |
| `run` | Δx (jalan ke kanan) | `#0891B2` sian | `#56B4E9` |

\* Palet Okabe–Ito. Semua elemen berwarna **wajib** disertai label/subskrip.

**Pada soal cerita**, warna peran tetap sama: angka laju di teks soal digarisbawahi **hijau** (`slope`), nilai awal digarisbawahi **ungu** (`intercept`), dan pertanyaan berlatar hijau muda. Informasi pengecoh tidak diberi warna.

### 3.2 Warna antarmuka

| Token | Nilai | Pakai untuk |
|---|---|---|
| `bg` | `#FAFAF7` | Latar utama (krem lembut, kurang silau) |
| `surface` | `#FFFFFF` | Kartu |
| `text` | `#1F2937` | Teks utama |
| `textMuted` | `#6B7280` | Langkah selesai, keterangan |
| `primary` | `#1D4ED8` | Tombol utama |
| `success` | `#15803D` + ikon ✔ | Benar |
| `warning` | `#B45309` + ikon ⚠ | Peringatan tanda |
| `error` | `#B91C1C` + ikon ✖ | Belum tepat (dipakai hemat) |
| `keypoint` | `#FEF3C7` | Latar kotak ⭐ Poin Inti |
| `grid` | `#E5E7EB` | Grid grafik; sumbu `#374151` |

Mode gelap: rencana v1.1 (Could).

## 4. Tipografi

- Font: **Inter** atau *system UI* untuk teks; **KaTeX** untuk rumus.
- Ukuran: isi 16–18 px (ponsel 17 px), judul layar 20–22 px, rumus 1,2× ukuran teks.
- Tinggi baris 1,5. Panjang baris maksimum ± 65 karakter.
- Pengaturan "Ukuran huruf": Normal / Besar (+20%).

## 5. Komponen Inti

| Komponen | Deskripsi |
|---|---|
| `CartesianPlane` | Grid SVG, sumbu, label, titik *snap*, garis, overlay *rise/run* |
| `SlopeSlider` | Slider m/c dengan label status arah |
| `StepRunner` | Menampilkan satu langkah aktif; langkah selesai diringkas |
| `KnownAskedForm` | Isian titik 1/titik 2 berwarna (F-05) |
| `MicroStep` | Baris-baris operasi pelan (F-20) |
| `ColoredVar` | Variabel dengan warna peran |
| `KeyPoint` | Kotak ⭐ poin inti |
| `HelpBar` | Bilah bantuan (F-21) |
| `HintSheet`, `AnalogSheet`, `RecapSheet` | *Bottom sheet* bantuan |
| `FeedbackBanner` | Umpan balik benar/salah dengan ikon + teks |

## 6. Interaksi

- Target sentuh ≥ 48×48 dp; pegangan titik grafik ≥ 44 px area.
- Titik grafik **snap** ke bilangan bulat; tampilkan koordinat saat digeser.
- *Keyboard* angka (`inputmode="numeric"`) dengan tombol `−` dan `/` khusus. Disediakan *keypad* sendiri di dalam aplikasi agar tanda minus mudah dijangkau di Android.
- Animasi ≤ 300 ms, *ease-out*, dan hanya untuk menunjukkan perubahan (bukan dekorasi). Hormati `prefers-reduced-motion`.
- Umpan balik "Benar" per jawaban cukup ✔ hijau + kalimat singkat + bunyi "ting" lembut. **Konfeti hanya untuk pencapaian**: menyelesaikan satu bab materi atau satu soal cerita (keputusan pemilik proyek, 12 Nov 2026).
- **Efek suara** (Web Audio, tanpa file): "ting" dua nada untuk benar, nada lembut turun pelan untuk salah (tidak mengintimidasi, K01), klik halus untuk slider, arpeggio singkat untuk pencapaian. Volume rendah, hanya karena aksi siswa, tombol mute di Pengaturan.
- Konfeti dan suara dapat dimatikan di Pengaturan; konfeti otomatis dilewati bila perangkat meminta gerakan dikurangi (`prefers-reduced-motion`).

## 7. Penulisan Mikro (*Microcopy*)

| Situasi | ✔ Gunakan | ✖ Hindari |
|---|---|---|
| Jawaban salah | "Hampir! Cek tandanya ya." | "Salah!" |
| Tombol bantuan | "Butuh petunjuk?" | "Menyerah?" |
| Akhir modul | "Kamu menyelesaikan 8 soal, 6 tanpa bantuan." | "Skor: 60" |
| Lewati refleksi | "Lewati dulu" | "Tidak mau" |

## 8. Aksesibilitas (target WCAG 2.1 AA)

- Kontras teks ≥ 4,5:1, elemen grafik ≥ 3:1.
- Warna tidak pernah menjadi satu-satunya pembeda.
- Semua tombol ikon memiliki label teks atau `aria-label`.
- Grafik memiliki deskripsi teks alternatif (mis. "Garis melalui (1,2) dan (4,5), naik ke kanan").
- Dapat dioperasikan dengan keyboard di versi web.
- Mendukung pembesaran huruf sistem Android.

## 9. Wireframe Layar Utama

### Beranda
```
┌──────────────────────────────┐
│ Halo! 👋  Lanjutkan belajar  │
│ ┌──────────────────────────┐ │
│ │ ▶ M4 Gradien Dua Titik   │ │
│ │   Langkah 3 dari 8       │ │
│ └──────────────────────────┘ │
│ Modul                        │
│ ✔ M0 Cek Prasyarat  ★★★     │
│ ✔ M1 Apa itu Kemiringan     │
│ ✔ M2 Gradien dari Grafik ★★ │
│ ◐ M4 Gradien Dua Titik       │
│ ○ M5 Gradien dari Persamaan  │
│ ○ M6 Sejajar & Tegak Lurus   │
│ ○ M7 Pemodelan Soal Cerita   │
│ ○ M8 Membandingkan Dua Model │
│ [📚 Soal Cerita] [✍ Modelkan │
│  Soalku] [📒 Catatanku] [⚙]  │
└──────────────────────────────┘
```

### Hasil "Cek di Grafik"
```
┌──────────────────────────────┐
│   ·  ·  ·  ·  ● B(4,5) ·     │
│   ·  ·  ·  ╱  ·  ·  ·        │  ── garis sebenarnya (abu)
│   ·  ·  ╱  ·  ·  ·  ·        │  - - garis jawabanmu (hijau)
│   ·  ● A(1,2) ·  ·  ·        │
│   ·  ·  ╲- -  ·  ·  ·        │
├──────────────────────────────┤
│ ⚠ Garismu turun, tapi titik B │
│ ada di atas kanan. Cek tanda  │
│ Δy-mu ya.        [Ubah jawab] │
└──────────────────────────────┘
```

### Soal cerita: tahap ② Rumuskan
```
┌──────────────────────────────┐
│ ←  Ojek ke Sekolah      📄Soal│
│ ①✔ ─ ②● ─ ③○ ─ ④○ ─ ⑤○       │  ← stepper siklus pemodelan
├──────────────────────────────┤
│ Cerita │ Tabel │ Grafik │ Pers.│  ← representasi ganda (F-26)
│   biaya│            ╱          │
│ (Rp)   │        ╱              │
│  5.000 ●───╱  ← nilai awal (ungu)
│        └──────────── jarak (km)│
├──────────────────────────────┤
│ x = jarak tempuh (km)     ✔   │
│ y = biaya (rupiah)        ✔   │
│ Susun modelnya:               │
│ y = [ 2500 ] x + [ 5000 ]     │  ← kotak hijau & ungu
│                       [Cek]   │
├──────────────────────────────┤
│ 💡Petunjuk 📖Contoh 📘Lengkap  │
├──────────────────────────────┤
│ [ ‹ Kembali ]   [ Lanjut › ] │
└──────────────────────────────┘
```

### Soal cerita: tahap ④ Tafsirkan
```
┌──────────────────────────────┐
│ ①✔ ─ ②✔ ─ ③✔ ─ ④● ─ ⑤○       │
├──────────────────────────────┤
│ Hasil hitunganmu: y = 25.000  │
│ Apa artinya dalam cerita?     │
│                               │
│ Biaya perjalanan sejauh       │
│ [ 8 ] [ km ▾] adalah          │
│ [ Rp25.000 ].                 │
│                       [Cek]   │
└──────────────────────────────┘
```

### Hint bertingkat
```
┌──────────────────────────────┐
│ 💡 Petunjuk 1 dari 3          │
│ Δy adalah selisih nilai y:    │
│ y₂ − y₁                       │
│                               │
│ [Petunjuk berikutnya]  [Tutup]│
└──────────────────────────────┘
```
