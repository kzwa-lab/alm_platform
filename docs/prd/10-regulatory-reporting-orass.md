# PRD: Regulatory Reporting & ORASS Integration (BoG Online Regulatory and Analytical Surveillance Software)

## 1. Overview

### 1.1 Purpose

The Regulatory Reporting & ORASS Integration module manages all regulatory submissions to the Bank of Ghana through the Online Regulatory and Analytical Surveillance Software (ORASS). It supports BoG-prescribed Excel/XML/XBRL templates, automates template population from ALM calculations, provides a secure API client for ORASS, schedules submissions (monthly 9 days, quarterly, annual), and generates public disclosures. The module ensures timely, accurate, and complete regulatory reporting across all BoG directives.

Key capabilities:
- **BoG template catalogue**: LMTD, LRMD, IRRBB, Capital Adequacy, Recovery Planning, and other prescribed templates
- **Template population engine**: Auto-populates templates from ALM module calculations
- **ORASS secure API client**: Direct integration with BoG ORASS for submission and acknowledgment
- **Submission scheduler**: Automated scheduling with reminders and escalation
- **Public disclosure generator**: Generates public disclosure documents from regulatory data
- **Ad-hoc re-submission**: Supports corrections and re-submissions with version control
- **Submission tracking**: Real-time status tracking from preparation to BoG acknowledgment

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **Compliance Officer** | Manages all BoG submissions, ensures accuracy, tracks deadlines, handles re-submissions |
| **Regulatory Reporting Manager** | Runs template population, validates data, generates reports |
| **ALCO Member** | Reviews regulatory reports before submission, approves exceptions |
| **CRO** | Reviews critical submissions (capital, liquidity, IRRBB), escalates issues |
| **Data Owner** | Validates data accuracy for their domain (Treasury, Risk, Finance) |
| **Board Risk Committee** | Reviews annual submissions (ICAAP, Recovery Plan, Pillar 3) |
| **External Auditor** | Reviews submission accuracy, challenges data integrity |

### 1.3 Dependencies

- **Data Foundation** (`01-data-foundation.md`): Normalised data layer, Ghana classification engine, dual bucket structures
- **Liquidity Risk** (`02-liquidity-risk.md`): LCR, NSFR, BoG four-ratio data, 13-band maturity mismatch
- **IRRBB** (`03-interest-rate-risk.md`): EVE, NII, 19-bucket standardised framework, SOT data
- **Capital Management** (`04-capital-management.md`): CET1, T1, TC, leverage ratios, RWA, ICAAP
- **ECL** (`05-ecl.md`): ECL provisions, stage data, IFRS 9 disclosures
- **FTP** (`06-ftp.md`): FTP curve data, profitability metrics
- **Balance Sheet Optimization** (`07-balance-sheet-optimization.md`): Strategic plan data, recovery triggers
- **Recovery Planning** (`08-recovery-planning.md`): Recovery plan data, self-assessment
- **GRC Risk Framework** (`09-grc-risk-framework.md`): Risk appetite, limit breaches, governance data
- **Cyber Security & Data Residency** (`12-cyber-security-data-residency.md`): Secure transmission, encryption

---

## 2. Features

### 2.1 BoG Template Catalogue

#### Description
A comprehensive catalogue of all BoG-prescribed regulatory templates with metadata, validation rules, and data source mappings. Supports version control for template updates.

#### User Stories
- **As a Regulatory Reporting Manager**, I want to see all available BoG templates so that I can select the correct one for submission.
- **As a Compliance Officer**, I want to verify that we have the latest template version so that I can avoid submission rejection.
- **As a Data Owner**, I want to see which data fields feed into each template so that I can validate the source data.

