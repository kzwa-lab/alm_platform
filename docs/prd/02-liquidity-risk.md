# PRD: Liquidity Risk Management (LCR/NSFR / BoG LMTD / LRMD)

## 1. Overview

### 1.1 Purpose

The Liquidity Risk Management module enables the bank to calculate, monitor, and stress-test its liquidity position under both the Basel III LCR/NSFR framework and the Bank of Ghana 2026 Liquidity Monitoring Tools Directive (LMTD) and Liquidity Risk Management Directive (LRMD). It provides:

- **BoG LMTD compliance**: Four prudential liquidity ratios on Narrow and Broad liquid-asset bases (eight variants), with distinct commercial bank and SDI thresholds
- **Basel LCR/NSFR**: Real-time Liquidity Coverage Ratio and Net Stable Funding Ratio
- **Contractual maturity mismatch**: 13 prescribed time-band gap analysis with cumulative net mismatch
- **Funding concentration**: Connected-counterparty grouping and concentration metrics
- **Significant-currency LCR**: Per-currency LCR isolation for foreign currencies >5% of business
- **Liquidity stress testing**: Idiosyncratic, market-wide, and combined scenarios
- **Contingency Funding Plan (CFP)**: Trigger dashboard linked to stress-test outcomes
- **ILAAP/LAS support**: Internal Liquidity Adequacy Assessment Process and quarterly Liquidity Adequacy Statements

This module ensures the bank meets its short-term and structural liquidity obligations under both Basel III and the BoG 2026 prudential package.

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **Treasurer** | Monitors LCR/NSFR and BoG ratios daily, reviews stress test results, triggers CFP actions |
| **Liquidity Risk Manager** | Runs all liquidity calculations, validates assumptions, produces regulatory reports |
| **ALCO Member** | Reviews liquidity position at meetings, approves liquidity strategies and CFP |
| **Compliance Officer** | Ensures regulatory reporting accuracy, submits BoG LMTD returns via ORASS, tracks ILAAP |
| **Business Unit Head** | Reviews liquidity costs attributed to their unit via LTP |
| **Board Secretary** | Coordinates quarterly Liquidity Adequacy Statements (LAS) for Board approval |

### 1.3 Dependencies

- **Data Foundation** (`01-data-foundation.md`): GL balances, deposit classifications, securities inventory, contractual maturities, Ghana asset classification (Narrow/Broad), encumbrance register, 13 LMTD bucket engine, RTGS feed
- **Interest Rate Risk** (`03-interest-rate-risk.md`): NMD behavioral assumptions affect LCR outflow rates and NSFR ASF factors
- **Behavioural Model Library** (`11-behavioural-model-library.md`): TDRR assumptions for liquidity stress testing
- **FTP** (`06-ftp.md`): Liquidity Transfer Pricing (LTP) charges flow from LCR/NSFR metrics
- **Capital Management** (`04-capital-management.md`): HQLA holdings affect leverage ratio denominator; ILAAP integrated with ICAAP
- **GRC Risk Framework** (`09-grc-risk-framework.md`): Board-approved risk appetite, limit framework, CRO independence
- **Regulatory Reporting** (`10-regulatory-reporting-orass.md`): BoG LMTD monthly returns, LRMD quarterly LAS

---

## 2. Features

### 2.1 Real-Time LCR Calculator

#### Description
An interactive calculator that computes the Liquidity Coverage Ratio (LCR = HQLA / Net Cash Outflows) with full drill-down from the headline ratio to individual HQLA items and outflow categories. Supports both standard (Pillar 1) and internal stress (Pillar 2) scenarios. Also displays the BoG LMTD prudential ratios for quick reference.

#### User Stories
- **As a Liquidity Risk Manager**, I want to see the current LCR and its components so that I can verify we are above the 100% minimum.
- **As a Treasurer**, I want to simulate the impact of a large wholesale deposit withdrawal on LCR so that I can decide whether to pre-fund.
- **As a Compliance Officer**, I want to export the LCR calculation workbook and the BoG LMTD ratio summary for submission to the regulator so that we meet regulatory deadlines.

