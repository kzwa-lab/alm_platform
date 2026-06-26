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

- **Upstream**: Core banking system (CBS, GL), loan management system, deposit system, securities inventory, market data feeds (Ghana Reference Rate, GoG T-bills/bonds, GSE equities, FX rates, internal treasury), RTGS/settlement system (real-time), HR/Org system
- **Downstream**: All ALM calculation modules (Liquidity, IRRBB, Capital, ECL, FTP, Optimization, Recovery, GRC, Regulatory Reporting)
- **External**: Regulatory reporting systems (BoG ORASS), external auditors, BoG cybersecurity examiner portal

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
- [ ] Pipelines support 12+ source types: SQL databases, APIs, SFTP files, Excel uploads, SWIFT messages, RTGS real-time feeds, message queues
- [ ] Daily batch completes within 2 hours of core banking EOD
- [ ] Intraday updates available for HQLA positions, derivative MTM, and RTGS settlement balances
- [ ] Real-time streaming ingestion for RTGS/settlement throughput data (critical for LRMD system capability demonstration)
- [ ] Failed jobs retry automatically up to 3 times with exponential backoff
- [ ] All ingestion events logged with source, timestamp, row count, validation status, and data residency check

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
| General Ledger balances | Core Banking (CBS) | SQL / API | Daily EOD |
| Loan contracts | Loan Management | API | Daily EOD |
| Deposit accounts | Deposit System | API | Daily EOD |
| Securities positions | Securities Inventory | SFTP / API | Daily EOD + intraday |
| Market rates (Ghana Reference Rate, GoG bills/bonds) | Market Data Provider | API | Intraday (hourly) |
| Counterparty data | CRM / KYC | API | Daily EOD |
| FX rates | Market Data Feed | API | Intraday (hourly) |
| RTGS settlement balances & throughput | RTGS / Central Payment System | Real-time API / message queue | Real-time / intraday |
| Capital tier structures | General Ledger | API / file | Period-end |
| E-money float accounts | Payment Provider System | API | Daily EOD |

#### Calculation Logic / Business Rules
- **Currency conversion**: All non-GHS amounts converted to GHS using spot rate at reporting date; EUR and USD treated as significant currencies per BoG LMTD
- **Aggregation**: Individual account balances rolled up to product/counterparty level
- **Date alignment**: All sources must use the same reporting date (T-1 for EOD batch); RTGS data uses intraday timestamp
- **Delta detection**: Only changed records processed in incremental loads
- **Data residency check**: All ingested data tagged with source region; non-Ghana sources flagged for review
- **E-money float classification**: E-money float accounts automatically classified as volatile liabilities per LRMD

#### Validation Rules
- Row count must be within ±5% of previous day (unless known structural change)
- Total assets must equal total liabilities + equity (±0.1% tolerance for rounding)
- All required fields (account ID, currency, amount, maturity date) must be non-null
- No duplicate primary keys in any source table
- Market data rates must be within ±20% of previous day's rate (outlier detection)

#### Error Handling
- **Level 1 (Warning)**: Row count deviation 5-10%, missing optional fields → Log warning, continue processing
- **Level 2 (Alert)**: Row count deviation >10%, null required fields → Pause dependent calculations, notify Risk Manager
- **Level 3 (Critical)**: Complete source failure, total assets ≠ liabilities + equity, RTGS feed down > 15 minutes → Block all downstream modules, trigger incident response, alert CISO per CISD 2026

#### Audit & Compliance Requirements
- Full data lineage: source → transformation → destination, with version history
- Retention: 7 years for production data, 3 years for staging data
- Data residency: all production data stored in Ghana; cross-border transfer requires Board Risk Committee approval
- Personal data (customer names, IDs) pseudonymized in ALM warehouse per data protection requirements
- All data changes logged with who, what, when, before/after values for internal and external audit
- SOX/Internal Audit: All data changes logged with who, what, when, before/after values

---

### 2.2 Master Data Management (MDM)

