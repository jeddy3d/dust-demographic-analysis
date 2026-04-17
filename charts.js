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
// 8. HYPOTHESIZED COHORT MIX — doughnut
//    Reads pulse.cohort_mix.hypothesized when the pulse has loaded
//    (same segment slugs the measured chart uses, so labels + colors
//    are directly comparable). Falls back to the hand-authored dossier
//    weighting below if pulse.json is absent (day-zero UX).
// ============================================================
(function(){
  const ctx = document.getElementById('cohortChart');
  if (!ctx) return;

  // Mirror the measured chart's color map so the two doughnuts use the
  // same slug → color mapping and read as paired views of one dataset.
  const SEGMENT_COLORS = {
    lucid:         COLORS.blue,
    consciousness: COLORS.blue,
    biohackers:    COLORS.parchment,
    women:         COLORS.terra,
    pregnancy:     COLORS.terra,
    perimenopause: COLORS.terra,
    tech:          COLORS.sage,
    creatives:     COLORS.mauve,
    clinical:      COLORS.warm,
    sleep_general: COLORS.sage,
  };
  const colorFor = (name) => {
    const key = (name || '').toLowerCase().split(/[\s_-]+/)[0];
    return SEGMENT_COLORS[key] || SEGMENT_COLORS[name] || COLORS.muted;
  };

  // Day-zero fallback: dossier v1.0 weighting. Shape matches pulse's
  // hypothesized list: [{ segment, share }, ...].
  const FALLBACK = [
    { segment: 'lucid',         share: 0.25 },
    { segment: 'biohackers',    share: 0.25 },
    { segment: 'women',         share: 0.20 },
    { segment: 'tech',          share: 0.15 },
    { segment: 'creatives',     share: 0.10 },
    { segment: 'clinical',      share: 0.05 },
  ];

  let chart = null;
  function render(list) {
    const labels = list.map((m) => m.segment);
    const data = list.map((m) => Math.round((m.share || 0) * 100));
    const bgs = list.map((m) => ALPHA(colorFor(m.segment), 0.72));
    const borders = list.map((m) => colorFor(m.segment));

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
              label: (c) => `${c.label}: ${c.parsed}% hypothesized share`,
            },
          },
        },
      },
    });
  }

  function tryRender() {
    const pulse = window.DUST_PULSE;
    if (pulse && pulse.cohort_mix && Array.isArray(pulse.cohort_mix.hypothesized)) {
      render(pulse.cohort_mix.hypothesized);
      return true;
    }
    return false;
  }

  // Render fallback immediately so the chart is never blank. When pulse
  // loads, re-render from pulse. If pulse is permanently absent (null),
  // the fallback stays on screen — the UI is still complete.
  render(FALLBACK);
  if (!tryRender()) {
    document.addEventListener('pulse-loaded', tryRender, { once: true });
  }
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

