# PRD: Data Foundation & ALCO Governance

## 1. Overview

### 1.1 Purpose

The Data Foundation & ALCO Governance module is the bedrock of the ALM Platform. Without clean, unified, and validated data, no downstream ALM calculation — whether LCR, IRRBB, ECL, or FTP — can be trusted. This module provides the data ingestion pipelines, master data management, quality assurance, and governance workflows that enable all other ALM functions to operate with confidence.

### 1.2 Users & Roles

| Role | Responsibilities |
|------|---------------|
| **Data Engineer** | Configures ETL pipelines, manages data quality rules, monitors ingestion health |
| **Treasurer** | Reviews data quality scores, approves manual data uploads, triggers ALCO meetings |
| **Risk Manager** | Validates data accuracy for risk calculations, reviews audit trails |
| **ALCO Secretary** | Manages ALCO meeting schedules, agendas, minutes, action item tracking |
| **Compliance Officer** | Reviews audit trails, ensures regulatory data lineage requirements are met |
| **Business Unit Head** | Reviews subsidiary-specific data, confirms balance sheet accuracy |

### 1.3 Dependencies

- **Upstream**: Core banking system (GL), loan management system, deposit system, securities inventory, market data feeds (Bloomberg, Reuters, internal treasury)
- **Downstream**: All ALM calculation modules (Liquidity, IRRBB, Capital, ECL, FTP, Optimization)
- **External**: Regulatory reporting systems (COREP, FINREP), external auditors

---

## 2. Features

### 2.1 Data Ingestion Pipeline

#### Description
Automated ETL pipelines that extract data from core banking systems, transform it into the ALM data model, and load it into the platform's data warehouse. Supports both batch (daily, intraday) and near-real-time (streaming) ingestion modes.

#### User Stories

- **As a Data Engineer**, I want to configure a new data source connection so that I can onboard a new subsidiary's core banking system within one week.
- **As a Treasurer**, I want to see the last successful data ingestion timestamp for each source so that I can verify calculations are based on current data.
- **As a Risk Manager**, I want to receive an alert when a data source fails to load so that I can investigate before running risk calculations.

#### Acceptance Criteria
- [ ] Pipelines support 10+ source types: SQL databases, APIs, SFTP files, Excel uploads, SWIFT messages
- [ ] Daily batch completes within 2 hours of core banking EOD
- [ ] Intraday updates available for HQLA positions and derivative MTM
- [ ] Failed jobs retry automatically up to 3 times with exponential backoff
- [ ] All ingestion events logged with source, timestamp, row count, and validation status

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Data Ingestion Dashboard                                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Last Run: 2026-06-25 06:00 CET │ Status: ✅ All Green    │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Source Name      │ Type    │ Last Run  │ Status │ Rows    │  │
│  │ Core Banking GL  │ SQL     │ 06:00     │ ✅     │ 45,231  │  │
│  │ Loan System      │ API     │ 06:15     │ ✅     │ 12,405  │  │
│  │ Deposit System   │ API     │ 06:15     │ ✅     │ 89,102  │  │
│  │ Securities       │ SFTP    │ 06:30     │ ⚠️     │ 3,401   │  │
│  │ Market Data      │ API     │ 06:45     │ ✅     │ 1,204   │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [+ Add Source] [▶ Run All] [⏸ Pause] [📊 Logs]            │  │
│  └────────────────────────────────────────────────────────────┐  │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Format | Frequency |
|-------|--------|--------|-----------|
| General Ledger balances | Core Banking | SQL / API | Daily EOD |
| Loan contracts | Loan Management | API | Daily EOD |
| Deposit accounts | Deposit System | API | Daily EOD |
| Securities positions | Securities Inventory | SFTP / API | Daily EOD + intraday |
| Market rates | Bloomberg / Reuters | API | Intraday (hourly) |
| Counterparty data | CRM / KYC | API | Daily EOD |
| FX rates | Market Data Feed | API | Intraday (hourly) |

#### Calculation Logic / Business Rules
- **Currency conversion**: All non-EUR amounts converted to EUR using spot rate at reporting date
- **Aggregation**: Individual account balances rolled up to product/counterparty level
- **Date alignment**: All sources must use the same reporting date (T-1 for EOD batch)
- **Delta detection**: Only changed records processed in incremental loads

