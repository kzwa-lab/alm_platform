# ALM Platform — Landing Dashboard Visual Specification

**Version:** 1.0  
**Last Updated:** 2026-06-25  
**Screen:** ALCO Landing Dashboard (Home)  
**Context:** Main entry point for ALCO members and treasury staff. Designed for quick situational awareness, immediate threat identification, and one-click access to all modules. Optimized for large-screen display with 4-6m viewing distance.

---

## 1. Dashboard Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Navigation Bar (56px) — See 01-navigation-shell.md                                    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Context Switcher Bar (52px) — Entity / Date / Scenario                                     │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│  │  CET1   │ │   LCR   │ │  NSFR   │ │  EVE Δ  │ │   NIM   │ │   RWA   │                │
│  │  12.4%  │ │ 136.2%  │ │ 108.3%  │ │  -8.2%  │ │  1.85%  │ │ €184.2B │                │
│  │   ↑     │ │   ↓     │ │   →     │ │   ↑     │ │   ↓     │ │   ↑     │                │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘                │
│                                                                                            │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────────────────────┐  │
│  │     ALERT PANEL              │  │         TREND SPARKLINES (7D / 30D)              │  │
│  │  ┌────────────────────────┐  │  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ 🟢 System Normal       │  │  │  │ [Sparkline grid: 3×2 mini charts]           │  │  │
│  │  │ 🟡 LCR Watch (118.3%)  │  │  │  │                                             │  │  │
│  │  │ 🔴 ECL Overlay Pending │  │  │  │  CET1  LCR   NSFR  EVE    NIM   RWA        │  │  │
│  │  │ 🟡 NSFR Approaching    │  │  │  │  ▁▂▃   ▃▂▁   ▂▃▄   ▁▂▁   ▃▂▁   ▂▃▄       │  │  │
│  │  └────────────────────────┘  │  │  │  ▅▆▇   █▆▅   ▅▆▇   ▅▆▇   █▆▅   ▆▇█       │  │  │
│  │  [View All Alerts →]         │  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────┘  └──────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────────────────────┐  │
│  │     ACTION ITEMS             │  │         NEWS & REGULATORY FEED                   │  │
│  │  ┌────────────────────────┐  │  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ ⏳ 3 Pending Approvals │  │  │  │ • ECB Publishes New LCR Guidance...         │  │  │
│  │  │ 📅 ALCO Meeting 2 Jul  │  │  │  │ • EBA Stress Test Results Due Q3...         │  │  │
│  │  │ 📝 FTP Curve Review    │  │  │  │ • IFRS 9 Amendments Effective 2027...       │  │  │
│  │  │ 🔍 Capital Plan Review │  │  │  │ • Basel III Finalization Timeline...        │  │  │
│  │  └────────────────────────┘  │  │  └────────────────────────────────────────────┘  │  │
│  │  [View Task Center →]        │  │  [View All Updates →]                            │  │
│  └──────────────────────────────┘  └──────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────────────────────┐  │
│  │     QUICK LINKS              │  │         CALENDAR WIDGET                          │  │
│  │  ┌──┬──┬──┬──┬──┬──┬──┐    │  │  ┌────────────────────────────────────────────┐  │  │
│  │  │💧│📈│🛡│⚠│🔄│🎯│📋│    │  │  │      June 2026                             │  │  │
│  │  │Li│IR│Ca│EC│FT│Op│Re│    │  │  │  Mo Tu We Th Fr Sa Su                      │  │  │
│  │  └──┴──┴──┴──┴──┴──┴──┘    │  │  │       1  2  3  4  5  6  7                  │  │  │
│  │  [7 module icons in a row]   │  │  │   8  9 10 11 12 13 14                    │  │  │
│  │                              │  │  │  15 16 17 18 19 20 21                    │  │  │
│  │                              │  │  │  22 23 24 25 26▸27 28                    │  │  │
│  │                              │  │  │  29 30                                    │  │  │
│  └──────────────────────────────┘  │  │                                             │  │  │
│                                    │  │  ▸ Today — ALCO Prep Deadline              │  │  │
│                                    │  │  30 Jun — Quarter-End Reporting            │  │  │
│                                    │  │  2 Jul  — ALCO Meeting (10:00 CET)        │  │  │
│                                    │  │  15 Jul — ECB LCR Submission             │  │  │
│                                    │  └────────────────────────────────────────────┘  │  │
│                                    └──────────────────────────────────────────────────┘  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Grid Layout:** 12 columns, 24px gutter, 32px page margin  
**Breakpoint:** wide (≥1280px) — primary target for ALCO displays  
**Background:** `#F8FAFC` (light) / `#0F172A` (dark)

