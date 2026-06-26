# PRD: Behavioural Model Library (Shared Modelling Service)

## 1. Overview

### 1.1 Purpose

The Behavioural Model Library is a shared modelling service consumed by the IRRBB module, the Liquidity Stress Testing module, and the FTP module. It centralises the estimation, versioning, backtesting, and regulatory governance of all behavioural assumptions used in ALM calculations: Non-Maturity Deposit (NMD) core/volatile splits, Conditional Prepayment Rates (CPR) for fixed-rate loans, and Term Deposit Redemption Rates (TDRR) for time deposits.

All behavioural parameters are configurable, versioned, and back-testable, so assumptions can be validated against the bank's own observed behaviour and updated as the BoG drafts finalise. The library enforces regulatory caps on core deposit proportions and average maturities where the BoG Standardised Framework prescribes conservative limits.

### 1.2 Users & Roles

| Role | Responsibilities |
|------|-----------------|
| **Model Developer** | Estimates NMD decay profiles, CPR speeds, TDRR scalars; submits assumption sets for review |
| **Model Validator** | Independently validates behavioural models, reviews backtesting results, approves or rejects assumption sets |
| **Treasurer** | Reviews NMD core/volatile split and replicating portfolio allocation; approves FTP-relevant assumptions |
| **Risk Manager** | Uses behavioural assumptions in IRRBB EVE/NII and liquidity stress calculations; reviews model risk |
| **ALCO Member** | Approves production assumption sets; reviews backtesting summary before ALCO meetings |
| **Compliance Officer** | Ensures regulatory caps are enforced; documents assumptions for supervisory review |

### 1.3 Dependencies

- **Upstream**: Historical balance data from Data Foundation (`01-data-foundation.md`), loan servicing data, deposit transaction data, macroeconomic data
- **Downstream**: IRRBB module (`03-interest-rate-risk.md`), Liquidity Risk module (`02-liquidity-risk.md`), FTP module (`06-ftp.md`)
- **External**: BoG IRRBB Guideline (Standardised Framework caps), BoG LRMD (stress testing assumptions), internal audit review

---

## 2. Features

### 2.1 NMD Core Deposit Modeler

#### Description
Estimates the stable "core" portion of Non-Maturity Deposits (NMDs) — retail current, savings, and SME transactional accounts — versus the volatile "non-core" portion that is likely to run off under stress. The model produces a core ratio, a behavioural maturity profile, and a replicating portfolio allocation. The BoG Standardised Framework prescribes conservative caps on the proportion of NMDs that can be treated as core and the average maturity into which core deposits may be slotted.

#### User Stories
- **As a Model Developer**, I want to estimate the core deposit ratio for retail savings accounts from 5 years of historical balance data so that I can submit a validated assumption set.
- **As a Model Validator**, I want to see the backtesting results comparing predicted core balances to actual balances over the last 12 months so that I can approve the model.
- **As a Treasurer**, I want to see the replicating portfolio allocation for core deposits so that I can size hedging trades.
- **As a Compliance Officer**, I want the system to enforce the BoG regulatory cap on core deposit proportion so that we cannot exceed the Standardised Framework limit.

