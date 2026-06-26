# bankOS — Enhanced Training Plan (HTML Representation of ALM Platform PRDs)

## Goal

Transform bankOS into a comprehensive HTML training platform covering **all 13 PRDs** from `docs/prd/`. Each module becomes a navigable page with:

- Descriptive text explaining the module's purpose, users, and key concepts
- Realistic dummy data tables (8–15 rows) matching PRD table layouts
- Live Chart.js graphs and Mermaid workflow diagrams
- **Formula display** (KaTeX) for calculation logic
- **Contextual callouts** explaining regulatory references, Ghana-specific rules, and BoG thresholds
- Cross-module relation chips linking related concepts

---

## Current State Analysis

| Asset | Coverage |
|-------|----------|
| **Pages** | 7 modules: Landing, Liquidity, Capital, IRRBB, ECL, FTP, Optimization |
| **Data files** | 7: liquidity.js, capital.js, irrbb.js, ecl.js, ftp.js, optimization.js, relations.js |
| **Charts** | 11 chart-type wrappers with switch-case per tab |
| **Workflows** | Mermaid diagram renderer |
| **Tab system** | Query-param tab state, SPA routing, history pushState |
| **Styles** | Tab nav, table, chip, chart-grid, loading-spinner, mermaid CSS |

---

## Gaps vs PRDs

| PRD | Module | Current State | Needs |
|-----|--------|---------------|-------|
| 00 | Platform Overview / ALCO Cockpit | Landing page with 4 tabs | Expand to full ALCO Cockpit: 4-row KPI cards, EVE sensitivity table, ALCO actions, ECL summary, capital stack, regulatory tracker |
| 01 | Data Foundation & ALCO Governance | **Missing entirely** | New page: Data Ingestion, MDM, Data Quality Scorecard, ALCO Workflow, Audit Trail, Control Tower |
| 02 | Liquidity Risk | 6 tabs (LCR, NSFR, stress, EWI, gap, intraday) | Add formulas (KaTeX), BoG LMTD ratio display, significant-currency LCR, funding concentration table |
| 03 | Interest Rate Risk | 6 tabs (EVE, NII, gap, yield curves, SOT, what-if) | Add standardisation categorisation table, basis risk matrix, 19-bucket reference table |
| 04 | Capital Management | 6 tabs (stack, RWA, ratios, output floor, ICAAP, D-SIB) | Add buffer headroom table, Pillar 2 add-on breakdown, capital instrument register, Ghana stress scenarios |
| 05 | ECL | 6 tabs (stage, SICR, macro, PD/LGD, PMA, collective) | Add Ghana-specific macro variable table, scenario consistency validation, sectoral PD adjustments |
| 06 | FTP | 6 tabs (GRR, NMD, deal, LTP, loan calc, term structure) | Add GRR methodology breakdown, GoG T-Bill curve table, cross-currency basis, regulatory cost components |
| 07 | Balance Sheet Optimization | 6 tabs (NIM, what-if, hedging, deposit pricing, origination, ALCO) | Add recovery trigger integration, NIM attribution waterfall, submission tracker, consolidated reporting |
| 08 | Recovery Planning | **Missing entirely** | New page: Plan Repository, Options Menu, Indicator Dashboard, Self-Assessment |
| 09 | GRC Risk Framework | **Missing entirely** | New page: RMF Library, Risk Universe, RAS Dashboard, Limit Breach Tracker, 3LoD diagram |
| 10 | Regulatory Reporting & ORASS | **Missing entirely** | New page: Template Catalogue, Submission Scheduler, ORASS Status, Public Disclosure |
| 11 | Behavioural Model Library | **Missing entirely** | New page: NMD Models, Prepayment Models, TDRR Models, Validation Tracker |
| 12 | Cyber Security & Data Residency | **Missing entirely** | New page: CISD 2026 compliance, data residency map, pen-testing tracker, board cyber report |
| 13 | RTGS Intraday Liquidity | **Partial** — tab in Liquidity page | Expand with PRD 13 content: RTGS system capability, settlement agent monitoring, throughput dashboard |

