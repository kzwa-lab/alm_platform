# PRD: Funds Transfer Pricing (FTP) — BoG Ghana Reference Rate / T-Bill Curve Framework

## 1. Overview

### 1.1 Purpose

The Funds Transfer Pricing (FTP) module calculates the internal cost of funds for assets and the internal credit for liabilities under the Bank of Ghana's monetary policy framework. It uses the **Ghana Reference Rate (GRR)** and **Government of Ghana T-Bill curve** as primary reference rates, supplemented by the **BoG policy rate** and **interbank rate**. The module enables accurate profitability measurement, business unit performance evaluation, and product pricing in a high-interest-rate, volatile Ghanaian market. It includes Liquidity Transfer Pricing (LTP) for liquidity risk, Interest Rate Transfer Pricing (ITP) for interest rate risk, and Credit Transfer Pricing (CTP) for credit risk. The FTP framework ensures that ALM centralizes and manages these risks while business units focus on customer relationships.

Key capabilities:
- **Ghana Reference Rate (GRR) integration**: Primary reference rate for GHS-denominated products
- **GoG T-Bill curve**: Short-term funding cost benchmark (91-day, 182-day, 1-year, 2-year T-Bills)
- **BoG policy rate**: Monetary policy transmission benchmark
- **Interbank rate**: Wholesale funding cost benchmark
- **Multi-currency support**: GHS, USD, EUR, GBP curves
- **NMD replicating portfolio**: Core/volatile split with BoG behavioral caps
- **Deal-level pricing**: Real-time profitability calculation with Ghana-specific risk premiums
- **FTP-adjusted profitability reporting**: Business unit and product-level performance

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **Treasurer** | Manages FTP curve, reviews LTP/ITP rates, approves pricing exceptions, monitors GRR changes |
| **Business Unit Head** | Reviews FTP-adjusted profitability of their unit, negotiates pricing, manages customer relationships |
| **ALCO Member** | Reviews FTP policy, approves curve construction methodology, monitors GRR impact |
| **Finance Manager** | Uses FTP for internal profitability reporting and budget allocation |
| **Product Manager** | Uses FTP for new product pricing and existing product review |
| **Risk Manager** | Validates FTP risk adjustments, ensures consistency with IRRBB and liquidity models |

### 1.3 Dependencies

- **Data Foundation** (`01-data-foundation.md`): Contract-level rate data, maturity schedules, behavioral assumptions, Ghana Reference Rate / T-Bill curve store
- **IRRBB** (`03-interest-rate-risk.md`): ITP curves derived from IRRBB yield curves; GRR used for GHS-denominated cash flows
- **Liquidity Risk** (`02-liquidity-risk.md`): LTP charges based on LCR/NSFR metrics; HQLA holdings affect FTP
- **ECL** (future): CTP credit margins based on PD/LGD estimates
- **Capital Management** (`04-capital-management.md`): Economic capital allocation for ROE calculations
- **Behavioural Model Library** (`11-behavioural-model-library.md`): NMD core/volatile split, deposit beta assumptions

---

## 2. Features

### 2.1 FTP Curve Construction & Management

#### Description
The FTP curve is constructed from Ghana-specific reference rates: Ghana Reference Rate (GRR) for GHS-denominated products, GoG T-Bill curve for short-term funding, BoG policy rate for monetary policy transmission, and interbank rate for wholesale funding. The module supports multiple curves (ITP for rate risk, LTP for liquidity risk) and allows for historical curve analysis.

#### User Stories
- **As a Treasurer**, I want to update the FTP curve when the BoG policy rate changes so that product pricing reflects current funding costs.
- **As a Business Unit Head**, I want to see the FTP rate for a specific tenor so that I can price a new loan correctly.
- **As an ALCO Member**, I want to see how the FTP curve has changed over the last 6 months so that I can understand funding cost trends and GRR impact.

