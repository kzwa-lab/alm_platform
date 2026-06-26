# PRD: Governance, Risk & Compliance (GRC) Risk Framework (RMD 2021 / CISD 2026)

## 1. Overview

### 1.1 Purpose

The Governance, Risk & Compliance (GRC) Risk Framework module digitises the bank's Risk Management Framework (RMF) under the Bank of Ghana Risk Management Directive 2021 (RMD 2021) and Cyber and Information Security Directive 2026 (CISD 2026). It enforces the Three Lines of Defence (3LoD) model, ensures CRO independence (no dual-hatting), maintains the Risk Universe Register, manages the Board-approved Risk Appetite Statement (RAS), tracks limit breaches with 10-day notification to BoG, and provides audit evidence for regulatory inspection.

Key capabilities:
- **Digitised RMF**: Central repository for risk policies, procedures, and governance documents
- **Risk Universe Register**: Comprehensive register of all risks (credit, market, liquidity, operational, strategic, climate, cyber, ESG)
- **3LoD RBAC**: Role-based access control aligned with Three Lines of Defence
- **CRO independence**: Enforces no dual-hatting (CRO cannot hold CFO/COO/Internal Audit roles)
- **Front/back-office segregation**: Enforced separation in user roles and system access
- **Risk Appetite Statement (RAS)**: Board-approved risk appetite with quantitative limits and qualitative statements
- **Limit framework**: Configurable risk limits with breach workflow and escalation
- **Breach notification**: Automated 10-day breach notification to BoG
- **Audit evidence**: Complete audit trail for all risk decisions and limit breaches

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **Board Risk Committee Chair** | Reviews and approves RMF, RAS, and recovery plan; oversees CRO independence |
| **CRO** | Owns the RMF, ensures 3LoD effectiveness, reviews limit breaches, no dual-hatting |
| **Risk Manager** | Maintains Risk Universe Register, monitors limits, manages breach workflow |
| **Compliance Officer** | Ensures regulatory compliance, manages BoG notifications, tracks breach deadlines |
| **Internal Auditor** | Independent assurance on RMF effectiveness, reviews breach handling |
| **CEO** | Ultimate accountability for risk management, approves RAS |
| **Business Unit Head** | First line of defence, owns risks in their unit, implements controls |
| **Model Validator** | Second line of defence, validates risk models and assumptions |
| **IT Security Officer** | Manages cyber risk, ensures CISD 2026 compliance |

### 1.3 Dependencies

- **Data Foundation** (`01-data-foundation.md`): User directory, role definitions, audit log
- **Cyber Security & Data Residency** (`12-cyber-security-data-residency.md`): CISD 2026 compliance, encryption, identity management
- **All Risk Modules**: Limit breaches from liquidity, IRRBB, capital, ECL feed into GRC
- **Regulatory Reporting** (`10-regulatory-reporting-orass.md`): BoG breach notifications

---

## 2. Features

### 2.1 Digitised Risk Management Framework (RMF)

#### Description
A central repository for all risk management policies, procedures, governance documents, and risk appetite statements. Supports version control, approval workflow, and regulatory mapping.

#### User Stories
- **As a CRO**, I want to maintain the digitised RMF so that all risk policies are accessible and up-to-date.
- **As a Compliance Officer**, I want to map risk policies to BoG regulatory requirements so that I can demonstrate compliance.
- **As an Internal Auditor**, I want to review the RMF version history so that I can verify governance effectiveness.

