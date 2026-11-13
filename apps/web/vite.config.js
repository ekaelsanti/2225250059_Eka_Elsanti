import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// PWA: dapat dipasang langsung dari browser di Android, Windows, macOS, dan iOS
// (tanpa Play Store / App Store) dan berjalan offline.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'GradieKAn',
        short_name: 'GradieKAn',
        description: 'Belajar gradien, literasi matematika, dan pemodelan soal cerita untuk SMP.',
        lang: 'id',
        start_url: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#FAFAF7',
        theme_color: '#1D4ED8',
        // Ikon dibuat oleh scripts/make_icons.py (python scripts/make_icons.py)
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,woff2}'],
      },
    }),
  ],
  // host: true -> bisa dibuka lewat localhost, 127.0.0.1, dan dari HP di Wi-Fi yang sama.
  server: { host: true, port: 5173, fs: { allow: ['../..'] } },
  preview: { host: true, port: 4173 },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{js,jsx}'],
  },
});
