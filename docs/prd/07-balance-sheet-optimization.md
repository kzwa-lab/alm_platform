# PRD: Balance Sheet Optimization & Strategic Planning (BoG Recovery Planning / Strategic ALM)

## 1. Overview

### 1.1 Purpose

The Balance Sheet Optimization & Strategic Planning module enables ALCO and the Board to model, simulate, and optimize the bank's balance sheet structure under the Bank of Ghana 2026 Recovery Planning and Strategic Planning requirements. It supports strategic decisions on asset/liability mix, pricing, hedging, and capital allocation, with explicit integration to recovery planning trigger points and management actions. The module integrates outputs from all other ALM modules (liquidity, IRRBB, capital, ECL, FTP) to provide a holistic view of the trade-offs between profitability, risk, and regulatory constraints.

Key capabilities:
- **Balance sheet simulation**: Multi-year projection with Ghana-specific macroeconomic scenarios
- **Recovery planning integration**: Trigger points, management actions, recovery options linked to BoG Recovery Planning Directive
- **NIM attribution**: Volume, rate, mix, and FTP effects with Ghana Reference Rate impact
- **Strategic ALCO pack**: Automated compilation of all ALM metrics for ALCO and Board Risk Committee
- **Regulatory submission tracker**: BoG ORASS deadlines, capital adequacy, liquidity returns, IRRBB submissions
- **Multi-dimensional consolidated reporting**: Balance Sheet, Income Statement, Cashflow Statement by product group, business unit, currency
- **What-if hedging simulator**: Interest rate hedge impact on DGAP, ΔEVE, and NII
- **Capital planning integration**: ICAAP, stress testing, and capital issuance planning

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **CFO / Treasurer** | Sets balance sheet strategy, approves optimization scenarios, manages recovery options |
| **ALCO Chair** | Leads strategic discussions, approves recommendations, reviews recovery trigger points |
| **Strategic Planning Manager** | Builds optimization models, runs scenarios, presents trade-offs, manages recovery plan |
| **Business Unit Head** | Inputs growth targets, reviews impact on their unit, implements recovery actions |
| **Risk Manager** | Validates risk constraints, ensures regulatory limits respected, monitors recovery triggers |
| **Board Member** | Reviews strategic plan, approves multi-year capital allocation, approves recovery plan |
| **CRO** | Reviews recovery planning integration, ensures trigger points are monitored, escalates breaches |
| **Recovery Planning Officer** | Maintains recovery plan, tests recovery options, coordinates with BoG |

### 1.3 Dependencies

- **All ALM Modules**: LCR, NSFR, EVE, NII, RWA, ECL, FTP outputs feed into optimization
- **Data Foundation** (`01-data-foundation.md`): Balance sheet data, product attributes, counterparty data, Ghana macroeconomic data
- **Liquidity Risk** (`02-liquidity-risk.md`): LCR, NSFR, liquidity metrics for constraint checking
- **IRRBB** (`03-interest-rate-risk.md`): EVE, NII, DGAP for interest rate risk integration
- **Capital Management** (`04-capital-management.md`): CET1, T1, TC, leverage ratios, ICAAP, capital planning
- **Stress Testing** (`07-stress-testing.md`): Stress scenarios for optimization and recovery planning
- **Recovery Planning** (`08-recovery-planning.md`): Trigger points, management actions, recovery options
- **GRC Risk Framework** (`09-grc-risk-framework.md`): Board-approved risk appetite, limit monitoring
- **Regulatory Reporting** (`10-regulatory-reporting-orass.md`): BoG submission deadlines, ORASS integration

---

## 2. Features

### 2.1 Balance Sheet Simulator

#### Description
A scenario-based simulation tool that projects the balance sheet forward under different strategic assumptions (growth rates, pricing, mix changes). Calculates the impact on key ALM metrics. Integrates with recovery planning by flagging when projected metrics breach recovery triggers.

#### User Stories
- **As a Strategic Planning Manager**, I want to simulate a 10% increase in mortgage lending so that I can see the impact on LCR, NSFR, and capital ratios.
- **As a Treasurer**, I want to compare two funding strategies (retail deposits vs. wholesale) so that I can optimize the funding mix.
- **As an ALCO Member**, I want to see the risk-return trade-off of different balance sheet strategies so that I can make informed decisions.
- **As a CRO**, I want to see when projected capital ratios breach recovery triggers so that I can escalate to the Board.

