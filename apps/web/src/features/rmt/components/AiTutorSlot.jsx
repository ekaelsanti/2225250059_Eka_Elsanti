// Slot Mediator AI (placeholder). Logika koneksi ada di ../aiTutor.js — UI ini tidak perlu diubah saat AI disambungkan.
import { useState } from 'react';
import Illus from '../../../components/Illus.jsx';
import { RMT_TEXT } from '../../../content/rmt.id.js';
import { AI_TUTOR, askTutor } from '../aiTutor.js';

const T = RMT_TEXT.ai;

/** @param {{ lessonId: string, phaseId: string }} props */
export default function AiTutorSlot({ lessonId, phaseId }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState(/** @type {{role:'user'|'assistant', content:string, error?:boolean}[]} */ ([]));

  const send = async () => {
    const question = text.trim();
    if (!question || busy) return;
    setText('');
    const history = log.filter((m) => !m.error).map(({ role, content }) => ({ role, content }));
    setLog((l) => [...l, { role: 'user', content: question }]);
    setBusy(true);
    const res = await askTutor({ lessonId, phaseId, question, history });
    setBusy(false);
    const msg = res.ok ? res.answer : res.reason === 'not-connected' ? T.soon : res.reason === 'offline' ? T.offline : res.message ?? T.error;
    setLog((l) => [...l, { role: 'assistant', content: msg, error: !res.ok }]);
  };

  return (
    <div className="grid gap-2 rounded-2xl border border-dashed border-violet-300 bg-white/70 p-3" data-ai-slot={phaseId}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}
        className="flex min-h-12 cursor-pointer items-center justify-between gap-2 rounded-xl border-0 bg-transparent px-1 text-left font-bold text-violet-800">
        <span className="flex items-center gap-2">
          <Illus name="tanya" size={26} /> {T.button}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${AI_TUTOR.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {AI_TUTOR.enabled ? 'Aktif' : 'Segera'}
        </span>
      </button>
      {open && (
        <div className="grid gap-2">
          {log.map((m, i) => (
            <p key={i} className={`m-0 rounded-2xl px-3 py-2 text-sm ${m.role === 'user' ? 'ml-6 bg-blue-600 text-white' : m.error ? 'mr-6 bg-amber-50 text-amber-900' : 'mr-6 bg-violet-50 text-slate-800'}`}>
              {m.content}
            </p>
          ))}
          {busy && <p className="m-0 text-sm italic text-slate-500">Mediator sedang berpikir…</p>}
          <div className="flex gap-2">
            <textarea rows={2} maxLength={500} value={text} placeholder={T.placeholder} aria-label={T.placeholder}
              className="min-w-0 flex-1 resize-none rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }} />
            <button type="button" disabled={!text.trim() || busy} onClick={send}
              className="min-h-12 cursor-pointer rounded-xl border-0 bg-violet-600 px-4 font-bold text-white disabled:opacity-50">
              {T.send}
            </button>
          </div>
          <p className="m-0 text-xs text-slate-500">
            <Illus name="gembok" size={14} className="ico" /> {T.privacy}
          </p>
        </div>
      )}
    </div>
  );
}
