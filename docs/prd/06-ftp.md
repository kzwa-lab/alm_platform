# PRD: Funds Transfer Pricing (FTP)

## 1. Overview

### 1.1 Purpose

The Funds Transfer Pricing (FTP) module calculates the internal cost of funds for assets and the internal credit for liabilities, enabling accurate profitability measurement, business unit performance evaluation, and product pricing. It includes Liquidity Transfer Pricing (LTP) for liquidity risk, Interest Rate Transfer Pricing (ITP) for interest rate risk, and Credit Transfer Pricing (CTP) for credit risk. The FTP framework ensures that ALM centralizes and manages these risks while business units focus on customer relationships.

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **Treasurer** | Manages FTP curve, reviews LTP/ITP rates, approves pricing exceptions |
| **Business Unit Head** | Reviews FTP-adjusted profitability of their unit, negotiates pricing |
| **ALCO Member** | Reviews FTP policy, approves curve construction methodology |
| **Finance Manager** | Uses FTP for internal profitability reporting and budget allocation |
| **Product Manager** | Uses FTP for new product pricing and existing product review |

### 1.3 Dependencies

- **Data Foundation**: Contract-level rate data, maturity schedules, behavioral assumptions
- **IRRBB**: ITP curves derived from IRRBB yield curves
- **Liquidity Risk**: LTP charges based on LCR/NSFR metrics
- **ECL**: CTP credit margins based on PD/LGD estimates
- **Capital Management**: Economic capital allocation for ROE calculations

---

## 2. Features

### 2.1 FTP Curve Construction & Management

#### Description
The FTP curve is constructed from market yield curves with the bank's specific credit spread. It serves as the reference rate for pricing all assets and liabilities. The module supports multiple curves (ITP for rate risk, LTP for liquidity risk) and allows for historical curve analysis.

#### User Stories
- **As a Treasurer**, I want to update the FTP curve when market rates change so that product pricing reflects current funding costs.
- **As a Business Unit Head**, I want to see the FTP rate for a specific tenor so that I can price a new loan correctly.
- **As an ALCO Member**, I want to see how the FTP curve has changed over the last 6 months so that I can understand funding cost trends.

#### Acceptance Criteria
- [ ] FTP curve constructed from: risk-free curve (OIS/Swap) + bank credit spread
- [ ] Multiple curves: ITP (interest rate transfer pricing), LTP (liquidity transfer pricing)
- [ ] Tenors: O/N, 1W, 1M, 3M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 20Y, 30Y
- [ ] Daily update from market data feeds
- [ ] Historical view: compare today's curve to previous dates
- [ ] Curve validation: check for inversions, spikes, or missing tenors
- [ ] Curve approval workflow: constructed by Treasury, approved by ALCO

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  FTP Curve Manager                                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Curve Date: 2026-06-25 │ Last Updated: 08:00 CET │ Status: ✅ │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ FTP Curve Chart (Yield vs. Tenor)                          │  │
│  │ Today: ────────── │ Last Week: - - - - │ Last Month: ····│  │
│  │ 1M: 3.45% │ 3M: 3.52% │ 6M: 3.60% │ 1Y: 3.75% │ 5Y: 4.20%│  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ FTP Rate Table                                              │  │
│  │ Tenor │ ITP Rate │ LTP Rate │ Credit Spread │ Total FTP   │  │
│  │ O/N   │ 3.40%    │ 0.05%    │ 0.50%         │ 3.95%       │  │
│  │ 1M    │ 3.45%    │ 0.10%    │ 0.50%         │ 4.05%       │  │
│  │ 3M    │ 3.52%    │ 0.15%    │ 0.50%         │ 4.17%       │  │
│  │ 1Y    │ 3.75%    │ 0.25%    │ 0.50%         │ 4.50%       │  │
│  │ 5Y    │ 4.20%    │ 0.40%    │ 0.50%         │ 5.10%       │  │
│  │ 10Y   │ 4.50%    │ 0.50%    │ 0.50%         │ 5.50%       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Update Curve] [View History] [Approve] [Export]               │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Frequency |
|-------|--------|-----------|
| Risk-free curve (OIS/EURIBOR) | Market data | Intraday (hourly) |
| Bank CDS spread | Market data | Intraday |
| Liquidity premium | Internal model | Monthly |
| ALCO approval | ALCO meeting minutes | Per meeting |

