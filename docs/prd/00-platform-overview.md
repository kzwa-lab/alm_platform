# PRD: ALM Platform — Platform Overview

## 1. Overview

### 1.1 Purpose

The ALM (Asset and Liability Management) Platform is a unified, web-based operational system for European banking groups to manage liquidity risk, interest rate risk, capital adequacy, expected credit losses, funds transfer pricing, and balance sheet optimization. It replaces fragmented spreadsheets and siloed reporting tools with a single source of truth, enabling real-time regulatory compliance, strategic decision-making, and ALCO (Asset and Liability Committee) workflow orchestration.

The platform serves as the nerve center for:
- **Regulatory compliance**: LCR, NSFR, IRRBB, FRTB, IFRS 9 ECL, Basel III/IV capital ratios
- **Strategic planning**: NIM forecasting, capital allocation, FTP optimization, balance sheet growth
- **Risk management**: Real-time risk metrics, stress testing, scenario analysis, hedge effectiveness
- **Operational workflow**: ALCO meetings, action item tracking, model validation, audit trails

**Regulatory drivers**: BCBS Basel III finalization (CRR3/CRD6 in EU, effective Jan 2025), IFRS 9 Impairment (post-implementation review completed Jul 2024), BCBS IRRBB recalibrated shocks (effective Jan 2026), EBA Guidelines on IRRBB and CSRBB, EBA Fourth LCR/NSFR Monitoring Report (May 2025).

### 1.2 Users & Roles

| Role | Responsibilities | Primary Modules |
|------|---------------|-----------------|
| **ALCO Member** | Attend ALCO meetings, review dashboards, approve strategic decisions, vote on motions | All modules (read-only + approval actions) |
| **Treasurer** | Manage liquidity position, execute funding strategy, monitor LCR/NSFR, run FTP curves, oversee yield curve management | Liquidity Risk, FTP, Interest Rate Risk, Balance Sheet Optimization |
| **Risk Manager** | Calculate and monitor risk metrics, run stress tests, validate models, produce regulatory reports | Liquidity Risk, Interest Rate Risk, Capital Management, ECL |
| **Model Validator** | Independently validate risk models, sign off on model changes, track validation findings, coordinate with ECB/TRIM processes | ECL, Interest Rate Risk, Capital Management, Liquidity Risk (validation view) |
| **Compliance Officer** | Ensure regulatory reporting accuracy, track CRR3/CRD6 compliance, manage audit trails, liaise with supervisors | All modules (compliance view), Data Foundation |
| **Business Unit Head** | Review BU-level profitability, pricing guidance, deposit/loan pricing decisions, NIM attribution | FTP, Balance Sheet Optimization, ECL (portfolio view) |
| **Finance/Accounting** | ECL provisioning, IFRS 9 disclosures, capital stack reporting, ICAAP support | ECL, Capital Management |
| **Data Engineer** | Manage data pipelines, master data quality, ETL orchestration, feed monitoring | Data Foundation |

**Role-based access control (RBAC)**: Every screen, button, API endpoint, and data field is gated by role. Permissions are managed via a Supabase Row-Level Security (RLS) policy matrix.

### 1.3 Dependencies

**External Systems**:
- Core Banking System (GL, subledgers) — daily balance feeds
- Loan Origination System — contract-level loan data
- Deposit/Mortgage System — deposit balances, early redemption data
- Market Data Provider (e.g., Bloomberg, Refinitiv) — yield curves, swap rates, credit spreads, equity prices
- Collateral Management System — HQLA inventory, encumbrance status
- Derivatives Trading System — IRS, caps, floors, swaption positions
- HR/Org System — user provisioning, BU hierarchy
- Regulatory Reporting Hub — ECB, national supervisor submission portals