#### Acceptance Criteria
- [ ] User-defined scenarios: base, aggressive growth, defensive, restructuring, recovery
- [ ] Adjustable parameters: asset growth by product, liability growth by source, pricing changes, hedge ratios, recovery actions
- [ ] Output metrics: LCR, NSFR, CET1 ratio, leverage ratio, EVE impact, NII forecast, ROE, RAROC
- [ ] Multi-period projection: 1, 3, and 5 years
- [ ] Constraint checking: regulatory limits flagged if breached
- [ ] Recovery trigger integration: flag when projected metrics breach recovery trigger points
- [ ] Management action simulation: model impact of recovery actions (dividend cut, asset sales, capital issuance)
- [ ] Comparison view: side-by-side scenario comparison
- [ ] Ghana-specific macroeconomic variables: GDP growth, inflation, BoG policy rate, GHS/USD, GoT-bill yield

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Balance Sheet Simulator (BoG Strategic Planning)                 │
│  Scenario: [Base Case ▼] [Aggressive Growth] [Defensive] [Recovery]│
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Scenario Parameters (Recovery Scenario)                    │  │
│  │ Asset Growth:        Mortgages +5%, Corp Loans +3%         │  │
│  │ Liability Growth:    Retail Deposits +8%, Wholesale -10%  │  │
│  │ Pricing:             Loan rates +50bps, Deposit rates +30bps│  │
│  │ Hedge Ratio:         IRS coverage 60% → 80%                │  │
│  │ Recovery Actions:    Dividend cut 50%, Asset sales 200M    │  │
│  │ [▶ Run Simulation]                                         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Key Metrics Comparison (Year 3)                            │  │
│  │ Metric       │ Base    │ Recovery │ Impact   │ Status   │  │
│  │ LCR          │ 136%    │ 128%       │ -8pp     │ 🟡       │  │
│  │ NSFR         │ 124%    │ 121%       │ -3pp     │ 🟢       │  │
│  │ CET1 Ratio   │ 14.2%   │ 13.5%      │ -0.7pp   │ 🟢       │  │
│  │ Leverage     │ 5.2%    │ 5.0%       │ -0.2pp   │ 🟢       │  │
│  │ EVE Impact   │ -85M    │ -120M      │ -35M     │ 🟢       │  │
│  │ NII (Y3)     │ 580M    │ 650M       │ +70M     │ 🟢       │  │
│  │ ROE          │ 12.5%   │ 14.2%      │ +1.7pp   │ 🟢       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Recovery Trigger Monitoring                                 │  │
│  │ Trigger              │ Threshold │ Projected │ Status     │  │
│  │ CET1 < 7%            │ 7.0%      │ 13.5%     │ 🟢         │  │
│  │ LCR < 100%           │ 100%      │ 128%      │ 🟢         │  │
│  │ NSFR < 100%          │ 100%      │ 121%      │ 🟢         │  │
│  │ Leverage < 3%        │ 3.0%      │ 5.0%      │ 🟢         │  │
│  │ EVE > 15% T1         │ 15.0%     │ 12.0%     │ 🟢         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Save Scenario] [Export Results] [Present to ALCO] [Update Recovery Plan]│
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Current balance sheet from GL
- Product-level growth assumptions from business units
- Pricing assumptions from Treasury
- Macroeconomic scenarios from Economics (Ghana-specific: GDP, inflation, BoG rate, GHS/USD, GoT-bill)
- Regulatory limits from compliance
- Capital plan from Capital Management
- Recovery trigger points from Recovery Planning module
- Management action definitions from Recovery Planning module

#### Calculation Logic / Business Rules
```python
# Projected balance sheet
for year in range(1, horizon + 1):
    projected_assets[year] = current_assets × (1 + growth_rate)^year
    projected_liabilities[year] = current_liabilities × (1 + growth_rate)^year
    
    # Apply recovery actions if triggered
    if recovery_trigger_breached(projected_cet1[year], "cet1_min"):
        projected_assets[year] = apply_recovery_action(projected_assets[year], "asset_sales")
        projected_cet1[year] = projected_cet1[year] + recovery_action_impact("dividend_cut")
    
    # Recalculate ALM metrics with projected balances
    projected_lcr[year] = calculate_lcr(projected_assets, projected_liabilities)
    projected_nsfr[year] = calculate_nsfr(projected_assets, projected_liabilities)
    projected_cet1[year] = calculate_cet1(projected_rwa, projected_capital)
    
    # Check constraints and recovery triggers
    if projected_lcr[year] < min_lcr:
        flag_constraint_breach("LCR", year)
    if projected_cet1[year] < recovery_trigger_cet1:
        flag_recovery_trigger("CET1", year)
```