---

## 2. KPI Cards (Top Row)

### 2.1 KPI Card Component

**Purpose:** Provide at-a-glance view of the six most critical ALM metrics. Each card shows current value, trend direction, and sparkline thumbnail. Color-coded status for immediate threat recognition.

**Component Type:** Elevated KPI Card with top accent border
**Library Recommendation:** Custom React/Vue component + ECharts for sparkline
**Dimensions:** ~200px × 140px per card (flex: 1, min-width: 180px)
**Position:** Top row, spans full 12-column width, 6 cards in horizontal flex row

```
┌────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← 4px top accent bar (color = status)
│                                    │
│  CET1 Ratio              [i]       │  ← Label + info icon
│                                    │
│  12.4%                             │  ← Hero value, 48px / 800
│  ┌────────────────────────────┐   │
│  │ ▁▂▃▄▅▆▇█                  │   │  ← Sparkline (mini)
│  └────────────────────────────┘   │
│  ▲ +0.3pp vs last month            │  ← Trend indicator
│  Target: ≥ 10.5%                   │  ← Threshold reference
└────────────────────────────────────┘
```

**Card Styling:**
```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border-radius: 12px
Padding: 20px
Shadow: 0 1px 3px rgba(15, 23, 42, 0.08)
Top accent: 4px solid [status color]
```

**Top Accent Colors:**
| Status | Color | Condition |
|--------|-------|-----------|
| Compliant | `#10B981` | Value ≥ green threshold |
| Watch | `#F59E0B` | Value in amber zone |
| Breach | `#F43F5E` | Value < minimum threshold |
| Neutral | `#3B82F6` | Non-threshold metric (e.g., RWA) |

### 2.2 KPI Definitions

| KPI | Current Value | Threshold | Status | Color | Trend |
|-----|---------------|-----------|--------|-------|-------|
| **CET1 Ratio** | 12.4% | ≥ 10.5% (green), ≥ 8.0% (min) | 🟢 Compliant | `#10B981` | ▲ +0.3pp MoM |
| **LCR** | 136.2% | ≥ 120% (green), ≥ 100% (min) | 🟢 Compliant | `#10B981` | ▼ -2.1pp MoM |
| **NSFR** | 108.3% | ≥ 105% (green), ≥ 100% (min) | 🟡 Watch | `#F59E0B` | → 0.0pp MoM |
| **EVE Sensitivity** | -8.2% | ≥ -10% (green), ≥ -15% (min) | 🟢 Compliant | `#10B981` | ▲ +1.2pp (improved) |
| **NIM** | 1.85% | ≥ 2.0% (green), ≥ 1.5% (min) | 🟡 Watch | `#F59E0B` | ▼ -0.05pp MoM |
| **Total RWA** | €184.2B | N/A (directional) | 🔵 Neutral | `#3B82F6` | ▲ +1.2% MoM |

### 2.3 KPI Sparkline (Mini Chart)

**Chart Type:** Sparkline (line, no axes, no labels)
**Library:** ECharts (grid: {top:0,bottom:0,left:0,right:0})
**Dimensions:** Card width × 32px height
**Data:** 30 daily data points

