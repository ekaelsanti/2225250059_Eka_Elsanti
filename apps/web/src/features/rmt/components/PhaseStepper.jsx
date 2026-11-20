// Penunjuk fase RMT: 8 langkah, dikelompokkan menurut fase kognitif (Input → Elaborasi → Output).
import Illus from '../../../components/Illus.jsx';
import { RMT_TEXT } from '../../../content/rmt.id.js';

export const STAGE_STYLE = {
  Mediasi: { chip: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  Input: { chip: 'bg-sky-100 text-sky-800', dot: 'bg-sky-500' },
  Elaborasi: { chip: 'bg-violet-100 text-violet-800', dot: 'bg-violet-500' },
  Output: { chip: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  Refleksi: { chip: 'bg-rose-100 text-rose-800', dot: 'bg-rose-500' },
};

/**
 * @param {{ phases: import('../../../content/rmt.id.js').RmtPhase[], current: number, done: Set<string>, onJump: (i: number) => void }} props
 */
export default function PhaseStepper({ phases, current, done, onJump }) {
  return (
    <nav aria-label="Fase belajar" className="overflow-x-auto pb-1">
      <ol className="m-0 flex min-w-max list-none gap-2 p-0">
        {phases.map((p, i) => {
          const isDone = done.has(p.id);
          const reachable = i <= current || isDone || done.has(phases[i - 1]?.id);
          const active = i === current;
          return (
            <li key={p.id}>
              <button type="button" disabled={!reachable} aria-current={active ? 'step' : undefined} onClick={() => onJump(i)}
                className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-2xl border-2 px-3 py-1.5 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  active ? 'border-blue-500 bg-white shadow-md' : 'border-transparent bg-white/70 hover:bg-white'
                }`}>
                <span className="relative">
                  <Illus name={p.icon} size={30} />
                  {isDone && <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-[10px] font-black text-white">✓</span>}
                </span>
                <span className="grid leading-tight">
                  <span className={`w-fit rounded-full px-2 text-[10px] font-bold uppercase tracking-wide ${STAGE_STYLE[p.stage].chip}`}>
                    {RMT_TEXT.stageNames[p.stage]}
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {i + 1}. {p.label}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
