# ALM Platform — Capital Adequacy Visual Specification

**Version:** 1.0  
**Last Updated:** 2026-06-25  
**Screen:** Capital Dashboard  
**Context:** Capital monitoring for ALCO, CRO, and regulatory reporting. Covers CET1/AT1/T2 composition, RWA breakdown, output floor, capital ratios, leverage, ICAAP, FRTB, and TLAC/MREL. Designed for capital planning and regulatory compliance discussions.

---

## 1. Dashboard Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Navigation + Context Switcher (Entity: DB AG Cons. | Date: 30 Jun 2026 | Scenario: Base)│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  CAPITAL STACK WATERFALL                   │  │  RWA COMPOSITION SUNBURST            │  │
│  │  (8 columns)                               │  │  (4 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  OUTPUT FLOOR BRIDGE CHART                                                           │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  ┌────────────────────────────────────┐  │
│  │ CAPITAL     │ │ LEVERAGE    │ │ ICAAP       │  │ FRTB SA RISK CHARGE BREAKDOWN      │  │
│  │ RATIO GAUGE │ │ RATIO BAR   │ │ SUMMARY     │  │ (4 columns)                        │  │
│  │ (3 col)     │ │ (3 col)     │ │ (2 col)     │  │                                    │  │
│  └─────────────┘ └─────────────┘ └─────────────┘  └────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  TLAC / MREL STACK                                                                   │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Grid:** 12 columns, 24px gutter, 32px margin  
**Background:** `#F8FAFC` (light) / `#0F172A` (dark)

---

## 2. Capital Stack Waterfall

### 2.1 Component Specification

**Purpose:** Show the composition of total capital from CET1 through AT1 to T2. Waterfall format clearly shows how each tier contributes to the total and where buffers sit.

**Chart Type:** Horizontal Stacked Waterfall
**Library Recommendation:** ECharts
**Dimensions:** 8 grid columns × 420px height
**Position:** Top-left, spans 8 columns

```
┌────────────────────────────────────────────────────────────────────┐
│ Capital Stack Composition                           [Filter] [⋯] [⬇]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  CET1 Capital                                                      │
│  ├─ Common Equity           ████████████████  €42.5B               │
│  ├─ Retained Earnings       ██████████        €28.3B               │
│  ├─ AOCI                    ████              €8.2B                │
│  ├─ Regulatory Deductions   ░░░░             €-5.8B                │
│  ── CET1 Total              ████████████████████████████  €73.2B   │
│                                                                    │
│  AT1 Capital                                                       │
│  ├─ AT1 Instruments         ██████            €12.5B               │
│  ├─ AT1 Deductions          ░░               €-1.2B                │
│  ── AT1 Total               ████████          €11.3B               │
│                                                                    │
│  T2 Capital                                                        │
│  ├─ T2 Instruments          ██████            €8.5B                │
│  ├─ T2 Deductions           ░░               €-0.8B                │
│  ── T2 Total                ██████            €7.7B                │
│                                                                    │
│  ═══════════════════════════════════════════════════════════════   │
│  TOTAL CAPITAL              ████████████████████████████████████   │
│                             €92.2B                                 │
│                                                                    │
│  Risk-Weighted Assets: €698.5B                                     │
│  CET1 Ratio: 10.5%  🟢 (Min: 4.5%, Buffer: 8.0%)                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Bar Style | Legend Label |
|--------|-------|-----------|--------------|
| Common Equity | `#10B981` | Solid | Common Equity |
| Retained Earnings | `#34D399` | Solid | Retained Earnings |
| AOCI | `#6EE7B7` | Solid | AOCI |
| Deductions | `#F43F5E` | Solid (negative) | Deductions |
| AT1 | `#3B82F6` | Solid | AT1 Capital |
| T2 | `#8B5CF6` | Solid | T2 Capital |
| Total | `#1E293B` | Bold border | Total Capital |

**Axes:**
- **X-axis:** EUR Billions, tick format: "€{value}B", min: 0, max: 100
- **Y-axis:** Capital components

**Demo Data:**
| Component | Value (€B) | Color |
|-----------|-----------|-------|
| Common Equity | 42.5 | `#10B981` |
| Retained Earnings | 28.3 | `#34D399` |
| AOCI | 8.2 | `#6EE7B7` |
| Regulatory Deductions | -5.8 | `#F43F5E` |
| **CET1 Total** | **73.2** | `#10B981` |
| AT1 Instruments | 12.5 | `#3B82F6` |
| AT1 Deductions | -1.2 | `#F43F5E` |
| **AT1 Total** | **11.3** | `#3B82F6` |
| T2 Instruments | 8.5 | `#8B5CF6` |
| T2 Deductions | -0.8 | `#F43F5E` |
| **T2 Total** | **7.7** | `#8B5CF6` |
| **Total Capital** | **92.2** | `#1E293B` |

**Interactions:**
- **Hover bar:** Tooltip shows exact value, % of RWA, and regulatory treatment
- **Click component:** Drill down to detailed breakdown
- **Filter:** By entity, consolidation level, reporting standard (CRR vs. local)

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 3. RWA Composition Sunburst / Pie

### 3.1 Component Specification

**Purpose:** Hierarchical breakdown of Risk-Weighted Assets by risk type, sub-type, and portfolio. Sunburst provides maximum information density.

**Chart Type:** Sunburst (or Nested Pie)
**Library Recommendation:** ECharts (sunburst)
**Dimensions:** 4 grid columns × 420px height
**Position:** Top-right, spans 4 columns

```
┌────────────────────────────────────────┐
│ RWA Composition                 [⋯] [⬇]│
├────────────────────────────────────────┤
│                                        │
│              ╭────────╮                │
│            ╭─╯ Credit ╰─╮              │
│           │    72.5%    │              │
│            ╰─╮  €506B  ╭─╯             │
│              ╰────────╯                │
│           ╭───╮    ╭───╮               │
│          ╱ Mkt╲  ╱ Op ╲               │
│         │ 12.5%││ 10.2%│              │
│          ╰─€87B╯  ╰─€71B╯              │
│           ╭─╮                          │
│          ╱CVA╲                         │
│         │4.8%│                         │
│          ╰€34B╯                        │
│                                        │
│  Total RWA: €698.5B                    │
│                                        │
│  Hover for sub-categories              │
│                                        │
└────────────────────────────────────────┘
```

**Data Series (Sunburst Levels):**

**Level 1 (Risk Type):**
| Category | Value (€B) | Color |
|----------|------------|-------|
| Credit Risk | 506.4 | `#3B82F6` |
| Market Risk | 87.3 | `#F59E0B` |
| Operational Risk | 71.2 | `#10B981` |
| CVA Risk | 33.6 | `#F43F5E` |

**Level 2 (Sub-type examples):**
| Parent | Sub-category | Value (€B) |
|--------|--------------|------------|
| Credit Risk | Corporate | 198.5 |
| Credit Risk | Retail | 152.3 |
| Credit Risk | Sovereign | 85.2 |
| Credit Risk | SME | 70.4 |
| Market Risk | FRTB IMA | 45.2 |
| Market Risk | FRTB SA | 28.6 |
| Market Risk | VaR | 13.5 |
| Op Risk | AMA | 35.8 |
| Op Risk | BIA | 35.4 |

**Interactions:**
- **Hover segment:** Tooltip shows value, %, and sub-categories
- **Click segment:** Drill down to portfolio-level RWA list
- **Center click:** Return to top level

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 4. Output Floor Bridge Chart

### 4.1 Component Specification

**Purpose:** Bridge from internal models RWA to floor-adjusted RWA to final RWA. Critical for banks using internal models under Basel III finalization.

**Chart Type:** Waterfall Bridge Chart
**Library Recommendation:** ECharts
**Dimensions:** 12 columns (full width) × 380px height
**Position:** Second row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Output Floor Bridge                                              [⋯] [⬇] [📊]           │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  €B                                                                                       │
│ 800 ┤                                                                                      │
│ 700 ┤    ████████                                                                          │
│ 600 ┤    ████████  ░░░░                                                                    │
│ 500 ┤    ████████  ░░░░  ████                                                              │
│ 400 ┤    ████████  ░░░░  ████  ░░░░                                                      │
│ 300 ┤    ████████  ░░░░  ████  ░░░░  ██                                                  │
│ 200 ┤    ████████  ░░░░  ████  ░░░░  ██                                                  │
│ 100 ┤    ████████  ░░░░  ████  ░░░░  ██                                                  │
│   0 ┼────████████──░░░░──████──░░░░──██───────────────────────                            │
│       IRB     Floor    Standard   Other   Final                                          │
│      RWA    Adj. (+)   RWA (+)   Adj. (-) RWA                                            │
│      512.3   +89.5     +98.7     -2.0   698.5                                           │
│                                                                                            │
│  Output Floor Applied: 72.5% of Standardised                                             │
│  Floor Impact: +€89.5B (+17.5%)                                                          │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Legend Label |
|--------|-------|--------------|
| IRB RWA | `#3B82F6` | Internal Models RWA |
| Floor Adjustment | `#F59E0B` | Output Floor Impact |
| Standardised RWA | `#8B5CF6` | Standardised Approach RWA |
| Other Adjustments | `#F43F5E` | Other Adjustments |
| Final RWA | `#10B981` | Final RWA |

**Demo Data:**
| Step | Value (€B) | Color |
|------|-----------|-------|
| IRB RWA | 512.3 | `#3B82F6` |
| Floor Adjustment | +89.5 | `#F59E0B` |
| Standardised RWA (added) | +98.7 | `#8B5CF6` |
| Other Adjustments | -2.0 | `#F43F5E` |
| **Final RWA** | **698.5** | `#10B981` |

**Interactions:**
- **Hover bar:** Tooltip shows calculation methodology
- **Click bar:** Drill down to asset class-level floor calculation

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 5. Capital Ratio Gauge

### 5.1 Component Specification

**Purpose:** Radial gauge showing CET1, Tier 1, and Total Capital ratios against minimum and buffer requirements.

**Chart Type:** Multi-ring Gauge
**Library Recommendation:** ECharts (gauge)
**Dimensions:** 3 grid columns × 280px height
**Position:** Third row, left

```
┌────────────────────────┐
│ Capital Ratios  [⋯] [⬇]│
├────────────────────────┤
│                        │
│       ╭────────╮       │
│     ╭─╯ CET1   ╰─╮     │
│    │   10.5%     │     │
│    │  ━━━━━━━━━  │     │
│    │   Min: 4.5% │     │
│     ╰─╮ Buffer ╭─╯     │
│       ╰────────╯       │
│                        │
│  🟢 172bps excess      │
│  above buffer          │
│                        │
│  Tier 1: 12.1% 🟢      │
│  Total:  13.2% 🟢      │
│                        │
└────────────────────────┘
```

**Gauge Configuration:**
- Min: 0%, Max: 20%
- Progress bar: `#3B82F6` (CET1), `#8B5CF6` (Tier 1), `#10B981` (Total)
- Threshold bands:
  - 0-4.5%: `#F43F5E` (red zone)
  - 4.5-8.0%: `#F59E0B` (amber zone)
  - 8.0-20%: `#10B981` (green zone)

**Demo Data:**
| Ratio | Value | Minimum | Buffer | Status |
|-------|-------|---------|--------|--------|
| CET1 | 10.5% | 4.5% | 8.0% | 🟢 |
| Tier 1 | 12.1% | 6.0% | 9.5% | 🟢 |
| Total Capital | 13.2% | 8.0% | 11.5% | 🟢 |

**Interactions:**
- **Hover gauge:** Tooltip shows historical ratios
- **Click gauge:** Opens capital ratio trend chart

**Responsive Behavior:**
- Mobile: Full width, stacked vertically
- Tablet: 3 columns side-by-side, or stacked
- Desktop+: 3 col × 1 row as designed

---

## 6. Leverage Ratio Bar

### 6.1 Component Specification

**Purpose:** Simple bar showing Tier 1 capital against exposure measure with leverage ratio calculation.

**Chart Type:** Horizontal Bar
**Library Recommendation:** ECharts
**Dimensions:** 3 grid columns × 280px height
**Position:** Third row, center-left

```
┌────────────────────────┐
│ Leverage Ratio  [⋯] [⬇]│
├────────────────────────┤
│                        │
│  Leverage Ratio        │
│  4.85%                 │
│                        │
│  [████████░░░░░░░░░░] │
│  Min: 3.0%  Target: 5%│
│                        │
│  Tier 1: €84.5B       │
│  Exposure: €1,742B    │
│                        │
│  🟢 +185bps above min  │
│                        │
└────────────────────────┘
```

**Demo Data:**
| Metric | Value |
|--------|-------|
| Tier 1 Capital | €84.5B |
| Exposure Measure | €1,742B |
| Leverage Ratio | 4.85% |
| Minimum | 3.0% |
| Target | 5.0% |

**Interactions:**
- **Hover bar:** Tooltip shows exposure breakdown
- **Click:** Opens leverage ratio detail view

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 7. ICAAP Summary Dashboard

### 7.1 Component Specification

**Purpose:** Summary of Internal Capital Adequacy Assessment Process showing Pillar 1, Pillar 2A, Pillar 2B requirements and total capital need.

**Chart Type:** Stacked Bar + Waterfall
**Library Recommendation:** ECharts
**Dimensions:** 2 grid columns × 280px height
**Position:** Third row, center-right

```
┌────────────────────┐
│ ICAAP Summary      │
├────────────────────┤
│                    │
│  Pillar 1    ████  │
│  €52.4B            │
│                    │
│  Pillar 2A   ██    │
│  €18.5B            │
│                    │
│  Pillar 2B   █     │
│  €8.2B             │
│                    │
│  ────────────────  │
│  Total Need  █████│
│  €79.1B            │
│                    │
│  Surplus     +€13.1│
│  🟢 Adequate       │
│                    │
└────────────────────┘
```

**Demo Data:**
| Pillar | Requirement (€B) | Color |
|--------|-----------------|-------|
| Pillar 1 | 52.4 | `#3B82F6` |
| Pillar 2A | 18.5 | `#F59E0B` |
| Pillar 2B | 8.2 | `#F43F5E` |
| **Total Need** | **79.1** | `#1E293B` |
| Available Capital | 92.2 | `#10B981` |
| **Surplus** | **+13.1** | `#10B981` |

**Interactions:**
- **Hover segment:** Tooltip shows methodology and stress results
- **Click:** Opens ICAAP documentation

**Responsive Behavior:**
- Mobile: Full width, stacked vertically
- Tablet: 2 columns × 2 rows or stacked
- Desktop+: 2 col × 2 rows, compact view

---

## 8. FRTB SA Risk Charge Breakdown

### 8.1 Component Specification

**Purpose:** Breakdown of FRTB Standardised Approach risk charges by risk class. Required for market risk RWA under Basel III finalization.

**Chart Type:** Horizontal Bar Chart
**Library Recommendation:** ECharts
**Dimensions:** 4 grid columns × 280px height
**Position:** Third row, right

```
┌────────────────────────────────────────┐
│ FRTB SA Risk Charge             [⋯] [⬇]│
├────────────────────────────────────────┤
│                                        │
│  DRC          ████████         €12.4B  │
│  Residual     ████              €6.2B  │
│  Equity       ███               €4.8B  │
│  FX           ██                €3.5B  │
│  Commodity    █                 €1.8B  │
│                                        │
│  Total SA RWA: €45.2B                  │
│  IMA RWA: €32.1B                       │
│                                        │
│  [Compare with IMA →]                  │
│                                        │
└────────────────────────────────────────┘
```

**Data Series:**
| Risk Class | RWA (€B) | Color |
|------------|----------|-------|
| Default Risk Charge (DRC) | 12.4 | `#F43F5E` |
| Residual Risk | 6.2 | `#F59E0B` |
| Equity Risk | 4.8 | `#3B82F6` |
| FX Risk | 3.5 | `#8B5CF6` |
| Commodity Risk | 1.8 | `#10B981` |
| Interest Rate (Sens. + DRC) | 16.5 | `#06B6D4` |

**Interactions:**
- **Hover bar:** Tooltip shows risk charge components
- **Click:** Drill down to risk factor sensitivity

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 9. TLAC / MREL Stack

### 9.1 Component Specification

**Purpose:** Show eligible TLAC/MREL instruments stacked against requirement. Critical for resolution planning and MREL compliance.

**Chart Type:** Horizontal Stacked Bar + Requirement Line
**Library Recommendation:** ECharts
**Dimensions:** 12 columns (full width) × 360px height
**Position:** Bottom row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ TLAC / MREL Stack                                                [⋯] [⬇] [📊]           │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  €B                                                                                       │
│ 120 ┤                                                                                      │
│ 100 ┤    ████████████████████████████████                                                  │
│  80 ┤    ████████████████████████████████                                                  │
│  60 ┤    ████████████████████████████████                                                  │
│  40 ┤    ████████████████████████████████  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                  │
│  20 ┤    ████████████████████████████████  TLAC Requirement: €95.2B                       │
│   0 ┼────████████████████████████████████───────────────────────────────                  │
│       CET1   AT1     T2     Senior   Non-Preferred   Total                                │
│       73.2   11.3    7.7     28.5       12.4         €133.1B                             │
│                                                                                            │
│  TLAC Ratio: 22.1%  🟢 (Requirement: 18.0%)                                              │
│  MREL Ratio: 28.5%  🟢 (Requirement: 25.5%)                                              │
│  Excess: €37.9B above TLAC requirement                                                   │
│                                                                                            │
│  ─ Eligible TLAC Instruments  ━ TLAC Requirement  ░ MREL Requirement                       │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Legend Label |
|--------|-------|--------------|
| CET1 | `#10B981` | CET1 |
| AT1 | `#3B82F6` | AT1 |
| T2 | `#8B5CF6` | T2 |
| Senior Unsecured | `#06B6D4` | Senior Unsecured |
| Non-Preferred | `#F59E0B` | Non-Preferred Senior |
| TLAC Requirement | `#F43F5E` (dashed line) | TLAC Requirement |
| MREL Requirement | `#94A3B8` (dotted line) | MREL Requirement |

**Demo Data:**
| Component | Amount (€B) | Eligible for TLAC | Eligible for MREL |
|-----------|-------------|-------------------|-------------------|
| CET1 | 73.2 | Yes | Yes |
| AT1 | 11.3 | Yes | Yes |
| T2 | 7.7 | Yes | Yes |
| Senior Unsecured | 28.5 | Yes | Yes |
| Non-Preferred Senior | 12.4 | Yes | Yes |
| **Total** | **133.1** | **133.1** | **133.1** |
| TLAC Requirement | 95.2 | — | — |
| MREL Requirement | 118.5 | — | — |

**Interactions:**
- **Hover segment:** Tooltip shows instrument list, ISINs, and eligibility criteria
- **Click segment:** Drill down to instrument details

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 10. Responsive Layout Summary

| Breakpoint | Capital Waterfall | RWA Sunburst | Output Floor | Gauge | Leverage | ICAAP | FRTB | TLAC |
|------------|-------------------|--------------|--------------|-------|----------|-------|------|------|
| Mobile | Full width | Full width | Full width | Full width | Full width | Full width | Full width | Full width |
| Tablet | 8 col | 4 col | Full width | 3 col | 3 col | 2 col | 4 col | Full width |
| Desktop+ | 8 col | 4 col | Full width | 3 col | 3 col | 2 col | 4 col | Full width |

---

*Capital Visuals Version 1.0 — ALM Platform Visual Design Team — June 2026*
