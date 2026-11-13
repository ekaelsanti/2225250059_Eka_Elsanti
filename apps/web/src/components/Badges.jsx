// Lencanaku: rak lencana (beranda) + notifikasi "Lencana baru!" (global).
import { useEffect, useMemo, useState } from 'react';
import { earnedIds, evaluateBadges } from '../app/badges.js';
import { playSuccess } from '../app/sound.js';
import { markBadgesSeen, useAppState } from '../store/store.js';

export function BadgeShelf() {
  const state = useAppState();
  const items = useMemo(() => evaluateBadges(state), [state]);
  const count = items.filter((i) => i.earned).length;
  return (
    <section className="badges" aria-labelledby="badges-title">
      <div className="badges-head">
        <h2 id="badges-title" className="section-title">🏅 Lencanaku</h2>
        <span className="badge">{count}/{items.length} diraih</span>
      </div>
      <div className="badge-grid">
        {items.map(({ badge, earned, progress }) => (
          <article key={badge.id} className={`badge-card ${earned ? 'earned' : 'locked'}`}
            aria-label={`${badge.title}: ${earned ? 'sudah diraih' : `belum, ${progress.text}`}`}>
            <span className="badge-icon" aria-hidden="true">{badge.icon}</span>
            <strong>{badge.title}</strong>
            <span className="badge-desc">{badge.desc}</span>
            {earned ? (
              <span className="badge-status">✔ Diraih</span>
            ) : (
              <>
                <div className="stat-bar" aria-hidden="true">
                  <span style={{ width: `${Math.min(100, (progress.value / progress.target) * 100)}%` }} />
                </div>
                <span className="badge-progress">{progress.text}</span>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

/** Notifikasi sekali saat lencana baru diraih (di halaman mana pun). */
export function BadgeToast() {
  const state = useAppState();
  const [toast, setToast] = useState(null);
  const earned = earnedIds(state).join(',');

  useEffect(() => {
    const fresh = earnedIds(state).filter((id) => !(state.badgesSeen ?? []).includes(id));
    if (!fresh.length) return;
    markBadgesSeen(fresh);
    const first = evaluateBadges(state).find((b) => b.badge.id === fresh[0]).badge;
    setToast(first);
    playSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [earned]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;
  return (
    <div className="badge-toast" role="status">
      <span className="badge-icon" aria-hidden="true">{toast.icon}</span>
      <div>
        <small>Lencana baru!</small>
        <strong>{toast.title}</strong>
      </div>
      <button type="button" className="icon-btn small" aria-label="Tutup" onClick={() => setToast(null)}>✕</button>
    </div>
  );
}
