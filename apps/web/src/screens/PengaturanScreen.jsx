import { Page } from '../components/Layout.jsx';
import { APP_TEXT } from '../content/strings.id.js';
import { resetAll, setSetting, update, useAppState } from '../store/store.js';

export default function PengaturanScreen() {
  const { settings } = useAppState();
  return (
    <Page title="Pengaturan" back="/">
      <article className="card settings">
        <div className="setting">
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
          <div>
            <strong>Peringatan tanda negatif</strong>
            <p className="muted">Muncul ⚠ saat ada pengurangan bilangan negatif.</p>
          </div>
          <input type="checkbox" className="switch" checked={settings.signWarning} onChange={(e) => setSetting('signWarning', e.target.checked)} />
        </label>
        <label className="setting">
          <div>
            <strong>{settings.sound ? '🔊' : '🔇'} Efek suara</strong>
            <p className="muted">Bunyi lembut saat menjawab dan menggeser slider. Matikan untuk mode senyap.</p>
          </div>
          <input type="checkbox" className="switch" aria-label="Efek suara" checked={settings.sound}
            onChange={(e) => setSetting('sound', e.target.checked)} />
        </label>
        <label className="setting">
          <div>
            <strong>🎉 Animasi konfeti</strong>
            <p className="muted">Muncul saat menyelesaikan bab materi atau soal cerita.</p>
          </div>
          <input type="checkbox" className="switch" aria-label="Animasi konfeti" checked={settings.celebrate}
            onChange={(e) => setSetting('celebrate', e.target.checked)} />
        </label>
        <div className="setting">
          <div>
            <strong>Lihat pengenalan lagi</strong>
          </div>
          <button className="btn" onClick={() => update(() => ({ onboardingDone: false }))}>Buka</button>
        </div>
        <div className="setting">
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
