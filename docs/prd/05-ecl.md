# PRD: Expected Credit Loss (ECL / IFRS 9) — Ghana Macroeconomic Scenario Integration

## 1. Overview

### 1.1 Purpose

The Expected Credit Loss (ECL) module calculates lifetime expected credit losses in accordance with IFRS 9. It manages the three-stage classification model (Stage 1: 12-month ECL, Stage 2: Lifetime ECL, Stage 3: Credit-impaired), runs macroeconomic scenario analysis with Ghana-specific variables, applies management overlays, and tracks SICR (Significant Increase in Credit Risk) triggers. This module supports the bank's financial reporting, capital calculations, and risk management under the Bank of Ghana 2026 regulatory framework.

Key capabilities:
- **IFRS 9 compliance**: Three-stage ECL model with forward-looking macroeconomic scenarios
- **Ghana-specific scenarios**: GDP growth, inflation, BoG policy rate, GHS/USD, GoT-bill yield, cocoa/gold/oil prices
- **SICR monitoring**: PD deterioration, DPD, forbearance, watch list, rating downgrade
- **Overlay governance**: Management overlays with approval workflow and backtesting
- **Capital integration**: ECL provisions affect CET1 capital and RWA (through credit risk)
- **BoG reporting**: ECL data feeds into capital adequacy and stress testing returns

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **Credit Risk Manager** | Runs ECL calculations, validates staging, reviews overlays, manages Ghana macro scenarios |
| **Finance / Accounting** | Reviews ECL provisions, ensures IFRS 9 compliance, posts journal entries |
| **Model Validator** | Validates PD/LGD/EAD models, backtests quarterly, challenges Ghana macro assumptions |
| **ALCO Member** | Reviews ECL trends, approves overlays, sets provision policy, reviews scenario weights |
| **External Auditor** | Reviews ECL methodology, challenges assumptions, validates Ghana macro data |
| **Compliance Officer** | Ensures ECL data accuracy for BoG capital adequacy returns |

### 1.3 Dependencies

- **Data Foundation** (`01-data-foundation.md`): Loan data, counterparty data, collateral information, Ghana macroeconomic data
- **Capital Management** (`04-capital-management.md`): ECL provisions affect CET1 capital and RWA (through credit risk)
- **IRRBB** (`03-interest-rate-risk.md`): NII forecasts feed into forward-looking ECL calculations
- **Stress Testing** (`07-stress-testing.md`): Stress scenarios feed into ECL macro scenarios
- **GRC Risk Framework** (`09-grc-risk-framework.md`): Board-approved ECL policy, limit monitoring

---

## 2. Features

### 2.1 ECL Calculator (Three-Stage Model)

#### Description
The core ECL calculation engine that computes 12-month and lifetime expected credit losses for each instrument based on PD (Probability of Default), LGD (Loss Given Default), and EAD (Exposure at Default) estimates, discounted at the effective interest rate (EIR). Integrates with Ghana-specific macroeconomic scenarios for forward-looking projections.

#### User Stories
- **As a Credit Risk Manager**, I want to see the total ECL provision by stage so that I can assess credit risk trends.
- **As a Finance Manager**, I want to export the ECL journal entries so that I can post them to the GL.
- **As an ALCO Member**, I want to see the ECL trend over the last 12 months so that I can understand the provision impact on profitability.
- **As a Compliance Officer**, I want to ensure ECL data is accurate for BoG capital adequacy reporting.