#### Validation Rules
- Row count must be within ±5% of previous day (unless known structural change)
- Total assets must equal total liabilities + equity (±0.1% tolerance for rounding)
- All required fields (account ID, currency, amount, maturity date) must be non-null
- No duplicate primary keys in any source table
- Market data rates must be within ±20% of previous day's rate (outlier detection)

#### Error Handling
- **Level 1 (Warning)**: Row count deviation 5-10%, missing optional fields → Log warning, continue processing
- **Level 2 (Alert)**: Row count deviation >10%, null required fields → Pause dependent calculations, notify Risk Manager
- **Level 3 (Critical)**: Complete source failure, total assets ≠ liabilities + equity → Block all downstream modules, trigger incident response

#### Audit & Compliance Requirements
- Full data lineage: source → transformation → destination, with version history
- Retention: 7 years for production data, 3 years for staging data
- GDPR: Personal data (customer names, IDs) pseudonymized in ALM warehouse
- SOX/Internal Audit: All data changes logged with who, what, when, before/after values

---

### 2.2 Master Data Management (MDM)

#### Description
A centralized repository for reference data that ensures consistency across all ALM calculations. Includes product catalogs, counterparty master, contract attributes, and chart of accounts mapping.

#### User Stories
- **As a Data Engineer**, I want to define a new product type with its ALM-relevant attributes so that LCR and IRRBB calculations automatically include it.
- **As a Risk Manager**, I want to view the complete list of counterparties with their credit ratings so that I can verify RWA calculations.
- **As a Treasurer**, I want to update the behavioral maturity assumptions for a deposit product so that FTP and IRRBB calculations reflect the latest analysis.

#### Acceptance Criteria
- [ ] Product catalog includes: product ID, type, ALM category, risk weight, liquidity classification, behavioral assumptions
- [ ] Counterparty master includes: ID, name, sector, country, credit rating (internal + external), exposure limit
- [ ] Contract attributes include: ID, product type, counterparty, currency, notional, rate type (fixed/floating), maturity, repricing date, collateral
- [ ] Chart of accounts mapping: GL code → ALM category → regulatory classification
- [ ] All MDM changes require approval workflow (Request → Review → Approve → Deploy)
- [ ] MDM versioning: previous values retained for historical calculation reproducibility

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Master Data Browser                                            │
│  Tabs: [Products] [Counterparties] [Contracts] [CoA Mapping]    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Search: [____________] [Filter ▼] [+ Add New]             │ │
│  │                                                            │ │
│  │ Product ID │ Product Name    │ Type     │ LCR Cat │ IRRBB │ │
│  │ P-001      │ Retail Current  │ Deposit  │ Stable  │ NMD   │ │
│  │ P-002      │ Retail Savings  │ Deposit  │ Less-St │ NMD   │ │
│  │ P-003      │ Corp Term Loan  │ Loan     │ N/A     │ Fixed │ │
│  │ P-004      │ Fixed Mortgage  │ Loan     │ N/A     │ Fixed │ │
│  │ P-005      │ Gov Bond (DE)   │ Security │ Level 1 │ Fixed │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Product Detail: P-001 Retail Current                        │ │
│  │ ┌────────────────────┐ ┌────────────────────┐             │ │
│  │ │ ALM Category: NMD │ │ Liquidity: Stable   │             │ │
│  │ │ Behavioral Maturity: 4Y │ Core Ratio: 70% │             │ │
│  │ │ Deposit Beta: 0.35 │ Repricing Lag: 3M   │             │ │
│  │ └────────────────────┘ └────────────────────┘             │ │
│  │ [Edit] [History] [Approve]                               │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Product definitions from Product Management / Marketing
- Counterparty data from Credit Risk / KYC systems
- Contract terms from Legal / Operations
- Chart of accounts from Finance / Accounting

#### Calculation Logic / Business Rules
- Product classification drives LCR outflow rates, NSFR RSF/ASF factors, and IRRBB repricing behavior
- Counterparty sector + rating → credit risk weight (SA) or PD estimate (IRB)
- Contract rate type + maturity → repricing bucket assignment for gap analysis
- CoA mapping ensures every GL account feeds into the correct ALM category

