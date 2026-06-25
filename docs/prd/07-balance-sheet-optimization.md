# PRD: Balance Sheet Optimization & Strategic Planning

## 1. Overview

### 1.1 Purpose

The Balance Sheet Optimization & Strategic Planning module enables ALCO to model, simulate, and optimize the bank's balance sheet structure. It supports strategic decisions on asset/liability mix, pricing, hedging, and capital allocation. The module integrates outputs from all other ALM modules (liquidity, IRRBB, capital, ECL, FTP) to provide a holistic view of the trade-offs between profitability, risk, and regulatory constraints.

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **CFO / Treasurer** | Sets balance sheet strategy, approves optimization scenarios |
| **ALCO Chair** | Leads strategic discussions, approves recommendations |
| **Strategic Planning Manager** | Builds optimization models, runs scenarios, presents trade-offs |
| **Business Unit Head** | Inputs growth targets, reviews impact on their unit |
| **Risk Manager** | Validates risk constraints, ensures regulatory limits respected |
| **Board Member** | Reviews strategic plan, approves multi-year capital allocation |

### 1.3 Dependencies

- **All ALM Modules**: LCR, NSFR, EVE, NII, RWA, ECL, FTP outputs feed into optimization
- **Data Foundation**: Balance sheet data, product attributes, counterparty data
- **Finance**: Budget targets, cost allocation, dividend policy
- **Strategy**: Market outlook, competitive positioning, regulatory expectations

---

## 2. Features

### 2.1 Balance Sheet Simulator

#### Description
A scenario-based simulation tool that projects the balance sheet forward under different strategic assumptions (growth rates, pricing, mix changes). Calculates the impact on key ALM metrics.

#### User Stories
- **As a Strategic Planning Manager**, I want to simulate a 10% increase in mortgage lending so that I can see the impact on LCR, NSFR, and capital ratios.
- **As a Treasurer**, I want to compare two funding strategies (retail deposits vs. wholesale) so that I can optimize the funding mix.
- **As an ALCO Member**, I want to see the risk-return trade-off of different balance sheet strategies so that I can make informed decisions.

#### Acceptance Criteria
- [ ] User-defined scenarios: base, aggressive growth, defensive, restructuring
- [ ] Adjustable parameters: asset growth by product, liability growth by source, pricing changes, hedge ratios
- [ ] Output metrics: LCR, NSFR, CET1 ratio, leverage ratio, EVE impact, NII forecast, ROE, RAROC
- [ ] Multi-period projection: 1, 3, and 5 years
- [ ] Constraint checking: regulatory limits flagged if breached
- [ ] Comparison view: side-by-side scenario comparison

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Balance Sheet Simulator                                          │
│  Scenario: [Base Case ▼] [Aggressive Growth] [Defensive]        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Scenario Parameters (Aggressive Growth)                    │  │
│  │ Asset Growth:        Mortgages +15%, Corp Loans +10%       │  │
│  │ Liability Growth:    Retail Deposits +12%, Wholesale +5%   │  │
│  │ Pricing:             Loan rates +20bps, Deposit rates +10bps│  │
│  │ Hedge Ratio:         IRS coverage 60% → 70%                │  │
│  │ [▶ Run Simulation]                                         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Key Metrics Comparison (Year 3)                            │  │
│  │ Metric       │ Base    │ Aggressive │ Impact   │ Status   │  │
│  │ LCR          │ 136%    │ 128%       │ -8pp     │ 🟡       │  │
│  │ NSFR         │ 124%    │ 121%       │ -3pp     │ 🟢       │  │
│  │ CET1 Ratio   │ 14.2%   │ 13.5%      │ -0.7pp   │ 🟢       │  │
│  │ Leverage     │ 5.2%    │ 5.0%       │ -0.2pp   │ 🟢       │  │
│  │ EVE Impact   │ -85M    │ -120M      │ -35M     │ 🟢       │  │
│  │ NII (Y3)     │ 580M    │ 650M       │ +70M     │ 🟢       │  │
│  │ ROE          │ 12.5%   │ 14.2%      │ +1.7pp   │ 🟢       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Constraint Check                                           │  │
│  │ LCR > 120%:     ✅ 128%                                    │  │
│  │ NSFR > 110%:    ✅ 121%                                    │  │
│  │ CET1 > 11.5%:   ✅ 13.5%                                   │  │
│  │ Leverage > 3%:  ✅ 5.0%                                    │  │
│  │ EVE < 15% T1:   ✅ 12.0%                                   │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Save Scenario] [Export Results] [Present to ALCO]              │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Current balance sheet from GL
- Product-level growth assumptions from business units
- Pricing assumptions from Treasury
- Macroeconomic scenarios from Economics
- Regulatory limits from compliance
- Capital plan from Capital Management