#### Acceptance Criteria
- [ ] ECL formula: ECL = PD × LGD × EAD, discounted at EIR
- [ ] Stage 1: 12-month ECL for performing exposures (no SICR)
- [ ] Stage 2: Lifetime ECL for performing exposures with SICR
- [ ] Stage 3: Lifetime ECL for credit-impaired exposures (individually assessed)
- [ ] POCI (Purchased or Originated Credit Impaired): lifetime ECL, interest income on net amortized cost
- [ ] Forward-looking macroeconomic scenarios: base, upside, downside, severe (Ghana-specific variables)
- [ ] Probability-weighted average of scenario ECLs
- [ ] Daily batch calculation for all performing exposures
- [ ] Individual assessment for Stage 3 and material exposures (> threshold)
- [ ] Ghana-specific: sectoral PD adjustments for agriculture, mining, trade, construction
- [ ] Currency risk: ECL adjustment for FX-denominated loans based on GHS/USD volatility

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  ECL Calculator — IFRS 9 (Ghana Macroeconomic Integration)        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Total ECL: GHS 245M │ Stage 1: 45M │ Stage 2: 120M │ Stage 3: 80M │  │
│  │ Coverage Ratio: 1.85% │ vs Last Month: +15M │ Status: 🟡     │  │
│  │ Ghana Macro Scenario: Base (GDP +5.2%, Inflation 12.5%)      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ECL by Stage (Donut Chart)                                  │  │
│  │ [Stage 1: 18%] [Stage 2: 49%] [Stage 3: 33%]              │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Portfolio Breakdown                                         │  │
│  │ Segment     │ Exposure │ Stage 1 │ Stage 2 │ Stage 3 │ ECL │  │
│  │ Mortgages   │ 8.5bn    │ 7.2bn   │ 1.0bn   │ 0.3bn   │ 65M │  │
│  │ Corporate   │ 4.2bn    │ 3.5bn   │ 0.5bn   │ 0.2bn   │ 95M │  │
│  │ SME         │ 2.8bn    │ 2.2bn   │ 0.4bn   │ 0.2bn   │ 55M │  │
│  │ Consumer    │ 1.5bn    │ 1.2bn   │ 0.2bn   │ 0.1bn   │ 30M │  │
│  │ Agriculture │ 0.8bn    │ 0.6bn   │ 0.15bn  │ 0.05bn  │ 25M │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Run Calculation] [View Stage 3 Detail] [Export Journals]       │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Frequency |
|-------|--------|-----------|
| Loan balances and terms | Loan system | Daily EOD |
| PD term structures | Credit risk models | Monthly |
| LGD estimates | Workout / market data | Monthly |
| EAD (CCF for undrawn) | Credit models | Monthly |
| Collateral values | Collateral management | Monthly |
| Macroeconomic scenarios | Economics team / BoG | Quarterly |
| Ghana-specific variables | GSS, BoG, commodity markets | Monthly |
| EIR (Effective Interest Rate) | Loan system | At origination |
| SICR triggers | Credit monitoring | Daily |

#### Calculation Logic / Business Rules
```python
# ECL formula
def calculate_ecl(stage, pd_term_structure, lgd, ead, eir, remaining_months):
    if stage == 1:
        # 12-month ECL
        ecl = sum(pd_t × lgd × ead / (1 + eir)^t for t in range(1, 13))
    elif stage in [2, 3]:
        # Lifetime ECL
        ecl = sum(pd_t × lgd × ead / (1 + eir)^t for t in range(1, remaining_months + 1))
    return ecl

# SICR assessment
# SICR triggered if: PD at reporting date > PD at origination × threshold (typically 3x)
# OR: 30+ DPD
# OR: forbearance status
# OR: watch list classification
# OR: significant credit deterioration (internal rating downgrade ≥ 3 notches)

# Ghana-specific sectoral adjustments
if sector == "agriculture":
    pd_adjustment = pd × (1 + drought_risk_factor)
elif sector == "mining":
    pd_adjustment = pd × (1 + commodity_price_volatility)
elif sector == "trade":
    pd_adjustment = pd × (1 + ghs_usd_volatility)

# Scenario weighting (probability-weighted average)
base_ecl = calculate_ecl(scenario='base')
upside_ecl = calculate_ecl(scenario='upside')
downside_ecl = calculate_ecl(scenario='downside')
severe_ecl = calculate_ecl(scenario='severe')

weighted_ecl = (base_ecl × 0.50 + upside_ecl × 0.20 + 
                downside_ecl × 0.20 + severe_ecl × 0.10)
```

