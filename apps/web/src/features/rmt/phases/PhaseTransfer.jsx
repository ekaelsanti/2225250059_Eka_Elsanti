// Fase 7 · Output + transendensi (MLE): prinsip yang sama dipakai di konteks baru (soal cerita).
import { useState } from 'react';
import Illus from '../../../components/Illus.jsx';
import { Feedback, NumberField } from '../components/ui.jsx';

/** @param {{ lesson: any, completed: boolean, onComplete: () => void }} props */
export default function PhaseTransfer({ lesson, completed, onComplete }) {
  const t = lesson.transfer;
  const [done, setDone] = useState(completed);
  return (
    <div className="grid gap-4">
      <div className="flex items-start gap-3 rounded-2xl bg-orange-50 p-4">
        <Illus name="kampung" size={48} />
        <p className="m-0 text-lg text-slate-800">
          Tarif ojek: biaya awal <b className="text-intercept">Rp5.000</b>, lalu bertambah <b className="text-slope">Rp2.000 setiap 1 km</b>.
        </p>
      </div>
      {done ? (
        <Feedback ok>Tepat! Lajunya Rp2.000 per km.</Feedback>
      ) : (
        <NumberField label={t.question} expected={t.answer} suffix="rupiah per km"
          onCorrect={() => {
            setDone(true);
            onComplete();
          }} />
      )}
      {done && (
        <div className="grid gap-2 rounded-3xl bg-gradient-to-br from-emerald-50 to-violet-50 p-5">
          <p className="m-0 text-slate-700">
            Prinsipnya sama: laju = perubahan y ÷ perubahan x. <b className="text-slope">Laju = m (hijau)</b>, <b className="text-intercept">nilai awal = c (ungu)</b>.
          </p>
          <p className="m-0 text-center text-2xl font-black text-slate-800">
            y = <span className="text-slope">2000</span>x + <span className="text-intercept">5000</span>
          </p>
          <a href="#/literasi" className="justify-self-start rounded-2xl bg-white px-4 py-3 font-bold text-orange-700 no-underline shadow-sm hover:bg-orange-50">
            <Illus name="literasi" size={22} className="ico" /> {t.more} →
          </a>
        </div>
      )}
    </div>
  );
}
