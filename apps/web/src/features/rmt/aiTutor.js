// F-35 Placeholder Mediator AI untuk Jalur RMT.
//
// STATUS: belum disambungkan (enabled: false). UI sudah siap; tinggal sambungkan penyedia AI.
//
// Cara menyambungkan (rencana DeepSeek, lihat docs/RMT_FLOW.md §6):
//   1. Tambahkan penyedia di SERVER Python (services/math-engine/mathengine/tutor.py),
//      misalnya pilihan GRADIEKAN_AI_PROVIDER=deepseek. Kunci API hanya di services/math-engine/.env.
//      JANGAN pernah menaruh kunci API di aplikasi (kode ini berjalan di HP siswa).
//   2. Server menerima konteks fase RMT (lesson, phase) agar AI bertanya balik sebagai mediator
//      (mediated questioning), bukan memberi jawaban akhir.
//   3. Ubah AI_TUTOR.enabled menjadi true.
//   4. Catat persetujuan pemilik proyek + ADR di CLAUDE.md §7 dan docs/ARCHITECTURE.md §8
//      (persetujuan F-34 saat ini hanya untuk Claude API).

const API_BASE = import.meta.env?.VITE_API_URL ?? '/api';

export const AI_TUTOR = {
  enabled: false,
  provider: 'deepseek', // direncanakan; dipilih di server, bukan di sini
  endpoint: `${API_BASE}/v1/ask`,
};

/**
 * @typedef {{ lessonId: string, phaseId: string, question: string, history?: {role: 'user'|'assistant', content: string}[] }} TutorRequest
 * @typedef {{ ok: true, answer: string } | { ok: false, reason: 'not-connected'|'offline'|'server', message?: string }} TutorResult
 */

/**
 * Kirim pertanyaan siswa ke Mediator AI. Hanya teks pertanyaan + konteks fase yang dikirim (tanpa kode peserta).
 * @param {TutorRequest} req
 * @returns {Promise<TutorResult>}
 */
export async function askTutor({ lessonId, phaseId, question, history = [] }) {
  if (!AI_TUTOR.enabled) return { ok: false, reason: 'not-connected' };
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return { ok: false, reason: 'offline' };
  try {
    // TODO(DeepSeek): setelah server mendukung field konteks, kirim { lesson, phase } sebagai field terpisah.
    const res = await fetch(AI_TUTOR.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: `[Jalur RMT · ${lessonId} · fase ${phaseId}] ${question}`.slice(0, 500), history: history.slice(-16) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, reason: 'server', message: typeof data.detail === 'string' ? data.detail : undefined };
    return { ok: true, answer: String(data.answer ?? '') };
  } catch {
    return { ok: false, reason: 'server' };
  }
}
