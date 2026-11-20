// Fase 6 · Output (Feuerstein): rencana dulu (hindari coba-coba), hitung dengan tepat, lalu validasi di grafik.
import { useState } from 'react';
import CartesianPlane from '../../../components/CartesianPlane.jsx';
import { col } from '../../../styles/tokens.js';
import { Btn, ChoiceList, Feedback, NumberField } from '../components/ui.jsx';

/** @param {{ lesson: any, completed: boolean, onComplete: () => void }} props */
export default function PhaseTerapkan({ lesson, completed, onComplete }) {
  const t = lesson.terapkan;
  const [step, setStep] = useState(completed ? 5 : 0); // 0 rencana · 1 Δy · 2 Δx · 3 m · 4 validasi · 5 selesai
  const { a, b } = t;
  const P = (p, c) => <span className={`font-bold ${c}`}>({p.x}, {p.y})</span>;

  return (
    <div className="grid gap-4">
      <p className="m-0 text-lg text-slate-800">
        Tentukan gradien garis yang melalui A{P(a, 'text-point1')} dan B{P(b, 'text-point2')}.
      </p>
      <div className="flex flex-wrap gap-2 text-sm font-bold">
        <span className="rounded-xl bg-blue-50 px-3 py-1 text-point1">x₁ = {a.x}</span>
        <span className="rounded-xl bg-blue-50 px-3 py-1 text-point1">y₁ = {a.y}</span>
        <span className="rounded-xl bg-orange-50 px-3 py-1 text-point2">x₂ = {b.x}</span>
        <span className="rounded-xl bg-orange-50 px-3 py-1 text-point2">y₂ = {b.y}</span>
      </div>

      <div className="grid gap-2 rounded-2xl bg-slate-50 p-4">
        <p className="m-0 font-bold text-slate-700">① {t.planQuestion}</p>
        {step === 0 ? (
          <ChoiceList options={t.plans} answer={t.planAnswer} feedback={t.planFeedback} okText="Rencana yang pasti. Ayo hitung!" onCorrect={() => setStep(1)} />
        ) : (
          <Feedback ok>{t.plans[0][1]}</Feedback>
        )}
      </div>

      {step >= 1 && (
        <div className="grid gap-3 rounded-2xl bg-slate-50 p-4">
          <p className="m-0 font-bold text-slate-700">② Hitung dengan teliti</p>
          {step === 1 ? (
            <NumberField label={<span><span className="text-rise">Δy</span> = y₂ − y₁ = {b.y} − {a.y} =</span>} expected={t.dy} onCorrect={() => setStep(2)} />
          ) : (
            <p className="m-0 font-bold text-rise">Δy = {t.dy} ✓</p>
          )}
          {step === 2 && <NumberField label={<span><span className="text-run">Δx</span> = x₂ − x₁ = {b.x} − {a.x} =</span>} expected={t.dx} onCorrect={() => setStep(3)} />}
          {step > 2 && <p className="m-0 font-bold text-run">Δx = {t.dx} ✓</p>}
          {step === 3 && (
            <NumberField label={<span><span className="text-slope">m</span> = Δy ÷ Δx = {t.dy} ÷ {t.dx} =</span>} expected={t.m} onCorrect={() => setStep(4)} />
          )}
          {step > 3 && <p className="m-0 text-lg font-black text-slope">m = {t.m} ✓</p>}
        </div>
      )}

      {step >= 4 && (
        <div className="grid gap-3 rounded-2xl bg-emerald-50 p-4">
          <p className="m-0 font-bold text-slate-700">③ {t.validate}</p>
          <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
            <CartesianPlane xMin={-1} xMax={6} yMin={-1} yMax={10} integerGrid ariaLabel="Validasi gradien di grafik"
              points={[
                { x: a.x, y: a.y, color: col('point1'), label: 'A', labelPos: 'left' },
                { x: b.x, y: b.y, color: col('point2'), label: 'B' },
              ]}
              lines={[{ m: Number(t.m), c: a.y - Number(t.m) * a.x, color: col('slope') }]}
              segments={[
                { x1: a.x, y1: a.y, x2: a.x + 1, y2: a.y, color: col('run'), label: 'jalan 1' },
                { x1: a.x + 1, y1: a.y, x2: a.x + 1, y2: a.y + Number(t.m), color: col('rise'), label: `naik ${t.m}` },
              ]} />
          </div>
          {step === 4 ? (
            <Btn className="justify-self-start" onClick={() => {
              setStep(5);
              onComplete();
            }}>
              {t.validateYes}
            </Btn>
          ) : (
            <Feedback ok>{t.validated}</Feedback>
          )}
        </div>
      )}
    </div>
  );
}