**Internal Platform Dependencies**:
- Data Foundation (`01-data-foundation.md`) is the prerequisite for all other modules
- Calculation Engine (Python/FastAPI microservices) shared across Liquidity, IRRBB, Capital, ECL, FTP
- Workflow Engine (Supabase triggers + Edge Functions) shared for ALCO, Model Validation, PMA approvals

## 2. Features

### 2.1 Unified Dashboard (ALCO Cockpit)

#### Description
The ALCO Cockpit is the landing page for all ALCO Members and the Treasurer. It provides a single-pane-of-glass view of the bank's ALM health: liquidity ratios, capital ratios, ECL provisions, NIM trajectory, EVE sensitivity, and pending ALCO actions. The dashboard is role-aware — ALCO Members see high-level KPIs with drill-down capability, while the Treasurer sees operational controls and real-time data feeds.

#### User Stories
- **As an ALCO Member**, I want to see the bank's LCR, NSFR, CET1 ratio, and NIM on a single screen, so that I can assess ALM health in under 30 seconds.
- **As a Treasurer**, I want to see traffic-light indicators (green/amber/red) for each KPI with configurable thresholds, so that I can prioritize my morning workflow.
- **As a Risk Manager**, I want to see the latest EVE shock results and stress test outcomes, so that I can flag risks before the ALCO meeting.
- **As a Compliance Officer**, I want to see the audit trail summary (last 24h changes) and any data quality alerts, so that I can confirm regulatory reporting readiness.

#### Acceptance Criteria
1. Dashboard loads within 3 seconds (cached data) or 10 seconds (fresh calculation)
2. All KPIs display a "last updated" timestamp and a "data freshness" indicator (e.g., "Data: T-1 EOD" vs "Real-time")
3. KPIs with threshold breaches trigger a persistent banner notification at the top of the screen
4. Each KPI card is clickable and navigates to the detailed module screen
5. Dashboard is responsive (usable on 1440p desktop, 1080p laptop, and 1366p tablet)
6. Role-based visibility: ALCO Members cannot see deal-level profitability; Business Unit Heads cannot see firm-wide capital stack details unless authorized

#### Screen Layout Description

**Layout**: CSS Grid, 3-column on desktop, 1-column on mobile.

**Top Banner**: Bank name, current date, user role badge, data-as-of timestamp, system status indicators (feeds: green/amber/red).

**Row 1 — Critical KPIs (4 cards)**:
- **LCR Card**: Large percentage (e.g., "136.2%"), sparkline (30-day trend), threshold line at 100%, amber below 110%, red below 100%. Subtext: "HQLA: €2.1bn | Net Outflows: €1.5bn".
- **NSFR Card**: Large percentage (e.g., "123.6%"), sparkline, threshold at 100%. Subtext: "ASF: €8.2bn | RSF: €6.6bn".
- **CET1 Ratio Card**: Large percentage (e.g., "14.8%"), sparkline, threshold at 4.5% (minimum). Subtext: "CET1 Capital: €4.2bn | RWA: €28.4bn".
- **NIM Card**: Large basis point figure (e.g., "2.42%"), month-over-month change arrow, 12-month trend line chart. Subtext: "Budget: 2.50% | Variance: -8bp".

**Row 2 — Risk Sensitivity (2 cards)**:
- **EVE Sensitivity Card**: Table showing EVE impact under Parallel Up, Parallel Down, Steepener, Flattener, Short Rate Up, Short Rate Down (per BCBS standardized approach). Each row: Shock size (bps), EVE change (€M), EVE change as % of Tier 1 capital. Red flag if any shock reduces equity below 15% of RWA.
- **Liquidity Stress Card**: Bar chart showing LCR under Base, Mild, Moderate, Severe stress scenarios. Red flag if any scenario breaches 100%.

**Row 3 — Workflow & Alerts (2 cards)**:
- **ALCO Actions Card**: List of open action items from the last ALCO meeting. Columns: Action ID, Description, Owner, Due Date, Status (Overdue/On Track/Complete). Clicking opens the ALCO workflow module.
- **Data Quality Alerts Card**: Scrollable list of the top 5 data quality rule failures from the last 24h. Columns: Rule name, Severity, Count, Module. Clicking opens the Data Quality dashboard.

