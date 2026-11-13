// @ts-check
// Membaca persamaan LINEAR buatan siswa (mis. "y = 4.000 + 2.500x") menjadi {m, c}.
// Ini bukan aljabar simbolik umum: hanya bentuk linear dalam x dan y yang diterima,
// sama dengan mathengine/checker.py:parse_linear_equation (diuji dengan vektor bersama).
import { add, div, frac, isZero, mul, neg, parseDecimal, sub } from './fraction.js';

/** @typedef {import('./fraction.js').Fraction} Fraction */
/** @typedef {{ x: Fraction, y: Fraction, k: Fraction }} Linear  // a·x + b·y + k */

export class EquationError extends Error {}

const SAFE = /^[0-9xy+\-*/().=\s^]+$/;
const ZERO = frac(0n);
const ONE = frac(1n);

/** @param {string} text */
function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[−–]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/[÷:]/g, '/')
    .replace(/rp\.?\s*/g, '')
    .replace(/(?<=\d)\.(?=\d{3}(?!\d))/g, '')
    .replace(/,/g, '.');
}

/** @param {string} s */
function tokenize(s) {
  /** @type {string[]} */
  const tokens = [];
  const re = /\s*(\d+(?:\.\d+)?|[xy]|[-+*/()^])/y;
  let pos = 0;
  while (pos < s.length) {
    if (/\s/.test(s[pos])) {
      pos++;
      continue;
    }
    re.lastIndex = pos;
    const m = re.exec(s);
    if (!m) throw new EquationError('bad token');
    tokens.push(m[1]);
    pos = re.lastIndex;
  }
  return tokens;
}

/** @param {Fraction} k @returns {Linear} */
const constant = (k) => ({ x: ZERO, y: ZERO, k });
/** @param {Linear} l */
const isConstant = (l) => isZero(l.x) && isZero(l.y);
/** @param {Linear} a @param {Linear} b @param {(p: Fraction, q: Fraction) => Fraction} op */
const combine = (a, b, op) => ({ x: op(a.x, b.x), y: op(a.y, b.y), k: op(a.k, b.k) });
/** @param {Linear} l @param {Fraction} f */
const scale = (l, f) => ({ x: mul(l.x, f), y: mul(l.y, f), k: mul(l.k, f) });

/** @param {string[]} tokens @returns {Linear} */
function parseExpression(tokens) {
  let i = 0;
  const peek = () => tokens[i];
  const startsFactor = (t) => t !== undefined && (/^[\d(xy]/.test(t));

  /** @returns {Linear} */
  function expr() {
    let left = term();
    while (peek() === '+' || peek() === '-') {
      const op = tokens[i++];
      const right = term();
      left = combine(left, right, op === '+' ? add : sub);
    }
    return left;
  }

  /** @returns {Linear} */
  function term() {
    let left = unary();
    for (;;) {
      const t = peek();
      if (t === '*' || t === '/') {
        i++;
        const right = unary();
        if (t === '*') left = multiply(left, right);
        else {
          if (!isConstant(right) || isZero(right.k)) throw new EquationError('bad division');
          left = scale(left, div(ONE, right.k));
        }
      } else if (startsFactor(t)) {
        left = multiply(left, unary()); // perkalian implisit: 2500x, 2(x+1)
      } else return left;
    }
  }

  /** @param {Linear} a @param {Linear} b */
  function multiply(a, b) {
    if (isConstant(a)) return scale(b, a.k);
    if (isConstant(b)) return scale(a, b.k);
    throw new EquationError('not linear');
  }

  /** @returns {Linear} */
  function unary() {
    if (peek() === '-') {
      i++;
      return scale(unary(), neg(ONE));
    }
    if (peek() === '+') {
      i++;
      return unary();
    }
    return primary();
  }

  /** @returns {Linear} */
  function primary() {
    const t = tokens[i++];
    if (t === undefined) throw new EquationError('unexpected end');
    if (t === '(') {
      const inner = expr();
      if (tokens[i++] !== ')') throw new EquationError('missing )');
      return inner;
    }
    if (t === 'x') return { x: ONE, y: ZERO, k: ZERO };
    if (t === 'y') return { x: ZERO, y: ONE, k: ZERO };
    // Token sudah dinormalisasi (ribuan dibuang, koma -> titik), jadi dibaca sebagai desimal biasa.
    if (/^\d/.test(t)) return constant(parseDecimal(t));
    throw new EquationError(`unexpected ${t}`);
  }

  const result = expr();
  if (i !== tokens.length) throw new EquationError('trailing tokens');
  return result;
}

/**
 * @param {string} text
 * @returns {{ m: Fraction, c: Fraction }}
 */
export function parseLinearEquation(text) {
  const s = normalize(text);
  if (s.length > 120 || !SAFE.test(s)) {
    throw new EquationError('Gunakan hanya angka, x, y, +, −, ×, /, kurung, dan =.');
  }
  const sides = s.split('=');
  if (sides.length !== 2) throw new EquationError("Persamaan harus memuat tepat satu tanda '='.");
  if (!sides[0].trim() || !sides[1].trim()) throw new EquationError('Kedua ruas persamaan harus terisi.');
  let lin;
  try {
    lin = combine(parseExpression(tokenize(sides[0])), parseExpression(tokenize(sides[1])), sub);
  } catch {
    throw new EquationError('Persamaan belum dapat dibaca. Contoh penulisan: y = 2500x + 4000');
  }
  if (isZero(lin.y)) throw new EquationError('Persamaan harus memuat y.');
  return { m: div(neg(lin.x), lin.y), c: div(neg(lin.k), lin.y) };
}
