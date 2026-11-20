// F-34 Tanya AI (gabungan): jawab dulu dari bank jawaban offline; jika tidak ketemu, tanya Claude lewat server Python.
// Privasi: yang dikirim ke server hanya teks pertanyaan + riwayat obrolan singkat. Tanpa kode peserta/progres.
import { normalize } from './search.js';
import { GLOSSARY } from '../content/bank.js';
import { TANYA_FAQ } from '../content/strings.id.js';

const API_BASE = import.meta.env?.VITE_API_URL ?? '/api';

/**
 * @typedef {{ answer: string, to?: string, toLabel?: string }} OfflineAnswer
 * Skor = jumlah panjang frasa kunci yang muncul di pertanyaan (frasa panjang lebih kuat).
 * @param {string} question
 * @returns {OfflineAnswer|null}
 */
export function answerOffline(question) {
  const q = ` ${normalize(question).replace(/[?!.,]/g, ' ')} `;
  let best = null;
  let bestScore = 0;
  for (const item of TANYA_FAQ) {
    let score = 0;
    for (const key of item.keys) if (q.includes(` ${key} `) || (key.includes(' ') && q.includes(key))) score += key.length;
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  }
  if (best && bestScore >= 6) return { answer: best.answer, to: best.to, toLabel: best.toLabel };

  // kamus istilah: "apa itu <istilah>"
  for (const g of Object.values(GLOSSARY)) {
    const term = normalize(g.term);
    if (term.length >= 4 && q.includes(` ${term} `)) return { answer: `${g.term}: ${g.meaning}` };
  }
  return null;
}

/** @returns {Promise<boolean>} true bila server Python aktif dan kunci API sudah dipasang */
export async function aiStatus() {
  try {
    const res = await fetch(`${API_BASE}/v1/ask/status`);
    if (!res.ok) return false;
    return Boolean((await res.json()).enabled);
  } catch {
    return false;
  }
}

/**
 * @param {string} question
 * @param {{role: 'user'|'assistant', content: string}[]} history
 * @returns {Promise<{ok: true, answer: string} | {ok: false, error: string}>}
 */
export async function askAI(question, history) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return { ok: false, error: 'offline' };
  try {
    const res = await fetch(`${API_BASE}/v1/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question.slice(0, 500), history: history.slice(-16).map((t) => ({ ...t, content: t.content.slice(0, 1500) })) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: typeof data.detail === 'string' ? data.detail : 'server' };
    return { ok: true, answer: String(data.answer ?? '') };
  } catch {
    return { ok: false, error: 'server' };
  }
}