#### Description
A centralized repository for reference data that ensures consistency across all ALM calculations. Includes product catalogs, counterparty master, contract attributes, chart of accounts mapping, and the Ghana-specific asset/liability classification engine that drives the BoG LMTD ratios and encumbrance register.

#### User Stories
- **As a Data Engineer**, I want to define a new product type with its ALM-relevant attributes so that LCR and IRRBB calculations automatically include it.
- **As a Risk Manager**, I want to view the complete list of counterparties with their credit ratings so that I can verify RWA calculations.
- **As a Treasurer**, I want to update the behavioral maturity assumptions for a deposit product so that FTP and IRRBB calculations reflect the latest analysis.
- **As a Compliance Officer**, I want to see the Narrow/Broad liquid asset classification for every balance so that I can verify BoG prudential ratio inputs.
- **As a Liquidity Risk Manager**, I want the encumbrance status of every asset to be automatically reconciled to the collateral management system so that Available Unencumbered Assets is accurate.

#### Acceptance Criteria
- [ ] Product catalog includes: product ID, type, ALM category, risk weight, liquidity classification, behavioral assumptions, BoG LMTD classification (Narrow/Broad/N/A)
- [ ] Counterparty master includes: ID, name, sector, country, credit rating (internal + external), exposure limit, connected-counterparty group ID
- [ ] Contract attributes include: ID, product type, counterparty, currency, notional, rate type (fixed/floating), maturity, repricing date, collateral, encumbrance status
- [ ] Chart of accounts mapping: GL code → ALM category → regulatory classification → BoG LMTD category
- [ ] Ghana asset classification engine: every balance classified as Narrow Liquid Asset, Broad Liquid Asset, or Non-Liquid per BoG definitions
- [ ] Encumbrance register: per-asset tracking of legal, regulatory, contractual, or other restrictions; reconciled continuously to asset ledger
- [ ] All MDM changes require approval workflow (Request → Review → Approve → Deploy)
- [ ] MDM versioning: previous values retained for historical calculation reproducibility
- [ ] E-money float accounts classified as volatile liabilities per LRMD

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Master Data Browser                                            │
│  Tabs: [Products] [Counterparties] [Contracts] [CoA Mapping] [Classification] [Encumbrance] │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Search: [____________] [Filter ▼] [+ Add New]             │ │
│  │                                                            │ │
│  │ Product ID │ Product Name    │ Type     │ BoG LMTD │ IRRBB │ │
│  │ P-001      │ Retail Current  │ Deposit  │ N/A      │ NMD   │ │
│  │ P-002      │ Retail Savings  │ Deposit  │ N/A      │ NMD   │ │
│  │ P-003      │ Corp Term Loan  │ Loan     │ N/A      │ Fixed │ │
│  │ P-004      │ Fixed Mortgage  │ Loan     │ N/A      │ Fixed │ │
│  │ P-005      │ GoG T-Bill 91D  │ Security │ Narrow   │ Fixed │ │
│  │ P-006      │ GoG Bond 5Y     │ Security │ Broad    │ Fixed │ │
│  │ P-007      │ GSE Equity      │ Security │ Broad*   │ N/A   │ │
│  │ P-008      │ BoG Bill 182D   │ Security │ Narrow   │ Fixed │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Product Detail: P-005 GoG T-Bill 91D                       │ │
│  │ ┌────────────────────┐ ┌────────────────────┐             │ │
│  │ │ BoG Category: Narrow│ │ Liquidity: Level 1  │             │ │
│  │ │ Maturity: 91 days   │ │ Encumbered: No      │             │ │
│  │ │ Haircut: 0%        │ │ GSE Listed: No      │             │ │
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
- Ghana asset classification rules from BoG LMTD directive
- Encumbrance data from Collateral Management System
- E-money float definitions from Payment Provider / Legal