#### Calculation Logic / Business Rules
```python
# Projected balance sheet
for year in range(1, horizon + 1):
    projected_assets[year] = current_assets × (1 + growth_rate)^year
    projected_liabilities[year] = current_liabilities × (1 + growth_rate)^year
    
    # Recalculate ALM metrics with projected balances
    projected_lcr[year] = calculate_lcr(projected_assets, projected_liabilities)
    projected_nsfr[year] = calculate_nsfr(projected_assets, projected_liabilities)
    projected_cet1[year] = calculate_cet1(projected_rwa, projected_capital)
    
    # Check constraints
    if projected_lcr[year] < min_lcr:
        flag_constraint_breach("LCR", year)
```

#### Validation Rules
- All scenarios must respect hard regulatory constraints (LCR ≥ 100%, NSFR ≥ 100%, CET1 ≥ minimum)
- Internal risk appetite constraints should be respected but can be overridden with ALCO approval
- Growth assumptions must be realistic (≤ 20% annual growth for any product)
- Scenarios must include management actions if constraints are breached

#### Error Handling
- If scenario breaches hard constraint → block scenario, require parameter adjustment
- If scenario breaches soft constraint → amber warning, allow with ALCO approval
- If calculation fails for any metric → exclude from comparison, alert Risk Manager

---

### 2.2 NIM Attribution Analysis

#### Description
Decomposes Net Interest Margin (NIM) changes into volume, rate, mix, and FTP effects. Explains why NIM changed from one period to another.

#### User Stories
- **As a Finance Manager**, I want to understand why NIM increased by 15bps this quarter so that I can explain it to investors.
- **As a Business Unit Head**, I want to see the volume vs. rate effect on my unit's NIM so that I can focus on the right drivers.
- **As an ALCO Member**, I want to see the FTP effect on NIM so that I can evaluate the impact of our funding strategy.

#### Acceptance Criteria
- [ ] NIM attribution: volume effect, rate effect, mix effect, FTP effect
- [ ] Period-over-period comparison (monthly, quarterly, annually)
- [ ] Business unit and product-level decomposition
- [ ] Interactive waterfall chart showing attribution components
- [ ] Drill-down from headline NIM to individual product contributions

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  NIM Attribution Analysis                                         │
│  Period: Q2 2026 vs Q1 2026 │ NIM: 2.45% → 2.60% (+15bps)      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ NIM Attribution Waterfall                                   │  │
│  │ Q1 NIM: 2.45%                                              │  │
│  │ + Volume Effect:     +5bps  (balance sheet growth)         │  │
│  │ + Rate Effect:       +8bps  (higher loan yields)           │  │
│  │ + Mix Effect:        +3bps  (more high-margin loans)       │  │
│  │ - FTP Effect:        -1bps  (higher funding costs)         │  │
│  │ = Q2 NIM: 2.60%                                            │  │
│  │                                                            │  │
│  │ [Bar chart: waterfall showing each component]              │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Business Unit Contribution                                  │  │
│  │ Unit        │ Volume │ Rate │ Mix │ FTP │ Total            │  │
│  │ Retail      │ +3bps  │ +4bps│ +2bps│ -1bps│ +8bps         │  │
│  │ Corporate   │ +1bps  │ +3bps│ +1bps│  0bps│ +5bps         │  │
│  │ SME         │ +1bps  │ +1bps│  0bps│  0bps│ +2bps         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Drill Down to Product] [Export] [View Historical Trend]        │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Average balances by product (current and prior period)
- Average yields/costs by product (current and prior period)
- FTP rates (current and prior period)
- Product mix percentages