#### Validation Rules
- Product IDs must be unique across all subsidiaries
- Every product must have a valid LCR classification (or "N/A" for non-liabilities)
- Every product must have a valid IRRBB classification (fixed, floating, NMD, or "N/A")
- Counterparty ratings must be within valid range (AAA to D)
- Contract maturity date must be >= origination date

#### Error Handling
- Missing product classification → flagged as "Unclassified", excluded from calculations until resolved
- Duplicate counterparty IDs → merge process triggered, manual review required
- Invalid date ranges → reject record, log error, notify data owner

#### Audit & Compliance Requirements
- All MDM changes require dual approval (requester + approver from different teams)
- Change history retained for 7 years
- Monthly attestation by Business Unit Heads that their product data is accurate

---

### 2.3 Data Quality Scorecard

#### Description
A real-time dashboard that measures and reports the quality of data across all ALM inputs. Quality dimensions: completeness, accuracy, timeliness, consistency, and validity.

#### User Stories
- **As a Treasurer**, I want to see an overall data quality score so that I can decide whether ALCO can rely on today's risk metrics.
- **As a Data Engineer**, I want to drill down into a specific data quality rule failure so that I can fix the root cause.
- **As a Compliance Officer**, I want to export a monthly data quality report for the auditors.

#### Acceptance Criteria
- [ ] Overall Data Quality Score calculated as weighted average of 5 dimensions
- [ ] Dimension scores: Completeness (30%), Accuracy (25%), Timeliness (20%), Consistency (15%), Validity (10%)
- [ ] Drill-down from overall score to source → table → column → specific rule
- [ ] Trend chart showing quality score over last 30 days
- [ ] Automated alert when overall score drops below 85%

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Data Quality Scorecard                                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Overall Score: 94/100 [████████████░░] ✅ Excellent        │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Dimension         │ Score │ Trend │ Critical Issues       │ │
│  │ Completeness      │ 96%   │ ↑     │ 12 missing optional   │ │
│  │ Accuracy          │ 92%   │ →     │ 3 outlier detected   │ │
│  │ Timeliness        │ 98%   │ ↑     │ 0 delayed sources    │ │
│  │ Consistency       │ 89%   │ ↓     │ 5 cross-source mism  │ │
│  │ Validity          │ 95%   │ →     │ 8 format errors      │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Source Quality Breakdown                                    │ │
│  │ [Bar chart: Quality score per source]                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Ingestion pipeline logs (success/failure, row counts, timestamps)
- Validation rule results (pass/fail per rule, per record)
- Cross-reference checks (GL total vs. ALM aggregate, source A vs. source B)
- Business rule checks (maturity date > origination date, rate > 0 for interest-bearing)

#### Calculation Logic / Business Rules
```
Overall Score = Σ(Dimension Score × Weight)

Completeness Score = (Non-null required fields / Total required fields) × 100
Accuracy Score = (Records passing all accuracy rules / Total records) × 100
Timeliness Score = (Sources on-time / Total scheduled sources) × 100
Consistency Score = (Cross-reference checks passed / Total checks) × 100
Validity Score = (Records passing format/validation rules / Total records) × 100
```

#### Validation Rules
- Overall score must be calculated daily after all ingestion completes
- Dimension scores must be independently calculable and verifiable
- Trend must show 7-day and 30-day rolling averages

#### Error Handling
- If overall score < 85%, ALCO meeting agenda automatically includes "Data Quality Review"
- If overall score < 70%, all downstream risk calculations paused pending data remediation
- Daily scorecard emailed to Treasurer, CRO, and Data Engineering lead

#### Audit & Compliance Requirements
- Monthly data quality attestation signed by CRO and submitted to regulators
- All quality rule definitions versioned and approved by Data Governance Committee
- Quality score history retained for 3 years

---

### 2.4 ALCO Workflow Engine

#### Description
An end-to-end workflow system for managing ALCO meetings, from scheduling and agenda creation to minutes generation and action item tracking. Integrates with risk metrics so that ALCO agendas automatically include items that exceed risk appetite thresholds.

#### User Stories
- **As an ALCO Secretary**, I want to schedule an ALCO meeting with an automatically generated agenda so that I don't have to manually compile risk reports.
- **As a Treasurer**, I want to assign an action item to a team member with a due date so that ALCO decisions are tracked to completion.
- **As an ALCO Member**, I want to view all open action items from the last meeting so that I can prepare for the next meeting.

