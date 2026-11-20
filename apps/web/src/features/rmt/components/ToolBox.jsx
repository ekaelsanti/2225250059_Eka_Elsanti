// Alat psikologis spesifik matematika (Vygotsky/RMT): tabel, bidang koordinat, rumus, bahasa (kamus).
// Dibuka atas permintaan siswa (DS03).
import { useState } from 'react';
import CartesianPlane from '../../../components/CartesianPlane.jsx';
import Illus from '../../../components/Illus.jsx';
import { RMT_TEXT } from '../../../content/rmt.id.js';
import { SITUATION_COLORS } from './situationColors.js';

const TOOLS = [
  ['tabel', 'kertas'],
  ['bidang', 'grafik'],
  ['rumus', 'samaDengan'],
  ['kamus', 'kamus'],
];

/** @param {{ lesson: any }} props */
export default function ToolBox({ lesson }) {
  const [tool, setTool] = useState(null);
  return (
    <section aria-labelledby="toolbox-title" className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4">
      <div>
        <h2 id="toolbox-title" className="m-0 text-base font-extrabold text-slate-800">
          {RMT_TEXT.toolsTitle}
        </h2>
        <p className="m-0 text-xs text-slate-500">{RMT_TEXT.toolsIntro}</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {TOOLS.map(([id, icon]) => (
          <button key={id} type="button" aria-pressed={tool === id} onClick={() => setTool(tool === id ? null : id)}
            className={`grid min-h-16 cursor-pointer place-items-center gap-1 rounded-2xl border-2 px-1 py-2 text-[11px] font-bold transition ${
              tool === id ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}>
            <Illus name={icon} size={28} />
            {RMT_TEXT.tools[id]}
          </button>
        ))}
      </div>

      {tool === 'tabel' && (
        <table className="w-full border-collapse overflow-hidden rounded-xl text-sm">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="p-2">Benda</th>
              <th className="p-2 text-rise">Naik (Δy)</th>
              <th className="p-2 text-run">Jalan (Δx)</th>
            </tr>
          </thead>
          <tbody>
            {lesson.situations.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="p-2">{s.name}</td>
                <td className="p-2 font-bold text-rise">{s.rise}</td>
                <td className="p-2 font-bold text-run">{s.run}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tool === 'bidang' && (
        <CartesianPlane xMin={-1} xMax={9} yMin={-1} yMax={5} integerGrid ariaLabel="Garis ketiga benda pada bidang koordinat"
          segments={lesson.situations.map((s, i) => ({ x1: 0, y1: 0, x2: s.run, y2: s.rise, color: SITUATION_COLORS[i], label: s.name }))} />
      )}
      {tool === 'rumus' && (
        <div className="rounded-2xl bg-emerald-50 p-3 text-center">
          <p className="m-0 text-2xl font-black text-slate-800">
            <span className="text-slope">m</span> = <span className="text-rise">Δy</span> ÷ <span className="text-run">Δx</span>
          </p>
          <p className="m-0 mt-1 text-sm text-slate-600">
            <span className="text-rise">Δy = y₂ − y₁</span> · <span className="text-run">Δx = x₂ − x₁</span>
          </p>
        </div>
      )}
      {tool === 'kamus' && (
        <dl className="m-0 grid gap-2">
          {lesson.glossary.map(([term, meaning]) => (
            <div key={term} className="rounded-xl bg-slate-50 px-3 py-2">
              <dt className="text-sm font-bold text-slate-800">{term}</dt>
              <dd className="m-0 text-sm text-slate-600">{meaning}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
