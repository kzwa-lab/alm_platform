# PRD: Capital Management & RWA Engine (BoG ICAAP / Capital Adequacy Framework)

## 1. Overview

### 1.1 Purpose

The Capital Management & RWA Engine calculates regulatory capital ratios (CET1, Tier 1, Total Capital, Leverage Ratio) under the Bank of Ghana 2026 Capital Adequacy Framework. It computes Risk-Weighted Assets (RWA) under the Standardized Approach (SA) for credit, market, and operational risk, tracks capital buffers (capital conservation, countercyclical, systemic risk), and supports the Internal Capital Adequacy Assessment Process (ICAAP) including Pillar 2 add-ons for IRRBB, concentration risk, and other material risks. The module ensures the bank maintains adequate capital buffers above BoG minimum requirements and supports strategic capital planning, dividend policy, and capital issuance decisions.

Key capabilities:
- **BoG Capital Adequacy Framework**: CET1, Tier 1, Total Capital ratios per BoG minimum requirements
- **Standardized Approach RWA**: Credit risk (corporate, retail, sovereign, bank, SME), market risk (standardized), operational risk (BIA/TSA/ASA)
- **Capital buffers**: Capital conservation (2.5%), countercyclical (0–2.5%), systemic risk (D-SIB surcharge)
- **ICAAP**: Pillar 1 + Pillar 2A (supervisory) + Pillar 2B (internal) capital requirements
- **Pillar 2 add-ons**: IRRBB, concentration risk, liquidity risk, operational risk, strategic risk, reputational risk
- **Leverage ratio**: Tier 1 / total exposure (minimum 3%)
- **Capital planning**: 3-year projection, stress testing, dividend policy simulation, issuance planning
- **BoG quarterly reporting**: Capital adequacy returns via ORASS

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **CRO** | Reviews capital adequacy, approves ICAAP, presents to Board, ensures Pillar 2 add-ons are justified |
| **Capital Manager** | Runs RWA calculations, validates model outputs, produces capital reports, manages ICAAP documentation |
| **ALCO Member** | Reviews capital ratios at meetings, approves capital allocation, dividend policy |
| **Compliance Officer** | Ensures regulatory reporting accuracy, submits BoG capital adequacy returns via ORASS |
| **Model Validator** | Validates credit risk models, PD/LGD estimates, backtests annually |
| **Treasurer** | Manages capital instruments (AT1, T2), plans issuance, tracks eligibility |
| **Board Risk Committee** | Reviews and approves ICAAP annually, sets capital risk appetite |

### 1.3 Dependencies

- **Data Foundation** (`01-data-foundation.md`): GL balances, counterparty data, credit ratings, exposure data, Ghana-specific risk weights
- **ECL Module** (future): Stage assignments and PD estimates feed into credit risk RWA
- **IRRBB Module** (`03-interest-rate-risk.md`): EVE impact affects Pillar 2B capital requirement for IRRBB
- **Liquidity Risk** (`02-liquidity-risk.md`): HQLA holdings affect leverage ratio denominator; liquidity risk Pillar 2B add-on
- **Stress Testing** (`07-stress-testing.md`): Stress scenarios feed into ICAAP and capital planning
- **GRC Risk Framework** (`09-grc-risk-framework.md`): Board-approved capital risk appetite, limit monitoring
- **Regulatory Reporting** (`10-regulatory-reporting-orass.md`): BoG capital adequacy quarterly returns

---

## 2. Features

### 2.1 Capital Ratio Dashboard

#### Description
A real-time dashboard showing all key capital ratios with traffic light indicators, trend analysis, and buffer headroom calculations. Aligned with BoG Capital Adequacy Directive minimum requirements and buffer framework.

#### User Stories
- **As a CRO**, I want to see the CET1 ratio and buffer headroom so that I can assess whether we have sufficient capital per BoG requirements.
- **As a Capital Manager**, I want to see capital trends over the last 12 months so that I can identify deterioration patterns and plan corrective actions.
- **As an ALCO Member**, I want to see the capital allocation by business unit so that I can optimize return on capital.
- **As a Compliance Officer**, I want to verify that all ratios exceed BoG minimums before quarterly ORASS submission.