#### Acceptance Criteria
- [ ] Primary reference rates: Ghana Reference Rate (GRR), GoG T-Bill curve (91-day, 182-day, 1-year, 2-year), BoG policy rate, interbank rate
- [ ] Multiple curves: ITP (interest rate transfer pricing), LTP (liquidity transfer pricing)
- [ ] Tenors: O/N, 1W, 1M, 3M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 15Y, 20Y
- [ ] Currency-specific curves: GHS (GRR-based), USD (LIBOR/SOFR-based), EUR (EURIBOR-based), GBP (SONIA-based)
- [ ] Assign funds-transfer prices by tenor, product, and currency
- [ ] Daily update from BoG market data feeds
- [ ] Historical view: compare today's curve to previous dates
- [ ] Curve validation: check for inversions, spikes, or missing tenors
- [ ] Curve approval workflow: constructed by Treasury, approved by ALCO
- [ ] GRR change notification: automatic alert when BoG changes GRR or policy rate

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  FTP Curve Manager (Ghana Reference Rate Framework)               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Curve Date: 2026-06-25 │ Last Updated: 08:00 GMT │ Status: ✅ │  │
│  │ GRR: 25.50% │ BoG Policy Rate: 26.00% │ 91-Day T-Bill: 24.80%│  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ GHS FTP Curve Chart (Yield vs. Tenor)                    │  │
│  │ Today: ────────── │ Last Week: - - - - │ Last Month: ····│  │
│  │ 1M: 25.20% │ 3M: 25.50% │ 6M: 25.80% │ 1Y: 26.20% │ 5Y: 27.50%│  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ FTP Rate Table (GHS)                                        │  │
│  │ Tenor │ ITP Rate │ LTP Rate │ Credit Spread │ Total FTP   │  │
│  │ O/N   │ 25.00%   │ 0.20%    │ 1.50%         │ 26.70%      │  │
│  │ 1M    │ 25.20%   │ 0.30%    │ 1.50%         │ 27.00%      │  │
│  │ 3M    │ 25.50%   │ 0.40%    │ 1.50%         │ 27.40%      │  │
│  │ 1Y    │ 26.20%   │ 0.60%    │ 1.50%         │ 28.30%      │  │
│  │ 5Y    │ 27.50%   │ 1.00%    │ 1.50%         │ 29.00%      │  │
│  │ 10Y   │ 28.00%   │ 1.20%    │ 1.50%         │ 30.70%      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Update Curve] [View History] [Approve] [Export] [GRR Alert]     │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Frequency |
|-------|--------|-----------|
| Ghana Reference Rate (GRR) | BoG | Daily (when changed) |
| GoG T-Bill curve (91-day, 182-day, 1-year, 2-year) | BoG / Primary dealers | Daily |
| BoG policy rate | BoG MPC announcements | Per MPC meeting (bi-monthly) |
| Interbank rate | BoG / Money market | Daily |
| Bank credit spread | Internal model / Market data | Monthly |
| Liquidity premium | Internal model | Monthly |
| ALCO approval | ALCO meeting minutes | Per meeting |

#### Calculation Logic / Business Rules
```python
# GHS FTP curve construction (Ghana Reference Rate framework)
ftp_rate_ghs(tenor) = grr_base + tenor_premium(tenor) + bank_credit_spread + liquidity_premium(tenor)

# GRR base: Ghana Reference Rate (primary reference)
grr_base = ghana_reference_rate  # Published by BoG

# Tenor premium: derived from GoG T-Bill curve
# For tenors <= 1 year: interpolate from T-Bill curve
# For tenors > 1 year: extrapolate using T-Bill curve + swap spread
if tenor <= 1:
    tenor_premium = interpolate_tbill_curve(tenor) - grr_base
else:
    tenor_premium = (tbill_2y - grr_base) + (tenor - 2) × swap_spread_slope

# Bank credit spread derived from internal funding cost vs. GRR
bank_credit_spread = avg(interbank_rate - grr_base, bank_bond_yield - grr_base)

# Liquidity premium increases with tenor
liquidity_premium(tenor) = base_premium × sqrt(tenor_in_years)

# USD/EUR/GBP curves: use international reference rates (SOFR, EURIBOR, SONIA)
# plus Ghana-specific cross-currency basis and country risk premium
ftp_rate_usd(tenor) = sofr_rate(tenor) + cross_currency_basis + ghana_country_risk_premium
```

#### Validation Rules
- GHS FTP curve must be upward sloping (or flat) — no inversion beyond 3M
- Daily change in any tenor must be < 200bps (spike detection for Ghana volatility)
- FTP rate must be > 0 for all tenors (no negative FTP in Ghana context)
- GRR must be validated against BoG published rate before curve construction
- Curve must be approved by ALCO before use in pricing
- Cross-currency basis must be validated against market data