#### Validation Rules
- All scenarios must respect hard regulatory constraints (LCR ≥ 100%, NSFR ≥ 100%, CET1 ≥ minimum)
- Internal risk appetite constraints should be respected but can be overridden with ALCO approval
- Growth assumptions must be realistic (≤ 20% annual growth for any product)
- Scenarios must include management actions if constraints are breached
- Recovery trigger projections must be reviewed by CRO quarterly

#### Error Handling
- If scenario breaches hard constraint → block scenario, require parameter adjustment
- If scenario breaches soft constraint → amber warning, allow with ALCO approval
- If calculation fails for any metric → exclude from comparison, alert Risk Manager
- If recovery trigger breached in projection → red alert, trigger recovery plan review

#### Audit & Compliance Requirements
- All scenarios logged with parameters, results, and user
- Recovery trigger projections reviewed by CRO quarterly
- Scenario results retained for 7 years
- BoG may request scenario analysis for supervisory review

---

### 2.2 NIM Attribution Analysis

#### Description
Decomposes Net Interest Margin (NIM) changes into volume, rate, mix, and FTP effects. Explains why NIM changed from one period to another. Incorporates Ghana Reference Rate impact and deposit beta effects.

#### User Stories
- **As a Finance Manager**, I want to understand why NIM increased by 15bps this quarter so that I can explain it to investors.
- **As a Business Unit Head**, I want to see the volume vs. rate effect on my unit's NIM so that I can focus on the right drivers.
- **As an ALCO Member**, I want to see the FTP effect on NIM so that I can evaluate the impact of our funding strategy.
- **As a Treasurer**, I want to see the Ghana Reference Rate impact on NIM so that I can manage repricing risk.

#### Acceptance Criteria
- [ ] NIM attribution: volume effect, rate effect, mix effect, FTP effect, Ghana Reference Rate effect
- [ ] Period-over-period comparison (monthly, quarterly, annually)
- [ ] Business unit and product-level decomposition
- [ ] Interactive waterfall chart showing attribution components
- [ ] Drill-down from headline NIM to individual product contributions
- [ ] Ghana Reference Rate impact: show how GRR changes affected asset yields and liability costs
- [ ] Deposit beta effect: show how deposit repricing lagged GRR changes

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  NIM Attribution Analysis (Ghana Reference Rate Impact)         │
│  Period: Q2 2026 vs Q1 2026 │ NIM: 2.45% → 2.60% (+15bps)      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ NIM Attribution Waterfall                                   │  │
│  │ Q1 NIM: 2.45%                                              │  │
│  │ + Volume Effect:     +5bps  (balance sheet growth)         │  │
│  │ + Rate Effect:       +8bps  (higher loan yields)           │  │
│  │ + Mix Effect:        +3bps  (more high-margin loans)       │  │
│  │ - FTP Effect:        -1bps  (higher funding costs)         │  │
│  │ + GRR Effect:        +2bps  (Ghana Reference Rate +50bps)    │  │
│  │ - Deposit Beta:      -2bps  (deposit repricing lag)        │  │
│  │ = Q2 NIM: 2.60%                                            │  │
│  │                                                            │  │
│  │ [Bar chart: waterfall showing each component]              │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Business Unit Contribution                                  │  │
│  │ Unit        │ Volume │ Rate │ Mix │ FTP │ GRR │ Beta │ Total│  │
│  │ Retail      │ +3bps  │ +4bps│ +2bps│ -1bps│ +1bps│ -1bps│ +8bps│  │
│  │ Corporate   │ +1bps  │ +3bps│ +1bps│  0bps│ +1bps│ -1bps│ +5bps│  │
│  │ SME         │ +1bps  │ +1bps│  0bps│  0bps│  0bps│  0bps│ +2bps│  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Drill Down to Product] [Export] [View Historical Trend]        │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Average balances by product (current and prior period)
- Average yields/costs by product (current and prior period)
- FTP rates (current and prior period)
- Ghana Reference Rate (current and prior period)
- Deposit beta assumptions by product
- Product mix percentages

