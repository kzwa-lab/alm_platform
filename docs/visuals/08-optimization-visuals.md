# ALM Platform — Optimization Visual Specification

**Version:** 1.0  
**Last Updated:** 2026-06-25  
**Screen:** Optimization Dashboard  
**Context:** Strategic optimization tools for ALCO, CFO, and treasury strategy teams. Covers NIM attribution, hedge effectiveness, deposit pricing, loan pipeline, balance sheet planning, what-if scenarios, ALCO pack generation, and regulatory tracking. Designed for strategic decision-making and board presentations.

---

## 1. Dashboard Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Navigation + Context Switcher (Entity: DB AG Cons. | Date: 30 Jun 2026 | Scenario: Base)│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  NIM ATTRIBUTION WATERFALL                 │  │  HEDGE EFFECTIVENESS GAUGE           │  │
│  │  (8 columns)                               │  │  (4 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  DEPOSIT PRICING MATRIX                                                                │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  LOAN ORIGINATION PIPELINE                 │  │  BALANCE SHEET GROWTH PLAN           │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  WHAT-IF SCENARIO BUILDER                                                              │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  ALCO PACK SUMMARY                         │  │  REGULATORY SUBMISSION TRACKER       │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Grid:** 12 columns, 24px gutter, 32px margin  
**Background:** `#F8FAFC` (light) / `#0F172A` (dark)

---

## 2. NIM Attribution Waterfall

### 2.1 Component Specification

**Purpose:** Decompose Net Interest Margin changes into volume effect, rate effect, mix effect, and FTP effect. Critical for explaining NIM movement to ALCO and board.

**Chart Type:** Vertical Waterfall Chart
**Library Recommendation:** ECharts
**Dimensions:** 8 grid columns × 420px height
**Position:** Top-left, spans 8 columns

```
┌────────────────────────────────────────────────────────────────────┐
│ NIM Attribution Analysis                            [Period ▾] [⋯] [⬇]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  bps                                                               │
│  20 ┤                                                              │
│  15 ┤                                    ╭───╮                     │
│  10 ┤                              ╭────╯   │                     │
│   5 ┤                        ╭────╯         │                     │
│   0 ┼──────╮──────────╮────╯              ╭─╯                     │
│  -5 ┤      ╰──────────╯                   │                        │
│ -10 ┤                                     ╰──────╮                │
│ -15 ┤                                            ╰──────╮         │
│ -20 ┤                                                   ╰────────  │
│       NIM(t-1) Volume  Rate   Mix   FTP   NIM(t)                 │
│       185bps   +12    +8    -5    -15   185bps                   │
│                                                                    │
│  NIM unchanged at 1.85% despite significant underlying movements  │
│                                                                    │
│  Volume Effect: +12bps (loan growth)                              │
│  Rate Effect: +8bps (higher market rates)                         │
│  Mix Effect: -5bps (shift to lower-yielding assets)               │
│  FTP Effect: -15bps (tighter FTP spreads)                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Component | Value (bps) | Color |
|-----------|-------------|-------|
| NIM (t-1) | 185 | `#3B82F6` |
| Volume Effect | +12 | `#10B981` |
| Rate Effect | +8 | `#10B981` |
| Mix Effect | -5 | `#F43F5E` |
| FTP Effect | -15 | `#F43F5E` |
| NIM (t) | 185 | `#3B82F6` |

**Axes:**
- **X-axis:** Categories (NIM t-1, Volume, Rate, Mix, FTP, NIM t)
- **Y-axis:** bps, min: -20, max: +20 from baseline

**Interactions:**
- **Hover bar:** Tooltip shows detailed calculation and sub-components
- **Click bar:** Drill down to product-level attribution
- **Period toggle:** Month-over-month, quarter-over-quarter, year-over-year

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 3. Hedge Effectiveness Gauge

### 3.1 Component Specification

**Purpose:** Monitor actual hedge ratio against target. Shows hedge effectiveness and suggests rebalancing actions.

**Chart Type:** Gauge + Mini Trend
**Library Recommendation:** ECharts
**Dimensions:** 4 grid columns × 420px height
**Position:** Top-right, spans 4 columns

```
┌────────────────────────────────────────┐
│ Hedge Effectiveness             [⋯] [⬇]│
├────────────────────────────────────────┤
│                                        │
│           ╭────────╮                   │
│         ╭─╯  72%   ╰─╮                 │
│        │   Actual     │                 │
│        │  ━━━━━━━━━   │                 │
│        │   Target:    │                 │
│         ╰─╮  80%   ╭─╯                 │
│           ╰────────╯                   │
│                                        │
│  Hedge Ratio: 72%  🟡 (Target: 80%)   │
│                                        │
│  Trend (6M):                           │
│  ┌────────────────────────────┐       │
│  │ ▁▂▃▄▅▆▇█                  │       │
│  │ 65% → 72% (+7pp)          │       │
│  └────────────────────────────┘       │
│                                        │
│  [Rebalance Hedge]  [View Details]    │
│                                        │
└────────────────────────────────────────┘
```

**Gauge Configuration:**
- Min: 0%, Max: 100%
- Target: 80% (marked with triangle)
- Color bands:
  - 0-60%: `#F43F5E` (Red)
  - 60-80%: `#F59E0B` (Amber)
  - 80-100%: `#10B981` (Green)

**Demo Data:**
| Metric | Value |
|--------|-------|
| Current Hedge Ratio | 72% |
| Target | 80% |
| 1 Month Ago | 68% |
| 3 Months Ago | 65% |
| Effectiveness (retrospective) | 92% |
| Effectiveness (prospective) | 88% |

**Interactions:**
- **Click gauge:** Opens hedge portfolio detail
- **Click "Rebalance Hedge":** Opens trade recommendation panel

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 4. Deposit Pricing Matrix

### 4.1 Component Specification

**Purpose:** Recommended deposit rates by product and balance tier. Enables standardized pricing across channels and relationship managers.

**Chart Type:** Data Table with Color-coded Rates
**Library Recommendation:** Custom component
**Dimensions:** 12 columns (full width) × 380px height
**Position:** Second row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Deposit Pricing Matrix                                           [Date ▾] [⋯] [⬇] [📊]   │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  Product          │ <€10K │ €10-50K │ €50-100K │ €100-250K │ €250K-1M │ >€1M  │ Floor    │
│  ─────────────────┼───────┼─────────┼──────────┼───────────┼──────────┼───────┼─────────│
│  Savings Account  │ 2.25% │  2.45%  │  2.65%   │   2.85%   │  3.05%   │ 3.25% │ 2.00%   │
│  Term Deposit 3M  │ 3.05% │  3.15%  │  3.25%   │   3.35%   │  3.45%   │ 3.55% │ 2.85%   │
│  Term Deposit 6M  │ 3.15% │  3.25%  │  3.35%   │   3.45%   │  3.55%   │ 3.65% │ 2.95%   │
│  Term Deposit 1Y  │ 3.25% │  3.35%  │  3.45%   │   3.55%   │  3.65%   │ 3.75% │ 3.05%   │
│  Current Account  │ 0.25% │  0.35%  │  0.45%   │   0.55%   │  0.65%   │ 0.75% │ 0.00%   │
│  Business Deposit │ 2.45% │  2.65%  │  2.85%   │   3.05%   │  3.25%   │ 3.45% │ 2.20%   │
│                                                                                            │
│  Color: 🟢 Above FTP  🟡 Within 25bps of FTP  🔴 Below FTP                                  │
│  Floor = FTP rate - 50bps (minimum margin)                                                 │
│                                                                                            │
│  [Export to PDF]  [Send to Branches]  [Compare to Market]                                  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Cell Color Coding:**
| Condition | Color |
|-----------|-------|
| Rate > FTP + 25bps | `#10B981` |
| FTP - 25bps ≤ Rate ≤ FTP + 25bps | `#F59E0B` |
| Rate < FTP - 25bps | `#F43F5E` |

**Demo Data (selected rates):**
| Product | <€10K | €10-50K | €50-100K | €100-250K | €250K-1M | >€1M | FTP | Floor |
|---------|-------|---------|----------|-----------|----------|------|-----|-------|
| Savings | 2.25 | 2.45 | 2.65 | 2.85 | 3.05 | 3.25 | 3.15 | 2.00 |
| Term 3M | 3.05 | 3.15 | 3.25 | 3.35 | 3.45 | 3.55 | 3.42 | 2.85 |
| Term 1Y | 3.25 | 3.35 | 3.45 | 3.55 | 3.65 | 3.75 | 3.28 | 3.05 |
| Current | 0.25 | 0.35 | 0.45 | 0.55 | 0.65 | 0.75 | 0.85 | 0.00 |

**Interactions:**
- **Click cell:** Opens rate history and competitive benchmarking
- **Edit mode:** Inline editing with approval workflow
- **"Compare to Market":** Shows competitor rates side-by-side

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 5. Loan Origination Pipeline

### 5.1 Component Specification

**Purpose:** Track loan applications through the approval process. Shows pipeline value and conversion rates.

**Chart Type:** Funnel / Pipeline Chart
**Library Recommendation:** ECharts (funnel)
**Dimensions:** 6 grid columns × 380px height
**Position:** Third row, left

```
┌────────────────────────────────────────────────────┐
│ Loan Origination Pipeline       [⋯] [⬇] [+ New]    │
├────────────────────────────────────────────────────┤
│                                                    │
│  Applications                                    │
│  ┌────────────────────────────────────────────┐   │
│  │         €2,450M  (142 deals)              │   │
│  └────────────────────────────────────────────┘   │
│            ↓ 68% conversion                       │
│  Under Review                                      │
│  ┌────────────────────────────────────┐           │
│  │      €1,665M  (98 deals)          │           │
│  └────────────────────────────────────┘           │
│            ↓ 82% conversion                       │
│  Approved                                          │
│  ┌────────────────────────────┐                   │
│  │    €1,365M  (72 deals)    │                   │
│  └────────────────────────────┘                   │
│            ↓ 91% conversion                       │
│  Disbursed                                       │
│  ┌──────────────────┐                             │
│  │  €1,242M (65)   │                             │
│  └──────────────────┘                             │
│                                                    │
│  YTD Origination: €6,850M  🟢 (+12% vs PY)        │
│  Avg Ticket: €19.1M                                │
│  Avg Margin: 1.85%                                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Funnel Colors:**
| Stage | Color | Width |
|-------|-------|-------|
| Applications | `#3B82F6` | 100% |
| Under Review | `#8B5CF6` | 68% |
| Approved | `#F59E0B` | 56% |
| Declined | `#F43F5E` | — |
| Disbursed | `#10B981` | 51% |

**Demo Data:**
| Stage | Value (€M) | Count | Conversion |
|-------|-----------|-------|------------|
| Applications | 2,450 | 142 | — |
| Under Review | 1,665 | 98 | 68% |
| Approved | 1,365 | 72 | 82% |
| Declined | 300 | 26 | 18% |
| Disbursed | 1,242 | 65 | 91% |

**Interactions:**
- **Click stage:** Opens deal list for that stage
- **Hover:** Shows average time in stage
- **"+ New":** Opens loan application form

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 6. Balance Sheet Growth Plan

### 6.1 Component Specification

**Purpose:** Compare actual balance sheet composition against strategic targets. Shows progress toward ALCO-approved plan.

**Chart Type:** Grouped Bar Chart (Actual vs. Target)
**Library Recommendation:** ECharts
**Dimensions:** 6 grid columns × 380px height
**Position:** Third row, right

```
┌────────────────────────────────────────────────────┐
│ Balance Sheet Plan              [⋯] [⬇] [📊]       │
├────────────────────────────────────────────────────┤
│                                                    │
│  €B                                                │
│ 200 ┤                                              │
│ 180 ┤    ████  ░░░░                                │
│ 160 ┤    ████  ░░░░  ████  ░░░░                    │
│ 140 ┤    ████  ░░░░  ████  ░░░░  ████  ░░░░       │
│ 120 ┤    ████  ░░░░  ████  ░░░░  ████  ░░░░       │
│ 100 ┤    ████  ░░░░  ████  ░░░░  ████  ░░░░       │
│     ┼────┬────┬────┬────┬────┬────┬────┬────      │
│        Loans  Securities  Deposits  Wholesale       │
│        Actual Target   Actual Target                │
│                                                    │
│  Loans: €125B actual vs €130B target (-3.8%)      │
│  Securities: €45B vs €42B (+7.1%)                 │
│  Deposits: €98B vs €100B (-2.0%)                  │
│  Wholesale: €32B vs €30B (+6.7%)                  │
│                                                    │
│  Loan/Deposit Ratio: 127%  🟡 (Target: 130%)      │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Legend Label |
|--------|-------|--------------|
| Actual | `#3B82F6` | Actual |
| Target | `#94A3B8` | Target (dashed border) |

**Demo Data:**
| Category | Actual (€B) | Target (€B) | Variance |
|----------|-------------|-------------|----------|
| Loans | 125.0 | 130.0 | -3.8% |
| Securities | 45.0 | 42.0 | +7.1% |
| Deposits | 98.0 | 100.0 | -2.0% |
| Wholesale | 32.0 | 30.0 | +6.7% |
| Total Assets | 202.0 | 202.0 | 0.0% |

**Interactions:**
- **Hover bar:** Tooltip shows variance explanation
- **Click bar:** Opens plan vs. actual detail

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 7. What-If Scenario Builder

### 7.1 Component Specification

**Purpose:** Interactive scenario builder with slider controls for rate, volume, and mix assumptions. Enables ALCO to model strategic decisions in real-time.

**Component Type:** Interactive Builder with Live Chart
**Library Recommendation:** Custom component + ECharts
**Dimensions:** 12 columns (full width) × 480px height
**Position:** Fourth row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ What-If Scenario Builder                                          [Reset] [Save] [Share]  │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌──────────────────────┐  ┌──────────────────────────────────────────────────────────┐  │
│  │  ASSUMPTIONS         │  │  IMPACT                                                  │  │
│  │                      │  │                                                          │  │
│  │  Rate Assumptions:   │  │  NIM Projection                                          │  │
│  │                      │  │  ┌────────────────────────────────────────────────┐     │  │
│  │  ▓▓▓▓▓▓▓░░░░░░░░░░  │  │  │ Base: ─────── 1.85%                            │     │  │
│  │  ECB Rate: +50bps   │  │  │ Scenario: ──── 2.12%  ▲ +27bps                 │     │  │
│  │  Current: 3.50%     │  │  │                                                │     │  │
│  │  [====●====]        │  │  │  €M                                            │     │  │
│  │                      │  │  │ 4,000 ┤                              ╭────╮   │     │  │
│  │  ▓▓▓▓▓▓▓▓▓▓░░░░░░░  │  │  │ 3,500 ┤                         ╭───╯    │   │     │  │
│  │  Loan Growth: +8%   │  │  │ 3,000 ┤                    ╭────╯         │   │     │  │
│  │  [========●====]    │  │  │       └────┬────┬────┬────┬────┬────┬────┘   │     │  │
│  │                      │  │  │         Q3   Q4   Q1   Q2   Q3   Q4         │     │  │
│  │  ▓▓▓▓▓░░░░░░░░░░░░  │  │  │                                            │     │  │
│  │  Deposit Beta: 0.65 │  │  │  Revenue Impact: +€145M annually            │     │  │
│  │  [====●========]    │  │  │  Capital Impact: +€12M RWA                  │     │  │
│  │                      │  │  │  CET1 Impact: -2bps                         │     │  │
│  │  ▓▓▓▓▓▓▓▓▓░░░░░░░  │  │  │                                            │     │  │
│  │  Mix Shift: +5% to  │  │  └────────────────────────────────────────────────┘     │  │
│  │  floating rate      │  │                                                          │  │
│  │  [=======●=====]    │  │  [Export to ALCO Pack]  [Run Full Simulation]           │  │
│  │                      │  │                                                          │  │
│  │  [Apply Scenario]    │  │                                                          │  │
│  └──────────────────────┘  └──────────────────────────────────────────────────────────┘  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Slider Styling:**
```
Track: height 8px, border-radius 4px, bg #E2E8F0
Fill: bg #3B82F6
Thumb: 20px circle, bg #FFFFFF, border 2px #3B82F6
Label: 13px / 500, current value below slider
```

**Demo Assumptions:**
| Parameter | Base | Scenario | Range |
|-----------|------|----------|-------|
| ECB Rate | 3.50% | +50bps | ±200bps |
| Loan Growth | +5% | +8% | -10% to +20% |
| Deposit Beta | 0.55 | 0.65 | 0.20 to 1.00 |
| Floating Mix | 45% | 50% | 20% to 80% |
| Wholesale Funding Cost | +25bps | +50bps | -50 to +150bps |

**Live Impact Calculation:**
| Metric | Base | Scenario | Delta |
|--------|------|----------|-------|
| NIM | 1.85% | 2.12% | +27bps |
| NII (annual) | €3,245M | €3,390M | +€145M |
| EVE | -8.2% | -10.5% | -2.3pp |
| CET1 Ratio | 12.4% | 12.2% | -20bps |

**Interactions:**
- **Drag slider:** Real-time chart update (debounced 100ms)
- **Click "Apply Scenario":** Locks scenario and runs full simulation
- **Click "Export to ALCO Pack":** Adds scenario to ALCO presentation
- **Click "Save":** Saves scenario for later comparison

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 8. ALCO Pack Summary

### 8.1 Component Specification

**Purpose:** One-page executive summary for ALCO meetings and board presentations. Condenses all key metrics into a printable/shareable format.

**Component Type:** Summary Card with Key Metrics
**Library Recommendation:** Custom component
**Dimensions:** 6 grid columns × 400px height
**Position:** Bottom row, left

```
┌────────────────────────────────────────────────────┐
│ ALCO Pack Summary — June 2026    [Generate] [📥]   │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌────────────────────────────────────────────┐   │
│  │  EXECUTIVE SUMMARY                         │   │
│  │                                            │   │
│  │  Liquidity: LCR 136.2% 🟢  NSFR 108.3% 🟡 │   │
│  │  Capital:   CET1 12.4% 🟢  Total 13.2% 🟢  │   │
│  │  ECL:       €3,245M  ▲ +2.7%              │   │
│  │  NIM:       1.85%    ▼ -5bps              │   │
│  │  EVE:       -8.2%    🟢                   │   │
│  │                                            │   │
│  │  KEY TOPICS FOR DISCUSSION:               │   │
│  │  • LCR trending down, review HQLA plan   │   │
│  │  • NIM pressure, deposit pricing review  │   │
│  │  • ECL overlay approval required         │   │
│  │                                            │   │
│  │  ACTIONS REQUIRED:                        │   │
│  │  □ Approve FTP curve update              │   │
│  │  □ Review liquidity stress results       │   │
│  │  □ Authorize ECL overlay €4.2M          │   │
│  │                                            │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  Last Generated: 25 Jun 2026, 08:00               │
│  Next ALCO: 2 Jul 2026, 10:00 CET                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Summary Card Styling:**
```
Background: #FFFFFF
Border: 2px solid #3B82F6 (accent)
Border-radius: 12px
Padding: 24px
```

**Metric Display:**
```
Label: 13px / 500 / #64748B
Value: 24px / 700 / #334155
Status: 14px / 600 with color
Trend: 12px / 500 with arrow
```

**Checklist Items:**
```
Checkbox: 18px, #3B82F6 when checked
Label: 14px / 500 / #334155
Done: strikethrough, #94A3B8
```

**Interactions:**
- **Click "Generate":** Creates full ALCO pack (PDF, ~20 pages)
- **Click metric:** Navigates to relevant module
- **Click checkbox:** Toggles action item status

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 9. Regulatory Submission Tracker

### 9.1 Component Specification

**Purpose:** Track regulatory submission deadlines, status, and assigned owners. Ensures no missed deadlines.

**Component Type:** Timeline / Kanban Board
**Library Recommendation:** Custom component
**Dimensions:** 6 grid columns × 400px height
**Position:** Bottom row, right

```
┌────────────────────────────────────────────────────┐
│ Regulatory Tracker              [+ Add] [⋯] [⬇]    │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌────────────────────────────────────────────┐   │
│  │ OVERDUE (1)                                │   │
│  │ 🔴 ECB LCR Report    Due: 15 Jun          │   │
│  │    Owner: M. Schmidt  [Escalate]           │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  ┌────────────────────────────────────────────┐   │
│  │ DUE THIS WEEK (2)                          │   │
│  │ 🟡 EBA Stress Test   Due: 30 Jun          │   │
│  │    Owner: K. Weber    [View]               │   │
│  │ 🟡 FINREP Corep      Due: 30 Jun          │   │
│  │    Owner: A. Mueller  [View]               │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  ┌────────────────────────────────────────────┐   │
│  │ UPCOMING (3)                               │   │
│  │ 🟢 Pillar 3 Report   Due: 15 Jul          │   │
│  │    Owner: L. Fischer  [View]               │   │
│  │ 🟢 ICAAP Update      Due: 31 Jul          │   │
│  │    Owner: J. Mueller  [View]               │   │
│  │ 🟢 Recovery Plan     Due: 31 Aug          │   │
│  │    Owner: S. Braun    [View]               │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Status Colors:**
| Status | Color | Background |
|--------|-------|------------|
| Overdue | `#F43F5E` | `#FFF1F2` |
| Due This Week | `#F59E0B` | `#FFFBEB` |
| Upcoming | `#10B981` | `#ECFDF5` |
| Completed | `#3B82F6` | `#EEF2FF` |

**Demo Data:**
| Submission | Deadline | Owner | Status | Entity |
|------------|----------|-------|--------|--------|
| ECB LCR Report | 15 Jun 2026 | M. Schmidt | 🔴 Overdue | DB AG |
| EBA Stress Test | 30 Jun 2026 | K. Weber | 🟡 Due Soon | Consolidated |
| FINREP COREP | 30 Jun 2026 | A. Mueller | 🟡 Due Soon | DB AG |
| Pillar 3 Report | 15 Jul 2026 | L. Fischer | 🟢 On Track | DB AG |
| ICAAP Update | 31 Jul 2026 | J. Mueller | 🟢 On Track | Consolidated |
| Recovery Plan | 31 Aug 2026 | S. Braun | 🟢 On Track | DB AG |

**Interactions:**
- **Click item:** Opens submission detail with checklist
- **Click owner:** Shows owner's workload
- **Click "+ Add":** Creates new submission tracker

---


**Responsive Behavior:**
- Mobile: Full width, stacked vertically, scrollable if needed
- Tablet: Side-by-side where space permits, otherwise stacked
- Desktop+: Full layout as specified

## 10. Responsive Layout Summary

| Breakpoint | NIM Waterfall | Hedge Gauge | Pricing Matrix | Pipeline | Balance Sheet | What-If | ALCO Pack | Tracker |
|------------|---------------|-------------|----------------|----------|---------------|---------|-----------|---------|
| Mobile | Full width | Full width | Scrollable | Full width | Full width | Full width | Full width | Full width |
| Tablet | 8 col | 4 col | Scrollable | 6 col | 6 col | Full width | 6 col | 6 col |
| Desktop+ | 8 col | 4 col | Full width | 6 col | 6 col | Full width | 6 col | 6 col |

---

*Optimization Visuals Version 1.0 — ALM Platform Visual Design Team — June 2026*
