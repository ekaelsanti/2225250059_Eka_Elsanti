// @ts-check
import { div, sub } from './fraction.js';

/** @typedef {import('./fraction.js').Fraction} Fraction */

/**
 * Gradien dua titik; null jika tak terdefinisi (garis tegak).
 * @param {[Fraction, Fraction]} p1
 * @param {[Fraction, Fraction]} p2
 * @returns {Fraction | null}
 */
export function slopeFromPoints([x1, y1], [x2, y2]) {
  const dx = sub(x2, x1);
  if (dx.num === 0n) return null;
  return div(sub(y2, y1), dx);
}