---

## Enhancement Phases

### Phase 1 — Formula Engine & UI Components (`components/ui.js`) (1h)

Create reusable UI components for:
- `formulaBlock(latex, label)` — rendered formula with label (KaTeX)
- `calloutBox(text, type)` — info/warning/regulatory callouts
- `kpiCard(config)` — large metric card with sparkline, threshold line
- `statusBadge(status)` — green/amber/red status indicator
- `mermaidDiagram(definition, containerId)` — workflow renderer wrapper

**Files to create/modify:**
- `components/ui.js` — UI helpers
- `index.html` — add KaTeX CDN
- `styles.css` — add `.formula-block`, `.callout-box`, `.kpi-card` styles

---

### Phase 2 — Data Foundation Page (PRD 01) (4h)

Create `pages/dataFoundation.js` with 6 tabs:

| Tab | Tables | Charts | Workflow | Relations |
|-----|--------|--------|----------|-----------|
| **Data Ingestion** | Source list (name, type, last run, status, rows), frequency table | Throughput bar per source, success/failure pie | ETL pipeline diagram | → All modules |
| **MDM** | Product catalog (ID, name, type, BoG LMTD, IRRBB class), counterparty list | Bar chart (product count by category) | Classification hierarchy | → Liquidity, Capital, IRRBB |
| **Data Quality** | Scorecard table (dimension, score, trend, issues), source breakdown | Gauge (overall score), radar (5 dimensions) | Quality rule flow | → All modules |
| **ALCO Workflow** | Meeting schedule, agenda items, action items table | Timeline (meeting history), bar (action status) | Meeting lifecycle | → Optimization (ALCO Pack) |
| **Audit Trail** | Log table (timestamp, user, action, table, detail), lineage view | Activity heatmap (actions × hour) | — | → GRC (compliance) |
| **Control Tower** | Reconciliation table (ALM code, TB value, XTEL value, variance, status) | Matched/unmatched pie, variance waterfall | Run lifecycle | → All modules |

**PRD 01 Formulas:**
```
Overall Score = Σ(Dimension Score × Weight)
Completeness = (Non-null required fields / Total required fields) × 100
Timeliness = (Sources on-time / Total sources) × 100
Recon Variance = \|TB value − XTEL value\| / max(TB value, XTEL value) × 100
```

---

### Phase 3 — Recovery Planning Page (PRD 08) (3h)

Create `pages/recovery.js` with 5 tabs:

| Tab | Tables | Charts | Workflow | Relations |
|-----|--------|--------|----------|-----------|
| **Plan Repository** | Plan versions (version, date, status, BoG submission) | Timeline (plan history) | Plan lifecycle | → Capital, Liquidity |
| **Options Menu** | Recovery options (name, impact, timeline, feasibility) | Bar chart (impact by option) | Option selection flow | → All modules |
| **Indicator Dashboard** | Quantitative indicators (threshold, current, breach status) | Gauge dashboard, trend line | Trigger → Escalation | → All modules |
| **Trigger Monitor** | Trigger table (threshold, actual, status, days since breach) | Heatmap (trigger × time) | Breach notification | → GRC |
| **Self-Assessment** | Annual test results (option, outcome, next test) | Radar (readiness by dimension) | Testing cycle | → Regulatory |

**PRD 08 Recovery Triggers:**
```
CET1 < 7% → RED
LCR < 100% → RED
NSFR < 100% → RED
Leverage < 3% → RED
EVE > 15% Tier 1 → RED
Liquidity Gap > 20% → RED
```

---

### Phase 4 — GRC Risk Framework Page (PRD 09) (3h)

Create `pages/grc.js` with 5 tabs:

| Tab | Tables | Charts | Workflow | Relations |
|-----|--------|--------|----------|-----------|
| **RMF Library** | Policy documents (ID, title, version, status) | Bar (policies by status) | 3LoD diagram (Mermaid) | → All modules |
| **Risk Universe** | Risk register (ID, category, rating, trend) | Heatmap (risk × likelihood × impact) | Risk assessment flow | → All modules |
| **RAS Dashboard** | Risk appetite metrics (limit, current, utilization) | Gauge per metric, radar (appetite) | RAS approval flow | → ALCO |
| **Limit Framework** | Limits (ID, metric, threshold, breach status) | Bar chart (breach count) | Breach → Notification | → All modules |
| **3LoD Diagram** | Role assignments, segregation matrix | Org chart (Mermaid) | Audit evidence flow | → Data Foundation |

---

### Phase 5 — Regulatory Reporting Page (PRD 10) (2h)

Create `pages/regulatory.js` with 4 tabs:

| Tab | Tables | Charts | Workflow | Relations |
|-----|--------|--------|----------|-----------|
| **Template Catalogue** | Templates (report, frequency, owner, deadline) | Timeline (submission calendar) | Submission flow | → All modules |
| **Submission Scheduler** | Submissions (report, status, days left) | Gantt chart (submissions) | Approval workflow | → Compliance |
| **ORASS Status** | ORASS submissions (template, status, BoG ack) | Pie (submission statuses) | ORASS integration | → Data Foundation |
| **Disclosure** | Pillar 3 (section, published, status) | Bar (disclosure completeness) | — | → Capital |

---

### Phase 6 — Behavioural Model Library Page (PRD 11) (2h)

Create `pages/behavioural.js` with 4 tabs:

| Tab | Tables | Charts | Workflow | Relations |
|-----|--------|--------|----------|-----------|
| **NMD Models** | Parameters (product, core ratio, deposit beta, validation) | Bar (core ratio), line (beta trend) | Model lifecycle | → FTP, IRRBB |
| **Prepayment Models** | CPR assumptions by product | Line (CPR curve by loan age) | CPR calibration | → IRRBB, ECL |
| **TDRR Models** | TDRR by product and tenor | Heatmap (TDRR × product × tenor) | — | → Liquidity, FTP |
| **Validation Tracker** | Validation status (model, next due, findings) | Bar (models by status) | Validation workflow | → GRC, Audit |

**PRD 11 Formulas:**
```
Core Ratio = min(historical_core_ratio, 0.70)  // BoG cap
Deposit Beta = Δ(deposit_rate) / Δ(market_rate)
Effective Maturity = Σ(time_bucket × weight)
```

---

### Phase 7 — Cyber Security Page (PRD 12) (2h)

Create `pages/cyber.js` with 4 tabs:

| Tab | Tables | Charts | Workflow | Relations |
|-----|--------|--------|----------|-----------|
| **CISD Compliance** | Controls (ID, domain, status, last tested) | Radar (compliance by domain) | Compliance cycle | → GRC |
| **Data Residency** | Data map (asset, region, encryption, status) | Pie (data by region) | Data flow diagram | → Data Foundation |
| **Pen Testing** | Test history (date, scope, findings, severity) | Bar (findings by severity) | Test → Fix → Retest | → Compliance |
| **Board Reporting** | Cyber reports (quarter, status, submitted) | Trend (incidents) | Incident response | → GRC |

---

### Phase 8 — Expand RTGS Intraday (PRD 13) (2h)

Expand intraday tab into dedicated RTGS page:

| Tab | Tables | Charts | Workflow | Relations |
|-----|--------|--------|----------|-----------|
| **RTGS Monitor** | Settlement balances (account, balance, trend) | Real-time line (balance) | — | → Liquidity |
| **Throughput** | Throughput % by time window | Line (throughput trend) | — | — |
| **System Capability** | Feed health, fallback status | Uptime gauge | Demonstration flow | → Data Foundation |

**PRD 13 Formulas:**
```
Throughput_ratio_t = (payments_settled_by_t / total_expected_payments) × 100
Net_position_t = opening_balance + cumulative_inflows_t - cumulative_outflows_t
Peak_demand = min(net_position_t) for all t in business_day
```

