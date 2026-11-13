// @vitest-environment jsdom
// Uji interaksi: alur 5 tahap soal cerita, latihan, dan catatan (dengan efek & klik sungguhan).
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App.jsx';
import { parseLinearEquation } from '../src/math/equation.js';
import { div, frac, toString } from '../src/math/fraction.js';
import { getState, recordPractice, resetAll } from '../src/store/store.js';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.scrollTo = () => {}; // tidak tersedia di jsdom
let container;
let root;

// Cari di seluruh <body>: aplikasi ada di `container`, panel pencarian dirender lewat portal ke <body>.
const $ = (sel) => document.body.querySelector(sel);
const $$ = (sel) => [...document.body.querySelectorAll(sel)];
const byText = (sel, text) => $$(sel).find((el) => el.textContent.includes(text));
const click = (el) => act(() => el.dispatchEvent(new MouseEvent('click', { bubbles: true })));
const type = (el, value) =>
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value').set;
    setter.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
const submit = (form) => act(() => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
const goTo = (hash) =>
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

beforeEach(async () => {
  resetAll();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  window.location.hash = '/';
  await act(() => root.render(<App />));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('soal cerita: siklus pemodelan 5 tahap', () => {
  it('WP-T2-internet dapat diselesaikan dari Pahami sampai Periksa', async () => {
    await goTo('/literasi/WP-T2-internet');
    const next = () => byText('.pager button', 'Lanjut');

    // 1 Pahami: kalimat informasi -> belum; kalimat tanya -> benar
    await click(byText('.sentence', 'Biaya pemasangan'));
    expect($('.fb.warn')).not.toBeNull();
    expect(next().disabled).toBe(true);
    await click(byText('.sentence', 'Berapa total biaya'));
    expect($('.fb.ok')).not.toBeNull();
    expect(next().disabled).toBe(false);
    await click(next());

    // 2 Rumuskan: variabel lalu model (dengan kesalahan khas dulu)
    await click(byText('.choice-btn', 'lama berlangganan'));
    const input = $('input[aria-label="Susun modelnya"]');
    await type(input, 'y = 250000x + 150000');
    await submit(input.closest('form'));
    expect($('.fb.warn').textContent).toContain('laju');
    await type(input, 'y = 150.000x + 250.000');
    await submit(input.closest('form'));
    expect(next().disabled).toBe(false);
    await click(next());

    // 3 Selesaikan: 6 bulan -> 150.000 x 6 + 250.000 = 1.150.000
    const ans = $('.answer input');
    await type(ans, '1150000');
    await submit(ans.closest('form'));
    expect(next().disabled).toBe(false);
    await click(next());

    // 4 Tafsirkan: tanpa satuan -> diminta satuan; dengan satuan -> benar
    const ta = $('textarea');
    await type(ta, 'totalnya 1150000');
    await submit(ta.closest('form'));
    expect($('.fb.warn').textContent).toContain('satuan');
    await type(ta, 'Total biaya 6 bulan adalah Rp1.150.000');
    await submit(ta.closest('form'));
    await click(next());

    // 5 Periksa: centang semua pemeriksaan -> Selesai
    for (const box of $$('.checklist input')) await click(box);
    const finish = byText('.pager button', 'Selesai');
    expect(finish.disabled).toBe(false);
    await click(finish);
    expect(getState().stories['WP-T2-internet']).toEqual({ done: true, assisted: false });
  });

  it('soal dua model (T9) dan kemiringan (T7) dapat dibuka dan dijawab', async () => {
    await goTo('/literasi/WP-T7-ramp');
    await click(byText('.sentence', 'Berapa kemiringan'));
    await click(byText('.pager button', 'Lanjut'));
    const inp = $('.answer input');
    await type(inp, '50/600');
    await submit(inp.closest('form'));
    expect($('.fb.ok').textContent).toContain('disederhanakan');

    await goTo('/literasi/WP-T9-ojek');
    expect($('.stepper')).not.toBeNull();
  });
});

describe('lencana', () => {
  it('beranda punya kartu menu Lencanaku yang membuka halaman lencana', async () => {
    const card = byText('.menu-card', 'Lencanaku');
    expect(card.textContent).toContain('0/4 lencana diraih');
    expect($('.badge-card')).toBeNull(); // rak lencana tidak lagi di beranda
    expect(card.getAttribute('href')).toBe('#/lencana');
  });

  it('halaman lencana menampilkan 4 lencana terkunci beserta progres', async () => {
    await goTo('/lencana');
    expect($$('.badge-card').length).toBe(4);
    expect($$('.badge-card.locked').length).toBe(4);
    expect(byText('.badge-card', 'Penjelajah Garis').textContent).toContain('0/7 materi');
  });

  it('Ilmuwan Grafik diraih setelah mencoba m positif, negatif, dan nol', async () => {
    await goTo('/lab');
    const slider = $('input[aria-label="Gradien m"]');
    for (const v of ['2', '-1', '0']) {
      await act(() => {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(slider, v);
        slider.dispatchEvent(new Event('input', { bubbles: true }));
      });
    }
    expect(getState().lab).toEqual({ pos: true, neg: true, zero: true });
    expect(getState().badgesSeen).toContain('ilmuwan-grafik');
    expect($('.badge-toast').textContent).toContain('Ilmuwan Grafik');
    await goTo('/lencana');
    expect(byText('.badge-card', 'Ilmuwan Grafik').className).toContain('earned');
  });

  it('Penembak Jitu: beruntun 5 tanpa salah; satu kesalahan mengulang dari 0', async () => {
    for (let i = 0; i < 4; i++) recordPractice(1, true, true);
    recordPractice(1, true, false);
    expect(getState().practice).toMatchObject({ streak: 0, bestStreak: 4 });
    for (let i = 0; i < 5; i++) recordPractice(1, true, true);
    expect(getState().practice).toMatchObject({ streak: 5, bestStreak: 5 });
    await goTo('/lencana');
    expect(byText('.badge-card', 'Penembak Jitu').className).toContain('earned');
  });
});

describe('pencarian di beranda', () => {
  it('tombol 🔍 membuka panel, menampilkan saran, mencari, dan membuka hasil', async () => {
    await click($('.search-btn'));
    expect($('[role="dialog"]')).not.toBeNull();
    expect(byText('.search-hints .chip', 'sejajar')).toBeTruthy();

    const input = $('.search-bar input');
    await type(input, 'SEJAJAR');
    const titles = $$('.search-item strong').map((s) => s.textContent);
    expect(titles[0]).toContain('Sejajar'); // judul yang cocok di urutan atas
    expect(titles).toContain('M6 Sejajar & Tegak Lurus');

    await type(input, 'ojek');
    await click(byText('.search-item', 'Memilih Aplikasi Ojek'));
    expect(window.location.hash).toBe('#/literasi/WP-T9-ojek');
    expect($('[role="dialog"]')).toBeNull();
  });

  it('istilah kamus tampil dengan artinya; kata tak dikenal memberi pesan ramah', async () => {
    await click($('.search-btn'));
    const input = $('.search-bar input');
    await type(input, 'biaya tetap');
    expect(byText('.search-item.static', 'biaya tetap').textContent).toContain('berapa pun banyaknya barang');
    await type(input, 'zzzz');
    expect($('.empty').textContent).toContain('Tidak ada hasil');
  });
});

describe('latihan: jenis soal tanpa grafik', () => {
  const answer = async (value) => {
    const inp = $('.answer input');
    await type(inp, value);
    await submit(inp.closest('form'));
  };

  it('dua titik saja: tidak ada grafik saat mengerjakan, grafik opsional setelah selesai', async () => {
    await goTo('/latihan');
    await click(byText('.kind-chips .chip', 'Dua titik saja'));
    expect($('.plane')).toBeNull();
    const [, x1, y1, x2, y2] = $('.problem').textContent.match(/A\((-?\d+), (-?\d+)\).*B\((-?\d+), (-?\d+)\)/).map(Number);
    await answer(String(y2 - y1));
    await answer(String(x2 - x1));
    await answer(`${y2 - y1}/${x2 - x1}`);
    expect($('.success')).not.toBeNull();
    expect($('.plane')).toBeNull();
    await click(byText('.success .chip-btn', 'Lihat di grafik'));
    expect($('.plane')).not.toBeNull();
  });

  it('dari persamaan: jawab gradien dari teks persamaan (semua tingkat)', async () => {
    await goTo('/latihan');
    await click(byText('.kind-chips .chip', 'Dari persamaan'));
    for (const lv of ['Mudah', 'Sedang', 'Pecahan', 'Tantangan']) {
      await click(byText('.segmented button', lv));
      const text = $('.formula').textContent;
      const { m } = parseLinearEquation(text);
      await answer(toString(m));
      expect($('.success').textContent, text).toContain('Gradien garis');
    }
  });

  it('sejajar & tegak lurus: dua langkah m1 lalu m2', async () => {
    await goTo('/latihan');
    await click(byText('.kind-chips .chip', 'Sejajar & tegak lurus'));
    const problemText = $$('.problem').map((p) => p.textContent).join(' ');
    let m1;
    const pts = problemText.match(/A\((-?\d+), (-?\d+)\).*B\((-?\d+), (-?\d+)\)/);
    if (pts) {
      const [, x1, y1, x2, y2] = pts.map(Number);
      m1 = frac(BigInt(y2 - y1), BigInt(x2 - x1));
    } else {
      m1 = parseLinearEquation($('.formula').textContent).m;
    }
    const m2 = problemText.includes('tegak lurus') ? div(frac(-1n), m1) : m1;
    await answer(toString(m1));
    expect($('.done-step').textContent).toContain('m₁');
    await answer(toString(m2));
    expect($('.success').textContent).toContain('m₂');
  });
});

describe('menu samping buka/tutup', () => {
  it('tombol ☰ menyembunyikan lalu menampilkan menu samping, dan pilihan diingat', async () => {
    const toggle = () => $('.nav-toggle');
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    await click(toggle());
    expect(getState().settings.navOpen).toBe(false);
    expect(document.documentElement.dataset.nav).toBe('closed');
    expect(toggle().getAttribute('aria-label')).toBe('Tampilkan menu samping');
    await click(toggle());
    expect(getState().settings.navOpen).toBe(true);
    expect(document.documentElement.dataset.nav).toBe('open');
  });
});

describe('navigasi', () => {
  it('Lab Grafik & Pengaturan ada di navigasi samping', async () => {
    const side = $$('.bottomnav a.side-only').map((a) => a.textContent);
    expect(side).toEqual(['🧪Lab Grafik', '⚙️Pengaturan']);
    await goTo('/lab');
    expect(byText('.bottomnav a', 'Lab Grafik').className).toContain('active');
  });
});

describe('pengaturan suara & konfeti', () => {
  it('suara dan konfeti dapat dimatikan', async () => {
    await goTo('/pengaturan');
    expect(getState().settings.sound).toBe(true);
    await click($('input[aria-label="Efek suara"]'));
    await click($('input[aria-label="Animasi konfeti"]'));
    expect(getState().settings.sound).toBe(false);
    expect(getState().settings.celebrate).toBe(false);
    expect(byText('strong', 'Efek suara').textContent).toContain('🔇');
  });
});

describe('tombol pasang aplikasi', () => {
  it('tanpa dukungan prompt browser, tombol membuka panduan pemasangan', async () => {
    const btn = $('.nav-install');
    expect(btn).toBeTruthy();
    await click(btn);
    expect($('[role="dialog"]').textContent).toContain('tanpa Play Store');
    await click(byText('.modal button', 'Mengerti'));
    expect($('[role="dialog"]')).toBeNull();
  });
});

describe('latihan & catatan', () => {
  it('latihan: langkah Δy menerima jawaban dan menampilkan langkah berikutnya', async () => {
    await goTo('/latihan');
    const text = $('.problem').textContent;
    const [, x1, y1, x2, y2] = text.match(/A\((-?\d+), (-?\d+)\).*B\((-?\d+), (-?\d+)\)/).map(Number);
    let inp = $('.answer input');
    await type(inp, String(y2 - y1));
    await submit(inp.closest('form'));
    expect($('.done-step')).not.toBeNull();
    inp = $('.answer input');
    await type(inp, String(x2 - x1));
    await submit(inp.closest('form'));
    inp = $('.answer input');
    await type(inp, `${y2 - y1}/${x2 - x1}`);
    await submit(inp.closest('form'));
    expect($('.success')).not.toBeNull();
    await click(byText('.success button', 'Soal berikutnya'));
    expect(getState().practice.solved).toBe(1);
  });

  it('catatan dapat ditambah', async () => {
    await goTo('/catatan');
    await type($('input[aria-label="Judul catatan"]'), 'Rumus');
    await type($('textarea[aria-label="Isi catatan"]'), 'm = Δy / Δx');
    await submit($('.note-form'));
    expect(getState().notes[0].title).toBe('Rumus');
    expect(byText('.note', 'Δy')).toBeTruthy();
  });

  it('materi: maju sampai ringkasan lalu selesai', async () => {
    await goTo('/materi/M1');
    for (let i = 0; i < 3; i++) await click(byText('.pager button', 'Lanjut'));
    expect(byText('h2', 'Poin inti')).toBeTruthy();
    await click(byText('.pager button', 'Selesai'));
    expect(getState().modules.M1.done).toBe(true);
  });
});