#### Calculation Logic / Business Rules
```python
# FTP curve construction
ftp_rate(tenor) = risk_free_rate(tenor) + bank_credit_spread + liquidity_premium(tenor)

# Bank credit spread derived from CDS or bond yields
bank_credit_spread = avg(5Y_CDS, 5Y_bond_yield - 5Y_swap_rate)

# Liquidity premium increases with tenor
liquidity_premium(tenor) = base_premium × sqrt(tenor_in_years)
```

#### Validation Rules
- FTP curve must be upward sloping (or flat) — no inversion beyond 3M
- Daily change in any tenor must be < 50bps (spike detection)
- FTP rate must be > 0 for all tenors (no negative FTP)
- Curve must be approved by ALCO before use in pricing

#### Error Handling
- If market data missing > 2 hours → use last available, alert Treasury
- If curve inversion detected → amber alert, review with ALCO
- If daily change > 50bps → validate with market data, alert Risk Manager

---

### 2.2 Deal-Level FTP Pricing Engine

#### Description
An interactive pricing tool that calculates the FTP rate, margin, and profitability for individual deals or product portfolios. Shows the decomposition into ITP, LTP, and CTP components.

#### User Stories
- **As a Product Manager**, I want to price a new 5-year fixed-rate mortgage so that I can offer a competitive rate while ensuring profitability.
- **As a Business Unit Head**, I want to see the FTP-adjusted margin for my loan portfolio so that I can evaluate unit performance.
- **As a Treasurer**, I want to review all pricing exceptions so that I can ensure FTP policy compliance.

#### Acceptance Criteria
- [ ] Deal inputs: product type, notional, currency, tenor, rate type (fixed/floating), customer segment
- [ ] FTP rate lookup by product and tenor
- [ ] Margin calculation: customer rate - FTP rate - credit margin - operational cost
- [ ] Profitability indicators: ROE, RAROC, net interest margin (NIM)
- [ ] What-if analysis: adjust customer rate, tenor, or collateral
- [ ] Exception flagging: deals with margin < minimum threshold
- [ ] Portfolio view: aggregate profitability by product, segment, relationship manager

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Deal Pricing Calculator                                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Product: [Mortgage Fixed ▼] │ Segment: [Retail ▼]         │  │
│  │ Notional: [500,000] │ Currency: [EUR ▼] │ Tenor: [5Y ▼]  │  │
│  │ Customer Rate: [4.50%] │ Fixed │ Collateral: [Property ▼]  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Pricing Decomposition                                       │  │
│  │ Customer Rate:        4.50%                                │  │
│  │ - FTP Rate (5Y):      5.10%                                │  │
│  │ - Credit Margin:      0.30%  (PD: 0.5%, LGD: 20%)        │  │
│  │ - Operational Cost:   0.20%                                │  │
│  │ = Net Margin:        -1.10%  ⚠️ LOSS                      │  │
│  │                                                            │  │
│  │ ROE: -8.5% │ RAROC: -5.2% │ Status: 🔴 Below Minimum    │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Recommendation: Increase customer rate to 5.80% or reduce  │  │
│  │ operational cost to achieve 1.0% minimum margin.           │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Calculate] [Save Pricing] [Request Exception] [Clear]          │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Product parameters from MDM (behavioral maturity, core ratio)
- FTP curve from FTP manager
- Credit margin from ECL module (PD/LGD based)
- Operational cost from Finance (cost-to-income ratio)
- Capital allocation from Capital Management (economic capital)