#### Calculation Logic / Business Rules
- Product classification drives LCR outflow rates, NSFR RSF/ASF factors, and IRRBB repricing behavior
- BoG LMTD classification drives Narrow/Broad liquid asset ratios and Available Unencumbered Assets
- Counterparty sector + rating → credit risk weight (SA) or PD estimate (IRB)
- Connected-counterparty grouping: control relationship + economic interdependence tests
- Contract rate type + maturity → repricing bucket assignment for gap analysis
- CoA mapping ensures every GL account feeds into the correct ALM category and BoG LMTD category
- Encumbrance status: `unencumbered` if no legal, regulatory, contractual, or other restriction; otherwise `encumbered` with restriction type and counterparty
- GSE equities: classified as Broad Liquid Asset, subject to 10% cap of total liquid assets and configurable BoG haircut

#### Validation Rules
- Product IDs must be unique across all subsidiaries
- Every product must have a valid LCR classification (or "N/A" for non-liabilities)
- Every product must have a valid IRRBB classification (fixed, floating, NMD, or "N/A")
- Every product must have a valid BoG LMTD classification (Narrow, Broad, or "N/A")
- Counterparty ratings must be within valid range (AAA to D)
- Contract maturity date must be >= origination date
- Encumbered assets must have restriction type and counterparty documented
- GSE equities must not exceed 10% of total liquid assets (configurable BoG cap)
- E-money float accounts must be classified as volatile liabilities

#### Error Handling
- Missing product classification → flagged as "Unclassified", excluded from calculations until resolved
- Missing BoG LMTD classification → flagged as "Unclassified", excluded from prudential ratio calculations until resolved
- Duplicate counterparty IDs → merge process triggered, manual review required
- Invalid date ranges → reject record, log error, notify data owner
- Encumbrance status mismatch with collateral system → amber alert, reconcile within 1 hour
- GSE equities exceeding 10% cap → red alert, trigger rebalancing review

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

### 2.6 ALM Control Tower

#### Description
A single-pane control tower for the ALM production cycle. It orchestrates the data pipeline from system configuration → trial balance → XTEL instrument feeds → reconciliation → run launch → reporting. It surfaces matched/unmatched positions, tracks a checklist of data-quality gates, and enables users to drill into instrument modeling by ALM code and currency.

#### User Stories
- **As a Treasurer**, I want to see at a glance whether the trial balance reconciles to the instrument feed so that I can trust the day’s projections.
- **As a Data Engineer**, I want to see unmatched XTEL instruments and unmatched GL codes so that I can fix mapping gaps before reports are run.
- **As an ALCO Member**, I want the control tower to block report generation when reconciliation variances exceed tolerance so that ALCO sees only validated numbers.

#### Acceptance Criteria
- [ ] Loads active system configuration (period, base date, report month) before any downstream step
- [ ] Imports XTEL feeds: Time Deposits, Non-Term Deposits, Placements, Borrowings, Overdrafts, Flat-Rate Loans, Decreasing Loans, Discounts, YTMs
- [ ] Performs three-way reconciliation: Matched ALM (TB vs XTEL), Unmapped ALM, Unmapped TB, Unmapped XTEL
- [ ] Shows percentage difference for matched ALM codes and flags variances outside tolerance
- [ ] Tracker checklist: Step 3 (product-level validation per feed) and Step 5 (link rates + run projections)
- [ ] Run launcher creates a versioned `Run` entity only when reconciliation passes

#### Data Inputs
| Input | Source | Frequency |
|-------|--------|-----------|
| Trial balance by ALM code | Core Banking GL | Daily EOD |
| ALM base master | MDM | On change |
| ALM / TB mapping weights | MDM | On change |
| XTEL instrument feeds | Treasury / Core Banking | Daily EOD |
| System configuration | Platform admin | Per reporting period |

#### Calculation Logic / Business Rules
- Reconciliation variance = |TB value − XTEL value| / max(TB value, XTEL value) × 100
- If variance ≤ tolerance (e.g., 0.1%) → status Matched
- If variance > tolerance → status Mismatched, block run launch until override approved
- Unmapped positions require manual mapping or explicit exclusion with reason

