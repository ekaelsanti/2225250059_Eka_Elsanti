// Latihan gradien: F-05 warna titik, F-10 langkah bertahap, F-16 hint, F-20 micro-step + peringatan tanda,
// F-15 Cek di Grafik, F-19 tingkat kesulitan bertahap.
// Jenis soal: dua titik + grafik, dua titik saja (tanpa grafik), dari persamaan, sejajar & tegak lurus.
import { useMemo, useState } from 'react';
import CartesianPlane from '../components/CartesianPlane.jsx';
import Gradi from '../components/Gradi.jsx';
import { AnswerInput } from '../components/Help.jsx';
import { Page } from '../components/Layout.jsx';
import { parseAnswer } from '../math/answer.js';
import { formatNumber, toNumber, toString } from '../math/fraction.js';
import { coefX, generateEquationProblem, generateRelationProblem, generateTwoPointProblem } from '../math/generator.js';
import { recordPractice, useAppState } from '../store/store.js';
import Illus from '../components/Illus.jsx';
import PageBanner from '../components/PageBanner.jsx';
import { PAGE_TEXT } from '../content/strings.id.js';

const KINDS = [
  ['grafik', 'grafik', 'Dua titik + grafik'],
  ['titik', 'pin', 'Dua titik saja'],
  ['persamaan', 'samaDengan', 'Dari persamaan'],
  ['hubungan', 'sejajar', 'Sejajar & tegak lurus'],
];

const POINT_LEVELS = [[1, 'Mudah', 'Semua positif'], [2, 'Sedang', 'Ada negatif'], [3, 'Pecahan', 'Gradien pecahan'], [4, 'Tantangan', 'Banyak negatif']];
const EQUATION_LEVELS = [[1, 'Mudah', 'y = mx + c'], [2, 'Sedang', 'm negatif'], [3, 'Pecahan', 'ky = ax + b'], [4, 'Tantangan', 'ax + by + c = 0']];
const levelsFor = (kind) => (kind === 'grafik' || kind === 'titik' ? POINT_LEVELS : EQUATION_LEVELS);

const paren = (v) => (v < 0 ? `(${v})` : `${v}`);
const fm = (f) => formatNumber(f);
const pf = (f) => (f.num < 0n ? `(${fm(f)})` : fm(f));
const NEG_WARNING = 'Ada tanda negatif di sini, hati-hati ya.';

/** Rentang grid bulat yang memuat titik-titik (+ titik asal), minimal selebar 8 kotak. */
function fitRange(values) {
  let lo = Math.min(0, ...values) - 2;
  let hi = Math.max(0, ...values) + 2;
  if (hi - lo < 8) {
    const extra = 8 - (hi - lo);
    lo -= Math.floor(extra / 2);
    hi += Math.ceil(extra / 2);
  }
  return [lo, hi];
}

// ------------------------------------------------------------ langkah per jenis soal