#### Acceptance Criteria
- [ ] Ratios displayed: CET1, Tier 1, Total Capital, Leverage Ratio
- [ ] Buffer headroom: actual ratio minus minimum requirement minus combined buffer
- [ ] Combined buffer: capital conservation (2.5%) + countercyclical (0–2.5%) + systemic risk (D-SIB surcharge)
- [ ] Trend chart: 12-month history for each ratio
- [ ] Business unit breakdown: capital consumption per unit
- [ ] Traffic light: Green (buffer > 1.5pp), Amber (0.5–1.5pp), Red (< 0.5pp)
- [ ] Automatic alert when buffer headroom < 1 percentage point
- [ ] BoG minimum requirements displayed: CET1 4.5%, T1 6.0%, TC 8.0%, Leverage 3.0%
- [ ] D-SIB surcharge displayed if applicable (0.5%–2.0% CET1)
- [ ] Countercyclical buffer status for Ghana (currently 0% or as set by BoG)

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Capital Ratio Dashboard (BoG Capital Adequacy Framework)         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ CET1: 14.2% │ T1: 15.8% │ TC: 18.5% │ Leverage: 5.2%    │  │
│  │ Buffer: +2.7pp │ Status: 🟢 │ vs Q1: +0.3pp              │  │
│  │ BoG Min: CET1 4.5% │ T1 6.0% │ TC 8.0% │ Lev 3.0%       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Capital Trend (12 Months)                                  │  │
│  │ [Line chart: CET1, T1, TC, Leverage over 12 months]      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Capital Buffer Headroom                                     │  │
│  │ Buffer        │ Required │ Actual │ Headroom │ Status      │  │
│  │ CET1 Min      │ 4.5%     │ 14.2%  │ 9.7pp    │ 🟢          │  │
│  │ Capital Cons. │ 2.5%     │ 2.7pp  │ 0.2pp    │ 🟡          │  │
│  │ D-SIB         │ 1.0%     │ 1.0pp  │ 0.0pp    │ 🔴          │  │
│  │ CCyB          │ 0.0%     │ 0.0pp  │ 0.0pp    │ —           │  │
│  │ Pillar 2A     │ 2.0%     │ 2.0pp  │ 0.0pp    │ 🔴          │  │
│  │ Pillar 2B     │ 1.5%     │ 1.5pp  │ 0.0pp    │ 🔴          │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Capital Consumption by Business Unit                        │  │
│  │ [Pie chart: RWA by business unit]                          │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Frequency |
|-------|--------|-----------|
| CET1 components | GL / Finance | Daily EOD |
| AT1 instruments | Treasury / Securities | Daily EOD |
| T2 instruments | Treasury / Securities | Daily EOD |
| RWA credit risk | Credit risk models | Daily EOD |
| RWA market risk | Market risk models | Daily EOD |
| RWA operational risk | OR models | Monthly |
| CVA RWA | Counterparty risk | Daily EOD |
| Exposure measure | GL | Daily EOD |
| BoG buffer requirements | Regulatory config | As updated |
| D-SIB surcharge | BoG designation | Annual |

#### Calculation Logic / Business Rules
```
CET1_Ratio = CET1_Capital / RWA × 100
Tier1_Ratio = (CET1 + AT1) / RWA × 100
Total_Capital_Ratio = (CET1 + AT1 + T2) / RWA × 100
Leverage_Ratio = Tier1_Capital / Exposure_Measure × 100

Buffer_Headroom = Actual_Ratio - Minimum_Requirement - Combined_Buffer
Minimum_Requirements:
  CET1: 4.5% (BoG minimum)
  Tier 1: 6.0% (BoG minimum)
  Total Capital: 8.0% (BoG minimum)
  Leverage: 3.0% (BoG minimum)

Combined_Buffer = Capital_Conservation (2.5%) + D-SIB_Surcharge + CCyB + Systemic_Risk
```

#### Validation Rules
- CET1 ratio must be ≥ 4.5% (BoG Pillar 1 minimum)
- Total capital ratio must be ≥ 8.0% (BoG Pillar 1 minimum)
- Leverage ratio must be ≥ 3.0% (BoG minimum)
- Buffer headroom should be ≥ 1.0pp (bank policy)
- All capital instruments must meet BoG eligibility criteria (per Capital Adequacy Directive)
- D-SIB surcharge must be applied if bank is designated as D-SIB by BoG
- Countercyclical buffer must reflect BoG's current setting for Ghana

#### Error Handling
- If buffer headroom < 0.5pp → red alert, trigger capital raising review
- If buffer headroom < 1.0pp → amber alert, include in ALCO agenda
- If leverage ratio < 3.0% → immediate regulatory breach notification to BoG
- If CET1 < 4.5% → critical alert, trigger recovery plan, notify BoG
- If RWA calculation fails for any risk type → exclude from total, alert Risk Manager
- If capital instrument eligibility expires → amber alert, exclude from ratios, plan replacement

#### Audit & Compliance Requirements
- Capital ratios reported to BoG via ORASS quarterly
- Leverage ratio reported quarterly
- Pillar 3 disclosure: annual publication of capital ratios and RWA breakdown
- ICAAP: annual submission to BoG
- Capital instruments must be verified for BoG eligibility (not CRR/CRR3)

---

### 2.2 RWA Calculator (Standardized Approach)

#### Description
A comprehensive RWA calculator supporting the Standardized Approach (SA) for credit risk, market risk, and operational risk under the BoG Capital Adequacy Framework. Ghana uses the Standardized Approach (not IRB) for credit risk. The module includes Ghana-specific risk weights for sovereign (GoG), banks, corporates, retail, SMEs, and past-due loans.

#### User Stories
- **As a Capital Manager**, I want to see RWA by risk type and exposure class so that I can optimize capital allocation.
- **As a Model Validator**, I want to verify that risk weights match BoG regulatory tables.
- **As an ALCO Member**, I want to see the RWA concentration by sector and geography so that I can manage portfolio diversification.
- **As a Compliance Officer**, I want to ensure RWA calculations are accurate for BoG quarterly reporting.

