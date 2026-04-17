/* ============================================================
   DUST Dream Sciences — Charts & Interactive Data
   Palette mirrors CSS custom properties in styles.css
   (--viz-1 through --viz-6, --fg-*, --border-*).
   ============================================================ */

// ----- SHARED CHART.JS DEFAULTS -----
Chart.defaults.color = '#b8b5ad';                              // --fg-secondary
Chart.defaults.font.family = "'Instrument Sans', -apple-system, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.borderColor = 'rgba(244, 242, 237, 0.08)';      // --border-default
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.boxWidth = 8;
Chart.defaults.plugins.legend.labels.boxHeight = 8;
Chart.defaults.plugins.legend.labels.padding = 16;
Chart.defaults.plugins.legend.labels.font = {
  family: "'Ubuntu Sans Mono', ui-monospace, monospace",
  size: 11,
};
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10, 10, 10, 0.96)';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(244, 242, 237, 0.16)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.titleColor = '#f4f2ed';         // --fg-primary
Chart.defaults.plugins.tooltip.bodyColor = '#b8b5ad';          // --fg-secondary
Chart.defaults.plugins.tooltip.titleFont = {
  family: "'Ubuntu Sans Mono', ui-monospace, monospace",
  size: 11,
  weight: '600',
};
Chart.defaults.plugins.tooltip.bodyFont = {
  family: "'Instrument Sans', -apple-system, sans-serif",
  size: 12,
};
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.boxPadding = 6;
Chart.defaults.plugins.tooltip.cornerRadius = 6;

// Restrained editorial viz palette — mirrors --viz-1..6 in styles.css
const COLORS = {
  parchment: '#e8d9b8',  // --viz-1  (signal / primary)
  blue:      '#a0b5d6',  // --viz-2
  mauve:     '#c8a2b8',  // --viz-3
  sage:      '#9cbab0',  // --viz-4
  terra:     '#d4a88c',  // --viz-5
  warm:      '#8a8680',  // --viz-6
  muted:     '#78756d',  // --fg-muted
};
const AXIS_TITLE = '#78756d';                // --fg-muted
const GRID = 'rgba(244, 242, 237, 0.05)';    // softened border-default
const GRID_MINOR = 'rgba(244, 242, 237, 0.03)';

const ALPHA = (hex, a) => {
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
};

// ============================================================
// 1. MARKET GROWTH — line chart
// ============================================================
(function(){
  const ctx = document.getElementById('marketGrowthChart');
  if (!ctx) return;

  const grad = (c) => {
    const g = ctx.getContext('2d').createLinearGradient(0, 0, 0, 360);
    g.addColorStop(0, ALPHA(c, 0.35));
    g.addColorStop(1, ALPHA(c, 0.0));
    return g;
  };

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2024', '2026', '2028', '2030', '2032', '2034'],
      datasets: [
        {
          label: 'Sleep Tech',
          data: [24.9, 35, 50, 71, 98, 134.7],
          borderColor: COLORS.parchment,
          backgroundColor: grad(COLORS.parchment),
          tension: 0.4, fill: true, borderWidth: 2.5,
          pointBackgroundColor: COLORS.parchment, pointRadius: 3, pointHoverRadius: 6,
        },
        {
          label: 'Biohacking & Longevity',
          data: [24.8, 34, 48, 69, 98, 140],
          borderColor: COLORS.terra,
          backgroundColor: grad(COLORS.terra),
          tension: 0.4, fill: true, borderWidth: 2.5,
          pointBackgroundColor: COLORS.terra, pointRadius: 3, pointHoverRadius: 6,
        },
        {
          label: 'Mental Health Apps',
          data: [8.9, 12.1, 16.4, 22.3, 30.3, 41.2],
          borderColor: COLORS.mauve,
          backgroundColor: grad(COLORS.mauve),
          tension: 0.4, fill: true, borderWidth: 2.5,
          pointBackgroundColor: COLORS.mauve, pointRadius: 3, pointHoverRadius: 6,
        },
        {
          label: 'Lucid Dream Devices',
          data: [0.113, 0.128, 0.145, 0.162, 0.180, 0.196],
          borderColor: COLORS.sage,
          backgroundColor: grad(COLORS.sage),
          tension: 0.4, fill: true, borderWidth: 2.5,
          pointBackgroundColor: COLORS.sage, pointRadius: 3, pointHoverRadius: 6,
          yAxisID: 'y2',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', align: 'end' },
        tooltip: {
          callbacks: {
            label: (c) => {
              const v = c.parsed.y;
              if (c.dataset.label.includes('Lucid'))
                return `${c.dataset.label}: $${(v*1000).toFixed(0)}M`;
              return `${c.dataset.label}: $${v.toFixed(1)}B`;
            }
          }
        }
      },
      scales: {
        y: {
          position: 'left',
          ticks: { callback: (v) => '$' + v + 'B' },
          grid: { color: GRID },
          title: { display: true, text: 'USD (Billions)', color: AXIS_TITLE }
        },
        y2: {
          position: 'right',
          ticks: { callback: (v) => '$' + (v*1000).toFixed(0) + 'M' },
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Lucid devices (Millions)', color: AXIS_TITLE }
        },
        x: { grid: { color: GRID_MINOR } }
      }
    }
  });
})();

