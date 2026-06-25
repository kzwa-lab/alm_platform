# PRD: Capital Management & RWA Engine

## 1. Overview

### 1.1 Purpose

The Capital Management & RWA Engine calculates regulatory capital ratios (CET1, Tier 1, Total Capital, Leverage Ratio), computes Risk-Weighted Assets (RWA) under both standardized and internal model approaches, applies the Basel III output floor, and tracks MREL/TLAC requirements. This module ensures the bank maintains adequate capital buffers above minimum requirements and supports strategic capital planning.

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **CRO** | Reviews capital adequacy, approves capital planning, presents to Board |
| **Capital Manager** | Runs RWA calculations, validates model outputs, produces capital reports |
| **ALCO Member** | Reviews capital ratios at meetings, approves capital allocation |
| **Compliance Officer** | Ensures regulatory reporting accuracy, submits COREP/FINREP |
| **Model Validator** | Validates IRB models, PD/LGD/EAD estimates, backtests annually |

### 1.3 Dependencies

- **Data Foundation**: GL balances, counterparty data, credit ratings, exposure data
- **ECL Module**: Stage assignments and PD estimates feed into IRB RWA
- **IRRBB Module**: EVE impact affects Pillar 2 capital requirement
- **Liquidity Risk**: HQLA holdings affect leverage ratio denominator

---

## 2. Features

### 2.1 Capital Ratio Dashboard

#### Description
A real-time dashboard showing all key capital ratios with traffic light indicators, trend analysis, and buffer headroom calculations.

#### User Stories
- **As a CRO**, I want to see the CET1 ratio and buffer headroom so that I can assess whether we have sufficient capital.
- **As a Capital Manager**, I want to see capital trends over the last 12 months so that I can identify deterioration patterns.
- **As an ALCO Member**, I want to see the capital allocation by business unit so that I can optimize return on capital.

#### Acceptance Criteria
- [ ] Ratios displayed: CET1, Tier 1, Total Capital, Leverage Ratio
- [ ] Buffer headroom: actual ratio minus minimum requirement minus combined buffer
- [ ] Combined buffer: capital conservation (2.5%) + G-SIB surcharge + countercyclical + systemic risk
- [ ] Trend chart: 12-month history for each ratio
- [ ] Business unit breakdown: capital consumption per unit
- [ ] Traffic light: Green (buffer > 1.5pp), Amber (0.5-1.5pp), Red (< 0.5pp)
- [ ] Automatic alert when buffer headroom < 1 percentage point

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Capital Ratio Dashboard                                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ CET1: 14.2% │ T1: 15.8% │ TC: 18.5% │ Leverage: 5.2%    │  │
│  │ Buffer: +2.7pp │ Status: 🟢 │ vs Q1: +0.3pp              │  │
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
│  │ G-SIB         │ 1.0%     │ 1.0pp  │ 0.0pp    │ 🔴          │  │
│  │ CCyB          │ 0.0%     │ 0.0pp  │ 0.0pp    │ —           │  │
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

#### Calculation Logic / Business Rules
```
CET1_Ratio = CET1_Capital / RWA × 100
Tier1_Ratio = (CET1 + AT1) / RWA × 100
Total_Capital_Ratio = (CET1 + AT1 + T2) / RWA × 100
Leverage_Ratio = Tier1_Capital / Exposure_Measure × 100

Buffer_Headroom = Actual_Ratio - Minimum_Requirement - Combined_Buffer
Minimum_Requirements:
  CET1: 4.5%
  Tier 1: 6.0%
  Total Capital: 8.0%
  Leverage: 3.0% (EUR minimum)

Combined_Buffer = Capital_Conservation (2.5%) + G-SIB + CCyB + Systemic_Risk
```

#### Validation Rules
- CET1 ratio must be ≥ 4.5% (Pillar 1 minimum)
- Total capital ratio must be ≥ 8.0%
- Leverage ratio must be ≥ 3.0%
- Buffer headroom should be ≥ 1.0pp (bank policy)
- All capital instruments must meet eligibility criteria (per CRR)