#### Calculation Logic / Business Rules
```python
# NIM attribution formulas
volume_effect = (avg_balance_current - avg_balance_prior) × avg_yield_prior / total_assets
rate_effect = avg_balance_current × (avg_yield_current - avg_yield_prior) / total_assets
mix_effect = total_assets_current × (weighted_avg_yield_current - weighted_avg_yield_prior_at_prior_mix)
ftp_effect = avg_balance_current × (ftp_rate_current - ftp_rate_prior) / total_assets
grr_effect = avg_balance_current × (grr_change_impact_on_assets - grr_change_impact_on_liabilities) / total_assets
deposit_beta_effect = avg_balance_current × (deposit_beta_lag_impact) / total_assets

# Verification
total_nim_change = volume_effect + rate_effect + mix_effect + ftp_effect + grr_effect + deposit_beta_effect
```

#### Validation Rules
- Sum of all effects must equal actual NIM change (±1bp tolerance)
- Volume effect should be positive if balance sheet grew and yields were positive
- Rate effect sign depends on whether rates increased or decreased
- GRR effect must be consistent with Ghana Reference Rate changes
- Deposit beta effect must be consistent with deposit beta assumptions

#### Audit & Compliance Requirements
- NIM attribution retained for 7 years
- Methodology reviewed annually by Finance and Risk
- GRR impact documented for BoG review

---

### 2.3 Strategic ALCO Pack Generator

#### Description
An automated report generator that compiles all ALM metrics into a single, executive-ready pack for ALCO and Board Risk Committee meetings. Includes one-page summaries, detailed appendices, recovery trigger status, and decision support materials. Aligned with BoG reporting requirements.

#### User Stories
- **As an ALCO Secretary**, I want to generate the ALCO pack automatically so that I can save time on manual compilation.
- **As an ALCO Member**, I want a one-page executive summary so that I can quickly understand the key issues.
- **As a Board Member**, I want the ALCO pack in PDF format so that I can review it offline.
- **As a CRO**, I want the recovery trigger status included in the ALCO pack so that I can escalate if needed.

#### Acceptance Criteria
- [ ] One-page executive summary: key metrics, alerts, decisions required, recovery trigger status
- [ ] Standard sections: liquidity, IRRBB, capital, ECL, FTP, optimization, recovery planning
- [ ] Auto-populated from latest calculations (no manual data entry)
- [ ] Traffic light summary: red/amber/green for each metric
- [ ] Recovery trigger status: all triggers with projected values and breach status
- [ ] Decision items: pre-formatted resolution templates
- [ ] Appendices: detailed charts, tables, and backup data
- [ ] Export formats: PDF (for meeting), PowerPoint (for presentation), Excel (for analysis)
- [ ] Distribution: automatic email to ALCO members 48 hours before meeting
- [ ] BoG-specific sections: capital adequacy, liquidity ratios, IRRBB SOT status

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  ALCO Pack Generator (BoG Strategic Planning)                     │
│  Meeting Date: 2026-07-15 │ Status: Draft                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Executive Summary (Page 1)                                  │  │
│  │ ┌────────────────────────────────────────────────────────┐  │  │
│  │ │ Key Metrics                    │ Status │ Action Needed│  │  │
│  │ │ LCR: 136%                      │ 🟢     │ None         │  │  │
│  │ │ NSFR: 124%                     │ 🟢     │ None         │  │  │
│  │ │ CET1: 14.2%                    │ 🟢     │ None         │  │  │
│  │ │ EVE Impact: -85M (8.5% T1)     │ 🟢     │ None         │  │  │
│  │ │ NII Forecast (Y1): 580M        │ 🟢     │ None         │  │  │
│  │ │ ECL: 245M (+15M)               │ 🟡     │ Review overlay│  │  │
│  │ │ SOT Status: 🟢                 │ 🟢     │ None         │  │  │
│  │ │ Recovery Triggers: All 🟢      │ 🟢     │ None         │  │  │
│  │ └────────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │ Decisions Required:                                         │  │
│  │ 1. Approve GHS 500M AT1 issuance (capital plan)            │  │
│  │ 2. Increase deposit rates by 15bps (NMD competition)      │  │
│  │ 3. Extend IRS hedge by GHS 200M (EVE protection)          │  │
│  │ 4. Review recovery plan trigger thresholds (annual)      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Pack Contents                                               │  │
│  │ [✓] Executive Summary    [✓] Liquidity Report            │  │
│  │ [✓] IRRBB Report         [✓] Capital Report              │  │
│  │ [✓] ECL Report           [✓] FTP Report                  │  │
│  │ [✓] Optimization Scenarios [✓] Recovery Planning           │  │
│  │ [✓] BoG Regulatory Summary [✓] Appendix                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Generate PDF] [Generate PPT] [Generate Excel] [Send to ALCO] │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- All ALM module outputs (latest calculations)
- Recovery trigger status from Recovery Planning module
- ALCO meeting template
- Action item status from previous meeting
- Regulatory deadline calendar
- Market commentary from Economics (Ghana-specific)

