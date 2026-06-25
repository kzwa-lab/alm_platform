/* ============================================================
   ALM Platform — Chart Helpers (Chart.js)
   ============================================================ */

const ALM_COLORS = {
  primary: '#1e40af',
  primaryLight: '#3b82f6',
  primaryFade: 'rgba(30,64,175,0.1)',
  success: '#10b981',
  successFade: 'rgba(16,185,129,0.1)',
  warning: '#f59e0b',
  warningFade: 'rgba(245,158,11,0.1)',
  danger: '#ef4444',
  dangerFade: 'rgba(239,68,68,0.1)',
  info: '#06b6d4',
  infoFade: 'rgba(6,182,212,0.1)',
  slate: ['#64748b','#94a3b8','#cbd5e1','#e2e8f0','#f1f5f9'],
  chartPalette: ['#1e40af','#3b82f6','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']
};

/* Chart.js defaults */
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = '#64748b';
Chart.defaults.borderColor = '#e2e8f0';
Chart.defaults.plugins.tooltip.backgroundColor = '#1e293b';
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 6;

/* ── Bar Chart ───────────────────────────────────────────── */
function createBarChart(canvasId, labels, datasets, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
        x: { grid: { display: false } }
      },
      ...options
    }
  });
}

/* ── Line Chart ──────────────────────────────────────────── */
function createLineChart(canvasId, labels, datasets, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  return new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: false, grid: { color: '#f1f5f9' } },
        x: { grid: { display: false } }
      },
      elements: { line: { tension: 0.3 }, point: { radius: 3, hoverRadius: 5 } },
      ...options
    }
  });
}

/* ── Pie / Donut Chart ───────────────────────────────────── */
function createPieChart(canvasId, labels, data, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ALM_COLORS.chartPalette,
        borderWidth: 2, borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '60%',
      plugins: { legend: { position: 'bottom' } },
      ...options
    }
  });
}

/* ── Gauge Chart (semi-circle) ───────────────────────────── */
function createGaugeChart(canvasId, value, min, max, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  const pct = (value - min) / (max - min);
  const color = pct < 0.33 ? ALM_COLORS.danger : pct < 0.66 ? ALM_COLORS.warning : ALM_COLORS.success;
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Value','Remainder'],
      datasets: [{
        data: [value, max - value],
        backgroundColor: [color, '#e2e8f0'],
        borderWidth: 0, circumference: 180, rotation: 270
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      ...options
    }
  });
}

/* ── Waterfall Chart (using floating bars) ───────────────── */
function createWaterfallChart(canvasId, labels, values, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  let cumulative = 0;
  const data = [];
  const bgColors = [];
  values.forEach((v, i) => {
    if (i === 0) {
      data.push([0, v]); cumulative = v;
    } else if (i === values.length - 1) {
      data.push([0, v]);
    } else {
      data.push([cumulative, cumulative + v]);
      cumulative += v;
    }
    bgColors.push(i === 0 || i === values.length - 1 ? ALM_COLORS.primary : v >= 0 ? ALM_COLORS.success : ALM_COLORS.danger);
  });
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data, backgroundColor: bgColors, borderRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
        x: { grid: { display: false } }
      },
      ...options
    }
  });
}

/* ── Horizontal Bar (for gap analysis) ───────────────────── */
function createHorizontalBarChart(canvasId, labels, datasets, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        x: { grid: { color: '#f1f5f9' } },
        y: { grid: { display: false } }
      },
      ...options
    }
  });
}

/* ── Mixed Chart (bar + line) ────────────────────────────── */
function createMixedChart(canvasId, labels, barData, lineData, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { type: 'bar', data: barData, backgroundColor: ALM_COLORS.primaryFade, borderColor: ALM_COLORS.primary, borderWidth: 1, borderRadius: 4 },
        { type: 'line', data: lineData, borderColor: ALM_COLORS.danger, backgroundColor: ALM_COLORS.dangerFade, fill: false, tension: 0.3, pointRadius: 3 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
        x: { grid: { display: false } }
      },
      ...options
    }
  });
}

/* ============================================================
   Demo Data Generators
   ============================================================ */

function generateMonthlyLabels(months = 12) {
  const monthsArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const result = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(`${monthsArr[d.getMonth()]} ${d.getFullYear()}`);
  }
  return result;
}

function generateSeries(count, min, max, decimals = 2) {
  return Array.from({ length: count }, () => +(Math.random() * (max - min) + min).toFixed(decimals));
}

function generateTrendSeries(count, start, trend, volatility, decimals = 2) {
  const arr = [];
  let val = start;
  for (let i = 0; i < count; i++) {
    val += trend + (Math.random() - 0.5) * volatility;
    arr.push(+val.toFixed(decimals));
  }
  return arr;
}

function formatCurrency(value, currency = 'EUR') {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

function formatPercent(value, decimals = 2) {
  return value.toFixed(decimals) + '%';
}

function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat('en-GB', { maximumFractionDigits: decimals }).format(value);
}
