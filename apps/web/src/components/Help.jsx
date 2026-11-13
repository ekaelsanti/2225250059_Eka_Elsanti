// Bantuan opsional (F-16 Fading Hints, F-20 Micro-step, F-21 Bantuan on-demand) dan isian jawaban.
import { useEffect, useMemo, useState } from 'react';
import { playCorrect, playWrong } from '../app/sound.js';
import { checkNumber } from '../math/answer.js';

/**
 * Umpan balik benar/salah + suara lembut. Suara berbunyi sekali setiap objek `d` baru
 * (jadi `d` harus disimpan di state/memo, bukan dibuat ulang tiap render).
 * d.silent = true untuk jawaban yang ditunjukkan (bukan dijawab siswa).
 */
export function Feedback({ d }) {
  useEffect(() => {
    if (!d || d.silent) return;
    if (d.correct) playCorrect();
    else if (d.errorType !== 'PARSE_ERROR') playWrong();
  }, [d]);
  if (!d) return null;
  return (
    <p className={`fb ${d.correct ? 'ok' : 'warn'}`} role="status">
      <span aria-hidden="true">{d.correct ? '✔ ' : '⚠ '}</span>
      {d.message}
    </p>
  );
}

/** Petunjuk 3 tingkat: dibuka satu per satu, hanya jika diminta. */
export function HintBox({ hints, onLevel }) {
  const [level, setLevel] = useState(0);
  if (!hints?.length) return null;
  const open = (n) => {
    setLevel(n);
    onLevel?.(n);
  };
  if (level === 0) {
    return (
      <button type="button" className="chip-btn" onClick={() => open(1)}>
        💡 Butuh petunjuk?
      </button>
    );
  }
  return (
    <div className="hintbox">
      <p className="hint-title">
        💡 Petunjuk {level} dari {hints.length}
      </p>
      {hints.slice(0, level).map((h, i) => (
        <p key={i} className={i === level - 1 ? '' : 'muted'}>
          {h}
        </p>
      ))}
      {level < hints.length && (
        <button type="button" className="link-btn" onClick={() => open(level + 1)}>
          Petunjuk berikutnya →
        </button>
      )}
    </div>
  );
}

/** Langkah hitung pelan-pelan (dibuka atas permintaan). */
export function MicroSteps({ lines, label = '🔢 Hitung pelan-pelan', onOpen }) {
  const [open, setOpen] = useState(false);
  if (!lines?.length) return null;
  return open ? (
    <div className="micro">
      {lines.map((l, i) => (
        <div key={i} className="micro-line">
          {l}
        </div>
      ))}
    </div>
  ) : (
    <button type="button" className="chip-btn" onClick={() => {
      setOpen(true);
      onOpen?.();
    }}>
      {label}
    </button>
  );
}

/**
 * Isian angka + tombol Cek + bantuan.
 * onSolved(independent) dipanggil sekali saat benar; independent = tanpa membuka bantuan apa pun.
 */
export function AnswerInput({ label, expected, hints, micro, warning, onSolved, revealText, placeholder = 'Jawabanmu' }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [wrong, setWrong] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [usedMicro, setUsedMicro] = useState(false);
  const [solved, setSolved] = useState(false);

  // onSolved(independent, clean): clean = benar pada percobaan pertama tanpa bantuan (untuk lencana beruntun)
  const finish = (independent, clean = false) => {
    if (solved) return;
    setSolved(true);
    onSolved?.(independent, clean);
  };
  const submit = (e) => {
    e.preventDefault();
    const d = checkNumber(expected, text);
    setResult(d);
    const noHelp = hintLevel === 0 && !usedMicro;
    if (d.correct) finish(noHelp, noHelp && wrong === 0);
    else if (d.errorType !== 'PARSE_ERROR') setWrong((w) => w + 1);
  };
  const reveal = () => {
    setText(revealText ?? String(expected));
    setResult({ correct: true, errorType: null, silent: true, message: 'Ini jawabannya. Coba pahami langkahnya, lalu lanjut.' });
    finish(false);
  };

  return (
    <form className="answer" onSubmit={submit}>
      {label && <label className="answer-label">{label}</label>}
      <div className="row">
        <input value={text} onChange={(e) => setText(e.target.value)} inputMode="text" autoComplete="off"
          placeholder={placeholder} disabled={solved} aria-label={typeof label === 'string' ? label : 'Jawaban'} />
        <button type="submit" className="btn primary" disabled={solved || !text.trim()}>
          Cek
        </button>
      </div>
      {warning && !solved && <p className="sign-warning">⚠ {warning}</p>}
      <Feedback d={result} />
      {!solved && (
        <div className="helpbar">
          <HintBox hints={hints} onLevel={setHintLevel} />
          <MicroSteps lines={micro} onOpen={() => setUsedMicro(true)} />
          {(hintLevel >= (hints?.length ?? 0) || wrong >= 2) && (
            <button type="button" className="chip-btn" onClick={reveal}>
              👀 Tunjukkan jawaban
            </button>
          )}
        </div>
      )}
    </form>
  );
}

/** Pilihan ganda sederhana. */
export function ChoiceQuestion({ question, options, answer, explain, onSolved }) {
  const [picked, setPicked] = useState(null);
  const correct = picked === answer;
  const feedback = useMemo(
    () => (picked === null ? null : { correct: picked === answer, message: picked === answer ? explain ?? 'Tepat! 🎉' : 'Belum tepat. Coba pilihan lain.' }),
    [picked, answer, explain],
  );
  return (
    <div className="choice">
      <p className="answer-label">{question}</p>
      <div className="choice-grid">
        {options.map((o, i) => (
          <button key={i} type="button"
            className={`choice-btn ${picked === i ? (correct ? 'is-ok' : 'is-warn') : ''}`}
            onClick={() => {
              setPicked(i);
              if (i === answer) onSolved?.();
            }}
            disabled={correct}>
            {o}
          </button>
        ))}
      </div>
      <Feedback d={feedback} />
    </div>
  );
}