**Data Series:**
| Series | Color | Line Style | Fill | Width |
|--------|-------|------------|------|-------|
| KPI value | `#3B82F6` | solid | `#3B82F6` at 10% opacity | 2px |
| Threshold line | `#94A3B8` | dashed | none | 1px |

**Sparkline Demo Data (CET1 Ratio — 30 days):**
```
12.05, 12.08, 12.10, 12.12, 12.15, 12.13, 12.14, 12.16, 12.18, 12.20,
12.22, 12.21, 12.23, 12.25, 12.24, 12.26, 12.28, 12.30, 12.32, 12.31,
12.33, 12.35, 12.36, 12.38, 12.37, 12.39, 12.40, 12.41, 12.42, 12.40
```

**Sparkline Demo Data (LCR — 30 days):**
```
138.5, 138.2, 137.8, 137.5, 137.0, 136.8, 136.5, 136.0, 135.8, 135.5,
135.2, 134.8, 134.5, 134.0, 133.8, 133.5, 133.2, 132.8, 132.5, 132.0,
131.8, 131.5, 131.2, 130.8, 130.5, 130.2, 129.8, 129.5, 129.0, 136.2
```

**Interactions:**
- **Hover:** Card elevates (shadow-lg), sparkline shows tooltip with exact value for hovered day
- **Click:** Navigates to respective module detail page (e.g., CET1 → Capital module)
- **Right-click:** Context menu — "View Details", "Add to Favorites", "Export Data"

**Responsive Behavior:**
- Mobile: 2 columns × 3 rows, cards stack vertically
- Tablet: 3 columns × 2 rows
- Desktop+: 6 columns × 1 row, full horizontal layout

---

## 3. Alert Panel

### 3.1 Alert Panel Component

**Purpose:** Centralized display of active alerts requiring attention. Traffic light system for immediate visual prioritization. Designed to be the first thing ALCO members check.

**Component Type:** Alert List Card with severity indicators
**Library Recommendation:** Custom component
**Dimensions:** 4 grid columns × auto height (~280px)
**Position:** Middle-left, below KPI row

```
┌────────────────────────────────────┐
│ 🔔 Active Alerts          [View All]│
├────────────────────────────────────┤
│ 🟢 System Normal                   │
│    All critical metrics within     │
│    acceptable thresholds.          │
│                                    │
│ 🟡 LCR Watch — 118.3%              │
│    DE subsidiary LCR approaching   │
│    120% warning threshold.         │
│    [View]  [Dismiss]               │
│                                    │
│ 🔴 ECL Overlay Pending Approval    │
│    EUR 4.2M climate risk overlay   │
│    requires Risk Committee sign-off│
│    [Review]  [Escalate]            │
│                                    │
│ 🟡 NSFR Approaching Limit          │
│    Wholesale funding concentration │
│    at 28% (limit: 30%).           │
│    [View Details]                  │
└────────────────────────────────────┘
```

**Card Styling:**
```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border-radius: 12px
Padding: 20px
```

**Alert Item Styling:**
```
Padding: 12px 0
Border-bottom: 1px solid #F1F5F9 (between items)
Icon: 20px, left side
Title: 14px / 600
Body: 13px / 400 / #64748B
Actions: 12px / 500, primary color links
```

**Severity Colors:**
| Severity | Icon | BG Tint | Border | Usage |
|----------|------|---------|--------|-------|
| Critical | XCircle | `#FFF1F2` | `#F43F5E` | Breach, immediate action |
| Warning | AlertTriangle | `#FFFBEB` | `#F59E0B` | Approaching threshold |
| Info | Info | `#EEF2FF` | `#3B82F6` | Notification, no action needed |
| Success | CheckCircle | `#ECFDF5` | `#10B981` | All clear, resolved |