#### Calculation Logic / Business Rules
```python
# Deal pricing
ftp_rate = ftp_curve(tenor)  # For fixed-rate, use tenor; for floating, use repricing tenor

# Credit margin (simplified)
credit_margin = pd × lgd × capital_charge

# Operational cost (annualized)
operational_cost = cost_to_income_ratio × deal_size / total_assets

# Net margin
net_margin = customer_rate - ftp_rate - credit_margin - operational_cost

# ROE calculation
roe = net_margin × deal_size / economic_capital_allocated

# Minimum margin check
if net_margin < minimum_margin_threshold:
    flag_exception(require_approval=True)
```

#### Validation Rules
- Net margin must be ≥ 0 for standard products (exceptions require approval)
- ROE must be ≥ cost of equity (typically 8-10%)
- Customer rate must be ≥ FTP rate + minimum spread (anti-dumping rule)
- All pricing exceptions must be approved by Treasurer or ALCO

#### Error Handling
- If FTP rate not available for tenor → interpolate, alert Treasury
- If credit margin calculation fails → use conservative estimate, alert Credit Risk
- If deal flagged as exception → block booking until approved

---

### 2.3 NMD Replicating Portfolio

#### Description
Models Non-Maturity Deposits (NMDs) as a portfolio of zero-coupon bonds with maturities matching the behavioral cash flow pattern. This "replicating portfolio" is used to calculate the FTP rate for NMDs and to hedge the interest rate risk.

#### User Stories
- **As a Treasurer**, I want to see the NMD replicating portfolio allocation so that I can hedge the interest rate risk effectively.
- **As an IRRBB Risk Manager**, I want to compare the replicating portfolio yield to the actual deposit cost so that I can validate the model.
- **As an ALCO Member**, I want to see the endowment effect (FTP credit - actual deposit cost) so that I can understand NMD profitability.

#### Acceptance Criteria
- [ ] NMDs split into core (stable) and volatile components based on historical behavior
- [ ] Core component allocated across tenors (O/N, 3M, 6M, 1Y, 2Y, 3Y, 5Y, >5Y)
- [ ] Allocation weights based on historical balance volatility analysis
- [ ] Replicating portfolio yield calculated as weighted average FTP rate
- [ ] Endowment effect: replicating portfolio yield - actual deposit cost
- [ ] Hedge recommendation: IRS notional and tenor to match replicating portfolio

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  NMD Replicating Portfolio                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ NMD Balance: EUR 5.2bn │ Core: 70% (3.6bn) │ Volatile: 30% │  │
│  │ Replicating Portfolio Yield: 3.85% │ Actual Deposit Cost: 1.20% │  │
│  │ Endowment Effect: +2.65% │ Annual Benefit: EUR 138M         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Core Allocation by Tenor (Waterfall)                        │  │
│  │ Tenor  │ Allocation │ FTP Rate │ Weighted Contribution      │  │
│  │ O/N    │ 5%         │ 3.40%    │ 0.17%                      │  │
│  │ 3M     │ 10%        │ 3.52%    │ 0.35%                      │  │
│  │ 6M     │ 15%        │ 3.60%    │ 0.54%                      │  │
│  │ 1Y     │ 20%        │ 3.75%    │ 0.75%                      │  │
│  │ 2Y     │ 15%        │ 3.90%    │ 0.59%                      │  │
│  │ 3Y     │ 15%        │ 4.05%    │ 0.61%                      │  │
│  │ 5Y     │ 15%        │ 4.20%    │ 0.63%                      │  │
│  │ >5Y    │ 5%         │ 4.50%    │ 0.23%                      │  │
│  │ Total  │ 100%       │          │ 3.85%                      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Hedge Recommendation                                        │  │
│  │ Recommended: Pay 3.85% fixed, receive 3M Euribor on EUR 3.6bn│  │
│  │ Current Hedge: Pay 3.75% on EUR 2.8bn │ Gap: EUR 800M      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Recalculate] [View History] [Adjust Allocation] [Export]       │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- NMD balances by product (current, savings, SME)
- Historical balance volatility (standard deviation of monthly changes)
- Core ratio estimates from MDM
- FTP curve by tenor
- Actual deposit rates paid

