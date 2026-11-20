// F-35 Jalur RMT (Rigorous Mathematical Thinking, Kinard & Kozulin): konten & teks untuk siswa.
// Peta lengkap fase → teori ada di docs/RMT_FLOW.md.

/**
 * Fase belajar RMT. stage = fase pemrosesan kognitif Feuerstein (Input/Elaborasi/Output)
 * atau unsur MLE/Learning Activity; pillar = pilar RMT yang dilatih.
 * @typedef {{ id: string, label: string, stage: 'Mediasi'|'Input'|'Elaborasi'|'Output'|'Refleksi', pillar: string, icon: string }} RmtPhase
 * @type {RmtPhase[]}
 */
export const RMT_PHASES = [
  { id: 'tujuan', label: 'Tujuan', stage: 'Mediasi', pillar: 'Intensionalitas & makna', icon: 'bintang' },
  { id: 'amati', label: 'Amati', stage: 'Input', pillar: 'Konsep sehari-hari', icon: 'lihat' },
  { id: 'representasi', label: 'Representasi', stage: 'Elaborasi', pillar: 'Alat: tabel & bidang koordinat', icon: 'grafik' },
  { id: 'manipulasi', label: 'Manipulasi', stage: 'Elaborasi', pillar: 'Penalaran hipotetis', icon: 'lab' },
  { id: 'konsep', label: 'Konsep', stage: 'Elaborasi', pillar: 'Konsep ilmiah & bahasa', icon: 'kamus' },
  { id: 'terapkan', label: 'Terapkan', stage: 'Output', pillar: 'Rencana → hitung → validasi', icon: 'hitung' },
  { id: 'transfer', label: 'Transfer', stage: 'Output', pillar: 'Transendensi', icon: 'literasi' },
  { id: 'refleksi', label: 'Refleksi', stage: 'Refleksi', pillar: 'Metakognisi', icon: 'pikir' },
];

export const RMT_TEXT = {
  pathTitle: 'Jalur RMT',
  pathDesc: 'Bentuk konsep gradien langkah demi langkah: amati, wakili, uji, lalu terapkan.',
  start: 'Mulai',
  resume: 'Lanjutkan',
  done: 'Selesai',
  next: 'Lanjut ›',
  back: '‹ Kembali',
  finish: 'Selesaikan jalur',
  check: 'Periksa',
  ready: 'Aku siap!',
  stageNames: { Mediasi: 'Mediasi', Input: 'Fase Input', Elaborasi: 'Fase Elaborasi', Output: 'Fase Output', Refleksi: 'Refleksi' },
  locked: 'Selesaikan tugas di layar ini dulu, ya.',
  mediatorTitle: 'Pertanyaan Gradi',
  mediatorIntro: 'Bingung? Buka satu pertanyaan penuntun. Pakai kalau perlu saja.',
  mediatorMore: 'Pertanyaan berikutnya',
  mediatorEmpty: 'Coba dulu sendiri. Pertanyaan penuntun ada di sini kalau kamu butuh.',
  toolsTitle: 'Kotak Alat',
  toolsIntro: 'Alat matematika untuk membantumu berpikir.',
  tools: { tabel: 'Tabel', bidang: 'Bidang koordinat', rumus: 'Rumus', kamus: 'Kamus' },
  ai: {
    title: 'Mediator AI',
    button: 'Tanya Mediator AI',
    placeholder: 'Tulis pertanyaanmu tentang langkah ini…',
    send: 'Kirim',
    soon: 'Mediator AI belum disambungkan. Gunakan Pertanyaan Gradi dulu, ya.',
    offline: 'Mediator AI butuh internet. Pertanyaan Gradi tetap bisa dipakai.',
    error: 'Mediator AI belum bisa dihubungi. Coba lagi nanti.',
    privacy: 'Yang dikirim hanya pertanyaanmu, tanpa nama atau kode peserta.',
  },
  finishTitle: 'Jalur selesai! 🎉',
  finishText: 'Kamu sudah membentuk konsep gradien sendiri. Saatnya berlatih.',
  finishPractice: 'Ke Latihan',
  finishStory: 'Ke Soal Cerita',
  reflectionSaved: 'Refleksi tersimpan di Catatan.',
};