#### Acceptance Criteria
- [ ] Credit risk RWA: SA (risk weights by exposure class per BoG tables)
- [ ] Market risk RWA: Standardized approach (sensitivities-based or simplified)
- [ ] Operational risk RWA: Basic Indicator Approach (BIA), Standardized Approach (TSA), or Alternative Standardized Approach (ASA)
- [ ] CVA RWA: Standardized approach for counterparty credit risk
- [ ] Ghana-specific risk weights: GoG (0%–20%), BoG (0%–20%), domestic banks (20%–50%), corporates (20%–150%), retail (75%), SMEs (75%), past-due (150%)
- [ ] Off-balance-sheet items: CCF (Credit Conversion Factors) per BoG rules
- [ ] Collateral and guarantees: haircuts per BoG rules
- [ ] Drill-down: portfolio → exposure class → individual obligor
- [ ] RWA reconciliation to GL balances monthly

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  RWA Calculator (BoG Standardized Approach)                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Total RWA: GHS 12.5bn │ Credit: 8.2bn │ Market: 1.8bn        │  │
│  │ Operational: 1.2bn │ CVA: 0.8bn │ Leverage Exposure: 45bn  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ RWA by Risk Type (Bar chart)                                │  │
│  │ Credit SA: ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ (8.2bn)          │  │
│  │ Market SA: ▓▓▓▓▓▓▓▓ (1.8bn)                                │  │
│  │ Op Risk: ▓▓▓▓▓▓ (1.2bn)                                    │  │
│  │ CVA: ▓▓▓▓ (0.8bn)                                          │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Credit RWA by Exposure Class                                │  │
│  │ Exposure Class    │ Amount    │ Risk Weight │ RWA          │  │
│  │ GoG Sovereign     │ 2.0bn     │ 0%          │ 0            │  │
│  │ BoG               │ 0.5bn     │ 0%          │ 0            │  │
│  │ Domestic Banks    │ 1.2bn     │ 20%         │ 240M         │  │
│  │ Corporates        │ 3.5bn     │ 100%        │ 3.5bn        │  │
│  │ Retail            │ 1.8bn     │ 75%         │ 1.35bn       │  │
│  │ SMEs              │ 0.8bn     │ 75%         │ 600M         │  │
│  │ Past Due          │ 0.3bn     │ 150%        │ 450M         │  │
│  │ Off-Balance-Sheet │ 1.0bn     │ CCF 20–50%  │ 200M         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Drill Down to Portfolio] [Export BoG Template] [Run What-If]   │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Frequency |
|-------|--------|-----------|
| Exposure amounts | GL / Loan system | Daily EOD |
| Risk weights (SA) | Product / counterparty master | Monthly |
| Credit ratings | External rating agencies / BoG | Monthly |
| Collateral values | Collateral management system | Daily EOD |
| Off-balance-sheet items | Trade finance / guarantees | Daily EOD |
| CCF values | Product master | Monthly |
| Market risk sensitivities | Trading systems | Daily |
| Operational risk loss data | OR database | Annual |
| CVA parameters | Counterparty risk system | Daily |

#### Calculation Logic / Business Rules
```python
# Standardized Approach — Credit Risk
sa_credit_rwa = sum(exposure × risk_weight for each_exposure)

# Risk weights per BoG Capital Adequacy Framework (examples)
risk_weights = {
    "GoG_sovereign": 0.0,      # 0% for GHS-denominated, 20% for FX
    "BoG": 0.0,                # 0% for GHS-denominated, 20% for FX
    "Domestic_bank_AAA": 0.20,
    "Domestic_bank_A": 0.50,
    "Corporate_AAA": 0.20,
    "Corporate_A": 0.50,
    "Corporate_BBB": 1.00,
    "Corporate_BB": 1.00,
    "Corporate_B": 1.50,
    "Retail": 0.75,
    "SME": 0.75,
    "Past_due_90_180d": 1.00,  # 100% if specific provisions > 20%
    "Past_due_180d": 1.50,     # 150% if specific provisions < 20%
    "Residential_mortgage": 0.35,  # 35% if LTV < 80%
    "Commercial_real_estate": 1.00,
}

# Off-balance-sheet: apply CCF then risk weight
obs_exposure = notional × ccf
obs_rwa = obs_exposure × risk_weight

# Collateral: reduce exposure by collateral value after haircut
net_exposure = exposure - (collateral_value × (1 - haircut))

# Market risk RWA (simplified standardized approach)
market_rwa = sum(risk_charge for each_risk_class)

# Operational risk RWA (BIA / TSA / ASA)
# BIA: average annual gross income × alpha (15%)
# TSA: sum of business lines × beta factors
# ASA: TSA with retail/commercial banking using loan/provision data
operational_rwa = operational_risk_charge × 12.5

# CVA RWA (standardized approach)
cva_rwa = sum(cva_charge for each_counterparty)

# Total RWA
total_rwa = credit_rwa + market_rwa + operational_rwa + cva_rwa
```

