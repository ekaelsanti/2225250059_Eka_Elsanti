// Lapisan konfeti global (tetap tampil walau halaman berpindah). Durasi ~1,5 detik, tidak menghalangi klik.
import { useEffect, useRef, useState } from 'react';
import { onCelebrate } from '../app/celebrate.js';

const COLORS = ['#2563eb', '#ea580c', '#16a34a', '#7c3aed', '#db2777', '#0891b2', '#fbbf24'];
const DURATION = 1600;

export default function ConfettiLayer() {
  const [burst, setBurst] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => onCelebrate(() => setBurst((n) => n + 1)), []);

  useEffect(() => {
    if (!burst) return undefined;
    const canvas = canvasRef.current;
    const g = canvas?.getContext?.('2d');
    if (!g) return undefined;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    g.scale(dpr, dpr);

    // Dua semburan dari sudut bawah kiri & kanan, naik ke ± sepertiga atas layar lalu jatuh
    // (sudut & kecepatan disetel lewat simulasi; kecepatan diskalakan dengan tinggi layar).
    const scale = Math.sqrt(h / 700);
    const pieces = Array.from({ length: 110 }, (_, i) => {
      const left = i % 2 === 0;
      const angle = (left ? -78 : -102) * (Math.PI / 180) + (Math.random() - 0.5) * 0.5;
      const speed = (14 + Math.random() * 6) * scale;
      return {
        x: left ? w * 0.08 : w * 0.92,
        y: h * 0.95,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 6 + Math.random() * 6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: COLORS[i % COLORS.length],
      };
    });

    const start = performance.now();
    let prev = start;
    let frame;
    const draw = (now) => {
      const t = now - start;
      // Gerak berbasis waktu (k = 1 pada 60 fps) agar kecepatan sama di layar 60/120 Hz maupun HP lambat.
      const k = Math.min(3, (now - prev) / (1000 / 60));
      prev = now;
      g.clearRect(0, 0, w, h);
      g.globalAlpha = Math.max(0, 1 - Math.max(0, t - DURATION * 0.6) / (DURATION * 0.4));
      for (const p of pieces) {
        p.vy += 0.32 * k; // gravitasi
        p.vx *= 0.985 ** k;
        p.x += p.vx * k;
        p.y += p.vy * k;
        p.rot += p.vr * k;
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.rot);
        g.fillStyle = p.color;
        g.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        g.restore();
      }
      if (t < DURATION) frame = requestAnimationFrame(draw);
      else g.clearRect(0, 0, w, h);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [burst]);

  return <canvas ref={canvasRef} className="confetti" aria-hidden="true" />;
}