#### Acceptance Criteria
- [ ] NMD categories: retail current, retail savings, SME current, SME savings, corporate current
- [ ] Core ratio estimation: regression of monthly balances against market rate changes, seasonal factors, and macro variables
- [ ] Volatile ratio = 100% - core ratio (volatile deposits repriced immediately / run off under stress)
- [ ] Core deposit behavioural maturity: weighted average of core balances across tenors (O/N, 3M, 6M, 1Y, 2Y, 3Y, 5Y, >5Y)
- [ ] BoG regulatory cap enforced: core ratio cannot exceed the BoG-prescribed maximum for each NMD category (configurable; default 70% for retail, 50% for SME, 30% for corporate)
- [ ] Average maturity cap enforced: core deposits cannot be slotted into buckets with average maturity exceeding the BoG cap (configurable; default 4 years for retail, 2 years for SME)
- [ ] Backtesting: predicted core balance vs. actual balance over 12 months; mean absolute percentage error (MAPE) < 10%
- [ ] Replicating portfolio allocation: core balance distributed across tenors with weights summing to 100%
- [ ] Endowment effect: replicating portfolio yield - actual deposit cost

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  NMD Core Deposit Modeler                                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ NMD Category: [Retail Savings ▼] │ Core Ratio: 68% │ 🟢    │  │
│  │ BoG Cap: 70% │ Status: Within Cap │ MAPE (12M): 7.2% │ ✅   │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Core Allocation by Tenor (Replicating Portfolio)              │  │
│  │ Tenor  │ Weight │ FTP Rate │ Contribution │ BoG Limit      │  │
│  │ O/N    │ 5%     │ 3.40%    │ 0.17%        │ —              │  │
│  │ 3M     │ 10%    │ 3.52%    │ 0.35%        │ —              │  │
│  │ 6M     │ 15%    │ 3.60%    │ 0.54%        │ —              │  │
│  │ 1Y     │ 20%    │ 3.75%    │ 0.75%        │ —              │  │
│  │ 2Y     │ 15%    │ 3.90%    │ 0.59%        │ ≤ 4Y avg       │  │
│  │ 3Y     │ 15%    │ 4.05%    │ 0.61%        │                │  │
│  │ 5Y     │ 15%    │ 4.20%    │ 0.63%        │                │  │
│  │ >5Y    │ 5%     │ 4.50%    │ 0.23%        │                │  │
│  │ Total  │ 100%   │          │ 3.85%        │ Avg: 2.8Y ✅   │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Backtesting Results (Last 12 Months)                        │  │
│  │ Month │ Predicted Core │ Actual Core │ Error │ Status      │  │
│  │ M-12  │ 3.55bn        │ 3.52bn      │ +0.8% │ ✅          │  │
│  │ M-11  │ 3.58bn        │ 3.60bn      │ -0.6% │ ✅          │  │
│  │ ...   │ ...           │ ...         │ ...   │ ...         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Run Estimation] [Submit for Review] [View History] [Export]   │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Frequency |
|-------|--------|-----------|
| Historical NMD balances by product | Deposit system / CBS | Monthly (5+ years) |
| Market rate changes (Ghana Reference Rate) | Market data | Monthly |
| Macroeconomic variables (GDP, inflation, unemployment) | Economics team / vendor | Quarterly |
| Seasonal factors | Internal model | Annual update |
| FTP curve by tenor | FTP module | Daily |
| Actual deposit rates paid | Deposit system | Monthly |

#### Calculation Logic / Business Rules
```python
# Core ratio estimation (simplified regression)
core_ratio = intercept + beta_rate × rate_change + beta_gdp × gdp_growth + beta_season × seasonal_factor

# Enforce BoG cap
core_ratio = min(core_ratio, bog_core_cap)

# Core behavioural maturity (weighted average)
behavioural_maturity = sum(weight_tenor × tenor_in_years) for all tenors

# Enforce average maturity cap
if behavioural_maturity > bog_avg_maturity_cap:
    redistribute_weights_to_meet_cap()

# Replicating portfolio yield
rp_yield = sum(weight_tenor × ftp_rate(tenor)) for all tenors

# Endowment effect
endowment_effect = rp_yield - actual_deposit_cost
endowment_benefit = endowment_effect × core_balance
```

#### Validation Rules
- Core ratio must be between 0% and the BoG cap for the category
- Allocation weights must sum to 100%
- Average behavioural maturity must not exceed BoG cap
- Backtesting MAPE must be < 10% for approval
- Replicating portfolio yield must be > actual deposit cost (positive endowment)
- All assumption sets must be approved before use in production runs

#### Error Handling
- Core ratio > BoG cap → auto-cap to maximum, alert Compliance Officer, flag for review
- Backtesting MAPE > 10% → amber alert, require model enhancement before approval
- Missing historical data → use conservative assumption (core = 0%, volatile = 100%), alert Model Risk
- Negative endowment effect → red alert, review deposit pricing or FTP curve

