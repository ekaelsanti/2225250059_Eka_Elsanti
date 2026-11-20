// Tombol 🔍 + panel pencarian (beranda). Panel menutupi halaman, jadi tata letak tidak berubah.
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { go } from '../app/router.js';
import { buildIndex, search } from '../app/search.js';
import { SEARCH_TEXT } from '../content/strings.id.js';
import { useAppState } from '../store/store.js';
import Illus from './Illus.jsx';

function SearchPanel({ onClose }) {
  const state = useAppState();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const index = useMemo(() => buildIndex(state), [state]);
  const results = useMemo(() => search(index, query), [index, query]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const open = (r) => {
    if (!r.to) return;
    onClose();
    go(r.to);
  };

  // Portal ke <body>: panel berada di lapisan teratas sehingga seluruh halaman (termasuk navigasi) tergelap.
  return createPortal(
    <div className="modal-backdrop search-backdrop" role="presentation" onClick={onClose}>
      <div className="search-panel" role="dialog" aria-modal="true" aria-label={SEARCH_TEXT.title} onClick={(e) => e.stopPropagation()}>
        <div className="search-bar">
          <Illus name="cari" size={22} />
          <input ref={inputRef} type="search" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={SEARCH_TEXT.placeholder} aria-label={SEARCH_TEXT.title} />
          <button type="button" className="link-btn" onClick={onClose}>{SEARCH_TEXT.close}</button>
        </div>

        {!query.trim() && (
          <div className="search-hints">
            <p className="muted small">{SEARCH_TEXT.suggest}</p>
            <div className="chips">
              {SEARCH_TEXT.suggestions.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => setQuery(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {query.trim() && results.length === 0 && <p className="empty">{SEARCH_TEXT.empty(query)}</p>}

        {results.length > 0 && (
          <ul className="search-results" aria-label={SEARCH_TEXT.results(results.length)}>
            {results.map((r, i) => (
              <li key={`${r.group}-${r.title}-${i}`}>
                {r.to ? (
                  <button type="button" className="search-item" onClick={() => open(r)}>
                    <span className="search-icon" aria-hidden="true">{r.icon}</span>
                    <span className="search-body">
                      <small>{r.group}</small>
                      <strong>{r.title}</strong>
                      <span className="muted">{r.snippet}</span>
                    </span>
                    <span className="chev" aria-hidden="true">›</span>
                  </button>
                ) : (
                  <div className="search-item static">
                    <span className="search-icon" aria-hidden="true">{r.icon}</span>
                    <span className="search-body">
                      <small>{r.group}</small>
                      <strong>{r.title}</strong>
                      <span>{r.snippet}</span>
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default function SearchButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="icon-btn search-btn" aria-label={SEARCH_TEXT.title} title={SEARCH_TEXT.title} onClick={() => setOpen(true)}>
        <Illus name="cari" size={24} />
      </button>
      {open && <SearchPanel onClose={() => setOpen(false)} />}
    </>
  );
}