#### Acceptance Criteria
- [ ] Template catalogue: all BoG-prescribed templates (LMTD, LRMD, IRRBB, Capital, Recovery, etc.)
- [ ] Template metadata: name, directive, frequency, due date, format (Excel/XML/XBRL), version
- [ ] Data source mapping: each field mapped to ALM module data source
- [ ] Validation rules: field-level validation (data type, range, mandatory, cross-field)
- [ ] Template version control: track BoG template updates and bank template versions
- [ ] Template diff: compare template versions to identify changes
- [ ] Template preview: preview populated template before submission

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  BoG Template Catalogue                                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Template Search                                             │  │
│  │ Directive: [All ▼] │ Frequency: [All ▼] │ Format: [All ▼]    │  │
│  │ [Search] [Export Catalogue] [Check for Updates]              │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Template List                                               │  │
│  │ Template Name    │ Directive │ Frequency │ Format │ Version │ Status │  │
│  │ LMTD Return      │ LMTD 2026 │ Monthly   │ Excel  │ v2.1   │ ✅     │  │
│  │ LRMD Return      │ LRMD 2026 │ Monthly   │ Excel  │ v1.3   │ ✅     │  │
│  │ IRRBB Return     │ IRRBB 2026│ Quarterly │ XML    │ v3.0   │ ✅     │  │
│  │ Capital Adequacy │ Capital   │ Quarterly │ XML    │ v4.2   │ ✅     │  │
│  │ Recovery Plan    │ Recovery  │ Annual    │ PDF    │ v1.0   │ ✅     │  │
│  │ ICAAP            │ Capital   │ Annual    │ PDF    │ v2.0   │ ✅     │  │
│  │ Pillar 3         │ Capital   │ Annual    │ XBRL   │ v1.5   │ ✅     │  │
│  │ LCR Detail       │ LMTD 2026 │ Monthly   │ Excel  │ v1.1   │ ✅     │  │
│  │ NSFR Detail      │ LRMD 2026 │ Quarterly │ Excel  │ v1.2   │ ✅     │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [View Template] [Map Data Sources] [Validate] [Submit to ORASS]│
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- BoG template definitions from regulatory config
- ALM module data sources from Data Foundation
- Template version history from document management
- Validation rules from Compliance

#### Validation Rules
- All templates must have unique identifier and version
- All templates must be mapped to at least one data source
- All mandatory fields must have data source mapping
- Template version must match BoG current version

#### Error Handling
- If template version outdated → amber alert, update template
- If data source mapping missing → block template population
- If validation rule missing → block template submission

---

### 2.2 Template Population Engine

#### Description
Automates the population of BoG templates from ALM module calculations. Supports manual override, data validation, and reconciliation.

#### User Stories
- **As a Regulatory Reporting Manager**, I want to auto-populate the LMTD return from liquidity data so that I can save time and reduce errors.
- **As a Data Owner**, I want to validate the populated data so that I can ensure accuracy before submission.
- **As a Compliance Officer**, I want to see the data lineage so that I can explain the numbers to BoG.

#### Acceptance Criteria
- [ ] Auto-population: template fields populated from ALM module data sources
- [ ] Data lineage: full traceability from source data to template field
- [ ] Manual override: authorised users can override auto-populated values with justification
- [ ] Validation: field-level validation (data type, range, mandatory, cross-field)
- [ ] Reconciliation: template totals reconciled to source system totals
- [ ] Exception handling: missing data flagged with fallback rules
- [ ] Population log: record of population run, user, timestamp, overrides
- [ ] Batch population: populate multiple templates simultaneously

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Template Population Engine                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Population Run: LMTD Return (June 2026)                       │  │
│  │ Status: Completed │ Fields: 150 │ Populated: 148 │ Overrides: 2│  │
│  │ Reconciliation: ✅ Matched │ Validation: ✅ Passed              │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Field Population Status                                     │  │
│  │ Field Name           │ Source              │ Value    │ Status │  │
│  │ LCR Ratio            │ Liquidity Risk      │ 136%     │ ✅     │  │
│  │ NSFR Ratio           │ Liquidity Risk      │ 124%     │ ✅     │  │
│  │ Narrow Liquid Assets │ Data Foundation     │ 2.5bn    │ ✅     │  │
│  │ Broad Liquid Assets  │ Data Foundation     │ 3.2bn    │ ✅     │  │
│  │ Maturity Mismatch    │ Liquidity Risk      │ -1.2bn   │ ✅     │  │
│  │ Funding Concentration│ Liquidity Risk      │ 15%      │ ✅     │  │
│  │ Custom Field A       │ Manual Override     │ 100M     │ 🟡     │  │
│  │ Custom Field B       │ Manual Override     │ 50M      │ 🟡     │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [View Data Lineage] [Edit Override] [Re-run Population] [Export]│
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Template definition from Template Catalogue
- ALM module data from source systems
- Override values from authorised users
- Validation rules from Compliance