#### Error Handling
- If GRR data missing > 2 hours → use last available, alert Treasury
- If T-Bill curve missing > 4 hours → use BoG policy rate as proxy, alert Treasury
- If curve inversion detected → amber alert, review with ALCO
- If daily change > 200bps → validate with market data, alert Risk Manager
- If BoG policy rate changes → automatic curve update, alert all business units

---

### 2.2 Deal-Level FTP Pricing Engine

#### Description
An interactive pricing tool that calculates the FTP rate, margin, and profitability for individual deals or product portfolios. Shows the decomposition into ITP, LTP, and CTP components. Uses Ghana Reference Rate for GHS-denominated products.

#### User Stories
- **As a Product Manager**, I want to price a new 5-year fixed-rate mortgage in GHS so that I can offer a competitive rate while ensuring profitability.
- **As a Business Unit Head**, I want to see the FTP-adjusted margin for my loan portfolio so that I can evaluate unit performance.
- **As a Treasurer**, I want to review all pricing exceptions so that I can ensure FTP policy compliance.

#### Acceptance Criteria
- [ ] Deal inputs: product type, notional, currency (GHS/USD/EUR/GBP), tenor, rate type (fixed/floating), customer segment
- [ ] FTP rate lookup by product, tenor, and currency
- [ ] Margin calculation: customer rate - FTP rate - credit margin - operational cost - regulatory cost
- [ ] Profitability indicators: ROE, RAROC, net interest margin (NIM)
- [ ] What-if analysis: adjust customer rate, tenor, or collateral
- [ ] Exception flagging: deals with margin < minimum threshold
- [ ] Portfolio view: aggregate profitability by product, segment, relationship manager
- [ ] Ghana-specific: GRR-based pricing for GHS, cross-currency pricing for FX

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Deal Pricing Calculator (Ghana Reference Rate)                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Product: [Mortgage Fixed ▼] │ Segment: [Retail ▼]         │  │
│  │ Notional: [500,000] │ Currency: [GHS ▼] │ Tenor: [5Y ▼]   │  │
│  │ Customer Rate: [30.00%] │ Fixed │ Collateral: [Property ▼]│  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Pricing Decomposition                                       │  │
│  │ Customer Rate:        30.00%                               │  │
│  │ - FTP Rate (5Y GHS):  29.00%  (GRR 25.5% + premium 3.5%)   │  │
│  │ - Credit Margin:      1.50%  (PD: 2.0%, LGD: 30%)         │  │
│  │ - Operational Cost:   0.50%                                │  │
│  │ - Regulatory Cost:    0.30%  (BoG levy, etc.)              │  │
│  │ = Net Margin:        -1.30%  ⚠️ LOSS                      │  │
│  │                                                            │  │
│  │ ROE: -5.2% │ RAROC: -3.8% │ Status: 🔴 Below Minimum    │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Recommendation: Increase customer rate to 32.00% or reduce │  │
│  │ operational cost to achieve 1.0% minimum margin.           │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Calculate] [Save Pricing] [Request Exception] [Clear]           │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Product parameters from MDM (behavioral maturity, core ratio)
- FTP curve from FTP manager (GHS, USD, EUR, GBP)
- Credit margin from ECL module (PD/LGD based)
- Operational cost from Finance (cost-to-income ratio)
- Capital allocation from Capital Management (economic capital)
- Regulatory cost from Compliance (BoG levies, taxes)

#### Calculation Logic / Business Rules
```python
# Deal pricing
if currency == "GHS":
    ftp_rate = ghs_ftp_curve(tenor)  # GRR-based
else:
    ftp_rate = fx_ftp_curve(currency, tenor)  # SOFR/EURIBOR-based

# Credit margin (simplified)
credit_margin = pd × lgd × capital_charge

# Operational cost (annualized)
operational_cost = cost_to_income_ratio × deal_size / total_assets

# Regulatory cost (Ghana-specific)
regulatory_cost = bog_levy + financial_sector_recovery_levy + other_taxes

# Net margin
net_margin = customer_rate - ftp_rate - credit_margin - operational_cost - regulatory_cost

# ROE calculation
roe = net_margin × deal_size / economic_capital_allocated

# Minimum margin check
if net_margin < minimum_margin_threshold:
    flag_exception(require_approval=True)
```

