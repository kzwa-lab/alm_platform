# PRD: Interest Rate Risk (IRRBB / BoG Standardised Framework)

## 1. Overview

### 1.1 Purpose

The Interest Rate Risk in the Banking Book (IRRBB) module measures and manages the risk to earnings and capital arising from adverse interest rate movements under the Bank of Ghana 2026 IRRBB Guideline. It implements the **Standardised Framework (SF)** with 19 defined maturity buckets, dual measurement perspectives (EVE and NII), basis risk assessment, yield-curve risk modeling, and the formal Supervisory Outlier Test (SOT). The module ensures compliance with BoG quarterly reporting requirements and supports strategic hedging decisions.

Key capabilities:
- **Standardised Framework slotting**: 19 defined time buckets for cash-flow allocation
- **Standardisation categorisation**: amenable / less amenable / not amenable to standardisation
- **Dual metrics**: Economic Value of Equity (EVE) and Net Interest Income (NII) under six prescribed shock scenarios
- **Basis risk**: assessment of pricing mismatches where assets and liabilities reprice off different indices
- **Yield-curve risk**: steepening, flattening, and short-rate shock modeling
- **Supervisory Outlier Test (SOT)**: formal alert when ΔEVE decline exceeds 15% of Tier 1 Capital
- **Quarterly BoG reporting**: submission of IRRBB returns for all major currencies >5% of banking-book assets/liabilities

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **Treasurer** | Reviews EVE/NII sensitivity, approves hedging strategies, manages derivative portfolio, reviews basis risk |
| **IRRBB Risk Manager** | Runs EVE calculations, validates behavioral assumptions, produces IRRBB reports, manages 19-bucket slotting |
| **ALCO Member** | Reviews IRRBB metrics at meetings, approves risk appetite thresholds, reviews SOT status |
| **Model Validator** | Validates NMD behavioral models, backtests assumptions, reviews model risk, challenges SOT calibration |
| **Business Unit Head** | Reviews FTP-transferred interest rate risk and profitability impact |
| **Compliance Officer** | Ensures quarterly BoG IRRBB submission accuracy, tracks SOT compliance |

### 1.3 Dependencies

- **Data Foundation** (`01-data-foundation.md`): GL balances, contract-level rate data, maturity schedules, 19 IRRBB bucket engine, Ghana Reference Rate / curve store
- **Behavioural Model Library** (`11-behavioural-model-library.md`): NMD core/volatile split, CPR, TDRR assumptions with BoG regulatory caps
- **Liquidity Risk** (`02-liquidity-risk.md`): NMD behavioral assumptions shared with LCR/NSFR
- **FTP** (`06-ftp.md`): Interest Rate Transfer Pricing (ITP) curves used for NII forecasting
- **Capital Management** (`04-capital-management.md`): EVE impact affects ICAAP capital requirement; Tier 1 capital feeds SOT
- **GRC Risk Framework** (`09-grc-risk-framework.md`): Board-approved IRRBB framework, limit monitoring
- **Regulatory Reporting** (`10-regulatory-reporting-orass.md`): BoG IRRBB quarterly returns

---

## 2. Features

### 2.1 EVE Sensitivity Calculator

#### Description
Calculates the change in Economic Value of Equity (EVE) under six standardized interest rate shock scenarios defined by the BoG IRRBB Guideline (aligned with BCBS d578). The recalibrated shocks use local factors per currency, 99.9th percentile, and 25bps rounding. All cash flows are slotted into the 19 standardised buckets per the Standardised Framework. The module also performs the formal Supervisory Outlier Test (SOT): if the projected decline in EVE under any scenario exceeds 15% of Tier 1 Capital, the institution is designated as a "supervisory outlier" with immediate BoG intervention required.

#### User Stories
- **As an IRRBB Risk Manager**, I want to see the EVE impact under a 200bps parallel rate rise so that I can verify we stay within our risk appetite and the SOT threshold.
- **As a Treasurer**, I want to compare EVE sensitivity across currencies so that I can decide where to increase hedging.
- **As an ALCO Member**, I want to see the EVE trend and SOT status over the last 12 months so that I can assess whether our hedging strategy is effective.
- **As a Compliance Officer**, I want the SOT to be automatically flagged and reported to BoG if the 15% threshold is breached.

#### Acceptance Criteria
- [ ] Six shock scenarios: parallel up, parallel down, steepener, flattener, short rate up, short rate down
- [ ] EVE calculated as: PV(Assets) - PV(Liabilities) under each shock
- [ ] 19 standardised maturity buckets for cash-flow slotting (BoG Standardised Framework)
- [ ] Standardisation categorisation: amenable / less amenable / not amenable to standardisation
- [ ] Modified duration approach or full cash flow discounting (user-selectable)
- [ ] Currency breakdown: GHS, USD, EUR, and other material currencies (>5% of banking book)
- [ ] Automatic selection of worst-case scenario (largest negative EVE impact)
- [ ] Traffic light: Green (EVE impact < 15% of Tier 1 capital), Amber (15-20%), Red (>20%)
- [ ] Supervisory Outlier Test (SOT): formal alert when ΔEVE decline > 15% of Tier 1 Capital under any scenario
- [ ] SOT breach triggers: immediate alert to CRO, automatic inclusion in ALCO agenda, BoG notification workflow
- [ ] BoG IRRBB quarterly report generation for all major currencies
- [ ] Ghana Reference Rate used as primary reference rate for GHS-denominated cash flows

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  EVE Sensitivity Calculator                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ EVE Impact: -EUR 85M │ vs Tier 1 Capital: 8.5% │ Status: 🟢 │  │
│  │ Worst Case: Parallel Up (+200bps) │ Currency: EUR         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Shock Scenario Results                                      │  │
│  │ Scenario          │ ΔEVE (EUR) │ % of T1 │ Status │        │  │
│  │ Parallel Up       │ -85M       │ 8.5%    │ 🟢     │        │  │
│  │ Parallel Down     │ +62M       │ 6.2%    │ 🟢     │        │  │
│  │ Steepener         │ -45M       │ 4.5%    │ 🟢     │        │  │
│  │ Flattener         │ -30M       │ 3.0%    │ 🟢     │        │  │
│  │ Short Rate Up     │ -55M       │ 5.5%    │ 🟢     │        │  │
│  │ Short Rate Down   │ +40M       │ 4.0%    │ 🟢     │        │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ EVE Sensitivity Heatmap (Currency × Scenario)              │  │
│  │ [Heatmap: rows = currencies, cols = scenarios, color = %T1] │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Run Calculation] [Export Report] [View Cash Flows]             │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Frequency |
|-------|--------|-----------|
| Contract cash flows | Loan/Deposit systems | Daily EOD |
| Yield curves per currency | Market data | Intraday (hourly) |
| Behavioral assumptions | NMD model | Monthly update |
| Embedded optionality | Product master | Monthly review |
| Derivative cash flows | Treasury system | Daily EOD |