#### Calculation Logic / Business Rules
```python
# Template population
def populate_template(template, reporting_date):
    populated_fields = {}
    for field in template.fields:
        if field.data_source:
            value = fetch_data(field.data_source, reporting_date)
            populated_fields[field.name] = value
        else:
            populated_fields[field.name] = None  # Manual entry required
    
    # Validation
    for field in template.fields:
        if field.mandatory and populated_fields[field.name] is None:
            raise ValidationError(f"Mandatory field {field.name} is missing")
        if field.min_value and populated_fields[field.name] < field.min_value:
            raise ValidationError(f"Field {field.name} below minimum")
        if field.max_value and populated_fields[field.name] > field.max_value:
            raise ValidationError(f"Field {field.name} above maximum")
    
    # Reconciliation
    for reconciliation in template.reconciliations:
        lhs = sum(populated_fields[f] for f in reconciliation.lhs_fields)
        rhs = sum(populated_fields[f] for f in reconciliation.rhs_fields)
        if abs(lhs - rhs) > reconciliation.tolerance:
            raise ReconciliationError(f"Reconciliation failed: {reconciliation.name}")
    
    return populated_fields
```

#### Validation Rules
- All mandatory fields must be populated
- All values must be within defined ranges
- All cross-field validations must pass
- All reconciliations must pass within tolerance
- Overrides must be documented with justification

#### Error Handling
- If data source missing → flag for manual entry
- If validation fails → block submission, alert Data Owner
- If reconciliation fails → block submission, investigate discrepancy
- If override not documented → block override, require justification

---

### 2.3 ORASS Secure API Client

#### Description
A secure API client for direct integration with the Bank of Ghana's ORASS system. Supports authentication, submission, acknowledgment, and status tracking.

#### User Stories
- **As a Compliance Officer**, I want to submit the LMTD return directly to ORASS so that I can ensure timely delivery.
- **As a Regulatory Reporting Manager**, I want to see the submission status so that I can track BoG acknowledgment.
- **As a CRO**, I want to receive confirmation that BoG has acknowledged our submission so that I can verify compliance.

#### Acceptance Criteria
- [ ] Authentication: secure API key or certificate-based authentication with ORASS
- [ ] Submission: upload populated templates to ORASS
- [ ] Acknowledgment: receive and track BoG acknowledgment
- [ ] Status tracking: real-time status (submitted, under review, acknowledged, rejected, resubmission required)
- [ ] Error handling: ORASS error messages parsed and displayed
- [ ] Retry logic: automatic retry on transient failures
- [ ] Encryption: all data encrypted in transit (TLS 1.3)
- [ ] Logging: all API calls logged with timestamp, payload, and response
- [ ] Fallback: manual submission process if API unavailable

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  ORASS Secure API Client                                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ORASS Connection Status: ✅ Connected │ Last Check: 08:00  │  │
│  │ API Version: v3.2 │ Authentication: Certificate (expires 2027-06)│  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Submission Status                                           │  │
│  │ Template         │ Date       │ Status    │ BoG Ack │ Notes │  │
│  │ LMTD (Jun)       │ 2026-07-09 │ Submitted │ Pending │ —     │  │
│  │ LRMD (Jun)       │ 2026-07-09 │ Submitted │ Pending │ —     │  │
│  │ IRRBB (Q2)       │ 2026-07-15 │ Acknowledged│ 2026-07-16│ —  │  │
│  │ Capital (Q2)     │ 2026-07-15 │ Acknowledged│ 2026-07-16│ —  │  │
│  │ Recovery Plan    │ 2025-12-15 │ Acknowledged│ 2026-01-10│ —  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Submit Template                                             │  │
│  │ Template: [LMTD Return ▼] │ Reporting Date: [2026-06-30]     │  │
│  │ [Validate] [Preview] [Submit to ORASS] [Submit Manually]   │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [View API Logs] [Test Connection] [Rotate Certificate] [Settings]│
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Populated templates from Template Population Engine
- ORASS API credentials from secure vault
- Submission metadata from Compliance

#### Validation Rules
- Template must be validated before submission
- ORASS connection must be active before submission
- Submission must be within BoG deadline
- All mandatory fields must be populated