#### Acceptance Criteria
- [ ] LCR calculated automatically after daily data ingestion completes
- [ ] HQLA classified into Level 1 (unrestricted), Level 2A (15% haircut), Level 2B (25-50% haircut)
- [ ] Outflows categorized: retail stable (5%), retail non-stable (10%), operational (25%), wholesale unsecured (100%), wholesale secured (25%)
- [ ] Inflows capped at 75% of total outflows per Basel rules
- [ ] Level 2 assets capped at 40% of total HQLA
- [ ] Real-time recalculation when user adjusts inputs in "what-if" mode
- [ ] Traffic light indicator: Green (≥120%), Amber (100-120%), Red (<100%)
- [ ] BoG LMTD prudential ratios displayed alongside LCR: Narrow/Broad ratios for volatile liabilities, short-term liabilities, total assets, and total deposits
- [ ] Bank vs. SDI threshold logic applied automatically based on tenant classification
- [ ] E-money float accounts classified as volatile liabilities per LRMD

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  LCR Calculator                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ LCR: 136.2% │ Status: 🟢 │ Buffer: +36.2pp │ vs Yesterday: -1.5pp│  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐  │
│  │ HQLA Components           │  │ Cash Outflows               │  │
│  │ Level 1: EUR 2.1bn (100%) │  │ Retail Stable: EUR 250M (5%)│  │
│  │ Level 2A: EUR 680M (85%)  │  │ Retail Non-Stable: EUR 100M │  │
│  │ Level 2B: EUR 200M (50%)  │  │ Operational: EUR 125M (25%) │  │
│  │ Total HQLA: EUR 2.84bn    │  │ Wholesale Unsec: EUR 300M   │  │
│  │                           │  │ Wholesale Sec: EUR 50M (25%)│  │
│  │ [Level 2 Cap Applied]     │  │ Total Outflows: EUR 825M    │  │
│  └──────────────────────────┘  └──────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ LCR Waterfall Chart                                          │  │
│  │ HQLA ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  │
│  │ - Outflows ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  │
│  │ + Inflows ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  │
│  │ = Net Outflows ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  │
│  │ LCR = 136.2%                                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [What-If Mode] [Export to Excel] [View Regulatory Template]     │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Frequency |
|-------|--------|-----------|
| Cash and central bank reserves | GL | Daily EOD |
| Government bonds (Level 1) | Securities inventory | Daily EOD |
| Covered bonds, agencies (Level 2A) | Securities inventory | Daily EOD |
| Corporate bonds, equities (Level 2B) | Securities inventory | Daily EOD |
| Retail deposits by type | Deposit system | Daily EOD |
| Wholesale funding by type | GL / Treasury | Daily EOD |
| Operational deposits | Deposit system (tagged) | Daily EOD |
| Committed inflows | Loan system | Daily EOD |
| Reverse repos (open) | Treasury | Daily EOD |

#### Calculation Logic / Business Rules
```
HQLA = Level_1 + Level_2A × 0.85 + Level_2B × 0.50
Level_2_Cap = Level_1 × (0.40 / 0.60)
If (Level_2A × 0.85 + Level_2B × 0.50) > Level_2_Cap:
    HQLA = Level_1 + Level_2_Cap

Total_Outflows = 
    Retail_Stable × 0.05 +
    Retail_NonStable × 0.10 +
    Operational × 0.25 +
    Wholesale_Unsecured × 1.00 +
    Wholesale_Secured × 0.25

Total_Inflows = Retail_Inflows + Wholesale_Inflows
Inflow_Cap = Total_Outflows × 0.75
Effective_Inflows = min(Total_Inflows, Inflow_Cap)

Net_Cash_Outflows = Total_Outflows - Effective_Inflows
LCR = (HQLA / Net_Cash_Outflows) × 100
```

#### Validation Rules
- LCR must be ≥ 100% (regulatory minimum)
- Internal target: LCR ≥ 120% (bank-specific buffer)
- HQLA must be "unencumbered" (not pledged as collateral)
- Level 2B assets must be ≤ 15% of total HQLA
- Operational deposit classification requires documented service relationship
- Retail term deposits excluded from outflows must have material early redemption penalty

#### Error Handling
- If HQLA classification missing for any security → default to "unclassified" (excluded from HQLA), alert Risk Manager
- If deposit type mapping ambiguous → default to most conservative (non-stable), alert Data Engineering
- If LCR < 100% → immediate alert to Treasurer and CRO, trigger CFP review
- If LCR < 120% (internal threshold) → amber alert, include in ALCO agenda

#### Audit & Compliance Requirements
- LCR calculation methodology documented and approved by supervisor (EBA/PRA)
- Daily LCR values stored for 7 years
- Monthly LCR report submitted to supervisor within 15 business days of month-end
- EBA LCR monitoring template format used for regulatory submission

---

### 2.2 NSFR Monitor with Forward Projection

