import { go } from '../app/router.js';
import { NAV_TEXT } from '../content/strings.id.js';
import { setSetting, useAppState } from '../store/store.js';
import Icon from './Icon.jsx';
import InstallButton from './InstallButton.jsx';

// [path, ikon emoji (navigasi bawah HP), ikon garis (menu samping), label, hanya di menu samping?]
// Lab Grafik & Pengaturan tidak dimuat di navigasi bawah HP agar target sentuh tetap >= 48 dp.
const TABS = [
  ['/', '🏠', 'home', 'Beranda'],
  ['/materi', '📖', 'materi', 'Materi'],
  ['/latihan', '✏️', 'latihan', 'Latihan'],
  ['/literasi', '🌏', 'literasi', 'Literasi'],
  ['/catatan', '📒', 'catatan', 'Catatan'],
  ['/lab', '🧪', 'lab', 'Lab Grafik', true],
  ['/pengaturan', '⚙️', 'pengaturan', 'Pengaturan', true],
];

/** Tombol ☰ untuk membuka/menutup menu samping (hanya tampil di layar lebar). */
function NavToggle() {
  const { settings } = useAppState();
  const open = settings.navOpen !== false;
  return (
    <button type="button" className="icon-btn nav-toggle" aria-expanded={open}
      aria-label={open ? NAV_TEXT.hide : NAV_TEXT.show} title={open ? NAV_TEXT.hide : NAV_TEXT.show}
      onClick={() => setSetting('navOpen', !open)}>
      ☰
    </button>
  );
}

/** Halaman dengan bilah judul. back = path tujuan tombol kembali. */
export function Page({ title, subtitle, back, actions, children }) {
  return (
    <div className="page">
      <header className="topbar">
        <NavToggle />
        {back ? (
          <button className="icon-btn" aria-label="Kembali" onClick={() => go(back)}>
            ←
          </button>
        ) : (
          <span className="brand-dot" aria-hidden="true" />
        )}
        <div className="topbar-title">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions}
      </header>
      <main className="content">{children}</main>
    </div>
  );
}

export function BottomNav({ route }) {
  const section = route === '/' ? '/' : `/${route.split('/')[1]}`;
  return (
    <nav className="bottomnav" aria-label="Navigasi utama">
      {/* logo + nama aplikasi (hanya di menu samping) */}
      <a className="nav-brand" href="#/" aria-label="GradieKAn, ke beranda">
        <img src="/icon.svg" alt="" width="36" height="36" />
        <span>GradieKAn</span>
      </a>
      {TABS.map(([path, emoji, line, label, sideOnly]) => (
        <a key={path} href={`#${path}`} className={`${section === path ? 'active' : ''} ${sideOnly ? 'side-only' : ''}`}
          aria-current={section === path ? 'page' : undefined}>
          <span className="nav-icon nav-emoji" aria-hidden="true">
            {emoji}
          </span>
          <span className="nav-icon nav-line">
            <Icon name={line} />
          </span>
          <span>{label}</span>
        </a>
      ))}
      <InstallButton variant="nav" />
    </nav>
  );
}
