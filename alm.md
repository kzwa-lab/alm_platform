# Asset Liability Management (ALM) Implementation

## Overview

This document describes the ALM (Asset Liability Management) system as implemented in the CalibreUI frontend application and TreasuryPlatform.Api.v02 backend.

## CalibreUI (Frontend) - `src/app/pages/alm/`

### Module Structure

The ALM module is located at `src/app/pages/alm/` and consists of:

| Component/File | Purpose |
|---------------|---------|
| `alm.module.ts` | Angular module defining ALM feature imports and declarations |
| `alm.routing.module.ts` | Routing configuration for ALM feature pages |
| `alm.service.ts` | Core service for ALM data management and calculations |
| `alm-report.service.ts` | Report generation service with Call_Att class for runoff calculations |
| `grid.service.ts` | Grid/column configuration for DevExtreme data grids |
| `home/alm-home.component.ts` | Main ALM dashboard with DxDataGrid displaying mapped ALM positions |
| `call/alm-call.component.ts` | Runoff calculation and projection interface |
| `report-*.component.ts` | Various regulatory reports (LCR, NSFR, FTP, etc.) |
| `tbmap/alm-tbmap.component.ts` | Time bucket mapping configuration |
| `settings/alm-settings.component.ts` | ALM system configuration |

### ALM Home Dashboard Features

**Data Sources Loaded:**
- System Configuration (period ID, enabled report month)
- Currencies and TB Categories
- ALM Bases (core ALM positions from database)
- Trial Balance data
- XTEL positions (Time Deposits, Term Deposits, Non-Term Deposits, Placements, Borrowings, Overdrafts, Flat Rate Loans, Non-Performing Loans, Decreasing Loans, Discounts, YTMS)
- Runoff data for cash flow projections

**UI Features:**
- DevExtreme DataGrid with editable ALM codes
- Row selection triggers detailed views via `eventRun()` method
- Loading step progress indicator (11 steps)
- Unmapped items tracking (ALM codes without TB, TB without ALM, unmapped XTEL)
- Percentage difference calculations between XTEL and Trial Balance
- Tracker checklist validation workflow

### Key Model Classes (alm.service.ts)

```typescript
class Alman {
  almanId: number;
  almanCode: string;           // ALM code like "CALL7D", "RSA186"
  productCategoryName: string; // Asset/Liability classification
  productTypeName: string;     // Bond, Call, Cashflow, etc.
  interestRateType: string;
  ifsCode: string;            // Interest rate index linkage
  hasrun: boolean;            // Runoff processing flag
}

class AlmBase {
  code: string;
  description: string;
  type: string;               // "Call" | "Term" | "Bonds" | etc.
  balanceSheetGroup: string;
  incomeStatementGroup: string;
  cashflowStatementGroup: string;
  isHighQualityLiquidAsset: boolean;
  hasrun: boolean;
  tbCapitalValue: number;     // Trial balance capital value
  xtelCapitalValue: number;   // XTEL capital value
  percentageDiff: number;     // XTEL vs TB variance
}

class AlmBasesService extends FmbTradeService {
  // Connects to /api/AlmBases
  // Methods: GET, POST, PUT for ALM base CRUD
}
```

### Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/alm/home` | AlmHomeComponent | Main ALM dashboard |
| `/alm/call` | AlmCallComponent | Runoff calculations |
| `/alm/tbmap` | AlmTbmapComponent | Time bucket mapping |
| `/alm/settings` | AlmSettingsComponent | System settings |
| `/alm/buckets` | ReportBucketsComponent | Bucket definitions |
| `/alm/reportlcr` | AlmReportLCRComponent | Liquidity Coverage Ratio report |
| `/alm/reportnsfr` | AlmReportNSFRComponent | Net Stable Funding Ratio report |
| `/alm/reportcf` | AlmReportCFComponent | Cash Flow report |
| `/alm/reportcfyield` | AlmReportCFYieldComponent | Cash Flow yield analysis |
| `/alm/reportcapmat` | AlmReportCapitalMaturityComponent | Capital maturity report |
| `/alm/reportftp` | AlmReportFTPComponent | Funds Transfer Pricing report |
| `/alm/reportba` | BalanceAnalysisComponent | Balance sheet analysis |

