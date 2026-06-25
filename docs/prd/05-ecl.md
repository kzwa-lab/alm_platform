# PRD: Expected Credit Loss (ECL / IFRS 9)

## 1. Overview

### 1.1 Purpose

The Expected Credit Loss (ECL) module calculates lifetime expected credit losses in accordance with IFRS 9. It manages the three-stage classification model (Stage 1: 12-month ECL, Stage 2: Lifetime ECL, Stage 3: Credit-impaired), runs macroeconomic scenario analysis, applies management overlays, and tracks SICR (Significant Increase in Credit Risk) triggers. This module supports the bank's financial reporting, capital calculations, and risk management.

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **Credit Risk Manager** | Runs ECL calculations, validates staging, reviews overlays |
| **Finance / Accounting** | Reviews ECL provisions, ensures IFRS 9 compliance |
| **Model Validator** | Validates PD/LGD/EAD models, backtests quarterly |
| **ALCO Member** | Reviews ECL trends, approves overlays, sets provision policy |
| **External Auditor** | Reviews ECL methodology, challenges assumptions |

### 1.3 Dependencies

- **Data Foundation**: Loan data, counterparty data, collateral information, macroeconomic data
- **Capital Management**: ECL provisions affect CET1 capital and RWA (through credit risk)
- **IRRBB**: NII forecasts feed into forward-looking ECL calculations

---

## 2. Features

### 2.1 ECL Calculator (Three-Stage Model)

#### Description
The core ECL calculation engine that computes 12-month and lifetime expected credit losses for each instrument based on PD (Probability of Default), LGD (Loss Given Default), and EAD (Exposure at Default) estimates, discounted at the effective interest rate (EIR).

#### User Stories
- **As a Credit Risk Manager**, I want to see the total ECL provision by stage so that I can assess credit risk trends.
- **As a Finance Manager**, I want to export the ECL journal entries so that I can post them to the GL.
- **As an ALCO Member**, I want to see the ECL trend over the last 12 months so that I can understand the provision impact on profitability.

#### Acceptance Criteria
- [ ] ECL formula: ECL = PD × LGD × EAD, discounted at EIR
- [ ] Stage 1: 12-month ECL for performing exposures (no SICR)
- [ ] Stage 2: Lifetime ECL for performing exposures with SICR
- [ ] Stage 3: Lifetime ECL for credit-impaired exposures (individually assessed)
- [ ] POCI (Purchased or Originated Credit Impaired): lifetime ECL, interest income on net amortized cost
- [ ] Forward-looking macroeconomic scenarios: base, upside, downside, severe
- [ ] Probability-weighted average of scenario ECLs
- [ ] Daily batch calculation for all performing exposures
- [ ] Individual assessment for Stage 3 and material exposures (> threshold)

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  ECL Calculator — IFRS 9                                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Total ECL: EUR 245M │ Stage 1: 45M │ Stage 2: 120M │ Stage 3: 80M │  │
│  │ Coverage Ratio: 1.85% │ vs Last Month: +15M │ Status: 🟡     │  │
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
| Macroeconomic scenarios | Economics team / vendor | Quarterly |
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

#### Error Handling
- If PD/LGD data missing → use last available, alert Model Risk, flag as "stale"
- If macroeconomic scenario missing → use flat scenario (base case only), alert Economics team
- If ECL coverage ratio > 3% → amber alert, review portfolio quality
- If Stage 3 > 5% of total portfolio → red alert, trigger credit review

#### Audit & Compliance Requirements
- IFRS 9 compliance: ECL methodology documented and approved by auditors
- PD/LGD models validated annually
- SICR criteria documented and applied consistently
- ECL sensitivity disclosed in annual financial statements
- Overlay governance: all overlays approved by ALCO, documented with rationale

---

### 2.2 Macroeconomic Scenario Manager

#### Description
Manages the macroeconomic scenarios used for forward-looking ECL calculations. Supports base, upside, downside, and severe scenarios with GDP, unemployment, interest rate, and house price variables.

#### User Stories
- **As a Credit Risk Manager**, I want to update the GDP growth assumption for the downside scenario so that ECL reflects the latest economic outlook.
- **As a Model Validator**, I want to see the historical accuracy of our macroeconomic forecasts so that I can validate the scenario weights.
- **As an ALCO Member**, I want to compare ECL under different scenarios so that I can assess provision sensitivity.

