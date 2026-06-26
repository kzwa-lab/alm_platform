# PRD: Recovery Planning (BoG Recovery Planning Directive)

## 1. Overview

### 1.1 Purpose

The Recovery Planning module manages the bank's recovery plan repository, recovery options menu, quantitative indicators and triggers, and real-time recovery Management Information System (MIS) dashboard. It ensures compliance with the Bank of Ghana 2026 Recovery Planning Directive, which requires all banks and SDIs to maintain a recovery plan, test recovery options annually, and submit the plan to BoG by December 31 each year.

Key capabilities:
- **Recovery plan repository**: Versioned recovery plans with BoG submission tracking
- **Recovery options menu**: Pre-defined management actions with impact quantification
- **Quantitative indicators & triggers**: Real-time monitoring of recovery triggers
- **Recovery MIS dashboard**: Executive dashboard showing recovery status and trigger breaches
- **Annual self-assessment**: Automated recovery plan testing and gap analysis
- **BoG submission**: ORASS-compatible recovery plan submission by December 31

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **Recovery Planning Officer** | Maintains recovery plan, tests recovery options, coordinates with BoG |
| **CRO** | Reviews recovery plan, ensures trigger points are monitored, escalates breaches |
| **ALCO Chair** | Leads recovery planning discussions, approves recovery options |
| **Board Risk Committee** | Reviews and approves recovery plan annually, sets recovery trigger thresholds |
| **CEO** | Ultimate accountability for recovery plan execution |
| **Compliance Officer** | Ensures BoG submission accuracy, tracks submission deadlines |
| **Treasurer** | Implements recovery options (dividend cuts, asset sales, capital issuance) |
| **Risk Manager** | Monitors recovery triggers, validates trigger thresholds |

### 1.3 Dependencies

- **Capital Management** (`04-capital-management.md`): CET1, T1, TC, leverage ratios feed recovery triggers
- **Liquidity Risk** (`02-liquidity-risk.md`): LCR, NSFR, liquidity gaps feed recovery triggers
- **IRRBB** (`03-interest-rate-risk.md`): EVE, NII impact feeds recovery triggers
- **Stress Testing** (`07-stress-testing.md`): Stress scenarios for recovery option testing
- **GRC Risk Framework** (`09-grc-risk-framework.md`): Board-approved risk appetite, limit monitoring
- **Regulatory Reporting** (`10-regulatory-reporting-orass.md`): BoG recovery plan submission

---

## 2. Features

### 2.1 Recovery Plan Repository

#### Description
A central repository for all recovery plans, versions, and BoG submissions. Tracks plan history, approval workflow, and submission status.

#### User Stories
- **As a Recovery Planning Officer**, I want to maintain the current recovery plan so that it reflects the bank's latest risk profile.
- **As a CRO**, I want to see the recovery plan version history so that I can track changes over time.
- **As a Compliance Officer**, I want to verify that the recovery plan was submitted to BoG by December 31.

#### Acceptance Criteria
- [ ] Recovery plan versioning: each plan is dated and versioned
- [ ] Approval workflow: Draft → Review → Board Approval → BoG Submission
- [ ] Plan sections: executive summary, recovery options, trigger framework, governance, communication plan
- [ ] BoG submission tracking: submission date, acknowledgment, feedback, resubmission
- [ ] Document repository: all recovery plan documents stored with version history
- [ ] Annual review: plan must be reviewed and updated annually
- [ ] Trigger threshold review: thresholds must be reviewed and approved by Board Risk Committee annually

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Recovery Plan Repository                                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Current Plan: v2026.1 │ Status: Approved │ Last Updated: 2026-06-25│  │
│  │ BoG Submission: 2025-12-15 │ Acknowledged: 2026-01-10 │ Status: ✅ │  │
│  │ Next Submission Due: 2026-12-31 │ Days Remaining: 189      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Plan Version History                                        │  │
│  │ Version │ Date       │ Status    │ Approver    │ BoG Status │  │
│  │ v2026.1 │ 2026-06-25 │ Approved  │ Board       │ Pending    │  │
│  │ v2025.2 │ 2025-12-15 │ Approved  │ Board       │ Acknowledged│  │
│  │ v2025.1 │ 2025-06-30 │ Approved  │ Board       │ Acknowledged│  │
│  │ v2024.2 │ 2024-12-20 │ Approved  │ Board       │ Acknowledged│  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Create New Version] [View Current Plan] [Export for BoG]     │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Current recovery plan document
- Board approval minutes
- BoG submission records
- Feedback from BoG
- Risk appetite statement from GRC Risk Framework

