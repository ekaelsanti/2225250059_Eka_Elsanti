// Lencana capaian pribadi (motivasi / germane load). Bukan peringkat antarsiswa.
// Setiap lencana: progress(state) -> { value, target, text }. Diraih bila value >= target.
import { BASE_PROBLEMS } from '../content/bank.js';
import { MODULES } from '../content/modules.js';

export const BADGES = [
  {
    id: 'penjelajah-garis',
    icon: '📐',
    title: 'Penjelajah Garis',
    desc: 'Selesai membaca semua materi dasar.',
    progress: (s) => {
      const value = MODULES.filter((m) => s.modules[m.id]?.done).length;
      return { value, target: MODULES.length, text: `${value}/${MODULES.length} materi` };
    },
  },
  {
    id: 'penembak-jitu',
    icon: '🎯',
    title: 'Penembak Jitu Gradien',
    desc: 'Menjawab 5 soal latihan berturut-turut tanpa salah.',
    progress: (s) => {
      const best = s.practice.bestStreak ?? 0;
      return { value: best, target: 5, text: `Rekor beruntun ${Math.min(best, 5)}/5 (sekarang ${s.practice.streak ?? 0})` };
    },
  },
  {
    id: 'master-literasi',
    icon: '🧠',
    title: 'Master Literasi',
    desc: 'Menyelesaikan 4 soal cerita kehidupan sehari-hari.',
    progress: (s) => {
      const value = BASE_PROBLEMS.filter((p) => s.stories[p.id]?.done).length;
      return { value, target: 4, text: `${Math.min(value, 4)}/4 soal cerita` };
    },
  },
  {
    id: 'ilmuwan-grafik',
    icon: '🔬',
    title: 'Ilmuwan Grafik',
    desc: 'Mencoba nilai m positif, negatif, dan nol di Lab Grafik.',
    progress: (s) => {
      const lab = s.lab ?? {};
      const value = ['pos', 'neg', 'zero'].filter((k) => lab[k]).length;
      const mark = (k) => (lab[k] ? '✔' : '○');
      return { value, target: 3, text: `m > 0 ${mark('pos')} · m < 0 ${mark('neg')} · m = 0 ${mark('zero')}` };
    },
  },
];

/** @returns {Array<{badge: typeof BADGES[number], earned: boolean, progress: {value:number,target:number,text:string}}>} */
export const evaluateBadges = (state) =>
  BADGES.map((badge) => {
    const progress = badge.progress(state);
    return { badge, progress, earned: progress.value >= progress.target };
  });

export const earnedIds = (state) => evaluateBadges(state).filter((b) => b.earned).map((b) => b.badge.id);
