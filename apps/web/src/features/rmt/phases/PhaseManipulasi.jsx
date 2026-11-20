// Fase 4 · Elaborasi: penalaran hipotetis. Dugaan dulu (bukan coba-coba), lalu manipulasi dan bukti di grafik.
import { useState } from 'react';
import { playTick } from '../../../app/sound.js';
import CartesianPlane from '../../../components/CartesianPlane.jsx';
import { formatNumber, frac, toString } from '../../../math/fraction.js';
import { col } from '../../../styles/tokens.js';
import { Btn, Feedback } from '../components/ui.jsx';

/** @param {{ lesson: any, completed: boolean, onComplete: () => void }} props */
export default function PhaseManipulasi({ lesson, completed, onComplete }) {
  const m = lesson.manipulasi;
  const [guess, setGuess] = useState(completed ? m.answer : null);
  const [rise, setRise] = useState(m.startRise);
  const [run, setRun] = useState(completed ? m.targetRun : m.startRun);
  const slope = frac(BigInt(rise), BigInt(run));
  const reached = run === m.targetRun && rise === m.startRise;

  return (
    <div className="grid gap-4">
      <p className="m-0 text-slate-700">{m.intro}</p>
      <div className="grid gap-2 rounded-2xl bg-violet-50 p-4">
        <p className="m-0 font-bold text-violet-900">{m.question}</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {m.options.map(([key, label]) => (
            <button key={key} type="button" aria-pressed={guess === key} disabled={guess !== null}
              className={`min-h-12 cursor-pointer rounded-2xl border-2 bg-white px-3 font-semibold transition disabled:cursor-default ${guess === key ? 'border-violet-500' : 'border-slate-200 hover:border-violet-300'}`}
              onClick={() => setGuess(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {guess !== null && (
        <>
          <p className="m-0 font-semibold text-slate-700">{m.task}</p>
          <div className="grid gap-4 2xl:grid-cols-2">
            <div className="grid content-start gap-4">
              <label className="grid gap-1 font-bold text-rise">
                Naik (Δy) = {rise} <span className="text-xs font-semibold text-slate-500">(dibuat tetap agar perbandingannya adil)</span>
                <input type="range" min={1} max={6} value={rise} disabled aria-label="Naik (Δy)" className="w-full accent-pink-600"
                  onChange={(e) => {
                    setRise(Number(e.target.value));
                    playTick();
                  }} />
              </label>
              <label className="grid gap-1 font-bold text-run">
                Jalan (Δx) = {run}
                <input type="range" min={1} max={8} value={run} aria-label="Jalan (Δx)" className="w-full accent-cyan-600"
                  onChange={(e) => {
                    setRun(Number(e.target.value));
                    playTick();
                  }} />
              </label>
              <p className="m-0 rounded-2xl bg-emerald-50 px-4 py-3 text-xl font-black text-slate-800">
                <span className="text-slope">naik ÷ jalan</span> = {rise}/{run} = {toString(slope)}
                <span className="ml-2 text-sm font-semibold text-slate-500">(≈ {formatNumber(slope)})</span>
              </p>
            </div>
            <div className="mx-auto w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-2">
              <CartesianPlane xMin={-1} xMax={9} yMin={-1} yMax={7} integerGrid ariaLabel="Garis yang bisa digeser"
                lines={[{ m: rise / run, c: 0, color: col('slope'), label: `m = ${toString(slope)}` }]}
                segments={[
                  { x1: 0, y1: 0, x2: run, y2: 0, color: col('run'), label: `Δx = ${run}` },
                  { x1: run, y1: 0, x2: run, y2: rise, color: col('rise'), label: `Δy = ${rise}` },
                ]} />
            </div>
          </div>
          {reached && !completed && (
            <Btn className="justify-self-start" onClick={onComplete}>
              Bandingkan dengan dugaanku
            </Btn>
          )}
          {completed && <Feedback ok={guess === m.answer}>{guess === m.answer ? m.confirmRight : m.confirmWrong}</Feedback>}
        </>
      )}
    </div>
  );
}
