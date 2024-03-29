import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
import { sync } from 'glob';
import { ViteMinifyPlugin } from 'vite-plugin-minify';

export default defineConfig({
  root: '_site',
  appType: 'mpa',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: sync(resolve(__dirname, '_site', '**/**/*.html')),
    },
    emptyOutDir: true,
  },
  preview: {
    port: 5000,
    open: true,
  },
  plugins: [
    ViteMinifyPlugin({}),
    VitePWA({
      injectRegister: null,
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
      ],
      manifest: {
        name: 'Katameros.bible',
        short_name: 'Katameros',
        description: 'Daily church readings',
        scope: '/',
        start_url: '/',
        display: 'standalone',
        theme_color: '#f8f4ee',
        background_color: '#f8f4ee',
        icons: [
          {
            src: 'pwa-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: 'pwa-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'pwa-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'mstile-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'pwa-152x152.png',
            sizes: '152x152',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '196x196',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