#### Error Handling
- If buffer headroom < 0.5pp → red alert, trigger capital raising review
- If buffer headroom < 1.0pp → amber alert, include in ALCO agenda
- If leverage ratio < 3.0% → immediate regulatory breach notification
- If RWA calculation fails for any risk type → exclude from total, alert Risk Manager

#### Audit & Compliance Requirements
- Capital ratios reported in COREP (Common Reporting) monthly
- Leverage ratio reported quarterly
- Pillar 3 disclosure: annual publication of capital ratios and RWA breakdown
- ICAAP: annual submission to supervisor

---

### 2.2 RWA Calculator (Standardized + IRB)

#### Description
A comprehensive RWA calculator supporting both Standardized Approach (SA) and Internal Ratings-Based (IRB) approach for credit risk. Includes the Basel III output floor.

#### User Stories
- **As a Capital Manager**, I want to see RWA by risk type and approach so that I can optimize model mix.
- **As a Model Validator**, I want to compare SA RWA vs. IRB RWA so that I can assess model risk.
- **As an ALCO Member**, I want to see the output floor impact so that I can understand capital drag from the floor.

#### Acceptance Criteria
- [ ] Credit risk RWA: SA (risk weights by exposure class) and IRB (PD/LGD/EAD)
- [ ] Market risk RWA: FRTB SA (sensitivities-based) and IMA (expected shortfall)
- [ ] Operational risk RWA: SMA (standardized measurement approach)
- [ ] CVA RWA: SA-CVA and BA-CVA
- [ ] Output floor applied: 72.5% of SA RWA (phased in from 50% in 2023 to 72.5% in 2028)
- [ ] Floor impact shown: IRB RWA → floor RWA → final RWA
- [ ] Drill-down: portfolio → exposure class → individual obligor

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  RWA Calculator                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Total RWA: EUR 12.5bn │ Output Floor Impact: +EUR 850M     │  │
│  │ SA RWA: EUR 14.2bn │ IRB RWA: EUR 11.7bn │ Floor: 72.5%   │  │
│  │ Final RWA: EUR 12.5bn (SA 14.2 × 0.725 = 10.3 < 11.7)      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ RWA by Risk Type (Bar chart)                                │  │
│  │ Credit SA: ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ (8.2bn)          │  │
│  │ Credit IRB: ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ (4.5bn)             │  │
│  │ Market FRTB: ▓▓▓▓▓▓▓▓ (1.8bn)                              │  │
│  │ Op Risk: ▓▓▓▓▓▓ (1.2bn)                                    │  │
│  │ CVA: ▓▓▓▓ (0.8bn)                                          │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Output Floor Bridge                                         │  │
│  │ IRB RWA: EUR 11.7bn                                        │  │
│  │ + Floor adjustment: EUR 850M                               │  │
│  │ = Final RWA: EUR 12.5bn                                    │  │
│  │ Floor % of SA: 72.5% │ Effective floor rate: 88.0%        │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Drill Down to Portfolio] [Export COREP Template] [Run What-If] │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Frequency |
|-------|--------|-----------|
| Exposure amounts | GL / Loan system | Daily EOD |
| Risk weights (SA) | Product / counterparty master | Monthly |
| PD estimates (IRB) | Credit risk models | Monthly |
| LGD estimates (IRB) | Workout / market data | Monthly |
| EAD (IRB) | Credit conversion factors | Daily EOD |
| Market risk sensitivities | Trading systems | Daily |
| Operational risk loss data | OR database | Annual |
| CVA parameters | Counterparty risk system | Daily |

#### Calculation Logic / Business Rules
```python
# Standardized Approach
sa_credit_rwa = sum(exposure × risk_weight for each_exposure)

# IRB Approach (Foundation or Advanced)
irb_rwa = sum(ead × k(pd, lgd, maturity) × 12.5 for each_obligor)
where k = function of PD, LGD, M (maturity), correlation

# Output Floor (phased in)
floor_percentage = 0.725  # 72.5% from 2028 onwards
floor_rwa = sa_total_rwa × floor_percentage

if irb_rwa < floor_rwa:
    final_rwa = floor_rwa
    floor_impact = floor_rwa - irb_rwa
else:
    final_rwa = irb_rwa
    floor_impact = 0

# Total RWA
total_rwa = final_credit_rwa + market_rwa + operational_rwa + cva_rwa
```