#### Validation Rules
- Net margin must be ≥ 0 for standard products (exceptions require approval)
- ROE must be ≥ cost of equity (typically 15-20% in Ghana)
- Customer rate must be ≥ FTP rate + minimum spread (anti-dumping rule)
- All pricing exceptions must be approved by Treasurer or ALCO
- GHS pricing must use GRR-based FTP curve
- FX pricing must use appropriate reference rate (SOFR, EURIBOR, SONIA)

#### Error Handling
- If FTP rate not available for tenor → interpolate, alert Treasury
- If credit margin calculation fails → use conservative estimate, alert Credit Risk
- If deal flagged as exception → block booking until approved
- If regulatory cost missing → use estimate based on prior period, alert Compliance

---

### 2.3 NMD Replicating Portfolio

#### Description
Models Non-Maturity Deposits (NMDs) as a portfolio of zero-coupon bonds with maturities matching the behavioral cash flow pattern. This "replicating portfolio" is used to calculate the FTP rate for NMDs and to hedge the interest rate risk. Uses BoG behavioral caps (core ratio ≤ 70%, deposit beta 0.2–0.8).

#### User Stories
- **As a Treasurer**, I want to see the NMD replicating portfolio allocation so that I can hedge the interest rate risk effectively.
- **As an IRRBB Risk Manager**, I want to compare the replicating portfolio yield to the actual deposit cost so that I can validate the model.
- **As an ALCO Member**, I want to see the endowment effect (FTP credit - actual deposit cost) so that I can understand NMD profitability.

#### Acceptance Criteria
- [ ] NMDs split into core (stable) and volatile components based on historical behavior
- [ ] Core ratio capped at 70% per BoG IRRBB Guideline
- [ ] Core component allocated across tenors (O/N, 3M, 6M, 1Y, 2Y, 3Y, 5Y, >5Y)
- [ ] Allocation weights based on historical balance volatility analysis
- [ ] Replicating portfolio yield calculated as weighted average FTP rate
- [ ] Endowment effect: replicating portfolio yield - actual deposit cost
- [ ] Hedge recommendation: IRS notional and tenor to match replicating portfolio
- [ ] Deposit beta validation: actual deposit cost change vs. GRR change

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  NMD Replicating Portfolio (Ghana Reference Rate)                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ NMD Balance: GHS 5.2bn │ Core: 70% (3.6bn) │ Volatile: 30% │  │
│  │ Core Ratio Cap: 70% (BoG max) │ Actual Core: 70% │ Status: ✅│  │
│  │ Replicating Portfolio Yield: 26.50% │ Actual Deposit Cost: 18.00%│  │
│  │ Endowment Effect: +8.50% │ Annual Benefit: GHS 306M         │  │
│  │ Deposit Beta: 0.60 (BoG range: 0.2–0.8) │ Status: ✅          │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Core Allocation by Tenor (Waterfall)                        │  │
│  │ Tenor  │ Allocation │ FTP Rate │ Weighted Contribution      │  │
│  │ O/N    │ 5%         │ 26.70%   │ 1.34%                      │  │
│  │ 3M     │ 10%        │ 27.40%   │ 2.74%                      │  │
│  │ 6M     │ 15%        │ 27.80%   │ 4.17%                      │  │
│  │ 1Y     │ 20%        │ 28.30%   │ 5.66%                      │  │
│  │ 2Y     │ 15%        │ 28.80%   │ 4.32%                      │  │
│  │ 3Y     │ 15%        │ 29.20%   │ 4.38%                      │  │
│  │ 5Y     │ 15%        │ 29.00%   │ 4.35%                      │  │
│  │ >5Y    │ 5%         │ 30.70%   │ 1.54%                      │  │
│  │ Total  │ 100%       │          │ 26.50%                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Hedge Recommendation                                        │  │
│  │ Recommended: Pay 26.50% fixed, receive 3M GRR on GHS 3.6bn│  │
│  │ Current Hedge: Pay 26.00% on GHS 2.8bn │ Gap: GHS 800M      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Recalculate] [View History] [Adjust Allocation] [Export]        │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- NMD balances by product (current, savings, SME)
- Historical balance volatility (standard deviation of monthly changes)
- Core ratio estimates from MDM (capped at 70% per BoG)
- FTP curve by tenor (GHS GRR-based)
- Actual deposit rates paid
- Ghana Reference Rate history for deposit beta validation