#### Calculation Logic / Business Rules
```python
# For each contract, calculate PV under base and shocked yield curves
pv_base = sum(cash_flow_t / (1 + base_rate_t)^t for t in cash_flows)
pv_shocked = sum(cash_flow_t / (1 + shocked_rate_t)^t for t in cash_flows)

# For NMDs with behavioral maturity, use effective maturity instead of contractual
nmd_cash_flows = core_balance × core_ftp_rate + volatile_balance × market_rate

# EVE = PV(Assets) - PV(Liabilities)
eve_base = pv_assets_base - pv_liabilities_base
eve_shocked = pv_assets_shocked - pv_liabilities_shocked

delta_eve = eve_shocked - eve_base
pct_of_t1 = abs(delta_eve) / tier_1_capital × 100
```

#### Validation Rules
- EVE impact must not exceed 20% of Tier 1 capital (supervisory ceiling)
- Internal risk appetite: EVE impact < 15% of Tier 1 capital (BoG SOT threshold)
- All material currencies (≥5% of total exposure) must be calculated separately
- NMD behavioral assumptions must be reviewed annually and backtested quarterly
- Derivative positions must be included (both on-balance and off-balance)
- Standardisation categorisation must be documented for all positions
- Basis risk must be assessed for all material index mismatches
- Yield-curve risk must be modeled for steepener, flattener, and short-rate scenarios

#### Error Handling
- If NMD model data missing → use conservative assumption (100% volatile, 0-day maturity), alert Model Risk
- If yield curve data missing → interpolate from last available, alert if > 4 hours old
- If EVE impact > 15% of T1 → amber alert, include in ALCO agenda, trigger SOT monitoring
- If EVE impact > 20% of T1 → red alert, trigger immediate hedging review, BoG notification
- If standardisation amenable < 80% → amber alert, review non-amenable positions
- If basis risk exposure > material threshold → amber alert, flag for Treasurer review
- If yield-curve risk exposure > material threshold → amber alert, flag for Treasurer review

#### Audit & Compliance Requirements
- BoG IRRBB Guideline (2026 Exposure Draft) — Standardised Framework, 19 buckets, SOT
- BCBS IRRBB standard (d578, recalibrated July 2024)
- EVE sensitivity disclosed in annual report (Pillar 3)
- SOT breach events logged as critical audit events with BoG notification evidence
- Results retained for 7 years

---

### 2.2 NII Forecasting Engine

#### Description
Forecasts Net Interest Income (NII) over a 12-36 month horizon under multiple interest rate scenarios. Incorporates deposit beta assumptions, asset repricing schedules, and structural hedging impact.

#### User Stories
- **As a Treasurer**, I want to see the NII forecast under a "higher-for-longer" scenario so that I can plan deposit pricing strategy.
- **As a Business Unit Head**, I want to see NII by business unit so that I can evaluate profitability under different rate paths.
- **As an ALCO Member**, I want to compare NII forecasts across base, upside, and downside scenarios so that I can set the budget.

#### Acceptance Criteria
- [ ] Forecast horizon: 12, 24, and 36 months
- [ ] Rate scenarios: base case, upside (+100bps), downside (-100bps), and 2 custom scenarios
- [ ] Deposit beta assumptions by product (retail current, savings, SME, corporate)
- [ ] Asset repricing schedule based on contract terms and expected prepayments
- [ ] Structural hedging impact included (IRS, caps, floors)
- [ ] NII breakdown by business unit, product, and currency
- [ ] Confidence bands (±1 standard deviation) based on historical forecast accuracy

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  NII Forecasting Engine                                           │
│  Scenario: [Base Case ▼] │ Horizon: [12 Months ▼]               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ NII Forecast Line Chart (EUR millions)                      │  │
│  │ Base: ──────────── │ Upside: - - - - │ Downside: ·······  │  │
│  │ Confidence band: shaded area                              │  │
│  │ M1: 45 │ M3: 48 │ M6: 52 │ M9: 55 │ M12: 58                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ NII Breakdown by Product (Month 12)                         │  │
│  │ Product          │ Base    │ Upside  │ Downside │           │  │
│  │ Fixed Mortgages  │ 22M     │ 22M     │ 22M      │           │  │
│  │ Variable Loans   │ 15M     │ 18M     │ 12M      │           │  │
│  │ Retail Current   │ 8M      │ 10M     │ 6M       │           │  │
│  │ Retail Savings   │ 5M      │ 7M      │ 4M       │           │  │
│  │ Wholesale        │ 8M      │ 1M      │ 14M      │           │  │
│  │ Total NII        │ 58M     │ 58M     │ 58M      │           │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Adjust Assumptions] [Run Sensitivity] [Export to Excel]        │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Contract-level rate data (fixed rate, margin, base rate, repricing frequency)
- Deposit beta assumptions by product
- Expected balance sheet growth/decline by product
- Prepayment assumptions for fixed-rate mortgages
- Structural hedging portfolio (notional, fixed rate received/paid, maturity)
- Yield curve forecasts (base, upside, downside)

#### Calculation Logic / Business Rules
```python
# For each month in forecast horizon
for month in range(1, horizon_months + 1):
    # Asset yield: repricing based on contract terms
    asset_yield = calculate_repriced_rate(contracts, yield_curve, month)
    
    # Liability cost: deposit beta applied to market rate changes
    liability_cost = base_liability_cost + deposit_beta × (market_rate_change)
    
    # Structural hedging impact
    hedge_pnl = calculate_hedge_pnl(hedge_portfolio, rate_change, month)
    
    # NII for the month
    nii_month = (avg_asset_balance × asset_yield) - (avg_liability_balance × liability_cost) + hedge_pnl
```

