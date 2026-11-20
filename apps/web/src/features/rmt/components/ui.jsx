// Komponen dasar Jalur RMT (Tailwind). Umpan balik selalu spesifik dan ramah (CLAUDE.md §5.9).
import { useState } from 'react';
import { playCorrect, playWrong } from '../../../app/sound.js';
import Illus from '../../../components/Illus.jsx';
import { checkNumber } from '../../../math/answer.js';
import { RMT_TEXT } from '../../../content/rmt.id.js';

export function Card({ children, className = '' }) {
  return <section className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

/** @param {{ variant?: 'primary'|'ghost'|'soft', className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>} props */
export function Btn({ variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 font-bold transition disabled:cursor-not-allowed disabled:opacity-50';
  const styles = {
    primary: 'border-0 bg-blue-600 text-white shadow-md hover:bg-blue-700',
    ghost: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    soft: 'border-0 bg-blue-50 text-blue-700 hover:bg-blue-100',
  };
  return <button type="button" className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

/** @param {{ ok: boolean, children: any }} props */
export function Feedback({ ok, children }) {
  return (
    <p role={ok ? 'status' : 'alert'}
      className={`m-0 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${ok ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>
      <Illus name={ok ? 'benar' : 'awas'} size={22} className="ico shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/**
 * Pilihan ganda dengan umpan balik per pilihan.
 * @param {{ options: [string, string][], answer: string, feedback?: Record<string,string>, okText?: string, onCorrect: () => void, renderOption?: (key: string, label: string) => any, columns?: string }} props
 */
export function ChoiceList({ options, answer, feedback = {}, okText = 'Tepat!', onCorrect, renderOption, columns = 'grid-cols-1' }) {
  const [picked, setPicked] = useState(null);
  const correct = picked === answer;
  return (
    <div className="grid gap-3">
      <div className={`grid gap-3 ${columns}`}>
        {options.map(([key, label]) => {
          const on = picked === key;
          return (
            <button key={key} type="button" aria-pressed={on}
              className={`min-h-12 cursor-pointer rounded-2xl border-2 bg-white px-4 py-3 text-left text-base transition hover:border-blue-300 ${
                on ? (key === answer ? 'border-emerald-500 bg-emerald-50' : 'border-amber-400 bg-amber-50') : 'border-slate-200'
              }`}
              onClick={() => {
                setPicked(key);
                if (key === answer) {
                  playCorrect();
                  onCorrect();
                } else playWrong();
              }}>
              {renderOption ? renderOption(key, label) : label}
            </button>
          );
        })}
      </div>
      {picked && <Feedback ok={correct}>{correct ? feedback[answer] ?? okText : feedback[picked] ?? 'Belum tepat. Coba pilihan lain, ya.'}</Feedback>}
    </div>
  );
}

/**
 * Isian angka yang diperiksa secara eksak (pecahan), memakai classifyError yang sama dengan Latihan.
 * @param {{ label: any, expected: string, onCorrect: () => void, suffix?: string, okText?: (msg: string) => string }} props
 */
export function NumberField({ label, expected, onCorrect, suffix, okText }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const check = () => {
    const d = checkNumber(expected, text);
    setResult(d);
    if (d.correct) {
      playCorrect();
      onCorrect();
    } else playWrong();
  };
  return (
    <div className="grid gap-2">
      <label className="grid gap-2 font-semibold text-slate-700">
        <span>{label}</span>
        <span className="flex items-center gap-2">
          <input inputMode="text" autoComplete="off" value={text} disabled={result?.correct}
            className="min-h-12 w-full max-w-48 rounded-2xl border-2 border-slate-200 px-4 text-lg focus:border-blue-400 focus:outline-none"
            onChange={(e) => {
              setText(e.target.value);
              setResult(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && text.trim() && check()} />
          {suffix && <span className="text-slate-500">{suffix}</span>}
          {!result?.correct && (
            <Btn variant="soft" disabled={!text.trim()} onClick={check}>
              {RMT_TEXT.check}
            </Btn>
          )}
        </span>
      </label>
      {result && <Feedback ok={result.correct}>{result.correct && okText ? okText(result.message) : result.message}</Feedback>}
    </div>
  );
}