**Demo Data:**
| Severity | Title | Description | Time | Actions |
|----------|-------|-------------|------|---------|
| 🟢 Success | System Normal | All critical metrics within acceptable thresholds | Now | — |
| 🟡 Warning | LCR Watch — 118.3% | DE subsidiary LCR approaching 120% warning threshold | 12 min ago | View, Dismiss |
| 🔴 Critical | ECL Overlay Pending | EUR 4.2M climate risk overlay requires Risk Committee sign-off by 30 Jun | 1h ago | Review, Escalate |
| 🟡 Warning | NSFR Approaching Limit | Wholesale funding concentration at 28% (limit: 30%) | 3h ago | View Details |
| 🔵 Info | FTP Curve Updated | Monthly FTP curve updated for July 2026 | 5h ago | Acknowledge |

**Interactions:**
- **Click alert:** Expands to show full detail (accordion style) or opens detail slide-over
- **Click action button:** Executes action (e.g., "Review" opens approval workflow)
- **Dismiss:** Alert moves to "Dismissed" section, requires confirmation for critical alerts
- **View All:** Navigates to full Notification Center (see 01-navigation-shell.md)

**Responsive Behavior:**
- Mobile: Full width, stacked below KPIs
- Tablet+: 4 columns, fixed width

---

## 4. Trend Sparklines Panel

### 4.1 Sparkline Grid Component

**Purpose:** Expanded 7-day and 30-day trend views for all six KPIs in a compact grid format. Allows quick comparison of metric trajectories.

**Component Type:** Sparkline Grid Card
**Library Recommendation:** ECharts (6 independent sparkline instances)
**Dimensions:** 8 grid columns × ~280px height
**Position:** Middle-right, spans 8 columns, aligned with Alert Panel