#### Validation Rules
- NII forecast must be reconcilable to actual NII within 5% for month 1 (backtesting)
- Deposit beta assumptions must be backtested quarterly against actual repricing
- Prepayment assumptions must be validated against historical data
- Forecast must include negative interest rate floor (0% minimum for EUR deposits)
- NMD core ratio must not exceed 70% (BoG cap)
- Deposit beta must be between 0.2 and 0.8 for core deposits (BoG range)
- NII forecast must be run under all six BoG SOT scenarios for quarterly reporting

#### Error Handling
- If deposit beta data missing → use conservative assumption (β = 0.5 for all products), alert Model Risk
- If yield curve forecast missing → use flat forward curve, alert Treasury
- If NII forecast variance > 10% from budget → amber alert, trigger budget review
- If NMD core ratio > 70% → red alert, cap at 70% for calculation, flag for Model Validation
- If deposit beta outside 0.2–0.8 → amber alert, use boundary value, flag for review

#### Audit & Compliance Requirements
- NII forecast assumptions documented and approved by ALCO
- Monthly backtesting: forecast vs. actual NII, variance analysis
- Forecast methodology reviewed annually by Internal Audit
- BoG IRRBB Guideline requires NII forecast under six prescribed scenarios
- Quarterly BoG IRRBB submission includes NII forecast for all material currencies

---

### 2.3 Repricing Gap Analysis

#### Description
A time-bucketed analysis of the difference between rate-sensitive assets and liabilities using the BoG IRRBB Standardised Framework's 19 defined maturity buckets. Shows the maturity ladder of repricing cash flows and cumulative gap positions. All positions are categorised as amenable, less amenable, or not amenable to standardisation per the BoG Guideline.

#### User Stories
- **As an IRRBB Risk Manager**, I want to see the repricing gap by the 19 standardised buckets so that I can identify maturity mismatch concentrations per the BoG framework.
- **As a Treasurer**, I want to see the cumulative gap over 12 months so that I can plan hedging for the near-term exposure.
- **As an ALCO Member**, I want to see the gap trend and SOT status over the last 6 months so that I can assess whether our balance sheet strategy is working.
- **As a Compliance Officer**, I want to verify that all positions are correctly categorised for the BoG quarterly IRRBB return.

#### Acceptance Criteria
- [ ] 19 standardised time buckets per BoG IRRBB Guideline: O/N, 1M, 2M, 3M, 4-6M, 7-9M, 10-12M, 1Y, 1.5Y, 2Y, 2.5Y, 3Y, 3.5Y, 4Y, 4.5Y, 5Y, 6-7Y, 8-10Y, >10Y
- [ ] Assets and liabilities classified by repricing date (not maturity date) for floating-rate; contractual maturity for fixed-rate
- [ ] Standardisation categorisation: amenable / less amenable / not amenable to standardisation
- [ ] NMDs split into core (long behavioral maturity) and volatile (short-term) per BoG caps
- [ ] Cumulative gap calculated for each bucket (sum of gaps up to that bucket)
- [ ] Gap as % of total assets shown for each bucket
- [ ] Sensitivity: gap × rate change × time = estimated NII impact
- [ ] Basis risk summary: gap by reference rate index (Ghana Reference Rate, 91-day T-Bill, etc.)
- [ ] Yield-curve risk summary: gap impact under steepener, flattener, and short-rate scenarios
- [ ] Quarterly BoG IRRBB return generation from the 19-bucket data

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Repricing Gap Analysis (19 Standardised Buckets)                 │
│  Reporting Date: 2026-06-25 │ Currency: GHS │ SOT Status: 🟢        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Gap Ladder Table (Standardised Framework)                   │  │
│  │ Bucket    │ Rate Assets │ Rate Liabs │ Gap      │ Cum. Gap  │  │
│  │ O/N       │ 500M        │ 1,200M     │ -700M    │ -700M     │  │
│  │ 1M        │ 800M        │ 600M       │ +200M    │ -500M     │  │
│  │ 2M        │ 600M        │ 400M       │ +200M    │ -300M     │  │
│  │ 3M        │ 1,200M      │ 400M       │ +800M    │ +500M     │  │
│  │ 4-6M      │ 1,500M      │ 300M       │ +1,200M  │ +1,700M   │  │
│  │ 7-9M      │ 1,000M      │ 200M       │ +800M    │ +2,500M   │  │
│  │ 10-12M    │ 800M        │ 150M       │ +650M    │ +3,150M   │  │
│  │ 1Y        │ 2,000M      │ 100M       │ +1,900M  │ +5,050M   │  │
│  │ 1.5Y      │ 1,500M      │ 80M        │ +1,420M  │ +6,470M   │  │
│  │ 2Y        │ 1,800M      │ 60M        │ +1,740M  │ +8,210M   │  │
│  │ 2.5Y      │ 1,200M      │ 50M        │ +1,150M  │ +9,360M   │  │
│  │ 3Y        │ 1,000M      │ 40M        │ +960M    │ +10,320M  │  │
│  │ 3.5Y      │ 900M        │ 30M        │ +870M    │ +11,190M  │  │
│  │ 4Y        │ 800M        │ 25M        │ +775M    │ +11,965M  │  │
│  │ 4.5Y      │ 700M        │ 20M        │ +680M    │ +12,645M  │  │
│  │ 5Y        │ 600M        │ 15M        │ +585M    │ +13,230M  │  │
│  │ 6-7Y      │ 500M        │ 10M        │ +490M    │ +13,720M  │  │
│  │ 8-10Y     │ 400M        │ 5M         │ +395M    │ +14,115M  │  │
│  │ >10Y      │ 300M        │ 0M         │ +300M    │ +14,415M  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Standardisation Categorisation                              │  │
│  │ Category        │ Assets    │ Liabilities │ % of Total    │  │
│  │ Amenable        │ 8,500M    │ 2,100M      │ 58%           │  │
│  │ Less Amenable   │ 3,200M    │ 800M        │ 22%           │  │
│  │ Not Amenable    │ 2,100M    │ 400M        │ 20%           │  │
│  └────────────────────────────────────────────────────────────┘  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Cumulative Gap Chart (Bar: positive = rate rise benefits)   │  │
│  │ [Bar chart: cumulative gap per bucket]                    │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Drill Down to Contracts] [Export to Excel] [View by Product]   │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Contract repricing dates from loan/deposit systems
- NMD behavioral maturity assumptions from Behavioural Model Library (with BoG regulatory caps)
- Prepayment speed assumptions (CPR) from Behavioural Model Library
- Embedded optionality (caps, floors, prepayment options)
- Ghana Reference Rate and yield curves from Data Foundation curve store
- Standardisation categorisation rules from BoG IRRBB Guideline
- Basis risk indices: Ghana Reference Rate, 91-day T-Bill yield, interbank rate, etc.

