import { BADGES, earnedIds } from '../app/badges.js';
import { go } from '../app/router.js';
import Gradi from '../components/Gradi.jsx';
import HeroGraph from '../components/HeroGraph.jsx';
import { Page } from '../components/Layout.jsx';
import SearchButton from '../components/Search.jsx';
import { BASE_PROBLEMS } from '../content/bank.js';
import { MODULES } from '../content/modules.js';
import { APP_TEXT, storyLevel } from '../content/strings.id.js';
import { useAppState } from '../store/store.js';

const MENU = [
  { to: '/materi', icon: '📖', title: 'Materi', text: 'Belajar gradien langkah demi langkah', tone: 'blue' },
  { to: '/latihan', icon: '✏️', title: 'Latihan', text: 'Hitung gradien dua titik', tone: 'green' },
  { to: '/literasi', icon: '🌏', title: 'Literasi', text: 'Modelkan soal cerita', tone: 'orange' },
  { to: '/catatan', icon: '📒', title: 'Catatan', text: 'Catatanku & poin inti', tone: 'purple' },
  { to: '/lab', icon: '🧪', title: 'Lab Grafik', text: 'Geser m dan c, lihat garisnya', tone: 'cyan' },
  { to: '/pengaturan', icon: '⚙️', title: 'Pengaturan', text: 'Ukuran huruf & bantuan', tone: 'gray' },
];

export default function HomeScreen() {
  const s = useAppState();
  const modulesDone = MODULES.filter((m) => s.modules[m.id]?.done).length;
  const storiesDone = BASE_PROBLEMS.filter((p) => s.stories[p.id]?.done).length;
  const pct = Math.round((modulesDone / MODULES.length) * 100);
  const level = storyLevel(storiesDone, BASE_PROBLEMS.length);
  const badgesEarned = earnedIds(s).length;

  return (
    <Page title={APP_TEXT.appName} subtitle={APP_TEXT.tagline} actions={<SearchButton />}>
      <section className="hero">
        {/* Latar dekoratif saja (posisi teks & Gradi tidak berubah) */}
        <HeroGraph />
        <div className="hero-text">
          <h2>{APP_TEXT.homeGreeting}</h2>
          <p className="muted">{APP_TEXT.homeSubtitle}</p>
        </div>
        <Gradi size={104} message={<span aria-label={`Progres materi ${pct}%`}><b>{pct}%</b> materi</span>} />
      </section>

      {s.last && (
        <button className="continue-card" onClick={() => go(s.last.path)}>
          <span className="continue-icon" aria-hidden="true">▶</span>
          <span>
            <small>Lanjutkan belajar</small>
            <strong>{s.last.label}</strong>
          </span>
        </button>
      )}

      {/* Kartu statistik: ikon · angka (ukuran sama di ketiga kartu) · label · keterangan */}
      <div className="stats">
        <a className="stat stat-blue" href="#/materi">
          <span className="stat-icon" aria-hidden="true">📚</span>
          <strong className="stat-num">
            {modulesDone}/{MODULES.length}
          </strong>
          <span className="stat-label">Materi selesai</span>
          <span className="stat-foot">
            <span className="stat-bar" role="progressbar" aria-label="Progres materi" aria-valuemin={0}
              aria-valuemax={MODULES.length} aria-valuenow={modulesDone}>
              <span style={{ width: `${pct}%` }} />
            </span>
            <span className="stat-pct">{pct}%</span>
          </span>
        </a>
        <a className="stat stat-amber" href="#/latihan">
          <span className="stat-icon" aria-hidden="true">🏆</span>
          <strong className="stat-num">{s.practice.solved}</strong>
          <span className="stat-label">Soal Benar</span>
          <span className="stat-foot">
            <span className="stat-chip">🔥 Beruntun {s.practice.streak ?? 0}</span>
          </span>
        </a>
        <a className="stat stat-green" href="#/literasi">
          <span className="stat-icon" aria-hidden="true">💡</span>
          <strong className="stat-num">
            {storiesDone}/{BASE_PROBLEMS.length}
          </strong>
          <span className="stat-label">Soal cerita</span>
          <span className="stat-foot">
            <span className={`stat-level lv-${level.key}`}>Level: {level.label}</span>
          </span>
        </a>
      </div>

      <h2 className="section-title">Menu</h2>
      <div className="menu-grid">
        {MENU.map((m) => (
          <a key={m.to} href={`#${m.to}`} className={`menu-card tone-${m.tone}`}>
            <span className="menu-icon" aria-hidden="true">
              {m.icon}
            </span>
            <strong>{m.title}</strong>
            <span>{m.text}</span>
          </a>
        ))}
        <a href="#/lencana" className="menu-card tone-gold">
          <span className="menu-icon" aria-hidden="true">
            🏅
          </span>
          <strong>Lencanaku</strong>
          <span>
            {badgesEarned}/{BADGES.length} lencana diraih
          </span>
        </a>
      </div>
    </Page>
  );
}
