# ALM Platform Architecture (BoG 2026-Aligned)

## System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SYSTEMS                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Core     │  │ Market   │  │ Bank of  │  │ Business │  │ RTGS / │ │
│  │ Banking  │  │ Data     │  │ Ghana    │  │ Systems  │  │ Settle-│ │
│  │ System   │  │ Feeds    │  │ (ORASS)  │  │ (CRM)    │  │ ment   │ │
│  │ (CBS)    │  │ (Ghana)  │  │          │  │          │  │        │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘ │
└───────┼────────────┼────────────┼────────────┼────────────┼──────┘
        │            │            │            │            │
        ▼            ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         ALM PLATFORM (Ghana)                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    DATA INGESTION LAYER                       │  │
│  │  ETL Pipelines │ Data Quality │ Master Data │ Rules Repo    │  │
│  │  Ghana Ref Rate│ GoG T-Bills  │ GSE Equities│ RTGS Feed     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    CALCULATION ENGINE                       │  │
│  │  LMTD/LRMD │ IRRBB (19-bkt) │ RWA (SA) │ ECL │ FTP (GRR) │  │
│  │  Recovery    │ Stress Test  │ Capital  │ ICAAP │ ORASS   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    PRESENTATION LAYER                        │  │
│  │  Dashboards │ Reports │ Alerts │ Workflows │ ORASS Client │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    GOVERNANCE & CONTROL                      │  │
│  │  3LoD RBAC │ CRO Independence │ Risk Universe │ Audit Trail │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         INFRASTRUCTURE (Ghana)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ In-Country│  │ PostgreSQL│  │ Identity │  │ Encrypted│          │
│  │ Hosting   │  │ (Primary) │  │ Provider │  │ Storage  │          │
│  │ (CISD)    │  │           │  │ (Entra)  │  │          │          │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Ingestion Flow (Ghana-Specific)

```
Core Banking System (CBS) ──► ETL Pipeline ──► Data Quality Engine ──► MDM Store
     │                                                        │
     │──► GL balances (GHS/USD/EUR/GBP)                        │──► Products (Ghana-specific)
     │──► Loan contracts (retail, SME, corporate)            │──► Counterparties (domestic banks, GoG)
     │──► Deposit accounts (current, savings, NMD)           │──► Contracts (with 13 LMTD + 19 IRRBB buckets)
     │──► Securities positions (GoG T-bills, GSE equities)     │──► Charts of Accounts (Ghana CoA)
     │                                                         │
Market Data Feeds (Ghana) ──► Rate Curves ──► Ghana Ref Rate Store     │──► Audit Trail
     │──► Ghana Reference Rate (GRR)                           │
     │──► GoG T-bill yields (91d, 182d, 1y, 2y)              │
     │──► BoG policy rate                                      │
     │──► Interbank rate                                       │
     │                                                         │
RTGS / Settlement System ──► Real-time Feed ──► Intraday Liquidity Store
     │──► Payment messages                                     │
     │──► Settlement confirmations                             │
     │──► Nostro balances                                      │
     │                                                         │
BoG ORASS ──► Template Definitions ──► Regulatory Template Store
     │──► LMTD templates                                       │
     │──► LRMD templates                                       │
     │──► IRRBB templates                                      │
     │──► Capital adequacy templates                           │
```

### 2. Calculation Flow (BoG-Aligned)

```
MDM Store ──► LMTD Engine ──► Narrow/Broad classification ──► Four-ratio calculation ──► BoG ratios
         │──► LRMD Engine ──► 13-band maturity mismatch ──► Funding concentration ──► LAS/ILAAP
         │──► IRRBB Engine ──► 19-bucket standardised framework ──► EVE/NII under 6 shocks ──► SOT
         │──► RWA Engine ──► SA credit risk (Ghana risk weights) ──► Market risk ──► Operational risk
         │──► ECL Engine ──► PD/LGD/EAD ──► Ghana macro scenarios ──► ECL provision
         │──► FTP Engine ──► GRR-based curve construction ──► NMD modeling (BoG caps) ──► Deal pricing
         │──► Recovery Engine ──► Trigger monitoring ──► Options menu ──► MIS dashboard
         │──► GRC Engine ──► 3LoD RBAC ──► Risk Universe ──► Limit monitoring ──► Breach workflow
```

