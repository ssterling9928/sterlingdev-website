
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}' // <-- Crucial line
  ],
  theme: {
    extend: {
      // Your custom Tailwind theme extensions (colors, fonts, etc.)
    }
  },
  plugins: [],
}