// ============================================================
// 2. FRACTURED MARKET — horizontal stacked bar
// ============================================================
(function(){
  const ctx = document.getElementById('fracturedChart');
  if (!ctx) return;

  const categories = [
    { name: 'Mental wellness economy', tam: 200, src: 'GWI' },
    { name: 'Sleep aids (pharma + supp.)', tam: 85, src: 'Precedence' },
    { name: 'Adjacencies (pregnancy, grief, psychedelic)', tam: 45, src: 'Multiple' },
    { name: 'Sleep tech (devices + software)', tam: 25, src: 'Precedence' },
    { name: 'Biohacking & longevity', tam: 25, src: 'Precedence' },
    { name: 'Wearable sleep trackers', tam: 15, src: 'Market.US' },
    { name: 'Wellness apps (broader)', tam: 11, src: 'Precedence' },
    { name: 'Digital therapeutics', tam: 8, src: 'Grand View' },
    { name: 'Mental health apps', tam: 8, src: 'Precedence' },
    { name: 'Insomnia treatment', tam: 4, src: 'Grand View' },
    { name: 'Smart mattresses', tam: 3, src: 'Grand View' },
    { name: 'Mindfulness & meditation apps', tam: 1.5, src: 'Grand View' },
  ];

  // Soft gradient across the restrained palette — fades to muted for the long tail
  const palette = [
    COLORS.parchment, COLORS.blue, COLORS.sage, COLORS.terra,
    COLORS.mauve, COLORS.warm,
    ALPHA(COLORS.parchment, 0.55),
    ALPHA(COLORS.blue, 0.55),
    ALPHA(COLORS.sage, 0.55),
    ALPHA(COLORS.terra, 0.55),
    ALPHA(COLORS.mauve, 0.55),
    ALPHA(COLORS.warm, 0.55),
  ];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categories.map(c => c.name),
      datasets: [{
        label: '2024 TAM (USD Billions)',
        data: categories.map(c => c.tam),
        backgroundColor: palette,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (c) => `$${c.parsed.x}B · source: ${categories[c.dataIndex].src}`
          }
        }
      },
      scales: {
        x: {
          ticks: { callback: (v) => '$' + v + 'B' },
          grid: { color: GRID }
        },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });
})();

