
(() => {
  const COLLECT_URL = "/__collect";

  function send(data) {
    try {
      const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(COLLECT_URL, blob);
      } else {
        fetch(COLLECT_URL, {
          method: "POST",
          body: blob,
          keepalive: true,
          headers: { "content-type": "application/json" }
        }).catch(() => {});
      }
    } catch {}
  }

  // OPTIONAL: comment out during local `astro dev` if you don’t want 404s
  if (!/^(www\.)?sterling-dev\.com$/i.test(location.hostname)) return;

  console.log("[metrics] script loaded");

  // page view
  send({
    t: "pv",
    path: location.pathname + location.search,
    ts: Date.now(),
    ref: document.referrer || ""
  });

  // click tracking (elements opt-in via data-metric-id)
  document.addEventListener("click", (e) => {
    const el = e.target && e.target.closest && e.target.closest("[data-metric-id]");
    if (!el) return;
    const id = el.dataset.metricId || "";
    const text = (el.textContent || "").trim().slice(0, 80);
    console.log("[metrics] click:", id, text);
    send({ t: "click", path: location.pathname + location.search, ts: Date.now(), meta: { id, text } });
  });
})();