#### Acceptance Criteria
- [ ] Policy repository: all risk policies stored with version control
- [ ] Approval workflow: Draft → Review → Board Approval → Publication
- [ ] Regulatory mapping: each policy mapped to BoG directive requirements
- [ ] Search and retrieval: full-text search across all policies
- [ ] Notification: automatic notification when policies are updated or expire
- [ ] RMF sections: risk governance, risk identification, risk measurement, risk monitoring, risk reporting, risk control
- [ ] Annual review: all policies must be reviewed annually
- [ ] Board approval: all policies must be approved by Board Risk Committee

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Digitised Risk Management Framework (RMF)                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ RMF Status: Current Version 2026.1 │ Last Review: 2026-06-25│  │
│  │ Board Approval: 2026-03-15 │ Next Review: 2027-03-15         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Policy Sections                                             │  │
│  │ Section              │ Policies │ Status    │ Last Updated  │  │
│  │ Risk Governance      │ 5        │ ✅        │ 2026-06-25    │  │
│  │ Risk Identification  │ 8        │ ✅        │ 2026-05-15    │  │
│  │ Risk Measurement     │ 12       │ ✅        │ 2026-06-10    │  │
│  │ Risk Monitoring      │ 6        │ ✅        │ 2026-04-20    │  │
│  │ Risk Reporting       │ 4        │ ✅        │ 2026-06-01    │  │
│  │ Risk Control         │ 10       │ 🟡        │ 2026-03-15    │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Regulatory Mapping (BoG Directives)                         │  │
│  │ Directive    │ Requirements │ Mapped │ Gap    │ Status     │  │
│  │ RMD 2021     │ 25           │ 25     │ 0      │ ✅         │  │
│  │ CISD 2026    │ 18           │ 18     │ 0      │ ✅         │  │
│  │ LMTD 2026    │ 15           │ 15     │ 0      │ ✅         │  │
│  │ LRMD 2026    │ 12           │ 12     │ 0      │ ✅         │  │
│  │ IRRBB 2026   │ 10           │ 10     │ 0      │ ✅         │  │
│  │ Recovery 2026│ 8            │ 8      │ 0      │ ✅         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Add Policy] [Review Policy] [Export RMF] [View History]        │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Risk policies from CRO office
- BoG directive requirements from Compliance
- Board approval minutes
- Internal audit findings

#### Validation Rules
- All policies must have unique identifier and version
- All policies must be approved before publication
- All policies must be reviewed annually
- Regulatory mapping must be complete (no gaps)

#### Error Handling
- If policy expires without review → amber alert, notify CRO
- If regulatory mapping incomplete → red alert, notify Compliance
- If policy approval missing → block publication

#### Audit & Compliance Requirements
- RMF retained for 7 years
- All policy versions retained for 7 years
- Board approval records retained for 7 years
- BoG may request RMF for inspection

---

### 2.2 Risk Universe Register

#### Description
A comprehensive register of all risks faced by the bank, including credit, market, liquidity, operational, strategic, climate, cyber, and ESG risks. Each risk has an owner, assessment, controls, and monitoring status.

#### User Stories
- **As a Risk Manager**, I want to maintain the Risk Universe Register so that all risks are identified and managed.
- **As a CRO**, I want to see the risk heat map so that I can prioritise risk management efforts.
- **As a Board Risk Committee member**, I want to review the top risks so that I can allocate resources effectively.