---

## TreasuryPlatform.Api.v02 (Backend) - `TreasuryPlatform/Controllers/V1/Alm/`

### API Controllers

#### 1. AlmController.cs (`api/Alm`)

**Core Endpoints:**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/Alm` | GetAlmCat | Returns all Alman records ordered by code |
| `GET /api/Alm/GetAssetCategories` | GetAssetCategories | Returns ALM base asset categories enum |
| `GET /api/Alm/GetAlmCat` | GetAlmCategories | Returns ALM TB categories |
| `GET /api/Alm/GetAlmTBCodes` | GetAlmTBCodes | Returns ALM TB codes |
| `GET /api/Alm/GetCalculationTypes` | GetCalculationTypes | Returns calculation type enums (Bond, Call, Cashflow, etc.) |
| `GET /api/Alm/GetCarRatioTiers` | GetCarRatioTiers | Returns capital adequacy ratio tiers |
| `GET /api/Alm/GetRunoffs` | GetRunoffs | Returns all runoff records |
| `GET /api/Alm/GetRunoffsByPeriod/{id}` | GetRunoffsByPeriod | Returns runoffs for specific period |
| `GET /api/Alm/GetMinRunoffsByPeriod/{id}` | GetMinRunoffsByPeriod | Returns minimal runoff data |
| `POST /api/Alm/Runoffs` | PostRunoffs | Create/update runoff data |
| `PUT /api/Alm/{id}/Attributes` | UpdateAttributes | Update ALM attributes |
| `PUT /api/Alm/{id}/Rates` | UpdateRates | Update rate projections |
| `PUT /api/Alm/{id}/Runoffs` | UpdateRunoffs | Update runoff projections |
| `PUT /api/Alm/{id}/Strategies` | UpdateStrategies | Update strategy parameters |

#### 2. AlmBasesController.cs (`api/AlmBases`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/AlmBases` | GetAlmBases | Returns all ALM base records |
| `POST /api/AlmBases` | Post | Create/update ALM base |
| `PUT /api/AlmBases` | UpdateAlmBase | Full update |
| `PUT /api/AlmBases/AlmFundSplit/{id}` | UpdateAlmFundSplit | Update fund split allocation |
| `PUT /api/AlmBases/ProductAtt/{id}` | UpdateProductAtt | Update product attributes |

#### 3. AlmCodesController.cs (`api/AlmCodes`)

Manages ALM code master data (codes like "CALL7D", "RSA186").

#### 4. AlmReportsController.cs (`api/AlmReports`)

| Endpoint | Description |
|----------|-------------|
| `POST /api/AlmReports/GetPreparedLiquidityGapReport` | Liquidity gap analysis |
| `GET /api/AlmReports/GetIncomeStatementSensitivityReport` | Income sensitivity report |
| `POST /api/AlmReports/GetPreparedCarReport` | Capital adequacy report |
| `POST /api/AlmReports/GetPreparedCashflowProjectionReport` | Cash flow projections |
| `POST /api/AlmReports/GetPreparedInterestRateGapReport` | Interest rate gap analysis |
| `POST /api/AlmReports/GetPreparedInterestRateSensitivityReport` | IR sensitivity analysis |
| `POST /api/AlmReports/GetPreparedLiquidityRiskReport` | Liquidity risk assessment |
| `POST /api/AlmReports/GetPreparedRateSpreadReport` | Rate spread analysis |

#### 5. ReportBucketsController.cs (`api/ReportBuckets`)

Time bucket configuration management for cash flow reporting periods.

### Export to ALM Services

#### ExportToAlmService.cs

Provides endpoints to extract XTEL (treasury) data into ALM format for migration/processing:

