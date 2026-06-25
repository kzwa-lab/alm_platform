# ALM Platform — Liquidity Risk Visual Specification

**Version:** 1.0  
**Last Updated:** 2026-06-25  
**Screen:** Liquidity Risk Dashboard  
**Context:** Comprehensive liquidity monitoring for ALCO and treasury. Covers LCR, NSFR, gap analysis, stress testing, HQLA composition, funding concentration, survival horizon, and intraday peaks. Designed for real-time monitoring and stress scenario comparison.

---

## 1. Dashboard Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Navigation + Context Switcher (Entity: DB AG Cons. | Date: 30 Jun 2026 | Scenario: Base)│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  LCR WATERFALL CHART                       │  │  NSFR BAR CHART                      │  │
│  │  (Full width, 8 columns)                   │  │  (4 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  LIQUIDITY GAP ANALYSIS — Time-Bucketed Cash Flows                                   │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  ┌────────────────────┐  │
│  │ STRESS TEST │ │ STRESS TEST │ │ STRESS TEST │ │ STRESS TEST │  │  HQLA INVENTORY    │  │
│  │   CARD 1    │ │   CARD 2    │ │   CARD 3    │ │   CARD 4    │  │     PIE CHART      │  │
│  │  Baseline   │ │  Idiosyncr. │ │  Market     │ │  Combined   │  │  (4 columns)       │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  └────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐  ┌──────────────────┐  │
│  │  FUNDING CONCENTRATION       │  │  SURVIVAL HORIZON GAUGE      │  │ INTRADAY PEAK    │  │
│  │  CHART                       │  │                              │  │ CHART            │  │
│  │  (4 columns)                 │  │  (4 columns)                 │  │ (4 columns)      │  │
│  └──────────────────────────────┘  └──────────────────────────────┘  └──────────────────┘  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Grid:** 12 columns, 24px gutter, 32px margin  
**Background:** `#F8FAFC` (light) / `#0F172A` (dark)

---

## 2. LCR Waterfall Chart

### 2.1 Component Specification

**Purpose:** Show the step-by-step construction of the LCR ratio from HQLA through net outflows to the final ratio. Critical for understanding LCR composition and drivers.

**Chart Type:** Horizontal Waterfall (Bridge) Chart
**Library Recommendation:** ECharts (custom waterfall series) or Plotly.js
**Dimensions:** 8 grid columns × 420px height
**Position:** Top-left, spans 8 columns

```
┌────────────────────────────────────────────────────────────────────┐
│ LCR Waterfall Analysis                                    [⋯] [⬇]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  HQLA — Total                              ████████████  €234.5B   │
│                                            │                      │
│  ├─ Level 1                                █████████    €198.2B   │
│  ├─ Level 2A                               ██           €24.8B    │
│  └─ Level 2B                               █            €11.5B    │
│                                                                    │
│  Total Net Cash Outflows                   ░░░░░░░░░░░░  €172.3B   │
│                                            │                      │
│  ├─ Retail Outflows                        ░░░░         €45.2B    │
│  ├─ Wholesale Outflows                     ░░░░░        €78.5B    │
│  ├─ Secured Funding Outflows               ░░           €28.3B    │
│  ├─ Additional Outflows                    ░░           €15.8B    │
│  └─ Inflows (deduct)                       ░░░          €-24.5B   │
│                                                                    │
│  ─────────────────────────────────────────────────────────────     │
│                                                                    │
│  LCR Ratio                                 ████████████  136.2%   │
│  [=========================================]                        │
│  Minimum: 100%    Warning: 120%    Actual: 136.2%                  │
│                                                                    │
│  🟢 Compliant — €62.2M excess HQLA above minimum                   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Bar Style | Legend Label |
|--------|-------|-----------|--------------|
| HQLA (positive) | `#10B981` | Solid fill | High-Quality Liquid Assets |
| Outflows (negative) | `#F43F5E` | Solid fill | Cash Outflows |
| Inflows (offset) | `#3B82F6` | Hatched pattern | Cash Inflows |
| Net/LCR | `#8B5CF6` | Solid fill, bold border | Net Result |

**Axes:**
- **X-axis:** EUR Billions, tick format: "€{value}B", min: 0, max: 250
- **Y-axis:** Category labels (HQLA Total, Level 1, Level 2A, Level 2B, etc.)

**Thresholds / Color Coding:**
- Green bar (LCR ≥ 120%): `#10B981`
- Amber bar (100% ≤ LCR < 120%): `#F59E0B`
- Red bar (LCR < 100%): `#F43F5E`

**Interactions:**
- **Hover bar:** Tooltip shows exact value, percentage of total, and month-over-month change
- **Click category:** Drill down to detail table (e.g., click "Level 1" → list of Level 1 securities with ISINs, ratings, amounts)
- **Right-click:** Export to PNG/Excel
- **Filter:** By entity, currency, scenario

**Demo Data:**
| Category | Value (€B) | Color |
|----------|-----------|-------|
| HQLA — Total | 234.5 | `#10B981` |
| ├─ Level 1 | 198.2 | `#34D399` |
| ├─ Level 2A | 24.8 | `#6EE7B7` |
| └─ Level 2B | 11.5 | `#A7F3D0` |
| Total Net Cash Outflows | 172.3 | `#F43F5E` |
| ├─ Retail Outflows | 45.2 | `#FB7185` |
| ├─ Wholesale Outflows | 78.5 | `#FDA4AF` |
| ├─ Secured Funding | 28.3 | `#FECDD3` |
| ├─ Additional Outflows | 15.8 | `#FFE4E6` |
| └─ Inflows (deduct) | -24.5 | `#3B82F6` |
| **LCR Ratio** | **136.2%** | `#8B5CF6` |

**Responsive Behavior:**
- Mobile: Vertical layout, bars stacked
- Tablet+: Horizontal layout as designed

---

## 3. NSFR Bar Chart

### 3.1 Component Specification

**Purpose:** Compare Available Stable Funding (ASF) vs. Required Stable Funding (RSF) by category to show NSFR composition and surplus/shortfall.

**Chart Type:** Grouped Horizontal Bar Chart
**Library Recommendation:** ECharts
**Dimensions:** 4 grid columns × 420px height
**Position:** Top-right, spans 4 columns, aligned with LCR Waterfall

```
┌────────────────────────────────────────┐
│ NSFR Monitor                    [⋯] [⬇]│
├────────────────────────────────────────┤
│                                        │
│  NSFR: 108.3%                          │
│  [████████████░░░░░░░░]                │
│  Target: 105%                          │
│                                        │
│  ASF (€B)        RSF (€B)              │
│  ████████        ░░░░░░░░              │
│  Capital    45.2   0.0                 │
│  Retail     98.5   32.4                │
│  Wholesale  28.3   48.7                │
│  Interbank  15.2   22.1                │
│  Secured    22.8   35.6                │
│  Other      12.4   18.5                │
│  ─────────────────────                 │
│  Total     222.4  157.3                │
│                                        │
│  🟡 Watch — +€3.2B buffer              │
│                                        │
└────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Legend Label |
|--------|-------|--------------|
| ASF | `#10B981` | Available Stable Funding |
| RSF | `#F43F5E` | Required Stable Funding |

**Axes:**
- **X-axis:** EUR Billions, tick format: "€{value}B", min: 0, max: 120
- **Y-axis:** Category labels (Capital, Retail, Wholesale, Interbank, Secured, Other)

**Thresholds / Color Coding:**
- NSFR ≥ 105%: Green header `#10B981`
- 100% ≤ NSFR < 105%: Amber header `#F59E0B`
- NSFR < 100%: Red header `#F43F5E`

**Demo Data:**
| Category | ASF (€B) | RSF (€B) |
|----------|----------|----------|
| Capital | 45.2 | 0.0 |
| Retail Deposits | 98.5 | 32.4 |
| Wholesale Funding | 28.3 | 48.7 |
| Interbank | 15.2 | 22.1 |
| Secured Funding | 22.8 | 35.6 |
| Other Liabilities | 12.4 | 18.5 |
| **Total** | **222.4** | **157.3** |

**Interactions:**
- **Hover bar:** Tooltip shows value, weight in total, and regulatory weight factor
- **Click category:** Drill down to balance breakdown
- **Toggle:** Switch between absolute values and weighted values

**Responsive Behavior:**
- Mobile: Vertical bars, single category view with toggle
- Tablet+: Horizontal grouped bars

---

## 4. Liquidity Gap Analysis

### 4.1 Component Specification

**Purpose:** Time-bucketed cash flow analysis showing cumulative liquidity surplus/shortfall across maturities. Essential for identifying structural liquidity mismatches.

**Chart Type:** Stacked Bar + Cumulative Line (Combo Chart)
**Library Recommendation:** ECharts (dual-axis combo)
**Dimensions:** 12 columns (full width) × 480px height
**Position:** Second row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Liquidity Gap Analysis                                         [Filter] [⋯] [⬇] [📊]       │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  €B                                                                                       │
│  80 ┤                                                                                      │
│  60 ┤    ████                                                                              │
│  40 ┤    ████  ░░░░                                                                        │
│  20 ┤    ████  ░░░░  ████                                                                  │
│   0 ┼────████──░░░░──████──░░░░──████──░░░░──████──░░░░──████──░░░░──████──░░░░────       │
│ -20 ┤         ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░          │
│ -40 ┤                                                                                      │
│                                                                                            │
│       O/N   1W    1M    3M    6M    1Y   >1Y   >2Y   >3Y   >4Y   >5Y   >10Y               │
│                                                                                            │
│  ─ Cumulative Gap (line) ────▲───────────▲────────▲───────▲────────▲───────▲──            │
│                                                                                            │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                   │
│  │ O/N    │  │ 1W     │  │ 1M     │  │ 3M     │  │ 6M     │  │ 1Y     │                   │
│  │ +12.4  │  │ -8.2   │  │ +5.6   │  │ -15.3  │  │ +22.1  │  │ -4.7   │                   │
│  │ 🟢     │  │ 🔴     │  │ 🟢     │  │ 🔴     │  │ 🟢     │  │ 🔴     │                   │
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘                   │
│                                                                                            │
│  Legend: █ Inflows  ░ Outflows  ─ Cumulative Gap                                           │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Type | Legend Label |
|--------|-------|------|--------------|
| Inflows | `#10B981` | Stacked bar | Cash Inflows |
| Outflows | `#F43F5E` | Stacked bar (negative) | Cash Outflows |
| Cumulative Gap | `#3B82F6` | Line with markers | Cumulative Gap |
| Survival Horizon | `#F59E0B` | Dashed vertical line | Survival Limit |

**Axes:**
- **X-axis:** Time buckets — O/N, 1W, 1M, 3M, 6M, 1Y, >1Y, >2Y, >3Y, >4Y, >5Y, >10Y
- **Y-axis (left):** EUR Billions, tick format: "€{value}B", min: -50, max: 100
- **Y-axis (right):** Cumulative EUR Billions, min: -200, max: 200

**Bucket Summary Cards (below chart):**
```
Background: #F8FAFC
Border: 1px solid #E2E8F0
Border-radius: 8px
Padding: 12px
Width: ~140px each
Gap: 12px
```

**Demo Data:**
| Bucket | Inflows (€B) | Outflows (€B) | Net Gap (€B) | Cumulative (€B) | Status |
|--------|-------------|---------------|--------------|-----------------|--------|
| O/N | 45.2 | 32.8 | +12.4 | +12.4 | 🟢 |
| 1W | 28.5 | 36.7 | -8.2 | +4.2 | 🔴 |
| 1M | 52.3 | 46.7 | +5.6 | +9.8 | 🟢 |
| 3M | 38.4 | 53.7 | -15.3 | -5.5 | 🔴 |
| 6M | 68.2 | 46.1 | +22.1 | +16.6 | 🟢 |
| 1Y | 42.5 | 47.2 | -4.7 | +11.9 | 🔴 |
| >1Y | 125.4 | 98.3 | +27.1 | +39.0 | 🟢 |

**Interactions:**
- **Hover bar:** Tooltip shows inflow/outflow breakdown by product type
- **Click bucket:** Drill down to contractual cash flow schedule
- **Click cumulative line:** Shows running total and survival days
- **Filter:** By currency, entity, product type, scenario
- **Toggle:** Switch between contractual and behavioral maturities

**Responsive Behavior:**
- Mobile: Scrollable horizontal chart, bucket cards stack vertically
- Tablet+: Full view with bucket cards in horizontal row

---

## 5. Stress Test Result Cards

### 5.1 Component Specification

**Purpose:** Compact before/after comparison cards showing LCR under different stress scenarios. Enables rapid assessment of liquidity resilience.

**Component Type:** Metric Cards (4-column grid)
**Library Recommendation:** Custom component
**Dimensions:** 4 cards × ~200px width each × 220px height
**Position:** Third row, 8 columns (left side)

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ BASELINE        │ │ IDIOSYNCRATIC   │ │ MARKET STRESS   │ │ COMBINED        │
│                 │ │                 │ │                 │ │                 │
│  Before         │ │  Before         │ │  Before         │ │  Before         │
│  136.2%         │ │  136.2%         │ │  136.2%         │ │  136.2%         │
│  🟢             │ │  🟢             │ │  🟢             │ │  🟢             │
│                 │ │                 │ │                 │ │                 │
│  After          │ │  After          │ │  After          │ │  After          │
│  134.8%         │ │  112.5%         │ │  118.3%         │ │  98.7%          │
│  🟢   ▼-1.4     │ │  🟡   ▼-23.7    │ │  🟡   ▼-17.9    │ │  🔴   ▼-37.5    │
│                 │ │                 │ │                 │ │                 │
│  HQLA: -€1.2B   │ │  HQLA: -€12.5B  │ │  HQLA: -€8.2B   │ │  HQLA: -€22.1B  │
│  Outflows: +€0.8B│ │  Outflows: +€28.3B│ │ Outflows: +€15.6B│ │ Outflows: +€42.1B│
│                 │ │                 │ │                 │ │                 │
│  [View Details] │ │  [View Details] │ │  [View Details] │ │  [View Details] │
│                 │ │                 │ │                 │ │ ⚠ Action Required│
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

**Card Styling:**
```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border-radius: 12px
Padding: 20px
Top accent: 4px solid [after-status-color]
```

**Status Colors:**
| After LCR | Color | Label |
|-----------|-------|-------|
| ≥ 120% | `#10B981` | Compliant |
| 100% – 120% | `#F59E0B` | Watch |
| < 100% | `#F43F5E` | Breach |

**Demo Data:**
| Scenario | Before LCR | After LCR | Δ HQLA (€B) | Δ Outflows (€B) | Status |
|----------|-----------|-----------|-------------|-----------------|--------|
| Baseline | 136.2% | 134.8% | -1.2 | +0.8 | 🟢 |
| Idiosyncratic | 136.2% | 112.5% | -12.5 | +28.3 | 🟡 |
| Market Stress | 136.2% | 118.3% | -8.2 | +15.6 | 🟡 |
| Combined | 136.2% | 98.7% | -22.1 | +42.1 | 🔴 |

**Interactions:**
- **Click card:** Expands to full stress test detail view
- **Click "View Details":** Opens scenario-specific waterfall chart
- **Hover:** Card elevates, shows scenario description tooltip

**Responsive Behavior:**
- Mobile: 2 columns × 2 rows
- Tablet: 4 columns × 1 row

---

## 6. HQLA Inventory Pie Chart

### 6.1 Component Specification

**Purpose:** Show composition of High-Quality Liquid Assets by regulatory level. Quick visual reference for HQLA quality and concentration.

**Chart Type:** Donut Chart (with center label)
**Library Recommendation:** ECharts (pie/donut)
**Dimensions:** 4 grid columns × 420px height
**Position:** Third row, right side, aligned with stress test cards

```
┌────────────────────────────────────────┐
│ HQLA Inventory                  [⋯] [⬇]│
├────────────────────────────────────────┤
│                                        │
│           ┌────────────┐               │
│          ╱   Level 1    ╲              │
│         │    84.5%      │              │
│         │   €198.2B     │              │
│          ╲   ██████    ╱               │
│           └──┬────┬───┘                │
│              │    │                    │
│         L2A  │    │  L2B              │
│        10.6% │    │  4.9%             │
│        €24.8B│    │  €11.5B           │
│                                        │
│  ┌──────┐ Level 1    €198.2B  84.5%   │
│  │██████│ Level 2A    €24.8B  10.6%   │
│  │░░░░░░│ Level 2B    €11.5B   4.9%   │
│  └──────┘                              │
│                                        │
│  Total HQLA: €234.5B                   │
│                                        │
└────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Legend Label |
|--------|-------|--------------|
| Level 1 | `#10B981` | Level 1 (Central reserves, gov bonds) |
| Level 2A | `#3B82F6` | Level 2A (Agency bonds, covered bonds) |
| Level 2B | `#F59E0B` | Level 2B (RMBS, corporate bonds) |

**Chart Configuration:**
- Inner radius: 60% (donut)
- Outer radius: 85%
- Border width: 2px, color `#FFFFFF`
- Center label: Total HQLA value in hero font

**Demo Data:**
| Level | Amount (€B) | Percentage | Color |
|-------|-------------|------------|-------|
| Level 1 | 198.2 | 84.5% | `#10B981` |
| Level 2A | 24.8 | 10.6% | `#3B82F6` |
| Level 2B | 11.5 | 4.9% | `#F59E0B` |
| **Total** | **234.5** | **100%** | — |

**Interactions:**
- **Hover slice:** Tooltip shows amount, percentage, and haircut applied
- **Click slice:** Drill down to security-level list
- **Center click:** Toggle between percentage and absolute value display

**Responsive Behavior:**
- Mobile: Full width, legend below
- Tablet+: Side-by-side with legend

---

## 7. Funding Concentration Chart

### 7.1 Component Specification

**Purpose:** Display funding sources breakdown showing reliance on wholesale vs. retail vs. central bank funding. Critical for concentration risk monitoring.

**Chart Type:** Stacked Horizontal Bar + Treemap (alternative view)
**Library Recommendation:** ECharts
**Dimensions:** 4 grid columns × 320px height
**Position:** Bottom row, left

```
┌────────────────────────────────────────┐
│ Funding Concentration           [⋯] [⬇]│
├────────────────────────────────────────┤
│                                        │
│  Retail      ████████████████████  42% │
│  Wholesale   ██████████████        31% │
│  Central Bank ████████             18% │
│  Secured     ████                   9% │
│                                        │
│  ───────────────────────────────────── │
│                                        │
│  Wholesale concentration: 31%          │
│  Limit: 35%  🟢 Within limit           │
│                                        │
│  Top 10 depositors: 15.2%              │
│  Limit: 20%  🟢 Within limit           │
│                                        │
└────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Legend Label |
|--------|-------|--------------|
| Retail | `#10B981` | Retail Deposits |
| Wholesale | `#3B82F6` | Wholesale Funding |
| Central Bank | `#8B5CF6` | Central Bank Funding |
| Secured | `#06B6D4` | Secured Funding |

**Axes:**
- **X-axis:** Percentage, 0% – 100%
- **Y-axis:** Funding category labels

**Demo Data:**
| Source | Amount (€B) | Percentage | Color |
|--------|-------------|------------|-------|
| Retail Deposits | 98.5 | 42% | `#10B981` |
| Wholesale Funding | 72.3 | 31% | `#3B82F6` |
| Central Bank | 42.1 | 18% | `#8B5CF6` |
| Secured Funding | 21.5 | 9% | `#06B6D4` |

**Interactions:**
- **Hover bar:** Tooltip shows amount, percentage, and trend
- **Click category:** Drill down to counterparty list
- **Toggle:** Switch between percentage and absolute values

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 8. Survival Horizon Gauge

### 8.1 Component Specification

**Purpose:** Show estimated days of survival under stress conditions. Most impactful single metric for liquidity risk communication to board/ALCO.

**Chart Type:** Gauge / Speedometer
**Library Recommendation:** ECharts (gauge series)
**Dimensions:** 4 grid columns × 320px height
**Position:** Bottom row, center

```
┌────────────────────────────────────────┐
│ Survival Horizon                [⋯] [⬇]│
├────────────────────────────────────────┤
│                                        │
│              ╭──────╮                  │
│            ╭─╯      ╰─╮                │
│           │   45      │                │
│           │   days    │                │
│            ╰─╮      ╭─╯                │
│              ╰──────╯                  │
│                                        │
│     ━━━━━━━━━━━━━━━━━━━━━━━            │
│     0    15    30    45    60          │
│     🔴    🟡    🟢    🟢    🟢          │
│                                        │
│  Baseline:  45 days                    │
│  Stress:    23 days                    │
│  🟡 Approaching 30-day threshold       │
│                                        │
│  [Run Stress Test]                     │
│                                        │
└────────────────────────────────────────┘
```

**Gauge Configuration:**
- Start angle: 180°, End angle: 0° (semicircle)
- Min: 0, Max: 60 days
- Split number: 3 (0-15, 15-30, 30-60)
- Axis line colors:
  - 0-15: `#F43F5E` (Red)
  - 15-30: `#F59E0B` (Amber)
  - 30-60: `#10B981` (Green)

**Pointer:**
- Width: 8px
- Color: `#1E293B` (light) / `#F1F5F9` (dark)
- Length: 70%

**Demo Data:**
| Scenario | Survival Days | Status |
|----------|--------------|--------|
| Baseline | 45 | 🟢 |
| Idiosyncratic Stress | 23 | 🟡 |
| Market Stress | 31 | 🟢 |
| Combined Stress | 12 | 🔴 |

**Interactions:**
- **Hover gauge:** Tooltip shows scenario assumptions
- **Click gauge:** Opens stress test configuration panel
- **Click "Run Stress Test":** Opens scenario builder

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 9. Intraday Liquidity Peak Chart

### 9.1 Component Specification

**Purpose:** Hourly funding requirements throughout the business day. Critical for treasury operations and intraday liquidity management.

**Chart Type:** Area Chart (step or smooth)
**Library Recommendation:** ECharts
**Dimensions:** 4 grid columns × 320px height
**Position:** Bottom row, right

```
┌────────────────────────────────────────┐
│ Intraday Liquidity Peaks        [⋯] [⬇]│
├────────────────────────────────────────────────────────┤
│                                                        │
│  €B                                                    │
│  25 ┤                                          ╭─╮     │
│  20 ┤                              ╭─╮        │  │     │
│  15 ┤                  ╭─╮        │  │  ╭────╯  │     │
│  10 ┤    ╭─╮          │  │  ╭────╯  │──╯        │     │
│   5 ┤───╯  ╰────╮────╯  │──╯       │           │     │
│   0 ┼───────────┬────────┬─────────┬────────────┬────  │
│       08:00   10:00    12:00    14:00    16:00   18:00│
│                                                        │
│  Peak: €24.3B at 16:30                                │
│  Average: €14.2B                                       │
│  🟢 Within intraday limit                              │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Type | Legend Label |
|--------|-------|------|--------------|
| Funding Requirement | `#3B82F6` | Step area | Required Funding |
| Limit | `#F43F5E` | Dashed line | Intraday Limit |
| Average | `#94A3B8` | Dotted line | 30-day Average |

**Axes:**
- **X-axis:** Time of day, format "HH:mm", ticks every 2 hours
- **Y-axis:** EUR Billions, min: 0, max: 30

**Demo Data (Hourly funding requirement):**
| Time | Required (€B) | Limit (€B) | 30D Avg (€B) |
|------|--------------|------------|--------------|
| 08:00 | 8.2 | 30.0 | 7.5 |
| 09:00 | 12.5 | 30.0 | 11.2 |
| 10:00 | 10.3 | 30.0 | 9.8 |
| 11:00 | 14.2 | 30.0 | 13.1 |
| 12:00 | 13.8 | 30.0 | 12.5 |
| 13:00 | 16.5 | 30.0 | 15.2 |
| 14:00 | 15.2 | 30.0 | 14.3 |
| 15:00 | 18.7 | 30.0 | 16.8 |
| 16:00 | 22.4 | 30.0 | 19.5 |
| 16:30 | 24.3 | 30.0 | 21.2 |
| 17:00 | 20.1 | 30.0 | 18.4 |
| 18:00 | 12.3 | 30.0 | 11.7 |

**Interactions:**
- **Hover:** Tooltip shows exact requirement, limit, and variance from average
- **Click point:** Drill down to payment schedule for that hour
- **Toggle:** Switch between today, yesterday, and 30-day average

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 10. Responsive Layout Summary

| Breakpoint | LCR Waterfall | NSFR | Gap Analysis | Stress Cards | HQLA | Funding | Survival | Intraday |
|------------|--------------|------|--------------|--------------|------|---------|----------|----------|
| Mobile | Full width | Full width | Full width | 2×2 grid | Full width | Full width | Full width | Full width |
| Tablet | 8 col | 4 col | Full width | 4×1 grid | 4 col | 4 col | 4 col | 4 col |
| Desktop+ | 8 col | 4 col | Full width | 4×1 grid | 4 col | 4 col | 4 col | 4 col |

---

*Liquidity Risk Visuals Version 1.0 — ALM Platform Visual Design Team — June 2026*