// ============================================================
// 3. SEGMENTS GRID — rendered from data
// ============================================================
(function(){
  // Cluster colors map to the design-system viz palette
  const C_CLINICAL = COLORS.mauve;      // A — clinical / acute suffering
  const C_LIFE     = COLORS.terra;      // B — life-stage / hormonal
  const C_PERF     = COLORS.parchment;  // C — performance / longevity
  const C_CONSC    = COLORS.blue;       // D — consciousness / creative
  const C_CULTURE  = COLORS.sage;       // E — cultural / community
  const C_B2B      = COLORS.warm;       // F — B2B channel

  const segments = [
    { name: 'Nightmare & PTSD sufferers', cluster: 'A', clusterColor: C_CLINICAL, pop: '~9M US', wedge: '40% of PTSD patients report nightmares as most bothersome symptom', spend: '$2.5–5K/yr' },
    { name: 'Insomniacs (non-nightmare)', cluster: 'A', clusterColor: C_CLINICAL, pop: '~39M US', wedge: 'Massive underserved market, high churn in current solutions', spend: '$1.5–4K/yr' },
    { name: 'Long COVID / chronic illness', cluster: 'A', clusterColor: C_CLINICAL, pop: '~15M US', wedge: 'Sleep is non-restorative even at adequate hours — dream-based recovery signal', spend: '$3–8K/yr' },
    { name: 'Grief & bereavement', cluster: 'A', clusterColor: C_CLINICAL, pop: '~7M US', wedge: '53% report deceased family members visiting in dreams', spend: '$2–5K/yr' },

    { name: 'Pregnant & new mothers', cluster: 'B', clusterColor: C_LIFE, pop: '3.6M / yr US', wedge: '80% report vivid or disturbing dreams; highest viral coefficient in survey', spend: '$1.5–3.5K/yr' },
    { name: 'Perimenopausal women', cluster: 'B', clusterColor: C_LIFE, pop: '~25M US', wedge: '40–69% report sleep disturbance; HRT gaps create non-pharma opening', spend: '$1.5–5K/yr' },
    { name: 'Caregivers (elder / special-needs)', cluster: 'B', clusterColor: C_LIFE, pop: '~42M US', wedge: '76% report poor sleep; 94% of dementia caregivers sleep-deprived', spend: '$500–1.5K/yr' },

    { name: 'Biohackers / sleep optimizers', cluster: 'C', clusterColor: C_PERF, pop: '500K–1.5M US', wedge: 'Views dreams as last unoptimized frontier; high partnership readiness', spend: '$2.5–8K/yr' },
    { name: 'Tech execs / high performers', cluster: 'C', clusterColor: C_PERF, pop: '500K–1M', wedge: 'Sleep is new C-suite status symbol (Fortune 2025)', spend: '$5–20K+/yr' },
    { name: 'Aging adults (50–70)', cluster: 'C', clusterColor: C_PERF, pop: '~55M US', wedge: 'REM declines ~0.6%/decade; deep-sleep loss dramatic by 70', spend: '$1–3K/yr' },
    { name: 'Couples / relationship-focused', cluster: 'C', clusterColor: C_PERF, pop: '~65M married US', wedge: 'Dream sharing increases marital intimacy and empathy', spend: '$500–2K/yr' },

    { name: 'Lucid dreaming enthusiasts', cluster: 'D', clusterColor: C_CONSC, pop: '7–10M US active', wedge: 'Already believes the premise; cheapest acquisition cohort in survey', spend: '$500–2K/yr' },
    { name: 'Creative professionals', cluster: 'D', clusterColor: C_CONSC, pop: '~4.7M US', wedge: 'Dreams mythologized from Dalí to McCartney — sketchbook for subconscious', spend: '$500–2K/yr' },
    { name: 'Consciousness / psychedelic-curious', cluster: 'D', clusterColor: C_CONSC, pop: '10–15M US', wedge: 'Lucid dreaming often called "the natural psychedelic"', spend: '$1–5K/yr' },
    { name: 'Spiritual / yoga community', cluster: 'D', clusterColor: C_CONSC, pop: '~35M US', wedge: 'Yoga Nidra & Tibetan dream yoga are explicit dream traditions', spend: '$1.5–4K/yr' },

    { name: 'Shift workers / first responders', cluster: 'E', clusterColor: C_CULTURE, pop: '~15M US', wedge: 'B2B opportunity with hospital systems, fire depts, military units', spend: 'B2B' },
    { name: 'Gen Z & college students', cluster: 'E', clusterColor: C_CULTURE, pop: '~5M US students', wedge: '93% stay up late for social media — "TikTok tired" cohort', spend: '$200–800/yr' },
    { name: 'LGBTQ+ wellness', cluster: 'E', clusterColor: C_CULTURE, pop: '~20M US', wedge: 'Spends ~2× on mental health/wellness; community-led messaging required', spend: '$2–5K/yr' },
    { name: 'Religious / cultural (dream traditions)', cluster: 'E', clusterColor: C_CULTURE, pop: '~10M US subset', wedge: 'Muslim istikhara, Indigenous, Jewish & Catholic mystical practitioners', spend: 'Partnership' },

    { name: 'Therapists & mental health pros', cluster: 'F', clusterColor: C_B2B, pop: '~1.3M US', wedge: 'B2B: CEU/training, credibility pipeline, trauma-informed dream therapy', spend: 'B2B channel' },
  ];

  const grid = document.getElementById('segmentGrid');
  if (!grid) return;

  segments.forEach(s => {
    const el = document.createElement('div');
    el.className = 'segment';
    el.style.setProperty('--seg-color', s.clusterColor);
    el.innerHTML = `
      <div class="segment-header">
        <div class="segment-name">${s.name}</div>
        <div class="segment-pop">${s.pop}</div>
      </div>
      <div class="segment-wedge">${s.wedge}</div>
      <div class="segment-meta">
        <span class="seg-tag cluster">Cluster ${s.cluster}</span>
        <span class="seg-tag spend">${s.spend}</span>
      </div>
    `;
    grid.appendChild(el);
  });
})();

