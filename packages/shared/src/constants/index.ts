export const MODULES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', route: 'dashboard', color: '#3B82F6', roles: ['alco_member', 'treasurer', 'risk_manager', 'compliance_officer', 'cro', 'ceo', 'cfo', 'board_member'] },
  {
    id: 'liquidity', label: 'Liquidity Risk', icon: 'droplets', color: '#06B6D4', route: 'liquidity',
    children: [
      { id: 'liquidity-lcr', label: 'LCR Calculator', route: 'liquidity/lcr', roles: ['treasurer', 'liquidity_risk_manager', 'risk_manager', 'compliance_officer', 'cro'] },
      { id: 'liquidity-bog', label: 'BoG Ratios', route: 'liquidity/bog', roles: ['treasurer', 'liquidity_risk_manager', 'compliance_officer', 'cro'] },
      { id: 'liquidity-gap', label: 'Maturity Gap', route: 'liquidity/gap', roles: ['treasurer', 'liquidity_risk_manager', 'risk_manager'] },
      { id: 'liquidity-stress', label: 'Stress Testing', route: 'liquidity/stress', roles: ['treasurer', 'liquidity_risk_manager', 'risk_manager', 'cro'] },
      { id: 'liquidity-cfp', label: 'Contingency Plan', route: 'liquidity/cfp', roles: ['treasurer', 'liquidity_risk_manager', 'cro', 'ceo'] },
    ],
    roles: ['treasurer', 'liquidity_risk_manager', 'risk_manager', 'compliance_officer', 'cro', 'ceo', 'cfo'],
  },
  {
    id: 'interest-rate', label: 'Interest Rate Risk', icon: 'trending-up', color: '#8B5CF6', route: 'interest-rate',
    children: [
      { id: 'irrbb-eve', label: 'EVE Sensitivity', route: 'interest-rate/eve', roles: ['treasurer', 'irrbb_risk_manager', 'risk_manager', 'cro'] },
      { id: 'irrbb-nii', label: 'NII Forecast', route: 'interest-rate/nii', roles: ['treasurer', 'irrbb_risk_manager', 'risk_manager'] },
      { id: 'irrbb-buckets', label: '19-Bucket View', route: 'interest-rate/buckets', roles: ['treasurer', 'irrbb_risk_manager', 'compliance_officer'] },
      { id: 'irrbb-sot', label: 'SOT Status', route: 'interest-rate/sot', roles: ['treasurer', 'irrbb_risk_manager', 'compliance_officer', 'cro'] },
      { id: 'irrbb-hedging', label: 'Hedge Tracker', route: 'interest-rate/hedging', roles: ['treasurer', 'irrbb_risk_manager'] },
    ],
    roles: ['treasurer', 'irrbb_risk_manager', 'risk_manager', 'compliance_officer', 'cro', 'ceo', 'cfo'],
  },
  {
    id: 'capital', label: 'Capital Management', icon: 'shield', color: '#10B981', route: 'capital',
    children: [
      { id: 'capital-ratios', label: 'Capital Ratios', route: 'capital/ratios', roles: ['capital_manager', 'risk_manager', 'compliance_officer', 'cro', 'cfo'] },
      { id: 'capital-rwa', label: 'RWA Engine', route: 'capital/rwa', roles: ['capital_manager', 'risk_manager', 'compliance_officer'] },
      { id: 'capital-icaap', label: 'ICAAP', route: 'capital/icaap', roles: ['capital_manager', 'risk_manager', 'cro', 'board_member'] },
      { id: 'capital-planning', label: 'Capital Planning', route: 'capital/planning', roles: ['capital_manager', 'cfo', 'cro', 'board_member'] },
    ],
    roles: ['capital_manager', 'risk_manager', 'compliance_officer', 'cro', 'cfo', 'ceo', 'board_member'],
  },
  {
    id: 'ecl', label: 'Expected Credit Loss', icon: 'alert-circle', color: '#F59E0B', route: 'ecl',
    children: [
      { id: 'ecl-calculator', label: 'ECL Calculator', route: 'ecl/calculator', roles: ['credit_risk_manager', 'risk_manager', 'finance_accounting'] },
      { id: 'ecl-staging', label: 'Stage Monitoring', route: 'ecl/staging', roles: ['credit_risk_manager', 'risk_manager', 'finance_accounting'] },
      { id: 'ecl-macro', label: 'Macro Scenarios', route: 'ecl/macro', roles: ['credit_risk_manager', 'risk_manager', 'model_validator'] },
      { id: 'ecl-overlay', label: 'Overlay Governance', route: 'ecl/overlay', roles: ['credit_risk_manager', 'risk_manager', 'cro'] },
    ],
    roles: ['credit_risk_manager', 'risk_manager', 'finance_accounting', 'compliance_officer', 'cro', 'cfo'],
  },
  {
    id: 'ftp', label: 'Funds Transfer Pricing', icon: 'arrow-left-right', color: '#EC4899', route: 'ftp',
    children: [
      { id: 'ftp-curve', label: 'Curve Manager', route: 'ftp/curve', roles: ['treasurer', 'business_unit_head'] },
      { id: 'ftp-pricing', label: 'Deal Pricer', route: 'ftp/pricing', roles: ['treasurer', 'business_unit_head'] },
      { id: 'ftp-nmd', label: 'NMD Modeling', route: 'ftp/nmd', roles: ['treasurer', 'risk_manager', 'model_validator'] },
      { id: 'ftp-profitability', label: 'Profitability', route: 'ftp/profitability', roles: ['treasurer', 'business_unit_head', 'cfo'] },
    ],
    roles: ['treasurer', 'business_unit_head', 'risk_manager', 'cfo', 'cro'],
  },
  {
    id: 'balance-sheet', label: 'Balance Sheet Optimization', icon: 'bar-chart-3', color: '#6366F1', route: 'balance-sheet',
    children: [
      { id: 'bs-simulator', label: 'Simulator', route: 'balance-sheet/simulator', roles: ['strategic_planning_manager', 'treasurer', 'cfo', 'cro'] },
      { id: 'bs-nim', label: 'NIM Attribution', route: 'balance-sheet/nim', roles: ['strategic_planning_manager', 'treasurer', 'cfo'] },
      { id: 'bs-hedging', label: 'Hedge Simulator', route: 'balance-sheet/hedging', roles: ['treasurer', 'irrbb_risk_manager'] },
      { id: 'bs-alco-pack', label: 'ALCO Pack', route: 'balance-sheet/alco-pack', roles: ['alco_member', 'alco_secretary', 'board_secretary'] },
    ],
    roles: ['strategic_planning_manager', 'treasurer', 'cfo', 'cro', 'alco_member', 'board_member'],
  },
  {
    id: 'recovery', label: 'Recovery Planning', icon: 'life-buoy', color: '#F97316', route: 'recovery',
    children: [
      { id: 'recovery-repository', label: 'Plan Repository', route: 'recovery/repository', roles: ['recovery_planning_officer', 'cro', 'compliance_officer'] },
      { id: 'recovery-options', label: 'Options Menu', route: 'recovery/options', roles: ['recovery_planning_officer', 'cro', 'ceo'] },
      { id: 'recovery-triggers', label: 'Trigger Dashboard', route: 'recovery/triggers', roles: ['recovery_planning_officer', 'cro', 'risk_manager'] },
      { id: 'recovery-mis', label: 'Recovery MIS', route: 'recovery/mis', roles: ['recovery_planning_officer', 'cro', 'board_member'] },
    ],
    roles: ['recovery_planning_officer', 'cro', 'ceo', 'compliance_officer', 'board_member'],
  },
  {
    id: 'grc', label: 'GRC & Risk Framework', icon: 'shield-check', color: '#EF4444', route: 'grc',
    children: [
      { id: 'grc-rmf', label: 'Risk Framework', route: 'grc/rmf', roles: ['cro', 'compliance_officer', 'internal_auditor'] },
      { id: 'grc-universe', label: 'Risk Universe', route: 'grc/universe', roles: ['cro', 'risk_manager', 'compliance_officer'] },
      { id: 'grc-limits', label: 'Limit Framework', route: 'grc/limits', roles: ['cro', 'risk_manager', 'compliance_officer'] },
      { id: 'grc-breaches', label: 'Breach Tracker', route: 'grc/breaches', roles: ['cro', 'compliance_officer', 'internal_auditor'] },
    ],
    roles: ['cro', 'risk_manager', 'compliance_officer', 'internal_auditor', 'ceo', 'board_member'],
  },
  {
    id: 'regulatory', label: 'Regulatory Reporting (ORASS)', icon: 'file-check', color: '#14B8A6', route: 'regulatory',
    children: [
      { id: 'regulatory-templates', label: 'Templates', route: 'regulatory/templates', roles: ['regulatory_reporting_manager', 'compliance_officer'] },
      { id: 'regulatory-submissions', label: 'Submissions', route: 'regulatory/submissions', roles: ['regulatory_reporting_manager', 'compliance_officer', 'cro'] },
      { id: 'regulatory-disclosures', label: 'Disclosures', route: 'regulatory/disclosures', roles: ['regulatory_reporting_manager', 'compliance_officer'] },
    ],
    roles: ['regulatory_reporting_manager', 'compliance_officer', 'cro', 'board_member'],
  },
  {
    id: 'behavioural', label: 'Behavioural Models', icon: 'brain', color: '#A855F7', route: 'behavioural',
    children: [
      { id: 'behavioural-nmd', label: 'NMD Core Model', route: 'behavioural/nmd', roles: ['model_validator', 'risk_manager', 'treasurer'] },
      { id: 'behavioural-cpr', label: 'CPR Model', route: 'behavioural/cpr', roles: ['model_validator', 'risk_manager'] },
      { id: 'behavioural-tdrr', label: 'TDRR Model', route: 'behavioural/tdrr', roles: ['model_validator', 'risk_manager'] },
      { id: 'behavioural-backtest', label: 'Backtesting', route: 'behavioural/backtest', roles: ['model_validator', 'risk_manager', 'cro'] },
    ],
    roles: ['model_validator', 'risk_manager', 'treasurer', 'cro'],
  },
  {
    id: 'cyber', label: 'Cyber Security', icon: 'lock', color: '#64748B', route: 'cyber',
    children: [
      { id: 'cyber-residency', label: 'Data Residency', route: 'cyber/residency', roles: ['ciso', 'platform_administrator', 'compliance_officer'] },
      { id: 'cyber-controls', label: 'Control Framework', route: 'cyber/controls', roles: ['ciso', 'it_security_officer', 'internal_auditor'] },
      { id: 'cyber-pentest', label: 'Pen-Test Tracker', route: 'cyber/pentest', roles: ['ciso', 'it_security_officer', 'compliance_officer'] },
      { id: 'cyber-reporting', label: 'Board Reporting', route: 'cyber/reporting', roles: ['ciso', 'board_member', 'cro'] },
    ],
    roles: ['ciso', 'platform_administrator', 'it_security_officer', 'compliance_officer', 'board_member', 'cro'],
  },
  {
    id: 'rtgs', label: 'RTGS & Intraday Liquidity', icon: 'zap', color: '#EAB308', route: 'rtgs',
    children: [
      { id: 'rtgs-feed', label: 'Feed Monitor', route: 'rtgs/feed', roles: ['treasurer', 'liquidity_risk_manager', 'data_engineer'] },
      { id: 'rtgs-intraday', label: 'Intraday Position', route: 'rtgs/intraday', roles: ['treasurer', 'liquidity_risk_manager'] },
      { id: 'rtgs-throughput', label: 'Throughput Ratios', route: 'rtgs/throughput', roles: ['treasurer', 'liquidity_risk_manager', 'compliance_officer'] },
    ],
    roles: ['treasurer', 'liquidity_risk_manager', 'data_engineer', 'compliance_officer', 'cro'],
  },
  {
    id: 'data-foundation', label: 'Data Foundation', icon: 'database', color: '#0EA5E9', route: 'data-foundation',
    children: [
      { id: 'data-ingestion', label: 'Ingestion', route: 'data-foundation/ingestion', roles: ['data_engineer', 'treasurer'] },
      { id: 'data-quality', label: 'Quality', route: 'data-foundation/quality', roles: ['data_engineer', 'risk_manager', 'compliance_officer'] },
      { id: 'data-master', label: 'Master Data', route: 'data-foundation/master', roles: ['data_engineer', 'compliance_officer'] },
      { id: 'data-alco', label: 'ALCO Governance', route: 'data-foundation/alco', roles: ['alco_secretary', 'alco_member', 'board_secretary'] },
    ],
    roles: ['data_engineer', 'treasurer', 'risk_manager', 'compliance_officer', 'alco_secretary', 'alco_member'],
  },
] as const;