#### Acceptance Criteria
- [ ] Four scenarios: Base (50%), Upside (20%), Downside (20%), Severe (10%)
- [ ] Variables per scenario: GDP growth, unemployment rate, interest rates (3M, 10Y), HPI growth, credit spread
- [ ] Forecast horizon: 3-5 years (aligned with portfolio maturity)
- [ ] Scenario consistency: no logical contradictions (e.g., high GDP + high unemployment)
- [ ] Historical backtesting: compare scenario variables to actual outcomes
- [ ] ECL sensitivity: show ECL impact of ±1pp change in each variable

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Macroeconomic Scenario Manager                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Scenario Weights: Base 50% │ Upside 20% │ Downside 20% │ Severe 10% │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Scenario Variables (Year 1)                                 │  │
│  │ Variable      │ Base   │ Upside │ Downside │ Severe       │  │
│  │ GDP Growth    │ 2.1%   │ 3.5%   │ 0.5%     │ -2.0%        │  │
│  │ Unemployment  │ 5.2%   │ 4.0%   │ 7.5%     │ 10.0%        │  │
│  │ 3M Rate       │ 3.50%  │ 4.50%  │ 2.00%    │ 0.50%        │  │
│  │ 10Y Rate      │ 2.80%  │ 3.50%  │ 2.00%    │ 1.50%        │  │
│  │ HPI Growth    │ 3.0%   │ 6.0%   │ -2.0%    │ -10.0%       │  │
│  │ Credit Spread │ 150bps │ 100bps │ 300bps   │ 500bps       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ECL Sensitivity by Variable                                 │  │
│  │ Variable      │ +1pp Change │ ECL Impact │                  │  │
│  │ GDP Growth    │ +1.0%       │ -12M       │                  │  │
│  │ Unemployment  │ +1.0%       │ +18M       │                  │  │
│  │ HPI Growth    │ +1.0%       │ -8M        │                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Update Scenarios] [Run ECL] [View History] [Backtest]         │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Macroeconomic forecasts from Economics team or external vendor (Oxford Economics, Moody's)
- Historical macroeconomic data (10+ years)
- Scenario weights approved by ALCO
- Sensitivity analysis from credit risk models

#### Calculation Logic / Business Rules
```python
# Scenario consistency check
def validate_scenario(gdp, unemployment, rates, hpi):
    if gdp > 2.0 and unemployment > 7.0:
        raise InconsistentScenario("High GDP with high unemployment")
    if hpi < -5.0 and gdp > 1.0:
        raise InconsistentScenario("Housing crash with positive GDP")
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
- Backtesting: forecast vs. actual within ±20% for GDP and unemployment

#### Error Handling
- Inconsistent scenario → reject, alert Economics team
- Missing scenario → use base case only, alert Risk Manager
- Backtesting failure → review model, adjust scenarios

---

### 2.3 SICR (Significant Increase in Credit Risk) Monitor

#### Description
A monitoring tool that identifies exposures transitioning from Stage 1 to Stage 2 based on SICR criteria. Tracks the SICR pipeline, analyzes backtesting results, and flags overrides.

#### User Stories
- **As a Credit Risk Manager**, I want to see which exposures are approaching SICR thresholds so that I can proactively manage them.
- **As a Model Validator**, I want to see the backtesting results for SICR triggers so that I can validate their predictive power.
- **As an ALCO Member**, I want to see the Stage 2 inflow trend so that I can assess portfolio quality.

#### Acceptance Criteria
- [ ] SICR criteria: PD deterioration (>3x origination PD), 30+ DPD, forbearance, watch list, 3+ notch downgrade
- [ ] Pipeline view: exposures within 10% of SICR threshold
- [ ] Stage migration analysis: inflows to Stage 2, outflows to Stage 1, transfers to Stage 3
- [ ] Backtesting: SICR triggers vs. actual defaults 12 months later
- [ ] Override tracking: manual overrides with reason and approver
- [ ] Alert: daily notification of new Stage 2 inflows

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  SICR Monitor                                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Stage 2 Inflows Today: 12 exposures │ EUR 45M             │  │
│  │ Stage 2 Outflows Today: 3 exposures │ EUR 8M              │  │
│  │ Net Stage 2 Change: +EUR 37M │ Coverage Impact: +2.1M   │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ SICR Pipeline (Approaching Threshold)                       │  │
│  │ Exposure ID │ Name      │ Current PD │ Orig PD │ Ratio │ Days │  │
│  │ EXP-4521    │ ABC Corp  │ 2.8%       │ 1.0%    │ 2.8x  │ 15   │  │
│  │ EXP-4522    │ XYZ Ltd   │ 5.2%       │ 2.0%    │ 2.6x  │ 22   │  │
│  │ EXP-4523    │ DEF Inc   │ 1.5%       │ 0.5%    │ 3.0x  │ 0    │  │
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

#### Error Handling
- If PD data missing → use last available, flag as "stale SICR assessment"
- If override not documented → reject override, alert Compliance
- If Stage 2 inflow > 1% of portfolio in a single day → amber alert, review criteria

---

### 2.4 ECL Overlay Governance

#### Description
A governance tool for managing management overlays to model-calculated ECL. Tracks overlay requests, approvals, backtesting, and retirement.

#### User Stories
- **As a Credit Risk Manager**, I want to request an ECL overlay for a sector-specific risk not captured by the model so that I can reflect management judgment.
- **As an ALCO Member**, I want to see all active overlays and their backtesting results so that I can decide whether to continue or release them.
- **As an External Auditor**, I want to see the overlay rationale and approval chain so that I can assess their appropriateness.

#### Acceptance Criteria
- [ ] Overlay types: post-model adjustment (PMA), expert judgment, sector-specific, event-driven
- [ ] Workflow: Request → Review (Model Risk) → Approve (ALCO) → Apply → Monitor → Retire
- [ ] Overlay attribution: amount, portfolio, rationale, expected duration
- [ ] Backtesting: compare overlay-adjusted ECL vs. actual losses
- [ ] Retirement: automatic review when overlay age > 12 months
- [ ] Dashboard: active overlays, total amount, % of total ECL

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  ECL Overlay Governance                                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Active Overlays: 5 │ Total Amount: EUR 28M │ % of ECL: 11.4% │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Overlay List                                                │  │
│  │ ID │ Type      │ Amount │ Portfolio  │ Age  │ Status      │  │
│  │ 1  │ Sector    │ 15M    │ Commercial │ 6M   │ Active      │  │
│  │ 2  │ PMA       │ 8M     │ Mortgages  │ 3M   │ Active      │  │
│  │ 3  │ Event     │ 5M     │ Consumer   │ 1M   │ Active      │  │
│  │ 4  │ Sector    │ 3M     │ CRE        │ 14M  │ Under Review│  │
│  │ 5  │ PMA       │ 2M     │ SME        │ 18M  │ Retired     │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Backtesting Results                                         │  │
│  │ Overlay │ Predicted │ Actual │ Variance │ Status          │  │
│  │ 1       │ 15M       │ 12M    │ +3M      │ Within Tolerance│  │
│  │ 2       │ 8M        │ 9M     │ -1M      │ Within Tolerance│  │
│  │ 3       │ 5M        │ 2M     │ +3M      │ Over-Estimate   │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Request Overlay] [Review Active] [Run Backtest] [Export]      │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Model-calculated ECL by portfolio
- Management judgment inputs (sector outlook, event impacts)
- Actual loss data for backtesting
- ALCO meeting minutes (approval records)

#### Calculation Logic / Business Rules
```python
# Overlay application
adjusted_ecl = model_ecl + overlay_amount

# Backtesting
overlay_accuracy = 1 - abs(overlay_predicted - actual_losses) / overlay_predicted

# Retirement criteria
if overlay_age > 12_months and overlay_accuracy < 0.5:
    trigger_retirement_review()
```

#### Validation Rules
- All overlays must be approved by ALCO
- Overlay amount must be ≤ 20% of model ECL for any portfolio
- Sector overlays must be supported by quantitative analysis
- Event overlays must have a defined trigger for retirement

#### Error Handling
- If overlay > 20% of model ECL → reject, require model enhancement instead
- If backtesting shows consistent over-estimation → reduce or retire overlay
- If overlay not reviewed within 12 months → flag for ALCO review

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **ECL_Calculation** | ECL result per exposure | calc_id, exposure_id, date, stage, pd_12m, pd_lifetime, lgd, ead, ecl_12m, ecl_lifetime, weighted_ecl |
| **Macro_Scenario** | Macroeconomic scenario | scenario_id, name, weight, gdp_growth, unemployment, rate_3m, rate_10y, hpi_growth, credit_spread |
| **SICR_Trigger** | SICR event record | trigger_id, exposure_id, date, criterion, old_stage, new_stage, approved_by |
| **ECL_Overlay** | Management overlay | overlay_id, type, amount, portfolio, rationale, requested_by, approved_by, date_applied, status |
| **ECL_Journal** | Accounting journal entry | journal_id, date, account, debit, credit, description, approved_by |

### 3.2 Key Attributes

**ECL_Calculation.stage**: 1 (12-month ECL), 2 (lifetime ECL, SICR triggered), 3 (credit-impaired, lifetime ECL), POCI (purchased/originated credit-impaired).

**Macro_Scenario.weight**: Probability weight for scenario. All active scenario weights must sum to 1.0 (100%).

### 3.3 Relationships

```
ECL_Calculation (N) ──► Macro_Scenario (N) (weighted average)
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
| `/api/ecl/sicr` | GET | Get SICR pipeline |
| `/api/ecl/sicr/assess` | POST | Run SICR assessment |
| `/api/ecl/overlays` | GET | List active overlays |
| `/api/ecl/overlays` | POST | Request new overlay |
| `/api/ecl/journals` | GET | Get ECL journal entries |
| `/api/ecl/reports/ifrs9` | GET | Generate IFRS 9 disclosure report |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- ECL batch calculation: < 1 hour for full portfolio (100k+ exposures)
- SICR assessment: < 5 minutes for all exposures
- Overlay application: < 1 second
- Historical queries: < 2 seconds for 1 year

### 5.2 Security
- ECL data classified as strictly confidential
- Overlay approvals require dual authorization
- Journal entries immutable after posting
- IFRS 9 reports digitally signed

### 5.3 Availability
- ECL calculation: 99.5% (monthly requirement)
- SICR monitoring: 99.9% (daily requirement)
- Overlay governance: 99.5%
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

---

*PRD v1.0 — Expected Credit Loss (ECL) Module*
