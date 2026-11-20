// Fase 1 · Mediasi (MLE): intensionalitas (tujuan jelas) dan pemberian makna.
import Illus from '../../../components/Illus.jsx';
import { RMT_TEXT } from '../../../content/rmt.id.js';
import { Btn } from '../components/ui.jsx';

/** @param {{ lesson: any, completed: boolean, onComplete: () => void }} props */
export default function PhaseTujuan({ lesson, completed, onComplete }) {
  const t = lesson.tujuan;
  return (
    <div className="grid gap-4">
      <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4">
        <Illus name="bintang" size={40} />
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-wide text-amber-700">Tujuan hari ini</p>
          <p className="m-0 text-lg font-bold text-slate-800">{t.goal}</p>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-2xl bg-sky-50 p-4">
        <Illus name="lampu" size={40} />
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-wide text-sky-700">Kenapa ini penting?</p>
          <p className="m-0 text-base text-slate-700">{t.meaning}</p>
        </div>
      </div>
      <ol className="m-0 grid list-none gap-2 p-0">
        {t.steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 text-slate-700">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-black text-white">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      {!completed && (
        <Btn className="justify-self-start" onClick={onComplete}>
          {RMT_TEXT.ready}
        </Btn>
      )}
    </div>
  );
}