#### Acceptance Criteria
- [ ] ALCO meetings scheduled automatically (monthly standard, ad-hoc for threshold breaches)
- [ ] Agenda auto-populated from: threshold breaches, pending action items, new regulatory requirements, upcoming deadlines
- [ ] Minutes template includes: attendees, agenda items, decisions, action items, votes
- [ ] Action items trackable: assignee, due date, status (open/in progress/complete/overdue), priority
- [ ] Email notifications: agenda 3 days before, reminder 1 day before, minutes within 24 hours after
- [ ] Escalation: overdue action items escalated to CRO after 7 days

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  ALCO Meeting Manager                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Next Meeting: 2026-07-15 14:00 CET │ 12 days remaining    │ │
│  │ Status: Agenda Draft │ Attendees: 8/8 confirmed           │ │
│  │ [Edit Agenda] [Send Reminder] [Cancel/Reschedule]         │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Agenda Items (Auto-populated)                             │ │
│  │ # │ Item                        │ Source      │ Priority   │ │
│  │ 1 │ LCR Review (136% → 118%)   │ Liquidity   │ 🔴 High    │ │
│  │ 2 │ IRRBB EVE Breach Alert      │ IRRBB       │ 🔴 High    │ │
│  │ 3 │ ECL Overlay Approval        │ ECL         │ 🟡 Medium  │ │
│  │ 4 │ FTP Curve Revision          │ FTP         │ 🟢 Low     │ │
│  │ 5 │ Capital Planning Q3 Update  │ Capital     │ 🟢 Low     │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Action Items (from previous meeting)                      │ │
│  │ # │ Action           │ Owner      │ Due        │ Status   │ │
│  │ 1 │ Reduce wholesale │ Treasury   │ 2026-06-30 │ Open     │ │
│  │ 2 │ Update hedge     │ Risk       │ 2026-06-28 │ Complete │ │
│  │ 3 │ Revise NMD model │ Modeling   │ 2026-07-10 │ In Prog  │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Risk metric thresholds from Risk Appetite Statement
- Meeting schedule from ALCO calendar
- Action item status from previous meetings
- Regulatory deadline calendar
- User roles and availability

#### Calculation Logic / Business Rules
- Auto-agenda generation triggers:
  - Any risk metric breaches risk appetite (e.g., LCR < 120% internal threshold)
  - Any pending action item overdue > 3 days
  - New regulatory guidance published (from research cron job)
  - Upcoming regulatory submission deadline within 14 days
- Action item priority: High (overdue or risk-related), Medium (regulatory), Low (routine)

#### Validation Rules
- Agenda must be approved by ALCO Chair at least 24 hours before meeting
- All attendees must have access to pre-read materials (distributed 48 hours before)
- Minutes must be published within 24 hours of meeting conclusion
- Action items must have a single owner and a specific due date (not vague)

#### Error Handling
- If no agenda approved by T-1, meeting automatically rescheduled
- If quorum not met (minimum 5 attendees), meeting cannot proceed
- Overdue action items > 14 days escalated to Board Risk Committee

#### Audit & Compliance Requirements
- All meeting minutes stored in immutable format (PDF with digital signature)
- Voting records retained for 7 years
- Action item completion rate tracked and reported to Board annually

---

### 2.5 Audit Trail & Data Lineage

#### Description
A comprehensive logging system that records every data modification, calculation change, and user action across the ALM Platform. Provides full traceability from source data to final regulatory report.

#### User Stories
- **As a Compliance Officer**, I want to see who changed the ECL macroeconomic scenario weights and when so that I can explain the change to the auditor.
- **As a Risk Manager**, I want to trace a reported LCR value back to the specific GL accounts that contributed to it so that I can verify the calculation.
- **As an Internal Auditor**, I want to export all data changes made by a specific user in the last quarter so that I can review for unauthorized access.