/** Jalur belajar RMT. Angka disimpan sebagai pecahan teks ('3/2') dan diperiksa secara eksak. */
export const RMT_LESSONS = {
  gradien: {
    id: 'gradien',
    title: 'Membentuk Konsep Gradien',
    modules: 'M1–M4',
    tujuan: {
      goal: 'Hari ini kamu akan menemukan sendiri cara mengukur kemiringan.',
      meaning: 'Kemiringan dipakai untuk membuat tangga yang aman, jalan yang landai, dan menghitung biaya per km.',
      steps: ['Amati benda miring di sekitarmu.', 'Wakili datanya dengan tabel dan grafik.', 'Uji dugaanmu, lalu rumuskan konsepnya.', 'Terapkan dan periksa hasilmu.'],
    },
    situations: [
      { id: 'tangga', illus: 'tangga', name: 'Tangga rumah', rise: 3, run: 2, ratio: '3/2' },
      { id: 'jalan', illus: 'gunung', name: 'Jalan menanjak', rise: 2, run: 8, ratio: '1/4' },
      { id: 'perosotan', illus: 'perosotan', name: 'Perosotan', rise: 4, run: 6, ratio: '2/3' },
    ],
    amati: {
      intro: 'Perhatikan ukuran naik dan jalan dari tiga benda ini.',
      question: 'Mana yang paling curam?',
      answer: 'tangga',
      feedback: {
        tangga: 'Tepat! Tangga naik 3 hanya dalam 2 langkah ke depan.',
        perosotan: 'Perosotan memang paling tinggi (naik 4). Tapi jalannya juga panjang (6). Bandingkan naik dengan jalannya.',
        jalan: 'Jalan menanjak naik 2 dalam 8 langkah. Itu landai. Coba bandingkan lagi.',
      },
    },
    representasi: {
      intro: 'Susun datanya ke dalam tabel. Lalu hitung naik ÷ jalan untuk setiap benda.',
      conclusion: 'Makin besar nilai naik ÷ jalan, makin curam garisnya.',
    },
    manipulasi: {
      intro: 'Naiknya tetap 3. Sebelum mencoba, buat dugaan dulu.',
      question: 'Jika jalan diperbesar dari 2 menjadi 6, garisnya menjadi…',
      options: [
        ['curam', 'Lebih curam'],
        ['landai', 'Lebih landai'],
        ['tetap', 'Tetap sama'],
      ],
      answer: 'landai',
      task: 'Sekarang geser jalan (Δx) sampai 6. Lihat nilai naik ÷ jalan berubah.',
      targetRun: 6,
      startRise: 3,
      startRun: 2,
      confirmRight: 'Dugaanmu terbukti! Naik ÷ jalan = 3/6 = 1/2, lebih kecil dari 3/2. Garis jadi lebih landai.',
      confirmWrong: 'Lihat buktinya: naik ÷ jalan = 3/6 = 1/2, lebih kecil dari 3/2. Garis justru lebih landai.',
    },
    konsep: {
      intro: 'Pilih kalimat yang paling tepat menjelaskan kemiringan.',
      options: [
        ['rasio', 'Kemiringan = naik ÷ jalan. Makin besar nilainya, makin curam.'],
        ['tinggi', 'Kemiringan = seberapa tinggi garisnya.'],
        ['jumlah', 'Kemiringan = naik + jalan.'],
      ],
      answer: 'rasio',
      feedback: {
        tinggi: 'Ingat perosotan: paling tinggi, tapi bukan paling curam. Tinggi saja belum cukup.',
        jumlah: 'Coba hitung untuk tangga: 3 + 2 = 5, perosotan 4 + 6 = 10. Apakah perosotan lebih curam?',
      },
      formalTitle: 'Bahasa matematika',
      formal: 'Kemiringan disebut gradien, ditulis m.',
      ownWords: 'Tulis dengan kata-katamu sendiri (boleh dilewati):',
    },
    terapkan: {
      a: { x: 1, y: 2 },
      b: { x: 4, y: 8 },
      planQuestion: 'Pilih rencana sebelum menghitung:',
      plans: [
        ['benar', 'Hitung Δy = y₂ − y₁, lalu Δx = x₂ − x₁, lalu bagi Δy ÷ Δx.'],
        ['tebak', 'Tebak sebuah angka, lalu cek apakah cocok.'],
        ['terbalik', 'Bagi Δx ÷ Δy.'],
      ],
      planAnswer: 'benar',
      planFeedback: {
        tebak: 'Coba-coba tanpa rencana mudah salah. Pilih langkah yang pasti.',
        terbalik: 'Ingat: naik dibagi jalan. Δy di atas, Δx di bawah.',
      },
      dy: '6',
      dx: '3',
      m: '2',
      validate: 'Cek di grafik: dari A, jalan 1 ke kanan. Apakah garis naik 2?',
      validateYes: 'Ya, sesuai grafik',
      validated: 'Hasilmu sudah divalidasi dengan grafik. Hebat!',
    },
    transfer: {
      story: 'Tarif ojek: biaya awal Rp5.000, lalu bertambah Rp2.000 setiap 1 km.',
      question: 'Berapa laju (gradien) biaya terhadap jarak, dalam rupiah per km?',
      answer: '2000',
      principle: 'Prinsipnya sama: laju = perubahan y ÷ perubahan x. Laju = m (hijau), nilai awal = c (ungu).',
      model: 'y = 2000x + 5000',
      more: 'Kerjakan soal cerita lengkap',
    },
    refleksi: {
      prompts: ['Apa yang kamu pelajari tentang kemiringan?', 'Langkah mana yang paling sulit? Bagaimana kamu mengatasinya?', 'Di mana lagi kamu bisa menemukan kemiringan?'],
      save: 'Simpan refleksi ke Catatan',
      noteTitle: 'Refleksi: Konsep Gradien',
    },
    // Pertanyaan penuntun (mediated questioning), dibuka satu per satu
    mediator: {
      tujuan: ['Pernahkah kamu naik tangga yang terasa terlalu curam?', 'Apa bedanya tangga curam dan jalan landai?'],
      amati: ['Apa yang sama dari ketiga benda?', 'Kalau naiknya hampir sama, mana yang jalannya lebih pendek?', 'Bandingkan naik dengan jalan, bukan naik saja.'],
      representasi: ['Kolom mana yang menunjukkan naik? Mana yang jalan?', 'Untuk tangga: 3 dibagi 2 berapa?', 'Pecahan boleh ditulis seperti 3/2.'],
      manipulasi: ['Kalau jalan makin panjang, apa yang terjadi pada naik ÷ jalan?', 'Coba hitung 3 ÷ 6.'],
      konsep: ['Ingat perosotan: paling tinggi, tapi apakah paling curam?', 'Kalimat mana yang memakai pembagian?'],
      terapkan: ['y₂ = 8 dan y₁ = 2. Berapa selisihnya?', 'x₂ = 4 dan x₁ = 1. Berapa selisihnya?', 'Bagi selisih y dengan selisih x.'],
      transfer: ['Apa yang bertambah setiap 1 km?', 'Biaya awal Rp5.000 itu laju atau nilai awal?'],
      refleksi: ['Bandingkan caramu di awal dan di akhir.', 'Kesalahan apa yang ingin kamu hindari lain kali?'],
    },
    glossary: [
      ['Gradien (m)', 'Ukuran kemiringan garis: naik ÷ jalan.'],
      ['Naik (Δy)', 'Perubahan nilai y. Dibaca "delta y".'],
      ['Jalan (Δx)', 'Perubahan nilai x. Dibaca "delta x".'],
      ['Curam', 'Kemiringan besar: naik banyak, jalan sedikit.'],
      ['Landai', 'Kemiringan kecil: naik sedikit, jalan jauh.'],
    ],
  },
};