// ============================================================
// 4. SCORING HEATMAP
// ============================================================
(function(){
  const data = [
    { seg: 'Lucid dreaming enthusiasts', Pain:3, WTP:4, CAC:5, Viral:4, Risk:5, Fit:5, Total:26, Tier:'1', rowClass:'tier-1-row' },
    { seg: 'Biohackers / sleep optimizers', Pain:3, WTP:5, CAC:3, Viral:4, Risk:4, Fit:5, Total:24, Tier:'1', rowClass:'tier-1-row' },
    { seg: 'Pregnant / new mothers', Pain:4, WTP:4, CAC:4, Viral:5, Risk:4, Fit:3, Total:24, Tier:'1', rowClass:'tier-1-row' },
    { seg: 'Perimenopausal women', Pain:4, WTP:4, CAC:4, Viral:4, Risk:4, Fit:3, Total:23, Tier:'1', rowClass:'tier-1-row' },
    { seg: 'Tech execs / high performers', Pain:3, WTP:5, CAC:3, Viral:4, Risk:4, Fit:4, Total:23, Tier:'2', rowClass:'tier-2-row' },
    { seg: 'Consciousness / psychedelic', Pain:3, WTP:4, CAC:4, Viral:4, Risk:4, Fit:4, Total:23, Tier:'2', rowClass:'tier-2-row' },
    { seg: 'Creative professionals', Pain:3, WTP:3, CAC:3, Viral:5, Risk:5, Fit:4, Total:23, Tier:'2', rowClass:'tier-2-row' },
    { seg: 'Spiritual / yoga community', Pain:3, WTP:4, CAC:4, Viral:4, Risk:4, Fit:4, Total:23, Tier:'2', rowClass:'tier-2-row' },
    { seg: 'Therapists (B2B channel)', Pain:3, WTP:4, CAC:4, Viral:4, Risk:4, Fit:4, Total:23, Tier:'B2B', rowClass:'b2b-row' },
    { seg: 'Nightmare / PTSD sufferers', Pain:5, WTP:4, CAC:4, Viral:3, Risk:1, Fit:4, Total:21, Tier:'Earned only', rowClass:'earned-row' },
    { seg: 'Grief & bereavement', Pain:5, WTP:4, CAC:4, Viral:2, Risk:2, Fit:4, Total:21, Tier:'Earned only', rowClass:'earned-row' },
    { seg: 'Insomniacs (non-nightmare)', Pain:4, WTP:4, CAC:3, Viral:2, Risk:4, Fit:3, Total:20, Tier:'2', rowClass:'tier-2-row' },
    { seg: 'Long COVID / chronic illness', Pain:4, WTP:4, CAC:3, Viral:3, Risk:3, Fit:3, Total:20, Tier:'2', rowClass:'tier-2-row' },
    { seg: 'Caregivers', Pain:4, WTP:2, CAC:3, Viral:3, Risk:5, Fit:3, Total:20, Tier:'Wave 3', rowClass:'wave-row' },
    { seg: 'Couples (relationship)', Pain:2, WTP:3, CAC:3, Viral:4, Risk:5, Fit:3, Total:20, Tier:'Wave 3', rowClass:'wave-row' },
    { seg: 'Shift workers / first resp.', Pain:4, WTP:3, CAC:3, Viral:2, Risk:4, Fit:3, Total:19, Tier:'B2B', rowClass:'b2b-row' },
    { seg: 'Gen Z / college students', Pain:3, WTP:1, CAC:3, Viral:5, Risk:4, Fit:3, Total:19, Tier:'Wave 3', rowClass:'wave-row' },
    { seg: 'Aging adults (50–70)', Pain:3, WTP:3, CAC:3, Viral:2, Risk:5, Fit:3, Total:19, Tier:'Wave 3', rowClass:'wave-row' },
    { seg: 'LGBTQ+ wellness', Pain:3, WTP:4, CAC:3, Viral:3, Risk:3, Fit:3, Total:19, Tier:'Earned only', rowClass:'earned-row' },
    { seg: 'Religious / cultural', Pain:3, WTP:2, CAC:3, Viral:3, Risk:1, Fit:3, Total:15, Tier:'Partnership only', rowClass:'earned-row' },
  ];

  const heat = document.getElementById('heatmap');
  if (!heat) return;

  // Heatmap cells warm toward --viz-1 (parchment signal) as score increases
  const cellColor = (v) => {
    const opacity = 0.08 + (v-1) * 0.17;
    return `background: rgba(232, 217, 184, ${opacity}); color: ${v >= 4 ? '#f4f2ed' : '#b8b5ad'};`;
  };

  const tierColor = (t) => {
    // Tier 1 — parchment (signal)
    if (t === '1') return 'background: rgba(232, 217, 184, 0.18); color: #e8d9b8;';
    // Tier 2 — blue
    if (t === '2') return 'background: rgba(160, 181, 214, 0.14); color: #a0b5d6;';
    // B2B — sage
    if (t === 'B2B') return 'background: rgba(156, 186, 176, 0.14); color: #9cbab0;';
    // Earned / Partnership — mauve
    if (t.includes('Earned') || t.includes('Partnership')) return 'background: rgba(200, 162, 184, 0.14); color: #c8a2b8;';
    // Wave — warm gray
    if (t.includes('Wave')) return 'background: rgba(138, 134, 128, 0.2); color: #b8b5ad;';
    return '';
  };

  heat.innerHTML = `
    <thead>
      <tr>
        <th class="seg-col">Segment</th>
        <th>Pain</th><th>WTP</th><th>CAC</th><th>Viral</th><th>Risk</th><th>Fit</th>
        <th>Total</th><th>Tier</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(r => `
        <tr class="${r.rowClass}">
          <td class="seg-name">${r.seg}</td>
          <td class="score" style="${cellColor(r.Pain)}">${r.Pain}</td>
          <td class="score" style="${cellColor(r.WTP)}">${r.WTP}</td>
          <td class="score" style="${cellColor(r.CAC)}">${r.CAC}</td>
          <td class="score" style="${cellColor(r.Viral)}">${r.Viral}</td>
          <td class="score" style="${cellColor(r.Risk)}">${r.Risk}</td>
          <td class="score" style="${cellColor(r.Fit)}">${r.Fit}</td>
          <td class="score total">${r.Total}</td>
          <td class="tier" style="${tierColor(r.Tier)}">${r.Tier}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
})();

