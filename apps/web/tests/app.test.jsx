// @vitest-environment jsdom
// Uji render semua layar (menangkap error runtime) + uji pemeriksa jawaban & generator.
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App.jsx';
import { BASE_PROBLEMS } from '../src/content/bank.js';
import { MODULES } from '../src/content/modules.js';
import { storyLevel } from '../src/content/strings.id.js';
import { checkInterpretation, checkNumber, parseAnswer } from '../src/math/answer.js';
import { parseLinearEquation } from '../src/math/equation.js';
import { equals, frac, mul, parseFrac, toString } from '../src/math/fraction.js';
import { generateEquationProblem, generateRelationProblem, generateTwoPointProblem, meetsLevel } from '../src/math/generator.js';
import { login } from '../src/app/session.js';
import { update } from '../src/store/store.js';

login('siswa', 'siswa1234'); // aplikasi kini dimulai dari layar login

describe('semua layar dapat dirender', () => {
  beforeEach(() => update(() => ({ onboardingDone: true })));
  const routes = ['/', '/materi', '/belajar/gradien', '/latihan', '/literasi', '/catatan', '/lab', '/pengaturan', '/lencana',
    ...MODULES.map((m) => `/materi/${m.id}`), ...BASE_PROBLEMS.map((p) => `/literasi/${p.id}`)];
  it.each(routes)('%s', (route) => {
    window.location.hash = route;
    const html = renderToString(<App />);
    expect(html).toContain('Beranda'); // navigasi bawah
    expect(html.length).toBeGreaterThan(500);
  });
  it('onboarding tampil saat pertama kali', () => {
    update(() => ({ onboardingDone: false }));
    expect(renderToString(<App />)).toContain('Kemiringan ada di sekitarmu');
  });
});

describe('level soal cerita', () => {
  it.each([[0, 'Pemula'], [3, 'Pemula'], [4, 'Terampil'], [8, 'Mahir'], [11, 'Ahli']])('%i dari 11 -> %s', (done, label) => {
    expect(storyLevel(done, 11).label).toBe(label);
  });
  it('beranda: tanpa kartu ringkasan, ada etalase lencana dan progres materi Gradi', () => {
    update(() => ({ onboardingDone: true }));
    window.location.hash = '/';
    const html = renderToString(<App />);
    expect(html).not.toContain('stat-cards');
    expect(html).toContain('badge-showcase');
    expect(html).toContain('Progres materi 0%');
  });
});

describe('jawaban angka', () => {
  it.each([
    ['Rp25.000', '25000'], ['-7/3', '-7/3'], ['1,5', '3/2'], ['2.5', '5/2'], ['25 ribu', '25000'], ['jawabannya − 4', '-4'],
  ])('%s', (text, expected) => {
    expect(toString(parseAnswer(text))).toBe(expected);
  });
  it('tidak ada angka', () => expect(parseAnswer('tidak tahu')).toBeNull());
  it.each([
    ['19000', '19.000', null], ['-2', '2', 'SIGN_ERROR'], ['2/3', '3/2', 'INVERTED_RATIO'], ['8', '8000', 'UNIT_MISMATCH'],
    ['19000', '18000', 'ARITH_ERROR'], ['5', 'lima', 'PARSE_ERROR'],
  ])('checkNumber(%s, %s)', (exp, text, err) => {
    expect(checkNumber(exp, text).errorType).toBe(err);
  });
  it('pecahan belum sederhana diterima dengan catatan', () => {
    const d = checkNumber('3/2', '6/4');
    expect(d.correct).toBe(true);
    expect(d.message).toContain('1,5');
  });
  it('tafsiran butuh satuan', () => {
    expect(checkInterpretation('19000', 'rupiah', 'Biaya ke sekolah Rp19.000').correct).toBe(true);
    expect(checkInterpretation('8', 'km', 'paling jauh 8 kilometer').correct).toBe(true);
    expect(checkInterpretation('19000', 'rupiah', '19000').errorType).toBe('INTERPRET_NO_UNIT');
    expect(checkInterpretation('1150000', 'rupiah', 'Total biaya 6 bulan adalah Rp1.150.000').correct).toBe(true);
    expect(checkInterpretation('25000', 'rupiah', 'Biaya 8 km adalah Rp24.000').errorType).toBe('ARITH_ERROR');
  });
});

describe('generator soal persamaan & sejajar/tegak lurus', () => {
  it.each([1, 2, 3, 4])('persamaan level %i: teks yang tampil benar-benar bergradien m', (level) => {
    for (let seed = 1; seed <= 200; seed++) {
      const e = generateEquationProblem(level, seed);
      const parsed = parseLinearEquation(e.text); // dibaca ulang secara independen dari teks soal
      expect(equals(parsed.m, e.m), `${e.text}`).toBe(true);
      expect(equals(parsed.c, e.c), `${e.text}`).toBe(true);
      expect(e.m.num).not.toBe(0n);
      expect(generateEquationProblem(level, seed)).toEqual(e);
    }
  });
  it('bentuk per level sesuai', () => {
    expect(generateEquationProblem(1, 7).form).toBe('mx+c');
    expect(generateEquationProblem(3, 7).form).toBe('ky');
    expect(generateEquationProblem(4, 7).text).toMatch(/= 0$/);
    for (let seed = 1; seed <= 50; seed++) expect(generateEquationProblem(2, seed).m.num < 0n).toBe(true);
  });
  it.each([1, 2, 3, 4])('hubungan level %i: sejajar m2 = m1, tegak lurus m1 × m2 = −1', (level) => {
    const seen = new Set();
    for (let seed = 1; seed <= 200; seed++) {
      const r = generateRelationProblem(level, seed);
      seen.add(`${r.relation}/${r.base.kind}`);
      if (r.relation === 'sejajar') expect(equals(r.m2, r.m1)).toBe(true);
      else expect(equals(mul(r.m1, r.m2), frac(-1n))).toBe(true);
    }
    expect(seen.size).toBe(4); // kedua relasi × kedua bentuk garis g muncul
  });
});

describe('generator soal', () => {
  it.each([1, 2, 3, 4])('level %i memenuhi aturan dan deterministik', (level) => {
    for (let seed = 1; seed <= 200; seed++) {
      const p = generateTwoPointProblem(level, seed);
      expect(meetsLevel(level, p)).toBe(true);
      expect(equals(p.m, parseFrac(`${p.dy}/${p.dx}`))).toBe(true);
      expect(generateTwoPointProblem(level, seed)).toEqual(p);
    }
  });
});
