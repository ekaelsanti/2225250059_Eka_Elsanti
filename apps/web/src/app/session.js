// Login peran (Siswa / Guru) di perangkat — tanpa server, tanpa nama asli (keputusan pemilik proyek, 18 Nov 2026).
// Sesi TIDAK disimpan: setiap kali aplikasi dibuka, pengguna masuk lagi.
// Catatan: PIN ditampilkan di layar login, jadi ini pemisah tampilan, bukan keamanan.
import { useSyncExternalStore } from 'react';

/** PIN masuk per peran. Ubah di sini bila perlu. */
export const PINS = { siswa: 'siswa1234', guru: 'guru1234' };

/** @typedef {{ role: 'siswa' | 'guru' | null }} Session */
let session = /** @type {Session} */ ({ role: null });
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

export const getSession = () => session;

/**
 * @param {'siswa' | 'guru'} role
 * @param {string} pin
 * @returns {boolean} berhasil?
 */
export function login(role, pin) {
  if (!(role in PINS) || String(pin).trim().toLowerCase() !== PINS[role]) return false;
  session = { role };
  emit();
  return true;
}

export function logout() {
  session = { role: null };
  emit();
}

const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const useSession = () => useSyncExternalStore(subscribe, getSession, getSession);