// ============================================================
// 10. LIVE SIGNAL BY SEGMENT — cards fed by pulse.segments[]
//     Renders one card per measured segment with:
//       - segment name, tier, outreach policy
//       - unique_authors scanned vs qualified_authors (fraction)
//       - avg_composite score
//       - top 4 phrases (from top_phrases)
//       - top 3 source subreddits (from top_subreddits)
//     Segments with outreach_policy !== "candidate" (i.e. messaging_only
//     or earned_only) get a muted treatment so they don't read as
//     outreach targets — they're language research only.
// ============================================================
(function () {
  const grid = document.getElementById('liveGrid');
  if (!grid) return;

  const SEGMENT_COLORS = {
    lucid:         COLORS.blue,
    consciousness: COLORS.blue,
    biohackers:    COLORS.parchment,
    pregnancy:     COLORS.terra,
    perimenopause: COLORS.terra,
    women:         COLORS.terra,
    creatives:     COLORS.mauve,
    sleep_general: COLORS.sage,
    tech:          COLORS.sage,
    clinical:      COLORS.warm,
  };
  const colorFor = (name) => {
    const key = (name || '').toLowerCase().split(/[\s_-]+/)[0];
    return SEGMENT_COLORS[key] || SEGMENT_COLORS[name] || COLORS.muted;
  };

  // Human-readable titles per slug. Lowercase-keyed for safety.
  const TITLES = {
    biohackers:    'Biohackers · sleep optimizers',
    lucid:         'Lucid dreamers',
    pregnancy:     'Pregnant & new mothers',
    perimenopause: 'Perimenopausal women',
    consciousness: 'Consciousness & psychedelic-curious',
    creatives:     'Creative professionals',
    sleep_general: 'Insomniacs · non-nightmare',
    clinical:      'Clinical · nightmare / grief / PTSD',
  };
  const titleFor = (slug) => TITLES[slug] || slug;

  function statusFor(s) {
    // Candidate-policy segments with ≥3 qualified authors = "Validated".
    // Candidate-policy with fewer = "Measuring". Non-candidate
    // (messaging/earned) = "Language research".
    const policy = s.outreach_policy || 'candidate';
    const q = s.qualified_authors || 0;
    if (policy !== 'candidate') {
      return { label: 'Language research', klass: 'kicker-tag' };
    }
    if (q >= 3) return { label: 'Validated', klass: 'kicker-tag validated' };
    if (q >= 1) return { label: 'Early signal', klass: 'kicker-tag building' };
    return { label: 'Measuring', klass: 'kicker-tag validating' };
  }

  function policyCopy(policy) {
    if (policy === 'candidate') return 'Outreach: direct (Tier 1–2 candidate)';
    if (policy === 'messaging_only') return 'Outreach: messaging signal only (primary channel off-platform)';
    if (policy === 'earned_only') return 'Outreach: earned / partnership only';
    return 'Outreach: —';
  }

  function renderCards(segments) {
    grid.innerHTML = '';
    if (!segments || !segments.length) {
      const empty = document.createElement('div');
      empty.className = 'live-grid__empty';
      empty.innerHTML =
        '<div class="live-grid__empty-title">No measured segments yet</div>' +
        '<div class="live-grid__empty-body">The daily listener run exports this data at 08:00 UTC. If you see this during the day, pulse.json was produced with an empty segment list.</div>';
      grid.appendChild(empty);
      return;
    }

    // Sort: candidate-policy first (by qualified desc), then
    // messaging-only (by unique desc), then earned last.
    const order = { candidate: 0, messaging_only: 1, earned_only: 2 };
    segments.slice().sort(function (a, b) {
      const pa = order[a.outreach_policy] ?? 3;
      const pb = order[b.outreach_policy] ?? 3;
      if (pa !== pb) return pa - pb;
      if (pa === 0) return (b.qualified_authors || 0) - (a.qualified_authors || 0);
      return (b.unique_authors || 0) - (a.unique_authors || 0);
    }).forEach(function (s) {
      const color = colorFor(s.name);
      const status = statusFor(s);
      const unique = s.unique_authors || 0;
      const qualified = s.qualified_authors || 0;
      const avg = (s.avg_composite == null) ? null : Number(s.avg_composite).toFixed(2);
      const phrases = (s.top_phrases || []).slice(0, 4);
      const subs = (s.top_subreddits || []).slice(0, 3);

      const card = document.createElement('div');
      card.className = 'live-card';
      card.style.setProperty('--live-color', color);
      if ((s.outreach_policy || 'candidate') !== 'candidate') {
        card.classList.add('live-card--muted');
      }

      // Build with textContent where user-derived strings flow in, so
      // no author handle or phrase can inject markup. Frame + static
      // labels via innerHTML is fine.
      card.innerHTML =
        '<div class="live-card__top">' +
          '<div class="live-card__title"></div>' +
          '<span class="' + status.klass + '">' + status.label + '</span>' +
        '</div>' +
        '<div class="live-card__policy"></div>' +
        '<div class="live-card__stats">' +
          '<div class="live-stat">' +
            '<div class="live-stat__val"></div>' +
            '<div class="live-stat__lbl">Authors scanned</div>' +
          '</div>' +
          '<div class="live-stat">' +
            '<div class="live-stat__val"></div>' +
            '<div class="live-stat__lbl">Qualified</div>' +
          '</div>' +
          '<div class="live-stat">' +
            '<div class="live-stat__val"></div>' +
            '<div class="live-stat__lbl">Avg composite (/3)</div>' +
          '</div>' +
          '<div class="live-stat">' +
            '<div class="live-stat__val"></div>' +
            '<div class="live-stat__lbl">Schema version</div>' +
          '</div>' +
        '</div>' +
        '<div class="live-card__block">' +
          '<div class="live-card__sub">Top language patterns</div>' +
          '<div class="live-card__phrases"></div>' +
        '</div>' +
        '<div class="live-card__block">' +
          '<div class="live-card__sub">Top source subreddits</div>' +
          '<div class="live-card__subs"></div>' +
        '</div>';

      // Fill in dynamic text nodes — textContent for safety.
      card.querySelector('.live-card__title').textContent = titleFor(s.name);
      card.querySelector('.live-card__policy').textContent = policyCopy(s.outreach_policy);
      const vals = card.querySelectorAll('.live-stat__val');
      vals[0].textContent = String(unique);
      vals[1].textContent = String(qualified);
      vals[2].textContent = avg == null ? '—' : avg;
      vals[3].textContent = 'v' + (s.version != null ? s.version : '—');

      const phrasesEl = card.querySelector('.live-card__phrases');
      if (!phrases.length) {
        phrasesEl.innerHTML = '<span class="live-card__empty">—</span>';
      } else {
        phrases.forEach(function (p) {
          const chip = document.createElement('span');
          chip.className = 'phrase-chip';
          const term = document.createElement('span');
          term.className = 'phrase-chip__term';
          term.textContent = p.phrase || '—';
          const count = document.createElement('span');
          count.className = 'phrase-chip__count';
          count.textContent = p.docs != null ? String(p.docs) : '';
          chip.appendChild(term);
          if (p.docs != null) chip.appendChild(count);
          phrasesEl.appendChild(chip);
        });
      }

      const subsEl = card.querySelector('.live-card__subs');
      if (!subs.length) {
        subsEl.innerHTML = '<span class="live-card__empty">—</span>';
      } else {
        subs.forEach(function (r) {
          const chip = document.createElement('span');
          chip.className = 'sub-chip';
          const name = document.createElement('span');
          name.className = 'sub-chip__name';
          name.textContent = 'r/' + (r.subreddit || '—');
          const authors = document.createElement('span');
          authors.className = 'sub-chip__n';
          authors.textContent = r.authors != null ? String(r.authors) : '';
          chip.appendChild(name);
          if (r.authors != null) chip.appendChild(authors);
          subsEl.appendChild(chip);
        });
      }

      grid.appendChild(card);
    });
  }

  function updateHeader(segments) {
    const tag = document.getElementById('liveSignalTag');
    const sub = document.getElementById('liveSignalSub');
    if (!segments || !segments.length) {
      if (tag) { tag.textContent = 'Pending data'; tag.className = 'kicker-tag validating'; }
      return;
    }
    const totalUnique = segments.reduce(function (a, s) { return a + (s.unique_authors || 0); }, 0);
    const candidates = segments.filter(function (s) { return (s.outreach_policy || 'candidate') === 'candidate'; });
    const totalQualified = candidates.reduce(function (a, s) { return a + (s.qualified_authors || 0); }, 0);
    if (tag) { tag.textContent = 'Live'; tag.className = 'kicker-tag validated'; }
    if (sub) {
      sub.textContent = totalUnique.toLocaleString() + ' unique authors scanned across ' +
        segments.length + ' segments · ' + totalQualified + ' qualified as outreach candidates · ' +
        'privacy-filtered before publication.';
    }
  }

  function tryRender() {
    const pulse = window.DUST_PULSE;
    if (pulse && Array.isArray(pulse.segments)) {
      renderCards(pulse.segments);
      updateHeader(pulse.segments);
      return true;
    }
    return false;
  }

  if (!tryRender()) {
    document.addEventListener('pulse-loaded', tryRender, { once: true });
    setTimeout(function () {
      // Explicitly resolved-null pulse: keep the initial empty-state HTML
      // that the page was shipped with — nothing more to do.
      if (window.DUST_PULSE === null) {
        const tag = document.getElementById('liveSignalTag');
        if (tag) { tag.textContent = 'Pending data'; tag.className = 'kicker-tag validating'; }
      }
    }, 4000);
  }
})();

