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
 * "Pending" empty state. Never throws — a missing pulse should
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

  function formatRevisionTime(iso) {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      const mon = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
      const day = d.getUTCDate();
      const year = d.getUTCFullYear();
      return `${mon} ${day}, ${year}`;
    } catch (err) {
      return "";
    }
  }

  function renderVersionHistory(payload) {
    const root = $("versionHistory");
    if (!root) return; // only present on method.html
    const changes = (payload && payload.version_changes) || [];
    if (!changes.length) return; // keep the empty-state the HTML already renders

    // Vertical revision timeline — one entry per version_change, newest first.
    // Each entry shows:
    //   · a colored author badge (seed / reflection / operator)
    //   · segment + version bump (vN → vN+1)
    //   · timestamp
    //   · full diff_summary text (Claude's own paragraph when reflection,
    //     the operator's note when operator, seed message when seed)
    //
    // Every user-derived string goes through textContent so author handles,
    // segment names, and diff text cannot inject markup.
    const sorted = changes.slice().sort(function (a, b) {
      // to_version desc, then created_at desc as a tiebreaker.
      const vDelta = (b.to_version || 0) - (a.to_version || 0);
      if (vDelta !== 0) return vDelta;
      const at = a.created_at || "";
      const bt = b.created_at || "";
      return bt.localeCompare(at);
    });

    root.innerHTML = "";
    root.classList.add("revision-timeline");

    sorted.forEach(function (c) {
      const segment = c.segment || "—";
      const from = (c.from_version != null) ? "v" + c.from_version : "—";
      const to = (c.to_version != null) ? "v" + c.to_version : "—";
      const by = c.created_by || "—";
      const when = formatRevisionTime(c.created_at);
      const diff = c.diff_summary || "";

      const entry = document.createElement("div");
      entry.className = "revision-entry";
      entry.setAttribute("data-author", by);

      entry.innerHTML =
        '<div class="revision-entry__rail">' +
          '<span class="revision-entry__dot"></span>' +
          '<span class="revision-entry__line"></span>' +
        '</div>' +
        '<div class="revision-entry__body">' +
          '<div class="revision-entry__head">' +
            '<span class="revision-entry__seg"></span>' +
            '<span class="revision-entry__bump"></span>' +
            '<span class="revision-entry__author"></span>' +
            '<span class="revision-entry__when"></span>' +
          '</div>' +
          '<div class="revision-entry__diff"></div>' +
        '</div>';

      entry.querySelector(".revision-entry__seg").textContent = segment;
      entry.querySelector(".revision-entry__bump").textContent = from + " → " + to;
      entry.querySelector(".revision-entry__author").textContent = by;
      entry.querySelector(".revision-entry__when").textContent = when;
      entry.querySelector(".revision-entry__diff").textContent = diff || "—";

      root.appendChild(entry);
    });
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