#### Validation Rules
- Plan must be approved by Board Risk Committee before submission
- Plan must be submitted to BoG by December 31 annually
- All recovery options must have quantified impact
- All triggers must have defined thresholds and monitoring frequency

#### Error Handling
- If plan not approved by December 15 → red alert, escalate to CEO
- If BoG feedback not addressed within 30 days → amber alert, schedule review
- If plan version not updated within 12 months → amber alert, schedule annual review

#### Audit & Compliance Requirements
- Recovery plan retained for 7 years
- BoG submission records retained for 7 years
- Board approval minutes retained for 7 years
- Plan must be tested annually (self-assessment)

---

### 2.2 Recovery Options Menu

#### Description
A pre-defined menu of recovery options with quantified impact on capital, liquidity, and profitability. Each option includes implementation steps, responsible owner, and estimated time to impact.

#### User Stories
- **As a Recovery Planning Officer**, I want to see all available recovery options so that I can recommend the most effective actions.
- **As a Treasurer**, I want to see the impact of a dividend cut on CET1 so that I can implement it quickly if needed.
- **As an ALCO Member**, I want to compare recovery options side-by-side so that I can make informed decisions.

#### Acceptance Criteria
- [ ] Recovery options categorized by type: capital, liquidity, profitability, operational
- [ ] Each option has: description, quantified impact, implementation steps, responsible owner, time to impact
- [ ] Capital options: dividend cut, scrip dividend, asset sales, capital issuance, expense reduction
- [ ] Liquidity options: wholesale funding, asset sales, deposit mobilization, BoG liquidity facility
- [ ] Profitability options: pricing adjustment, mix optimization, cost reduction
- [ ] Operational options: business line divestment, branch closure, staff reduction
- [ ] Impact quantification: effect on CET1, LCR, NSFR, leverage ratio, NII, ROE
- [ ] Option ranking: by speed of impact, magnitude of impact, feasibility
- [ ] Annual testing: each option must be tested annually for feasibility

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Recovery Options Menu                                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Option Categories                                           │  │
│  │ [Capital] [Liquidity] [Profitability] [Operational]        │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Capital Options                                             │  │
│  │ Option              │ CET1 Impact │ LCR Impact │ Time │ Feasibility│  │
│  │ Dividend Cut 100%   │ +1.5pp      │ 0pp        │ 1M   │ High     │  │
│  │ Scrip Dividend      │ +0.8pp      │ 0pp        │ 1M   │ High     │  │
│  │ Asset Sales 200M    │ +1.2pp      │ +5pp       │ 3M   │ Medium   │  │
│  │ AT1 Issuance 500M   │ +2.0pp      │ 0pp        │ 6M   │ Medium   │  │
│  │ Expense Reduction 10%│ +0.5pp     │ 0pp        │ 6M   │ High     │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Liquidity Options                                           │  │
│  │ Option              │ LCR Impact │ NSFR Impact │ Time │ Feasibility│  │
│  │ Wholesale Funding 300M│ +10pp    │ +2pp        │ 1W   │ High     │  │
│  │ Asset Sales 200M    │ +5pp       │ +3pp       │ 3M   │ Medium   │  │
│  │ Deposit Mobilization│ +8pp       │ +5pp       │ 1M   │ High     │  │
│  │ BoG Liquidity Facility│ +15pp    │ 0pp        │ 1D   │ High     │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Test Option] [Add Custom Option] [Export Menu] [Rank Options]│
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Current capital ratios from Capital Management
- Current liquidity ratios from Liquidity Risk
- Current profitability metrics from Finance
- Market data for asset sales and capital issuance
- BoG liquidity facility terms