#### Error Handling
- If ORASS connection fails → fallback to manual submission, alert Compliance
- If submission rejected → parse error, alert Data Owner, allow correction
- If acknowledgment not received within 5 days → amber alert, follow up with BoG
- If API credentials expired → block submission, alert IT Security

---

### 2.4 Submission Scheduler

#### Description
Automated scheduling of all regulatory submissions with reminders, escalation, and deadline tracking.

#### User Stories
- **As a Compliance Officer**, I want to see all upcoming submission deadlines so that I can plan resources.
- **As a Regulatory Reporting Manager**, I want to receive reminders before deadlines so that I can prepare submissions on time.
- **As a CRO**, I want to be alerted if a submission is overdue so that I can escalate to BoG.

#### Acceptance Criteria
- [ ] Submission calendar: all BoG submissions with deadlines
- [ ] Frequency support: monthly (9 days), quarterly, annual, ad-hoc
- [ ] Reminders: T-14, T-7, T-3, T-1 days before deadline
- [ ] Escalation: overdue submissions escalated to CRO and Board
- [ ] Status tracking: not started, in progress, under review, submitted, acknowledged, rejected
- [ ] Owner assignment: each submission has responsible owner and backup
- [ ] Dependency tracking: submissions dependent on other submissions (e.g., capital adequacy depends on ECL)
- [ ] Calendar integration: sync with Outlook/Google Calendar
- [ ] Reporting: submission status report for Board Risk Committee

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Submission Scheduler                                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Upcoming Deadlines (Next 30 Days)                          │  │
│  │ Template         │ Deadline │ Owner    │ Status    │ Days │  │
│  │ LMTD (Jul)       │ 09-Aug   │ mgarcia  │ Not Start │ 45   │  │
│  │ LRMD (Jul)       │ 09-Aug   │ lchen    │ Not Start │ 45   │  │
│  │ IRRBB (Q3)       │ 15-Oct   │ rwilliams│ Not Start │ 112  │  │
│  │ Capital (Q3)     │ 15-Oct   │ cpeters  │ Not Start │ 112  │  │
│  │ Recovery Plan    │ 31-Dec   │ cpeters  │ In Progress│ 189  │  │
│  │ ICAAP            │ 31-Oct   │ mgarcia  │ Draft     │ 128  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Reminder Settings                                           │  │
│  │ Reminder Days: [14, 7, 3, 1] │ Escalation: [CRO, Board]    │  │
│  │ [Save Settings] [Test Reminders] [Export Calendar]           │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Add Submission] [View Calendar] [Generate Status Report]        │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- BoG submission schedule from regulatory config
- Template deadlines from Template Catalogue
- Owner assignments from Compliance
- Submission status from workflow system

#### Validation Rules
- All submissions must have deadline and owner
- All submissions must have at least one reminder
- Overdue submissions must be escalated within 24 hours
- Dependencies must be resolved before dependent submission

#### Error Handling
- If submission deadline missing → amber alert, notify Compliance
- If owner not assigned → block submission scheduling
- If reminder not sent → red alert, investigate notification system
- If submission overdue → escalate to CRO, notify Board

---

### 2.5 Public Disclosure Generator

#### Description
Generates public disclosure documents from regulatory data for annual reports, Pillar 3 disclosures, and BoG requirements.

#### User Stories
- **As a Compliance Officer**, I want to generate the Pillar 3 disclosure from regulatory data so that I can ensure consistency.
- **As a Finance Manager**, I want to extract capital adequacy data for the annual report so that I can meet disclosure requirements.
- **As a CRO**, I want to review the public disclosure before publication so that I can ensure accuracy.