#### Calculation Logic / Business Rules
```python
# Core/volatile split
core_balance = total_nmd × core_ratio
volatile_balance = total_nmd × (1 - core_ratio)

# Core allocation across tenors (example weights)
allocation = {
    'O/N': 0.05, '3M': 0.10, '6M': 0.15, '1Y': 0.20,
    '2Y': 0.15, '3Y': 0.15, '5Y': 0.15, '>5Y': 0.05
}

# Replicating portfolio yield
rp_yield = sum(allocation[tenor] × ftp_rate(tenor) for tenor in tenors)

# Endowment effect
endowment_effect = rp_yield - actual_deposit_cost
endowment_benefit = endowment_effect × core_balance
```

#### Validation Rules
- Core ratio must be between 50% and 90% (based on historical analysis)
- Allocation weights must sum to 100%
- Replicating portfolio yield must be > actual deposit cost (positive endowment)
- Allocation must be reviewed annually and backtested quarterly

---

### 2.4 FTP Profitability Reporting

#### Description
Generates FTP-adjusted profitability reports for business units, products, and customer segments. Enables true performance evaluation by stripping out rate, liquidity, and credit risk.

#### User Stories
- **As a Business Unit Head**, I want to see my unit's FTP-adjusted P&L so that I can evaluate true performance.
- **As a Finance Manager**, I want to reconcile FTP-adjusted P&L to statutory P&L so that I can ensure consistency.
- **As an ALCO Member**, I want to compare profitability across business units so that I can allocate capital.

#### Acceptance Criteria
- [ ] P&L decomposition: interest income/expense, FTP transfer, credit margin, liquidity margin, operational cost
- [ ] Business unit view: assets, liabilities, net interest margin, ROE, RAROC
- [ ] Product view: profitability by product type
- [ ] Customer segment view: retail, SME, corporate, institutional
- [ ] Monthly and quarterly reporting cycles
- [ ] Reconciliation to statutory accounts

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  FTP Profitability Report                                         │
│  Period: [June 2026 ▼] │ Business Unit: [All ▼]               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Business Unit Performance                                   │  │
│  │ Unit        │ Assets  │ Liabs   │ NIM     │ ROE    │ Rank │  │
│  │ Retail      │ 8.5bn   │ 7.2bn   │ 2.85%   │ 14.2%  │ 1    │  │
│  │ Corporate   │ 4.2bn   │ 2.1bn   │ 1.95%   │ 11.8%  │ 2    │  │
│  │ SME         │ 2.8bn   │ 1.5bn   │ 2.45%   │ 10.5%  │ 3    │  │
│  │ Treasury    │ 1.5bn   │ 6.2bn   │ 0.55%   │ 8.2%   │ 4    │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ P&L Decomposition (Retail Unit Example)                    │  │
│  │ Interest Income:      EUR 245M                             │  │
│  │ - FTP Charge (Assets): EUR 185M                            │  │
│  │ = Net Interest Margin: EUR 60M                             │  │
│  │                                                            │  │
│  │ Interest Expense:     EUR 125M                             │  │
│  │ + FTP Credit (Liabs): EUR 165M                             │  │
│  │ = Net Interest Margin: EUR 40M                             │  │
│  │                                                            │  │
│  │ Total FTP-Adjusted NIM: EUR 100M                           │  │
│  │ - Operational Cost:   EUR 35M                              │  │
│  │ - Credit Cost:        EUR 15M                              │  │
│  │ = Pre-Tax Profit:     EUR 50M                              │  │
│  │ ROE: 14.2%                                               │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Export to Excel] [Drill Down] [View Reconciliation]           │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- GL balances and rates by business unit
- FTP rates from FTP curve
- Credit margins from ECL module
- Operational costs from Finance
- Economic capital allocation from Capital Management

