// F-14 Bidang Kartesius (SVG). Angka di sini hanya untuk menggambar; pemeriksaan jawaban memakai pecahan eksak.
import { col } from '../styles/tokens.js';

const W = 340;
const H = 290;
const P = 38;

function niceStep(range, target = 6) {
  const raw = range / target;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

const fmt = (v) => Number(v.toFixed(6)).toLocaleString('id-ID');

/** Rentang otomatis yang memuat 0 dan semua nilai, dengan sedikit ruang. */
export function autoRange(xs, ys, pad = 0.15) {
  let xMin = Math.min(0, ...xs);
  let xMax = Math.max(0, ...xs);
  let yMin = Math.min(0, ...ys);
  let yMax = Math.max(0, ...ys);
  if (xMax === xMin) xMax = xMin + 1;
  if (yMax === yMin) yMax = yMin + 1;
  const dx = (xMax - xMin) * pad;
  const dy = (yMax - yMin) * pad;
  return {
    xMin: xMin < 0 ? xMin - dx : xMin,
    xMax: xMax + dx,
    yMin: yMin < 0 ? yMin - dy : yMin,
    yMax: yMax + dy,
  };
}

/**
 * points:   [{ x, y, color, label, labelPos: 'right' | 'left' }]
 * lines:    [{ m, c, color, dashed, label }]  atau garis tegak [{ x, color }]
 * segments: [{ x1, y1, x2, y2, color, label, dashed }]
 */
export default function CartesianPlane({
  xMin = -6, xMax = 6, yMin = -6, yMax = 6,
  points = [], lines = [], segments = [],
  xLabel = 'x', yLabel = 'y', integerGrid = false, ariaLabel = 'Bidang Kartesius',
}) {
  const sx = (x) => P + ((x - xMin) / (xMax - xMin)) * (W - 2 * P);
  const sy = (y) => H - P - ((y - yMin) / (yMax - yMin)) * (H - 2 * P);
  const xs = integerGrid ? 1 : niceStep(xMax - xMin);
  const ys = integerGrid ? 1 : niceStep(yMax - yMin);
  const ticks = (min, max, step) => {
    const out = [];
    for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) out.push(Number(v.toFixed(10)));
    return out;
  };
  const xTicks = ticks(xMin, xMax, xs);
  const yTicks = ticks(yMin, yMax, ys);
  // Label tiap 2 garis bila grid rapat, agar angka dekat titik asal tidak bertumpuk.
  const xEvery = xTicks.length > 11 ? 2 : 1;
  const yEvery = yTicks.length > 11 ? 2 : 1;
  const showX = (v) => v !== 0 && Math.round(v / xs) % xEvery === 0;
  const showY = (v) => v !== 0 && Math.round(v / ys) % yEvery === 0;
  const hasOrigin = xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0;
  const clipId = `clip-${Math.round(xMin * 7 + xMax * 13 + yMin * 17 + yMax * 19)}`;
  const axisX = yMin <= 0 && yMax >= 0 ? sy(0) : H - P;
  const axisY = xMin <= 0 && xMax >= 0 ? sx(0) : P;

  return (
    <figure className="plane">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        <defs>
          <clipPath id={clipId}>
            <rect x={P} y={P} width={W - 2 * P} height={H - 2 * P} />
          </clipPath>
        </defs>
        {xTicks.map((v) => (
          <line key={`gx${v}`} x1={sx(v)} x2={sx(v)} y1={P} y2={H - P} className="grid" />
        ))}
        {yTicks.map((v) => (
          <line key={`gy${v}`} y1={sy(v)} y2={sy(v)} x1={P} x2={W - P} className="grid" />
        ))}
        <line x1={P} x2={W - P} y1={axisX} y2={axisX} className="axis" />
        <line y1={P} y2={H - P} x1={axisY} x2={axisY} className="axis" />
        {xTicks.filter(showX).map((v) => (
          <text key={`tx${v}`} x={sx(v)} y={Math.min(axisX + 14, H - 6)} className="tick" textAnchor="middle">
            {fmt(v)}
          </text>
        ))}
        {yTicks.filter(showY).map((v) => (
          <text key={`ty${v}`} x={Math.max(axisY - 5, 30)} y={sy(v) + 4} className="tick" textAnchor="end">
            {fmt(v)}
          </text>
        ))}
        {hasOrigin && (
          <text x={axisY - 5} y={axisX + 14} className="tick" textAnchor="end">
            0
          </text>
        )}
        <text x={W - P} y={axisX - 6} className="axis-label" textAnchor="end">
          {xLabel}
        </text>
        <text x={axisY + 6} y={P - 8} className="axis-label">
          {yLabel}
        </text>

        <g clipPath={`url(#${clipId})`}>
          {lines.map((l, i) =>
            l.x !== undefined ? (
              <line key={`l${i}`} x1={sx(l.x)} x2={sx(l.x)} y1={P} y2={H - P} style={{ stroke: col(l.color) }}
                className={l.dashed ? 'plot dashed' : 'plot'} />
            ) : (
              <line key={`l${i}`} x1={sx(xMin)} y1={sy(l.m * xMin + l.c)} x2={sx(xMax)} y2={sy(l.m * xMax + l.c)}
                style={{ stroke: col(l.color) }} className={l.dashed ? 'plot dashed' : 'plot'} />
            ),
          )}
          {segments.map((s, i) => (
            <g key={`s${i}`}>
              <line x1={sx(s.x1)} y1={sy(s.y1)} x2={sx(s.x2)} y2={sy(s.y2)} style={{ stroke: col(s.color) }}
                className={s.dashed ? 'seg dashed' : 'seg'} />
              {s.label && (
                <text x={(sx(s.x1) + sx(s.x2)) / 2 + (s.x1 === s.x2 ? 6 : 0)} y={(sy(s.y1) + sy(s.y2)) / 2 + (s.y1 === s.y2 ? 14 : 0)}
                  className="seg-label" style={{ fill: col(s.color) }} textAnchor={s.x1 === s.x2 ? 'start' : 'middle'}>
                  {s.label}
                </text>
              )}
            </g>
          ))}
        </g>
        {lines.filter((l) => l.label && l.x === undefined).map((l, i) => {
          const xe = xMax - (xMax - xMin) * 0.05;
          const ye = Math.max(Math.min(l.m * xe + l.c, yMax), yMin);
          return (
            <text key={`ll${i}`} x={sx(xe)} y={sy(ye) - 8} className="line-label" textAnchor="end" style={{ fill: col(l.color) }}>
              {l.label}
            </text>
          );
        })}
        {points.map((p, i) => (
          <g key={`p${i}`}>
            <circle cx={sx(p.x)} cy={sy(p.y)} r={6} style={{ fill: col(p.color ?? 'text') }} className="pt" />
            {p.label && (
              <text x={sx(p.x) + (p.labelPos === 'left' ? -9 : 9)} y={sy(p.y) - 8}
                textAnchor={p.labelPos === 'left' ? 'end' : 'start'} className="pt-label" style={{ fill: col(p.color ?? 'text') }}>
                {p.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </figure>
  );
}