#### Validation Rules
- All metrics must be current (within 2 business days of meeting)
- All red/amber alerts must have explanatory text
- All decision items must have supporting analysis in appendices
- Recovery trigger status must be reviewed by CRO before distribution
- Pack must be approved by ALCO Secretary before distribution

#### Audit & Compliance Requirements
- ALCO packs retained for 7 years
- Distribution logged with recipient list and timestamp
- BoG may request ALCO pack for supervisory review

---

### 2.4 Regulatory Submission Tracker

#### Description
Tracks all regulatory submissions to the Bank of Ghana with deadlines, responsible owners, status, and approval workflow. Covers capital adequacy, liquidity, IRRBB, and other BoG returns via ORASS.

#### User Stories
- **As a Compliance Officer**, I want to see all upcoming BoG deadlines so that I can ensure timely submission.
- **As an ALCO Member**, I want to see the status of the quarterly capital adequacy return so that I can verify it's on track.
- **As a CRO**, I want to receive an alert when a submission is overdue so that I can escalate to BoG.

#### Acceptance Criteria
- [ ] Submission calendar: all BoG regulatory reports with deadlines
- [ ] Status tracking: not started, in progress, under review, submitted, approved
- [ ] Owner assignment: each submission has a responsible person
- [ ] Approval workflow: preparer → reviewer → approver (CRO/CEO)
- [ ] Document repository: all submissions stored with version history
- [ ] Alert system: reminders at T-14, T-7, T-3, T-1 days
- [ ] Escalation: overdue submissions escalated to CRO and Board
- [ ] BoG-specific reports: capital adequacy (quarterly), liquidity (monthly), IRRBB (quarterly), ICAAP (annual)

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Regulatory Submission Tracker (BoG ORASS)                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Upcoming Deadlines (Next 30 Days)                          │  │
│  │ Report      │ Deadline │ Owner     │ Status    │ Days Left │  │
│  │ Capital Adeq (Q2)│ 15-Jul   │ mgarcia   │ In Prog   │ 20        │  │
│  │ LCR (Jun)   │ 15-Jul   │ lchen     │ Review    │ 20        │  │
│  │ NSFR (Q2)   │ 15-Aug   │ lchen     │ Not Start │ 51        │  │
│  │ IRRBB (Q2)  │ 15-Jul   │ rwilliams │ In Prog   │ 20        │  │
│  │ ICAAP       │ 31-Oct   │ cpeters   │ Draft     │ 128       │  │
│  │ Pillar 3    │ 30-Sep   │ rwilliams │ Not Start │ 97        │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Submission Status Overview                                  │  │
│  │ [Gantt chart: timeline of all submissions for the year]    │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Overdue Submissions                                         │  │
│  │ None 🎉                                                    │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Add Submission] [View Calendar] [Export Report] [Send Reminder]│
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Regulatory deadline calendar from Compliance
- Submission status from responsible owners
- Approval workflow from ALCO/Executive team
- Document versions from document management system
- BoG reporting schedule (annual, quarterly, monthly)

#### Validation Rules
- All submissions must have an owner and a backup owner
- Deadlines must be validated against BoG regulatory requirements
- Submissions must be approved before deadline (not on the day)
- All submissions must be stored for 7 years
- ORASS format must be validated before submission

#### Audit & Compliance Requirements
- Submission tracker retained for 7 years
- BoG may request submission history for inspection
- Late submissions must be reported to BoG with rationale

---

### 2.5 Multi-dimensional Consolidated Reporting

#### Description
A report builder that generates consolidated Balance Sheet, Income Statement, and Cashflow Statement from saved projection runs. Users pick a run, select strategy and rate scenarios, and choose grouping dimensions via a drag-and-drop sequence. This replaces static report JSON with live aggregation from the analytics engine.

