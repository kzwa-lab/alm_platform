# kimiALM — Comprehensive ALM System Analysis & Upgrade Blueprint

> **Purpose:** Explain how the Asset-Liability Management (ALM) subsystem works in the `CalibreUI-Upgrade` / `fmb-trade-web-app` codebase, extract its best ideas, and define an upgraded reference architecture (`kimiALM`) that preserves those ideas while fixing structural weaknesses.
>
> **Audience:** Business analysts, software engineers, ALCO sponsors, and architects building the next version of the ALM platform.
>
> **Scope:** Frontend (Angular 17), domain logic, data model, reports, and the new Duration Gap initiative. Backend/database detail is described where it surfaces through the Angular service layer and the `docs/durationGap` design package.

---

## 1. Executive Summary

The current ALM module is a **functionally rich, domain-heavy Angular application** that covers the full ALM lifecycle:

- **Data ingestion & reconciliation** — Trial balance + XTEL instrument feeds.
- **Instrument-level modeling** — Call/notice, loans, bonds, discount/T-bills, cashflow, property.
- **Projection engine** — 24-month cashflow/runoff engine with rate scenarios and behavioral strategies.
- **Consolidated reporting** — Balance sheet, income statement, cashflow statement, interest-rate sensitivity, liquidity gap, LCR, NSFR, FTP, bank-run stress, balance analysis, production targets.
- **New capability in flight** — A **Duration Gap / IRRBB** module is being designed under `docs/durationGap/` with a PostgreSQL schema, seed data, and a placeholder UI at `/tools/duration-gap`.

The system already contains many of the right **business concepts** for a modern ALM platform. Its biggest structural issue is that **too much analytical logic lives in the frontend** (`alm-report.service.ts` is ~2,300 lines of TypeScript), and several regulatory reports are still hard-coded JSON rather than live aggregations from the engine.

**The `kimiALM` upgrade thesis:** move the runoff/projection engine and aggregation logic to a server-side analytics service, unify the data model around the DGAP schema, keep the Angular UI as a thin, persona-driven reporting and workflow layer, and replace hard-coded reports with live, auditable calculations.

---

## 2. Project Context

| Item | Detail |
|------|--------|
| Repository | `C:/Users/Kuziwa/Documents/CalibreUI-Upgrade` |
| Project name | `fmb-trade-web-app` (Riskflow / CalibreUI) |
| Framework | Angular 17.3.6, TypeScript 5.4 |
| UI toolkit | Angular Material 17, AdminLTE-style theme, DevExtreme 23.2.15, Highcharts |
| State | No NgRx; RxJS `BehaviorSubject` + service caches |
| HTTP | Angular `HttpClient` with `FmbTradeService<T>` CRUD base class |
| Auth | JWT (`@auth0/angular-jwt`), RBAC actions/routes from backend |
| Build | Angular CLI, high-memory builds for production |

The app is organized as lazy-loaded feature modules under `src/app/pages`. ALM is a first-class module at `src/app/pages/alm`.

---

## 3. ALM Business Domain Overview

### 3.1 What ALM means here

ALM = **Asset-Liability Management** for a bank. The module helps Treasury/ALCO answer:

1. What does the balance sheet look like now and over the next 24 months?
2. How much interest income/expense will we earn/pay under different rate and business-growth assumptions?
3. Where are the liquidity gaps and maturity mismatches?
4. Are we compliant with regulatory liquidity metrics (LCR, NSFR)?
5. What is our interest-rate risk exposure (duration gap, ΔEVE, ΔNII)?

### 3.2 Key business entities

| Entity | Business meaning | File reference |
|--------|------------------|----------------|
| `AlmBase` / ALM Code | A uniquely modeled product bucket: e.g., `CALL7D`, `RSA186`, `LOANCAR`. Defines BS/IS/CF group, interest-rate type, HQLA flag, risk weight, calculation type, currency, TB category, IFS index. | `src/app/core/models/alm/almModels.ts`, `src/app/pages/alm/alm.service.ts` |
| `AlmTBMap` | Weighted mapping between ALM codes and trial-balance codes/categories. Enables GL reconciliation and aggregation. | `src/app/core/models/alm/almModels.ts` |
| `AlmRunoff` | Persisted projection result: JSON strings for runoff grid, strategies, rates, and attributes. | `src/app/core/models/alm/almModels.ts` |
| `Call_Att` / `Call_Deal` | Instrument attribute and contract-level data used by the projection engine. | `src/app/pages/alm/alm-report.service.ts` |
| `Statements` | Output container for balance sheet, income statement, and cashflow statement arrays. | `src/app/pages/alm/alm-report.service.ts` |
| `Time Bucket` | Configurable maturity bands for liquidity/balance-sheet gap reports. | `src/app/pages/alm/report-buckets/report-buckets.component.ts` |

