// @ts-check
// Generator soal gradien bertingkat (docs/CONTENT_SPEC.md §5-6). Deterministik per seed.
// Jenis: dua titik, dari persamaan, dan hubungan sejajar/tegak lurus.
import { div, frac } from './fraction.js';

/** @param {number} seed */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** @param {number} a @param {number} b */
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/**
 * @param {1|2|3|4} level
 * @param {{x1:number,y1:number,x2:number,y2:number}} p
 */
export function meetsLevel(level, { x1, y1, x2, y2 }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 || dy === 0) return false;
  const negatives = [x1, y1, x2, y2].filter((v) => v < 0).length;
  const integer = dy % dx === 0;
  switch (level) {
    case 1:
      return x1 < x2 && negatives === 0 && integer && dy / dx > 0;
    case 2:
      return negatives >= 1 && negatives <= 2 && integer;
    case 3:
      return !integer && Math.abs(dx) / gcd(Math.abs(dy), Math.abs(dx)) <= 6;
    case 4:
      return negatives >= 3;
    default:
      return false;
  }
}

/**
 * @param {1|2|3|4} level
 * @param {number} seed
 */
export function generateTwoPointProblem(level, seed) {
  const rand = mulberry32(seed);
  const lo = level === 1 ? 0 : -8;
  const pick = () => lo + Math.floor(rand() * (8 - lo + 1));
  for (let i = 0; i < 20000; i++) {
    const p = { x1: pick(), y1: pick(), x2: pick(), y2: pick() };
    if (meetsLevel(level, p)) {
      const dy = p.y2 - p.y1;
      const dx = p.x2 - p.x1;
      return { ...p, level, seed, dy, dx, m: frac(BigInt(dy), BigInt(dx)) };
    }
  }
  throw new Error('Gagal membuat soal');
}

// ------------------------------------------------------------ dari persamaan

/** "3x", "−x", "x" (tanda minus tipografis untuk tampilan). @param {number} a */
export const coefX = (a) => (a === 1 ? 'x' : a === -1 ? '−x' : `${a < 0 ? '−' : ''}${Math.abs(a)}x`);
/** " + 4" atau " − 4". @param {number} n */
const signed = (n) => (n < 0 ? ` − ${-n}` : ` + ${n}`);

/**
 * Soal "tentukan gradien dari persamaan".
 * L1: y = ax + b · L2: m negatif (y = b − ax / y = −ax + b) · L3: ky = ax + b · L4: ax + by + c = 0
 * @param {1|2|3|4} level
 * @param {number} seed
 */
export function generateEquationProblem(level, seed) {
  const rand = mulberry32(seed);
  /** @param {number} lo @param {number} hi @param {boolean} [nonzero] */
  const int = (lo, hi, nonzero = false) => {
    for (;;) {
      const v = lo + Math.floor(rand() * (hi - lo + 1));
      if (!nonzero || v !== 0) return v;
    }
  };
  switch (level) {
    case 1: {
      const a = int(1, 6);
      const b = int(-6, 6, true);
      return { level, seed, form: 'mx+c', text: `y = ${coefX(a)}${signed(b)}`, a, b, m: frac(BigInt(a)), c: frac(BigInt(b)) };
    }
    case 2: {
      const a = int(1, 6);
      if (rand() < 0.5) {
        const b = int(1, 9);
        return { level, seed, form: 'c-mx', text: `y = ${b} − ${coefX(a)}`, a: -a, b, m: frac(BigInt(-a)), c: frac(BigInt(b)) };
      }
      const b = int(-6, 6, true);
      return { level, seed, form: 'mx+c', text: `y = ${coefX(-a)}${signed(b)}`, a: -a, b, m: frac(BigInt(-a)), c: frac(BigInt(b)) };
    }
    case 3: {
      const k = int(2, 4);
      let a = int(-7, 7, true);
      while (a % k === 0) a = int(-7, 7, true);
      const b = int(-8, 8, true);
      return {
        level, seed, form: 'ky', text: `${k}y = ${coefX(a)}${signed(b)}`, a, b, k,
        m: frac(BigInt(a), BigInt(k)), c: frac(BigInt(b), BigInt(k)),
      };
    }
    default: {
      const a = int(-6, 6, true);
      const b = int(-6, 6, true);
      const c = int(-9, 9, true);
      const yTerm = `${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y`;
      return {
        level, seed, form: 'ax+by+c', text: `${coefX(a)} ${yTerm}${signed(c)} = 0`, a, b, cc: c,
        m: frac(BigInt(-a), BigInt(b)), c: frac(BigInt(-c), BigInt(b)),
      };
    }
  }
}

// ------------------------------------------------- sejajar & tegak lurus

/**
 * Garis g diketahui (lewat persamaan atau dua titik); tentukan gradien garis h yang sejajar / tegak lurus.
 * @param {1|2|3|4} level
 * @param {number} seed
 */
export function generateRelationProblem(level, seed) {
  const rand = mulberry32(seed ^ 0x5bd1e995);
  const relation = rand() < 0.5 ? 'sejajar' : 'tegak lurus';
  const base =
    rand() < 0.35
      ? { kind: 'points', ...generateTwoPointProblem(level, seed) }
      : { kind: 'equation', ...generateEquationProblem(level, seed) };
  const m1 = base.m; // tidak pernah 0: generator menjamin a != 0 dan dy != 0
  const m2 = relation === 'sejajar' ? m1 : div(frac(-1n), m1);
  return { level, seed, relation, base, m1, m2 };
}