#### User Stories
- **As a Finance Manager**, I want to generate a consolidated balance sheet grouped by product group and currency so that I can explain the firm’s position.
- **As an ALCO Member**, I want to compare the same run under two rate scenarios side-by-side so that I can assess scenario impact.
- **As a Treasurer**, I want to export the consolidated report to Excel so that I can use it in ALCO materials.

#### Acceptance Criteria
- [ ] Report types: Balance Sheet, Income Statement, Cashflow Statement
- [ ] Strategy × rate cross-join: combine behavioral strategies (NewBusiness, MinTarget, etc.) with rate scenarios
- [ ] Grouping dimensions (draggable sequence):
  - `PG` — Product Group
  - `BU` — Business Unit
  - `CU` — Currency
  - `BS` — Balance Sheet Group
  - `AM` — ALM Code
- [ ] Live aggregation from `cash_flows` and `run` results
- [ ] Integrated three-statement consistency: BS, IS, and CF generated from the same cashflow set
- [ ] Export to Excel and PDF
- [ ] Saved report templates for recurring ALCO packs

#### Data Inputs
- Saved `Run` records and linked `CashFlow` data
- ALM base master and TB mapping
- Selected strategy and scenario
- User-defined grouping sequence

#### Calculation Logic / Business Rules
```
# For each run × strategy × scenario combination:
statements = toStatements(isAsset, cashflows, stat)
report = toReport_md(reportType, runs, sequence, hasForecast, reportMonth)

# where toStatements rolls monthly cashflows into BS / IS / CF arrays
# and toReport_md groups by the user-defined sequence
```

#### Validation Rules
- Selected run must be in Approved or Archived status
- Strategy and scenario must belong to approved assumption sets
- Report must satisfy A = L + E reconciliation within rounding tolerance
- All group totals must sum to firm total

#### Error Handling
- Missing cashflow data → show stale badge and fallback to last good run
- Reconciliation failure → flag report as invalid and alert Engineering
- Unapproved run selected → block generation

#### Audit & Compliance Requirements
- Every report generation logged with run ID, strategy, scenario, grouping sequence, and user
- Report snapshots retained for 7 years
- Exports include metadata: run version, assumption-set version, generation timestamp

---

### 2.6 What-if Hedging Simulator

#### Description
A strategic tool that simulates the impact of adding or removing interest-rate hedges (IRS, FRA, futures) on DGAP, ΔEVE, and NII. Enables ALCO to evaluate hedge trades before execution. Integrates with Ghana Reference Rate and BoG SOT scenarios.

#### User Stories
- **As a Treasurer**, I want to see how a pay-fixed IRS reduces our duration gap before I execute the trade.
- **As a Risk Manager**, I want to compare multiple hedge structures so that I can recommend the most efficient risk reduction.
- **As an ALCO Member**, I want to see the cost-vs-benefit of a hedge in the ALCO pack.

#### Acceptance Criteria
- [ ] Hedge instruments: Interest Rate Swaps (pay/receive fixed), Forward Rate Agreements, futures
- [ ] Inputs: notional, currency, tenor, fixed rate, floating index (GRR, LIBOR, etc.), start date
- [ ] Outputs: impact on DGAP, ΔEVE, DV01, NII over 12-24 months
- [ ] Side-by-side comparison: base case vs. hedged case
- [ ] Save what-if scenario for ALCO discussion
- [ ] Ghana Reference Rate integration: show impact of GRR-based hedges

#### Data Inputs
- Base DGAP / EVE results from IRRBB module
- Yield curves for hedge pricing (Ghana Reference Rate, LIBOR, etc.)
- Existing hedge portfolio from Derivative Hedging Portfolio Tracker
- User-defined hypothetical hedge trade

#### Calculation Logic / Business Rules
```
hedged_dgap = base_dgap + hedge_contribution_to_dgap
hedged_delta_eve = base_delta_eve + hedge_delta_eve
hedge_cost = notional × (fixed_rate - floating_rate) × accrual_factor
nii_impact = hedge_cost over projection horizon
```

#### Validation Rules
- Hedge notional must be > 0
- Tenor must be ≤ 30 years
- Fixed rate must be within ±200 bps of swap curve for tenor
- What-if scenario must be saved with base run reference

