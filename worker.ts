export interface Env {
    ASSETS: Fetcher // provided by Workers Assets
    SITE_METRICS: AnalyticsEngineDataset
}

type EventKind = 'pv' | 'click'
type CollectPayload = {
    t: EventKind // "pv" | "click"
    path: string // e.g. "/myWork"
    ts?: number // client ms epoch (optional)
    ref?: string // document.referrer (optional)
    meta?: Record<string, string> // {id:"resume-download", text:"Download résumé"}
}

const isBot = (ua: string | null) =>
    !!ua &&
    /bot|spider|crawl|preview|facebookexternalhit|discordbot|whatsapp/i.test(ua)

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url)

        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': url.origin,
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'content-type',
                },
            })
        }

        if (url.pathname === '/__collect' && request.method === 'POST') {
            const ua = request.headers.get('user-agent')
            if (isBot(ua)) return new Response('ok', { status: 204 })

            let body: CollectPayload | undefined
            try {
                body = await request.json<CollectPayload>()
            } catch {}
            if (!body || !body.t || !body.path)
                return new Response('bad request', { status: 400 })

            // Write ONE datapoint per event (well within the 25-per-invocation limit)
            env.SITE_METRICS.writeDataPoint({
                indexes: [body.t], // small-cardinality index
                doubles: [1], // count=1
                blobs: [
                    body.t, // 0 event
                    body.path, // 1 path
                    body.ref ?? '', // 2 referrer
                    body.meta?.id ?? '', // 3 element id (for clicks)
                    body.meta?.text ?? '', // 4 element text (truncated client-side)
                ],
                // (timestamp omitted = server time; fine for dashboards)
            })

            return new Response('ok', {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': url.origin,
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                },
            })
        }

        // Default: serve static assets (Astro build in /dist)
        return env.ASSETS.fetch(request)
    },
} satisfies ExportedHandler<Env>