#### Calculation Logic / Business Rules
```python
# For each contract, assign to one of 19 standardised buckets
if contract.rate_type == "fixed":
    bucket = maturity_date_bucket  # 19 SF buckets
else:
    bucket = next_repricing_date_bucket  # 19 SF buckets

# Standardisation categorisation
if contract.type in ["fixed_loan", "fixed_mortgage", "gov_bond"]:
    category = "amenable"
elif contract.type in ["floating_loan", "deposit"]:
    category = "less_amenable"
else:
    category = "not_amenable"

# For NMDs, use behavioral maturity instead of contractual
if product.type == "NMD":
    core_bucket = behavioural_maturity_bucket  # e.g., 4Y, subject to BoG cap
    volatile_bucket = "O/N"  # immediate repricing

# Gap per bucket
gap_bucket = rate_sensitive_assets_bucket - rate_sensitive_liabilities_bucket

# Cumulative gap
cumulative_gap_bucket = sum(gap for all_buckets <= current_bucket)

# Gap per bucket
gap_bucket = rate_sensitive_assets_bucket - rate_sensitive_liabilities_bucket

# Cumulative gap
cumulative_gap_bucket = sum(gap for all_buckets <= current_bucket)

# Basis risk: gap by reference rate index
basis_gap = gap_by_index(assets_index) - gap_by_index(liabilities_index)

# Yield-curve risk: gap impact under steepener, flattener, short-rate scenarios
yield_curve_risk_steepener = calculate_gap_impact(steepener_scenario)
yield_curve_risk_flattener = calculate_gap_impact(flattener_scenario)
yield_curve_risk_short_rate_up = calculate_gap_impact(short_rate_up_scenario)
yield_curve_risk_short_rate_down = calculate_gap_impact(short_rate_down_scenario)
```

#### Validation Rules
- Total rate-sensitive assets must equal total rate-sensitive liabilities (within 1% for rounding)
- All contracts must be assigned to a bucket (no unclassified items)
- NMD split (core/volatile) must sum to 100% of NMD balances
- Cumulative gap at >10Y bucket should equal total equity (sanity check)
- Standardisation categorisation must be documented for all positions
- Basis risk must be assessed for all material index mismatches
- Yield-curve risk must be modeled for steepener, flattener, and short-rate scenarios
- SOT status must be calculated and displayed for all material currencies

#### Error Handling
- If contract repricing date missing → default to maturity date, alert Data Engineering
- If NMD behavioral maturity not set → default to O/N (most conservative), alert Model Risk
- If gap > 20% of total assets in any bucket → amber alert, review concentration risk
- If standardisation amenable < 80% → amber alert, review non-amenable positions
- If basis risk exposure > material threshold → amber alert, flag for Treasurer review
- If yield-curve risk exposure > material threshold → amber alert, flag for Treasurer review

#### Audit & Compliance Requirements
- Gap analysis reported to ALCO monthly
- BoG IRRBB Guideline requires gap analysis as part of internal measurement system
- Backtesting of gap-based NII predictions vs. actual quarterly
- Standardisation categorisation documented for audit
- Basis risk and yield-curve risk assessments retained for 7 years

---

### 2.4 Derivative Hedging Portfolio Tracker

#### Description
Tracks all interest rate derivatives used for hedging (IRS, caps, floors, swaptions). Calculates mark-to-market, hedge effectiveness, and residual risk exposure.

#### User Stories
- **As a Treasurer**, I want to see the total notional and MTM of our hedging portfolio so that I can manage counterparty exposure.
- **As an IRRBB Risk Manager**, I want to see hedge effectiveness by instrument so that I can validate our hedging strategy.
- **As an ALCO Member**, I want to see the hedging cost vs. risk reduction benefit so that I can evaluate ROI.

#### Acceptance Criteria
- [ ] Portfolio summary: total notional, MTM, weighted average fixed rate, weighted average maturity
- [ ] Instrument breakdown: IRS (pay fixed, receive fixed), caps, floors, swaptions
- [ ] Hedge effectiveness: dollar offset method (actual hedge P&L vs. hedged item P&L)
- [ ] Counterparty exposure: MTM by counterparty, CSA collateral, net exposure
- [ ] Maturity profile: notional maturing per year
- [ ] Sensitivity: DV01 by instrument and currency

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Derivative Hedging Portfolio                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Portfolio Summary                                           │  │
│  │ Total Notional: EUR 3.2bn │ MTM: -EUR 45M │ DV01: 2.1M  │  │
│  │ Hedge Effectiveness: 92% │ Target: 90% │ Status: 🟢     │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Instrument Breakdown                                        │  │
│  │ Type      │ Notional │ Fixed Rate │ Maturity │ MTM        │  │
│  │ IRS Pay   │ 2.0bn    │ 3.25%      │ 5Y       │ -30M       │  │
│  │ IRS Rec   │ 0.5bn    │ 2.80%      │ 3Y       │ +8M        │  │
│  │ Cap 3.5%  │ 0.4bn    │ 3.50%      │ 7Y       │ +5M        │  │
│  │ Floor 2.0%│ 0.3bn    │ 2.00%      │ 5Y       │ -2M        │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Maturity Profile (Notional per Year)                       │  │
│  │ [Bar chart: notional maturing each year]                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Add Trade] [Roll Trade] [View Effectiveness] [Export]       │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Trade confirmations from Treasury/front office
- Market data for MTM (yield curves, volatilities for options)
- CSA terms (collateral thresholds, minimum transfer amounts)
- Counterparty credit limits

