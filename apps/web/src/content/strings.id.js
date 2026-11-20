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

export const LOGIN_TEXT = {
  title: 'Masuk ke GradieKAn',
  subtitle: 'Pilih peranmu, lalu masukkan PIN.',
  roleLabel: 'Masuk sebagai',
  roles: {
    siswa: { icon: '🎓', name: 'Siswa', desc: 'Belajar, latihan, dan soal cerita' },
    guru: { icon: '🧑‍🏫', name: 'Guru', desc: 'Dasbor progres belajar' },
  },
  pinLabel: 'PIN',
  pinPlaceholder: 'Masukkan PIN',
  pinInfo: (pins) => `PIN siswa: ${pins.siswa} · PIN guru: ${pins.guru}`,
  submit: (role) => `Masuk sebagai ${role}`,
  chooseRole: 'Pilih Siswa atau Guru dulu, ya.',
  wrongPin: 'PIN belum tepat. Coba lagi, ya.',
  showPin: 'Tampilkan PIN',
  hidePin: 'Sembunyikan PIN',
  logout: 'Keluar',
};

/** Spanduk pembuka tiap menu (F-UI). Kalimat pendek, ramah. */
export const PAGE_TEXT = {
  materi: { title: 'Ayo belajar gradien!', text: 'Urutan disarankan dari atas, tetapi kamu bebas memilih.' },
  latihan: { title: 'Asah kemampuanmu', text: 'Pilih jenis soal dan tingkatnya. Tidak ada batas waktu, kerjakan pelan-pelan.' },
  literasi: { title: 'Modelkan soal cerita', text: 'Setiap soal cerita dikerjakan dalam 5 tahap:' },
  catatan: { title: 'Catatanku', text: 'Tulis dengan kata-katamu sendiri. Poin inti dari materi juga ada di sini.' },
  lab: { title: 'Lab Grafik', text: 'Geser m dan c, lalu lihat garisnya berubah.' },
  pengaturan: { title: 'Pengaturan', text: 'Atur tampilan dan bantuan sesuai kenyamananmu.' },
  lencana: { title: 'Koleksi lencanamu', text: 'Terus berlatih untuk membuka semua lencana!' },
};

export const BADGE_TEXT = {
  title: 'Lencanaku',
  count: (n, total) => `${n}/${total} lencana diraih`,
  start: 'Kumpulkan 4 lencana. Setiap langkah kecil ada hadiahnya!',
  keepGoing: (n) => `Hebat, sudah ${n} lencana! Ayo raih yang berikutnya.`,
  allDone: 'Luar biasa! Semua lencana sudah kamu raih. 🎉',
  next: 'Target berikutnya',
  earned: '✔ Diraih!',
  total: 'Kemajuan lencana',
};

export const TANYA_TEXT = {
  title: 'Tanya AI',
  subtitle: 'Tanya Gradi seputar gradien',
  intro: 'Halo! Aku Gradi. Tanyakan apa saja tentang gradien, persamaan garis, atau soal cerita.',
  placeholder: 'Tulis pertanyaanmu…',
  send: 'Kirim',
  suggest: 'Contoh pertanyaan:',
  suggestions: ['Apa itu gradien?', 'Bagaimana menghitung gradien dari dua titik?', 'Apa syarat dua garis tegak lurus?', 'Kenapa gradien bisa negatif?'],
  thinking: 'Gradi sedang berpikir…',
  fromBank: '📚 Dari bank jawaban (offline)',
  fromAI: '✨ Dijawab Gradi AI',
  askAI: '✨ Tanya Gradi AI lebih lanjut',
  open: 'Buka',
  offline: 'Kamu sedang offline. Gradi AI butuh internet. Coba buka Materi atau tanya dengan kata lain.',
  server: 'Gradi AI belum bisa dihubungi. Pastikan server AI di laptop guru menyala, lalu coba lagi.',
  notFound: 'Gradi belum menemukan jawabannya di bank jawaban.',
  privacy: 'Pertanyaanmu dikirim ke layanan AI tanpa nama atau kode peserta. Jangan menulis data pribadi, ya.',
  clear: 'Mulai ulang',
};

