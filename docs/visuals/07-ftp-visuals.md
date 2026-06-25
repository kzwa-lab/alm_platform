# ALM Platform — FTP & Pricing Visual Specification

**Version:** 1.0  
**Last Updated:** 2026-06-25  
**Screen:** FTP & Pricing Dashboard  
**Context:** Funds Transfer Pricing and deal profitability for ALCO, treasury, and business unit heads. Covers FTP curves, NMD replicating portfolios, deal grids, LTP waterfalls, deposit comparisons, loan pricing, FTP attribution, and historical curves. Designed for pricing decisions and FTP policy discussions.

---

## 1. Dashboard Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Navigation + Context Switcher (Entity: DB AG Cons. | Date: 30 Jun 2026 | Scenario: Base)│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  FTP CURVE CHART                           │  │  NMD REPLICATING PORTFOLIO BAR       │  │
│  │  (8 columns)                               │  │  (4 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  DEAL PROFITABILITY GRID                                                             │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  LTP CHARGE/BENEFIT WATERFALL              │  │  DEPOSIT RATE vs FTP COMPARISON      │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  LOAN PRICING CALCULATOR FORM              │  │  FTP ATTRIBUTION PIE                 │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  HISTORICAL FTP CURVE ANIMATION                                                      │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Grid:** 12 columns, 24px gutter, 32px margin  
**Background:** `#F8FAFC` (light) / `#0F172A` (dark)

---

## 2. FTP Curve Chart

### 2.1 Component Specification

**Purpose:** Primary yield curve with bank-specific FTP spread overlay. Shows funding costs across tenors for pricing decisions.

**Chart Type:** Multi-line Chart with Shaded Spread Area
**Library Recommendation:** ECharts
**Dimensions:** 8 grid columns × 420px height
**Position:** Top-left, spans 8 columns

```
┌────────────────────────────────────────────────────────────────────┐
│ FTP Curve — EUR Base                            [Currency ▾] [⋯] [⬇]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  %                                                                   │
│ 4.0 ┤    ●────●────●────●────●────●────●────●                      │
│ 3.5 ┤   ╱ Market Curve (Euribor Swap)                              │
│ 3.0 ┤  ●────●────●────●────●────●────●────●  FTP Curve             │
│ 2.5 ┤   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  Spread          │
│ 2.0 ┤                                                              │
│ 1.5 ┤                                                              │
│     ┼────┬────┬────┬────┬────┬────┬────┬────┬────┬────            │
│        1M   3M   6M   1Y   2Y   3Y   5Y   7Y  10Y  20Y             │
│                                                                    │
│  Spread: +25bps (liquidity premium)                                │
│  Last Updated: 30 Jun 2026, 08:00 CET                             │
│  Next Update: 31 Jul 2026                                         │
│                                                                    │
│  Key FTP Rates:                                                    │
│  3M: 3.42%  1Y: 3.28%  5Y: 3.05%  10Y: 2.82%                     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Line Style | Fill | Legend Label |
|--------|-------|------------|------|--------------|
| Market Curve | `#94A3B8` | Dashed, 2px | None | Market Curve (Euribor) |
| FTP Curve | `#3B82F6` | Solid, 3px | None | FTP Curve |
| Spread Area | `#3B82F6` | None | `#3B82F6` at 10% | Liquidity Spread |
| Spread (bps) | `#8B5CF6` | Dotted, 2px | None | FTP Spread (bps) |

**Axes:**
- **X-axis:** Tenors — 1M, 3M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 20Y
- **Y-axis (left):** Rate %, min: 0, max: 5, tick format: "{value}%"
- **Y-axis (right):** Spread bps, min: 0, max: 100, tick format: "+{value} bps"

**Demo Data:**
| Tenor | Market Curve | FTP Curve | Spread (bps) |
|-------|-------------|-----------|--------------|
| 1M | 3.45 | 3.42 | -3 |
| 3M | 3.38 | 3.42 | +4 |
| 6M | 3.25 | 3.35 | +10 |
| 1Y | 3.02 | 3.28 | +26 |
| 2Y | 2.78 | 3.10 | +32 |
| 3Y | 2.65 | 3.00 | +35 |
| 5Y | 2.52 | 2.95 | +43 |
| 7Y | 2.48 | 2.90 | +42 |
| 10Y | 2.42 | 2.82 | +40 |
| 20Y | 2.55 | 2.95 | +40 |

**Interactions:**
- **Hover line:** Tooltip shows rate and spread for all tenors
- **Click point:** Opens tenor detail with curve construction methodology
- **Currency toggle:** Switch between EUR, USD, GBP FTP curves
- **Historical overlay:** Toggle previous month curves for comparison

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 3. NMD Replicating Portfolio Bar

### 3.1 Component Specification

**Purpose:** Show how Non-Maturity Deposits are allocated across behavioral tenors in the replicating portfolio. Key for FTP rate assignment to NMD products.

**Chart Type:** Horizontal Stacked Bar Chart
**Library Recommendation:** ECharts
**Dimensions:** 4 grid columns × 420px height
**Position:** Top-right, spans 4 columns

```
┌────────────────────────────────────────┐
│ NMD Replicating Portfolio       [⋯] [⬇]│
├────────────────────────────────────────┤
│                                        │
│  Total NMD: €120.0B                   │
│                                        │
│  O/N      ██                           │
│           €12.0B  (10%)                │
│  1M       ███                          │
│           €18.0B  (15%)                │
│  3M       █████                        │
│           €24.0B  (20%)                │
│  6M       ████                         │
│           €18.0B  (15%)                │
│  1Y       ████                         │
│           €18.0B  (15%)                │
│  2Y       ███                          │
│           €12.0B  (10%)                │
│  3Y       ██                           │
│           €12.0B  (10%)                │
│  5Y       ██                           │
│           €6.0B   (5%)                 │
│                                        │
│  Weighted Avg FTP: 3.15%               │
│  Endowment Effect: +0.45%              │
│                                        │
└────────────────────────────────────────┘
```

**Data Series:**
| Tenor | Amount (€B) | Percentage | Color |
|-------|-------------|------------|-------|
| O/N | 12.0 | 10% | `#F43F5E` |
| 1M | 18.0 | 15% | `#F97316` |
| 3M | 24.0 | 20% | `#F59E0B` |
| 6M | 18.0 | 15% | `#84CC16` |
| 1Y | 18.0 | 15% | `#10B981` |
| 2Y | 12.0 | 10% | `#06B6D4` |
| 3Y | 12.0 | 10% | `#3B82F6` |
| 5Y | 6.0 | 5% | `#8B5CF6` |

**Interactions:**
- **Hover segment:** Tooltip shows FTP rate applied, amount, and yield contribution
- **Click segment:** Drill down to account-level allocation
- **Product filter:** Switch between retail NMD, corporate NMD, total

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 4. Deal Profitability Grid

### 4.1 Component Specification

**Purpose:** Color-coded matrix showing profitability by product and customer segment. Instant visual identification of profitable vs. loss-making combinations.

**Chart Type:** Heatmap Grid (Matrix)
**Library Recommendation:** ECharts or Custom Grid
**Dimensions:** 12 columns (full width) × 420px height
**Position:** Second row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Deal Profitability Grid                                          [Date ▾] [⋯] [⬇] [📊]   │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  Product / Segment   │ Retail │ SME   │ Corporate │ FI    │ Sovereign │ Total             │
│  ────────────────────┼────────┼───────┼───────────┼───────┼───────────┼───────            │
│  Term Loans          │ 2.15%  │ 1.85% │  1.45%    │ 0.95% │  0.65%    │ 1.41%             │
│  Revolving Credit    │ 1.85%  │ 1.55% │  1.25%    │ 0.85% │  —        │ 1.12%             │
│  Mortgages           │ 1.45%  │ 1.25% │  —        │ —     │  —        │ 1.38%             │
│  Trade Finance       │ —      │ 1.95% │  1.65%    │ 1.35% │  0.95%    │ 1.48%             │
│  Leasing             │ 1.25%  │ 1.45% │  1.15%    │ 0.75% │  —        │ 1.15%             │
│  Deposits (negative) │ -0.45% │-0.65% │ -0.85%    │-1.15% │ -1.45%    │ -0.69%            │
│  ────────────────────┼────────┼───────┼───────────┼───────┼───────────┼───────            │
│  Total               │ 1.25%  │ 1.38% │  1.12%    │ 0.85% │  0.45%    │ 1.12%             │
│                                                                                            │
│  Color: 🟢 >1.5%  🟡 0.5-1.5%  🔴 <0.5%                                                   │
│  Values show margin after FTP and credit cost                                            │
│                                                                                            │
│  Best: Trade Finance / SME (1.95%)    Worst: Deposits / Sovereign (-1.45%)               │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Heatmap Color Scale:**
| Margin | Color |
|--------|-------|
| > 1.5% | `#10B981` |
| 1.0% – 1.5% | `#6EE7B7` |
| 0.5% – 1.0% | `#F59E0B` |
| 0.0% – 0.5% | `#F97316` |
| < 0.0% | `#F43F5E` |

**Demo Data (margin % after FTP and credit cost):**
| Product | Retail | SME | Corporate | FI | Sovereign |
|---------|--------|-----|-----------|-----|-----------|
| Term Loans | 2.15 | 1.85 | 1.45 | 0.95 | 0.65 |
| Revolving Credit | 1.85 | 1.55 | 1.25 | 0.85 | — |
| Mortgages | 1.45 | 1.25 | — | — | — |
| Trade Finance | — | 1.95 | 1.65 | 1.35 | 0.95 |
| Leasing | 1.25 | 1.45 | 1.15 | 0.75 | — |
| Deposits | -0.45 | -0.65 | -0.85 | -1.15 | -1.45 |

**Interactions:**
- **Hover cell:** Tooltip shows volume, revenue, FTP cost, credit cost breakdown
- **Click cell:** Drill down to deal list for that product/segment
- **Toggle:** Show/hide deposits, switch between margin and ROE view

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 5. LTP Charge/Benefit Waterfall

### 5.1 Component Specification

**Purpose:** Show FTP charges and benefits by business unit. Identifies which units are net funders vs. net users.

**Chart Type:** Horizontal Waterfall
**Library Recommendation:** ECharts
**Dimensions:** 6 grid columns × 380px height
**Position:** Third row, left

```
┌────────────────────────────────────────────────────┐
│ LTP by Business Unit            [Period ▾] [⋯] [⬇]│
├────────────────────────────────────────────────────┤
│                                                    │
│  Corporate Banking       ████████      +€485M     │
│  Investment Banking      ████          +€220M     │
│  Retail Banking          ██            +€125M     │
│  Wealth Management       █             +€65M      │
│  ─────────────────────────────────────────────     │
│  Total FTP Charges                  +€895M         │
│                                                    │
│  Retail Deposits         ░░░░░░░░      -€520M     │
│  Corporate Deposits      ░░░░          -€280M     │
│  Wholesale Funding       ░░            -€95M      │
│  ─────────────────────────────────────────────     │
│  Total FTP Benefits                 -€895M         │
│                                                    │
│  Net FTP: €0.0M (balanced book)                   │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Legend Label |
|--------|-------|--------------|
| FTP Charge | `#F43F5E` | FTP Charge (to BUs) |
| FTP Benefit | `#10B981` | FTP Benefit (from BUs) |

**Demo Data:**
| Business Unit | FTP Charge (€M) | FTP Benefit (€M) | Net (€M) |
|---------------|-----------------|------------------|----------|
| Corporate Banking | +485 | — | +485 |
| Investment Banking | +220 | — | +220 |
| Retail Banking | +125 | — | +125 |
| Wealth Management | +65 | — | +65 |
| Retail Deposits | — | -520 | -520 |
| Corporate Deposits | — | -280 | -280 |
| Wholesale Funding | — | -95 | -95 |
| **Total** | **+895** | **-895** | **0** |

**Interactions:**
- **Hover bar:** Tooltip shows volume, average FTP rate, and tenor breakdown
- **Click bar:** Drill down to product-level FTP calculation

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 6. Deposit Rate vs. FTP Rate Comparison

### 6.1 Component Specification

**Purpose:** Compare customer deposit rates against FTP rates to visualize the endowment effect. Shows which products contribute positive or negative margin.

**Chart Type:** Grouped Bar Chart with Difference Line
**Library Recommendation:** ECharts (dual-axis combo)
**Dimensions:** 6 grid columns × 380px height
**Position:** Third row, right

```
┌────────────────────────────────────────────────────┐
│ Deposit Rate vs FTP             [⋯] [⬇] [📊]       │
├────────────────────────────────────────────────────┤
│                                                    │
│  %                                                 │
│ 4.0 ┤                                              │
│ 3.5 ┤    ████                                      │
│ 3.0 ┤    ████  ░░░░                                │
│ 2.5 ┤    ████  ░░░░  ████                          │
│ 2.0 ┤    ████  ░░░░  ████  ░░░░                    │
│ 1.5 ┤    ████  ░░░░  ████  ░░░░  ████              │
│ 1.0 ┤    ████  ░░░░  ████  ░░░░  ████  ░░░░       │
│ 0.5 ┤    ████  ░░░░  ████  ░░░░  ████  ░░░░       │
│   0 ┼────████──░░░░──████──░░░░──████──░░░░──────  │
│      Savings Current Term    Corp   Wholesale       │
│      3.15  0.85   2.85   2.15   3.25   3.42       │
│      FTP   FTP    FTP    FTP    FTP    FTP          │
│      2.45  0.25   2.15   1.45   2.85   3.42       │
│      Rate  Rate   Rate   Rate   Rate   Rate         │
│                                                    │
│  Endowment Effect: +€125M/month                    │
│  (Deposit rate < FTP rate)                         │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Legend Label |
|--------|-------|--------------|
| FTP Rate | `#3B82F6` | FTP Rate |
| Deposit Rate | `#10B981` | Customer Deposit Rate |
| Endowment Effect | `#F59E0B` | Line (difference) |

**Demo Data:**
| Product | FTP Rate (%) | Deposit Rate (%) | Endowment (bps) | Volume (€B) |
|---------|-------------|------------------|-----------------|-------------|
| Savings | 3.15 | 2.45 | +70 | 45.2 |
| Current | 0.85 | 0.25 | +60 | 28.5 |
| Term Retail | 2.85 | 2.15 | +70 | 15.2 |
| Corporate | 2.15 | 1.45 | +70 | 22.8 |
| Wholesale | 3.25 | 2.85 | +40 | 12.4 |
| Money Market | 3.42 | 3.42 | 0 | 8.5 |

**Interactions:**
- **Hover bar:** Tooltip shows endowment contribution in €M
- **Click product:** Opens product pricing history

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 7. Loan Pricing Calculator Form

### 7.1 Component Specification

**Purpose:** Interactive loan pricing tool with real-time margin display. Enables relationship managers and treasury to price deals correctly.

**Component Type:** Interactive Form with Real-time Chart
**Library Recommendation:** Custom React/Vue component + ECharts
**Dimensions:** 6 grid columns × 420px height
**Position:** Fourth row, left

```
┌────────────────────────────────────────────────────┐
│ Loan Pricing Calculator           [Reset] [Save]   │
├────────────────────────────────────────────────────┤
│                                                    │
│  Product:        [Term Loan ▾]                     │
│  Segment:        [Corporate ▾]                     │
│  Amount:         € [     5,000,000    ]            │
│  Tenor:          [  3 years  ▾]                    │
│  Currency:       [EUR ▾]                           │
│  Customer Rate:  [    3.85    ] %                  │
│                                                    │
│  ┌────────────────────────────────────────────┐   │
│  │  Pricing Breakdown                         │   │
│  │                                            │   │
│  │  Customer Rate:        3.85%               │   │
│  │  ├─ FTP Rate:         -3.10%              │   │
│  │  ├─ Credit Cost:      -0.45%              │   │
│  │  ├─ Op. Cost:         -0.15%              │   │
│  │  ├─ Capital Cost:     -0.25%              │   │
│  │  ─────────────────────────────────        │   │
│  │  Net Margin:           0.85%    🟢        │   │
│  │  Annual Revenue:      €42,500             │   │
│  │  ROE:                 12.5%     🟢        │   │
│  │                                            │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  [Calculate]  [Compare to Grid]  [Send Quote]      │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Form Fields:**
```
Label: 13px / 600 / #334155
Input: Standard text input (see design system)
Dropdown: Standard dropdown
Slider: For rate adjustment (optional)
```

**Breakdown Card:**
```
Background: #F8FAFC
Border: 1px solid #E2E8F0
Border-radius: 8px
Padding: 16px
Margin: 12px
```

**Margin Status Colors:**
| Margin | Color | Status |
|--------|-------|--------|
| > 1.0% | `#10B981` | 🟢 Profitable |
| 0.5% – 1.0% | `#F59E0B` | 🟡 Acceptable |
| < 0.5% | `#F43F5E` | 🔴 Review Required |

**Demo Data (default calculation):**
| Component | Rate | Source |
|-----------|------|--------|
| Customer Rate | 3.85% | User input |
| FTP Rate | -3.10% | FTP curve (3Y) |
| Credit Cost | -0.45% | PD × LGD |
| Operating Cost | -0.15% | Fixed |
| Capital Cost | -0.25% | RWA × cost of capital |
| **Net Margin** | **0.85%** | Calculated |
| Annual Revenue | €42,500 | Amount × margin |
| ROE | 12.5% | Revenue / capital |

**Interactions:**
- **Real-time update:** All fields update margin calculation instantly
- **Slider:** Drag to adjust customer rate and see margin change
- **Click "Compare to Grid":** Highlights position in Deal Profitability Grid
- **Click "Send Quote":** Generates PDF quote

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 8. FTP Attribution Pie

### 8.1 Component Specification

**Purpose:** Break down the bank's net interest margin into interest margin, liquidity margin, and credit margin components. Shows value creation by ALM function.

**Chart Type:** Donut Chart
**Library Recommendation:** ECharts
**Dimensions:** 6 grid columns × 420px height
**Position:** Fourth row, right

```
┌────────────────────────────────────────────────────┐
│ FTP Attribution                 [Period ▾] [⋯] [⬇]│
├────────────────────────────────────────────────────┤
│                                                    │
│           ┌────────────┐                          │
│          ╱   Interest  ╲                         │
│         │    52.3%      │                        │
│         │   €1,696M     │                        │
│          ╲   ██████    ╱                         │
│           └──┬────┬───┘                          │
│              │    │                                │
│         Liq. │    │  Credit                        │
│        28.4% │    │  19.3%                         │
│       €922M  │    │ €626M                          │
│                                                    │
│  Total NIM: €3,245M                                │
│  Interest Margin: €1,696M (5.2% yield)            │
│  Liquidity Margin: €922M (FTP effect)             │
│  Credit Margin: €626M (ECL recovery)              │
│                                                    │
│  [View Monthly Trend →]                            │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Data Series:**
| Component | Amount (€M) | Percentage | Color |
|-----------|-------------|------------|-------|
| Interest Margin | 1,696 | 52.3% | `#3B82F6` |
| Liquidity Margin | 922 | 28.4% | `#10B981` |
| Credit Margin | 626 | 19.3% | `#F59E0B` |

**Interactions:**
- **Hover slice:** Tooltip shows definition and calculation methodology
- **Click slice:** Opens monthly trend for that component

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 9. Historical FTP Curve Animation

### 9.1 Component Specification

**Purpose:** Animated visualization of FTP curve evolution over time. Shows how funding costs have changed and the impact on pricing.

**Chart Type:** Animated Multi-line Chart with Time Slider
**Library Recommendation:** ECharts (timeline animation)
**Dimensions:** 12 columns (full width) × 400px height
**Position:** Bottom row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Historical FTP Curve Evolution                                   [▶ Play] [‖ Pause] [Date]│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  %                                                                                        │
│ 5.0 ┤                                                                                      │
│ 4.0 ┤    ●────●────●────●────●────●────●────●────●                                         │
│ 3.0 ┤   ╱                                                    (Current: Jun 2026)          │
│ 2.0 ┤  ●────●────●────●────●────●────●────●────●  (Jan 2024)                              │
│ 1.0 ┤                                                                                      │
│   0 ┼────┬────┬────┬────┬────┬────┬────┬────┬────┬────                                    │
│        1M   3M   6M   1Y   2Y   3Y   5Y   7Y  10Y  20Y                                     │
│                                                                                            │
│  Timeline:                                                 ●                               │
│  Jan 2024 ───── Apr 2024 ───── Jul 2024 ───── Oct 2024 ───── Jan 2025 ───── ... Jun 2026  │
│                                                                                            │
│  3M FTP: 3.42%  (was 3.85% in Jan 2024)                                                   │
│  Change: -43bps over 18 months                                                            │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Animation Controls:**
```
Play button: Circle with triangle, 36px, #3B82F6
Pause button: Circle with bars, 36px, #3B82F6
Timeline slider: Horizontal bar with draggable thumb
Speed: 1x, 2x, 4x toggle
```

**Demo Data (3M FTP rate over time):**
| Month | 3M FTP (%) |
|-------|-----------|
| Jan 2024 | 3.85 |
| Apr 2024 | 3.72 |
| Jul 2024 | 3.58 |
| Oct 2024 | 3.45 |
| Jan 2025 | 3.38 |
| Apr 2025 | 3.42 |
| Jul 2025 | 3.45 |
| Oct 2025 | 3.48 |
| Jan 2026 | 3.45 |
| Mar 2026 | 3.42 |
| Jun 2026 | 3.42 |

**Interactions:**
- **Play/Pause:** Animate curve evolution
- **Drag timeline:** Scrub to specific month
- **Click curve:** Shows exact rates for that month
- **Hover:** Tooltip shows rate and month-over-month change

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 10. Responsive Layout Summary

| Breakpoint | FTP Curve | NMD Portfolio | Deal Grid | LTP Waterfall | Deposit Comp | Calculator | Attribution | History |
|------------|-----------|---------------|-----------|---------------|--------------|------------|-------------|---------|
| Mobile | Full width | Full width | Scrollable | Full width | Full width | Full width | Full width | Full width |
| Tablet | 8 col | 4 col | Scrollable | 6 col | 6 col | 6 col | 6 col | Full width |
| Desktop+ | 8 col | 4 col | Full width | 6 col | 6 col | 6 col | 6 col | Full width |

---

*FTP & Pricing Visuals Version 1.0 — ALM Platform Visual Design Team — June 2026*
