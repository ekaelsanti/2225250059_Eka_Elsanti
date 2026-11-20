import { go } from '../app/router.js';
import { logout, useSession } from '../app/session.js';
import { Page } from '../components/Layout.jsx';
import { APP_TEXT, LOGIN_TEXT } from '../content/strings.id.js';
import { resetAll, setSetting, update, useAppState } from '../store/store.js';
import Illus from '../components/Illus.jsx';
import PageBanner from '../components/PageBanner.jsx';
import { PAGE_TEXT } from '../content/strings.id.js';

export default function PengaturanScreen() {
  const { settings } = useAppState();
  const { role } = useSession();
  return (
    <Page title="Pengaturan" back="/">
      <PageBanner tone="lavender" illus="pengaturan" title={PAGE_TEXT.pengaturan.title} text={PAGE_TEXT.pengaturan.text} />
      <article className="card settings">
        <div className="setting">
          <Illus name={'kertas'} size={40} className="setting-ico" />
          <div>
            <strong>Ukuran huruf</strong>
            <p className="muted">Perbesar teks agar lebih nyaman dibaca.</p>
          </div>
          <div className="segmented two small">
            {[['normal', 'Normal'], ['large', 'Besar']].map(([v, l]) => (
              <button key={v} className={settings.fontScale === v ? 'on' : ''} onClick={() => setSetting('fontScale', v)}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <label className="setting">
          <Illus name={'awas'} size={40} className="setting-ico" />
          <div>
            <strong>Peringatan tanda negatif</strong>
            <p className="muted">Muncul ⚠ saat ada pengurangan bilangan negatif.</p>
          </div>
          <input type="checkbox" className="switch" checked={settings.signWarning} onChange={(e) => setSetting('signWarning', e.target.checked)} />
        </label>
        <label className="setting">
          <Illus name={settings.sound ? 'suara' : 'senyap'} size={40} className="setting-ico" />
          <div>
            <strong>Efek suara</strong>
            <p className="muted">Bunyi lembut saat menjawab dan menggeser slider. Matikan untuk mode senyap.</p>
          </div>
          <input type="checkbox" className="switch" aria-label="Efek suara" checked={settings.sound}
            onChange={(e) => setSetting('sound', e.target.checked)} />
        </label>
        <label className="setting">
          <Illus name={'hore'} size={40} className="setting-ico" />
          <div>
            <strong>Animasi konfeti</strong>
            <p className="muted">Muncul saat menyelesaikan bab materi atau soal cerita.</p>
          </div>
          <input type="checkbox" className="switch" aria-label="Animasi konfeti" checked={settings.celebrate}
            onChange={(e) => setSetting('celebrate', e.target.checked)} />
        </label>
        <div className="setting">
          <Illus name={'main'} size={40} className="setting-ico" />
          <div>
            <strong>Lihat pengenalan lagi</strong>
          </div>
          <button className="btn" onClick={() => update(() => ({ onboardingDone: false }))}>Buka</button>
        </div>
        <div className="setting">
          <Illus name={role === 'guru' ? 'guru' : 'topi'} size={40} className="setting-ico" />
          <div>
            <strong>Masuk sebagai {role === 'guru' ? 'Guru' : 'Siswa'}</strong>
            <p className="muted">Keluar untuk berganti peran. Progres tetap tersimpan.</p>
          </div>
          <button className="btn" onClick={() => { logout(); go('/'); }}>⎋ {LOGIN_TEXT.logout}</button>
        </div>
        <div className="setting">
          <Illus name={'hapus'} size={40} className="setting-ico" />
          <div>
            <strong>Hapus semua progres & catatan</strong>
            <p className="muted">Data hanya tersimpan di perangkat ini.</p>
          </div>
          <button className="btn danger" onClick={() => {
            if (window.confirm('Hapus semua progres dan catatan? Ini tidak dapat dibatalkan.')) resetAll();
          }}>
            Hapus
          </button>
        </div>
      </article>
      <article className="card about">
        <strong>{APP_TEXT.appName}</strong>
        <p className="muted">{APP_TEXT.tagline}. Dapat dipasang dari browser (Tambahkan ke Layar Utama / Instal aplikasi) dan dipakai tanpa internet.</p>
      </article>
    </Page>
  );
}