// ============================================================
// 5. CAC BY CHANNEL — horizontal bar
// ============================================================
(function(){
  const ctx = document.getElementById('cacChart');
  if (!ctx) return;

  const channels = [
    { name: 'Apple Search Ads (Health)', low: 3, high: 7, color: COLORS.sage },
    { name: 'Podcast host-read ads (eff.)', low: 8, high: 20, color: COLORS.sage },
    { name: 'Reddit AMA / organic', low: 10, high: 30, color: COLORS.sage },
    { name: 'DUST target (blended)', low: 30, high: 60, color: COLORS.parchment },
    { name: 'Meta health CPA', low: 35, high: 42, color: COLORS.terra },
    { name: 'Fitness apps (sub)', low: 55, high: 75, color: COLORS.terra },
    { name: 'Category median', low: 30, high: 75, color: COLORS.muted },
  ];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: channels.map(c => c.name),
      datasets: [
        {
          label: 'Low estimate',
          data: channels.map(c => c.low),
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          stack: 'cac',
        },
        {
          label: 'CAC range',
          data: channels.map(c => c.high - c.low),
          backgroundColor: channels.map(c => ALPHA(c.color, 0.55)),
          borderColor: channels.map(c => c.color),
          borderWidth: 1.5,
          borderRadius: 4,
          borderSkipped: false,
          stack: 'cac',
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (c) => {
              const i = c.dataIndex;
              return `$${channels[i].low} – $${channels[i].high}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { callback: (v) => '$' + v },
          grid: { color: GRID }
        },
        y: { stacked: true, grid: { display: false } }
      }
    }
  });
})();

// ============================================================
// 6. RETENTION CURVE
// ============================================================
(function(){
  const ctx = document.getElementById('retentionChart');
  if (!ctx) return;

  const grad = (c) => {
    const g = ctx.getContext('2d').createLinearGradient(0, 0, 0, 340);
    g.addColorStop(0, ALPHA(c, 0.30));
    g.addColorStop(1, ALPHA(c, 0.0));
    return g;
  };

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Day 1', 'Day 7', 'Day 15', 'Day 30'],
      datasets: [
        {
          label: 'DUST target',
          data: [35, 25, 20, 15],
          borderColor: COLORS.parchment,
          backgroundColor: grad(COLORS.parchment),
          fill: true, tension: 0.4, borderWidth: 3,
          pointBackgroundColor: COLORS.parchment, pointRadius: 5, pointHoverRadius: 8,
          borderDash: [],
        },
        {
          label: 'Top-quartile iOS',
          data: [32, 15, 13, 10],
          borderColor: COLORS.blue,
          backgroundColor: 'transparent',
          fill: false, tension: 0.4, borderWidth: 2,
          pointBackgroundColor: COLORS.blue, pointRadius: 3,
          borderDash: [4, 4],
        },
        {
          label: 'Category median',
          data: [27, 12, 10, 7.9],
          borderColor: COLORS.terra,
          backgroundColor: 'transparent',
          fill: false, tension: 0.4, borderWidth: 2,
          pointBackgroundColor: COLORS.terra, pointRadius: 3,
          borderDash: [4, 4],
        },
        {
          label: 'Calm / Headspace',
          data: [26, 11, 9, 8],
          borderColor: COLORS.muted,
          backgroundColor: 'transparent',
          fill: false, tension: 0.4, borderWidth: 2,
          pointBackgroundColor: COLORS.muted, pointRadius: 3,
          borderDash: [2, 3],
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', align: 'end' },
        tooltip: {
          callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y}%` }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => v + '%' },
          grid: { color: GRID },
          title: { display: true, text: 'Active users (%)', color: AXIS_TITLE }
        },
        x: { grid: { color: GRID_MINOR } }
      }
    }
  });
})();

