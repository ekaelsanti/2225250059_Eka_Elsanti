// F-04 Garis bilangan: menunjukkan lompatan untuk operasi bilangan bulat.
const W = 340;
const H = 90;
const MIN = -8;
const MAX = 8;
const sx = (v) => 20 + ((v - MIN) / (MAX - MIN)) * (W - 40);

export default function NumberLine({ start, jump, caption }) {
  const end = start + jump;
  const mid = (sx(start) + sx(end)) / 2;
  return (
    <figure className="numberline">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={caption ?? `Mulai dari ${start}, lompat ${jump}`}>
        <line x1={10} x2={W - 10} y1={60} y2={60} className="axis" />
        {Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i).map((v) => (
          <g key={v}>
            <line x1={sx(v)} x2={sx(v)} y1={55} y2={65} className="axis" />
            {v % 2 === 0 && (
              <text x={sx(v)} y={82} className="tick" textAnchor="middle">
                {v}
              </text>
            )}
          </g>
        ))}
        {jump !== 0 && (
          <>
            <path d={`M ${sx(start)} 56 Q ${mid} 8 ${sx(end)} 56`} className="jump" />
            <text x={mid} y={22} className="seg-label" textAnchor="middle" style={{ fill: 'var(--c-rise)' }}>
              {jump > 0 ? `+${jump}` : jump}
            </text>
          </>
        )}
        <circle cx={sx(start)} cy={60} r={6} style={{ fill: 'var(--c-point1)' }} />
        <circle cx={sx(end)} cy={60} r={6} style={{ fill: 'var(--c-slope)' }} />
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