export const BOG_DIRECTIVES = [
  { id: 'lmtd', name: 'Liquidity Monitoring Tools Directive', year: 2026, modules: ['liquidity', 'rtgs'] },
  { id: 'lrmd', name: 'Liquidity Risk Management Directive', year: 2026, modules: ['liquidity', 'rtgs', 'grc'] },
  { id: 'irrbb', name: 'IRRBB Guideline', year: 2026, modules: ['interest-rate', 'behavioural'] },
  { id: 'recovery', name: 'Recovery Planning Directive', year: 2026, modules: ['recovery', 'balance-sheet'] },
  { id: 'rmd', name: 'Risk Management Directive', year: 2021, modules: ['grc', 'cyber'] },
  { id: 'cisd', name: 'Cyber & Information Security Directive', year: 2026, modules: ['cyber'] },
  { id: 'capital', name: 'Capital Adequacy Framework', year: 2026, modules: ['capital'] },
] as const;

export const CURRENCIES = {
  GHS: { code: 'GHS', symbol: '₵', name: 'Ghana Cedi', decimals: 2 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2 },
} as const;

export const SIGNIFICANT_CURRENCIES = ['GHS', 'USD', 'EUR'] as const;

export const BOG_RATIOS = [
  { id: 'narrow_volatile', name: 'Narrow Liquid Assets / Volatile Liabilities', minBank: 0.20, minSdi: 0.15 },
  { id: 'narrow_short_term', name: 'Narrow Liquid Assets / Short-term Liabilities', minBank: 0.10, minSdi: 0.08 },
  { id: 'narrow_total_assets', name: 'Narrow Liquid Assets / Total Assets', minBank: 0.05, minSdi: 0.04 },
  { id: 'narrow_total_deposits', name: 'Narrow Liquid Assets / Total Deposits', minBank: 0.08, minSdi: 0.06 },
  { id: 'broad_volatile', name: 'Broad Liquid Assets / Volatile Liabilities', minBank: 0.30, minSdi: 0.25 },
  { id: 'broad_short_term', name: 'Broad Liquid Assets / Short-term Liabilities', minBank: 0.15, minSdi: 0.12 },
  { id: 'broad_total_assets', name: 'Broad Liquid Assets / Total Assets', minBank: 0.10, minSdi: 0.08 },
  { id: 'broad_total_deposits', name: 'Broad Liquid Assets / Total Deposits', minBank: 0.12, minSdi: 0.10 },
] as const;

