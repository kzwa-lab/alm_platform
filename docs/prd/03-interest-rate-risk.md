# PRD: Interest Rate Risk (IRRBB)

## 1. Overview

### 1.1 Purpose

The Interest Rate Risk in the Banking Book (IRRBB) module measures and manages the risk to earnings and capital arising from adverse interest rate movements. It calculates Economic Value of Equity (EVE) sensitivity per the BCBS standardized approach, forecasts Net Interest Income (NII), analyzes repricing gaps, and tracks the derivative hedging portfolio. This module ensures compliance with Pillar 2 supervisory expectations and supports strategic hedging decisions.

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **Treasurer** | Reviews EVE/NII sensitivity, approves hedging strategies, manages derivative portfolio |
| **IRRBB Risk Manager** | Runs EVE calculations, validates behavioral assumptions, produces IRRBB reports |
| **ALCO Member** | Reviews IRRBB metrics at meetings, approves risk appetite thresholds |
| **Model Validator** | Validates NMD behavioral models, backtests assumptions, reviews model risk |
| **Business Unit Head** | Reviews FTP-transferred interest rate risk and profitability impact |

### 1.3 Dependencies

- **Data Foundation**: GL balances, contract-level rate data, maturity schedules
- **Liquidity Risk**: NMD behavioral assumptions shared with LCR/NSFR
- **FTP**: Interest Rate Transfer Pricing (ITP) curves used for NII forecasting
- **Capital Management**: EVE impact affects ICAAP capital requirement

---

## 2. Features

### 2.1 EVE Sensitivity Calculator

#### Description
Calculates the change in Economic Value of Equity (EVE) under six standardized interest rate shock scenarios defined by BCBS. The recalibrated shocks (effective January 2026) use local factors per currency, 99.9th percentile, and 25bps rounding.

#### User Stories
- **As an IRRBB Risk Manager**, I want to see the EVE impact under a 200bps parallel rate rise so that I can verify we stay within our risk appetite.
- **As a Treasurer**, I want to compare EVE sensitivity across currencies so that I can decide where to increase hedging.
- **As an ALCO Member**, I want to see the EVE trend over the last 12 months so that I can assess whether our hedging strategy is effective.

#### Acceptance Criteria
- [ ] Six shock scenarios: parallel up, parallel down, steepener, flattener, short rate up, short rate down
- [ ] EVE calculated as: PV(Assets) - PV(Liabilities) under each shock
- [ ] Modified duration approach or full cash flow discounting (user-selectable)
- [ ] Currency breakdown: EUR, USD, GBP, and other material currencies
- [ ] Automatic selection of worst-case scenario (largest negative EVE impact)
- [ ] Traffic light: Green (EVE impact < 15% of Tier 1 capital), Amber (15-20%), Red (>20%)
- [ ] BCBS d578 recalibration parameters applied for reporting period post-2026

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
- EVE impact must not exceed 20% of Tier 1 capital (supervisory threshold)
- Internal risk appetite: EVE impact < 15% of Tier 1 capital
- All material currencies (≥5% of total exposure) must be calculated separately
- NMD behavioral assumptions must be reviewed annually and backtested quarterly
- Derivative positions must be included (both on-balance and off-balance)

#### Error Handling
- If NMD model data missing → use conservative assumption (100% volatile, 0-day maturity), alert Model Risk
- If yield curve data missing → interpolate from last available, alert if > 4 hours old
- If EVE impact > 15% of T1 → amber alert, include in ALCO agenda
- If EVE impact > 20% of T1 → red alert, trigger immediate hedging review

#### Audit & Compliance Requirements
- BCBS IRRBB standard (d578, recalibrated January 2026)
- EBA Guidelines on IRRBB and CSRBB (GL/2021/XX)
- IRRBB reported in Pillar 2 (SREP)
- EVE sensitivity disclosed in annual report (Pillar 3)

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

#### Error Handling
- If deposit beta data missing → use conservative assumption (β = 0.5 for all products), alert Model Risk
- If yield curve forecast missing → use flat forward curve, alert Treasury
- If NII forecast variance > 10% from budget → amber alert, trigger budget review

#### Audit & Compliance Requirements
- NII forecast assumptions documented and approved by ALCO
- Monthly backtesting: forecast vs. actual NII, variance analysis
- Forecast methodology reviewed annually by Internal Audit

---

### 2.3 Repricing Gap Analysis

#### Description
A time-bucketed analysis of the difference between rate-sensitive assets and liabilities. Shows the maturity ladder of repricing cash flows and cumulative gap positions.

#### User Stories
- **As an IRRBB Risk Manager**, I want to see the repricing gap by time bucket so that I can identify maturity mismatch concentrations.
- **As a Treasurer**, I want to see the cumulative gap over 12 months so that I can plan hedging for the near-term exposure.
- **As an ALCO Member**, I want to see the gap trend over the last 6 months so that I can assess whether our balance sheet strategy is working.

