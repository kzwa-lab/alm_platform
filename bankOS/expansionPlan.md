# BankOS Expansion Plan

## Overview

Transform bankOS from a static training demo into an interactive, visually rich ALM training platform. Each module gets tabbed feature breakdowns with dummy data tables, live graphs, workflow diagrams, and cross-module data relation maps.

---

## Architecture Changes

| Change | Detail |
|--------|--------|
| **Chart Library** | Add Chart.js (lightweight, CDN-ready) for all graphs |
| **CSS Framework** | Keep Tailwind CDN; add tab-system CSS utilities |
| **Routing** | Add query-param tab state (`?tab=feature-name`) with browser-history support |
| **Data Layer** | Create a shared `data.js` module with all dummy datasets, relation maps, and mock API delays |
| **Component Pattern** | Each module file exports `render()` that accepts `{ activeTab, data }` |

---

## Module Expansion Detail

### 1. Dashboard (Landing) — renderLanding()

| Tab | Features | Graphs | Relations |
|-----|----------|--------|-----------|
| **Platform Overview** | System architecture diagram (existing), module grid (existing) | — | — |
| **Key Metrics** | Live KPI cards: LCR, CAR, NIM, ECL coverage | 2 gauge charts (LCR, CAR), 1 trend sparkline | Links to Liquidity, Capital, Optimization, ECL |
| **Data Flow** | ETL pipeline status, last-run timestamps | 1 data lineage diagram (Mermaid), 1 throughput bar chart | All modules |
| **BoG 2026 Tracker** | Regulatory compliance % by module, gap count | 1 radar chart (module compliance), 1 waterfall | All modules |

**New data tables:**
- KPI summary table: Metric, Current, Target, Status, Trend
- Data source table: Source System, Module, Frequency, Last Sync, Records Loaded

---

### 2. Liquidity Risk — renderLiquidity()

| Tab | Feature | Graphs | Relations |
|-----|---------|--------|-----------|
| **LCR** | LCR Calculation with 19-bucket HQLA waterfall | 1 stacked bar (HQLA/Inflows/Outflows by bucket), 1 LCR trend line | → IRRBB (gap alignment), → FTP (LTP pricing) |
| **NSFR** | Net Stable Funding Ratio with ASF/RSF breakdown | 1 horizontal bar (ASF vs RSF by category), 1 pie (funding composition) | → Capital (leverage limit), → RTGS (stable funding) |
| **Maturity Mismatch** | 13-band gap analysis with cumulative mismatch | 1 waterfall chart (cumulative gap), 1 area chart (assets vs liabilities) | → IRRBB (gap buckets align), → RTGS (intraday) |
| **Stress Testing** | Idiosyncratic + Market-wide scenarios | 1 tornado chart (scenario impact), 1 survival horizon chart | → Recovery (trigger calibration), → Capital (ICAAP) |
| **EWI / CFP** | Early Warning Indicators with traffic-light thresholds | 1 heatmap (EWI × time), 1 gauge (CFP trigger proximity) | → Recovery (trigger escalation), → GRC (risk appetite) |
| **Intraday Liquidity** | RTGS-connected intraday positions | 1 real-time line chart (balance × time), 1 throughput bar | → RTGS (settlement feed), → Data Foundation |

**New data tables:**
- LCR detailed: Time Bucket, HQLA (Level 1/2A/2B), Inflows (Retail/Wholesale), Outflows, Net, Cum. LCR%
- NSFR: Component, Amount, Factor, Weighted Amount
- Stress test scenarios: Scenario Name, LCR Impact, Survival Days, Recovery Actions

---

### 3. Capital Management — renderCapital()

| Tab | Feature | Graphs | Relations |
|-----|---------|--------|-----------|
| **Capital Stack** | CET1 / AT1 / T2 waterfall with regulatory minimum overlays | 1 waterfall (capital stack), 1 comparator bar (actual vs min) | → ECL (expected losses), → IRRBB (EVE impact) |
| **RWA Dashboard** | Credit / Market / Operational RWA breakdown | 1 pie chart (RWA by risk type), 1 area chart (RWA trend) | → Data Foundation (exposure data), → ECL (EAD feeds) |
| **Capital Ratios** | CET1 / Tier 1 / Total Capital ratios, Leverage Ratio | 1 gauge dashboard (3 gauges), 1 line chart (ratio trend 12Q) | → Liquidity (leverage interaction), → Optimization |
| **Output Floor** | Standardised vs IRB RWA comparison, floor impact | 1 grouped bar (standardised vs IRB), 1 bridge chart | → Data Foundation (model governance) |
| **ICAAP** | ICAAP capital demand vs available, stress scenarios | 1 stacked bar (capital demand components), 1 tornado (stress impact) | → Liquidity (ILAAP link), → Recovery (reverse stress) |
| **D-SIB Surcharge** | Systemic indicator scores, surcharge calculation | 1 radar chart (5 indicator dimensions), 1 surcharge waterfall | → GRC (systemic risk register) |

