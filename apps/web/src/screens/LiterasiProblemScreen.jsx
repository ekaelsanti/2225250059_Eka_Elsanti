// F-24 Siklus Pemodelan Terpandu: Pahami -> Rumuskan -> Selesaikan -> Tafsirkan -> Periksa.
// Mencakup F-13 Sorot Info, F-25 Variabel, F-26 Representasi, F-27 Pemeriksa Model,
// F-28 Penyelesai, F-29 Tafsirkan & Periksa, F-32 Kamus Konteks, F-17 refleksi.
import { useEffect, useMemo, useState } from 'react';
import { celebrate } from '../app/celebrate.js';
import { go } from '../app/router.js';
import CartesianPlane, { autoRange } from '../components/CartesianPlane.jsx';
import { AnswerInput, ChoiceQuestion, Feedback, HintBox, MicroSteps } from '../components/Help.jsx';
import { Page } from '../components/Layout.jsx';
import { GLOSSARY, PROBLEM_BY_ID, variantsOf } from '../content/bank.js';
import { CONTEXT_LABEL, STAGES, TYPE_LABEL } from '../content/strings.id.js';
import { checkInterpretation } from '../math/answer.js';
import { formatNumber, parseFrac, toNumber } from '../math/fraction.js';
import { checkModel } from '../math/modelCheck.js';
import { addNote, saveStory, setLast } from '../store/store.js';

const num = (v) => toNumber(parseFrac(v));
const fmt = (v) => formatNumber(parseFrac(v));
const STEP_KINDS = ['predict', 'inverse', 'intersect', 'compare', 'steepness', 'parallel', 'perpendicular'];

export default function LiterasiProblemScreen({ id }) {
  const problem = PROBLEM_BY_ID[id];
  if (!problem) {
    return (
      <Page title="Soal tidak ditemukan" back="/literasi">
        <p>Soal ini tidak ada.</p>
      </Page>
    );
  }
  return <ModelingFlow key={id} problem={problem} />;
}

function ModelingFlow({ problem }) {
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState([false, false, false, false, false]);
  const [assisted, setAssisted] = useState(false);
  // Kembalikan array yang sama bila sudah selesai agar efek di tahap tidak memicu render berulang.
  const complete = (i) => setDone((d) => (d[i] ? d : d.map((v, j) => (j === i ? true : v))));
  const assist = () => setAssisted(true);
  const variants = variantsOf(problem.id);
  const nextVariant = variants[(variants.findIndex((v) => v.id === problem.id) + 1) % variants.length];

  useEffect(() => setLast(`/literasi/${problem.id}`, `Soal cerita: ${problem.title}`), [problem]);

  const finish = () => {
    celebrate(); // konfeti + nada keberhasilan: soal cerita selesai
    saveStory(problem.variant_of ?? problem.id, { done: true, assisted });
    go('/literasi');
  };

  const props = { problem, onDone: () => complete(stage), onAssist: assist };

  return (
    <Page title={problem.title} subtitle={`${TYPE_LABEL[problem.type]} · ${CONTEXT_LABEL[problem.context]}`} back="/literasi">
      <ol className="stepper" aria-label="Tahap pemodelan">
        {STAGES.map((s, i) => (
          <li key={s} className={i === stage ? 'now' : done[i] ? 'ok' : ''}>
            <button onClick={() => (i <= stage || done[i - 1] ? setStage(i) : null)} disabled={i > stage && !done[i - 1]}>
              <span>{done[i] ? '✔' : i + 1}</span>
              {s}
            </button>
          </li>
        ))}
      </ol>

      {stage > 0 && (
        <details className="story-peek">
          <summary>📄 Lihat soal</summary>
          <p>{problem.text}</p>
          <Stimulus problem={problem} />
        </details>
      )}

      <article className="card stage-card" key={stage}>
        {stage === 0 && <Pahami {...props} />}
        {stage === 1 && <Rumuskan {...props} />}
        {stage === 2 && <Selesaikan {...props} />}
        {stage === 3 && <Tafsirkan {...props} />}
        {stage === 4 && <Periksa {...props} />}
      </article>

      <div className="pager">
        <button className="btn" disabled={stage === 0} onClick={() => setStage(stage - 1)}>
          ‹ Kembali
        </button>
        {stage < 4 ? (
          <button className="btn primary" disabled={!done[stage]} onClick={() => setStage(stage + 1)}>
            Lanjut ›
          </button>
        ) : (
          <button className="btn primary" disabled={!done[4]} onClick={finish}>
            ✔ Selesai
          </button>
        )}
      </div>
      {variants.length > 1 && (
        <p className="center">
          <a className="link-btn" href={`#/literasi/${nextVariant.id}`}>
            🔁 Coba soal serupa (angka berbeda)
          </a>
        </p>
      )}
    </Page>
  );
}