function twoPointSteps(p, warn) {
  return [
    {
      label: <>Langkah 1: Δy = <b className="c-point2">y₂</b> − <b className="c-point1">y₁</b></>,
      expected: String(p.dy), display: String(p.dy),
      warning: warn && p.y1 < 0 ? NEG_WARNING : null,
      hints: ['Δy adalah selisih nilai y: y₂ − y₁.', `y₂ = ${p.y2} dan y₁ = ${p.y1}, jadi Δy = ${p.y2} − ${paren(p.y1)}.`, `${p.y2} − ${paren(p.y1)} = …`],
      micro: [`Δy = ${p.y2} − ${paren(p.y1)}`, ...(p.y1 < 0 ? [`Δy = ${p.y2} + ${-p.y1}   (kurang negatif = tambah)`] : []), `Δy = ${p.dy}`],
    },
    {
      label: <>Langkah 2: Δx = <b className="c-point2">x₂</b> − <b className="c-point1">x₁</b></>,
      expected: String(p.dx), display: String(p.dx),
      warning: warn && p.x1 < 0 ? NEG_WARNING : null,
      hints: ['Δx adalah selisih nilai x: x₂ − x₁.', `x₂ = ${p.x2} dan x₁ = ${p.x1}, jadi Δx = ${p.x2} − ${paren(p.x1)}.`, `${p.x2} − ${paren(p.x1)} = …`],
      micro: [`Δx = ${p.x2} − ${paren(p.x1)}`, ...(p.x1 < 0 ? [`Δx = ${p.x2} + ${-p.x1}   (kurang negatif = tambah)`] : []), `Δx = ${p.dx}`],
    },
    {
      label: <>Langkah 3: <b className="c-slope">m</b> = Δy / Δx</>,
      expected: toString(p.m), display: fm(p.m), warning: null,
      hints: ['Bagi Δy dengan Δx.', `m = ${p.dy} / ${paren(p.dx)}`, 'Sederhanakan pecahannya. Positif ÷ negatif = negatif.'],
      micro: [`m = ${p.dy} / ${paren(p.dx)}`, ...((p.dy < 0) !== (p.dx < 0) ? ['Tandanya berbeda, jadi hasilnya negatif.'] : []), `m = ${fm(p.m)}`],
    },
  ];
}

/** Petunjuk & langkah pelan untuk membaca gradien dari persamaan. */
function equationHelp(e, name = 'm') {
  const m = fm(e.m);
  switch (e.form) {
    case 'mx+c':
      return {
        hints: ['Pada y = mx + c, gradien adalah angka yang menempel pada x.', `Lihat suku x pada ${e.text}.`, `${name} = ${m}`],
        micro: [e.text, 'Bentuknya sudah y = mx + c.', `${name} = ${m}`],
      };
    case 'c-mx':
      return {
        hints: ['Urutan suku boleh berbeda. Cari angka yang menempel pada x.', 'Tanda di depan x ikut terbawa (negatif).', `${name} = ${m}`],
        micro: [e.text, `y = ${coefX(e.a)} + ${e.b}   (urutan ditukar)`, `${name} = ${m}`],
      };
    case 'ky':
      return {
        hints: ['y masih punya angka di depannya. Bagi semua suku dengan angka itu.', `Bagi dengan ${e.k}: ${name} = ${e.a} ÷ ${e.k}.`, `${name} = ${e.a}/${e.k}, sederhanakan bila bisa.`],
        micro: [e.text, `y = (${e.a}/${e.k})x ${e.b < 0 ? '−' : '+'} ${Math.abs(e.b)}/${e.k}   (semua suku dibagi ${e.k})`, `${name} = ${e.a}/${e.k} = ${m}`],
      };
    default:
      return {
        hints: ['Untuk bentuk ax + by + c = 0, gradiennya m = −a/b.', `Di sini a = ${e.a} dan b = ${e.b}.`, `${name} = −(${e.a}) / (${e.b})`],
        micro: [e.text, `a = ${e.a}, b = ${e.b}`, `${name} = −a/b = −(${e.a}) / (${e.b})`, `${name} = ${m}`],
      };
  }
}

function equationSteps(e) {
  return [{ label: <>Gradien <b className="c-slope">m</b> = ?</>, expected: toString(e.m), display: fm(e.m), warning: null, ...equationHelp(e) }];
}

