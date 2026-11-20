// Lencanaku: rak lencana (beranda) + notifikasi "Lencana baru!" (global).
import { useEffect, useMemo, useState } from 'react';
import { earnedIds, evaluateBadges } from '../app/badges.js';
import { playSuccess } from '../app/sound.js';
import { BADGE_TEXT } from '../content/strings.id.js';
import BadgeArt from './BadgeArt.jsx';
import Illus from './Illus.jsx';
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

/** Etalase lencana di Beranda: medali + cincin progres + target berikutnya (penyemangat, bukan peringkat). */
export function BadgeShowcase() {
  const state = useAppState();
  const items = useMemo(() => evaluateBadges(state), [state]);
  const count = items.filter((i) => i.earned).length;
  const ratio = (i) => i.progress.value / i.progress.target;
  const next = items.filter((i) => !i.earned).sort((a, b) => ratio(b) - ratio(a))[0];
  const message = count === items.length ? BADGE_TEXT.allDone : count === 0 ? BADGE_TEXT.start : BADGE_TEXT.keepGoing(count);
  const pctOf = (i) => Math.min(100, Math.round(ratio(i) * 100));
  // kemajuan total = rata-rata progres semua lencana (ikut bergerak di setiap langkah kecil)
  const total = Math.round(items.reduce((sum, i) => sum + pctOf(i), 0) / items.length);

  return (
    <section className="badge-showcase" aria-labelledby="bs-title">
      <div className="bs-head">
        <Illus name="piala" size={52} />
        <div className="bs-title">
          <h2 id="bs-title">{BADGE_TEXT.title}</h2>
          <p>{message}</p>
        </div>
      </div>

      <div className="bs-total">
        <div className="bs-total-top">
          <span>{BADGE_TEXT.total}</span>
          <a href="#/lencana" className="bs-count">{BADGE_TEXT.count(count, items.length)}</a>
        </div>
        <div className="bs-total-bar" role="progressbar" aria-label={BADGE_TEXT.total} aria-valuemin={0} aria-valuemax={100}
          aria-valuenow={total}>
          <span style={{ width: `${total}%` }} />
          <b>{total}%</b>
        </div>
      </div>

      <div className="medal-row">
        {items.map((item) => {
          const { badge, earned, progress } = item;
          const pct = pctOf(item);
          return (
            <a key={badge.id} href="#/lencana" className={`medal ${earned ? 'earned' : 'locked'}`} style={{ '--c': badge.color }}
              aria-label={`${badge.title}: ${earned ? 'sudah diraih' : `belum, ${progress.text}`}`}>
              <BadgeArt id={badge.id} earned={earned} />
              <strong>{badge.title}</strong>
              {earned ? (
                <small className="medal-done">{BADGE_TEXT.earned}</small>
              ) : (
                <span className="medal-bar" aria-hidden="true">
                  <span style={{ width: `${pct}%` }} />
                </span>
              )}
            </a>
          );
        })}
      </div>

      {next && (
        <a className="bs-next" href={`#${next.badge.to}`} style={{ '--c': next.badge.color }}>
          <span className="bs-next-icon" aria-hidden="true">
            <BadgeArt id={next.badge.id} earned={false} size={46} />
          </span>
          <span className="bs-next-text">
            <small>{BADGE_TEXT.next}</small>
            <strong>{next.badge.title}</strong>
            <span>{next.progress.text}</span>
            <span className="bs-bar" aria-hidden="true">
              <span style={{ width: `${pctOf(next)}%` }} />
            </span>
          </span>
          <span className="bs-go">{next.badge.cta} →</span>
        </a>
      )}
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
