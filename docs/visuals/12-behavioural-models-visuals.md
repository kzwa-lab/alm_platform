# ALM Platform — Behavioural Models Visual Specification

**Version:** 1.0
**Last Updated:** 2026-06-25
**Screen:** Behavioural Models Dashboard
**Context:** Bank of Ghana 2026 behavioural model management for IRRBB and liquidity risk. Covers non-maturity deposit (NMD) models, conditional prepayment rate (CPR), termination and deposit repricing rate (TDRR), model inventory, backtesting, and Ghana Reference Rate (GRR) sensitivity. Designed for model risk management, ALCO, and BoG regulatory compliance.

---

## 1. Dashboard Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Navigation + Context Switcher (Entity: Ecobank Ghana PLC | Date: 30 Jun 2026 | GRR: 25.50%)│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  NMD MODEL DASHBOARD                       │  │  CPR/TDRR MODEL PANEL                │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  MODEL INVENTORY TABLE — All Behavioural Models                                     │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  MODEL PERFORMANCE BACKTESTING               │  │  GRR SENSITIVITY PANEL               │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Grid:** 12 columns, 24px gutter, 32px margin
**Background:** `#F8FAFC` (light) / `#0F172A` (dark)

---

## 2. NMD Model Dashboard

### 2.1 Component Specification

**Purpose:** Visualise non-maturity deposit behavioural analysis showing core, semi-volatile, and volatile allocations across behavioural tenors. Critical for FTP, liquidity risk, and IRRBB under BoG 19-bucket framework.

**Chart Type:** Stacked Area Chart + Stability Metrics
**Library Recommendation:** ECharts
**Dimensions:** 6 columns × 480px height
**Position:** Top row, left

```
┌────────────────────────────────────────────────────────────────────┐
│ NMD Model Dashboard — Deposit Stability Analysis        [Product ▾]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ₵B                                                                  │
│  120 ┤    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  100 ┤    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│   80 ┤    ████████████████████████████████████████████████████████  │
│   60 ┤                                                              │
│   40 ┤                                                              │
│   20 ┤                                                              │
│    0 ┼────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬──  │
│       O/N  1M   3M   6M   1Y   2Y   3Y   5Y   7Y   10Y  15Y  20Y   │
│                                                                    │
│  Core (stable): ₵72.4B  (60%)  🟢                                   │
│  Semi-volatile: ₵32.1B  (27%)  🟡                                   │
│  Volatile: ₵15.5B  (13%)  🟢                                       │
│  Total NMD: ₵120.0B                                                │
│                                                                    │
│  ───────────────────────────────────────────────────────────────── │
│  Amenable: ₵85.2B (71%)  •  Less Amenable: ₵28.5B (24%)             │
│  Not Amenable: ₵6.3B (5%)  •  GRR Beta: 0.42                     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Legend Label |
|--------|-------|--------------|
| Core (Stable) | `#10B981` | Core (>3Y behavioural) |
| Semi-Volatile | `#3B82F6` | Semi-Volatile (1Y-3Y) |
| Volatile | `#F59E0B` | Volatile (<1Y) |

**Axes:**
- **X-axis:** Behavioural tenors — O/N, 1M, 3M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 15Y, 20Y
- **Y-axis:** GHS Billions, min: 0, max: 120

**Demo Data (cumulative NMD allocation, ₵B):**
| Tenor | Core | Semi-Volatile | Volatile | Total |
|-------|------|---------------|----------|-------|
| O/N | 0.0 | 0.0 | 15.5 | 15.5 |
| 1M | 0.0 | 5.2 | 18.3 | 23.5 |
| 3M | 8.5 | 12.4 | 22.1 | 43.0 |
| 6M | 18.2 | 18.5 | 24.8 | 61.5 |
| 1Y | 32.4 | 22.1 | 26.5 | 81.0 |
| 2Y | 48.5 | 25.8 | 28.2 | 102.5 |
| 3Y | 58.2 | 28.4 | 29.5 | 116.1 |
| 5Y | 72.4 | 32.1 | 15.5 | 120.0 |
| 7Y | 72.4 | 32.1 | 15.5 | 120.0 |
| 10Y | 72.4 | 32.1 | 15.5 | 120.0 |
| 15Y | 72.4 | 32.1 | 15.5 | 120.0 |
| 20Y | 72.4 | 32.1 | 15.5 | 120.0 |

