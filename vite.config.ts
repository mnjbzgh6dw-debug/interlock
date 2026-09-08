import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  /**
   * GitHub Pages serves a project site from /<repo>/, so every asset and route
   * hangs off that prefix. BASE_URL flows into the router's basename and into
   * the QR URLs, so nothing has this path hard-coded twice.
   */
  base: '/interlock/',
  plugins: [react()],
  server: { host: true },
  build: {
    /**
     * No base64 in the bundle or in localStorage. Seeded images are committed
     * files referenced by URL, per brief 7.3: inlining the signature SVGs put
     * 145 copies of the same 700-byte data URL into persisted state.
     */
    assetsInlineLimit: 0,
  },
})