#### Validation Rules
- Risk weights must match BoG Capital Adequacy Directive tables
- CCF values must match BoG rules (0%, 20%, 50%, 100%)
- Collateral haircuts must match BoG rules (0%–50% depending on collateral type)
- All RWA calculations must be reconcilable to GL balances within 1%
- Operational risk approach (BIA/TSA/ASA) must be approved by BoG
- Market risk approach must be approved by BoG

#### Error Handling
- If risk weight missing for exposure class → use conservative weight (150%), alert Capital Manager
- If collateral value missing → use gross exposure, alert Collateral Management
- If RWA calculation diverges from prior day by > 5% → investigate data issue
- If operational risk loss data incomplete → use prior year estimate, alert OR team
- If CVA parameters missing → use conservative default, alert Counterparty Risk

#### Audit & Compliance Requirements
- RWA calculations documented and auditable
- Risk weight tables versioned and retained for 7 years
- RWA reconciliation to GL performed monthly
- BoG capital adequacy return submitted quarterly via ORASS
- Operational risk approach approved by BoG and reviewed annually

---

### 2.3 ICAAP Stress Testing & Capital Planning

#### Description
An integrated capital planning tool that projects capital ratios under stress scenarios, calculates Pillar 2 capital requirements, and supports strategic capital decisions (dividends, issuance, retention). Aligned with BoG ICAAP requirements and Ghana-specific stress scenarios.

#### User Stories
- **As a CRO**, I want to project CET1 under an adverse scenario so that I can recommend dividend policy to the Board.
- **As a Capital Manager**, I want to calculate Pillar 2A and Pillar 2B requirements so that I can document the ICAAP for BoG submission.
- **As an ALCO Member**, I want to compare capital plans under different growth scenarios so that I can approve the budget.
- **As a Board Risk Committee member**, I want to review the ICAAP annually and ensure it covers all material risks.

#### Acceptance Criteria
- [ ] Pillar 1: minimum capital requirements (4.5% CET1, 6% T1, 8% TC)
- [ ] Pillar 2A: additional requirements from BoG (supervisory review and evaluation)
- [ ] Pillar 2B: internal assessment of risks not fully captured in Pillar 1
- [ ] Pillar 2B add-ons: IRRBB, concentration risk, liquidity risk, operational risk, strategic risk, reputational risk
- [ ] IRRBB Pillar 2B add-on: based on ΔEVE as % of Tier 1 capital under worst-case BoG SOT scenario
- [ ] Concentration risk Pillar 2B: single-name, sector, geographic concentration
- [ ] Stress scenarios: base, adverse, severely adverse (BoG-defined scenarios)
- [ ] Ghana-specific stress scenarios: sovereign default, currency crisis, commodity price shock, banking sector stress
- [ ] Capital projection: 3-year horizon with balance sheet growth assumptions
- [ ] Dividend policy simulation: payout ratio impact on capital ratios
- [ ] Capital issuance planning: AT1, T2 issuance impact on ratios and cost
- [ ] Recovery planning integration: trigger points for recovery options
- [ ] ICAAP document generation for BoG annual submission

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  ICAAP Capital Planning (BoG Framework)                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Capital Requirements Stack                                  │  │
│  │ Pillar 1 (CET1 min): 4.5%                                │  │
│  │ + Capital Conservation: 2.5%                             │  │
│  │ + D-SIB Surcharge: 1.0%                                  │  │
│  │ + CCyB: 0.0%                                             │  │
│  │ + Pillar 2A (BoG SREP): 2.0%                            │  │
│  │ + Pillar 2B (Internal): 1.5%                             │  │
│  │   - IRRBB add-on: 0.5%                                   │  │
│  │   - Concentration risk: 0.3%                             │  │
│  │   - Liquidity risk: 0.2%                                 │  │
│  │   - Operational risk: 0.3%                             │  │
│  │   - Strategic/reputational: 0.2%                       │  │
│  │ = Total Requirement: 11.5%                               │  │
│  │ Actual CET1: 14.2% │ Headroom: 2.7pp │ Status: 🟢        │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 3-Year Capital Projection (Base Case)                      │  │
│  │ Year  │ CET1    │ T1      │ TC      │ Leverage │           │  │
│  │ Y1    │ 14.2%   │ 15.8%   │ 18.5%   │ 5.2%     │           │  │
│  │ Y2    │ 13.8%   │ 15.4%   │ 18.1%   │ 5.0%     │           │  │
│  │ Y3    │ 13.5%   │ 15.1%   │ 17.8%   │ 4.9%     │           │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Stress Test Impact (Ghana Adverse Scenario)                  │  │
│  │ Metric      │ Base    │ Adverse │ Impact  │ Recovery      │  │
│  │ CET1        │ 14.2%   │ 11.8%   │ -2.4pp  │ 18 months     │  │
│  │ RWA         │ 12.5bn  │ 14.2bn  │ +1.7bn  │ —             │  │
│  │ NII         │ 580M    │ 420M    │ -160M   │ —             │  │
│  │ Credit Loss │ 45M     │ 180M    │ +135M   │ —             │  │
│  │ GoG Spread  │ 200bps  │ 800bps  │ +600bps │ —             │  │
│  │ GHS/USD     │ 12.5    │ 15.0    │ +20%    │ —             │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Run Stress Test] [Plan Capital Issuance] [Export ICAAP Pack]   │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Current capital composition from GL
- RWA projections by risk type
- Balance sheet growth assumptions by business unit
- Stress parameters: credit losses, market losses, NII impact, RWA inflation, GoG spread, FX rates
- Dividend policy: payout ratio, scrip dividend option
- Capital issuance costs: coupon rates, issuance fees, tax impact
- BoG SREP letter and Pillar 2A requirements
- IRRBB EVE impact from `03-interest-rate-risk.md`
- Concentration risk metrics from credit risk system