#### Validation Rules
- ECL must be ≥ 0 for all exposures
- Stage 3 ECL must be individually assessed for material exposures
- POCI assets must not have Stage 1/2/3 classification (separate category)
- SICR triggers must be consistent across all portfolios
- Macroeconomic scenarios must be plausible and internally consistent
- ECL must be discounted at EIR (not risk-free rate)
- Ghana macro variables must be within historically observed ranges
- Sectoral PD adjustments must be documented and backtested

#### Error Handling
- If PD/LGD data missing → use last available, alert Model Risk, flag as "stale"
- If macroeconomic scenario missing → use flat scenario (base case only), alert Economics team
- If ECL coverage ratio > 3% → amber alert, review portfolio quality
- If Stage 3 > 5% of total portfolio → red alert, trigger credit review
- If Ghana macro data missing → use prior period estimate, alert Data Engineering

#### Audit & Compliance Requirements
- IFRS 9 compliance: ECL methodology documented and approved by auditors
- PD/LGD models validated annually
- SICR criteria documented and applied consistently
- ECL sensitivity disclosed in annual financial statements
- Overlay governance: all overlays approved by ALCO, documented with rationale
- Ghana macro scenario data retained for 7 years
- BoG may request ECL data for supervisory review

---

### 2.2 Macroeconomic Scenario Manager

#### Description
Manages the macroeconomic scenarios used for forward-looking ECL calculations. Supports base, upside, downside, and severe scenarios with Ghana-specific variables: GDP growth, inflation, BoG policy rate, GHS/USD, GoT-bill yield, cocoa/gold/oil prices.

#### User Stories
- **As a Credit Risk Manager**, I want to update the GDP growth assumption for the downside scenario so that ECL reflects the latest Ghanaian economic outlook.
- **As a Model Validator**, I want to see the historical accuracy of our macroeconomic forecasts so that I can validate the scenario weights.
- **As an ALCO Member**, I want to compare ECL under different scenarios so that I can assess provision sensitivity.

#### Acceptance Criteria
- [ ] Four scenarios: Base (50%), Upside (20%), Downside (20%), Severe (10%)
- [ ] Ghana-specific variables per scenario: GDP growth, inflation, BoG policy rate, GHS/USD, GoT-bill yield, cocoa price, gold price, oil price
- [ ] Forecast horizon: 3-5 years (aligned with portfolio maturity)
- [ ] Scenario consistency: no logical contradictions (e.g., high GDP + high unemployment)
- [ ] Historical backtesting: compare scenario variables to actual outcomes
- [ ] ECL sensitivity: show ECL impact of ±1pp change in each variable
- [ ] Sectoral sensitivity: agriculture (drought), mining (commodity prices), trade (FX)

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Macroeconomic Scenario Manager (Ghana-Specific)                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Scenario Weights: Base 50% │ Upside 20% │ Downside 20% │ Severe 10% │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Scenario Variables (Year 1)                                 │  │
│  │ Variable        │ Base   │ Upside │ Downside │ Severe       │  │
│  │ GDP Growth      │ 5.2%   │ 7.0%   │ 3.0%     │ 0.0%         │  │
│  │ Inflation       │ 12.5%  │ 10.0%  │ 15.0%    │ 20.0%        │  │
│  │ BoG Policy Rate │ 26.0%  │ 22.0%  │ 30.0%    │ 35.0%        │  │
│  │ GHS/USD         │ 12.5   │ 11.0   │ 14.0     │ 16.0         │  │
│  │ 91-Day T-Bill   │ 24.8%  │ 22.0%  │ 28.0%    │ 32.0%        │  │
│  │ Cocoa Price     │ 3,500  │ 4,500  │ 2,500    │ 2,000        │  │
│  │ Gold Price      │ 2,000  │ 2,500  │ 1,500    │ 1,200        │  │
│  │ Oil Price       │ 80     │ 100    │ 60       │ 40           │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ECL Sensitivity by Variable                                   │  │
│  │ Variable        │ +1pp Change │ ECL Impact │                │  │
│  │ GDP Growth      │ +1.0%       │ -15M       │                │  │
│  │ Inflation       │ +1.0%       │ +20M       │                │  │
│  │ GHS/USD         │ +1.0        │ +25M       │                │  │
│  │ Cocoa Price     │ +100        │ -5M        │                │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Update Scenarios] [Run ECL] [View History] [Backtest]           │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Macroeconomic forecasts from Economics team or external vendor (GSS, BoG, Oxford Economics)
- Historical macroeconomic data (10+ years)
- Ghana-specific data: GSS, BoG, commodity markets (ICCO, LBMA, ICE)
- Scenario weights approved by ALCO
- Sensitivity analysis from credit risk models