#### Acceptance Criteria
- [ ] Risk categories: credit, market, liquidity, operational, strategic, climate, cyber, ESG, reputational, legal/compliance
- [ ] Risk attributes: ID, name, category, owner, inherent risk, residual risk, controls, monitoring frequency
- [ ] Risk assessment: impact (1-5) × probability (1-5) = risk score
- [ ] Risk heat map: visual representation of risk scores by category
- [ ] Control mapping: each risk linked to controls and control effectiveness
- [ ] Monitoring: risk status (green/amber/red) updated at defined frequency
- [ ] Annual review: all risks reviewed and reassessed annually
- [ ] Board reporting: top 10 risks reported to Board Risk Committee quarterly

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Risk Universe Register                                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Risk Heat Map                                               │  │
│  │ [Heat map: Impact (1-5) vs Probability (1-5)]             │  │
│  │ High Impact / High Probability: 3 risks (red)              │  │
│  │ High Impact / Low Probability: 5 risks (amber)            │  │
│  │ Low Impact / High Probability: 4 risks (amber)              │  │
│  │ Low Impact / Low Probability: 12 risks (green)             │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Top 10 Risks                                                │  │
│  │ Rank │ Risk Name          │ Category  │ Score │ Status │ Owner │  │
│  │ 1    │ Credit Deterioration│ Credit    │ 20    │ 🔴     │ RM1   │  │
│  │ 2    │ Liquidity Stress    │ Liquidity │ 18    │ 🟡     │ RM2   │  │
│  │ 3    │ Cyber Attack        │ Cyber     │ 16    │ 🟡     │ ISO   │  │
│  │ 4    │ Interest Rate Risk  │ Market    │ 15    │ 🟡     │ RM3   │  │
│  │ 5    │ Operational Failure │ Operational│ 14   │ 🟡     │ RM4   │  │
│  │ 6    │ Climate Risk        │ Climate   │ 12    │ 🟡     │ RM5   │  │
│  │ 7    │ Regulatory Change   │ Legal     │ 10    │ 🟡     │ CO    │  │
│  │ 8    │ Strategic Risk      │ Strategic │ 9     │ 🟢     │ RM6   │  │
│  │ 9    │ ESG Risk            │ ESG       │ 8     │ 🟢     │ RM7   │  │
│  │ 10   │ Reputational Risk   │ Reputational│ 7   │ 🟢     │ RM8   │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Add Risk] [Review Risk] [View Controls] [Export Register]      │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Risk assessments from business units
- Control assessments from Internal Audit
- External risk data (market, regulatory, environmental)
- Incident data from operational risk system

#### Validation Rules
- All risks must have unique ID and owner
- All risks must be assessed at least annually
- All high-risk items (score ≥ 15) must have mitigation plan
- All risks must have at least one control

#### Error Handling
- If risk not reviewed within 12 months → amber alert, notify owner
- If high-risk item has no mitigation plan → red alert, notify CRO
- If risk owner not assigned → block risk registration

---

### 2.3 Three Lines of Defence (3LoD) RBAC

#### Description
Role-based access control aligned with the Three Lines of Defence model. Enforces segregation of duties, CRO independence, and front/back-office separation.

#### User Stories
- **As a CRO**, I want to ensure my role is independent (no dual-hatting) so that I can maintain objectivity.
- **As an IT Administrator**, I want to enforce 3LoD roles so that users can only access functions appropriate to their line of defence.
- **As a Compliance Officer**, I want to verify that no user has conflicting roles so that I can demonstrate regulatory compliance.

#### Acceptance Criteria
- [ ] 3LoD roles: First Line (business units), Second Line (risk, compliance), Third Line (internal audit)
- [ ] CRO independence: CRO role cannot be combined with CFO, COO, or Internal Audit roles
- [ ] Front/back-office segregation: front-office users cannot access back-office functions
- [ ] Role conflict detection: automatic detection and blocking of conflicting roles
- [ ] Approval workflow: role changes require approval from CRO and HR
- [ ] Audit trail: all role changes logged with user, timestamp, and approver
- [ ] Quarterly review: all user roles reviewed quarterly for compliance

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Three Lines of Defence (3LoD) RBAC                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Role Conflict Detection                                     │  │
│  │ User          │ Roles              │ Conflict │ Status     │  │
│  │ jsmith        │ CRO, CFO           │ YES      │ 🔴 Blocked │  │
│  │ mgarcia       │ Risk Manager       │ NO       │ ✅ Active  │  │
│  │ lchen         │ Treasury, Back Office│ YES     │ 🔴 Blocked │  │
│  │ rwilliams     │ Internal Audit      │ NO       │ ✅ Active  │  │
│  │ cpeters       │ CRO                 │ NO       │ ✅ Active  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 3LoD Role Assignment                                        │  │
│  │ Line of Defence │ Roles              │ Users  │ Status     │  │
│  │ First Line      │ Business Unit Heads│ 8      │ ✅         │  │
│  │ First Line      │ Relationship Mgrs  │ 25     │ ✅         │  │
│  │ Second Line     │ Risk Managers      │ 6      │ ✅         │  │
│  │ Second Line     │ Compliance Officers│ 4      │ ✅         │  │
│  │ Second Line     │ CRO                │ 1      │ ✅         │  │
│  │ Third Line      │ Internal Auditors  │ 5      │ ✅         │  │
│  │ Third Line      │ Model Validators   │ 3      │ ✅         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Add User] [Assign Role] [Review Conflicts] [Export Report]     │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- User directory from HR system
- Role definitions from CRO office
- 3LoD policy from GRC Risk Framework
- CRO independence requirements from RMD 2021