#### Calculation Logic / Business Rules
```python
# Capital projection
for year in range(1, 4):
    projected_cet1 = current_cet1 + retained_earnings - credit_losses - dividends
    projected_rwa = current_rwa × (1 + rwa_growth_rate)^year
    projected_cet1_ratio = projected_cet1 / projected_rwa
    
    # Check against requirements
    total_requirement = pillar_1_min + capital_conservation + dsib_surcharge + ccyb + pillar_2a + pillar_2b
    if projected_cet1_ratio < total_requirement:
        trigger_capital_raising_or_dividend_cut()

# Stress impact
stressed_cet1 = current_cet1 - stress_credit_losses - stress_market_losses - rwa_inflation_impact
stressed_rwa = current_rwa × (1 + stress_rwa_growth)
stressed_cet1_ratio = stressed_cet1 / stressed_rwa

# IRRBB Pillar 2B add-on (BoG SOT-based)
max_eve_pct_t1 = max(abs(delta_eve_scenario) for scenario in irrbb_shocks) / tier_1_capital × 100
if max_eve_pct_t1 > 15:
    pillar_2b_irrbb_add_on = (max_eve_pct_t1 - 15) × scaling_factor
else:
    pillar_2b_irrbb_add_on = 0

# Concentration risk Pillar 2B add-on
concentration_add_on = calculate_concentration_risk_add_on(single_name_limit, sector_limit, geographic_limit)

# Liquidity risk Pillar 2B add-on
liquidity_add_on = calculate_liquidity_risk_add_on(lcr, nsfr, funding_concentration)

# Total Pillar 2B
pillar_2b_total = pillar_2b_irrbb_add_on + concentration_add_on + liquidity_add_on + operational_add_on + strategic_add_on
```

#### Validation Rules
- ICAAP must be reviewed and approved by Board annually
- Pillar 2B must be based on material risks not captured in Pillar 1
- Stress scenarios must be severe but plausible (BoG guidance)
- Recovery period after stress must be < 24 months
- Capital plan must include management actions (dividend cut, issuance, asset sales)
- ICAAP must be submitted to BoG within 4 months of financial year-end

#### Error Handling
- If projected CET1 < total requirement within 3 years → red alert, immediate capital plan review
- If stressed CET1 < Pillar 1 minimum → red alert, trigger recovery plan, notify BoG
- If ICAAP not approved by Board within 12 months of prior approval → amber alert, schedule review
- If Pillar 2B add-on > 2% of RWA → amber alert, review risk assessment methodology

#### Audit & Compliance Requirements
- ICAAP submitted to BoG annually (within 4 months of year-end)
- SREP letter response within BoG deadline
- Capital plan documented in Board minutes
- Stress test results reported to ALCO quarterly
- ICAAP document retained for 7 years
- BoG may request ad-hoc ICAAP updates

---

### 2.4 Capital Instrument & Issuance Tracker

#### Description
Tracks all capital instruments (CET1, AT1, T2) for eligibility, maturity, coupon, and inclusion in capital ratios. Supports issuance planning, redemption scheduling, and replacement planning. Aligned with BoG Capital Adequacy Directive eligibility criteria.

#### User Stories
- **As a Treasurer**, I want to see the maturity profile of all capital instruments so that I can plan issuance and redemption.
- **As a Capital Manager**, I want to verify that all instruments meet BoG eligibility criteria so that they can be included in capital ratios.
- **As a CRO**, I want to see the cost of capital (coupon rates) so that I can optimize the capital structure.
- **As a Compliance Officer**, I want to ensure that capital instrument documentation is complete for BoG inspection.

