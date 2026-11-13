// Pemasangan aplikasi (PWA) tanpa Play Store / App Store.
// Chrome/Edge (Android, Windows, macOS) mengirim event `beforeinstallprompt` yang bisa dipicu dari tombol.
// iOS/iPadOS tidak punya event ini, jadi aplikasi menampilkan panduan "Tambahkan ke Layar Utama".
import { useSyncExternalStore } from 'react';

let deferredPrompt = null;
let installed = false;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true);

/** Dipanggil sekali saat aplikasi dimuat (main.jsx), sebelum layar apa pun tampil. */
export function initInstall() {
  if (typeof window === 'undefined') return;
  installed = isStandalone();
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // tahan banner bawaan; tampilkan lewat tombol kita
    deferredPrompt = e;
    emit();
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    deferredPrompt = null;
    emit();
  });
}

/** @returns {'ios' | 'android' | 'desktop'} */
export function detectPlatform() {
  const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
}

/** @returns {Promise<'accepted' | 'dismissed' | 'unavailable'>} */
export async function promptInstall() {
  if (!deferredPrompt) return 'unavailable';
  const prompt = deferredPrompt;
  deferredPrompt = null;
  emit();
  await prompt.prompt();
  const { outcome } = await prompt.userChoice;
  if (outcome === 'accepted') installed = true;
  emit();
  return outcome;
}

let snapshot = { canPrompt: false, installed: false };
const getSnapshot = () => {
  const next = { canPrompt: deferredPrompt !== null, installed };
  if (next.canPrompt !== snapshot.canPrompt || next.installed !== snapshot.installed) snapshot = next;
  return snapshot;
};
const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const useInstallState = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