**New data tables:**
- Capital Stack: Component, Amount (€M), RWA%, Ratio%, Min Requirement, Buffer, Status
- RWA by exposure class: Exposure Class, EAD (€M), Risk Weight%, RWA (€M)
- ICAAP: Risk Type, Pillar I Capital, Pillar II Add-on, Total Demand, Available, Gap

---

### 4. IRRBB — renderIRRBB()

| Tab | Feature | Graphs | Relations |
|-----|---------|--------|-----------|
| **EVE Sensitivity** | 6-scenario EVE change with SOT outlier test | 1 bar chart (EVE change by scenario), 1 waterfall (EVE decomposition) | → Capital (EVE→Tier1 impact), → Optimization (hedging) |
| **NII Forecast** | 12-quarter NII under flat/up/down paths | 1 line chart (NII paths), 1 area chart (NII at-risk bands) | → FTP (curve inputs), → Optimization (NIM planning) |
| **Repricing Gap** | 19-bucket gap with rate sensitivity column | 1 waterfall (cumulative gap), 1 grouped bar (assets/liabilities per bucket) | → Liquidity (maturity mismatch alignment) |
| **Yield Curves** | GRR-based curves with historical overlay | 1 line chart (multiple date curves), 1 surface chart (3D curve evolution) | → FTP (curve source), → Data Foundation (GRR feed) |
| **SOT Monitor** | Supervisory Outlier Test tracker (EVE > 15% Tier1) | 1 gauge (SOT ratio), 1 trend chart (ratio history) | → Capital (Tier1 denominator), → GRC (risk limits) |
| **What-If Scenarios** | Custom rate-shock builder with instant revaluation | 1 scenario comparison bar, 1 P&L impact waterfall | → Optimization (scenario feeds), → ALCO (reporting) |

**New data tables:**
- EVE: Scenario, Rate Shock, EVE Change (€M), EVE%, Tier1 Impact (pp), SOT Status
- Gap: Bucket, Assets (€M), Liabilities (€M), Gap (€M), Cum. Gap (€M), Sensitivity%, Change in NII
- Yield curve: Tenor, GRR%, OIS%, Spread (bps), 1M Ago, 3M Ago

---

### 5. ECL / Credit Risk — renderECL()

| Tab | Feature | Graphs | Relations |
|-----|---------|--------|-----------|
| **Stage Allocation** | Stage 1/2/3 exposure with ECL detail | 1 stacked bar (exposure by stage), 1 pie chart (ECL by stage) | → Capital (RWA credit risk), → Data Foundation (PD models) |
| **SICR Monitor** | Significant Increase in Credit Risk triggers | 1 day-0 tracker (PD movement), 1 flow diagram (stage migration) | → Behavioural Model Library (PD term structure) |
| **Macro Scenarios** | Ghana GDP, inflation, cedi scenarios | 1 line chart (macro paths), 1 impact bar chart (ECL under 3 scenarios) | → Data Foundation (macro data feed), → ICAAP |
| **PD/LGD/EAD** | Parameter grids by product and rating grade | 1 heatmap (PD × rating × product), 1 histogram (LGD recovery) | → Behavioural Model Library, → Data Foundation |
| **PMA Tracker** | Post-Model Adjustments by sector/region | 1 grouped bar (PMA by sector), 1 trend line (PMA run-off) | → GRC (model governance), → Audit |
| **Collective vs Individual** | Provision breakdown with coverage ratios | 1 stacked bar (provision types), 1 line chart (coverage ratio trend) | → Regulatory Reporting (IFRS 9 disclosures) |

**New data tables:**
- Stage detail: Stage, Count, EAD (€M), PD (%), LGD (%), ECL (€M), Coverage%
- SICR: Account ID, Product, 12M PD Change, Days Past Due, SICR Flag, Trigger Reason
- Macro: Scenario, GDP%, Inflation%, Cedi/USD, Unemployment%, ECL Impact%

