import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', // <-- Crucial line
    ],
    theme: {
        extend: {
            colors: {
                bg: 'var(--bg)',
                surface: 'var(--surface)',
                'surface-2': 'var(--surface-2)',
                text: 'var(--text)',
                muted: 'var(--text-muted)',
                border: 'var(--border)',
                accent: 'var(--accent)',
                'accent-hover': 'var(--accent-hover)',
                focus: 'var(--focus)',
            },
            
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                fira: ['Fira Sans Condensed', ...defaultTheme.fontFamily.sans],
                mono: ['Source Code Pro', ...defaultTheme.fontFamily.mono],
            },
        },
    },
    plugins: [],
}