// ============================================================
// 11. HYPOTHESIS vs MEASURED VARIANCE PANEL
//     Sits beneath the side-by-side doughnuts on index.html.
//     For each segment that appears in either cohort_mix.hypothesized
//     or cohort_mix.measured, render a row with:
//       hypothesized % · measured % · delta (pp)
//     Rows are sorted by |delta| desc so the biggest variance
//     lands at the top. >10pp variance gets a 'variance-row--flag'
//     treatment so it reads as "this hypothesis needs revision."
//
//     Segment slug reconciliation: hypothesized uses umbrella slugs
//     (e.g. "women" covers pregnancy+perimenopause) while measured
//     uses granular slugs. We DO NOT attempt to collapse the two —
//     surfacing the asymmetry is the whole point of the panel, and
//     a split ("women" hypothesized at 20%, "pregnancy" + "peri"
//     measured at 0% + 6%) is itself the signal that the hypothesis
//     was wrong about which sub-segment would carry the cohort.
// ============================================================
(function () {
  const table = document.getElementById('varianceTable');
  if (!table) return;

  const SEGMENT_COLORS = {
    lucid:         COLORS.blue,
    consciousness: COLORS.blue,
    biohackers:    COLORS.parchment,
    pregnancy:     COLORS.terra,
    perimenopause: COLORS.terra,
    women:         COLORS.terra,
    creatives:     COLORS.mauve,
    sleep_general: COLORS.sage,
    tech:          COLORS.sage,
    clinical:      COLORS.warm,
  };
  const colorFor = (name) => {
    const key = (name || '').toLowerCase().split(/[\s_-]+/)[0];
    return SEGMENT_COLORS[key] || SEGMENT_COLORS[name] || COLORS.muted;
  };

  const TITLES = {
    biohackers:    'Biohackers',
    lucid:         'Lucid dreamers',
    pregnancy:     'Pregnant & new mothers',
    perimenopause: 'Perimenopausal women',
    women:         'Women (umbrella)',
    consciousness: 'Consciousness-curious',
    creatives:     'Creative professionals',
    sleep_general: 'Insomniacs',
    tech:          'Tech execs',
    clinical:      'Clinical · grief / PTSD',
  };
  const titleFor = (slug) => TITLES[slug] || slug;

  function fmtPct(x) {
    if (x == null || isNaN(x)) return '—';
    return Math.round(x * 100) + '%';
  }
  function fmtDeltaPp(hyp, meas) {
    if (hyp == null || meas == null) return { text: '—', pp: null };
    const pp = Math.round((meas - hyp) * 100);
    const sign = pp > 0 ? '+' : (pp < 0 ? '−' : '±');
    return { text: sign + Math.abs(pp) + 'pp', pp: pp };
  }

  function render(mix) {
    // mix: { hypothesized: [{segment, share}], measured: [{segment, count}] }
    const hyp = (mix && Array.isArray(mix.hypothesized)) ? mix.hypothesized : [];
    const meas = (mix && Array.isArray(mix.measured)) ? mix.measured : [];

    // Measured shares: normalize counts to a share of qualified candidates.
    const measTotal = meas.reduce(function (a, m) { return a + (m.count || 0); }, 0);
    const measShare = {};
    meas.forEach(function (m) {
      if (measTotal > 0) measShare[m.segment] = (m.count || 0) / measTotal;
    });
    const hypShare = {};
    hyp.forEach(function (h) { hypShare[h.segment] = h.share || 0; });

    // Union of slugs so a segment that's hypothesized but not yet
    // measured (or vice versa) still shows up as an explicit row.
    const slugs = Array.from(new Set(
      Object.keys(hypShare).concat(Object.keys(measShare))
    ));

    if (!slugs.length || (measTotal === 0 && !hyp.length)) {
      // Keep the empty-state that shipped with the HTML.
      return;
    }

    // Build rows.
    const rows = slugs.map(function (slug) {
      const h = hypShare[slug];
      const m = measShare[slug];
      const delta = fmtDeltaPp(h, m);
      return {
        slug: slug,
        hyp: h,
        meas: m,
        deltaPp: delta.pp,
        deltaText: delta.text,
      };
    });

    // Sort: flagged (|delta|>10pp or one-sided) first, then by |delta| desc.
    rows.sort(function (a, b) {
      const aAbs = a.deltaPp == null ? 999 : Math.abs(a.deltaPp);
      const bAbs = b.deltaPp == null ? 999 : Math.abs(b.deltaPp);
      return bAbs - aAbs;
    });

    // Clear existing empty-state + non-header rows. Keep the header row.
    Array.from(table.querySelectorAll('.variance-row:not(.variance-row--header)')).forEach(function (el) {
      el.remove();
    });

    rows.forEach(function (r) {
      const row = document.createElement('div');
      row.className = 'variance-row';
      const flagged =
        (r.deltaPp != null && Math.abs(r.deltaPp) > 10) ||
        r.hyp == null || r.meas == null;
      if (flagged) row.classList.add('variance-row--flag');

      row.innerHTML =
        '<div class="variance-seg">' +
          '<span class="variance-dot"></span>' +
          '<span class="variance-seg__name"></span>' +
        '</div>' +
        '<div class="variance-val variance-val--hyp"></div>' +
        '<div class="variance-val variance-val--meas"></div>' +
        '<div class="variance-val variance-val--delta"></div>';

      row.querySelector('.variance-dot').style.background = colorFor(r.slug);
      row.querySelector('.variance-seg__name').textContent = titleFor(r.slug);
      row.querySelector('.variance-val--hyp').textContent = fmtPct(r.hyp);
      row.querySelector('.variance-val--meas').textContent = fmtPct(r.meas);
      const deltaEl = row.querySelector('.variance-val--delta');
      deltaEl.textContent = r.deltaText;
      if (r.deltaPp != null) {
        if (r.deltaPp > 10) deltaEl.classList.add('variance-val--up');
        else if (r.deltaPp < -10) deltaEl.classList.add('variance-val--down');
      }

      table.appendChild(row);
    });
  }

  function tryRender() {
    const pulse = window.DUST_PULSE;
    if (pulse && pulse.cohort_mix) {
      render(pulse.cohort_mix);
      return true;
    }
    return false;
  }

  if (!tryRender()) {
    document.addEventListener('pulse-loaded', tryRender, { once: true });
  }
})();


