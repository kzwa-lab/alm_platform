/**
 * ALM Operational Platform — MVP Frontend
 * Single-page app with hash routing, ECharts visualizations, and dummy data.
 */

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const COLORS = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#1D4ED8',
  success: '#10B981',
  successLight: '#34D399',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  alert: '#F43F5E',
  alertLight: '#FB7185',
  violet: '#8B5CF6',
  cyan: '#06B6D4',
  orange: '#F97316',
  pink: '#EC4899',
  lime: '#84CC16',
  indigo: '#6366F1',
  gray: '#94A3B8',
  grayLight: '#CBD5E1'
};

const ECHARTS_THEME = {
  color: [COLORS.primary, COLORS.success, COLORS.warning, COLORS.alert, COLORS.violet, COLORS.cyan, COLORS.orange, COLORS.pink, COLORS.lime, COLORS.indigo],
  backgroundColor: 'transparent'
};

// ---------------------------------------------------------------------------
// Navigation Structure
// ---------------------------------------------------------------------------

const NAV_STRUCTURE = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', route: 'dashboard' },
  {
    id: 'liquidity',
    label: 'Liquidity Risk',
    icon: 'droplets',
    color: '#06B6D4',
    children: [
      { id: 'liquidity-overview', label: 'Overview', route: 'liquidity' },
      { id: 'liquidity-lcr', label: 'LCR Analysis', route: 'liquidity-lcr' },
      { id: 'liquidity-nsfr', label: 'NSFR Monitor', route: 'liquidity-nsfr' },
      { id: 'liquidity-gap', label: 'Gap Analysis', route: 'liquidity-gap' },
      { id: 'liquidity-stress', label: 'Stress Testing', route: 'liquidity-stress' },
      { id: 'liquidity-cfp', label: 'CFP Triggers', route: 'liquidity-cfp' }
    ]
  },
  {
    id: 'irrbb',
    label: 'IRRBB',
    icon: 'trending-up',
    color: '#8B5CF6',
    children: [
      { id: 'irrbb-overview', label: 'Overview', route: 'irrbb' },
      { id: 'irrbb-eve', label: 'EVE Sensitivity', route: 'irrbb-eve' },
      { id: 'irrbb-nii', label: 'NII Forecast', route: 'irrbb-nii' },
      { id: 'irrbb-gap', label: 'Repricing Gap', route: 'irrbb-gap' },
      { id: 'irrbb-dgap', label: 'Duration Gap', route: 'irrbb-dgap' },
      { id: 'irrbb-derivatives', label: 'Derivatives', route: 'irrbb-derivatives' }
    ]
  },
  {
    id: 'capital',
    label: 'Capital Adequacy',
    icon: 'shield',
    color: '#10B981',
    children: [
      { id: 'capital-overview', label: 'Overview', route: 'capital' },
      { id: 'capital-ratios', label: 'Capital Ratios', route: 'capital-ratios' },
      { id: 'capital-rwa', label: 'RWA Composition', route: 'capital-rwa' },
      { id: 'capital-icaap', label: 'ICAAP Planning', route: 'capital-icaap' },
      { id: 'capital-mrel', label: 'MREL / TLAC', route: 'capital-mrel' }
    ]
  },
  {
    id: 'ecl',
    label: 'ECL / Credit Risk',
    icon: 'alert-triangle',
    color: '#F59E0B',
    children: [
      { id: 'ecl-overview', label: 'Overview', route: 'ecl' },
      { id: 'ecl-staging', label: 'Staging Distribution', route: 'ecl-staging' },
      { id: 'ecl-sicr', label: 'SICR Monitor', route: 'ecl-sicr' },
      { id: 'ecl-scenarios', label: 'Macro Scenarios', route: 'ecl-scenarios' },
      { id: 'ecl-overlays', label: 'Overlay Governance', route: 'ecl-overlays' }
    ]
  },
  {
    id: 'ftp',
    label: 'FTP & Pricing',
    icon: 'arrow-left-right',
    color: '#6366F1',
    children: [
      { id: 'ftp-overview', label: 'Overview', route: 'ftp' },
      { id: 'ftp-curve', label: 'FTP Curve', route: 'ftp-curve' },
      { id: 'ftp-nmd', label: 'NMD Portfolio', route: 'ftp-nmd' },
      { id: 'ftp-pricing', label: 'Deal Pricing', route: 'ftp-pricing' },
      { id: 'ftp-profitability', label: 'Profitability', route: 'ftp-profitability' }
    ]
  },
  {
    id: 'optimization',
    label: 'Optimization',
    icon: 'target',
    color: '#EC4899',
    children: [
      { id: 'optimization-overview', label: 'Overview', route: 'optimization' },
      { id: 'optimization-nim', label: 'NIM Attribution', route: 'optimization-nim' },
      { id: 'optimization-scenarios', label: 'What-If Builder', route: 'optimization-scenarios' },
      { id: 'optimization-alcopack', label: 'ALCO Pack', route: 'optimization-alcopack' }
    ]
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: 'file-bar-chart',
    color: '#64748B',
    children: [
      { id: 'reports-overview', label: 'Overview', route: 'reports' },
      { id: 'reports-submissions', label: 'Submissions', route: 'reports-submissions' }
    ]
  },
  { id: 'data-foundation', label: 'Data Foundation', icon: 'database', route: 'data-foundation' },
  {
    id: 'recovery',
    label: 'Recovery Planning',
    icon: 'life-buoy',
    color: '#F97316',
    children: [
      { id: 'recovery-overview', label: 'Overview', route: 'recovery' },
      { id: 'recovery-triggers', label: 'Triggers', route: 'recovery-triggers' },
      { id: 'recovery-playbooks', label: 'Playbooks', route: 'recovery-playbooks' },
      { id: 'recovery-capital', label: 'Capital Restoration', route: 'recovery-capital' }
    ]
  },
  {
    id: 'grc',
    label: 'GRC & Risk Framework',
    icon: 'shield-check',
    color: '#EF4444',
    children: [
      { id: 'grc-overview', label: 'Overview', route: 'grc' },
      { id: 'grc-universe', label: 'Risk Universe', route: 'grc-universe' },
      { id: 'grc-limits', label: 'Limits', route: 'grc-limits' },
      { id: 'grc-breaches', label: 'Breaches', route: 'grc-breaches' },
      { id: 'grc-3lod', label: '3LoD', route: 'grc-3lod' }
    ]
  },
  {
    id: 'regulatory',
    label: 'Regulatory Reporting (ORASS)',
    icon: 'file-check',
    color: '#14B8A6',
    children: [
      { id: 'regulatory-overview', label: 'Overview', route: 'regulatory' },
      { id: 'regulatory-builder', label: 'ORASS Builder', route: 'regulatory-builder' },
      { id: 'regulatory-tracker', label: 'Submission Tracker', route: 'regulatory-tracker' },
      { id: 'regulatory-bog', label: 'BoG Returns', route: 'regulatory-bog' }
    ]
  },
  {
    id: 'behavioural',
    label: 'Behavioural Models',
    icon: 'brain',
    color: '#A855F7',
    children: [
      { id: 'behavioural-overview', label: 'Overview', route: 'behavioural' },
      { id: 'behavioural-nmd', label: 'NMD Models', route: 'behavioural-nmd' },
      { id: 'behavioural-cpr', label: 'CPR/TDRR', route: 'behavioural-cpr' },
      { id: 'behavioural-inventory', label: 'Model Inventory', route: 'behavioural-inventory' }
    ]
  },
  {
    id: 'cyber',
    label: 'Cyber Security',
    icon: 'lock',
    color: '#64748B',
    children: [
      { id: 'cyber-overview', label: 'Overview', route: 'cyber' },
      { id: 'cyber-residency', label: 'Data Residency', route: 'cyber-residency' },
      { id: 'cyber-access', label: 'Access Controls', route: 'cyber-access' },
      { id: 'cyber-audit', label: 'Audit Trail', route: 'cyber-audit' }
    ]
  },
  {
    id: 'rtgs',
    label: 'RTGS & Intraday Liquidity',
    icon: 'zap',
    color: '#EAB308',
    children: [
      { id: 'rtgs-overview', label: 'Overview', route: 'rtgs' },
      { id: 'rtgs-feed', label: 'RTGS Feed', route: 'rtgs-feed' },
      { id: 'rtgs-intraday', label: 'Intraday Monitor', route: 'rtgs-intraday' },
      { id: 'rtgs-settlement', label: 'Settlement Risk', route: 'rtgs-settlement' }
    ]
  }
];

// ---------------------------------------------------------------------------
// Dummy Data
// ---------------------------------------------------------------------------