// ============================================================
// 7. PRICING POSITIONING — scatter
// ============================================================
(function(){
  const ctx = document.getElementById('pricingChart');
  if (!ctx) return;

  const points = [
    { x: 12.99*12, y: 150, label: 'Headspace ($155/yr)', color: COLORS.muted, r: 10 },
    { x: 39.99, y: 120, label: 'Calm ($40/yr)', color: COLORS.muted, r: 10 },
    { x: 51.28, y: 130, label: 'Meditation median', color: COLORS.warm, r: 8 },
    { x: 39.99, y: 180, label: 'Shape (lucid) $40/yr', color: COLORS.blue, r: 8 },
    { x: 99, y: 300, label: 'DUST app-only $99/yr', color: COLORS.parchment, r: 14 },
    { x: 249, y: 400, label: 'DUST bundled $199–299/yr', color: COLORS.parchment, r: 14 },
    { x: 300, y: 450, label: 'Oura ($300/yr sub)', color: COLORS.sage, r: 10 },
    { x: 400, y: 500, label: 'Eight Sleep / Apollo', color: COLORS.sage, r: 10 },
  ];

  new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: [{
        data: points,
        backgroundColor: points.map(p => ALPHA(p.color, 0.5)),
        borderColor: points.map(p => p.color),
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (c) => {
              const p = points[c.dataIndex];
              return [p.label, `Price: $${p.x}/yr`, `Target LTV: $${p.y}`];
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Annual price ($)', color: AXIS_TITLE },
          ticks: { callback: (v) => '$' + v },
          grid: { color: GRID }
        },
        y: {
          title: { display: true, text: 'Target LTV ($)', color: AXIS_TITLE },
          ticks: { callback: (v) => '$' + v },
          grid: { color: GRID }
        }
      }
    }
  });
})();

