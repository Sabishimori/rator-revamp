/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /**
         * The brand accent — one colour, used everywhere something is live,
         * active, selected or focused. Change it here and it changes across
         * the whole site; nothing hardcodes the value.
         */
        rator: { accent: '#5B2BFF' },
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.035em',
      },
      maxWidth: {
        shell: '1560px',
      },
    },
  },
  plugins: [],
}