const DUMMY = {
  dashboard: {
    kpis: [
      { label: 'CET1 Ratio', value: '14.2%', trend: '+0.3pp', status: 'green', target: '≥ 10.0%', sparkline: [13.9, 13.95, 14.0, 14.05, 14.1, 14.15, 14.2] },
      { label: 'LMTD', value: '136.2%', trend: '-2.1pp', status: 'green', target: '≥ 100%', sparkline: [138.5, 137.8, 137.0, 136.5, 136.0, 135.5, 136.2] },
      { label: 'LRMD', value: '108.3%', trend: '0.0pp', status: 'amber', target: '≥ 100%', sparkline: [107.8, 107.9, 108.0, 108.1, 108.2, 108.25, 108.3] },
      { label: 'EVE Δ', value: '-8.2%', trend: '+1.2pp', status: 'green', target: '≥ -10%', sparkline: [-9.4, -9.2, -9.0, -8.8, -8.6, -8.4, -8.2] },
      { label: 'NIM', value: '12.85%', trend: '-5bp', status: 'amber', target: '≥ 12.0%', sparkline: [12.90, 12.89, 12.88, 12.87, 12.86, 12.86, 12.85] },
      { label: 'Total RWA', value: '₵184.2B', trend: '+1.2%', status: 'neutral', target: '—', sparkline: [182.0, 182.4, 182.8, 183.2, 183.6, 183.9, 184.2] }
    ],
    alerts: [
      { severity: 'success', icon: 'check-circle', title: 'System Normal', desc: 'All critical metrics within acceptable thresholds.', time: 'Now' },
      { severity: 'warning', icon: 'alert-circle', title: 'LMTD Watch — 118.3%', desc: 'Branch network LMTD approaching 120% warning threshold.', time: '12 min ago' },
      { severity: 'critical', icon: 'x-circle', title: 'ECL Overlay Pending', desc: '₵4.2M climate risk overlay requires Risk Committee sign-off.', time: '1h ago' },
      { severity: 'warning', icon: 'alert-circle', title: 'LRMD Approaching Limit', desc: 'Wholesale funding concentration at 28% (limit: 30%).', time: '3h ago' }
    ],
    actions: [
      { title: 'ECL Overlay ₵4.2M', meta: 'Due: 30 Jun 2026 • Awaiting Risk Committee', priority: 'medium' },
      { title: 'FTP Curve Update', meta: 'Due: 28 Jun 2026 • Awaiting Treasury Head', priority: 'high' },
      { title: 'Liquidity Limit Override', meta: 'Due: 27 Jun 2026 • Awaiting CRO', priority: 'high' }
    ],
    meetings: [
      { title: 'ALCO Monthly Meeting', meta: '2 Jul 2026, 10:00 GMT • LMTD Stress, Capital Plan' },
      { title: 'ALCO Extraordinary', meta: '15 Jul 2026, 14:00 GMT • IRRBB Strategy Review' }
    ],
    news: [
      { title: 'BoG Issues Revised ORASS Guidance', desc: 'New guidance on monthly ORASS reporting effective Q3 2026.', source: 'Bank of Ghana', time: '2h ago', type: 'regulatory' },
      { title: 'GSE Composite Index Reaches New High', desc: 'Ghana Stock Exchange composite index up 4.2% on banking sector rally.', source: 'GSE', time: '5h ago', type: 'market' },
      { title: 'IFRS 9 Amendments — Effective 2027', desc: 'IASB issues amendments to impairment model for low credit risk.', source: 'IASB', time: '1d ago', type: 'accounting' },
      { title: 'BoG Policy Rate Maintained at 25.50%', desc: 'Monetary Policy Committee holds rate at 25.50% citing inflation outlook.', source: 'BoG MPC', time: '2d ago', type: 'regulatory' }
    ],
    calendarEvents: [
      { day: 27, title: 'Liquidity Stress Test Run', type: 'internal' },
      { day: 28, title: 'FTP Curve Approval Due', type: 'approval' },
      { day: 30, title: 'Quarter-End Reporting Deadline', type: 'reporting' },
      { day: 2, title: 'ALCO Monthly Meeting', type: 'meeting', monthOffset: 1 },
      { day: 9, title: 'ORASS Monthly Submission', type: 'regulatory', monthOffset: 1 },
      { day: 15, title: 'BoG LMTD Submission', type: 'regulatory', monthOffset: 1 },
      { day: 31, title: 'Recovery Plan Annual Update', type: 'regulatory', monthOffset: 6 }
    ]
  },
  liquidity: {
    lcr: {
      ratio: 136.2,
      hqla: 234.5,
      level1: 198.2,
      level2a: 24.8,
      level2b: 11.5,
      outflows: 172.3,
      retail: 45.2,
      wholesale: 78.5,
      secured: 28.3,
      additional: 15.8,
      inflows: 24.5
    },
    nsfr: {
      ratio: 108.3,
      asf: 222.4,
      rsf: 157.3,
      categories: [
        { name: 'Capital', asf: 45.2, rsf: 0 },
        { name: 'Retail Deposits', asf: 98.5, rsf: 32.4 },
        { name: 'Wholesale Funding', asf: 28.3, rsf: 48.7 },
        { name: 'Interbank', asf: 15.2, rsf: 22.1 },
        { name: 'Secured Funding', asf: 22.8, rsf: 35.6 },
        { name: 'Other', asf: 12.4, rsf: 18.5 }
      ]
    },
    stress: [
      { scenario: 'Baseline', before: 136.2, after: 134.8, hqlaChange: -1.2, outflowChange: 0.8, status: 'green' },
      { scenario: 'Idiosyncratic', before: 136.2, after: 112.5, hqlaChange: -12.5, outflowChange: 28.3, status: 'amber' },
      { scenario: 'Market Stress', before: 136.2, after: 118.3, hqlaChange: -8.2, outflowChange: 15.6, status: 'amber' },
      { scenario: 'Combined', before: 136.2, after: 98.7, hqlaChange: -22.1, outflowChange: 42.1, status: 'red' }
    ],
    gap: [
      { bucket: 'O/N', inflows: 45.2, outflows: 32.8, net: 12.4, cumulative: 12.4 },
      { bucket: '1W', inflows: 28.5, outflows: 36.7, net: -8.2, cumulative: 4.2 },
      { bucket: '1M', inflows: 52.3, outflows: 46.7, net: 5.6, cumulative: 9.8 },
      { bucket: '3M', inflows: 38.4, outflows: 53.7, net: -15.3, cumulative: -5.5 },
      { bucket: '6M', inflows: 68.2, outflows: 46.1, net: 22.1, cumulative: 16.6 },
      { bucket: '1Y', inflows: 42.5, outflows: 47.2, net: -4.7, cumulative: 11.9 },
      { bucket: '>1Y', inflows: 125.4, outflows: 98.3, net: 27.1, cumulative: 39.0 }
    ],
    cfp: {
      phase: 'NORMAL',
      ewis: [
        { name: 'LCR 30-day trend', current: '-1.5pp', threshold: '-5pp', status: 'green' },
        { name: 'Wholesale funding conc.', current: '28%', threshold: '35%', status: 'green' },
        { name: 'Daily deposit outflows', current: '₵5M', threshold: '₵50M', status: 'green' },
        { name: 'Credit rating (Fitch)', current: 'A', threshold: 'BBB', status: 'green' },
        { name: 'Collateral available', current: '₵1.2bn', threshold: '₵500M', status: 'green' },
        { name: '5Y CDS spread', current: '85bps', threshold: '200bps', status: 'green' }
      ]
    },
    funding: [
      { source: 'Retail Deposits', amount: 98.5, pct: 42 },
      { source: 'Wholesale Funding', amount: 72.3, pct: 31 },
      { source: 'Central Bank', amount: 42.1, pct: 18 },
      { source: 'Secured Funding', amount: 21.5, pct: 9 }
    ],
    intraday: [
      { time: '08:00', req: 8.2 }, { time: '09:00', req: 12.5 }, { time: '10:00', req: 10.3 },
      { time: '11:00', req: 14.2 }, { time: '12:00', req: 13.8 }, { time: '13:00', req: 16.5 },
      { time: '14:00', req: 15.2 }, { time: '15:00', req: 18.7 }, { time: '16:00', req: 22.4 },
      { time: '16:30', req: 24.3 }, { time: '17:00', req: 20.1 }, { time: '18:00', req: 12.3 }
    ]
  },
  irrbb: {
    eve: {
      base: -82,
      worst: { scenario: 'Parallel Up +200bps', value: -85, pctT1: 8.5 },
      scenarios: [
        { name: 'Parallel Up', value: -85, pct: 8.5 },
        { name: 'Parallel Down', value: 62, pct: 6.2 },
        { name: 'Steepener', value: -45, pct: 4.5 },
        { name: 'Flattener', value: -30, pct: 3.0 },
        { name: 'Short Rate Up', value: -55, pct: 5.5 },
        { name: 'Short Rate Down', value: 40, pct: 4.0 }
      ]
    },
    nii: {
      base: [285, 282, 280, 278, 276, 275, 274, 273, 272, 271, 270, 269],
      upside: [295, 292, 290, 288, 286, 285, 284, 283, 282, 281, 280, 279],
      downside: [275, 272, 270, 268, 266, 265, 264, 263, 262, 261, 260, 259],
      ciLow: [278, 275, 273, 271, 269, 268, 267, 266, 265, 264, 263, 262],
      ciHigh: [292, 289, 287, 285, 283, 282, 281, 280, 279, 278, 277, 276]
    },
    gap: [
      { bucket: 'O/N', rsa: 85.2, rsl: 72.4, net: 12.8, cum: 12.8 },
      { bucket: '1M', rsa: 65.3, rsl: 58.2, net: 7.1, cum: 19.9 },
      { bucket: '3M', rsa: 78.5, rsl: 82.1, net: -3.6, cum: 16.3 },
      { bucket: '6M', rsa: 92.4, rsl: 68.5, net: 23.9, cum: 40.2 },
      { bucket: '1Y', rsa: 45.2, rsl: 38.7, net: 6.5, cum: 46.7 },
      { bucket: '2Y', rsa: 35.8, rsl: 42.3, net: -6.5, cum: 40.2 },
      { bucket: '3Y', rsa: 28.4, rsl: 32.1, net: -3.7, cum: 36.5 },
      { bucket: '5Y', rsa: 42.5, rsl: 28.4, net: 14.1, cum: 50.6 },
      { bucket: '7Y', rsa: 18.3, rsl: 15.2, net: 3.1, cum: 53.7 },
      { bucket: '10Y', rsa: 22.1, rsl: 12.5, net: 9.6, cum: 63.3 },
      { bucket: '>10Y', rsa: 15.2, rsl: 8.4, net: 6.8, cum: 70.1 }
    ],
    yield: {
      tenors: ['3M', '6M', '1Y', '2Y', '5Y', '7Y', '10Y', '20Y', '30Y'],
      current: [3.45, 3.38, 3.25, 3.02, 2.78, 2.68, 2.52, 2.65, 2.85],
      plus100: [4.45, 4.38, 4.25, 4.02, 3.78, 3.68, 3.52, 3.65, 3.85],
      minus100: [2.45, 2.38, 2.25, 2.02, 1.78, 1.68, 1.52, 1.65, 1.85],
      monthAgo: [3.30, 3.28, 3.18, 2.95, 2.82, 2.75, 2.60, 2.72, 2.83]
    },
    depositBeta: [
      { product: 'Savings Accounts', beta: 0.45, r2: 0.82, color: COLORS.primary },
      { product: 'Current Accounts', beta: 0.28, r2: 0.65, color: COLORS.success },
      { product: 'Term Deposits', beta: 0.78, r2: 0.91, color: COLORS.warning },
      { product: 'Corporate Deposits', beta: 0.85, r2: 0.88, color: COLORS.alert }
    ],
    nmd: {
      total: 120.0,
      core: 72.4,
      semi: 32.1,
      volatile: 15.5,
      allocation: [
        { tenor: 'O/N', core: 0, semi: 0, volatile: 15.5 },
        { tenor: '1M', core: 0, semi: 5.2, volatile: 18.3 },
        { tenor: '3M', core: 8.5, semi: 12.4, volatile: 22.1 },
        { tenor: '6M', core: 18.2, semi: 18.5, volatile: 24.8 },
        { tenor: '1Y', core: 32.4, semi: 22.1, volatile: 26.5 },
        { tenor: '2Y', core: 48.5, semi: 25.8, volatile: 28.2 },
        { tenor: '3Y', core: 58.2, semi: 28.4, volatile: 29.5 },
        { tenor: '5Y', core: 72.4, semi: 32.1, volatile: 15.5 }
      ]
    },
    derivatives: [
      { instrument: 'IR Swap (Payer)', notional: 2500, mtm: 12.4, hedge: 85, effectiveness: 92, expiry: '2Y', status: 'green' },
      { instrument: 'IR Swap (Receiver)', notional: 1800, mtm: -8.2, hedge: 78, effectiveness: 88, expiry: '5Y', status: 'green' },
      { instrument: 'IR Cap', notional: 500, mtm: 3.1, hedge: 45, effectiveness: 75, expiry: '3Y', status: 'amber' },
      { instrument: 'IR Floor', notional: 300, mtm: -1.2, hedge: 30, effectiveness: 65, expiry: '3Y', status: 'amber' },
      { instrument: 'Swaption', notional: 750, mtm: 5.4, hedge: 55, effectiveness: 80, expiry: '1Y', status: 'green' },
      { instrument: 'FRA', notional: 200, mtm: 0.8, hedge: 25, effectiveness: 70, expiry: '6M', status: 'red' }
    ],
    dv01: {
      currencies: ['GHS', 'USD', 'GBP', 'CHF', 'JPY'],
      tenors: ['O/N', '3M', '6M', '1Y', '2Y', '5Y', '10Y', '30Y'],
      data: [
        [0.02, 0.15, 0.35, 0.82, 1.45, 2.85, 3.92, 4.15],
        [0.01, 0.12, 0.28, 0.65, 1.20, 2.40, 3.50, 3.80],
        [0.01, 0.08, 0.20, 0.48, 0.92, 1.85, 2.75, 2.95],
        [0.00, 0.05, 0.12, 0.28, 0.55, 1.10, 1.65, 1.80],
        [0.00, 0.03, 0.08, 0.18, 0.35, 0.72, 1.10, 1.25]
      ]
    }
  },
  capital: {
    stack: [
      { component: 'Common Equity', value: 42.5, type: 'cet1' },
      { component: 'Retained Earnings', value: 28.3, type: 'cet1' },
      { component: 'AOCI', value: 8.2, type: 'cet1' },
      { component: 'Regulatory Deductions', value: -5.8, type: 'deduction' },
      { component: 'AT1 Instruments', value: 12.5, type: 'at1' },
      { component: 'AT1 Deductions', value: -1.2, type: 'deduction' },
      { component: 'T2 Instruments', value: 8.5, type: 't2' },
      { component: 'T2 Deductions', value: -0.8, type: 'deduction' }
    ],
    ratios: [
      { name: 'CET1', value: 14.2, min: 4.5, buffer: 10.0 },
      { name: 'Tier 1', value: 15.8, min: 6.0, buffer: 12.0 },
      { name: 'Total Capital', value: 18.5, min: 8.0, buffer: 14.5 }
    ],
    leverage: { tier1: 84.5, exposure: 1742.0, ratio: 4.85, min: 3.0 },
    rwa: {
      total: 184.2,
      byType: [
        { name: 'Credit Risk SA', value: 82.5, color: COLORS.primary },
        { name: 'Credit Risk IRB', value: 45.2, color: COLORS.violet },
        { name: 'Market Risk FRTB', value: 18.5, color: COLORS.warning },
        { name: 'Operational Risk', value: 22.4, color: COLORS.success },
        { name: 'CVA Risk', value: 15.6, color: COLORS.alert }
      ]
    },
    outputFloor: [
      { step: 'IRB RWA', value: 89.5 },
      { step: 'Floor Adj. (+)', value: 12.4 },
      { step: 'Standard RWA (+)', value: 82.5 },
      { step: 'Other Adj. (-)', value: -0.2 },
      { step: 'Final RWA', value: 184.2 }
    ],
    icaap: {
      pillar1: 52.4,
      pillar2a: 18.5,
      pillar2b: 8.2,
      available: 92.2
    },
    frtb: [
      { risk: 'Interest Rate', value: 16.5 },
      { risk: 'Default Risk Charge', value: 12.4 },
      { risk: 'Residual Risk', value: 6.2 },
      { risk: 'Equity Risk', value: 4.8 },
      { risk: 'FX Risk', value: 3.5 },
      { risk: 'Commodity Risk', value: 1.8 }
    ],
    mrel: {
      total: 133.1,
      requirement: 118.5,
      tlac: 95.2,
      components: [
        { name: 'CET1', value: 73.2 },
        { name: 'AT1', value: 11.3 },
        { name: 'T2', value: 7.7 },
        { name: 'Senior Unsecured', value: 28.5 },
        { name: 'Non-Preferred Senior', value: 12.4 }
      ]
    }
  },
  ecl: {
    total: 3245,
    coverage: 1.85,
    byStage: [
      { stage: 'Stage 1', value: 765.3, pct: 23.6, color: COLORS.success },
      { stage: 'Stage 2', value: 1340.2, pct: 41.3, color: COLORS.warning },
      { stage: 'Stage 3', value: 1139.5, pct: 35.1, color: COLORS.alert }
    ],
    trend: {
      months: ['Jul 2024', 'Oct 2024', 'Jan 2025', 'Apr 2025', 'Jul 2025', 'Oct 2025', 'Jan 2026', 'Mar 2026', 'Jun 2026'],
      total: [1850, 1920, 2050, 2180, 2450, 2820, 3050, 3160, 3245],
      stage1: [420, 440, 480, 520, 580, 650, 710, 740, 765],
      stage2: [680, 720, 780, 840, 980, 1120, 1240, 1300, 1340],
      stage3: [750, 760, 790, 820, 890, 1050, 1100, 1120, 1140]
    },
    scenarios: [
      { name: 'Base Case', value: 3245, weight: 50, color: COLORS.primary },
      { name: 'Upside', value: 2395, weight: 20, color: COLORS.success },
      { name: 'Downside', value: 3825, weight: 20, color: COLORS.warning },
      { name: 'Severe', value: 4500, weight: 10, color: COLORS.alert }
    ],
    sicr: [
      { id: 'LOAN-2024-001', exposure: 45.2, multiple: 2.8, status: 'triggered' },
      { id: 'LOAN-2024-015', exposure: 40.0, multiple: 2.4, status: 'triggered' },
      { id: 'LOAN-2023-042', exposure: 28.5, multiple: 1.8, status: 'watch' },
      { id: 'LOAN-2023-078', exposure: 22.1, multiple: 1.6, status: 'watch' },
      { id: 'LOAN-2023-091', exposure: 18.5, multiple: 1.5, status: 'watch' },
      { id: 'LOAN-2024-102', exposure: 15.2, multiple: 1.2, status: 'watch' },
      { id: 'LOAN-2024-156', exposure: 12.8, multiple: 0.9, status: 'normal' },
      { id: 'LOAN-2024-203', exposure: 8.5, multiple: 0.7, status: 'normal' }
    ],
    overlays: [
      { name: 'Climate Risk Overlay', amount: 4.2, status: 'pending', date: '30 Jun 2026', bt: null },
      { name: 'Model Risk Overlay', amount: 1.8, status: 'approved', date: '15 Jun 2026', bt: 97 },
      { name: 'Sector Concentration', amount: 2.5, status: 'approved', date: '1 Jun 2026', bt: 92 },
      { name: 'Geopolitical', amount: 1.2, status: 'closed', date: '1 Mar 2026', bt: 89 },
      { name: 'COVID-19', amount: 5.8, status: 'closed', date: '1 Sep 2025', bt: 95 }
    ],
    pd: {
      tenors: ['1Y', '2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'],
      ratings: [
        { name: 'AAA/AA', values: [0.02, 0.05, 0.08, 0.12, 0.15, 0.18, 0.22, 0.25] },
        { name: 'A', values: [0.08, 0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78] },
        { name: 'BBB', values: [0.25, 0.55, 0.85, 1.15, 1.45, 1.75, 2.05, 2.35] },
        { name: 'BB', values: [1.20, 2.40, 3.50, 4.50, 5.40, 6.20, 7.00, 7.70] },
        { name: 'B', values: [4.50, 7.50, 9.80, 11.50, 12.80, 13.80, 14.60, 15.20] },
        { name: 'CCC', values: [12.00, 18.50, 22.00, 24.50, 26.50, 28.00, 29.50, 30.50] }
      ]
    },
    lgd: [
      { bucket: '0-10%', count: 45 }, { bucket: '10-20%', count: 82 },
      { bucket: '20-30%', count: 128 }, { bucket: '30-40%', count: 156 },
      { bucket: '40-50%', count: 142 }, { bucket: '50-60%', count: 98 },
      { bucket: '60-70%', count: 62 }, { bucket: '70-80%', count: 35 },
      { bucket: '80-90%', count: 18 }, { bucket: '90-100%', count: 8 }
    ],
    heatmap: {
      sectors: ['Financials', 'Real Estate', 'Retail', 'Manufacturing', 'Energy', 'Technology', 'Healthcare', 'Transport'],
      regions: ['DE', 'FR', 'IT', 'ES', 'UK', 'US', 'APAC'],
      values: [
        [1.2, 1.5, 2.1, 1.8, 1.3, 0.9, 1.1],
        [2.5, 3.2, 4.1, 3.8, 2.8, 2.1, 2.4],
        [0.8, 0.9, 1.2, 1.1, 0.7, 0.6, 0.8],
        [1.5, 1.8, 2.5, 2.2, 1.6, 1.2, 1.4],
        [2.1, 2.4, 3.2, 2.9, 2.0, 1.8, 2.2],
        [0.5, 0.6, 0.8, 0.7, 0.5, 0.4, 0.5],
        [0.6, 0.7, 0.9, 0.8, 0.6, 0.5, 0.6],
        [1.8, 2.1, 2.8, 2.5, 1.9, 1.5, 1.8]
      ]
    }
  },
  ftp: {
    curve: {
      tenors: ['1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', '7Y', '10Y', '20Y'],
      market: [3.45, 3.38, 3.25, 3.02, 2.78, 2.65, 2.52, 2.48, 2.42, 2.55],
      ftp: [3.42, 3.42, 3.35, 3.28, 3.10, 3.00, 2.95, 2.90, 2.82, 2.95],
      spread: [-3, 4, 10, 26, 32, 35, 43, 42, 40, 40]
    },
    nmd: [
      { tenor: 'O/N', amount: 12.0, pct: 10 },
      { tenor: '1M', amount: 18.0, pct: 15 },
      { tenor: '3M', amount: 24.0, pct: 20 },
      { tenor: '6M', amount: 18.0, pct: 15 },
      { tenor: '1Y', amount: 18.0, pct: 15 },
      { tenor: '2Y', amount: 12.0, pct: 10 },
      { tenor: '3Y', amount: 12.0, pct: 10 },
      { tenor: '5Y', amount: 6.0, pct: 5 }
    ],
    dealGrid: {
      products: ['Term Loans', 'Revolving Credit', 'Mortgages', 'Trade Finance', 'Leasing', 'Deposits'],
      segments: ['Retail', 'SME', 'Corporate', 'FI', 'Sovereign'],
      values: [
        [2.15, 1.85, 1.45, 0.95, 0.65],
        [1.85, 1.55, 1.25, 0.85, null],
        [1.45, 1.25, null, null, null],
        [null, 1.95, 1.65, 1.35, 0.95],
        [1.25, 1.45, 1.15, 0.75, null],
        [-0.45, -0.65, -0.85, -1.15, -1.45]
      ]
    },
    ltp: {
      charges: [
        { unit: 'Corporate Banking', value: 485 },
        { unit: 'Investment Banking', value: 220 },
        { unit: 'Retail Banking', value: 125 },
        { unit: 'Wealth Management', value: 65 }
      ],
      benefits: [
        { unit: 'Retail Deposits', value: 520 },
        { unit: 'Corporate Deposits', value: 280 },
        { unit: 'Wholesale Funding', value: 95 }
      ]
    },
    deposit: [
      { product: 'Savings', ftp: 3.15, rate: 2.45, volume: 45.2 },
      { product: 'Current', ftp: 0.85, rate: 0.25, volume: 28.5 },
      { product: 'Term Retail', ftp: 2.85, rate: 2.15, volume: 15.2 },
      { product: 'Corporate', ftp: 2.15, rate: 1.45, volume: 22.8 },
      { product: 'Wholesale', ftp: 3.25, rate: 2.85, volume: 12.4 },
      { product: 'Money Market', ftp: 3.42, rate: 3.42, volume: 8.5 }
    ],
    attribution: [
      { name: 'Interest Margin', value: 1696, pct: 52.3 },
      { name: 'Liquidity Margin', value: 922, pct: 28.4 },
      { name: 'Credit Margin', value: 626, pct: 19.3 }
    ],
    history: [
      { month: 'Jan 2024', rate: 3.85 }, { month: 'Apr 2024', rate: 3.72 },
      { month: 'Jul 2024', rate: 3.58 }, { month: 'Oct 2024', rate: 3.45 },
      { month: 'Jan 2025', rate: 3.38 }, { month: 'Apr 2025', rate: 3.42 },
      { month: 'Jul 2025', rate: 3.45 }, { month: 'Oct 2025', rate: 3.48 },
      { month: 'Jan 2026', rate: 3.45 }, { month: 'Mar 2026', rate: 3.42 },
      { month: 'Jun 2026', rate: 3.42 }
    ]
  },
  optimization: {
    nim: {
      prev: 185,
      components: [
        { name: 'Volume Effect', value: 12 },
        { name: 'Rate Effect', value: 8 },
        { name: 'Mix Effect', value: -5 },
        { name: 'FTP Effect', value: -15 }
      ],
      current: 185
    },
    hedge: { current: 72, target: 80, trend: [65, 66, 67, 68, 70, 72] },
    pricing: {
      products: ['Savings Account', 'Term Deposit 3M', 'Term Deposit 6M', 'Term Deposit 1Y', 'Current Account', 'Business Deposit'],
      tiers: ['<₵10K', '₵10-50K', '₵50-100K', '₵100-250K', '₵250K-1M', '>₵1M'],
      rates: [
        [2.25, 2.45, 2.65, 2.85, 3.05, 3.25],
        [3.05, 3.15, 3.25, 3.35, 3.45, 3.55],
        [3.15, 3.25, 3.35, 3.45, 3.55, 3.65],
        [3.25, 3.35, 3.45, 3.55, 3.65, 3.75],
        [0.25, 0.35, 0.45, 0.55, 0.65, 0.75],
        [2.45, 2.65, 2.85, 3.05, 3.25, 3.45]
      ],
      ftp: [3.15, 3.42, 3.52, 3.28, 0.85, 2.95]
    },
    pipeline: [
      { stage: 'Applications', value: 2450, count: 142 },
      { stage: 'Under Review', value: 1665, count: 98 },
      { stage: 'Approved', value: 1365, count: 72 },
      { stage: 'Disbursed', value: 1242, count: 65 }
    ],
    balancePlan: [
      { category: 'Loans', actual: 125.0, target: 130.0 },
      { category: 'Securities', actual: 45.0, target: 42.0 },
      { category: 'Deposits', actual: 98.0, target: 100.0 },
      { category: 'Wholesale', actual: 32.0, target: 30.0 }
    ],
    whatif: {
      baseNim: 1.85,
      baseNii: 3245,
      baseEve: -8.2,
      baseCet1: 14.2
    },
    submissions: [
      { name: 'BoG LMTD Report', deadline: '15 Jun 2026', owner: 'K. Asante', status: 'overdue' },
      { name: 'BoG Stress Test', deadline: '30 Jun 2026', owner: 'E. Osei', status: 'due' },
      { name: 'ORASS Monthly', deadline: '9 Jul 2026', owner: 'A. Mensah', status: 'due' },
      { name: 'Pillar 3 Report', deadline: '15 Jul 2026', owner: 'L. Owusu', status: 'upcoming' },
      { name: 'ICAAP Update', deadline: '31 Jul 2026', owner: 'J. Addo', status: 'upcoming' },
      { name: 'Recovery Plan', deadline: '31 Dec 2026', owner: 'S. Boateng', status: 'upcoming' }
    ]
  }
};

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function formatNumber(num, decimals = 1, prefix = '', suffix = '') {
  if (num === null || num === undefined) return '—';
  const formatted = Number(num).toLocaleString('en-EU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return `${prefix}${formatted}${suffix}`;
}

function formatCurrency(num, unit = 'bn') {
  const map = { bn: 1000, m: 1, k: 0.001 };
  const scaled = num / (map[unit] || 1);
  return `₵${scaled.toFixed(1)}${unit.toUpperCase()}`;
}

function statusClass(value, thresholds) {
  if (value >= thresholds.green) return 'green';
  if (value >= thresholds.amber) return 'amber';
  return 'red';
}

function statusColor(status) {
  return status === 'green' ? COLORS.success : status === 'amber' ? COLORS.warning : COLORS.alert;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// ---------------------------------------------------------------------------
// Chart Helpers
// ---------------------------------------------------------------------------

const chartInstances = new Map();

function getThemeColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: isDark ? '#94A3B8' : '#64748B',
    grid: isDark ? '#334155' : '#E2E8F0',
    tooltipBg: isDark ? '#0F172A' : '#1E293B',
    tooltipText: isDark ? '#F1F5F9' : '#FFFFFF'
  };
}