#### Calculation Logic / Business Rules
```python
# Recovery option impact quantification
def quantify_impact(option, current_metrics):
    impact = {}
    if option.type == "dividend_cut":
        impact.cet1 = current_metrics.cet1 + (dividend_amount / rwa)
        impact.lcr = current_metrics.lcr  # No direct impact
        impact.time_to_impact = 1  # 1 month
    elif option.type == "asset_sales":
        impact.cet1 = current_metrics.cet1 + (gain_on_sale / rwa)
        impact.lcr = current_metrics.lcr + (liquid_assets / hqla)
        impact.time_to_impact = 3  # 3 months
    elif option.type == "wholesale_funding":
        impact.cet1 = current_metrics.cet1  # No direct impact
        impact.lcr = current_metrics.lcr + (funding_amount / net_cash_outflows)
        impact.time_to_impact = 0.25  # 1 week
    return impact

# Option ranking
def rank_options(options, priority="speed"):
    if priority == "speed":
        return sorted(options, key=lambda o: o.time_to_impact)
    elif priority == "magnitude":
        return sorted(options, key=lambda o: o.cet1_impact, reverse=True)
    elif priority == "feasibility":
        return sorted(options, key=lambda o: o.feasibility_score, reverse=True)
```

#### Validation Rules
- All options must have quantified impact on at least one key metric
- All options must have a responsible owner and implementation steps
- Options must be tested annually for feasibility
- Options must not conflict with regulatory requirements (e.g., capital issuance must meet BoG eligibility)

#### Error Handling
- If option impact cannot be quantified → amber alert, require manual estimation
- If option owner not assigned → block option from menu
- If option not tested within 12 months → amber alert, schedule test

---

### 2.3 Quantitative Indicators & Triggers

#### Description
Real-time monitoring of quantitative recovery triggers with automated alerts, escalation workflows, and management action recommendations. Triggers are linked to recovery options and Board Risk Committee escalation.

#### User Stories
- **As a Risk Manager**, I want to see all recovery triggers and their current status so that I can monitor risk appetite.
- **As a CRO**, I want to receive an alert when a recovery trigger is breached so that I can escalate to the Board.
- **As a Board Risk Committee member**, I want to see the trigger history and management actions taken so that I can assess recovery readiness.

#### Acceptance Criteria
- [ ] Trigger categories: capital, liquidity, profitability, operational
- [ ] Capital triggers: CET1 < 7%, T1 < 8%, TC < 10%, leverage < 3%
- [ ] Liquidity triggers: LCR < 100%, NSFR < 100%, liquidity gap > 20%
- [ ] Profitability triggers: NII decline > 20%, ROE < 5%, cost-to-income > 70%
- [ ] Operational triggers: operational loss > 1% of revenue, cyber incident, regulatory breach
- [ ] Trigger severity: early warning (amber), critical (red), emergency (black)
- [ ] Automated alerts: email, SMS, dashboard notification
- [ ] Escalation workflow: Risk Manager → CRO → Board Risk Committee → CEO → BoG
- [ ] Management action recommendation: linked recovery options based on trigger type
- [ ] Trigger history: all breaches, actions, and resolutions logged

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Quantitative Indicators & Triggers                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Trigger Status Summary                                      │  │
│  │ Category    │ Early Warning │ Critical │ Emergency │ Total │  │
│  │ Capital     │ 0             │ 0          │ 0         │ 0     │  │
│  │ Liquidity   │ 1             │ 0          │ 0         │ 1     │  │
│  │ Profitability│ 2            │ 0          │ 0         │ 2     │  │
│  │ Operational │ 0             │ 0          │ 0         │ 0     │  │
│  │ Total       │ 3             │ 0          │ 0         │ 3     │  │
│  │ Overall Status: 🟡 (Early Warning)                         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Trigger Details                                             │  │
│  │ Trigger              │ Threshold │ Current │ Status │ Action │  │
│  │ CET1 < 7%            │ 7.0%      │ 14.2%   │ 🟢     │ None   │  │
│  │ LCR < 100%           │ 100%      │ 128%    │ 🟢     │ None   │  │
│  │ NSFR < 100%          │ 100%      │ 121%    │ 🟢     │ None   │  │
│  │ Liquidity Gap > 20%  │ 20%       │ 15%     │ 🟢     │ None   │  │
│  │ NII Decline > 20%    │ 20%       │ 12%     │ 🟡     │ Monitor│  │
│  │ ROE < 5%             │ 5%        │ 12.5%   │ 🟢     │ None   │  │
│  │ Cost-to-Income > 70% │ 70%       │ 65%     │ 🟢     │ None   │  │
│  │ Operational Loss > 1%│ 1%        │ 0.5%    │ 🟢     │ None   │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [View History] [Adjust Thresholds] [Test Triggers] [Export]     │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Capital ratios from Capital Management
- Liquidity ratios from Liquidity Risk
- Profitability metrics from Finance
- Operational loss data from Operational Risk
- Risk appetite thresholds from GRC Risk Framework

