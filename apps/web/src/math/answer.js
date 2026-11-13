// @ts-check
// Memeriksa jawaban angka & tafsiran siswa. Aturan sama dengan mathengine/checker.py.
import { ANSWER_FEEDBACK } from '../content/strings.id.js';
import { div, equals, formatNumber, frac, isZero, mul, neg, parseFrac, toString } from './fraction.js';

/** @typedef {import('./fraction.js').Fraction} Fraction */
/** @typedef {{ correct: boolean, errorType: string | null, message: string }} Diagnosis */

const FRACTION_INPUT = /-?\s*\d[\d.,]*\s*\/\s*-?\s*\d[\d.,]*/;
const SIGNED = /(-\s*)?(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?)(?:\s*(ribu|rb|juta|jt)(?![a-z]))?/i;
const UNIT_FACTORS = [10n, 100n, 1000n, 60n, 24n].flatMap((k) => [frac(k), frac(1n, k)]);

/**
 * Bilangan pertama pada jawaban: "-7/3", "1,5", "2.5", "Rp25.000", "25 ribu".
 * @param {string} text
 * @returns {Fraction | null}
 */
export function parseAnswer(text) {
  const s = String(text).replace(/[−–]/g, '-');
  const f = FRACTION_INPUT.exec(s);
  if (f) {
    try {
      return parseFrac(f[0].replace(/\s+/g, ''));
    } catch {
      /* lanjut ke bilangan biasa */
    }
  }
  const m = SIGNED.exec(s);
  if (!m) return null;
  let raw = m[2];
  if (raw.includes('.') && !/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(raw)) raw = raw.replace('.', ',');
  let value = parseFrac(raw);
  if (m[3]) value = mul(value, frac(/^(ribu|rb)$/i.test(m[3]) ? 1000n : 1000000n));
  return m[1] ? neg(value) : value;
}

const ANY_NUMBER = new RegExp(`${FRACTION_INPUT.source}|${SIGNED.source}`, 'gi');

/**
 * Semua bilangan dalam kalimat, berurutan.
 * @param {string} text
 * @returns {Fraction[]}
 */
export function parseAllAnswers(text) {
  const s = String(text).replace(/[−–]/g, '-');
  /** @type {Fraction[]} */
  const out = [];
  for (const m of s.matchAll(ANY_NUMBER)) {
    const v = parseAnswer(m[0]);
    if (v) out.push(v);
  }
  return out;
}

/**
 * @param {Fraction | string} expectedInput
 * @param {string} text
 * @returns {Diagnosis}
 */
export function checkNumber(expectedInput, text) {
  const expected = parseFrac(expectedInput);
  const got = parseAnswer(text);
  const out = (/** @type {string|null} */ type, extra = '') => ({
    correct: type === null,
    errorType: type,
    message: ANSWER_FEEDBACK[type ?? 'OK'] + extra,
  });
  if (got === null) return out('PARSE_ERROR');
  if (equals(got, expected)) {
    const typed = String(text).replace(/\s+/g, '').replace(/[−–]/g, '-');
    if (/^-?\d+\/-?\d+$/.test(typed) && typed !== toString(expected)) {
      return { correct: true, errorType: null, message: `Benar! Bisa disederhanakan jadi ${formatNumber(expected)}.` };
    }
    return out(null);
  }
  if (!isZero(expected) && equals(got, neg(expected))) return out('SIGN_ERROR');
  if (!isZero(expected) && !isZero(got) && equals(got, div(frac(1n), expected))) return out('INVERTED_RATIO');
  if (UNIT_FACTORS.some((f) => equals(got, mul(expected, f)))) return out('UNIT_MISMATCH');
  return out('ARITH_ERROR');
}

const UNIT_WORDS = {
  km: ['km', 'kilometer'],
  m: ['m', 'meter'],
  cm: ['cm', 'sentimeter', 'centimeter'],
  liter: ['liter', 'l'],
  kg: ['kg', 'kilogram'],
  '°C': ['°c', 'derajat'],
  GB: ['gb'],
};

/**
 * @param {string} text
 * @param {string} unit
 */
export function mentionsUnit(text, unit) {
  const t = text.toLowerCase();
  if (unit === 'rupiah') return /\brp|rupiah/.test(t);
  if (unit === '%') return t.includes('%') || t.includes('persen');
  const words = UNIT_WORDS[unit] ?? [unit.toLowerCase()];
  return words.some((w) => new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z])`).test(t));
}

/**
 * Tafsiran: angka harus benar dan satuan disebut. Makna kalimat dinilai guru (rubrik).
 * @param {Fraction | string} expected
 * @param {string | null} unit
 * @param {string} text
 * @returns {Diagnosis}
 */
export function checkInterpretation(expected, unit, text) {
  // Kalimat tafsiran wajar memuat angka lain (mis. "biaya 6 bulan adalah Rp1.150.000"),
  // jadi cukup salah satu angkanya yang cocok.
  const target = parseFrac(expected);
  const numbers = parseAllAnswers(text);
  if (!numbers.some((n) => equals(n, target))) {
    const last = numbers.at(-1);
    return checkNumber(target, last ? toString(last) : text);
  }
  if (unit && !mentionsUnit(text, unit)) {
    return { correct: false, errorType: 'INTERPRET_NO_UNIT', message: ANSWER_FEEDBACK.INTERPRET_NO_UNIT };
  }
  return { correct: true, errorType: null, message: ANSWER_FEEDBACK.INTERPRET_OK };
}