function baseChartOptions() {
  const tc = getThemeColors();
  return {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Inter, sans-serif' },
    tooltip: {
      backgroundColor: tc.tooltipBg,
      borderColor: tc.grid,
      textStyle: { color: tc.tooltipText, fontSize: 12 },
      padding: [8, 12]
    },
    grid: { left: 48, right: 24, top: 24, bottom: 32, containLabel: true },
    xAxis: { axisLine: { lineStyle: { color: tc.grid } }, axisLabel: { color: tc.text }, splitLine: { show: false } },
    yAxis: { axisLine: { show: false }, axisLabel: { color: tc.text }, splitLine: { lineStyle: { color: tc.grid, type: 'dashed' } } }
  };
}

function renderChart(containerId, option) {
  const container = document.getElementById(containerId);
  if (!container) return null;
  let chart = chartInstances.get(containerId);
  if (chart) {
    chart.dispose();
  }
  chart = echarts.init(container);
  chart.setOption({ ...baseChartOptions(), ...option }, true);
  chartInstances.set(containerId, chart);
  return chart;
}

function disposeCharts() {
  chartInstances.forEach(c => c.dispose());
  chartInstances.clear();
}

function refreshCharts() {
  setTimeout(() => {
    chartInstances.forEach(c => c.resize());
  }, 100);
}

// ---------------------------------------------------------------------------
// View Renderers
// ---------------------------------------------------------------------------

function renderDashboard() {
  const kpiCards = DUMMY.dashboard.kpis.map((kpi, i) => {
    const trendIcon = kpi.trend.includes('+') ? 'trending-up' : kpi.trend.includes('-') ? 'trending-down' : 'minus';
    const trendClass = kpi.trend.includes('+') ? 'up' : kpi.trend.includes('-') ? 'down' : 'neutral';
    const accentClass = kpi.status === 'green' ? 'card-accent-green' : kpi.status === 'amber' ? 'card-accent-amber' : kpi.status === 'red' ? 'card-accent-red' : 'card-accent';
    return `
      <div class="card ${accentClass} kpi-card" style="animation-delay: ${i * 80}ms">
        <div class="kpi-label">
          ${kpi.label}
          <i data-lucide="info" style="width:14px;height:14px;color:var(--text-muted)"></i>
        </div>
        <div class="kpi-value">${kpi.value}</div>
        <div class="kpi-trend ${trendClass}">
          <i data-lucide="${trendIcon}" style="width:14px;height:14px"></i>
          ${kpi.trend} vs last month
        </div>
        <div class="kpi-sparkline" id="kpiSpark${i}"></div>
        <div class="kpi-target">Target: ${kpi.target}</div>
      </div>
    `;
  }).join('');

  const alerts = DUMMY.dashboard.alerts.map(a => `
    <div class="alert-item ${a.severity}">
      <i data-lucide="${a.icon}" class="alert-icon"></i>
      <div class="alert-content">
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.desc}</div>
        <div class="alert-actions">
          <a href="#">View</a>
          <a href="#">Dismiss</a>
        </div>
      </div>
    </div>
  `).join('');

  const actions = DUMMY.dashboard.actions.map(a => `
    <div class="action-item">
      <div class="action-priority ${a.priority}"></div>
      <div class="action-content">
        <div class="action-title">${a.title}</div>
        <div class="action-meta">${a.meta}</div>
      </div>
    </div>
  `).join('');

  const meetings = DUMMY.dashboard.meetings.map(m => `
    <div class="action-item">
      <div class="action-priority normal"></div>
      <div class="action-content">
        <div class="action-title">${m.title}</div>
        <div class="action-meta">${m.meta}</div>
      </div>
    </div>
  `).join('');

  const news = DUMMY.dashboard.news.map(n => {
    const iconMap = { regulatory: 'landmark', accounting: 'file-text', internal: 'building-2', market: 'globe' };
    return `
      <div class="news-item">
        <i data-lucide="${iconMap[n.type]}" class="news-icon" style="color:${n.type === 'regulatory' ? COLORS.success : n.type === 'accounting' ? COLORS.violet : COLORS.primary}"></i>
        <div class="news-content">
          <div class="news-title">${n.title}</div>
          <div class="news-desc">${n.desc}</div>
          <div class="news-meta">
            <span class="source">${n.source}</span>
            <span>${n.time}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const quickLinks = NAV_STRUCTURE.filter(n => n.children).slice(0, 9).map(m => `
    <a href="#${m.children[0].route}" class="quick-link" style="color:${m.color}">
      <i data-lucide="${m.icon}"></i>
      <span>${m.label.replace(' Risk', '').replace(' Adequacy', '').replace(' / Credit Risk', '')}</span>
    </a>
  `).join('');

  const today = new Date(2026, 5, 25);
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const eventDays = new Set(DUMMY.dashboard.calendarEvents.filter(e => !e.monthOffset).map(e => e.day));

  let calendarDays = '';
  for (let i = 0; i < firstDay; i++) calendarDays += `<div class="calendar-day"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate();
    const hasEvent = eventDays.has(d);
    calendarDays += `<div class="calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">${d}</div>`;
  }

  const eventsList = DUMMY.dashboard.calendarEvents.map(e => {
    const color = e.type === 'reporting' ? 'dot-red' : e.type === 'approval' ? 'dot-amber' : e.type === 'meeting' ? 'dot-blue' : 'dot-green';
    const monthName = e.monthOffset ? 'Jul' : 'Jun';
    return `<div class="calendar-event"><div class="dot ${color}"></div><span class="calendar-event-date">${e.day} ${monthName}</span><span>${e.title}</span></div>`;
  }).join('');

  return `
    <div class="view">
      <h1 class="page-title">ALCO Cockpit</h1>
      <p class="page-subtitle">Consolidated view of liquidity, interest rate, capital, credit, and profitability risk.</p>

      <div class="grid grid-6 mb-4">
        ${kpiCards}
      </div>

      <div class="grid grid-3 mb-4">
        <div class="card grid-span-1">
          <div class="card-header">
            <div class="card-title"><i data-lucide="bell"></i> Active Alerts</div>
            <a href="#" class="btn btn-ghost btn-sm">View All</a>
          </div>
          <div class="alert-list">${alerts}</div>
        </div>

        <div class="card grid-span-2">
          <div class="card-header">
            <div class="card-title"><i data-lucide="activity"></i> Trend Overview</div>
            <div class="card-actions">
              <button class="btn btn-ghost btn-sm active">7D</button>
              <button class="btn btn-ghost btn-sm">30D</button>
            </div>
          </div>
          <div class="grid grid-3" id="trendSparkGrid">
            ${DUMMY.dashboard.kpis.map((k, i) => `
              <div style="padding:8px">
                <div style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:4px">${k.label}</div>
                <div id="trendSpark${i}" style="height:48px"></div>
                <div style="font-size:12px;font-weight:700;color:var(--text-primary)">${k.value} <span style="color:${k.trend.includes('+') ? COLORS.success : k.trend.includes('-') ? COLORS.alert : COLORS.gray};font-size:11px">${k.trend}</span></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="grid grid-2 mb-4">
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="clipboard-list"></i> Action Items</div>
            <a href="#" class="btn btn-ghost btn-sm">Task Center</a>
          </div>
          <div class="action-list mb-3">${actions}</div>
          <div class="section-title" style="font-size:13px"><i data-lucide="calendar"></i> Upcoming Meetings</div>
          <div class="action-list">${meetings}</div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="newspaper"></i> News & Regulatory Updates</div>
            <a href="#" class="btn btn-ghost btn-sm">View All</a>
          </div>
          <div class="news-list">${news}</div>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="rocket"></i> Quick Links</div>
          </div>
          <div class="quick-links">${quickLinks}</div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="calendar"></i> Calendar & Key Dates</div>
            <a href="#" class="btn btn-ghost btn-sm">Full Calendar</a>
          </div>
          <div class="calendar-widget">
            <div class="calendar-header">
              <button class="btn-icon btn-sm"><i data-lucide="chevron-left" style="width:16px;height:16px"></i></button>
              <div class="calendar-month">June 2026</div>
              <button class="btn-icon btn-sm"><i data-lucide="chevron-right" style="width:16px;height:16px"></i></button>
            </div>
            <div class="calendar-grid">
              ${['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => `<div class="calendar-day-label">${d}</div>`).join('')}
              ${calendarDays}
            </div>
            <div class="calendar-events">${eventsList}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initDashboardCharts() {
  const tc = getThemeColors();
  DUMMY.dashboard.kpis.forEach((kpi, i) => {
    renderChart(`kpiSpark${i}`, {
      grid: { top: 0, bottom: 0, left: 0, right: 0 },
      xAxis: { show: false, data: kpi.sparkline.map((_, j) => j) },
      yAxis: { show: false, min: Math.min(...kpi.sparkline) * 0.98, max: Math.max(...kpi.sparkline) * 1.02 },
      series: [{
        type: 'line',
        data: kpi.sparkline,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: statusColor(kpi.status) },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: statusColor(kpi.status) + '40' }, { offset: 1, color: statusColor(kpi.status) + '05' }]) }
      }]
    });
    renderChart(`trendSpark${i}`, {
      grid: { top: 2, bottom: 2, left: 2, right: 2 },
      xAxis: { show: false, data: kpi.sparkline.map((_, j) => j) },
      yAxis: { show: false, min: Math.min(...kpi.sparkline) * 0.98, max: Math.max(...kpi.sparkline) * 1.02 },
      series: [{
        type: 'line',
        data: kpi.sparkline,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: statusColor(kpi.status) },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: statusColor(kpi.status) + '50' }, { offset: 1, color: statusColor(kpi.status) + '05' }]) }
      }]
    });
  });
}


// ---------------------------------------------------------------------------
// Liquidity Risk Views
// ---------------------------------------------------------------------------