#### Audit & Compliance Requirements
- All NMD assumption sets versioned and retained for 7 years
- Backtesting results retained for 7 years
- Approval records include approver, timestamp, and digital signature
- Changes to approved assumptions trigger model-risk review per BoG IRRBB Guideline

---

### 2.2 Prepayment (CPR) Modeler

#### Description
Estimates scenario-dependent Conditional Prepayment Rates (CPR) for fixed-rate loan portfolios. CPR measures the annualised percentage of the outstanding loan balance that prepays in a given period. The model produces base-case, upside, and downside CPR assumptions that feed into IRRBB cash-flow slotting and liquidity stress testing.

#### User Stories
- **As a Model Developer**, I want to estimate CPR for fixed-rate mortgages based on historical prepayment data and interest rate changes so that IRRBB cash flows are realistic.
- **As a Risk Manager**, I want to see how CPR changes under a +200bps rate shock so that I can assess EVE sensitivity.
- **As a Model Validator**, I want to backtest CPR predictions against actual prepayments so that I can validate the model.

#### Acceptance Criteria
- [ ] CPR estimated by product: fixed-rate mortgages, fixed-rate corporate loans, fixed-rate SME loans
- [ ] Base CPR: estimated from historical prepayment data (minimum 3 years)
- [ ] Scenario-dependent CPR: base CPR adjusted by rate-scenario multiplier (rates up → CPR down; rates down → CPR up)
- [ ] CPR must be between 0% and 100%
- [ ] Backtesting: predicted prepayments vs. actual prepayments over 12 months; MAPE < 15%
- [ ] Versioned assumption sets: Draft → Review → Approved
- [ ] CPR assumptions linked to every `Run` and `Scenario` for reproducibility

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  CPR Prepayment Modeler                                           │
│  Product: [Fixed-Rate Mortgage ▼] │ Base CPR: 8.5% │ Status: ✅  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Scenario-Dependent CPR                                      │  │
│  │ Scenario      │ Rate Change │ CPR Multiplier │ Result CPR │  │
│  │ Base Case     │ 0 bps       │ 1.00           │ 8.5%       │  │
│  │ Upside (+100) │ +100 bps    │ 0.85           │ 7.2%       │  │
│  │ Downside (-100)│ -100 bps   │ 1.25           │ 10.6%      │  │
│  │ Severe (-200) │ -200 bps    │ 1.50           │ 12.8%      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Backtesting (Last 12 Months)                                │  │
│  │ Month │ Predicted Prepay │ Actual Prepay │ Error │ Status │  │
│  │ M-12  │ 45M             │ 42M           │ +7.1% │ ✅     │  │
│  │ M-11  │ 48M             │ 50M           │ -4.0% │ ✅     │  │
│  │ ...   │ ...             │ ...           │ ...   │ ...    │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Run Estimation] [Submit for Review] [View History] [Export]   │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Frequency |
|-------|--------|-----------|
| Historical prepayment data | Loan servicing system | Monthly (3+ years) |
| Outstanding loan balances | Loan system | Monthly |
| Interest rate changes | Market data / Ghana Reference Rate | Monthly |
| Macroeconomic variables | Economics team | Quarterly |
| House price index (for mortgages) | External vendor / BoG | Quarterly |

#### Calculation Logic / Business Rules
```python
# Base CPR estimation (simplified)
base_cpr = intercept + beta_rate × rate_change + beta_hpi × hpi_change + beta_age × loan_age

# Scenario adjustment
cpr_scenario = base_cpr × cpr_multiplier(scenario)

# Enforce bounds
cpr_scenario = max(0, min(cpr_scenario, 1.0))

# Apply to amortization schedule
for month in remaining_months:
    prepayment = outstanding_balance × cpr_scenario / 12
    outstanding_balance -= (scheduled_principal + prepayment)
```