| Endpoint | Source Tables |
|----------|-------------|
| `GET /api/ExportToAlms/TimeDeposits/{id}` | Deposits + MapLiabilitiesDescription |
| `GET /api/ExportToAlms/TermDeposits/{id}` | Deposits (term) + MapLiabilitiesDescription |
| `GET /api/ExportToAlms/NonTermDeposits/{id}` | Deposits (non-term) + MapLiabilitiesDescription |
| `GET /api/ExportToAlms/TermLoans/{id}` | Loans (Performing) + MapAssetsDescription |
| `GET /api/ExportToAlms/DecreasingLoans/{id}` | Loans + MapAssetsDescription |
| `GET /api/ExportToAlms/FlateRateLoans/{id}` | Loans (Performing) + MapAssetsDescription |
| `GET /api/ExportToAlms/NonPerformingLoans/{id}` | Loans (Non-Performing) + MapAssetsDescription |
| `GET /api/ExportToAlms/Overdrafts/{id}` | Overdrafts + MapAssetsDescription |
| `GET /api/ExportToAlms/Borrowings/{id}` | Borrowings + MapLiabilitiesDescription |
| `GET /api/ExportToAlms/Placements/{id}` | Placements + MapAssetsDescription |
| `GET /api/ExportToAlms/Ytms/{id}` | YTMs data |
| `GET /api/ExportToAlms/Discounts/{id}` | Discounts + MapAssetsDescription |

### Data Model Integration

**Key Tables:**
- `Alman` - ALM code master data
- `AlmBase` - ALM positions with TB category mapping
- `AlmCode` - Code definitions
- `AlmTBCode` - Trial balance codes
- `AlmTBCategory` - Category definitions
- `AlmTBMap` - Mapping between ALM codes and TB categories
- `AssetLiability` - Asset/liability classifications
- `AssetLiabilityPortfolio` - Portfolio groupings

**Reference Tables:**
- `TbCategories` - Trial balance categories
- `Currency` - Currency definitions
- `SystemConfiguration` - Active month/country configuration

---

## API Connection Flow

### 1. ALM Dashboard Data Loading Sequence

```
Frontend (alm-home.component.ts)
  ↓ HTTP GET
/api/SystemConfigurations/GetActiveSystemConfuguration
  ↓ HTTP GET
/api/Currencies → CurrenciesList
  ↓ HTTP GET  
/api/TbCategories → TbCategories
  ↓ HTTP GET
/api/AlmBases → AlmBases[]
  ↓ HTTP POST
/api/TrialBalances/GetAlmCodeValues/All → TrailBalance
  ↓ Parallel HTTP GET
/api/ExportToAlms/TimeDeposits
/api/ExportToAlms/NonTermDeposits
/api/ExportToAlms/Placements
/api/ExportToAlms/Borrowings
/api/ExportToAlms/Overdrafts
/api/ExportToAlms/FlateRateLoans
/api/ExportToAlms/DecreasingLoans
/api/ExportToAlms/Discounts
/api/ExportToAlms/Ytms
  ↓ HTTP GET
/api/Alm/GetRunoffsByPeriod/{periodId} → RunOffData[]
```

### 2. Runoff Calculation Flow

```
Frontend (alm-call.component.ts)
  ↓ HTTP POST
/api/Alm/Rates - Update rate projections
  ↓ HTTP POST
/api/Alm/Runoffs - Create runoff projections
  ↓ HTTP POST
/api/Alm/Strategies - Update strategy parameters
  ↓ HTTP PUT
/api/Alm/{id}/Attributes - Update ALM attributes
```

### 3. Report Generation Flow

```
Frontend (report-*.component.ts)
  ↓ HTTP POST with GeneralReportQuery
/api/AlmReports/GetPreparedLiquidityGapReport
/api/AlmReports/GetPreparedCashflowProjectionReport
/api/AlmReports/GetPreparedInterestRateGapReport
/api/AlmReports/GetPreparedLiquidityRiskReport
/api/AlmReports/GetPreparedRateSpreadReport
```

---

## Regulatory Reports Implemented

### LCR (Liquidity Coverage Ratio)
- 30-day stress scenario liquidity assessment
- HQLA (High Quality Liquid Assets) categorization
- Cash flow inflows/outflows tracking
- Statutory assets vs secondary liquid assets

### NSFR (Net Stable Funding Ratio)
- Stable funding over 1-year horizon
- Required stable funding calculations
- Available stable funding tiers

### Cash Flow Report
- Time bucket breakdown (7 days, 14 days, 1 month, 3 months, 6 months, 12 months)
- Asset vs liability cash flow matching

