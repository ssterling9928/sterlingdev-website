if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const COLLECT_URL = '/__collect'

    function send(data: object) {
        const blob = new Blob([JSON.stringify(data)], {
            type: 'application/json',
        })
        if (navigator.sendBeacon) {
            navigator.sendBeacon(COLLECT_URL, blob)
        } else {
            fetch(COLLECT_URL, {
                method: 'POST',
                body: blob,
                keepalive: true,
                headers: { 'content-type': 'application/json' },
            }).catch(() => {})
        }
    }

    // page view
    send({
        t: 'pv',
        path: window.location.pathname + window.location.search,
        ts: Date.now(),
        ref: document.referrer || '',
    })

    // click tracking (opt-in via data-metric-id)
    document.addEventListener('click', (e) => {
        const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
            '[data-metric-id]'
        )
        if (!el) return
        const id = el.dataset.metricId || ''
        const text = (el.textContent || '').trim().slice(0, 80)
        send({
            t: 'click',
            path: window.location.pathname + window.location.search,
            ts: Date.now(),
            meta: { id, text },
        })
    })
}
// (no exports needed)