/** Bank jawaban offline Tanya AI. keys = frasa kunci (huruf kecil, tanpa tanda baca). */
export const TANYA_FAQ = [
  { keys: ['kemiringan', 'apa itu gradien', 'pengertian gradien', 'arti gradien', 'maksud gradien', 'gradien itu apa'], to: '/materi/M0', toLabel: 'Materi M0',
    answer: 'Gradien (m) adalah ukuran kemiringan garis. Gradien = naik ÷ jalan = Δy ÷ Δx. Makin besar nilainya, makin curam garisnya.' },
  { keys: ['dua titik', 'titik a', 'x1', 'y1', 'x2', 'y2', 'rumus gradien', 'menghitung gradien'], to: '/latihan', toLabel: 'Latihan',
    answer: 'Dari dua titik (x₁, y₁) dan (x₂, y₂):\n1. Hitung Δy = y₂ − y₁.\n2. Hitung Δx = x₂ − x₁.\n3. m = Δy ÷ Δx, lalu sederhanakan pecahannya.\nUrutan titik boleh ditukar, asal sama di atas dan di bawah.' },
  { keys: ['negatif', 'gradien negatif', 'turun', 'menurun'], to: '/lab', toLabel: 'Lab Grafik',
    answer: 'Gradien negatif berarti garis turun dari kiri ke kanan. Saat x bertambah, y berkurang. Coba geser m ke kiri di Lab Grafik.' },
  { keys: ['nol', 'gradien nol', 'mendatar', 'horizontal', 'datar'],
    answer: 'Garis mendatar punya gradien 0, karena Δy = 0. Bentuk persamaannya y = c.' },
  { keys: ['tegak', 'vertikal', 'tidak terdefinisi'],
    answer: 'Garis tegak (vertikal) punya Δx = 0. Pembagian dengan 0 tidak boleh, jadi gradiennya tidak terdefinisi. Bentuk persamaannya x = k.' },
  { keys: ['sejajar', 'garis sejajar'], to: '/latihan', toLabel: 'Latihan sejajar',
    answer: 'Dua garis sejajar punya gradien yang sama: m₁ = m₂. Contoh: y = 2x + 1 sejajar dengan y = 2x − 5.' },
  { keys: ['tegak lurus', 'saling tegak lurus', 'berpotongan tegak lurus'], to: '/latihan', toLabel: 'Latihan tegak lurus',
    answer: 'Dua garis tegak lurus jika m₁ × m₂ = −1. Jadi m₂ = −1 ÷ m₁: balik pecahannya, lalu ganti tandanya. Contoh: m₁ = 2/3 → m₂ = −3/2.' },
  { keys: ['y mx c', 'y = mx + c', 'mx c', 'persamaan garis', 'dari persamaan'], to: '/latihan', toLabel: 'Latihan persamaan',
    answer: 'Pada y = mx + c, angka di depan x adalah gradien (m), dan c adalah titik potong sumbu y. Pastikan y sendirian di ruas kiri dulu.' },
  { keys: ['ax by c', 'ax + by + c', 'bentuk umum', 'ax by'],
    answer: 'Untuk ax + by + c = 0, ubah dulu ke bentuk y = …. Gradiennya m = −a ÷ b. Contoh: 2x + 4y − 8 = 0 → m = −2/4 = −1/2.' },
  { keys: ['titik potong', 'konstanta', 'nilai c', 'sumbu y'],
    answer: 'c adalah nilai y saat x = 0, yaitu titik potong garis dengan sumbu y. Pada soal cerita, c adalah nilai awal.' },
  { keys: ['soal cerita', 'memodelkan', 'model matematika', 'laju', 'nilai awal'], to: '/literasi', toLabel: 'Literasi',
    answer: 'Untuk soal cerita: cari laju (yang bertambah tiap satuan) sebagai m, dan nilai awal (yang ada sejak awal) sebagai c. Modelnya y = mx + c. Jangan lupa tafsirkan jawaban dengan satuan.' },
  { keys: ['pecahan', 'menyederhanakan', 'sederhanakan', 'fpb'],
    answer: 'Sederhanakan pecahan dengan membagi pembilang dan penyebut dengan FPB-nya. Contoh: 6/4 → bagi 2 → 3/2.' },
  { keys: ['kurang negatif', 'min min', 'dikurangi negatif', 'tanda negatif'],
    answer: 'Mengurangi bilangan negatif sama dengan menambah. Contoh: 3 − (−2) = 3 + 2 = 5. Tulis tanda kurung agar tidak keliru.' },
  { keys: ['grafik', 'cek grafik', 'lab grafik', 'menggambar garis'], to: '/lab', toLabel: 'Lab Grafik',
    answer: 'Di Lab Grafik kamu bisa menggeser m dan c, lalu melihat garisnya berubah. Pakai untuk memeriksa jawabanmu.' },
];

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