#### Calculation Logic / Business Rules
```python
# FTP-adjusted P&L for a business unit
asset_ftp_charge = sum(asset_balance × asset_ftp_rate for each_asset)
liability_ftp_credit = sum(liability_balance × liability_ftp_rate for each_liability)

net_interest_margin = (interest_income - asset_ftp_charge) + (liability_ftp_credit - interest_expense)

pre_tax_profit = net_interest_margin - operational_cost - credit_cost
roe = pre_tax_profit / economic_capital
```

#### Validation Rules
- Sum of all business unit profits must reconcile to statutory P&L (±2% tolerance)
- FTP-adjusted NIM must be positive for sustainable business units
- ROE must exceed cost of capital (8-10%) for capital allocation
- All transfers must net to zero across the bank (Treasury = -sum of all units)

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **FTP_Curve** | FTP rate by tenor | curve_id, date, tenor, itp_rate, ltp_rate, credit_spread, total_ftp |
| **Deal_Pricing** | Individual deal pricing | deal_id, product_id, notional, tenor, customer_rate, ftp_rate, credit_margin, operational_cost, net_margin, roe |
| **NMD_Portfolio** | NMD replicating portfolio | portfolio_id, product_id, core_ratio, allocation_json, rp_yield, endowment_effect |
| **FTP_Report** | Profitability report | report_id, period, business_unit, total_assets, total_liabilities, nim, roe, status |

### 3.2 Key Attributes

**Deal_Pricing.net_margin**: The true economic margin after stripping out FTP, credit, and operational costs. If negative, the deal destroys value and requires exception approval.

**NMD_Portfolio.allocation_json**: JSON object storing the percentage allocation across tenors. Must sum to 1.0 (100%). Updated annually based on historical balance analysis.

### 3.3 Relationships

```
FTP_Curve (1) ──► Deal_Pricing (N)
FTP_Curve (1) ──► NMD_Portfolio (N)
Deal_Pricing (N) ──► FTP_Report (aggregated)
NMD_Portfolio (1) ──► Product (1)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ftp/curve` | GET | Get current FTP curve |
| `/api/ftp/curve/history` | GET | Get curve history |
| `/api/ftp/pricing` | POST | Calculate deal pricing |
| `/api/ftp/nmd` | GET | Get NMD replicating portfolio |
| `/api/ftp/nmd/recalculate` | POST | Recalculate portfolio |
| `/api/ftp/reports/profitability` | GET | Get profitability report |
| `/api/ftp/reports/reconciliation` | GET | Reconcile to statutory P&L |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- FTP curve update: < 1 minute from market data
- Deal pricing calculation: < 1 second
- NMD portfolio recalculation: < 30 seconds
- Profitability report generation: < 2 minutes
- Historical queries: < 2 seconds for 1 year

### 5.2 Security
- FTP curve classified as internal use (confidential)
- Deal pricing data restricted to Treasury and Business Units
- Profitability reports restricted to Finance and ALCO
- All pricing exceptions logged with approver

### 5.3 Availability
- FTP curve: 99.95% (daily pricing requirement)
- Deal pricing: 99.9% (business use)
- Profitability reports: 99.5% (monthly cycle)
- RTO: 2 hours

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| FTP Curve | Daily | Web UI | Treasury, Risk |
| Deal Pricing Sheet | On demand | Excel | Business Units |
| NMD Portfolio | Monthly | PDF | ALCO, Treasury |
| Profitability Report | Monthly | Excel/PDF | Business Units, Finance |
| FTP Policy Compliance | Quarterly | PDF | ALCO, Internal Audit |
| Pricing Exception Log | Monthly | Excel | Treasurer, CRO |

---

*PRD v1.0 — Funds Transfer Pricing (FTP) Module*
