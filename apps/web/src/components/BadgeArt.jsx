// Gambar medali lencana (segi enam + pita + lambang). SVG inline: offline, tanpa animasi.
import { useId } from 'react';

const hex = (cx, cy, r) =>
  Array.from({ length: 6 }, (_, k) => {
    const a = ((-90 + 60 * k) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(' ');

const star = (cx, cy, R, r) =>
  Array.from({ length: 10 }, (_, k) => {
    const a = ((-90 + 36 * k) * Math.PI) / 180;
    const d = k % 2 ? r : R;
    return `${(cx + d * Math.cos(a)).toFixed(2)},${(cy + d * Math.sin(a)).toFixed(2)}`;
  }).join(' ');

const W = { stroke: '#fff', strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
const GOLD = '#fde047';

/** Lambang tiap lencana (digambar di pusat 40,40). */
const EMBLEMS = {
  'penjelajah-garis': (
    <>
      <path d="M27 53V28M27 53h26" {...W} />
      <path d="M29.5 50 51 30.5" {...W} stroke={GOLD} strokeWidth={3.2} />
      <circle cx="34" cy="46" r="2.8" fill="#fff" />
      <circle cx="46.5" cy="34.6" r="2.8" fill="#fff" />
    </>
  ),
  'penembak-jitu': (
    <>
      <circle cx="38" cy="42" r="12" {...W} />
      <circle cx="38" cy="42" r="6.5" {...W} />
      <circle cx="38" cy="42" r="2.4" fill="#fff" />
      <path d="M38 42 54 26" {...W} stroke={GOLD} strokeWidth={3} />
      <path d="M54 26h-5.5M54 26v5.5" {...W} stroke={GOLD} strokeWidth={2.6} />
    </>
  ),
  'master-literasi': (
    <>
      <path d="M40 36c-4-2.6-9-3-14-1.4v15c5-1.6 10-1.2 14 1.4z" fill="#fff" />
      <path d="M40 36c4-2.6 9-3 14-1.4v15c-5-1.6-10-1.2-14 1.4z" fill="#fff" opacity="0.85" />
      <path d="M29.5 39.5c2.6-.6 5-.4 7.2.6M29.5 43.5c2.6-.6 5-.4 7.2.6M43.3 40.1c2.2-1 4.6-1.2 7.2-.6" stroke="#c4b5fd" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <polygon points={star(40, 26.5, 6.2, 2.6)} fill={GOLD} />
    </>
  ),
  'ilmuwan-grafik': (
    <>
      <path d="M36 26h8M37.6 26v8.4l-8.4 13.4a2.6 2.6 0 0 0 2.2 4h17.2a2.6 2.6 0 0 0 2.2-4l-8.4-13.4V26" {...W} />
      <path d="M32.6 44h14.8l3.4 5.4a1.4 1.4 0 0 1-1.2 2.2H30.4a1.4 1.4 0 0 1-1.2-2.2z" fill={GOLD} />
      <circle cx="38" cy="47.6" r="1.3" fill="#fff" />
      <circle cx="43" cy="46.4" r="1" fill="#fff" />
    </>
  ),
};

const COLORS = {
  'penjelajah-garis': ['#93c5fd', '#2563eb'],
  'penembak-jitu': ['#a5b4fc', '#4f46e5'],
  'master-literasi': ['#c4b5fd', '#7c3aed'],
  'ilmuwan-grafik': ['#7dd3fc', '#0284c7'],
};

/**
 * @param {{ id: string, earned: boolean, size?: number }} props
 */
export default function BadgeArt({ id, earned, size = 84 }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const g = (k) => `${uid}-${k}`;
  const [light, dark] = COLORS[id] ?? ['#93c5fd', '#2563eb'];
  return (
    <svg className={`badge-art ${earned ? 'is-earned' : 'is-locked'}`} width={size} height={(size * 92) / 80} viewBox="0 0 80 92"
      aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={g('core')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={g('rim')} x1="0" y1="0" x2="1" y2="1">
          {earned ? (
            <>
              <stop offset="0" stopColor="#fef3c7" />
              <stop offset="0.45" stopColor="#fbbf24" />
              <stop offset="1" stopColor="#b45309" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#f8fafc" />
              <stop offset="0.5" stopColor="#cbd5e1" />
              <stop offset="1" stopColor="#94a3b8" />
            </>
          )}
        </linearGradient>
      </defs>
      {/* pita */}
      <path d="M26 58 20 90l9-5 6 6 5-27z" fill={dark} opacity={earned ? 1 : 0.55} />
      <path d="M54 58l6 32-9-5-6 6-5-27z" fill={light} opacity={earned ? 1 : 0.55} />
      {/* bingkai + inti */}
      <polygon points={hex(40, 40, 35)} fill={`url(#${g('rim')})`} stroke={earned ? '#b45309' : '#94a3b8'} strokeWidth="1" strokeLinejoin="round" />
      <polygon className="ba-core" points={hex(40, 40, 28.5)} fill={`url(#${g('core')})`} />
      <polygon points={hex(40, 40, 28.5)} fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" />
      <path d="M18 30a24 24 0 0 1 22-15" stroke="#fff" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" fill="none" />
      <g className="ba-emblem">{EMBLEMS[id]}</g>
      {earned ? (
        <>
          <polygon points={star(10, 12, 5, 2)} fill="#fbbf24" />
          <polygon points={star(70, 16, 4, 1.6)} fill="#fbbf24" />
          <circle cx="62" cy="62" r="9" fill="#16a34a" stroke="#fff" strokeWidth="2" />
          <path d="M57.8 62.2l2.8 2.8 5-5.4" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="62" cy="62" r="9" fill="#fff" stroke="#cbd5e1" strokeWidth="1.2" />
          <rect x="57.8" y="61" width="8.4" height="6.4" rx="1.4" fill="#64748b" />
          <path d="M59.6 61v-2.2a2.4 2.4 0 0 1 4.8 0V61" stroke="#64748b" strokeWidth="1.6" fill="none" />
        </>
      )}
    </svg>
  );
}