#### Acceptance Criteria
- [ ] Capital instrument register: type, amount, issuance date, maturity, coupon, call date, eligibility status
- [ ] BoG eligibility criteria check: loss absorption, permanence, subordination, no step-ups, no redemption incentives
- [ ] Maturity profile: instruments maturing per year, call dates, redemption options
- [ ] Cost of capital: weighted average coupon by tier, cost comparison to market
- [ ] Issuance planning: planned AT1/T2 issuance, impact on ratios, cost estimation
- [ ] Redemption planning: scheduled redemptions, replacement requirements, refinancing risk
- [ ] Capital ratio impact: simulate issuance/redemption impact on CET1, T1, TC, leverage

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Capital Instrument & Issuance Tracker                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Capital Instrument Summary                                  │  │
│  │ CET1: GHS 900M │ AT1: GHS 150M │ T2: GHS 200M │ Total: 1.25bn│  │
│  │ WAC CET1: 0% │ WAC AT1: 8.5% │ WAC T2: 6.2% │             │  │
│  │ Eligibility: 100% │ Next Call: 2027-06 │ Next Maturity: 2028-03│  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Instrument Register                                         │  │
│  │ Instrument │ Type │ Amount │ Coupon │ Maturity │ Eligible │  │
│  │ Common Eq  │ CET1 │ 900M   │ 0%     │ Perp     │ ✅       │  │
│  │ AT1 2024   │ AT1  │ 150M   │ 8.5%   │ 2029     │ ✅       │  │
│  │ T2 2023    │ T2   │ 200M   │ 6.2%   │ 2028     │ ✅       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Maturity & Call Schedule (Next 5 Years)                     │  │
│  │ Year │ Call    │ Maturity │ Issued │ Net Change │ Cumulative │  │
│  │ Y1   │ 0M      │ 0M       │ 0M     │ 0M         │ 0M         │  │
│  │ Y2   │ 150M    │ 0M       │ 200M   │ +50M       │ +50M       │  │
│  │ Y3   │ 0M      │ 200M     │ 300M   │ +100M      │ +150M      │  │
│  │ Y4   │ 0M      │ 0M       │ 0M     │ 0M         │ +150M      │  │
│  │ Y5   │ 0M      │ 0M       │ 0M     │ 0M         │ +150M      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Plan Issuance] [Plan Redemption] [Export Register]             │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Capital instrument data from Treasury / Securities
- BoG eligibility criteria from regulatory config
- Market data for cost comparison
- Issuance pipeline from Treasury
- Redemption schedule from instrument terms

#### Calculation Logic / Business Rules
```python
# Eligibility check per BoG Capital Adequacy Directive
eligible_cet1 = sum(instrument.amount for instrument in instruments if instrument.type == "CET1" and instrument.eligible)
eligible_at1 = sum(instrument.amount for instrument in instruments if instrument.type == "AT1" and instrument.eligible)
eligible_t2 = sum(instrument.amount for instrument in instruments if instrument.type == "T2" and instrument.eligible)

# Tier 1 and Total Capital
tier1 = eligible_cet1 + eligible_at1
total_capital = tier1 + eligible_t2

# Weighted average coupon
wac_at1 = sum(instrument.coupon * instrument.amount for instrument in at1_instruments) / sum(instrument.amount for instrument in at1_instruments)
wac_t2 = sum(instrument.coupon * instrument.amount for instrument in t2_instruments) / sum(instrument.amount for instrument in t2_instruments)

# Issuance impact simulation
simulated_cet1 = current_cet1 + new_cet1_issuance
simulated_tier1 = current_tier1 + new_at1_issuance
simulated_total = current_total + new_t2_issuance
simulated_cet1_ratio = simulated_cet1 / rwa
simulated_leverage = simulated_tier1 / exposure_measure
```

#### Validation Rules
- All instruments must meet BoG eligibility criteria (not CRR/CRR3)
- AT1 instruments must have loss absorption mechanism (write-down or conversion)
- T2 instruments must have original maturity ≥ 5 years
- No step-up features or redemption incentives
- Eligibility must be verified annually

#### Error Handling
- If instrument eligibility expires → amber alert, exclude from ratios, plan replacement
- If call date approaching (within 6 months) → amber alert, plan replacement or refinancing
- If issuance cost > market average + 200bps → amber alert, review pricing
- If redemption > issuance in any year → red alert, review capital plan

#### Audit & Compliance Requirements
- Capital instrument register maintained and updated daily
- Eligibility documentation retained for 7 years
- BoG may request capital instrument documentation for inspection
- Issuance and redemption reported to BoG via ORASS

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **Capital_Calculation** | Daily capital result | calc_id, date, cet1, at1, t2, tier1, total_capital, rwa, leverage_exposure, ratios... |
| **RWA_Credit** | Credit risk RWA detail | rwa_id, calc_id, exposure_class, exposure_amount, risk_weight, collateral, net_exposure, rwa_amount |
| **RWA_Market** | Market risk RWA detail | rwa_id, calc_id, risk_class, sensitivity, risk_charge, rwa_amount |
| **RWA_Operational** | Operational risk RWA | rwa_id, calc_id, approach, bi, ilm, loss_component, rwa_amount |
| **RWA_CVA** | CVA risk RWA | rwa_id, calc_id, exposure, cva_charge, rwa_amount |
| **Capital_Instrument** | Individual capital instrument | instrument_id, type, amount, coupon, maturity, call_date, eligibility, bog_eligible, included_in_cet1 |
| **ICAAP_Scenario** | ICAAP stress scenario | scenario_id, name, type, parameters, results, bog_scenario_id |
| **Pillar2_AddOn** | Pillar 2B add-on detail | addon_id, calc_id, risk_type, amount, rationale, approved_by |
| **BoG_Buffer** | BoG buffer requirements | buffer_id, date, capital_conservation, ccyb, dsib_surcharge, systemic_risk, effective_date |

