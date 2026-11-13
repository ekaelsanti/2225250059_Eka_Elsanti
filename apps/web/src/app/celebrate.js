// Perayaan pencapaian (konfeti). Hanya untuk momen selesai bab materi / soal cerita.
// Dilewati bila dimatikan di Pengaturan atau perangkat meminta gerakan dikurangi.
import { getState } from '../store/store.js';
import { playSuccess } from './sound.js';

const listeners = new Set();

export const onCelebrate = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const motionAllowed = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Konfeti + nada keberhasilan. */
export function celebrate() {
  playSuccess();
  if (getState().settings.celebrate === false || !motionAllowed()) return;
  listeners.forEach((l) => l());
}