#### Validation Rules
- CPR must be between 0% and 100%
- Base CPR must be calibrated to at least 3 years of historical data
- Scenario multipliers must be monotonic (higher rate shock → lower CPR)
- Backtesting MAPE must be < 15%
- Assumption sets must be approved before use in production runs

#### Error Handling
- CPR > 100% → cap at 100%, alert Model Risk
- Missing prepayment data → use conservative base CPR of 5%, alert Model Risk
- Backtesting MAPE > 15% → amber alert, require model review
- Negative CPR → floor at 0%, alert Model Risk

#### Audit & Compliance Requirements
- All CPR assumption sets versioned and retained for 7 years
- Backtesting results retained for 7 years
- Approval records include approver, timestamp, and digital signature

---

### 2.3 Early-Redemption (TDRR) Modeler

#### Description
Estimates scenario-dependent Term Deposit Redemption Rates (TDRR) for time deposits and certificates of deposit. TDRR measures the percentage of term deposits that are redeemed early (before contractual maturity) under different interest rate and stress scenarios. This is critical for IRRBB repricing gap analysis and liquidity stress testing.

#### User Stories
- **As a Model Developer**, I want to estimate TDRR for 1-year term deposits based on historical early-redemption data so that IRRBB cash flows reflect realistic behaviour.
- **As a Risk Manager**, I want to see how TDRR increases under a severe rate rise scenario so that I can assess liquidity outflows.
- **As a Model Validator**, I want to backtest TDRR predictions against actual early redemptions so that I can validate the model.

#### Acceptance Criteria
- [ ] TDRR estimated by product: retail term deposits, SME term deposits, corporate term deposits, CDs
- [ ] Base TDRR: estimated from historical early-redemption data (minimum 3 years)
- [ ] Scenario-dependent TDRR: base TDRR adjusted by rate-scenario multiplier and stress multiplier
- [ ] TDRR must be between 0% and 100%
- [ ] Backtesting: predicted early redemptions vs. actual over 12 months; MAPE < 15%
- [ ] Versioned assumption sets: Draft → Review → Approved
- [ ] TDRR assumptions linked to every `Run` and `Scenario` for reproducibility

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  TDRR Early-Redemption Modeler                                    │
│  Product: [Retail Term Deposit 1Y ▼] │ Base TDRR: 3.2% │ Status: ✅│
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Scenario-Dependent TDRR                                     │  │
│  │ Scenario      │ Rate Change │ Stress Mult │ Result TDRR   │  │
│  │ Base Case     │ 0 bps       │ 1.00        │ 3.2%          │  │
│  │ Upside (+100) │ +100 bps    │ 1.30        │ 4.2%          │  │
│  │ Downside (-100)│ -100 bps   │ 0.80        │ 2.6%          │  │
│  │ Severe (+200) │ +200 bps    │ 2.00        │ 6.4%          │  │
│  │ Market-wide    │ —          │ 3.00        │ 9.6%          │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Backtesting (Last 12 Months)                                │  │
│  │ Month │ Predicted Redemption │ Actual │ Error │ Status    │  │
│  │ M-12  │ 12M                 │ 11M    │ +9.1% │ ✅        │  │
│  │ M-11  │ 15M                 │ 14M    │ +7.1% │ ✅        │  │
│  │ ...   │ ...                 │ ...    │ ...   │ ...       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Run Estimation] [Submit for Review] [View History] [Export]   │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Frequency |
|-------|--------|-----------|
| Historical early-redemption data | Deposit system / CBS | Monthly (3+ years) |
| Outstanding term deposit balances | Deposit system | Monthly |
| Interest rate changes | Market data / Ghana Reference Rate | Monthly |
| Macroeconomic variables | Economics team | Quarterly |
| Material early-redemption penalties | Product master | On change |