#### Validation Rules
- IRB PD estimates must be within 10% of historical default rates (backtesting)
- IRB LGD estimates must be within 20% of workout losses (backtesting)
- SA risk weights must match CRR/CRR3 regulatory tables
- Output floor percentage must match current regulatory phase-in schedule
- All RWA calculations must be reconcilable to GL balances

#### Error Handling
- If PD/LGD backtesting fails → amber alert, model review required
- If IRB RWA > SA RWA (unusual) → validate model parameters, alert Model Risk
- If floor impact > 10% of total RWA → review model mix, consider SA optimization
- If RWA calculation diverges from prior day by > 5% → investigate data issue

#### Audit & Compliance Requirements
- PD/LGD models validated annually by independent model validation team
- IRB permissions from supervisor (ECB for SIs, national for LSIs)
- Output floor calculation documented and auditable
- RWA reconciliation to GL performed monthly

---

### 2.3 ICAAP Stress Testing & Planning

#### Description
An integrated capital planning tool that projects capital ratios under stress scenarios, calculates Pillar 2 capital requirements, and supports strategic capital decisions (dividends, issuance, retention).

#### User Stories
- **As a CRO**, I want to project CET1 under an adverse scenario so that I can recommend dividend policy.
- **As a Capital Manager**, I want to calculate Pillar 2A and Pillar 2B requirements so that I can document the ICAAP.
- **As an ALCO Member**, I want to compare capital plans under different growth scenarios so that I can approve the budget.

#### Acceptance Criteria
- [ ] Pillar 1: minimum capital requirements (4.5% CET1, 6% T1, 8% TC)
- [ ] Pillar 2A: additional requirements from supervisor (SREP)
- [ ] Pillar 2B: internal assessment of risks not fully captured in Pillar 1
- [ ] Stress scenarios: base, adverse, severely adverse
- [ ] Capital projection: 3-year horizon with balance sheet growth assumptions
- [ ] Dividend policy simulation: payout ratio impact on capital ratios
- [ ] Capital issuance planning: AT1, T2 issuance impact on ratios and cost

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  ICAAP Capital Planning                                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Capital Requirements Stack                                  │  │
│  │ Pillar 1 (CET1 min): 4.5%                                │  │
│  │ + Pillar 2A (SREP): 2.0%                                 │  │
│  │ + Pillar 2B (Internal): 1.5%                             │  │
│  │ + Capital Conservation: 2.5%                             │  │
│  │ + G-SIB Surcharge: 1.0%                                  │  │
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
│  │ Stress Test Impact (Adverse Scenario)                      │  │
│  │ Metric      │ Base    │ Adverse │ Impact  │ Recovery      │  │
│  │ CET1        │ 14.2%   │ 11.8%   │ -2.4pp  │ 18 months     │  │
│  │ RWA         │ 12.5bn  │ 14.2bn  │ +1.7bn  │ —             │  │
│  │ NII         │ 580M    │ 420M    │ -160M   │ —             │  │
│  │ Credit Loss │ 45M     │ 180M    │ +135M   │ —             │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Run Stress Test] [Plan Capital Issuance] [Export ICAAP Pack]   │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Current capital composition from GL
- RWA projections by risk type
- Balance sheet growth assumptions by business unit
- Stress parameters: credit losses, market losses, NII impact, RWA inflation
- Dividend policy: payout ratio, scrip dividend option
- Capital issuance costs: coupon rates, issuance fees, tax impact

#### Calculation Logic / Business Rules
```python
# Capital projection
for year in range(1, 4):
    projected_cet1 = current_cet1 + retained_earnings - credit_losses - dividends
    projected_rwa = current_rwa × (1 + rwa_growth_rate)^year
    projected_cet1_ratio = projected_cet1 / projected_rwa
    
    # Check against requirements
    if projected_cet1_ratio < total_requirement:
        trigger_capital_raising_or_dividend_cut()

# Stress impact
stressed_cet1 = current_cet1 - stress_credit_losses - stress_market_losses - rwa_inflation_impact
stressed_rwa = current_rwa × (1 + stress_rwa_growth)
stressed_cet1_ratio = stressed_cet1 / stressed_rwa
```