---

### Phase 9 — Landing Page Enhancement (PRD 00 ALCO Cockpit) (2h)

Redesign landing as ALCO Cockpit:

| Row | Content |
|-----|---------|
| **Row 1** | 4 KPI cards (LCR, NSFR, CET1, NIM) with sparklines, threshold lines, subtext |
| **Row 2** | EVE Sensitivity table + Liquidity Stress bar chart |
| **Row 3** | ALCO Actions card + Data Quality Alerts card |
| **Row 4** | ECL Summary (pie) + Capital Stack (stacked bar) |

**PRD 00 Formulas:**
```
LCR = HQLA / Net Cash Outflows × 100
NSFR = ASF / RSF × 100
CET1 Ratio = CET1 Capital / RWA × 100
NIM = (Interest Income - Interest Expense) / Average Earning Assets × 100
ΔEVE = PV(Assets)_shocked - PV(Assets)_base - (PV(Liabilities)_shocked - PV(Liabilities)_base)
```

---

### Phase 10 — Navigation & Sidebar Update (1h)

- **Sidebar Groups:**
  - "Core ALM" — Liquidity, Capital, IRRBB, ECL, FTP, Optimization
  - "Risk & Recovery" — Recovery Planning, GRC, Cyber Security
  - "Governance & Data" — Data Foundation, Regulatory Reporting, Behavioural Models, RTGS Intraday
- **Breadcrumb trail** on each page
- **Active module indicator**

---

## File Structure (Post-Expansion)

```
bankOS/
├── index.html              ← +KaTeX CDN, expanded sidebar
├── app.js                  ← +13 route registrations
├── styles.css              ← +formula-block, callout-box, kpi-card styles
├── components/
│   └── ui.js               ← NEW (formulaBlock, calloutBox, kpiCard, statusBadge, mermaidDiagram)
├── data/
│   ├── dataFoundation.js   ← NEW
│   ├── recovery.js         ← NEW
│   ├── grc.js              ← NEW
│   ├── regulatory.js       ← NEW
│   ├── behavioural.js      ← NEW
│   ├── cyber.js            ← NEW
│   ├── liquidity.js        ← EXPAND (formulas, BoG ratios)
│   ├── irrbb.js            ← EXPAND (19 buckets, SOT)
│   ├── capital.js          ← EXPAND (stress scenarios, Pillar 2)
│   ├── ecl.js              ← EXPAND (Ghana macro)
│   ├── ftp.js              ← EXPAND (GRR methodology)
│   └── optimization.js     ← EXPAND (recovery triggers)
├── pages/
│   ├── landing.js          ← EXPAND (ALCO Cockpit layout)
│   ├── liquidity.js        ← EXPAND (BoG LMTD, formulas)
│   ├── capital.js          ← EXPAND
│   ├── irrbb.js            ← EXPAND
│   ├── ecl.js              ← EXPAND
│   ├── ftp.js              ← EXPAND
│   ├── optimization.js     ← EXPAND
│   ├── dataFoundation.js   ← NEW
│   ├── recovery.js         ← NEW
│   ├── grc.js              ← NEW
│   ├── regulatory.js       ← NEW
│   ├── behavioural.js      ← NEW
│   ├── cyber.js            ← NEW
│   └── rtgs.js             ← NEW (expanded from intraday)
├── charts/
│   └── charts.js           ← EXPAND (gauge, radar, waterfall, heatmap)
├── workflows/
│   └── diagrams.js         ← EXPAND (all Mermaid diagrams)
└── enhancedTrainingKilo.md ← THIS FILE
```

---

## Formula References from PRDs