#### Calculation Logic / Business Rules
```python
# Scenario consistency check
def validate_scenario(gdp, inflation, policy_rate, ghs_usd, cocoa, gold, oil):
    if gdp > 5.0 and inflation > 15.0:
        raise InconsistentScenario("High GDP with high inflation")
    if ghs_usd > 15.0 and gdp > 4.0:
        raise InconsistentScenario("Currency crisis with positive GDP")
    if cocoa < 2000 and gdp > 3.0:
        raise InconsistentScenario("Cocoa collapse with positive GDP")
    return True

# Sensitivity analysis (one variable at a time)
def sensitivity_ecl(variable, shock):
    base_ecl = calculate_ecl(scenario='base')
    shocked_ecl = calculate_ecl(scenario='base', **{variable: shock})
    return shocked_ecl - base_ecl
```

#### Validation Rules
- Scenario weights must sum to 100%
- At least 3 scenarios required (base + upside + downside)
- Variables must be within historically observed ranges
- Backtesting: forecast vs. actual within ±20% for GDP and inflation
- Ghana macro variables must be sourced from GSS or BoG

#### Error Handling
- Inconsistent scenario → reject, alert Economics team
- Missing scenario → use base case only, alert Risk Manager
- Backtesting failure → review model, adjust scenarios
- Missing Ghana macro data → use prior period, alert Data Engineering

---

### 2.3 SICR (Significant Increase in Credit Risk) Monitor

#### Description
A monitoring tool that identifies exposures transitioning from Stage 1 to Stage 2 based on SICR criteria. Tracks the SICR pipeline, analyzes backtesting results, and flags overrides. Includes Ghana-specific criteria for sectoral and currency risks.

#### User Stories
- **As a Credit Risk Manager**, I want to see which exposures are approaching SICR thresholds so that I can proactively manage them.
- **As a Model Validator**, I want to see the backtesting results for SICR triggers so that I can validate their predictive power.
- **As an ALCO Member**, I want to see the Stage 2 inflow trend so that I can assess portfolio quality.