#### Calculation Logic / Business Rules
```python
# Core/volatile split (BoG cap)
core_ratio = min(historical_core_ratio, 0.70)  # BoG cap at 70%
core_balance = total_nmd × core_ratio
volatile_balance = total_nmd × (1 - core_ratio)

# Core allocation across tenors (example weights)
allocation = {
    'O/N': 0.05, '3M': 0.10, '6M': 0.15, '1Y': 0.20,
    '2Y': 0.15, '3Y': 0.15, '5Y': 0.15, '>5Y': 0.05
}

# Replicating portfolio yield (GHS GRR-based)
rp_yield = sum(allocation[tenor] × ghs_ftp_rate(tenor) for tenor in tenors)

# Endowment effect
endowment_effect = rp_yield - actual_deposit_cost
endowment_benefit = endowment_effect × core_balance

# Deposit beta validation
deposit_beta = (actual_deposit_cost_change) / (grr_change)
if deposit_beta < 0.2 or deposit_beta > 0.8:
    alert_model_risk("Deposit beta outside BoG range")
```

#### Validation Rules
- Core ratio must be ≤ 70% (BoG cap)
- Allocation weights must sum to 100%
- Replicating portfolio yield must be > actual deposit cost (positive endowment)
- Allocation must be reviewed annually and backtested quarterly
- Deposit beta must be between 0.2 and 0.8 (BoG range)

#### Audit & Compliance Requirements
- NMD replicating portfolio retained for 7 years
- Core ratio validation documented annually
- Deposit beta backtesting quarterly
- BoG may request NMD model documentation for inspection

---

### 2.4 FTP Profitability Reporting

#### Description
Generates FTP-adjusted profitability reports for business units, products, and customer segments. Enables true performance evaluation by stripping out rate, liquidity, and credit risk. Includes Ghana-specific cost allocations (BoG levies, financial sector recovery levy).

#### User Stories
- **As a Business Unit Head**, I want to see my unit's FTP-adjusted P&L so that I can evaluate true performance.
- **As a Finance Manager**, I want to reconcile FTP-adjusted P&L to statutory P&L so that I can ensure consistency.
- **As an ALCO Member**, I want to compare profitability across business units so that I can allocate capital.

#### Acceptance Criteria
- [ ] P&L decomposition: interest income/expense, FTP transfer, credit margin, liquidity margin, operational cost, regulatory cost
- [ ] Business unit view: assets, liabilities, net interest margin, ROE, RAROC
- [ ] Product view: profitability by product type
- [ ] Customer segment view: retail, SME, corporate, institutional
- [ ] Monthly and quarterly reporting cycles
- [ ] Reconciliation to statutory accounts
- [ ] Ghana-specific: BoG levy, financial sector recovery levy, other regulatory costs

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  FTP Profitability Report (Ghana Reference Rate)                  │
│  Period: [June 2026 ▼] │ Business Unit: [All ▼]                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Business Unit Performance                                   │  │
│  │ Unit        │ Assets  │ Liabs   │ NIM     │ ROE    │ Rank │  │
│  │ Retail      │ 8.5bn   │ 7.2bn   │ 8.5%    │ 18.2%  │ 1    │  │
│  │ Corporate   │ 4.2bn   │ 2.1bn   │ 6.5%    │ 14.8%  │ 2    │  │
│  │ SME         │ 2.8bn   │ 1.5bn   │ 7.5%    │ 12.5%  │ 3    │  │
│  │ Treasury    │ 1.5bn   │ 6.2bn   │ 2.5%    │ 9.2%   │ 4    │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ P&L Decomposition (Retail Unit Example)                    │  │
│  │ Interest Income:      GHS 245M                            │  │
│  │ - FTP Charge (Assets): GHS 185M                            │  │
│  │ = Net Interest Margin: GHS 60M                             │  │
│  │                                                            │  │
│  │ Interest Expense:     GHS 125M                             │  │
│  │ + FTP Credit (Liabs): GHS 165M                             │  │
│  │ = Net Interest Margin: GHS 40M                             │  │
│  │                                                            │  │
│  │ Total FTP-Adjusted NIM: GHS 100M                           │  │
│  │ - Operational Cost:   GHS 35M                              │  │
│  │ - Credit Cost:        GHS 15M                             │  │
│  │ - Regulatory Cost:    GHS 5M  (BoG levy, recovery levy)    │  │
│  │ = Pre-Tax Profit:     GHS 45M                              │  │
│  │ ROE: 18.2%                                               │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Export to Excel] [Drill Down] [View Reconciliation]           │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- GL balances and rates by business unit
- FTP rates from FTP curve (GHS, USD, EUR, GBP)
- Credit margins from ECL module
- Operational costs from Finance
- Regulatory costs from Compliance (BoG levies, taxes)
- Economic capital allocation from Capital Management

