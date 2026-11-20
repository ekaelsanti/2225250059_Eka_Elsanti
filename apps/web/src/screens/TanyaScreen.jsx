// F-34 Tanya AI: obrolan dengan Gradi. Bank jawaban offline dulu, lalu Claude AI (online, opsional, on-demand).
import { useEffect, useRef, useState } from 'react';
import { answerOffline, askAI } from '../app/tanya.js';
import Gradi from '../components/Gradi.jsx';
import { Page } from '../components/Layout.jsx';
import { TANYA_TEXT as T } from '../content/strings.id.js';
import Illus from '../components/Illus.jsx';

/** @typedef {{ role: 'user'|'assistant', content: string, source?: 'bank'|'ai'|'error', to?: string, toLabel?: string, question?: string }} Msg */

export default function TanyaScreen() {
  /** @type {[Msg[], Function]} */
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: 'end', behavior: 'smooth' });
  }, [msgs, busy]);

  /** riwayat untuk AI: hanya pertanyaan & jawaban sungguhan (bukan pesan galat) */
  const history = (list) => list.filter((m) => m.source !== 'error').map(({ role, content }) => ({ role, content }));

  const callAI = async (question, base) => {
    setBusy(true);
    const res = await askAI(question, history(base));
    setBusy(false);
    setMsgs((cur) => [
      ...cur,
      res.ok
        ? { role: 'assistant', content: res.answer, source: 'ai' }
        : { role: 'assistant', content: res.error === 'offline' ? T.offline : res.error === 'server' ? T.server : res.error, source: 'error' },
    ]);
  };

  const send = (raw) => {
    const question = raw.trim();
    if (!question || busy) return;
    setText('');
    const base = msgs;
    const next = [...base, { role: 'user', content: question }];
    const hit = answerOffline(question);
    if (hit) {
      setMsgs([...next, { role: 'assistant', content: hit.answer, source: 'bank', to: hit.to, toLabel: hit.toLabel, question }]);
      return;
    }
    setMsgs(next);
    callAI(question, base);
  };

  /** "Tanya Gradi AI lebih lanjut" pada jawaban bank */
  const escalate = (i) => {
    const m = msgs[i];
    setMsgs((cur) => cur.map((x, j) => (j === i ? { ...x, escalated: true } : x)));
    callAI(m.question, msgs.slice(0, i - 1));
  };

  return (
    <Page title={T.title} subtitle={T.subtitle}
      actions={msgs.length > 0 && <button className="btn" onClick={() => setMsgs([])}>{T.clear}</button>}>
      <div className="tanya">
        <div className="tanya-intro page-banner tone-purple">
          <Gradi size={64} showName={false} />
          <p>{T.intro}</p>
        </div>

        {msgs.length === 0 && (
          <div className="tanya-suggest">
            <p className="muted">{T.suggest}</p>
            <div className="chips">
              {T.suggestions.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}

        <ol className="tanya-log" aria-live="polite">
          {msgs.map((m, i) => (
            <li key={i} className={`bubble ${m.role} ${m.source ?? ''}`}>
              {m.role === 'assistant' && m.source !== 'error' && (
                <span className="bubble-tag">{m.source === 'bank' ? T.fromBank : T.fromAI}</span>
              )}
              <p>{m.content}</p>
              {m.source === 'bank' && (
                <div className="bubble-actions">
                  {m.to && <a className="btn" href={`#${m.to}`}>{T.open} {m.toLabel}</a>}
                  {!m.escalated && <button type="button" className="btn" disabled={busy} onClick={() => escalate(i)}>{T.askAI}</button>}
                </div>
              )}
            </li>
          ))}
          {busy && <li className="bubble assistant thinking">{T.thinking}</li>}
        </ol>
        <div ref={endRef} />

        <form className="tanya-form" onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}>
          <textarea rows={2} maxLength={500} value={text} placeholder={T.placeholder} aria-label={T.placeholder}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(text);
              }
            }} />
          <button className="btn primary" disabled={!text.trim() || busy}>{T.send}</button>
        </form>
        <p className="muted tanya-privacy"><Illus name="gembok" size={18} className="ico" /> {T.privacy}</p>
      </div>
    </Page>
  );
}
