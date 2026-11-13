// Gradi: maskot pensil GradieKAn. SVG statis (tanpa animasi, sesuai CLAUDE.md §7).
// Bingkai tetap 120 x 144 agar ukuran di semua halaman tidak berubah.
import { useId } from 'react';

export default function Gradi({ size = 96, message, showName = true }) {
  const uid = useId().replace(/:/g, ''); // id unik per gambar (gradien SVG)
  const g = (name) => `gradi-${uid}-${name}`;

  return (
    <div className={`gradi ${message ? 'has-bubble' : ''}`}>
      {message && <div className="gradi-bubble">{message}</div>}
      <svg width={size} height={size * 1.2} viewBox="0 0 120 144" role="img" aria-label="Gradi, maskot pensil GradieKAn">
        <defs>
          <linearGradient id={g('body')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FDE047" />
            <stop offset="0.55" stopColor="#FACC15" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id={g('eraser')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FBCFE8" />
            <stop offset="1" stopColor="#F472B6" />
          </linearGradient>
          <linearGradient id={g('metal')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F1F5F9" />
            <stop offset="1" stopColor="#94A3B8" />
          </linearGradient>
        </defs>

        {/* bintang berkilau */}
        <path d="M13 8l1.8 5.2L20 15l-5.2 1.8L13 22l-1.8-5.2L6 15l5.2-1.8z" fill="#FDE047" stroke="#F59E0B" strokeWidth="1" />
        <path d="M108 30l1.2 3.3 3.3 1.2-3.3 1.2-1.2 3.3-1.2-3.3-3.3-1.2 3.3-1.2z" fill="#fff" />
        <circle cx="100" cy="12" r="2" fill="#fff" opacity="0.8" />

        <g transform="rotate(-8 60 72)">
          {/* lengan kiri melambai + garis gerak */}
          <path d="M38 66 Q24 58 20 42" className="gradi-arm" />
          <circle cx="19.5" cy="38.5" r="5.5" fill="#FDE7C2" stroke="#1f2937" strokeWidth="2.5" />
          <path d="M12 29 Q9 34 12 39 M7.5 32 Q6 35 7.5 38" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

          {/* penghapus mengilap & cincin logam bergaris */}
          <rect x="38" y="6" width="44" height="22" rx="11" fill={`url(#${g('eraser')})`} stroke="#1f2937" strokeWidth="2.5" />
          <rect x="44" y="10" width="14" height="4" rx="2" fill="#fff" opacity="0.7" />
          <rect x="36" y="24" width="48" height="12" rx="3" fill={`url(#${g('metal')})`} stroke="#1f2937" strokeWidth="2.5" />
          <path d="M37 28.5h46 M37 32h46" stroke="#64748b" strokeWidth="1.2" />

          {/* badan pensil */}
          <rect x="38" y="36" width="44" height="66" fill={`url(#${g('body')})`} stroke="#1f2937" strokeWidth="2.5" />
          <rect x="42" y="38" width="5" height="62" rx="2.5" fill="#fff" opacity="0.45" />
          <path d="M60 37v64" stroke="#EAB308" strokeWidth="1.5" opacity="0.6" />

          {/* ujung kayu & grafit */}
          <path d="M38 102 L82 102 L60 138 Z" fill="#FDE7C2" stroke="#1f2937" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M60 102 L82 102 L64.5 131 Z" fill="#F5D0A9" opacity="0.8" />
          <path d="M52.6 126 L67.4 126 L60 138 Z" fill="#334155" />

          {/* alis */}
          <path d="M44 45 Q49 41.5 54 44.5 M66 44.5 Q71 41.5 76 45" fill="none" stroke="#1f2937" strokeWidth="2.2" strokeLinecap="round" />
          {/* mata besar berbinar */}
          <ellipse cx="49.5" cy="56" rx="7" ry="8.5" fill="#fff" stroke="#1f2937" strokeWidth="2" />
          <ellipse cx="70.5" cy="56" rx="7" ry="8.5" fill="#fff" stroke="#1f2937" strokeWidth="2" />
          <circle cx="50.5" cy="58" r="5" fill="#1f2937" />
          <circle cx="71.5" cy="58" r="5" fill="#1f2937" />
          <circle cx="52.4" cy="55.6" r="2" fill="#fff" />
          <circle cx="73.4" cy="55.6" r="2" fill="#fff" />
          <circle cx="49" cy="60.5" r="1" fill="#fff" />
          <circle cx="70" cy="60.5" r="1" fill="#fff" />

          {/* pipi merona */}
          <ellipse cx="43" cy="69" rx="5" ry="3.2" fill="#FB7185" opacity="0.6" />
          <ellipse cx="77" cy="69" rx="5" ry="3.2" fill="#FB7185" opacity="0.6" />

          {/* senyum terbuka + lidah */}
          <path d="M52.5 67.5 Q60 80 67.5 67.5 Z" fill="#7F1D1D" stroke="#1f2937" strokeWidth="2" strokeLinejoin="round" />
          <path d="M55.6 73.2 Q60 70.5 64.4 73.2 Q60 77.4 55.6 73.2 Z" fill="#FB7185" />

          {/* lengan kanan memegang kartu grafik (garis naik) */}
          <path d="M82 70 Q90 76 91 86" className="gradi-arm" />
          <g transform="rotate(10 104 86)">
            <rect x="91" y="72" width="26" height="24" rx="4" fill="#fff" stroke="#1f2937" strokeWidth="2" />
            <path d="M95 92h18 M95 92V76" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M96 90 L111 78" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M106.5 78.2 L111 78 L110.4 82.4" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <circle cx="91.5" cy="90" r="5" fill="#FDE7C2" stroke="#1f2937" strokeWidth="2.5" />
        </g>
      </svg>
      {showName && <span className="gradi-name">Gradi</span>}
    </div>
  );
}