#### Calculation Logic / Business Rules
```python
# FTP-adjusted P&L for a business unit
asset_ftp_charge = sum(asset_balance × asset_ftp_rate for each_asset)
liability_ftp_credit = sum(liability_balance × liability_ftp_rate for each_liability)

net_interest_margin = (interest_income - asset_ftp_charge) + (liability_ftp_credit - interest_expense)

pre_tax_profit = net_interest_margin - operational_cost - credit_cost - regulatory_cost
roe = pre_tax_profit / economic_capital
```

#### Validation Rules
- Sum of all business unit profits must reconcile to statutory P&L (±2% tolerance)
- FTP-adjusted NIM must be positive for sustainable business units
- ROE must exceed cost of capital (15-20% in Ghana)
- All transfers must net to zero across the bank (Treasury = -sum of all units)
- Regulatory costs must be allocated correctly per BoG requirements

#### Audit & Compliance Requirements
- FTP profitability reports retained for 7 years
- Reconciliation to statutory accounts monthly
- Methodology reviewed annually by Finance and Risk
- BoG may request profitability reports for supervisory review

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **FTP_Curve** | FTP rate by tenor and currency | curve_id, date, currency, tenor, itp_rate, ltp_rate, credit_spread, total_ftp, reference_rate_type |
| **Deal_Pricing** | Individual deal pricing | deal_id, product_id, notional, currency, tenor, customer_rate, ftp_rate, credit_margin, operational_cost, regulatory_cost, net_margin, roe |
| **NMD_Portfolio** | NMD replicating portfolio | portfolio_id, product_id, core_ratio, core_ratio_cap, allocation_json, rp_yield, endowment_effect, deposit_beta |
| **FTP_Report** | Profitability report | report_id, period, business_unit, total_assets, total_liabilities, nim, roe, regulatory_cost, status |
| **GRR_History** | Ghana Reference Rate history | date, grr_rate, policy_rate, tbill_91d, tbill_182d, tbill_1y, tbill_2y, interbank_rate |

### 3.2 Key Attributes

**Deal_Pricing.net_margin**: The true economic margin after stripping out FTP, credit, operational, and regulatory costs. If negative, the deal destroys value and requires exception approval.

**NMD_Portfolio.allocation_json**: JSON object storing the percentage allocation across tenors. Must sum to 1.0 (100%). Updated annually based on historical balance analysis.

**NMD_Portfolio.deposit_beta**: Measures the sensitivity of deposit rates to GRR changes. Must be between 0.2 and 0.8 per BoG IRRBB Guideline.

**GRR_History.grr_rate**: Ghana Reference Rate published by BoG. Used as primary reference rate for GHS-denominated FTP curves.

### 3.3 Relationships

```
FTP_Curve (1) ──► Deal_Pricing (N)
FTP_Curve (1) ──► NMD_Portfolio (N)
Deal_Pricing (N) ──► FTP_Report (aggregated)
NMD_Portfolio (1) ──► Product (1)
GRR_History (N) ──► FTP_Curve (N) (GRR history feeds curve construction)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ftp/curve` | GET | Get current FTP curve |
| `/api/ftp/curve/{currency}` | GET | Get FTP curve for specific currency |
| `/api/ftp/curve/history` | GET | Get curve history |
| `/api/ftp/grr` | GET | Get current Ghana Reference Rate |
| `/api/ftp/grr/history` | GET | Get GRR history |
| `/api/ftp/pricing` | POST | Calculate deal pricing |
| `/api/ftp/nmd` | GET | Get NMD replicating portfolio |
| `/api/ftp/nmd/recalculate` | POST | Recalculate portfolio |
| `/api/ftp/reports/profitability` | GET | Get profitability report |
| `/api/ftp/reports/reconciliation` | GET | Reconcile to statutory P&L |
| `/api/ftp/reports/curve-change` | GET | FTP curve change notice |
| `/api/ftp/reports/ftp-by-product` | GET | FTP rates by product and tenor |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- FTP curve update: < 1 minute from market data
- Deal pricing calculation: < 1 second
- NMD portfolio recalculation: < 30 seconds
- Profitability report generation: < 2 minutes
- Historical queries: < 2 seconds for 1 year
- GRR change notification: < 5 minutes to all business units