#### Description
A monitoring tool for the Net Stable Funding Ratio (NSFR = Available Stable Funding / Required Stable Funding) with decomposition into ASF and RSF components, forward projection capabilities, and trend analysis.

#### User Stories
- **As a Liquidity Risk Manager**, I want to see the NSFR and its ASF/RSF breakdown so that I can verify structural funding stability.
- **As a Treasurer**, I want to project NSFR 6 months forward under different funding scenarios so that I can plan wholesale issuance.
- **As an ALCO Member**, I want to see NSFR trends alongside LCR trends so that I can assess both short-term and structural liquidity.

#### Acceptance Criteria
- [ ] NSFR calculated daily with ASF/RSF decomposition by category
- [ ] ASF factors: CET1 (100%), preferred shares (100%), stable retail (95%), less stable retail (90%), wholesale (50%), operational (50%)
- [ ] RSF factors: Cash (0%), Level 1 unencumbered (5%), Level 2 unencumbered (15%), residential loans (65%), corporate loans (85%), financial institution loans (100%), fixed assets (100%)
- [ ] Forward projection: 3, 6, 12 months based on balance sheet growth assumptions
- [ ] Trend chart: NSFR history over last 12 months
- [ ] Traffic light: Green (≥100%), Amber (100-110%), Red (<100%)

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  NSFR Monitor                                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ NSFR: 123.6% │ Status: 🟢 │ ASF: EUR 4.2bn │ RSF: EUR 3.4bn │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ASF vs RSF Bar Chart                                        │  │
│  │ ASF ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  │
│  │ RSF ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐│
│  │ ASF Components            │  │ RSF Components              ││
│  │ CET1 + AT1: EUR 550M (100%)│  │ Cash: EUR 500M (0%)         ││
│  │ Stable Retail: EUR 2.9bn  │  │ Level 1: EUR 1.0bn (5%)     ││
│  │   (95%)                   │  │ Level 2: EUR 300M (15%)     ││
│  │ Less Stable: EUR 500M (90%)│  │ Residential: EUR 2.0bn (65%)││
│  │ Wholesale: EUR 1.0bn (50%)  │  │ Corporate: EUR 1.5bn (85%)  ││
│  │ Operational: EUR 200M (50%) │  │ Financial: EUR 200M (100%)  ││
│  │ Other: EUR 50M (0%)       │  │ Fixed Assets: EUR 100M (100%)││
│  │ Total ASF: EUR 4.2bn      │  │ Total RSF: EUR 3.4bn      ││
│  └──────────────────────────┘  └──────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Forward Projection (6 Months)                             │  │
│  │ [Base Case] [Stress Case] [Custom]                         │  │
│  │ Month 1: 123.6% │ Month 3: 121.2% │ Month 6: 118.5%         │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
Same as LCR plus:
- Equity capital components from capital management module
- Loan portfolio detail (residential vs. corporate vs. financial)
- Fixed assets from GL
- Off-balance-sheet commitments (letters of credit, guarantees) with CCF

#### Calculation Logic / Business Rules
```
ASF = 
    CET1 × 1.00 +
    Preferred × 1.00 +
    Stable_Retail × 0.95 +
    Less_Stable_Retail × 0.90 +
    Wholesale × 0.50 +
    Operational × 0.50 +
    Other_Liabilities × 0.00

RSF = 
    Cash × 0.00 +
    Unencumbered_Level_1 × 0.05 +
    Unencumbered_Level_2 × 0.15 +
    Residential_Loans × 0.65 +
    Corporate_Loans × 0.85 +
    Financial_Institution_Loans × 1.00 +
    Fixed_Assets × 1.00 +
    Off_Balance_Sheet × CCF × RSF_Factor

NSFR = (ASF / RSF) × 100
```

#### Validation Rules
- NSFR must be ≥ 100% (regulatory minimum, effective since June 2021)
- Internal target: NSFR ≥ 110%
- ASF must not include liabilities with maturity < 6 months (except regulatory exceptions)
- RSF for off-balance-sheet items must use correct CCF (10% for UCCs under CRR3)
- Interdependent assets/liabilities (pass-through) must be excluded per EBA guidance

#### Error Handling
- If NSFR < 100% → immediate alert, trigger structural funding review
- If NSFR < 110% (internal) → amber alert, include in ALCO agenda
- If forward projection shows NSFR < 100% within 6 months → early warning, trigger funding plan review

#### Audit & Compliance Requirements
- NSFR calculation methodology documented and approved by supervisor
- Monthly NSFR values stored for 7 years
- Quarterly NSFR report submitted to supervisor
- EBA NSFR monitoring template format used