#### Acceptance Criteria
- [ ] Every data modification logged with: user ID, timestamp, table/field, old value, new value, reason code
- [ ] Every calculation run logged with: parameters, input data version, output values, execution time
- [ ] Full lineage trace: source record → transformation → aggregated value → report cell
- [ ] Searchable by: user, date range, table, field, action type (create/update/delete)
- [ ] Exportable to Excel/PDF for audit evidence
- [ ] Tamper-proof: logs stored in append-only table with checksums

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Audit Trail Explorer                                             │
│  Search: [User ▼] [Table ▼] [Date Range ____ to ____] [🔍]      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Timestamp         │ User    │ Table      │ Action │ Detail │ │
│  │ 2026-06-25 09:15  │ jsmith  │ ecl_scen   │ UPDATE │ Weight │ │
│  │ 2026-06-25 09:14  │ mjones  │ ftp_curve  │ UPDATE │ Spread │ │
│  │ 2026-06-25 08:30  │ system  │ lcr_calc   │ RUN    │ Daily  │ │
│  │ 2026-06-25 08:00  │ system  │ ingest_log │ CREATE │ Core   │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Detail View: 2026-06-25 09:15 — jsmith — ecl_scenarios    │ │
│  │ Field: upside_weight                                        │ │
│  │ Old Value: 0.15                                             │ │
│  │ New Value: 0.20                                             │ │
│  │ Reason: "Updated per Q2 review"                           │ │
│  │ Lineage: ecl_scenarios → ecl_calc → ifrs9_report.cell_B5 │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Application change logs (database triggers, API middleware)
- User session data (login/logout, role changes)
- Calculation engine logs (version, parameters, outputs)
- System logs (scheduler, queue, error handling)

#### Calculation Logic / Business Rules
- Lineage tracking: each calculated value stores a reference to its input data versions
- Rollback capability: any calculation can be re-run with historical parameters and data
- Data fingerprinting: MD5 hash of each input dataset stored for integrity verification

#### Validation Rules
- Audit log cannot be modified or deleted by any user (including admins)
- Log retention: 7 years for production, 3 years for staging
- All regulatory report values must be traceable to source data within 3 clicks

#### Error Handling
- If audit log storage > 80% capacity, archive oldest records to cold storage
- If lineage chain broken (missing intermediate step), flag as "INCOMPLETE" and alert Data Engineering

#### Audit & Compliance Requirements
- SOX 404: All financial reporting data changes logged with dual approval
- GDPR Article 30: Processing activities documented with data flows
- Basel Pillar 3: Public disclosure data traceable to internal calculations

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **DataSource** | External system providing data | source_id, name, type, connection_string, schedule, last_run, status |
| **IngestionJob** | ETL execution instance | job_id, source_id, start_time, end_time, status, rows_processed, errors |
| **Product** | Bank product master | product_id, name, category, lcr_classification, irrbb_classification, risk_weight, behavioral_maturity, core_ratio, deposit_beta |
| **Counterparty** | Customer / entity master | counterparty_id, name, sector, country, credit_rating_internal, credit_rating_external, exposure_limit |
| **Contract** | Individual deal / account | contract_id, product_id, counterparty_id, currency, notional, rate_type, fixed_rate, margin, origination_date, maturity_date, repricing_date, collateral_amount |
| **GLAccount** | General ledger account | gl_code, account_name, alm_category, coa_level_1, coa_level_2, coa_level_3 |
| **DataQualityRule** | Validation rule definition | rule_id, name, dimension, logic, threshold, severity |
| **DataQualityResult** | Rule execution result | result_id, rule_id, job_id, pass_count, fail_count, score |
| **ALCOMeeting** | ALCO meeting record | meeting_id, date, status, agenda_items, attendees, minutes |
| **ActionItem** | ALCO decision action | action_id, meeting_id, description, owner, due_date, status, priority |
| **AuditLog** | Change log entry | log_id, timestamp, user_id, table_name, action, field_name, old_value, new_value, reason |

### 3.2 Key Attributes

**Product.behavioral_maturity**: For NMDs, the estimated effective maturity in years based on historical behavior analysis. Used in IRRBB gap analysis and FTP replicating portfolio.

**Product.core_ratio**: Percentage of NMD balances considered "core" (stable). Remaining percentage is "volatile". Used in LCR outflow calculations and IRRBB duration estimates.

**Contract.repricing_date**: For floating-rate contracts, the next date when the interest rate resets. For fixed-rate contracts, equals maturity_date. Used in gap analysis time bucketing.

### 3.3 Relationships

