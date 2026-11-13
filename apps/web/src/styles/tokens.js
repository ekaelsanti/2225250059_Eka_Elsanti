// Warna peran variabel (CLAUDE.md §5.4). Nilai sebenarnya ada di globals.css (:root).
export const COLOR = {
  point1: 'var(--c-point1)', // x1, y1, titik 1 (biru)
  point2: 'var(--c-point2)', // x2, y2, titik 2 (oranye)
  slope: 'var(--c-slope)', // m / laju (hijau)
  intercept: 'var(--c-intercept)', // c / nilai awal (ungu)
  rise: 'var(--c-rise)', // Δy (magenta)
  run: 'var(--c-run)', // Δx (sian)
  muted: 'var(--muted)',
  text: 'var(--text)',
};

/** @param {string} name */
export const col = (name) => COLOR[name] ?? name;
