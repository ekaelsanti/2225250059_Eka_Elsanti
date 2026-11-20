// Tailwind CSS (ADR-12): hanya untuk komponen baru di src/features/ (mis. Jalur RMT).
// Preflight dimatikan agar gaya lama di globals.css tidak berubah.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/features/**/*.{js,jsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      // warna peran variabel (CLAUDE.md §5.4), diambil dari token CSS yang sama
      colors: {
        point1: 'var(--c-point1)',
        point2: 'var(--c-point2)',
        slope: 'var(--c-slope)',
        intercept: 'var(--c-intercept)',
        rise: 'var(--c-rise)',
        run: 'var(--c-run)',
      },
      borderRadius: { '4xl': '1.75rem' },
    },
  },
  plugins: [],
};