// ============================================================================
// Block 12 — Messaging Atlas renderer (per-segment distinctive phrases)
// Reads pulse.messaging_atlas: { segment: [{ phrase, docs, classification,
// distinctiveness, shared_with_n_segments }] }
// ============================================================================
(function () {
  const SEGMENT_COLORS = {
    biohackers: '#ffb57a', lucid: '#7cc4ff', pregnancy: '#b892ff',
    perimenopause: '#ff6b8a', consciousness: '#8ee6c2', creatives: '#b892ff',
    sleep_general: '#ffb57a', clinical: '#c7c3bc',
  };
  const colorFor = (name) => {
    const key = (name || '').toLowerCase().split(/[\s_-]+/)[0];
    return SEGMENT_COLORS[key] || SEGMENT_COLORS[name] || '#d8d2c8';
  };
  const TITLES = {
    biohackers: 'Biohackers · sleep optimizers',
    lucid: 'Lucid dreamers',
    pregnancy: 'Pregnant & new mothers',
    perimenopause: 'Perimenopausal women',
    consciousness: 'Consciousness & psychedelic-curious',
    creatives: 'Creative professionals',
    sleep_general: 'Insomniacs · non-nightmare',
    clinical: 'Clinical · nightmare / grief / PTSD',
  };
  const titleFor = (slug) => TITLES[slug] || slug;

  function render(atlas) {
    const grid = document.getElementById('atlasGrid');
    if (!grid) return;
    const segs = Object.keys(atlas || {});
    if (!segs.length) return;
    grid.innerHTML = '';
    segs.forEach((seg) => {
      const phrases = atlas[seg] || [];
      const card = document.createElement('div');
      card.className = 'atlas-card';
      card.style.setProperty('--accent', colorFor(seg));

      const head = document.createElement('div');
      head.className = 'atlas-card__head';
      const dot = document.createElement('span');
      dot.className = 'atlas-dot';
      dot.style.background = colorFor(seg);
      head.appendChild(dot);
      const title = document.createElement('div');
      title.className = 'atlas-card__title';
      title.textContent = titleFor(seg);
      head.appendChild(title);
      const count = document.createElement('div');
      count.className = 'atlas-card__count';
      count.textContent = phrases.length + ' phrases';
      head.appendChild(count);
      card.appendChild(head);

      const list = document.createElement('div');
      list.className = 'atlas-phrases';
      phrases.forEach((p) => {
        const chip = document.createElement('div');
        chip.className = 'atlas-chip atlas-chip--' + (p.classification || 'neutral');
        const phraseEl = document.createElement('span');
        phraseEl.className = 'atlas-chip__phrase';
        phraseEl.textContent = p.phrase;
        chip.appendChild(phraseEl);
        const meta = document.createElement('span');
        meta.className = 'atlas-chip__meta';
        meta.textContent = p.docs + ' authors';
        chip.appendChild(meta);
        list.appendChild(chip);
      });
      card.appendChild(list);

      const legend = document.createElement('div');
      legend.className = 'atlas-card__legend';
      legend.innerHTML =
        '<span class="atlas-legend-tag atlas-legend-tag--pain">pain</span>' +
        '<span class="atlas-legend-tag atlas-legend-tag--aspiration">aspiration</span>' +
        '<span class="atlas-legend-tag atlas-legend-tag--neutral">identity / neutral</span>';
      card.appendChild(legend);

      grid.appendChild(card);
    });
  }

  function tryRender() {
    const pulse = window.DUST_PULSE;
    if (pulse && pulse.messaging_atlas && Object.keys(pulse.messaging_atlas).length) {
      render(pulse.messaging_atlas);
      return true;
    }
    return false;
  }
  if (!tryRender()) document.addEventListener('pulse-loaded', tryRender, { once: true });
})();


