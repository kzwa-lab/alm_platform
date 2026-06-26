# ALM Operational Platform (Bank of Ghana 2026-Aligned)

A comprehensive operational platform for Asset and Liability Management (ALM) in Ghanaian banking, aligned with the Bank of Ghana 2026 Prudential Reform Package. This system enables treasury, risk management, ALCO, and Board Risk Committee teams to calculate, monitor, and report on liquidity, interest rate risk, capital adequacy, credit loss provisioning, funds transfer pricing, balance sheet optimization, recovery planning, and regulatory compliance in real time.

---

## 🏦 Overview

| | |
|---|---|
| **Purpose** | Operational ALM platform for daily risk management, BoG regulatory reporting (ORASS), and ALCO/Board decision support |
| **Users** | Treasurers, Risk Managers, ALCO Members, CRO, Board Risk Committee, Model Validators, Compliance Officers, Business Unit Heads |
| **Status** | 🔄 Prototype Phase (BoG 2026 Alignment In Progress) |
| **License** | Internal Use Only |
| **Regulatory Driver** | Bank of Ghana 2026 Prudential Reform Package (LMTD, LRMD, IRRBB, Recovery Planning, RMD 2021, CISD 2026) |

**Complementary to:** [ALM LMS Platform](../alm-lms-platform/) — The LMS teaches ALM theory; this platform implements the practice.

---

## 📐 Architecture (BoG 2026-Aligned)

```
┌─────────────────────────────────────────────────────────────────┐
│              ALM OPERATIONAL PLATFORM (Ghana)                    │
├─────────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + TailwindCSS + ECharts                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │   Dashboard  │ │  Modules     │ │  Reports     │            │
│  │   (BoG KPIs) │ │  (14 PRDs)   │ │  (ORASS)     │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes / Node.js Backend                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  Calculation │ │  Data        │ │  Auth        │            │
│  │  Engines     │ │  Pipeline    │ │  (Entra)     │            │
│  │  (BoG)       │ │  (Ghana)     │ │  (3LoD)      │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL (In-Country) with Row-Level Security                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  Core Banking│ │  Ghana Data  │ │  ALM Results │            │
│  │  Data (ETL)  │ │  Feeds       │ │  Store       │            │
│  │  (CBS)       │ │  (GRR, RTGS) │ │  (BoG)       │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Modules (14 PRDs — BoG 2026 Aligned)

| Phase | Module | PRD | Purpose | Key Features |
|-------|--------|-----|---------|-------------|
| 1 | **Platform Overview** | `00` | Architecture, tech stack, roles, Ghana context | BoG 2026 context, CISD 2026, phased delivery, module-to-directive mapping |
| 1 | **Data Foundation** | `01` | Unified data layer, ALCO governance, Ghana classification | Data ingestion, MDM, quality rules, ALCO workflow, Narrow/Broad classification, 13+19 buckets, Ghana Reference Rate, RTGS connector, rules repository |
| 2 | **Liquidity Risk** | `02` | LMTD/LRMD monitoring, stress testing | BoG four-ratio engine, 13-band maturity mismatch, funding concentration, significant-currency LCR, CFP triggers, ILAAP/LAS |
| 2 | **Interest Rate Risk** | `03` | IRRBB measurement, hedging, BoG Standardised Framework | 19-bucket standardised framework, EVE sensitivity, NII forecast, gap analysis, basis risk, yield-curve risk, formal SOT, derivatives |
| 3 | **Capital Management** | `04` | RWA, capital planning, ICAAP | SA credit risk (Ghana risk weights), market risk, operational risk, capital stack, ICAAP, Pillar 2 add-ons, D-SIB surcharge |
| 3 | **Expected Credit Loss** | `05` | IFRS 9 provisioning, Ghana macro scenarios | ECL engine, SICR monitoring, Ghana macro scenarios (GDP, inflation, BoG rate, GHS/USD, cocoa/gold/oil), sectoral PD adjustments, overlays |
| 4 | **Funds Transfer Pricing** | `06` | Internal pricing, profitability, Ghana Reference Rate | GRR-based FTP curves, GoG T-Bill curve, BoG policy rate, interbank rate, NMD modeling (BoG caps), deal pricer, LTP |
| 4 | **Balance Sheet Optimization** | `07` | Strategic decision support, recovery integration | NIM attribution (GRR impact), hedge tracker, pricing optimizer, recovery trigger integration, Ghana macro variables |
| 5 | **Recovery Planning** | `08` | Recovery plan repository, options, triggers | Recovery plan versioning, options menu, quantitative indicators, real-time MIS dashboard, annual self-assessment, Dec 31 submission |
| 5 | **GRC Risk Framework** | `09` | Governance, risk, compliance (RMD 2021) | Digitised RMF, Risk Universe Register, 3LoD RBAC, CRO independence, front/back-office segregation, limit framework, 10-day breach notification |
| 5 | **Regulatory Reporting** | `10` | ORASS integration, BoG templates | BoG template catalogue, template population engine, ORASS secure API client, submission scheduler, public disclosures |
| 3 | **Behavioural Model Library** | `11` | Shared modelling service | NMD core deposit modeler (BoG caps), CPR prepayment, TDRR early-redemption, backtesting, versioned assumptions |
| 1 | **Cyber Security & Data Residency** | `12` | CISD 2026 compliance | Ghana data residency, ISO 27001/NIST controls, quarterly penetration testing, board cyber reporting, encryption |
| 2 | **RTGS Intraday Liquidity** | `13` | Real-time liquidity monitoring | RTGS/settlement feed, intraday liquidity monitoring, throughput ratios, system-capability demonstration, fallback/resilience |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Microsoft Entra ID (for Auth with 3LoD)
- PostgreSQL (in-country, for Database)

### Installation

```bash
# Clone the repository
git clone https://github.com/ledger101/alm_platform.git
cd alm_platform

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Entra ID and PostgreSQL credentials

