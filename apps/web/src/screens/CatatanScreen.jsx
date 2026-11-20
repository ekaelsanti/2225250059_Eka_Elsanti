// Catatanku (catatan & refleksi F-17) dan Poin Inti dari materi (F-12).
import { useState } from 'react';
import Gradi from '../components/Gradi.jsx';
import { Page } from '../components/Layout.jsx';
import { MODULES } from '../content/modules.js';
import { addNote, deleteNote, useAppState } from '../store/store.js';
import Illus from '../components/Illus.jsx';
import PageBanner from '../components/PageBanner.jsx';
import { PAGE_TEXT } from '../content/strings.id.js';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export default function CatatanScreen() {
  const s = useAppState();
  const [tab, setTab] = useState('catatan');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const visited = MODULES.filter((m) => s.modules[m.id]);

  return (
    <Page title="Catatan" subtitle="Catatanku & poin inti">
      <PageBanner tone="pink" illus="catatan" title={PAGE_TEXT.catatan.title} text={PAGE_TEXT.catatan.text} />
      <div className="segmented two" role="tablist">
        <button role="tab" aria-selected={tab === 'catatan'} className={tab === 'catatan' ? 'on' : ''} onClick={() => setTab('catatan')}>
          <strong><Illus name="catatan" size={22} className="ico" /> Catatanku</strong>
        </button>
        <button role="tab" aria-selected={tab === 'poin'} className={tab === 'poin' ? 'on' : ''} onClick={() => setTab('poin')}>
          <strong><Illus name="bintang" size={22} className="ico" /> Poin Inti</strong>
        </button>
      </div>

      {tab === 'catatan' && (
        <>
          <form className="card note-form" onSubmit={(e) => {
            e.preventDefault();
            addNote({ title: title.trim() || 'Catatan', text: text.trim() });
            setTitle('');
            setText('');
          }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul (mis. Rumus gradien)" aria-label="Judul catatan" />
            <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis catatanmu dengan kata-katamu sendiri…" aria-label="Isi catatan" />
            <button className="btn primary" disabled={!text.trim()}>+ Simpan catatan</button>
          </form>

          {s.notes.length === 0 && (
            <div className="empty">
              <Gradi size={64} showName={false} />
              <p>Belum ada catatan. Refleksi dari soal cerita juga akan tersimpan di sini.</p>
            </div>
          )}
          <div className="list">
            {s.notes.map((n) => (
              <article key={n.id} className="card note">
                <header>
                  <strong>{n.title}</strong>
                  <button className="icon-btn small" aria-label="Hapus catatan" onClick={() => {
                    if (window.confirm('Hapus catatan ini?')) deleteNote(n.id);
                  }}>
                    <Illus name="hapus" size={22} />
                  </button>
                </header>
                <p>{n.text}</p>
                <small className="muted">
                  {dateFmt.format(new Date(n.createdAt))}
                  {n.source ? ` · ${n.source}` : ''}
                </small>
              </article>
            ))}
          </div>
        </>
      )}

      {tab === 'poin' && (
        <>
          {visited.length === 0 && <p className="empty">Poin inti akan muncul setelah kamu membuka materi.</p>}
          {visited.map((m) => (
            <article key={m.id} className="card">
              <h3>
                {m.icon} {m.title}
              </h3>
              {m.chunks.filter((c) => c.keyPoint).map((c) => (
                <div key={c.keyPoint} className="keypoint">
                  <Illus name="bintang" size={22} className="ico" /> <span>{c.keyPoint}</span>
                </div>
              ))}
            </article>
          ))}
        </>
      )}
    </Page>
  );
}
