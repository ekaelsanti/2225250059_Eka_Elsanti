// @vitest-environment jsdom
// F-34 Tanya AI: bank jawaban offline + panggilan AI (fetch di-mock, tanpa internet).
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { answerOffline } from '../src/app/tanya.js';
import TanyaScreen from '../src/screens/TanyaScreen.jsx';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('bank jawaban offline', () => {
  it.each([
    ['Apa itu gradien?', 'kemiringan'],
    ['Bagaimana menghitung gradien dari dua titik?', 'Δy = y₂ − y₁'],
    ['apa syarat dua garis tegak lurus', 'm₁ × m₂ = −1'],
    ['kenapa gradien bisa negatif?', 'turun'],
    ['garis sejajar itu gimana', 'm₁ = m₂'],
    ['gradien dari 2x + 4y - 8 = 0 gimana? bentuk umum', '−a ÷ b'],
  ])('%s', (q, expected) => {
    expect(answerOffline(q)?.answer).toContain(expected);
  });
  it('pertanyaan di luar bank tidak ditebak', () => {
    expect(answerOffline('siapa presiden pertama indonesia')).toBeNull();
  });
});

describe('layar Tanya AI', () => {
  let container;
  let root;
  const $ = (sel) => container.querySelector(sel);
  const $$ = (sel) => [...container.querySelectorAll(sel)];
  const ask = async (text) => {
    const ta = $('textarea');
    await act(() => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ta, text);
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      $('form.tanya-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
  };

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    await act(() => root.render(<TanyaScreen />));
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  });

  it('pertanyaan umum dijawab offline tanpa memanggil server', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await ask('Apa itu gradien?');
    expect($$('.bubble.user')).toHaveLength(1);
    expect($('.bubble.bank').textContent).toContain('Dari bank jawaban');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('pertanyaan khusus diteruskan ke AI tanpa data siswa', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ answer: 'Coba hitung Δy dulu, ya.', source: 'ai' }) }));
    vi.stubGlobal('fetch', fetchMock);
    await ask('Tolong cek: titik (1, 3) dan (5, 11), hasilku m = 4');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/v1/ask');
    const body = JSON.parse(init.body);
    expect(Object.keys(body).sort()).toEqual(['history', 'question']);
    expect($('.bubble.ai').textContent).toContain('Coba hitung Δy dulu');
  });

  it('server mati: pesan ramah, bukan galat', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    }));
    await ask('Tolong cek: titik (1, 3) dan (5, 11), hasilku m = 4');
    expect($('.bubble.error').textContent).toContain('belum bisa dihubungi');
  });
});