---

### 2.3 Liquidity Stress Testing Engine

#### Description
A scenario-based stress testing tool that simulates the impact of liquidity shocks on LCR and NSFR. Covers idiosyncratic (bank-specific), market-wide (systemic), and combined stress scenarios. Results inform the Contingency Funding Plan (CFP).

#### User Stories
- **As a Liquidity Risk Manager**, I want to run a combined stress test so that I can see how quickly LCR would fall below 100% under a severe scenario.
- **As a Treasurer**, I want to compare stress results across different wholesale funding reliance levels so that I can optimize the funding mix.
- **As a CRO**, I want to see the survival horizon under each scenario so that I can report to the Board on liquidity resilience.

#### Acceptance Criteria
- [ ] Three standard scenarios: Mild, Moderate, Severe
- [ ] Idiosyncratic stress: rating downgrade, large depositor withdrawal, counterparty default
- [ ] Market-wide stress: systemic freeze, sovereign crisis, repo market disruption
- [ ] Combined stress: both idiosyncratic and market-wide simultaneously
- [ ] Custom scenario builder: user-defined shock parameters
- [ ] Survival horizon: number of days until LCR reaches 100% (or 0%)
- [ ] Before/after comparison tables for LCR, NSFR, and liquidity gap
- [ ] Stress test results stored and reported to ALCO quarterly

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Liquidity Stress Testing                                         │
│  Scenario: [Mild ▼] [Moderate ▼] [Severe ▼] [Custom]          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Stress Parameters (Moderate)                                │  │
│  │ Retail run-off: 2.5x        │ Wholesale run-off: 2.0x     │  │
│  │ HQLA haircut add: 10%       │ Inflow reduction: 50%        │  │
│  │ [▶ Run Stress Test]                                         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Results Comparison                                          │  │
│  │ Metric        │ Base    │ Stressed │ Change   │ Status   │  │
│  │ LCR           │ 136.2%  │ 108.4%   │ -27.8pp  │ 🟡       │  │
│  │ NSFR          │ 123.6%  │ 115.2%   │ -8.4pp   │ 🟢       │  │
│  │ Survival      │ N/A     │ 18 days  │ —        │ 🟡       │  │
│  │ HQLA          │ EUR 2.84bn│ EUR 2.56bn│ -280M  │ —        │  │
│  │ Net Outflows  │ EUR 2.08bn│ EUR 3.12bn│ +1.04bn│ —        │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Liquidity Gap Under Stress (Time Buckets)                   │  │
│  │ [Bar chart: Cumulative gap per time bucket]                │  │
│  │ O/N │ 1W │ 1M │ 3M │ 6M │ 1Y │ >1Y                        │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Save Scenario] [Export Results] [Add to CFP]                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- All LCR and NSFR inputs (base case)
- Stress parameters (multipliers, haircuts, reductions)
- Historical deposit run-off data during stress periods
- Collateral availability and haircut assumptions under stress

#### Calculation Logic / Business Rules
```python
# Stress multipliers applied to outflows
stressed_retail_runoff = base_retail_stable × retail_runoff_mult × 0.05
stressed_wholesale_runoff = base_wholesale_unsecured × wholesale_runoff_mult × 1.00

# HQLA haircut increase
stressed_hqla = base_hqla × (1 - hqla_haircut_add)

# Inflow reduction
stressed_inflows = base_inflows × inflow_reduction_pct

# Recalculate LCR and NSFR with stressed values
stressed_lcr = (stressed_hqla / stressed_net_outflows) × 100
stressed_nsfr = (stressed_asf / stressed_rsf) × 100

# Survival horizon: days until LCR reaches 100% (linear interpolation)
survival_days = (base_lcr - 100) / (base_lcr - stressed_lcr) × 30
```