// ============================================================================
// Block 13 — Adjacency matrix renderer
// Reads pulse.adjacency_matrix: { segments[], pairs[{a,b,shared_count,examples}],
// author_overlap:{multi_segment_authors,total_engaged_authors,note} }
// ============================================================================
(function () {
  const SEGMENT_COLORS = {
    biohackers: '#ffb57a', lucid: '#7cc4ff', pregnancy: '#b892ff',
    perimenopause: '#ff6b8a', consciousness: '#8ee6c2', creatives: '#b892ff',
    sleep_general: '#ffb57a', clinical: '#c7c3bc',
  };
  const colorFor = (name) => {
    const key = (name || '').toLowerCase().split(/[\s_-]+/)[0];
    return SEGMENT_COLORS[key] || SEGMENT_COLORS[name] || '#d8d2c8';
  };
  const TITLES = {
    biohackers: 'Biohackers',
    lucid: 'Lucid dreamers',
    pregnancy: 'Pregnancy',
    perimenopause: 'Perimenopause',
    consciousness: 'Consciousness',
    creatives: 'Creatives',
    sleep_general: 'Insomniacs',
    clinical: 'Clinical',
  };
  const titleFor = (slug) => TITLES[slug] || slug;

  function render(adj) {
    const list = document.getElementById('adjacencyList');
    const note = document.getElementById('adjacencyAuthorNote');
    if (!list) return;
    const pairs = (adj && adj.pairs) || [];
    if (!pairs.length) return;

    if (note && adj.author_overlap) {
      const o = adj.author_overlap;
      note.textContent =
        o.multi_segment_authors + ' of ' + o.total_engaged_authors +
        ' engaged authors span multiple segments';
    }

    list.innerHTML = '';
    // Cap at top 12 to keep the surface scannable.
    pairs.slice(0, 12).forEach((p) => {
      const row = document.createElement('div');
      row.className = 'adjacency-row';

      const pair = document.createElement('div');
      pair.className = 'adjacency-row__pair';
      const aDot = document.createElement('span');
      aDot.className = 'adjacency-dot';
      aDot.style.background = colorFor(p.a);
      const aName = document.createElement('span');
      aName.className = 'adjacency-name';
      aName.textContent = titleFor(p.a);
      const sep = document.createElement('span');
      sep.className = 'adjacency-sep';
      sep.textContent = '↔';
      const bDot = document.createElement('span');
      bDot.className = 'adjacency-dot';
      bDot.style.background = colorFor(p.b);
      const bName = document.createElement('span');
      bName.className = 'adjacency-name';
      bName.textContent = titleFor(p.b);
      pair.appendChild(aDot); pair.appendChild(aName);
      pair.appendChild(sep);
      pair.appendChild(bDot); pair.appendChild(bName);
      row.appendChild(pair);

      const meta = document.createElement('div');
      meta.className = 'adjacency-row__meta';
      meta.textContent = p.shared_count + ' shared phrases';
      row.appendChild(meta);

      const examples = document.createElement('div');
      examples.className = 'adjacency-row__examples';
      (p.examples || []).forEach((ex) => {
        const chip = document.createElement('span');
        chip.className = 'adjacency-chip';
        chip.textContent = ex;
        examples.appendChild(chip);
      });
      row.appendChild(examples);

      list.appendChild(row);
    });
  }

  function tryRender() {
    const pulse = window.DUST_PULSE;
    if (pulse && pulse.adjacency_matrix && (pulse.adjacency_matrix.pairs || []).length) {
      render(pulse.adjacency_matrix);
      return true;
    }
    return false;
  }
  if (!tryRender()) document.addEventListener('pulse-loaded', tryRender, { once: true });
})();


// ============================================================================
// Block 14 — Partnership ranking renderer
// Reads pulse.partnership_ranking: { thresholds, top[{subreddit,segment,
//   unique_authors, engaged_authors, qualified_authors, density_qualified,
//   density_engaged}], note }
// ============================================================================
(function () {
  const SEGMENT_COLORS = {
    biohackers: '#ffb57a', lucid: '#7cc4ff', pregnancy: '#b892ff',
    perimenopause: '#ff6b8a', consciousness: '#8ee6c2', creatives: '#b892ff',
    sleep_general: '#ffb57a', clinical: '#c7c3bc',
  };
  const colorFor = (name) => {
    const key = (name || '').toLowerCase().split(/[\s_-]+/)[0];
    return SEGMENT_COLORS[key] || SEGMENT_COLORS[name] || '#d8d2c8';
  };

  function fmtPct(x) { return Math.round((x || 0) * 100) + '%'; }

  function render(rank) {
    const table = document.getElementById('partnershipTable');
    const note = document.getElementById('partnershipNote');
    if (!table) return;
    const rows = (rank && rank.top) || [];
    if (!rows.length) return;

    if (note) {
      note.textContent = rank.note || '';
    }

    // Clear everything except the header row.
    Array.from(table.querySelectorAll('.partnership-row:not(.partnership-row--header)'))
      .forEach((el) => el.remove());

    // Max density for bar sizing.
    const maxDensity = rows.reduce(function (m, r) {
      return Math.max(m, r.density_qualified || 0, r.density_engaged || 0);
    }, 0) || 1;

    rows.forEach((r) => {
      const row = document.createElement('div');
      row.className = 'partnership-row';

      const sub = document.createElement('div');
      sub.className = 'partnership-sub';
      const dot = document.createElement('span');
      dot.className = 'partnership-dot';
      dot.style.background = colorFor(r.segment);
      sub.appendChild(dot);
      const subName = document.createElement('span');
      subName.className = 'partnership-sub__name';
      subName.textContent = 'r/' + r.subreddit;
      sub.appendChild(subName);
      row.appendChild(sub);

      const seg = document.createElement('div');
      seg.className = 'partnership-seg';
      seg.textContent = r.segment;
      row.appendChild(seg);

      const unique = document.createElement('div');
      unique.className = 'partnership-num';
      unique.textContent = String(r.unique_authors);
      row.appendChild(unique);

      const eng = document.createElement('div');
      eng.className = 'partnership-num';
      eng.textContent = String(r.engaged_authors);
      row.appendChild(eng);

      const qual = document.createElement('div');
      qual.className = 'partnership-num partnership-num--qual';
      qual.textContent = String(r.qualified_authors);
      row.appendChild(qual);

      const density = document.createElement('div');
      density.className = 'partnership-density';
      const bar = document.createElement('div');
      bar.className = 'partnership-density__bar';
      const fillQ = document.createElement('div');
      fillQ.className = 'partnership-density__fill partnership-density__fill--qual';
      fillQ.style.width = Math.round(((r.density_qualified || 0) / maxDensity) * 100) + '%';
      fillQ.style.background = colorFor(r.segment);
      const fillE = document.createElement('div');
      fillE.className = 'partnership-density__fill partnership-density__fill--eng';
      fillE.style.width = Math.round(((r.density_engaged || 0) / maxDensity) * 100) + '%';
      bar.appendChild(fillE);
      bar.appendChild(fillQ);
      density.appendChild(bar);
      const lbl = document.createElement('div');
      lbl.className = 'partnership-density__label';
      lbl.textContent = fmtPct(r.density_qualified) + ' qual · ' + fmtPct(r.density_engaged) + ' eng';
      density.appendChild(lbl);
      row.appendChild(density);

      table.appendChild(row);
    });
  }

  function tryRender() {
    const pulse = window.DUST_PULSE;
    if (pulse && pulse.partnership_ranking && (pulse.partnership_ranking.top || []).length) {
      render(pulse.partnership_ranking);
      return true;
    }
    return false;
  }
  if (!tryRender()) document.addEventListener('pulse-loaded', tryRender, { once: true });
})();


