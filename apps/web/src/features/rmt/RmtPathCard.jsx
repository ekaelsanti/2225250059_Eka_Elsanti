// Kartu pintu masuk Jalur RMT (dipasang di atas daftar Materi).
import Illus from '../../components/Illus.jsx';
import { RMT_LESSONS, RMT_PHASES, RMT_TEXT } from '../../content/rmt.id.js';
import { useAppState } from '../../store/store.js';
import { STAGE_STYLE } from './components/PhaseStepper.jsx';

export default function RmtPathCard({ id = 'gradien' }) {
  const s = useAppState();
  const lesson = RMT_LESSONS[id];
  const prog = s.rmt?.[id] ?? {};
  const doneCount = prog.finished ? RMT_PHASES.length : (prog.done ?? []).length;
  const pct = Math.round((doneCount / RMT_PHASES.length) * 100);
  const label = prog.finished ? RMT_TEXT.done : doneCount ? RMT_TEXT.resume : RMT_TEXT.start;

  return (
    <a href={`#/belajar/${id}`}
      className="rmt-scope grid gap-3 rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-violet-100 via-blue-50 to-emerald-50 p-5 text-slate-800 no-underline shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-4">
        <Illus name="pikir" size={64} />
        <div className="grid flex-1 gap-1">
          <span className="w-fit rounded-full bg-violet-600 px-3 py-0.5 text-xs font-bold text-white">{RMT_TEXT.pathTitle} · {lesson.modules}</span>
          <strong className="text-xl">{lesson.title}</strong>
          <span className="text-sm text-slate-600">{RMT_TEXT.pathDesc}</span>
        </div>
        <span className="hidden rounded-2xl bg-blue-600 px-4 py-3 font-bold text-white sm:block">{label} →</span>
      </div>
      <div className="flex flex-wrap gap-1.5" aria-hidden="true">
        {RMT_PHASES.map((p) => (
          <span key={p.id} className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STAGE_STYLE[p.stage].chip}`}>
            {p.label}
          </span>
        ))}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/80" role="progressbar" aria-label="Progres Jalur RMT" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <span className="block h-full rounded-full bg-violet-600" style={{ width: `${pct}%` }} />
      </div>
      <span className="rounded-2xl bg-blue-600 px-4 py-3 text-center font-bold text-white sm:hidden">{label} →</span>
    </a>
  );
}