#### Calculation Logic / Business Rules
```python
# NIM attribution formulas
volume_effect = (avg_balance_current - avg_balance_prior) × avg_yield_prior / total_assets
rate_effect = avg_balance_current × (avg_yield_current - avg_yield_prior) / total_assets
mix_effect = total_assets_current × (weighted_avg_yield_current - weighted_avg_yield_prior_at_prior_mix)
ftp_effect = avg_balance_current × (ftp_rate_current - ftp_rate_prior) / total_assets

# Verification
total_nim_change = volume_effect + rate_effect + mix_effect + ftp_effect
```

#### Validation Rules
- Sum of all effects must equal actual NIM change (±1bp tolerance)
- Volume effect should be positive if balance sheet grew and yields were positive
- Rate effect sign depends on whether rates increased or decreased

---

### 2.3 Strategic ALCO Pack Generator

#### Description
An automated report generator that compiles all ALM metrics into a single, executive-ready pack for ALCO meetings. Includes one-page summaries, detailed appendices, and decision support materials.

#### User Stories
- **As an ALCO Secretary**, I want to generate the ALCO pack automatically so that I can save time on manual compilation.
- **As an ALCO Member**, I want a one-page executive summary so that I can quickly understand the key issues.
- **As a Board Member**, I want the ALCO pack in PDF format so that I can review it offline.

#### Acceptance Criteria
- [ ] One-page executive summary: key metrics, alerts, decisions required
- [ ] Standard sections: liquidity, IRRBB, capital, ECL, FTP, optimization
- [ ] Auto-populated from latest calculations (no manual data entry)
- [ ] Traffic light summary: red/amber/green for each metric
- [ ] Decision items: pre-formatted resolution templates
- [ ] Appendices: detailed charts, tables, and backup data
- [ ] Export formats: PDF (for meeting), PowerPoint (for presentation), Excel (for analysis)
- [ ] Distribution: automatic email to ALCO members 48 hours before meeting

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  ALCO Pack Generator                                              │
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
│  │ └────────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │ Decisions Required:                                         │  │
│  │ 1. Approve EUR 500M senior non-preferred issuance (MREL)  │  │
│  │ 2. Increase deposit rates by 15bps (NMD competition)      │  │
│  │ 3. Extend IRS hedge by EUR 200M (EVE protection)          │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Pack Contents                                               │  │
│  │ [✓] Executive Summary    [✓] Liquidity Report            │  │
│  │ [✓] IRRBB Report         [✓] Capital Report              │  │
│  │ [✓] ECL Report           [✓] FTP Report                  │  │
│  │ [✓] Optimization Scenarios [✓] Appendix                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Generate PDF] [Generate PPT] [Generate Excel] [Send to ALCO]   │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- All ALM module outputs (latest calculations)
- ALCO meeting template
- Action item status from previous meeting
- Regulatory deadline calendar
- Market commentary from Economics

#### Validation Rules
- All metrics must be current (within 2 business days of meeting)
- All red/amber alerts must have explanatory text
- All decision items must have supporting analysis in appendices
- Pack must be approved by ALCO Secretary before distribution

---

### 2.4 Regulatory Submission Tracker

#### Description
Tracks all regulatory submissions (COREP, FINREP, Pillar 3, etc.) with deadlines, responsible owners, status, and approval workflow.

#### User Stories
- **As a Compliance Officer**, I want to see all upcoming regulatory deadlines so that I can ensure timely submission.
- **As an ALCO Member**, I want to see the status of the quarterly COREP submission so that I can verify it's on track.
- **As a CRO**, I want to receive an alert when a submission is overdue so that I can escalate.