#### Calculation Logic / Business Rules
```python
# Trigger assessment
def assess_trigger(trigger, current_value):
    if current_value < trigger.critical_threshold:
        return "EMERGENCY", trigger.emergency_actions
    elif current_value < trigger.warning_threshold:
        return "CRITICAL", trigger.critical_actions
    elif current_value < trigger.early_warning_threshold:
        return "EARLY_WARNING", trigger.early_warning_actions
    else:
        return "NORMAL", []

# Escalation workflow
def escalate_trigger(trigger, severity):
    if severity == "EMERGENCY":
        notify("CRO", "Board Risk Committee", "CEO", "BoG")
    elif severity == "CRITICAL":
        notify("CRO", "Board Risk Committee")
    elif severity == "EARLY_WARNING":
        notify("Risk Manager", "CRO")

# Management action recommendation
def recommend_actions(trigger, severity):
    if trigger.category == "capital" and severity == "CRITICAL":
        return ["dividend_cut", "asset_sales", "capital_issuance"]
    elif trigger.category == "liquidity" and severity == "CRITICAL":
        return ["wholesale_funding", "asset_sales", "bog_liquidity_facility"]
    elif trigger.category == "profitability" and severity == "EARLY_WARNING":
        return ["pricing_adjustment", "cost_reduction"]
```

#### Validation Rules
- All triggers must have defined thresholds for early warning, critical, and emergency
- All triggers must be monitored in real-time (or at least daily)
- All trigger breaches must be logged with timestamp, value, and action taken
- Trigger thresholds must be reviewed annually by Board Risk Committee
- Emergency triggers must notify BoG within 24 hours

#### Error Handling
- If trigger data missing → use last available, alert Data Engineering
- If trigger breach not acknowledged within 1 hour → escalate to CRO
- If emergency trigger not escalated to BoG within 24 hours → red alert, compliance breach

---

### 2.4 Recovery MIS Dashboard

#### Description
An executive dashboard showing real-time recovery status, trigger breaches, management actions, and recovery plan readiness. Provides a single view for CRO, Board Risk Committee, and BoG inspection.

#### User Stories
- **As a CRO**, I want to see the recovery status at a glance so that I can make quick decisions.
- **As a Board Risk Committee member**, I want to see the recovery plan readiness and trigger status so that I can assess the bank's resilience.
- **As a BoG examiner**, I want to see the recovery MIS dashboard so that I can verify compliance with the Recovery Planning Directive.