**Row 4 — ECL & Capital (2 cards)**:
- **ECL Summary Card**: Pie chart of Stage 1 / Stage 2 / Stage 3 provisions. Total ECL (€M), month-over-month change. Subtext: "SICR Triggers: 42 new this month".
- **Capital Stack Card**: Stacked bar chart of CET1, AT1, T2, Buffers. Buffer utilization percentage. Output floor binding indicator (Yes/No with add-on €M).

**Right Sidebar (desktop only)**: Mini calendar with upcoming ALCO meetings, quick links to frequently used reports, and a "Create What-If Scenario" button.

#### Data Inputs
- LCR/NSFR calculated values (from Liquidity Risk module)
- Capital ratio calculated values (from Capital Management module)
- ECL provision totals (from ECL module)
- NIM actuals and budget (from Balance Sheet Optimization module)
- EVE shock results (from Interest Rate Risk module)
- ALCO action items (from Data Foundation workflow engine)
- Data quality rule results (from Data Foundation validation engine)
- User role metadata (from Supabase auth/roles table)

#### Calculation Logic / Business Rules
- LCR = HQLA / Net Cash Outflows × 100 (CRR Article 412)
- NSFR = ASF / RSF × 100 (CRR Article 413)
- CET1 Ratio = CET1 Capital / RWA × 100
- NIM = (Interest Income - Interest Expense) / Average Earning Assets × 100
- EVE impact: ΔEVE = ΔPV(Assets) - ΔPV(Liabilities) under each shock scenario
- Traffic-light thresholds: LCR < 110% amber, < 100% red; NSFR < 110% amber, < 100% red; CET1 < 7% amber, < 4.5% red; EVE shock > 15% of Tier 1 capital red

#### Validation Rules
- All KPIs must have a data freshness indicator; stale data (> 48h for daily KPIs) triggers an amber warning on the card
- Dashboard cannot be accessed if user role is not assigned to any ALM module
- If calculation engine returns NaN or null for a KPI, display "N/A — Calculation Error" and log a critical alert to the Data Quality dashboard

#### Error Handling
- **Feed failure**: If a market data feed is down, the dashboard shows the last known value with a "Data stale" badge and a tooltip explaining the feed status
- **Calculation timeout**: If a fresh calculation exceeds 30 seconds, the dashboard falls back to cached data with a "Cached data" badge and a "Refresh" button
- **Authentication failure**: Redirect to login page with the original URL preserved for post-login navigation

#### Audit & Compliance Requirements
- Every dashboard view is logged: user ID, timestamp, role, IP address (for session correlation), which KPIs were clicked
- KPI value snapshots are retained for 7 years (regulatory requirement for supervisory review)
- Audit trail entries are immutable and written to a separate append-only Supabase table with RLS preventing modification

### 2.2 User Management & RBAC

#### Description
Administrative interface for provisioning users, assigning roles, managing role permissions, and reviewing user activity. Only Compliance Officers and designated Platform Administrators have write access.

#### User Stories
- **As a Compliance Officer**, I want to add a new ALCO Member and assign them read-only access to Liquidity Risk and Interest Rate Risk modules, so that they can participate in ALCO meetings with appropriate data access.
- **As a Platform Administrator**, I want to create a custom role "Liquidity Risk Analyst" with specific permissions (view LCR, edit stress scenarios, but not approve CFP triggers), so that I can implement the principle of least privilege.

#### Acceptance Criteria
1. User creation form enforces email verification before first login
2. Role assignment triggers automatic email notification to the user with their assigned modules
3. Permission changes take effect within 60 seconds (Supabase RLS refresh)
4. Deactivated users lose access immediately but their historical audit trail remains intact
5. Bulk import from HR/Org system CSV is supported (max 100 users per batch)

