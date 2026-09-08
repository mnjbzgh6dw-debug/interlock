import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  /**
   * GitHub Pages serves a project site from /<repo>/, so the built site hangs
   * every asset and route off that prefix. Dev stays at the root, so `npm run
   * dev` is still just localhost:5173.
   *
   * BASE_URL carries this into the router's basename and the QR URLs, so the
   * path is written once and both environments are correct.
   */
  base: command === 'build' ? '/interlock/' : '/',
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
}))
