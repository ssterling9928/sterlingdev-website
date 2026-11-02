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

// --- Metrics validation ------------------------------------------------------
const MAX_BODY_BYTES = 2048
const EVENT_TYPES = ['pv', 'click'] as const

type MetricEvent = {
    t: (typeof EVENT_TYPES)[number]
    path: string
    ref: string
    id: string
    text: string
}

const str = (v: unknown, max: number) =>
    typeof v === 'string' ? v.slice(0, max) : ''

// Returns a sanitized event, or null if the payload isn't one we record.
const parseMetricEvent = (body: any): MetricEvent | null => {
    if (!body || typeof body !== 'object') return null
    if (!EVENT_TYPES.includes(body.t)) return null
    const path = str(body.path, 512)
    if (!path.startsWith('/')) return null
    const event: MetricEvent = {
        t: body.t,
        path,
        ref: str(body.ref, 512),
        id: str(body.meta?.id, 80),
        text: str(body.meta?.text, 80),
    }
    if (event.t === 'click' && !event.id) return null
    return event
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url)
        const path = url.pathname

        // --- Metrics collector ---------------------------------------------------
        // Same-origin only (metrics.js is served from this site), so no CORS needed.
        if (path === '/__collect') {
            if (request.method !== 'POST') {
                return new Response(null, {
                    status: 405,
                    headers: { Allow: 'POST' },
                })
            }

            // Skip obvious bots
            if (isBotUA(request.headers.get('user-agent'))) {
                return new Response(null, { status: 204 })
            }

            // Parse and validate payload
            let event: MetricEvent | null = null
            try {
                const raw = await request.text()
                if (raw.length <= MAX_BODY_BYTES) {
                    event = parseMetricEvent(JSON.parse(raw))
                }
            } catch {
                // fall through to 400
            }
            if (!event) {
                return new Response('bad request', { status: 400 })
            }

            try {
                env.SITE_METRICS?.writeDataPoint({
                    indexes: [event.t],
                    doubles: [1],
                    blobs: [
                        event.t,
                        event.path,
                        event.ref,
                        event.id,
                        event.text,
                    ],
                })
            } catch (err) {
                console.error('Error writing metric:', err)
            }

            return new Response(null, { status: 204 })
        }

        // --- Bot/noise short-circuit ---------------------------------------------
        if (isNoisePath(path)) {
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