---

### 6. FTP & Pricing — renderFTP()

| Tab | Feature | Graphs | Relations |
|-----|---------|--------|-----------|
| **GRR Curve** | Ghana Reference Rate curve with tenors | 1 line chart (GRR curve), 1 area chart (curve shift day-over-day) | → IRRBB (yield curves), → Data Foundation (market data) |
| **NMD Modelling** | Core / Volatile deposit split with BoG caps | 1 bar chart (core vs volatile by product), 1 pie (deposit mix) | → Liquidity (stable funding), → IRRBB (repricing) |
| **Deal Pricer** | Deal-level profitability with FTP attribution | 1 waterfall (deal P&L decomposition), 1 scatter (margin vs risk) | → Optimization (NIM), → Balance Sheet (ROE) |
| **LTP Attribution** | Liquidity premium by tenor and product | 1 bar chart (LTP by tenor), 1 breakdown table | → Liquidity (LCR cost), → IRRBB (term premium) |
| **Loan Calculator** | Customer rate recommendation engine | 1 slider-driven line chart (rate vs margin), 1 comparator | → Optimization (pricing guidance) |
| **Term Structure** | Funding curve comparison (on-shore vs off-shore) | 1 multi-line chart (curve comparison), 1 spread chart | → IRRBB (curve inputs), → Data Foundation (Ghana market) |

**New data tables:**
- GRR: Tenor, GRR%, Risk-Free%, Credit Spread%, Liquidity Premium%, Total FTP%
- NMD: Product, Balance (€M), Core%, Volatile%, Beta, Avg Life (Yrs), FTP Rate%
- Deal: Deal ID, Product, Notional, Margin, FTP Cost, LTP Cost, Net Contribution, ROE

---

### 7. Balance Sheet Optimization — renderOptimization()

| Tab | Feature | Graphs | Relations |
|-----|---------|--------|-----------|
| **NIM Attribution** | NIM by product, currency, business unit | 1 waterfall (NIM decomposition), 1 bar chart (product NIM) | → FTP (pricing inputs), → IRRBB (rate sensitivity) |
| **What-If Builder** | Scenario creation with rate/path/balance changes | 1 scenario comparison line, 1 impact heatmap | → ALCO (decision support), → All modules |
| **Hedging Tracker** | Structural hedge portfolio, effectiveness testing | 1 area chart (hedge portfolio value), 1 effectiveness scatter | → IRRBB (EVE hedge), → Capital (MTM impact) |
| **Deposit Pricing** | Pricing elasticity model, rate recommendation | 1 scatter (rate vs volume), 1 price sensitivity curve | → FTP (NMD pricing), → Liquidity (funding cost) |
| **Loan Origination** | Origination ROE by product and risk grade | 1 bar chart (ROE by product), 1 bubble chart (risk×return) | → ECL (credit cost), → Capital (RWA consumption) |
| **ALCO Pack** | Auto-generated board report with all KPIs | 1 dashboard composite (mini KPI cards + charts) | → All modules (consolidation) |

**New data tables:**
- NIM: Product, Avg Assets, Yield%, Cost of Funds%, NIM%, Volume Contribution, Rate Contribution
- What-If: Scenario Name, Rate Path, NII Impact%, EVE Impact%, LCR Impact%, CAR Impact%
- Hedge: Instrument, Notional (€M), MTM (€M), Hedge Ratio, Effectiveness%, Maturity

---

## Graph Types Inventory

| Graph | Use Case | Example Module(s) |
|-------|----------|-------------------|
| **Bar Chart (grouped)** | Compare categories across dimensions | LCR buckets, RWA by type, ECL by stage |
| **Bar Chart (stacked)** | Show composition and total | Exposure by stage, funding composition |
| **Line Chart** | Trends over time | LCR trend, NII forecast, yield curves |
| **Area Chart** | Accumulated values | Cumulative gap, NII at-risk bands |
| **Waterfall** | Cumulative decomposition | Capital stack, NIM attribution, deal P&L |
| **Pie/Doughnut** | Proportional breakdown | RWA by risk type, deposit mix, ECL by stage |
| **Gauge** | Single metric vs threshold | LCR gauge, CAR gauge, SOT ratio |
| **Radar** | Multi-dimensional comparison | D-SIB indicators, module compliance |
| **Heatmap** | Matrix values | EWI × time, PD × rating × product |
| **Scatter / Bubble** | Two-variable relationships | Risk × Return, rate vs volume |
| **Tornado** | Sensitivity / scenario impact | Stress testing, ICAAP scenario analysis |
| **Histogram** | Distribution | LGD recovery rates |
| **3D Surface** | Three-dimensional curve evolution | Yield curve evolution over time |

