# DUST Dream Sciences — Demographic & Market Dossier (Visual Site)

An interactive, single-page visual companion to the DUST Dream Sciences Demographic & Market Research Dossier (April 2026, v1.0).

## What's inside

- `index.html` — main page (nav, hero, 8 sections, footer)
- `styles.css` — dark editorial theme, "dream sciences" aesthetic
- `charts.js` — all Chart.js visualizations and dynamic data rendering
- `netlify.toml` — deployment config (security headers, no-index, asset caching)
- `robots.txt` — blocks search engine crawlers (confidential)

Everything is static — no build step, no dependencies beyond Chart.js pulled from CDN.

## Sections

1. **Opportunity & Market Sizing** — four converging markets with animated cards, a 10-year projection chart, a stacked category bar, and a TAM/SAM/SOM funnel
2. **Demographic Segments** — all 20 segments across 6 clusters, auto-rendered from data
3. **Scoring Matrix** — interactive heatmap, 20 segments × 6 criteria, color-coded by tier
4. **GTM Recommendation** — Tier 1 → 2 → 3 → Wave 3 flow plus B2B parallel track
5. **Comparable Playbooks** — Oura, WHOOP, Function, AG1, Eight Sleep, Shape, Prophetic, Waking Up, with the Calm/Headspace caveat
6. **CAC / Retention / LTV Benchmarks** — CAC-by-channel, retention curve vs. category, pricing scatter, unit economics
7. **Cohort Design** — doughnut chart of recommended 18–24 user mix, signal targets
8. **Risks, Open Questions & Caveats** — severity-coded register

## Deploying to Netlify

### Option 1: Drag-and-drop (fastest)

1. Open [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this entire folder onto the page
3. Netlify hands back a URL

### Option 2: Netlify CLI

```bash
npm install -g netlify-cli
cd "Demographic Analysis"
netlify deploy --dir=. --prod
```

### Option 3: Git-based continuous deploy

```bash
cd "Demographic Analysis"
git init
git add .
git commit -m "Initial DUST demographic dossier site"
# Create a private repo, push, then connect it in the Netlify dashboard.
```

In the Netlify dashboard, no build command is needed — publish directory is `.`.

## Local preview

Any static server works:

```bash
cd "Demographic Analysis"
python3 -m http.server 8080
# → http://localhost:8080
```

## Notes

- `robots.txt` and the `X-Robots-Tag: noindex, nofollow` header prevent the site from appearing in search results — the underlying dossier is Confidential.
- To password-protect the live site, enable Netlify's password protection (Pro plan) or add Netlify Identity / Basic Auth via edge functions.
- All data in the visualizations is sourced directly from the source dossier. To update a number, edit the corresponding dataset in `charts.js` — the charts re-render on reload.