#### Validation Rules
- ICAAP must be reviewed and approved by Board annually
- Pillar 2B must be based on material risks not captured in Pillar 1
- Stress scenarios must be severe but plausible
- Recovery period after stress must be < 24 months
- Capital plan must include management actions (dividend cut, issuance, asset sales)

#### Error Handling
- If projected CET1 < total requirement within 3 years → red alert, immediate capital plan review
- If stressed CET1 < Pillar 1 minimum → red alert, trigger recovery plan
- If ICAAP not approved by Board within 12 months of prior approval → amber alert, schedule review

#### Audit & Compliance Requirements
- ICAAP submitted to supervisor annually
- SREP letter response within deadline
- Capital plan documented in Board minutes
- Stress test results reported to ALCO quarterly

---

### 2.4 MREL/TLAC Tracker

#### Description
Tracks Minimum Requirement for Own Funds and Eligible Liabilities (MREL) and Total Loss-Absorbing Capacity (TLAC) requirements for resolution planning.

#### User Stories
- **As a Resolution Authority contact**, I want to see the MREL ratio so that I can verify resolvability.
- **As a Treasurer**, I want to see the eligible liability stack so that I can plan issuance.
- **As a CRO**, I want to see the gap to MREL requirement so that I can prioritize funding strategy.

#### Acceptance Criteria
- [ ] MREL ratio: eligible liabilities / total liabilities and own funds
- [ ] TLAC ratio: TLAC-eligible instruments / RWA (and leverage exposure)
- [ ] Eligibility criteria: subordination, residual maturity ≥ 1 year, not excluded liabilities
- [ ] Subordination requirement: P2R + 8% (or 13.5% for G-SIBs)
- [ ] Roll-off analysis: eligible instruments maturing within 1, 2, 5 years
- [ ] Issuance plan: planned issuances to close any gap

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  MREL / TLAC Tracker                                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ MREL: 22.5% │ Requirement: 21.0% │ Headroom: +1.5pp │ 🟢  │  │
│  │ TLAC: 24.8% │ Requirement: 22.0% │ Headroom: +2.8pp │ 🟢  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Eligible Liability Stack                                    │  │
│  │ CET1: EUR 900M (MREL-eligible)                             │  │
│  │ AT1: EUR 150M (MREL-eligible)                              │  │
│  │ T2: EUR 200M (MREL-eligible)                               │  │
│  │ Senior Non-Preferred: EUR 1.2bn (MREL-eligible)            │  │
│  │ Total Eligible: EUR 2.45bn                                 │  │
│  │ Excluded: EUR 0.8bn (deposits, derivatives, secured)       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Roll-Off Schedule (Next 5 Years)                           │  │
│  │ Year │ Maturing │ Issued │ Net Change │ Cumulative        │  │
│  │ Y1   │ 200M     │ 300M   │ +100M      │ +100M             │  │
│  │ Y2   │ 150M     │ 250M   │ +100M      │ +200M             │  │
│  │ Y3   │ 300M     │ 400M   │ +100M      │ +300M             │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [View Resolution Plan] [Plan Issuance] [Export to SRB]          │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Own funds from capital module
- Liability data from GL (maturity, subordination, exclusion criteria)
- Resolution plan from Resolution Authority (SRB / national RA)
- Issuance pipeline from Treasury

#### Calculation Logic / Business Rules
```
MREL_Ratio = Eligible_Liabilities / (Total_Liabilities + Own_Funds) × 100
TLAC_Ratio = TLAC_Eligible / RWA × 100
TLAC_Leverage_Ratio = TLAC_Eligible / Leverage_Exposure × 100

Eligible_Liabilities = CET1 + AT1 + T2 + Senior_Non_Preferred + Other_Eligible
Excluded_Liabilities = Insured_Deposits + Derivatives + Secured_Funding + Operational
```

#### Validation Rules
- MREL must meet Loss Absorption Amount (LAA) + Recapitalization Amount (RCA)
- Subordination requirement must be met (unless waived by RA)
- All eligible instruments must have residual maturity ≥ 1 year
- Deposits covered by DGS are excluded from MREL