#### Acceptance Criteria
- [ ] SICR criteria: PD deterioration (>3x origination PD), 30+ DPD, forbearance, watch list, 3+ notch downgrade
- [ ] Ghana-specific criteria: sectoral stress (agriculture drought, mining commodity collapse), FX risk (GHS/USD > 15)
- [ ] Pipeline view: exposures within 10% of SICR threshold
- [ ] Stage migration analysis: inflows to Stage 2, outflows to Stage 1, transfers to Stage 3
- [ ] Backtesting: SICR triggers vs. actual defaults 12 months later
- [ ] Override tracking: manual overrides with reason and approver
- [ ] Alert: daily notification of new Stage 2 inflows

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  SICR Monitor (Ghana-Specific Criteria)                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Stage 2 Inflows Today: 12 exposures │ GHS 45M             │  │
│  │ Stage 2 Outflows Today: 3 exposures │ GHS 8M              │  │
│  │ Net Stage 2 Change: +GHS 37M │ Coverage Impact: +2.1M   │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ SICR Pipeline (Approaching Threshold)                       │  │
│  │ Exposure ID │ Name      │ Current PD │ Orig PD │ Ratio │ Days │  │
│  │ EXP-4521    │ ABC Corp  │ 2.8%       │ 1.0%    │ 2.8x  │ 15   │  │
│  │ EXP-4522    │ XYZ Ltd   │ 5.2%       │ 2.0%    │ 2.6x  │ 22   │  │
│  │ EXP-4523    │ DEF Inc   │ 1.5%       │ 0.5%    │ 3.0x  │ 0    │  │
│  │ EXP-4524    │ Farm Co   │ 4.5%       │ 1.5%    │ 3.0x  │ 5    │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Ghana-Specific Triggers                                     │  │
│  │ Trigger              │ Count │ Amount │ Status              │  │
│  │ Agriculture Drought  │ 5     │ 25M    │ 🟡                  │  │
│  │ FX Risk (GHS/USD>15) │ 3     │ 18M    │ 🟡                  │  │
│  │ Mining Commodity     │ 2     │ 12M    │ 🟡                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Stage Migration Flow (Sankey Diagram)                       │  │
│  │ Stage 1 → Stage 2: 45M │ Stage 2 → Stage 3: 12M           │  │
│  │ Stage 2 → Stage 1: 8M  │ Stage 3 → Write-off: 5M          │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [View Details] [Override SICR] [Run Backtest] [Export]         │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Current PD estimates per exposure
- Origination PD per exposure
- DPD data from loan servicing
- Internal ratings from credit risk system
- Forbearance flags from collections system
- Watch list classifications
- Ghana-specific data: sector, currency, commodity exposure

#### Calculation Logic / Business Rules
```python
# SICR assessment
def assess_sicr(exposure):
    triggers = []
    
    # Criterion 1: PD deterioration
    if exposure.current_pd > exposure.origination_pd × 3.0:
        triggers.append("PD_DETERIORATION")
    
    # Criterion 2: 30+ DPD
    if exposure.days_past_due >= 30:
        triggers.append("30DPD")
    
    # Criterion 3: Forbearance
    if exposure.forbearance_status == "ACTIVE":
        triggers.append("FORBEARANCE")
    
    # Criterion 4: Rating downgrade
    if exposure.rating_downgrade_notches >= 3:
        triggers.append("RATING_DOWNGRADE")
    
    # Criterion 5: Watch list
    if exposure.watch_list == True:
        triggers.append("WATCH_LIST")
    
    # Ghana-specific criteria
    if exposure.sector == "agriculture" and drought_risk_index > 0.7:
        triggers.append("AGRICULTURE_DROUGHT")
    
    if exposure.currency == "USD" and ghs_usd > 15.0:
        triggers.append("FX_RISK")
    
    if exposure.sector == "mining" and commodity_price_drop > 30:
        triggers.append("COMMODITY_COLLAPSE")
    
    # SICR triggered if ANY criterion met
    if len(triggers) > 0:
        return True, triggers
    return False, []
```

#### Validation Rules
- All SICR criteria must be applied consistently across portfolios
- Overrides must be documented with business rationale and approved by Credit Risk Head
- Backtesting: SICR triggers should predict ~15-25% of defaults within 12 months
- False positive rate should be < 50% (to avoid excessive Stage 2 migration)
- Ghana-specific criteria must be validated against historical data

#### Error Handling
- If PD data missing → use last available, flag as "stale SICR assessment"
- If override not documented → reject override, alert Compliance
- If Stage 2 inflow > 1% of portfolio in a single day → amber alert, review criteria
- If Ghana-specific data missing → use conservative estimate, alert Data Engineering

---

### 2.4 ECL Overlay Governance

#### Description
A governance tool for managing management overlays to model-calculated ECL. Tracks overlay requests, approvals, backtesting, and retirement. Includes Ghana-specific overlays for sectoral risks and macroeconomic events.