```
┌────────────────────────────────────────────────────────────────────┐
│ Trend Overview                                      [7D] [30D] [▾]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  CET1 Ratio        LCR              NSFR                           │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                     │
│  │ ▁▂▃▄▅▆▇ │    │ ▃▂▁▂▃▄▅▆ │    │ ▂▃▄▃▂▃▄▅ │                     │
│  │ ████████ │    │ ████████ │    │ ████████ │                     │
│  └──────────┘    └──────────┘    └──────────┘                     │
│  12.4%  ▲+0.3   136.2% ▼-2.1   108.3% → 0.0                     │
│                                                                    │
│  EVE Δ            NIM              Total RWA                       │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                     │
│  │ ▁▁▂▃▄▅▆▇ │    │ ▇▆▅▄▃▂▁▁ │    │ ▂▃▄▅▆▇██ │                     │
│  │ ████████ │    │ ████████ │    │ ████████ │                     │
│  └──────────┘    └──────────┘    └──────────┘                     │
│  -8.2%  ▲+1.2   1.85%  ▼-0.05  €184.2B ▲+1.2%                   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Sparkline Specifications (per mini-chart):**
| Property | Value |
|----------|-------|
| Width | ~180px |
| Height | 48px |
| Grid | No axes, no labels |
| Line color | Status color (green/amber/red/blue) |
| Fill | Gradient from line color to transparent, 15% opacity |
| Line width | 2px |
| Area | Smooth curve (tension: 0.3) |
| Data points | 7 (7D view) or 30 (30D view) |

**Toggle Buttons:**
```
[7D] [30D] [Custom ▾]
Style: Pill toggle group
Active: bg #3B82F6, text #FFFFFF, border-radius 16px
Inactive: bg transparent, text #64748B, border 1px #CBD5E1
Gap: 4px
```

**Demo Data (7-day CET1):**
```
Day:    Mon    Tue    Wed    Thu    Fri    Sat    Sun
Value:  12.35  12.36  12.38  12.40  12.39  12.40  12.40
```

**Demo Data (7-day LCR):**
```
Day:    Mon    Tue    Wed    Thu    Fri    Sat    Sun
Value:  138.5  137.2  136.0  135.1  134.8  135.5  136.2
```

**Interactions:**
- **Hover sparkline:** Tooltip shows exact value for that data point with date label
- **Click sparkline:** Navigates to full trend chart in respective module
- **Toggle 7D/30D:** Switches data density, smooth animation transition (400ms)
- **Custom dropdown:** Date range picker for arbitrary periods

**Responsive Behavior:**
- Mobile: 2 columns × 3 rows (scrollable horizontally if needed)
- Tablet: 3 columns × 2 rows
- Desktop+: 3 columns × 2 rows, full size

---

## 5. Action Items Widget

### 5.1 Action Items Component

**Purpose:** Display pending tasks, approvals, and upcoming meetings that require user action. Drives workflow completion from the landing page.

**Component Type:** Task List Card
**Library Recommendation:** Custom component
**Dimensions:** 6 grid columns × auto height (~240px)
**Position:** Bottom-left, below Alert Panel

```
┌────────────────────────────────────────────────────┐
│ 📋 Action Items                         [Task Center]│
├────────────────────────────────────────────────────┤
│                                                    │
│ ⏳ Pending Approvals (3)                           │
│ ┌────────────────────────────────────────────────┐ │
│ │ 🔵 ECL Overlay EUR 4.2M      Due: 30 Jun      │ │
│ │    Awaiting Risk Committee sign-off            │ │
│ │    [Review →]                                  │ │
│ ├────────────────────────────────────────────────┤ │
│ │ 🔵 FTP Curve Update          Due: 28 Jun      │ │
│ │    Awaiting Treasury Head approval             │ │
│ │    [Review →]                                  │ │
│ ├────────────────────────────────────────────────┤ │
│ │ 🔵 Liquidity Limit Override  Due: 27 Jun      │ │
│ │    Awaiting CRO approval                       │ │
│ │    [Review →]                                  │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ 📅 Upcoming ALCO Meetings                          │
│ ┌────────────────────────────────────────────────┐ │
│ │ 📅 ALCO Monthly Meeting      2 Jul 2026, 10:00│ │
│ │    Agenda: LCR Stress Results, Capital Plan    │ │
│ │    [View Agenda →]                             │ │
│ ├────────────────────────────────────────────────┤ │
│ │ 📅 ALCO Extraordinary        15 Jul 2026, 14:00│ │
│ │    Topic: IRRBB Strategy Review                │ │
│ │    [View Agenda →]                             │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Section Headers:**
```
Font: 14px / 600 / #334155
Icon: 16px, left of text, #3B82F6
Count badge: 14px / 700 / #FFFFFF, bg #3B82F6, border-radius 12px, padding 2px 8px
```

**Task Item Styling:**
```
Background: #F8FAFC
Border: 1px solid #E2E8F0
Border-radius: 8px
Padding: 12px 16px
Margin-bottom: 8px
```

**Priority Indicators:**
| Priority | Left Border | Icon | Usage |
|----------|-------------|------|-------|
| High | 3px `#F43F5E` | Clock (overdue) | Past due date |
| Medium | 3px `#F59E0B` | AlertCircle | Due within 48h |
| Normal | 3px `#3B82F6` | Circle | Standard priority |

**Demo Data:**
| Task | Type | Due Date | Priority | Assignee | Status |
|------|------|----------|----------|----------|--------|
| ECL Overlay EUR 4.2M | Approval | 30 Jun 2026 | Medium | Risk Committee | Pending |
| FTP Curve Update | Approval | 28 Jun 2026 | High | Treasury Head | Pending |
| Liquidity Limit Override | Approval | 27 Jun 2026 | High | CRO | Pending |
| ALCO Monthly Meeting | Meeting | 2 Jul 2026, 10:00 | — | All ALCO | Upcoming |
| ALCO Extraordinary | Meeting | 15 Jul 2026, 14:00 | — | All ALCO | Upcoming |

**Interactions:**
- **Click task item:** Opens detail view or approval workflow
- **Click "Review →":** Direct link to approval action
- **Click "View Agenda →":** Opens meeting details with agenda items
- **Click "Task Center":** Navigates to full task management page