function renderLiquidityOverview() {
  return `
    <div class="view">
      <h1 class="page-title">Liquidity Risk Overview</h1>
      <p class="page-subtitle">Real-time LCR/NSFR monitoring, gap analysis, and stress testing.</p>

      <div class="grid grid-4 mb-4">
        <div class="card card-accent-green">
          <div class="kpi-label">LCR</div>
          <div class="kpi-value">136.2%</div>
          <div class="kpi-trend up"><i data-lucide="trending-up" style="width:14px;height:14px"></i> +₵62.2M excess HQLA</div>
        </div>
        <div class="card card-accent-amber">
          <div class="kpi-label">NSFR</div>
          <div class="kpi-value">108.3%</div>
          <div class="kpi-trend neutral"><i data-lucide="minus" style="width:14px;height:14px"></i> +₵3.2B buffer</div>
        </div>
        <div class="card card-accent-green">
          <div class="kpi-label">Survival Horizon</div>
          <div class="kpi-value">45 days</div>
          <div class="kpi-trend up"><i data-lucide="trending-up" style="width:14px;height:14px"></i> Baseline scenario</div>
        </div>
        <div class="card card-accent">
          <div class="kpi-label">HQLA Total</div>
          <div class="kpi-value">₵234.5B</div>
          <div class="kpi-trend up"><i data-lucide="trending-up" style="width:14px;height:14px"></i> Level 1: 84.5%</div>
        </div>
      </div>

      <div class="grid grid-3 mb-4">
        <div class="card grid-span-2">
          <div class="card-header">
            <div class="card-title"><i data-lucide="waves"></i> LCR Waterfall Analysis</div>
            <div class="card-actions">
              <button class="btn btn-ghost btn-sm"><i data-lucide="download" style="width:14px;height:14px"></i></button>
            </div>
          </div>
          <div class="chart-container chart-md" id="lcrWaterfallChart"></div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="bar-chart-3"></i> NSFR Monitor</div>
          </div>
          <div class="chart-container chart-md" id="nsfrBarChart"></div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title"><i data-lucide="git-branch"></i> Liquidity Gap Analysis</div>
          <div class="card-actions">
            <button class="btn btn-ghost btn-sm active">Behavioral</button>
            <button class="btn btn-ghost btn-sm">Contractual</button>
          </div>
        </div>
        <div class="chart-container chart-lg" id="liquidityGapChart"></div>
        <div class="grid grid-7 mt-3" style="gap:12px">
          ${DUMMY.liquidity.gap.map(g => `
            <div class="card" style="padding:12px;text-align:center">
              <div style="font-size:11px;color:var(--text-muted);font-weight:600">${g.bucket}</div>
              <div style="font-size:16px;font-weight:800;font-family:'JetBrains Mono',monospace;margin:4px 0">${g.net > 0 ? '+' : ''}${g.net.toFixed(1)}</div>
              <div class="status ${g.net >= 0 ? 'status-green' : 'status-red'}" style="font-size:10px;padding:2px 6px">${g.net >= 0 ? 'Surplus' : 'Gap'}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="grid grid-4 mb-4">
        ${DUMMY.liquidity.stress.map(s => {
          const accent = s.status === 'green' ? 'card-accent-green' : s.status === 'amber' ? 'card-accent-amber' : 'card-accent-red';
          const statusText = s.status === 'green' ? 'Compliant' : s.status === 'amber' ? 'Watch' : 'Breach';
          return `
            <div class="card ${accent}">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:var(--text-secondary);margin-bottom:8px">${s.scenario}</div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <div>
                  <div style="font-size:11px;color:var(--text-muted)">Before</div>
                  <div style="font-size:18px;font-weight:800">${s.before}%</div>
                </div>
                <i data-lucide="arrow-right" style="color:var(--text-muted)"></i>
                <div class="text-right">
                  <div style="font-size:11px;color:var(--text-muted)">After</div>
                  <div style="font-size:24px;font-weight:800;color:${s.status === 'red' ? COLORS.alert : s.status === 'amber' ? COLORS.warning : COLORS.success}">${s.after}%</div>
                </div>
              </div>
              <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">
                HQLA: ${s.hqlaChange > 0 ? '+' : ''}${s.hqlaChange}B • Outflows: +${s.outflowChange}B
              </div>
              <div class="status ${s.status === 'green' ? 'status-green' : s.status === 'amber' ? 'status-amber' : 'status-red'}">${statusText}</div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="grid grid-3">
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="pie-chart"></i> HQLA Inventory</div>
          </div>
          <div class="chart-container chart-md" id="hqlaPieChart"></div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="gauge"></i> Survival Horizon</div>
          </div>
          <div class="chart-container chart-md" id="survivalGaugeChart"></div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="activity"></i> Intraday Peaks</div>
          </div>
          <div class="chart-container chart-md" id="intradayChart"></div>
        </div>
      </div>
    </div>
  `;
}

function renderLCR() {
  const lcr = DUMMY.liquidity.lcr;
  return `
    <div class="view">
      <h1 class="page-title">LCR Analysis</h1>
      <p class="page-subtitle">Liquidity Coverage Ratio calculation with full component drill-down.</p>
      <div class="grid grid-3 mb-4">
        <div class="card card-accent-green">
          <div class="kpi-label">LCR Ratio</div>
          <div class="kpi-value">${lcr.ratio}%</div>
          <div class="kpi-trend up">Excess HQLA: ₵${(lcr.hqla - lcr.outflows).toFixed(1)}B</div>
        </div>
        <div class="card">
          <div class="kpi-label">Total HQLA</div>
          <div class="kpi-value">₵${lcr.hqla.toFixed(1)}B</div>
          <div class="kpi-target">Level 2 cap applied</div>
        </div>
        <div class="card">
          <div class="kpi-label">Net Cash Outflows</div>
          <div class="kpi-value">₵${lcr.outflows.toFixed(1)}B</div>
          <div class="kpi-target">Inflows capped at 75%</div>
        </div>
      </div>
      <div class="grid grid-2">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="droplets"></i> HQLA Components</div></div>
          <table class="data-table">
            <tr><th>Level</th><th class="text-right">Amount (₵B)</th><th class="text-right">Haircut</th><th class="text-right">Weighted</th></tr>
            <tr><td>Level 1</td><td class="num">${lcr.level1.toFixed(1)}</td><td class="num">0%</td><td class="num">${lcr.level1.toFixed(1)}</td></tr>
            <tr><td>Level 2A</td><td class="num">${lcr.level2a.toFixed(1)}</td><td class="num">15%</td><td class="num">${(lcr.level2a * 0.85).toFixed(1)}</td></tr>
            <tr><td>Level 2B</td><td class="num">${lcr.level2b.toFixed(1)}</td><td class="num">50%</td><td class="num">${(lcr.level2b * 0.50).toFixed(1)}</td></tr>
            <tr style="font-weight:700"><td>Total HQLA</td><td class="num">${lcr.hqla.toFixed(1)}</td><td></td><td class="num">${lcr.hqla.toFixed(1)}</td></tr>
          </table>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="wallet"></i> Cash Outflows</div></div>
          <table class="data-table">
            <tr><th>Category</th><th class="text-right">Amount (₵B)</th><th class="text-right">Run-off</th><th class="text-right">Outflow</th></tr>
            <tr><td>Retail Stable</td><td class="num">${lcr.retail.toFixed(1)}</td><td class="num">5%</td><td class="num">${(lcr.retail * 0.05).toFixed(1)}</td></tr>
            <tr><td>Wholesale Unsecured</td><td class="num">${lcr.wholesale.toFixed(1)}</td><td class="num">100%</td><td class="num">${lcr.wholesale.toFixed(1)}</td></tr>
            <tr><td>Secured Funding</td><td class="num">${lcr.secured.toFixed(1)}</td><td class="num">25%</td><td class="num">${(lcr.secured * 0.25).toFixed(1)}</td></tr>
            <tr><td>Additional</td><td class="num">${lcr.additional.toFixed(1)}</td><td class="num">100%</td><td class="num">${lcr.additional.toFixed(1)}</td></tr>
            <tr style="font-weight:700"><td>Net Outflows</td><td></td><td></td><td class="num">${lcr.outflows.toFixed(1)}</td></tr>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderNSFR() {
  const nsfr = DUMMY.liquidity.nsfr;
  return `
    <div class="view">
      <h1 class="page-title">NSFR Monitor</h1>
      <p class="page-subtitle">Net Stable Funding Ratio with ASF/RSF decomposition.</p>
      <div class="grid grid-3 mb-4">
        <div class="card card-accent-amber"><div class="kpi-label">NSFR Ratio</div><div class="kpi-value">${nsfr.ratio}%</div></div>
        <div class="card"><div class="kpi-label">Available Stable Funding</div><div class="kpi-value">₵${nsfr.asf.toFixed(1)}B</div></div>
        <div class="card"><div class="kpi-label">Required Stable Funding</div><div class="kpi-value">₵${nsfr.rsf.toFixed(1)}B</div></div>
      </div>
      <div class="card">
        <table class="data-table">
          <tr><th>Category</th><th class="text-right">ASF (₵B)</th><th class="text-right">Factor</th><th class="text-right">RSF (₵B)</th><th class="text-right">Factor</th></tr>
          ${nsfr.categories.map(c => `
            <tr>
              <td>${c.name}</td>
              <td class="num">${c.asf.toFixed(1)}</td>
              <td class="num">${c.asf ? '—' : '0%'}</td>
              <td class="num">${c.rsf.toFixed(1)}</td>
              <td class="num">${c.rsf ? '—' : '0%'}</td>
            </tr>
          `).join('')}
          <tr style="font-weight:700"><td>Total</td><td class="num">${nsfr.asf.toFixed(1)}</td><td></td><td class="num">${nsfr.rsf.toFixed(1)}</td><td></td></tr>
        </table>
      </div>
    </div>
  `;
}

function renderLiquidityGap() {
  return `
    <div class="view">
      <h1 class="page-title">Liquidity Gap Analysis</h1>
      <p class="page-subtitle">Time-bucketed cash flow mismatch between assets and liabilities.</p>
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i data-lucide="git-branch"></i> Cumulative Liquidity Gap</div>
          <div class="card-actions">
            <button class="btn btn-ghost btn-sm active">Behavioral</button>
            <button class="btn btn-ghost btn-sm">Contractual</button>
          </div>
        </div>
        <div class="chart-container chart-lg" id="liquidityGapDetailChart"></div>
      </div>
    </div>
  `;
}

function renderLiquidityStress() {
  return `
    <div class="view">
      <h1 class="page-title">Liquidity Stress Testing</h1>
      <p class="page-subtitle">Scenario-based impact on LCR and NSFR under idiosyncratic and market-wide shocks.</p>
      <div class="grid grid-4 mb-4">
        ${DUMMY.liquidity.stress.map(s => `
          <div class="card ${s.status === 'green' ? 'card-accent-green' : s.status === 'amber' ? 'card-accent-amber' : 'card-accent-red'}">
            <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:var(--text-secondary)">${s.scenario}</div>
            <div style="display:flex;justify-content:space-between;margin:12px 0">
              <div><div style="font-size:11px;color:var(--text-muted)">Base LCR</div><div style="font-size:18px;font-weight:800">${s.before}%</div></div>
              <div class="text-right"><div style="font-size:11px;color:var(--text-muted)">Stressed</div><div style="font-size:24px;font-weight:800;color:${statusColor(s.status)}">${s.after}%</div></div>
            </div>
            <div style="font-size:12px;color:var(--text-secondary)">HQLA: ${s.hqlaChange}B / Outflows: +${s.outflowChange}B</div>
          </div>
        `).join('')}
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="sliders"></i> Stress Scenario Parameters</div></div>
        <div class="scenario-builder">
          <div>
            <div class="slider-group"><label>Retail Run-off Multiplier <span class="value">2.5x</span></label><input type="range" class="slider" min="1" max="5" step="0.5" value="2.5"></div>
            <div class="slider-group"><label>Wholesale Run-off Multiplier <span class="value">2.0x</span></label><input type="range" class="slider" min="1" max="5" step="0.5" value="2"></div>
            <div class="slider-group"><label>HQLA Haircut Add-on <span class="value">10%</span></label><input type="range" class="slider" min="0" max="30" value="10"></div>
            <div class="slider-group"><label>Inflow Reduction <span class="value">50%</span></label><input type="range" class="slider" min="0" max="100" value="50"></div>
            <button class="btn btn-primary"><i data-lucide="play" style="width:14px;height:14px"></i> Run Stress Test</button>
          </div>
          <div class="card" style="background:var(--bg-page)">
            <div class="metric-row"><span class="metric-name">Base LCR</span><span class="metric-value">136.2%</span></div>
            <div class="metric-row"><span class="metric-name">Stressed LCR</span><span class="metric-value" style="color:${COLORS.warning}">108.4%</span></div>
            <div class="metric-row"><span class="metric-name">Base NSFR</span><span class="metric-value">108.3%</span></div>
            <div class="metric-row"><span class="metric-name">Stressed NSFR</span><span class="metric-value" style="color:${COLORS.warning}">105.2%</span></div>
            <div class="metric-row"><span class="metric-name">Survival Horizon</span><span class="metric-value" style="color:${COLORS.warning}">18 days</span></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCFP() {
  const cfp = DUMMY.liquidity.cfp;
  return `
    <div class="view">
      <h1 class="page-title">Contingency Funding Plan</h1>
      <p class="page-subtitle">Early warning indicators and CFP activation dashboard.</p>
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title"><i data-lucide="shield-alert"></i> CFP Status</div>
          <div class="status status-green">${cfp.phase} — All EWIs Green</div>
        </div>
        <p style="color:var(--text-secondary);font-size:13px">Last updated: 25 Jun 2026, 08:45 CET</p>
      </div>
      <div class="card">
        <table class="data-table">
          <tr><th>Early Warning Indicator</th><th class="text-right">Current</th><th class="text-right">Threshold</th><th>Status</th></tr>
          ${cfp.ewis.map(e => `
            <tr>
              <td>${e.name}</td>
              <td class="num">${e.current}</td>
              <td class="num">${e.threshold}</td>
              <td><span class="status status-green">Normal</span></td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;
}

function initLiquidityCharts() {
  const lcr = DUMMY.liquidity.lcr;
  renderChart('lcrWaterfallChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 140, right: 80, top: 24, bottom: 24 },
    xAxis: { type: 'value', axisLabel: { formatter: '₵{value}B' } },
    yAxis: { type: 'category', data: ['LCR Ratio', 'Net Outflows', 'Inflows', 'Additional', 'Secured', 'Wholesale', 'Retail', 'HQLA Total', 'Level 2B', 'Level 2A', 'Level 1'].reverse() },
    series: [{
      type: 'bar',
      stack: 'total',
      data: [
        { value: lcr.level1, itemStyle: { color: COLORS.success } },
        { value: lcr.level2a, itemStyle: { color: COLORS.successLight } },
        { value: lcr.level2b, itemStyle: { color: '#A7F3D0' } },
        { value: lcr.hqla, itemStyle: { color: COLORS.violet } },
        { value: -lcr.retail, itemStyle: { color: COLORS.alertLight } },
        { value: -lcr.wholesale, itemStyle: { color: '#FDA4AF' } },
        { value: -lcr.secured, itemStyle: { color: '#FECDD3' } },
        { value: -lcr.additional, itemStyle: { color: '#FFE4E6' } },
        { value: lcr.inflows, itemStyle: { color: COLORS.primary } },
        { value: -lcr.outflows, itemStyle: { color: COLORS.alert } },
        { value: lcr.ratio * 1.5, itemStyle: { color: COLORS.success } }
      ].reverse()
    }]
  });

  const nsfr = DUMMY.liquidity.nsfr;
  renderChart('nsfrBarChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0 },
    grid: { left: 100, right: 24, top: 24, bottom: 32 },
    xAxis: { type: 'value', axisLabel: { formatter: '₵{value}B' } },
    yAxis: { type: 'category', data: nsfr.categories.map(c => c.name) },
    series: [
      { name: 'ASF', type: 'bar', data: nsfr.categories.map(c => c.asf), itemStyle: { color: COLORS.success } },
      { name: 'RSF', type: 'bar', data: nsfr.categories.map(c => c.rsf), itemStyle: { color: COLORS.alert } }
    ]
  });

  renderChart('liquidityGapChart', {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: DUMMY.liquidity.gap.map(g => g.bucket) },
    yAxis: { type: 'value', axisLabel: { formatter: '₵{value}B' } },
    series: [
      { name: 'Inflows', type: 'bar', stack: 'gap', data: DUMMY.liquidity.gap.map(g => g.inflows), itemStyle: { color: COLORS.success } },
      { name: 'Outflows', type: 'bar', stack: 'gap', data: DUMMY.liquidity.gap.map(g => -g.outflows), itemStyle: { color: COLORS.alert } },
      { name: 'Cumulative Gap', type: 'line', data: DUMMY.liquidity.gap.map(g => g.cumulative), itemStyle: { color: COLORS.primary }, lineStyle: { width: 3 } }
    ]
  });

  renderChart('liquidityGapDetailChart', {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: DUMMY.liquidity.gap.map(g => g.bucket) },
    yAxis: { type: 'value', axisLabel: { formatter: '₵{value}B' } },
    series: [
      { name: 'Inflows', type: 'bar', data: DUMMY.liquidity.gap.map(g => g.inflows), itemStyle: { color: COLORS.success } },
      { name: 'Outflows', type: 'bar', data: DUMMY.liquidity.gap.map(g => g.outflows), itemStyle: { color: COLORS.alert } },
      { name: 'Cumulative', type: 'line', data: DUMMY.liquidity.gap.map(g => g.cumulative), itemStyle: { color: COLORS.primary }, areaStyle: { opacity: 0.1 } }
    ]
  });

  renderChart('hqlaPieChart', {
    tooltip: { trigger: 'item', formatter: '{b}: ₵{c}B ({d}%)' },
    series: [{
      type: 'pie',
      radius: ['55%', '80%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      label: { show: false },
      data: [
        { value: lcr.level1, name: 'Level 1', itemStyle: { color: COLORS.success } },
        { value: lcr.level2a, name: 'Level 2A', itemStyle: { color: COLORS.primary } },
        { value: lcr.level2b, name: 'Level 2B', itemStyle: { color: COLORS.warning } }
      ]
    }]
  });

  renderChart('survivalGaugeChart', {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 60,
      splitNumber: 4,
      axisLine: {
        lineStyle: {
          width: 20,
          color: [
            [0.25, COLORS.alert],
            [0.5, COLORS.warning],
            [1, COLORS.success]
          ]
        }
      },
      pointer: { length: '60%', width: 6 },
      axisTick: { show: false },
      splitLine: { length: 20, lineStyle: { width: 2 } },
      axisLabel: { distance: 30 },
      detail: { valueAnimation: true, formatter: '{value} days', fontSize: 24, fontWeight: 800, offsetCenter: [0, '20%'] },
      data: [{ value: 45 }]
    }]
  });

  renderChart('intradayChart', {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 24, top: 16, bottom: 24 },
    xAxis: { type: 'category', boundaryGap: false, data: DUMMY.liquidity.intraday.map(d => d.time) },
    yAxis: { type: 'value', min: 0, max: 30, axisLabel: { formatter: '₵{value}B' } },
    series: [
      { name: 'Funding Req.', type: 'line', step: 'middle', data: DUMMY.liquidity.intraday.map(d => d.req), itemStyle: { color: COLORS.primary }, areaStyle: { opacity: 0.15 } },
      { name: 'Limit', type: 'line', data: DUMMY.liquidity.intraday.map(() => 30), lineStyle: { type: 'dashed', color: COLORS.alert }, symbol: 'none' }
    ]
  });
}


// ---------------------------------------------------------------------------
// IRRBB Views
// ---------------------------------------------------------------------------

function renderIRRBBOverview() {
  return `
    <div class="view">
      <h1 class="page-title">IRRBB Overview</h1>
      <p class="page-subtitle">Interest rate risk in the banking book: EVE, NII, and gap analytics.</p>

      <div class="grid grid-5 mb-4">
        <div class="card card-accent-green"><div class="kpi-label">EVE Δ / T1</div><div class="kpi-value">-8.2%</div></div>
        <div class="card card-accent-green"><div class="kpi-label">NII Forecast (12M)</div><div class="kpi-value">₵3.25B</div></div>
        <div class="card card-accent-amber"><div class="kpi-label">Worst EVE Scenario</div><div class="kpi-value">-8.5%</div></div>
        <div class="card"><div class="kpi-label">Avg Deposit Beta</div><div class="kpi-value">0.42</div></div>
        <div class="card"><div class="kpi-label">Hedge Coverage</div><div class="kpi-value">72%</div></div>
      </div>

      <div class="grid grid-2 mb-4">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="pie-chart"></i> EVE Sensitivity by Scenario</div></div>
          <div class="chart-container chart-md" id="eveScenarioChart"></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="trending-up"></i> NII Forecast (12 months)</div></div>
          <div class="chart-container chart-md" id="niiForecastChart"></div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header"><div class="card-title"><i data-lucide="bar-chart"></i> Repricing Gap</div></div>
        <div class="chart-container chart-lg" id="repricingGapChart"></div>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="percent"></i> Yield Curve Scenarios</div></div>
          <div class="chart-container chart-md" id="yieldCurveChart"></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="table-2"></i> DV01 by Currency/Tenor</div></div>
          <div class="chart-container chart-md" id="dv01HeatmapChart"></div>
        </div>
      </div>
    </div>
  `;
}

function renderEVE() {
  return `
    <div class="view">
      <h1 class="page-title">EVE Sensitivity</h1>
      <p class="page-subtitle">Economic value of equity sensitivity across prescribed and internal rate shock scenarios.</p>
      <div class="grid grid-4 mb-4">
        <div class="card card-accent-green"><div class="kpi-label">Base EVE</div><div class="kpi-value">₵12.4B</div></div>
        <div class="card card-accent-amber"><div class="kpi-label">Worst Δ</div><div class="kpi-value">-8.5%</div></div>
        <div class="card"><div class="kpi-label">Max Scenario</div><div class="kpi-value">+200bps</div></div>
        <div class="card"><div class="kpi-label">Limit</div><div class="kpi-value">-10%</div></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="bar-chart-3"></i> Scenario Breakdown</div></div>
        <div class="chart-container chart-lg" id="eveDetailChart"></div>
      </div>
    </div>
  `;
}

function renderNII() {
  return `
    <div class="view">
      <h1 class="page-title">NII Forecast</h1>
      <p class="page-subtitle">Forward-looking net interest income projection under rate scenarios.</p>
      <div class="grid grid-3 mb-4">
        <div class="card card-accent-green"><div class="kpi-label">Base Case NII</div><div class="kpi-value">₵3.25B</div></div>
        <div class="card"><div class="kpi-label">Upside</div><div class="kpi-value">₵3.42B</div></div>
        <div class="card"><div class="kpi-label">Downside</div><div class="kpi-value">₵3.08B</div></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="trending-up"></i> 12-Month NII Projection</div></div>
        <div class="chart-container chart-lg" id="niiDetailChart"></div>
      </div>
    </div>
  `;
}

function renderIRRBBGap() {
  return `
    <div class="view">
      <h1 class="page-title">Repricing Gap</h1>
      <p class="page-subtitle">Rate-sensitive assets vs liabilities by repricing maturity bucket.</p>
      <div class="card">
        <div class="chart-container chart-lg" id="repricingGapDetailChart"></div>
        <table class="data-table mt-3">
          <tr><th>Bucket</th><th class="text-right">RSA (₵B)</th><th class="text-right">RSL (₵B)</th><th class="text-right">Gap (₵B)</th><th class="text-right">Cumulative (₵B)</th></tr>
          ${DUMMY.irrbb.gap.map(g => `
            <tr>
              <td>${g.bucket}</td>
              <td class="num">${g.rsa.toFixed(1)}</td>
              <td class="num">${g.rsl.toFixed(1)}</td>
              <td class="num" style="color:${g.net >= 0 ? COLORS.success : COLORS.alert}">${g.net > 0 ? '+' : ''}${g.net.toFixed(1)}</td>
              <td class="num">${g.cum.toFixed(1)}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;
}

