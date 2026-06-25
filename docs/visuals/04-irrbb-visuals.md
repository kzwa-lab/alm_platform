# ALM Platform — IRRBB (Interest Rate Risk in the Banking Book) Visual Specification

**Version:** 1.0  
**Last Updated:** 2026-06-25  
**Screen:** IRRBB Dashboard  
**Context:** Interest rate risk monitoring for ALCO and treasury risk management. Covers EVE sensitivity, NII forecasting, repricing gaps, yield curves, deposit betas, NMD maturity profiles, derivatives, and DV01 analysis. Designed for rate strategy discussions and stress testing.

---

## 1. Dashboard Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Navigation + Context Switcher (Entity: DB AG Cons. | Date: 30 Jun 2026 | Scenario: Base)│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  EVE SENSITIVITY PYRAMID / HEATMAP         │  │  NII FORECAST LINE CHART             │  │
│  │  (8 columns)                               │  │  (4 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  REPRICING GAP LADDER                                                                │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  YIELD CURVE DISPLAY                       │  │  DEPOSIT BETA SCATTER PLOT           │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  NMD MATURITY PROFILE                      │  │  DERIVATIVE PORTFOLIO TABLE          │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  DV01 DASHBOARD — Sensitivity by Currency and Tenor                                  │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Grid:** 12 columns, 24px gutter, 32px margin  
**Background:** `#F8FAFC` (light) / `#0F172A` (dark)

---

## 2. EVE Sensitivity Pyramid / Heatmap

### 2.1 Component Specification

**Purpose:** Display Economic Value of Equity sensitivity across shock magnitudes and maturity buckets. Central to IRRBB risk assessment and regulatory reporting.

**Chart Type:** Heatmap with Pyramid Overlay (or 3D surface)
**Library Recommendation:** ECharts (heatmap) or Plotly.js
**Dimensions:** 8 grid columns × 480px height
**Position:** Top-left, spans 8 columns

```
┌────────────────────────────────────────────────────────────────────┐
│ EVE Sensitivity Analysis                            [Filter] [⋯] [⬇]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Shock (bps)                                                       │
│   +300 ┤  ░░  ░░  ░░  ░░  ░░  ░░  ░░  ░░                          │
│   +250 ┤  ░░  ░░  ░░  ░░  ░░  ░░  ░░  ░░                          │
│   +200 ┤  ░░  ░░  ░░  ░░  ░░  ░░  ░░  ░░                          │
│   +150 ┤  ░░  ░░  ░░  ░░  ░░  ░░  ░░  ░░                          │
│   +100 ┤  ░░  ░░  ░░  ░░  ░░  ░░  ░░  ░░                          │
│    +50 ┤  ░░  ░░  ░░  ░░  ░░  ░░  ░░  ░░                          │
│      0 ┼─────────────────────────────────────                       │
│    -50 ┤  ██  ██  ██  ██  ██  ██  ██  ██                          │
│   -100 ┤  ██  ██  ██  ██  ██  ██  ██  ██                          │
│   -150 ┤  ██  ██  ██  ██  ██  ██  ██  ██                          │
│   -200 ┤  ██  ██  ██  ██  ██  ██  ██  ██                          │
│   -250 ┤  ██  ██  ██  ██  ██  ██  ██  ██                          │
│   -300 ┤  ██  ██  ██  ██  ██  ██  ██  ██                          │
│         └───────────────────────────────────                       │
│            O/N  1M   3M   6M   1Y   2Y   5Y   10Y                 │
│                                                                    │
│  Legend:  ██ Severe Impact  ░░ Moderate  ▓▓ Mild  ░░ Negligible   │
│                                                                    │
│  Selected: +200bps parallel shock, 5Y bucket                      │
│  EVE Impact: -€1,245M (-4.2%)                                      │
│  [View Cash Flows]  [View Sensitivity Report]                      │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Heatmap Color Scale:**
| EVE Impact | Color | Description |
|------------|-------|-------------|
| > -2% | `#10B981` | Negligible (Green) |
| -5% to -2% | `#F59E0B` | Mild (Amber) |
| -10% to -5% | `#F97316` | Moderate (Orange) |
| < -10% | `#F43F5E` | Severe (Red) |

**Data Series:**
| Dimension | Values |
|-----------|--------|
| X-axis | O/N, 1M, 3M, 6M, 1Y, 2Y, 5Y, 10Y |
| Y-axis | -300, -250, -200, -150, -100, -50, 0, +50, +100, +150, +200, +250, +300 bps |
| Cell value | EVE impact as % of equity |

**Axes:**
- **X-axis:** Maturity buckets, label "Maturity"
- **Y-axis:** Shock magnitude (bps), label "Parallel Shock (bps)", tick format: "{value} bps"

**Demo Data (selected cells):**
| Shock | O/N | 1M | 3M | 6M | 1Y | 2Y | 5Y | 10Y |
|-------|-----|-----|-----|-----|-----|-----|-----|------|
| +200 | -0.1% | -0.3% | -0.8% | -1.5% | -2.8% | -3.5% | -4.2% | -3.8% |
| +100 | -0.05% | -0.15% | -0.4% | -0.8% | -1.4% | -1.8% | -2.1% | -1.9% |
| -100 | +0.05% | +0.15% | +0.4% | +0.8% | +1.4% | +1.8% | +2.1% | +1.9% |
| -200 | +0.1% | +0.3% | +0.8% | +1.5% | +2.8% | +3.5% | +4.2% | +3.8% |

**Interactions:**
- **Hover cell:** Tooltip shows exact EVE impact in €M and % of equity
- **Click cell:** Drill down to cash flow profile for that maturity/shock combination
- **Click "View Sensitivity Report":** Opens full EVE sensitivity report
- **Filter:** By currency, scenario type (parallel, steepener, flattener, twist)

**Responsive Behavior:**
- Mobile: Scrollable heatmap, summary statistics above
- Tablet+: Full heatmap with zoom/pan

---

## 3. NII Forecast Line Chart

### 3.1 Component Specification

**Purpose:** 12-36 month Net Interest Income projection with confidence bands. Core chart for ALCO strategic planning and budgeting.

**Chart Type:** Multi-line with Confidence Bands (Area)
**Library Recommendation:** ECharts or Plotly.js
**Dimensions:** 4 grid columns × 480px height
**Position:** Top-right, spans 4 columns

```
┌────────────────────────────────────────┐
│ NII Forecast (12M)              [⋯] [⬇]│
├────────────────────────────────────────┤
│                                        │
│  €M                                    │
│ 850 ┤                           ╭────╮ │
│ 800 ┤        ╭───╮             ╱      │
│ 750 ┤       ╱     ╰───╮      ╱       │
│ 700 ┤──────╯          ╰─────╯        │
│ 650 ┤                                  │
│     ┼────┬────┬────┬────┬────┬────    │
│        Jul  Sep  Nov  Jan  Mar  May    │
│        2026 2026 2026 2027 2027 2027   │
│                                        │
│  ─ Base Case                           │
│  ━ Upside Case                         │
│  ━ Downside Case                       │
│  ▓ 80% Confidence Interval             │
│                                        │
│  Current NII (TTM): €3,245M            │
│  Forecast NII (12M): €3,420M (+5.4%)   │
│                                        │
└────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Line Style | Fill | Legend Label |
|--------|-------|------------|------|--------------|
| Base Case | `#3B82F6` | Solid | None | Base Case |
| Upside Case | `#10B981` | Dashed | None | Upside (+100bps) |
| Downside Case | `#F43F5E` | Dashed | None | Downside (-100bps) |
| Confidence Upper | `#3B82F6` | None | `#3B82F6` at 10% | 80% CI Upper |
| Confidence Lower | `#3B82F6` | None | `#3B82F6` at 10% | 80% CI Lower |

**Axes:**
- **X-axis:** Months, format "MMM YYYY", 12–36 month horizon
- **Y-axis:** EUR Millions, tick format: "€{value}M"

**Demo Data (12-month NII forecast, €M):**
| Month | Base | Upside | Downside | CI Lower | CI Upper |
|-------|------|--------|----------|----------|----------|
| Jul 2026 | 285 | 295 | 275 | 278 | 292 |
| Aug 2026 | 282 | 292 | 272 | 275 | 289 |
| Sep 2026 | 280 | 290 | 270 | 273 | 287 |
| Oct 2026 | 278 | 288 | 268 | 271 | 285 |
| Nov 2026 | 276 | 286 | 266 | 269 | 283 |
| Dec 2026 | 275 | 285 | 265 | 268 | 282 |
| Jan 2027 | 274 | 284 | 264 | 267 | 281 |
| Feb 2027 | 273 | 283 | 263 | 266 | 280 |
| Mar 2027 | 272 | 282 | 262 | 265 | 279 |
| Apr 2027 | 271 | 281 | 261 | 264 | 278 |
| May 2027 | 270 | 280 | 260 | 263 | 277 |
| Jun 2027 | 269 | 279 | 259 | 262 | 276 |

**Interactions:**
- **Hover line:** Tooltip shows exact NII for all scenarios at that month
- **Click point:** Drill down to NII attribution (volume, rate, mix effects)
- **Toggle:** Show/hide confidence bands, switch to 36-month view
- **Legend click:** Toggle scenario visibility

**Responsive Behavior:**
- Mobile: Single scenario view with toggle, vertical layout
- Tablet+: All scenarios visible

---

## 4. Repricing Gap Ladder

### 4.1 Component Specification

**Purpose:** Time-bucketed view of rate-sensitive assets vs. liabilities. Identifies repricing mismatches and basis risk across the yield curve.

**Chart Type:** Grouped Bar Chart with Net Gap Line
**Library Recommendation:** ECharts (dual-axis combo)
**Dimensions:** 12 columns (full width) × 420px height
**Position:** Second row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Repricing Gap Ladder                                   [Rate Type ▾] [⋯] [⬇] [📊]         │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  €B                                                                                       │
│ 120 ┤                                                                                      │
│ 100 ┤    ████                                                                              │
│  80 ┤    ████  ░░░░                                                                        │
│  60 ┤    ████  ░░░░  ████                                                                  │
│  40 ┤    ████  ░░░░  ████  ░░░░                                                            │
│  20 ┤    ████  ░░░░  ████  ░░░░  ████                                                      │
│   0 ┼────████──░░░░──████──░░░░──████──░░░░──████──░░░░──████──░░░░───────                 │
│ -20 ┤         ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░                        │
│ -40 ┤                                                                                      │
│                                                                                            │
│       O/N   1M    3M    6M    1Y    2Y    3Y    5Y    7Y    10Y   >10Y                     │
│                                                                                            │
│  ─ Net Gap ──────▲───────────▲────────▲───────▲────────▲───────▲───                        │
│                                                                                            │
│  Legend: █ Rate-Sensitive Assets  ░ Rate-Sensitive Liabilities  ─ Net Gap                  │
│                                                                                            │
│  Cumulative Gap (1Y): +€45.2B  🟢 Asset-sensitive                                          │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Type | Legend Label |
|--------|-------|------|--------------|
| Rate-Sensitive Assets | `#10B981` | Bar | RSA |
| Rate-Sensitive Liabilities | `#F43F5E` | Bar (negative) | RSL |
| Net Gap | `#3B82F6` | Line with markers | Net Gap |
| Cumulative Gap | `#8B5CF6` | Dashed line | Cumulative Gap |

**Axes:**
- **X-axis:** Time buckets — O/N, 1M, 3M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, >10Y
- **Y-axis (left):** EUR Billions, min: -50, max: 120

**Demo Data:**
| Bucket | RSA (€B) | RSL (€B) | Net Gap (€B) | Cumulative (€B) |
|--------|----------|----------|--------------|-----------------|
| O/N | 85.2 | 72.4 | +12.8 | +12.8 |
| 1M | 65.3 | 58.2 | +7.1 | +19.9 |
| 3M | 78.5 | 82.1 | -3.6 | +16.3 |
| 6M | 92.4 | 68.5 | +23.9 | +40.2 |
| 1Y | 45.2 | 38.7 | +6.5 | +46.7 |
| 2Y | 35.8 | 42.3 | -6.5 | +40.2 |
| 3Y | 28.4 | 32.1 | -3.7 | +36.5 |
| 5Y | 42.5 | 28.4 | +14.1 | +50.6 |
| 7Y | 18.3 | 15.2 | +3.1 | +53.7 |
| 10Y | 22.1 | 12.5 | +9.6 | +63.3 |
| >10Y | 15.2 | 8.4 | +6.8 | +70.1 |

**Interactions:**
- **Hover bar:** Tooltip shows breakdown by product type
- **Click bucket:** Drill down to product-level repricing schedule
- **Rate Type filter:** Switch between fixed, floating, or total rate sensitivity

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 5. Yield Curve Display

### 5.1 Component Specification

**Purpose:** Multi-curve yield curve display showing current, shocked, and historical curves. Essential for rate strategy discussions.

**Chart Type:** Multi-line Chart
**Library Recommendation:** ECharts
**Dimensions:** 6 grid columns × 380px height
**Position:** Third row, left

```
┌────────────────────────────────────────────────────┐
│ Yield Curves                    [Currency ▾] [⋯] [⬇]│
├────────────────────────────────────────────────────┤
│                                                    │
│  %                                                   │
│ 4.0 ┤                                              │
│ 3.5 ┤    ●────●────●────●────●────●────●           │
│ 3.0 ┤   ╱ Current (30 Jun 2026)                    │
│ 2.5 ┤  ●  +100bps Shock                            │
│ 2.0 ┤ ╱   -100bps Shock                            │
│ 1.5 ┤●    1M Ago                                   │
│ 1.0 ┤                                              │
│     ┼────┬────┬────┬────┬────┬────┬────┬────      │
│        3M  6M  1Y  2Y  5Y  7Y  10Y  20Y  30Y       │
│                                                    │
│  Key Rates:                                        │
│  3M Euribor: 3.45%  ▲ +0.15 (1M)                  │
│  10Y Bund: 2.52%    ▼ -0.08 (1M)                  │
│  30Y Swap: 2.85%    ▲ +0.02 (1M)                  │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Line Style | Legend Label |
|--------|-------|------------|--------------|
| Current | `#3B82F6` | Solid, 3px | Current (30 Jun 2026) |
| +100bps Shock | `#F43F5E` | Dashed | Parallel +100bps |
| -100bps Shock | `#10B981` | Dashed | Parallel -100bps |
| 1 Month Ago | `#94A3B8` | Dotted | 1 Month Ago |
| 1 Year Ago | `#CBD5E1` | Dotted, 1px | 1 Year Ago |

**Axes:**
- **X-axis:** Tenors — 3M, 6M, 1Y, 2Y, 5Y, 7Y, 10Y, 20Y, 30Y
- **Y-axis:** Yield %, min: 0, max: 5, tick format: "{value}%"

**Demo Data (EUR yield curve, %):**
| Tenor | Current | +100bps | -100bps | 1M Ago | 1Y Ago |
|-------|---------|---------|---------|--------|--------|
| 3M | 3.45 | 4.45 | 2.45 | 3.30 | 3.85 |
| 6M | 3.38 | 4.38 | 2.38 | 3.28 | 3.72 |
| 1Y | 3.25 | 4.25 | 2.25 | 3.18 | 3.55 |
| 2Y | 3.02 | 4.02 | 2.02 | 2.95 | 3.28 |
| 5Y | 2.78 | 3.78 | 1.78 | 2.82 | 3.05 |
| 7Y | 2.68 | 3.68 | 1.68 | 2.75 | 2.95 |
| 10Y | 2.52 | 3.52 | 1.52 | 2.60 | 2.85 |
| 20Y | 2.65 | 3.65 | 1.65 | 2.72 | 2.90 |
| 30Y | 2.85 | 3.85 | 1.85 | 2.83 | 3.05 |

**Interactions:**
- **Hover line:** Tooltip shows exact yield for all curves at that tenor
- **Click point:** Shows historical time series for that tenor
- **Currency selector:** Switch between EUR, USD, GBP curves
- **Shock selector:** Apply parallel, steepener, flattener, or twist shocks

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 6. Deposit Beta Scatter Plot

### 6.1 Component Specification

**Purpose:** Analyze deposit rate pass-through by plotting market rate changes vs. deposit rate changes by product. Identifies pricing power and competitive position.

**Chart Type:** Scatter Plot with Regression Line
**Library Recommendation:** ECharts (scatter + line combo)
**Dimensions:** 6 grid columns × 380px height
**Position:** Third row, right

```
┌────────────────────────────────────────────────────┐
│ Deposit Beta Analysis           [Period ▾] [⋯] [⬇]│
├────────────────────────────────────────────────────┤
│                                                    │
│  Deposit Rate Δ (%)                                │
│  +1.5 ┤                                    ●       │
│  +1.0 ┤                        ●    ●              │
│  +0.5 ┤              ●    ●         ▲              │
│    0  ┼──────────────┼────┼────┼────┼────┼───    │
│  -0.5 ┤              ▼    ▼                        │
│  -1.0 ┤    ●                                         │
│       └────┬────┬────┬────┬────┬────┬────┬───     │
│           -2.0 -1.5 -1.0 -0.5  0.0 +0.5 +1.0 +1.5 │
│                 Market Rate Δ (%)                  │
│                                                    │
│  ─ Regression Line (β = 0.62)                      │
│                                                    │
│  Products:                                         │
│  ● Savings Accounts    β = 0.45  R² = 0.82        │
│  ● Current Accounts    β = 0.28  R² = 0.65        │
│  ● Term Deposits       β = 0.78  R² = 0.91        │
│  ● Corporate Deposits  β = 0.85  R² = 0.88        │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Marker | Legend Label |
|--------|-------|--------|--------------|
| Savings Accounts | `#3B82F6` | Circle (●) | Savings (β=0.45) |
| Current Accounts | `#10B981` | Triangle (▲) | Current (β=0.28) |
| Term Deposits | `#F59E0B` | Square (■) | Term (β=0.78) |
| Corporate Deposits | `#F43F5E` | Diamond (◆) | Corporate (β=0.85) |
| Regression Line | `#8B5CF6` | Dashed line | β = 0.62 |

**Axes:**
- **X-axis:** Market Rate Change (%), min: -2.5, max: +2.5
- **Y-axis:** Deposit Rate Change (%), min: -1.5, max: +2.0

**Demo Data (monthly changes, %):**
| Month | Market Δ | Savings Δ | Current Δ | Term Δ | Corporate Δ |
|-------|----------|-----------|-----------|--------|-------------|
| Jan | +0.25 | +0.10 | +0.05 | +0.20 | +0.22 |
| Feb | +0.50 | +0.22 | +0.12 | +0.40 | +0.45 |
| Mar | +0.00 | -0.05 | -0.02 | +0.05 | +0.08 |
| Apr | -0.25 | -0.12 | -0.08 | -0.18 | -0.20 |
| May | +0.75 | +0.35 | +0.18 | +0.60 | +0.68 |
| Jun | +0.50 | +0.25 | +0.15 | +0.42 | +0.48 |

**Interactions:**
- **Hover point:** Tooltip shows product, month, exact rates
- **Click point:** Drill down to product pricing history
- **Period filter:** 3M, 6M, 1Y, 2Y lookback

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 7. NMD Maturity Profile

### 7.1 Component Specification

**Purpose:** Behavioral maturity profile of Non-Maturity Deposits showing core vs. volatile balances across behavioral tenors. Key for FTP and liquidity risk.

**Chart Type:** Stacked Area Chart
**Library Recommendation:** ECharts
**Dimensions:** 6 grid columns × 380px height
**Position:** Fourth row, left

```
┌────────────────────────────────────────────────────┐
│ NMD Maturity Profile            [Product ▾] [⋯] [⬇]│
├────────────────────────────────────────────────────┤
│                                                    │
│  €B                                                  │
│ 120 ┤                                              │
│ 100 ┤    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  80 ┤    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  60 ┤    ████████████████████████████████████████  │
│  40 ┤                                              │
│  20 ┤                                              │
│   0 ┼────┬────┬────┬────┬────┬────┬────┬────      │
│       O/N  1M   3M   6M   1Y   2Y   3Y   5Y        │
│                                                    │
│  Core (stable): €72.4M  (60%)                      │
│  Semi-volatile: €32.1M  (27%)                      │
│  Volatile: €15.5M  (13%)                           │
│  Total NMD: €120.0M                                │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Legend Label |
|--------|-------|--------------|
| Core (Stable) | `#10B981` | Core (>3Y behavioral) |
| Semi-Volatile | `#3B82F6` | Semi-Volatile (1Y-3Y) |
| Volatile | `#F59E0B` | Volatile (<1Y) |

**Axes:**
- **X-axis:** Behavioral tenors — O/N, 1M, 3M, 6M, 1Y, 2Y, 3Y, 5Y
- **Y-axis:** EUR Billions, min: 0, max: 120

**Demo Data (cumulative NMD allocation, €B):**
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

**Interactions:**
- **Hover area:** Tooltip shows amount and % for each stability category
- **Click area:** Drill down to account-level NMD data
- **Product filter:** Switch between retail, corporate, total NMD

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 8. Derivative Portfolio Table

### 8.1 Component Specification

**Purpose:** Summary table of interest rate derivatives used for hedging. Shows notional, mark-to-market, hedge ratio, and effectiveness.

**Chart Type:** Data Table
**Library Recommendation:** Custom component with ECharts sparklines
**Dimensions:** 6 grid columns × 380px height
**Position:** Fourth row, right

```
┌────────────────────────────────────────────────────┐
│ Derivative Portfolio            [⋯] [⬇] [+ Add]     │
├────────────────────────────────────────────────────┤
│                                                    │
│  Instrument   Notional   MTM    Hedge   Eff.   Exp. │
│  ─────────────────────────────────────────────────  │
│  IR Swap      €2.5B    +€12M   85%    92%    2Y   │
│  IR Swap      €1.8B    -€8M    78%    88%    5Y   │
│  IR Cap       €500M    +€3M    45%    75%    3Y   │
│  IR Floor     €300M    -€1M    30%    65%    3Y   │
│  Swaption     €750M    +€5M    55%    80%    1Y   │
│  ─────────────────────────────────────────────────  │
│  Total        €5.85B   +€11M   72%    85%          │
│                                                    │
│  Hedge Ratio: 72%  🟡 (Target: 80%)               │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Table Styling:**
```
Header: bg #F8FAFC, 12px uppercase, #64748B, font-weight 600
Row height: 44px
Cell padding: 12px 16px
Font: 13px / 500, JetBrains Mono for numbers
Number align: Right
```

**Demo Data:**
| Instrument | Notional | MTM (€M) | Hedge Ratio | Effectiveness | Expiry | Status |
|------------|----------|----------|-------------|---------------|--------|--------|
| IR Swap (Payer) | €2,500M | +12.4 | 85% | 92% | 2Y | 🟢 |
| IR Swap (Receiver) | €1,800M | -8.2 | 78% | 88% | 5Y | 🟢 |
| IR Cap | €500M | +3.1 | 45% | 75% | 3Y | 🟡 |
| IR Floor | €300M | -1.2 | 30% | 65% | 3Y | 🟡 |
| Swaption | €750M | +5.4 | 55% | 80% | 1Y | 🟢 |
| FRA | €200M | +0.8 | 25% | 70% | 6M | 🔴 |

**Interactions:**
- **Click row:** Opens derivative detail panel
- **Sort columns:** Click header to sort
- **Filter:** By instrument type, expiry, effectiveness threshold

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 9. DV01 Dashboard

### 9.1 Component Specification

**Purpose:** Basis Point Value (DV01) sensitivity by currency and tenor. Quantifies interest rate sensitivity in monetary terms for risk limits and hedging decisions.

**Chart Type:** Heatmap + Bar Combo (Matrix)
**Library Recommendation:** ECharts
**Dimensions:** 12 columns (full width) × 400px height
**Position:** Bottom row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ DV01 Dashboard — Sensitivity by Currency & Tenor                    [⋯] [⬇] [📊]           │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  Currency │  O/N   │  3M    │  6M    │  1Y    │  2Y    │  5Y    │  10Y   │  30Y   │ Total │
│  ─────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼───────│
│  EUR      │  0.02  │  0.15  │  0.35  │  0.82  │  1.45  │  2.85  │  3.92  │  4.15  │ 14.71 │
│  USD      │  0.01  │  0.12  │  0.28  │  0.65  │  1.20  │  2.40  │  3.50  │  3.80  │ 12.96 │
│  GBP      │  0.01  │  0.08  │  0.20  │  0.48  │  0.92  │  1.85  │  2.75  │  2.95  │  9.24 │
│  CHF      │  0.00  │  0.05  │  0.12  │  0.28  │  0.55  │  1.10  │  1.65  │  1.80  │  5.55 │
│  JPY      │  0.00  │  0.03  │  0.08  │  0.18  │  0.35  │  0.72  │  1.10  │  1.25  │  3.71 │
│  ─────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼───────│
│  Total    │  0.04  │  0.43  │  1.03  │  2.41  │  4.47  │  8.92  │ 12.92  │ 13.95  │ 46.17 │
│                                                                                            │
│  Units: €M per 1bp parallel shift                                                        │
│  Total DV01: €46.17M  🟢 (Limit: €60M)                                                   │
│                                                                                            │
│  Heatmap: ░ = <1M  ▓ = 1-3M  █ = 3-5M  ██ = >5M                                        │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Heatmap Color Scale:**
| DV01 (€M) | Color |
|-----------|-------|
| < 1.0 | `#D1FAE5` |
| 1.0 – 3.0 | `#6EE7B7` |
| 3.0 – 5.0 | `#34D399` |
| 5.0 – 10.0 | `#F59E0B` |
| > 10.0 | `#F43F5E` |

**Demo Data (DV01 in €M per 1bp):**
| Currency | O/N | 3M | 6M | 1Y | 2Y | 5Y | 10Y | 30Y | Total |
|----------|-----|-----|-----|-----|-----|-----|------|------|-------|
| EUR | 0.02 | 0.15 | 0.35 | 0.82 | 1.45 | 2.85 | 3.92 | 4.15 | 14.71 |
| USD | 0.01 | 0.12 | 0.28 | 0.65 | 1.20 | 2.40 | 3.50 | 3.80 | 12.96 |
| GBP | 0.01 | 0.08 | 0.20 | 0.48 | 0.92 | 1.85 | 2.75 | 2.95 | 9.24 |
| CHF | 0.00 | 0.05 | 0.12 | 0.28 | 0.55 | 1.10 | 1.65 | 1.80 | 5.55 |
| JPY | 0.00 | 0.03 | 0.08 | 0.18 | 0.35 | 0.72 | 1.10 | 1.25 | 3.71 |
| **Total** | **0.04** | **0.43** | **1.03** | **2.41** | **4.47** | **8.92** | **12.92** | **13.95** | **46.17** |

**Interactions:**
- **Hover cell:** Tooltip shows exact DV01, limit, and utilization %
- **Click cell:** Drill down to position-level DV01 breakdown
- **Click total row/column:** Shows aggregated sensitivity report

**Responsive Behavior:**
- Mobile: Scrollable horizontal table
- Tablet+: Full matrix view

---

**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 10. Responsive Layout Summary

| Breakpoint | EVE Heatmap | NII Forecast | Gap Ladder | Yield Curve | Deposit Beta | NMD Profile | Derivatives | DV01 |
|------------|-------------|--------------|------------|-------------|--------------|-------------|-------------|------|
| Mobile | Full width | Full width | Full width | Full width | Full width | Full width | Full width | Scrollable |
| Tablet | 8 col | 4 col | Full width | 6 col | 6 col | 6 col | 6 col | Scrollable |
| Desktop+ | 8 col | 4 col | Full width | 6 col | 6 col | 6 col | 6 col | Full width |

---

*IRRBB Visuals Version 1.0 — ALM Platform Visual Design Team — June 2026*
