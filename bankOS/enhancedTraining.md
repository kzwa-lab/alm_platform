# bankOS — Enhanced Training Plan

## Goal

Transform bankOS into a complete HTML training representation covering **all 13 PRDs** of the ALM Platform (`docs/prd/`). The app should serve as an interactive, visually-rich learning tool where each PRD module becomes a navigable page with:

- Descriptive text explaining the module's purpose, users, and key concepts
- Realistic dummy data tables (8–15 rows) matching PRD table layouts
- Live Chart.js graphs and Mermaid workflow diagrams
- **Formula display** (KaTeX) for calculation logic
- **Contextual callouts** explaining regulatory references, Ghana-specific rules, and BoG thresholds
- Cross-module relation chips linking related concepts

---

## What Exists (Current App)

| Asset | Coverage |
|-------|----------|
| **7 page modules** | Landing, Liquidity, Capital, IRRBB, ECL, FTP, Optimization |
| **7 data files** | liquidity.js, capital.js, irrbb.js, ecl.js, ftp.js, optimization.js, relations.js |
| **charts/** | 11 chart-type wrappers; chart defs switch-case per tab |
| **workflows/** | Mermaid diagram renderer |
| **Tab system** | Query-param tab state, SPA routing, history pushState |
| **styles.css** | Tab nav, table, chip, chart-grid, loading-spinner, mermaid CSS |

---

## Gaps vs PRDs

| PRD | Module | Current State | Needs |
|-----|--------|---------------|-------|
| 00 | Platform Overview / ALCO Cockpit | Landing page with 4 tabs (overview, metrics, dataflow, BoG tracker) | Expand to full PRD 00.2 ALCO Cockpit: 4-row KPI cards, EVE sensitivity table, ALCO actions, ECL summary, capital stack |
| 01 | Data Foundation & ALCO Governance | **Missing entirely** | New page: Data Ingestion, MDM, Data Quality Scorecard, ALCO Workflow, Audit Trail, ALM Control Tower |
| 02 | Liquidity Risk | 6 tabs (LCR, NSFR, stress, EWI, gap, intraday) | Add formulas (KaTeX), add BoG LMTD ratio display per PRD 2.1, add significant-currency LCR, funding concentration table |
| 03 | Interest Rate Risk | 6 tabs (EVE, NII, gap, yield curves, SOT, what-if) | Add standardisation categorisation table, basis risk matrix, yield-curve risk assessment, 19-bucket reference table |
| 04 | Capital Management | 6 tabs (stack, RWA, ratios, output floor, ICAAP, D-SIB) | Add buffer headroom table, Pillar 2 add-on breakdown, capital instrument register, Ghana stress scenarios |
| 05 | ECL | 6 tabs (stage, SICR, macro, PD/LGD, PMA, collective) | Add Ghana-specific macro variable table, scenario consistency validation, sectoral PD adjustments table |
| 06 | FTP | 6 tabs (GRR, NMD, deal, LTP, loan calc, term structure) | Add GRR methodology breakdown, GoG T-Bill curve table, cross-currency basis table, regulatory cost components |
| 07 | Balance Sheet Optimization | 6 tabs (NIM, what-if, hedging, deposit pricing, origination, ALCO) | Add recovery trigger integration table, NIM attribution waterfall, submission tracker, consolidated reporting |
| 08 | Recovery Planning | **Missing entirely** | New page: plan repository, options menu, indicator dashboard, self-assessment |
| 09 | GRC Risk Framework | **Missing entirely** | New page: RMF library, risk universe register, RAS dashboard, limit breach tracker, 3LoD diagram |
| 10 | Regulatory Reporting & ORASS | **Missing entirely** | New page: template catalogue, submission scheduler, ORASS status, public disclosure generator |
| 11 | Behavioural Model Library | **Missing entirely** | New page: NMD models, prepayment models, TDRR models, validation tracker |
| 12 | Cyber Security & Data Residency | **Missing entirely** | New page: CISD 2026 compliance, data residency map, pen-testing tracker, board cyber report |
| 13 | RTGS Intraday Liquidity | **Partial** — tab in Liquidity page | Expand with PRD 13 content: RTGS system capability, settlement agent monitoring, throughput dashboard |

---

## Enhancement Phases

### Phase 1 — Formula Engine & Card Formatting (1h)

Add KaTeX CDN for LaTeX formula rendering. Create a `components/` module that renders:
- `formulaBlock(latex, label)` — rendered formula with label
- `calloutBox(text, type)` — info/warning/regulatory callouts
- `kpiCard(config)` — large metric card with sparkline, threshold line, subtext
- `statusBadge(status)` — green/amber/red status indicator

Update all 7 existing page modules to display key formulas at the top of each tab using `formulaBlock()`.

**Files to create/modify:**
- `components/ui.js` — UI helpers
- `index.html` — add KaTeX CDN
- `styles.css` — add .formula-block, .callout-box, .kpi-card styles
- All `pages/*.js` — add formula blocks per tab

---

### Phase 2 — New Page: Data Foundation & ALCO Governance (4h)

Create `pages/dataFoundation.js` with 6 tabs:

| Tab | Tables | Charts | Workflow | Relations |
|-----|--------|--------|----------|-----------|
| **Data Ingestion** | Source list (name, type, last run, status, rows), frequency table | 1 throughput bar chart per source, 1 pie (success vs fail) | ETL pipeline diagram (Mermaid) | → All modules |
| **MDM** | Product catalog (ID, name, type, BoG LMTD, IRRBB class), counterparty list | 1 bar chart (product count by category) | Classification hierarchy | → Liquidity, Capital, IRRBB |
| **Data Quality** | Scorecard table (dimension, score, trend, issues), source breakdown | 1 gauge (overall score), 1 radar (5 dimensions) | Quality rule flow | → All modules |
| **ALCO Workflow** | Meeting schedule, agenda items, action items table | 1 timeline (meeting history), 1 bar (action status) | Meeting lifecycle | → Optimization (ALCO Pack) |
| **Audit Trail** | Log table (timestamp, user, action, table, detail), lineage view | 1 activity heatmap (actions × hour) | — | → GRC (compliance) |
| **Control Tower** | Reconciliation table (ALM code, TB value, XTEL value, variance, status), tracker checklist | 1 matched/unmatched pie, 1 variance waterfall | Run lifecycle | → All modules |

**Files to create:**
- `pages/dataFoundation.js` — page module
- `data/dataFoundation.js` — dummy datasets (ingestion sources, products, quality rules, ALCO meetings, audit logs, control tower)
- Update `app.js` — register route, add nav link

---

### Phase 3 — New Page: Recovery Planning (3h)

Create `pages/recovery.js` with 5 tabs:

| Tab | Tables | Charts | Workflow | Relations |
|-----|--------|--------|----------|-----------|
| **Plan Repository** | Plan versions (version, date, status, approved by, BoG submission) | 1 timeline (plan history) | Plan lifecycle | → Capital, Liquidity |
| **Options Menu** | Recovery options (name, type, impact, timeline, feasibility, status) | 1 bar chart (impact by option) | Option selection flow | → All modules (impact) |
| **Indicator Dashboard** | Quantitative indicators (name, threshold, current, breach status, trend) | 1 gauge dashboard, 1 trend line per indicator | Trigger → Escalation flow | → All modules (metric sources) |
| **Trigger Monitor** | Trigger table (trigger, threshold, actual, status, days since breach) | 1 heatmap (trigger × time) | Breach notification flow | → GRC (limit breaches) |
| **Self-Assessment** | Annual test results (option, test date, outcome, lessons learned, next test) | 1 radar (readiness by dimension) | Testing cycle | → Regulatory Reporting |

**Files to create:**
- `pages/recovery.js`
- `data/recovery.js`

---

### Phase 4 — New Page: GRC Risk Framework (3h)

Create `pages/grc.js` with 5 tabs:

| Tab | Tables | Charts | Workflow | Relations |
|-----|--------|--------|----------|-----------|
| **RMF Library** | Policy documents (ID, title, version, effective date, owner, status) | 1 bar (policies by status) | 3LoD diagram (Mermaid) | → All modules |
| **Risk Universe** | Risk register (risk ID, category, sub-category, inherent rating, residual, trend) | 1 heatmap (risk × likelihood × impact) | Risk assessment flow | → All modules |
| **RAS Dashboard** | Risk appetite metrics (metric, limit, current, utilization, status) | 1 gauge per metric, 1 radar (appetite dimensions) | RAS approval flow | → ALCO |
| **Limit Framework** | Limits (limit ID, metric, threshold, current value, breach status, owner) | 1 bar chart (breach count by limit) | Breach → Notification → Board flow | → All modules (limits) |
| **CRO Independence** | Dual-hatting check, 3LoD role assignments, segregation of duties matrix | 1 org chart (Mermaid) | Audit evidence flow | → Data Foundation (users) |

**Files to create:**
- `pages/grc.js`
- `data/grc.js`

---

### Phase 5 — New Page: Regulatory Reporting & ORASS (2h)

Create `pages/regulatory.js` with 4 tabs:

| Tab | Tables | Charts | Workflow | Relations |
|-----|--------|--------|----------|-----------|
| **Template Catalogue** | Templates (report name, frequency, format, owner, last submitted, next deadline) | 1 timeline (submission calendar) | Submission flow | → All modules |
| **Submission Scheduler** | Submissions (report, deadline, status, prepared by, reviewed by, days left) | 1 Gantt chart (submissions timeline) | Approval workflow | → Compliance |
| **ORASS Status** | ORASS submissions (template, date, status, BoG ack, error count) | 1 pie (submission statuses) | ORASS integration flow | → Data Foundation |
| **Public Disclosure** | Pillar 3 disclosures (section, last published, next due, status) | 1 bar (disclosure completeness) | → Capital |

**Files to create:**
- `pages/regulatory.js`
- `data/regulatory.js`

---

### Phase 6 — New Page: Behavioural Model Library (2h)

Create `pages/behavioural.js` with 4 tabs:

| Tab | Tables | Charts | Workflow | Relations |
|-----|--------|--------|----------|-----------|
| **NMD Models** | Model parameters (product, core ratio, behavioural maturity, deposit beta, validation date) | 1 bar (core ratio by product), 1 line (deposit beta trend) | Model lifecycle | → FTP, IRRBB |
| **Prepayment Models** | CPR assumptions by product (product, base CPR, stress CPR, seasonality factor) | 1 line (CPR curve by loan age) | CPR calibration flow | → IRRBB, ECL |
| **TDRR Models** | TDRR by product and tenor (product, tenor, TDRR%, stability factor) | 1 heatmap (TDRR × product × tenor) | → Liquidity, FTP |
| **Validation Tracker** | Validation status (model, last validated, next due, validator, findings, status) | 1 bar (models by validation status) | Validation workflow | → GRC, Audit |

**Files to create:**
- `pages/behavioural.js`
- `data/behavioural.js`

---

### Phase 7 — New Page: Cyber Security & Data Residency (2h)

Create `pages/cyber.js` with 4 tabs:

| Tab | Tables | Charts | Workflow | Relations |
|-----|--------|--------|----------|-----------|
| **CISD Compliance** | Control framework (control ID, domain, status, last tested, next test, owner) | 1 radar (CISD compliance by domain) | Compliance cycle | → GRC |
| **Data Residency** | Data map (asset, region, storage location, encryption, retention, status) | 1 pie (data by region) | Data flow diagram | → Data Foundation |
| **Pen Testing** | Test history (date, scope, findings, severity, remediated, retest date) | 1 bar (findings by severity) | Test → Fix → Retest flow | → Compliance |
| **Board Reporting** | Cyber reports (report, quarter, status, submitted, next due) | 1 trend (incidents over time) | Incident response flow | → GRC |

**Files to create:**
- `pages/cyber.js`
- `data/cyber.js`

---

### Phase 8 — Expand Existing Pages (3h)

For each of the 7 existing pages, add:

**Per tab — Formula blocks:**
- KaTeX-rendered formulas from PRD calculation logic section
- Example: `LCR = \frac{HQLA}{Net\ Cash\ Outflows} \times 100`

**Per tab — Callout boxes:**
- Regulatory reference: "BoG LMTD requires LCR ≥ 100%"
- Ghana-specific rule: "GSE equities capped at 10% of total liquid assets"
- Key concept: "HQLA must be unencumbered"

**Landing page (PRD 00 upgrade):**
- Row 1: 4 KPI cards (LCR, NSFR, CET1, NIM) with sparklines, threshold lines, subtext
- Row 2: EVE Sensitivity table + Liquidity Stress bar chart
- Row 3: ALCO Actions card + Data Quality Alerts card
- Row 4: ECL Summary (pie chart) + Capital Stack (stacked bar)

**Existing data files — enrich with:**
- More columns matching PRD table layouts
- Formula annotation fields for display
- Regulatory reference tags

---

### Phase 9 — Navigation & App Shell Update (1h)

- **Sidebar** — add nav links for all 13 modules (including new ones)
- **Sidebar groups** — collapse/expand: "Core ALM", "Risk & Capital", "Governance & Reporting"
- **Top bar** — breadcrumb trail, active module indicator
- **Landing page** — redesign as proper ALCO Cockpit with KPI cards
- **Favicon** — create or use SVG favicon to eliminate 404

---

### Phase 10 — Polish & Documentation (1h)

- Print-friendly CSS for tables and charts
- Dark mode consistency
- Loading states for each tab
- Responsive breakpoints for tablet (1366px)
- Add `enhancedTraining.md` completion checklist

---

## Math Rendering

Add CDN link in `index.html`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
```

Helper: `katex.render("formula", element)` or `katex.renderToString("formula")`.

---

## New File Structure

```
bankOS/
├── index.html              ← +KaTeX CDN, expanded sidebar
├── app.js                  ← +10 new route registrations
├── styles.css              ← +formula, callout, kpi-card styles
├── data/
│   ├── dataFoundation.js   ← NEW
│   ├── recovery.js         ← NEW
│   ├── grc.js              ← NEW
│   ├── regulatory.js       ← NEW
│   ├── behavioural.js      ← NEW
│   ├── cyber.js            ← NEW
│   └── ... (existing 7)
├── pages/
│   ├── dataFoundation.js   ← NEW
│   ├── recovery.js         ← NEW
│   ├── grc.js              ← NEW
│   ├── regulatory.js       ← NEW
│   ├── behavioural.js      ← NEW
│   ├── cyber.js            ← NEW
│   ├── landing.js          ← EXPAND (ALCO Cockpit)
│   └── ... (existing 6, enrich with formulas)
├── components/
│   └── ui.js               ← NEW (formulaBlock, calloutBox, kpiCard, statusBadge)
├── charts/
│   └── charts.js
├── workflows/
│   └── diagrams.js
└── enhancedTraining.md     ← THIS FILE
```

---

## Phase Summary

| Phase | Scope | Est. Effort |
|-------|-------|-------------|
| **1** | Formula Engine & UI Components | 1h |
| **2** | Data Foundation page (6 tabs) | 4h |
| **3** | Recovery Planning page (5 tabs) | 3h |
| **4** | GRC Risk Framework page (5 tabs) | 3h |
| **5** | Regulatory Reporting page (4 tabs) | 2h |
| **6** | Behavioural Model Library page (4 tabs) | 2h |
| **7** | Cyber Security page (4 tabs) | 2h |
| **8** | Expand existing 7 pages with formulas + enriched data | 3h |
| **9** | Navigation, sidebar groups, app shell polish | 1h |
| **10** | Print CSS, dark mode, loading states, responsive | 1h |

**Total: ~22 hours**

---

## How to Approve

1. Read each Phase section above
2. Comment on any Phase you want removed, merged, or reordered
3. Say "Approved" for the phase(s) you want me to start on
4. I will begin implementation phase by phase, starting from Phase 1
