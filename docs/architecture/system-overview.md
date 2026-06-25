# ALM Platform Architecture

## System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SYSTEMS                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Core     │  │ Market   │  │ Regulatory│  │ Business │          │
│  │ Banking  │  │ Data     │  │ Reporting │  │ Systems  │          │
│  │ System   │  │ Feeds    │  │ Portals   │  │ (CRM)    │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
└───────┼────────────┼────────────┼────────────┼──────────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         ALM PLATFORM                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    DATA INGESTION LAYER                       │  │
│  │  ETL Pipelines │ Data Quality │ Master Data │ Audit Trail     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    CALCULATION ENGINE                       │  │
│  │  LCR/NSFR │ IRRBB │ RWA │ ECL │ FTP │ Optimization        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    PRESENTATION LAYER                        │  │
│  │  Dashboards │ Reports │ Alerts │ Workflows │ Exports        │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         INFRASTRUCTURE                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Firebase │  │ Supabase │  │ Vercel   │  │ GitHub   │          │
│  │ Auth     │  │ PostgreSQL│  │ Hosting  │  │ Actions  │          │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Ingestion Flow

```
Core Banking System ──► ETL Pipeline ──► Data Quality Engine ──► MDM Store
     │                                                        │
     │──► GL balances                                          │──► Products
     │──► Loan contracts                                       │──► Counterparties
     │──► Deposit accounts                                     │──► Contracts
     │──► Securities positions                                 │──► Charts of Accounts
     │                                                         │
Market Data Feeds ──► Rate Curves ──► FTP Curve Store          │──► Audit Trail
     │──► ESTR/EURIBOR                                         │
     │──► Government bond yields                               │
     │──► Swap rates                                           │
```

### 2. Calculation Flow

```
MDM Store ──► LCR Engine ──► HQLA classification ──► Outflow categorization ──► LCR ratio
         │──► NSFR Engine ──► ASF calculation ──► RSF calculation ──► NSFR ratio
         │──► IRRBB Engine ──► EVE sensitivity ──► NII forecast ──► Gap analysis
         │──► RWA Engine ──► SA credit risk ──► IRB models ──► Output floor
         │──► ECL Engine ──► PD/LGD/EAD ──► Scenario weights ──► ECL provision
         │──► FTP Engine ──► Curve construction ──► NMD modeling ──► Deal pricing
```

### 3. Presentation Flow

```
Calculation Results ──► Dashboard Cache ──► KPI Cards
                  │──► Report Generator ──► PDF/Excel exports
                  │──► Alert Engine ──► Notification center
                  │──► ALCO Pack ──► Board presentation
```

## Multi-Tenant Architecture

```
┌─────────────────────────────────────────┐
│           ALM PLATFORM                   │
│  ┌─────────────────────────────────────┐ │
│  │        SHARED SERVICES              │ │
│  │  Auth │ Logging │ Notification      │ │
│  └─────────────────────────────────────┘ │
│  ┌─────────────────────────────────────┐ │
│  │        TENANT LAYER                 │ │
│  │  ┌─────────┐ ┌─────────┐ ┌────────┐│ │
│  │  │Bank A   │ │Bank B   │ │Bank C  ││ │
│  │  │(tenant) │ │(tenant) │ │(tenant)││ │
│  │  │- Users   │ │- Users   │ │- Users ││ │
│  │  │- Data    │ │- Data    │ │- Data  ││ │
│  │  │- Reports │ │- Reports │ │-Reports││ │
│  │  └─────────┘ └─────────┘ └────────┘│ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Row-Level Security (RLS)

```sql
-- Example: Users can only see data for their subsidiary
CREATE POLICY tenant_isolation ON balance_sheet_data
FOR ALL
USING (subsidiary_id = current_setting('app.current_tenant')::UUID);