// ============================================================================
// Block 15 — Persona cards renderer
// Reads pulse.personas.personas: { seg: { archetype, demographic_inference,
//   profession_hints, dominant_emotion, competing_products[],
//   what_they_want_from_dream_tech, representative_quotes[], activation_hook } }
// ============================================================================
(function () {
  const SEGMENT_COLORS = {
    biohackers: '#ffb57a', lucid: '#7cc4ff', pregnancy: '#b892ff',
    perimenopause: '#ff6b8a', consciousness: '#8ee6c2', creatives: '#b892ff',
    sleep_general: '#ffb57a', clinical: '#c7c3bc',
  };
  const colorFor = (name) => {
    const key = (name || '').toLowerCase().split(/[\s_-]+/)[0];
    return SEGMENT_COLORS[key] || SEGMENT_COLORS[name] || '#d8d2c8';
  };
  const TITLES = {
    biohackers: 'Biohackers · sleep optimizers',
    lucid: 'Lucid dreamers',
    pregnancy: 'Pregnant & new mothers',
    perimenopause: 'Perimenopausal women',
    consciousness: 'Consciousness & psychedelic-curious',
    creatives: 'Creative professionals',
    sleep_general: 'Insomniacs · non-nightmare',
    clinical: 'Clinical · nightmare / grief / PTSD',
  };
  const titleFor = (slug) => TITLES[slug] || slug;

  function addField(container, label, value) {
    if (!value) return;
    const row = document.createElement('div');
    row.className = 'persona-field';
    const lbl = document.createElement('div');
    lbl.className = 'persona-field__label';
    lbl.textContent = label;
    const val = document.createElement('div');
    val.className = 'persona-field__value';
    val.textContent = value;
    row.appendChild(lbl);
    row.appendChild(val);
    container.appendChild(row);
  }

  function render(personas) {
    const grid = document.getElementById('personaGrid');
    if (!grid) return;
    const map = (personas && personas.personas) || {};
    const segs = Object.keys(map);
    if (!segs.length) return;
    grid.innerHTML = '';

    segs.forEach((seg) => {
      const p = map[seg] || {};
      const card = document.createElement('div');
      card.className = 'persona-card';
      card.style.setProperty('--accent', colorFor(seg));

      const head = document.createElement('div');
      head.className = 'persona-card__head';
      const dot = document.createElement('span');
      dot.className = 'persona-dot';
      dot.style.background = colorFor(seg);
      head.appendChild(dot);
      const headText = document.createElement('div');
      headText.className = 'persona-card__headtext';
      const segTitle = document.createElement('div');
      segTitle.className = 'persona-card__seg';
      segTitle.textContent = titleFor(seg);
      const arche = document.createElement('div');
      arche.className = 'persona-card__archetype';
      arche.textContent = p.archetype || '';
      headText.appendChild(segTitle);
      headText.appendChild(arche);
      head.appendChild(headText);
      card.appendChild(head);

      const fields = document.createElement('div');
      fields.className = 'persona-fields';
      addField(fields, 'Demographic', p.demographic_inference);
      addField(fields, 'Profession', p.profession_hints);
      addField(fields, 'Dominant emotion', p.dominant_emotion);
      if (Array.isArray(p.competing_products) && p.competing_products.length) {
        const row = document.createElement('div');
        row.className = 'persona-field';
        const lbl = document.createElement('div');
        lbl.className = 'persona-field__label';
        lbl.textContent = 'Competing products';
        const val = document.createElement('div');
        val.className = 'persona-field__chips';
        p.competing_products.forEach((prod) => {
          const chip = document.createElement('span');
          chip.className = 'persona-chip';
          chip.textContent = prod;
          val.appendChild(chip);
        });
        row.appendChild(lbl); row.appendChild(val);
        fields.appendChild(row);
      }
      addField(fields, 'What they want from DUST', p.what_they_want_from_dream_tech);
      card.appendChild(fields);

      if (Array.isArray(p.representative_quotes) && p.representative_quotes.length) {
        const quotes = document.createElement('div');
        quotes.className = 'persona-quotes';
        const lbl = document.createElement('div');
        lbl.className = 'persona-quotes__label';
        lbl.textContent = 'Paraphrased voice';
        quotes.appendChild(lbl);
        p.representative_quotes.forEach((q) => {
          const quote = document.createElement('div');
          quote.className = 'persona-quote';
          quote.textContent = '“' + q + '”';
          quotes.appendChild(quote);
        });
        card.appendChild(quotes);
      }

      if (p.activation_hook) {
        const hook = document.createElement('div');
        hook.className = 'persona-hook';
        const lbl = document.createElement('div');
        lbl.className = 'persona-hook__label';
        lbl.textContent = 'Activation hook';
        const body = document.createElement('div');
        body.className = 'persona-hook__body';
        body.textContent = p.activation_hook;
        hook.appendChild(lbl);
        hook.appendChild(body);
        card.appendChild(hook);
      }

      grid.appendChild(card);
    });
  }

  function tryRender() {
    const pulse = window.DUST_PULSE;
    const map = pulse && pulse.personas && pulse.personas.personas;
    if (map && Object.keys(map).length) {
      render(pulse.personas);
      return true;
    }
    return false;
  }
  if (!tryRender()) document.addEventListener('pulse-loaded', tryRender, { once: true });
})();