### 3. Presentation Flow

```
Calculation Results ──► Dashboard Cache ──► KPI Cards (BoG metrics)
                  │──► Report Generator ──► PDF/Excel/ORASS exports
                  │──► Alert Engine ──► Notification center (10-day BoG breach alerts)
                  │──► ALCO Pack ──► Board Risk Committee presentation
                  │──► ORASS Client ──► Direct BoG submission
                  │──► Recovery MIS ──► Real-time trigger monitoring
```

## Multi-Tenant Architecture (Ghana-First)

```
┌─────────────────────────────────────────┐
│           ALM PLATFORM (Ghana)           │
│  ┌─────────────────────────────────────┐  │
│  │        SHARED SERVICES              │  │
│  │  Auth (Entra) │ Logging │ Notification │  │
│  │  ORASS Client │ Ghana Ref Rate │ Rules Repo │  │
│  └─────────────────────────────────────┘  │
│  ┌─────────────────────────────────────┐  │
│  │        TENANT LAYER                 │  │
│  │  ┌─────────┐ ┌─────────┐ ┌────────┐ │  │
│  │  │Bank A   │ │Bank B   │ │SDI C   │ │  │
│  │  │(Ghana)  │ │(Ghana)  │ │(Ghana) │ │  │
│  │  │- Users   │ │- Users   │ │- Users │ │  │
│  │  │- Data    │ │- Data    │ │- Data  │ │  │
│  │  │- Reports │ │- Reports │ │-Reports│ │  │
│  │  └─────────┘ └─────────┘ └────────┘ │  │
│  └─────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Row-Level Security (RLS) with 3LoD

```sql
-- Example: Users can only see data for their subsidiary AND line of defence
CREATE POLICY tenant_isolation ON balance_sheet_data
FOR ALL
USING (
  subsidiary_id = current_setting('app.current_tenant')::UUID
  AND line_of_defence = current_setting('app.current_lod')::TEXT
);

-- CRO independence: CRO users cannot access CFO/COO/Internal Audit data
CREATE POLICY cro_independence ON financial_data
FOR ALL
USING (
  current_setting('app.current_role')::TEXT != 'CRO'
  OR department NOT IN ('Finance', 'Operations', 'Internal Audit')
);

