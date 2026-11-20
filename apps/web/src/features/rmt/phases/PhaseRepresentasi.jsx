// Fase 3 · Elaborasi: data diwakili dengan alat psikologis (tabel + bidang koordinat), lalu dibandingkan sebagai rasio.
import { useState } from 'react';
import CartesianPlane from '../../../components/CartesianPlane.jsx';
import { Feedback, NumberField } from '../components/ui.jsx';
import { SITUATION_COLORS } from '../components/situationColors.js';

/** @param {{ lesson: any, completed: boolean, onComplete: () => void }} props */
export default function PhaseRepresentasi({ lesson, completed, onComplete }) {
  const [solved, setSolved] = useState(() => new Set(completed ? lesson.situations.map((s) => s.id) : []));
  const mark = (id) =>
    setSolved((prev) => {
      const next = new Set(prev).add(id);
      if (next.size === lesson.situations.length) onComplete();
      return next;
    });

  return (
    <div className="grid gap-4">
      <p className="m-0 text-slate-700">{lesson.representasi.intro}</p>
      <div className="grid gap-4 2xl:grid-cols-2">
        <div className="grid content-start gap-3">
          {lesson.situations.map((s, i) => (
            <div key={s.id} className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="h-3 w-3 rounded-full" style={{ background: SITUATION_COLORS[i] }} aria-hidden="true" />
                <strong className="text-slate-800">{s.name}</strong>
                <span className="font-bold text-rise">Δy = {s.rise}</span>
                <span className="font-bold text-run">Δx = {s.run}</span>
              </div>
              {completed || solved.has(s.id) ? (
                <p className="m-0 font-bold text-emerald-700">
                  naik ÷ jalan = {s.rise}/{s.run}{`${s.rise}/${s.run}` !== s.ratio && ` = ${s.ratio}`} ✓
                </p>
              ) : (
                <NumberField label={`naik ÷ jalan untuk ${s.name.toLowerCase()} =`} expected={s.ratio} onCorrect={() => mark(s.id)} />
              )}
            </div>
          ))}
        </div>
        <div className="mx-auto w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-2">
          <CartesianPlane xMin={-1} xMax={9} yMin={-1} yMax={5} integerGrid ariaLabel="Tiga garis dari titik asal"
            segments={lesson.situations.map((s, i) => ({ x1: 0, y1: 0, x2: s.run, y2: s.rise, color: SITUATION_COLORS[i], label: s.name }))} />
        </div>
      </div>
      {(completed || solved.size === lesson.situations.length) && <Feedback ok>{lesson.representasi.conclusion}</Feedback>}
    </div>
  );
}
