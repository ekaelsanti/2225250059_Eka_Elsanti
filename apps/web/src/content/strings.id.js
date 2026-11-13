// Teks untuk siswa (bahasa Indonesia). Jangan menulis teks umpan balik langsung di komponen.

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** Umpan balik pemeriksa model (F-27). Setiap fungsi menerima (model, mBenar). */
export const MODEL_FEEDBACK = {
  OK: () => 'Modelmu tepat!',
  RATE_INITIAL_SWAP: (model) =>
    `Angka yang dikalikan x adalah laju (${model.y?.meaning ?? 'y'} per ${model.x?.unit ?? 'satuan x'}). Nilai awal ditambahkan sekali saja.`,
  MISSING_INITIAL: () => 'Ada nilai awal pada cerita. Sudah dimasukkan ke model?',
  SIGN_DIRECTION: (model, m) =>
    `${cap(model.y?.meaning ?? 'nilai y')} ${m.num < 0n ? 'berkurang, jadi lajunya negatif' : 'bertambah, jadi lajunya positif'}.`,
  VAR_ROLE_SWAP: (model) =>
    `Sepertinya x dan y tertukar. ${cap(model.y?.meaning ?? 'y')} bergantung pada ${model.x?.meaning ?? 'x'}.`,
  UNIT_MISMATCH: () => 'Lajunya sudah hampir benar. Periksa satuannya: apakah sudah disamakan?',
  RATE_FROM_TOTAL: () => 'Laju dihitung dari selisih dua data, bukan dari satu total.',
  WRONG_INITIAL: () => 'Lajunya sudah benar. Periksa lagi nilai awalnya (y saat x = 0).',
  WRONG_RATE: () => 'Nilai awalnya sudah benar. Periksa lagi lajunya.',
  WRONG_MODEL: () => 'Modelnya belum tepat. Coba tentukan dulu laju dan nilai awalnya.',
};

/** Umpan balik jawaban angka (F-04, F-20, F-29). */
export const ANSWER_FEEDBACK = {
  OK: 'Tepat! 🎉',
  PARSE_ERROR: 'Isi dengan angka, ya. Contoh: 5, -2, 3/4, atau 1,5.',
  SIGN_ERROR: 'Hampir! Cek tandanya. Ingat: kurang negatif sama dengan tambah.',
  INVERTED_RATIO: 'Ingat: naik dibagi jalan. Δy di atas, Δx di bawah.',
  UNIT_MISMATCH: 'Angkanya mirip, tapi satuannya berbeda. Samakan satuannya dulu.',
  ARITH_ERROR: 'Belum tepat. Coba 🔢 Hitung pelan-pelan atau buka petunjuk.',
  INTERPRET_NO_UNIT: 'Angkanya benar. Tuliskan juga satuannya (mis. rupiah, km, liter).',
  INTERPRET_OK: 'Tafsiranmu lengkap dengan satuan! 🎉',
};

export const APP_TEXT = {
  appName: 'GradieKAn',
  tagline: 'Belajar gradien, literasi matematika, dan pemodelan soal cerita',
  homeGreeting: 'Halo! Siap taklukkan gradien hari ini?',
  homeSubtitle: 'Pelan-pelan saja. Satu langkah setiap layar.',
};

/**
 * Level capaian pribadi soal cerita (bukan peringkat antarsiswa).
 * @param {number} done  jumlah soal cerita selesai
 * @param {number} total jumlah soal cerita
 */
export function storyLevel(done, total) {
  const ratio = total ? done / total : 0;
  if (ratio >= 1) return { key: 'ahli', label: 'Ahli' };
  if (ratio >= 0.7) return { key: 'mahir', label: 'Mahir' };
  if (ratio >= 0.3) return { key: 'terampil', label: 'Terampil' };
  return { key: 'pemula', label: 'Pemula' };
}

export const STAGES =['Pahami', 'Rumuskan', 'Selesaikan', 'Tafsirkan', 'Periksa'];

export const INSTALL_TEXT = {
  button: 'Pasang Aplikasi',
  navLabel: 'Pasang',
  installed: 'Terpasang',
  guideTitle: 'Pasang GradieKAn',
  guideIntro: 'GradieKAn bisa dipasang langsung dari browser, tanpa Play Store atau App Store.',
  steps: {
    ios: ['Buka GradieKAn di Safari.', 'Ketuk tombol Bagikan ⬆ di bawah layar.', 'Pilih "Tambahkan ke Layar Utama", lalu ketuk "Tambah".'],
    android: ['Buka GradieKAn di Chrome.', 'Ketuk menu ⋮ di kanan atas.', 'Pilih "Instal aplikasi" atau "Tambahkan ke layar utama".'],
    desktop: ['Buka GradieKAn di Chrome atau Edge.', 'Klik ikon Instal (⊕) di ujung kanan bilah alamat.', 'Klik "Instal". GradieKAn muncul di Start Menu/Dock.'],
  },
  note: 'Pemasangan hanya bisa dari alamat https:// atau localhost. Setelah terpasang, aplikasi tetap jalan tanpa internet.',
  close: 'Mengerti',
};

export const SEARCH_TEXT = {
  title: 'Cari',
  placeholder: 'Cari materi, soal cerita, istilah…',
  close: 'Tutup',
  suggest: 'Coba cari:',
  suggestions: ['sejajar', 'tegak lurus', 'persamaan', 'ojek', 'bensin', 'pecahan', 'biaya tetap'],
  empty: (q) => `Tidak ada hasil untuk "${q}". Coba kata lain, misalnya "gradien".`,
  results: (n) => `${n} hasil`,
};

export const NAV_TEXT = {
  show: 'Tampilkan menu samping',
  hide: 'Sembunyikan menu samping',
};

export const ONBOARDING = [
  { icon: '🪜', title: 'Kemiringan ada di sekitarmu', text: 'Tangga, jalan menanjak, dan perosotan semuanya punya kemiringan.' },
  { icon: '📈', title: 'Garis bisa naik, turun, atau datar', text: 'Kita akan belajar membaca arah dan kecuraman garis.' },
  { icon: '🐢', title: 'Pelan-pelan saja', text: 'Satu langkah di setiap layar. Tidak ada batas waktu.' },
  { icon: '💡', title: 'Bantuan selalu ada', text: 'Tombol petunjuk ada di setiap soal. Pakai kalau perlu saja.' },
];

export const CONTEXT_LABEL = { personal: 'Personal', 'sosial-budaya': 'Sosial-budaya', saintifik: 'Saintifik' };
export const CONTEXT_ICON = { personal: '🙋', 'sosial-budaya': '🏘️', saintifik: '🔬' };

export const TYPE_LABEL = {
  T1: 'Harga per satuan', T2: 'Laju + nilai awal', T3: 'Dua data', T4: 'Tabel', T5: 'Grafik',
  T6: 'Laju menurun', T7: 'Kemiringan fisik', T8: 'Mencari x', T9: 'Bandingkan dua model', T10: 'Sejajar/tegak lurus',
};