#### Screen Layout Description
- **Left panel**: User directory tree (expandable by role, department, BU)
- **Right panel**: User detail card (name, email, role, last login, assigned modules, activity log)
- **Top toolbar**: Add User, Edit Role, Deactivate, Export User List buttons
- **Role Editor**: Matrix view (roles × modules × permissions: None/View/Edit/Approve/Admin)

#### Data Inputs
- HR/Org system CSV feed (daily sync)
- Manual user entry form
- Supabase Auth users table
- Custom roles and permissions table

#### Calculation Logic / Business Rules
- Supabase RLS policies are auto-generated from the permissions matrix and applied to every table
- A user can have only one primary role but multiple secondary roles (e.g., "Risk Manager" + "Model Validator" requires explicit approval from Compliance Officer)
- Segregation of Duties: a user cannot be both "Model Developer" and "Model Validator" for the same model family

#### Validation Rules
- Email must be unique and within the bank's domain (e.g., `@bankname.eu`)
- Role must be selected from the approved role catalog (no custom roles without Compliance Officer approval)
- At least one module must be assigned per user

#### Error Handling
- Duplicate email: Show error message with a link to the existing user record
- HR sync failure: Log error, alert Platform Administrator, and retain previous user list until sync succeeds

#### Audit & Compliance Requirements
- All user provisioning, role changes, and deactivations are logged with before/after values
- Segregation of Duties rules are enforced at the database level with a trigger that blocks conflicting role assignments
- Quarterly user access review report is auto-generated for Compliance Officer sign-off

### 2.3 System Administration & Configuration

#### Description
Platform-level configuration management: tenant settings (multi-bank group support), currency defaults, fiscal calendar, calculation engine parameters, notification settings, and integration endpoint management.

#### User Stories
- **As a Platform Administrator**, I want to configure the fiscal year end (e.g., 31 December) and the reporting currency (EUR), so that all reports use consistent date and currency conventions.
- **As a Treasurer**, I want to set the LCR calculation frequency (daily vs. real-time) and the HQLA haircut rounding precision, so that the system matches our regulatory submission methodology.

#### Acceptance Criteria
1. Configuration changes require two-person approval (Maker-Checker) for critical parameters (e.g., calculation engine thresholds, regulatory rounding rules)
2. Configuration history is versioned; any change can be rolled back to a previous version
3. Critical parameter changes trigger a notification to all Compliance Officers and the Treasurer
4. Multi-tenancy: a single platform instance can serve multiple legal entities (e.g., banking group subsidiaries) with isolated data and shared group-level reporting

#### Screen Layout Description
- **Tabs**: General Settings, Fiscal Calendar, Calculation Parameters, Integration Endpoints, Notification Rules, Tenant Management
- **General Settings**: Currency, language, date format, number format (thousands separator, decimal places), timezone
- **Fiscal Calendar**: Month-end dates, quarter-end dates, year-end close date, holiday calendar for each jurisdiction (affects business day calculations for yield curves, cash flows)
- **Calculation Parameters**: LCR/NSFR rounding precision, EVE shock calibration parameters, ECL staging thresholds, FTP curve interpolation method
- **Integration Endpoints**: List of connected systems with status (green/amber/red), last sync timestamp, error log, "Test Connection" button, "Re-sync" button
- **Notification Rules**: Channel configuration (email, in-app, Slack/Teams webhook) per alert type and role

#### Data Inputs
- Manual configuration by authorized users
- System default values (version-controlled in JSON schema)
- Integration endpoint test responses

#### Calculation Logic / Business Rules
- Maker-Checker: User A (Maker) proposes a change; User B (Checker) approves; change is applied only after approval
- Versioning: Each configuration change increments a version number; rollback restores the previous version without deleting the audit trail
- Multi-tenancy: Each tenant (legal entity) has a `tenant_id` column in every data table; RLS ensures cross-tenant isolation