#### Acceptance Criteria
- [ ] Time buckets: O/N, 1W, 1M, 3M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, >10Y
- [ ] Assets and liabilities classified by repricing date (not maturity date)
- [ ] NMDs split into core (long behavioral maturity) and volatile (short-term)
- [ ] Cumulative gap calculated for each bucket (sum of gaps up to that bucket)
- [ ] Gap as % of total assets shown for each bucket
- [ ] Sensitivity: gap × rate change × time = estimated NII impact

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Repricing Gap Analysis                                           │
│  Reporting Date: 2026-06-25 │ Currency: EUR                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Gap Ladder Table                                            │  │
│  │ Bucket  │ Rate Assets │ Rate Liabs │ Gap      │ Cum. Gap  │  │
│  │ O/N     │ 500M        │ 1,200M     │ -700M    │ -700M     │  │
│  │ 1M      │ 800M        │ 600M       │ +200M    │ -500M     │  │
│  │ 3M      │ 1,200M      │ 400M       │ +800M    │ +300M     │  │
│  │ 6M      │ 1,500M      │ 300M       │ +1,200M  │ +1,500M   │  │
│  │ 1Y      │ 2,000M      │ 200M       │ +1,800M  │ +3,300M   │  │
│  │ 2Y      │ 1,800M      │ 100M       │ +1,700M  │ +5,000M   │  │
│  │ 5Y      │ 1,500M      │ 50M        │ +1,450M  │ +6,450M   │  │
│  │ >10Y    │ 800M        │ 0M         │ +800M    │ +7,250M   │  │
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
- NMD behavioral maturity assumptions from MDM
- Prepayment speed assumptions for fixed-rate loans
- Embedded optionality (caps, floors, prepayment options)

#### Calculation Logic / Business Rules
```python
# For each contract, assign to repricing bucket based on next repricing date
if contract.rate_type == "fixed":
    bucket = maturity_date_bucket
else:
    bucket = next_repricing_date_bucket

# For NMDs, use behavioral maturity instead of contractual
if product.type == "NMD":
    core_bucket = behavioral_maturity_bucket  # e.g., 4Y
    volatile_bucket = "O/N"  # immediate repricing

# Gap per bucket
gap_bucket = rate_sensitive_assets_bucket - rate_sensitive_liabilities_bucket

# Cumulative gap
cumulative_gap_bucket = sum(gap for all_buckets <= current_bucket)
```

#### Validation Rules
- Total rate-sensitive assets must equal total rate-sensitive liabilities (within 1% for rounding)
- All contracts must be assigned to a bucket (no unclassified items)
- NMD split (core/volatile) must sum to 100% of NMD balances
- Cumulative gap at >10Y bucket should equal total equity (sanity check)

#### Error Handling
- If contract repricing date missing → default to maturity date, alert Data Engineering
- If NMD behavioral maturity not set → default to O/N (most conservative), alert Model Risk
- If gap > 20% of total assets in any bucket → amber alert, review concentration risk

#### Audit & Compliance Requirements
- Gap analysis reported to ALCO monthly
- EBA GL on IRRBB requires gap analysis as part of internal measurement system
- Backtesting of gap-based NII predictions vs. actual quarterly

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

### 3.2 Key Attributes

**NMD_Model.deposit_beta**: Measures the sensitivity of deposit rates to market rate changes. Calculated as β = Δ(deposit_rate) / Δ(market_rate). Updated quarterly based on regression analysis of historical data.

**NMD_Model.core_ratio**: Percentage of NMD balances considered stable (not rate-sensitive). Core balances are assigned longer behavioral maturities in gap analysis and EVE calculations. Validated annually via historical balance analysis.

### 3.3 Relationships

```
EVE_Calculation (N) ──► Yield_Curve (N) (uses multiple curves)
NII_Forecast (N) ──► Yield_Curve (N)
Gap_Analysis (N) ──► NMD_Model (N)
Derivative_Trade (N) ──► Hedge_Relationship (N)
NMD_Model (1) ──► Product (1)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/irrbb/eve` | GET | Get current EVE calculation |
| `/api/irrbb/eve/history` | GET | Get EVE history |
| `/api/irrbb/eve/scenarios` | GET | List shock scenarios |
| `/api/irrbb/nii` | GET | Get NII forecast |
| `/api/irrbb/nii/scenarios` | POST | Run NII under custom scenario |
| `/api/irrbb/gap` | GET | Get repricing gap analysis |
| `/api/irrbb/gap/history` | GET | Get gap history |
| `/api/irrbb/derivatives` | GET | List derivative trades |
| `/api/irrbb/derivatives/{id}` | GET | Get trade details |
| `/api/irrbb/hedge-effectiveness` | GET | Get hedge effectiveness report |
| `/api/irrbb/reports/irrbb` | GET | Generate IRRBB regulatory pack |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- EVE calculation: < 2 minutes for full balance sheet
- NII forecast: < 30 seconds for 12-month horizon
- Gap analysis: < 10 seconds
- Derivative MTM: < 5 seconds for portfolio of 50 trades
- Historical queries: < 2 seconds for 1 year

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
| Gap Analysis | Monthly | PDF | ALCO, Treasury |
| Derivative Portfolio Report | Daily | Web UI | Treasury, Risk |
| Hedge Effectiveness Report | Quarterly | PDF | Accounting, ALCO |
| IRRBB Regulatory Pack | Quarterly | PDF | Compliance → Supervisor |

---

*PRD v1.0 — Interest Rate Risk (IRRBB) Module*
