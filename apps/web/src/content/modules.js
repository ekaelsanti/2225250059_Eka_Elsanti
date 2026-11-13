// Materi M0-M6 (docs/CONTENT_SPEC.md §4). Satu chunk = satu layar = satu ide (F-09):
// <= 3 kalimat, <= 1 rumus, <= 1 visual, <= 1 poin inti.
// visual.type: 'plane' (props CartesianPlane) | 'numberline' | 'emoji'
// check/quiz: { type: 'number', q, answer, hints } | { type: 'choice', q, options, answer, explain }

const rr = (x1, y1, x2, y2, rise = `naik ${y2 - y1}`, run = `jalan ${x2 - x1}`) => [
  { x1, y1, x2, y2: y1, color: 'run', label: run },
  { x1: x2, y1, x2, y2, color: 'rise', label: rise },
];

export const MODULES = [
  {
    id: 'M0',
    title: 'Cek Prasyarat',
    icon: '🧮',
    minutes: 5,
    summary: 'Bilangan negatif, koordinat, dan pecahan.',
    chunks: [
      {
        text: ['Bilangan negatif ada di sebelah kiri nol.', 'Menambah artinya lompat ke kanan. Mengurangi artinya lompat ke kiri.'],
        visual: { type: 'numberline', start: -3, jump: 5, caption: '−3 + 5 = 2' },
      },
      {
        text: ['Mengurangi bilangan negatif sama dengan menambah.'],
        formula: '3 − (−2) = 3 + 2 = 5',
        keyPoint: 'Kurang negatif = tambah.',
        visual: { type: 'numberline', start: 3, jump: 2, caption: '3 − (−2) = 5' },
        check: { type: 'number', q: '−4 − (−6) = ?', answer: '2', hints: ['Kurang negatif = tambah.', '−4 − (−6) = −4 + 6', '−4 + 6 = …'] },
      },
      {
        text: ['Titik (3, 2) artinya: jalan 3 ke kanan, lalu 2 ke atas.', 'Angka pertama selalu x, angka kedua selalu y.'],
        visual: { type: 'plane', points: [{ x: 3, y: 2, color: 'point1', label: '(3, 2)' }], segments: rr(0, 0, 3, 2, 'ke atas 2', 'ke kanan 3') },
      },
      {
        text: ['Pecahan disederhanakan dengan membagi pembilang dan penyebut dengan bilangan yang sama.'],
        formula: '6/4 = (6 ÷ 2)/(4 ÷ 2) = 3/2',
      },
    ],
    quiz: [
      { type: 'number', q: '−4 − 5 = ?', answer: '-9', hints: ['Mulai dari −4, lompat 5 ke kiri.', '−4 − 5 = −(4 + 5)', '= −9'] },
      { type: 'number', q: '2 − (−7) = ?', answer: '9', hints: ['Kurang negatif = tambah.', '2 − (−7) = 2 + 7', '= 9'] },
      { type: 'number', q: 'Sederhanakan 8/12', answer: '2/3', hints: ['Cari bilangan yang membagi 8 dan 12.', 'Bagi keduanya dengan 4.', '8 ÷ 4 = 2, 12 ÷ 4 = 3'] },
    ],
  },
  {
    id: 'M1',
    title: 'Apa itu Kemiringan?',
    icon: '🪜',
    minutes: 5,
    summary: 'Kemiringan dalam kehidupan sehari-hari.',
    chunks: [
      {
        text: ['Kemiringan ada di sekitarmu.', 'Mana yang paling curam?'],
        visual: { type: 'emoji', items: [['🪜', 'Tangga'], ['⛰️', 'Jalan menanjak'], ['🛝', 'Perosotan']] },
      },
      {
        text: ['Kemiringan membandingkan seberapa tinggi naik dengan seberapa jauh berjalan mendatar.'],
        visual: { type: 'plane', xMin: -1, xMax: 7, yMin: -1, yMax: 5, lines: [{ m: 0.5, c: 0, color: 'slope' }], segments: rr(2, 1, 6, 3) },
        keyPoint: 'Kemiringan (gradien) = naik ÷ jalan.',
      },
      {
        text: ['Dua tangga naik setinggi sama, yaitu 4 kotak.', 'Tangga hijau jalan 2 kotak, tangga ungu jalan 8 kotak.'],
        visual: { type: 'plane', xMin: -1, xMax: 9, yMin: -1, yMax: 5, lines: [{ m: 2, c: 0, color: 'slope', label: 'hijau' }, { m: 0.5, c: 0, color: 'intercept', label: 'ungu' }] },
        check: { type: 'choice', q: 'Tangga mana yang lebih curam?', options: ['Hijau (4 ÷ 2 = 2)', 'Ungu (4 ÷ 8 = 1/2)'], answer: 0, explain: 'Benar! Gradiennya lebih besar, jadi lebih curam.' },
      },
    ],
    quiz: [
      { type: 'number', q: 'Sebuah tangga naik 4 m dengan jarak mendatar 2 m. Berapa kemiringannya?', answer: '2', hints: ['Kemiringan = naik ÷ jalan.', '= 4 ÷ 2', '= 2'] },
      { type: 'choice', q: 'Semakin besar gradien, garis semakin …', options: ['landai', 'curam'], answer: 1, explain: 'Tepat! Gradien besar berarti curam.' },
    ],
  },
  {
    id: 'M2',
    title: 'Gradien dari Grafik',
    icon: '📈',
    minutes: 10,
    summary: 'Menghitung naik dan jalan pada grid.',
    chunks: [
      {
        text: ['Dari titik biru ke titik oranye, hitung kotak ke kanan.', 'Itulah jalan (Δx).'],
        visual: { type: 'plane', points: [{ x: 1, y: 1, color: 'point1', label: 'A' }, { x: 4, y: 3, color: 'point2', label: 'B' }], segments: [{ x1: 1, y1: 1, x2: 4, y2: 1, color: 'run', label: 'Δx = 3' }] },
      },
      {
        text: ['Lalu hitung kotak ke atas.', 'Itulah naik (Δy).'],
        visual: { type: 'plane', points: [{ x: 1, y: 1, color: 'point1', label: 'A' }, { x: 4, y: 3, color: 'point2', label: 'B' }], segments: rr(1, 1, 4, 3, 'Δy = 2', 'Δx = 3') },
      },
      {
        text: ['Gradien adalah naik dibagi jalan.'],
        formula: 'm = Δy / Δx = 2/3',
        keyPoint: 'm = Δy ÷ Δx. Gradien 2/3 artinya: setiap jalan 3, naik 2.',
        visual: { type: 'plane', points: [{ x: 1, y: 1, color: 'point1', label: 'A' }, { x: 4, y: 3, color: 'point2', label: 'B' }], lines: [{ m: 2 / 3, c: 1 / 3, color: 'slope' }], segments: rr(1, 1, 4, 3) },
        check: { type: 'number', q: 'Garis melalui (0, 0) dan (2, 4). Berapa gradiennya?', answer: '2', hints: ['Hitung Δy dan Δx.', 'Δy = 4, Δx = 2', 'm = 4 ÷ 2'] },
      },
    ],
    quiz: [
      { type: 'number', q: 'Garis melalui (0, 1) dan (3, 3). Berapa gradiennya?', answer: '2/3', hints: ['Δx = 3 − 0', 'Δy = 3 − 1 = 2', 'm = 2/3'] },
      { type: 'number', q: 'Garis melalui (1, 0) dan (3, 6). Berapa gradiennya?', answer: '3', hints: ['Δx = 3 − 1 = 2', 'Δy = 6 − 0 = 6', 'm = 6 ÷ 2'] },
    ],
  },
  {
    id: 'M3',
    title: 'Arah Gradien',
    icon: '↗️',
    minutes: 8,
    summary: 'Positif, negatif, nol, dan tak terdefinisi.',
    chunks: [
      {
        text: ['Jika gradien positif, garis naik dari kiri ke kanan.'],
        visual: { type: 'plane', lines: [{ m: 1.5, c: 0, color: 'slope', label: 'm = 1,5' }] },
        keyPoint: 'm > 0: naik ↗',
      },
      {
        text: ['Jika gradien negatif, garis turun dari kiri ke kanan.'],
        visual: { type: 'plane', lines: [{ m: -2, c: 1, color: 'rise', label: 'm = −2' }] },
        keyPoint: 'm < 0: turun ↘',
      },
      {
        text: ['Garis mendatar tidak naik sama sekali, jadi gradiennya 0.', 'Garis tegak tidak berjalan mendatar (Δx = 0), jadi gradiennya tidak terdefinisi.'],
        visual: { type: 'plane', lines: [{ m: 0, c: 2, color: 'intercept', label: 'm = 0' }, { x: -3, color: 'run' }] },
      },
      {
        text: ['Coba ubah gradien di Lab Grafik untuk melihat arahnya berubah.'],
        link: { to: '/lab', label: '🧪 Buka Lab Grafik' },
        check: { type: 'choice', q: 'Jika m = −3, garisnya …', options: ['naik ↗', 'turun ↘', 'datar →'], answer: 1, explain: 'Benar! Gradien negatif berarti turun.' },
      },
    ],
    quiz: [
      { type: 'choice', q: 'Gradien garis mendatar adalah …', options: ['0', '1', 'tidak terdefinisi'], answer: 0, explain: 'Tepat! Tidak ada kenaikan, jadi m = 0.' },
      { type: 'choice', q: 'Gradien garis tegak adalah …', options: ['0', 'tidak terdefinisi', '−1'], answer: 1, explain: 'Tepat! Δx = 0, pembagian dengan nol.' },
    ],
  },
  {
    id: 'M4',
    title: 'Gradien dari Dua Titik',
    icon: '📍',
    minutes: 15,
    summary: 'Rumus m = (y₂ − y₁) / (x₂ − x₁).',
    chunks: [
      {
        text: ['Tanpa grid, kita hitung naik dan jalan dari koordinat.', 'Titik 1 berwarna biru, titik 2 berwarna oranye.'],
        formula: 'm = (y₂ − y₁) / (x₂ − x₁)',
        keyPoint: 'Selisih y di atas, selisih x di bawah.',
        visual: { type: 'plane', points: [{ x: 1, y: 2, color: 'point1', label: '(x₁, y₁)' }, { x: 4, y: 5, color: 'point2', label: '(x₂, y₂)' }], segments: rr(1, 2, 4, 5, 'y₂ − y₁', 'x₂ − x₁') },
      },
      {
        text: ['Contoh: A(1, 2) dan B(4, 5).'],
        formula: 'm = (5 − 2) / (4 − 1) = 3/3 = 1',
        visual: { type: 'plane', points: [{ x: 1, y: 2, color: 'point1', label: 'A(1, 2)' }, { x: 4, y: 5, color: 'point2', label: 'B(4, 5)' }], lines: [{ m: 1, c: 1, color: 'slope' }] },
      },
      {
        text: ['Hati-hati dengan bilangan negatif! Contoh: A(−1, 4) dan B(2, −2).', 'Δy = −2 − 4 = −6, Δx = 2 − (−1) = 3.'],
        formula: 'm = −6 / 3 = −2',
        keyPoint: 'Tulis bilangan negatif di dalam kurung: 2 − (−1) = 2 + 1.',
        visual: { type: 'plane', points: [{ x: -1, y: 4, color: 'point1', label: 'A(−1, 4)' }, { x: 2, y: -2, color: 'point2', label: 'B(2, −2)' }], lines: [{ m: -2, c: 2, color: 'slope' }] },
      },
      {
        text: ['Boleh menukar titik 1 dan titik 2, asalkan urutannya sama di atas dan di bawah.'],
        formula: '(2 − 5)/(1 − 4) = −3/−3 = 1',
        check: { type: 'number', q: 'Gradien garis melalui (2, 1) dan (6, 3) adalah …', answer: '1/2', hints: ['Δy = 3 − 1', 'Δx = 6 − 2', 'm = 2/4, sederhanakan'] },
      },
    ],
    quiz: [
      { type: 'number', q: 'Gradien garis melalui (1, 2) dan (3, 6)?', answer: '2', hints: ['Δy = 6 − 2 = 4', 'Δx = 3 − 1 = 2', 'm = 4 ÷ 2'] },
      { type: 'number', q: 'Gradien garis melalui (−3, −1) dan (−6, 5)?', answer: '-2', hints: ['Δy = 5 − (−1) = 6', 'Δx = −6 − (−3) = −3', 'm = 6 ÷ (−3)'] },
      { type: 'number', q: 'Gradien garis melalui (0, 1) dan (4, 4)?', answer: '3/4', hints: ['Δy = 4 − 1 = 3', 'Δx = 4 − 0 = 4', 'm = 3/4'] },
    ],
    practiceLink: true,
  },
  {
    id: 'M5',
    title: 'Gradien dari Persamaan',
    icon: '🟰',
    minutes: 12,
    summary: 'Membaca m dan c dari y = mx + c.',
    chunks: [
      {
        text: ['Pada persamaan y = mx + c, angka yang menempel pada x adalah gradien.', 'Angka c adalah titik potong garis dengan sumbu y.'],
        formula: 'y = 2x + 1  →  m = 2, c = 1',
        keyPoint: 'm = angka di depan x. c = nilai y saat x = 0.',
        visual: { type: 'plane', lines: [{ m: 2, c: 1, color: 'slope', label: 'y = 2x + 1' }], points: [{ x: 0, y: 1, color: 'intercept', label: 'c = 1' }] },
      },
      {
        text: ['Urutan suku boleh berbeda. Tetap cari angka yang menempel pada x.'],
        formula: 'y = 3 − 2x  →  m = −2, c = 3',
        check: { type: 'number', q: 'Berapa gradien y = 4 − 3x?', answer: '-3', hints: ['Cari angka yang menempel pada x.', 'Tandanya ikut: −3x', 'm = −3'] },
      },
      {
        text: ['Jika y masih punya angka di depannya, bagi dulu semua suku dengan angka itu.'],
        formula: '2y = 4x + 6  →  y = 2x + 3  →  m = 2',
      },
      {
        text: ['Untuk bentuk ax + by + c = 0, gradiennya −a dibagi b.'],
        formula: '3x + 2y − 6 = 0  →  m = −3/2',
        keyPoint: 'ax + by + c = 0  →  m = −a/b',
      },
    ],
    quiz: [
      { type: 'number', q: 'Berapa gradien y = −5x + 2?', answer: '-5', hints: ['Angka di depan x.', 'Tandanya ikut.', 'm = −5'] },
      { type: 'number', q: 'Berapa gradien 3x + 2y − 6 = 0?', answer: '-3/2', hints: ['a = 3, b = 2', 'm = −a/b', 'm = −3/2'] },
    ],
  },
  {
    id: 'M6',
    title: 'Sejajar & Tegak Lurus',
    icon: '⟂',
    minutes: 12,
    summary: 'Hubungan gradien dua garis.',
    chunks: [
      {
        text: ['Dua garis sejajar tidak pernah berpotongan.', 'Kemiringannya sama persis.'],
        visual: { type: 'plane', lines: [{ m: 1, c: 2, color: 'slope' }, { m: 1, c: -2, color: 'point1' }] },
        keyPoint: 'Sejajar: m₁ = m₂.',
      },
      {
        text: ['Dua garis tegak lurus membentuk sudut siku-siku.', 'Hasil kali gradiennya −1.'],
        formula: 'm₁ × m₂ = −1   →   m₂ = −1/m₁',
        keyPoint: 'Tegak lurus: gradien dibalik dan tandanya diganti.',
        visual: { type: 'plane', lines: [{ m: 2 / 3, c: 0, color: 'slope', label: 'm = 2/3' }, { m: -1.5, c: 0, color: 'point2', label: 'm = −3/2' }] },
        check: { type: 'number', q: 'Garis tegak lurus dengan garis bergradien 2 memiliki gradien …', answer: '-1/2', hints: ['Balik 2 menjadi 1/2.', 'Ganti tandanya.', 'm₂ = −1/2'] },
      },
    ],
    quiz: [
      { type: 'number', q: 'Garis sejajar dengan y = 3x − 1 memiliki gradien …', answer: '3', hints: ['Sejajar: gradien sama.', 'Gradien y = 3x − 1 adalah 3.', 'm₂ = 3'] },
      { type: 'number', q: 'Garis tegak lurus dengan garis bergradien −3/4 memiliki gradien …', answer: '4/3', hints: ['Balik: 4/3', 'Ganti tanda: dari negatif jadi positif', 'm₂ = 4/3'] },
    ],
  },
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m]));
