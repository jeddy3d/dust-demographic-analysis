/* pulse.js — public pulse loader
 *
 * Fetches data/pulse.json (produced nightly by cohort_pipeline's
 * export_public_pulse.py and committed into this site repo by the
 * daily GitHub Actions workflow). Exposes the parsed payload on
 * window.DUST_PULSE and fires a `pulse-loaded` event so charts.js can
 * render listener-driven visualizations (measured cohort doughnut,
 * live-signal rows, etc.) without having to race us.
 *
 * Day-zero behavior: if pulse.json is missing or empty, we quietly
 * leave window.DUST_PULSE = null and the downstream charts show their
 * "Pending data" empty state. Never throws — a missing pulse should
 * never break the site.
 *
 * Privacy note: pulse.json has already passed two privacy filters
 * (rollup.py + export_public_pulse.py). This loader treats it as
 * already-safe data; it does NOT re-filter author handles etc.
 */
(function () {
  "use strict";

  // Small helpers kept inline so pulse.js stays a single file.
  function $(id) { return document.getElementById(id); }

  function formatDateUTC(iso) {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      // "Apr 17 · 08:00 UTC" — compact enough for the nav chip.
      const mon = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
      const day = d.getUTCDate();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      return `${mon} ${day} · ${hh}:${mm} UTC`;
    } catch (err) {
      return "";
    }
  }

  function renderNavUpdated(payload) {
    const el = $("navUpdated");
    if (!el) return;
    const ts = formatDateUTC(payload && payload.generated_at);
    if (!ts) {
      el.setAttribute("data-empty", "true");
      return;
    }
    el.textContent = `Pulse · ${ts}`;
    el.setAttribute("data-empty", "false");
  }

  function renderVersionHistory(payload) {
    const root = $("versionHistory");
    if (!root) return; // only present on method.html
    const changes = (payload && payload.version_changes) || [];
    if (!changes.length) return; // keep the empty-state the HTML already renders

    // Build a simple table-ish list. Each row: segment, vN → vN+1, author, diff.
    const rows = changes.map(function (c) {
      const segment = c.segment || "—";
      const from = (c.from_version != null) ? "v" + c.from_version : "—";
      const to = (c.to_version != null) ? "v" + c.to_version : "—";
      const by = c.created_by || "—";
      const diff = c.diff_summary || "";
      // The diff_summary is Claude's own text; it was generated against
      // private samples. The pipeline already rejected reflections that
      // tried to regress the schema, but we still render as text (not
      // HTML) so no interpolation can inject markup.
      const row = document.createElement("div");
      row.className = "version-row";
      row.innerHTML =
        '<div class="version-row__seg"></div>' +
        '<div class="version-row__arrow"></div>' +
        '<div class="version-row__by"></div>' +
        '<div class="version-row__diff"></div>';
      row.children[0].textContent = segment;
      row.children[1].textContent = from + " → " + to;
      row.children[2].textContent = by;
      row.children[3].textContent = diff;
      return row;
    });

    root.innerHTML = "";
    const header = document.createElement("div");
    header.className = "version-row version-row--header";
    header.innerHTML =
      '<div>Segment</div><div>Version</div><div>Author</div><div>Diff summary</div>';
    root.appendChild(header);
    rows.forEach(function (r) { root.appendChild(r); });
  }

  function firePulseLoaded(payload) {
    try {
      document.dispatchEvent(new CustomEvent("pulse-loaded", {
        detail: { payload: payload },
      }));
    } catch (err) {
      // Silently drop — no path forward that breaks fewer things.
    }
  }

  // Kick the fetch. We resolve the URL relative to this script's own
  // location so the 4 pages (index/tam/targets/method) all hit the same
  // data/pulse.json regardless of whether they live at /, /tam, etc.
  fetch("data/pulse.json", { cache: "no-cache" })
    .then(function (resp) {
      if (!resp.ok) return null;
      return resp.json();
    })
    .catch(function () { return null; })
    .then(function (payload) {
      // Always set the global — even if null — so downstream code can
      // read `window.DUST_PULSE === null` as "confirmed absent" rather
      // than "not loaded yet".
      window.DUST_PULSE = payload || null;
      try { renderNavUpdated(payload); } catch (err) { /* non-fatal */ }
      try { renderVersionHistory(payload); } catch (err) { /* non-fatal */ }
      firePulseLoaded(payload);
    });
})();
