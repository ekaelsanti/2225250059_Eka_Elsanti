// Router berbasis hash (#/materi/M4): berjalan di PWA, file statis, dan Capacitor tanpa konfigurasi server.
import { useEffect, useState } from 'react';

const current = () => window.location.hash.replace(/^#/, '') || '/';

export function useRoute() {
  const [route, setRoute] = useState(current);
  useEffect(() => {
    const onChange = () => {
      setRoute(current());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

/** @param {string} path */
export const go = (path) => {
  window.location.hash = path;
};

/**
 * match('/materi/:id', '/materi/M4') -> { id: 'M4' }
 * @param {string} pattern
 * @param {string} path
 */
export function match(pattern, path) {
  const p = pattern.split('/');
  const s = path.split('/');
  if (p.length !== s.length) return null;
  /** @type {Record<string, string>} */
  const params = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}