### Balance Analysis
- Month-on-month comparisons
- Last 3 months trend analysis
- YTD analysis

### Capital Maturity
- Deal maturity scheduling
- Principal repayment scheduling
- Investment maturity tracking

---

## Key Technical Details

### Frontend Dependencies
- Angular 9 with DevExtreme components (DxDataGrid, DxChart, etc.)
- Highcharts for charting
- Handsontable for Excel-like grid interactions
- SweetAlert2 for notifications

### Backend Dependencies
- Entity Framework Core for database access
- AutoMapper for DTO mapping
- Syncfusion XlsIO for Excel processing
- Newtonsoft.Json for serialization

### Data Processing
- Currency-aware aggregations
- Weighted average rate calculations
- Maturity bucket grouping (by days/months)
- Percentage variance calculations between sources

The Xtel endpoints **are implemented** in `TreasuryPlatform.Api.v02`. They live under `TreasuryPlatform/Controllers/V1/Xtel/`, with business logic in `TreasuryPlatform.Services/Services/Xtel/` and background processing in `TreasuryPlatform.Daemon/Workers/`.

## High-level architecture

- **Route prefix:** `api/[controller]` (e.g., `GET api/ExportToAlms/TimeDeposits`)
- **DbContext:** `CalibreContext` (EF Core over SQL Server)
- **Reporting scope:** almost every endpoint reads the single `SystemConfiguration` row where `DbReportStatus == "Enabled"` and filters by `DbReportMonth` and `Country`.
- **Background import:** `POST` endpoints for Loans, Time Deposits, Non-Time Deposits, and Overdrafts do **not** write synchronously; they enqueue a `List<TDto>` into an in-memory `IBackgroundQueue<T>` and return immediately. Dedicated `BackgroundService` workers dequeue and process the batches.
- **Validation → exceptions:** invalid rows are written to the `ExceptionsFromImports` table instead of being rejected outright.
- **Bulk operations:** valid rows are inserted with `EFCore.BulkExtensions.BulkInsertAsync`.

---

## 1. System configuration

**Controller:** `SystemConfigurationsController`

| Endpoint | What it does |
|---|---|
| `GET /api/SystemConfigurations` | Lists every reporting-period configuration |
| `GET /api/SystemConfigurations/GetActiveSystemConfuguration` | Returns the currently enabled configuration |
| `GET /api/SystemConfigurations/{id}` | Returns one configuration by id |
| `POST /api/SystemConfigurations` | Creates a new configuration and marks it `Enabled`; disables the previous one; resets regulatory report output values; copies the last 12 months of currency-exchange data |
| `PUT /api/SystemConfigurations/{id}` | Updates a configuration; if status changes to `Enabled`, disables the old one and copies currency data |
| `DELETE /api/SystemConfigurations/{id}` | Deletes a configuration |

---

## 2. Bulk import endpoints

These receive large batched POSTs from the UI and queue them for background processing.

### Loans
**Controller:** `LoansController`  
**Background worker:** `LoansUploadBackgroundWorker` → `BulkUploadService.PostLoansAsync`

| Endpoint | What it does |
|---|---|
| `GET /api/Loans` | Returns up to 1,000 loans for the enabled month/country |
| `GET /api/Loans/CountRecordsInTheLoansTable` | Returns `{ totalRecords, totalBalance, totalAccruedInterest, totalProvision }` rounded to nearest 10 |
| `POST /api/Loans` | Deletes existing loans for the enabled month, clears `ExceptionsFromImports` for “Loans”, enqueues the batch |
| `POST /api/Loans/ProcessLoans` | Calls `ILoanUploadService.GetLoansAsync(baseDate)` |
| `PUT /api/Loans/{AccNumber}` | Updates `AccruedInterest` of one loan |
| `DELETE /api/Loans/{AccNumber}` | Deletes one loan |
| `DELETE /api/Loans/DeleteAllLoans` | Deletes all loans for the enabled month/country |
| `GET /api/Loans/GetLoansDataCsv` | Generates and returns `LoansData.csv`; file is auto-deleted after 10 minutes |

