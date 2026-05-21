/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Chakra Petch', 'sans-serif'],
        secondary: ['Montserrat', 'sans-serif'],
      },
      colors: {
        theme: {
          bg: 'var(--theme-bg)',
          card: 'var(--theme-card)',
          input: 'var(--theme-input)',
          border: 'var(--theme-border)',
          border2: 'var(--theme-border2)',
          overlay: 'var(--theme-overlay)',
          overlay2: 'var(--theme-overlay2)',
          overlay3: 'var(--theme-overlay3)',
          header: 'var(--theme-header)',
          active: 'var(--theme-active)',
          activeText: 'var(--theme-active-text)',
          dot: 'var(--theme-dot)',
        },
        txt: {
          main: 'var(--txt-main)',
          sec: 'var(--txt-sec)',
          mute: 'var(--txt-mute)',
          vmute: 'var(--txt-vmute)',
          place: 'var(--txt-place)',
        },
      },
    },
  },
  plugins: [],
};
