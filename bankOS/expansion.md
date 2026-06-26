# bankOS Expansion Plan — PRD-Driven Feature Enrichment

## Overview

Current state: 6 module pages with 1–2 static tables each, no graphs/charts, no tabs, no interactivity.

Target state: Each module gains tabbed navigation with 4–6 tabs per module, each tab containing detailed feature information from PRDs, two additional data tables, and two data visualizations (chart/graph). Also add new modules mapped to PRDs not yet represented.

### PRD Sources

All enrichment derives from `/docs/prd/00-platform-overview.md` through `/docs/prd/13-rtgs-intraday-liquidity.md`. Each PRD contains:

- **Users & Roles** — per-module role definitions with specific responsibilities
- **Features** — detailed feature descriptions with:
  - User Stories (As a X, I want Y, So that Z)
  - Acceptance Criteria (checklist items)
  - Screen Layout Descriptions (ASCII mockups showing tab layouts, tables, charts)
  - Data Inputs (source tables mapped to inputs)
  - Calculation Logic / Business Rules (formulas and code)
  - Validation Rules
  - Error Handling (levels, alerts, escalations)
  - Audit & Compliance Requirements
- **Data Models** — entity tables and relationships

---

## Module 1: Liquidity Risk (Tab Expansion)

**Current:** 2 tables (LCR calc + EWIs), no tabs, no charts

### New Tab Structure

#### Tab 1 — LCR Calculator
*Source: PRD `02-liquidity-risk.md` §2.1*
| Enrichment | Detail |
|---|---|
| Feature text | Add user stories (Treasurer, Liquidity Risk Manager, Compliance Officer), acceptance criteria, calculation formulas (HQLA = L1 + L2A×0.85 + L2B×0.50), validation rules (HQLA must be unencumbered), error handling (if LCR < 100% → immediate alert), audit requirements |
| **Table 2 (new)** | HQLA Composition breakdown: Level 1 (unrestricted), Level 2A (15% haircut), Level 2B (50% haircut), Level 2 Cap applied, with columns for Amount, Haircut, Contribution, Haircut Source |
| **Table 3 (new)** | Cash Outflow by Category: Retail Stable (5%), Retail Non-Stable (10%), Operational (25%), Wholesale Unsecured (100%), Wholesale Secured (25%), total inflows capped at 75% of outflows |
| **Chart 1 (new)** | LCR Waterfall: HQLA → Inflows → Outflows → Net Outflows → LCR% |
| **Chart 2 (new)** | LCR Trend: 30-day sparkline with threshold line at 100% (red), internal target at 120% (amber), green zone |

#### Tab 2 — NSFR Monitor
*Source: PRD `02-liquidity-risk.md` §2.2*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (NSFR decomposition, forward projection), acceptance criteria (ASF/RSF factors per BoG), business rules, validation (NSFR ≥ 100%, internal target ≥ 110%) |
| **Table 2 (new)** | ASF Components breakdown: CET1 (100%), Preferred Shares (100%), Stable Retail (95%), Less Stable Retail (90%), Wholesale (50%), Operational (50%), Other (0%) |
| **Table 3 (new)** | RSF Components breakdown: Cash (0%), Level 1 Unencumbered (5%), Level 2 Unencumbered (15%), Residential Loans (65%), Corporate Loans (85%), Financial Institution Loans (100%), Fixed Assets (100%), Off-Balance-Sheet with CCF |
| **Chart 1 (new)** | ASF vs RSF Bar Chart (side-by-side per category) |
| **Chart 2 (new)** | Forward Projection Line Chart: 6-month NSFR under Base, Stress, Custom scenarios |