// ============================================================
// 8. COHORT MIX — doughnut
// ============================================================
(function(){
  const ctx = document.getElementById('cohortChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        'Lucid dreamers / consciousness-curious',
        'Biohackers (incl. podcast/platform)',
        'Pregnant & perimenopausal women',
        'Tech executives / high performers',
        'Creative professionals',
        'Clinical (nightmare / grief) — optional',
      ],
      datasets: [{
        data: [6, 4.5, 4.5, 3.5, 2.5, 1.5],
        backgroundColor: [
          ALPHA(COLORS.blue, 0.72),      // lucid / consciousness
          ALPHA(COLORS.parchment, 0.72), // biohackers (signal)
          ALPHA(COLORS.terra, 0.72),     // pregnant / perimenopausal
          ALPHA(COLORS.sage, 0.72),      // tech execs
          ALPHA(COLORS.mauve, 0.72),     // creative
          ALPHA(COLORS.warm, 0.55),      // clinical (optional)
        ],
        borderColor: [
          COLORS.blue, COLORS.parchment, COLORS.terra,
          COLORS.sage, COLORS.mauve, COLORS.warm,
        ],
        borderWidth: 1.5,
        spacing: 4,
        hoverOffset: 14,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 14, font: { size: 11 } }
        },
        tooltip: {
          callbacks: {
            label: (c) => `${c.label}: ~${c.parsed} users`
          }
        }
      }
    }
  });
})();