#### Validation Rules
- Total TB assets must equal total TB liabilities + equity before reconciliation
- Every active ALM code must map to at least one GL code
- XTEL instruments with no ALM code mapping must be flagged within 1 hour of ingestion

#### Error Handling
- Complete feed failure → block downstream calculations, alert Data Engineering and Treasurer
- Reconciliation tolerance breach → amber alert with drill-down grid; red alert if > 1% variance
- Missing system configuration → disable run launcher until configured

#### Audit & Compliance Requirements
- Reconciliation status and variance stored per run
- Override of reconciliation blocks requires dual approval and reason code
- All XTEL feed loads logged with row counts and timestamps

---

### 2.7 Instrument Modeling Workbench

#### Description
A unified screen for modeling individual instrument types. It loads system config, ALM bases, trial balance, and XTEL deals for a selected ALM code + currency; lets users set deal attributes, strategies, and rate scenarios; and triggers the server-side projection engine.

#### User Stories
- **As a Treasury Analyst**, I want to model call/notice deposits so that I can project their behavioral runoff.
- **As a Risk Manager**, I want to configure prepayment speeds and repricing intervals for loans so that IRRBB cashflows are realistic.
- **As a Treasurer**, I want to save a projection run and compare it against other strategy/rate combinations later.

#### Acceptance Criteria
- [ ] Supports product types: Call/Notice, Loans (flat-rate & decreasing), Bonds, Discount/T-Bills, Cashflow, Property, Term
- [ ] Deal attributes: capital, accrued interest, rate, start date, maturity date, day-count base, rate type (fixed/variable/adjustable/discretionary), reprice interval, rollover frequency, interest capitalization flag
- [ ] Strategy modeling: NewBusiness (fixed monthly target), MinTarget (fill gap if balance falls below target), Extension, Runoff
- [ ] Rate scenario selection: base forecast plus user-defined shocks
- [ ] If no XTEL data exists for an ALM code, automatically create a transparent synthetic balancing deal from the TB position
- [ ] Saves results to a versioned `Run` record with immutable assumption set reference

#### Data Inputs
- ALM base and TB map from MDM
- XTEL deals by ALM code and currency
- Rate forecast curves
- Strategy targets per ALM code

#### Calculation Logic / Business Rules
- Projection horizon: typically 24 months (configurable)
- Day-count conventions: 365, 364, 360, 1/12
- Rollover frequencies: 0, 1, 2, 3, 4, 6, 12 months
- Synthetic deal: start on 15th of month t+1, maturity on 15th of month t+7, priced from forecast curve
- Saved run contains: valuation date, curve version, assumption-set version, created_by, created_at, GL reconciliation variance, override comment

#### Validation Rules
- Maturity date must be ≥ start date
- Rate must be ≥ 0 (with negative-rate floor configurable by currency)
- Strategy targets must be numeric and within product-specific limits
- Run status transitions: Draft → Submitted → Approved → Archived

#### Error Handling
- Missing XTEL data → create synthetic deal with assumption flag, do not fail silently
- Invalid deal attributes → inline validation with field-level errors
- Projection engine timeout → return cached partial result and alert Engineering