#### Tab 3 — Liquidity Stress Testing
*Source: PRD `02-liquidity-risk.md` §2.3*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (simulate bank-run, stress compare, survival horizon), acceptance criteria (3 standard + custom scenarios, idiosyncratic/market-wide/combined, survival horizon calc), business rules with formulas, validation (severe must include 50% wholesale run-off) |
| **Table 2 (new)** | Scenario Parameters: Retail run-off multiplier, Wholesale run-off multiplier, HQLA haircut add, Inflow reduction, for Mild/Moderate/Severe/Custom |
| **Table 3 (new)** | Results Comparison: Base vs Stressed for LCR, NSFR, Survival horizon, HQLA, Net Outflows, with Change and Status columns |
| **Chart 1 (new)** | Liquidity Gap Under Stress: bar chart per time bucket (O/N, 1W, 1M, 3M, 6M, 1Y, >1Y) |
| **Chart 2 (new)** | LCR Decay Over Time: line chart showing LCR declining daily until it hits 100% (survival horizon) |

#### Tab 4 — CFP Trigger Dashboard
*Source: PRD `02-liquidity-risk.md` §2.4*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (EWI monitoring, CFP activation, drill simulation), acceptance criteria (6 EWIs, 4 CFP phases, escalation matrix), business rules (phase determined by red EWI count) |
| **Table 2 (new)** | CFP Action Matrix: Phase 1–4 with description, Trigger conditions, Actions, Escalation, Notification contacts |
| **Table 3 (new)** | CFP Activation Log: Date, Trigger, Decision Maker, Phase activated, Actions taken, Status |
| **Chart 1 (new)** | EWI Radar Chart: 6-axes showing Current vs Threshold for each indicator |
| **Chart 2 (new)** | CFP Phase Timeline: horizontal bar chart showing duration in each phase historically |

#### Tab 5 — Liquidity Gap Report
*Source: PRD `02-liquidity-risk.md` §2.5*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (behavioral vs contractual view, cumulative surplus), acceptance criteria (dual view, configurable buckets, 13-band gap), business rules with formulas (BehavioralGap = Liabilities - Assets, SurplusCarriedForward) |
| **Table 2 (new)** | Behavioral vs Contractual Gap comparison side-by-side for each time bucket |
| **Table 3 (new)** | Cumulative Surplus Carried Forward per bucket with Net Mismatch |
| **Chart 1 (new)** | Gap Ladder Bar Chart (positive/negative bars per bucket) |
| **Chart 2 (new)** | Cumulative Gap Line Chart showing net position across all buckets |

#### Tab 6 — Bank-Run Stress Calculator
*Source: PRD `02-liquidity-risk.md` §2.6*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (bank-run modeling, survival estimation, assumption saving), acceptance criteria, formula reference |
| **Table 2 (new)** | Daily Burn-Down Table: Day, Deposit Outflow, Remaining Liquid Assets, Remaining Deposits, Liquidity Ratio, Breach Flag |
| **Table 3 (new)** | Saved Scenarios: list of named bank-run assumptions with parameters |
| **Chart 1 (new)** | Remaining Assets vs Deposits line chart over N days |
| **Chart 2 (new)** | Liquidity Ratio Trend line chart with breach threshold |

#### Users & Roles section
*Source: PRD `02-liquidity-risk.md` §1.2*
Add table: Treasurer, Liquidity Risk Manager, ALCO Member, Compliance Officer, Business Unit Head, Board Secretary — with responsibilities mapped to each tab.

---

## Module 2: Capital Management (Tab Expansion)

**Current:** 1 table (capital stack), no tabs, no charts

### New Tab Structure

#### Tab 1 — Capital Ratio Dashboard
*Source: PRD `04-capital-management.md` §2.1*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (CRO, Capital Manager, ALCO Member, Compliance Officer), acceptance criteria (4 ratios, buffer headroom, combined buffer, BoG minimums), business rules (CET1 = CET1/RWA, Buffer = Actual - Min - Combined), validation (CET1 ≥ 4.5%, Leverage ≥ 3%) |
| **Table 2 (new)** | Buffer Headroom Detail: CET1 Min (4.5%), Capital Conservation (2.5%), D-SIB Surcharge, CCyB, Pillar 2A, Pillar 2B — with Required, Actual, Headroom, Status |
| **Table 3 (new)** | Capital Consumption by Business Unit: BU name, RWA, Capital Allocated, ROE, Status |
| **Chart 1 (new)** | Capital Stack Bar Chart: CET1, AT1, T2, Buffers with combined buffer overlay |
| **Chart 2 (new)** | 12-Month Capital Trend Line Chart: CET1, T1, TC, Leverage over time |