---

## Workflow Diagrams (Mermaid)

| Diagram | Module(s) | Purpose |
|---------|-----------|---------|
| **LCR Calculation Flow** | Liquidity | HQLA classification → inflow/outflow calc → LCR ratio → CFP trigger |
| **Stage Migration Flow** | ECL | Origination → Stage 1 → SICR check → Stage 2 → Default → Stage 3 → Write-off |
| **FTP Rate Setting Flow** | FTP, IRRBB | GRR feed → curve construction → NMD modelling → deal pricing → LTP attribution |
| **Capital Calculation Flow** | Capital, ECL | Exposures → RWA calc (credit/market/op risk) → capital deductions → ratios → ICAAP |
| **Stress Testing Flow** | Liquidity, Capital, Recovery | Scenario selection → parameter shocks → LCR/CAR calculation → recovery trigger assessment |
| **ALCO Decision Flow** | Optimization, All modules | Data collection → module KPIs → what-if analysis → ALCO pack → board decision |
| **Regulatory Reporting Flow** | Regulatory, All modules | Module outputs → ORASS templates → validation → submission → BoG acknowledgement |
| **Balance Sheet Planning Flow** | Optimization, FTP, IRRBB | Current state → what-if inputs → NIM/EVE/LCR projections → optimization → target state |

---

## Cross-Module Data Relations Map

```
Liquidity Risk ────────────┬───► IRRBB (gap bucket alignment)
                           ├───► FTP (LTP cost of liquidity)
                           ├───► Capital (leverage ratio denominator)
                           ├───► RTGS (intraday funding)
                           └───► Recovery (CFP trigger escalation)

Capital Management ────────┬───► ECL (expected losses → RWA)
                           ├───► IRRBB (EVE → Tier1 impact)
                           ├───► Liquidity (leverage ratio)
                           └───► ICAAP (stress scenario integration)

IRRBB ─────────────────────┬───► Capital (EVE sensitivity → capital)
                           ├───► FTP (curve inputs)
                           ├───► Optimization (NIM, hedging)
                           └───► ALCO (what-if scenarios)

ECL ───────────────────────┬───► Capital (RWA credit risk)
                           ├───► Behavioural Models (PD term structure)
                           ├───► Regulatory Reporting (IFRS 9)
                           └───► Data Foundation (macro scenarios)

FTP ───────────────────────┬───► IRRBB (yield curve source)
                           ├───► Liquidity (LTP attribution)
                           ├───► Optimization (NIM decomposition)
                           └───► Balance Sheet (product profitability)

Optimization ──────────────┬───► All modules (consolidation layer)
                           ├───► ALCO (board reporting)
                           ├───► Capital (RWA optimization)
                           └───► IRRBB (hedging effectiveness)

Behavioural Models ────────┬───► ECL (PD term structure)
                           ├───► FTP (NMD core/volatile split)
                           └───► Liquidity (deposit stickiness)

Data Foundation ──────────────► All modules (master data, GRR, macros)
Regulatory Reporting ─────────► All modules (ORASS templates)
GRC ──────────────────────────► All modules (risk limits, model governance)
RTGS ─────────────────────────► Liquidity (intraday)
Recovery ─────────────────────► Liquidity (triggers), Capital (reverse stress)
```

---

## Implementation Phases

| Phase | Scope | Effort |
|-------|-------|--------|
| **Phase 1** | Data layer: `data.js` with all dummy datasets, relation maps, shared utilities | 2h |
| **Phase 2** | Tab system: CSS utilities, tab state management (query params + history), reusable tab component | 1h |
| **Phase 3** | Chart integration: Chart.js CDN, reusable chart-render helpers (bar, line, pie, gauge, waterfall, heatmap, radar) | 3h |
| **Phase 4** | Mermaid workflow diagrams: inline diagram blocks for each module flow | 2h |
| **Phase 5** | Module expansion (parallel per module): convert each `render*()` to tabbed multi-feature views with data tables, charts, diagrams, and relation links | 8h |
| **Phase 6** | Cross-module linking: clickable relation links, module-jump navigation, breadcrumb trail | 2h |
| **Phase 7** | Angular parity: update Angular standalone components to match vanilla JS expansion | 4h |
| **Phase 8** | Polish: responsive layout, dark mode consistency, loading states, print-friendly | 2h |