function renderDurationGap() {
  return `
    <div class="view">
      <h1 class="page-title">Duration Gap</h1>
      <p class="page-subtitle">Macaulay/modified duration mismatch and weighted average repricing metrics.</p>
      <div class="grid grid-3 mb-4">
        <div class="card"><div class="kpi-label">Asset Duration</div><div class="kpi-value">3.82 yrs</div></div>
        <div class="card"><div class="kpi-label">Liability Duration</div><div class="kpi-value">2.15 yrs</div></div>
        <div class="card card-accent-amber"><div class="kpi-label">Duration Gap</div><div class="kpi-value">1.67 yrs</div></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="clock"></i> Duration by Maturity Bucket</div></div>
        <div class="chart-container chart-lg" id="durationChart"></div>
      </div>
    </div>
  `;
}

function renderDerivatives() {
  return `
    <div class="view">
      <h1 class="page-title">Derivatives & Hedging</h1>
      <p class="page-subtitle">Hedge inventory, effectiveness testing, and accounting alignment.</p>
      <div class="card">
        <table class="data-table">
          <tr>
            <th>Instrument</th>
            <th class="text-right">Notional (₵M)</th>
            <th class="text-right">MtM (₵M)</th>
            <th class="text-right">Hedge %</th>
            <th class="text-right">Effectiveness</th>
            <th class="text-center">Expiry</th>
            <th>Status</th>
          </tr>
          ${DUMMY.irrbb.derivatives.map(d => `
            <tr>
              <td>${d.instrument}</td>
              <td class="num">${d.notional.toFixed(0)}</td>
              <td class="num" style="color:${d.mtm >= 0 ? COLORS.success : COLORS.alert}">${d.mtm > 0 ? '+' : ''}${d.mtm.toFixed(1)}</td>
              <td class="num">${d.hedge}%</td>
              <td class="num">${d.effectiveness}%</td>
              <td class="text-center">${d.expiry}</td>
              <td><span class="status ${d.status === 'green' ? 'status-green' : d.status === 'amber' ? 'status-amber' : 'status-red'}">${d.status === 'green' ? 'Effective' : d.status === 'amber' ? 'Review' : 'Ineffective'}</span></td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;
}

function initIRRBBCharts() {
  renderChart('eveScenarioChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 100, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    yAxis: { type: 'category', data: DUMMY.irrbb.eve.scenarios.map(s => s.name) },
    series: [{
      type: 'bar',
      data: DUMMY.irrbb.eve.scenarios.map(s => ({
        value: s.value,
        itemStyle: { color: s.value < 0 ? COLORS.alert : COLORS.success }
      })),
      label: { show: true, position: 'right', formatter: '{c}%' }
    }]
  });

  renderChart('niiForecastChart', {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yAxis: { type: 'value', axisLabel: { formatter: '₵{value}M' } },
    series: [
      { name: 'Base', type: 'line', data: DUMMY.irrbb.nii.base, itemStyle: { color: COLORS.primary }, lineStyle: { width: 3 } },
      { name: 'Upside', type: 'line', data: DUMMY.irrbb.nii.upside, itemStyle: { color: COLORS.success }, lineStyle: { type: 'dashed' } },
      { name: 'Downside', type: 'line', data: DUMMY.irrbb.nii.downside, itemStyle: { color: COLORS.alert }, lineStyle: { type: 'dashed' } },
      { name: 'CI Lower', type: 'line', data: DUMMY.irrbb.nii.ciLow, itemStyle: { color: COLORS.gray }, lineStyle: { type: 'dotted' }, symbol: 'none' },
      { name: 'CI Upper', type: 'line', data: DUMMY.irrbb.nii.ciHigh, itemStyle: { color: COLORS.gray }, lineStyle: { type: 'dotted' }, symbol: 'none' }
    ]
  });

  renderChart('repricingGapChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: DUMMY.irrbb.gap.map(g => g.bucket) },
    yAxis: { type: 'value', axisLabel: { formatter: '₵{value}B' } },
    series: [
      { name: 'RSA', type: 'bar', data: DUMMY.irrbb.gap.map(g => g.rsa), itemStyle: { color: COLORS.primary } },
      { name: 'RSL', type: 'bar', data: DUMMY.irrbb.gap.map(g => g.rsl), itemStyle: { color: COLORS.warning } },
      { name: 'Net Gap', type: 'line', data: DUMMY.irrbb.gap.map(g => g.net), itemStyle: { color: COLORS.success }, lineStyle: { width: 3 } }
    ]
  });

  renderChart('yieldCurveChart', {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: DUMMY.irrbb.yield.tenors },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: 'Current', type: 'line', data: DUMMY.irrbb.yield.current, itemStyle: { color: COLORS.primary }, lineStyle: { width: 3 } },
      { name: '+100bps', type: 'line', data: DUMMY.irrbb.yield.plus100, itemStyle: { color: COLORS.alert }, lineStyle: { type: 'dashed' } },
      { name: '-100bps', type: 'line', data: DUMMY.irrbb.yield.minus100, itemStyle: { color: COLORS.success }, lineStyle: { type: 'dashed' } },
      { name: '1M Ago', type: 'line', data: DUMMY.irrbb.yield.monthAgo, itemStyle: { color: COLORS.gray }, lineStyle: { type: 'dotted' } }
    ]
  });

  const dv01 = DUMMY.irrbb.dv01;
  renderChart('dv01HeatmapChart', {
    tooltip: { position: 'top', formatter: p => `${dv01.currencies[p.value[1]]} ${dv01.tenors[p.value[0]]}: ₵${p.value[2]}M` },
    grid: { left: 48, right: 48, top: 24, bottom: 48 },
    xAxis: { type: 'category', data: dv01.tenors, splitArea: { show: true } },
    yAxis: { type: 'category', data: dv01.currencies, splitArea: { show: true } },
    visualMap: { min: 0, max: 5, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#E0F2FE', '#0EA5E9', '#0369A1'] } },
    series: [{
      type: 'heatmap',
      data: dv01.data.flatMap((row, y) => row.map((v, x) => [x, y, v])),
      label: { show: true, formatter: p => p.value[2].toFixed(1) }
    }]
  });

  renderChart('eveDetailChart', {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: DUMMY.irrbb.eve.scenarios.map(s => s.name) },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: 'EVE Δ %', type: 'bar', data: DUMMY.irrbb.eve.scenarios.map(s => ({ value: s.value, itemStyle: { color: s.value < 0 ? COLORS.alert : COLORS.success } })) },
      { name: 'Limit', type: 'line', data: DUMMY.irrbb.eve.scenarios.map(() => -10), itemStyle: { color: COLORS.alert }, lineStyle: { type: 'dashed' }, symbol: 'none' }
    ]
  });

  renderChart('niiDetailChart', {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yAxis: { type: 'value', axisLabel: { formatter: '₵{value}M' } },
    series: [
      { name: 'Base', type: 'line', data: DUMMY.irrbb.nii.base, smooth: true, itemStyle: { color: COLORS.primary }, lineStyle: { width: 3 }, areaStyle: { opacity: 0.1 } },
      { name: 'Upside', type: 'line', data: DUMMY.irrbb.nii.upside, smooth: true, itemStyle: { color: COLORS.success }, lineStyle: { type: 'dashed' } },
      { name: 'Downside', type: 'line', data: DUMMY.irrbb.nii.downside, smooth: true, itemStyle: { color: COLORS.alert }, lineStyle: { type: 'dashed' } }
    ]
  });

  renderChart('repricingGapDetailChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: DUMMY.irrbb.gap.map(g => g.bucket) },
    yAxis: { type: 'value', axisLabel: { formatter: '₵{value}B' } },
    series: [
      { name: 'RSA', type: 'bar', data: DUMMY.irrbb.gap.map(g => g.rsa), itemStyle: { color: COLORS.primary } },
      { name: 'RSL', type: 'bar', data: DUMMY.irrbb.gap.map(g => g.rsl), itemStyle: { color: COLORS.warning } },
      { name: 'Cumulative', type: 'line', data: DUMMY.irrbb.gap.map(g => g.cum), itemStyle: { color: COLORS.success }, lineStyle: { width: 3 } }
    ]
  });

  renderChart('durationChart', {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: DUMMY.irrbb.gap.map(g => g.bucket) },
    yAxis: { type: 'value', axisLabel: { formatter: '{value} yrs' } },
    series: [
      { name: 'Asset Duration', type: 'line', data: DUMMY.irrbb.gap.map(g => g.rsa / 25), itemStyle: { color: COLORS.primary }, areaStyle: { opacity: 0.1 } },
      { name: 'Liability Duration', type: 'line', data: DUMMY.irrbb.gap.map(g => g.rsl / 25), itemStyle: { color: COLORS.warning } }
    ]
  });
}


// ---------------------------------------------------------------------------
// Capital Adequacy Views
// ---------------------------------------------------------------------------

function renderCapitalOverview() {
  return `
    <div class="view">
      <h1 class="page-title">Capital Adequacy Overview</h1>
      <p class="page-subtitle">CET1, Tier 1, Total Capital, leverage, and RWA composition.</p>

      <div class="grid grid-5 mb-4">
        <div class="card card-accent-green"><div class="kpi-label">CET1 Ratio</div><div class="kpi-value">14.2%</div></div>
        <div class="card card-accent-green"><div class="kpi-label">Tier 1 Ratio</div><div class="kpi-value">15.8%</div></div>
        <div class="card card-accent-green"><div class="kpi-label">Total Capital</div><div class="kpi-value">18.5%</div></div>
        <div class="card card-accent-green"><div class="kpi-label">Leverage Ratio</div><div class="kpi-value">4.85%</div></div>
        <div class="card"><div class="kpi-label">Total RWA</div><div class="kpi-value">₵184.2B</div></div>
      </div>

      <div class="grid grid-2 mb-4">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="layers"></i> Capital Stack</div></div>
          <div class="chart-container chart-md" id="capitalStackChart"></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="pie-chart"></i> RWA Composition</div></div>
          <div class="chart-container chart-md" id="rwaPieChart"></div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header"><div class="card-title"><i data-lucide="bar-chart-3"></i> Capital Ratios vs Requirements</div></div>
        <div class="chart-container chart-lg" id="capitalRatiosChart"></div>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="trending-up"></i> RWA & Capital Trend</div></div>
          <div class="chart-container chart-md" id="capitalTrendChart"></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="shield-check"></i> ICAAP Buffer</div></div>
          <div class="chart-container chart-md" id="icaapChart"></div>
        </div>
      </div>
    </div>
  `;
}

function renderCapitalRatios() {
  return `
    <div class="view">
      <h1 class="page-title">Capital Ratios</h1>
      <p class="page-subtitle">Detailed capital ratio analysis with minimum and buffer requirements.</p>
      <div class="grid grid-3 mb-4">
        ${DUMMY.capital.ratios.map(r => `
          <div class="card ${r.value >= r.buffer ? 'card-accent-green' : 'card-accent-amber'}">
            <div class="kpi-label">${r.name} Ratio</div>
            <div class="kpi-value">${r.value}%</div>
            <div class="kpi-target">Minimum: ${r.min}% • Buffer: ${r.buffer}%</div>
          </div>
        `).join('')}
      </div>
      <div class="card">
        <div class="chart-container chart-lg" id="capitalRatiosDetailChart"></div>
      </div>
    </div>
  `;
}

function renderRWA() {
  return `
    <div class="view">
      <h1 class="page-title">RWA Composition</h1>
      <p class="page-subtitle">Risk-weighted assets by regulatory risk type and output floor mechanics.</p>
      <div class="grid grid-2 mb-4">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="pie-chart"></i> RWA by Risk Type</div></div>
          <div class="chart-container chart-md" id="rwaDetailPieChart"></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="bar-chart-4"></i> Output Floor Build</div></div>
          <div class="chart-container chart-md" id="outputFloorChart"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="alert-triangle"></i> FRTB Risk Charge Breakdown</div></div>
        <div class="chart-container chart-lg" id="frtbChart"></div>
      </div>
    </div>
  `;
}

function renderICAAP() {
  return `
    <div class="view">
      <h1 class="page-title">ICAAP Planning</h1>
      <p class="page-subtitle">Internal Capital Adequacy Assessment Process: Pillar 1, 2A, 2B requirements.</p>
      <div class="grid grid-3 mb-4">
        <div class="card"><div class="kpi-label">Pillar 1</div><div class="kpi-value">₵52.4B</div></div>
        <div class="card"><div class="kpi-label">Pillar 2A</div><div class="kpi-value">₵18.5B</div></div>
        <div class="card"><div class="kpi-label">Pillar 2B / CCB</div><div class="kpi-value">₵8.2B</div></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="bar-chart"></i> Capital Requirement Stack</div></div>
        <div class="chart-container chart-lg" id="icaapDetailChart"></div>
      </div>
    </div>
  `;
}

function renderMREL() {
  return `
    <div class="view">
      <h1 class="page-title">MREL / TLAC</h1>
      <p class="page-subtitle">Minimum Requirement for Own Funds and Eligible Liabilities.</p>
      <div class="grid grid-3 mb-4">
        <div class="card card-accent-green"><div class="kpi-label">MREL Total</div><div class="kpi-value">₵133.1B</div></div>
        <div class="card"><div class="kpi-label">Requirement</div><div class="kpi-value">₵118.5B</div></div>
        <div class="card"><div class="kpi-label">Surplus</div><div class="kpi-value">₵14.6B</div></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="layers"></i> MREL Eligible Components</div></div>
        <div class="chart-container chart-lg" id="mrelChart"></div>
      </div>
    </div>
  `;
}

function initCapitalCharts() {
  const stack = DUMMY.capital.stack;
  renderChart('capitalStackChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 140, right: 80, top: 24, bottom: 24 },
    xAxis: { type: 'value', axisLabel: { formatter: '₵{value}B' } },
    yAxis: { type: 'category', data: stack.map(s => s.component) },
    series: [{
      type: 'bar',
      stack: 'capital',
      data: stack.map(s => ({
        value: s.value,
        itemStyle: {
          color: s.type === 'cet1' ? COLORS.success : s.type === 'at1' ? COLORS.warning : s.type === 't2' ? COLORS.primary : s.type === 'deduction' ? COLORS.alert : COLORS.gray
        }
      })),
      label: { show: true, position: 'right', formatter: p => (p.value > 0 ? '+' : '') + p.value + 'B' }
    }]
  });

  renderChart('rwaPieChart', {
    tooltip: { trigger: 'item', formatter: '{b}: ₵{c}B ({d}%)' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      label: { show: false },
      data: DUMMY.capital.rwa.byType
    }]
  });

  renderChart('capitalRatiosChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: DUMMY.capital.ratios.map(r => r.name) },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: 'Actual', type: 'bar', data: DUMMY.capital.ratios.map(r => r.value), itemStyle: { color: COLORS.success } },
      { name: 'Minimum', type: 'bar', data: DUMMY.capital.ratios.map(r => r.min), itemStyle: { color: COLORS.gray } },
      { name: 'Buffer Req.', type: 'bar', data: DUMMY.capital.ratios.map(r => r.buffer - r.min), itemStyle: { color: COLORS.warning } }
    ]
  });

  renderChart('capitalTrendChart', {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: ['Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'] },
    yAxis: [
      { type: 'value', name: 'RWA ₵B', position: 'left' },
      { type: 'value', name: 'CET1 %', position: 'right', axisLabel: { formatter: '{value}%' } }
    ],
    series: [
      { name: 'RWA', type: 'bar', data: [178.5, 179.2, 180.1, 181.0, 181.8, 182.5, 183.1, 183.4, 183.8, 184.0, 184.1, 184.2], itemStyle: { color: COLORS.primary } },
      { name: 'CET1 %', type: 'line', yAxisIndex: 1, data: [13.8, 13.9, 13.9, 14.0, 14.0, 14.1, 14.1, 14.15, 14.15, 14.2, 14.2, 14.2], itemStyle: { color: COLORS.success }, lineStyle: { width: 3 } }
    ]
  });

  renderChart('icaapChart', {
    tooltip: { trigger: 'item', formatter: '{b}: ₵{c}B ({d}%)' },
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 5,
      axisLine: { lineStyle: { width: 20, color: [[0.85, COLORS.alert], [1, COLORS.success]] } },
      pointer: { length: '60%', width: 6 },
      axisTick: { show: false },
      splitLine: { length: 20 },
      detail: { formatter: '{value}%', fontSize: 24, fontWeight: 800, offsetCenter: [0, '20%'] },
      data: [{ value: 92.2, name: 'Coverage' }]
    }]
  });

  renderChart('capitalRatiosDetailChart', {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: DUMMY.capital.ratios.map(r => r.name) },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: 'Actual', type: 'bar', data: DUMMY.capital.ratios.map(r => r.value), itemStyle: { color: COLORS.success } },
      { name: 'Buffer', type: 'bar', data: DUMMY.capital.ratios.map(r => r.buffer), itemStyle: { color: COLORS.warning } },
      { name: 'Minimum', type: 'line', data: DUMMY.capital.ratios.map(r => r.min), itemStyle: { color: COLORS.alert }, lineStyle: { type: 'dashed' } }
    ]
  });

  renderChart('rwaDetailPieChart', {
    tooltip: { trigger: 'item', formatter: '{b}: ₵{c}B ({d}%)' },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      label: { show: false },
      data: DUMMY.capital.rwa.byType
    }]
  });

  renderChart('outputFloorChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 48, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'value', axisLabel: { formatter: '₵{value}B' } },
    yAxis: { type: 'category', data: DUMMY.capital.outputFloor.map(s => s.step) },
    series: [{
      type: 'bar',
      stack: 'floor',
      data: DUMMY.capital.outputFloor.map((s, i) => ({
        value: s.value,
        itemStyle: { color: i === DUMMY.capital.outputFloor.length - 1 ? COLORS.success : i % 2 === 0 ? COLORS.primary : COLORS.violet }
      }))
    }]
  });

  renderChart('frtbChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 140, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'value', axisLabel: { formatter: '₵{value}M' } },
    yAxis: { type: 'category', data: DUMMY.capital.frtb.map(f => f.risk) },
    series: [{
      type: 'bar',
      data: DUMMY.capital.frtb.map(f => ({ value: f.value, itemStyle: { color: COLORS.primary } })),
      label: { show: true, position: 'right', formatter: '₵{c}M' }
    }]
  });

  renderChart('icaapDetailChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 48, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'category', data: ['Pillar 1', 'Pillar 2A', 'Pillar 2B', 'Available'] },
    yAxis: { type: 'value', axisLabel: { formatter: '₵{value}B' } },
    series: [{
      type: 'bar',
      data: [
        { value: DUMMY.capital.icaap.pillar1, itemStyle: { color: COLORS.primary } },
        { value: DUMMY.capital.icaap.pillar2a, itemStyle: { color: COLORS.warning } },
        { value: DUMMY.capital.icaap.pillar2b, itemStyle: { color: COLORS.alert } },
        { value: DUMMY.capital.icaap.available, itemStyle: { color: COLORS.success } }
      ],
      label: { show: true, position: 'top', formatter: '₵{c}B' }
    }]
  });

  renderChart('mrelChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 48, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'value', axisLabel: { formatter: '₵{value}B' } },
    yAxis: { type: 'category', data: DUMMY.capital.mrel.components.map(c => c.name) },
    series: [{
      type: 'bar',
      stack: 'mrel',
      data: DUMMY.capital.mrel.components.map(c => ({ value: c.value, itemStyle: { color: c.name.includes('CET1') ? COLORS.success : c.name.includes('AT1') ? COLORS.warning : c.name.includes('T2') ? COLORS.primary : COLORS.violet } })),
      markLine: {
        silent: true,
        symbol: 'none',
        data: [{ xAxis: DUMMY.capital.mrel.requirement, lineStyle: { color: COLORS.alert, type: 'dashed', width: 2 }, label: { formatter: 'Req. ₵{c}B' } }]
      }
    }]
  });
}

