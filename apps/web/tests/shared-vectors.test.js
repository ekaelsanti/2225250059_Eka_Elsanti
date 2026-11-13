// VEC-01: vektor uji yang SAMA dijalankan oleh pytest (Python) dan Vitest (JavaScript).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { formatNumber, parseFrac, toString } from '../src/math/fraction.js';
import { checkModel } from '../src/math/modelCheck.js';
import { slopeFromPoints } from '../src/math/slope.js';

const load = (name) =>
  JSON.parse(readFileSync(new URL(`../../../shared/test-vectors/${name}`, import.meta.url), 'utf-8'));

describe('fraction.json', () => {
  const v = load('fraction.json');
  it.each(v.cases)('$input -> $expected', ({ input, expected }) => {
    expect(toString(parseFrac(input))).toBe(expected);
  });
  it.each(v.invalid)('invalid: %s', (bad) => {
    expect(() => parseFrac(bad)).toThrow();
  });
});

describe('slope.json', () => {
  it.each(load('slope.json').cases)('$p1 $p2', ({ p1, p2, expected }) => {
    const m = slopeFromPoints(p1.map(parseFrac), p2.map(parseFrac));
    expect(m === null ? null : toString(m)).toBe(expected);
  });
});

describe('model-check.json', () => {
  it.each(load('model-check.json').cases)('$input', ({ m, c, input, expected }) => {
    const d = checkModel({ m, c, x: { meaning: 'jarak tempuh', unit: 'km' }, y: { meaning: 'biaya', unit: 'rupiah' } }, input);
    expect(d.errorType).toBe(expected);
    expect(d.correct).toBe(expected === null);
    expect(d.message.length).toBeGreaterThan(0);
  });
});

describe('formatNumber (sama dengan numfmt.format_number)', () => {
  it.each([
    ['19000', '19.000'],
    ['3/2', '1,5'],
    ['-5/2', '-2,5'],
    ['1/3', '1/3'],
    ['-1/40', '-1/40'],
    ['1500000', '1.500.000'],
    ['1/4', '0,25'],
  ])('%s -> %s', (input, expected) => {
    expect(formatNumber(parseFrac(input))).toBe(expected);
  });
});

describe('bank soal hasil Python', () => {
  const bank = load('../../apps/web/src/content/generated/word-problems.M7.json');
  it('setiap soal: model benar lolos pemeriksa JS, accepted_forms diterima', () => {
    for (const p of bank.problems) {
      for (const form of p.solution.accepted_forms) {
        const d = checkModel(p.models[0], form);
        expect(d.correct, `${p.id}: ${form}`).toBe(true);
      }
    }
  });
});
