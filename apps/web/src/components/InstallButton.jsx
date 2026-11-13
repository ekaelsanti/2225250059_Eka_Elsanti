// Tombol "Pasang Aplikasi" (PWA). Lihat src/app/install.js.
import { useState } from 'react';
import { detectPlatform, promptInstall, useInstallState } from '../app/install.js';
import { INSTALL_TEXT } from '../content/strings.id.js';
import Icon from './Icon.jsx';

/** variant 'nav': tampil sebagai item navigasi (di bawah Catatan); disembunyikan bila sudah terpasang. */
export default function InstallButton({ variant = 'button' }) {
  const { canPrompt, installed } = useInstallState();
  const [guide, setGuide] = useState(false);

  if (installed) {
    return variant === 'nav' ? null : <span className="install-done">✔ {INSTALL_TEXT.installed}</span>;
  }

  const onClick = async () => {
    if (canPrompt) {
      const outcome = await promptInstall();
      if (outcome === 'unavailable') setGuide(true);
    } else {
      setGuide(true);
    }
  };

  const steps = INSTALL_TEXT.steps[detectPlatform()];

  return (
    <>
      {variant === 'nav' ? (
        <button type="button" className="nav-install" onClick={onClick} aria-label={INSTALL_TEXT.button}>
          <span className="nav-icon nav-emoji" aria-hidden="true">
            📲
          </span>
          <span className="nav-icon nav-line">
            <Icon name="pasang" />
          </span>
          <span>{INSTALL_TEXT.navLabel}</span>
        </button>
      ) : (
        <button type="button" className="install-btn" onClick={onClick}>
          <span aria-hidden="true">⬇</span> {INSTALL_TEXT.button}
        </button>
      )}
      {guide && (
        <div className="modal-backdrop" role="presentation" onClick={() => setGuide(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="install-title" onClick={(e) => e.stopPropagation()}>
            <h2 id="install-title">📲 {INSTALL_TEXT.guideTitle}</h2>
            <p className="muted">{INSTALL_TEXT.guideIntro}</p>
            <ol className="install-steps">
              {steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="muted small">{INSTALL_TEXT.note}</p>
            <button type="button" className="btn primary" onClick={() => setGuide(false)}>
              {INSTALL_TEXT.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