// ---------------------------------------------------------------------------
// ECL / Credit Risk Views
// ---------------------------------------------------------------------------

function renderECLOverview() {
  return `
    <div class="view">
      <h1 class="page-title">ECL / Credit Risk Overview</h1>
      <p class="page-subtitle">IFRS 9 expected credit loss, staging, scenarios, and overlays.</p>

      <div class="grid grid-5 mb-4">
        <div class="card card-accent-amber"><div class="kpi-label">Total ECL</div><div class="kpi-value">₵3.25B</div></div>
        <div class="card"><div class="kpi-label">Coverage Ratio</div><div class="kpi-value">1.85%</div></div>
        <div class="card"><div class="kpi-label">Stage 3 Ratio</div><div class="kpi-value">35.1%</div></div>
        <div class="card"><div class="kpi-label">SICR Triggers</div><div class="kpi-value">2</div></div>
        <div class="card"><div class="kpi-label">Pending Overlays</div><div class="kpi-value">₵4.2M</div></div>
      </div>

      <div class="grid grid-3 mb-4">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="pie-chart"></i> ECL by Stage</div></div>
          <div class="chart-container chart-md" id="eclStagePieChart"></div>
        </div>
        <div class="card grid-span-2">
          <div class="card-header"><div class="card-title"><i data-lucide="trending-up"></i> ECL Trend</div></div>
          <div class="chart-container chart-md" id="eclTrendChart"></div>
        </div>
      </div>

      <div class="grid grid-2 mb-4">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="cloud-sun"></i> Scenario-Weighted ECL</div></div>
          <div class="chart-container chart-md" id="eclScenarioChart"></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="globe"></i> Sector/Region PD Heatmap</div></div>
          <div class="chart-container chart-md" id="eclHeatmapChart"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="alert-triangle"></i> SICR Triggers</div></div>
        <table class="data-table">
          <tr><th>Loan ID</th><th class="text-right">Exposure (₵M)</th><th class="text-right">PD Multiple</th><th>Status</th></tr>
          ${DUMMY.ecl.sicr.map(s => `
            <tr>
              <td>${s.id}</td>
              <td class="num">${s.exposure.toFixed(1)}</td>
              <td class="num" style="color:${s.multiple >= 2 ? COLORS.alert : s.multiple >= 1.5 ? COLORS.warning : COLORS.success}">${s.multiple.toFixed(1)}x</td>
              <td><span class="status ${s.status === 'triggered' ? 'status-red' : s.status === 'watch' ? 'status-amber' : 'status-green'}">${s.status === 'triggered' ? 'Stage 2 Triggered' : s.status === 'watch' ? 'Watchlist' : 'Normal'}</span></td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;
}

function renderECLStaging() {
  return `
    <div class="view">
      <h1 class="page-title">Staging Distribution</h1>
      <p class="page-subtitle">IFRS 9 stage allocation and migration matrix.</p>
      <div class="grid grid-3 mb-4">
        ${DUMMY.ecl.byStage.map(s => `
          <div class="card" style="border-top:4px solid ${s.color}">
            <div class="kpi-label">${s.stage}</div>
            <div class="kpi-value">₵${(s.value / 1000).toFixed(2)}B</div>
            <div class="kpi-target">${s.pct}% of total ECL</div>
          </div>
        `).join('')}
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="move-right"></i> Migration Matrix (QoQ)</div></div>
        <div class="chart-container chart-lg" id="migrationChart"></div>
      </div>
    </div>
  `;
}

function renderSICR() {
  return `
    <div class="view">
      <h1 class="page-title">SICR Monitor</h1>
      <p class="page-subtitle">Significant increase in credit risk trigger and watchlist management.</p>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="bar-chart-2"></i> PD Multiple Distribution</div></div>
        <div class="chart-container chart-lg" id="sicrChart"></div>
      </div>
    </div>
  `;
}

function renderECLScenarios() {
  return `
    <div class="view">
      <h1 class="page-title">Macro Scenarios</h1>
      <p class="page-subtitle">Probability-weighted scenario ECL and overlay governance.</p>
      <div class="grid grid-2 mb-4">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="scale"></i> Scenario Weights</div></div>
          <div class="chart-container chart-md" id="scenarioWeightChart"></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="layers"></i> Scenario-Weighted ECL</div></div>
          <div class="chart-container chart-md" id="scenarioEclChart"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="shield"></i> Overlay Governance</div></div>
        <table class="data-table">
          <tr><th>Overlay</th><th class="text-right">Amount (₵M)</th><th>Status</th><th class="text-center">Date</th><th class="text-right">BT Coverage</th></tr>
          ${DUMMY.ecl.overlays.map(o => `
            <tr>
              <td>${o.name}</td>
              <td class="num">${o.amount.toFixed(1)}</td>
              <td><span class="status ${o.status === 'approved' ? 'status-green' : o.status === 'pending' ? 'status-amber' : 'status-blue'}">${o.status}</span></td>
              <td class="text-center">${o.date}</td>
              <td class="num">${o.bt !== null ? o.bt + '%' : '—'}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;
}

function renderECLOverlays() {
  return `
    <div class="view">
      <h1 class="page-title">Overlay Governance</h1>
      <p class="page-subtitle">Management overlays and model risk adjustments.</p>
      <div class="card">
        <table class="data-table">
          <tr><th>Overlay</th><th class="text-right">Amount (₵M)</th><th>Status</th><th class="text-center">Date</th><th class="text-right">BT Coverage</th><th>Actions</th></tr>
          ${DUMMY.ecl.overlays.map(o => `
            <tr>
              <td>${o.name}</td>
              <td class="num">${o.amount.toFixed(1)}</td>
              <td><span class="status ${o.status === 'approved' ? 'status-green' : o.status === 'pending' ? 'status-amber' : 'status-blue'}">${o.status}</span></td>
              <td class="text-center">${o.date}</td>
              <td class="num">${o.bt !== null ? o.bt + '%' : '—'}</td>
              <td><button class="btn btn-ghost btn-sm">View</button></td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;
}

function initECLCharts() {
  renderChart('eclStagePieChart', {
    tooltip: { trigger: 'item', formatter: '{b}: ₵{c}M ({d}%)' },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      label: { show: false },
      data: DUMMY.ecl.byStage
    }]
  });

  renderChart('eclTrendChart', {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: DUMMY.ecl.trend.months },
    yAxis: { type: 'value', axisLabel: { formatter: '₵{value}M' } },
    series: [
      { name: 'Stage 1', type: 'bar', stack: 'ecl', data: DUMMY.ecl.trend.stage1, itemStyle: { color: COLORS.success } },
      { name: 'Stage 2', type: 'bar', stack: 'ecl', data: DUMMY.ecl.trend.stage2, itemStyle: { color: COLORS.warning } },
      { name: 'Stage 3', type: 'bar', stack: 'ecl', data: DUMMY.ecl.trend.stage3, itemStyle: { color: COLORS.alert } }
    ]
  });

  renderChart('eclScenarioChart', {
    tooltip: { trigger: 'item', formatter: '{b}: ₵{c}M ({d}%)' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: { show: false },
      data: DUMMY.ecl.scenarios
    }]
  });

  const hm = DUMMY.ecl.heatmap;
  renderChart('eclHeatmapChart', {
    tooltip: { position: 'top', formatter: p => `${hm.sectors[p.value[1]]} / ${hm.regions[p.value[0]]}: ${p.value[2]}% PD` },
    grid: { left: 80, right: 24, top: 24, bottom: 48 },
    xAxis: { type: 'category', data: hm.regions, splitArea: { show: true } },
    yAxis: { type: 'category', data: hm.sectors, splitArea: { show: true } },
    visualMap: { min: 0, max: 5, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#DCFCE7', '#22C55E', '#14532D'] } },
    series: [{ type: 'heatmap', data: hm.values.flatMap((row, y) => row.map((v, x) => [x, y, v])), label: { show: true, formatter: p => p.value[2].toFixed(1) } }]
  });

  renderChart('migrationChart', {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: ['Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'] },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: 'Stage 1', type: 'bar', stack: 'stage', data: [92.5, 91.8, 90.5, 89.2, 88.0], itemStyle: { color: COLORS.success } },
      { name: 'Stage 2', type: 'bar', stack: 'stage', data: [5.5, 6.2, 7.5, 8.8, 10.0], itemStyle: { color: COLORS.warning } },
      { name: 'Stage 3', type: 'bar', stack: 'stage', data: [2.0, 2.0, 2.0, 2.0, 2.0], itemStyle: { color: COLORS.alert } }
    ]
  });

  renderChart('sicrChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 100, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'value', axisLabel: { formatter: '{value}x' } },
    yAxis: { type: 'category', data: DUMMY.ecl.sicr.map(s => s.id) },
    series: [{
      type: 'bar',
      data: DUMMY.ecl.sicr.map(s => ({
        value: s.multiple,
        itemStyle: { color: s.multiple >= 2 ? COLORS.alert : s.multiple >= 1.5 ? COLORS.warning : COLORS.success }
      })),
      markLine: {
        silent: true,
        data: [
          { xAxis: 1.5, lineStyle: { color: COLORS.warning, type: 'dashed' }, label: { formatter: 'Watch' } },
          { xAxis: 2.0, lineStyle: { color: COLORS.alert, type: 'dashed' }, label: { formatter: 'Trigger' } }
        ]
      }
    }]
  });

  renderChart('scenarioWeightChart', {
    tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
    series: [{
      type: 'pie',
      radius: ['50%', '80%'],
      avoidLabelOverlap: false,
      label: { show: false },
      data: DUMMY.ecl.scenarios.map(s => ({ value: s.weight, name: s.name, itemStyle: { color: s.color } }))
    }]
  });

  renderChart('scenarioEclChart', {
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'category', data: DUMMY.ecl.scenarios.map(s => s.name) },
    yAxis: { type: 'value', axisLabel: { formatter: '₵{value}M' } },
    series: [{
      type: 'bar',
      data: DUMMY.ecl.scenarios.map(s => ({ value: s.value, itemStyle: { color: s.color } })),
      label: { show: true, position: 'top', formatter: '₵{c}M' }
    }]
  });
}


// ---------------------------------------------------------------------------
// FTP & Pricing Views
// ---------------------------------------------------------------------------

function renderFTPOverview() {
  return `
    <div class="view">
      <h1 class="page-title">FTP & Pricing Overview</h1>
      <p class="page-subtitle">Internal funds transfer pricing curve, NMD allocation, and deal profitability.</p>

      <div class="grid grid-5 mb-4">
        <div class="card card-accent-green"><div class="kpi-label">Current FTP</div><div class="kpi-value">3.42%</div></div>
        <div class="card"><div class="kpi-label">LTP Charges</div><div class="kpi-value">₵895M</div></div>
        <div class="card"><div class="kpi-label">STP Benefits</div><div class="kpi-value">₵895M</div></div>
        <div class="card"><div class="kpi-label">NMD Volume</div><div class="kpi-value">₵120.0B</div></div>
        <div class="card"><div class="kpi-label">Avg Spread</div><div class="kpi-value">+18bp</div></div>
      </div>

      <div class="grid grid-3 mb-4">
        <div class="card grid-span-2">
          <div class="card-header">
            <div class="card-title"><i data-lucide="line-chart"></i> FTP Curve</div>
            <div class="card-actions">
              <button class="btn btn-ghost btn-sm active">GHS</button>
              <button class="btn btn-ghost btn-sm">USD</button>
              <button class="btn btn-ghost btn-sm">GBP</button>
            </div>
          </div>
          <div class="chart-container chart-lg" id="ftpCurveChart"></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="pie-chart"></i> NMD Allocation</div></div>
          <div class="chart-container chart-md" id="nmdAllocationChart"></div>
        </div>
      </div>

      <div class="grid grid-2 mb-4">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="wallet"></i> Deposit FTP vs Customer Rate</div></div>
          <div class="chart-container chart-md" id="depositChart"></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="bar-chart-3"></i> FTP Attribution</div></div>
          <div class="chart-container chart-md" id="ftpAttributionChart"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="grid-3x3"></i> Deal Pricing Grid</div></div>
        <div class="chart-container chart-lg" id="pricingGridChart"></div>
      </div>
    </div>
  `;
}

function renderFTPCurve() {
  return `
    <div class="view">
      <h1 class="page-title">FTP Curve</h1>
      <p class="page-subtitle">Term structure of internal funds transfer rates and spread to market.</p>
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i data-lucide="line-chart"></i> GHS FTP Curve</div>
          <div class="card-actions">
            <button class="btn btn-ghost btn-sm active">Current</button>
            <button class="btn btn-ghost btn-sm">History</button>
          </div>
        </div>
        <div class="chart-container chart-lg" id="ftpCurveDetailChart"></div>
      </div>
    </div>
  `;
}

function renderNMD() {
  return `
    <div class="view">
      <h1 class="page-title">NMD Portfolio</h1>
      <p class="page-subtitle">Non-maturity deposit allocation, stability analysis, and repricing assumptions.</p>
      <div class="grid grid-3 mb-4">
        <div class="card"><div class="kpi-label">Total NMD</div><div class="kpi-value">₵120.0B</div></div>
        <div class="card"><div class="kpi-label">Core Deposits</div><div class="kpi-value">₵72.4B</div></div>
        <div class="card"><div class="kpi-label">Avg Beta</div><div class="kpi-value">0.42</div></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="pie-chart"></i> Behavioral Maturity Allocation</div></div>
        <div class="chart-container chart-lg" id="nmdBehavioralChart"></div>
      </div>
    </div>
  `;
}

function renderFTPPricing() {
  return `
    <div class="view">
      <h1 class="page-title">Deal Pricing</h1>
      <p class="page-subtitle">Product and segment level FTP-based pricing recommendations.</p>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="grid-3x3"></i> Pricing Grid (%)</div></div>
        <div class="chart-container chart-lg" id="pricingGridDetailChart"></div>
      </div>
    </div>
  `;
}

function renderFTPProfitability() {
  return `
    <div class="view">
      <h1 class="page-title">Profitability</h1>
      <p class="page-subtitle">FTP-adjusted business unit profitability and margin attribution.</p>
      <div class="grid grid-2 mb-4">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="arrow-up-circle"></i> LTP Charges by Unit</div></div>
          <div class="chart-container chart-md" id="ltpChart"></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="arrow-down-circle"></i> STP Benefits by Source</div></div>
          <div class="chart-container chart-md" id="stpChart"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="bar-chart"></i> Contribution Margin</div></div>
        <div class="chart-container chart-lg" id="contributionChart"></div>
      </div>
    </div>
  `;
}