#### Tab 2 — RWA Calculator
*Source: PRD `04-capital-management.md` §2.2*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (Capital Manager, Model Validator, ALCO Member, Compliance), acceptance criteria (SA credit/market/op risk, BoG risk weights, CCF, off-balance-sheet items), business rules with Python pseudocode |
| **Table 2 (new)** | RWA by Risk Type: Credit SA, Market SA, Operational Risk BIA/TSA/ASA, CVA — with Amount, Risk Weight, RWA, % of Total |
| **Table 3 (new)** | Credit RWA by Exposure Class: GoG (0%), Domestic Banks (20–50%), Corporates (20–150%), Retail (75%), SME (75%), Past Due (100–150%), Off-Balance-Sheet with CCF — per BoG Capital Adequacy Framework |
| **Chart 1 (new)** | RWA Composition Donut Chart by risk type |
| **Chart 2 (new)** | Credit RWA by Exposure Class Horizontal Bar Chart |

#### Tab 3 — ICAAP Stress Testing & Capital Planning
*Source: PRD `04-capital-management.md` §2.3*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (CRO, Capital Manager, ALCO, Board Risk Committee), acceptance criteria (Pillar 1/2A/2B, 5 add-ons, 3-year projection, Ghana-specific scenarios), business rules (projection formula, IRRBB add-on calc, concentration add-on) |
| **Table 2 (new)** | Pillar 2 Breakdown: IRRBB add-on, Concentration risk, Liquidity risk, Operational risk, Strategic/Reputational — with Amount, % of RWA, Calculation Method |
| **Table 3 (new)** | 3-Year Capital Projection: Y1–Y3 for CET1, T1, TC, Leverage under Base, Adverse, Severely Adverse |
| **Chart 1 (new)** | Capital Requirement Waterfall: Pillar 1 → Conservation → D-SIB → CCyB → P2A → P2B → Total Requirement |
| **Chart 2 (new)** | Stress Impact Bar Chart: Base vs Adverse vs Severely Adverse for CET1, RWA, NII, Credit Loss |

#### Tab 4 — Capital Instrument & Issuance Tracker
*Source: PRD `04-capital-management.md` §2.4*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (Treasurer, Capital Manager, CRO, Compliance Officer), acceptance criteria (instrument register, eligibility check, maturity profile, cost of capital, issuance planning) |
| **Table 2 (new)** | Instrument Register: Type, Amount, Coupon, Issuance Date, Maturity/Call, Eligibility status, BoG criteria check |
| **Table 3 (new)** | Maturity & Call Schedule: Next 5 years with Calls, Maturities, Issuance, Net Change, Cumulative |
| **Chart 1 (new)** | Maturity Profile: bar chart of notional maturing per year |
| **Chart 2 (new)** | Cost of Capital: weighted average coupon by tier with market comparison line |

#### Users & Roles section
*Source: PRD `04-capital-management.md` §1.2*
Add table: CRO, Capital Manager, ALCO Member, Compliance Officer, Model Validator, Treasurer, Board Risk Committee.

---

## Module 3: IRRBB Interest Rate Risk (Tab Expansion)

**Current:** 2 tables (EVE sensitivity + repricing gap), no tabs, no charts

### New Tab Structure

#### Tab 1 — EVE Sensitivity Calculator
*Source: PRD `03-interest-rate-risk.md` §2.1*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (IRRBB Risk Manager, Treasurer, ALCO Member, Compliance Officer), acceptance criteria (6 shocks, 19-bucket slotting, SOT at 15% T1), business rules (PV formula, ΔEVE = EVE_shocked - EVE_base, % of T1 = |ΔEVE| / T1 × 100), SOT alert workflow |
| **Table 2 (new)** | EVE Sensitivity Heatmap Table: rows = GHS, USD, EUR, GBP (material currencies >5%); cols = Parallel Up/Down, Steepener, Flattener, Short Rate Up/Down; cells = ΔEVE as %T1 |
| **Table 3 (new)** | SOT Breach History: Date, Scenario, ΔEVE/ΔT1%, Action Taken, BoG Notified |
| **Chart 1 (new)** | EVE Impact Bar Chart: 6 scenarios with SOT threshold line at 15% of Tier 1 capital |
| **Chart 2 (new)** | EVE Sensitivity Heatmap (visual): currency × scenario with color gradient |