#### Error Handling
- If MREL < requirement → red alert, trigger issuance plan
- If roll-off > issuance in any year → amber alert, adjust plan
- If new regulatory guidance changes eligibility → review stack, update tracker

#### Audit & Compliance Requirements
- MREL plan submitted to Resolution Authority annually
- Resolution pack updated quarterly
- TLAC reported to FSB for G-SIBs

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **Capital_Calculation** | Daily capital result | calc_id, date, cet1, at1, t2, tier1, total_capital, rwa, leverage_exposure, ratios... |
| **RWA_Credit** | Credit risk RWA detail | rwa_id, calc_id, approach, portfolio, exposure_class, pd, lgd, ead, rwa_amount |
| **RWA_Market** | Market risk RWA detail | rwa_id, calc_id, approach, risk_class, sensitivity, risk_charge |
| **RWA_Operational** | Operational risk RWA | rwa_id, calc_id, bi, ilm, loss_component, rwa_amount |
| **RWA_CVA** | CVA risk RWA | rwa_id, calc_id, approach, exposure, cva_charge, rwa_amount |
| **Capital_Instrument** | Individual capital instrument | instrument_id, type, amount, coupon, maturity, eligibility, included_in_cet1 |
| **MREL_Item** | MREL-eligible liability | item_id, type, amount, maturity, subordination, eligible |
| **ICAAP_Scenario** | ICAAP stress scenario | scenario_id, name, type, parameters, results |

### 3.2 Key Attributes

**RWA_Credit.pd**: Probability of default estimated by IRB model. Must be calibrated to historical default experience. Updated monthly.

**RWA_Credit.lgd**: Loss given default. For advanced IRB, bank's own estimate. For foundation IRB, supervisory estimates. Updated annually or after material economic changes.

### 3.3 Relationships

```
Capital_Calculation (1) ──► RWA_Credit (N)
Capital_Calculation (1) ──► RWA_Market (N)
Capital_Calculation (1) ──► RWA_Operational (N)
Capital_Calculation (1) ──► RWA_CVA (N)
Capital_Calculation (1) ──► Capital_Instrument (N)
Capital_Calculation (1) ──► MREL_Item (N)
ICAAP_Scenario (N) ──► Capital_Calculation (base case)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/capital/ratios` | GET | Get current capital ratios |
| `/api/capital/ratios/history` | GET | Get ratio history |
| `/api/capital/rwa` | GET | Get RWA breakdown |
| `/api/capital/rwa/whatif` | POST | Run RWA what-if |
| `/api/capital/icaap` | GET | Get ICAAP summary |
| `/api/capital/icaap/scenarios` | POST | Run ICAAP scenario |
| `/api/capital/mrel` | GET | Get MREL/TLAC status |
| `/api/capital/instruments` | GET | List capital instruments |
| `/api/capital/reports/corep` | GET | Generate COREP template |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Capital ratio calculation: < 30 seconds
- RWA calculation: < 2 minutes for full portfolio
- ICAAP scenario: < 5 minutes
- Historical queries: < 2 seconds for 1 year

### 5.2 Security
- Capital data classified as strictly confidential
- IRB model parameters restricted to Model Risk and Validation
- Regulatory reports digitally signed
- COREP data encrypted during transmission to supervisor

### 5.3 Availability
- Capital ratios: 99.9% (daily requirement)
- RWA calculator: 99.5% (on-demand)
- MREL tracker: 99.5% (quarterly reporting)
- RTO: 2 hours

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| Capital Dashboard | Daily | Web UI | CRO, Treasurer |
| RWA Breakdown | Monthly | Excel | ALCO, Compliance |
| COREP | Monthly | XBRL/Excel | Compliance → ECB/NCA |
| ICAAP Pack | Annual | PDF | Board → Supervisor |
| MREL Report | Quarterly | PDF | Treasury → SRB |
| Leverage Ratio | Quarterly | Excel | Compliance → Supervisor |
| Capital Plan | Annual | PDF | ALCO → Board |

---

*PRD v1.0 — Capital Management & RWA Engine Module*