#### Error Handling
- Invalid hedge inputs → inline validation errors
- Base run not approved → block what-if until approved
- Hedge causes limit breach → flag and require review

#### Audit & Compliance Requirements
- What-if scenarios logged with user, timestamp, and base run
- Hypothetical trades clearly marked as simulations, not booked
- Results retained for 2 years for ALCO decision traceability

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **Scenario** | Optimization scenario | scenario_id, name, type, parameters_json, results_json, status, recovery_trigger_status |
| **NIM_Attribution** | NIM decomposition | attribution_id, period, business_unit, volume_effect, rate_effect, mix_effect, ftp_effect, grr_effect, deposit_beta_effect, total_change |
| **ALCO_Pack** | Generated meeting pack | pack_id, meeting_date, status, sections_json, generated_by, distributed_at, recovery_trigger_status |
| **Submission** | Regulatory submission | submission_id, report_name, deadline, owner, status, submitted_date, approved_by, bog_report_type |
| **ConsolidatedReport** | Multi-dimensional report output | report_id, run_id, report_type (BS/IS/CF), strategy_id, scenario_id, sequence_json, generated_at, generated_by |
| **ReportTemplate** | Saved grouping template | template_id, name, report_type, default_sequence_json, owner |
| **WhatIfHedge** | Hypothetical hedge scenario | whatif_id, base_run_id, hedge_type, notional, currency, tenor, fixed_rate, floating_index, start_date, impact_json |
| **RecoveryTrigger** | Recovery trigger projection | trigger_id, scenario_id, trigger_type, threshold, projected_value, breach_status, projected_year |

### 3.2 Key Attributes

**Scenario.parameters_json**: JSON object storing all adjustable parameters (growth rates, pricing, hedge ratios, recovery actions, etc.). Enables scenario recreation and comparison.

**Scenario.results_json**: JSON object storing calculated metrics for each year of the projection. Used for comparison charts and constraint checking.

**Scenario.recovery_trigger_status**: JSON object storing recovery trigger status for each projected year. Used for recovery planning integration.

**NIM_Attribution.grr_effect**: Impact of Ghana Reference Rate changes on NIM. Calculated as the difference between asset yield impact and liability cost impact due to GRR changes.

**NIM_Attribution.deposit_beta_effect**: Impact of deposit repricing lag on NIM. Calculated as the difference between actual deposit cost change and expected deposit cost change based on deposit beta.

**RecoveryTrigger.breach_status**: Status of recovery trigger — "not_breached", "projected_breach", "breached". "projected_breach" means the trigger is projected to be breached in a future year based on current scenario.

### 3.3 Relationships

```
Scenario (N) ──► All ALM modules (uses outputs)
Scenario (N) ──► RecoveryTrigger (N) (recovery trigger projections)
NIM_Attribution (N) ──► FTP_Report (uses data)
ALCO_Pack (1) ──► All ALM modules (aggregates)
ALCO_Pack (1) ──► RecoveryTrigger (N) (recovery trigger status)
Submission (N) ──► ALCO_Pack (may be referenced)
Run (1) ──► ConsolidatedReport (N)
Strategy (N) ──► ConsolidatedReport (N)
Scenario (N) ──► ConsolidatedReport (N)
ReportTemplate (1) ──► ConsolidatedReport (N)
Run (1) ──► WhatIfHedge (N)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/optimization/scenarios` | GET | List scenarios |
| `/api/optimization/scenarios` | POST | Create scenario |
| `/api/optimization/scenarios/{id}/run` | POST | Run scenario |
| `/api/optimization/scenarios/{id}/recovery-triggers` | GET | Get recovery trigger projections for scenario |
| `/api/optimization/nim` | GET | Get NIM attribution |
| `/api/optimization/alco-pack` | POST | Generate ALCO pack |
| `/api/optimization/alco-pack/{id}` | GET | Download pack |
| `/api/optimization/submissions` | GET | List submissions |
| `/api/optimization/submissions` | POST | Add submission |
| `/api/optimization/submissions/bog` | GET | List BoG regulatory submissions |
| `/api/optimization/reports/consolidated` | POST | Generate consolidated BS/IS/CF report |
| `/api/optimization/reports/templates` | GET | List saved report templates |
| `/api/optimization/reports/templates` | POST | Save report template |
| `/api/optimization/what-if/hedge` | POST | Run what-if hedge simulation |
| `/api/optimization/what-if/hedge` | GET | List saved what-if hedges |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Scenario simulation: < 2 minutes for 5-year projection
- NIM attribution: < 30 seconds
- ALCO pack generation: < 5 minutes
- Submission tracker queries: < 1 second
- Recovery trigger projection: < 30 seconds