-- Application sets tenant and role context per request
SET app.current_tenant = 'tenant-uuid-from-jwt';
SET app.current_lod = 'second-line-from-jwt';
SET app.current_role = 'role-from-jwt';
```

## Technology Stack Diagram (Ghana-Aligned)

```
┌────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  React 18 + TypeScript + TailwindCSS + shadcn/ui + ECharts   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │Dashboard │ │Modules   │ │Reports   │ │Settings  │         │
│  │(BoG KPIs)│ │(14 PRDs) │ │(ORASS)  │ │(3LoD)    │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/REST + WebSocket
┌────────────────────────────────────────────────────────────────┐
│                        BACKEND                                  │
│  Next.js API Routes + Node.js + Express                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │Auth      │ │Calculation│ │Data     │ │ORASS     │         │
│  │(Entra)   │ │(BoG)     │ │Pipeline │ │Client   │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼ SQL + Realtime Subscriptions
┌────────────────────────────────────────────────────────────────┐
│                        DATABASE (In-Country)                    │
│  PostgreSQL (Primary in Ghana) with Row-Level Security          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │Users     │ │Ghana     │ │Risk     │ │Audit     │         │
│  │(3LoD)    │ │Data      │ │Results  │ │Trail     │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
└────────────────────────────────────────────────────────────────┘
```

## Module Interaction Diagram (BoG 2026)

```
                    ┌─────────────────────────┐
                    │  DATA FOUNDATION         │
                    │  (MDM, ETL, ALCO, Rules)│
                    │  Ghana Ref Rate, RTGS   │
                    └────────┬────────────────┘
                             │
           ┌─────────────────┼─────────────────┬─────────────────┐
           │                 │                 │                 │
           ▼                 ▼                 ▼                 ▼
    ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐
    │ LIQUIDITY  │   │  CAPITAL   │   │   ECL      │   │  RECOVERY  │
    │ RISK       │   │ MANAGEMENT │   │ (IFRS 9)   │   │ PLANNING   │
    │ LMTD/LRMD  │   │ RWA/SA/ICAAP│  │ SICR/PD    │   │ Triggers   │
    │ 13-band    │   │ Pillar 2   │   │ Ghana Macro│   │ Options    │
    └─────┬──────┘   └─────┬──────┘   └─────┬──────┘   └─────┬──────┘
          │                │                │                │
          │                │                │                │
          │                ▼                │                │
          │         ┌────────────┐          │                │
          │         │  BALANCE   │          │                │
          │         │  SHEET     │          │                │
          │         │  OPTIMIZE  │          │                │
          │         │ (Recovery) │          │                │
          │         └─────┬──────┘          │                │
          │               │                 │                │
          └────────┬──────┴────────┬────────┘                │
                   │               │                         │
                   ▼               ▼                         ▼
            ┌────────────┐   ┌────────────┐          ┌────────────┐
            │ INTEREST   │   │  FUNDS     │          │    GRC     │
            │ RATE RISK  │   │ TRANSFER   │          │  RISK FRAME│
            │ IRRBB (19) │   │ PRICING    │          │  3LoD/RAS  │
            │ SOT        │   │ (GRR)      │          │  Breaches  │
            └────────────┘   └────────────┘          └────────────┘
                   │               │                         │
                   └───────────────┴─────────────┬─────────────┘
                                                 │
                                                 ▼
                                          ┌────────────┐
                                          │ REGULATORY │
                                          │ REPORTING    │
                                          │ ORASS        │
                                          │ Templates    │
                                          └────────────┘
```

## Deployment Architecture (Ghana-First, CISD 2026)

### Production (In-Country Hosting)

```
┌─────────────────────────────────────────────────────────────┐
│                      Ghana Data Center (Primary)              │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  Next.js Application (Serverless Functions)         │     │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │     │
│  │  │  SSR     │ │  API     │ │  Static  │            │     │
│  │  │  Pages   │ │  Routes  │ │  Assets  │            │     │
│  │  └──────────┘ └──────────┘ └──────────┘            │     │
│  └──────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL (Primary in Ghana)          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │  Auth    │ │  Realtime│ │  Storage │                    │
│  │  (RLS)   │ │  (Sub)   │ │  (Files) │                    │
│  │  3LoD    │ │  RTGS    │ │  Encrypted│                   │
│  └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Microsoft Entra ID (Identity)            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │  Sign-in │ │  Claims  │ │  MFA     │                    │
│  │  (OAuth) │ │  (Roles) │ │  (2FA)   │                    │
│  │  3LoD    │ │  CRO Ind │ │  CISD    │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BoG ORASS (Secure API)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │  Submit  │ │  Status  │ │  Ack     │                    │
│  │  Templates│ │  Check   │ │  Receive │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### Disaster Recovery (Ghana Secondary Site)