#### Acceptance Criteria
- [ ] Real-time status: all recovery triggers with current values and status
- [ ] Recovery plan readiness: percentage of plan completed, tested, and approved
- [ ] Management actions: active actions, completed actions, pending actions
- [ ] Recovery options: available options, tested options, feasibility status
- [ ] Historical view: trigger breaches, actions taken, outcomes over time
- [ ] Drill-down: from summary to detailed trigger history, action logs, and plan documents
- [ ] Export: PDF report for Board Risk Committee, BoG inspection
- [ ] Mobile access: responsive design for executive access

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Recovery MIS Dashboard                                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Overall Recovery Status: 🟢 (All Triggers Normal)            │  │
│  │ Recovery Plan Readiness: 95% │ Last Tested: 2026-06-15    │  │
│  │ Next BoG Submission: 2026-12-31 │ Days Remaining: 189       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Trigger Status (Real-Time)                                  │  │
│  │ Category    │ Normal │ Early Warning │ Critical │ Emergency │  │
│  │ Capital     │ 4      │ 0             │ 0          │ 0         │  │
│  │ Liquidity   │ 3      │ 1             │ 0          │ 0         │  │
│  │ Profitability│ 2     │ 2             │ 0          │ 0         │  │
│  │ Operational │ 2      │ 0             │ 0          │ 0         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Active Management Actions                                     │  │
│  │ Action              │ Owner    │ Status    │ Due Date     │  │
│  │ Monitor NII Decline │ Risk Mgr │ In Progress│ 2026-07-15  │  │
│  │ Review Cost Structure│ CFO     │ Pending   │ 2026-07-30  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Recovery Options Availability                               │  │
│  │ Option              │ Tested │ Feasible │ Time to Impact │  │
│  │ Dividend Cut        │ ✅     │ ✅       │ 1M             │  │
│  │ Asset Sales         │ ✅     │ ✅       │ 3M             │  │
│  │ AT1 Issuance        │ ✅     │ 🟡       │ 6M             │  │
│  │ Wholesale Funding   │ ✅     │ ✅       │ 1W             │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [View Details] [Export Report] [Run Self-Assessment] [Update Plan]│
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Real-time trigger data from all risk modules
- Recovery plan status from Recovery Plan Repository
- Management action status from workflow system
- Recovery option test results from Recovery Options Menu

#### Validation Rules
- Dashboard must update at least every 15 minutes
- All trigger statuses must be accurate (no stale data > 1 hour)
- Recovery plan readiness must be calculated based on completed sections
- All management actions must have owner and due date

#### Error Handling
- If dashboard data stale > 1 hour → show stale badge, alert Data Engineering
- If trigger status inconsistent → flag for manual review
- If recovery plan readiness < 80% → amber alert, schedule review

---

### 2.5 Annual Self-Assessment

#### Description
An automated self-assessment tool that tests the recovery plan's effectiveness, identifies gaps, and generates a report for Board Risk Committee and BoG submission.

#### User Stories
- **As a Recovery Planning Officer**, I want to run the annual self-assessment so that I can identify gaps in the recovery plan.
- **As a CRO**, I want to see the self-assessment results so that I can address gaps before BoG submission.
- **As a Board Risk Committee member**, I want to review the self-assessment report so that I can approve the recovery plan.

#### Acceptance Criteria
- [ ] Self-assessment sections: plan completeness, trigger adequacy, option feasibility, governance effectiveness, communication plan
- [ ] Gap identification: missing sections, outdated triggers, untested options, governance weaknesses
- [ ] Scoring: each section scored 1-5, overall readiness percentage
- [ ] Recommendations: automated recommendations for gap remediation
- [ ] Report generation: PDF report for Board Risk Committee and BoG
- [ ] Annual schedule: self-assessment must be completed by November 30
- [ ] BoG submission: self-assessment report included in recovery plan submission

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Annual Self-Assessment                                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Assessment Date: 2026-11-15 │ Status: In Progress            │  │
│  │ Overall Readiness: 85% │ Target: 90% │ Gap: 5%              │  │
│  │ Next Submission: 2026-12-31 │ Days Remaining: 46             │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Section Scores                                              │  │
│  │ Section              │ Score │ Weight │ Weighted Score │ Gap │  │
│  │ Plan Completeness    │ 4.5   │ 20%    │ 0.90           │ No  │  │
│  │ Trigger Adequacy     │ 4.0   │ 20%    │ 0.80           │ No  │  │
│  │ Option Feasibility   │ 3.5   │ 20%    │ 0.70           │ Yes │  │
│  │ Governance           │ 4.5   │ 20%    │ 0.90           │ No  │  │
│  │ Communication Plan   │ 3.0   │ 20%    │ 0.60           │ Yes │  │
│  │ Total                │       │ 100%   │ 3.90           │     │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Gap Analysis                                                │  │
│  │ Gap                  │ Severity │ Recommendation │ Due Date │  │
│  │ Option Feasibility   │ Medium   │ Test AT1 issuance│ 2026-12-15│  │
│  │ Communication Plan   │ High     │ Update contact list│ 2026-11-30│  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Run Assessment] [View Recommendations] [Generate Report] [Export]│
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Recovery plan document
- Trigger test results
- Recovery option test results
- Governance review results
- Communication plan review

