// @ts-check
// F-27 Pemeriksa Model (literasi: Rumuskan) - pemeriksaan OFFLINE.
// Aturan diagnosis identik dengan mathengine/checker.py:diagnose_model.
import { MODEL_FEEDBACK } from '../content/strings.id.js';
import { div, equals, frac, isZero, mul, neg, parseFrac } from './fraction.js';
import { EquationError, parseLinearEquation } from './equation.js';

/** @typedef {import('./fraction.js').Fraction} Fraction */
/**
 * @typedef {Object} ModelLike   // bentuk LinearModel dari JSON hasil Python
 * @property {string | Fraction} m
 * @property {string | Fraction} c
 * @property {{meaning: string, unit: string}} [x]
 * @property {{meaning: string, unit: string}} [y]
 * @property {'direct'|'points'|'rise_run'} [source]
 * @property {Array<[string, string]>} [points]
 */
/** @typedef {{ correct: boolean, errorType: string | null, message: string }} Diagnosis */

const UNIT_FACTORS = [10n, 100n, 1000n, 60n, 24n].flatMap((k) => [frac(k), frac(1n, k)]);

/**
 * @param {ModelLike} model
 * @param {Fraction} m
 * @param {Fraction} c
 * @returns {Diagnosis}
 */
export function diagnoseModel(model, m, c) {
  const em = parseFrac(model.m);
  const ec = parseFrac(model.c);
  /** @param {string|null} type */
  const out = (type) => ({ correct: type === null, errorType: type, message: MODEL_FEEDBACK[type ?? 'OK'](model, em) });

  if (equals(m, em) && equals(c, ec)) return out(null);
  if (equals(m, ec) && equals(c, em) && !equals(em, ec)) return out('RATE_INITIAL_SWAP');
  if (equals(m, em) && isZero(c) && !isZero(ec)) return out('MISSING_INITIAL');
  if (!isZero(em) && equals(m, neg(em)) && equals(c, ec)) return out('SIGN_DIRECTION');
  if (!isZero(em) && equals(m, div(frac(1n), em)) && equals(c, neg(div(ec, em)))) return out('VAR_ROLE_SWAP');
  if (equals(c, ec) && UNIT_FACTORS.some((f) => equals(m, mul(em, f)))) return out('UNIT_MISMATCH');
  if (
    model.source === 'points' &&
    (model.points ?? []).some(([px, py]) => {
      const x = parseFrac(px);
      return !isZero(x) && equals(m, div(parseFrac(py), x));
    })
  ) {
    return out('RATE_FROM_TOTAL');
  }
  if (equals(m, em)) return out('WRONG_INITIAL');
  if (equals(c, ec)) return out('WRONG_RATE');
  return out('WRONG_MODEL');
}

/**
 * @param {ModelLike} model
 * @param {string} text  persamaan yang diketik siswa
 * @returns {Diagnosis}
 */
export function checkModel(model, text) {
  try {
    const { m, c } = parseLinearEquation(text);
    return diagnoseModel(model, m, c);
  } catch (err) {
    if (err instanceof EquationError) return { correct: false, errorType: 'PARSE_ERROR', message: err.message };
    throw err;
  }
}