#### Tab 2 — NII Forecasting Engine
*Source: PRD `03-interest-rate-risk.md` §2.2*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (Treasurer, BU Head, ALCO Member), acceptance criteria (12/24/36-month horizon, 4 scenarios, deposit beta, repricing schedule, structural hedging), business rules (NII formula per month, beta backtesting) |
| **Table 2 (new)** | NII by Product: Product, Base/Up/Down NII for Month 12 |
| **Table 3 (new)** | Scenario Comparison Table: Base/Upside/Downside/Custom for each forecast month |
| **Chart 1 (new)** | NII Forecast Line Chart: 3 scenarios over 12 months with confidence band |
| **Chart 2 (new)** | NII by Product Stacked Bar Chart for selected month |

#### Tab 3 — Repricing Gap Analysis
*Source: PRD `03-interest-rate-risk.md` §2.3*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (IRRBB Risk Manager, Treasurer, ALCO, Compliance Officer), acceptance criteria (19 standardised buckets per BoG, NMD split, cumulative gap, basis risk, yield-curve risk), business rules (gap per bucket, cumulative gap, standardisation categorisation: amenable/less amenable/not amenable) |
| **Table 2 (new)** | Standardisation Categorisation: Amenable, Less Amenable, Not Amenable with Assets, Liabilities, % of Total |
| **Table 3 (new)** | Basis Risk Summary: gap by reference rate index (GRR, 91d T-Bill, interbank, etc.) |
| **Chart 1 (new)** | Cumulative Gap Line Chart through all 19 buckets |
| **Chart 2 (new)** | Gap Distribution by Standardisation Category Pie Chart |

#### Tab 4 — Derivative Hedging Portfolio Tracker
*Source: PRD `03-interest-rate-risk.md` §2.4*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (Treasurer, IRRBB Risk Manager, ALCO Member), acceptance criteria (portfolio summary, instrument breakdown, hedge effectiveness, counterparty exposure), business rules (dollar offset method, DV01, MTM for IRS/cap) |
| **Table 2 (new)** | Instrument Breakdown: Type (IRS Pay/Rec, Cap, Floor, Swaption), Notional, Fixed Rate, Maturity, MTM |
| **Table 3 (new)** | Counterparty Exposure: Counterparty, MTM, CSA Threshold, Net Exposure, Limit, Utilization |
| **Chart 1 (new)** | Maturity Profile: Notional per year bar chart |
| **Chart 2 (new)** | Hedge Effectiveness Trend line chart vs 80% threshold |

#### Tab 5 — Duration Gap / DGAP Workbench
*Source: PRD `03-interest-rate-risk.md` §2.5*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (IRRBB Risk Manager, Treasurer, ALCO Member), acceptance criteria (Macaulay duration, Modified duration, DGAP, ΔEVE, price sensitivity, persona tabs), business rules (DGAP = D_A - k·D_L, ΔEVE = -DGAP·MV_A·(Δy/(1+y))) |
| **Table 2 (new)** | Duration Analysis: Instrument/Portfolio, Macaulay Duration, Modified Duration, Convexity, DV01 |
| **Table 3 (new)** | Scenario Impact: Parallel ±100/200/300bps, Steepener, Flattener — with ΔEVE, ΔNII, ΔDGAP |
| **Chart 1 (new)** | Duration Gap Trend over time with risk limit overlay |
| **Chart 2 (new)** | Price Sensitivity Curve: ΔP/P vs Δy with convexity adjustment |

#### Users & Roles section
*Source: PRD `03-interest-rate-risk.md` §1.2*
Add table: Treasurer, IRRBB Risk Manager, ALCO Member, Model Validator, Business Unit Head, Compliance Officer.

---

