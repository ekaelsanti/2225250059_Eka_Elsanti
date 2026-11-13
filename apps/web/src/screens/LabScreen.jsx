// F-07 Slider m real-time (IL04) + F-14 Lab Grafik.
import { useState } from 'react';
import { playTick } from '../app/sound.js';
import { markLab } from '../store/store.js';
import CartesianPlane from '../components/CartesianPlane.jsx';
import { Page } from '../components/Layout.jsx';

const fmt = (v) => v.toLocaleString('id-ID', { maximumFractionDigits: 2 });

export default function LabScreen() {
  const [m, setM] = useState(1);
  const [c, setC] = useState(0);
  const direction = m > 0 ? 'Naik dari kiri ke kanan ↗' : m < 0 ? 'Turun dari kiri ke kanan ↘' : 'Datar →';
  // y = x (bukan 1x), y = −x, y = 3 (saat m = 0)
  const mText = m === 1 ? '' : m === -1 ? '−' : m < 0 ? `−${fmt(-m)}` : fmt(m);
  const cText = m === 0 ? fmt(c) : c === 0 ? '' : c > 0 ? ` + ${fmt(c)}` : ` − ${fmt(-c)}`;

  return (
    <Page title="Lab Grafik" subtitle="Geser m dan c, lihat garisnya" back="/">
      <article className="card">
        <p className="equation">
          y = {m !== 0 && (<><b className="c-slope">{mText}</b>x</>)}<b className="c-intercept">{cText}</b>
        </p>
        <p className={`direction ${m > 0 ? 'up' : m < 0 ? 'down' : 'flat'}`}>{direction}</p>
        <CartesianPlane integerGrid lines={[{ m, c, color: 'slope' }]}
          points={[{ x: 0, y: c, color: 'intercept', label: `c = ${fmt(c)}`, labelPos: 'left' }]}
          segments={m !== 0 ? [
            { x1: 0, y1: c, x2: 1, y2: c, color: 'run', label: '1' },
            { x1: 1, y1: c, x2: 1, y2: c + m, color: 'rise', label: fmt(m) },
          ] : []} />
        <label className="slider">
          <span>Gradien <b className="c-slope">m = {fmt(m)}</b></span>
          <input type="range" min={-5} max={5} step={0.5} value={m} onChange={(e) => {
            const v = Number(e.target.value);
            setM(v);
            playTick();
            markLab(v > 0 ? 'pos' : v < 0 ? 'neg' : 'zero'); // lencana Ilmuwan Grafik
          }} aria-label="Gradien m" />
        </label>
        <label className="slider">
          <span>Konstanta <b className="c-intercept">c = {fmt(c)}</b></span>
          <input type="range" min={-5} max={5} step={1} value={c} onChange={(e) => {
            setC(Number(e.target.value));
            playTick();
          }} aria-label="Konstanta c" />
        </label>
        <p className="muted">Perhatikan: setiap jalan 1 ke kanan, garis naik (atau turun) sebesar m.</p>
      </article>
    </Page>
  );
}