#### User Stories
- **As a Credit Risk Manager**, I want to request an ECL overlay for a sector-specific risk not captured by the model so that I can reflect management judgment.
- **As an ALCO Member**, I want to see all active overlays and their backtesting results so that I can decide whether to continue or release them.
- **As an External Auditor**, I want to see the overlay rationale and approval chain so that I can assess their appropriateness.

#### Acceptance Criteria
- [ ] Overlay types: post-model adjustment (PMA), expert judgment, sector-specific, event-driven, Ghana macro
- [ ] Workflow: Request → Review (Model Risk) → Approve (ALCO) → Apply → Monitor → Retire
- [ ] Overlay attribution: amount, portfolio, rationale, expected duration
- [ ] Backtesting: compare overlay-adjusted ECL vs. actual losses
- [ ] Retirement: automatic review when overlay age > 12 months
- [ ] Dashboard: active overlays, total amount, % of total ECL
- [ ] Ghana-specific overlays: drought risk, commodity price risk, election uncertainty

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  ECL Overlay Governance (Ghana-Specific)                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Active Overlays: 5 │ Total Amount: GHS 28M │ % of ECL: 11.4% │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Overlay List                                                │  │
│  │ ID │ Type        │ Amount │ Portfolio  │ Age  │ Status      │  │
│  │ 1  │ Sector      │ 15M    │ Commercial │ 6M   │ Active      │  │
│  │ 2  │ PMA         │ 8M     │ Mortgages  │ 3M   │ Active      │  │
│  │ 3  │ Event       │ 5M     │ Consumer   │ 1M   │ Active      │  │
│  │ 4  │ Ghana Macro │ 3M     │ Agriculture│ 2M   │ Active      │  │
│  │ 5  │ Sector      │ 3M     │ CRE        │ 14M  │ Under Review│  │
│  │ 6  │ PMA         │ 2M     │ SME        │ 18M  │ Retired     │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Backtesting Results                                         │  │
│  │ Overlay │ Predicted │ Actual │ Variance │ Status          │  │
│  │ 1       │ 15M       │ 12M    │ +3M      │ Within Tolerance│  │
│  │ 2       │ 8M        │ 9M     │ -1M      │ Within Tolerance│  │
│  │ 3       │ 5M        │ 2M     │ +3M      │ Over-Estimate   │  │
│  │ 4       │ 3M        │ 4M     │ -1M      │ Within Tolerance│  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Request Overlay] [Review Active] [Run Backtest] [Export]        │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Model-calculated ECL by portfolio
- Management judgment inputs (sector outlook, event impacts)
- Actual loss data for backtesting
- ALCO meeting minutes (approval records)
- Ghana-specific data: drought index, commodity prices, election calendar

#### Calculation Logic / Business Rules
```python
# Overlay application
adjusted_ecl = model_ecl + overlay_amount

# Backtesting
overlay_accuracy = 1 - abs(overlay_predicted - actual_losses) / overlay_predicted

# Retirement criteria
if overlay_age > 12_months and overlay_accuracy < 0.5:
    trigger_retirement_review()

# Ghana-specific overlay examples
if drought_risk_index > 0.8:
    agriculture_overlay = agriculture_exposure × 0.05  # 5% overlay

if election_uncertainty_index > 0.7:
    political_overlay = total_exposure × 0.02  # 2% overlay
```

#### Validation Rules
- All overlays must be approved by ALCO
- Overlay amount must be ≤ 20% of model ECL for any portfolio
- Sector overlays must be supported by quantitative analysis
- Event overlays must have a defined trigger for retirement
- Ghana-specific overlays must be validated against historical events