#### Calculation Logic / Business Rules
```python
# Base TDRR estimation (simplified)
base_tdrr = intercept + beta_rate × rate_change + beta_penalty × penalty_amount + beta_macro × macro_factor

# Scenario adjustment
tdrr_scenario = base_tdrr × rate_multiplier(scenario) × stress_multiplier(scenario)

# Enforce bounds
tdrr_scenario = max(0, min(tdrr_scenario, 1.0))

# Apply to term deposit maturity ladder
for deposit in term_deposits:
    early_redemption = deposit.balance × tdrr_scenario
    remaining_maturity = deposit.maturity_date - today
    if early_redemption > 0:
        reallocate_cashflow_to_shorter_bucket(remaining_maturity)
```

#### Validation Rules
- TDRR must be between 0% and 100%
- Base TDRR must be calibrated to at least 3 years of historical data
- Rate multipliers must be monotonic (higher rate rise → higher TDRR)
- Stress multipliers must be ≥ 1.0 for stress scenarios
- Backtesting MAPE must be < 15%
- Assumption sets must be approved before use in production runs

#### Error Handling
- TDRR > 100% → cap at 100%, alert Model Risk
- Missing early-redemption data → use conservative base TDRR of 5%, alert Model Risk
- Backtesting MAPE > 15% → amber alert, require model review
- Negative TDRR → floor at 0%, alert Model Risk

#### Audit & Compliance Requirements
- All TDRR assumption sets versioned and retained for 7 years
- Backtesting results retained for 7 years
- Approval records include approver, timestamp, and digital signature

---

### 2.4 Assumption Set Manager

#### Description
A unified repository for all versioned, approved behavioural assumption sets. Every assumption set (NMD, CPR, TDRR) is dated, versioned, and linked to calculation runs for full reproducibility. The manager enforces the approval workflow and prevents unapproved assumptions from being used in production.

#### User Stories
- **As a Model Developer**, I want to create a new assumption set combining NMD, CPR, and TDRR assumptions so that I can share it across modules.
- **As a Model Validator**, I want to review an assumption set before it is approved so that I can challenge unrealistic assumptions.
- **As a Risk Manager**, I want to see which assumption set was used in a historical calculation run so that I can reproduce the result for audit.

#### Acceptance Criteria
- [ ] Assumption sets contain: NMD core ratios, CPR assumptions, TDRR assumptions, macro scenario weights
- [ ] Versioning: every assumption set is dated and versioned; immutable once approved
- [ ] Approval workflow: Draft → Review (Model Validator) → Approved (ALCO or designated approver)
- [ ] Unapproved assumption sets blocked from production runs
- [ ] Audit trail: who changed what and why, with before/after values
- [ ] Cross-module sharing: one assumption set can be referenced by IRRBB, Liquidity, and FTP runs

#### Data Inputs
- NMD core ratio estimates from NMD Modeler
- CPR estimates from CPR Modeler
- TDRR estimates from TDRR Modeler
- Macro scenario weights from Economics team
- ALCO approval decisions

#### Calculation Logic / Business Rules
- Assumption set status transitions: Draft → Under Review → Approved → Archived
- Only `Approved` assumption sets can be referenced by `Run` records
- New versions require explicit creation; old versions remain immutable
- Every `Run` stores a foreign key to the assumption set used

#### Validation Rules
- All components (NMD, CPR, TDRR) must be present in a complete assumption set
- NMD core ratios must be within BoG caps
- CPR and TDRR must be between 0% and 100%
- Assumption sets must be approved before use in production

#### Error Handling
- Unapproved assumption set selected for run → block run execution, alert Risk Manager
- Missing component in assumption set → reject submission, alert Model Developer
- Inconsistent assumptions (e.g., high core ratio + high TDRR for same product) → warning, require justification

