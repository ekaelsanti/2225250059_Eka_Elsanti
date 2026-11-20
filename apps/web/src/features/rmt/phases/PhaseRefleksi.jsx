// Fase 8 · Refleksi (Learning Activity): metakognisi & regulasi diri. Disimpan ke Catatan (jurnal RMT).
import { useState } from 'react';
import { RMT_TEXT } from '../../../content/rmt.id.js';
import { addNote } from '../../../store/store.js';
import { Btn, Feedback } from '../components/ui.jsx';

/** @param {{ lesson: any, completed: boolean, onComplete: () => void, notes: Record<string,string>, setNote: (k: string, v: string) => void }} props */
export default function PhaseRefleksi({ lesson, completed, onComplete, notes, setNote }) {
  const r = lesson.refleksi;
  const [saved, setSaved] = useState(completed);
  const filled = r.prompts.some((_, i) => (notes[`r${i}`] ?? '').trim());

  const save = () => {
    const text = r.prompts
      .map((p, i) => [p, (notes[`r${i}`] ?? '').trim()])
      .filter(([, a]) => a)
      .map(([p, a]) => `${p}\n${a}`)
      .join('\n\n');
    const own = (notes.konsep ?? '').trim();
    addNote({ title: r.noteTitle, text: own ? `Konsepku: ${own}\n\n${text}` : text, source: `rmt-${lesson.id}` });
    setSaved(true);
    onComplete();
  };

  return (
    <div className="grid gap-4">
      {r.prompts.map((p, i) => (
        <label key={p} className="grid gap-1 font-semibold text-slate-700">
          {p}
          <textarea rows={2} value={notes[`r${i}`] ?? ''} disabled={saved} onChange={(e) => setNote(`r${i}`, e.target.value)}
            className="rounded-2xl border-2 border-slate-200 px-3 py-2 text-base font-normal focus:border-rose-300 focus:outline-none" />
        </label>
      ))}
      {saved ? (
        <Feedback ok>{RMT_TEXT.reflectionSaved}</Feedback>
      ) : (
        <Btn className="justify-self-start" disabled={!filled} onClick={save}>
          {r.save}
        </Btn>
      )}
    </div>
  );
}