#### Calculation Logic / Business Rules
```python
# Hedge effectiveness (dollar offset method)
hedge_effectiveness = 1 - abs(hedge_pnl - hedged_item_pnl) / abs(hedged_item_pnl)

# DV01 (dollar value of 1 basis point)
dv01 = notional × modified_duration × 0.0001

# MTM for IRS
mtm_irs = sum((fixed_leg - floating_leg) × discount_factor for each_period)

# MTM for cap (sum of caplet values)
mtm_cap = sum(max(forward_rate - strike, 0) × notional × discount_factor × period)
```

#### Validation Rules
- Hedge effectiveness must be ≥ 80% for hedge accounting treatment
- Counterparty exposure must not exceed credit limit
- All trades must have valid ISDA master agreement and CSA in place
- MTM must be independently verified (front office vs. back office reconciliation)

#### Error Handling
- If hedge effectiveness < 80% → discontinue hedge accounting, reclassify to trading
- If counterparty exposure > 90% of limit → amber alert, reduce exposure or request limit increase
- If MTM reconciliation fails → block trade settlement, investigate discrepancy

#### Audit & Compliance Requirements
- Derivative transactions reported to trade repositories (EMIR)
- Hedge documentation reviewed quarterly for hedge accounting compliance
- Counterparty exposure reported to Credit Risk daily

---

### 2.5 Duration Gap (DGAP) / IRRBB Module

#### Description
A dedicated Interest Rate Risk in the Banking Book (IRRBB) workbench that calculates duration, convexity, leverage-adjusted duration gap, ΔEVE, and ΔNII under rate shocks. It replaces hard-coded sensitivity inputs with live instrument cashflows and versioned yield curves, and supports persona-based views for Back Office, Risk Management, and ALCO.

#### User Stories
- **As an IRRBB Risk Manager**, I want to see the duration gap and ΔEVE under BCBS shock scenarios so that I can verify we stay within risk appetite.
- **As a Treasurer**, I want to see DV01 by currency and bucket so that I can size hedging trades.
- **As an ALCO Member**, I want a one-page gap summary with RAG status so that I can make hedging decisions quickly.

#### Acceptance Criteria
- [ ] Macaulay duration per instrument: `Σ[t · CFₜ / (1+y)ᵗ] / Σ[CFₜ / (1+y)ᵗ]`
- [ ] Modified duration: `D_mac / (1 + y/m)`
- [ ] Portfolio duration: market-value weighted average
- [ ] Leverage factor: `k = MV_L / MV_A`
- [ ] Duration gap: `DGAP = D_A − k · D_L`
- [ ] ΔEVE: `−DGAP · MV_A · (Δy / (1+y))`
- [ ] Price sensitivity: `ΔP/P = −D_mod·Δy + ½·Convexity·Δy²`
- [ ] Scenarios: parallel ±100/200/300 bps, steepener, flattener, short rate up/down, custom curve
- [ ] Persona tabs:
  - Back Office: Gap Summary, Gap Profile, Comparative Analysis
  - Risk Management: Duration Analysis, Gap Limits, Sensitivity
  - ALM: Cumulative Gap, Earnings at Risk, Scenario Analysis
- [ ] Configurable risk limits with RAG status and breach workflow

#### Data Inputs
- Contract-level cash flows from the analytics engine
- Yield curves per currency (versioned)
- Market values per instrument
- Behavioral assumptions (NMD decay, prepayment speeds)
- Risk limit definitions

#### Calculation Logic / Business Rules
```python
# Duration metrics
d_mac = sum(t * cf_t / (1 + y)**t) / sum(cf_t / (1 + y)**t)
d_mod = d_mac / (1 + y / m)
convexity = sum(t * (t + 1) * cf_t / (1 + y)**(t + 2)) / sum(cf_t / (1 + y)**t)

# Portfolio and gap
portfolio_duration = sum(mv_i * d_i) / sum(mv_i)
k = mv_liabilities / mv_assets
dgap = d_assets - k * d_liabilities

# EVE impact under shock
delta_eve = -dgap * mv_assets * (delta_y / (1 + y))

# Price sensitivity
delta_p_p = -d_mod * delta_y + 0.5 * convexity * delta_y**2
```

#### Validation Rules
- ΔEVE must not exceed 15% of Tier 1 capital (BoG SOT threshold / internal appetite) or 20% (supervisory ceiling)
- All material currencies (≥5% of exposure) calculated separately
- Yield curves must be approved and dated before use in a run
- Limit breaches require override comment and ALCO approval
- SOT breach triggers immediate BoG notification workflow and Board Risk Committee escalation
- 19-bucket slotting must match BoG Standardised Framework exactly
- Standardisation categorisation must be documented for audit
- Basis risk must be assessed for all material index mismatches
- Yield-curve risk must be modeled for steepener, flattener, and short-rate scenarios

#### Error Handling
- Missing yield curve → interpolate from last approved version; alert if > 4 hours old
- Missing behavioral assumptions → use conservative assumption (NMD = O/N volatile, CPR = 5%, TDRR = 5%)
- Limit breach → red banner, email alert to Treasurer and CRO, include in ALCO agenda
- SOT breach (ΔEVE > 15% of T1) → critical alert, trigger BoG notification workflow, freeze hedging decisions pending Board review
- Missing 19-bucket definition → block calculation, alert Data Engineering
- Basis risk index mismatch → amber alert, flag for Treasurer review

#### Audit & Compliance Requirements
- BoG IRRBB Guideline (2026 Exposure Draft) — Standardised Framework, 19 buckets, SOT
- BCBS IRRBB standard (d578, recalibrated July 2024)
- Every DGAP run linked to yield-curve version and assumption-set version
- Limit breaches logged to `audit_log` with timestamp, value, threshold, and approver
- SOT breach events logged as critical audit events with BoG notification evidence
- Results retained for 7 years
- Quarterly BoG IRRBB submission retained for 7 years