#### Validation Rules
- Stress parameters must be calibrated to historical stress periods (e.g., March 2020, March 2023)
- Severe scenario must include at least 50% wholesale funding run-off
- Mild scenario must not result in LCR < 100% (otherwise it's not "mild")
- All stress tests must be reviewed and approved by ALCO annually
- Combined scenario must be more severe than either idiosyncratic or market-wide alone

#### Error Handling
- If survival horizon < 30 days under moderate stress → amber alert, review funding plan
- If survival horizon < 7 days under severe stress → red alert, trigger emergency CFP activation
- If stress results differ by > 20% from previous quarter → validate assumptions, investigate changes

#### Audit & Compliance Requirements
- Stress test results reported to ALCO quarterly and to Board annually
- Scenario documentation reviewed by supervisor during SREP
- Sensitivity analysis (reverse stress testing) performed annually
- All stress test parameters and results stored for 7 years

---

### 2.4 Contingency Funding Plan (CFP) Trigger Dashboard

#### Description
A real-time dashboard that monitors early warning indicators (EWIs) and triggers CFP activation when predefined thresholds are breached. Displays actionable steps for each CFP phase.

#### User Stories
- **As a Treasurer**, I want to see which EWIs are currently triggered so that I can decide whether to activate CFP Phase 1.
- **As a CRO**, I want to see the complete CFP action matrix so that I can brief the Board during a crisis.
- **As a Liquidity Risk Manager**, I want to run a CFP simulation so that I can test the plan's effectiveness.

#### Acceptance Criteria
- [ ] EWIs monitored: LCR trend, wholesale funding concentration, deposit outflows, credit rating, collateral availability, market spreads
- [ ] CFP phases: Phase 1 (Monitoring), Phase 2 (Restricted), Phase 3 (Emergency), Phase 4 (Recovery)
- [ ] Each phase has predefined actions: asset sales, central bank borrowing, wholesale issuance, deposit rate increases, balance sheet contraction
- [ ] Escalation matrix: who to notify at each phase (Treasurer → CRO → CEO → Board)
- [ ] CFP activation logged with timestamp, trigger, decision maker, actions taken
- [ ] Annual CFP test documented with lessons learned

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  CFP Trigger Dashboard                                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ CFP Status: 🟢 NORMAL (Phase 0)                              │  │
│  │ Last Updated: 2026-06-25 08:45 CET                         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Early Warning Indicators (EWIs)                            │  │
│  │ EWI                          │ Current │ Threshold │ Status │  │
│  │ LCR 30-day trend             │ -1.5pp  │ -5pp      │ 🟢     │  │
│  │ Wholesale funding conc.      │ 28%     │ 35%       │ 🟢     │  │
│  │ Daily deposit outflows       │ EUR 5M  │ EUR 50M   │ 🟢     │  │
│  │ Credit rating (Fitch)        │ A       │ BBB       │ 🟢     │  │
│  │ Collateral available         │ EUR 1.2bn│ EUR 500M │ 🟢     │  │
│  │ 5Y CDS spread                │ 85bps   │ 200bps    │ 🟢     │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ CFP Action Matrix                                          │  │
│  │ Phase 1 (Monitoring): Increase liquidity reporting freq    │  │
│  │ Phase 2 (Restricted): Activate standby credit lines      │  │
│  │ Phase 3 (Emergency): Asset sales + central bank borrowing │  │
│  │ Phase 4 (Recovery): Balance sheet restructuring          │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Activate Phase 1] [Run CFP Drill] [View Full Plan]           │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- LCR/NSFR daily values
- Funding concentration by source
- Deposit flow data (daily net flows)
- Credit ratings from external agencies
- Collateral inventory (unencumbered assets)
- Market indicators: CDS spreads, repo rates, interbank spreads

#### Calculation Logic / Business Rules
- Each EWI has a green threshold (normal), amber threshold (watch), and red threshold (action)
- CFP phase determined by number of red EWIs and severity:
  - 1-2 amber EWIs: Phase 1 (increased monitoring)
  - 1 red EWI or 3+ amber: Phase 2 (restricted operations)
  - 2+ red EWIs: Phase 3 (emergency measures)
  - Recovery of all EWIs to green for 30 days: Phase 4 (recovery)

#### Validation Rules
- CFP must be reviewed and approved by ALCO annually
- All CFP actions must be tested at least once per year (tabletop exercise)
- CFP activation must be documented within 1 hour of decision
- All CFP-related communications must be retained for 7 years

#### Error Handling
- If EWI data missing > 2 hours → assume worst-case (red) until data restored
- If CFP activation fails to notify key personnel → escalate to backup contacts
- If CFP action (e.g., standby credit line) unavailable → trigger alternative action

#### Audit & Compliance Requirements
- EBA Guidelines on liquidity stress testing and CFP (EBA/GL/2020/04)
- Annual CFP test reported to supervisor
- CFP activation log subject to internal audit review
- Board reviews CFP effectiveness annually

---

### 2.5 Liquidity Gap Report

#### Description
A time-bucketed liquidity gap analysis showing the mismatch between assets and liabilities across configurable maturity bands. Provides both a behavioral view (using assumed rollover/runoff behavior) and a contractual view (legal maturity), enabling ALCO to see both management-intent and worst-case liquidity exposure.