#### Acceptance Criteria
- [ ] Disclosure types: Pillar 3, annual report risk section, BoG public disclosure requirements
- [ ] Data source: regulatory data from ALM modules
- [ ] Templates: pre-defined disclosure templates aligned with BoG requirements
- [ ] Review workflow: draft → review → CRO approval → Board approval → publication
- [ ] Version control: track disclosure versions and changes
- [ ] Audit trail: record of approvals and publications
- [ ] Export: PDF, HTML, XBRL for different publication channels
- [ ] Accessibility: disclosures accessible to visually impaired

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Public Disclosure Generator                                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Disclosure Type: [Pillar 3 ▼] │ Reporting Year: [2026 ▼]    │  │
│  │ Status: Draft │ Last Updated: 2026-06-25 │ Version: 1.0      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Disclosure Sections                                         │  │
│  │ Section              │ Status    │ Data Source │ Reviewed │  │
│  │ Risk Management      │ ✅        │ GRC         │ Yes      │  │
│  │ Capital Adequacy     │ ✅        │ Capital     │ Yes      │  │
│  │ Liquidity Risk       │ ✅        │ Liquidity   │ Yes      │  │
│  │ IRRBB                │ ✅        │ IRRBB       │ Yes      │  │
│  │ Credit Risk          │ ✅        │ ECL         │ Yes      │  │
│  │ Operational Risk     │ ✅        │ GRC         │ Yes      │  │
│  │ Leverage Ratio       │ ✅        │ Capital     │ Yes      │  │
│  │ Remuneration         │ 🟡        │ HR          │ No       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Generate Draft] [Review] [Approve] [Publish] [Export]            │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Regulatory data from ALM modules
- Disclosure templates from Compliance
- Approval workflow from GRC Risk Framework
- Publication channels from Communications

#### Validation Rules
- All sections must be reviewed before approval
- CRO must approve before Board approval
- Data must be consistent with submitted regulatory data
- Publication must be within BoG deadline

#### Error Handling
- If data inconsistent with regulatory submission → block publication, investigate
- If approval missing → block publication, alert approver
- If section not reviewed → block approval, alert reviewer

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **BoG_Template** | BoG regulatory template | template_id, name, directive, frequency, format, version, fields_json, validation_rules_json |
| **Template_Population** | Template population run | population_id, template_id, reporting_date, status, fields_json, overrides_json, validated_at |
| **ORASS_Submission** | ORASS submission record | submission_id, template_id, population_id, submission_date, status, bog_ack_date, rejection_reason |
| **Submission_Schedule** | Submission deadline | schedule_id, template_id, deadline_date, owner, reminder_days, status |
| **Public_Disclosure** | Public disclosure document | disclosure_id, type, reporting_year, sections_json, status, approved_by, published_at |
| **Data_Lineage** | Data lineage record | lineage_id, template_field, source_system, source_table, source_field, transformation |

### 3.2 Key Attributes

**BoG_Template.fields_json**: JSON object defining all template fields with name, data type, mandatory flag, min/max values, and data source mapping.

**Template_Population.overrides_json**: JSON object recording all manual overrides with field name, original value, override value, user, timestamp, and justification.

**ORASS_Submission.status**: "SUBMITTED", "UNDER_REVIEW", "ACKNOWLEDGED", "REJECTED", "RESUBMISSION_REQUIRED". Updated based on ORASS API response.

### 3.3 Relationships

```
BoG_Template (1) ──► Template_Population (N)
BoG_Template (1) ──► Submission_Schedule (N)
Template_Population (1) ──► ORASS_Submission (1)
BoG_Template (1) ──► Public_Disclosure (N)
Data_Lineage (N) ──► BoG_Template (N) (field-level lineage)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/orass/templates` | GET | List BoG templates |
| `/api/orass/templates/{id}` | GET | Get template details |
| `/api/orass/templates/{id}/populate` | POST | Run template population |
| `/api/orass/templates/{id}/validate` | POST | Validate populated template |
| `/api/orass/submissions` | GET | List submissions |
| `/api/orass/submissions` | POST | Submit to ORASS |
| `/api/orass/submissions/{id}/status` | GET | Get submission status |
| `/api/orass/submissions/{id}/resubmit` | POST | Re-submit to ORASS |
| `/api/orass/schedule` | GET | Get submission schedule |
| `/api/orass/schedule` | POST | Update submission schedule |
| `/api/orass/disclosures` | GET | List public disclosures |
| `/api/orass/disclosures` | POST | Create public disclosure |
| `/api/orass/disclosures/{id}/publish` | POST | Publish disclosure |
| `/api/orass/lineage` | GET | Get data lineage |
| `/api/orass/lineage/{field}` | GET | Get field-level lineage |
| `/api/orass/reports/status` | GET | Generate submission status report |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Template population: < 2 minutes per template
- Validation: < 30 seconds per template
- ORASS submission: < 60 seconds per template
- Status check: < 5 seconds
- Public disclosure generation: < 5 minutes
- Submission status report: < 2 minutes