#### Validation Rules
- Fiscal year end must be a valid date and must not change after the year has been closed (locked by accounting period)
- Currency must be a valid ISO 4217 code
- Calculation parameters must be within regulatory bounds (e.g., LCR rounding precision must be 0 or 1 decimal places per EBA guidance)
- Integration endpoint URLs must be valid HTTPS URLs

#### Error Handling
- Invalid parameter value: Inline validation error with a link to the regulatory reference explaining the valid range
- Rollback failure: If a rollback would conflict with newer dependent changes, show a warning and require manual resolution
- Integration test failure: Display the HTTP error code and response body; provide a "Retry" button with exponential backoff

#### Audit & Compliance Requirements
- All configuration changes are logged with the full JSON diff (before/after)
- Maker-Checker approvals are stored as separate audit records with digital signatures (timestamp + user ID)
- Configuration audit reports are included in the annual internal audit pack

## 3. Data Model

### 3.1 Entities

| Entity | Description | Module |
|--------|-------------|--------|
| `users` | Platform users, auth credentials, roles | Platform |
| `roles` | Role definitions, permission matrices | Platform |
| `tenants` | Legal entities / banking group subsidiaries | Platform |
| `configurations` | Platform settings, versioned | Platform |
| `audit_logs` | Immutable activity log | Platform |
| `alco_meetings` | Meeting records, agendas, minutes | Data Foundation |
| `alco_action_items` | Action items, assignments, statuses | Data Foundation |
| `data_feeds` | External system feed metadata | Data Foundation |
| `data_quality_rules` | Validation rule definitions | Data Foundation |
| `data_quality_results` | Rule execution results | Data Foundation |
| `lcr_calculation` | Daily LCR results | Liquidity Risk |
| `nsfr_calculation` | Daily NSFR results | Liquidity Risk |
| `hqla_inventory` | High-Quality Liquid Assets classification | Liquidity Risk |
| `liquidity_stress_scenarios` | Stress test scenario definitions | Liquidity Risk |
| `eve_shock_results` | EVE sensitivity per scenario | Interest Rate Risk |
| `nii_forecasts` | NII projection data | Interest Rate Risk |
| `repricing_gap` | Maturity ladder / bucket analysis | Interest Rate Risk |
| `derivative_positions` | IRS, caps, floors, swaptions | Interest Rate Risk |
| `yield_curves` | Uploaded and shocked yield curves | Interest Rate Risk |
| `rwa_calculations` | RWA by approach and risk type | Capital Management |
| `capital_stack` | CET1, AT1, T2, buffers | Capital Management |
| `ecl_provisions` | ECL by stage and exposure | ECL |
| `macro_scenarios` | Macroeconomic scenario definitions | ECL |
| `sicr_triggers` | SICR detection events | ECL |
| `pma_records` | Post-Model Adjustment records | ECL |
| `ftp_curves` | FTP curve definitions | FTP |
| `nmd_behavioral_models` | NMD core/volatile split parameters | FTP |
| `deal_pricing` | Deal-level profitability calculations | FTP |
| `nim_attribution` | NIM decomposition data | Balance Sheet Optimization |
| `what_if_scenarios` | User-defined scenario parameters | Balance Sheet Optimization |

### 3.2 Key Attributes

**`users` Table**:
- `id` (UUID, PK)
- `email` (string, unique, indexed)
- `full_name` (string)
- `role_id` (UUID, FK → roles)
- `tenant_id` (UUID, FK → tenants)
- `department` (string)
- `business_unit` (string)
- `is_active` (boolean)
- `created_at`, `updated_at` (timestamps)
- `last_login_at` (timestamp)

**`roles` Table**:
- `id` (UUID, PK)
- `name` (string, e.g., "ALCO Member", "Treasurer")
- `description` (text)
- `permissions` (JSONB: module-level permission matrix)
- `is_system_role` (boolean, prevents deletion)