### 3.3 Supported instrument calculation types

The engine supports nine calculation types:

1. **Call** — Call/notice deposits and loans.
2. **Loans** — Flat-rate and decreasing amortizing loans.
3. **Bond** — Fixed/floating bonds.
4. **Discount** — Treasury bills / discount instruments.
5. **Cashflow** — Generic cashflow products.
6. **Property** — Real-estate / property instruments.
7. **Term** — Term deposits/loans.
8. **Other** / **Shares** — Placeholder types.

---

## 4. Data Pipeline & Reconciliation

The ALM home screen (`alm/home`) orchestrates a clear data pipeline:

```
System Configuration (period, base date, report month)
        ↓
Currencies + TB Categories + ALM Bases
        ↓
Trial Balance (by ALM code, all currencies)
        ↓
XTEL Instrument Feeds (deposits, loans, borrowings, placements, discounts, bonds)
        ↓
TBintoALM() reconciliation
        ↓
Runoff engine + saved projections
        ↓
Reports (BS / IS / CF / sensitivity / liquidity / regulatory)
```

### 4.1 System configuration

`SystemConfigurationService.getUrl('GetActiveSystemConfuguration')` returns the active period, report month, and base date. The base date is the **valuation anchor** for all projections.

### 4.2 Trial balance import

`GlobalTrialBalanceService.postEndpoint('GetAlmCodeValues/All', {currencyId, periodId})` loads TB values aggregated by ALM code. The TB is then mapped to ALM bases via `AlmTBMap` weights and categories (`CAP`, `ACCINT`, `ADJ`, `DEP`, etc.).

### 4.3 XTEL instrument feeds

XTEL is the upstream core-banking/treasury extraction layer. The ALM module imports the following feeds via `ExportToAlmService`:

| Feed | Endpoint | Used for |
|------|----------|----------|
| Time Deposits | `api/ExportToAlms/TimeDeposits` | Term retail/corporate deposits |
| Term Deposits | `api/ExportToAlms/TermDeposits` | (commented out in home loader) |
| Non-Term Deposits | `api/ExportToAlms/NonTermDeposits` | Call/current/savings deposits |
| Placements | `api/ExportToAlms/Placements` | Interbank assets |
| Borrowings | `api/ExportToAlms/Borrowings` | Interbank liabilities |
| Overdrafts | `api/ExportToAlms/Overdrafts` | Revolving credit |
| Flat-Rate Loans | `api/ExportToAlms/FlateRateLoans` | Consumer/commercial loans |
| Decreasing Loans | `api/ExportToAlms/DecreasingLoans` | Amortizing loans |
| Non-Performing Loans | `api/ExportToAlms/NonPerformingLoans` | (commented out in home loader) |
| Discounts | `api/ExportToAlms/Discounts` | T-bills / discount paper |
| YTMs | `api/ExportToAlms/Ytms` | Bond yields-to-maturity |

### 4.4 Reconciliation logic

`AlmService.TBintoALM()` attaches `TBValues` to each `AlmBase`.
`AlmHomeComponent.btLoadData()` then performs a three-way reconciliation:

1. **Matched ALM** — ALM codes that exist in both TB and XTEL; shows `% difference`.
2. **Unmapped ALM** — ALM codes in the master with no TB position.
3. **Unmapped TB** — TB codes with no ALM master mapping.
4. **Unmapped XTEL** — XTEL instruments with no matched ALM code.

This is a **strong control-tower pattern** and should be preserved in `kimiALM`.

### 4.5 Tracker / checklist workflow

`AlmTrackerService` maintains a 5-step tracker/checklist:

- Step 3: Product-level validation (per instrument feed).
- Step 5: Link rates + run projections.

This lightweight workflow engine ensures data quality before reporting. It should be formalized into explicit run states in the upgrade.

---

## 5. The Runoff / Projection Engine

The engine is implemented in `src/app/pages/alm/alm-report.service.ts`. It is the heart of the current system and the most important asset to preserve.