**Amenable Classification (BoG 19-bucket):**
| Classification | Amount (₵B) | Percentage | Description |
|---------------|-------------|------------|-------------|
| Amenable | 85.2 | 71% | Core deposits with stable behavioural maturity |
| Less Amenable | 28.5 | 24% | Semi-volatile deposits with moderate stability |
| Not Amenable | 6.3 | 5% | Volatile deposits with no stable behavioural pattern |

**Interactions:**
- **Hover area:** Tooltip shows amount and % for each stability category
- **Click area:** Drill down to account-level NMD data with customer segmentation
- **Product filter:** Switch between retail, corporate, SME, total NMD
- **Toggle:** Show/hide amenable classification overlay

**Responsive Behavior:**
- Mobile: Full width, stacked vertically
- Tablet+: Side-by-side with legend

---

## 3. CPR/TDRR Model Panel

### 3.1 Component Specification

**Purpose:** Display conditional prepayment rate (CPR) and termination/deposit repricing rate (TDRR) models. Critical for mortgage portfolio management and deposit pricing strategy.

**Chart Type:** Multi-line Chart with Rate Curves
**Library Recommendation:** ECharts
**Dimensions:** 6 columns × 480px height
**Position:** Top row, right

```
┌────────────────────────────────────────────────────────────────────┐
│ CPR / TDRR Model Panel                                  [Model ▾]  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Rate (%)                                                          │
│  25 ┤                                                              │
│  20 ┤    ●────●────●────●────●────●────●────●                     │
│  15 ┤   ╱ CPR (Current)                                            │
│  10 ┤  ●  TDRR (Current)                                           │
│   5 ┤ ╱   CPR (GRR +200bps)                                        │
│   0 ┼────┬────┬────┬────┬────┬────┬────┬────┬────                │
│       1M   3M   6M   1Y   2Y   3Y   5Y   7Y   10Y                 │
│                                                                    │
│  ─ CPR Current: 18.5% (avg)                                        │
│  ─ TDRR Current: 12.3% (avg)                                         │
│  ─ CPR Stress (+200bps): 22.8% (avg)                                 │
│                                                                    │
│  Model Fit: R² = 0.87  •  RMSE = 1.2%  •  Last Calibrated: May 2026│
│                                                                    │
│  [View Model Details]  [Run Backtest]  [Recalibrate]                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Line Style | Legend Label |
|--------|-------|------------|--------------|
| CPR Current | `#3B82F6` | Solid, 3px | CPR (Current) |
| TDRR Current | `#10B981` | Solid, 2px | TDRR (Current) |
| CPR Stress (+200bps) | `#F43F5E` | Dashed | CPR (GRR +200bps) |
| TDRR Stress (+200bps) | `#F59E0B` | Dashed | TDRR (GRR +200bps) |

**Axes:**
- **X-axis:** Tenors — 1M, 3M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y
- **Y-axis:** Rate (%), min: 0, max: 25, tick format: "{value}%"

**Demo Data (CPR/TDRR by tenor, %):**
| Tenor | CPR Current | TDRR Current | CPR Stress | TDRR Stress |
|-------|-------------|--------------|------------|-------------|
| 1M | 8.5 | 5.2 | 10.2 | 6.8 |
| 3M | 12.4 | 8.5 | 15.8 | 10.5 |
| 6M | 15.2 | 10.8 | 18.5 | 13.2 |
| 1Y | 18.5 | 12.3 | 22.8 | 15.5 |
| 2Y | 16.8 | 11.5 | 20.5 | 14.2 |
| 3Y | 14.2 | 10.2 | 18.2 | 12.8 |
| 5Y | 12.5 | 9.5 | 16.5 | 11.5 |
| 7Y | 10.8 | 8.2 | 14.2 | 10.2 |
| 10Y | 9.5 | 7.5 | 12.8 | 9.2 |

**Model Performance Metrics:**
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| R² | 0.87 | ≥ 0.80 | 🟢 |
| RMSE | 1.2% | ≤ 2.0% | 🟢 |
| MAE | 0.9% | ≤ 1.5% | 🟢 |
| Last Calibrated | May 2026 | < 6 months | 🟢 |
| Backtest Coverage | 92% | ≥ 90% | 🟢 |