function relationSteps(r, warn) {
  const b = r.base;
  const first =
    b.kind === 'points'
      ? {
          label: <>Langkah 1: gradien garis g, <b className="c-slope">m₁</b> = Δy / Δx</>,
          expected: toString(r.m1), display: fm(r.m1),
          warning: warn && (b.x1 < 0 || b.y1 < 0) ? NEG_WARNING : null,
          hints: ['Garis g melalui dua titik: m₁ = (y₂ − y₁) / (x₂ − x₁).', `m₁ = (${b.y2} − ${paren(b.y1)}) / (${b.x2} − ${paren(b.x1)})`, `m₁ = ${b.dy} / ${paren(b.dx)}`],
          micro: [`Δy = ${b.y2} − ${paren(b.y1)} = ${b.dy}`, `Δx = ${b.x2} − ${paren(b.x1)} = ${b.dx}`, `m₁ = ${b.dy} / ${paren(b.dx)} = ${fm(r.m1)}`],
        }
      : { label: <>Langkah 1: gradien garis g, <b className="c-slope">m₁</b> = ?</>, expected: toString(r.m1), display: fm(r.m1), warning: null, ...equationHelp(b, 'm₁') };
  const second =
    r.relation === 'sejajar'
      ? {
          label: <>Langkah 2: gradien garis h yang <b>sejajar</b>, <b className="c-intercept">m₂</b> = ?</>,
          expected: toString(r.m2), display: fm(r.m2), warning: null,
          hints: ['Garis-garis sejajar memiliki kemiringan yang sama.', 'Sejajar: m₂ = m₁.', `m₂ = ${fm(r.m1)}`],
          micro: ['Sejajar → m₂ = m₁', `m₂ = ${fm(r.m2)}`],
        }
      : {
          label: <>Langkah 2: gradien garis h yang <b>tegak lurus</b>, <b className="c-intercept">m₂</b> = ?</>,
          expected: toString(r.m2), display: fm(r.m2), warning: null,
          hints: ['Dua garis tegak lurus: m₁ × m₂ = −1.', 'Jadi m₂ = −1 ÷ m₁: dibalik, lalu tandanya diganti.', `m₂ = −1 ÷ ${pf(r.m1)}`],
          micro: ['m₁ × m₂ = −1', `m₂ = −1 ÷ ${pf(r.m1)}`, `m₂ = ${fm(r.m2)}`],
        };
  return [first, second];
}

// ------------------------------------------------------------ grafik setelah selesai

function donePlane(kind, prob) {
  if (kind === 'persamaan') {
    const c = toNumber(prob.c);
    return { xMin: -6, xMax: 6, yMin: -6, yMax: 6, integerGrid: true,
      lines: [{ m: toNumber(prob.m), c, color: 'slope', label: prob.text }],
      points: Math.abs(c) <= 6 ? [{ x: 0, y: c, color: 'intercept', label: 'c', labelPos: 'left' }] : [] };
  }
  const b = prob.base;
  const m1 = toNumber(prob.m1);
  const c1 = b.kind === 'points' ? b.y1 - m1 * b.x1 : toNumber(b.c);
  const c2 = prob.relation === 'sejajar' ? c1 + (c1 > 2 ? -3 : 3) : c1; // tegak lurus: berpotongan di (0, c1)
  return { xMin: -6, xMax: 6, yMin: -5, yMax: 5, integerGrid: true,
    lines: [{ m: m1, c: c1, color: 'point1', label: 'g' }, { m: toNumber(prob.m2), c: c2, color: 'intercept', dashed: true, label: 'h' }],
    points: b.kind === 'points' ? [{ x: b.x1, y: b.y1, color: 'point1' }, { x: b.x2, y: b.y2, color: 'point1' }] : [] };
}

// ------------------------------------------------------------------ layar