#### Error Handling
- If overlay > 20% of model ECL → reject, require model enhancement instead
- If backtesting shows consistent over-estimation → reduce or retire overlay
- If overlay not reviewed within 12 months → flag for ALCO review
- If Ghana-specific overlay not validated → amber alert, require documentation

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **ECL_Calculation** | ECL result per exposure | calc_id, exposure_id, date, stage, pd_12m, pd_lifetime, lgd, ead, ecl_12m, ecl_lifetime, weighted_ecl, sector, currency |
| **Macro_Scenario** | Macroeconomic scenario | scenario_id, name, weight, gdp_growth, inflation, policy_rate, ghs_usd, tbill_91d, cocoa_price, gold_price, oil_price, credit_spread |
| **SICR_Trigger** | SICR event record | trigger_id, exposure_id, date, criterion, old_stage, new_stage, approved_by, ghana_specific_trigger |
| **ECL_Overlay** | Management overlay | overlay_id, type, amount, portfolio, rationale, requested_by, approved_by, date_applied, status, ghana_macro_factor |
| **ECL_Journal** | Accounting journal entry | journal_id, date, account, debit, credit, description, approved_by |
| **Ghana_Macro_Data** | Ghana macroeconomic data | date, gdp_growth, inflation, policy_rate, ghs_usd, tbill_91d, tbill_182d, tbill_1y, cocoa_price, gold_price, oil_price, drought_index |

### 3.2 Key Attributes

**ECL_Calculation.stage**: 1 (12-month ECL), 2 (lifetime ECL, SICR triggered), 3 (credit-impaired, lifetime ECL), POCI (purchased/originated credit-impaired).

**Macro_Scenario.weight**: Probability weight for scenario. All active scenario weights must sum to 1.0 (100%).

**Ghana_Macro_Data.drought_index**: Composite index measuring drought risk in Ghana (0–1). Used for agriculture sector PD adjustments.

**ECL_Overlay.ghana_macro_factor**: Ghana-specific macro factor that triggered the overlay (e.g., "drought", "commodity_collapse", "election_uncertainty").

### 3.3 Relationships

```
ECL_Calculation (N) ──► Macro_Scenario (N) (weighted average)
ECL_Calculation (N) ──► Ghana_Macro_Data (N) (Ghana macro data feeds ECL)
SICR_Trigger (N) ──► ECL_Calculation (triggers stage change)
ECL_Overlay (N) ──► ECL_Calculation (adjusts final ECL)
ECL_Calculation (N) ──► ECL_Journal (generates accounting entries)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ecl/calculation` | GET | Get ECL summary by stage |
| `/api/ecl/calculation/run` | POST | Trigger ECL batch calculation |
| `/api/ecl/scenarios` | GET | List macro scenarios |
| `/api/ecl/scenarios` | PUT | Update scenario parameters |
| `/api/ecl/ghana-macro` | GET | Get Ghana macroeconomic data |
| `/api/ecl/ghana-macro` | PUT | Update Ghana macro data |
| `/api/ecl/sicr` | GET | Get SICR pipeline |
| `/api/ecl/sicr/assess` | POST | Run SICR assessment |
| `/api/ecl/overlays` | GET | List active overlays |
| `/api/ecl/overlays` | POST | Request new overlay |
| `/api/ecl/journals` | GET | Get ECL journal entries |
| `/api/ecl/reports/ifrs9` | GET | Generate IFRS 9 disclosure report |
| `/api/ecl/reports/bog-capital` | GET | Generate ECL data for BoG capital adequacy return |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- ECL batch calculation: < 1 hour for full portfolio (100k+ exposures)
- SICR assessment: < 5 minutes for all exposures
- Overlay application: < 1 second
- Historical queries: < 2 seconds for 1 year
- Ghana macro data update: < 30 seconds

### 5.2 Security
- ECL data classified as strictly confidential
- Overlay approvals require dual authorization
- Journal entries immutable after posting
- IFRS 9 reports digitally signed
- Ghana macro data restricted to Risk and Economics teams

