// F-30 Bank Soal Literasi Kontekstual.
import { useState } from 'react';
import { Page } from '../components/Layout.jsx';
import { BASE_PROBLEMS } from '../content/bank.js';
import { CONTEXT_ICON, CONTEXT_LABEL, STAGES, TYPE_LABEL } from '../content/strings.id.js';
import { useAppState } from '../store/store.js';

const FILTERS = [['semua', 'Semua'], ...Object.entries(CONTEXT_LABEL)];

export default function LiterasiListScreen() {
  const s = useAppState();
  const [filter, setFilter] = useState('semua');
  const list = BASE_PROBLEMS.filter((p) => filter === 'semua' || p.context === filter);

  return (
    <Page title="Literasi" subtitle="Memodelkan soal cerita">
      <section className="card intro">
        <p>Setiap soal cerita dikerjakan dalam 5 tahap:</p>
        <ol className="stage-strip">
          {STAGES.map((st, i) => (
            <li key={st}>
              <span>{i + 1}</span>
              {st}
            </li>
          ))}
        </ol>
      </section>

      <div className="chips" role="tablist" aria-label="Filter konteks">
        {FILTERS.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={filter === key} className={`chip ${filter === key ? 'on' : ''}`} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      <div className="list">
        {list.map((p) => {
          const st = s.stories[p.id];
          return (
            <a key={p.id} href={`#/literasi/${p.id}`} className={`list-card ${st?.done ? 'done' : ''}`}>
              <span className={`list-icon ctx-${p.context}`} aria-hidden="true">
                {CONTEXT_ICON[p.context]}
              </span>
              <span className="list-body">
                <small>
                  {p.type} · {TYPE_LABEL[p.type]}
                </small>
                <strong>{p.title}</strong>
                <span className="muted">
                  {CONTEXT_LABEL[p.context]} · {p.cognitive_level}
                </span>
                <span className={`badge inline ${st?.done ? 'ok' : ''}`}>{st?.done ? '✔ Selesai' : `Level teks ${p.context_level}`}</span>
              </span>
              <span className="chev" aria-hidden="true">›</span>
            </a>
          );
        })}
      </div>
    </Page>
  );
}