**Responsive Behavior:**
- Mobile: Full width, collapsible sections
- Tablet+: 6 columns, fixed layout

---

## 6. News & Regulatory Updates Feed

### 6.1 News Feed Component

**Purpose:** Curated feed of regulatory updates, market news, and internal communications relevant to ALM. Keeps ALCO members informed of external developments.

**Component Type:** News List Card
**Library Recommendation:** Custom component
**Dimensions:** 6 grid columns × auto height (~240px)
**Position:** Bottom-middle, aligned with Action Items

```
┌────────────────────────────────────────────────────────────────────┐
│ 📰 News & Regulatory Updates                          [View All →]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ 🏛 ECB Publishes Revised LCR Guidance                              │
│    New guidance on Level 2B RMBS haircuts effective Q3 2026.      │
│    Source: ECB Banking Supervision    2 hours ago                  │
│    [Read More →]                                                   │
│                                                                    │
│ 📊 EBA Stress Test 2026 — Results Expected                         │
│    Preliminary results to be published 15 July 2026.              │
│    Source: EBA                        5 hours ago                  │
│    [Read More →]                                                   │
│                                                                    │
│ 📋 IFRS 9 Amendments — Effective 2027                              │
│    IASB issues amendments to impairment model for low credit risk. │
│    Source: IASB                       1 day ago                    │
│    [Read More →]                                                   │
│                                                                    │
│ 🏦 Internal: Basel III Finalization Timeline Update                │
│    Implementation timeline revised. See memo from CRO office.     │
│    Source: CRO Office                 2 days ago                   │
│    [Read More →]                                                   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**News Item Styling:**
```
Padding: 16px 0
Border-bottom: 1px solid #F1F5F9
Title: 14px / 600 / #334155
Body: 13px / 400 / #64748B, 2-line max (truncate with ellipsis)
Source: 12px / 500 / #3B82F6
Time: 12px / 400 / #94A3B8
```

**Source Type Icons:**
| Source Type | Icon | Color |
|-------------|------|-------|
| Regulatory (ECB, EBA, BCBS) | Landmark | `#10B981` |
| Accounting (IASB, IFRS) | FileText | `#8B5CF6` |
| Internal | Building2 | `#3B82F6` |
| Market/News | Globe | `#06B6D4` |

**Demo Data:**
| Title | Source | Type | Time | Summary |
|-------|--------|------|------|---------|
| ECB Publishes Revised LCR Guidance | ECB Banking Supervision | Regulatory | 2h ago | New guidance on Level 2B RMBS haircuts effective Q3 2026 |
| EBA Stress Test 2026 — Results Expected | EBA | Regulatory | 5h ago | Preliminary results to be published 15 July 2026 |
| IFRS 9 Amendments — Effective 2027 | IASB | Accounting | 1d ago | IASB issues amendments to impairment model for low credit risk |
| Basel III Finalization Timeline Update | CRO Office | Internal | 2d ago | Implementation timeline revised. See memo from CRO office |

**Interactions:**
- **Click news item:** Opens full article in slide-over panel or external link
- **Click "Read More →":** Expands summary or navigates to source
- **Click "View All →":** Navigates to full news/regulatory center
- **Hover:** Background tint `#F8FAFC`, title color shifts to `#3B82F6`

**Responsive Behavior:**
- Mobile: Full width, collapsible
- Tablet+: 6 columns

---

## 7. Quick Links to Modules

### 7.1 Quick Links Component

**Purpose:** One-click access to all ALM modules and key reports. Icon-driven navigation for rapid module switching during ALCO meetings.

**Component Type:** Icon Grid Card
**Library Recommendation:** Custom component
**Dimensions:** 6 grid columns × auto height (~160px)
**Position:** Bottom row, left side