### 5.3 Availability
- ECL calculation: 99.5% (monthly requirement)
- SICR monitoring: 99.9% (daily requirement)
- Overlay governance: 99.5%
- Ghana macro data: 99.5% (monthly update)
- RTO: 2 hours

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| ECL Dashboard | Daily | Web UI | Credit Risk, Finance |
| IFRS 9 Disclosure | Quarterly | PDF | External Reporting → Auditors |
| ECL Journal Entries | Monthly | Excel | Finance → GL |
| SICR Pipeline | Daily | Email + Web | Credit Risk |
| Overlay Report | Monthly | PDF | ALCO |
| Macro Scenario Review | Quarterly | PDF | ALCO, Model Risk |
| Backtesting Report | Quarterly | PDF | Model Validation |
| Ghana Macro Data Summary | Monthly | Excel | Economics, Risk |
| BoG Capital Adequacy ECL Data | Quarterly | ORASS XML | Compliance → BoG |

---

## 7. Appendices

### 7.1 Ghana Macroeconomic Variables for ECL Scenarios

| Variable | Description | Typical Range | Source |
|----------|-------------|---------------|--------|
| GDP Growth | Real GDP growth rate | 3%–8% | GSS, BoG |
| Inflation | CPI inflation | 8%–15% | GSS |
| BoG Policy Rate | Monetary policy rate | 15%–30% | BoG |
| GHS/USD Exchange Rate | Cedi to US Dollar | 10–15 | BoG, Forex market |
| 91-Day T-Bill Yield | Short-term government yield | 20%–30% | BoG |
| 182-Day T-Bill Yield | Medium-term government yield | 22%–27% | BoG |
| 1-Year T-Bill Yield | Long-term government yield | 24%–29% | BoG |
| Cocoa Price | Global cocoa price (USD/ton) | 2,000–4,000 | ICCO, NYSE |
| Gold Price | Global gold price (USD/oz) | 1,500–2,500 | LBMA |
| Oil Price | Brent crude (USD/barrel) | 60–100 | ICE |
| Drought Index | Composite drought risk index | 0–1 | GMet, FAO |

### 7.2 Ghana-Specific SICR Triggers

| Trigger | Description | Threshold |
|---------|-------------|-----------|
| Agriculture Drought | Drought risk index exceeds threshold | Drought Index > 0.7 |
| FX Risk | GHS/USD exchange rate exceeds threshold | GHS/USD > 15.0 |
| Commodity Collapse | Commodity price drop exceeds threshold | Price drop > 30% |
| Election Uncertainty | Election-related political risk | Uncertainty Index > 0.7 |
| Sectoral Stress | Sector-specific stress event | Sector NPL > 10% |

### 7.3 Configuration Keys

| Key | Description | Default Value |
|-----|-------------|---------------|
| `ecl.scenario.base_weight` | Base scenario weight | 0.50 |
| `ecl.scenario.upside_weight` | Upside scenario weight | 0.20 |
| `ecl.scenario.downside_weight` | Downside scenario weight | 0.20 |
| `ecl.scenario.severe_weight` | Severe scenario weight | 0.10 |
| `ecl.sicr.pd_threshold` | PD deterioration threshold | 3.0 |
| `ecl.sicr.dpd_threshold` | DPD threshold for SICR | 30 |
| `ecl.sicr.rating_downgrade` | Rating downgrade threshold | 3 |
| `ecl.overlay.max_pct` | Maximum overlay % of model ECL | 20.0 |
| `ecl.overlay.review_months` | Overlay review period (months) | 12 |
| `ecl.ghana.drought_index_threshold` | Drought index threshold | 0.7 |
| `ecl.ghana.ghs_usd_threshold` | GHS/USD threshold for FX risk | 15.0 |
| `ecl.ghana.commodity_drop_threshold` | Commodity price drop threshold | 30.0 |
| `ecl.reporting.retention_years` | Retention period for ECL data | 7 |

---

*PRD v2.0 — Expected Credit Loss (ECL / IFRS 9) — Ghana Macroeconomic Scenario Integration*