`BulkUploadService.PostLoansAsync` validates each row with `LoansValidator`, rejects duplicates (within the batch and against the DB), checks the product code against `MapAssetsDescription`, then:
- sets `DbReportMonth`, `Country`, `ExtractDate` (last day of month)
- calculates `RemainingMonths` from maturity vs extract date
- classifies `EnrichClass` / `EnrichSubClass` via `EnrichData.MybucksClassification`
- bulk-inserts valid loans and logs exceptions.

`BulkUploadService.GetLoansAsync` connects via ODBC to `172.30.100.168\BIDATAWAREHOUSE` and calls stored proc `DW_BI_Reports.alm.spALM_LOAN '{yyyymmdd}'`, then enqueues the result.

### Time deposits
**Controller:** `TimeDepositsController`  
**Background worker:** `TimeDepositsUploadBackgroundWorker` → `TimeDepositUploadService.PostTimeDepositsAsync`

| Endpoint | What it does |
|---|---|
| `GET /api/TimeDeposits` | Returns time deposits (`IsNonTimeDeposit == false`) for the enabled month |
| `GET /api/TimeDeposits/CountTimeInTheDepositsTable` | Returns `{ totalRecords, totalBalance, totalAccruedInterest }` |
| `POST /api/TimeDeposits` | Deletes existing time deposits, clears exceptions, enqueues the batch |
| `POST /api/TimeDeposits/ProcessTimeDeposits` | Calls `ITimeDepositUploadService.GetTimeDepositsAsync(baseDate)` |
| `PUT /api/TimeDeposits/{AccNumber}` | Updates `AccruedInterest` and `Branch` |
| `DELETE /api/TimeDeposits/{AccNumber}` | Deletes one time deposit |
| `DELETE /api/TimeDeposits/DeleteAllTimeDeposits` | Deletes all time deposits for the enabled month/country |

`TimeDepositUploadService` validates against `MapLiabilitiesDescription`, rejects duplicates, calculates `Term` as days to maturity, and bulk-inserts. It also has `GetTimeDepositsAsync` which calls `spALM_TIME_DEPOSITS` on the BI data warehouse.

### Non-time deposits
**Controller:** `NonTimeDepositsController`  
**Background worker:** `NonTimeDepositsUploadBackgroundWorker` → `NonTimeDepositUploadService.PostNonTimeDepositsAsync`

| Endpoint | What it does |
|---|---|
| `GET /api/NonTimeDeposits` | Returns non-time deposits (`IsNonTimeDeposit == true`) |
| `GET /api/NonTimeDeposits/CountNoneTimeInTheDepositsTable` | Returns totals |
| `POST /api/NonTimeDeposits` | Deletes existing non-time deposits, clears exceptions, enqueues |
| `POST /api/NonTimeDeposits/ProcessNonTimeDeposits` | Calls warehouse stored proc `spALM_NON_TIME_DEPOSITS` |
| `PUT /api/NonTimeDeposits/{AccNumber}` | Updates one record |
| `DELETE /api/NonTimeDeposits/{AccNumber}` | Deletes one |
| `DELETE /api/NonTimeDeposits/DeleteAllNonTimeDeposits` | Deletes all for the month/country |

### Deposits (combined view)
**Controller:** `DepositsController`

| Endpoint | What it does |
|---|---|
| `GET /api/Deposits` | Returns first 100 deposit records (both time and non-time) for the enabled month |
| `GET /api/Deposits/GetDepositsDataCsv` | Downloads `DepositsData.csv` |
| `GET /api/Deposits/CountRecordsInTheDepositsTable` | Returns count |
| `POST /api/Deposits/DeleteDeposits` | Deletes all deposits for the enabled month |
| `DELETE /api/Deposits/{id}` | Deletes one deposit by id |

### Borrowings
**Controller:** `BorrowingsController`

| Endpoint | What it does |
|---|---|
| `GET /api/Borrowings` | Lists borrowings for the enabled month |
| `POST /api/Borrowings` | Synchronously posts borrowings via `IBorrowingUploadService.PostBorrowingsAsync` |
| `POST /api/Borrowings/ProcessBorrowings` | Calls warehouse extraction |
| `POST /api/Borrowings/ExtractFromDeals` | Extracts borrowings from TreasuryPlatform deals via `IDealExtractionService` |
| `PUT /api/Borrowings/{AccNumber}` | Updates `AccruedInterest` |
| `DELETE /api/Borrowings/{AccNumber}` | Deletes one |
| `POST /api/Borrowings/DeleteBorrowings` | Deletes all for the enabled month |