export const LMTD_BUCKETS = [
  'overnight', '2_to_7_days', '8_to_30_days', '31_to_90_days',
  '91_to_180_days', '181_to_365_days', '1_to_2_years', '2_to_5_years',
  'over_5_years', 'non_contractual', 'fixed_assets', 'undrawn_commitments', 'derivatives'
] as const;

export const IRRBB_BUCKETS = [
  'overnight', '1_month', '3_months', '6_months', '9_months', '1_year',
  '1_5_years', '2_years', '3_years', '4_years', '5_years', '6_years',
  '7_years', '8_years', '9_years', '10_years', '15_years', '20_years', 'over_20_years'
] as const;

export const IRRBB_SHOCK_SCENARIOS = [
  { id: 'parallel_up', name: 'Parallel Up', description: 'Parallel shift up across all maturities' },
  { id: 'parallel_down', name: 'Parallel Down', description: 'Parallel shift down across all maturities' },
  { id: 'steepener', name: 'Steepener', description: 'Short rates down, long rates up' },
  { id: 'flattener', name: 'Flattener', description: 'Short rates up, long rates down' },
  { id: 'short_rate_up', name: 'Short Rate Up', description: 'Short end rates increase' },
  { id: 'short_rate_down', name: 'Short Rate Down', description: 'Short end rates decrease' },
] as const;

