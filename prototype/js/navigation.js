/* ============================================================
   ALM Platform — Navigation & Sidebar Behavior
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initMobileMenu();
  highlightActiveModule();
  generateBreadcrumbs();
});

/* ── Sidebar Expand/Collapse ─────────────────────────────── */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const toggleBtn = document.getElementById('sidebarToggle');
  const stored = localStorage.getItem('alm-sidebar-collapsed');

  if (stored === 'true') {
    sidebar?.classList.add('collapsed');
    mainContent?.classList.add('sidebar-collapsed');
  }

  toggleBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('sidebar-collapsed');
    localStorage.setItem('alm-sidebar-collapsed', sidebar.classList.contains('collapsed'));
  });

  // Submenu toggles
  document.querySelectorAll('.nav-item.has-submenu').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const submenu = item.nextElementSibling;
      const isOpen = submenu.classList.contains('open');
      // Close all siblings
      item.closest('.sidebar-nav')?.querySelectorAll('.nav-submenu.open').forEach(s => {
        if (s !== submenu) s.classList.remove('open');
      });
      item.closest('.sidebar-nav')?.querySelectorAll('.nav-item.expanded').forEach(i => {
        if (i !== item) i.classList.remove('expanded');
      });
      submenu.classList.toggle('open', !isOpen);
      item.classList.toggle('expanded', !isOpen);
    });
  });
}

/* ── Mobile Menu Toggle ──────────────────────────────────── */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const sidebar = document.getElementById('sidebar');

  mobileToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar?.classList.contains('mobile-open')) {
      if (!sidebar.contains(e.target) && !mobileToggle?.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    }
  });
}

/* ── Active Module Highlighting ──────────────────────────── */
function highlightActiveModule() {
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (!href) return;
    const hrefFile = href.split('/').pop();
    if (hrefFile === currentFile || (currentFile === '' && hrefFile === 'index.html')) {
      item.classList.add('active');
      // Expand parent submenu
      const submenu = item.closest('.nav-submenu');
      if (submenu) {
        submenu.classList.add('open');
        const parentItem = submenu.previousElementSibling;
        if (parentItem) parentItem.classList.add('expanded');
      }
    }
  });
}

/* ── Breadcrumb Generation ───────────────────────────────── */
function generateBreadcrumbs() {
  const container = document.getElementById('breadcrumbs');
  if (!container) return;

  const path = window.location.pathname.replace(/\/+$/, '');
  const parts = path.split('/').filter(p => p && !p.endsWith('.html'));
  const filename = path.split('/').pop() || 'index.html';

  const labels = {
    'alm_platform': 'Home',
    'prototype': 'ALM Platform',
    'modules': 'Modules',
    'data-foundation': 'Data Foundation',
    'liquidity-risk': 'Liquidity Risk',
    'interest-rate-risk': 'Interest Rate Risk',
    'capital-management': 'Capital Management',
    'expected-credit-loss': 'Expected Credit Loss',
    'funds-transfer-pricing': 'Funds Transfer Pricing',
    'balance-sheet-optimization': 'Balance Sheet Optimization',
    'recovery-planning': 'Recovery Planning',
    'grc-risk-framework': 'GRC & Risk Framework',
    'regulatory-reporting': 'Regulatory Reporting (ORASS)',
    'behavioural-models': 'Behavioural Models',
    'cyber-security': 'Cyber Security',
    'rtgs-intraday-liquidity': 'RTGS & Intraday Liquidity'
  };

  const fileLabels = {
    'index.html': 'Dashboard',
    'lcr-calculator.html': 'LCR Calculator',
    'nsfr-monitor.html': 'NSFR Monitor',
    'stress-testing.html': 'Stress Testing',
    'eve-sensitivity.html': 'EVE Sensitivity',
    'nii-forecast.html': 'NII Forecast',
    'gap-analysis.html': 'Gap Analysis',
    'rwa-calculator.html': 'RWA Calculator',
    'output-floor.html': 'Output Floor',
    'ecl-engine.html': 'ECL Engine',
    'sicr-monitor.html': 'SICR Monitor',
    'curve-builder.html': 'Curve Builder',
    'deal-pricer.html': 'Deal Pricer',
    'nim-dashboard.html': 'NIM Dashboard',
    'hedging-tracker.html': 'Hedging Tracker',
    'recovery-plan.html': 'Recovery Plan',
    'grc-framework.html': 'GRC Framework',
    'orass-builder.html': 'ORASS Builder',
    'behavioural-model.html': 'Behavioural Model',
    'cyber-dashboard.html': 'Cyber Dashboard',
    'rtgs-monitor.html': 'RTGS Monitor'
  };

  let html = `<a href="${getRelativePath('index.html')}">Home</a>`;
  let accum = '';

  parts.forEach(part => {
    accum += part + '/';
    const label = labels[part] || part;
    html += ` <span class="sep">/</span> <span>${label}</span>`;
  });

  const fileLabel = fileLabels[filename] || filename;
  html += ` <span class="sep">/</span> <span class="current">${fileLabel}</span>`;
  container.innerHTML = html;
}

/* Helper: get relative path to root */
function getRelativePath(target) {
  const depth = window.location.pathname.split('/').filter(p => p && !p.endsWith('.html')).length - 2;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  return prefix + target;
}

/* ── Utility: Debounce ───────────────────────────────────── */
function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/* ── Utility: Number Input Formatter ─────────────────────── */
function formatInputNumber(el) {
  const raw = el.value.replace(/[^\d.]/g, '');
  el.dataset.raw = raw;
  if (raw) el.value = new Intl.NumberFormat('en-GB').format(parseFloat(raw));
}

function getInputNumber(el) {
  return parseFloat(el.dataset.raw || el.value.replace(/[^\d.\-]/g, '')) || 0;
}
