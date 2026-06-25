# ALM Platform — ECL (Expected Credit Loss) Visual Specification

**Version:** 1.0  
**Last Updated:** 2026-06-25  
**Screen:** ECL / Credit Risk Dashboard  
**Context:** IFRS 9 impairment monitoring for ALCO and credit risk teams. Covers ECL trends, staging distribution, SICR triggers, macro scenarios, overlay governance, PD/LGD curves, and portfolio heatmaps. Designed for provisioning discussions and regulatory compliance.

---

## 1. Dashboard Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Navigation + Context Switcher (Entity: DB AG Cons. | Date: 30 Jun 2026 | Scenario: Base)│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  ECL TREND LINE (24M)                      │  │  STAGING DISTRIBUTION DONUT          │  │
│  │  (8 columns)                               │  │  (4 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  SICR TRIGGER MONITOR                                                                  │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  MACRO SCENARIO COMPARISON                 │  │  OVERLAY GOVERNANCE TRACKER          │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  PD TERM STRUCTURE                         │  │  LGD DISTRIBUTION                    │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  PORTFOLIO HEATMAP — ECL Intensity by Sector & Geography                             │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Grid:** 12 columns, 24px gutter, 32px margin  
**Background:** `#F8FAFC` (light) / `#0F172A` (dark)

---

## 2. ECL Trend Line

### 2.1 Component Specification

**Purpose:** Monthly ECL balance over 24 months showing trend, seasonal patterns, and significant events. Primary chart for provisioning trajectory.

**Chart Type:** Line Chart with Area Fill and Annotations
**Library Recommendation:** ECharts
**Dimensions:** 8 grid columns × 420px height
**Position:** Top-left, spans 8 columns

```
┌────────────────────────────────────────────────────────────────────┐
│ ECL Trend (24 Months)                             [Filter] [⋯] [⬇]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  €M                                                                │
│ 3,500 ┤                                                 ╭─╮       │
│ 3,200 ┤                                             ╭──╯  ╰──╮   │
│ 2,900 ┤                                         ╭──╯          │   │
│ 2,600 ┤                                     ╭──╯              │   │
│ 2,300 ┤        ╭───╮                    ╭──╯                  │   │
│ 2,000 ┤───────╯     ╰───╮          ╭──╯                      │   │
│ 1,700 ┤                 ╰────╮  ╭──╯                          │   │
│     ┼────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────    │
│        Jul  Sep  Nov  Jan  Mar  May  Jul  Sep  Nov  Jan  Mar    │
│        2024 2024 2024 2025 2025 2025 2025 2025 2025 2026 2026   │
│                                                                    │
│  📍 Overlay: EUR 4.2M (Climate)                                   │
│  📍 Model Update: PD recalibration (Jan 2026)                     │
│                                                                    │
│  Current ECL: €3,245M  ▲ +€85M (+2.7%) MoM                       │
│  Coverage Ratio: 1.85%                                             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Line Style | Fill | Legend Label |
|--------|-------|------------|------|--------------|
| ECL Balance | `#3B82F6` | Solid, 3px | `#3B82F6` at 10% | ECL Balance |
| Stage 1 | `#10B981` | Dashed, 2px | None | Stage 1 ECL |
| Stage 2 | `#F59E0B` | Dashed, 2px | None | Stage 2 ECL |
| Stage 3 | `#F43F5E` | Dashed, 2px | None | Stage 3 ECL |
| Overlay Events | `#8B5CF6` | Scatter markers | None | Overlays |

**Axes:**
- **X-axis:** Months, format "MMM YYYY", 24-month span
- **Y-axis:** EUR Millions, tick format: "€{value}M", min: 0

**Annotations:**
```
Marker: Diamond, 12px, #8B5CF6
Label: 12px / 500 / #8B5CF6, above marker
Line: Dotted vertical line from marker to x-axis
```

**Demo Data (monthly ECL, €M):**
| Month | Total ECL | Stage 1 | Stage 2 | Stage 3 | Overlays |
|-------|-----------|---------|---------|---------|----------|
| Jul 2024 | 1,850 | 420 | 680 | 750 | — |
| Oct 2024 | 1,920 | 440 | 720 | 760 | — |
| Jan 2025 | 2,050 | 480 | 780 | 790 | — |
| Apr 2025 | 2,180 | 520 | 840 | 820 | — |
| Jul 2025 | 2,450 | 580 | 980 | 890 | — |
| Oct 2025 | 2,820 | 650 | 1,120 | 1,050 | +120 (overlay) |
| Jan 2026 | 3,050 | 710 | 1,240 | 1,100 | +85 (model update) |
| Mar 2026 | 3,160 | 740 | 1,300 | 1,120 | — |
| Jun 2026 | 3,245 | 765 | 1,340 | 1,140 | +42 (climate overlay) |

**Interactions:**
- **Hover line:** Tooltip shows ECL by stage, coverage ratio, and MoM change
- **Click annotation:** Opens overlay/model update documentation
- **Click point:** Drill down to loan-level ECL data for that month
- **Toggle:** Show/hide stage breakdown, overlay events

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 3. Staging Distribution Donut

### 3.1 Component Specification

**Purpose:** Show ECL allocation across IFRS 9 stages. Quick visual reference for portfolio credit quality.

**Chart Type:** Donut Chart with Center Label
**Library Recommendation:** ECharts
**Dimensions:** 4 grid columns × 420px height
**Position:** Top-right, spans 4 columns

```
┌────────────────────────────────────────┐
│ Staging Distribution            [⋯] [⬇]│
├────────────────────────────────────────┤
│                                        │
│           ┌────────────┐               │
│          ╱   Stage 1   ╲              │
│         │    23.6%      │             │
│         │   €765.3M     │             │
│          ╲   ██████    ╱              │
│           └──┬────┬───┘               │
│              │    │                    │
│         S2   │    │  S3               │
│        41.3% │    │ 35.1%             │
│       €1,340M│    │ €1,140M           │
│                                        │
│  Stage 1: €765M  (Performing)          │
│  Stage 2: €1,340M (Deteriorated)       │
│  Stage 3: €1,140M (Impaired)           │
│                                        │
│  Stage 2 Ratio: 41.3%  🟡 (Watch >35%) │
│                                        │
└────────────────────────────────────────┘
```

**Data Series:**
| Stage | Amount (€M) | Percentage | Color |
|-------|-------------|------------|-------|
| Stage 1 | 765.3 | 23.6% | `#10B981` |
| Stage 2 | 1,340.2 | 41.3% | `#F59E0B` |
| Stage 3 | 1,139.5 | 35.1% | `#F43F5E` |

**Interactions:**
- **Hover slice:** Tooltip shows amount, %, and stage definition
- **Click slice:** Drill down to loan list for that stage
- **Center click:** Toggle between amount and percentage

---

## 4. SICR Trigger Monitor

### 4.1 Component Specification

**Purpose:** Monitor loans approaching Significant Increase in Credit Risk (SICR) thresholds. Early warning system for stage transfers.

**Chart Type:** Scatter Plot with Threshold Bands (or Bullet Chart)
**Library Recommendation:** ECharts
**Dimensions:** 12 columns (full width) × 380px height
**Position:** Second row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ SICR Trigger Monitor                                             [Filter] [⋯] [⬇] [📊]   │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  PD Multiple                                                                               │
│  3.0 ┤                                                                                    │
│  2.5 ┤                                              ●                                     │
│      ┤                                        ━━━━━━━━━━━━━━━  Stage 2 Threshold          │
│  2.0 ┤                                    ●                                               │
│  1.5 ┤        ●      ●    ●    ●                                                          │
│      ┤  ━━━━━━━━━━━━━━━  Stage 1 Watchlist                                                │
│  1.0 ┤  ●  ●   ●  ●   ●   ●   ●   ●   ●   ●   ●   ●   ●   ●   ●   ●   ●   ●   ●         │
│  0.5 ┤                                                                                    │
│     ┼────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────         │
│          0   10   20   30   40   50   60   70   80   90  100  110  120  130  140          │
│                                    Exposure (€M)                                          │
│                                                                                            │
│  🔴 2 loans above SICR threshold (€85M total)                                             │
│  🟡 8 loans in watchlist zone (€320M total)                                               │
│  🟢 142 loans in Stage 1 (€12.4B total)                                                   │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Marker | Legend Label |
|--------|-------|--------|--------------|
| Stage 1 (Safe) | `#10B981` | Circle | Stage 1 |
| Watchlist | `#F59E0B` | Triangle | Watchlist (1.0-2.0×) |
| SICR Triggered | `#F43F5E` | Diamond | SICR Triggered (>2.0×) |
| Stage 2 Threshold | `#F43F5E` | Dashed horizontal line | Stage 2 Threshold |
| Watchlist Threshold | `#F59E0B` | Dashed horizontal line | Watchlist Threshold |

**Axes:**
- **X-axis:** Exposure (€M), 0 to max portfolio exposure
- **Y-axis:** PD Multiple (current PD / origination PD), min: 0, max: 3.0

**Demo Data (selected loans):**
| Loan ID | Exposure (€M) | PD Multiple | Stage | Status |
|---------|--------------|-------------|-------|--------|
| LOAN-2024-001 | 45.2 | 2.8 | Stage 2 | 🔴 SICR Triggered |
| LOAN-2024-015 | 40.0 | 2.4 | Stage 2 | 🔴 SICR Triggered |
| LOAN-2023-042 | 28.5 | 1.8 | Stage 1 | 🟡 Watchlist |
| LOAN-2023-078 | 22.1 | 1.6 | Stage 1 | 🟡 Watchlist |
| LOAN-2023-091 | 18.5 | 1.5 | Stage 1 | 🟡 Watchlist |
| LOAN-2024-102 | 15.2 | 1.2 | Stage 1 | 🟡 Watchlist |
| LOAN-2024-156 | 12.8 | 0.9 | Stage 1 | 🟢 Normal |
| LOAN-2024-203 | 8.5 | 0.7 | Stage 1 | 🟢 Normal |

**Interactions:**
- **Hover point:** Tooltip shows loan ID, sector, PD history, days past due
- **Click point:** Opens loan detail panel with full credit history
- **Filter:** By sector, geography, product type, PD model

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 5. Macroeconomic Scenario Comparison

### 5.1 Component Specification

**Purpose:** Compare ECL under base, upside, downside, and severe scenarios. Required for IFRS 9 forward-looking provision calculations.

**Chart Type:** Grouped Bar Chart with Scenario Labels
**Library Recommendation:** ECharts
**Dimensions:** 6 grid columns × 380px height
**Position:** Third row, left

```
┌────────────────────────────────────────────────────┐
│ ECL by Scenario                 [⋯] [⬇] [📊]       │
├────────────────────────────────────────────────────┤
│                                                    │
│  €M                                                │
│ 4,000 ┤                                            │
│ 3,500 ┤    ████                                    │
│ 3,000 ┤    ████                                    │
│ 2,500 ┤    ████  ░░░░                              │
│ 2,000 ┤    ████  ░░░░  ████  ▓▓▓▓                  │
│ 1,500 ┤    ████  ░░░░  ████  ▓▓▓▓                  │
│ 1,000 ┤    ████  ░░░░  ████  ▓▓▓▓                  │
│   500 ┤    ████  ░░░░  ████  ▓▓▓▓                  │
│     0 ┼────████──░░░░──████──▓▓▓▓────────────────  │
│          Base  Upside Down. Severe                  │
│          €3.2B €2.4B  €3.8B  €4.5B                 │
│                                                    │
│  vs Base: —    -€850M +€580M +€1,255M             │
│                                                    │
│  Probability Weights:                              │
│  Base: 50%  Upside: 15%  Downside: 25%  Severe: 10%│
│                                                    │
└────────────────────────────────────────────────────┘
```

**Data Series:**
| Scenario | ECL (€M) | Color |
|----------|----------|-------|
| Base Case | 3,245 | `#3B82F6` |
| Upside | 2,395 | `#10B981` |
| Downside | 3,825 | `#F59E0B` |
| Severe | 4,500 | `#F43F5E` |

**Interactions:**
- **Hover bar:** Tooltip shows ECL by stage under that scenario
- **Click bar:** Opens scenario detail with macro variable assumptions
- **Toggle:** Show weighted average ECL (probability-weighted)

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 6. Overlay Governance Tracker

### 6.1 Component Specification

**Purpose:** Track status of ECL overlays, approvals, and backtesting results. Critical for audit and regulatory compliance.

**Chart Type:** Status Cards + Timeline
**Library Recommendation:** Custom component
**Dimensions:** 6 grid columns × 380px height
**Position:** Third row, right

```
┌────────────────────────────────────────────────────┐
│ Overlay Governance              [⋯] [⬇] [+ New]    │
├────────────────────────────────────────────────────┤
│                                                    │
│  Status Summary:                                   │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │
│  │   3    │ │   5    │ │   12   │ │  94%   │      │
│  │Pending │ │Approved│ │Closed  │ │Accuracy│      │
│  │        │ │        │ │        │ │(BT)    │      │
│  └────────┘ └────────┘ └────────┘ └────────┘      │
│                                                    │
│  Recent Overlays:                                  │
│  ┌────────────────────────────────────────────────┐│
│  │ 🟡 Climate Risk Overlay    EUR 4.2M           ││
│  │    Pending approval — Due: 30 Jun 2026        ││
│  │    [Review]  [Approve]  [Reject]              ││
│  ├────────────────────────────────────────────────┤│
│  │ 🟢 Model Risk Overlay      EUR 1.8M           ││
│  │    Approved — Applied: 15 Jun 2026            ││
│  │    Backtest: 97% accuracy                     ││
│  ├────────────────────────────────────────────────┤│
│  │ 🟢 Sector Concentration    EUR 2.5M           ││
│  │    Approved — Applied: 1 Jun 2026             ││
│  │    Backtest: 92% accuracy                     ││
│  └────────────────────────────────────────────────┘│
│                                                    │
└────────────────────────────────────────────────────┘
```

**Status Cards:**
```
Background: #F8FAFC
Border: 1px solid #E2E8F0
Border-radius: 8px
Padding: 12px
Number: 24px / 700 / [status color]
Label: 12px / 500 / #64748B
```

**Demo Data:**
| Overlay Name | Amount (€M) | Status | Applied Date | Backtest Accuracy |
|--------------|-------------|--------|--------------|-------------------|
| Climate Risk | 4.2 | Pending | — | — |
| Model Risk | 1.8 | Approved | 15 Jun 2026 | 97% |
| Sector Concentration | 2.5 | Approved | 1 Jun 2026 | 92% |
| Geopolitical | 1.2 | Closed | 1 Mar 2026 | 89% |
| COVID-19 | 5.8 | Closed | 1 Sep 2025 | 95% |

**Interactions:**
- **Click overlay:** Opens detail panel with justification and backtest results
- **Click action buttons:** Execute approval workflow
- **Click "+ New":** Opens overlay creation form

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 7. PD Term Structure Curves

### 7.1 Component Specification

**Purpose:** Display Probability of Default curves by rating grade and scenario. Core input for ECL calculation.

**Chart Type:** Multi-line Chart
**Library Recommendation:** ECharts
**Dimensions:** 6 grid columns × 380px height
**Position:** Fourth row, left

```
┌────────────────────────────────────────────────────┐
│ PD Term Structure               [Grade ▾] [⋯] [⬇] │
├────────────────────────────────────────────────────┤
│                                                    │
│  PD (%)                                            │
│  15 ┤                                              │
│  12 ┤    ●                                          │
│   9 ┤        ●                                      │
│   6 ┤            ●                                  │
│   3 ┤                ●    ●    ●    ●    ●    ●    │
│   0 ┼────┬────┬────┬────┬────┬────┬────┬────      │
│       1Y   2Y   3Y   4Y   5Y   6Y   7Y   8Y        │
│                                                    │
│  ─ AAA/AA   ─ A   ─ BBB   ─ BB   ─ B   ─ CCC      │
│                                                    │
│  Selected: BBB (Base Case)                         │
│  1Y PD: 0.25%  5Y PD: 1.85%                        │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Data Series:**
| Rating | Color | Legend Label |
|--------|-------|--------------|
| AAA/AA | `#10B981` | AAA/AA |
| A | `#3B82F6` | A |
| BBB | `#8B5CF6` | BBB |
| BB | `#F59E0B` | BB |
| B | `#F97316` | B |
| CCC | `#F43F5E` | CCC |

**Demo Data (PD % by tenor, Base Case):**
| Rating | 1Y | 2Y | 3Y | 4Y | 5Y | 6Y | 7Y | 8Y |
|--------|-----|-----|-----|-----|-----|-----|-----|-----|
| AAA/AA | 0.02 | 0.05 | 0.08 | 0.12 | 0.15 | 0.18 | 0.22 | 0.25 |
| A | 0.08 | 0.18 | 0.28 | 0.38 | 0.48 | 0.58 | 0.68 | 0.78 |
| BBB | 0.25 | 0.55 | 0.85 | 1.15 | 1.45 | 1.75 | 2.05 | 2.35 |
| BB | 1.20 | 2.40 | 3.50 | 4.50 | 5.40 | 6.20 | 7.00 | 7.70 |
| B | 4.50 | 7.50 | 9.80 | 11.50 | 12.80 | 13.80 | 14.60 | 15.20 |
| CCC | 12.00 | 18.50 | 22.00 | 24.50 | 26.50 | 28.00 | 29.50 | 30.50 |

**Interactions:**
- **Hover line:** Tooltip shows exact PD for all ratings at that tenor
- **Click point:** Shows PD model inputs and historical PDs
- **Scenario toggle:** Switch between base/upside/downside PDs

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 8. LGD Distribution Histogram

### 8.1 Component Specification

**Purpose:** Distribution of Loss Given Default estimates. Shows workout LGD and through-the-cycle LGD distributions.

**Chart Type:** Histogram with Density Curve
**Library Recommendation:** ECharts
**Dimensions:** 6 grid columns × 380px height
**Position:** Fourth row, right

```
┌────────────────────────────────────────────────────┐
│ LGD Distribution                [⋯] [⬇] [📊]       │
├────────────────────────────────────────────────────┤
│                                                    │
│  Count                                             │
│  80 ┤                                              │
│  60 ┤      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓                          │
│  40 ┤    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              │
│  20 ┤  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│   0 ┼──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──   │
│      0% 10% 20% 30% 40% 50% 60% 70% 80% 90% 100%   │
│                  LGD (%)                           │
│                                                    │
│  Mean LGD: 42.5%                                   │
│  Median LGD: 40.0%                                 │
│  Std Dev: 18.2%                                    │
│                                                    │
│  ─ Workout LGD    ━ TTC LGD                        │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Type | Legend Label |
|--------|-------|------|--------------|
| Workout LGD | `#3B82F6` | Bar | Workout LGD |
| TTC LGD | `#F59E0B` | Line (density) | Through-the-Cycle |

**Demo Data (LGD buckets, count):**
| LGD Bucket | Workout Count | TTC Density |
|------------|---------------|-------------|
| 0-10% | 45 | 0.02 |
| 10-20% | 82 | 0.05 |
| 20-30% | 128 | 0.08 |
| 30-40% | 156 | 0.10 |
| 40-50% | 142 | 0.09 |
| 50-60% | 98 | 0.06 |
| 60-70% | 62 | 0.04 |
| 70-80% | 35 | 0.02 |
| 80-90% | 18 | 0.01 |
| 90-100% | 8 | 0.005 |

**Interactions:**
- **Hover bar:** Tooltip shows bucket range, count, and average LGD
- **Click bar:** Drill down to loans in that LGD bucket

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 9. Portfolio Heatmap

### 9.1 Component Specification

**Purpose:** ECL intensity (ECL / Exposure) by sector and geography. Identifies concentration risk and regional vulnerabilities.

**Chart Type:** Heatmap (Matrix)
**Library Recommendation:** ECharts
**Dimensions:** 12 columns (full width) × 420px height
**Position:** Bottom row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Portfolio ECL Intensity Heatmap                                  [⋯] [⬇] [📊]           │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  Sector / Geography    │  DE   │  FR   │  IT   │  ES   │  UK   │  US   │  APAC │  Total │
│  ──────────────────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼────────│
│  Financials            │ 1.2%  │ 1.5%  │ 2.1%  │ 1.8%  │ 1.3%  │ 0.9%  │ 1.1%  │ 1.28%  │
│  Real Estate           │ 2.5%  │ 3.2%  │ 4.1%  │ 3.8%  │ 2.8%  │ 2.1%  │ 2.4%  │ 2.84%  │
│  Retail                │ 0.8%  │ 0.9%  │ 1.2%  │ 1.1%  │ 0.7%  │ 0.6%  │ 0.8%  │ 0.87%  │
│  Manufacturing         │ 1.5%  │ 1.8%  │ 2.5%  │ 2.2%  │ 1.6%  │ 1.2%  │ 1.4%  │ 1.60%  │
│  Energy                │ 2.1%  │ 2.4%  │ 3.2%  │ 2.9%  │ 2.0%  │ 1.8%  │ 2.2%  │ 2.23%  │
│  Technology            │ 0.5%  │ 0.6%  │ 0.8%  │ 0.7%  │ 0.5%  │ 0.4%  │ 0.5%  │ 0.57%  │
│  Healthcare            │ 0.6%  │ 0.7%  │ 0.9%  │ 0.8%  │ 0.6%  │ 0.5%  │ 0.6%  │ 0.67%  │
│  Transport             │ 1.8%  │ 2.1%  │ 2.8%  │ 2.5%  │ 1.9%  │ 1.5%  │ 1.8%  │ 1.91%  │
│  ──────────────────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼────────│
│  Total                 │ 1.35% │ 1.65% │ 2.20% │ 1.98% │ 1.42% │ 1.12% │ 1.35% │ 1.62%  │
│                                                                                            │
│  Cell color: intensity (darker = higher ECL %)                                            │
│  🟢 < 1%  🟡 1-2.5%  🔴 > 2.5%                                                            │
│                                                                                            │
│  Highest: Real Estate / IT (4.1%)  Lowest: Technology / US (0.4%)                         │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Heatmap Color Scale:**
| ECL Intensity | Color |
|---------------|-------|
| < 1.0% | `#D1FAE5` |
| 1.0% – 1.5% | `#A7F3D0` |
| 1.5% – 2.0% | `#6EE7B7` |
| 2.0% – 2.5% | `#FBBF24` |
| 2.5% – 3.5% | `#F97316` |
| > 3.5% | `#F43F5E` |

**Demo Data (ECL Intensity %):**
| Sector | DE | FR | IT | ES | UK | US | APAC |
|--------|-----|-----|-----|-----|-----|-----|------|
| Financials | 1.2 | 1.5 | 2.1 | 1.8 | 1.3 | 0.9 | 1.1 |
| Real Estate | 2.5 | 3.2 | 4.1 | 3.8 | 2.8 | 2.1 | 2.4 |
| Retail | 0.8 | 0.9 | 1.2 | 1.1 | 0.7 | 0.6 | 0.8 |
| Manufacturing | 1.5 | 1.8 | 2.5 | 2.2 | 1.6 | 1.2 | 1.4 |
| Energy | 2.1 | 2.4 | 3.2 | 2.9 | 2.0 | 1.8 | 2.2 |
| Technology | 0.5 | 0.6 | 0.8 | 0.7 | 0.5 | 0.4 | 0.5 |
| Healthcare | 0.6 | 0.7 | 0.9 | 0.8 | 0.6 | 0.5 | 0.6 |
| Transport | 1.8 | 2.1 | 2.8 | 2.5 | 1.9 | 1.5 | 1.8 |

**Interactions:**
- **Hover cell:** Tooltip shows ECL amount, exposure, and top 3 loans
- **Click cell:** Drill down to loan list for that sector/geography
- **Sort rows/columns:** Click header to sort

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 10. Responsive Layout Summary

| Breakpoint | ECL Trend | Staging Donut | SICR Monitor | Scenario | Overlay | PD Curves | LGD | Heatmap |
|------------|-----------|---------------|--------------|----------|---------|-----------|-----|---------|
| Mobile | Full width | Full width | Full width | Full width | Full width | Full width | Full width | Scrollable |
| Tablet | 8 col | 4 col | Full width | 6 col | 6 col | 6 col | 6 col | Scrollable |
| Desktop+ | 8 col | 4 col | Full width | 6 col | 6 col | 6 col | 6 col | Full width |

---

*ECL Visuals Version 1.0 — ALM Platform Visual Design Team — June 2026*