**Interactions:**
- **Hover line:** Tooltip shows exact rate for all scenarios at that tenor
- **Click point:** Shows historical time series for that tenor
- **Click "View Model Details":** Opens model specification panel with parameters and assumptions
- **Click "Run Backtest":** Triggers backtest against historical data
- **Click "Recalibrate":** Opens recalibration workflow with approval

**Responsive Behavior:**
- Mobile: Single model view with toggle
- Tablet+: All models visible

---

## 4. Model Inventory Table

### 4.1 Component Specification

**Purpose:** Comprehensive inventory of all behavioural models with version control, ownership, validation status, and regulatory approval. Central reference for model risk governance.

**Component Type:** Data Table with Status Badges
**Dimensions:** 12 columns (full width) × 420px height
**Position:** Second row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Model Inventory                                       [+ Register Model] [Filter] [Export] │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  Model Name          Type        Version  Owner      Validated    Status    Next Review   │
│  ──────────────────────────────────────────────────────────────────────────────────────────│
│  NMD Retail          NMD         v2.3     M. Boateng  15 May 2026 🟢 Active  15 Nov 2026 │
│  NMD Corporate       NMD         v1.8     M. Boateng  20 Apr 2026 🟢 Active  20 Oct 2026 │
│  CPR Mortgage        CPR         v3.1     P. Owusu   10 Jun 2026 🟢 Active  10 Dec 2026 │
│  TDRR Deposit        TDRR        v2.5     P. Owusu   10 Jun 2026 🟢 Active  10 Dec 2026 │
│  NMD SME             NMD         v1.2     M. Boateng  15 Jan 2026 🟡 Review   15 Jul 2026  │
│  CPR Corporate       CPR         v1.5     P. Owusu   20 Feb 2026 🟡 Review   20 Aug 2026  │
│  NMD Historical      NMD         v1.0     M. Boateng  10 Dec 2025 ⚪ Retired  —            │
│  ──────────────────────────────────────────────────────────────────────────────────────────│
│                                                                                            │
│  Total: 7 models  •  🟢 Active: 4  •  🟡 Under Review: 2  •  ⚪ Retired: 1               │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Table Styling:**
```
Header: bg #F8FAFC, 12px uppercase, #64748B, font-weight 600
Row height: 52px
Cell padding: 12px 16px
Font: 13px / 500, JetBrains Mono for versions
Status badge: pill, 12px, color-coded
```

**Model Status Colors:**
| Status | Color | Description |
|--------|-------|-------------|
| Active | `#10B981` | Approved and in use |
| Under Review | `#F59E0B` | Pending validation or recalibration |
| Retired | `#94A3B8` | No longer in use |
| Rejected | `#F43F5E` | Failed validation |
| Pending Approval | `#3B82F6` | Awaiting board/CRO approval |

**Demo Data:**
| Model Name | Type | Version | Owner | Validated | Status | Next Review |
|------------|------|---------|-------|-----------|--------|-------------|
| NMD Retail | NMD | v2.3 | M. Boateng | 15 May 2026 | 🟢 Active | 15 Nov 2026 |
| NMD Corporate | NMD | v1.8 | M. Boateng | 20 Apr 2026 | 🟢 Active | 20 Oct 2026 |
| CPR Mortgage | CPR | v3.1 | P. Owusu | 10 Jun 2026 | 🟢 Active | 10 Dec 2026 |
| TDRR Deposit | TDRR | v2.5 | P. Owusu | 10 Jun 2026 | 🟢 Active | 10 Dec 2026 |
| NMD SME | NMD | v1.2 | M. Boateng | 15 Jan 2026 | 🟡 Under Review | 15 Jul 2026 |
| CPR Corporate | CPR | v1.5 | P. Owusu | 20 Feb 2026 | 🟡 Under Review | 20 Aug 2026 |
| NMD Historical | NMD | v1.0 | M. Boateng | 10 Dec 2025 | ⚪ Retired | — |

**Interactions:**
- **Click row:** Opens model detail with specification, parameters, and validation history
- **Sort columns:** Click header to sort by type, version, or status
- **Click "+ Register Model":** Opens model registration workflow
- **Click "Export":** Exports inventory to Excel/PDF
- **Filter:** By type, status, or owner