function initFTPCharts() {
  renderChart('ftpCurveChart', {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: DUMMY.ftp.curve.tenors },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: 'Market Curve', type: 'line', data: DUMMY.ftp.curve.market, itemStyle: { color: COLORS.gray }, lineStyle: { type: 'dashed' } },
      { name: 'FTP Curve', type: 'line', data: DUMMY.ftp.curve.ftp, itemStyle: { color: COLORS.primary }, lineStyle: { width: 3 } },
      { name: 'Spread', type: 'bar', data: DUMMY.ftp.curve.spread, itemStyle: { color: COLORS.warning } }
    ]
  });

  renderChart('nmdAllocationChart', {
    tooltip: { trigger: 'item', formatter: '{b}: ₵{c}B ({d}%)' },
    series: [{
      type: 'pie',
      radius: ['50%', '80%'],
      avoidLabelOverlap: false,
      label: { show: false },
      data: DUMMY.ftp.nmd.map(n => ({ value: n.amount, name: n.tenor }))
    }]
  });

  renderChart('depositChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: DUMMY.ftp.deposit.map(d => d.product) },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: 'FTP', type: 'bar', data: DUMMY.ftp.deposit.map(d => d.ftp), itemStyle: { color: COLORS.primary } },
      { name: 'Customer Rate', type: 'bar', data: DUMMY.ftp.deposit.map(d => d.rate), itemStyle: { color: COLORS.success } }
    ]
  });

  renderChart('ftpAttributionChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 100, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'value', axisLabel: { formatter: '₵{value}M' } },
    yAxis: { type: 'category', data: DUMMY.ftp.attribution.map(a => a.name) },
    series: [{
      type: 'bar',
      data: DUMMY.ftp.attribution.map(a => ({ value: a.value, itemStyle: { color: COLORS.primary } })),
      label: { show: true, position: 'right', formatter: '₵{c}M' }
    }]
  });

  renderChart('pricingGridChart', {
    tooltip: { position: 'top', formatter: p => `${DUMMY.ftp.dealGrid.products[p.value[1]]} / ${DUMMY.ftp.dealGrid.segments[p.value[0]]}: ${p.value[2]}%` },
    grid: { left: 120, right: 48, top: 24, bottom: 48 },
    xAxis: { type: 'category', data: DUMMY.ftp.dealGrid.segments, splitArea: { show: true } },
    yAxis: { type: 'category', data: DUMMY.ftp.dealGrid.products, splitArea: { show: true } },
    visualMap: { min: -2, max: 4, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#EF4444', '#FFFFFF', '#3B82F6'] } },
    series: [{ type: 'heatmap', data: DUMMY.ftp.dealGrid.values.flatMap((row, y) => row.map((v, x) => [x, y, v])).filter(p => p[2] !== null), label: { show: true, formatter: p => p.value[2].toFixed(2) } }]
  });

  renderChart('ftpCurveDetailChart', {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: DUMMY.ftp.curve.tenors },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: 'Market', type: 'line', data: DUMMY.ftp.curve.market, itemStyle: { color: COLORS.gray }, lineStyle: { type: 'dashed' } },
      { name: 'FTP', type: 'line', data: DUMMY.ftp.curve.ftp, itemStyle: { color: COLORS.primary }, lineStyle: { width: 3 } },
      { name: 'Liquidity Premium', type: 'line', data: DUMMY.ftp.curve.spread.map((s, i) => (s + DUMMY.ftp.curve.market[i]).toFixed(2)), itemStyle: { color: COLORS.warning }, lineStyle: { type: 'dotted' } }
    ]
  });

  const nmd = DUMMY.irrbb.nmd;
  renderChart('nmdBehavioralChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0 },
    grid: { left: 48, right: 48, top: 24, bottom: 40 },
    xAxis: { type: 'category', data: nmd.allocation.map(a => a.tenor) },
    yAxis: { type: 'value', axisLabel: { formatter: '₵{value}B' } },
    series: [
      { name: 'Core', type: 'bar', stack: 'nmd', data: nmd.allocation.map(a => a.core), itemStyle: { color: COLORS.success } },
      { name: 'Semi-Core', type: 'bar', stack: 'nmd', data: nmd.allocation.map(a => a.semi), itemStyle: { color: COLORS.warning } },
      { name: 'Volatile', type: 'bar', stack: 'nmd', data: nmd.allocation.map(a => a.volatile), itemStyle: { color: COLORS.alert } }
    ]
  });

  renderChart('pricingGridDetailChart', {
    tooltip: { position: 'top', formatter: p => `${DUMMY.ftp.dealGrid.products[p.value[1]]} / ${DUMMY.ftp.dealGrid.segments[p.value[0]]}: ${p.value[2]}%` },
    grid: { left: 120, right: 48, top: 24, bottom: 48 },
    xAxis: { type: 'category', data: DUMMY.ftp.dealGrid.segments, splitArea: { show: true } },
    yAxis: { type: 'category', data: DUMMY.ftp.dealGrid.products, splitArea: { show: true } },
    visualMap: { min: -2, max: 4, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#EF4444', '#FFFFFF', '#3B82F6'] } },
    series: [{ type: 'heatmap', data: DUMMY.ftp.dealGrid.values.flatMap((row, y) => row.map((v, x) => [x, y, v])).filter(p => p[2] !== null), label: { show: true, formatter: p => p.value[2].toFixed(2) } }]
  });

  renderChart('ltpChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 140, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'value', axisLabel: { formatter: '₵{value}M' } },
    yAxis: { type: 'category', data: DUMMY.ftp.ltp.charges.map(c => c.unit) },
    series: [{
      type: 'bar',
      data: DUMMY.ftp.ltp.charges.map(c => ({ value: c.value, itemStyle: { color: COLORS.alert } })),
      label: { show: true, position: 'right', formatter: '₵{c}M' }
    }]
  });

  renderChart('stpChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 140, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'value', axisLabel: { formatter: '₵{value}M' } },
    yAxis: { type: 'category', data: DUMMY.ftp.ltp.benefits.map(c => c.unit) },
    series: [{
      type: 'bar',
      data: DUMMY.ftp.ltp.benefits.map(c => ({ value: c.value, itemStyle: { color: COLORS.success } })),
      label: { show: true, position: 'right', formatter: '₵{c}M' }
    }]
  });

  renderChart('contributionChart', {
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'category', data: DUMMY.ftp.ltp.charges.map(c => c.unit) },
    yAxis: { type: 'value', axisLabel: { formatter: '₵{value}M' } },
    series: [
      { name: 'Charges', type: 'bar', data: DUMMY.ftp.ltp.charges.map(c => -c.value), itemStyle: { color: COLORS.alert } },
      { name: 'Benefits', type: 'bar', data: [520, 280, 95, 0], itemStyle: { color: COLORS.success } }
    ]
  });
}

// ---------------------------------------------------------------------------
// Optimization Views
// ---------------------------------------------------------------------------

function renderOptimizationOverview() {
  return `
    <div class="view">
      <h1 class="page-title">Balance Sheet Optimization</h1>
      <p class="page-subtitle">NIM attribution, strategic balance sheet planning, and ALCO decision support.</p>

      <div class="grid grid-5 mb-4">
        <div class="card card-accent-amber"><div class="kpi-label">NIM</div><div class="kpi-value">1.85%</div></div>
        <div class="card"><div class="kpi-label">NII</div><div class="kpi-value">₵3.25B</div></div>
        <div class="card"><div class="kpi-label">Hedge Coverage</div><div class="kpi-value">72%</div></div>
        <div class="card"><div class="kpi-label">Target Hedge</div><div class="kpi-value">80%</div></div>
        <div class="card"><div class="kpi-label">Pipeline</div><div class="kpi-value">₵1.67B</div></div>
      </div>

      <div class="grid grid-2 mb-4">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="bar-chart-3"></i> NIM Attribution</div></div>
          <div class="chart-container chart-md" id="nimAttributionChart"></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="target"></i> Hedge Coverage Gap</div></div>
          <div class="chart-container chart-md" id="hedgeGapChart"></div>
        </div>
      </div>

      <div class="grid grid-2 mb-4">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="table"></i> Balance Sheet Plan</div></div>
          <table class="data-table">
            <tr><th>Category</th><th class="text-right">Actual (₵B)</th><th class="text-right">Target (₵B)</th><th class="text-right">Gap</th></tr>
            ${DUMMY.optimization.balancePlan.map(b => `
              <tr>
                <td>${b.category}</td>
                <td class="num">${b.actual.toFixed(1)}</td>
                <td class="num">${b.target.toFixed(1)}</td>
                <td class="num" style="color:${b.actual >= b.target ? COLORS.success : COLORS.warning}">${(b.actual - b.target).toFixed(1)}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="git-commit"></i> Lending Pipeline</div></div>
          <div class="chart-container chart-md" id="pipelineChart"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="sliders"></i> What-If Scenario Builder</div></div>
        <div class="scenario-builder">
          <div>
            <div class="slider-group"><label>Rate Change <span class="value">+50 bps</span></label><input type="range" class="slider" min="-200" max="200" step="25" value="50"></div>
            <div class="slider-group"><label>Deposit Beta <span class="value">0.45</span></label><input type="range" class="slider" min="0" max="1" step="0.05" value="0.45"></div>
            <div class="slider-group"><label>Loan Growth <span class="value">5%</span></label><input type="range" class="slider" min="-10" max="20" step="1" value="5"></div>
            <div class="slider-group"><label>Funding Mix Shift <span class="value">2%</span></label><input type="range" class="slider" min="-10" max="10" step="1" value="2"></div>
            <button class="btn btn-primary"><i data-lucide="play" style="width:14px;height:14px"></i> Simulate</button>
          </div>
          <div class="card" style="background:var(--bg-page)">
            <div class="metric-row"><span class="metric-name">NIM</span><span class="metric-value">1.85%</span></div>
            <div class="metric-row"><span class="metric-name">NII Impact</span><span class="metric-value" style="color:${COLORS.success}">+₵145M</span></div>
            <div class="metric-row"><span class="metric-name">EVE Δ</span><span class="metric-value" style="color:${COLORS.alert}">-1.2%</span></div>
            <div class="metric-row"><span class="metric-name">CET1</span><span class="metric-value">14.1%</span></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderNIM() {
  return `
    <div class="view">
      <h1 class="page-title">NIM Attribution</h1>
      <p class="page-subtitle">Bridge analysis from prior period NIM to current NIM.</p>
      <div class="card">
        <div class="chart-container chart-lg" id="nimBridgeChart"></div>
      </div>
    </div>
  `;
}

function renderWhatIf() {
  return `
    <div class="view">
      <h1 class="page-title">What-If Builder</h1>
      <p class="page-subtitle">Interactive scenario builder for balance sheet and rate decisions.</p>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="sliders"></i> Scenario Parameters</div></div>
        <div class="scenario-builder">
          <div>
            <div class="slider-group"><label>Rate Shock <span class="value">+50 bps</span></label><input type="range" class="slider" min="-200" max="200" step="25" value="50"></div>
            <div class="slider-group"><label>Deposit Beta <span class="value">0.45</span></label><input type="range" class="slider" min="0" max="1" step="0.05" value="0.45"></div>
            <div class="slider-group"><label>Loan Growth <span class="value">5%</span></label><input type="range" class="slider" min="-10" max="20" step="1" value="5"></div>
            <div class="slider-group"><label>Deposit Growth <span class="value">3%</span></label><input type="range" class="slider" min="-10" max="20" step="1" value="3"></div>
            <div class="slider-group"><label>Hedge Ratio <span class="value">72%</span></label><input type="range" class="slider" min="0" max="100" step="5" value="72"></div>
            <button class="btn btn-primary"><i data-lucide="play" style="width:14px;height:14px"></i> Run Simulation</button>
          </div>
          <div class="card" style="background:var(--bg-page)">
            <div class="metric-row"><span class="metric-name">NIM</span><span class="metric-value">1.85%</span></div>
            <div class="metric-row"><span class="metric-name">NII</span><span class="metric-value" style="color:${COLORS.success}">+₵145M</span></div>
            <div class="metric-row"><span class="metric-name">EVE Δ</span><span class="metric-value" style="color:${COLORS.alert}">-1.2%</span></div>
            <div class="metric-row"><span class="metric-name">LCR</span><span class="metric-value">135.8%</span></div>
            <div class="metric-row"><span class="metric-name">CET1</span><span class="metric-value">14.1%</span></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderALCOPack() {
  return `
    <div class="view">
      <h1 class="page-title">ALCO Pack</h1>
      <p class="page-subtitle">Executive dashboard and key risk reporting for ALCO meetings.</p>
      <div class="grid grid-2 mb-4">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="file-bar-chart"></i> Pack Status</div></div>
          <div class="action-list">
            <div class="action-item"><div class="action-priority high"></div><div class="action-content"><div class="action-title">June 2026 ALCO Pack</div><div class="action-meta">Auto-generated • Awaiting review</div></div></div>
            <div class="action-item"><div class="action-priority medium"></div><div class="action-content"><div class="action-title">May 2026 ALCO Pack</div><div class="action-meta">Approved • Distributed</div></div></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="clock"></i> Submissions</div></div>
          <div class="action-list">
            ${DUMMY.optimization.submissions.map(s => `
              <div class="action-item">
                <div class="action-priority ${s.status === 'overdue' ? 'high' : s.status === 'due' ? 'medium' : 'normal'}"></div>
                <div class="action-content">
                  <div class="action-title">${s.name}</div>
                  <div class="action-meta">Due: ${s.deadline} • Owner: ${s.owner}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="download"></i> Download Center</div></div>
        <div class="quick-links">
          <a href="#" class="quick-link" style="color:${COLORS.primary}"><i data-lucide="file-spreadsheet"></i><span>Excel Pack</span></a>
          <a href="#" class="quick-link" style="color:${COLORS.success}"><i data-lucide="file-text"></i><span>PDF Report</span></a>
          <a href="#" class="quick-link" style="color:${COLORS.warning}"><i data-lucide="presentation"></i><span>Presentation</span></a>
          <a href="#" class="quick-link" style="color:${COLORS.violet}"><i data-lucide="code"></i><span>Data Export</span></a>
        </div>
      </div>
    </div>
  `;
}

function initOptimizationCharts() {
  const nim = DUMMY.optimization.nim;
  const values = [nim.prev, ...nim.components.map(c => c.value), nim.current];
  const labels = ['PY NIM', ...nim.components.map(c => c.name), 'Current'];
  renderChart('nimAttributionChart', {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 48, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'category', data: labels },
    yAxis: { type: 'value', axisLabel: { formatter: '{value} bps' } },
    series: [{
      type: 'bar',
      data: values.map((v, i) => ({
        value: v,
        itemStyle: { color: i === 0 || i === values.length - 1 ? COLORS.primary : v >= 0 ? COLORS.success : COLORS.alert }
      })),
      label: { show: true, position: 'top', formatter: p => (p.value > 0 ? '+' : '') + p.value }
    }]
  });

  renderChart('hedgeGapChart', {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 5,
      axisLine: { lineStyle: { width: 20, color: [[DUMMY.optimization.hedge.current / 100, COLORS.warning], [1, COLORS.success]] } },
      pointer: { length: '60%', width: 6 },
      axisTick: { show: false },
      splitLine: { length: 20 },
      detail: { formatter: '{value}%', fontSize: 24, fontWeight: 800, offsetCenter: [0, '20%'] },
      data: [{ value: DUMMY.optimization.hedge.current }]
    }]
  });

  renderChart('pipelineChart', {
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'category', data: DUMMY.optimization.pipeline.map(p => p.stage) },
    yAxis: { type: 'value', axisLabel: { formatter: '₵{value}M' } },
    series: [{
      type: 'bar',
      data: DUMMY.optimization.pipeline.map(p => ({ value: p.value, itemStyle: { color: COLORS.primary } })),
      label: { show: true, position: 'top', formatter: '₵{c}M' }
    }]
  });

  renderChart('nimBridgeChart', {
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 48, top: 24, bottom: 24 },
    xAxis: { type: 'category', data: labels },
    yAxis: { type: 'value', axisLabel: { formatter: '{value} bps' } },
    series: [{
      type: 'bar',
      data: values.map((v, i) => ({
        value: v,
        itemStyle: { color: i === 0 || i === values.length - 1 ? COLORS.primary : v >= 0 ? COLORS.success : COLORS.alert }
      })),
      label: { show: true, position: 'top', formatter: p => (p.value > 0 ? '+' : '') + p.value }
    }]
  });
}