#### Validation Rules
- CRO cannot hold CFO, COO, or Internal Audit roles
- Front-office users cannot have back-office roles
- Role changes must be approved by CRO and HR
- All users must have at least one role
- No user can have roles from all three lines of defence

#### Error Handling
- If role conflict detected → block role assignment, alert CRO and HR
- If CRO dual-hatting detected → critical alert, block access, notify Board
- If role not reviewed within 90 days → amber alert, schedule review

---

### 2.4 Risk Appetite Statement (RAS) & Limit Framework

#### Description
Manages the Board-approved Risk Appetite Statement (RAS) with quantitative limits and qualitative statements. Tracks limit breaches, manages breach workflow, and generates BoG notifications.

#### User Stories
- **As a Board Risk Committee member**, I want to review and approve the RAS so that I can set the bank's risk appetite.
- **As a Risk Manager**, I want to monitor all risk limits so that I can identify breaches early.
- **As a Compliance Officer**, I want to generate the 10-day breach notification to BoG so that I can meet regulatory requirements.

#### Acceptance Criteria
- [ ] RAS sections: capital, liquidity, market, credit, operational, strategic, climate, cyber, ESG
- [ ] Quantitative limits: CET1 > 7%, LCR > 100%, NSFR > 100%, leverage > 3%, EVE < 15% T1, NPL < 5%
- [ ] Qualitative statements: risk culture, governance, control environment
- [ ] Limit hierarchy: Board → CRO → Risk Manager → Business Unit
- [ ] Breach workflow: detection → alert → investigation → action → resolution → notification
- [ ] 10-day notification: automatic BoG notification within 10 days of breach
- [ ] Escalation: amber → CRO, red → Board Risk Committee, black → CEO + BoG
- [ ] Annual review: RAS reviewed and approved by Board annually
- [ ] Public disclosure: RAS summary disclosed in annual report

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Risk Appetite Statement (RAS) & Limit Framework                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ RAS Status: Approved 2026-03-15 │ Next Review: 2027-03-15  │  │
│  │ Board Risk Committee: Approved │ CRO: Approved              │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Limit Status Summary                                        │  │
│  │ Category    │ Limits │ Normal │ Amber │ Red │ Black │ Breach │  │
│  │ Capital     │ 5      │ 5      │ 0     │ 0   │ 0     │ 0      │  │
│  │ Liquidity   │ 4      │ 3      │ 1     │ 0   │ 0     │ 0      │  │
│  │ Market      │ 3      │ 2      │ 1     │ 0   │ 0     │ 0      │  │
│  │ Credit      │ 4      │ 3      │ 1     │ 0   │ 0     │ 0      │  │
│  │ Operational │ 3      │ 3      │ 0     │ 0   │ 0     │ 0      │  │
│  │ Total       │ 19     │ 16     │ 3     │ 0   │ 0     │ 0      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Active Breaches                                             │  │
│  │ Limit              │ Threshold │ Current │ Severity │ Days │ BoG Notified│  │
│  │ NII Decline        │ 20%       │ 12%     │ 🟡       │ 5    │ No          │  │
│  │ Liquidity Gap      │ 20%       │ 15%     │ 🟡       │ 3    │ No          │  │
│  │ Cost-to-Income     │ 70%       │ 65%     │ 🟡       │ 7    │ No          │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [View Limits] [Add Limit] [Review RAS] [Generate BoG Notification]│
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Board-approved RAS document
- Risk limits from all risk modules
- Breach data from limit monitoring system
- BoG notification templates from Compliance

