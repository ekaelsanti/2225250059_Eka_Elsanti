// Penyimpanan lokal (di perangkat siswa saja, tanpa server). Tidak menyimpan nama asli.
import { useSyncExternalStore } from 'react';

const KEY = 'gradiekan:v1';

const INITIAL = {
  onboardingDone: false,
  settings: { fontScale: 'normal', signWarning: true, sound: true, celebrate: true, navOpen: true },
  modules: {}, // { M4: { lastChunk, done, quizCorrect } }
  practice: { solved: 0, independent: 0, byLevel: {}, streak: 0, bestStreak: 0 },
  lab: { pos: false, neg: false, zero: false }, // Lab Grafik: jenis m yang pernah dicoba
  badgesSeen: [], // lencana yang sudah diumumkan (agar notifikasi muncul sekali)
  stories: {}, // { id: { done, assisted } }
  notes: [], // { id, title, text, source, createdAt }
  last: null, // { path, label }
};

function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return INITIAL;
    const saved = JSON.parse(raw);
    return {
      ...INITIAL,
      ...saved,
      settings: { ...INITIAL.settings, ...saved.settings },
      practice: { ...INITIAL.practice, ...saved.practice },
      lab: { ...INITIAL.lab, ...saved.lab },
    };
  } catch {
    return INITIAL;
  }
}

let state = typeof window === 'undefined' ? INITIAL : load();
const listeners = new Set();

export const getState = () => state;

/** @param {(s: typeof INITIAL) => Partial<typeof INITIAL>} fn */
export function update(fn) {
  state = { ...state, ...fn(state) };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* penyimpanan penuh/diblokir: aplikasi tetap jalan */
  }
  listeners.forEach((l) => l());
}

const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const useAppState = () => useSyncExternalStore(subscribe, getState, getState);

// ---------------------------------------------------------------- aksi

export const setLast = (path, label) => update(() => ({ last: { path, label } }));

export const saveModule = (id, patch) =>
  update((s) => ({ modules: { ...s.modules, [id]: { ...s.modules[id], ...patch } } }));

export const saveStory = (id, patch) =>
  update((s) => ({ stories: { ...s.stories, [id]: { ...s.stories[id], ...patch } } }));

/**
 * @param {number} level
 * @param {boolean} independent tanpa membuka bantuan
 * @param {boolean} clean       benar pada percobaan pertama di setiap langkah & tanpa bantuan (untuk beruntun)
 */
export const recordPractice = (level, independent, clean = independent) =>
  update((s) => {
    const streak = clean ? (s.practice.streak ?? 0) + 1 : 0;
    return {
      practice: {
        ...s.practice,
        solved: s.practice.solved + 1,
        independent: s.practice.independent + (independent ? 1 : 0),
        byLevel: { ...s.practice.byLevel, [level]: (s.practice.byLevel[level] ?? 0) + 1 },
        streak,
        bestStreak: Math.max(s.practice.bestStreak ?? 0, streak),
      },
    };
  });

/** Lab Grafik: catat jenis gradien yang pernah dicoba ('pos' | 'neg' | 'zero'). */
export const markLab = (kind) => {
  if (state.lab?.[kind]) return; // hindari tulis ulang saat slider digeser
  update((s) => ({ lab: { ...INITIAL.lab, ...s.lab, [kind]: true } }));
};

export const markBadgesSeen =(ids) => update((s) => ({ badgesSeen: [...new Set([...(s.badgesSeen ?? []), ...ids])] }));

export const addNote = ({ title, text, source = null }) =>
  update((s) => ({
    notes: [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title, text, source, createdAt: new Date().toISOString() },
      ...s.notes,
    ],
  }));

export const deleteNote = (id) => update((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));

export const setSetting = (key, value) => update((s) => ({ settings: { ...s.settings, [key]: value } }));

export const resetAll = () => update(() => ({ ...INITIAL, onboardingDone: true }));
