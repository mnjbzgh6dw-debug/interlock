import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
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