**Responsive Behavior:**
- Mobile: Card list view with key fields
- Tablet+: Full table as designed

---

## 5. Model Performance Backtesting

### 5.1 Component Specification

**Purpose:** Compare actual vs predicted values for behavioural models to assess predictive accuracy. Critical for model validation and BoG regulatory compliance.

**Chart Type:** Scatter Plot with Regression Line
**Library Recommendation:** ECharts (scatter + line combo)
**Dimensions:** 6 columns × 480px height
**Position:** Third row, left

```
┌────────────────────────────────────────────────────────────────────┐
│ Model Backtesting — NMD Retail                        [Model ▾]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Actual (₵B)                                                       │
│  120 ┤                                    ●                       │
│  100 ┤                        ●    ●         ●                      │
│   80 ┤              ●    ●         ●    ●                           │
│   60 ┤    ●    ●         ●    ●         ●    ●                    │
│   40 ┤         ●    ●         ●    ●                              │
│   20 ┤    ●         ●    ●                                        │
│    0 ┼────┬────┬────┬────┬────┬────┬────┬────┬────┬────        │
│        0   20   40   60   80  100  120  140  160  180  200       │
│                        Predicted (₵B)                              │
│                                                                    │
│  ─ Perfect Prediction (y = x)                                      │
│  ● Actual vs Predicted                                             │
│                                                                    │
│  Model: NMD Retail v2.3                                            │
│  R² = 0.87  •  RMSE = ₵4.2B  •  MAE = ₵3.1B  •  n = 24 months   │
│                                                                    │
│  [View Residuals]  [View Forecast]  [Download Report]            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Marker | Legend Label |
|--------|-------|--------|--------------|
| Actual vs Predicted | `#3B82F6` | Circle (●) | Actual vs Predicted |
| Perfect Prediction | `#94A3B8` | Dashed line | y = x (Perfect) |
| Regression Line | `#F43F5E` | Solid line | Regression (R² = 0.87) |

**Axes:**
- **X-axis:** Predicted (₵B), min: 0, max: 200
- **Y-axis:** Actual (₵B), min: 0, max: 120

**Demo Data (monthly actual vs predicted, ₵B):**
| Month | Predicted | Actual | Residual |
|-------|-----------|--------|----------|
| Jul 2024 | 85.2 | 82.5 | -2.7 |
| Aug 2024 | 86.5 | 88.2 | +1.7 |
| Sep 2024 | 88.0 | 85.5 | -2.5 |
| Oct 2024 | 89.5 | 92.4 | +2.9 |
| Nov 2024 | 91.2 | 90.8 | -0.4 |
| Dec 2024 | 93.0 | 95.2 | +2.2 |
| Jan 2025 | 94.8 | 92.5 | -2.3 |
| Feb 2025 | 96.5 | 98.4 | +1.9 |
| Mar 2025 | 98.2 | 96.8 | -1.4 |
| Apr 2025 | 100.0 | 102.5 | +2.5 |
| May 2025 | 101.8 | 100.2 | -1.6 |
| Jun 2025 | 103.5 | 105.8 | +2.3 |

**Model Performance Metrics:**
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| R² | 0.87 | ≥ 0.80 | 🟢 |
| RMSE | ₵4.2B | ≤ ₵5.0B | 🟢 |
| MAE | ₵3.1B | ≤ ₵4.0B | 🟢 |
| Max Residual | ₵2.9B | ≤ ₵5.0B | 🟢 |
| Bias | +0.2B | ≤ ₵1.0B | 🟢 |

**Interactions:**
- **Hover point:** Tooltip shows month, predicted, actual, and residual
- **Click point:** Shows historical context for that month
- **Click "View Residuals":** Opens residual analysis chart
- **Click "View Forecast":** Shows 12-month forecast vs actual
- **Click "Download Report":** Generates backtest report PDF

**Responsive Behavior:**
- Mobile: Full width, single model view
- Tablet+: Full scatter plot with all models

---

## 6. GRR Sensitivity Panel

### 6.1 Component Specification

**Purpose:** Show how behavioural models respond to changes in the Ghana Reference Rate (GRR). Critical for IRRBB stress testing and ALCO rate strategy discussions.