## Module 4: ECL / Credit Risk (Tab Expansion)

**Current:** 1 table (ECL by stage), no tabs, no charts

### New Tab Structure

#### Tab 1 — ECL Calculator (Three-Stage Model)
*Source: PRD `05-ecl.md` §2.1*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (Credit Risk Manager, Finance, ALCO, Compliance Officer), acceptance criteria (ECL = PD×LGD×EAD, 3 stages + POCI, scenario weights), business rules with formulas, Ghana-specific sectoral adjustments (agriculture drought risk, mining commodity price, trade FX) |
| **Table 2 (new)** | Portfolio Breakdown: Segment (Mortgages, Corporate, SME, Consumer, Agriculture), Exposure, by Stage, Total ECL |
| **Table 3 (new)** | Scenario-Weighted ECL: Base (50%), Upside (20%), Downside (20%), Severe (10%) — with Weighted Average ECL |
| **Chart 1 (new)** | ECL by Stage Donut Chart with Coverage Ratio annotation |
| **Chart 2 (new)** | Portfolio ECL by Segment Stacked Bar Chart |

#### Tab 2 — Macroeconomic Scenario Manager
*Source: PRD `05-ecl.md` §2.2*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (Credit Risk Manager, Model Validator, ALCO Member), acceptance criteria (4 scenarios, Ghana-specific variables: GDP, inflation, BoG policy rate, GHS/USD, GoT-bill, commodity prices), scenario weights, consistency checks |
| **Table 2 (new)** | Scenario Variables Table: rows = GDP Growth, Inflation, BoG Policy Rate, GHS/USD, GoT-Bill Yield, Cocoa Price, Gold Price, Oil Price; cols = Base/Upside/Downside/Severe with Year-1 values |
| **Table 3 (new)** | ECL Sensitivity: ±1pp change impact for each variable on total ECL |
| **Chart 1 (new)** | Variable Comparison Line Chart: Base vs Downside vs Severe over 3-year horizon |
| **Chart 2 (new)** | ECL Sensitivity Tornado Chart: variables ranked by impact magnitude |

#### Tab 3 — SICR Monitoring & Stage Migration
*Source: PRD `05-ecl.md` (implicit from §2.1 SICR section)*
| Enrichment | Detail |
|---|---|
| Feature text | SICR triggers (PD deterioration 3x, 30+ DPD, forbearance, watch list, rating downgrade ≥3 notches), user stories, acceptance criteria |
| **Table 2 (new)** | SICR Trigger Log: Date, Instrument ID, Trigger Type, Old Stage, New Stage, ECL Impact |
| **Table 3 (new)** | Stage Migration Matrix: from Stage X to Stage Y, count and exposure |
| **Chart 1 (new)** | Stage Migration Sankey/Flow Diagram |
| **Chart 2 (new)** | SICR Trend: new triggers per month line chart |

#### Tab 4 — Overlay Governance & PMA Tracking
*Source: PRD `05-ecl.md` §2.3 (expected from overlay section)*
| Enrichment | Detail |
|---|---|
| Feature text | PMA (Post-Model Adjustment) governance, approval workflow, backtesting, user stories |
| **Table 2 (new)** | PMA Register: Portfolio, Adjustment Type, Amount, Rationale, Approver, Effective Date, Expiry |
| **Table 3 (new)** | Overlay Backtesting: PMA vs Actual outcomes, variance, status |
| **Chart 1 (new)** | Overlay Impact Bar Chart: by portfolio and adjustment type |
| **Chart 2 (new)** | Backtesting Accuracy: predicted vs actual line chart |

#### Users & Roles section
*Source: PRD `05-ecl.md` §1.2*
Add table: Credit Risk Manager, Finance/Accounting, Model Validator, ALCO Member, External Auditor, Compliance Officer.

---

## Module 5: FTP & Pricing (Tab Expansion)

**Current:** 1 table (FTP curves), no tabs, no charts

### New Tab Structure