// ============================================================
// 9. MEASURED COHORT MIX — doughnut fed by data/pulse.json
//    Rendered on index.html next to the hypothesized mix. Pulls from
//    window.DUST_PULSE, which pulse.js sets after fetching the nightly
//    export. If the pulse hasn't loaded yet, we listen for the custom
//    `pulse-loaded` event and render then.
//
//    Segment -> color mapping is kept in lockstep with the hypothesized
//    chart above so the two doughnuts are visually comparable even
//    when the segment set differs.
// ============================================================
(function () {
  const ctx = document.getElementById('measuredCohortChart');
  if (!ctx) return;

  // Colors keyed by the segment slug used in cohort_pipeline seed data.
  // Any segment we don't have a color for falls back to muted.
  const SEGMENT_COLORS = {
    lucid:         COLORS.blue,
    consciousness: COLORS.blue,
    biohackers:    COLORS.parchment,
    women:         COLORS.terra,   // covers pregnancy & perimenopause families
    tech:          COLORS.sage,
    creatives:     COLORS.mauve,
    clinical:      COLORS.warm,
    sleep_general: COLORS.sage,
  };

  function colorFor(name) {
    const key = (name || '').toLowerCase().split(/[\s_-]+/)[0];
    return SEGMENT_COLORS[key] || SEGMENT_COLORS[name] || COLORS.muted;
  }

  let chart = null;
  function render(measured) {
    const empty = document.getElementById('measuredEmpty');
    const tag = document.getElementById('measuredTag');
    // No data, zero-sum data, or every segment == 0 → keep the empty
    // state visible and don't instantiate an empty chart (Chart.js
    // renders a grey ring which looks broken).
    const hasSignal = Array.isArray(measured)
      && measured.length
      && measured.some(function (m) { return (m.count || 0) > 0; });
    if (!hasSignal) {
      if (empty) empty.style.display = '';
      if (tag) { tag.textContent = 'Pending data'; tag.className = 'kicker-tag validating'; }
      return;
    }
    if (empty) empty.style.display = 'none';
    if (tag) { tag.textContent = 'Live'; tag.className = 'kicker-tag validated'; }

    const labels = measured.map(function (m) { return m.segment; });
    const data = measured.map(function (m) { return m.count; });
    const bgs = measured.map(function (m) { return ALPHA(colorFor(m.segment), 0.72); });
    const borders = measured.map(function (m) { return colorFor(m.segment); });

    if (chart) {
      chart.data.labels = labels;
      chart.data.datasets[0].data = data;
      chart.data.datasets[0].backgroundColor = bgs;
      chart.data.datasets[0].borderColor = borders;
      chart.update();
      return;
    }

    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: bgs,
          borderColor: borders,
          borderWidth: 1.5,
          spacing: 4,
          hoverOffset: 14,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '58%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 14, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: function (c) {
                const total = c.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                const pct = total ? Math.round((c.parsed / total) * 100) : 0;
                return `${c.label}: ${c.parsed} qualified · ${pct}%`;
              },
            },
          },
        },
      },
    });
  }

  function tryRender() {
    const pulse = window.DUST_PULSE;
    if (pulse && pulse.cohort_mix && Array.isArray(pulse.cohort_mix.measured)) {
      render(pulse.cohort_mix.measured);
      return true;
    }
    return false;
  }

  // Happy path: pulse.js already populated DUST_PULSE before charts.js
  // ran (same-origin fetch is typically fast). If not, wait for the
  // event. Belt-and-suspenders: a 4-second timeout so we never leave
  // the card in "Pending data" forever when pulse.json is confirmed
  // absent (window.DUST_PULSE === null).
  if (!tryRender()) {
    document.addEventListener('pulse-loaded', tryRender, { once: true });
    setTimeout(function () {
      // After timeout, if pulse explicitly resolved to null, render the
      // empty state so the UI commits to a final state.
      if (window.DUST_PULSE === null) render(null);
    }, 4000);
  }
})();