export default function LatihanScreen() {
  const settings = useAppState().settings;
  const [kind, setKind] = useState('grafik');
  const [level, setLevel] = useState(1);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const [step, setStep] = useState(0);
  const [independent, setIndependent] = useState(true);
  const [clean, setClean] = useState(true); // tanpa salah & tanpa bantuan (lencana Penembak Jitu)
  const [check, setCheck] = useState('');
  const [showGraph, setShowGraph] = useState(false);
  const [reveal, setReveal] = useState(false); // "Lihat di grafik" untuk soal tanpa grafik

  const prob = useMemo(() => {
    if (kind === 'persamaan') return generateEquationProblem(level, seed);
    if (kind === 'hubungan') return generateRelationProblem(level, seed);
    return generateTwoPointProblem(level, seed);
  }, [kind, level, seed]);

  const warn = settings.signWarning;
  const steps =
    kind === 'persamaan' ? equationSteps(prob) : kind === 'hubungan' ? relationSteps(prob, warn) : twoPointSteps(prob, warn);
  const done = step >= steps.length;

  const next = () => {
    setSeed(Math.floor(Math.random() * 1e9));
    setStep(0);
    setIndependent(true);
    setClean(true);
    setCheck('');
    setShowGraph(false);
    setReveal(false);
  };
  const solved = (ok, firstTry) => {
    if (!ok) setIndependent(false);
    if (!firstTry) setClean(false);
    setStep((s) => s + 1);
  };

  const p = prob; // alias untuk soal dua titik
  const studentM = kind === 'grafik' ? parseAnswer(check) : null;
  const studentLine = studentM ? { m: toNumber(studentM), c: p.y1 - toNumber(studentM) * p.x1 } : null;
  const isPoints = kind === 'grafik' || kind === 'titik';

  return (
    <Page title="Latihan" subtitle={KINDS.find(([k]) => k === kind)[2]}>
      <PageBanner tone="green" illus="latihan" title={PAGE_TEXT.latihan.title} text={PAGE_TEXT.latihan.text} />
      <div className="chips kind-chips" role="tablist" aria-label="Jenis soal">
        {KINDS.map(([k, icon, name]) => (
          <button key={k} role="tab" aria-selected={kind === k} className={`chip ${kind === k ? 'on' : ''}`}
            onClick={() => {
              setKind(k);
              next();
            }}>
            <Illus name={icon} size={22} className="ico" /> {name}
          </button>
        ))}
      </div>

      <div className="segmented" role="tablist" aria-label="Tingkat kesulitan">
        {levelsFor(kind).map(([lv, name, desc]) => (
          <button key={lv} role="tab" aria-selected={level === lv} className={level === lv ? 'on' : ''}
            onClick={() => {
              setLevel(lv);
              next();
            }}>
            <strong>{name}</strong>
            <small>{desc}</small>
          </button>
        ))}
      </div>

      <article className="card">
        {isPoints && (
          <>
            <p className="problem">
              Tentukan gradien garis yang melalui{' '}
              <b className="c-point1">A({p.x1}, {p.y1})</b> dan <b className="c-point2">B({p.x2}, {p.y2})</b>.
            </p>
            <div className="known-grid">
              <span className="known c-point1">x₁ = {p.x1}</span>
              <span className="known c-point1">y₁ = {p.y1}</span>
              <span className="known c-point2">x₂ = {p.x2}</span>
              <span className="known c-point2">y₂ = {p.y2}</span>
            </div>
          </>
        )}

        {kind === 'persamaan' && (
          <>
            <p className="problem">Tentukan gradien garis dengan persamaan berikut.</p>
            <div className="formula">{prob.text}</div>
          </>
        )}

        {kind === 'hubungan' && (
          <>
            <p className="problem">
              Garis <b className="c-point1">g</b>{' '}
              {prob.base.kind === 'points' ? (
                <>melalui titik <b className="c-point1">A({prob.base.x1}, {prob.base.y1})</b> dan <b className="c-point1">B({prob.base.x2}, {prob.base.y2})</b>.</>
              ) : (
                <>memiliki persamaan:</>
              )}
            </p>
            {prob.base.kind === 'equation' && <div className="formula">{prob.base.text}</div>}
            <p className="problem">
              Tentukan gradien garis <b className="c-intercept">h</b> yang <b>{prob.relation}</b> dengan garis g.
            </p>
          </>
        )}

        {kind === 'grafik' && (
          <CartesianPlane
            xMin={fitRange([p.x1, p.x2])[0]} xMax={fitRange([p.x1, p.x2])[1]}
            yMin={fitRange([p.y1, p.y2])[0]} yMax={fitRange([p.y1, p.y2])[1]} integerGrid
            points={[
              { x: p.x1, y: p.y1, color: 'point1', label: 'A', labelPos: 'left' },
              { x: p.x2, y: p.y2, color: 'point2', label: 'B' },
            ]}
            segments={step >= 1 || done ? [{ x1: p.x1, y1: p.y1, x2: p.x1, y2: p.y2, color: 'rise', label: `Δy=${p.dy}` }] : []}
            lines={[
              ...(done ? [{ m: toNumber(p.m), c: p.y1 - toNumber(p.m) * p.x1, color: 'slope' }] : []),
              ...(showGraph && studentLine ? [{ ...studentLine, color: 'slope', dashed: true, label: 'garismu' }] : []),
            ]}
          />
        )}

        {steps.slice(0, Math.min(step, steps.length)).map((s, i) => (
          <p key={i} className="done-step">
            <Illus name="benar" size={18} className="ico" /> {s.label} = <b>{s.display}</b>
          </p>
        ))}

        {!done && (
          <AnswerInput key={`${kind}-${seed}-${level}-${step}`} label={steps[step].label} expected={steps[step].expected}
            hints={steps[step].hints} micro={steps[step].micro} warning={steps[step].warning} onSolved={solved} />
        )}

        {done && (
          <div className="success">
            <div className="success-row">
              <Gradi size={56} showName={false} />
              <p>
                <b>{independent ? 'Hebat, kamu mengerjakannya sendiri!' : 'Bagus, kamu berhasil!'}</b>
                <br />
                {kind === 'grafik' && <>Gradiennya <b className="c-slope">m = {fm(p.m)}</b>. Garis hijau melewati A dan B.</>}
                {kind === 'titik' && <>Gradien garis yang melalui A dan B adalah <b className="c-slope">m = {fm(p.m)}</b>.</>}
                {kind === 'persamaan' && <>Gradien garis {prob.text} adalah <b className="c-slope">m = {fm(prob.m)}</b>.</>}
                {kind === 'hubungan' && (
                  <>m₁ = {fm(prob.m1)}, jadi gradien garis h yang {prob.relation} adalah <b className="c-intercept">m₂ = {fm(prob.m2)}</b>.</>
                )}
              </p>
            </div>
            {kind !== 'grafik' && (
              <button type="button" className="chip-btn" onClick={() => setReveal(!reveal)} aria-expanded={reveal}>
                <Illus name="grafik" size={20} className="ico" /> {reveal ? 'Sembunyikan grafik' : 'Lihat di grafik'}
              </button>
            )}
            {reveal && kind === 'titik' && (
              <CartesianPlane
                xMin={fitRange([p.x1, p.x2])[0]} xMax={fitRange([p.x1, p.x2])[1]}
                yMin={fitRange([p.y1, p.y2])[0]} yMax={fitRange([p.y1, p.y2])[1]} integerGrid
                points={[
                  { x: p.x1, y: p.y1, color: 'point1', label: 'A', labelPos: 'left' },
                  { x: p.x2, y: p.y2, color: 'point2', label: 'B' },
                ]}
                lines={[{ m: toNumber(p.m), c: p.y1 - toNumber(p.m) * p.x1, color: 'slope' }]}
              />
            )}
            {reveal && (kind === 'persamaan' || kind === 'hubungan') && <CartesianPlane {...donePlane(kind, prob)} />}
            <button className="btn primary" onClick={() => {
              recordPractice(level, independent, clean);
              next();
            }}>
              Soal berikutnya ›
            </button>
          </div>
        )}

        {kind === 'grafik' && !done && step === 2 && (
          <details className="validate">
            <summary><Illus name="grafik" size={20} className="ico" /> Cek tebakanmu di grafik (F-15)</summary>
            <p className="muted">Ketik gradien tebakanmu. Garis putus-putus akan digambar dari titik A.</p>
            <div className="row">
              <input value={check} onChange={(e) => setCheck(e.target.value)} placeholder="mis. 3/2" aria-label="Gradien tebakan" />
              <button className="btn" onClick={() => setShowGraph(true)} disabled={!studentM}>
                Gambar
              </button>
            </div>
            {showGraph && studentLine && <p className="muted">Apakah garis putus-putus melewati titik B? Jika tidak, periksa lagi.</p>}
          </details>
        )}
      </article>
    </Page>
  );
}
