// Ikon ilustrasi berwarna (gradasi + kilau + bayangan) untuk menu. SVG inline: offline, tanpa pustaka.
import { useId } from 'react';

/** gradasi vertikal (atas → bawah) dalam koordinat 48×48 */
const LG = ({ id, from, to, x1 = 0, y1 = 4, x2 = 0, y2 = 44 }) => (
  <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
    <stop offset="0" stopColor={from} />
    <stop offset="1" stopColor={to} />
  </linearGradient>
);

const Shadow = ({ rx = 14, cy = 44 }) => <ellipse cx="24" cy={cy} rx={rx} ry="2.4" fill="#0f172a" opacity="0.14" />;
const Shine = (props) => <path fill="#fff" opacity="0.45" {...props} />;

/** @type {Record<string, (u: (k: string) => string, id: (k: string) => string) => JSX.Element>} */
const ICONS = {
  home: (u, id) => (
    <>
      <defs>
        <LG id={id('roof')} from="#fb7185" to="#dc2626" y1={8} y2={26} />
        <LG id={id('wall')} from="#fffbeb" to="#fdba74" y1={18} y2={41} />
        <LG id={id('door')} from="#60a5fa" to="#1d4ed8" y1={27} y2={41} />
      </defs>
      <Shadow />
      <rect x="30.5" y="9" width="4.5" height="9" rx="1" fill="#b91c1c" />
      <rect x="11" y="20" width="26" height="21" rx="3" fill={u('wall')} />
      <rect x="19.5" y="28" width="9" height="13" rx="2.5" fill={u('door')} />
      <circle cx="26" cy="35" r="0.9" fill="#fde68a" />
      <rect x="29.5" y="25" width="5" height="5" rx="1.2" fill="#bae6fd" stroke="#fff" strokeWidth="0.8" />
      <path d="M5.6 22.6 24 7.4l18.4 15.2a2.2 2.2 0 0 1-2.8 3.4L24 13.2 8.4 26a2.2 2.2 0 0 1-2.8-3.4z" fill={u('roof')} />
      <Shine d="M10 21.2 24 9.6l2 1.6L11.6 23z" />
    </>
  ),
  materi: (u, id) => (
    <>
      <defs>
        <LG id={id('cover')} from="#60a5fa" to="#1e40af" y1={12} y2={42} />
        <LG id={id('page')} from="#ffffff" to="#dbeafe" y1={10} y2={38} />
      </defs>
      <Shadow rx={17} />
      <path d="M3.5 14v26c7.4-2.6 14.2-2.2 20.5 1.2 6.3-3.4 13.1-3.8 20.5-1.2V14z" fill={u('cover')} />
      <path d="M24 13.5C18.5 9.8 12 9.4 6.5 11.4v25c5.6-1.8 11.7-1.3 17.5 2.2z" fill={u('page')} />
      <path d="M24 13.5c5.5-3.7 12-4.1 17.5-2.1v25c-5.6-1.8-11.7-1.3-17.5 2.2z" fill={u('page')} />
      <path d="M24 13.5v25" stroke="#93c5fd" strokeWidth="1.2" />
      <path d="M10 18c3.6-1 7-.8 10.5.8M10 23c3.6-1 7-.8 10.5.8M10 28c3.6-1 7-.8 10.5.8M27.5 18.8c3.5-1.6 6.9-1.8 10.5-.8M27.5 23.8c3.5-1.6 6.9-1.8 10.5-.8"
        stroke="#93c5fd" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M33 10.6v9.4l2.2-1.6 2.2 1.6v-9" fill="#f43f5e" />
    </>
  ),
  latihan: (u, id) => (
    <>
      <defs>
        <LG id={id('paper')} from="#ffffff" to="#e2e8f0" y1={6} y2={42} />
        <LG id={id('body')} from="#fde047" to="#f59e0b" y1={19} y2={29} />
        <LG id={id('eraser')} from="#fbcfe8" to="#ec4899" y1={19} y2={29} />
        <LG id={id('metal')} from="#e2e8f0" to="#64748b" y1={19} y2={29} />
      </defs>
      <Shadow rx={13} />
      <rect x="7" y="6" width="26" height="34" rx="3" fill={u('paper')} stroke="#cbd5e1" strokeWidth="1" />
      <path d="M11.5 14h17M11.5 20h17M11.5 26h10" stroke="#93c5fd" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 33.5l2.5 2.5 5-5" stroke="#22c55e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <g transform="rotate(-45 30 26)">
        <path d="M14 21.5 7.5 26l6.5 4.5z" fill="#fcd9a8" />
        <path d="M9.6 24.5 7.5 26l2.1 1.5z" fill="#334155" />
        <rect x="14" y="21.5" width="22" height="9" fill={u('body')} />
        <rect x="14" y="21.5" width="22" height="2.6" fill="#fff" opacity="0.4" />
        <rect x="36" y="21.5" width="4" height="9" fill={u('metal')} />
        <rect x="40" y="21.5" width="5" height="9" rx="2" fill={u('eraser')} />
      </g>
    </>
  ),
  literasi: (u, id) => (
    <>
      <defs>
        <LG id={id('paper')} from="#ffffff" to="#fde7c7" y1={4} y2={40} />
        <LG id={id('lens')} from="#e0f2fe" to="#7dd3fc" y1={20} y2={40} />
        <LG id={id('handle')} from="#fb923c" to="#c2410c" y1={34} y2={46} />
      </defs>
      <Shadow rx={15} />
      <path d="M8 6.5A2.5 2.5 0 0 1 10.5 4H30l7 7v26.5a2.5 2.5 0 0 1-2.5 2.5h-24A2.5 2.5 0 0 1 8 37.5z" fill={u('paper')} stroke="#fdba74" strokeWidth="1" />
      <path d="M30 4v5a2 2 0 0 0 2 2h5z" fill="#fdba74" />
      <path d="M12.5 12h13M12.5 17h19M12.5 22h10" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M24.5 22h7" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12.5 27h6" stroke="#7c3aed" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M36.5 37.5l6 6" stroke={u('handle')} strokeWidth="5" strokeLinecap="round" />
      <circle cx="31" cy="31" r="8" fill={u('lens')} fillOpacity="0.85" stroke="#334155" strokeWidth="2.6" />
      <Shine d="M26.6 29.5a4.8 4.8 0 0 1 3.2-3.4c.9-.3 1.4.9.6 1.4a3.6 3.6 0 0 0-2.4 2.5c-.3.9-1.6.6-1.4-.5z" opacity="0.8" />
    </>
  ),
  catatan: (u, id) => (
    <>
      <defs>
        <LG id={id('cover')} from="#fcd34d" to="#f97316" y1={6} y2={42} />
        <LG id={id('ring')} from="#f1f5f9" to="#64748b" x1={8} y1={0} x2={15} y2={0} />
      </defs>
      <Shadow rx={13} />
      <rect x="11" y="6" width="28" height="36" rx="3.5" fill={u('cover')} />
      <rect x="15.5" y="9.5" width="20.5" height="29" rx="2" fill="#fff" />
      <path d="M19 16h13.5M19 21.5h13.5M19 27h13.5M19 32.5h8" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" />
      {[11, 17, 23, 29, 35].map((y) => (
        <rect key={y} x="8" y={y} width="9" height="2.8" rx="1.4" fill={u('ring')} />
      ))}
      <path d="M31 6h5v9l-2.5-1.8L31 15z" fill="#ef4444" />
    </>
  ),
  tanya: (u, id) => (
    <>
      <defs>
        <LG id={id('bubble')} from="#c084fc" to="#6d28d9" y1={6} y2={38} />
      </defs>
      <Shadow rx={13} />
      <path d="M12 7h24a6 6 0 0 1 6 6v13a6 6 0 0 1-6 6H22l-8 7.5V32h-2a6 6 0 0 1-6-6V13a6 6 0 0 1 6-6z" fill={u('bubble')} />
      <Shine d="M10 13a3.5 3.5 0 0 1 3.5-3.5H28c1 0 1 1.6 0 1.6H13.6A2 2 0 0 0 11.6 13v4c0 1-1.6 1-1.6 0z" />
      <circle cx="16.5" cy="19.5" r="2.4" fill="#fff" />
      <circle cx="24" cy="19.5" r="2.4" fill="#fff" />
      <circle cx="31.5" cy="19.5" r="2.4" fill="#fff" />
      <path d="M40 3.5l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#facc15" />
    </>
  ),
  lab: (u, id) => (
    <>
      <defs>
        <LG id={id('board')} from="#ffffff" to="#e0f2fe" y1={4} y2={36} />
        <LG id={id('knob')} from="#c4b5fd" to="#7c3aed" y1={37} y2={45} />
      </defs>
      <Shadow rx={16} cy={45} />
      <rect x="5" y="4" width="38" height="32" rx="4" fill={u('board')} stroke="#7dd3fc" strokeWidth="1.2" />
      <path d="M5 12h38M5 20h38M5 28h38M13 4v32M21 4v32M29 4v32M37 4v32" stroke="#bae6fd" strokeWidth="0.8" />
      <path d="M9 32h31M13 34V7" stroke="#334155" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.5 31 37 10" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
      <path d="M17 25.3h11.7v-9" stroke="#64748b" strokeWidth="1.2" strokeDasharray="2 1.6" fill="none" />
      <circle cx="17" cy="25.3" r="3" fill="#2563eb" stroke="#fff" strokeWidth="1.2" />
      <circle cx="28.7" cy="16.3" r="3" fill="#f97316" stroke="#fff" strokeWidth="1.2" />
      <rect x="9" y="40" width="30" height="3" rx="1.5" fill="#cbd5e1" />
      <rect x="9" y="40" width="19" height="3" rx="1.5" fill="#22c55e" />
      <circle cx="28" cy="41.5" r="3.6" fill={u('knob')} stroke="#fff" strokeWidth="1.2" />
    </>
  ),
  pengaturan: (u, id) => (
    <>
      <defs>
        <LG id={id('gear')} from="#93c5fd" to="#1d4ed8" y1={6} y2={42} />
      </defs>
      <Shadow rx={13} />
      <g fill={u('gear')}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <rect key={a} x="20.5" y="5" width="7" height="9" rx="1.8" transform={`rotate(${a} 24 24)`} />
        ))}
        <circle cx="24" cy="24" r="14" />
      </g>
      <circle cx="24" cy="24" r="6" fill="#eff6ff" stroke="#1e3a8a" strokeOpacity="0.35" strokeWidth="1.2" />
      <Shine d="M13.5 20a11 11 0 0 1 7-7c1-.3 1.5 1.1.5 1.5a9.5 9.5 0 0 0-6 6c-.4 1-1.9.5-1.5-.5z" />
    </>
  ),
  pasang: (u, id) => (
    <>
      <defs>
        <LG id={id('phone')} from="#475569" to="#0f172a" y1={4} y2={43} />
        <LG id={id('screen')} from="#86efac" to="#16a34a" y1={8} y2={37} />
      </defs>
      <Shadow rx={11} />
      <rect x="12.5" y="4" width="23" height="39" rx="4.5" fill={u('phone')} />
      <rect x="15" y="8" width="18" height="29" rx="2" fill={u('screen')} />
      <path d="M24 12.5v13M18.5 20.5l5.5 5.5 5.5-5.5M18.5 31h11" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="21" y="39" width="6" height="1.6" rx="0.8" fill="#94a3b8" />
    </>
  ),
  dasbor: (u, id) => (
    <>
      <defs>
        <LG id={id('board')} from="#ffffff" to="#e2e8f0" y1={6} y2={38} />
        <LG id={id('b1')} from="#93c5fd" to="#2563eb" y1={20} y2={33} />
        <LG id={id('b2')} from="#86efac" to="#16a34a" y1={12} y2={33} />
        <LG id={id('b3')} from="#fdba74" to="#ea580c" y1={16} y2={33} />
      </defs>
      <Shadow rx={15} />
      <path d="M17 38l-3 6M31 38l3 6" stroke="#64748b" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="5" y="6" width="38" height="32" rx="4" fill={u('board')} stroke="#cbd5e1" />
      <rect x="11" y="21" width="6" height="12" rx="1.5" fill={u('b1')} />
      <rect x="21" y="13" width="6" height="20" rx="1.5" fill={u('b2')} />
      <rect x="31" y="17" width="6" height="16" rx="1.5" fill={u('b3')} />
    </>
  ),
  lencana: (u, id) => (
    <>
      <defs>
        <LG id={id('gold')} from="#fde68a" to="#d97706" y1={16} y2={44} />
      </defs>
      <Shadow rx={11} cy={45} />
      <path d="M14 3h8l6 14h-8z" fill="#3b82f6" />
      <path d="M34 3h-8l-6 14h8z" fill="#ef4444" />
      <circle cx="24" cy="30" r="12.5" fill={u('gold')} />
      <circle cx="24" cy="30" r="9" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.2" />
      <path d="M24 23.5l2 4.1 4.5.6-3.3 3.1.8 4.5-4-2.2-4 2.2.8-4.5-3.3-3.1 4.5-.6z" fill="#fff" />
    </>
  ),
  buku: (u, id) => (
    <>
      <defs>
        <LG id={id('b1')} from="#93c5fd" to="#1d4ed8" y1={30} y2={42} />
        <LG id={id('b2')} from="#fca5a5" to="#dc2626" y1={20} y2={31} />
        <LG id={id('b3')} from="#86efac" to="#15803d" y1={10} y2={21} />
        <LG id={id('ok')} from="#4ade80" to="#16a34a" y1={2} y2={18} />
      </defs>
      <Shadow rx={16} />
      <rect x="6" y="31" width="34" height="11" rx="2.2" fill={u('b1')} />
      <path d="M36 32.5h3v8h-3z" fill="#fff" opacity="0.85" />
      <rect x="9" y="21" width="31" height="10" rx="2.2" fill={u('b2')} transform="rotate(-3 24 26)" />
      <path d="M11 23.6h3v6.6h-3z" fill="#fde68a" transform="rotate(-3 24 26)" />
      <rect x="8" y="11" width="28" height="10" rx="2.2" fill={u('b3')} transform="rotate(4 22 16)" />
      <path d="M32 12.5h2.6v7h-2.6z" fill="#fff" opacity="0.85" transform="rotate(4 22 16)" />
      <rect x="8" y="33.5" width="22" height="1.6" rx="0.8" fill="#fff" opacity="0.35" />
      <circle cx="38" cy="10" r="7.5" fill={u('ok')} stroke="#fff" strokeWidth="1.6" />
      <path d="M34.6 10.2l2.4 2.4 4.4-4.6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  piala: (u, id) => (
    <>
      <defs>
        <LG id={id('gold')} from="#fde68a" to="#d97706" y1={5} y2={32} />
        <LG id={id('base')} from="#a16207" to="#713f12" y1={36} y2={44} />
      </defs>
      <Shadow rx={12} />
      <path d="M12 9H7.5a1.5 1.5 0 0 0-1.5 1.7C6.8 17 10 20.5 15 21M36 9h4.5a1.5 1.5 0 0 1 1.5 1.7C41.2 17 38 20.5 33 21" stroke="#f59e0b" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M12 5h24v9c0 7.5-5.4 13-12 13S12 21.5 12 14z" fill={u('gold')} />
      <rect x="21" y="26" width="6" height="7" fill="#d97706" />
      <path d="M16 33h16l1.5 4h-19z" fill="#f59e0b" />
      <rect x="12.5" y="37" width="23" height="6.5" rx="1.6" fill={u('base')} />
      <rect x="19" y="39" width="10" height="2.5" rx="0.8" fill="#fde68a" />
      <path d="M24 8.6l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="#fff" />
      <Shine d="M14.6 7h2v8.6c0 2.6.8 4.8 2 6.6.5.8-.6 1.6-1.2.8a13 13 0 0 1-2.8-7.4z" />
    </>
  ),
  lampu: (u, id) => (
    <>
      <defs>
        <radialGradient id={id('glow')} gradientUnits="userSpaceOnUse" cx="24" cy="18" r="22">
          <stop offset="0" stopColor="#fde047" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fde047" stopOpacity="0" />
        </radialGradient>
        <LG id={id('bulb')} from="#fef9c3" to="#facc15" y1={4} y2={30} />
        <LG id={id('base')} from="#e2e8f0" to="#64748b" y1={30} y2={41} />
      </defs>
      <Shadow rx={9} />
      <circle cx="24" cy="18" r="20" fill={u('glow')} />
      <path d="M24 4.5c-7.5 0-13 5.6-13 12.6 0 4.6 2.3 7.6 4.5 9.8 1.3 1.3 2 2.6 2 4.2h13c0-1.6.7-2.9 2-4.2 2.2-2.2 4.5-5.2 4.5-9.8 0-7-5.5-12.6-13-12.6z" fill={u('bulb')} stroke="#eab308" strokeWidth="1.2" />
      <path d="M20 31v-7.5l2-2 2 2 2-2 2 2V31" stroke="#ca8a04" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
      <rect x="17.5" y="31" width="13" height="8" rx="2" fill={u('base')} />
      <path d="M17.5 34h13M17.5 36.6h13" stroke="#475569" strokeWidth="0.9" opacity="0.6" />
      <path d="M21.5 39.5h5a2.5 2.5 0 0 1-5 0z" fill="#475569" />
      <Shine d="M15.4 15.4a8.8 8.8 0 0 1 6.4-6.6c1-.2 1.4 1.1.5 1.5a7.4 7.4 0 0 0-5.3 5.5c-.3 1-1.8.7-1.6-.4z" opacity="0.7" />
    </>
  ),
  ceritaLampu: (u, id) => (
    <>
      <defs>
        <LG id={id('cover')} from="#60a5fa" to="#1e40af" y1={22} y2={44} />
        <LG id={id('page')} from="#ffffff" to="#dbeafe" y1={20} y2={42} />
        <LG id={id('bulb')} from="#fef9c3" to="#facc15" y1={2} y2={20} />
        <radialGradient id={id('glow')} gradientUnits="userSpaceOnUse" cx="24" cy="11" r="13">
          <stop offset="0" stopColor="#fde047" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fde047" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Shadow rx={17} cy={45} />
      <path d="M3.5 25v17c7.4-2.2 14.2-1.8 20.5 1 6.3-2.8 13.1-3.2 20.5-1V25z" fill={u('cover')} />
      <path d="M24 25.5c-5.5-3-12-3.3-17.5-1.7v16.5c5.6-1.4 11.7-1 17.5 1.8z" fill={u('page')} />
      <path d="M24 25.5c5.5-3 12-3.3 17.5-1.7v16.5c-5.6-1.4-11.7-1-17.5 1.8z" fill={u('page')} />
      <path d="M24 25.5v16.6" stroke="#93c5fd" strokeWidth="1.2" />
      <path d="M10 29.5c3.4-.8 6.8-.6 10.4.6M10 34c3.4-.8 6.8-.6 10.4.6M27.6 30.1c3.6-1.2 7-1.4 10.4-.6M27.6 34.6c3.6-1.2 7-1.4 10.4-.6"
        stroke="#93c5fd" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="11" r="13" fill={u('glow')} />
      <path d="M24 2.5c-4.3 0-7.5 3.2-7.5 7.2 0 2.6 1.3 4.3 2.6 5.6.8.8 1.2 1.5 1.2 2.4h7.4c0-.9.4-1.6 1.2-2.4 1.3-1.3 2.6-3 2.6-5.6 0-4-3.2-7.2-7.5-7.2z" fill={u('bulb')} stroke="#eab308" strokeWidth="0.9" />
      <rect x="20.4" y="17.7" width="7.2" height="4" rx="1.2" fill="#94a3b8" />
      <path d="M19.6 7.6a4.8 4.8 0 0 1 3.4-3.4c.7-.2 1 .8.4 1.1a3.8 3.8 0 0 0-2.7 2.7c-.2.7-1.3.4-1.1-.4z" fill="#fff" opacity="0.8" />
      <path d="M10 8.5l2.4 1M38 8.5l-2.4 1M24 0v0" stroke="#facc15" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  pikir: (u, id) => (
    <>
      <defs>
        <LG id={id('face')} from="#fde68a" to="#f59e0b" y1={6} y2={40} />
        <LG id={id('hand')} from="#fcd34d" to="#d97706" y1={30} y2={44} />
      </defs>
      <Shadow rx={13} cy={45} />
      <circle cx="40" cy="7" r="3.2" fill="#e0f2fe" stroke="#60a5fa" strokeWidth="1.2" />
      <circle cx="44.5" cy="2.8" r="2" fill="#e0f2fe" stroke="#60a5fa" strokeWidth="1" />
      <circle cx="23" cy="24" r="17" fill={u('face')} />
      <Shine d="M12 18a13 13 0 0 1 9-8.5c1-.3 1.5 1.1.5 1.5a11 11 0 0 0-7.6 7.4c-.3 1-2.2.6-1.9-.4z" />
      <path d="M14.5 15.5q3.5-2.6 7 -.6M26 13.2q4-1.6 7.2 1.4" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <ellipse cx="18.5" cy="21" rx="2.2" ry="3" fill="#78350f" />
      <ellipse cx="29.5" cy="20" rx="2.2" ry="3" fill="#78350f" />
      <circle cx="19.2" cy="19.8" r="0.8" fill="#fff" />
      <circle cx="30.2" cy="18.8" r="0.8" fill="#fff" />
      <path d="M19 31.5q5-2.4 10 .4" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M9.5 36.5c1.4-5.4 6-7 10.6-5.4l4.4 1.6c1.8.7 1.4 3.2-.5 3.2h-4.6c-1 3.6-4.2 6-8 6.2-1.6.1-2.4-1.6-1.9-5.6z" fill={u('hand')} stroke="#b45309" strokeWidth="1" />
    </>
  ),
  awas: (u, id) => (
    <>
      <defs>
        <LG id={id('tri')} from="#fde047" to="#f59e0b" y1={6} y2={44} />
      </defs>
      <Shadow rx={15} />
      <path d="M21.4 7.5a3 3 0 0 1 5.2 0l17 29.6a3 3 0 0 1-2.6 4.5H7a3 3 0 0 1-2.6-4.5z" fill={u('tri')} stroke="#d97706" strokeWidth="1.2" strokeLinejoin="round" />
      <Shine d="M20 12.5 10.5 29c-.5.9-1.9.2-1.4-.7l9.5-16.5c.5-.9 1.9-.2 1.4.7z" />
      <rect x="21.6" y="16" width="4.8" height="14" rx="2.4" fill="#78350f" />
      <circle cx="24" cy="35.4" r="2.7" fill="#78350f" />
    </>
  ),
  benar: (u, id) => (
    <>
      <defs>
        <LG id={id('c')} from="#86efac" to="#16a34a" y1={6} y2={42} />
      </defs>
      <Shadow rx={12} />
      <circle cx="24" cy="23" r="18" fill={u('c')} />
      <Shine d="M11 18a14 14 0 0 1 10-9.6c1-.3 1.5 1.2.5 1.5a12 12 0 0 0-8.6 8.4c-.3 1-2.2.7-1.9-.3z" />
      <path d="M15 23.5l6 6 12-12.5" stroke="#fff" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  hore: (u, id) => (
    <>
      <defs>
        <LG id={id('cone')} from="#f9a8d4" to="#db2777" x1={6} y1={20} x2={30} y2={44} />
      </defs>
      <Shadow rx={12} />
      <path d="M6 43 17 15.5 32.5 31z" fill={u('cone')} />
      <path d="M10.5 31.8 21.6 41M13.6 24 27.3 35.6" stroke="#fde68a" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M22 13c2-5 7-6 9-3M30 21c4-3 9-2 10 2M26 6c0-2 1.6-3.4 3.4-3" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="35" y="7" width="4" height="4" rx="1" fill="#facc15" transform="rotate(20 37 9)" />
      <rect x="40" y="27" width="4" height="4" rx="1" fill="#22c55e" transform="rotate(-25 42 29)" />
      <circle cx="36" cy="16" r="2" fill="#a855f7" />
      <circle cx="17" cy="7" r="1.8" fill="#22c55e" />
      <circle cx="43" cy="19" r="1.6" fill="#f97316" />
    </>
  ),
  lihat: (u, id) => (
    <>
      <Shadow rx={14} />
      <ellipse cx="15" cy="23" rx="10" ry="13" fill="#fff" stroke="#334155" strokeWidth="2" />
      <ellipse cx="33" cy="23" rx="10" ry="13" fill="#fff" stroke="#334155" strokeWidth="2" />
      <circle cx="18" cy="26" r="5.2" fill="#1e293b" />
      <circle cx="36" cy="26" r="5.2" fill="#1e293b" />
      <circle cx="19.6" cy="24.2" r="1.7" fill="#fff" />
      <circle cx="37.6" cy="24.2" r="1.7" fill="#fff" />
    </>
  ),
  tulis: (u, id) => (
    <>
      <defs>
        <LG id={id('paper')} from="#ffffff" to="#e2e8f0" y1={6} y2={42} />
        <LG id={id('body')} from="#fde047" to="#f59e0b" y1={19} y2={29} />
      </defs>
      <Shadow rx={13} />
      <rect x="7" y="6" width="27" height="35" rx="3" fill={u('paper')} stroke="#cbd5e1" />
      <path d="M7 9a3 3 0 0 1 3-3h21a3 3 0 0 1 3 3v4H7z" fill="#60a5fa" />
      <path d="M11.5 19h18M11.5 25h18M11.5 31h11" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
      <g transform="rotate(-45 32 30)">
        <path d="M17 26.5 11 30l6 3.5z" fill="#fcd9a8" />
        <path d="M12.8 29 11 30l1.8 1z" fill="#334155" />
        <rect x="17" y="26.5" width="20" height="7" fill={u('body')} />
        <rect x="37" y="26.5" width="5" height="7" rx="1.6" fill="#f472b6" />
      </g>
    </>
  ),
  bintang: (u, id) => (
    <>
      <defs>
        <LG id={id('s')} from="#fef08a" to="#f59e0b" y1={4} y2={42} />
      </defs>
      <Shadow rx={12} />
      <polygon points="24.0,5.0 29.1,17.0 42.1,18.1 32.2,26.7 35.2,39.4 24.0,32.6 12.8,39.4 15.8,26.7 5.9,18.1 18.9,17.0" fill={u('s')} stroke="#d97706" strokeWidth="1.2" strokeLinejoin="round" />
      <Shine d="M20.5 14.5 23 9c.4-.9 1.8-.3 1.4.6l-2.5 5.5c-.4.9-1.8.3-1.4-.6z" />
    </>
  ),
  cari: (u, id) => (
    <>
      <defs>
        <LG id={id('lens')} from="#e0f2fe" to="#7dd3fc" y1={8} y2={32} />
        <LG id={id('handle')} from="#fb923c" to="#c2410c" y1={30} y2={44} />
      </defs>
      <Shadow rx={13} />
      <path d="M29.5 29.5 40 40" stroke={u('handle')} strokeWidth="7" strokeLinecap="round" />
      <circle cx="20" cy="20" r="13" fill={u('lens')} stroke="#334155" strokeWidth="3.6" />
      <Shine d="M12.6 18a8 8 0 0 1 5.6-6c1-.3 1.4 1.2.5 1.5a6.5 6.5 0 0 0-4.5 4.8c-.2 1-1.8.7-1.6-.3z" opacity="0.85" />
    </>
  ),
  hitung: (u, id) => (
    <>
      <defs>
        <LG id={id('b')} from="#64748b" to="#1e293b" y1={4} y2={44} />
      </defs>
      <Shadow rx={12} />
      <rect x="10" y="4" width="28" height="40" rx="5" fill={u('b')} />
      <rect x="14" y="8" width="20" height="9" rx="2" fill="#bbf7d0" />
      <path d="M26 12.5h5" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
        <rect key={`${r}${c}`} x={14 + c * 7} y={21 + r * 7} width="5.5" height="5" rx="1.4" fill={r === 2 && c === 2 ? '#fb923c' : '#e2e8f0'} />
      )))}
    </>
  ),
  kamus: (u, id) => (
    <>
      <defs>
        <LG id={id('cv')} from="#60a5fa" to="#1d4ed8" y1={5} y2={42} />
      </defs>
      <Shadow rx={12} />
      <rect x="12" y="6" width="26" height="36" rx="2" fill="#f8fafc" stroke="#cbd5e1" />
      <rect x="9" y="4" width="26" height="36" rx="3" fill={u('cv')} />
      <rect x="9" y="4" width="5" height="36" rx="2" fill="#1e3a8a" />
      <rect x="17" y="11" width="14" height="9" rx="2" fill="#fff" />
      <path d="M20 14h8M20 17h5" stroke="#3b82f6" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M27 40v6l2.5-1.8L32 46v-6" fill="#ef4444" />
    </>
  ),
  ulang: (u, id) => (
    <>
      <defs>
        <LG id={id('a')} from="#6ee7b7" to="#059669" y1={6} y2={42} />
      </defs>
      <Shadow rx={12} />
      <path d="M36.5 17A14 14 0 1 0 38 28" stroke={u('a')} strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <path d="M40 7.5v12.5H27.5z" fill="#059669" strokeLinejoin="round" />
    </>
  ),
  hapus: (u, id) => (
    <>
      <defs>
        <LG id={id('bin')} from="#fca5a5" to="#dc2626" y1={14} y2={44} />
      </defs>
      <Shadow rx={11} />
      <rect x="19.5" y="5" width="9" height="6" rx="2" fill="none" stroke="#b91c1c" strokeWidth="2.2" />
      <path d="M13 15h22l-2 25.5a3 3 0 0 1-3 2.7H18a3 3 0 0 1-3-2.7z" fill={u('bin')} />
      <rect x="10" y="10" width="28" height="6" rx="2.5" fill="#b91c1c" />
      <path d="M20 21v16M28 21v16" stroke="#fff" strokeOpacity="0.7" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  suara: (u, id) => (
    <>
      <defs>
        <LG id={id('sp')} from="#93c5fd" to="#1d4ed8" y1={10} y2={38} />
      </defs>
      <Shadow rx={13} />
      <path d="M7 19h7l10-9v28l-10-9H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" fill={u('sp')} />
      <path d="M30 17.5a8 8 0 0 1 0 13M34.5 12.5a15 15 0 0 1 0 23" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  senyap: (u, id) => (
    <>
      <defs>
        <LG id={id('sp')} from="#cbd5e1" to="#64748b" y1={10} y2={38} />
      </defs>
      <Shadow rx={13} />
      <path d="M7 19h7l10-9v28l-10-9H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" fill={u('sp')} />
      <path d="M31 18.5l11 11M42 18.5l-11 11" stroke="#ef4444" strokeWidth="3.4" strokeLinecap="round" />
    </>
  ),
  topi: (u, id) => (
    <>
      <defs>
        <LG id={id('cap')} from="#475569" to="#0f172a" y1={8} y2={34} />
      </defs>
      <Shadow rx={14} />
      <path d="M12 21v9c0 4.4 24 4.4 24 0v-9l-12 5.2z" fill="#1e293b" />
      <polygon points="24,8 45,17.5 24,27 3,17.5" fill={u('cap')} />
      <Shine d="M10 17.4 23.6 11c.9-.4 1.5 1 .6 1.4L10.6 18.8c-.9.4-1.5-1-.6-1.4z" opacity="0.3" />
      <path d="M40.5 19.5v11" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40.5" cy="32" r="2.6" fill="#fbbf24" />
    </>
  ),
  guru: (u, id) => (
    <>
      <defs>
        <LG id={id('bd')} from="#15803d" to="#14532d" y1={6} y2={30} />
      </defs>
      <Shadow rx={15} />
      <path d="M14 31l-4 12M34 31l4 12" stroke="#92400e" strokeWidth="2.6" strokeLinecap="round" />
      <rect x="5" y="5" width="38" height="27" rx="3" fill={u('bd')} stroke="#a16207" strokeWidth="2.4" />
      <path d="M10 22l6-6 4 4 8-9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 13h8M30 18h6" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
      <rect x="31" y="29.5" width="7" height="2" rx="1" fill="#fff" />
    </>
  ),
  orang: (u, id) => (
    <>
      <defs>
        <LG id={id('body')} from="#93c5fd" to="#2563eb" y1={26} y2={44} />
        <LG id={id('head')} from="#fde68a" to="#f59e0b" y1={6} y2={24} />
      </defs>
      <Shadow rx={13} />
      <path d="M9 43a15 15 0 0 1 30 0z" fill={u('body')} />
      <circle cx="24" cy="16" r="9" fill={u('head')} />
      <path d="M15.4 13.5c1.2-5.6 6.4-8.4 11.6-7.2 3.4.8 5.6 3.4 6 7-3.6-2.2-11-2.4-17.6.2z" fill="#78350f" />
      <circle cx="20.8" cy="17" r="1.2" fill="#78350f" />
      <circle cx="27.2" cy="17" r="1.2" fill="#78350f" />
      <path d="M21 20.5q3 2 6 0" stroke="#78350f" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </>
  ),
  kampung: (u, id) => (
    <>
      <defs>
        <LG id={id('w1')} from="#fffbeb" to="#fdba74" y1={20} y2={42} />
        <LG id={id('w2')} from="#ffffff" to="#bfdbfe" y1={16} y2={42} />
      </defs>
      <Shadow rx={18} />
      <circle cx="40" cy="27" r="6.5" fill="#4ade80" />
      <rect x="39" y="31" width="2" height="11" fill="#92400e" />
      <rect x="4" y="27" width="16" height="15" rx="2" fill={u('w1')} />
      <path d="M2 28.5 12 19l10 9.5z" fill="#f97316" />
      <rect x="9.5" y="33" width="5" height="9" rx="1.2" fill="#c2410c" />
      <rect x="18" y="22" width="18" height="20" rx="2" fill={u('w2')} />
      <path d="M15.5 23.5 27 12l11.5 11.5z" fill="#dc2626" />
      <rect x="21.5" y="28" width="5" height="5" rx="1" fill="#93c5fd" />
      <rect x="28.5" y="31" width="5" height="11" rx="1.2" fill="#1d4ed8" />
    </>
  ),
  ilmu: (u, id) => (
    <>
      <Shadow rx={13} />
      <g fill="none" strokeWidth="2.6">
        <ellipse cx="24" cy="23" rx="19" ry="7.5" stroke="#8b5cf6" />
        <ellipse cx="24" cy="23" rx="19" ry="7.5" stroke="#3b82f6" transform="rotate(60 24 23)" />
        <ellipse cx="24" cy="23" rx="19" ry="7.5" stroke="#06b6d4" transform="rotate(120 24 23)" />
      </g>
      <circle cx="24" cy="23" r="4.6" fill="#ec4899" />
      <circle cx="22.8" cy="21.8" r="1.4" fill="#fff" opacity="0.7" />
    </>
  ),
  kertas: (u, id) => (
    <>
      <defs>
        <LG id={id('pp')} from="#ffffff" to="#e2e8f0" y1={4} y2={44} />
      </defs>
      <Shadow rx={12} />
      <path d="M11 4h18l9 9v28a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill={u('pp')} stroke="#cbd5e1" />
      <path d="M29 4v7a2 2 0 0 0 2 2h7z" fill="#cbd5e1" />
      <path d="M13 18h20M13 24h20M13 30h20M13 36h12" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  grafik: (u, id) => (
    <>
      <defs>
        <LG id={id('bg')} from="#ffffff" to="#e0f2fe" y1={4} y2={44} />
      </defs>
      <Shadow rx={14} />
      <rect x="5" y="5" width="38" height="36" rx="6" fill={u('bg')} stroke="#7dd3fc" />
      <path d="M11 35h28M11 35V10" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 31l8-8 6 4 9-12" stroke="#16a34a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M38.5 11.5l-1 7-5.6-4.2z" fill="#16a34a" />
    </>
  ),
  pin: (u, id) => (
    <>
      <defs>
        <LG id={id('p')} from="#fda4af" to="#e11d48" y1={3} y2={40} />
      </defs>
      <Shadow rx={9} />
      <path d="M24 44S10 27.5 10 17a14 14 0 0 1 28 0c0 10.5-14 27-14 27z" fill={u('p')} />
      <circle cx="24" cy="17" r="6" fill="#fff" />
      <Shine d="M14 15a10 10 0 0 1 6.6-7.6c1-.3 1.5 1.2.5 1.5a8.4 8.4 0 0 0-5.6 6.4c-.2 1-1.7.7-1.5-.3z" />
    </>
  ),
  samaDengan: (u, id) => (
    <>
      <defs>
        <LG id={id('t')} from="#c4b5fd" to="#7c3aed" y1={4} y2={44} />
      </defs>
      <Shadow rx={14} />
      <rect x="5" y="4" width="38" height="38" rx="10" fill={u('t')} />
      <Shine d="M10 13a6 6 0 0 1 5-5h14c1 0 1 1.6 0 1.6H15.2A4.4 4.4 0 0 0 11.6 13v6c0 1-1.6 1-1.6 0z" opacity="0.4" />
      <rect x="13" y="16" width="22" height="5" rx="2.5" fill="#fff" />
      <rect x="13" y="26" width="22" height="5" rx="2.5" fill="#fff" />
    </>
  ),
  sejajar: (u, id) => (
    <>
      <defs>
        <LG id={id('t')} from="#a5b4fc" to="#4f46e5" y1={4} y2={44} />
      </defs>
      <Shadow rx={14} />
      <rect x="5" y="4" width="38" height="38" rx="10" fill={u('t')} />
      <Shine d="M10 13a6 6 0 0 1 5-5h14c1 0 1 1.6 0 1.6H15.2A4.4 4.4 0 0 0 11.6 13v6c0 1-1.6 1-1.6 0z" opacity="0.4" />
      <path d="M14 33 28 13M21 34 35 14" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  tegak: (u, id) => (
    <>
      <defs>
        <LG id={id('t')} from="#7dd3fc" to="#0369a1" y1={4} y2={44} />
      </defs>
      <Shadow rx={14} />
      <rect x="5" y="4" width="38" height="38" rx="10" fill={u('t')} />
      <Shine d="M10 13a6 6 0 0 1 5-5h14c1 0 1 1.6 0 1.6H15.2A4.4 4.4 0 0 0 11.6 13v6c0 1-1.6 1-1.6 0z" opacity="0.4" />
      <path d="M14 33h21M17 33V12" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M17 27h6v6" stroke="#fde047" strokeWidth="2.4" fill="none" />
    </>
  ),
  panah: (u, id) => (
    <>
      <defs>
        <LG id={id('t')} from="#93c5fd" to="#1d4ed8" y1={4} y2={44} />
      </defs>
      <Shadow rx={14} />
      <rect x="5" y="4" width="38" height="38" rx="10" fill={u('t')} />
      <Shine d="M10 13a6 6 0 0 1 5-5h14c1 0 1 1.6 0 1.6H15.2A4.4 4.4 0 0 0 11.6 13v6c0 1-1.6 1-1.6 0z" opacity="0.4" />
      <path d="M15 32 32 15M21 15h11v11" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  tangga: (u, id) => (
    <>
      <defs>
        <LG id={id('w')} from="#d97706" to="#92400e" x1={0} y1={0} x2={48} y2={0} />
      </defs>
      <Shadow rx={13} />
      <path d="M14 44 20 4M30 44 36 4" stroke={u('w')} strokeWidth="4.2" strokeLinecap="round" />
      <path d="M16.6 36h15.6M18 27h15.6M19.4 18h15.6M20.7 10h15" stroke="#b45309" strokeWidth="3.4" strokeLinecap="round" />
    </>
  ),
  sempoa: (u, id) => (
    <>
      <Shadow rx={15} />
      <rect x="5" y="6" width="38" height="34" rx="4" fill="none" stroke="#92400e" strokeWidth="3.4" />
      <path d="M8 15h32M8 23h32M8 31h32" stroke="#a16207" strokeWidth="1.6" />
      {[[15, ['#ef4444', '#ef4444', '#3b82f6']], [23, ['#22c55e', '#f59e0b', '#f59e0b']], [31, ['#a855f7', '#a855f7', '#ec4899']]].map(([y, cs]) =>
        cs.map((c, i) => <circle key={`${y}${i}`} cx={13 + i * 6.5 + (y === 23 ? 8 : 0)} cy={y} r="3" fill={c} />),
      )}
    </>
  ),
  kunci: (u, id) => (
    <>
      <defs>
        <LG id={id('k')} from="#fde68a" to="#d97706" y1={4} y2={44} />
      </defs>
      <Shadow rx={12} />
      <circle cx="16" cy="18" r="11" fill={u('k')} />
      <circle cx="13" cy="15" r="3.6" fill="#fff" />
      <path d="M23.5 25.5 40 42M33 35l4-4M37 39l3.4-3.4" stroke="#d97706" strokeWidth="4.4" strokeLinecap="round" />
    </>
  ),
  gembok: (u, id) => (
    <>
      <defs>
        <LG id={id('g')} from="#fde68a" to="#d97706" y1={18} y2={44} />
      </defs>
      <Shadow rx={12} />
      <path d="M15 21v-6a9 9 0 0 1 18 0v6" stroke="#94a3b8" strokeWidth="4.2" fill="none" />
      <rect x="9" y="20" width="30" height="23" rx="5" fill={u('g')} />
      <circle cx="24" cy="30" r="3.2" fill="#78350f" />
      <rect x="22.6" y="31" width="2.8" height="6" rx="1.4" fill="#78350f" />
    </>
  ),
  main: (u, id) => (
    <>
      <defs>
        <LG id={id('pl')} from="#93c5fd" to="#2563eb" y1={6} y2={42} />
      </defs>
      <Shadow rx={12} />
      <circle cx="24" cy="23" r="18" fill={u('pl')} />
      <path d="M20 15.5v15l12-7.5z" fill="#fff" strokeLinejoin="round" />
    </>
  ),
  gunung: (u, id) => (
    <>
      <defs>
        <LG id={id('m1')} from="#86efac" to="#15803d" y1={8} y2={42} />
        <LG id={id('m2')} from="#a7f3d0" to="#059669" y1={16} y2={42} />
      </defs>
      <Shadow rx={18} />
      <circle cx="38" cy="10" r="4.5" fill="#fde047" />
      <path d="M2 42 19 9l17 33z" fill={u('m1')} />
      <path d="M13.6 20.4 19 9l5.4 11.4-2.7-1.6-2.7 2-2.7-2z" fill="#fff" />
      <path d="M20 42 33 18l13 24z" fill={u('m2')} />
      <path d="M12 41c3-4 9-5 8-10s5-6 4-10" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" strokeDasharray="2.6 2.6" fill="none" />
    </>
  ),
  perosotan: (u, id) => (
    <>
      <defs>
        <LG id={id('sl')} from="#fda4af" to="#e11d48" y1={8} y2={42} />
      </defs>
      <Shadow rx={18} />
      <path d="M8 43V9M16 43V9" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 17h8M8 25h8M8 33h8" stroke="#60a5fa" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M16 10c9 0 12 6 16 15s7 13 14 13v5c-9 0-12-5-16-14S24 15 16 15z" fill={u('sl')} />
      <path d="M17 12c7 .4 10 5 13.6 13" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  ),
};

/**
 * @param {{ name: string, size?: number }} props
 */
export default function Illus({ name, size = 28, className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (k) => `${uid}-${k}`;
  const u = (k) => `url(#${id(k)})`;
  const draw = ICONS[name];
  if (!draw) return null;
  return (
    <svg className={`illus ${className}`} data-name={name} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {draw(u, id)}
    </svg>
  );
}
