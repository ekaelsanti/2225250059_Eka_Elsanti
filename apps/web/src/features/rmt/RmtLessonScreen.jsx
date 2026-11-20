// F-35 Jalur RMT (Rigorous Mathematical Thinking): satu fase per layar (CLAUDE.md §5.1),
// dengan Mediator (MLE) dan Kotak Alat (alat psikologis) di samping. Peta teori: docs/RMT_FLOW.md.
import { useEffect, useMemo, useState } from 'react';
import { celebrate } from '../../app/celebrate.js';
import { go } from '../../app/router.js';
import Gradi from '../../components/Gradi.jsx';
import Illus from '../../components/Illus.jsx';
import { Page } from '../../components/Layout.jsx';
import { RMT_LESSONS, RMT_PHASES, RMT_TEXT } from '../../content/rmt.id.js';
import { setLast, update, useAppState } from '../../store/store.js';
import MediatorPanel from './components/MediatorPanel.jsx';
import PhaseStepper, { STAGE_STYLE } from './components/PhaseStepper.jsx';
import ToolBox from './components/ToolBox.jsx';
import { Btn, Card } from './components/ui.jsx';
import PhaseAmati from './phases/PhaseAmati.jsx';
import PhaseKonsep from './phases/PhaseKonsep.jsx';
import PhaseManipulasi from './phases/PhaseManipulasi.jsx';
import PhaseRefleksi from './phases/PhaseRefleksi.jsx';
import PhaseRepresentasi from './phases/PhaseRepresentasi.jsx';
import PhaseTerapkan from './phases/PhaseTerapkan.jsx';
import PhaseTransfer from './phases/PhaseTransfer.jsx';
import PhaseTujuan from './phases/PhaseTujuan.jsx';

const PHASE_COMPONENTS = {
  tujuan: PhaseTujuan,
  amati: PhaseAmati,
  representasi: PhaseRepresentasi,
  manipulasi: PhaseManipulasi,
  konsep: PhaseKonsep,
  terapkan: PhaseTerapkan,
  transfer: PhaseTransfer,
  refleksi: PhaseRefleksi,
};

/** Simpan progres jalur di perangkat (tanpa server). */
const saveRmt = (id, patch) => update((s) => ({ rmt: { ...(s.rmt ?? {}), [id]: { ...(s.rmt?.[id] ?? {}), ...patch } } }));

/** @param {{ id: string }} props */
export default function RmtLessonScreen({ id }) {
  const lesson = RMT_LESSONS[id];
  const s = useAppState();
  const saved = s.rmt?.[id] ?? {};
  const [index, setIndex] = useState(Math.min(saved.phase ?? 0, RMT_PHASES.length - 1));
  const done = useMemo(() => new Set(saved.done ?? []), [saved.done]);
  const notes = saved.notes ?? {};

  useEffect(() => {
    if (lesson) setLast(`/belajar/${id}`, `${RMT_TEXT.pathTitle}: ${lesson.title}`);
  }, [id, lesson]);

  if (!lesson) {
    return (
      <Page title={RMT_TEXT.pathTitle} back="/materi">
        <p>Jalur belajar tidak ditemukan.</p>
      </Page>
    );
  }

  const phase = RMT_PHASES[index];
  const Phase = PHASE_COMPONENTS[phase.id];
  const isDone = done.has(phase.id);
  const isLast = index === RMT_PHASES.length - 1;
  const goTo = (i) => {
    setIndex(i);
    saveRmt(id, { phase: i });
    window.scrollTo?.(0, 0);
  };
  const complete = () => saveRmt(id, { done: [...new Set([...done, phase.id])] });
  const setNote = (k, v) => saveRmt(id, { notes: { ...notes, [k]: v } });
  const finish = () => {
    saveRmt(id, { finished: true });
    celebrate();
  };

  if (saved.finished) {
    return (
      <Page title={RMT_TEXT.pathTitle} subtitle={lesson.title} back="/materi">
        <Card className="rmt-scope grid justify-items-center gap-4 text-center">
          <Gradi size={110} message={<b>Hebat!</b>} />
          <h2 className="m-0 text-2xl font-black text-slate-800">{RMT_TEXT.finishTitle}</h2>
          <p className="m-0 max-w-md text-slate-600">{RMT_TEXT.finishText}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Btn onClick={() => go('/latihan')}>
              <Illus name="latihan" size={24} /> {RMT_TEXT.finishPractice}
            </Btn>
            <Btn variant="ghost" onClick={() => go('/literasi')}>
              <Illus name="literasi" size={24} /> {RMT_TEXT.finishStory}
            </Btn>
            <Btn variant="soft" onClick={() => {
              saveRmt(id, { finished: false });
              goTo(0);
            }}>
              <Illus name="ulang" size={22} /> Ulangi jalur
            </Btn>
          </div>
        </Card>
      </Page>
    );
  }

  return (
    <Page title={RMT_TEXT.pathTitle} subtitle={`${lesson.title} · Langkah ${index + 1} dari ${RMT_PHASES.length}`} back="/materi">
      <div className="rmt-layout rmt-scope grid gap-4">
        <PhaseStepper phases={RMT_PHASES} current={index} done={done} onJump={goTo} />
        <div className="grid items-start gap-4 min-[1100px]:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="grid gap-5">
            <header className="flex items-center gap-3">
              <Illus name={phase.icon} size={52} />
              <div className="grid gap-1">
                <span className={`w-fit rounded-full px-3 py-0.5 text-xs font-bold ${STAGE_STYLE[phase.stage].chip}`}>
                  {RMT_TEXT.stageNames[phase.stage]} · {phase.pillar}
                </span>
                <h2 className="m-0 text-2xl font-black text-slate-800">
                  {index + 1}. {phase.label}
                </h2>
              </div>
            </header>

            <Phase key={phase.id} lesson={lesson} completed={isDone} onComplete={complete} notes={notes} setNote={setNote} />

            <footer className="grid grid-cols-2 gap-3 border-0 border-t border-solid border-slate-100 pt-4">
              <Btn variant="ghost" disabled={index === 0} onClick={() => goTo(index - 1)}>
                {RMT_TEXT.back}
              </Btn>
              <Btn disabled={!isDone} title={isDone ? undefined : RMT_TEXT.locked} onClick={() => (isLast ? finish() : goTo(index + 1))}>
                {isLast ? RMT_TEXT.finish : RMT_TEXT.next}
              </Btn>
            </footer>
          </Card>

          <aside className="grid gap-4 min-[1100px]:sticky min-[1100px]:top-24">
            <MediatorPanel key={phase.id} lessonId={id} phaseId={phase.id} questions={lesson.mediator[phase.id] ?? []} />
            <ToolBox lesson={lesson} />
          </aside>
        </div>
      </div>
    </Page>
  );
}
