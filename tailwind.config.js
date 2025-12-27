import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Black & Gold Palette
        'gold': '#B8860B',
        'gold-dark': '#C59A44',
        'bg-primary': '#000000',
        'bg-secondary': '#1A1A1A',
        'bg-secondary-alt': '#222222',
        'text-primary': '#FFFFFF',
        'text-secondary': '#CFCFCF',
        // Keep old colors for backward compatibility during transition
        'barber-gold': '#B8860B',
        'barber-olive': '#C59A44',
        'barber-dark': '#1A1A1A',
        'barber-light': '#CFCFCF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Montserrat', 'Oswald', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
})