### 5.1 Core classes

```typescript
class Call_Att {
  code: string;          // ALM code
  isAsset: boolean;      // asset or liability
  tbCategory: string;    // Asset / Liability / Equity
  basedate: Date;        // valuation date
  isMature: boolean;     // has explicit maturity date
  horison: number;       // usually 24 months
  rtype: string;         // 'fixed' | 'variable' | 'adjustable' | 'discretionary'
  frates: string;        // comma-separated forecast rates
  brate: number;         // day-count base: 365 / 364 / 360 / 1/12
  isCap: boolean;        // capitalize interest?
  every: number;         // interest rollover frequency (0,1,2,3,4,6,12 months)
  from: string;          // 'investment' | 'maturity'
  reprice: number;       // reprice interval in months
  stype: string;         // 'min' | 'new' | 'ext'
  svalues: string;       // comma-separated strategy targets
}

class Call_Deal {
  id: number;
  desc: string;
  capital: number;
  accint: number;        // accrued interest at base date
  rate: number;
  startdate: Date;
  matdate?: Date;
}

class RunoffX {
  id: number;
  type: string;          // 'current' | 'strategies'
  date: Date;
  rate: number;
  capital: number;
  accint: number;
  accdep: number;
  int: number;           // interest for period
  dep: number;           // depreciation
  pl: number;            // P&L
  intcap: number;        // capitalized interest
  capin: number;         // capital inflow
  capout: number;        // capital outflow
  intin: number;         // interest inflow
  intout: number;        // interest outflow
}
```

### 5.2 What the engine computes

For each deal the engine generates a dated cashflow/runoff array (`RunoffX[]`) that captures:

- **Balance-sheet items** — capital, accrued interest, accumulated depreciation.
- **Income-statement items** — interest income/expense, P&L, capitalized interest.
- **Cashflow-statement items** — capital/interest inflows and outflows.

Key capabilities:

| Capability | Implementation |
|------------|----------------|
| Day-count conventions | 365, 364, 360, 1/12 |
| Rate types | Fixed, variable, adjustable, discretionary |
| Repricing | `reprice` interval reloads forecast-rate array |
| Rollover frequency | `every` ∈ {0,1,2,3,4,6,12} months |
| Interest treatment | Capitalize or payout |
| Maturity handling | Exact maturity date vs open-ended horizon |
| Future-start deals | Generates first cashflow at future start date |

### 5.3 Strategy modeling

`stategiesX()` is the behavioral/new-business layer. It supports:

- **NewBusiness** — add a fixed target balance each month.
- **MinTarget** — if projected balance falls below target, generate a new deal to fill the gap.

If new business is needed, the engine creates a synthetic `Call_Deal` starting on the 15th of month `t+1` and maturing on the 15th of month `t+7`, priced from the rate forecast.

### 5.4 Statement aggregation

`toStatements(isAsset, run, stat)` rolls the monthly runoff into:

- **Income Statement** — interest income, interest expense, NII, non-interest income/expense, operating P&L, tax, accumulated P&L.
- **Cashflow Statement** — inflows, outflows, opening/closing balances.
- **Balance Sheet** — assets, liabilities, equity (from accumulated P&L), control account (from cashflow closing), and `A = L + E` reconciliation (`bs_AeLpE`).

This integrated three-statement logic is a **major strength** because it ensures internal consistency across BS, IS, and CF.

### 5.5 Consolidated reporting (`toReport_md`)

`toReport_md(reportType, list, seq, hasForecast, reportMonth)` produces consolidated reports by cross-joining saved runoffs with strategy and rate selections, then grouping by a user-defined sequence `seq`:

| Sequence code | Dimension |
|---------------|-----------|
| `PG` | Product Group |
| `BU` | Business Unit |
| `CU` | Currency |
| `BS` | Balance Sheet Group |
| `AM` | ALM Code |

`reportType`: 1 = Balance Sheet, 2 = Income Statement, 3 = Cashflow Statement.

This **drag-and-drop multi-dimensional reporting** is a powerful UX idea that should be retained.

---

## 6. ALM Screens & User Workflows

### 6.1 Home / control tower (`/alm/home`)

Loads all reference data, performs TB/XTEL reconciliation, displays matched/unmatched grids, shows tracker checklist, and lets users drill into an instrument modeling screen by ALM code + currency.