### 3.2 Key Attributes

**RWA_Credit.risk_weight**: Risk weight per BoG Capital Adequacy Directive. Must match BoG regulatory tables. Updated when BoG issues new guidance.

**RWA_Credit.collateral**: Collateral value after haircut. Haircuts per BoG rules (0%–50% depending on collateral type: cash, GoG bonds, real estate, etc.).

**Capital_Instrument.bog_eligible**: Boolean indicating whether the instrument meets BoG eligibility criteria. Checked at issuance and reviewed annually.

**Pillar2_AddOn.risk_type**: Type of Pillar 2B add-on — "IRRBB", "concentration", "liquidity", "operational", "strategic", "reputational". Each must have documented rationale and Board approval.

**BoG_Buffer.ccyb**: Countercyclical buffer rate for Ghana. Set by BoG (currently 0% or as notified). Must be updated within 5 business days of BoG notification.

**BoG_Buffer.dsib_surcharge**: Domestic Systemically Important Bank surcharge. Set by BoG based on D-SIB assessment. Applied to CET1 if bank is designated as D-SIB.

### 3.3 Relationships

```
Capital_Calculation (1) ──► RWA_Credit (N)
Capital_Calculation (1) ──► RWA_Market (N)
Capital_Calculation (1) ──► RWA_Operational (N)
Capital_Calculation (1) ──► RWA_CVA (N)
Capital_Calculation (1) ──► Capital_Instrument (N)
Capital_Calculation (1) ──► Pillar2_AddOn (N)
ICAAP_Scenario (N) ──► Capital_Calculation (base case)
BoG_Buffer (1) ──► Capital_Calculation (N) (buffer requirements)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/capital/ratios` | GET | Get current capital ratios |
| `/api/capital/ratios/history` | GET | Get ratio history |
| `/api/capital/rwa` | GET | Get RWA breakdown |
| `/api/capital/rwa/credit` | GET | Get credit risk RWA by exposure class |
| `/api/capital/rwa/market` | GET | Get market risk RWA |
| `/api/capital/rwa/operational` | GET | Get operational risk RWA |
| `/api/capital/rwa/whatif` | POST | Run RWA what-if |
| `/api/capital/icaap` | GET | Get ICAAP summary |
| `/api/capital/icaap/scenarios` | POST | Run ICAAP scenario |
| `/api/capital/icaap/pillar2` | GET | Get Pillar 2 add-ons |
| `/api/capital/icaap/pillar2` | POST | Update Pillar 2 add-on |
| `/api/capital/instruments` | GET | List capital instruments |
| `/api/capital/instruments/{id}` | GET | Get instrument details |
| `/api/capital/instruments/{id}/eligibility` | GET | Get BoG eligibility status |
| `/api/capital/buffers` | GET | Get BoG buffer requirements |
| `/api/capital/reports/bog-capital` | GET | Generate BoG capital adequacy return (ORASS format) |
| `/api/capital/reports/icaap` | GET | Generate ICAAP document for BoG submission |
| `/api/capital/reports/pillar3` | GET | Generate Pillar 3 disclosure document |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Capital ratio calculation: < 30 seconds
- RWA calculation: < 2 minutes for full portfolio
- ICAAP scenario: < 5 minutes
- Historical queries: < 2 seconds for 1 year
- BoG quarterly report generation: < 60 seconds for ORASS format

### 5.2 Security
- Capital data classified as strictly confidential
- RWA model parameters restricted to Capital Manager and Model Validation
- Regulatory reports digitally signed
- BoG ORASS data encrypted during transmission
- Capital instrument terms restricted to Treasury and CRO

### 5.3 Availability
- Capital ratios: 99.9% (daily requirement)
- RWA calculator: 99.5% (on-demand)
- Capital instrument tracker: 99.5% (quarterly reporting)
- RTO: 2 hours

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| Capital Dashboard | Daily | Web UI | CRO, Treasurer |
| RWA Breakdown | Monthly | Excel | ALCO, Compliance |
| BoG Capital Adequacy Return | Quarterly | ORASS XML | Compliance → BoG |
| ICAAP Pack | Annual | PDF | Board → BoG |
| Pillar 3 Disclosure | Annual | PDF | Compliance → Public |
| Capital Plan | Annual | PDF | ALCO → Board |
| Leverage Ratio | Quarterly | Excel | Compliance → BoG |
| Capital Instrument Register | Quarterly | Excel | Treasury, Compliance |
| Pillar 2 Add-On Report | Quarterly | PDF | ALCO, CRO |
| Stress Test Capital Impact | Quarterly | PDF | ALCO, Board Risk Committee |

---

## 7. Appendices

### 7.1 BoG Capital Adequacy Minimum Requirements