---

### 2.6 Scenario & Assumption Manager

#### Description
A single repository for all rate, behavioral, and business-growth assumptions used across ALM calculations. Replaces scattered scenario definitions in individual modules with versioned, approved assumption sets that can be reused across LCR, NSFR, EVE, NII, and balance-sheet optimization.

#### User Stories
- **As a Risk Manager**, I want to create a new rate-shock scenario and share it across EVE, NII, and DGAP so that assumptions are consistent.
- **As a Model Validator**, I want to see the version history of NMD decay assumptions so that I can validate model changes.
- **As an ALCO Member**, I want to approve an assumption set before it is used in production runs.

#### Acceptance Criteria
- [ ] Rate scenarios: parallel ±100/200/300 bps, steepener, flattener, short rate up/down, custom curve
- [ ] Behavioral assumptions: NMD decay profiles, CPR prepayment speeds, rollover rates, early-redemption assumptions
- [ ] Business strategies: NewBusiness, MinTarget, Extension, Runoff
- [ ] Versioning: every assumption set is dated and versioned
- [ ] Approval workflow: Draft → Review → Approved
- [ ] Immutable once approved; new versions require explicit creation
- [ ] Audit trail of who changed what and why

#### Data Inputs
- Historical balance behavior for NMD decay estimation
- Prepayment data from loan servicing
- Market yield curves for rate scenario construction
- ALCO-approved strategy targets

#### Calculation Logic / Business Rules
- NMD effective maturity = weighted average of decay profile buckets
- CPR (Constant Prepayment Rate) applied to fixed-rate loan amortization schedules
- Rate scenario curves stored as tenor → rate adjustment mapping
- Assumption set linked to every `Run` for reproducibility

#### Validation Rules
- Scenario curves must be monotonic or have documented rationale for inversions
- NMD core ratio must be between 50% and 90%
- CPR must be between 0% and 100%
- Assumption sets must be approved before use in production runs

#### Error Handling
- Unapproved assumption set selected → block run execution
- Inconsistent scenario (e.g., high GDP + high unemployment) → reject with explanation
- Missing required assumption → use conservative default and alert

#### Audit & Compliance Requirements
- All assumption sets versioned and retained for 7 years
- Approval records include approver, timestamp, and digital signature
- Changes to approved assumptions trigger model-risk review

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **EVE_Calculation** | Daily EVE result | calc_id, date, currency, scenario, eve_base, eve_shocked, delta_eve, pct_of_t1, status |
| **Yield_Curve** | Market yield curve | curve_id, date, currency, tenor, rate, source |
| **NII_Forecast** | NII forecast result | forecast_id, date, horizon_months, scenario, nii_monthly[], total_nii, confidence_low, confidence_high |
| **Gap_Analysis** | Repricing gap result | gap_id, date, currency, bucket, assets, liabilities, gap, cumulative_gap |
| **Derivative_Trade** | Individual derivative | trade_id, type, direction, notional, currency, fixed_rate, floating_index, maturity, counterparty, mtm |
| **Hedge_Relationship** | Hedge accounting pair | hedge_id, trade_id, hedged_item, effectiveness_method, effectiveness_pct, status |
| **NMD_Model** | Behavioral model parameters | model_id, product_id, core_ratio, behavioral_maturity, deposit_beta, repricing_lag, validation_date |
| **DurationGap_Calculation** | DGAP run result | calc_id, run_id, currency, d_assets, d_liabilities, leverage_factor, dgap, delta_eve, delta_nii, dv01, status |
| **Risk_Limit** | Configurable risk limit | limit_id, metric_name, scenario, threshold, direction, amber_threshold, red_threshold, status |
| **Limit_Breach** | Recorded breach event | breach_id, limit_id, calc_id, run_id, actual_value, threshold, breach_date, approved_by, override_comment |
| **Assumption_Set** | Versioned assumptions | assumption_set_id, name, version, nmd_decay_profile_json, cpr_assumption, rollover_rates_json, status, approved_by, approved_at |
| **Scenario** | Rate / growth scenario | scenario_id, name, type, shock_bps, curve_adjustment_json, growth_assumptions_json, status |

### 3.2 Key Attributes

**NMD_Model.deposit_beta**: Measures the sensitivity of deposit rates to market rate changes. Calculated as β = Δ(deposit_rate) / Δ(market_rate). Updated quarterly based on regression analysis of historical data. BoG requires deposit beta to be between 0.2 and 0.8 for core deposits; values outside this range require documented rationale.

**NMD_Model.core_ratio**: Percentage of NMD balances considered stable (not rate-sensitive). Core balances are assigned longer behavioral maturities in gap analysis and EVE calculations. Validated annually via historical balance analysis. BoG caps core ratio at 70% for non-maturing deposits; values above 70% require Board-approved model and annual validation.

**NMD_Model.behavioral_maturity**: Effective maturity assigned to NMD balances based on decay profile. BoG Standardised Framework requires behavioral maturity to be ≤ 5 years for core deposits and ≤ 1 year for non-core deposits.

**Assumption_Set.standardisation_categorisation**: Categorisation of each instrument type as "amenable", "less amenable", or "not amenable" to standardisation. This determines whether the instrument is slotted into the 19-bucket framework or requires bespoke treatment. Must be documented for audit.

**Assumption_Set.basis_risk_assessment**: JSON document mapping each material index mismatch (e.g., GRR vs. LIBOR, GRR vs. prime) to its basis risk exposure. Required for all instruments with floating rates off different indices.

**Assumption_Set.yield_curve_risk_assessment**: JSON document documenting yield-curve risk exposures for steepener, flattener, and short-rate scenarios. Required for all material currencies (≥5% of exposure).

**Scenario.bog_sot_compliance**: Boolean flag indicating whether the scenario is one of the six prescribed BoG SOT scenarios. If true, the scenario must be run quarterly and results submitted to BoG.

**Scenario.shock_type**: Type of shock — "parallel", "steepener", "flattener", "short_rate_up", "short_rate_down", "custom". BoG SOT requires parallel ±200 bps, steepener, flattener, short rate up, short rate down.