### 6.2 Instrument modeling screens

| Route | Component | Purpose |
|-------|-----------|---------|
| `/alm/call` | `AlmCallComponent` | Call/notice products |
| `/alm/loans` | `AlmLoanComponent` | Flat-rate & decreasing loans |
| `/alm/bond` | `AlmBondComponent` | Bonds |
| `/alm/discount` | `AlmDiscountComponent` | T-bills / discount |
| `/alm/cashflow` | `AlmCashflowComponent` | Generic cashflow + product-group strategy tree |
| `/alm/property` | `AlmPropertyComponent` | Property/real estate |

Common pattern:

1. Load system config, ALM bases, trial balance.
2. Select ALM code and currency from query params.
3. Load XTEL deals for that code/currency.
4. If no XTEL data, fall back to a TB-derived balancing deal.
5. Set attributes (`Call_Att`), strategies, and rate scenarios.
6. Run projection and save results (`RunoffService.postEndpoint('Runoffs', …)`).

### 6.3 Mapping & settings

| Route | Component | Purpose |
|-------|-----------|---------|
| `/alm/tbmap` | `AlmTbmapComponent` | Bulk upload ALM/TB mapping tables via Excel |
| `/alm/buckets` | `ReportBucketsComponent` | Configure time buckets for gap/BS reports |
| `/alm/settings` | `AlmSettingsComponent` | Placeholder for model settings |

### 6.4 Reports

| Route | Component | Output |
|-------|-----------|--------|
| `/alm/report` | `AlmReportComponent` | Consolidated Balance Sheet |
| `/alm/reportis` | `AlmReportISComponent` | Consolidated Income Statement |
| `/alm/reportcf` | `AlmReportCFComponent` | Consolidated Cashflow Statement |
| `/alm/reportiss` | `AlmReportISSComponent` | Interest-rate sensitivity / NII shock |
| `/alm/reportcapmat` | `AlmReportCapitalMaturityComponent` | T-bill capital/maturity analysis |
| `/alm/reportftp` | `AlmReportFTPComponent` | Funds-transfer pricing |
| `/alm/reportlcr` | `AlmReportLCRComponent` | Liquidity Coverage Ratio + charts |
| `/alm/reportnsfr` | `AlmReportNSFRComponent` | Net Stable Funding Ratio |
| `/alm/reportcfyield` | `AlmReportCFYieldComponent` | Bond cashflow/yield/fair value |
| `/alm/reportba` | `BalanceAnalysisComponent` | Historical balance/NIM/NIS trend analysis |
| `/alm/reportbankrun` | `BankrunComponent` | Bank-run liquidity stress calculator |
| `/alm/reportprodtarget` | `ProductionTargetComponent` | Production target balance sheet |

---

## 7. Reports Deep Dive

### 7.1 Consolidated BS / IS / CF (`AlmReportComponent`)

- Loads saved `Runoff` records for the period.
- Selects strategy × rate combination from dropdowns.
- Rebuilds `Statements` from the stored runoff JSON.
- Calls `toReport_md()` with the configured grouping sequence.
- Exports to Excel via `ExcelJS`.

**Best idea:** strategy × rate cross-join with draggable grouping dimensions.

### 7.2 Interest-rate sensitivity (`AlmReportISSComponent`)

- Applies parallel rate shocks to 12-month income from assets and liabilities.
- Asset shock factor: `+upRate × 0.90 / 10000`.
- Liability shock factor: `+upRate × 0.75 / 10000`.
- Down shocks use 0.92 (assets) and 0.80 (liabilities).
- Produces cumulative and monthly NII impact tables.

**Limitation:** Uses hard-coded `AlmData.getISSData()` base values, not live runoff output.

### 7.3 Liquidity gap (`LgrService`)

Returns hard-coded JSON with two sections:

- **BaU (Business as usual)** — behavioral view.
- **Contractual** — legal maturity view.

Buckets: Demand, 0–5 days, >5d–1m, >1–2m, >2–3m, >3–6m, >6–12m, >12m.
Computes: liabilities, assets, mismatch, surplus carried forward, net mismatch, liquidity coefficient, liquidity gap, secondary/statutory liquid assets.

**Best idea:** dual behavioral + contractual view is exactly what ALCO needs.

### 7.4 LCR (`LcrService`) / NSFR (`AlmReportNSFRComponent`)

Currently hard-coded JSON. Structurally correct sections:

