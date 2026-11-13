// Efek suara lembut (Web Audio API, tanpa file audio -> tetap offline & ringan).
// Hanya berbunyi karena aksi siswa. Dapat dimatikan di Pengaturan (settings.sound).
// Nada salah sengaja lembut dan turun pelan, bukan bunyi "tetot" (K01: tidak mengintimidasi).
import { getState } from '../store/store.js';

let ctx = null;
let lastTick = 0;

function audio() {
  if (getState().settings.sound === false || typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Satu nada pendek dengan selubung volume halus (tanpa bunyi "klik" di awal/akhir). */
function tone(ac, { freq, endFreq, start = 0, dur = 0.15, gain = 0.06, type = 'sine' }) {
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
  vol.gain.setValueAtTime(0.0001, t0);
  vol.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  vol.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(vol).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

const play = (fn) => {
  const ac = audio();
  if (!ac) return;
  try {
    fn(ac);
  } catch {
    /* audio gagal: abaikan, aplikasi tetap jalan */
  }
};

/** "Ting!" ceria dua nada (C6 -> E6). */
export const playCorrect = () =>
  play((ac) => {
    tone(ac, { freq: 1046.5, dur: 0.16, gain: 0.06 });
    tone(ac, { freq: 1318.5, start: 0.08, dur: 0.32, gain: 0.06 });
  });

/** Nada lembut turun pelan: "coba lagi", bukan "salah!". */
export const playWrong = () =>
  play((ac) => {
    tone(ac, { freq: 440, endFreq: 370, dur: 0.26, gain: 0.04, type: 'sine' });
  });

/** Klik halus untuk slider (dibatasi agar tidak berisik saat digeser cepat). */
export const playTick = () => {
  const now = Date.now();
  if (now - lastTick < 45) return;
  lastTick = now;
  play((ac) => tone(ac, { freq: 1500, dur: 0.035, gain: 0.02, type: 'triangle' }));
};

/** Arpeggio singkat untuk menyelesaikan bab/soal cerita. */
export const playSuccess = () =>
  play((ac) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(ac, { freq: f, start: i * 0.09, dur: 0.3, gain: 0.05 }));
  });
