// Materi M0-M6: F-09 chunking, F-12 navigasi self-paced + poin inti, F-03 recap.
import { useEffect, useState } from 'react';
import { celebrate } from '../app/celebrate.js';
import { go } from '../app/router.js';
import CheckItem from '../components/CheckItem.jsx';
import Gradi from '../components/Gradi.jsx';
import { Page } from '../components/Layout.jsx';
import Visual from '../components/Visual.jsx';
import { MODULE_BY_ID, MODULES } from '../content/modules.js';
import { saveModule, setLast, useAppState } from '../store/store.js';
import Illus from '../components/Illus.jsx';
import PageBanner from '../components/PageBanner.jsx';
import { PAGE_TEXT } from '../content/strings.id.js';
import RmtPathCard from '../features/rmt/RmtPathCard.jsx';

const TONES = ['blue', 'green', 'orange', 'purple', 'cyan', 'pink', 'yellow'];

// ikon ilustrasi tiap modul (menggantikan emoji)
const MODULE_ILLUS = { M0: 'sempoa', M1: 'tangga', M2: 'grafik', M3: 'panah', M4: 'pin', M5: 'samaDengan', M6: 'tegak' };

export function MateriListScreen() {
  const s = useAppState();
  const done = MODULES.filter((m) => s.modules[m.id]?.done).length;
  const pct = Math.round((done / MODULES.length) * 100);
  return (
    <Page title="Materi" subtitle="Kemiringan Garis Lurus">
      <PageBanner tone="blue" illus="materi" title={PAGE_TEXT.materi.title}>
        <strong className="pb-progress-label">
          {done} dari {MODULES.length} materi selesai
        </strong>
        <div className="stat-bar pb-bar" role="progressbar" aria-label="Progres materi" aria-valuemin={0} aria-valuemax={MODULES.length} aria-valuenow={done}>
          <span style={{ width: `${pct}%` }} />
        </div>
        <p>{PAGE_TEXT.materi.text}</p>
      </PageBanner>
      <RmtPathCard />
      <div className="list">
        {MODULES.map((m, i) => {
          const p = s.modules[m.id];
          const state = p?.done ? 'done' : p ? 'doing' : 'todo';
          const status = { done: 'Selesai', doing: 'Sedang dipelajari', todo: `± ${m.minutes} menit` }[state];
          return (
            <a key={m.id} href={`#/materi/${m.id}`} className={`list-card ${state === 'done' ? 'done' : ''}`}>
              <span className={`list-icon tone-${TONES[i % TONES.length]}`} aria-hidden="true">
                <Illus name={MODULE_ILLUS[m.id] ?? 'materi'} size={36} />
              </span>
              <span className="list-body">
                <small>{m.id}</small>
                <strong>{m.title}</strong>
                <span className="muted">{m.summary}</span>
                <span className={`badge inline ${state === 'done' ? 'ok' : state === 'doing' ? 'doing' : ''}`}>
                  {state === 'done' && <Illus name="benar" size={16} className="ico" />}
                  {state === 'doing' && <Illus name="main" size={16} className="ico" />}
                  {status}
                </span>
              </span>
              <span className="chev" aria-hidden="true">›</span>
            </a>
          );
        })}
      </div>
    </Page>
  );
}

function KeyPoint({ children }) {
  return (
    <div className="keypoint">
      <Illus name="bintang" size={24} className="ico" /> <span>{children}</span>
    </div>
  );
}

export function MateriModuleScreen({ id }) {
  const module = MODULE_BY_ID[id];
  const s = useAppState();
  const total = module ? module.chunks.length + 1 : 0; // + layar ringkasan & kuis
  const [i, setI] = useState(() => Math.min(s.modules[id]?.lastChunk ?? 0, total - 1));
  const [quizSolved, setQuizSolved] = useState(0);

  useEffect(() => {
    if (!module) return;
    saveModule(id, { lastChunk: i });
    setLast(`/materi/${id}`, `${module.id} ${module.title}`);
  }, [id, i, module]);

  if (!module) {
    return (
      <Page title="Materi tidak ditemukan" back="/materi">
        <p>Materi ini belum tersedia.</p>
      </Page>
    );
  }

  const onSummary = i === module.chunks.length;
  const chunk = module.chunks[i];
  const keyPoints = module.chunks.filter((c) => c.keyPoint).map((c) => c.keyPoint);

  return (
    <Page title={module.title} subtitle={`${module.id} · Langkah ${i + 1} dari ${total}`} back="/materi">
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${((i + 1) / total) * 100}%` }} />
      </div>

      {!onSummary && (
        <article className="card chunk" key={i}>
          <Visual visual={chunk.visual} />
          {chunk.text.map((t, j) => (
            <p key={j}>{t}</p>
          ))}
          {chunk.formula && <div className="formula">{chunk.formula}</div>}
          {chunk.keyPoint && <KeyPoint>{chunk.keyPoint}</KeyPoint>}
          {chunk.link && (
            <a className="btn" href={`#${chunk.link.to}`}>
              {chunk.link.icon && <Illus name={chunk.link.icon} size={22} className="ico" />} {chunk.link.label}
            </a>
          )}
          {chunk.check && (
            <div className="check">
              <p className="check-title"><Illus name="pikir" size={26} className="ico" /> Coba sebentar (boleh dilewati)</p>
              <CheckItem item={chunk.check} />
            </div>
          )}
        </article>
      )}

      {onSummary && (
        <article className="card chunk">
          <h2><Illus name="bintang" size={26} className="ico" /> Poin inti</h2>
          {keyPoints.map((k) => (
            <KeyPoint key={k}>{k}</KeyPoint>
          ))}
          <h2><Illus name="tulis" size={26} className="ico" /> Kuis singkat</h2>
          {module.quiz.map((q, j) => (
            <div key={j} className="quiz-item">
              <CheckItem item={q} onSolved={() => setQuizSolved((n) => n + 1)} />
            </div>
          ))}
          {module.practiceLink && (
            <a className="btn" href="#/latihan">
              <Illus name="latihan" size={20} className="ico" /> Latihan lebih banyak
            </a>
          )}
        </article>
      )}

      <div className="pager">
        <button className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>
          ‹ Kembali
        </button>
        {onSummary ? (
          <button
            className="btn primary"
            onClick={() => {
              celebrate(); // konfeti + nada keberhasilan: satu bab selesai
              saveModule(id, { done: true, quizCorrect: quizSolved, lastChunk: 0 });
              go('/materi');
            }}
          >
            <Illus name="benar" size={20} className="ico" /> Selesai
          </button>
        ) : (
          <button className="btn primary" onClick={() => setI(i + 1)}>
            Lanjut ›
          </button>
        )}
      </div>
    </Page>
  );
}