**`audit_logs` Table**:
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `tenant_id` (UUID, FK → tenants)
- `action` (enum: CREATE, READ, UPDATE, DELETE, APPROVE, REJECT, EXPORT, LOGIN, LOGOUT)
- `entity_type` (string, e.g., "lcr_calculation", "alco_action_item")
- `entity_id` (UUID)
- `before_values` (JSONB, nullable)
- `after_values` (JSONB, nullable)
- `ip_address` (string, nullable)
- `session_id` (string, nullable)
- `created_at` (timestamp)
- RLS: INSERT only, no UPDATE/DELETE allowed

**`tenants` Table**:
- `id` (UUID, PK)
- `legal_name` (string)
- `lei_code` (string, ISO 17442 Legal Entity Identifier)
- `country_code` (string, ISO 3166-1 alpha-2)
- `currency` (string, ISO 4217)
- `fiscal_year_end` (date)
- `parent_tenant_id` (UUID, FK → tenants, nullable, for banking groups)
- `is_active` (boolean)

### 3.3 Relationships

- `users` → `roles` (N:1)
- `users` → `tenants` (N:1)
- `audit_logs` → `users` (N:1)
- `audit_logs` → `tenants` (N:1)
- `configurations` → `tenants` (N:1, per-tenant settings)
- `alco_meetings` → `tenants` (N:1)
- `alco_action_items` → `alco_meetings` (N:1)
- `alco_action_items` → `users` (N:1, assignee)
- `data_quality_results` → `data_quality_rules` (N:1)
- `data_quality_results` → `tenants` (N:1)
- All module-specific tables → `tenants` (N:1, for multi-tenancy)
- All module-specific tables → `audit_logs` (1:N, via entity_type/entity_id polymorphic reference)

## 4. API Specification

### 4.1 Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/dashboard` | Bearer JWT | Returns ALCO Cockpit KPI data (cached) |
| GET | `/api/v1/dashboard/fresh` | Bearer JWT | Triggers fresh calculation and returns results |
| GET | `/api/v1/users` | Bearer JWT + Admin | List users (paginated) |
| POST | `/api/v1/users` | Bearer JWT + Admin | Create user |
| PUT | `/api/v1/users/{id}` | Bearer JWT + Admin | Update user role/activation |
| DELETE | `/api/v1/users/{id}` | Bearer JWT + Admin | Deactivate user (soft delete) |
| GET | `/api/v1/roles` | Bearer JWT | List roles |
| PUT | `/api/v1/roles/{id}` | Bearer JWT + Admin | Update role permissions |
| GET | `/api/v1/config` | Bearer JWT | Get current configuration |
| POST | `/api/v1/config` | Bearer JWT + Admin | Propose configuration change (Maker) |
| POST | `/api/v1/config/{id}/approve` | Bearer JWT + Admin | Approve configuration change (Checker) |
| GET | `/api/v1/audit` | Bearer JWT + Compliance | Query audit logs (filtered by date, user, entity, action) |
| GET | `/api/v1/health` | None | System health check (feeds, calculations, DB) |

### 4.2 Request/Response Examples