#### Audit & Compliance Requirements
- All assumption sets versioned and retained for 7 years
- Approval records include approver, timestamp, and digital signature
- Changes to approved assumptions trigger model-risk review
- Every run linked to assumption set version for full reproducibility

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **NMDModel** | NMD core deposit assumption | nmd_model_id, product_id, core_ratio, core_cap, volatile_ratio, behavioural_maturity, avg_maturity_cap, allocation_json, rp_yield, endowment_effect, backtesting_mape, status |
| **CPRModel** | Prepayment assumption | cpr_model_id, product_id, base_cpr, cpr_multiplier_json, backtesting_mape, status |
| **TDRRModel** | Early-redemption assumption | tdrr_model_id, product_id, base_tdrr, tdrr_multiplier_json, stress_multiplier, backtesting_mape, status |
| **AssumptionSet** | Combined assumption set | assumption_set_id, name, version, nmd_model_id, cpr_model_id, tdrr_model_id, macro_weights_json, status, approved_by, approved_at |
| **BacktestResult** | Backtesting execution | backtest_id, model_id, model_type, test_date, predicted_values_json, actual_values_json, mape, status |
| **ModelVersion** | Version history | version_id, model_id, version_number, created_at, created_by, change_reason, status |

### 3.2 Key Attributes

**NMDModel.allocation_json**: JSON object storing the percentage allocation of core deposits across tenors. Must sum to 1.0 (100%). Updated annually based on historical balance analysis. Enforces BoG average maturity cap.

**CPRModel.cpr_multiplier_json**: JSON object mapping scenario name to CPR multiplier (e.g., `{"base": 1.0, "upside_100": 0.85, "downside_100": 1.25, "severe_200": 1.50}`).

**TDRRModel.tdrr_multiplier_json**: JSON object mapping scenario name to TDRR rate multiplier and stress multiplier.

**AssumptionSet.macro_weights_json**: JSON object storing macroeconomic scenario weights (e.g., `{"base": 0.50, "upside": 0.20, "downside": 0.20, "severe": 0.10}`). Weights must sum to 1.0.

### 3.3 Relationships

```
NMDModel (N) ──► Product (1)
CPRModel (N) ──► Product (1)
TDRRModel (N) ──► Product (1)
AssumptionSet (1) ──► NMDModel (1)
AssumptionSet (1) ──► CPRModel (1)
AssumptionSet (1) ──► TDRRModel (1)
AssumptionSet (1) ──► Run (N)
BacktestResult (N) ──► NMDModel (1)
BacktestResult (N) ──► CPRModel (1)
BacktestResult (N) ──► TDRRModel (1)
ModelVersion (N) ──► NMDModel (1)
ModelVersion (N) ──► CPRModel (1)
ModelVersion (N) ──► TDRRModel (1)
```

---

## 4. API Specification

### 4.1 Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/behavioural/nmd` | Admin/Model | List NMD models |
| POST | `/api/behavioural/nmd` | Model Developer | Create NMD model |
| GET | `/api/behavioural/nmd/{id}` | All roles | Get NMD model details |
| POST | `/api/behavioural/nmd/{id}/backtest` | Model Validator | Run NMD backtest |
| GET | `/api/behavioural/cpr` | Admin/Model | List CPR models |
| POST | `/api/behavioural/cpr` | Model Developer | Create CPR model |
| GET | `/api/behavioural/cpr/{id}` | All roles | Get CPR model details |
| POST | `/api/behavioural/cpr/{id}/backtest` | Model Validator | Run CPR backtest |
| GET | `/api/behavioural/tdrr` | Admin/Model | List TDRR models |
| POST | `/api/behavioural/tdrr` | Model Developer | Create TDRR model |
| GET | `/api/behavioural/tdrr/{id}` | All roles | Get TDRR model details |
| POST | `/api/behavioural/tdrr/{id}/backtest` | Model Validator | Run TDRR backtest |
| GET | `/api/behavioural/assumption-sets` | All roles | List assumption sets |
| POST | `/api/behavioural/assumption-sets` | Model Developer | Create assumption set |
| GET | `/api/behavioural/assumption-sets/{id}` | All roles | Get assumption set details |
| POST | `/api/behavioural/assumption-sets/{id}/approve` | ALCO/Model Validator | Approve assumption set |
| GET | `/api/behavioural/backtests` | All roles | List backtest results |

### 4.2 Request/Response Examples

