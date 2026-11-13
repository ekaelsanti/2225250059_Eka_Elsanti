// Ilustrasi grafik dekoratif untuk banner beranda (statis).
// Matematikanya benar: garis melalui (2, 3) dan (4, 7) -> m = 2, y = 2x - 1;
// garis kedua tegak lurus melalui (2, 3): y = -x/2 + 4.
const O = { x: 150, y: 196 }; // titik asal di layar
const U = 22; // piksel per satuan
const px = (x) => O.x + x * U;
const py = (y) => O.y - y * U;

export default function HeroGraph() {
  return (
    <svg className="hero-graph" viewBox="0 0 420 236" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hg-line1" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#86efac" />
        </linearGradient>
        <linearGradient id="hg-line2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
        <marker id="hg-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" fill="#fff" />
        </marker>
      </defs>

      {/* grid tipis */}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={px(i - 4)} x2={px(i - 4)} y1={10} y2={226} className="hg-grid" />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <line key={`h${i}`} y1={py(i - 1)} y2={py(i - 1)} x1={50} x2={410} className="hg-grid" />
      ))}

      {/* sumbu */}
      <line x1={56} y1={O.y} x2={404} y2={O.y} className="hg-axis" markerEnd="url(#hg-arrow)" />
      <line x1={O.x} y1={228} x2={O.x} y2={10} className="hg-axis" markerEnd="url(#hg-arrow)" />
      <text x={398} y={O.y - 8} className="hg-label">x</text>
      <text x={O.x + 8} y={18} className="hg-label">y</text>

      {/* garis tegak lurus (y = -x/2 + 4) */}
      <line x1={px(-3.5)} y1={py(5.75)} x2={px(10)} y2={py(-1)} stroke="url(#hg-line2)" strokeWidth="4" strokeLinecap="round"
        markerStart="url(#hg-arrow)" markerEnd="url(#hg-arrow)" opacity="0.85" />

      {/* segitiga naik/jalan dari (2,3) ke (4,7) */}
      <path d={`M${px(2)} ${py(3)} H${px(4)} V${py(7)}`} className="hg-dash" />
      <text x={(px(2) + px(4)) / 2} y={py(3) + 16} className="hg-small" textAnchor="middle">Δx = 2</text>
      <text x={px(4) + 6} y={(py(3) + py(7)) / 2} className="hg-small">Δy = 4</text>

      {/* garis utama y = 2x - 1 */}
      <line x1={px(0.4)} y1={py(-0.2)} x2={px(4.9)} y2={py(8.8)} stroke="url(#hg-line1)" strokeWidth="5" strokeLinecap="round"
        markerStart="url(#hg-arrow)" markerEnd="url(#hg-arrow)" />
      <circle cx={px(2)} cy={py(3)} r="6" className="hg-pt" />
      <circle cx={px(4)} cy={py(7)} r="6" className="hg-pt" />
      <text x={px(2) - 10} y={py(3) - 10} className="hg-label" textAnchor="end">(2, 3)</text>
      <text x={px(4) + 12} y={py(7) + 4} className="hg-label">(4, 7)</text>

      {/* kartu kaca berisi rumus */}
      <g transform="translate(300 12)">
        <rect width="108" height="42" rx="10" className="hg-glass" />
        <text x="54" y="27" className="hg-formula" textAnchor="middle">m = Δy / Δx</text>
      </g>
      <g transform="translate(270 168)">
        <rect width="132" height="40" rx="10" className="hg-glass" />
        <text x="66" y="26" className="hg-formula" textAnchor="middle">y = 2x − 1</text>
      </g>
    </svg>
  );
}