#### Validation Rules
- Self-assessment must be completed by November 30
- All gaps must have remediation plan and due date
- Overall readiness must be ≥ 80% for BoG submission
- Board Risk Committee must approve self-assessment before submission

#### Error Handling
- If self-assessment not completed by November 30 → red alert, escalate to CRO
- If overall readiness < 80% → amber alert, require gap remediation plan
- If gap not addressed by due date → red alert, escalate to Board Risk Committee

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **Recovery_Plan** | Recovery plan document | plan_id, version, date, status, sections_json, approved_by, approved_at, bog_submission_date |
| **Recovery_Option** | Recovery option | option_id, type, description, impact_json, owner, feasibility, last_tested |
| **Recovery_Trigger** | Quantitative trigger | trigger_id, category, name, early_warning_threshold, critical_threshold, emergency_threshold, current_value, status |
| **Trigger_Breach** | Trigger breach event | breach_id, trigger_id, date, value, severity, actions_taken, resolved_at |
| **Management_Action** | Management action | action_id, trigger_id, option_id, owner, status, due_date, completed_at |
| **Self_Assessment** | Annual self-assessment | assessment_id, date, section_scores_json, overall_readiness, gaps_json, approved_by |

### 3.2 Key Attributes

**Recovery_Option.impact_json**: JSON object storing quantified impact on key metrics (CET1, LCR, NSFR, leverage, NII, ROE). Used for option comparison and recommendation.

**Recovery_Trigger.status**: Current status of trigger — "NORMAL", "EARLY_WARNING", "CRITICAL", "EMERGENCY". Updated in real-time or at least daily.

**Self_Assessment.overall_readiness**: Percentage score (0-100%) indicating recovery plan readiness. Must be ≥ 80% for BoG submission.

### 3.3 Relationships

```
Recovery_Plan (1) ──► Recovery_Option (N)
Recovery_Plan (1) ──► Recovery_Trigger (N)
Recovery_Trigger (1) ──► Trigger_Breach (N)
Trigger_Breach (1) ──► Management_Action (N)
Recovery_Plan (1) ──► Self_Assessment (N)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/recovery/plans` | GET | List recovery plans |
| `/api/recovery/plans` | POST | Create new recovery plan |
| `/api/recovery/plans/{id}` | GET | Get recovery plan details |
| `/api/recovery/options` | GET | List recovery options |
| `/api/recovery/options/{id}/test` | POST | Test recovery option |
| `/api/recovery/triggers` | GET | List recovery triggers |
| `/api/recovery/triggers/{id}/status` | GET | Get trigger status |
| `/api/recovery/triggers/{id}/breaches` | GET | Get trigger breach history |
| `/api/recovery/actions` | GET | List management actions |
| `/api/recovery/actions` | POST | Create management action |
| `/api/recovery/dashboard` | GET | Get recovery MIS dashboard |
| `/api/recovery/self-assessment` | POST | Run annual self-assessment |
| `/api/recovery/self-assessment/{id}` | GET | Get self-assessment report |
| `/api/recovery/reports/bog` | GET | Generate BoG recovery plan submission |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Recovery plan retrieval: < 2 seconds
- Trigger status update: < 30 seconds
- Dashboard load: < 5 seconds
- Self-assessment generation: < 2 minutes
- BoG report generation: < 60 seconds

### 5.2 Security
- Recovery plan data classified as strictly confidential
- Trigger data restricted to Risk, CRO, and Board Risk Committee
- Dashboard access restricted to executives and Risk team
- BoG submission data encrypted during transmission

### 5.3 Availability
- Recovery plan repository: 99.9% (compliance-critical)
- Trigger monitoring: 99.9% (real-time requirement)
- Dashboard: 99.9% (executive access)
- RTO: 2 hours

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| Recovery Plan | Annual | PDF | Board Risk Committee → BoG |
| Recovery MIS Dashboard | Real-time | Web UI | CRO, Board Risk Committee |
| Trigger Status Report | Daily | PDF | CRO, Risk Manager |
| Management Action Report | Weekly | PDF | CRO, ALCO |
| Recovery Option Test Report | Annual | PDF | Board Risk Committee |
| Self-Assessment Report | Annual | PDF | Board Risk Committee → BoG |
| BoG Submission Package | Annual | ORASS XML | Compliance → BoG |
| Trigger Breach Register | Monthly | PDF | CRO, Board Risk Committee |