#### User Stories
- **As a Liquidity Risk Manager**, I want to see the behavioral liquidity gap by time bucket so that I can identify near-term funding mismatches.
- **As a Treasurer**, I want to compare the behavioral gap to the contractual gap so that I can understand how much behavioral assumptions affect our liquidity position.
- **As an ALCO Member**, I want to see cumulative surplus carried forward and net mismatch so that I can decide on funding actions.

#### Acceptance Criteria
- [ ] Time buckets configurable (default: Demand, 0–5 days, >5d–1m, >1–2m, >2–3m, >3–6m, >6–12m, >12m)
- [ ] Dual view: Business as Usual (behavioral) and Contractual
- [ ] Computes per bucket: liabilities, assets, mismatch, surplus carried forward, net mismatch, liquidity coefficient, liquidity gap
- [ ] Includes secondary/statutory liquid assets separately
- [ ] Live aggregation from projected cash flows rather than static JSON
- [ ] Drill-down from bucket to individual instruments

#### Data Inputs
- Projected cash flows from the analytics engine (`cash_flows` table)
- Instrument attributes (maturity, rollover, behavioral assumptions)
- Time bucket definitions
- HQLA / liquid asset classification

#### Calculation Logic / Business Rules
```
BehavioralGap = BehavioralLiabilities - BehavioralAssets
ContractualGap = ContractualLiabilities - ContractualAssets
SurplusCarriedForward = sum of positive net mismatches in prior buckets
NetMismatch = Mismatch + SurplusCarriedForward
LiquidityGap = NetMismatch × LiquidityCoefficient
```

#### Validation Rules
- Total assets must reconcile to total liabilities + equity in the contractual view
- Behavioral assumptions must be approved and versioned
- Any bucket with net mismatch > internal limit triggers amber/red alert

#### Error Handling
- Missing cashflow data → fallback to last successful run with stale badge
- Bucket definition missing → apply default buckets
- Behavioral assumption not approved → block behavioral view, show contractual only

#### Audit & Compliance Requirements
- Gap report stored per run with assumption-set version
- Both behavioral and contractual views retained for 7 years
- EBA liquidity reporting requirements supported

---

### 2.6 Bank-Run Stress Calculator

#### Description
A simple but powerful stress tool that simulates a continuous deposit outflow over a user-defined number of days, consuming liquid assets and showing the point at which liquidity coverage becomes critical.

#### User Stories
- **As a Treasurer**, I want to model a bank-run scenario so that I can estimate how many days our liquid assets would last.
- **As a CRO**, I want to see the daily liquidity ratio under stress so that I can brief the Board.
- **As a Liquidity Risk Manager**, I want to save bank-run assumptions as a stress scenario for quarterly reporting.

#### Acceptance Criteria
- [ ] Inputs: total deposits, liquid assets, daily outflow rate (%), number of days
- [ ] Outputs per day: deposit outflow, remaining liquid assets, remaining deposits, liquidity ratio
- [ ] Visual: line chart of remaining liquid assets and deposits over time
- [ ] Breach day automatically flagged when liquid assets fall below policy threshold
- [ ] Assumptions can be saved as a named stress scenario

#### Data Inputs
- Total deposits from GL/ deposit system
- Liquid assets from HQLA inventory
- User-defined daily outflow rate and horizon

#### Calculation Logic / Business Rules
```
Day 0: deposits_0, liquid_assets_0
For day t in 1..horizon:
    outflow_t = deposits_{t-1} × daily_outflow_rate
    deposits_t = deposits_{t-1} - outflow_t
    liquid_assets_t = liquid_assets_{t-1} - outflow_t
    liquidity_ratio_t = liquid_assets_t / deposits_t × 100
```

#### Validation Rules
- Daily outflow rate must be > 0 and ≤ 100%
- Horizon must be ≤ 365 days
- Liquid assets must be ≥ 0 at start

#### Error Handling
- Liquid assets reach zero before horizon → stop calculation, flag breach day
- Outflow rate results in deposit depletion → warn that model becomes invalid