#### Tab 1 — FTP Curve Construction & Management
*Source: PRD `06-ftp.md` §2.1*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (Treasurer, BU Head, ALCO Member), acceptance criteria (GRR, GoG T-Bill curve, BoG policy rate, interbank rate, multi-currency), business rules (GHS curve formula: GRR + tenor_premium + bank_credit_spread + liquidity_premium, cross-currency for USD/EUR/GBP) |
| **Table 2 (new)** | GHS FTP Curve Table: Tenor (O/N, 1W, 1M, 3M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 15Y, 20Y), ITP Rate, LTP Rate, Credit Spread, Total FTP |
| **Table 3 (new)** | Multi-Currency Curve Table: GHS, USD, EUR, GBP rates by key tenor with cross-currency basis spread |
| **Chart 1 (new)** | GHS FTP Curve Line Chart: Today vs Last Week vs Last Month |
| **Chart 2 (new)** | Multi-Currency Curve Comparison Line Chart |

#### Tab 2 — Deal-Level FTP Pricing Engine
*Source: PRD `06-ftp.md` §2.2*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (Product Manager, BU Head, Treasurer), acceptance criteria (deal inputs, FTP lookup, margin, ROE/RAROC, what-if, exception flagging), business rules |
| **Table 2 (new)** | Pricing Decomposition: Customer Rate, -FTP Rate, -Credit Margin, -Operational Cost, -Regulatory Cost, = Net Margin, ROE, RAROC |
| **Table 3 (new)** | Portfolio Profitability: Product, Segment, Total Notional, Avg Margin, ROE, RAROC, Exception Flag |
| **Chart 1 (new)** | Margin Waterfall Chart: from Customer Rate to Net Margin |
| **Chart 2 (new)** | ROE vs RAROC Scatter Plot by portfolio segment |

#### Tab 3 — NMD Behavioural Model
*Source: PRD `06-ftp.md` §2.3 + PRD `11-behavioural-model-library.md`*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (Model Developer, Model Validator, Treasurer), acceptance criteria (NMD categories, core ratio estimation, BoG caps: 70% retail, 50% SME, 30% corporate, avg maturity cap: 4yr retail, 2yr SME), business rules (core ratio regression, replicating portfolio allocation), backtesting MAPE < 10% |
| **Table 2 (new)** | Core Allocation by Tenor: % Weight, FTP Rate, Contribution, BoG Limit, Status for each replicating portfolio bucket |
| **Table 3 (new)** | Backtesting Results: 12-month Predicted Core vs Actual Core, Error %, Status |
| **Chart 1 (new)** | Replicating Portfolio Allocation Stacked Bar Chart |
| **Chart 2 (new)** | Core Ratio Trend Line Chart with BoG Cap overlay |

#### Users & Roles section
*Source: PRD `06-ftp.md` §1.2*
Add table: Treasurer, BU Head, ALCO Member, Finance Manager, Product Manager, Risk Manager.

---

## Module 6: Balance Sheet Optimization (Tab Expansion)

**Current:** 1 table (NIM attribution), no tabs, no charts

### New Tab Structure

#### Tab 1 — Balance Sheet Simulator
*Source: PRD `07-balance-sheet-optimization.md` §2.1*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (Strategic Planning Manager, Treasurer, ALCO, CRO), acceptance criteria (5 scenarios, adjustable parameters, output metrics, recovery trigger integration, Ghana-specific macro variables), business rules |
| **Table 2 (new)** | Key Metrics Comparison: Base vs Recovery vs Aggressive vs Defensive for LCR, NSFR, CET1, Leverage, EVE Impact, NII, ROE at Year 3 |
| **Table 3 (new)** | Recovery Trigger Monitoring: Trigger (CET1 < 7%, LCR < 100%, etc.), Threshold, Projected value, Status |
| **Chart 1 (new)** | Key Metrics Comparison Radar Chart across scenarios |
| **Chart 2 (new)** | Balance Sheet Evolution: Assets/Liabilities/Equity stacked area chart over projection horizon |