# Run database migrations
# (See docs/architecture/database-schema.md)

# Start development server
npm run dev
```

### Environment Variables

```bash
# Microsoft Entra ID (3LoD RBAC, CRO Independence)
NEXT_PUBLIC_ENTRA_CLIENT_ID=
NEXT_PUBLIC_ENTRA_TENANT_ID=
ENTRA_CLIENT_SECRET=

# PostgreSQL (In-Country, CISD 2026)
DATABASE_URL=

# BoG ORASS (Regulatory Reporting)
ORASS_API_ENDPOINT=https://orass.bog.gov.gh/api/v3
ORASS_CERTIFICATE_PATH=/secure/orass.crt

# Ghana Reference Rate (Primary Reference)
GRR_SOURCE_URL=https://bog.gov.gh/ghana-reference-rate

# Optional: Analytics
NEXT_PUBLIC_GA_ID=
```

---

## 📊 Prototype

The HTML prototype is located in `/prototype/` and can be opened directly in a browser:

```bash
# Open the landing page
open prototype/index.html

# Or serve with a local server
npx serve prototype
```

The prototype contains:
- Interactive calculators (LMTD ratios, LCR, NSFR, EVE, ECL, FTP, RWA)
- Dashboard with BoG KPI cards and charts
- Module navigation with sidebar (14 modules)
- Responsive design for desktop and tablet
- Ghana-specific data elements (GRR, GoG T-bills, GHS/USD)

---

## 📋 Documentation

| Document | Location | Description |
|----------|----------|-------------|
| Gap Analysis | `findings.md` | BoG 2026 gap analysis and coverage matrix |
| Update Plan | `updatePlan.md` | Implementation plan for BoG alignment |
| PRD: Platform Overview | `docs/prd/00-platform-overview.md` | Architecture, tech stack, roles, Ghana context |
| PRD: Data Foundation | `docs/prd/01-data-foundation.md` | Data ingestion, MDM, Ghana classification, rules repo |
| PRD: Liquidity Risk | `docs/prd/02-liquidity-risk.md` | LMTD, LRMD, BoG four ratios, 13-band mismatch |
| PRD: Interest Rate Risk | `docs/prd/03-interest-rate-risk.md` | IRRBB, 19 buckets, SOT, basis risk, yield-curve risk |
| PRD: Capital Management | `docs/prd/04-capital-management.md` | RWA (SA), ICAAP, Pillar 2, D-SIB surcharge |
| PRD: Expected Credit Loss | `docs/prd/05-ecl.md` | ECL engine, Ghana macro scenarios, sectoral PD |
| PRD: Funds Transfer Pricing | `docs/prd/06-ftp.md` | GRR-based FTP, GoG T-Bill curve, multi-currency |
| PRD: Balance Sheet Optimization | `docs/prd/07-balance-sheet-optimization.md` | NIM attribution, recovery triggers, Ghana macro |
| PRD: Recovery Planning | `docs/prd/08-recovery-planning.md` | Recovery plan, options menu, triggers, MIS dashboard |
| PRD: GRC Risk Framework | `docs/prd/09-grc-risk-framework.md` | RMF, 3LoD, CRO independence, Risk Universe, limits |
| PRD: Regulatory Reporting | `docs/prd/10-regulatory-reporting-orass.md` | BoG templates, ORASS client, submission scheduler |
| PRD: Behavioural Model Library | `docs/prd/11-behavioural-model-library.md` | NMD, CPR, TDRR, BoG caps, backtesting |
| PRD: Cyber Security & Data Residency | `docs/prd/12-cyber-security-data-residency.md` | CISD 2026, Ghana hosting, ISO 27001, pen testing |
| PRD: RTGS Intraday Liquidity | `docs/prd/13-rtgs-intraday-liquidity.md` | RTGS feed, intraday monitoring, throughput ratios |
| System Architecture | `docs/architecture/system-overview.md` | BoG 2026-aligned architecture diagrams |
| Visual: Design System | `docs/visuals/00-design-system.md` | Colors, typography, components |
| Visual: Navigation Shell | `docs/visuals/01-navigation-shell.md` | Sidebar, top bar, breadcrumbs |
| Visual: Dashboard | `docs/visuals/02-landing-dashboard.md` | KPI cards, alerts, quick links |
| Visual: Liquidity Screens | `docs/visuals/03-liquidity-visuals.md` | LMTD charts, tables, gauges |
| Visual: IRRBB Screens | `docs/visuals/04-irrbb-visuals.md` | 19-bucket sensitivity, forecasts, gaps |
| Visual: Capital Screens | `docs/visuals/05-capital-visuals.md` | Stack, bridge, gauges |
| Visual: ECL Screens | `docs/visuals/06-ecl-visuals.md` | Trends, staging, overlays |
| Visual: FTP Screens | `docs/visuals/07-ftp-visuals.md` | GRR curves, profitability, attribution |
| Visual: Optimization Screens | `docs/visuals/08-optimization-visuals.md` | NIM, hedging, pricing matrix |

---

## 🤖 Automation (Cron Jobs)

| Job | Schedule | Purpose |
|-----|----------|---------|
| Ghana Reference Rate Update | Daily (08:00 GMT) | Fetch latest GRR from BoG |
| LMTD Ratio Calculation | Daily (09:00 GMT) | Calculate BoG four ratios |
| Recovery Trigger Check | Every 15 minutes | Monitor quantitative triggers |
| ORASS Submission Reminder | Daily (08:00 GMT) | Check upcoming BoG deadlines |
| Health Check | Daily (08:00 GMT) | Verify module links, calculators, data freshness |
| Report Generation | Monthly (1st, 09:00 GMT) | Compile usage analytics, ALCO summary |
| Penetration Test Schedule | Quarterly | CISD 2026 compliance |
| Cyber Risk Report | Quarterly | Board cyber reporting |

---

## 🛠️ Tech Stack (Ghana-Aligned)

| Layer | Technology | BoG Requirement |
|-------|-----------|-----------------|
| Frontend | React 18, TypeScript, TailwindCSS, shadcn/ui | Responsive UI |
| Charts | Apache ECharts | Data visualization |
| Backend | Next.js API Routes, Node.js | API layer |
| Database | PostgreSQL (In-Country) | CISD 2026 data residency |
| Auth | Microsoft Entra ID | 3LoD RBAC, CRO independence |
| Data Pipeline | Python (pandas, polars), Apache Airflow | ETL for Ghana data |
| Deployment | In-Country Hosting (Ghana) | CISD 2026 compliance |
| Monorepo | Turborepo (future) | Scalability |

---

## 🏗️ Repository Structure

```
alm_platform/
├── docs/
│   ├── prd/              # Product Requirement Documents (14 PRDs)
│   ├── visuals/          # Visual specification documents
│   └── architecture/     # System architecture diagrams (BoG 2026-aligned)
├── prototype/            # HTML sandbox with interactive calculators
│   ├── index.html        # Landing page / dashboard (BoG KPIs)
│   ├── css/              # Stylesheet framework
│   ├── js/               # Chart configs, calculators, navigation
│   ├── modules/          # Module HTML pages (14 modules)
│   └── assets/           # Screenshots, icons
├── src/                  # Future: production React application
├── tests/                # Test specifications
├── .github/
│   └── workflows/        # CI/CD pipelines
├── findings.md           # BoG 2026 gap analysis
├── updatePlan.md         # Implementation plan
├── README.md             # This file
├── CONTRIBUTING.md         # Development guidelines
└── IMPLEMENTATION_PLAN.md # Full project plan with timeline
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines, branching strategy, and code review process.

**Key Principles:**
1. **Ghana-first**: All features must align with BoG 2026 requirements
2. **Configuration over code**: Thresholds, buckets, and templates are versioned config
3. **3LoD enforcement**: All code changes must respect Three Lines of Defence
4. **CISD 2026 compliance**: No sensitive data leaves Ghana

---

## 📞 Support

For questions or issues, contact the ALM Platform team or open an issue in the GitHub repository.

**Regulatory Contacts:**
- Bank of Ghana: [bog.gov.gh](https://bog.gov.gh)
- ORASS Support: [orass.bog.gov.gh](https://orass.bog.gov.gh)

---

*Built by Clawdy ⚡ for Ghanaian banking ALM professionals.*
*Aligned with the Bank of Ghana 2026 Prudential Reform Package.*