```
┌────────────────────────────────────────────────────┐
│ 🚀 Quick Links                                     │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐ │
│  │ 💧 │  │ 📈 │  │ 🛡  │  │ ⚠  │  │ 🔄 │  │ 🎯 │ │
│  │Liqu│  │IRR │  │Cap │  │ECL │  │FTP │  │Opt │ │
│  │idity│  │BB  │  │ital│  │    │  │    │  │imiz│ │
│  └────┘  └────┘  └────┘  └────┘  └────┘  └────┘ │
│  ┌────┐  ┌────┐  ┌────┐                          │
│  │ 📋 │  │ ⚙  │  │ 📚 │                          │
│  │Repo│  │Sett│  │Docs│                          │
│  │rts │  │ings│  │    │                          │
│  └────┘  └────┘  └────┘                          │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Module Icon Button Styling:**
```
Size: 72px × 72px
Background: #F8FAFC
Border: 1px solid #E2E8F0
Border-radius: 12px
Icon: 28px, module color
Label: 12px / 500 / #334155, below icon
Hover: bg #EEF2FF, border #3B82F6, icon scale 1.1
Active: bg #DBEAFE, border #3B82F6
Transition: 200ms ease-out
```

**Module Definitions:**
| Module | Icon | Icon Color | Label | Route |
|--------|------|------------|-------|-------|
| Liquidity | Droplets | `#06B6D4` | Liquidity | /liquidity |
| IRRBB | TrendingUp | `#8B5CF6` | IRRBB | /irrbb |
| Capital | Shield | `#10B981` | Capital | /capital |
| ECL | AlertTriangle | `#F59E0B` | ECL | /ecl |
| FTP | ArrowLeftRight | `#6366F1` | FTP | /ftp |
| Optimization | Target | `#EC4899` | Optimize | /optimization |
| Reports | FileBarChart | `#64748B` | Reports | /reports |
| Settings | Settings | `#64748B` | Settings | /settings |
| Documentation | BookOpen | `#64748B` | Docs | /docs |

**Interactions:**
- **Click:** Navigates to module landing page
- **Hover:** Icon scales up, background tints, label bolds
- **Right-click:** "Open in new tab", "Add to favorites", "Copy link"

**Responsive Behavior:**
- Mobile: 3 columns × 3 rows, smaller icons (56px)
- Tablet: 4–5 columns
- Desktop+: Full horizontal row, 72px icons

---

## 8. Calendar Widget

### 8.1 Calendar Component

**Purpose:** Display key dates, reporting deadlines, and ALCO meetings in a compact calendar view. Critical for time-sensitive ALM operations.

**Component Type:** Calendar Card
**Library Recommendation:** Custom component (lightweight calendar) or date-fns + custom UI
**Dimensions:** 6 grid columns × auto height (~320px)
**Position:** Bottom row, right side, aligned with Quick Links

```
┌────────────────────────────────────────────────────────────────────┐
│ 📅 Calendar & Key Dates                               [Full Calendar]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│        ◀  June 2026  ▶                                           │
│                                                                    │
│   Mon   Tue   Wed   Thu   Fri   Sat   Sun                          │
│                   1     2     3     4     5                        │
│     6     7     8     9    10    11    12                        │
│    13    14    15    16    17    18    19                        │
│    20    21    22    23    24   [25]   26                        │
│    27    28    29    30                                            │
│                                                                    │
│  [25] — Today (highlighted with ring)                              │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│ 📌 Upcoming Events:                                                │
│                                                                    │
│ 🔴 30 Jun  — Quarter-End Reporting Deadline                        │
│ 🟡 28 Jun  — FTP Curve Approval Due                                │
│ 🔵 2 Jul   — ALCO Monthly Meeting (10:00 CET)                      │
│ 🟢 15 Jul  — ECB LCR Submission                                    │
│ 🟡 31 Jul  — Capital Plan Update Due                               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Calendar Header:**
```
Month/Year: 16px / 700 / #334155
Navigation arrows: ChevronLeft / ChevronRight, 20px, #64748B
Hover: bg #F1F5F9, border-radius 8px
```

**Day Cell Styling:**
```
Size: 36px × 36px
Font: 13px / 500 / #334155
Border-radius: 8px
Default: transparent
Today: bg #EEF2FF, border 2px #3B82F6, font-weight 700
Has event: bottom dot 4px, color = event type
Selected: bg #3B82F6, text #FFFFFF
Hover: bg #F1F5F9
Other month: text #94A3B8
```

**Event Type Colors:**
| Type | Dot Color | Example |
|------|-----------|---------|
| Reporting Deadline | `#F43F5E` | Quarter-end reporting |
| ALCO Meeting | `#3B82F6` | Monthly ALCO |
| Approval Due | `#F59E0B` | FTP curve approval |
| Regulatory Submission | `#10B981` | ECB LCR submission |
| Internal Deadline | `#8B5CF6` | Capital plan update |