// ============================================================================
// Block 17 — GTM playbook renderer (targets.html)
// For each segment we have signal for, render a three-part play:
//   · Where to show up  — top qualified-density subreddit(s) from partnership_ranking
//   · What to say       — top pain + top aspiration phrase from messaging_atlas
//   · How to activate   — persona.activation_hook
// Plus a standalone "Top outreach channels this week" table at the bottom,
// keyed off partnership_ranking.top ordered by qualified density.
//
// Day-zero behavior: if any required field is missing, we keep the empty
// state visible. Every pulse-derived string flows through textContent so a
// compromised brief couldn't inject markup into the site.
// ============================================================================
(function () {
  const SEGMENT_COLORS = {
    biohackers: '#ffb57a', lucid: '#7cc4ff', pregnancy: '#b892ff',
    perimenopause: '#ff6b8a', consciousness: '#8ee6c2', creatives: '#b892ff',
    sleep_general: '#ffb57a', clinical: '#c7c3bc',
  };
  const TITLES = {
    biohackers: 'Biohackers · sleep optimizers',
    lucid: 'Lucid dreamers',
    pregnancy: 'Pregnant & new mothers',
    perimenopause: 'Perimenopausal women',
    consciousness: 'Consciousness & psychedelic-curious',
    creatives: 'Creative professionals',
    sleep_general: 'Insomniacs · non-nightmare',
    clinical: 'Clinical · nightmare / grief / PTSD',
  };
  // Tier 1 first, then Tier 2, then Tier 3 / earned-only segments.
  const SEG_ORDER = [
    'biohackers', 'lucid', 'pregnancy', 'perimenopause',
    'consciousness', 'creatives', 'sleep_general', 'clinical',
  ];
  const TIER_LABEL = {
    biohackers: 'Tier 1', lucid: 'Tier 1', pregnancy: 'Tier 1', perimenopause: 'Tier 1',
    consciousness: 'Tier 2', creatives: 'Tier 2', sleep_general: 'Tier 2',
    clinical: 'Tier 3 · earned-only',
  };

  const colorFor = (name) => {
    const key = (name || '').toLowerCase().split(/[\s_-]+/)[0];
    return SEGMENT_COLORS[key] || SEGMENT_COLORS[name] || '#d8d2c8';
  };
  const titleFor = (slug) => TITLES[slug] || slug;
  const fmtPct = (x) => Math.round((x || 0) * 100) + '%';

  function topPhrase(phrases, classification) {
    if (!Array.isArray(phrases)) return null;
    // Prefer the highest-distinctiveness phrase of the requested class.
    const hits = phrases
      .filter((p) => (p && p.classification) === classification)
      .sort((a, b) => (b.distinctiveness || 0) - (a.distinctiveness || 0));
    return hits[0] || null;
  }

  function topChannelFor(seg, channels) {
    // channels: pulse.partnership_ranking.top, already sorted by density_qualified.
    if (!Array.isArray(channels)) return null;
    const hits = channels.filter((c) => c && c.segment === seg);
    return hits[0] || null;
  }

  function renderPlayCard(seg, atlasPhrases, channel, persona) {
    const card = document.createElement('article');
    card.className = 'gtm-play';
    card.style.setProperty('--accent', colorFor(seg));

    // Header — colored dot, segment title, tier badge.
    const head = document.createElement('div');
    head.className = 'gtm-play__head';
    const dot = document.createElement('span');
    dot.className = 'gtm-play__dot';
    dot.style.background = colorFor(seg);
    head.appendChild(dot);
    const title = document.createElement('div');
    title.className = 'gtm-play__title';
    title.textContent = titleFor(seg);
    head.appendChild(title);
    const tier = document.createElement('span');
    tier.className = 'gtm-play__tier';
    tier.textContent = TIER_LABEL[seg] || '';
    head.appendChild(tier);
    card.appendChild(head);

    const body = document.createElement('div');
    body.className = 'gtm-play__body';

    // Row 1 — Where to show up.
    const whereRow = document.createElement('div');
    whereRow.className = 'gtm-play__row';
    const whereLbl = document.createElement('div');
    whereLbl.className = 'gtm-play__label';
    whereLbl.textContent = 'Where to show up';
    whereRow.appendChild(whereLbl);
    const whereVal = document.createElement('div');
    whereVal.className = 'gtm-play__value';
    if (channel && channel.subreddit) {
      const subLink = document.createElement('span');
      subLink.className = 'gtm-play__channel';
      subLink.textContent = 'r/' + channel.subreddit;
      whereVal.appendChild(subLink);
      const meta = document.createElement('span');
      meta.className = 'gtm-play__meta';
      meta.textContent = ' · ' + fmtPct(channel.density_qualified) + ' qualified density, ' +
                         channel.qualified_authors + ' of ' + channel.unique_authors + ' authors';
      whereVal.appendChild(meta);
    } else {
      whereVal.textContent = '—';
      whereVal.classList.add('gtm-play__value--muted');
    }
    whereRow.appendChild(whereVal);
    body.appendChild(whereRow);

    // Row 2 — What to say (one pain, one aspiration).
    const sayRow = document.createElement('div');
    sayRow.className = 'gtm-play__row';
    const sayLbl = document.createElement('div');
    sayLbl.className = 'gtm-play__label';
    sayLbl.textContent = 'What to say';
    sayRow.appendChild(sayLbl);
    const sayVal = document.createElement('div');
    sayVal.className = 'gtm-play__value gtm-play__value--chips';
    const pain = topPhrase(atlasPhrases, 'pain');
    const aspiration = topPhrase(atlasPhrases, 'aspiration');
    if (pain) {
      const chip = document.createElement('span');
      chip.className = 'gtm-chip gtm-chip--pain';
      chip.textContent = pain.phrase;
      sayVal.appendChild(chip);
    }
    if (aspiration) {
      const chip = document.createElement('span');
      chip.className = 'gtm-chip gtm-chip--aspiration';
      chip.textContent = aspiration.phrase;
      sayVal.appendChild(chip);
    }
    if (!pain && !aspiration) {
      sayVal.textContent = '—';
      sayVal.classList.add('gtm-play__value--muted');
    }
    sayRow.appendChild(sayVal);
    body.appendChild(sayRow);

    // Row 3 — How to activate (persona.activation_hook).
    const actRow = document.createElement('div');
    actRow.className = 'gtm-play__row';
    const actLbl = document.createElement('div');
    actLbl.className = 'gtm-play__label';
    actLbl.textContent = 'How to activate';
    actRow.appendChild(actLbl);
    const actVal = document.createElement('div');
    actVal.className = 'gtm-play__value gtm-play__value--hook';
    const hookText = persona && persona.activation_hook;
    if (hookText) {
      actVal.textContent = hookText;
    } else {
      actVal.textContent = '—';
      actVal.classList.add('gtm-play__value--muted');
    }
    actRow.appendChild(actVal);
    body.appendChild(actRow);

    card.appendChild(body);
    return card;
  }

  function renderChannelRow(channel, maxDensity) {
    const row = document.createElement('div');
    row.className = 'gtm-channel';
    row.style.setProperty('--accent', colorFor(channel.segment));

    const dot = document.createElement('span');
    dot.className = 'gtm-channel__dot';
    dot.style.background = colorFor(channel.segment);
    row.appendChild(dot);

    const sub = document.createElement('div');
    sub.className = 'gtm-channel__sub';
    sub.textContent = 'r/' + channel.subreddit;
    row.appendChild(sub);

    const seg = document.createElement('div');
    seg.className = 'gtm-channel__seg';
    seg.textContent = titleFor(channel.segment);
    row.appendChild(seg);

    const bar = document.createElement('div');
    bar.className = 'gtm-channel__bar';
    const fill = document.createElement('div');
    fill.className = 'gtm-channel__fill';
    const pct = maxDensity ? ((channel.density_qualified || 0) / maxDensity) * 100 : 0;
    fill.style.width = Math.max(2, Math.round(pct)) + '%';
    fill.style.background = colorFor(channel.segment);
    bar.appendChild(fill);
    row.appendChild(bar);

    const num = document.createElement('div');
    num.className = 'gtm-channel__num';
    num.textContent = fmtPct(channel.density_qualified) + ' · ' + channel.qualified_authors + ' qualified';
    row.appendChild(num);

    return row;
  }

  function render(pulse) {
    const grid = document.getElementById('gtmPlays');
    const empty = document.getElementById('gtmPlaysEmpty');
    const channelsCard = document.getElementById('gtmChannels');
    const channelList = document.getElementById('gtmChannelList');
    if (!grid) return;

    const atlas = (pulse && pulse.messaging_atlas) || {};
    const channels = (pulse && pulse.partnership_ranking && pulse.partnership_ranking.top) || [];
    const personas = (pulse && pulse.personas && pulse.personas.personas) || {};

    // Require at least one piece of validated signal before we replace
    // the empty state. Otherwise the day-zero copy stays authoritative.
    const hasSignal =
      Object.keys(atlas).length > 0 ||
      channels.length > 0 ||
      Object.keys(personas).length > 0;
    if (!hasSignal) return;

    // Clear everything except the empty-state placeholder.
    Array.from(grid.querySelectorAll('.gtm-play')).forEach((el) => el.remove());
    if (empty) empty.remove();

    // Preserve the canonical tier ordering; append any segments we don't
    // know about at the end so unexpected additions are still visible.
    const known = new Set(SEG_ORDER);
    const allSegs = new Set([
      ...Object.keys(atlas),
      ...Object.keys(personas),
      ...channels.map((c) => c.segment).filter(Boolean),
    ]);
    const ordered = SEG_ORDER.filter((s) => allSegs.has(s))
      .concat(Array.from(allSegs).filter((s) => !known.has(s)).sort());

    ordered.forEach((seg) => {
      const card = renderPlayCard(
        seg,
        atlas[seg] || [],
        topChannelFor(seg, channels),
        personas[seg] || null,
      );
      grid.appendChild(card);
    });

    // Bottom channel table — sorted by density_qualified desc, top 8.
    if (channelsCard && channelList && channels.length) {
      const topN = channels.slice().sort(function (a, b) {
        return (b.density_qualified || 0) - (a.density_qualified || 0);
      }).slice(0, 8);
      const maxDensity = topN.reduce(function (m, c) {
        return Math.max(m, c.density_qualified || 0);
      }, 0) || 1;
      channelList.innerHTML = '';
      topN.forEach((c) => channelList.appendChild(renderChannelRow(c, maxDensity)));
      channelsCard.hidden = false;
    }
  }

  function tryRender() {
    const pulse = window.DUST_PULSE;
    if (pulse) { render(pulse); return true; }
    return false;
  }
  if (!tryRender()) document.addEventListener('pulse-loaded', tryRender, { once: true });
})();


// ============================================================================
// Block 16 — Threshold note renderer
// Surfaces the qualified-author threshold used in today's pulse, so the
// variance panel is honest about what it's counting.
// ============================================================================
(function () {
  function render() {
    const el = document.getElementById('thresholdNote');
    const body = document.getElementById('thresholdNoteBody');
    if (!el || !body) return;
    const t = window.DUST_PULSE && window.DUST_PULSE.partnership_ranking
      && window.DUST_PULSE.partnership_ranking.thresholds;
    if (!t || t.qualified == null) return;
    body.textContent =
      '"Qualified" = composite score ≥ ' + t.qualified +
      ' across the rubric (signal density, representativeness, commitment, novel learning, reachability, segment-fit confidence). ' +
      '"Engaged" ≥ ' + t.engaged + '. ' +
      'v1 used 3.5 — inaugural scoring compressed non-biohacker segments (creatives max 3.46, insomniacs 3.16), zeroing them out. ' +
      'Next iteration will shift to segment-relative qualification and a segment-aware rubric.';
    el.hidden = false;
  }
  function tryRender() {
    if (window.DUST_PULSE) { render(); return true; }
    return false;
  }
  if (!tryRender()) document.addEventListener('pulse-loaded', tryRender, { once: true });
})();