---

## 7. Appendices

### 7.1 Recovery Trigger Thresholds

| Trigger | Early Warning | Critical | Emergency | Metric Source |
|---------|---------------|----------|-----------|---------------|
| CET1 | < 10% | < 8% | < 7% | Capital Management |
| T1 | < 12% | < 10% | < 8% | Capital Management |
| TC | < 14% | < 12% | < 10% | Capital Management |
| Leverage | < 4% | < 3.5% | < 3% | Capital Management |
| LCR | < 120% | < 110% | < 100% | Liquidity Risk |
| NSFR | < 110% | < 105% | < 100% | Liquidity Risk |
| Liquidity Gap | > 15% | > 18% | > 20% | Liquidity Risk |
| NII Decline | > 10% | > 15% | > 20% | IRRBB |
| ROE | < 8% | < 6% | < 5% | Finance |
| Cost-to-Income | > 60% | > 65% | > 70% | Finance |
| Operational Loss | > 0.5% | > 0.8% | > 1% | Operational Risk |

### 7.2 Recovery Options Impact Matrix

| Option | CET1 | LCR | NSFR | NII | Time |
|--------|------|-----|------|-----|------|
| Dividend Cut 100% | +1.5pp | 0pp | 0pp | 0pp | 1M |
| Scrip Dividend | +0.8pp | 0pp | 0pp | 0pp | 1M |
| Asset Sales 200M | +1.2pp | +5pp | +3pp | -0.2pp | 3M |
| AT1 Issuance 500M | +2.0pp | 0pp | 0pp | -0.5pp | 6M |
| Expense Reduction 10% | +0.5pp | 0pp | 0pp | +0.3pp | 6M |
| Wholesale Funding 300M | 0pp | +10pp | +2pp | -0.1pp | 1W |
| Deposit Mobilization | 0pp | +8pp | +5pp | -0.2pp | 1M |
| BoG Liquidity Facility | 0pp | +15pp | 0pp | -0.3pp | 1D |
| Pricing Adjustment | 0pp | 0pp | 0pp | +0.5pp | 1M |
| Cost Reduction | +0.3pp | 0pp | 0pp | +0.2pp | 3M |

### 7.3 BoG Recovery Planning Directive Requirements

| Requirement | Description | Frequency |
|-------------|-------------|-----------|
| Recovery Plan | Documented recovery plan with options, triggers, governance | Annual |
| Submission | Submit recovery plan to BoG by December 31 | Annual |
| Self-Assessment | Test recovery plan effectiveness and identify gaps | Annual |
| Trigger Monitoring | Monitor quantitative triggers in real-time | Continuous |
| Management Actions | Implement recovery options when triggers breached | As needed |
| Board Approval | Board Risk Committee must approve recovery plan | Annual |
| BoG Notification | Notify BoG within 24 hours of emergency trigger breach | As needed |

### 7.4 Configuration Keys

| Key | Description | Default Value |
|-----|-------------|---------------|
| `recovery.plan.submission_month` | Month for BoG submission | 12 |
| `recovery.plan.submission_day` | Day for BoG submission | 31 |
| `recovery.plan.review_months` | Months between plan reviews | 12 |
| `recovery.trigger.check_frequency_minutes` | Trigger check frequency | 15 |
| `recovery.trigger.escalation_hours` | Hours to escalate trigger breach | 1 |
| `recovery.trigger.bog_notification_hours` | Hours to notify BoG of emergency | 24 |
| `recovery.self_assessment.due_month` | Month for self-assessment completion | 11 |
| `recovery.self_assessment.due_day` | Day for self-assessment completion | 30 |
| `recovery.self_assessment.min_readiness_pct` | Minimum readiness for submission | 80 |
| `recovery.option.test_frequency_months` | Months between option tests | 12 |
| `recovery.reporting.retention_years` | Retention period for recovery data | 7 |

---

*PRD v1.0 — Recovery Planning (BoG Recovery Planning Directive)*