### Placements
**Controller:** `PlacementsController`

| Endpoint | What it does |
|---|---|
| `GET /api/Placements` | Lists placements for the enabled month |
| `GET /api/Placements/CountPlacementsTable` | Returns count |
| `POST /api/Placements` | Synchronously posts placements |
| `POST /api/Placements/ProcessPlacements` | Warehouse extraction |
| `POST /api/Placements/ExtractFromDeals` | Extracts placements from deals |
| `PUT /api/Placements/{AccNumber}` | Updates `AccruedInterest` |
| `DELETE /api/Placements/{AccNumber}` | Deletes one |
| `POST /api/Placements/DeletePlacements` | Deletes all for the enabled month |

### Overdrafts
**Controller:** `OverdraftsController`  
**Background worker:** `OverdraftUploadBackgroundWorker`

| Endpoint | What it does |
|---|---|
| `GET /api/Overdrafts` | Lists overdrafts for the enabled month |
| `GET /api/Overdrafts/CountOverdraftsTable` | Returns count |
| `POST /api/Overdrafts` | Enqueues overdraft batch |
| `POST /api/Overdrafts/ProcessOverdrafts` | Warehouse extraction |
| `PUT /api/Overdrafts/{AccNumber}` | Updates `AccruedInterest` |
| `DELETE /api/Overdrafts/{AccNumber}` | Deletes one |
| `POST /api/Overdrafts/DeleteAll` | Deletes all for the enabled month |

### Discounts and YTMs (bonds/T-bills)
These are populated from TreasuryPlatform deals rather than CSV upload.

**DiscountsController**
- `GET /api/Discounts` – list T-bill records
- `GET /api/Discounts/CountDiscountsTable`
- `POST /api/Discounts/ExtractFromDeals` – extracts T-bills from deals
- `POST /api/Discounts/DeleteDiscounts`
- `DELETE /api/Discounts/{AccNumber}`

**YtmController**
- `GET /api/Ytm` – list bond/YTM records
- `GET /api/Ytm/CountYtmTable`
- `POST /api/Ytm/ExtractFromDeals` – extracts bonds from deals
- `POST /api/Ytm/DeleteYtm`
- `DELETE /api/Ytm/{AccNumber}`

---

## 3. Export to ALM

**Controller:** `ExportToAlmsController`  
**Service:** `ExportToAlmService`

Each endpoint takes an `int id` parameter but the implementation ignores it and uses the enabled `SystemConfiguration`.

| Endpoint | What it does |
|---|---|
| `GET /api/ExportToAlms/TimeDeposits` | Groups time deposits by `AlmCode.Code` + currency, computes weighted rate and a `breakdown` by maturity; returns `TimeDepositsForAlm` rows |
| `GET /api/ExportToAlms/TermDeposits` | Groups time deposits by `AlmCode.Code` + currency and breaks down by `Term` |
| `GET /api/ExportToAlms/NonTermDeposits` | Groups non-time deposits by `AlmCode.Code` + currency, breaks down by term/currency |
| `GET /api/ExportToAlms/TermLoans` | Term loans (`MapAssetsType.AdvanceCategory == "Term Loans"` and `EnrichClass == "Performing"`), grouped by AlmCode/currency, capital multiplied by -1 |
| `GET /api/ExportToAlms/DecreasingLoans` | Decreasing loans, broken down by maturity |
| `GET /api/ExportToAlms/FlateRateLoans` | Flat-rate loans |
| `GET /api/ExportToAlms/NonPerformingLoans` | Non-performing loans (`EnrichClass == "Non-Performing"`) |
| `GET /api/ExportToAlms/Borrowings` | Borrowings grouped by AlmCode/currency, broken down by `BorrowingMaturity` |
| `GET /api/ExportToAlms/Placements` | Placements grouped by AlmCode/currency, broken down by maturity |
| `GET /api/ExportToAlms/Overdrafts` | Overdrafts grouped by AlmCode, broken down by subclass/currency |
| `GET /api/ExportToAlms/Ytms` | Bonds grouped by AlmCode/currency, broken down by maturity |
| `GET /api/ExportToAlms/Discounts` | T-bills grouped by AlmCode/currency, broken down by maturity |