**Chart Type:** Sensitivity Bar Chart + Scenario Cards
**Library Recommendation:** ECharts
**Dimensions:** 6 columns × 480px height
**Position:** Third row, right

```
┌────────────────────────────────────────────────────────────────────┐
│ GRR Sensitivity Analysis                              [Scenario ▾]   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Current GRR: 25.50%  •  1M Ago: 24.80%  •  Δ: +70bp            │
│                                                                    │
│  Impact on NMD Allocation (₵B)                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                    │
│  GRR Scenario          Core     Semi     Volatile   Total          │
│  ────────────────────────────────────────────────────────────────│
│  GRR -200bps (23.50%)  +8.5    +2.1    -10.6     ₵120.0         │
│  ████████████████████████████████████████░░░░░░░░░               │
│  GRR -100bps (24.50%)  +4.2    +1.5    -5.7      ₵120.0         │
│  ██████████████████████████████████░░░░░░░░░░░░░░░               │
│  GRR Base (25.50%)     72.4     32.1    15.5      ₵120.0         │
│  ████████████████████████████████░░░░░░░░░░░░░░░░░               │
│  GRR +100bps (26.50%)  -3.8    -1.2    +5.0      ₵120.0         │
│  ██████████████████████████░░░░░░░░░░░░░░░░░░░░░░░               │
│  GRR +200bps (27.50%)  -8.2    -2.8    +11.0     ₵120.0         │
│  ██████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░               │
│                                                                    │
│  Key Insight:                                                      │
│  • Core deposits decrease by ₵8.2B when GRR rises 200bps           │
│  • Volatile deposits increase by ₵11.0B under same shock           │
│  • Semi-volatile deposits show moderate sensitivity (-₵2.8B)     │
│                                                                    │
│  [View Full Sensitivity Report]  [Export to ALCO Pack]               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Legend Label |
|--------|-------|--------------|
| Core | `#10B981` | Core Deposits |
| Semi-Volatile | `#3B82F6` | Semi-Volatile |
| Volatile | `#F59E0B` | Volatile Deposits |

**Axes:**
- **X-axis:** GRR Scenarios (₵B impact)
- **Y-axis:** GRR Scenario labels

**Demo Data (NMD allocation by GRR scenario, ₵B):**
| Scenario | GRR Rate | Core | Semi-Volatile | Volatile | Total |
|----------|----------|------|---------------|----------|-------|
| GRR -200bps | 23.50% | 80.9 | 34.2 | 4.9 | 120.0 |
| GRR -100bps | 24.50% | 76.6 | 33.6 | 9.8 | 120.0 |
| GRR Base | 25.50% | 72.4 | 32.1 | 15.5 | 120.0 |
| GRR +100bps | 26.50% | 68.6 | 30.9 | 20.5 | 120.0 |
| GRR +200bps | 27.50% | 64.2 | 29.3 | 26.5 | 120.0 |

**Sensitivity Metrics:**
| Metric | Value | Description |
|--------|-------|-------------|
| Core Beta | -0.42 | Core deposit sensitivity to GRR |
| Semi Beta | -0.15 | Semi-volatile sensitivity to GRR |
| Volatile Beta | +0.58 | Volatile deposit sensitivity to GRR |
| Duration Gap | 1.67 yrs | IRRBB duration mismatch |

**Interactions:**
- **Hover bar:** Tooltip shows exact allocation and % change from base
- **Click scenario:** Opens detailed cash flow projection for that GRR scenario
- **Click "View Full Sensitivity Report":** Opens comprehensive sensitivity analysis
- **Click "Export to ALCO Pack":** Adds chart to ALCO presentation pack

**Responsive Behavior:**
- Mobile: Full width, stacked bars
- Tablet+: Horizontal bars as designed

---

## 7. Responsive Layout Summary

| Breakpoint | NMD Dashboard | CPR/TDRR | Model Inventory | Backtesting | GRR Sensitivity |
|------------|-------------|----------|-----------------|-------------|-----------------|
| Mobile | Full width | Full width | Card list | Full width | Full width |
| Tablet | 6 columns | 6 columns | Full width | 6 columns | 6 columns |
| Desktop+ | 6 columns | 6 columns | Full width | 6 columns | 6 columns |

---

*Behavioural Models Visuals Version 1.0 — ALM Platform Visual Design Team — June 2026*