-- Application sets tenant context per request
SET app.current_tenant = 'tenant-uuid-from-jwt';
```

## Technology Stack Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                 │
│  React 18 + TypeScript + TailwindCSS + shadcn/ui + ECharts   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │Dashboard │ │Modules   │ │Reports   │ │Settings  │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/REST + WebSocket
┌────────────────────────────────────────────────────────────────┐
│                        BACKEND                                  │
│  Next.js API Routes + Node.js + Express                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │Auth      │ │Calculation│ │Data     │ │Export    │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼ SQL + Realtime Subscriptions
┌────────────────────────────────────────────────────────────────┐
│                        DATABASE                                 │
│  PostgreSQL (Supabase) with Row-Level Security                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │Users     │ │Balance   │ │Risk     │ │Audit     │         │
│  │          │ │Sheet     │ │Results  │ │Trail     │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
└────────────────────────────────────────────────────────────────┘
```

## Module Interaction Diagram

```
                    ┌─────────────────┐
                    │  DATA FOUNDATION │
                    │  (MDM, ETL, ALCO) │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌────────────┐   ┌────────────┐   ┌────────────┐
    │ LIQUIDITY  │   │  CAPITAL   │   │   ECL      │
    │ RISK       │   │ MANAGEMENT │   │ (IFRS 9)   │
    │ LCR/NSFR   │   │ RWA/Output │   │ SICR/PD    │
    └─────┬──────┘   │   Floor     │   └─────┬──────┘
          │          └────────────┘         │
          │                 │                 │
          │                 ▼                 │
          │          ┌────────────┐          │
          │          │  BALANCE   │          │
          │          │  SHEET     │          │
          │          │  OPTIMIZE  │          │
          │          └────────────┘          │
          │                 │                 │
          └────────┬────────┴────────┬────────┘
                   │                 │
                   ▼                 ▼
            ┌────────────┐   ┌────────────┐
            │ INTEREST   │   │  FUNDS     │
            │ RATE RISK  │   │ TRANSFER   │
            │ IRRBB/EVE  │   │ PRICING    │
            └────────────┘   └────────────┘
```

## Deployment Architecture

### Production

```
┌─────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js Application (Serverless Functions)         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │  SSR     │ │  API     │ │  Static  │            │   │
│  │  │  Pages   │ │  Routes  │ │  Assets  │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase (PostgreSQL)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │  Auth    │ │  Realtime│ │  Storage │                    │
│  │  (RLS)   │ │  (Sub)   │ │  (Files) │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Firebase (Auth)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │  Sign-in │ │  Claims  │ │  MFA     │                    │
│  │  (OAuth) │ │  (Roles) │ │  (2FA)   │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## Security Model

### Authentication Flow

```
User ──► Login Page ──► Firebase Auth ──► JWT Token ──► Next.js Middleware
                                                   │
                                                   ▼
                                            Role Verification
                                                   │
                                    ┌──────────────┼──────────────┐
                                    │              │              │
                                    ▼              ▼              ▼
                              ALCO Member   Risk Manager   Business User
                              (Full Access) (Risk + Liquidity) (Pricing Only)
```

### Data Protection

- All database queries filtered by `subsidiary_id`
- RLS policies enforced at database level
- API routes validate JWT and extract tenant from claims
- Audit logs record all data modifications with before/after values
- Encryption at rest for sensitive data (personally identifiable, credit data)

## Performance Targets

| Metric | Target |
|--------|--------|
| Dashboard Load Time | < 2 seconds |
| LCR Calculation | < 5 seconds |
| EVE Sensitivity | < 10 seconds |
| ECL Batch Run | < 5 minutes (for 100K exposures) |
| Report Generation | < 30 seconds |
| API Response Time | < 200ms (p95) |
| Concurrent Users | 500+ |
| Data Freshness | Intraday (hourly updates) |

## Scalability Considerations

- **Database**: Partition large tables by date and subsidiary
- **Cache**: Redis for dashboard KPIs and rate curves
- **Queue**: Background jobs for ECL batch calculations and report generation
- **CDN**: Static assets and chart images served from edge cache
- **Database**: Read replicas for reporting queries

---

*Architecture v1.0 — 2026-06-25*