**Total estimated effort: ~24 hours**

---

## File Structure (Post-Expansion)

```
bankOS/
├── index.html          ← header, sidebar, content area, modals
├── app.js              ← routing, tab-state, init
├── styles.css          ← tab styles, chart container styles, workflow-diagram styles
├── data/
│   ├── liquidity.js    ← LCR, NSFR, stress, EWI datasets + relation maps
│   ├── capital.js      ← capital stack, RWA, ICAAP datasets
│   ├── irrbb.js        ← EVE, NII, gap, yield curve datasets
│   ├── ecl.js          ← stage, SICR, macro, PD/LGD/EAD datasets
│   ├── ftp.js          ← GRR, NMD, deal, LTP datasets
│   ├── optimization.js ← NIM, what-if, hedge datasets
│   └── relations.js    ← cross-module relation registry
├── pages/
│   ├── landing.js      ← Platform overview, KPIs, data flow, BoG tracker tabs
│   ├── liquidity.js    ← 6 tabs × (table + 2 charts + workflow + relations)
│   ├── capital.js      ← 6 tabs × (...)
│   ├── irrbb.js        ← 6 tabs × (...)
│   ├── ecl.js          ← 6 tabs × (...)
│   ├── ftp.js          ← 6 tabs × (...)
│   └── optimization.js ← 6 tabs × (...)
├── charts/
│   └── chart.js        ← Chart.js wrappers: all 13 graph types
├── workflows/
│   └── diagrams.js     ← Mermaid diagram generators
└── src/                ← Angular standalone app (parallel update)
    └── app/
        ├── pages/
        └── services/
```

---

## Tab System Specification

```html
<!-- Tab container pattern -->
<div class="tab-container">
  <nav class="tab-nav" role="tablist">
    <button class="tab-button active" data-tab="lcr" role="tab">LCR</button>
    <button class="tab-button" data-tab="nsfr" role="tab">NSFR</button>
    <button class="tab-button" data-tab="gap" role="tab">Gap Analysis</button>
    ...
  </nav>
  <div class="tab-panel active" id="tab-lcr" role="tabpanel">
    <!-- Feature content: description, tables, charts, workflows, relations -->
  </div>
  <div class="tab-panel" id="tab-nsfr" role="tabpanel">...</div>
</div>
```

**CSS:** Flexbox tab bar, underline-active indicator, fade transition between panels, fixed tab bar on scroll.

**State:** `?tab=lcr` in URL query param; `history.replaceState` on tab change; event delegation on `.tab-button` clicks.

---

## Each Tab Content Template

```
┌──────────────────────────────────────────────────┐
│  FEATURE DESCRIPTION (2-3 sentences)             │
├──────────────────────────────────────────────────┤
│  DATA TABLE (8-12 rows with realistic dummy data) │
├──────────────────────────────────────────────────┤
│  CHART 1 (primary visualization for the feature)  │
├──────────────────────────────────────────────────┤
│  CHART 2 (secondary/trend/comparison view)        │
├──────────────────────────────────────────────────┤
│  WORKFLOW DIAGRAM (Mermaid, where applicable)     │
├──────────────────────────────────────────────────┤
│  DATA RELATIONS (links to other features/modules) │
└──────────────────────────────────────────────────┘
```

---

## Dummy Data Guidelines

| Data Point | Convention |
|------------|------------|
| Currency | €M (Euro millions) for all monetary values |
| Bank Name | "Bank of Ghana ALM Bank" / "Ghana ALM Bank Ltd" |
| Time Periods | Jan 2026 – Dec 2026 |
| Tenors | ON, 1W, 1M, 3M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y |
| Status Values | Compliant / Warning / Breach / Normal / Watch / Action |
| Thresholds | Align with BoG 2026 minima (LCR 100%, CAR 13%, etc.) |
| Rate Environment | Ghana: GRR ~21-27%, Inflation ~15-18% |
| Portfolio Size | Total assets ~€12.5B, Total deposits ~€8.2B |

---

## Next Steps

1. Approve this plan
2. Begin Phase 1: Create `data/` directory with all module datasets
3. Proceed through phases in order, testing each module tab after implementation