**EVE_Calculation.sot_breach**: Boolean flag indicating whether ΔEVE exceeds 15% of Tier 1 capital. If true, triggers BoG notification workflow and Board Risk Committee escalation.

**EVE_Calculation.standardisation_amenable**: Percentage of EVE that is amenable to standardisation (i.e., slotted into 19 buckets). Must be ≥ 80% for BoG compliance.

**EVE_Calculation.basis_risk_exposure**: Basis risk exposure in GHS. Must be reported separately from parallel shock EVE.

**EVE_Calculation.yield_curve_risk_exposure**: Yield-curve risk exposure in GHS. Must be reported separately from parallel shock EVE.

**EVE_Calculation.currency**: Currency code (e.g., GHS, USD, EUR). BoG requires separate EVE calculations for all material currencies (≥5% of exposure).

### 3.3 Relationships

```
EVE_Calculation (N) ──► Yield_Curve (N) (uses multiple curves)
NII_Forecast (N) ──► Yield_Curve (N)
Gap_Analysis (N) ──► NMD_Model (N)
Derivative_Trade (N) ──► Hedge_Relationship (N)
NMD_Model (1) ──► Product (1)
Run (1) ──► DurationGap_Calculation (N)
DurationGap_Calculation (N) ──► Risk_Limit (N) (checked against)
Risk_Limit (1) ──► Limit_Breach (N)
Assumption_Set (1) ──► Run (N)
Scenario (N) ──► Run (N)
EVE_Calculation (N) ──► Assumption_Set (1) (standardisation categorisation, basis risk, yield-curve risk)
EVE_Calculation (N) ──► BoG_Notification (N) (SOT breach triggers notification)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/irrbb/eve` | GET | Get current EVE calculation |
| `/api/irrbb/eve/history` | GET | Get EVE history |
| `/api/irrbb/eve/scenarios` | GET | List shock scenarios |
| `/api/irrbb/eve/sot` | GET | Get SOT status (ΔEVE vs 15% T1) |
| `/api/irrbb/eve/sot/breach` | POST | Trigger SOT breach notification workflow |
| `/api/irrbb/eve/basis-risk` | GET | Get basis risk exposure by index mismatch |
| `/api/irrbb/eve/yield-curve-risk` | GET | Get yield-curve risk exposure (steepener, flattener, short rate) |
| `/api/irrbb/eve/standardisation` | GET | Get standardisation categorisation (amenable/less amenable/not amenable) |
| `/api/irrbb/nii` | GET | Get NII forecast |
| `/api/irrbb/nii/scenarios` | POST | Run NII under custom scenario |
| `/api/irrbb/gap` | GET | Get repricing gap analysis (19-bucket BoG framework) |
| `/api/irrbb/gap/history` | GET | Get gap history |
| `/api/irrbb/gap/standardisation` | GET | Get standardisation categorisation for gap analysis |
| `/api/irrbb/derivatives` | GET | List derivative trades |
| `/api/irrbb/derivatives/{id}` | GET | Get trade details |
| `/api/irrbb/hedge-effectiveness` | GET | Get hedge effectiveness report |
| `/api/irrbb/reports/irrbb` | GET | Generate IRRBB regulatory pack |
| `/api/irrbb/reports/bog-irrbb` | GET | Generate BoG quarterly IRRBB submission (ORASS format) |
| `/api/irrbb/reports/sot` | GET | Generate SOT report for BoG |
| `/api/irrbb/duration-gap` | GET | Get duration gap results |
| `/api/irrbb/duration-gap/{run_id}` | GET | Get DGAP for specific run |
| `/api/irrbb/dv01` | GET | Get DV01 by currency/bucket |
| `/api/irrbb/limits` | GET | List risk limits |
| `/api/irrbb/limits/{id}/breaches` | GET | Get breach history for a limit |
| `/api/irrbb/scenarios` | GET | List scenarios |
| `/api/irrbb/scenarios` | POST | Create scenario |
| `/api/irrbb/assumption-sets` | GET | List assumption sets |
| `/api/irrbb/assumption-sets` | POST | Create assumption set |
| `/api/irrbb/assumption-sets/{id}/standardisation` | GET | Get standardisation categorisation for assumption set |
| `/api/irrbb/assumption-sets/{id}/basis-risk` | GET | Get basis risk assessment for assumption set |
| `/api/irrbb/assumption-sets/{id}/yield-curve-risk` | GET | Get yield-curve risk assessment for assumption set |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- EVE calculation: < 2 minutes for full balance sheet (19-bucket standardised framework)
- NII forecast: < 30 seconds for 12-month horizon
- Gap analysis: < 10 seconds (19-bucket framework)
- Derivative MTM: < 5 seconds for portfolio of 50 trades
- Historical queries: < 2 seconds for 1 year
- SOT calculation: < 30 seconds for all material currencies
- Basis risk assessment: < 10 seconds for all material index mismatches
- Yield-curve risk assessment: < 10 seconds for steepener, flattener, short-rate scenarios
- Standardisation categorisation: < 5 seconds for full balance sheet
- BoG quarterly report generation: < 60 seconds for ORASS format

### 5.2 Security
- Yield curve data classified as market-sensitive
- Derivative positions classified as confidential
- MTM data restricted to Treasury and Risk roles
- Hedge effectiveness data restricted to Accounting and Risk roles

### 5.3 Availability
- EVE calculation: 99.5% (daily requirement)
- NII forecast: 99.5% (on-demand)
- Derivative portfolio: 99.95% (intraday trading support)
- RTO: 2 hours

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| IRRBB Dashboard | Daily | Web UI | Treasurer, Risk Manager |
| EVE Sensitivity Report | Monthly | PDF | ALCO |
| NII Forecast | Monthly | Excel | ALCO, Finance |
| Gap Analysis (19-bucket) | Monthly | PDF | ALCO, Treasury |
| Derivative Portfolio Report | Daily | Web UI | Treasury, Risk |
| Hedge Effectiveness Report | Quarterly | PDF | Accounting, ALCO |
| IRRBB Regulatory Pack | Quarterly | PDF | Compliance → Supervisor |
| BoG Quarterly IRRBB Submission | Quarterly | ORASS XML | Compliance → BoG |
| SOT Report | Quarterly | PDF | CRO, Board Risk Committee |
| Basis Risk Report | Quarterly | PDF | ALCO, Treasurer |
| Yield-Curve Risk Report | Quarterly | PDF | ALCO, Treasurer |
| Standardisation Categorisation Report | Quarterly | PDF | ALCO, Model Validation |
| Duration Gap Report | Monthly | PDF | ALCO, Risk |
| DV01 / Sensitivity Report | Daily | Web UI | Treasury, Risk |
| Limit Breach Register | Monthly | PDF | ALCO, CRO |

