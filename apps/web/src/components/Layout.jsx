import { useEffect, useSyncExternalStore } from 'react';
import { go } from '../app/router.js';
import { useSession } from '../app/session.js';
import { NAV_TEXT } from '../content/strings.id.js';
import { setSetting, useAppState } from '../store/store.js';
import Illus from './Illus.jsx';
import InstallButton from './InstallButton.jsx';

// [path, ikon emoji (navigasi bawah HP), ikon garis (menu samping), label, hanya di menu samping?]
// Lab Grafik & Pengaturan tidak dimuat di navigasi bawah HP agar target sentuh tetap >= 48 dp.
const TABS = [
  ['/', '🏠', 'home', 'Beranda'],
  ['/materi', '📖', 'materi', 'Materi'],
  ['/lab', '🧪', 'lab', 'Lab Grafik', true],
  ['/latihan', '✏️', 'latihan', 'Latihan'],
  ['/literasi', '🌏', 'literasi', 'Literasi'],
  ['/catatan', '📒', 'catatan', 'Catatan'],
  ['/tanya', '💬', 'tanya', 'Tanya AI', true],
  ['/pengaturan', '⚙️', 'pengaturan', 'Pengaturan', true],
];

// Layar < 900 px: menu samping menjadi laci yang muncul dari kiri (tertutup saat aplikasi dibuka).
const DRAWER_QUERY = '(max-width: 899px)';
const isDrawerLayout = () => typeof window !== 'undefined' && window.matchMedia?.(DRAWER_QUERY).matches;
let drawerOpen = false;
const drawerListeners = new Set();
export function setDrawer(open) {
  drawerOpen = open;
  if (typeof document !== 'undefined') document.documentElement.dataset.mnav = open ? 'open' : 'closed';
  drawerListeners.forEach((l) => l());
}
const useDrawer = () =>
  useSyncExternalStore(
    (cb) => {
      drawerListeners.add(cb);
      return () => drawerListeners.delete(cb);
    },
    () => drawerOpen,
    () => false,
  );

/** Tombol ☰ untuk membuka/menutup menu samping (laptop) atau laci menu (HP). */
function NavToggle() {
  const { settings } = useAppState();
  const drawer = useDrawer();
  const open = isDrawerLayout() ? drawer : settings.navOpen !== false;
  return (
    <button type="button" className="icon-btn nav-toggle" aria-expanded={open}
      aria-label={open ? NAV_TEXT.hide : NAV_TEXT.show} title={open ? NAV_TEXT.hide : NAV_TEXT.show}
      onClick={() => (isDrawerLayout() ? setDrawer(!drawer) : setSetting('navOpen', !open))}>
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
  const { role } = useSession();
  // Guru mendapat menu "Dasbor Guru" di menu samping (di HP: kartu di beranda).
  const tabs = role === 'guru' ? [['/guru', '📊', 'dasbor', 'Dasbor Guru', true], ...TABS] : TABS;
  const drawer = useDrawer();
  useEffect(() => setDrawer(false), [route]); // tutup laci setelah pindah halaman
  useEffect(() => {
    if (!drawer) return undefined;
    const onKey = (e) => e.key === 'Escape' && setDrawer(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer]);
  return (
    <>
    {drawer && <div className="nav-backdrop" aria-hidden="true" onClick={() => setDrawer(false)} />}
    <nav className="bottomnav" aria-label="Navigasi utama"
      onClick={(e) => e.target.closest?.('a') && setDrawer(false)}>
      {/* logo + nama aplikasi (hanya di menu samping) */}
      <a className="nav-brand" href="#/" aria-label="GradieKAn, ke beranda">
        <img src="/icon.svg" alt="" width="36" height="36" />
        <span>GradieKAn</span>
      </a>
      {tabs.map(([path, emoji, line, label, sideOnly]) => (
        <a key={path} href={`#${path}`} className={`${section === path ? 'active' : ''} ${sideOnly ? 'side-only' : ''}`}
          aria-current={section === path ? 'page' : undefined}>
          <span className="nav-icon nav-emoji" aria-hidden="true">
            {emoji}
          </span>
          <span className="nav-icon nav-line">
            <Illus name={line} size={28} />
          </span>
          <span>{label}</span>
        </a>
      ))}
      <InstallButton variant="nav" />
    </nav>
    </>
  );
}
