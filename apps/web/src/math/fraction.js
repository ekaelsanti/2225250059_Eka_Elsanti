// @ts-check
// Pecahan eksak berbasis BigInt. Semantik sama dengan mathengine/numfmt.py (diuji dengan
// shared/test-vectors/fraction.json). Jangan membandingkan jawaban dengan desimal.

/** @typedef {{ num: bigint, den: bigint }} Fraction  // selalu sederhana, den > 0 */

const THOUSANDS = /^-?\d{1,3}(\.\d{3})+(,\d+)?$/;

/** @param {bigint} a @param {bigint} b @returns {bigint} */
function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}

/**
 * @param {bigint | number} num
 * @param {bigint | number} [den]
 * @returns {Fraction}
 */
export function frac(num, den = 1n) {
  let n = BigInt(num);
  let d = BigInt(den);
  if (d === 0n) throw new RangeError('Penyebut tidak boleh 0');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || 1n;
  return { num: n / g, den: d / g };
}

/** Desimal bertitik biasa ("0.025"), tanpa aturan ribuan. @param {string} s @returns {Fraction} */
export function parseDecimal(s) {
  const m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(s);
  if (!m) throw new SyntaxError(`bukan bilangan yang valid: ${s}`);
  const decimals = m[3] ?? '';
  const n = BigInt(m[2] + decimals) * (m[1] ? -1n : 1n);
  return frac(n, 10n ** BigInt(decimals.length));
}

/**
 * "3/2", "2,5", "12.000", "-7", "−3/4", 5 -> Fraction.
 * @param {string | number | bigint | Fraction} value
 * @returns {Fraction}
 */
export function parseFrac(value) {
  if (typeof value === 'object' && value !== null && 'num' in value) return frac(value.num, value.den);
  if (typeof value === 'bigint') return frac(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new SyntaxError('bukan bilangan yang valid');
    return parseDecimal(String(value));
  }
  const s = String(value).trim().replace(/−/g, '-').replace(/\s+/g, '');
  if (!s) throw new SyntaxError('bilangan kosong');
  const slash = s.indexOf('/');
  if (slash >= 0) {
    const den = parseFrac(s.slice(slash + 1));
    if (den.num === 0n) throw new SyntaxError('penyebut 0');
    return div(parseFrac(s.slice(0, slash)), den);
  }
  const plain = THOUSANDS.test(s) ? s.replace(/\./g, '') : s;
  return parseDecimal(plain.replace(',', '.'));
}

/** @param {Fraction} a @param {Fraction} b */
export const add = (a, b) => frac(a.num * b.den + b.num * a.den, a.den * b.den);
/** @param {Fraction} a @param {Fraction} b */
export const sub = (a, b) => frac(a.num * b.den - b.num * a.den, a.den * b.den);
/** @param {Fraction} a @param {Fraction} b */
export const mul = (a, b) => frac(a.num * b.num, a.den * b.den);
/** @param {Fraction} a @param {Fraction} b */
export const div = (a, b) => frac(a.num * b.den, a.den * b.num);
/** @param {Fraction} a */
export const neg = (a) => frac(-a.num, a.den);
/** @param {Fraction} a */
export const isZero = (a) => a.num === 0n;
/** @param {Fraction} a @param {Fraction} b */
export const equals = (a, b) => a.num === b.num && a.den === b.den;

/** Hanya untuk menggambar grafik, BUKAN untuk memeriksa jawaban. @param {Fraction} a */
export const toNumber = (a) => Number(a.num) / Number(a.den);

/** Bentuk mesin, sama dengan Python: "5/2", "-1/40", "4". @param {Fraction} a */
export const toString = (a) => (a.den === 1n ? String(a.num) : `${a.num}/${a.den}`);

/** @param {bigint} n */
const group = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * Tampilan Indonesia: 19000 -> "19.000", 3/2 -> "1,5", 1/3 -> "1/3".
 * @param {Fraction} a
 * @param {number} [maxDecimals]
 */
export function formatNumber(a, maxDecimals = 2) {
  const sign = a.num < 0n ? '-' : '';
  const n = a.num < 0n ? -a.num : a.num;
  if (a.den === 1n) return sign + group(n);
  for (let k = 1; k <= maxDecimals; k++) {
    const p = 10n ** BigInt(k);
    if ((n * p) % a.den === 0n) {
      const scaled = (n * p) / a.den;
      return `${sign}${group(scaled / p)},${(scaled % p).toString().padStart(k, '0')}`;
    }
  }
  return `${sign}${n}/${a.den}`;
}