```
DataSource (1) ──► IngestionJob (N)
Product (1) ──► Contract (N)
Counterparty (1) ──► Contract (N)
GLAccount (1) ──► IngestionJob.mapping (N)
ALCOMeeting (1) ──► ActionItem (N)
IngestionJob (1) ──► DataQualityResult (N)
DataQualityRule (1) ──► DataQualityResult (N)
User (1) ──► AuditLog (N)
```

---

## 4. API Specification

### 4.1 Endpoints

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/data/sources` | GET | List all data sources | Admin |
| `/api/data/sources/{id}` | POST | Trigger ingestion for specific source | Admin |
| `/api/data/ingestion` | GET | List ingestion jobs with pagination | Admin |
| `/api/data/quality` | GET | Get overall data quality score | All roles |
| `/api/data/quality/dimensions` | GET | Get dimension-level scores | All roles |
| `/api/mdm/products` | GET | List products | All roles |
| `/api/mdm/products` | POST | Create new product | Admin |
| `/api/mdm/products/{id}` | PUT | Update product | Admin |
| `/api/mdm/counterparties` | GET | List counterparties | All roles |
| `/api/alco/meetings` | GET | List ALCO meetings | All roles |
| `/api/alco/meetings` | POST | Schedule new meeting | ALCO Secretary |
| `/api/alco/meetings/{id}/agenda` | PUT | Update agenda | ALCO Secretary |
| `/api/alco/action-items` | GET | List action items | All roles |
| `/api/alco/action-items/{id}` | PUT | Update action item status | Assignee/Owner |
| `/api/audit/log` | GET | Query audit log | Compliance |
| `/api/audit/lineage` | GET | Trace data lineage | All roles |

### 4.2 Request/Response Examples

**Trigger Ingestion**
```http
POST /api/data/sources/SRC-001/trigger
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "run_type": "incremental",
  "reporting_date": "2026-06-25"
}

Response: 202 Accepted
{
  "job_id": "job-uuid",
  "status": "queued",
  "estimated_completion": "2026-06-25T06:30:00Z"
}
```

**Get Data Quality Score**
```http
GET /api/data/quality?date=2026-06-25
Authorization: Bearer {jwt}

Response: 200 OK
{
  "overall_score": 94,
  "dimensions": {
    "completeness": 96,
    "accuracy": 92,
    "timeliness": 98,
    "consistency": 89,
    "validity": 95
  },
  "critical_issues": 3,
  "trend": "improving"
}
```

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Ingestion batch: Complete within 2 hours for all sources
- Data quality score calculation: < 30 seconds after ingestion completes
- MDM query response: < 200ms for list views, < 500ms for detail views
- Audit log search: < 2 seconds for 30-day queries
- ALCO meeting page load: < 1 second

### 5.2 Security
- All API endpoints require valid JWT with role claims
- Data source connections use encrypted credentials (AES-256)
- MDM write operations require dual approval (maker-checker)
- Audit log table is append-only; no DELETE or UPDATE privileges
- Data encryption at rest for all tables containing customer data

### 5.3 Availability
- Data ingestion: 99.9% uptime (scheduled maintenance windows excluded)
- MDM read operations: 99.95% uptime
- ALCO workflow: 99.9% uptime (critical for meetings)
- RTO (Recovery Time Objective): 4 hours
- RPO (Recovery Point Objective): 1 hour (intraday backups)

---

## 6. Reporting & Exports

| Report | Frequency | Audience | Format | Content |
|--------|-----------|----------|--------|---------|
| Data Quality Dashboard | Daily | Treasurer, CRO, Data Engineering | Web UI | Overall score, dimension breakdown, source status |
| Ingestion Status Report | Daily | Data Engineering | Email + Web | Job success/failure, row counts, error logs |
| MDM Change Log | Weekly | All ALM Users | Web UI | All product/counterparty changes in the week |
| ALCO Meeting Pack | Per meeting | ALCO Members | PDF | Agenda, pre-read metrics, action item status |
| Action Item Tracker | Weekly | ALCO Members, CRO | Excel + Web | All open items, owners, due dates, status |
| Audit Trail Export | On demand | Compliance, Internal Audit | Excel/PDF | Filtered audit log for specific queries |
| Data Lineage Report | On demand | Regulators, External Auditors | PDF | Traceability from source to report for any value |

---

*PRD v1.0 — Data Foundation & ALCO Governance Module*
