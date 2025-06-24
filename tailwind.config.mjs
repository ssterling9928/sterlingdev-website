
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}' // <-- Crucial line

  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],

        heading: ["Fira Sans Condensed", ...defaultTheme.fontFamily.sans], 
      }
    }
  },
  plugins: [],
}