### Liquidity (PRD 02)
```
HQLA = Level_1 + Level_2A × 0.85 + Level_2B × 0.50
Level_2_Cap = Level_1 × (0.40 / 0.60)
Net_Cash_Outflows = Total_Outflows - min(Total_Inflows, Total_Outflows × 0.75)
LCR = HQLA / Net_Cash_Outflows × 100
ASF = Σ(liabilities × factor)  // CET1=100%, Preferred=100%, Stable Retail=95%, etc.
NSFR = (ASF / RSF) × 100
```

### IRRBB (PRD 03)
```
ΔEVE = PV(Assets)_shocked - PV(Liabilities)_shocked - (PV(Assets)_base - PV(Liabilities)_base)
NII_month = (avg_asset_balance × asset_yield) - (avg_liability_balance × liability_cost)
Duration_gap = D_assets - (MV_liabilities / MV_assets) × D_liabilities
```

### Capital (PRD 04)
```
CET1_Ratio = CET1_Capital / RWA × 100
Tier1_Ratio = (CET1 + AT1) / RWA × 100
Leverage_Ratio = Tier1_Capital / Exposure_Measure × 100
Buffer_Headroom = Actual_Ratio - Minimum_Requirement - Combined_Buffer
```

### ECL (PRD 05)
```
ECL = PD × LGD × EAD (discounted at EIR)
Stage 1: 12-month ECL
Stage 2: Lifetime ECL if PD > origination_PD × 3 OR 30+ DPD
Stage 3: Credit-impaired (individually assessed)
weighted_ecl = Σ(ecl_scenario × weight)
```

### FTP (PRD 06)
```
FTP_rate = GRR_base + tenor_premium + bank_credit_spread + liquidity_premium
NMD_Core_Balance = total_NMD × min(core_ratio, 0.70)  // BoG cap
NMD_Volatile_Balance = total_NMD × (1 - core_ratio)
Replication_Yield = Σ(allocation_tenor × FTP_rate_tenor)
Endowment_Effect = Replication_Yield - Actual_Deposit_Cost
```

### Recovery (PRD 08)
```
Trigger_severity = f(current_value / threshold)
If CET1 < 7% → RED → CRO + Board + BoG escalation
If LCR < 100% → RED → BoG notification
```

### RTGS (PRD 13)
```
Throughput_ratio = (payments_settled / total_expected_payments) × 100
Net_position = opening_balance + cumulative_inflows - cumulative_outflows
Peak_demand = min(net_position_t) during business day
```

---

## Regulatory Callouts (BoG 2021/2026)

| Module | Regulation | Threshold |
|--------|------------|-----------|
| LCR | BoG LMTD | ≥ 100% (≥ 110% amber, ≥ 120% target) |
| NSFR | BoG LMTD | ≥ 100% (since June 2021) |
| CET1 | BoG Capital | ≥ 4.5% (≥ 7% internal target) |
| Leverage | BoG Capital | ≥ 3.0% |
| EVE | BoG IRRBB SOT | > 15% Tier 1 = supervisory outlier |
| NMD Core | BoG IRRBB | ≤ 70% cap |
| Deposit Beta | BoG IRRBB | 0.2 – 0.8 range |
| CISD | BoG CISD 2026 | In-country hosting, quarterly pen-test |

---

## Phase Summary

| Phase | Scope | Est. Effort |
|-------|-------|-------------|
| **1** | Formula Engine & UI Components | 1h |
| **2** | Data Foundation page (6 tabs) | 4h |
| **3** | Recovery Planning page (5 tabs) | 3h |
| **4** | GRC Risk Framework page (5 tabs) | 3h |
| **5** | Regulatory Reporting page (4 tabs) | 2h |
| **6** | Behavioural Models page (4 tabs) | 2h |
| **7** | Cyber Security page (4 tabs) | 2h |
| **8** | RTGS Intraday expansion | 2h |
| **9** | Landing page ALCO Cockpit | 2h |
| **10** | Navigation update | 1h |

**Total: ~21 hours**

---

## How to Approve

1. Review each Phase section above
2. Comment on any Phase to remove, merge, or reorder
3. Say "Approved" to authorize implementation
4. I will begin Phase 1 immediately upon approval