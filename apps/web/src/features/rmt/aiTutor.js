// F-35 Mediator AI untuk Jalur RMT.
//
// Tersambung ke endpoint yang sama dengan Tanya AI (/api/v1/ask):
//   - produksi: Supabase Edge Function "api" (Gemini), diproksi Netlify — lihat docs/DEPLOYMENT.md;
//   - lokal: server Python (mathengine/api.py).
// Kunci API hanya ada di server (Supabase secret / services/math-engine/.env), TIDAK PERNAH di aplikasi ini.
// Yang dikirim: teks pertanyaan, riwayat singkat, dan id jalur/fase. Tanpa nama atau kode peserta.

const API_BASE = import.meta.env?.VITE_API_URL ?? '/api';

export const AI_TUTOR = {
  enabled: true,
  endpoint: `${API_BASE}/v1/ask`,
};

/**
 * @typedef {{ lessonId: string, phaseId: string, question: string, history?: {role: 'user'|'assistant', content: string}[] }} TutorRequest
 * @typedef {{ ok: true, answer: string } | { ok: false, reason: 'not-connected'|'offline'|'server', message?: string }} TutorResult
 */

/**
 * Kirim pertanyaan siswa ke Mediator AI. Server menambahkan peran "mediator" sesuai fase RMT.
 * @param {TutorRequest} req
 * @returns {Promise<TutorResult>}
 */
export async function askTutor({ lessonId, phaseId, question, history = [] }) {
  if (!AI_TUTOR.enabled) return { ok: false, reason: 'not-connected' };
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return { ok: false, reason: 'offline' };
  try {
    const res = await fetch(AI_TUTOR.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: question.slice(0, 500),
        history: history.slice(-16).map((t) => ({ role: t.role, content: t.content.slice(0, 1500) })),
        context: { lesson: lessonId, phase: phaseId },
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, reason: 'server', message: typeof data.detail === 'string' ? data.detail : undefined };
    return { ok: true, answer: String(data.answer ?? '') };
  } catch {
    return { ok: false, reason: 'server' };
  }
}
