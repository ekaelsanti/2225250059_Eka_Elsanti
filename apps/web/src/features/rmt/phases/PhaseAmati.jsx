// Fase 2 · Input (Feuerstein): mengumpulkan data dengan teliti dari konsep sehari-hari, lalu membandingkan.
import Illus from '../../../components/Illus.jsx';
import { ChoiceList } from '../components/ui.jsx';

/** @param {{ lesson: any, onComplete: () => void }} props */
export default function PhaseAmati({ lesson, onComplete }) {
  const a = lesson.amati;
  return (
    <div className="grid gap-4">
      <p className="m-0 text-slate-700">{a.intro}</p>
      <p className="m-0 text-lg font-bold text-slate-800">{a.question}</p>
      <ChoiceList columns="grid-cols-1 sm:grid-cols-3" answer={a.answer} feedback={a.feedback} onCorrect={onComplete}
        options={lesson.situations.map((s) => [s.id, s.name])}
        renderOption={(key) => {
          const s = lesson.situations.find((x) => x.id === key);
          return (
            <span className="grid justify-items-center gap-2 text-center">
              <Illus name={s.illus} size={64} />
              <strong className="text-slate-800">{s.name}</strong>
              <span className="flex gap-2 text-sm">
                <span className="rounded-full bg-pink-50 px-2 font-bold text-rise">naik {s.rise}</span>
                <span className="rounded-full bg-cyan-50 px-2 font-bold text-run">jalan {s.run}</span>
              </span>
            </span>
          );
        }} />
    </div>
  );
}
