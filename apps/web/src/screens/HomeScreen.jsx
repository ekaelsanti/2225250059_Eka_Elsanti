import { go } from '../app/router.js';
import { useSession } from '../app/session.js';
import { BadgeShowcase } from '../components/Badges.jsx';
import Gradi from '../components/Gradi.jsx';
import HeroGraph from '../components/HeroGraph.jsx';
import { Page } from '../components/Layout.jsx';
import SearchButton from '../components/Search.jsx';
import { MODULES } from '../content/modules.js';
import { APP_TEXT } from '../content/strings.id.js';
import { useAppState } from '../store/store.js';
import Illus from '../components/Illus.jsx';

const MENU = [
  {
    to: '/materi',
    illus: 'materi',
    icon: '📖',
    title: 'Materi',
    text: 'Belajar gradien langkah demi langkah',
    tone: 'blue',
  },
  {
    to: '/lab',
    illus: 'lab',
    icon: '🧪',
    title: 'Lab Grafik',
    text: 'Geser m dan c, lihat garisnya',
    tone: 'cyan',
  },
  {
    to: '/latihan',
    illus: 'latihan',
    icon: '✏️',
    title: 'Latihan',
    text: 'Hitung gradien dua titik',
    tone: 'green',
  },
  {
    to: '/literasi',
    illus: 'literasi',
    icon: '🌏',
    title: 'Literasi',
    text: 'Modelkan soal cerita',
    tone: 'orange',
  },
  {
    to: '/catatan',
    illus: 'catatan',
    icon: '📒',
    title: 'Catatan',
    text: 'Catatanku & poin inti',
    tone: 'pink',
  },
  {
    to: '/tanya',
    illus: 'tanya',
    icon: '💬',
    title: 'Tanya AI',
    text: 'Tanya Gradi seputar gradien',
    tone: 'purple',
  },
  {
    to: '/pengaturan',
    illus: 'pengaturan',
    icon: '⚙️',
    title: 'Pengaturan',
    text: 'Ukuran huruf & bantuan',
    tone: 'lavender',
  },
];

export default function HomeScreen() {
  const s = useAppState();
  const { role } = useSession();
  const modulesDone = MODULES.filter((m) => s.modules[m.id]?.done).length;
  const pct = Math.round((modulesDone / MODULES.length) * 100);

  return (
    <Page title={APP_TEXT.appName} subtitle={APP_TEXT.tagline} actions={<SearchButton />}>
      <div className="home-layout">
        <div className="home-top">
          <section className="hero">
            {/* Latar dekoratif saja (posisi teks & Gradi tidak berubah) */}
            <HeroGraph />
            <div className="hero-text">
              <h2>{APP_TEXT.homeGreeting}</h2>
              <p className="muted">{APP_TEXT.homeSubtitle}</p>
            </div>
            <Gradi
              size={132}
              message={
                <span aria-label={`Progres materi ${pct}%`}>
                  <b>{pct}%</b> materi
                </span>
              }
            />
          </section>

          {s.last && (
            <button className="continue-card" onClick={() => go(s.last.path)}>
              <span className="continue-icon" aria-hidden="true">
                ▶
              </span>
              <span>
                <small>Lanjutkan belajar</small>
                <strong>{s.last.label}</strong>
              </span>
            </button>
          )}
        </div>

        <aside className="home-side">
          <BadgeShowcase />
        </aside>

        <div className="home-menu">
          <h2 className="section-title">Menu</h2>
          <div className="menu-grid">
            {role === 'guru' && (
              <a href="#/guru" className="menu-card mc tone-blue">
                <strong>Dasbor Guru</strong>
                <span className="sr-only">Ringkasan progres belajar</span>
                <span className="menu-art" aria-hidden="true">
                  <Illus name="dasbor" size={56} />
                  <span className="menu-go">→</span>
                </span>
              </a>
            )}
            {MENU.map((m) => (
              <a key={m.to} href={`#${m.to}`} className={`menu-card mc tone-${m.tone}`}>
                <strong>{m.title}</strong>
                <span className="sr-only">{m.text}</span>
                <span className="menu-art" aria-hidden="true">
                  <Illus name={m.illus} size={56} />
                  <span className="menu-go">→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}