#### Calculation Logic / Business Rules
```python
# Limit breach assessment
def assess_breach(limit, current_value):
    if current_value >= limit.black_threshold:
        return "BLACK", "CEO + Board + BoG"
    elif current_value >= limit.red_threshold:
        return "RED", "Board Risk Committee"
    elif current_value >= limit.amber_threshold:
        return "AMBER", "CRO"
    else:
        return "NORMAL", None

# BoG notification
def notify_bog(breach):
    if breach.severity in ["RED", "BLACK"]:
        if breach.days_since_breach >= 10:
            generate_bog_notification(breach)
            send_to_bog(breach)
            breach.bog_notified = True

# Escalation
def escalate_breach(breach):
    if breach.severity == "AMBER":
        notify("CRO")
    elif breach.severity == "RED":
        notify("CRO", "Board Risk Committee")
    elif breach.severity == "BLACK":
        notify("CRO", "Board Risk Committee", "CEO", "BoG")
```

#### Validation Rules
- All limits must have amber, red, and black thresholds
- All breaches must be logged with timestamp, value, and action
- BoG notification must be sent within 10 days for red/black breaches
- All limits must be reviewed annually
- RAS must be approved by Board Risk Committee

#### Error Handling
- If limit threshold missing → block limit activation
- If breach not acknowledged within 1 hour → escalate
- If BoG notification not sent within 10 days → red alert, compliance breach
- If RAS not approved within 12 months → amber alert, schedule review

---

### 2.5 Audit Evidence & Regulatory Inspection

#### Description
Provides complete audit trail for all risk decisions, limit breaches, policy changes, and governance actions. Supports regulatory inspection and internal audit.

#### User Stories
- **As an Internal Auditor**, I want to see the complete audit trail for a limit breach so that I can verify proper handling.
- **As a Compliance Officer**, I want to generate an inspection report for BoG so that I can demonstrate compliance.
- **As a CRO**, I want to review audit findings so that I can address gaps in risk management.

#### Acceptance Criteria
- [ ] Audit trail: all risk decisions, limit breaches, policy changes, role changes
- [ ] Immutable logs: logs cannot be modified or deleted
- [ ] Search and filter: by date, user, action type, risk category
- [ ] Export: PDF, Excel, CSV for audit and inspection
- [ ] Retention: 7 years for all audit records
- [ ] Regulatory inspection: pre-formatted inspection report for BoG
- [ ] Internal audit: integration with internal audit findings and action tracking
- [ ] Digital signatures: all critical actions digitally signed

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Audit Evidence & Regulatory Inspection                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Audit Trail Search                                          │  │
│  │ Date Range: [2026-01-01] to [2026-06-25] │ Category: [All ▼]│  │
│  │ Action Type: [All ▼] │ User: [All ▼] │ Risk ID: [All ▼]   │  │
│  │ [Search] [Export] [Generate Inspection Report]                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Audit Trail Results                                         │  │
│  │ Date       │ User    │ Action           │ Category │ Risk ID │  │
│  │ 2026-06-25│ jsmith  │ Limit Breach      │ Liquidity│ LQ-001  │  │
│  │ 2026-06-24│ mgarcia │ Policy Update     │ Credit   │ CR-005  │  │
│  │ 2026-06-23│ lchen   │ Role Change       │ Governance│ GO-001  │  │
│  │ 2026-06-22│ rwilliams│ RAS Approval     │ Governance│ GO-002  │  │
│  │ 2026-06-21│ cpeters │ BoG Notification  │ Compliance│ CO-001  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Regulatory Inspection Report                                │  │
│  │ Inspection Date: [2026-06-25] │ Inspector: [BoG Team]       │  │
│  │ Sections: [✓] RMF [✓] RAS [✓] Limits [✓] Breaches [✓] Audit │  │
│  │ [Generate Report] [Export to PDF] [Send to Inspector]        │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Audit logs from all risk modules
- User actions from system logs
- Policy changes from RMF
- Limit breaches from Limit Framework
- BoG notifications from Compliance

#### Validation Rules
- All audit logs must be immutable
- All critical actions must be digitally signed
- Audit trail must be complete (no gaps)
- Inspection report must cover all required sections