**Event List Styling:**
```
Item padding: 8px 0
Dot: 8px circle, left side
Text: 13px / 500 / #334155
Date: 12px / 600 / #64748B, left-aligned
```

**Demo Data (June–July 2026):**
| Date | Event | Type | Time |
|------|-------|------|------|
| 25 Jun | Today | — | — |
| 27 Jun | Liquidity Stress Test Run | Internal | 09:00 |
| 28 Jun | FTP Curve Approval Due | Approval | EOD |
| 30 Jun | Quarter-End Reporting Deadline | Reporting | EOD |
| 30 Jun | ECL Overlay Approval Due | Approval | EOD |
| 2 Jul | ALCO Monthly Meeting | Meeting | 10:00 |
| 15 Jul | ECB LCR Submission | Regulatory | EOD |
| 15 Jul | ALCO Extraordinary Meeting | Meeting | 14:00 |
| 31 Jul | Capital Plan Update Due | Internal | EOD |

**Interactions:**
- **Click day:** Shows all events for that day in tooltip or expanded list
- **Click event:** Opens event detail or navigates to relevant module
- **Click month arrows:** Navigate between months
- **Click "Full Calendar":** Opens full calendar view with all events
- **Hover day with event:** Tooltip shows event summary

**Responsive Behavior:**
- Mobile: Compact calendar (5-day week view or list view)
- Tablet+: Full month grid
- Desktop+: Full month + event list side by side

---

## 9. Responsive Layout Summary

| Breakpoint | KPI Row | Alert + Trends | Actions + News | Quick Links + Calendar |
|------------|---------|----------------|----------------|------------------------|
| Mobile (<768px) | 2 cols × 3 rows | Stacked, full width | Stacked, full width | Stacked, full width |
| Tablet (768–1023px) | 3 cols × 2 rows | Alert 4 col, Trends 8 col | Actions 6 col, News 6 col | Quick Links 6 col, Calendar 6 col |
| Desktop (1024–1279px) | 6 cols × 1 row | Alert 4 col, Trends 8 col | Actions 6 col, News 6 col | Quick Links 6 col, Calendar 6 col |
| Wide+ (≥1280px) | 6 cols × 1 row | Alert 4 col, Trends 8 col | Actions 6 col, News 6 col | Quick Links 6 col, Calendar 6 col |

---

## 10. Animation & Transitions

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| KPI Cards | Page load | Fade in + slide up (stagger 100ms each) | 600ms | ease-out |
| KPI Value | Data refresh | Count up animation | 800ms | ease-out |
| Alert Panel | New alert | Slide in from left + pulse border | 400ms | ease-bounce |
| Sparklines | Period toggle | Smooth data transition | 400ms | ease-default |
| Calendar | Month change | Crossfade | 300ms | ease-default |
| Quick Links | Hover | Scale 1.05 + shadow | 200ms | ease-out |

---

*Landing Dashboard Version 1.0 — ALM Platform Visual Design Team — June 2026*