### 5.2 Security
- FTP curve classified as internal use (confidential)
- Deal pricing data restricted to Treasury and Business Units
- Profitability reports restricted to Finance and ALCO
- All pricing exceptions logged with approver
- GRR data restricted to Treasury and Risk

### 5.3 Availability
- FTP curve: 99.95% (daily pricing requirement)
- Deal pricing: 99.9% (business use)
- Profitability reports: 99.5% (monthly cycle)
- GRR notification: 99.9% (critical for pricing)
- RTO: 2 hours

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| FTP Curve | Daily | Web UI | Treasury, Risk |
| GRR Change Notice | As needed | Email / Alert | All Business Units |
| Deal Pricing Sheet | On demand | Excel | Business Units |
| NMD Portfolio | Monthly | PDF | ALCO, Treasury |
| Profitability Report | Monthly | Excel/PDF | Business Units, Finance |
| FTP Policy Compliance | Quarterly | PDF | ALCO, Internal Audit |
| Pricing Exception Log | Monthly | Excel | Treasurer, CRO |
| FTP by Product & Tenor | Monthly | Excel | Business Units, Finance |
| Ghana Reference Rate History | Monthly | Excel | Treasury, Risk |

---

## 7. Appendices

### 7.1 Ghana Reference Rate (GRR) Methodology

| Component | Description | Source |
|-----------|-------------|--------|
| GRR Base | Weighted average of GoT-bill rates (91-day, 182-day, 1-year) | BoG |
| Adjustment | Bank-specific risk premium based on credit rating | Internal |
| Tenor Premium | Derived from T-Bill curve and swap spreads | Market data |
| Liquidity Premium | Based on bank's liquidity position | Internal model |

### 7.2 GoG T-Bill Curve Tenors

| Tenor | Description | Typical Range |
|-------|-------------|---------------|
| 91-Day | Short-term government borrowing | 20%–25% |
| 182-Day | Medium-term government borrowing | 22%–27% |
| 1-Year | Long-term government borrowing | 24%–29% |
| 2-Year | Long-term government borrowing | 25%–30% |

### 7.3 Cross-Currency Basis (Ghana)

| Currency Pair | Basis | Typical Range |
|---------------|-------|---------------|
| GHS/USD | Ghana country risk premium | 3%–5% |
| GHS/EUR | Ghana country risk premium | 3%–5% |
| GHS/GBP | Ghana country risk premium | 3%–5% |

### 7.4 Regulatory Cost Components (Ghana)

| Cost | Description | Rate |
|------|-------------|------|
| BoG Levy | Annual levy on total assets | 0.1%–0.3% |
| Financial Sector Recovery Levy | Post-banking crisis recovery | 0.05%–0.1% |
| Corporate Tax | Standard corporate income tax | 25% |
| National Fiscal Stabilization Levy | Additional fiscal levy | 0.5% |

### 7.5 Configuration Keys

| Key | Description | Default Value |
|-----|-------------|---------------|
| `ftp.grr.source` | Ghana Reference Rate source | BoG |
| `ftp.grr.update_frequency` | GRR update frequency | daily |
| `ftp.tbill.tenors` | T-Bill tenors for curve construction | 91d, 182d, 1y, 2y |
| `ftp.policy_rate.source` | BoG policy rate source | BoG |
| `ftp.interbank.source` | Interbank rate source | BoG |
| `ftp.currency.default` | Default currency for FTP | GHS |
| `ftp.nmd.core_ratio_cap` | BoG cap on NMD core ratio | 0.70 |
| `ftp.nmd.deposit_beta_min` | Minimum deposit beta | 0.20 |
| `ftp.nmd.deposit_beta_max` | Maximum deposit beta | 0.80 |
| `ftp.pricing.min_margin_pct` | Minimum net margin for deals | 1.0 |
| `ftp.pricing.min_roe_pct` | Minimum ROE for deals | 15.0 |
| `ftp.reporting.retention_years` | Retention period for reports | 7 |

---

*PRD v2.0 — Funds Transfer Pricing (FTP) — BoG Ghana Reference Rate / T-Bill Curve Framework*