#### Audit & Compliance Requirements
- Bank-run scenarios saved with user, timestamp, and inputs
- Results included in quarterly liquidity stress test pack
- BoG LMTD monthly returns retained for 7 years
- LRMD quarterly LAS and annual ILAAP submissions retained for 7 years
- CFP activation log subject to internal audit review
- Board reviews CFP effectiveness annually
- E-money float account treatment documented for supervisory review

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **LCR_Calculation** | Daily LCR result | calc_id, date, hqla_total, level_1, level_2a, level_2b, outflows_total, inflows_total, net_outflows, lcr_pct, status |
| **HQLA_Item** | Individual HQLA position | item_id, calc_id, security_id, classification, notional, haircut, haircut_amount, market_value, encumbered_flag |
| **Outflow_Item** | Individual outflow category | item_id, calc_id, category, subcategory, notional, run_off_rate, outflow_amount |
| **NSFR_Calculation** | Daily NSFR result | calc_id, date, asf_total, rsf_total, nsfr_pct, status |
| **ASF_Item** | Available stable funding component | item_id, calc_id, category, notional, factor, asf_amount |
| **RSF_Item** | Required stable funding component | item_id, calc_id, category, notional, factor, rsf_amount |
| **BoG_Ratio_Calculation** | Daily BoG prudential ratio result | calc_id, date, ratio_type, narrow_or_broad, bank_or_sdi, liquid_assets, denominator, ratio_pct, threshold, status |
| **MaturityMismatch** | 13-band contractual maturity mismatch | mismatch_id, calc_id, band, cash_inflows, cash_outflows, mismatch, cumulative_mismatch, net_mismatch, currency |
| **FundingConcentration** | Funding concentration by counterparty | concentration_id, calc_id, counterparty_group, product, currency, amount, pct_of_total, significance_flag |
| **SignificantCurrencyLCR** | LCR by significant currency | sclcr_id, calc_id, currency, hqla, net_outflows, lcr_pct, threshold, status |
| **Stress_Scenario** | Liquidity stress scenario | scenario_id, name, type, retail_runoff_mult, wholesale_runoff_mult, hqla_haircut_add, inflow_reduction, description |
| **Stress_Result** | Stress test execution result | result_id, scenario_id, calc_id, base_lcr, stressed_lcr, base_nsfr, stressed_nsfr, survival_days, status |
| **CFP_Phase** | CFP activation phase | phase_id, name, description, trigger_conditions, actions, escalation_contacts |
| **EWI** | Early warning indicator | ewi_id, name, current_value, green_threshold, amber_threshold, red_threshold, status |
| **LiquidityGap** | Time-bucketed gap result | gap_id, run_id, view_type (behavioral/contractual), bucket, liabilities, assets, mismatch, surplus_carried_forward, net_mismatch, liquidity_gap |
| **BankRunScenario** | Bank-run stress inputs | scenario_id, name, total_deposits, liquid_assets, daily_outflow_rate, horizon_days, created_by, created_at |
| **BankRunResult** | Bank-run daily output | result_id, scenario_id, day, outflow, remaining_deposits, remaining_liquid_assets, liquidity_ratio, breach_flag |
| **ILAAP** | Internal Liquidity Adequacy Assessment | ilaap_id, year, assessment_date, board_approval_date, status, document_url |
| **LAS** | Liquidity Adequacy Statement | las_id, quarter, board_approval_date, submission_date, status, document_url |

### 3.2 Key Attributes

**HQLA_Item.encumbered_flag**: TRUE if the asset is pledged as collateral (excluded from HQLA). FALSE if freely available. Updated intraday for repo positions.

**Outflow_Item.category**: Must be one of: stable_retail, non_stable_retail, operational, wholesale_unsecured, wholesale_secured, other. Determines the run-off rate applied.

### 3.3 Relationships