**Create NMD Model**
```http
POST /api/behavioural/nmd
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "product_id": "P-002",
  "core_ratio": 0.68,
  "core_cap": 0.70,
  "behavioural_maturity": 2.8,
  "avg_maturity_cap": 4.0,
  "allocation_json": {
    "O/N": 0.05, "3M": 0.10, "6M": 0.15, "1Y": 0.20,
    "2Y": 0.15, "3Y": 0.15, "5Y": 0.15, ">5Y": 0.05
  }
}

Response: 201 Created
{
  "nmd_model_id": "nmd-2026-001",
  "status": "draft",
  "backtesting_required": true
}
```

**Approve Assumption Set**
```http
POST /api/behavioural/assumption-sets/ass-2026-001/approve
Authorization: Bearer {jwt}

Response: 200 OK
{
  "assumption_set_id": "ass-2026-001",
  "status": "approved",
  "approved_by": "mjones",
  "approved_at": "2026-06-25T14:00:00Z"
}
```

---

## 5. Non-Functional Requirements

### 5.1 Performance
- NMD core ratio estimation: < 30 seconds for 100k accounts
- CPR/TDRR estimation: < 30 seconds per product
- Backtesting: < 1 minute per model
- Assumption set creation: < 5 seconds
- Historical query: < 2 seconds for 5 years of data

### 5.2 Security
- Model parameters classified as confidential (competitive sensitivity)
- Backtesting results restricted to Model Risk and Validation roles
- Assumption set approval requires dual authorization (Model Validator + ALCO)
- All model changes logged in immutable audit trail

### 5.3 Availability
- Model estimation: 99.5% (on-demand)
- Backtesting: 99.5% (on-demand)
- Assumption set manager: 99.9% (production-critical)
- RTO: 2 hours

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| NMD Model Summary | Monthly | PDF | ALCO, Treasury, Model Risk |
| CPR Model Summary | Monthly | PDF | ALCO, Risk, Model Risk |
| TDRR Model Summary | Monthly | PDF | ALCO, Risk, Model Risk |
| Backtesting Report | Quarterly | PDF | Model Validation, ALCO |
| Assumption Set Change Log | Monthly | Web UI | All ALM Users |
| Model Risk Register | Quarterly | PDF | CRO, Board Risk Committee |

---

## 7. Appendix

### 7.1 Regulatory References
- Bank of Ghana Guideline on the Management and Measurement of Interest Rate Risk in the Banking Book (IRRBB), 2026 (Exposure Draft) — Standardised Framework NMD caps and slotting rules
- Bank of Ghana Liquidity Risk Management Directive (LRMD), 2026 (Exposure Draft) — Stress testing behavioural assumptions
- Basel Committee on Banking Supervision — IRRBB standards (April 2016) and shock recalibration (July 2024)

### 7.2 Configuration Keys

| Key | Default | Description |
|-----|---------|-------------|
| `behavioural.nmd.retail_core_cap` | `0.70` | Maximum core ratio for retail NMDs |
| `behavioural.nmd.sme_core_cap` | `0.50` | Maximum core ratio for SME NMDs |
| `behavioural.nmd.corporate_core_cap` | `0.30` | Maximum core ratio for corporate NMDs |
| `behavioural.nmd.retail_avg_maturity_cap_years` | `4` | Maximum average maturity for retail core deposits |
| `behavioural.nmd.sme_avg_maturity_cap_years` | `2` | Maximum average maturity for SME core deposits |
| `behavioural.nmd.backtest_mape_threshold` | `10` | Maximum acceptable MAPE for NMD backtesting |
| `behavioural.cpr.backtest_mape_threshold` | `15` | Maximum acceptable MAPE for CPR backtesting |
| `behavioural.tdrr.backtest_mape_threshold` | `15` | Maximum acceptable MAPE for TDRR backtesting |
| `behavioural.cpr.max_rate` | `1.0` | Maximum CPR (100%) |
| `behavioural.tdrr.max_rate` | `1.0` | Maximum TDRR (100%) |

---

*PRD v1.0 — Behavioural Model Library Module*