#### Tab 2 — NIM Attribution & Decomposition
*Source: PRD `07-balance-sheet-optimization.md` §2.2*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (CFO, Business Unit Head, ALCO Member), acceptance criteria (NIM by product/BU/currency, volume vs rate effect, trend analysis), business rules (NIM = (II - IE) / Avg Earning Assets) |
| **Table 2 (new)** | Volume vs Rate Effect: Product, Volume Change, Rate Change, Mix Effect, Total NIM Change |
| **Table 3 (new)** | NIM by Currency: GHS, USD, EUR, GBP with Earning Assets, NII, NIM, Trend |
| **Chart 1 (new)** | NIM Waterfall Chart: Volume, Rate, Mix components |
| **Chart 2 (new)** | ROE Decomposition: NIM × Leverage × Efficiency ratio tree chart |

#### Tab 3 — What-If Hedging Simulator
*Source: PRD `07-balance-sheet-optimization.md` §2.3*
| Enrichment | Detail |
|---|---|
| Feature text | User stories (Treasurer, ALCO Member, Risk Manager), acceptance criteria (hedge ratio simulation, IRS coverage, impact on DGAP/EVE/NII, cost-benefit analysis) |
| **Table 2 (new)** | Hedge Scenario Comparison: Current vs 60% vs 80% vs 100% hedge ratio — DGAP, ΔEVE, ΔNII, Hedge Cost |
| **Table 3 (new)** | Cost-Benefit Analysis: Hedge Cost, Risk Reduction (EVE), Net Benefit, Break-Even Period |
| **Chart 1 (new)** | DGAP Impact at different hedge ratios line chart |
| **Chart 2 (new)** | NII Sensitivity by hedge ratio bar chart |

#### Users & Roles section
*Source: PRD `07-balance-sheet-optimization.md` §1.2*
Add table: CFO/Treasurer, ALCO Chair, Strategic Planning Manager, BU Head, Risk Manager, Board Member, CRO, Recovery Planning Officer.

---

## New Modules to Add to bankOS

The following PRD modules have no bankOS page yet but contain full feature specs.

### Module 7 — Data Foundation
*Source: PRD `01-data-foundation.md`*
Tabs:
1. **Data Ingestion Pipeline** — sources table, status matrix, row count validation tables, ingestion timeline chart, feed health chart
2. **Master Data Management** — product catalog table, ALM classification table (Narrow/Broad/N/A, LCR, IRRBB), BoG LMTD mapping chart, encumbrance pie chart
3. **Data Quality Scorecard** — dimension scores table, source quality breakdown table, overall score gauge chart, trend line chart
4. **ALCO Workflow Engine** — meeting schedule table, agenda items table, action item status chart, meeting timeline chart
5. **Audit Trail & Data Lineage** — change log table, lineage trace table, audit activity chart, data freshness chart
6. **ALM Control Tower** — reconciliation table (Matched, Unmapped TB, Unmapped XTEL), tracker checklist, reconciliation variance chart, run status timeline
7. **Instrument Modeling Workbench** — deal attributes table, strategy comparison table, cashflow projection chart, rate scenario comparison chart

### Module 8 — Recovery Planning
*Source: PRD `08-recovery-planning.md`*
Tabs:
1. **Recovery Plan Repository** — version history table, approval workflow status table, submission timeline chart, document status chart
2. **Recovery Options Menu** — recovery options table (name, description, impact, timeline, status), impact quantification table, option cost-benefit chart, implementation timeline chart
3. **Quantitative Indicators & Triggers** — trigger table (indicator, threshold, current, status, trend), breach log table, trigger breaching radar chart, trend line chart
4. **Recovery MIS Dashboard** — executive summary table, KPI cards, trigger breach chart, recovery option readiness chart

### Module 9 — GRC Risk Framework
*Source: PRD `09-grc-risk-framework.md`*
Tabs:
1. **Digitised RMF** — policy sections table, regulatory mapping table, policy status chart, compliance gap bar chart
2. **Risk Universe Register** — risk categories table, risk heatmap table, risk category donut chart, heatmap grid visualization
3. **Risk Appetite Statement** — RAS limits table, limit breach log table, limit utilization gauge chart, breach trend chart
4. **3LoD RBAC** — role assignments table, segregation of duties matrix, role distribution chart, Segregation violations chart
5. **Limit Breach Workflow** — active breaches table, escalation matrix, breach severity pie chart, response time bar chart