```
LCR_Calculation (1) ──► HQLA_Item (N)
LCR_Calculation (1) ──► Outflow_Item (N)
NSFR_Calculation (1) ──► ASF_Item (N)
NSFR_Calculation (1) ──► RSF_Item (N)
Stress_Scenario (1) ──► Stress_Result (N)
LCR_Calculation (1) ──► Stress_Result (N)
Run (1) ──► LiquidityGap (N)
BankRunScenario (1) ──► BankRunResult (N)
EWI (N) ──► CFP_Phase (determines current phase)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/liquidity/lcr` | GET | Get current LCR calculation |
| `/api/liquidity/lcr/history` | GET | Get LCR history (date range) |
| `/api/liquidity/lcr/whatif` | POST | Run what-if LCR scenario |
| `/api/liquidity/nsfr` | GET | Get current NSFR calculation |
| `/api/liquidity/nsfr/projection` | POST | Run NSFR forward projection |
| `/api/liquidity/bog-ratios` | GET | Get BoG prudential ratio calculations |
| `/api/liquidity/bog-ratios/{id}` | GET | Get specific BoG ratio detail |
| `/api/liquidity/maturity-mismatch` | GET | Get 13-band contractual maturity mismatch |
| `/api/liquidity/funding-concentration` | GET | Get funding concentration report |
| `/api/liquidity/significant-currency-lcr` | GET | Get LCR by significant currency |
| `/api/liquidity/stress` | GET | List stress scenarios |
| `/api/liquidity/stress` | POST | Run stress test |
| `/api/liquidity/stress/{id}` | GET | Get stress test results |
| `/api/liquidity/cfp` | GET | Get current CFP status |
| `/api/liquidity/cfp/ewi` | GET | Get EWI dashboard |
| `/api/liquidity/cfp/activate` | POST | Activate CFP phase |
| `/api/liquidity/reports/lcr` | GET | Generate LCR regulatory report |
| `/api/liquidity/reports/nsfr` | GET | Generate NSFR regulatory report |
| `/api/liquidity/reports/bog-lmtd` | GET | Generate BoG LMTD monthly return |
| `/api/liquidity/reports/las` | GET | Generate quarterly Liquidity Adequacy Statement |
| `/api/liquidity/gap` | GET | Get liquidity gap report (behavioral/contractual) |
| `/api/liquidity/gap/{run_id}` | GET | Get gap report for a specific run |
| `/api/liquidity/bankrun` | POST | Run bank-run stress calculator |
| `/api/liquidity/bankrun/scenarios` | GET | List saved bank-run scenarios |
| `/api/liquidity/ilaap` | GET | Get ILAAP status |
| `/api/liquidity/ilaap` | POST | Submit ILAAP for Board approval |

### 4.2 Request/Response Examples

**Run What-If LCR**
```http
POST /api/liquidity/lcr/whatif
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "base_date": "2026-06-25",
  "adjustments": {
    "withdraw_wholesale": 500000000,
    "sell_level_1_bonds": 200000000
  }
}

Response: 200 OK
{
  "base_lcr": 136.2,
  "adjusted_lcr": 121.5,
  "impact": -14.7,
  "hqla_change": -200000000,
  "outflow_change": 500000000
}
```

---

## 5. Non-Functional Requirements

### 5.1 Performance
- LCR calculation: < 30 seconds after data ingestion completes
- NSFR calculation: < 30 seconds after data ingestion completes
- Stress test execution: < 2 minutes per scenario
- What-if recalculation: < 5 seconds (client-side)
- CFP dashboard refresh: < 1 second
- Historical queries: < 2 seconds for 1 year of data

### 5.2 Security
- LCR/NSFR values classified as confidential (internal use only)
- Stress test results classified as strictly confidential (not shared with external parties)
- API access restricted to Treasury, Risk, and Compliance roles
- Regulatory reports digitally signed before submission

### 5.3 Availability
- LCR/NSFR calculation: 99.9% (must run daily)
- Stress testing: 99.5% (on-demand)
- CFP dashboard: 99.95% (critical for crisis response)
- RTO: 2 hours for calculation engine, 1 hour for CFP dashboard

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| Daily LCR/NSFR Dashboard | Daily | Web UI | Treasurer, ALCO Members |
| BoG LMTD Monthly Return | Monthly | Excel (BoG template) | Compliance → BoG/ORASS |
| LCR Regulatory Report | Monthly | Excel (EBA template) | Compliance → EBA/National Supervisor |
| NSFR Regulatory Report | Quarterly | Excel (EBA template) | Compliance → EBA/National Supervisor |
| Liquidity Stress Test Report | Quarterly | PDF | ALCO → Board |
| CFP Status Report | Weekly | Web UI + Email | Treasurer, CRO |
| Funding Plan Report | Monthly | PDF | Treasurer → ALCO |
| Intraday Liquidity Report | Daily | Web UI | Treasury Operations |
| Liquidity Gap Report | Daily | Web UI + Excel | Treasurer, Risk Manager |
| Bank-Run Stress Report | Quarterly | PDF | ALCO → Board |
| Quarterly Liquidity Adequacy Statement (LAS) | Quarterly | PDF | Board → BoG |
| ILAAP Pack | Annual | PDF | Board → BoG |
| Available Unencumbered Assets Report | Daily | Web UI | Compliance, Risk Manager |
| Funding Concentration Report | Monthly | PDF | Treasurer, Risk Manager |
| Significant Currency LCR Report | Monthly | PDF | Treasurer, Compliance |

---

*PRD v1.0 — Liquidity Risk Management Module*