#### Acceptance Criteria
- [ ] Submission calendar: all regulatory reports with deadlines
- [ ] Status tracking: not started, in progress, under review, submitted, approved
- [ ] Owner assignment: each submission has a responsible person
- [ ] Approval workflow: preparer → reviewer → approver (CRO/CEO)
- [ ] Document repository: all submissions stored with version history
- [ ] Alert system: reminders at T-14, T-7, T-3, T-1 days
- [ ] Escalation: overdue submissions escalated to CRO and Board

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Regulatory Submission Tracker                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Upcoming Deadlines (Next 30 Days)                          │  │
│  │ Report      │ Deadline │ Owner     │ Status    │ Days Left │  │
│  │ COREP (Jun) │ 15-Jul   │ mgarcia   │ In Prog   │ 20        │  │
│  │ LCR (Jun)   │ 15-Jul   │ lchen     │ Review    │ 20        │  │
│  │ NSFR (Q2)   │ 15-Aug   │ lchen     │ Not Start │ 51        │  │
│  │ Pillar 3    │ 30-Sep   │ rwilliams │ Not Start │ 97        │  │
│  │ ICAAP       │ 31-Oct   │ cpeters   │ Draft     │ 128       │  │
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

#### Validation Rules
- All submissions must have an owner and a backup owner
- Deadlines must be validated against regulatory requirements
- Submissions must be approved before deadline (not on the day)
- All submissions must be stored for 7 years

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **Scenario** | Optimization scenario | scenario_id, name, type, parameters_json, results_json, status |
| **NIM_Attribution** | NIM decomposition | attribution_id, period, business_unit, volume_effect, rate_effect, mix_effect, ftp_effect, total_change |
| **ALCO_Pack** | Generated meeting pack | pack_id, meeting_date, status, sections_json, generated_by, distributed_at |
| **Submission** | Regulatory submission | submission_id, report_name, deadline, owner, status, submitted_date, approved_by |

### 3.2 Key Attributes

**Scenario.parameters_json**: JSON object storing all adjustable parameters (growth rates, pricing, hedge ratios, etc.). Enables scenario recreation and comparison.

**Scenario.results_json**: JSON object storing calculated metrics for each year of the projection. Used for comparison charts and constraint checking.

### 3.3 Relationships

```
Scenario (N) ──► All ALM modules (uses outputs)
NIM_Attribution (N) ──► FTP_Report (uses data)
ALCO_Pack (1) ──► All ALM modules (aggregates)
Submission (N) ──► ALCO_Pack (may be referenced)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/optimization/scenarios` | GET | List scenarios |
| `/api/optimization/scenarios` | POST | Create scenario |
| `/api/optimization/scenarios/{id}/run` | POST | Run scenario |
| `/api/optimization/nim` | GET | Get NIM attribution |
| `/api/optimization/alco-pack` | POST | Generate ALCO pack |
| `/api/optimization/alco-pack/{id}` | GET | Download pack |
| `/api/optimization/submissions` | GET | List submissions |
| `/api/optimization/submissions` | POST | Add submission |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Scenario simulation: < 2 minutes for 5-year projection
- NIM attribution: < 30 seconds
- ALCO pack generation: < 5 minutes
- Submission tracker queries: < 1 second

### 5.2 Security
- Scenarios classified as internal use (confidential)
- ALCO packs restricted to ALCO members and invited guests
- Submissions classified as strictly confidential
- All documents digitally signed and encrypted

### 5.3 Availability
- Scenario simulator: 99.5% (on-demand)
- ALCO pack generator: 99.9% (meeting-critical)
- Submission tracker: 99.9% (compliance-critical)
- RTO: 2 hours

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| Balance Sheet Simulation | On demand | Excel/PDF | ALCO, Strategy |
| NIM Attribution | Monthly | Excel/PDF | Finance, ALCO |
| ALCO Pack | Per meeting | PDF/PPT/Excel | ALCO Members |
| Strategic Plan | Annual | PDF | Board |
| Regulatory Tracker | Weekly | Web UI | Compliance, CRO |
| Submission Status | Monthly | PDF | Board Risk Committee |

---

*PRD v1.0 — Balance Sheet Optimization & Strategic Planning Module*