### Module 10 — Regulatory Reporting (ORASS)
*Source: PRD `10-regulatory-reporting-orass.md`*
Tabs:
1. **BoG Template Catalogue** — template list table, data source mapping table, template status pie chart, submission timeline chart
2. **Submission Scheduler** — upcoming submissions table, submission history table, deadline compliance gauge chart, submission turnaround chart
3. **ORASS Integration** — submission status table, acknowledgment log, submission success rate chart, API response time chart

### Module 11 — Behavioural Model Library
*Source: PRD `11-behavioural-model-library.md`*
Tabs:
1. **NMD Core Deposit Modeler** — core allocation by tenor table, backtesting results table, replicating portfolio chart, core ratio trend chart
2. **CPR Modeler** — CPR by product table, prepayment history table, CPR trend chart, backtesting accuracy chart
3. **TDRR Modeler** — TDRR by product/tenor table, redemption history table, TDRR trend chart, seasonal pattern chart

### Module 12 — RTGS Intraday Liquidity
*Source: PRD `13-rtgs-intraday-liquidity.md`*
Tabs:
1. **RTGS Feed Monitor** — connection status table, recent messages table, feed health chart, message volume chart
2. **Intraday Liquidity Position** — settlement balance table, payment queue table, intraday balance line chart, throughput bar chart
3. **LRMD System Capability** — capability demonstration checklist, compliance status table, system uptime chart, latency trend chart

---

## Implementation Approach

### Phase 1: Tab Framework
1. Install Angular tab component library or build custom tab component
2. Wrap each module page content into tab containers
3. Create tab navigation with the 4–6 tab labels per module

### Phase 2: Feature Content
1. Extract feature description, user stories, acceptance criteria, business rules, validation rules, error handling, audit requirements from PRDs and render as structured text cards
2. Add Users & Roles table to each module as a collapsible info section

### Phase 3: Additional Tables
1. For each tab, implement the 2 additional data tables listed above
2. Tables should have: appropriate columns, numeric formatting, status badges (green/amber/red), and hover states

### Phase 4: Charts & Graphs
1. Integrate a charting library (Chart.js, D3.js, or Angular-native)
2. For each tab, implement the 2 charts listed above
3. Chart types needed: Line, Bar, Stacked Bar, Donut/Pie, Radar, Waterfall, Heatmap, Tornado, Scatter, Area, Gauge

### Phase 5: New Module Pages
1. Add Angular routes, components, and sidebar navigation for Modules 7–12
2. Implement each with the same tab pattern from Phases 1–4

---

## Data Source Mapping

Each table and chart should be backed by:
- Currently: static mock data (as existing bankOS pages do)
- Future: Supabase or API service calls

The static mock data values should be drawn from the PRD examples (e.g., LCR: 136.2%, HQLA: €2.1bn, NSFR: 123.6%, CET1: 14.8%).

---

## Summary Count

| Module | Current Tables | Current Charts | Target Tabs | Target Tables | Target Charts |
|---|---|---|---|---|---|
| Liquidity Risk | 2 | 0 | 6 | 18 | 12 |
| Capital Management | 1 | 0 | 4 | 12 | 8 |
| IRRBB | 2 | 0 | 5 | 15 | 10 |
| ECL | 1 | 0 | 4 | 12 | 8 |
| FTP | 1 | 0 | 3 | 9 | 6 |
| Optimization | 1 | 0 | 3 | 9 | 6 |
| Data Foundation | 0 | 0 | 7 | 21 | 14 |
| Recovery Planning | 0 | 0 | 4 | 12 | 8 |
| GRC Risk Framework | 0 | 0 | 5 | 15 | 10 |
| Regulatory Reporting | 0 | 0 | 3 | 9 | 6 |
| Behavioural Models | 0 | 0 | 3 | 9 | 6 |
| RTGS Intraday | 0 | 0 | 3 | 9 | 6 |
| **Total** | **8** | **0** | **50** | **150** | **100** |

*This plan will be shared on Telegram for approval before implementation begins.*