### 5.2 Security
- All regulatory data classified as strictly confidential
- ORASS API credentials stored in secure vault
- All submissions encrypted in transit (TLS 1.3)
- Data lineage restricted to Compliance and Audit
- Public disclosures approved before publication

### 5.3 Availability
- Template population: 99.5% (on-demand)
- ORASS submission: 99.9% (compliance-critical)
- Submission scheduler: 99.9% (deadline-critical)
- Public disclosure: 99.5% (annual requirement)
- RTO: 2 hours

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| Submission Status | Weekly | PDF | Compliance, CRO |
| Submission Calendar | Monthly | PDF | Board Risk Committee |
| Template Population Log | Per run | Excel | Regulatory Reporting |
| ORASS API Log | Monthly | PDF | IT Security, Compliance |
| Data Lineage Report | On demand | PDF | Internal Audit, BoG |
| Public Disclosure | Annual | PDF/HTML/XBRL | Public, BoG |
| Re-submission Register | Monthly | PDF | Compliance, CRO |
| Submission Accuracy Report | Quarterly | PDF | ALCO, Board Risk Committee |

---

## 7. Appendices

### 7.1 BoG Submission Schedule

| Template | Directive | Frequency | Due Date | Format |
|----------|-----------|-----------|----------|--------|
| LMTD Return | LMTD 2026 | Monthly | 9th of next month | Excel |
| LRMD Return | LRMD 2026 | Monthly | 9th of next month | Excel |
| LCR Detail | LMTD 2026 | Monthly | 9th of next month | Excel |
| NSFR Detail | LRMD 2026 | Quarterly | 15th of next quarter | Excel |
| IRRBB Return | IRRBB 2026 | Quarterly | 15th of next quarter | XML |
| Capital Adequacy | Capital | Quarterly | 15th of next quarter | XML |
| ICAAP | Capital | Annual | 31st October | PDF |
| Recovery Plan | Recovery | Annual | 31st December | PDF |
| Pillar 3 | Capital | Annual | 30th September | XBRL |
| Stress Test | Stress | Annual | As notified by BoG | PDF |

### 7.2 ORASS API Specifications

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v3/auth` | POST | Authenticate with API key/certificate |
| `/api/v3/submit` | POST | Submit template data |
| `/api/v3/status/{id}` | GET | Get submission status |
| `/api/v3/acknowledge/{id}` | GET | Get BoG acknowledgment |
| `/api/v3/reject/{id}` | POST | Re-submit rejected template |

### 7.3 Validation Rules

| Rule Type | Description | Example |
|-----------|-------------|---------|
| Mandatory | Field must have value | LCR ratio cannot be null |
| Range | Value must be within range | CET1 must be 0-100% |
| Data Type | Value must be correct type | Date fields must be dates |
| Cross-Field | Fields must be consistent | LCR = HQLA / Net Cash Outflows |
| Cross-Template | Templates must be consistent | Capital Adequacy RWA = Sum of risk type RWAs |
| Historical | Value must be consistent with history | CET1 change < 5% month-on-month |

### 7.4 Configuration Keys

| Key | Description | Default Value |
|-----|-------------|---------------|
| `orass.api.endpoint` | ORASS API endpoint | https://orass.bog.gov.gh/api/v3 |
| `orass.auth.type` | Authentication type | certificate |
| `orass.auth.cert_path` | Certificate path | /secure/orass.crt |
| `orass.submission.retry_count` | Submission retry count | 3 |
| `orass.submission.retry_delay_seconds` | Retry delay | 300 |
| `orass.submission.timeout_seconds` | Submission timeout | 60 |
| `orass.notification.reminder_days` | Reminder days | 14, 7, 3, 1 |
| `orass.notification.escalation_hours` | Escalation hours for overdue | 24 |
| `orass.disclosure.approval_required` | Disclosure approval required | true |
| `orass.reporting.retention_years` | Retention period | 7 |

---

*PRD v1.0 — Regulatory Reporting & ORASS Integration (BoG Online Regulatory and Analytical Surveillance Software)*
