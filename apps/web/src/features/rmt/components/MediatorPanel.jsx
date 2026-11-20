// MLE (Feuerstein): Gradi sebagai mediator. Pertanyaan penuntun dibuka satu per satu (on-demand, DS03),
// ditambah slot Mediator AI (placeholder) di bawahnya.
import { useState } from 'react';
import Gradi from '../../../components/Gradi.jsx';
import Illus from '../../../components/Illus.jsx';
import { RMT_TEXT } from '../../../content/rmt.id.js';
import AiTutorSlot from './AiTutorSlot.jsx';

/** @param {{ lessonId: string, phaseId: string, questions: string[] }} props */
export default function MediatorPanel({ lessonId, phaseId, questions }) {
  const [shown, setShown] = useState(0);
  return (
    <section aria-labelledby="mediator-title" className="grid gap-3 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 p-4">
      <div className="flex items-center gap-3">
        <Gradi size={48} showName={false} />
        <div>
          <h2 id="mediator-title" className="m-0 text-base font-extrabold text-violet-900">
            {RMT_TEXT.mediatorTitle}
          </h2>
          <p className="m-0 text-xs text-slate-600">{RMT_TEXT.mediatorIntro}</p>
        </div>
      </div>
      {shown === 0 && <p className="m-0 text-sm text-slate-600">{RMT_TEXT.mediatorEmpty}</p>}
      <ol className="m-0 grid list-none gap-2 p-0">
        {questions.slice(0, shown).map((q, i) => (
          <li key={i} className="flex gap-2 rounded-2xl bg-white px-3 py-2 text-sm text-slate-800 shadow-sm">
            <Illus name="lampu" size={20} className="ico shrink-0" />
            <span>{q}</span>
          </li>
        ))}
      </ol>
      {shown < questions.length && (
        <button type="button" onClick={() => setShown(shown + 1)}
          className="min-h-12 cursor-pointer rounded-2xl border-0 bg-white px-4 font-bold text-violet-700 shadow-sm hover:bg-violet-100">
          <Illus name="lampu" size={20} className="ico" /> {shown === 0 ? 'Buka pertanyaan penuntun' : RMT_TEXT.mediatorMore} ({shown}/{questions.length})
        </button>
      )}
      <AiTutorSlot key={phaseId} lessonId={lessonId} phaseId={phaseId} />
    </section>
  );
}