All aggregations join imported data to `MapAssetsDescription` / `MapLiabilitiesDescription`, require an `AlmCode` mapping, and compute weighted average rates.

---

## 4. Exceptions from imports

**Controller:** `ExceptionsFromImportsController`  
**Service:** `ExceptionsFromImportsService`

| Endpoint | What it does |
|---|---|
| `GET /api/ExceptionsFromImports` | Lists exceptions for the enabled month |
| `GET /api/ExceptionsFromImports/{id}` | Returns one exception |
| `POST /api/ExceptionsFromImports` | Creates an exception |
| `PUT /api/ExceptionsFromImports/{id}` | Updates an exception |
| `DELETE /api/ExceptionsFromImports/Book/{book}` | Deletes exceptions by `BookId` and enabled month (`book = "All"` deletes all for the month) |
| `DELETE /api/ExceptionsFromImports/{id}` | Deletes one |

---

## 5. Regulatory reports

**Controllers:** `RegulatoryReportsController`, `PopulateRegulatoryReportTableController`, `DownloadRegulatoryReportController`

| Endpoint | What it does |
|---|---|
| `GET /api/RegulatoryReports` | Returns rows where `OutputValue > 0` and `Country == enabled country` |
| `POST /api/RegulatoryReports` | Bulk-creates regulatory report rows |
| `PUT /api/RegulatoryReports/{id}` | Updates a row |
| `DELETE /api/RegulatoryReports/{id}` | Deletes a row |
| `PATCH /api/PopulateRegulatoryReportTable` | **Regenerates** all regulatory reports: resets `OutputValue`, checks for a finalized trial balance, updates `RegulatoryReports` from `TbRegulatoryReportMap`, computes Tier 1 capital, then runs Capital, MKT, CR03, Deposit Liability templates and writes to the report table |
| `GET /api/DownloadRegulatoryReport` | Returns the pre-built Basel Excel template `BaselTemplate-{DbReportMonth}.xlsx` as `BaselRep-{DbReportMonth}.xlsx` |

---

## 6. Business-setup mapping controllers

Standard CRUD for Xtel reference data used during import and ALM export:

- `AgeingRiskcatsController`
- `AlmanController`
- `AssetLiabilitiesController`
- `AssetLiabilityPortfoliosController`
- `CreditRiskCategoriesController`
- `CurrencyExchangesController`
- `IndustrySectorsController`
- `InstitutionsController`
- `MapAssetsDescriptionController`, `MapAssetsGroupController`, `MapAssetsTypesController`
- `MapLiabilitiesDescriptionsController`, `MapLiabilitiesGroupsController`, `MapLiabilitiesTypesController`
- `Sector13Controller`

Each provides `GET`, `GET/{id}`, `POST`, `PUT/{id}`, `DELETE/{id}` for its respective entity.

---

## 7. Deposit adjustments

**Controller:** `DepositsAdjustmentController` — handles manual adjustments to imported deposit records.

---

## Notable gaps / quirks

- **Enrich endpoint:** the UI calls `PATCH /api/Enrich`, but the only `EnrichController` is in `TreasuryPlatform.Xtel/BusinessLogic/UnusedCode/`, so it may not be wired up in this API version. Loan enrichment actually happens automatically inside `BulkUploadService.EnrichLoan` during import.
- **Route mismatches:** some UI paths expect `POST /api/Deposits/DeleteTimeDeposits` and `POST /api/Loans/DeleteLoans`, but the active controllers expose `DELETE /api/TimeDeposits/DeleteAllTimeDeposits` and `DELETE /api/Loans/DeleteAllLoans`.
- **Hardcoded warehouse connection:** `TimeDepositUploadService`, `NonTimeDepositUploadService`, and `BulkUploadService` contain a hardcoded ODBC connection string to `172.30.100.168\BIDATAWAREHOUSE` for the `spALM_*` stored procedures.
- **Authorization:** most Xtel controllers use `[Authorize]`; `RegulatoryReportsController` has it commented out.


