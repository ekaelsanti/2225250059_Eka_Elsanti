// Dasbor Guru: ringkasan progres belajar yang tersimpan di perangkat ini (tanpa server).
import { evaluateBadges } from '../app/badges.js';
import { go } from '../app/router.js';
import { logout } from '../app/session.js';
import { Page } from '../components/Layout.jsx';
import { BASE_PROBLEMS } from '../content/bank.js';
import { MODULES } from '../content/modules.js';
import { LOGIN_TEXT, TYPE_LABEL } from '../content/strings.id.js';
import { useAppState } from '../store/store.js';

export default function GuruScreen() {
  const s = useAppState();
  const modulesDone = MODULES.filter((m) => s.modules[m.id]?.done).length;
  const storiesDone = BASE_PROBLEMS.filter((p) => s.stories[p.id]?.done);
  const badges = evaluateBadges(s);
  const p = s.practice;

  return (
    <Page title="Dasbor Guru" subtitle="Ringkasan progres belajar di perangkat ini">
      <section className="card guru-intro">
        <p>
          👋 Selamat datang, Bapak/Ibu Guru. Data di bawah ini berasal dari <b>perangkat ini saja</b> (tersimpan offline, tanpa
          server).
        </p>
        <div className="row">
          <button className="btn primary" onClick={() => go('/')}>🎓 Lihat tampilan siswa</button>
          <button className="btn" onClick={() => { logout(); go('/'); }}>⎋ {LOGIN_TEXT.logout}</button>
        </div>
      </section>

      <div className="guru-stats">
        <div className="card guru-stat"><strong>{modulesDone}/{MODULES.length}</strong><span>Materi selesai</span></div>
        <div className="card guru-stat"><strong>{p.solved}</strong><span>Latihan benar</span></div>
        <div className="card guru-stat"><strong>{p.independent}</strong><span>Benar tanpa bantuan</span></div>
        <div className="card guru-stat"><strong>{p.bestStreak ?? 0}</strong><span>Rekor beruntun</span></div>
        <div className="card guru-stat"><strong>{storiesDone.length}/{BASE_PROBLEMS.length}</strong><span>Soal cerita selesai</span></div>
        <div className="card guru-stat"><strong>{badges.filter((b) => b.earned).length}/{badges.length}</strong><span>Lencana diraih</span></div>
      </div>

      <section className="card">
        <h2>📖 Materi</h2>
        <ul className="guru-list">
          {MODULES.map((m) => {
            const st = s.modules[m.id];
            return (
              <li key={m.id}>
                <span>{m.icon} {m.id} {m.title}</span>
                <span className={`badge ${st?.done ? 'ok' : st ? 'doing' : ''}`}>
                  {st?.done ? `✔ Selesai${st.quizCorrect != null ? ` · kuis ${st.quizCorrect}/${m.quiz.length}` : ''}` : st ? 'Sedang dipelajari' : 'Belum dibuka'}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card">
        <h2>🌏 Soal cerita</h2>
        {storiesDone.length === 0 ? (
          <p className="muted">Belum ada soal cerita yang diselesaikan.</p>
        ) : (
          <ul className="guru-list">
            {storiesDone.map((q) => (
              <li key={q.id}>
                <span>{q.type} · {q.title} <small className="muted">({TYPE_LABEL[q.type]})</small></span>
                <span className={`badge ${s.stories[q.id].assisted ? 'doing' : 'ok'}`}>
                  {s.stories[q.id].assisted ? 'Dengan bantuan' : '✔ Mandiri'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>🏅 Lencana & catatan</h2>
        <ul className="guru-list">
          {badges.map(({ badge, earned, progress }) => (
            <li key={badge.id}>
              <span>{badge.icon} {badge.title}</span>
              <span className={`badge ${earned ? 'ok' : ''}`}>{earned ? '✔ Diraih' : progress.text}</span>
            </li>
          ))}
          <li>
            <span>📒 Catatan & refleksi siswa</span>
            <span className="badge">{s.notes.length} catatan</span>
          </li>
        </ul>
      </section>
    </Page>
  );
}