### 5.2 Security
- Scenarios classified as internal use (confidential)
- ALCO packs restricted to ALCO members and invited guests
- Submissions classified as strictly confidential
- All documents digitally signed and encrypted
- Recovery trigger data restricted to CRO and Board Risk Committee

### 5.3 Availability
- Scenario simulator: 99.5% (on-demand)
- ALCO pack generator: 99.9% (meeting-critical)
- Submission tracker: 99.9% (compliance-critical)
- Recovery trigger monitoring: 99.9% (recovery-critical)
- RTO: 2 hours

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| Balance Sheet Simulation | On demand | Excel/PDF | ALCO, Strategy |
| NIM Attribution | Monthly | Excel/PDF | Finance, ALCO |
| ALCO Pack | Per meeting | PDF/PPT/Excel | ALCO Members, Board Risk Committee |
| Strategic Plan | Annual | PDF | Board |
| Regulatory Tracker | Weekly | Web UI | Compliance, CRO |
| Submission Status | Monthly | PDF | Board Risk Committee |
| Consolidated BS/IS/CF Report | Monthly | Excel/PDF | Finance, ALCO |
| What-if Hedge Analysis | On demand | PDF | ALCO, Treasury |
| Recovery Trigger Projection | Quarterly | PDF | CRO, Board Risk Committee |
| Recovery Plan Status | Quarterly | PDF | Board Risk Committee, BoG |

---

## 7. Appendices

### 7.1 Ghana Macroeconomic Variables for Scenario Modeling

| Variable | Description | Typical Range | Source |
|----------|-------------|---------------|--------|
| GDP Growth | Real GDP growth rate | 3%–8% | GSS, BoG |
| Inflation | CPI inflation | 8%–15% | GSS |
| BoG Policy Rate | Monetary policy rate | 15%–30% | BoG |
| GHS/USD Exchange Rate | Cedi to US Dollar | 10–15 | BoG, Forex market |
| 91-Day T-Bill Yield | Short-term government yield | 20%–30% | BoG |
| Ghana Reference Rate | Benchmark lending rate | 25%–35% | BoG |
| Cocoa Price | Global cocoa price (USD/ton) | 2,000–4,000 | ICCO, NYSE |
| Gold Price | Global gold price (USD/oz) | 1,500–2,500 | LBMA |
| Oil Price | Brent crude (USD/barrel) | 60–100 | ICE |

### 7.2 Recovery Trigger Integration

| Trigger Type | Threshold | Metric Source | Recovery Action |
|--------------|-----------|---------------|-----------------|
| CET1 < 7% | 7.0% | Capital Management | Dividend cut, asset sales, capital issuance |
| LCR < 100% | 100% | Liquidity Risk | Wholesale funding, asset sales, BoG liquidity facility |
| NSFR < 100% | 100% | Liquidity Risk | Long-term funding, deposit mobilization |
| Leverage < 3% | 3.0% | Capital Management | Asset reduction, capital issuance |
| EVE > 15% T1 | 15.0% | IRRBB | Hedging, asset-liability restructuring |
| NII decline > 20% | 20% | IRRBB | Pricing adjustment, mix optimization |
| Liquidity gap > 20% | 20% | Liquidity Risk | Funding diversification, contingency funding |

### 7.3 Configuration Keys

| Key | Description | Default Value |
|-----|-------------|---------------|
| `optimization.scenario.max_growth_pct` | Maximum annual growth for any product | 20.0 |
| `optimization.scenario.horizon_years` | Default projection horizon | 5 |
| `optimization.nim.attribution_tolerance_bps` | NIM attribution tolerance | 1.0 |
| `optimization.alco_pack.distribution_days_before` | Days before meeting to distribute | 2 |
| `optimization.submission.reminder_days` | Reminder days before deadline | 14, 7, 3, 1 |
| `optimization.recovery.trigger_check_frequency` | Recovery trigger check frequency | quarterly |
| `optimization.reporting.retention_years` | Retention period for reports | 7 |

---

*PRD v2.0 — Balance Sheet Optimization & Strategic Planning (BoG Recovery Planning / Strategic ALM)*