#### Error Handling
- If audit log gap detected → red alert, investigate
- If inspection report incomplete → amber alert, complete missing sections
- If digital signature missing → block action, require signature

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **RMF_Policy** | Risk management policy | policy_id, name, section, version, content, approved_by, approved_at, status, regulatory_mapping |
| **Risk_Universe** | Risk register entry | risk_id, name, category, owner, impact, probability, score, controls, status, review_date |
| **User_Role** | User role assignment | user_id, role, line_of_defence, assigned_at, approved_by, status |
| **RAS_Limit** | Risk appetite limit | limit_id, name, category, amber_threshold, red_threshold, black_threshold, current_value, status |
| **Limit_Breach** | Limit breach event | breach_id, limit_id, date, value, severity, actions, resolved_at, bog_notified |
| **Audit_Log** | Audit trail entry | log_id, date, user, action, category, risk_id, description, digital_signature |
| **BoG_Notification** | BoG breach notification | notification_id, breach_id, date, type, content, sent_at, acknowledgment |

### 3.2 Key Attributes

**User_Role.line_of_defence**: First Line (business), Second Line (risk/compliance), Third Line (audit). Used for 3LoD enforcement and conflict detection.

**Limit_Breach.severity**: "NORMAL", "AMBER", "RED", "BLACK". Determines escalation path and BoG notification requirements.

**Audit_Log.digital_signature**: Cryptographic signature ensuring log immutability. Required for all critical actions (breach, policy change, role change, RAS approval).

### 3.3 Relationships

```
RMF_Policy (N) ──► Risk_Universe (N) (policies map to risks)
User_Role (N) ──► Audit_Log (N) (user actions logged)
RAS_Limit (1) ──► Limit_Breach (N)
Limit_Breach (1) ──► BoG_Notification (N)
Risk_Universe (1) ──► RAS_Limit (N) (limits manage risks)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/grc/policies` | GET | List RMF policies |
| `/api/grc/policies` | POST | Create new policy |
| `/api/grc/policies/{id}` | GET | Get policy details |
| `/api/grc/risks` | GET | List Risk Universe |
| `/api/grc/risks` | POST | Add new risk |
| `/api/grc/risks/{id}` | GET | Get risk details |
| `/api/grc/roles` | GET | List user roles |
| `/api/grc/roles` | POST | Assign role |
| `/api/grc/roles/conflicts` | GET | Detect role conflicts |
| `/api/grc/limits` | GET | List RAS limits |
| `/api/grc/limits` | POST | Create new limit |
| `/api/grc/limits/{id}/breaches` | GET | Get breach history |
| `/api/grc/breaches` | GET | List all breaches |
| `/api/grc/breaches/{id}/notify` | POST | Generate BoG notification |
| `/api/grc/audit` | GET | Get audit trail |
| `/api/grc/audit/inspection` | POST | Generate inspection report |
| `/api/grc/ras` | GET | Get current RAS |
| `/api/grc/ras` | POST | Update RAS |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Policy retrieval: < 2 seconds
- Risk Universe search: < 2 seconds
- Role conflict detection: < 5 seconds
- Limit breach assessment: < 30 seconds
- Audit trail search: < 2 seconds
- Inspection report generation: < 2 minutes

### 5.2 Security
- All GRC data classified as strictly confidential
- Role changes require dual authorization (CRO + HR)
- Audit logs immutable and cryptographically signed
- BoG notifications encrypted during transmission
- CRO independence enforced at system level

### 5.3 Availability
- RMF repository: 99.9% (compliance-critical)
- Risk Universe: 99.9% (risk-critical)
- Limit monitoring: 99.9% (real-time requirement)
- Audit trail: 99.9% (audit-critical)
- RTO: 2 hours

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| RMF Status | Quarterly | PDF | Board Risk Committee |
| Risk Universe Register | Quarterly | PDF | Board Risk Committee |
| Risk Heat Map | Monthly | PDF | CRO, ALCO |
| 3LoD Role Report | Quarterly | PDF | CRO, HR |
| RAS & Limit Status | Monthly | PDF | ALCO, Board Risk Committee |
| Limit Breach Register | Monthly | PDF | CRO, Board Risk Committee |
| BoG Breach Notification | As needed | ORASS XML | Compliance → BoG |
| Audit Trail | On demand | PDF/Excel | Internal Audit, BoG |
| Regulatory Inspection Report | On demand | PDF | Compliance → BoG |
| CRO Independence Report | Annual | PDF | Board Risk Committee |

