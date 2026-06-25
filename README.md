# ALM Operational Platform

A comprehensive operational platform for Asset and Liability Management (ALM) in banking. This system enables treasury, risk management, and ALCO teams to calculate, monitor, and report on liquidity, interest rate risk, capital adequacy, credit loss provisioning, funds transfer pricing, and balance sheet optimization in real time.

---

## 🏦 Overview

| | |
|---|---|
| **Purpose** | Operational ALM platform for daily risk management, regulatory reporting, and ALCO decision support |
| **Users** | Treasurers, Risk Managers, ALCO Members, Model Validators, Compliance Officers, Business Unit Heads |
| **Status** | 🔄 Prototype Phase |
| **License** | Internal Use Only |

**Complementary to:** [ALM LMS Platform](../alm-lms-platform/) — The LMS teaches ALM theory; this platform implements the practice.

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ALM OPERATIONAL PLATFORM                     │
├─────────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + TailwindCSS + ECharts                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │   Dashboard  │ │  Modules     │ │  Reports     │            │
│  │   (Landing)   │ │  (7 Modules) │ │  (Regulatory)│            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes / Node.js Backend                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  Calculation │ │  Data        │ │  Auth        │            │
│  │  Engines     │ │  Pipeline    │ │  (Firebase)  │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL (Supabase) with Row-Level Security                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  Core Banking│ │  Market Data │ │  ALM Results │            │
│  │  Data (ETL)  │ │  Feeds       │ │  Store       │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Modules

| Phase | Module | Purpose | Key Features |
|-------|--------|---------|-------------|
| 1 | **Data Foundation** | Unified data layer, ALCO governance | Data ingestion, MDM, quality rules, ALCO workflow |
| 2 | **Liquidity Risk** | LCR/NSFR monitoring, stress testing | Real-time LCR, NSFR projection, CFP triggers |
| 2 | **Interest Rate Risk** | IRRBB measurement, hedging | EVE sensitivity, NII forecast, gap analysis, derivatives |
| 3 | **Capital Management** | RWA, capital planning | SA/IRB RWA, output floor, capital stack, ICAAP |
| 3 | **Expected Credit Loss** | IFRS 9 provisioning | ECL engine, SICR monitoring, macro scenarios, overlays |
| 4 | **Funds Transfer Pricing** | Internal pricing, profitability | FTP curve, NMD modeling, deal pricer, LTP |
| 4 | **Balance Sheet Optimization** | Strategic decision support | NIM attribution, hedge tracker, pricing optimizer |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (for Auth)
- Supabase project (for Database)

### Installation

```bash
# Clone the repository
git clone https://github.com/ledger101/alm_platform.git
cd alm_platform

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Firebase and Supabase credentials

# Run database migrations
# (See docs/architecture/database-schema.md)

# Start development server
npm run dev
```

### Environment Variables

```bash
# Firebase Auth
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

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
- Interactive calculators (LCR, NSFR, EVE, ECL, FTP, RWA)
- Dashboard with KPI cards and charts
- Module navigation with sidebar
- Responsive design for desktop and tablet

---

## 📋 Documentation

| Document | Location | Description |
|----------|----------|-------------|
| Implementation Plan | `IMPLEMENTATION_PLAN.md` | Full project plan with timeline |
| PRD: Platform Overview | `docs/prd/00-platform-overview.md` | Architecture, tech stack, roles |
| PRD: Data Foundation | `docs/prd/01-data-foundation.md` | Data ingestion, MDM, ALCO workflow |
| PRD: Liquidity Risk | `docs/prd/02-liquidity-risk.md` | LCR, NSFR, stress testing |
| PRD: Interest Rate Risk | `docs/prd/03-interest-rate-risk.md` | IRRBB, EVE, NII, hedging |
| PRD: Capital Management | `docs/prd/04-capital-management.md` | RWA, output floor, capital planning |
| PRD: Expected Credit Loss | `docs/prd/05-expected-credit-loss.md` | ECL engine, SICR, IFRS 9 |
| PRD: Funds Transfer Pricing | `docs/prd/06-funds-transfer-pricing.md` | FTP curves, deal pricing, LTP |
| PRD: Balance Sheet Optimization | `docs/prd/07-balance-sheet-optimization.md` | NIM, hedging, pricing optimizer |
| Visual: Design System | `docs/visuals/00-design-system.md` | Colors, typography, components |
| Visual: Navigation Shell | `docs/visuals/01-navigation-shell.md` | Sidebar, top bar, breadcrumbs |
| Visual: Dashboard | `docs/visuals/02-landing-dashboard.md` | KPI cards, alerts, quick links |
| Visual: Liquidity Screens | `docs/visuals/03-liquidity-visuals.md` | Charts, tables, gauges |
| Visual: IRRBB Screens | `docs/visuals/04-irrbb-visuals.md` | Sensitivity, forecasts, gaps |
| Visual: Capital Screens | `docs/visuals/05-capital-visuals.md` | Stack, bridge, gauges |
| Visual: ECL Screens | `docs/visuals/06-ecl-visuals.md` | Trends, staging, overlays |
| Visual: FTP Screens | `docs/visuals/07-ftp-visuals.md` | Curves, profitability, attribution |
| Visual: Optimization Screens | `docs/visuals/08-optimization-visuals.md` | NIM, hedging, pricing matrix |

---

## 🤖 Automation (Cron Jobs)

| Job | Schedule | Purpose |
|-----|----------|---------|
| Research Refresh | Weekly (Mon 09:00 CET) | Auto-update ALM research docs |
| Dependency Audit | Weekly (Mon 10:00 CET) | Check for outdated npm packages |
| Health Check | Daily (08:00 CET) | Verify module links, calculators, data freshness |
| Report Generation | Monthly (1st, 09:00 CET) | Compile usage analytics, ALCO summary |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, TailwindCSS, shadcn/ui |
| Charts | Apache ECharts |
| Backend | Next.js API Routes, Node.js |
| Database | PostgreSQL (Supabase) with RLS |
| Auth | Firebase Auth |
| Data Pipeline | Python (pandas, polars), Apache Airflow |
| Deployment | Vercel / Firebase Hosting |
| Monorepo | Turborepo (future) |

---

## 🏗️ Repository Structure

```
alm_platform/
├── docs/
│   ├── prd/              # Product Requirement Documents
│   ├── visuals/          # Visual specification documents
│   └── architecture/     # System architecture diagrams
├── prototype/            # HTML sandbox with interactive calculators
│   ├── index.html        # Landing page / dashboard
│   ├── css/              # Stylesheet framework
│   ├── js/               # Chart configs, calculators, navigation
│   ├── modules/          # Module HTML pages
│   └── assets/           # Screenshots, icons
├── src/                  # Future: production React application
├── tests/                # Test specifications
├── .github/
│   └── workflows/        # CI/CD pipelines
├── README.md
├── CONTRIBUTING.md
└── IMPLEMENTATION_PLAN.md
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines, branching strategy, and code review process.

---

## 📞 Support

For questions or issues, contact the ALM Platform team or open an issue in the GitHub repository.

---

*Built by Clawdy ⚡ for banking ALM professionals.*