// ------------------------------------------------------------------ bantu

function Stimulus({ problem }) {
  const st = problem.stimulus;
  if (!st) return null;
  const model = problem.models[st.model];
  if (st.kind === 'table') {
    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>{model.x.meaning} ({model.x.unit})</th>
            <th>{model.y.meaning} ({model.y.unit})</th>
          </tr>
        </thead>
        <tbody>
          {st.rows.map(([x, y]) => (
            <tr key={x}>
              <td>{fmt(x)}</td>
              <td>{fmt(y)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  const xs = st.rows.map(([x]) => num(x));
  const ys = st.rows.map(([, y]) => num(y));
  return (
    <CartesianPlane {...autoRange(xs, ys)} xLabel={`${model.x.meaning} (${model.x.unit})`} yLabel={`${model.y.meaning} (${model.y.unit})`}
      lines={[{ m: num(model.m), c: num(model.c), color: 'slope' }]}
      points={st.rows.map(([x, y]) => ({ x: num(x), y: num(y), color: 'point1' }))} />
  );
}

/** Pecah teks menjadi kalimat beserta posisinya. */
function sentencesOf(text) {
  const out = [];
  const re = /[^.?!\n]+(?:[.?!]+|$)/g;
  let m;
  while ((m = re.exec(text))) {
    const raw = m[0];
    const lead = raw.length - raw.trimStart().length;
    if (raw.trim() && !/^\s*[a-e][.)]\s*$/i.test(raw)) out.push({ start: m.index + lead, end: m.index + raw.trimEnd().length });
  }
  // gabungkan potongan yang terpisah karena titik ribuan (Rp4.000) atau desimal
  const merged = [];
  for (const s of out) {
    const prev = merged[merged.length - 1];
    if (prev && /\d$/.test(text.slice(prev.start, prev.end - 1)) && text[prev.end - 1] === '.' && /^\d/.test(text.slice(s.start))) prev.end = s.end;
    else if (prev && prev.end === s.start && /\d/.test(text[s.start] ?? '')) prev.end = s.end;
    else merged.push({ ...s });
  }
  return merged;
}

function Highlighted({ text, start, end, spans }) {
  const parts = [];
  let pos = start;
  for (const sp of spans.filter((s) => s.start >= start && s.end <= end).sort((a, b) => a.start - b.start)) {
    if (sp.start > pos) parts.push(<span key={pos}>{text.slice(pos, sp.start)}</span>);
    parts.push(<mark key={sp.start} className="known-mark">{text.slice(sp.start, sp.end)}</mark>);
    pos = sp.end;
  }
  parts.push(<span key={pos}>{text.slice(pos, end)}</span>);
  return parts;
}

function Glossary({ problem }) {
  const [open, setOpen] = useState(null);
  if (!problem.glossary.length) return null;
  return (
    <div className="glossary">
      <span className="muted">📘 Kamus:</span>
      {problem.glossary.map((t) => (
        <button key={t} className={`chip ${open === t ? 'on' : ''}`} onClick={() => setOpen(open === t ? null : t)}>
          {t}
        </button>
      ))}
      {open && GLOSSARY[open] && (
        <p className="gloss-pop">
          <b>{open}</b>: {GLOSSARY[open].meaning}
          {GLOSSARY[open].role === 'laju' && <span className="c-slope"> → ini laju (m)</span>}
          {GLOSSARY[open].role === 'nilai_awal' && <span className="c-intercept"> → ini nilai awal (c)</span>}
        </p>
      )}
    </div>
  );
}

const stepsOf = (problem, stage) => problem.solution.steps.filter((s) => s.stage === stage);

// ----------------------------------------------------------------- tahap 1

function Pahami({ problem, onDone }) {
  const [highlight, setHighlight] = useState(false);
  const [picked, setPicked] = useState(null);
  const sentences = useMemo(() => sentencesOf(problem.text), [problem.text]);
  const isAsked = (s) => problem.annotations.asked.some((a) => a.start < s.end && s.start < a.end);
  const correct = picked !== null && isAsked(sentences[picked]);
  const pickFeedback = useMemo(
    () => (picked === null ? null : {
      correct,
      message: correct ? 'Tepat! Itulah yang ditanyakan.' : 'Kalimat itu berisi informasi. Cari kalimat pertanyaannya.',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [picked],
  );
  const facts = problem.solution.steps[0].micro_steps.filter((m) => !m.startsWith('Ditanya'));
  const distractors = problem.annotations.distractor.map((d) => problem.text.slice(d.start, d.end));

  return (
    <>
      <h2>① Pahami</h2>
      <p className="muted">Baca ceritanya. Lalu <b>ketuk kalimat yang ditanyakan</b>.</p>
      <div className="story" aria-label="Teks soal">
        {sentences.map((s, i) => (
          <button key={i} className={`sentence ${highlight && isAsked(s) ? 'asked' : ''} ${picked === i ? (correct ? 'pick-ok' : 'pick-warn') : ''}`}
            onClick={() => {
              setPicked(i);
              if (isAsked(s)) onDone();
            }}>
            {highlight ? <Highlighted text={problem.text} start={s.start} end={s.end} spans={problem.annotations.known} /> : problem.text.slice(s.start, s.end)}
          </button>
        ))}
      </div>
      <Stimulus problem={problem} />
      <Glossary problem={problem} />
      <div className="helpbar">
        <button className="chip-btn" onClick={() => setHighlight(!highlight)}>
          🔍 {highlight ? 'Matikan sorotan' : 'Sorot info'}
        </button>
      </div>
      <Feedback d={pickFeedback} />
      {correct && (
        <div className="info-box">
          <p><b>Info penting:</b></p>
          <ul>{facts.map((f) => <li key={f}>{f}</li>)}</ul>
          {distractors.length > 0 && <p className="muted">Info pengecoh (tidak dipakai): {distractors.join(', ')}</p>}
        </div>
      )}
    </>
  );
}

// ----------------------------------------------------------------- tahap 2

function Rumuskan({ problem, onDone, onAssist }) {
  const model = problem.models[0];
  const equationMode = !['T7', 'T10'].includes(problem.type);
  const needsVars = equationMode;
  const [varsOk, setVarsOk] = useState(!needsVars);
  const [solvedModels, setSolvedModels] = useState([]);
  const steps = stepsOf(problem, 'rumuskan');
  const perModel = steps.length / problem.models.length;
  const options = [model.x.meaning, model.y.meaning].sort();

  useEffect(() => {
    if (varsOk && solvedModels.length === (equationMode ? problem.models.length : 1)) onDone();
  }, [varsOk, solvedModels, equationMode, problem.models.length, onDone]);

  return (
    <>
      <h2>② Rumuskan</h2>
      {needsVars && (
        <div className="sub">
          <ChoiceQuestion question="Apa yang menjadi x (yang mempengaruhi)?" options={options}
            answer={options.indexOf(model.x.meaning)}
            explain={`Tepat! x = ${model.x.meaning} (${model.x.unit}), y = ${model.y.meaning} (${model.y.unit}).`}
            onSolved={() => setVarsOk(true)} />
        </div>
      )}

      {varsOk && equationMode &&
        problem.models.map((m, i) => {
          const s = steps.slice(i * perModel, (i + 1) * perModel);
          return (
            <ModelInput key={i} model={m} title={m.name ? `Model ${m.name}` : 'Susun modelnya'}
              hints={[...s[1].hints.slice(0, 2), s[3].hints[2]]}
              micro={s.flatMap((st) => [st.text, ...st.micro_steps])}
              onSolved={(independent) => {
                if (!independent) onAssist();
                setSolvedModels((x) => [...x, i]);
              }} />
          );
        })}

      {varsOk && !equationMode && (
        <AnswerInput label={problem.type === 'T7' ? 'Berapa kemiringannya (tinggi ÷ jarak mendatar)?' : 'Berapa gradien garis yang diketahui?'}
          expected={model.m} hints={steps[1].hints} micro={steps[1].micro_steps}
          onSolved={(independent) => {
            if (!independent) onAssist();
            setSolvedModels([0]);
          }} />
      )}
    </>
  );
}

function ModelInput({ model, title, hints, micro, onSolved }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [tries, setTries] = useState(0);
  const [usedHelp, setUsedHelp] = useState(false);
  const [solved, setSolved] = useState(false);
  const finish = (independent) => {
    setSolved(true);
    onSolved(independent);
  };
  return (
    <form className="answer sub" onSubmit={(e) => {
      e.preventDefault();
      const d = checkModel(model, text);
      setResult(d);
      if (d.correct) finish(!usedHelp);
      else setTries((t) => t + 1);
    }}>
      <label className="answer-label">
        {title}: y = <b className="c-slope">m</b>x + <b className="c-intercept">c</b>
      </label>
      <p className="muted small">x = {model.x.meaning} ({model.x.unit}), y = {model.y.meaning} ({model.y.unit})</p>
      <div className="row">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="contoh: y = 2500x + 4000" disabled={solved} aria-label={title} />
        <button className="btn primary" disabled={solved || !text.trim()}>Cek</button>
      </div>
      <Feedback d={result} />
      {!solved && (
        <div className="helpbar">
          <HintBox hints={hints} onLevel={() => setUsedHelp(true)} />
          <MicroSteps lines={micro} label="📘 Lihat langkah lengkap" onOpen={() => setUsedHelp(true)} />
          {tries >= 2 && (
            <button type="button" className="chip-btn" onClick={() => {
              setText(problem_eq(model));
              setResult({ correct: true, silent: true, message: 'Ini modelnya. Perhatikan mana laju dan mana nilai awal.' });
              finish(false);
            }}>
              👀 Tunjukkan model
            </button>
          )}
        </div>
      )}
    </form>
  );
}

function problem_eq(model) {
  const m = parseFrac(model.m);
  const c = parseFrac(model.c);
  const mStr = m.den === 1n ? formatNumber(m) : `(${formatNumber(m)})`;
  const cAbs = formatNumber(c.num < 0n ? { num: -c.num, den: c.den } : c);
  return c.num === 0n ? `y = ${mStr}x` : `y = ${mStr}x ${c.num < 0n ? '−' : '+'} ${cAbs}`;
}

// ----------------------------------------------------------------- tahap 3

function Selesaikan({ problem, onDone, onAssist }) {
  const items = useMemo(() => {
    const steps = stepsOf(problem, 'selesaikan');
    const asked = problem.solution.steps[0].micro_steps.filter((m) => m.startsWith('Ditanya: '));
    const rumuskan = stepsOf(problem, 'rumuskan');
    let k = 0;
    return problem.tasks.map((t, i) => {
      const step = STEP_KINDS.includes(t.kind) ? steps[k++] : null;
      return { task: t, answer: problem.solution.answers[i], step, asked: asked[i]?.replace('Ditanya: ', ''), rumuskan };
    }).filter((it) => it.task.kind !== 'build_model');
  }, [problem]);
  const [solved, setSolved] = useState(0);

  useEffect(() => {
    if (solved >= items.length) onDone();
  }, [solved, items.length, onDone]);

  const mark = (independent) => {
    if (!independent) onAssist();
    setSolved((n) => n + 1);
  };

  return (
    <>
      <h2>③ Selesaikan</h2>
      {items.length === 0 && <p>Tidak ada hitungan tambahan. Modelmu sudah menjawab soal. Lanjut ke tahap berikutnya.</p>}
      {items.map((it, i) => (
        <div key={i} className="sub">
          {it.task.kind === 'compare' ? (
            <ChoiceQuestion question={`Ditanya: ${it.asked}`} options={problem.models.map((m) => m.name)}
              answer={problem.models.findIndex((m) => m.name === it.answer.display)}
              explain={it.step?.micro_steps.join(' · ')} onSolved={() => mark(true)} />
          ) : (
            <AnswerInput label={`Ditanya: ${it.asked}`} expected={it.answer.value}
              revealText={it.answer.display}
              hints={it.step?.hints ?? (it.task.kind === 'find_initial' ? it.rumuskan[2].hints : it.rumuskan[1].hints)}
              micro={it.step ? [it.step.text, ...it.step.micro_steps] : null}
              placeholder="Angka saja, mis. 25000 atau 1,5" onSolved={mark} />
          )}
        </div>
      ))}
    </>
  );
}

// ----------------------------------------------------------------- tahap 4

function Tafsirkan({ problem, onDone, onAssist }) {
  const idx = problem.solution.answers.findIndex((a) => a.value !== null && a.value !== undefined && a.task !== 'find_rate');
  const target = idx >= 0 ? problem.solution.answers[idx] : null;
  const unit = target?.unit && !target.unit.includes('/') ? target.unit : null;
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const ok = result?.correct;

  return (
    <>
      <h2>④ Tafsirkan</h2>
      <p>
        {target ? <>Hasil hitunganmu: <b>{target.display}</b>. </> : null}
        Apa artinya dalam cerita? Tulis satu kalimat lengkap {unit ? 'dengan satuannya' : ''}.
      </p>
      <form className="answer" onSubmit={(e) => {
        e.preventDefault();
        const d = target ? checkInterpretation(target.value, unit, text) : { correct: text.trim().split(/\s+/).length >= 4, message: 'Tuliskan minimal satu kalimat.' };
        if (!target && d.correct) d.message = 'Bagus! Bandingkan dengan contoh tafsiran di bawah.';
        setResult(d);
        if (d.correct) {
          setShowModel(true);
          onDone();
        }
      }}>
        <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Contoh: Biaya perjalanan sejauh 8 km adalah Rp25.000." aria-label="Tafsiranmu" />
        <div className="row">
          <button className="btn primary" disabled={!text.trim() || ok}>Cek</button>
          {!ok && (
            <button type="button" className="chip-btn" onClick={() => {
              setShowModel(true);
              onAssist();
              onDone();
            }}>
              👀 Lihat contoh tafsiran
            </button>
          )}
        </div>
        <Feedback d={result} />
      </form>
      {showModel && (
        <div className="info-box">
          <p><b>Contoh tafsiran:</b></p>
          <ul>{problem.solution.interpretation.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      )}
    </>
  );
}

// ----------------------------------------------------------------- tahap 5

function planeFor(problem) {
  const models = problem.models.map((m) => ({ ...m, mN: num(m.m), cN: num(m.c) }));
  const first = models[0];
  if (problem.type === 'T10') {
    return { xMin: -5, xMax: 5, yMin: -5, yMax: 5, integerGrid: true, lines: [
      { m: first.mN, c: 0, color: 'point1', label: 'jalan lama' },
      { m: -1 / first.mN, c: 0, color: 'slope', dashed: true, label: 'jalan baru' },
    ] };
  }
  const points = [];
  problem.tasks.forEach((t, i) => {
    const a = problem.solution.answers[i];
    const md = models[t.model];
    if (t.kind === 'predict') points.push({ x: num(t.x), y: md.mN * num(t.x) + md.cN });
    if ((t.kind === 'inverse' || t.kind === 'intersect') && a.value != null) points.push({ x: num(a.value), y: md.mN * num(a.value) + md.cN });
  });
  const labelled = points.map((p) => ({ ...p, color: 'slope', label: `(${formatNumber(parseFrac(String(Math.round(p.x * 100) / 100)))}; ${p.y.toLocaleString('id-ID', { maximumFractionDigits: 2 })})` }));
  const data = [...first.points.map(([x, y]) => ({ x: num(x), y: num(y) })), ...(problem.stimulus?.rows ?? []).map(([x, y]) => ({ x: num(x), y: num(y) }))];
  const xs = [...points, ...data].map((p) => p.x);
  if (first.domain_max) xs.push(num(first.domain_max));
  if (first.run) xs.push(num(first.run));
  if (!xs.length) xs.push(10);
  const ys = [...points, ...data].map((p) => p.y).concat(models.map((m) => m.cN), models.map((m) => m.mN * Math.max(...xs) + m.cN));
  return {
    ...autoRange(xs, ys),
    xLabel: `${first.x.meaning} (${first.x.unit})`,
    yLabel: `${first.y.meaning} (${first.y.unit})`,
    lines: models.map((m, i) => ({ m: m.mN, c: m.cN, color: i ? 'point2' : 'slope', label: m.name ?? undefined })),
    points: [...data.map((p) => ({ ...p, color: 'point1' })), ...labelled],
    segments: first.rise ? [
      { x1: 0, y1: 0, x2: num(first.run), y2: 0, color: 'run', label: 'jarak mendatar' },
      { x1: num(first.run), y1: 0, x2: num(first.run), y2: num(first.rise), color: 'rise', label: 'tinggi' },
    ] : [],
  };
}

function Periksa({ problem, onDone }) {
  const checks = problem.solution.reasonableness;
  const [ticked, setTicked] = useState(() => checks.map(() => false));
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);
  const plane = useMemo(() => planeFor(problem), [problem]);
  const all = ticked.every(Boolean);

  useEffect(() => {
    if (all) onDone();
  }, [all, onDone]);

  return (
    <>
      <h2>⑤ Periksa</h2>
      <p className="muted">Lihat grafiknya: apakah titik jawabanmu ada di garis? Centang setiap pemeriksaan.</p>
      <CartesianPlane {...plane} />
      <ul className="checklist">
        {checks.map((c, i) => (
          <li key={i}>
            <label>
              <input type="checkbox" checked={ticked[i]} onChange={() => setTicked((t) => t.map((v, j) => (j === i ? !v : v)))} />
              <span className={c.includes('tidak wajar') ? 'warn-text' : ''}>{c}</span>
            </label>
          </li>
        ))}
      </ul>
      {checks.length === 0 && (
        <button className="btn" onClick={onDone}>Saya sudah memeriksa</button>
      )}
      {problem.reflection_prompt && (
        <div className="sub reflection">
          <p className="answer-label">💬 Jelaskan dengan kata-katamu (boleh dilewati): {problem.reflection_prompt}</p>
          <textarea rows={3} value={reflection} onChange={(e) => setReflection(e.target.value)} aria-label="Refleksi" />
          <button className="btn" disabled={!reflection.trim() || saved} onClick={() => {
            addNote({ title: problem.reflection_prompt, text: reflection, source: `Literasi: ${problem.title}` });
            setSaved(true);
          }}>
            {saved ? '✔ Tersimpan di Catatan' : '📒 Simpan ke Catatan'}
          </button>
        </div>
      )}
    </>
  );
}