```
┌─────────────────────────────────────────────────────────────┐
│                      Ghana DR Site (Secondary)                │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  Replicated Application (Warm Standby)              │     │
│  │  RTO: 2 hours │ RPO: 15 minutes                       │     │
│  └──────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL (Replica in Ghana)          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │  Async   │ │  Realtime│ │  Backup  │                    │
│  │  Replica │ │  Sync    │ │  (Daily) │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## Security Model (CISD 2026 / RMD 2021)

### Authentication Flow (3LoD-Enforced)

```
User ──► Login Page ──► Microsoft Entra ID ──► JWT Token ──► Next.js Middleware
                                                          │
                                                          ▼
                                                   Role Verification (3LoD)
                                                          │
                                    ┌──────────────┬──────┼──────┬──────────────┐
                                    │              │      │      │              │
                                    ▼              ▼      ▼      ▼              ▼
                              ALCO Member   Risk Manager   Business User   Internal Auditor
                              (Full Access) (Risk + Liquidity) (Pricing Only) (Read-Only Audit)
                                    │              │      │      │              │
                                    │              │      │      │              │
                                    ▼              ▼      ▼      ▼              ▼
                              CRO Independence Check (No dual-hatting)
                                    │              │      │      │              │
                                    ▼              ▼      ▼      ▼              ▼
                              Front/Back Office Segregation
                                    │              │      │      │              │
                                    ▼              ▼      ▼      ▼              ▼
                              Data Access Granted (RLS-enforced)
```

### Data Protection (CISD 2026)

- **Data Residency**: All core systems and sensitive data remain in Ghana (CISD 2026)
- **Encryption at Rest**: AES-256 for all database storage
- **Encryption in Transit**: TLS 1.3 for all API communications
- **Row-Level Security**: All database queries filtered by `subsidiary_id` and `line_of_defence`
- **Audit Logs**: Immutable logs with digital signatures for all critical actions
- **Penetration Testing**: Quarterly penetration testing with results reported to Board
- **Incident Response**: 24-hour incident notification to BoG for cyber breaches

## Performance Targets (BoG-Aligned)

| Metric | Target | BoG Requirement |
|--------|--------|-----------------|
| Dashboard Load Time | < 2 seconds | Real-time monitoring |
| LMTD Ratio Calculation | < 5 seconds | Monthly 9-day submission |
| IRRBB EVE (19 buckets) | < 2 minutes | Quarterly submission |
| SOT Calculation | < 30 seconds | Real-time trigger monitoring |
| ECL Batch Run | < 1 hour (100K exposures) | Monthly provision |
| ORASS Submission | < 60 seconds | Timely regulatory reporting |
| Recovery Trigger Check | < 15 minutes | Continuous monitoring |
| API Response Time | < 200ms (p95) | System capability demonstration |
| Concurrent Users | 500+ | Multi-tenant Ghana banks |
| Data Freshness | Intraday (hourly) | Real-time liquidity monitoring |
| RTO (Disaster Recovery) | 2 hours | Business continuity |
| RPO (Data Loss) | 15 minutes | Data integrity |

## Scalability Considerations (Ghana Context)

- **Database**: Partition large tables by date, subsidiary, and currency (GHS/USD/EUR/GBP)
- **Cache**: Redis for dashboard KPIs, Ghana Reference Rate, and rate curves
- **Queue**: Background jobs for ECL batch, ORASS submission, and report generation
- **CDN**: Static assets served from Ghana edge locations (not external)
- **Database**: Read replicas for reporting queries (in-country)
- **RTGS Feed**: Dedicated real-time stream processing for intraday liquidity
- **ORASS Client**: Asynchronous submission with retry logic and fallback

## Regulatory Compliance Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    REGULATORY COMPLIANCE LAYER              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ CISD 2026    │  │ RMD 2021     │  │ BoG Directives│    │
│  │ Data Residency│  │ 3LoD / CRO   │  │ LMTD/LRMD    │    │
│  │ Cyber Security│  │ Independence │  │ IRRBB        │    │
│  │ Pen Testing   │  │ Risk Universe│  │ Capital      │    │
│  │ Board Reporting│ │ Limit Framework│ │ Recovery     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ ORASS Client │  │ Template     │  │ Submission   │    │
│  │ (Secure API) │  │ Population   │  │ Scheduler    │    │
│  │              │  │ Engine       │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

*Architecture v2.0 — BoG 2026-Aligned — 2026-06-25*