# XTEL Feature Description

## Overview
XTEL (likely standing for eXchange Treasury and Electronic Ledger or similar treasury management terminology) is a comprehensive treasury management module within the CalibreUI application. It provides functionality for managing financial instruments, currency exchanges, asset-liability management, and regulatory reporting.

## Module Structure

### Main Components
The XTEL module is organized into several feature areas accessible from the dashboard:

1. **Business Setup** - Configuration of business parameters, entities, currencies, and institutional settings
2. **Import Data** - Functionality for importing financial data from external sources
3. **Export to ALM** - Exporting data to Asset Liability Management systems
4. **Adjustments** - Making corrections and adjustments to financial data
5. **Regulatory Reports** - Generating reports for compliance with financial regulations
6. **Exceptions From Imports** - Handling and resolving data import errors

### Routing Structure
The module uses Angular routing with the following path structure:
- `/xtel` - Dashboard (landing page)
- `/xtel/business-setup` - Business configuration module
- `/xtel/import` - Data import functionality
- `/xtel/export-to-alm` - ALM export capabilities
- `/xtel/adjustments` - Data adjustment tools
- `/xtel/regulatory-reports` - Regulatory reporting interface
- `/xtel/exceptions-from-imports` - Import error handling

## Technical Implementation

### Frontend Implementation (CalibreUI)
- **Module**: `XtelModule` in `src/app/pages/xtel/xtel.module.ts`
- **Routing**: Defined in `XtelRoutingModule` (`xtel-routing.module.ts`)
- **Shared Components**: 
  - `XtelDashboardComponent` - Main dashboard view
  - Common UI components using Angular Material and custom styling
  - Data tables using Handsontable for Excel-like grid functionality
  - Form controls with custom validation
  - Notification and messaging systems

### Backend Communication
The XTEL module communicates with the fmbTrade.WebAPI backend through RESTful services:

- **Base API URL**: Configured in `src/environments/environment.ts` as:
  ```
  apiUrl: 'http://102.214.10.48:85/web-service/' //CBG
  ```

- **Service Layer**: 
  - Generic `XtelService<T>` class in `src/app/core/services/xtel.service.ts` provides CRUD operations
  - Specific services extend or use this base service for entity-specific operations (e.g., `CounterpartiesService`, `SystemConfigurationService`)
  - Services handle HTTP requests to endpoints like:
    - `/api/Counterparties`
    - `/api/SystemConfiguration`
    - `/api/XtelCurrencyExchange`
    - And other entity-specific endpoints

### Data Models
The module includes TypeScript models representing financial entities:
- `XtelCurrencyExchange` - For currency exchange rate management
- Various mapping entities (MapAsset, MapAssetGroup, etc.) for asset-liability management
- Risk-related entities (CreditRiskCategory, IndustrySector, Institution)
- Configuration entities (AlmanCode, Sector references)

### Key Features
1. **Data Grid Functionality**: Uses Handsontable for Excel-like data manipulation with features like:
   - In-cell editing
   - Copy/paste functionality
   - Column sorting and filtering
   - Data validation
   - Export capabilities

2. **Form Management**: 
   - Reactive forms with validation
   - Dynamic form generation based on metadata
   - Master-detail relationship handling

3. **Reporting**:
   - Configurable report templates
   - Export to multiple formats (Excel, PDF)
   - Scheduled report generation

4. **Integration**:
   - Bi-directional data synchronization with external systems
   - API-based data exchange
   - Error handling and retry mechanisms

## Business Domain Context
XTEL appears to be designed for treasury and risk management in financial institutions, providing capabilities for:
- Managing financial instruments and portfolios
- Tracking foreign exchange positions and rates
- Monitoring asset-liability mismatches
- Ensuring regulatory compliance (Basel III, IFRS9, etc.)
- Supporting liquidity risk management
- Facilitating internal and external reporting requirements

The module integrates with the broader FmbTrade system, likely serving as a specialized treasury management interface that leverages the core financial data management capabilities of the backend system while providing specialized treasury workflows and analytics.