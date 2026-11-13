// Ikon garis (outline) untuk menu samping. SVG inline: offline, tanpa pustaka tambahan.
const PATHS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  materi: 'M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z M14 3v5h5 M8.5 13h7 M8.5 17h7',
  latihan: 'M5 19 19 5 M6.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M14 20.5l6.5-6.5',
  literasi: 'M3 5.5h6a3 3 0 0 1 3 3V20a2 2 0 0 0-2-2H3z M21 5.5h-6a3 3 0 0 0-3 3V20a2 2 0 0 1 2-2h7z',
  catatan: 'M7 3h7l5 5v11.5A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3z M14 3v5h5 M8.5 12.5h7 M8.5 16.5h4.5',
  lab: 'M3 3v18h18 M7 15.5l4-4.5 3 3 5.5-6.5',
  pengaturan:
    'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.6-2-3.4-2.4 1a7.4 7.4 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5A7.4 7.4 0 0 0 7 6.5l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 3l-2 1.6 2 3.4 2.4-1a7.4 7.4 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7.4 7.4 0 0 0 2.6-1.5l2.4 1 2-3.4z',
  pasang: 'M12 3v12 M7 10.5l5 5 5-5 M5 20.5h14',
};

export default function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {PATHS[name].split(' M').map((d, i) => (
        <path key={i} d={i === 0 ? d : `M${d}`} />
      ))}
    </svg>
  );
}