#### Audit & Compliance Requirements
- Every run versioned and immutable once Approved
- Assumption sets require approval workflow before use in production runs
- Audit log captures every run creation, edit, approval, and override

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **AssetClassification** | BoG LMTD asset classification per balance | classification_id, instrument_id, bog_category (Narrow/Broad/NonLiquid), encumbrance_status, restriction_type, counterparty_id, haircut_pct, gse_flag |
| **EncumbranceRegister** | Real-time encumbrance tracking per asset | encumbrance_id, instrument_id, restriction_type, counterparty_id, start_date, end_date, status, reconciliation_timestamp |
| **CashFlowBucket** | Dual bucket engine output (13 LMTD + 19 IRRBB) | bucket_id, instrument_id, bucket_type (LMTD/IRRBB), band, cash_inflow, cash_outflow, residual_maturity_days |
| **RateCurve** | Yield curve and shock factor store | curve_id, date, currency, curve_type (GhanaReferenceRate/OIS/Swap), tenor, rate, source, version |
| **ShockFactor** | Versioned shock factor table | shock_id, version, scenario, currency, factor, effective_date, status |
| **RulesRepository** | Central configuration rules repository | rule_id, category, key, value, version, effective_date, approved_by, status |
| **DataSource** | External system providing data | source_id, name, type, connection_string, schedule, last_run, status, region_check |
| **IngestionJob** | ETL execution instance | job_id, source_id, start_time, end_time, status, rows_processed, errors, residency_check |
| **Product** | Bank product master | product_id, name, category, lcr_classification, irrbb_classification, bog_lmtd_classification, risk_weight, behavioral_maturity, core_ratio, deposit_beta, gse_cap_flag |
| **Counterparty** | Customer / entity master | counterparty_id, name, sector, country, credit_rating_internal, credit_rating_external, exposure_limit, connected_group_id |
| **Contract** | Individual deal / account | contract_id, product_id, counterparty_id, currency, notional, rate_type, fixed_rate, margin, origination_date, maturity_date, repricing_date, collateral_amount, encumbrance_status |
| **GLAccount** | General ledger account | gl_code, account_name, alm_category, bog_lmtd_category, coa_level_1, coa_level_2, coa_level_3 |
| **DataQualityRule** | Validation rule definition | rule_id, name, dimension, logic, threshold, severity |
| **DataQualityResult** | Rule execution result | result_id, rule_id, job_id, pass_count, fail_count, score |
| **ALCOMeeting** | ALCO meeting record | meeting_id, date, status, agenda_items, attendees, minutes |
| **ActionItem** | ALCO decision action | action_id, meeting_id, description, owner, due_date, status, priority |
| **AuditLog** | Change log entry | log_id, timestamp, user_id, table_name, action, field_name, old_value, new_value, reason, ip_address, session_id |
| **ALMBase** | ALM product bucket / code | alm_code, description, product_group, business_unit, currency, bs_group, is_asset, rate_type, hqla_flag, bog_lmtd_flag, risk_weight, calc_type, tb_category, ifs_index |
| **ALMTBMap** | ALM to GL/TB mapping | map_id, alm_code, gl_code, weight, category (CAP/ACCINT/ADJ/DEP) |
| **Instrument** | Contract-level deal data | instrument_id, alm_code, currency, capital, accrued_interest, rate, start_date, maturity_date, rate_type, day_count_base, reprice_months, rollover_months, cap_interest, encumbrance_status |
| **Run** | Versioned calculation run | run_id, base_date, period_id, curve_version_id, assumption_set_id, rules_version_id, status, reconciliation_variance, override_comment, created_by, created_at |
| **CashFlow** | Projected monthly cashflow | cf_id, run_id, instrument_id, month_date, capital, accrued_interest, interest_income, interest_expense, capital_inflow, capital_outflow, pl |
| **AssumptionSet** | Versioned assumptions | assumption_set_id, name, version, nmd_decay_profile, cpr_assumption, tdrr_assumption, rollover_rates, status, approved_by, approved_at |
| **Scenario** | Rate / growth scenario | scenario_id, name, type, shock_bps, curve_adjustment_json, growth_assumptions, status |

### 3.2 Key Attributes

**Product.bog_lmtd_classification**: Bank of Ghana LMTD classification for the product. Must be one of `Narrow`, `Broad`, or `NonLiquid`. Drives the four prudential liquidity ratios. Narrow includes cash, BoG balances, GoG T-bills ≤1Y, AAA-rated placements, domestic bank claims. Broad includes all Narrow plus GoG bonds >1Y and GSE-listed equities (subject to 10% cap and haircut).

