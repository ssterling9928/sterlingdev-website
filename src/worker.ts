export interface Env {
    ASSETS?: Fetcher // Provided automatically by Workers Assets
    SITE_METRICS?: AnalyticsEngineDataset // Declared in wrangler.jsonc
}

// Simple bot UA check (optional)
const isBotUA = (ua: string | null) =>
    !!ua &&
    /bot|spider|crawl|preview|facebookexternalhit|discordbot|whatsapp|curl|wget/i.test(
        ua
    )

// Block obvious WP/Joomla/etc probes
const isNoisePath = (p: string) => {
    p = p.toLowerCase()
    return (
        p.includes('/wp-') ||
        p.endsWith('/wlwmanifest.xml') ||
        p.includes('xmlrpc.php') ||
        p.includes('/.env') ||
        p.includes('/vendor/') ||
        p.includes('/admin/') ||
        p.includes('/phpunit') ||
        p.includes('/cgi-bin/')
    )
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url)
        const path = url.pathname

        // Basic CORS / preflight support for the collector
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': url.origin,
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'content-type',
                    'Access-Control-Max-Age': '86400',
                },
            })
        }

        // --- Metrics collector ---------------------------------------------------
        if (path === '/__collect' && request.method === 'POST') {
            // Skip obvious bots
            const ua = request.headers.get('user-agent')
            if (isBotUA(ua)) {
                console.log('Metrics skipped for bot UA:', ua)
                return new Response(null, {
                    status: 204,
                    headers: { 'Access-Control-Allow-Origin': url.origin },
                })
            }

            // Parse payload
            let body: any
            try {
                body = await request.json()
            } catch (err) {
                console.error('Error parsing JSON:', err)
                return new Response('bad request', {
                    status: 400,
                    headers: { 'Access-Control-Allow-Origin': url.origin },
                })
            }

            // Write one datapoint; guard if binding missing
            try {
                env.SITE_METRICS?.writeDataPoint?.({
                    indexes: [body?.t ?? 'unknown'],
                    doubles: [1],
                    blobs: [
                        body?.t ?? '',
                        body?.path ?? '',
                        body?.ref ?? '',
                        body?.meta?.id ?? '',
                        body?.meta?.text ?? '',
                    ],
                })
                console.log('Metric recorded:', body)
            } catch (err) {
                console.error('Error writing metric:', err)
            }

            return new Response(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': url.origin,
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                },
            })
        }

        // --- Bot/noise short-circuit ---------------------------------------------
        if (isNoisePath(path)) {
            console.log('Blocked bot/noise path:', path)
            return new Response('Not found', { status: 404 })
        }

        // --- Static asset serving ------------------------------------------------
        try {
            if (env.ASSETS && 'fetch' in env.ASSETS) {
                return await env.ASSETS.fetch(request)
            } else {
                console.warn('ASSETS binding missing')
            }
        } catch (err) {
            console.error('Error serving asset:', err)
        }

        return new Response('Not found', { status: 404 })
    },
} satisfies ExportedHandler<Env>