- HQLA, expected cash outflows, net cash outflows, LCR ratio.
- Cashflow summary (demand + next 30 days).
- Cashflow details by product.
- Statutory requirements and haircuts.

### 7.5 Bank-run stress (`BankrunComponent`)

Simple but useful stress tool:

- Inputs: total deposits, liquid assets, daily outflow rate, number of days.
- Outputs per day: deposit outflow, remaining liquid assets, remaining deposits, liquidity ratio.

### 7.6 Balance analysis (`BalanceAnalysisComponent`)

Historical NIM/NIS trend with editable assumptions and Highcharts.

---

## 8. New Capability: Duration Gap / IRRBB

A new Duration Gap Analysis (DGAP) module is being designed. This is the most important upgrade vector.

### 8.1 Design documents

| File | Contents |
|------|----------|
| `docs/durationGap/PRD_Duration_Gap_Analysis.md` | Full PRD: goals, personas, functional/non-functional requirements, calculation spec, user flow, acceptance criteria |
| `docs/durationGap/Duration_Gap_Analysis_Executive_Summary.md` | Plain-language explanation for executives |
| `docs/durationGap/schema.sql` | PostgreSQL DDL for `yield_curve`, `instrument`, `assumption_set`, `scenario`, `run`, `run_result_*`, `risk_limit`, `audit_log` |
| `docs/durationGap/seed.sql` + CSVs/XLSX | Reference/seed data |

### 8.2 Target calculation model

| Metric | Formula |
|--------|---------|
| Macaulay duration | `Σ[t · CFₜ / (1+y)ᵗ] / Σ[CFₜ / (1+y)ᵗ]` |
| Modified duration | `D_mac / (1 + y/m)` |
| Portfolio duration | MV-weighted average |
| Leverage factor | `k = MV_L / MV_A` |
| Duration gap | `DGAP = D_A − k · D_L` |
| ΔEVE | `−DGAP · MV_A · (Δy / (1+y))` |
| Price sensitivity | `ΔP/P = −D_mod·Δy + ½·Convexity·Δy²` |

### 8.3 Behavioral assumptions in DGAP

- Non-maturity deposit (NMD) decay / effective-maturity profiles.
- Loan prepayment (CPR) assumptions.
- Rate-shock scenarios: parallel ±bps, steepener, flattener, custom curve.

### 8.4 Placeholder UI

`src/app/pages/tools/duration-gap/duration-gap.component.ts` defines persona-based tabs:

- **Back Office** — Gap Summary, Gap Profile, Comparative Analysis.
- **Risk Management** — Duration Analysis, Gap Limits, Sensitivity.
- **ALM** — Cumulative Gap, Earnings at Risk, Scenario Analysis.

The current UI uses dummy data. The backend schema and calculation spec are already designed.

---

## 9. Strengths of the Current System (Preserve in kimiALM)

1. **Integrated three-statement projection engine** — BS, IS, and CF are generated from the same runoff, ensuring consistency.
2. **Instrument-level detail** — Cashflows are generated per deal, not just balance-level.
3. **Strategy × rate cross-join** — Multiple strategies and rate scenarios can be combined and compared.
4. **Multi-dimensional drag-and-drop reporting** — Product group, business unit, currency, BS group, ALM code.
5. **TB/XTEL reconciliation control tower** — Explicit matched/unmatched reporting before modeling.
6. **Configurable time buckets** — Supports flexible maturity bands.
7. **Regulatory report taxonomy** — LCR, NSFR, liquidity gap, FTP, bank-run stress are all present.
8. **Tracker/checklist workflow** — Lightweight data-quality gate.
9. **Clear DGAP upgrade path** — Schema, PRD, and UI placeholder already exist.
10. **Strong export capability** — ExcelJS + file-saver is wired into reports.

---

## 10. Weaknesses & Technical Debt (Fix in kimiALM)