function renderRecoveryOverview() {
  return `<div class="view"><h1 class="page-title">Recovery Planning</h1><p class="page-subtitle">BoG 2026 recovery plan management.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderRecoveryTriggers() {
  return `<div class="view"><h1 class="page-title">Recovery Triggers</h1><p class="page-subtitle">BoG 2026 recovery plan triggers.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderRecoveryPlaybooks() {
  return `<div class="view"><h1 class="page-title">Recovery Playbooks</h1><p class="page-subtitle">BoG 2026 recovery plan playbooks.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderRecoveryCapital() {
  return `<div class="view"><h1 class="page-title">Capital Restoration</h1><p class="page-subtitle">BoG 2026 capital restoration planning.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderGRCOverview() {
  return `<div class="view"><h1 class="page-title">GRC & Risk Framework</h1><p class="page-subtitle">Governance, risk and compliance framework.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderGRCUniverse() {
  return `<div class="view"><h1 class="page-title">Risk Universe</h1><p class="page-subtitle">Enterprise risk universe mapping.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderGRCLimits() {
  return `<div class="view"><h1 class="page-title">Limits</h1><p class="page-subtitle">Risk limit framework and monitoring.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderGRCBreaches() {
  return `<div class="view"><h1 class="page-title">Breaches</h1><p class="page-subtitle">Risk limit breach tracking and escalation.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderGRC3LoD() {
  return `<div class="view"><h1 class="page-title">3LoD</h1><p class="page-subtitle">Three Lines of Defence model.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderRegulatoryOverview() {
  return `<div class="view"><h1 class="page-title">Regulatory Reporting (ORASS)</h1><p class="page-subtitle">Bank of Ghana ORASS reporting management.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderRegulatoryBuilder() {
  return `<div class="view"><h1 class="page-title">ORASS Builder</h1><p class="page-subtitle">ORASS report builder and validation.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderRegulatoryTracker() {
  return `<div class="view"><h1 class="page-title">Submission Tracker</h1><p class="page-subtitle">Regulatory submission tracking and status.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderRegulatoryBoG() {
  return `<div class="view"><h1 class="page-title">BoG Returns</h1><p class="page-subtitle">Bank of Ghana regulatory returns management.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderBehaviouralOverview() {
  return `<div class="view"><h1 class="page-title">Behavioural Models</h1><p class="page-subtitle">Behavioural model management and monitoring.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderBehaviouralNMD() {
  return `<div class="view"><h1 class="page-title">NMD Models</h1><p class="page-subtitle">Non-maturity deposit behavioural models.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderBehaviouralCPR() {
  return `<div class="view"><h1 class="page-title">CPR/TDRR</h1><p class="page-subtitle">Conditional prepayment and termination rate models.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderBehaviouralInventory() {
  return `<div class="view"><h1 class="page-title">Model Inventory</h1><p class="page-subtitle">Behavioural model inventory and governance.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderCyberOverview() {
  return `<div class="view"><h1 class="page-title">Cyber Security</h1><p class="page-subtitle">Cyber security risk management and controls.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderCyberResidency() {
  return `<div class="view"><h1 class="page-title">Data Residency</h1><p class="page-subtitle">Data residency and localisation controls.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderCyberAccess() {
  return `<div class="view"><h1 class="page-title">Access Controls</h1><p class="page-subtitle">Access control management and monitoring.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderCyberAudit() {
  return `<div class="view"><h1 class="page-title">Audit Trail</h1><p class="page-subtitle">Security audit trail and logging.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderRTGSOverview() {
  return `<div class="view"><h1 class="page-title">RTGS & Intraday Liquidity</h1><p class="page-subtitle">RTGS operations and intraday liquidity monitoring.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderRTGSFeed() {
  return `<div class="view"><h1 class="page-title">RTGS Feed</h1><p class="page-subtitle">Real-time gross settlement data feeds.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderRTGSIntraday() {
  return `<div class="view"><h1 class="page-title">Intraday Monitor</h1><p class="page-subtitle">Intraday liquidity position monitoring.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}
function renderRTGSSettlement() {
  return `<div class="view"><h1 class="page-title">Settlement Risk</h1><p class="page-subtitle">Settlement risk monitoring and management.</p><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><p>This module is under development.</p></div></div>`;
}

// ---------------------------------------------------------------------------
// Reports & Data Foundation Views
// ---------------------------------------------------------------------------

function renderReportsOverview() {
  return `
    <div class="view">
      <h1 class="page-title">Reports & Analytics</h1>
      <p class="page-subtitle">Regulatory submissions, internal MI packs, and data lineage.</p>

      <div class="grid grid-3 mb-4">
        <div class="card card-accent-red">
          <div class="kpi-label">Overdue</div>
          <div class="kpi-value">1</div>
        </div>
        <div class="card card-accent-amber">
          <div class="kpi-label">Due This Week</div>
          <div class="kpi-value">2</div>
        </div>
        <div class="card card-accent-green">
          <div class="kpi-label">On Track</div>
          <div class="kpi-value">3</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="list-checks"></i> Submission Calendar</div></div>
        <table class="data-table">
          <tr><th>Report</th><th class="text-center">Deadline</th><th>Owner</th><th>Status</th><th>Actions</th></tr>
          ${DUMMY.optimization.submissions.map(s => `
            <tr>
              <td>${s.name}</td>
              <td class="text-center">${s.deadline}</td>
              <td>${s.owner}</td>
              <td><span class="status ${s.status === 'overdue' ? 'status-red' : s.status === 'due' ? 'status-amber' : 'status-green'}">${s.status}</span></td>
              <td><button class="btn btn-ghost btn-sm">View</button></td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;
}

function renderSubmissions() {
  return renderReportsOverview();
}

function renderDataFoundation() {
  return `
    <div class="view">
      <h1 class="page-title">Data Foundation</h1>
      <p class="page-subtitle">Data lineage, quality controls, and source system catalog.</p>

      <div class="grid grid-4 mb-4">
        <div class="card card-accent-green"><div class="kpi-label">Data Sources</div><div class="kpi-value">24</div></div>
        <div class="card card-accent-green"><div class="kpi-label">DQ Score</div><div class="kpi-value">98.2%</div></div>
        <div class="card"><div class="kpi-label">Critical Controls</div><div class="kpi-value">156</div></div>
        <div class="card"><div class="kpi-label">Open Issues</div><div class="kpi-value">3</div></div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title"><i data-lucide="git-branch"></i> Data Lineage Map</div></div>
        <div class="chart-container chart-lg" id="lineageChart"></div>
      </div>
    </div>
  `;
}

function initReportsCharts() {
  renderChart('lineageChart', {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'sankey',
      layout: 'none',
      emphasis: { focus: 'adjacency' },
      data: [
        { name: 'Core Banking' }, { name: 'Loan Systems' }, { name: 'Treasury' }, { name: 'Market Data' },
        { name: 'Data Lake' }, { name: 'Risk Mart' }, { name: 'ALM Engine' },
        { name: 'BoG Reports' }, { name: 'ALCO Pack' }, { name: 'ECL Engine' }
      ],
      links: [
        { source: 'Core Banking', target: 'Data Lake', value: 40 },
        { source: 'Loan Systems', target: 'Data Lake', value: 30 },
        { source: 'Treasury', target: 'Data Lake', value: 20 },
        { source: 'Market Data', target: 'Data Lake', value: 10 },
        { source: 'Data Lake', target: 'Risk Mart', value: 60 },
        { source: 'Risk Mart', target: 'ALM Engine', value: 35 },
        { source: 'Risk Mart', target: 'ECL Engine', value: 25 },
        { source: 'ALM Engine', target: 'BoG Reports', value: 20 },
        { source: 'ALM Engine', target: 'ALCO Pack', value: 15 }
      ],
      lineStyle: { color: 'gradient', curveness: 0.5 }
    }]
  });
}


// ---------------------------------------------------------------------------
// Route Map
// ---------------------------------------------------------------------------

const ROUTES = {
  'dashboard': { render: renderDashboard, initCharts: initDashboardCharts, title: 'Dashboard', navId: 'dashboard' },
  'liquidity': { render: renderLiquidityOverview, initCharts: initLiquidityCharts, title: 'Liquidity Risk', navId: 'liquidity-overview' },
  'liquidity-lcr': { render: renderLCR, initCharts: null, title: 'LCR Analysis', navId: 'liquidity-lcr' },
  'liquidity-nsfr': { render: renderNSFR, initCharts: null, title: 'NSFR Monitor', navId: 'liquidity-nsfr' },
  'liquidity-gap': { render: renderLiquidityGap, initCharts: initLiquidityCharts, title: 'Liquidity Gap', navId: 'liquidity-gap' },
  'liquidity-stress': { render: renderLiquidityStress, initCharts: null, title: 'Stress Testing', navId: 'liquidity-stress' },
  'liquidity-cfp': { render: renderCFP, initCharts: null, title: 'CFP Triggers', navId: 'liquidity-cfp' },
  'irrbb': { render: renderIRRBBOverview, initCharts: initIRRBBCharts, title: 'IRRBB Overview', navId: 'irrbb-overview' },
  'irrbb-eve': { render: renderEVE, initCharts: initIRRBBCharts, title: 'EVE Sensitivity', navId: 'irrbb-eve' },
  'irrbb-nii': { render: renderNII, initCharts: initIRRBBCharts, title: 'NII Forecast', navId: 'irrbb-nii' },
  'irrbb-gap': { render: renderIRRBBGap, initCharts: initIRRBBCharts, title: 'Repricing Gap', navId: 'irrbb-gap' },
  'irrbb-dgap': { render: renderDurationGap, initCharts: initIRRBBCharts, title: 'Duration Gap', navId: 'irrbb-dgap' },
  'irrbb-derivatives': { render: renderDerivatives, initCharts: null, title: 'Derivatives', navId: 'irrbb-derivatives' },
  'capital': { render: renderCapitalOverview, initCharts: initCapitalCharts, title: 'Capital Adequacy', navId: 'capital-overview' },
  'capital-ratios': { render: renderCapitalRatios, initCharts: initCapitalCharts, title: 'Capital Ratios', navId: 'capital-ratios' },
  'capital-rwa': { render: renderRWA, initCharts: initCapitalCharts, title: 'RWA Composition', navId: 'capital-rwa' },
  'capital-icaap': { render: renderICAAP, initCharts: initCapitalCharts, title: 'ICAAP Planning', navId: 'capital-icaap' },
  'capital-mrel': { render: renderMREL, initCharts: initCapitalCharts, title: 'MREL / TLAC', navId: 'capital-mrel' },
  'ecl': { render: renderECLOverview, initCharts: initECLCharts, title: 'ECL / Credit Risk', navId: 'ecl-overview' },
  'ecl-staging': { render: renderECLStaging, initCharts: initECLCharts, title: 'Staging Distribution', navId: 'ecl-staging' },
  'ecl-sicr': { render: renderSICR, initCharts: initECLCharts, title: 'SICR Monitor', navId: 'ecl-sicr' },
  'ecl-scenarios': { render: renderECLScenarios, initCharts: initECLCharts, title: 'Macro Scenarios', navId: 'ecl-scenarios' },
  'ecl-overlays': { render: renderECLOverlays, initCharts: null, title: 'Overlay Governance', navId: 'ecl-overlays' },
  'ftp': { render: renderFTPOverview, initCharts: initFTPCharts, title: 'FTP & Pricing', navId: 'ftp-overview' },
  'ftp-curve': { render: renderFTPCurve, initCharts: initFTPCharts, title: 'FTP Curve', navId: 'ftp-curve' },
  'ftp-nmd': { render: renderNMD, initCharts: initFTPCharts, title: 'NMD Portfolio', navId: 'ftp-nmd' },
  'ftp-pricing': { render: renderFTPPricing, initCharts: initFTPCharts, title: 'Deal Pricing', navId: 'ftp-pricing' },
  'ftp-profitability': { render: renderFTPProfitability, initCharts: initFTPCharts, title: 'Profitability', navId: 'ftp-profitability' },
  'optimization': { render: renderOptimizationOverview, initCharts: initOptimizationCharts, title: 'Optimization', navId: 'optimization-overview' },
  'optimization-nim': { render: renderNIM, initCharts: initOptimizationCharts, title: 'NIM Attribution', navId: 'optimization-nim' },
  'optimization-scenarios': { render: renderWhatIf, initCharts: null, title: 'What-If Builder', navId: 'optimization-scenarios' },
  'optimization-alcopack': { render: renderALCOPack, initCharts: null, title: 'ALCO Pack', navId: 'optimization-alcopack' },
  'reports': { render: renderReportsOverview, initCharts: null, title: 'Reports & Analytics', navId: 'reports-overview' },
  'reports-submissions': { render: renderSubmissions, initCharts: null, title: 'Submissions', navId: 'reports-submissions' },
  'data-foundation': { render: renderDataFoundation, initCharts: initReportsCharts, title: 'Data Foundation', navId: 'data-foundation' },
  'recovery': { render: renderRecoveryOverview, initCharts: null, title: 'Recovery Planning', navId: 'recovery-overview' },
  'recovery-triggers': { render: renderRecoveryTriggers, initCharts: null, title: 'Recovery Triggers', navId: 'recovery-triggers' },
  'recovery-playbooks': { render: renderRecoveryPlaybooks, initCharts: null, title: 'Recovery Playbooks', navId: 'recovery-playbooks' },
  'recovery-capital': { render: renderRecoveryCapital, initCharts: null, title: 'Capital Restoration', navId: 'recovery-capital' },
  'grc': { render: renderGRCOverview, initCharts: null, title: 'GRC & Risk Framework', navId: 'grc-overview' },
  'grc-universe': { render: renderGRCUniverse, initCharts: null, title: 'Risk Universe', navId: 'grc-universe' },
  'grc-limits': { render: renderGRCLimits, initCharts: null, title: 'Limits', navId: 'grc-limits' },
  'grc-breaches': { render: renderGRCBreaches, initCharts: null, title: 'Breaches', navId: 'grc-breaches' },
  'grc-3lod': { render: renderGRC3LoD, initCharts: null, title: '3LoD', navId: 'grc-3lod' },
  'regulatory': { render: renderRegulatoryOverview, initCharts: null, title: 'Regulatory Reporting (ORASS)', navId: 'regulatory-overview' },
  'regulatory-builder': { render: renderRegulatoryBuilder, initCharts: null, title: 'ORASS Builder', navId: 'regulatory-builder' },
  'regulatory-tracker': { render: renderRegulatoryTracker, initCharts: null, title: 'Submission Tracker', navId: 'regulatory-tracker' },
  'regulatory-bog': { render: renderRegulatoryBoG, initCharts: null, title: 'BoG Returns', navId: 'regulatory-bog' },
  'behavioural': { render: renderBehaviouralOverview, initCharts: null, title: 'Behavioural Models', navId: 'behavioural-overview' },
  'behavioural-nmd': { render: renderBehaviouralNMD, initCharts: null, title: 'NMD Models', navId: 'behavioural-nmd' },
  'behavioural-cpr': { render: renderBehaviouralCPR, initCharts: null, title: 'CPR/TDRR', navId: 'behavioural-cpr' },
  'behavioural-inventory': { render: renderBehaviouralInventory, initCharts: null, title: 'Model Inventory', navId: 'behavioural-inventory' },
  'cyber': { render: renderCyberOverview, initCharts: null, title: 'Cyber Security', navId: 'cyber-overview' },
  'cyber-residency': { render: renderCyberResidency, initCharts: null, title: 'Data Residency', navId: 'cyber-residency' },
  'cyber-access': { render: renderCyberAccess, initCharts: null, title: 'Access Controls', navId: 'cyber-access' },
  'cyber-audit': { render: renderCyberAudit, initCharts: null, title: 'Audit Trail', navId: 'cyber-audit' },
  'rtgs': { render: renderRTGSOverview, initCharts: null, title: 'RTGS & Intraday Liquidity', navId: 'rtgs-overview' },
  'rtgs-feed': { render: renderRTGSFeed, initCharts: null, title: 'RTGS Feed', navId: 'rtgs-feed' },
  'rtgs-intraday': { render: renderRTGSIntraday, initCharts: null, title: 'Intraday Monitor', navId: 'rtgs-intraday' },
  'rtgs-settlement': { render: renderRTGSSettlement, initCharts: null, title: 'Settlement Risk', navId: 'rtgs-settlement' }
};

// ---------------------------------------------------------------------------
// Navigation Rendering
// ---------------------------------------------------------------------------

function renderSidebar() {
  const container = document.getElementById('navTree');
  if (!container) return;

  container.innerHTML = NAV_STRUCTURE.map(item => {
    if (!item.children) {
      return `
        <a href="#${item.route}" class="nav-item ${item.route === 'dashboard' ? 'active' : ''}" data-route="${item.route}" data-nav-id="${item.id}" data-title="${item.label}">
          <i data-lucide="${item.icon}"></i>
          <span class="nav-label">${item.label}</span>
        </a>
      `;
    }

    const childrenHtml = item.children.map(child => `
      <a href="#${child.route}" class="nav-child" data-route="${child.route}" data-nav-id="${child.id}">
        ${child.label}
      </a>
    `).join('');

    return `
      <div class="nav-section">
        <button class="nav-item nav-parent" data-group="${item.id}" data-title="${item.label}">
          <div class="nav-left" style="color:${item.color || 'inherit'}">
            <i data-lucide="${item.icon}"></i>
            <span class="nav-label">${item.label}</span>
          </div>
          <i data-lucide="chevron-down" class="nav-chevron"></i>
        </button>
        <div class="nav-children">
          ${childrenHtml}
        </div>
      </div>
    `;
  }).join('');
}

function setupNavInteractions() {
  document.querySelectorAll('.nav-parent').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const section = btn.closest('.nav-section');
      section.classList.toggle('open');
    });
  });

  document.querySelectorAll('.nav-child').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-child').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.nav-item[data-route]').forEach(i => i.classList.remove('active'));
      if (window.innerWidth <= 768) closeMobileSidebar();
    });
  });

  document.querySelectorAll('.nav-item[data-route]').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-item[data-route]').forEach(i => i.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.nav-child').forEach(l => l.classList.remove('active'));
      if (window.innerWidth <= 768) closeMobileSidebar();
    });
  });
}

function updateActiveNav(navId) {
  document.querySelectorAll('.nav-item[data-route], .nav-child').forEach(el => el.classList.remove('active'));
  const active = document.querySelector(`[data-nav-id="${navId}"]`);
  if (active) {
    active.classList.add('active');
    const section = active.closest('.nav-section');
    if (section) section.classList.add('open');
  }
}

// ---------------------------------------------------------------------------
// Theme & UI Helpers
// ---------------------------------------------------------------------------

function initTheme() {
  const saved = localStorage.getItem('alm-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (systemDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('alm-theme', next);
  updateThemeIcon(next);
  handleHashChange();
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.innerHTML = `<i data-lucide="${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
    lucide.createIcons();
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
  localStorage.setItem('alm-sidebar-collapsed', sidebar.classList.contains('collapsed'));
  setTimeout(() => refreshCharts(), 250);
}

function openMobileSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.querySelector('.mobile-overlay').classList.add('open');
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.querySelector('.mobile-overlay').classList.remove('open');
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

let currentRoute = null;

function navigateTo(route) {
  const target = route || 'dashboard';
  const routeConfig = ROUTES[target] || ROUTES['dashboard'];
  const container = document.getElementById('mainContent');

  if (!container) return;

  disposeCharts();
  container.innerHTML = routeConfig.render();
  currentRoute = target;

  document.querySelectorAll('.context-item').forEach(el => el.classList.remove('active'));

  const breadcrumb = document.getElementById('breadcrumb');
  if (breadcrumb) breadcrumb.innerHTML = `<a href="#dashboard">Dashboard</a><span class="sep">/</span><span>${routeConfig.title}</span>`;

  requestAnimationFrame(() => {
    lucide.createIcons();
    if (routeConfig.initCharts) {
      routeConfig.initCharts();
    }
    updateActiveNav(routeConfig.navId);
    document.title = `${routeConfig.title} — ALM Operational Platform`;
    refreshCharts();
  });
}

function handleHashChange() {
  const hash = window.location.hash.replace(/^#/, '').trim() || 'dashboard';
  navigateTo(hash);
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

function init() {
  renderSidebar();
  lucide.createIcons();
  setupNavInteractions();
  initTheme();

  const sidebar = document.getElementById('sidebar');
  if (localStorage.getItem('alm-sidebar-collapsed') === 'true') sidebar.classList.add('collapsed');

  document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
  document.getElementById('mobileMenuToggle').addEventListener('click', openMobileSidebar);
  document.querySelector('.mobile-overlay').addEventListener('click', closeMobileSidebar);
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('resize', () => {
    chartInstances.forEach(c => c.resize());
  });

  const contextItems = document.querySelectorAll('.context-item');
  contextItems.forEach(item => {
    item.addEventListener('click', () => {
      contextItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  handleHashChange();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