**GET /api/v1/dashboard** (Response):
```json
{
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "data_as_of": "2026-06-24T18:00:00Z",
  "data_freshness": "T-1 EOD",
  "kpis": {
    "lcr": {
      "value": 136.2,
      "unit": "%",
      "trend": [132.1, 133.5, 134.0, 135.1, 136.2],
      "status": "green",
      "threshold": 100.0,
      "detail_url": "/liquidity/lcr/2026-06-24"
    },
    "nsfr": {
      "value": 123.6,
      "unit": "%",
      "trend": [122.0, 122.5, 123.0, 123.3, 123.6],
      "status": "green",
      "threshold": 100.0
    },
    "cet1_ratio": {
      "value": 14.8,
      "unit": "%",
      "trend": [14.5, 14.6, 14.7, 14.8, 14.8],
      "status": "green",
      "threshold": 4.5
    },
    "nim": {
      "value": 2.42,
      "unit": "%",
      "trend": [2.38, 2.40, 2.41, 2.42, 2.42],
      "status": "amber",
      "budget": 2.50,
      "variance_bp": -8
    }
  },
  "alco_actions": {
    "open_count": 7,
    "overdue_count": 2,
    "items": [
      {
        "id": "act-2026-015",
        "description": "Review wholesale funding concentration limits",
        "owner": "John Smith",
        "due_date": "2026-06-30",
        "status": "On Track"
      }
    ]
  },
  "data_quality_alerts": {
    "count": 3,
    "alerts": [
      {
        "rule": "LCR_Outflow_Category_Mandatory",
        "severity": "high",
        "count": 12,
        "module": "Liquidity Risk"
      }
    ]
  }
}
```

**POST /api/v1/users** (Request):
```json
{
  "email": "jane.doe@bankname.eu",
  "full_name": "Jane Doe",
  "role_id": "role-alco-member-001",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "department": "Treasury",
  "business_unit": "Group ALM"
}
```

**POST /api/v1/config** (Request):
```json
{
  "category": "calculation_parameters",
  "key": "lcr_rounding_precision",
  "value": 1,
  "reason": "EBA monitoring report requires 1 decimal place for LCR disclosure"
}
```

**GET /api/v1/audit** (Response, paginated):
```json
{
  "total": 15432,
  "page": 1,
  "page_size": 50,
  "results": [
    {
      "id": "audit-2026-001",
      "user_id": "user-123",
      "user_name": "John Smith",
      "action": "UPDATE",
      "entity_type": "lcr_calculation",
      "entity_id": "lcr-2026-06-24",
      "before_values": { "hqla": 2100000000 },
      "after_values": { "hqla": 2150000000 },
      "ip_address": "10.0.1.42",
      "created_at": "2026-06-24T09:15:00Z"
    }
  ]
}
```

## 5. Non-Functional Requirements

### 5.1 Performance

- **Dashboard load**: < 3 seconds for cached data, < 10 seconds for fresh calculation (95th percentile)
- **Report generation**: < 30 seconds for standard reports (e.g., LCR daily report, ECL monthly report); < 5 minutes for complex reports (e.g., full ICAAP pack, comprehensive stress test)
- **Concurrent users**: Support 50 concurrent users (ALCO + Treasury + Risk + Finance) with < 2s query response time
- **Data ingestion**: Process daily balance sheet feed (100k rows) within 15 minutes; process market data feed (yield curves, 500 instruments) within 5 minutes
- **Calculation engine**: LCR calculation for a mid-sized bank (€50bn balance sheet) in < 60 seconds; ECL batch for 100k loans in < 10 minutes
- **Database**: Supabase PostgreSQL with read replicas for reporting queries; pgBouncer for connection pooling
- **Caching**: Redis for KPI caching (TTL: 1 hour for daily metrics, 5 minutes for real-time metrics); calculation result caching for 24 hours

### 5.2 Security

- **Authentication**: Supabase Auth with JWT tokens (RS256), refresh token rotation, 2FA enforced for Admin and Compliance roles
- **Authorization**: Row-Level Security (RLS) on every table; role-based access control at the API gateway level
- **Data encryption**: AES-256 at rest (Supabase managed); TLS 1.3 in transit
- **Audit**: Immutable audit log table (append-only, no UPDATE/DELETE); quarterly access review reports
- **Network**: VPN or private VPC required for production access; API rate limiting (100 req/min per user, 1000 req/min per service account)
- **Secrets**: API keys, database credentials, and integration passwords stored in a secrets manager (e.g., HashiCorp Vault or AWS Secrets Manager)
- **Penetration testing**: Annual third-party penetration test; quarterly vulnerability scanning
- **Compliance**: GDPR compliant (data subject access request workflow); data retention policies configurable per jurisdiction

