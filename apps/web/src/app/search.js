// Pencarian lokal (offline) atas materi, soal cerita, menu/latihan, kamus istilah, lencana, dan catatan siswa.
import { BADGES } from './badges.js';
import { BASE_PROBLEMS, GLOSSARY } from '../content/bank.js';
import { MODULES } from '../content/modules.js';
import { CONTEXT_LABEL, TYPE_LABEL } from '../content/strings.id.js';

/** huruf kecil, tanpa diakritik, spasi dirapikan */
export const normalize = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[−–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

// text = deskripsi yang ditampilkan; keywords = kata kunci tambahan (dicari, tidak ditampilkan)
const PAGES = [
  { title: 'Latihan: Dua titik + grafik', text: 'Hitung gradien dua titik dengan bantuan grafik.', keywords: 'delta y delta x', to: '/latihan', icon: '✏️' },
  { title: 'Latihan: Dua titik saja', text: 'Hitung gradien dari dua titik tanpa grafik.', keywords: 'koordinat rumus', to: '/latihan', icon: '✏️' },
  { title: 'Latihan: Dari persamaan', text: 'Tentukan gradien dari persamaan garis.', keywords: 'y = mx + c ax + by + c = 0', to: '/latihan', icon: '✏️' },
  { title: 'Latihan: Sejajar & tegak lurus', text: 'Tentukan gradien garis yang sejajar atau tegak lurus.', keywords: 'gradien hubungan m1 m2', to: '/latihan', icon: '✏️' },
  { title: 'Lab Grafik', text: 'Geser nilai m dan c, lalu lihat garisnya berubah.', keywords: 'slider eksplorasi gradien', to: '/lab', icon: '🧪' },
  { title: 'Lencanaku', text: 'Lihat lencana yang sudah dan belum kamu raih.', keywords: 'badge capaian penghargaan', to: '/lencana', icon: '🏅' },
  { title: 'Catatan', text: 'Catatanmu sendiri dan poin inti materi.', keywords: 'catatanku refleksi', to: '/catatan', icon: '📒' },
  { title: 'Pengaturan', text: 'Ukuran huruf, efek suara, konfeti, dan peringatan tanda.', keywords: 'mute reset suara', to: '/pengaturan', icon: '⚙️' },
];

/**
 * @typedef {{ group: string, icon: string, title: string, text: string, keywords?: string, to: string|null, detail?: string }} SearchItem
 * @param {any} state  state aplikasi (untuk catatan siswa)
 * @returns {SearchItem[]}
 */
export function buildIndex(state) {
  /** @type {SearchItem[]} */
  const items = [];
  for (const m of MODULES) {
    const body = [m.summary, ...m.chunks.flatMap((c) => [...c.text, c.formula, c.keyPoint]), ...m.quiz.map((q) => q.q)];
    items.push({ group: 'Materi', icon: m.icon, title: `${m.id} ${m.title}`, text: body.filter(Boolean).join(' '), to: `/materi/${m.id}` });
  }
  for (const p of BASE_PROBLEMS) {
    items.push({
      group: 'Soal cerita', icon: '🌏', title: p.title, text: p.text,
      keywords: `${TYPE_LABEL[p.type]} ${CONTEXT_LABEL[p.context]} soal cerita literasi`, to: `/literasi/${p.id}`,
    });
  }
  for (const pg of PAGES) items.push({ group: 'Latihan & menu', ...pg });
  for (const g of Object.values(GLOSSARY)) {
    items.push({ group: 'Kamus istilah', icon: '📘', title: g.term, text: g.meaning, to: null, detail: g.meaning });
  }
  for (const b of BADGES) items.push({ group: 'Lencana', icon: b.icon, title: b.title, text: b.desc, to: '/lencana' });
  for (const n of state?.notes ?? []) {
    items.push({ group: 'Catatanku', icon: '📒', title: n.title, text: n.text, to: '/catatan' });
  }
  return items;
}

/** Potongan teks di sekitar kata yang cocok. */
function snippet(text, word, size = 90) {
  const i = normalize(text).indexOf(word);
  if (i < 0) return text.slice(0, size) + (text.length > size ? '…' : '');
  const start = Math.max(0, i - 30);
  return (start > 0 ? '…' : '') + text.slice(start, start + size) + (start + size < text.length ? '…' : '');
}

/**
 * Semua kata harus ditemukan (judul atau isi). Judul diberi bobot lebih tinggi.
 * @param {SearchItem[]} index
 * @param {string} query
 * @param {number} [limit]
 */
export function search(index, query, limit = 20) {
  const words = normalize(query).split(' ').filter(Boolean);
  if (!words.length) return [];
  const results = [];
  for (const item of index) {
    const title = normalize(item.title);
    const all = `${title} ${normalize(item.text)} ${normalize(item.keywords)}`;
    if (!words.every((w) => all.includes(w))) continue;
    const score = words.reduce((s, w) => s + (title.includes(w) ? 3 : 1) + (title.startsWith(w) ? 1 : 0), 0);
    results.push({ ...item, score, snippet: item.detail ?? snippet(item.text, words[0]) });
  }
  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
}
