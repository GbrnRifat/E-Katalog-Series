import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      injectRegister: 'auto',

      manifest: {
        name: 'KatalogSeriesMu',
        short_name: 'KatalogSeriesMu',
        description: 'Bingung Mau Nonton Apa, Buka KatalogSeriesMu Aja!',
        theme_color: '#f41b1bff'
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],

        additionalManifestEntries: [
          { url: '/data/series.js', revision: null }
        ],

        cleanupOutdatedCaches: true,
        clientsClaim: true
      },

      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module'
      }
    })
  ],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