---

## 7. Appendices

### 7.1 RMD 2021 Key Requirements

| Requirement | Description | Implementation |
|-------------|-------------|----------------|
| CRO Independence | CRO cannot hold CFO, COO, or Internal Audit roles | System-enforced role conflict detection |
| 3LoD Model | Clear separation of first, second, and third lines | RBAC with line-of-defence tagging |
| Risk Appetite | Board-approved risk appetite statement | Digitised RAS with quantitative limits |
| Risk Governance | Board Risk Committee oversight | Board reporting and approval workflows |
| Risk Reporting | Regular risk reporting to Board and BoG | Automated reporting and ORASS integration |
| Limit Framework | Risk limits with breach management | Real-time limit monitoring and breach workflow |
| Audit Evidence | Complete audit trail for regulatory inspection | Immutable audit logs with digital signatures |

### 7.2 CISD 2026 Key Requirements

| Requirement | Description | Implementation |
|-------------|-------------|----------------|
| Data Residency | Core systems and data must remain in Ghana | In-country hosting for all core systems |
| Cyber Risk Management | Integrated cyber risk in Risk Universe | Cyber risk category in Risk Universe Register |
| Board Cyber Reporting | Quarterly cyber risk reporting to Board | Automated cyber risk dashboard |
| Penetration Testing | Quarterly penetration testing | Scheduled testing with results tracking |
| Incident Response | Cyber incident response plan | Incident response workflow and notification |
| Third-Party Risk | Vendor and third-party risk management | Third-party risk assessment in Risk Universe |

### 7.3 Risk Categories

| Category | Description | Examples |
|----------|-------------|----------|
| Credit Risk | Risk of borrower default | Loan defaults, counterparty default |
| Market Risk | Risk of market price movements | Interest rate, FX, equity price changes |
| Liquidity Risk | Risk of inability to meet obligations | Funding shortfall, deposit flight |
| Operational Risk | Risk of operational failures | System failure, fraud, human error |
| Strategic Risk | Risk of strategic decisions | Market entry, M&A, business model change |
| Climate Risk | Risk of climate change impacts | Physical risk, transition risk |
| Cyber Risk | Risk of cyber attacks | Data breach, ransomware, system intrusion |
| ESG Risk | Risk of ESG factors | Reputational risk, regulatory change |
| Reputational Risk | Risk of reputation damage | Customer complaints, media coverage |
| Legal/Compliance Risk | Risk of legal or regulatory breach | Fine, sanction, license revocation |

### 7.4 Configuration Keys

| Key | Description | Default Value |
|-----|-------------|---------------|
| `grc.rmf.review_months` | RMF review frequency (months) | 12 |
| `grc.risk.universe.review_months` | Risk Universe review frequency | 12 |
| `grc.role.conflict_check` | Enable role conflict detection | true |
| `grc.cro.independent_roles` | Roles CRO cannot hold | CFO, COO, Internal Audit |
| `grc.limit.breach.amber_hours` | Hours to acknowledge amber breach | 4 |
| `grc.limit.breach.red_hours` | Hours to acknowledge red breach | 1 |
| `grc.limit.breach.bog_notification_days` | Days to notify BoG of breach | 10 |
| `grc.audit.retention_years` | Audit log retention (years) | 7 |
| `grc.audit.digital_signature` | Require digital signatures | true |
| `grc.reporting.ras_frequency` | RAS reporting frequency | monthly |
| `grc.reporting.breach_frequency` | Breach register frequency | monthly |
| `grc.reporting.3lod_frequency` | 3LoD report frequency | quarterly |

---

*PRD v1.0 — Governance, Risk & Compliance (GRC) Risk Framework (RMD 2021 / CISD 2026)*