---

## 7. Appendices

### 7.1 BoG Standardised Framework — 19 Time Buckets

| Bucket | Time Band | Description |
|--------|-----------|-------------|
| 1 | Overnight | ≤ 1 day |
| 2 | 2 days to 1 week | > 1 day to ≤ 7 days |
| 3 | 1 week to 1 month | > 7 days to ≤ 1 month |
| 4 | 1 month to 3 months | > 1 month to ≤ 3 months |
| 5 | 3 months to 6 months | > 3 months to ≤ 6 months |
| 6 | 6 months to 9 months | > 6 months to ≤ 9 months |
| 7 | 9 months to 1 year | > 9 months to ≤ 1 year |
| 8 | 1 year to 1.5 years | > 1 year to ≤ 1.5 years |
| 9 | 1.5 years to 2 years | > 1.5 years to ≤ 2 years |
| 10 | 2 years to 3 years | > 2 years to ≤ 3 years |
| 11 | 3 years to 4 years | > 3 years to ≤ 4 years |
| 12 | 4 years to 5 years | > 4 years to ≤ 5 years |
| 13 | 5 years to 6 years | > 5 years to ≤ 6 years |
| 14 | 6 years to 7 years | > 6 years to ≤ 7 years |
| 15 | 7 years to 8 years | > 7 years to ≤ 8 years |
| 16 | 8 years to 9 years | > 8 years to ≤ 9 years |
| 17 | 9 years to 10 years | > 9 years to ≤ 10 years |
| 18 | 10 years to 15 years | > 10 years to ≤ 15 years |
| 19 | 15 years to 20 years | > 15 years to ≤ 20 years |

### 7.2 BoG Standardisation Categorisation

| Category | Description | Examples |
|----------|-------------|----------|
| **Amenable** | Instruments with contractual cash flows that can be directly mapped to 19 buckets | Fixed-rate loans, fixed-rate bonds, fixed-rate deposits |
| **Less Amenable** | Instruments with embedded options or behavioural features that require assumptions | NMDs with core ratio, prepayable mortgages, callable bonds |
| **Not Amenable** | Instruments that cannot be standardised and require bespoke treatment | Complex derivatives, structured products, non-standard instruments |

### 7.3 BoG SOT Shock Scenarios

| Scenario | Description | Shock Size |
|----------|-------------|------------|
| Parallel up | Parallel upward shift in yield curve | +200 bps |
| Parallel down | Parallel downward shift in yield curve | -200 bps |
| Steepener | Long rates rise more than short rates | +100 bps long, -50 bps short |
| Flattener | Short rates rise more than long rates | +100 bps short, -50 bps long |
| Short rate up | Short end of curve rises | +300 bps at 0–6 months, fading to 0 at 20 years |
| Short rate down | Short end of curve falls | -300 bps at 0–6 months, fading to 0 at 20 years |

### 7.4 Basis Risk Assessment

| Index Pair | Risk Description | Mitigation |
|------------|------------------|------------|
| GRR vs. Prime | Assets reprice off GRR, liabilities off prime | Natural hedge, derivative overlay |
| GRR vs. LIBOR | Cross-currency basis risk | Cross-currency swaps, natural hedging |
| Fixed vs. Floating | Mismatch between fixed-rate assets and floating-rate liabilities | Interest rate swaps, asset-liability matching |

### 7.5 Yield-Curve Risk Assessment

| Scenario | Risk Description | Measurement |
|----------|------------------|-------------|
| Steepener | Long-term rates rise faster than short-term rates | ΔEVE under steepener scenario |
| Flattener | Short-term rates rise faster than long-term rates | ΔEVE under flattener scenario |
| Short rate up | Short-term rates spike | ΔEVE under short-rate-up scenario |
| Short rate down | Short-term rates fall sharply | ΔEVE under short-rate-down scenario |

### 7.6 Configuration Keys

| Key | Description | Default Value |
|-----|-------------|---------------|
| `irrbb.sot.threshold_pct` | SOT threshold as % of Tier 1 capital | 15.0 |
| `irrbb.sot.ceiling_pct` | Supervisory ceiling as % of Tier 1 capital | 20.0 |
| `irrbb.standardisation.amenable_min_pct` | Minimum % of EVE that must be amenable to standardisation | 80.0 |
| `irrbb.basis_risk.material_threshold_ghs` | Materiality threshold for basis risk exposure (GHS) | 10000000.0 |
| `irrbb.yield_curve_risk.material_threshold_ghs` | Materiality threshold for yield-curve risk exposure (GHS) | 10000000.0 |
| `irrbb.material_currency_threshold_pct` | Threshold for material currency (≥% of exposure) | 5.0 |
| `irrbb.nmd.core_ratio_cap` | BoG cap on NMD core ratio | 70.0 |
| `irrbb.nmd.deposit_beta_min` | Minimum deposit beta for core deposits | 0.2 |
| `irrbb.nmd.deposit_beta_max` | Maximum deposit beta for core deposits | 0.8 |
| `irrbb.bucket.count` | Number of standardised buckets | 19 |
| `irrbb.shock.parallel_up_bps` | Parallel upward shock size (bps) | 200.0 |
| `irrbb.shock.parallel_down_bps` | Parallel downward shock size (bps) | -200.0 |
| `irrbb.reporting.bog_quarterly_months` | Months when BoG quarterly IRRBB report is due | 3, 6, 9, 12 |
| `irrbb.reporting.retention_years` | Retention period for IRRBB results | 7 |

---

*PRD v2.0 — Interest Rate Risk (IRRBB / BoG Standardised Framework)*
