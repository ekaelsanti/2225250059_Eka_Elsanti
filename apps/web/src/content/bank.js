// Bank soal cerita hasil build Python (offline). Jangan edit folder generated/ secara manual.
import glossary from './generated/glossary.json';
import m7 from './generated/word-problems.M7.json';
import m8 from './generated/word-problems.M8.json';

export const ALL_PROBLEMS = [...m7.problems, ...m8.problems];
export const BASE_PROBLEMS = ALL_PROBLEMS.filter((p) => !p.variant_of);
export const PROBLEM_BY_ID = Object.fromEntries(ALL_PROBLEMS.map((p) => [p.id, p]));
export const GLOSSARY = Object.fromEntries(glossary.map((g) => [g.term, g]));

/** Variasi angka dari soal yang sama (untuk tombol "Soal serupa"). */
export const variantsOf = (id) => {
  const baseId = PROBLEM_BY_ID[id]?.variant_of ?? id;
  return ALL_PROBLEMS.filter((p) => p.id === baseId || p.variant_of === baseId);
};