| Ratio | Minimum Requirement | Buffer |
|-------|---------------------|--------|
| CET1 | 4.5% | + Capital Conservation (2.5%) + D-SIB Surcharge (0.5%–2.0%) + CCyB (0–2.5%) |
| Tier 1 | 6.0% | As above |
| Total Capital | 8.0% | As above |
| Leverage Ratio | 3.0% | — |

### 7.2 BoG Risk Weight Table (Selected Exposure Classes)

| Exposure Class | Risk Weight | Notes |
|----------------|-------------|-------|
| GoG Sovereign (GHS) | 0% | GHS-denominated |
| GoG Sovereign (FX) | 20% | FX-denominated |
| BoG (GHS) | 0% | GHS-denominated |
| BoG (FX) | 20% | FX-denominated |
| Domestic Banks (AAA) | 20% | External rating |
| Domestic Banks (A) | 50% | External rating |
| Corporates (AAA) | 20% | External rating |
| Corporates (A) | 50% | External rating |
| Corporates (BBB) | 100% | External rating |
| Corporates (BB or below) | 150% | External rating |
| Retail | 75% | — |
| SMEs | 75% | — |
| Residential Mortgage (LTV < 80%) | 35% | — |
| Commercial Real Estate | 100% | — |
| Past Due (90–180 days, provisions > 20%) | 100% | — |
| Past Due (> 180 days, provisions < 20%) | 150% | — |
| Off-Balance-Sheet (undrawn commitments) | CCF 20% | — |
| Off-Balance-Sheet (trade finance) | CCF 20–50% | — |

### 7.3 BoG Capital Instrument Eligibility Criteria

| Tier | Eligibility Criteria |
|------|----------------------|
| CET1 | Common equity, retained earnings, reserves; loss-absorbing; permanent; no step-ups; no redemption incentives |
| AT1 | Subordinated to deposits; loss-absorbing (write-down or conversion); no maturity date or ≥ 5 years; no step-ups; no redemption incentives |
| T2 | Subordinated to deposits; original maturity ≥ 5 years; no step-ups; no redemption incentives |

### 7.4 Pillar 2B Add-On Categories

| Risk Type | Measurement | Typical Range |
|-----------|-------------|---------------|
| IRRBB | ΔEVE under worst-case SOT scenario | 0.2%–1.0% of RWA |
| Concentration Risk | Single-name, sector, geographic concentration | 0.1%–0.5% of RWA |
| Liquidity Risk | LCR, NSFR, funding concentration | 0.1%–0.3% of RWA |
| Operational Risk | Loss data, control assessments | 0.1%–0.5% of RWA |
| Strategic Risk | Business plan risk, market position | 0.1%–0.3% of RWA |
| Reputational Risk | Brand risk, customer trust | 0.1%–0.2% of RWA |

### 7.5 Ghana-Specific Stress Scenarios

| Scenario | Description | Key Variables |
|----------|-------------|---------------|
| Sovereign Default | GoG debt restructuring or default | GoG spread +600bps, GHS/USD +30% |
| Currency Crisis | Sharp GHS depreciation | GHS/USD +50%, inflation +20%, rates +500bps |
| Commodity Price Shock | Cocoa/gold/oil price collapse | Export revenue -30%, NPL +5%, FX reserves -20% |
| Banking Sector Stress | Systemic banking crisis | NPL +10%, deposit flight -20%, interbank freeze |
| Drought/Agricultural Shock | Poor harvest, food inflation | Agricultural NPL +8%, food inflation +15% |
| Election-Related Uncertainty | Political instability | FDI -50%, GHS/USD +15%, rates +200bps |

### 7.6 Configuration Keys

| Key | Description | Default Value |
|-----|-------------|---------------|
| `capital.bog.cet1_min_pct` | BoG CET1 minimum requirement | 4.5 |
| `capital.bog.t1_min_pct` | BoG Tier 1 minimum requirement | 6.0 |
| `capital.bog.tc_min_pct` | BoG Total Capital minimum requirement | 8.0 |
| `capital.bog.leverage_min_pct` | BoG Leverage Ratio minimum | 3.0 |
| `capital.buffer.conservation_pct` | Capital conservation buffer | 2.5 |
| `capital.buffer.ccyb_pct` | Countercyclical buffer (Ghana) | 0.0 |
| `capital.buffer.dsib_surcharge_pct` | D-SIB surcharge | 0.0 |
| `capital.pillar2a.srep_pct` | Pillar 2A SREP requirement | 0.0 |
| `capital.pillar2b.irrbb_scaling_factor` | IRRBB Pillar 2B scaling factor | 0.5 |
| `capital.pillar2b.concentration_threshold` | Concentration risk threshold | 0.25 |
| `capital.instrument.at1_min_maturity_years` | AT1 minimum maturity | 5 |
| `capital.instrument.t2_min_maturity_years` | T2 minimum maturity | 5 |
| `capital.reporting.bog_quarterly_months` | Months when BoG capital return is due | 3, 6, 9, 12 |
| `capital.reporting.retention_years` | Retention period for capital data | 7 |

---

*PRD v2.0 — Capital Management & RWA Engine (BoG ICAAP / Capital Adequacy Framework)*
