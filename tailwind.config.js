/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand. Never used for status.
        shaft: '#0A2540',
        hoist: '#123A5E',
        signal: '#1668A8',
        slate: '#5B7186',
        rail: '#C9D6E0',
        paper: '#F5F8FB',
        // Status. Never used decoratively.
        stop: { DEFAULT: '#B02525', tint: '#FCEBEB' },
        open: { DEFAULT: '#B07208', tint: '#FAEEDA' },
        verified: { DEFAULT: '#1B6E52', tint: '#E1F5EE' },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      // Type scale from brief 4.3, named by px so code maps 1:1 to the table.
      fontSize: {
        13: ['13px', { lineHeight: '18px' }],
        15: ['15px', { lineHeight: '22px' }],
        17: ['17px', { lineHeight: '26px' }],
        20: ['20px', { lineHeight: '28px' }],
        25: ['25px', { lineHeight: '32px' }],
        31: ['31px', { lineHeight: '38px' }],
      },
      letterSpacing: {
        wordmark: '-0.015em',
      },
      borderRadius: {
        card: '8px',
        sheet: '16px',
      },
      spacing: {
        tap: '48px',
      },
      /**
       * The guided walkthrough is the only thing in this app above z-50, which
       * is where the clause sheet, the stop-use interstitial and the demo panel
       * all sit. It has to be, because it spotlights controls inside them.
       */
      zIndex: {
        tour: '60',
      },
    },
  },
  plugins: [],
}
