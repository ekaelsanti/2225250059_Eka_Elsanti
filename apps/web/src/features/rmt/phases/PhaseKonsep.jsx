// Fase 5 · Elaborasi → konsep ilmiah (Vygotsky): dari intuisi sehari-hari ke definisi dan bahasa matematika.
import { useState } from 'react';
import { ChoiceList } from '../components/ui.jsx';

/** @param {{ lesson: any, completed: boolean, onComplete: () => void, notes: Record<string,string>, setNote: (k: string, v: string) => void }} props */
export default function PhaseKonsep({ lesson, completed, onComplete, notes, setNote }) {
  const k = lesson.konsep;
  const [found, setFound] = useState(completed);
  return (
    <div className="grid gap-4">
      <p className="m-0 font-semibold text-slate-700">{k.intro}</p>
      <ChoiceList options={k.options} answer={k.answer} feedback={k.feedback} okText="Tepat! Itulah konsep kemiringan."
        onCorrect={() => {
          setFound(true);
          onComplete();
        }} />
      {found && (
        <div className="grid gap-3 rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 p-5">
          <p className="m-0 text-xs font-bold uppercase tracking-wide text-emerald-700">{k.formalTitle}</p>
          <p className="m-0 text-slate-700">{k.formal}</p>
          <p className="m-0 text-center text-3xl font-black text-slate-800">
            <span className="text-slope">m</span> = <span className="text-rise">Δy</span> / <span className="text-run">Δx</span>
          </p>
          <p className="m-0 text-center text-lg text-slate-700">
            = <span className="text-rise">(y₂ − y₁)</span> / <span className="text-run">(x₂ − x₁)</span>
          </p>
          <label className="grid gap-1 text-sm font-semibold text-slate-600">
            {k.ownWords}
            <textarea rows={2} value={notes.konsep ?? ''} onChange={(e) => setNote('konsep', e.target.value)}
              className="rounded-2xl border-2 border-slate-200 px-3 py-2 text-base focus:border-emerald-400 focus:outline-none"
              placeholder="Kemiringan adalah…" />
          </label>
        </div>
      )}
    </div>
  );
}
