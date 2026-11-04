// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
    output: 'static',
    // Listen on all interfaces (0.0.0.0), not just localhost, so a reverse
    // proxy or another machine can reach the dev/preview server.
    server: {
        host: true,
    },
    vite: {
        plugins: [tailwindcss()],
        // Let the dev and preview servers answer requests for sterling-dev.com.
        // The leading dot also allows subdomains such as www.sterling-dev.com.
        server: {
            allowedHosts: ['.sterling-dev.com'],
        },
        preview: {
            allowedHosts: ['.sterling-dev.com'],
        },
    },
})