**Product.gse_cap_flag**: TRUE if the product is a GSE-listed equity. GSE equities are subject to a configurable 10% cap of total liquid assets per BoG LMTD.

**Contract.encumbrance_status**: TRUE if the asset is pledged as collateral or subject to any restriction. Drives the Available Unencumbered Assets tool and the encumbrance register.

**Run.rules_version_id**: Foreign key to the RulesRepository version in force at the time of the run. Ensures every calculation is reproducible from the exact configuration in effect.

**AssumptionSet.tdrr_assumption**: Term Deposit Redemption Rate assumption for early-redemption risk modeling, shared by the Behavioural Model Library.

**CashFlowBucket.bucket_type**: Either `LMTD` (13 prescribed bands: Overnight, 7-day, 14-day, 1/2/3/6/9 month, 1/2/3/5, >5 year) or `IRRBB` (19 standardised buckets). Enables dual-bucket cash flow slotting from a single instrument record.

**RateCurve.curve_type**: `GhanaReferenceRate` for the official Ghana Reference Rate; `OIS` for overnight index swap; `Swap` for standard swap curve. The Ghana Reference Rate is the primary reference for FTP, IRRBB, and ECL discounting in the Ghanaian context.

**ShockFactor.factor**: The shock factor (in basis points or percentage) for a given scenario, currency, and version. Versioned so that the Basel July-2024 recalibration approach can be updated without code changes as BoG finalises its scenarios.

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
ALMBase (1) ──► Instrument (N)
ALMBase (1) ──► ALMTBMap (N)
GLAccount (1) ──► ALMTBMap (N)
Instrument (1) ──► AssetClassification (1)
Instrument (1) ──► EncumbranceRegister (N)
Instrument (1) ──► CashFlowBucket (N)
Run (1) ──► CashFlow (N)
Instrument (1) ──► CashFlow (N)
AssumptionSet (1) ──► Run (N)
Scenario (N) ──► Run (N)
RateCurve (N) ──► Run (N) (via curve_version_id)
ShockFactor (N) ──► Scenario (N)
RulesRepository (1) ──► Run (N) (via rules_version_id)
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
| `/api/mdm/classification` | GET | List BoG LMTD classifications | All roles |
| `/api/mdm/classification/{id}` | PUT | Update asset classification | Admin |
| `/api/mdm/encumbrance` | GET | Get encumbrance register | All roles |
| `/api/mdm/encumbrance/{id}` | PUT | Update encumbrance status | Admin |
| `/api/mdm/curves` | GET | List rate curves | All roles |
| `/api/mdm/curves` | POST | Upload new rate curve | Admin |
| `/api/mdm/shock-factors` | GET | List shock factors | All roles |
| `/api/mdm/rules` | GET | List rules repository entries | Admin |
| `/api/mdm/rules` | POST | Create new rule version | Admin |
| `/api/mdm/buckets` | GET | List cash flow bucket definitions | All roles |
| `/api/alco/meetings` | GET | List ALCO meetings | All roles |
| `/api/alco/meetings` | POST | Schedule new meeting | ALCO Secretary |
| `/api/alco/meetings/{id}/agenda` | PUT | Update agenda | ALCO Secretary |
| `/api/alco/action-items` | GET | List action items | All roles |
| `/api/alco/action-items/{id}` | PUT | Update action item status | Assignee/Owner |
| `/api/audit/log` | GET | Query audit log | Compliance |
| `/api/audit/lineage` | GET | Trace data lineage | All roles |
| `/api/alm/control-tower` | GET | Reconciliation status and tracker | All roles |
| `/api/alm/reconciliation/verify` | POST | Run reconciliation check | Treasurer/Data Engineer |
| `/api/alm/instruments` | GET | List instruments by ALM code/currency | All roles |
| `/api/alm/instruments/{id}` | GET | Get instrument details | All roles |
| `/api/alm/runs` | POST | Create a new projection run | Treasurer/Risk Manager |
| `/api/alm/runs/{id}/execute` | POST | Execute projection engine | Treasurer/Risk Manager |
| `/api/alm/runs/{id}` | GET | Get run status and results | All roles |
| `/api/alm/assumption-sets` | GET | List assumption sets | All roles |
| `/api/alm/assumption-sets` | POST | Create assumption set (Draft) | Risk Manager |
| `/api/alm/assumption-sets/{id}/approve` | POST | Approve assumption set | ALCO/Treasurer |

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
- Ingestion batch: Complete within 2 hours for all sources; RTGS real-time feed latency < 5 seconds
- Data quality score calculation: < 30 seconds after ingestion completes
- MDM query response: < 200ms for list views, < 500ms for detail views
- Audit log search: < 2 seconds for 30-day queries
- ALCO meeting page load: < 1 second
- Cash flow bucketing (13 LMTD + 19 IRRBB): < 30 seconds for 100k instruments
- Rate curve update: < 1 minute from market data feed
- Encumbrance register reconciliation: < 5 minutes per 10k instruments

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
| Ingestion Status Report | Daily | Data Engineering | Email + Web | Job success/failure, row counts, error logs, residency check |
| MDM Change Log | Weekly | All ALM Users | Web UI | All product/counterparty/classification changes in the week |
| Asset Classification Summary | Daily | Compliance, Treasurer | Web UI | Narrow/Broad liquid asset breakdown, encumbrance status |
| Encumbrance Register Report | Daily | Compliance, Risk | Web UI | Per-asset encumbrance status, reconciliation variance |
| ALCO Meeting Pack | Per meeting | ALCO Members | PDF | Agenda, pre-read metrics, action item status |
| Action Item Tracker | Weekly | ALCO Members, CRO | Excel + Web | All open items, owners, due dates, status |
| Audit Trail Export | On demand | Compliance, Internal Audit | Excel/PDF | Filtered audit log for specific queries |
| Data Lineage Report | On demand | Regulators, External Auditors | PDF | Traceability from source to report for any value |
| Rules Repository Change Log | Weekly | Compliance, Risk | Web UI | All threshold/bucket/shock/template changes |

