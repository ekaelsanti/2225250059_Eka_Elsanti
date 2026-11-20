// @vitest-environment jsdom
// F-35 Jalur RMT: konten konsisten, alur fase terkunci sampai tugas selesai, placeholder Mediator AI aman.
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RMT_LESSONS, RMT_PHASES } from '../src/content/rmt.id.js';
import { AI_TUTOR, askTutor } from '../src/features/rmt/aiTutor.js';
import RmtLessonScreen from '../src/features/rmt/RmtLessonScreen.jsx';
import { equals, frac, parseFrac } from '../src/math/fraction.js';
import { getState, resetAll } from '../src/store/store.js';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.scrollTo = () => {};
const lesson = RMT_LESSONS.gradien;

describe('konten Jalur RMT', () => {
  it('setiap fase punya pertanyaan mediator', () => {
    for (const p of RMT_PHASES) expect(lesson.mediator[p.id]?.length, p.id).toBeGreaterThan(0);
  });
  it('rasio naik ÷ jalan tiap benda benar secara eksak', () => {
    for (const s of lesson.situations) expect(equals(frac(BigInt(s.rise), BigInt(s.run)), parseFrac(s.ratio)), s.id).toBe(true);
  });
  it('benda paling curam = jawaban fase Amati (bukan yang paling tinggi)', () => {
    const steep = [...lesson.situations].sort((a, b) => b.rise / b.run - a.rise / a.run)[0];
    const tallest = [...lesson.situations].sort((a, b) => b.rise - a.rise)[0];
    expect(steep.id).toBe(lesson.amati.answer);
    expect(tallest.id).not.toBe(steep.id); // pengecoh miskonsepsi "paling tinggi = paling curam"
  });
  it('jawaban fase Terapkan konsisten dengan titik A dan B', () => {
    const { a, b, dy, dx, m } = lesson.terapkan;
    expect(Number(dy)).toBe(b.y - a.y);
    expect(Number(dx)).toBe(b.x - a.x);
    expect(Number(m)).toBe((b.y - a.y) / (b.x - a.x));
  });
});

describe('placeholder Mediator AI', () => {
  it('belum tersambung: tidak memanggil jaringan', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect(AI_TUTOR.enabled).toBe(false);
    expect(await askTutor({ lessonId: 'gradien', phaseId: 'amati', question: 'kenapa?' })).toEqual({ ok: false, reason: 'not-connected' });
    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});

describe('layar Jalur RMT', () => {
  let container;
  let root;
  const $ = (sel) => container.querySelector(sel);
  const $$ = (sel) => [...container.querySelectorAll(sel)];
  const btn = (text) => $$('button').find((b) => b.textContent.includes(text));
  const click = (el) => act(() => el.dispatchEvent(new MouseEvent('click', { bubbles: true })));

  beforeEach(async () => {
    resetAll();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    await act(() => root.render(<RmtLessonScreen id="gradien" />));
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('fase terkunci sampai tugas selesai, lalu bisa lanjut', async () => {
    expect(btn('Lanjut').disabled).toBe(true);
    await click(btn('Aku siap'));
    expect(btn('Lanjut').disabled).toBe(false);
    await click(btn('Lanjut'));
    expect($('h2').textContent).toContain('Amati');
    expect(getState().rmt.gradien.phase).toBe(1);
  });

  it('Amati: memilih yang paling tinggi mendapat umpan balik spesifik', async () => {
    await click(btn('Aku siap'));
    await click(btn('Lanjut'));
    await click(btn('Perosotan'));
    expect($('[role="alert"]').textContent).toContain('Bandingkan naik dengan jalannya');
    expect(btn('Lanjut').disabled).toBe(true);
    await click(btn('Tangga rumah'));
    expect($('[role="status"]').textContent).toContain('Tepat');
    expect(btn('Lanjut').disabled).toBe(false);
  });

  it('pertanyaan Gradi dibuka satu per satu (on-demand)', async () => {
    expect($$('#mediator-title ~ ol li, section[aria-labelledby="mediator-title"] ol li').length).toBe(0);
    await click(btn('Buka pertanyaan penuntun'));
    expect(container.textContent).toContain(lesson.mediator.tujuan[0]);
  });

  it('slot Mediator AI tampil dan memberi pesan placeholder', async () => {
    await click(btn('Tanya Mediator AI'));
    const ta = $('[data-ai-slot] textarea');
    await act(() => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ta, 'Apa itu gradien?');
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      btn('Kirim').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect($('[data-ai-slot]').textContent).toContain('belum disambungkan');
  });
});