| Issue | Current state | Target state |
|-------|---------------|--------------|
| **Engine in frontend** | `alm-report.service.ts` is ~2,300 lines of TypeScript doing all projections. | Move to server-side analytics engine (Python/C# microservice or stored-procedure layer). |
| **Hard-coded reports** | LCR, NSFR, liquidity gap, executive summary, rate spread return static JSON. | Live aggregations from instrument cashflows and market data. |
| **No central scenario manager** | Rate shocks are scattered across ISS, duration-gap, and instrument screens. | Single scenario/assumption-set service with versioned curves. |
| **Limited behavioral modeling** | Only `min`/`new` strategies; no NMD decay or prepayment models. | Add NMD decay curves, CPR, early-redemption assumptions. |
| **Manual TB fallback** | If XTEL has no data, a TB balancing deal is inserted manually. | Automatic synthetic balancing deal with transparent assumption flag. |
| **No audit trail** | Runoffs are saved but not versioned; assumptions are not immutable. | Run states: Draft → Submitted → Approved → Archived; full audit log. |
| **Mixed API patterns** | Some services hit `api/…`, others hit `http://localhost:4345/api/…`. | Single gateway/base URL, environment-driven. |
| **State in services** | `AlmService` caches everything with boolean load flags. | Replace with normalized server-side state or query-on-demand. |
| **No limit monitoring** | DGAP PRD calls for limit breaches; current system has none. | Configurable risk limits with RAG status and alerts. |
| **Frontend bundle size** | ALM module is eagerly imported in `app.module.ts`. | Lazy-load ALM and DGAP modules exclusively. |

---

## 11. kimiALM — Upgraded Reference Architecture

### 11.1 High-level design principles

1. **Server-side analytics** — Cashflow generation, statement aggregation, duration, gap, and regulatory metrics run in a scalable compute service.
2. **Single source of truth** — Instrument static, positions, yield curves, FX rates, assumptions, and runs are stored in a relational/OLAP model aligned with `docs/durationGap/schema.sql`.
3. **Version everything** — Curves, assumption sets, runs, and mappings are versioned and immutable once approved.
4. **Persona-driven UI** — Thin Angular layer optimized for ALM Analyst, Treasury Dealer, ALCO Manager, Executive/Board, and Risk/Audit.
5. **Reproducibility** — Any historical run can be re-executed with identical inputs and outputs.
6. **Extensibility** — New instruments, reports, and regulatory metrics are configuration-driven.

### 11.2 Logical architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Angular 17 + DevExtreme UI               │
│  (control tower, instrument modeling, reports, workflows)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              ALM API Gateway / BFF (ASP.NET / Node)         │
│   Orchestration, auth, validation, file upload, caching     │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌─────────────────┐    ┌──────────────┐
│  Reference    │    │  Analytics      │    │  Workflow &  │
│  Data Service │    │  Engine         │    │  Audit       │
│  (masters,    │    │  (cashflow, BS/ │    │  (run states,│
│   curves,     │    │   IS/CF, gap,   │    │   approvals, │
│   assumptions)│    │   duration,     │    │   limits)    │
│               │    │   scenarios)    │    │              │
└───────────────┘    └─────────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL / SQL Server Data Store             │
│  instrument, cash_flow, yield_curve, assumption_set, run,   │
│  run_result_*, risk_limit, audit_log, alm_base, alm_tb_map  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         ETL / Data Ingestion (XTEL, GL, treasury systems)   │
└─────────────────────────────────────────────────────────────┘
```

### 11.3 Data model evolution

Start from the DGAP schema and extend it with current ALM concepts:

| Current concept | DGAP / upgraded table |
|-----------------|------------------------|
| `AlmBase` | `instrument` + `alm_base` reference dimension |
| `AlmTBMap` | `instrument_gl_mapping` |
| `AlmRunoff` | `run`, `run_result_instrument` |
| `Call_Att` / `Call_Deal` | `instrument` static + `cash_flow` derived |
| `Time Bucket` | `time_bucket_definition` |
| `LcrCat` | `liquidity_classification` |
| `IFS Index` | `yield_curve`, `index` |
| Strategy / Rate arrays | `assumption_set`, `scenario` |

Add a **Run** entity that captures:

- valuation date
- curve version
- assumption-set version
- status (Draft / Submitted / Approved / Archived)
- created_by, created_at
- GL reconciliation variance and override comment

### 11.4 Analytics engine responsibilities

Replace frontend `alm-report.service.ts` with a server-side engine that exposes:

| Endpoint | Responsibility |
|----------|----------------|
| `POST /runs` | Create a run, validate positions, reconcile to GL. |
| `POST /runs/{id}/execute` | Generate cash flows → durations → gap → scenarios. |
| `GET /runs/{id}/statements` | Return BS / IS / CF by strategy/rate/grouping. |
| `GET /runs/{id}/liquidity-gap` | Behavioral + contractual gap by time bucket. |
| `GET /runs/{id}/lcr` | Live LCR components and ratio. |
| `GET /runs/{id}/nsfr` | Live NSFR components and ratio. |
| `GET /runs/{id}/duration-gap` | DGAP metrics, ΔEVE, ΔNII, DV01. |
| `GET /runs/{id}/sensitivity` | Parallel/steepener/flattener/custom scenarios. |
| `GET /runs/{id}/bank-run` | Stress outflow simulation. |
| `GET /runs/{id}/limits` | Limit utilization and breach status. |

### 11.5 Angular UI evolution

| Current screen | Upgraded screen |
|----------------|-----------------|
| `alm/home` | **ALM Control Tower** — reconciliation, tracker, run launcher, limit RAG. |
| `alm/call`, `alm/loans`, etc. | **Instrument Workbench** — single screen with product-type tabs; attributes, deals, strategies, rates. |
| `alm/report*` | **Report Builder** — pick run, strategy, rate, grouping dimensions; live BS/IS/CF. |
| `alm/reportiss` | **Sensitivity Workbench** — live NII shocks from run results. |
| `alm/reportlcr`, `alm/reportnsfr` | **Regulatory Dashboard** — live LCR/NSFR with drill-down. |
| `/tools/duration-gap` | **IRRBB / DGAP Module** — integrated into ALM menu; persona tabs powered by real run data. |
| `alm/reportbankrun` | **Stress Testing Center** — bank-run, rate, liquidity, and custom scenarios. |

### 11.6 Scenario & assumption management

Create a single **Scenario Manager**:

- **Rate scenarios** — parallel ±100/200/300 bps, steepener, flattener, custom curve.
- **Behavioral assumptions** — NMD decay profiles, CPR, rollover rates.
- **Business strategies** — NewBusiness, MinTarget, Extension, Runoff.
- **Versions** — every assumption set is dated and versioned.
- **Approval** — assumption sets move through Draft → Review → Approved.

### 11.7 Limit monitoring & governance

| Feature | Implementation |
|---------|----------------|
| Configurable limits | `risk_limit` table: metric, scenario, threshold, direction. |
| Metrics | DGAP, ΔEVE % of Tier 1, ΔNII % of budget, LCR, NSFR, bucket gap. |
| RAG status | Green / Amber / Red with utilization %. |
| Breach workflow | Alert → override comment → ALCO approval. |
| Audit log | Every run, edit, approval, override logged to `audit_log`. |

---

## 12. Best Ideas to Carry Forward (kimiALM Feature Checklist)

### 12.1 From the current engine

- [ ] Per-deal cashflow projection with day-count, repricing, rollover, and maturity handling.
- [ ] Integrated BS/IS/CF generation from the same cashflow set.
- [ ] Strategy × rate cross-join for scenario comparison.
- [ ] Multi-dimensional report grouping (PG, BU, currency, BS group, ALM code).
- [ ] Automatic synthetic deal when XTEL has no position for an ALM code.
- [ ] Reconciliation control tower (matched/unmatched ALM/TB/XTEL).
- [ ] Configurable time buckets for gap and balance-sheet reports.
- [ ] Tracker/checklist workflow for data-quality gates.

### 12.2 From the DGAP PRD

- [ ] Macaulay / modified duration, convexity, DV01 per instrument.
- [ ] Leverage-adjusted duration gap.
- [ ] ΔEVE and ΔNII under rate shocks.
- [ ] NMD decay and prepayment behavioral assumptions.
- [ ] Yield-curve versioning.
- [ ] Run states and immutable approved runs.
- [ ] Audit trail.
- [ ] Persona-based views (dealer, ALCO, executive, audit).

### 12.3 New upgrade ideas

- [ ] **What-if hedging** — simulate adding/removing IRS, FRA, futures and see impact on DGAP/ΔEVE.
- [ ] **Repricing gap dashboard** — rate-sensitive assets vs liabilities by bucket.
- [ ] **FTP curve builder** — assign funds-transfer prices by tenor and product.
- [ ] **FX risk integration** — cross-currency gap and translation risk (post-v1).
- [ ] **Monte Carlo EaR** — stochastic rate paths for earnings-at-risk.
- [ ] **ALCO pack generator** — one-click PDF/PPTX of BS/IS/CF/gap/DGAP/limit status.
- [ ] **API-first design** — all reports available as REST/JSON for downstream systems.

---

## 13. Implementation Roadmap

### Phase 1 — Foundation (weeks 1–6)

1. Finalize unified data model merging current ALM entities with DGAP schema.
2. Build ingestion pipeline: GL/TB + XTEL feeds → `instrument` + `cash_flow` staging.
3. Implement GL reconciliation with variance tolerance and override workflow.
4. Migrate ALM base master, TB mapping, and time-bucket definitions to new model.

### Phase 2 — Analytics Engine (weeks 7–14)

1. Port `runoff()` logic from TypeScript to server-side engine (Python/C#).
2. Implement BS/IS/CF aggregation (`toStatements`, `toReport_md`).
3. Implement strategy × rate cross-join.
4. Build live liquidity gap, LCR, NSFR from cashflows.
5. Expose REST API for all reports.

### Phase 3 — IRRBB / DGAP (weeks 15–22)

1. Implement yield-curve management.
2. Implement duration, convexity, DGAP, ΔEVE, ΔNII calculations.
3. Add NMD decay and prepayment assumptions.
4. Integrate DGAP UI (`/tools/duration-gap`) with live API.
5. Add limit monitoring and RAG status.

### Phase 4 — UI Modernization & Governance (weeks 23–30)

1. Refactor Angular ALM module to thin reporting/workflow layer.
2. Ensure true lazy loading.
3. Add run states, approvals, audit log.
4. Add ALCO pack export (PDF/PPTX/Excel).
5. Performance test: 100k positions in <5 minutes.

### Phase 5 — Advanced Analytics (post-MVP)

1. What-if hedging.
2. Monte Carlo EaR.
3. FX risk integration.
4. Real-time intraday revaluation.

---

## 14. Key File Map

| File | Why it matters |
|------|----------------|
| `src/app/pages/alm/alm.service.ts` | Central data loader, TB/XTEL orchestration, default buckets. |
| `src/app/pages/alm/alm-report.service.ts` | Cashflow/runoff engine, statement aggregation, consolidated reporting. |
| `src/app/pages/alm/alm.data.ts` | Sample saved runoff data and ISS hard-coded inputs. |
| `src/app/pages/alm/grid.service.ts` | Report grid model (`Report`, `headerinfo`, `sectionsinfo`, `gridinfo`). |
| `src/app/pages/alm/home/alm-home.component.ts` | ALM control tower, reconciliation, tracker. |
| `src/app/pages/alm/call/alm-call.component.ts` | Instrument modeling workflow pattern. |
| `src/app/pages/alm/report/alm-report.component.ts` | Consolidated report builder. |
| `src/app/pages/alm/report-iss/alm-report-iss.component.ts` | Interest-rate sensitivity report. |
| `src/app/pages/alm/report-buckets/report-buckets.component.ts` | Time-bucket configuration. |
| `src/app/pages/alm/report-bankrun/bankrun.component.ts` | Bank-run stress calculator. |
| `src/app/pages/tools/duration-gap/duration-gap.component.ts` | DGAP placeholder UI. |
| `src/app/core/models/alm/almModels.ts` | Core ALM entity interfaces. |
| `src/app/core/services/alm/*.service.ts` | ALM HTTP wrappers and hard-coded report data. |
| `docs/durationGap/PRD_Duration_Gap_Analysis.md` | DGAP requirements and calculation spec. |
| `docs/durationGap/schema.sql` | DGAP PostgreSQL DDL. |

---

## 15. Conclusion

The current ALM system is not a prototype — it is a **production-grade, feature-rich ALM workbench** with the right business concepts, a working projection engine, and a clear regulatory reporting taxonomy. Its main limitation is architectural: too much intelligence is trapped in frontend TypeScript, and several reports have not yet been wired to live data.

**kimiALM** should treat the existing code as a detailed specification of *what* the business needs, then rebuild the *how* around:

- A server-side analytics engine.
- A unified, versioned data model.
- A workflow-driven, audit-friendly governance layer.
- A thinner, persona-driven Angular UI.

By doing so, the upgrade preserves the deep domain knowledge already encoded in the codebase while making the platform scalable, auditable, and ready for advanced IRRBB and stress-testing capabilities.

---

*Document generated for the CalibreUI-Upgrade ALM subsystem. Extract the best ideas, fix the architecture, build kimiALM.*