---

## 7. Appendix

### 7.1 Regulatory References
- Bank of Ghana Liquidity Monitoring Tools Directive (LMTD), 2026 (Exposure Draft)
- Bank of Ghana Liquidity Risk Management Directive (LRMD), 2026 (Exposure Draft)
- Bank of Ghana Guideline on the Management and Measurement of Interest Rate Risk in the Banking Book (IRRBB), 2026 (Exposure Draft)
- Bank of Ghana Risk Management Directive (RMD), 2021
- Bank of Ghana Cyber & Information Security Directive (CISD), 2026
- Banks and Specialised Deposit-Taking Institutions Act, 2016 (Act 930), Sections 36(2), 92(1)

### 7.2 Configuration Keys

| Key | Default | Description |
|-----|---------|-------------|
| `data.ingestion.rtgs_latency_seconds` | `5` | Maximum acceptable latency for RTGS real-time feed |
| `data.classification.gse_equity_cap_pct` | `10` | Maximum GSE equities as % of total liquid assets |
| `data.classification.narrow_bill_max_years` | `1` | Maximum maturity in years for GoG/BoG bills to qualify as Narrow |
| `data.encumbrance.reconciliation_interval_minutes` | `60` | Encumbrance register reconciliation frequency |
| `data.buckets.lmtd_bands` | `13` | Number of LMTD contractual maturity mismatch bands |
| `data.buckets.irrbb_bands` | `19` | Number of IRRBB standardised repricing buckets |
| `data.quality.overall_threshold` | `85` | Minimum overall data quality score before downstream calculations pause |
| `data.residency.approved_regions` | `["GH-ACC", "GH-TAM", "GH-CAPE"]` | Allowed Ghana regions for data storage |

---

*PRD v1.0 — Data Foundation & ALCO Governance Module*
