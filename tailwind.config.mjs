import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', // <-- Crucial line
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                fira: ['Fira Sans Condensed', ...defaultTheme.fontFamily.sans],
                mono: ['Source Code Pro', ...defaultTheme.fontFamily.mono],
            },
        },
    },
    plugins: [],
}