export const SOT_THRESHOLD = 0.15; // 15% of Tier 1 Capital

export const CAPITAL_MINIMUMS = {
  cet1: 0.045,
  tier1: 0.060,
  totalCapital: 0.080,
  leverage: 0.030,
} as const;

export const CAPITAL_BUFFERS = {
  conservation: 0.025,
  countercyclicalMax: 0.025,
  dSibMin: 0.005,
  dSibMax: 0.020,
} as const;

export const NMD_CORE_CAPS = {
  retail: 0.70,
  sme: 0.50,
  corporate: 0.30,
} as const;

export const NMD_AVG_MATURITY_CAPS = {
  retail: 4,
  sme: 2,
  corporate: 1,
} as const;

export const FTP_TENORS = [
  'ON', '1W', '1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', '7Y', '10Y', '15Y', '20Y'
] as const;

export const GHANA_MACRO_VARIABLES = [
  'gdp_growth', 'inflation', 'bog_policy_rate', 'ghs_usd', 'gog_tbill_yield',
  'cocoa_price', 'gold_price', 'oil_price', 'unemployment', 'fiscal_deficit'
] as const;

export const RTGS_BUSINESS_HOURS = { start: '08:00', end: '17:00', timezone: 'GMT' } as const;

export const BREACH_NOTIFICATION_DAYS = 10;

export const ORASS_DEADLINES = {
  monthly: 9,
  quarterly: 15,
  annual: 31,
} as const;

export const RECOVERY_PLAN_DUE_DATE = '12-31'; // December 31