### 5.3 Availability

- **Uptime target**: 99.9% (excluding scheduled maintenance windows)
- **Scheduled maintenance**: Maximum 4 hours per month, announced 72 hours in advance, outside business hours (20:00–06:00 CET)
- **Disaster recovery**: RPO < 1 hour, RTO < 4 hours; daily backups to geo-redundant storage; point-in-time recovery enabled (7-day retention)
- **Monitoring**: Application performance monitoring (APM) with alerts for error rate > 1%, p95 latency > 5s, feed failure > 15 minutes
- **Health checks**: `/api/v1/health` endpoint checks database connectivity, calculation engine status, and critical feed freshness
- **Failover**: Hot standby for read replicas; calculation engine runs on Kubernetes with auto-scaling (min 2 pods, max 10 pods)

## 6. Reporting & Exports

### 6.1 Standard Reports

| Report | Frequency | Format | Recipients | Module |
|--------|-----------|--------|------------|--------|
| ALCO Pack | Monthly | PDF (print-ready) + PowerPoint | ALCO Members, Board | All |
| LCR Daily Report | Daily | PDF + Excel | Treasurer, Risk Manager, Compliance | Liquidity Risk |
| NSFR Weekly Report | Weekly | PDF + Excel | Treasurer, Risk Manager | Liquidity Risk |
| ECL Monthly Report | Monthly | PDF + Excel + XBRL | Finance, Risk Manager, Compliance | ECL |
| Capital Adequacy Report | Monthly | PDF + Excel | CFO, Risk Manager, Compliance | Capital Management |
| IRRBB Regulatory Pack | Quarterly | PDF + Excel | Risk Manager, Compliance | Interest Rate Risk |
| FTP Curve Change Notice | Ad-hoc (annual review + emergency) | PDF | Business Unit Heads, Treasurer | FTP |
| Audit Trail Extract | Ad-hoc | CSV + PDF | Compliance Officer, Internal Audit | Platform |

### 6.2 Export Capabilities

- All tabular screens support CSV export (with UTF-8 BOM for Excel compatibility)
- All charts support PNG/SVG export (high resolution for board presentations)
- All reports support PDF generation (via headless Chromium/Puppeteer with Tailwind CSS print styles)
- Regulatory reports support XBRL (e.g., EBA COREP/FINREP templates) where applicable
- Data extracts support date-range filtering, entity selection, and field selection (custom column sets)
- Export size limit: 1M rows per CSV file; paginated extracts for larger datasets
- All exports are logged in the audit trail with the filter criteria and row count

### 6.3 ALCO Pack Structure

The monthly ALCO Pack is the flagship deliverable:
1. **Executive Summary** (2 pages): KPI dashboard, traffic-light summary, key decisions required
2. **Liquidity Risk** (4 pages): LCR/NSFR trends, stress test results, intraday liquidity snapshot, CFP status
3. **Interest Rate Risk** (4 pages): EVE sensitivity, NII forecast, repricing gap, hedge portfolio summary
4. **Capital Management** (3 pages): Capital ratios, RWA breakdown, output floor impact, capital plan
5. **ECL & Credit Risk** (3 pages): ECL by stage, SICR trends, PMA summary, backtesting results
6. **FTP & Profitability** (3 pages): FTP curve, NIM attribution, deal-level profitability highlights
7. **Balance Sheet Optimization** (3 pages): Structural hedging status, deposit pricing, loan origination guidance, what-if scenario results
8. **ALCO Minutes & Actions** (2 pages): Last meeting minutes summary, open action items, upcoming agenda
9. **Appendix** (variable): Detailed tables, sensitivity analysis, regulatory references

Total: 24+ pages, generated automatically from platform data with manual annotation fields for the Treasurer and Risk Manager.
