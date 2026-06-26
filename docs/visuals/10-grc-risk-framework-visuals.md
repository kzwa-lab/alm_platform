# ALM Platform — GRC & Risk Framework Visual Specification

**Version:** 1.0
**Last Updated:** 2026-06-25
**Screen:** GRC & Risk Framework Dashboard
**Context:** Bank of Ghana 2026 risk governance, compliance, and three-lines-of-defence framework. Covers risk universe, limit hierarchy, breach management, 3LoD organisation, and risk appetite monitoring. Designed for CRO oversight, board risk reporting, and BoG regulatory compliance.

---

## 1. Dashboard Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Navigation + Context Switcher (Entity: Ecobank Ghana PLC | Date: 30 Jun 2026 | GRR: 25.50%)│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  RISK UNIVERSE HEATMAP — Probability × Impact Matrix                               │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  LIMIT HIERARCHY TREE                      │  │  BREACH DASHBOARD                    │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  3LOD ORG CHART                            │  │  RISK APPETITE PANEL                 │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Grid:** 12 columns, 24px gutter, 32px margin
**Background:** `#F8FAFC` (light) / `#0F172A` (dark)

---

## 2. Risk Universe Heatmap

### 2.1 Component Specification

**Purpose:** Visualise the bank's complete risk universe across probability and impact dimensions. Enables board and ALCO to understand aggregate risk exposure and concentration.

**Chart Type:** Heatmap with Bubble Overlay
**Library Recommendation:** ECharts (heatmap + scatter combo)
**Dimensions:** 12 columns (full width) × 480px height
**Position:** Top row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Risk Universe Heatmap                                    [Filter] [⋯] [⬇] [📊]           │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  Impact (₵B)                                                                               │
│  Critical ┤  ░░  ░░  ██  ░░  ░░                                                          │
│  High     ┤  ░░  ██  ██  ██  ░░                                                          │
│  Medium   ┤  ░░  ░░  ██  ░░  ░░                                                          │
│  Low      ┤  ░░  ░░  ░░  ░░  ░░                                                          │
│  Negligible┤ ░░  ░░  ░░  ░░  ░░                                                          │
│            └───────────────────────────────────                                           │
│              Negligible  Low  Medium  High  Critical                                       │
│                        Probability                                                         │
│                                                                                            │
│  Legend:  ░░ Acceptable  ▓▓ Tolerable  ██ Critical                                         │
│                                                                                            │
│  Selected: Credit Risk (Retail) — Probability: High, Impact: Critical                      │
│  Exposure: ₵45.2B  •  RWA: ₵12.8B  •  Trend: ▲ +5% (QoQ)                               │
│  [View Risk Detail]  [View Mitigation Plan]                                              │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Heatmap Color Scale:**
| Risk Level | Color | Description |
|------------|-------|-------------|
| Acceptable | `#10B981` | Within risk appetite |
| Tolerable | `#F59E0B` | Near risk appetite limit |
| Critical | `#F43F5E` | Exceeds risk appetite |

**Bubble Data (Risk Categories):**
| Risk Category | Probability | Impact | Exposure (₵B) | RWA (₵B) | Status |
|---------------|-------------|--------|---------------|----------|--------|
| Credit Risk (Retail) | High | Critical | 45.2 | 12.8 | ██ |
| Credit Risk (Corporate) | Medium | High | 38.5 | 15.2 | ▓▓ |
| IRRBB | Medium | High | 28.4 | 8.5 | ▓▓ |
| Liquidity Risk | Low | Critical | 22.1 | 0.0 | ░░ |
| Operational Risk | Medium | Medium | 8.5 | 6.2 | ░░ |
| Cyber Risk | Low | High | 5.2 | 0.0 | ░░ |
| Compliance Risk | Low | Medium | 3.8 | 0.0 | ░░ |
| Reputational Risk | Medium | High | 2.4 | 0.0 | ▓▓ |
| Model Risk | Low | Medium | 1.8 | 0.0 | ░░ |
| Climate Risk | Low | Medium | 1.2 | 0.0 | ░░ |

**Axes:**
- **X-axis:** Probability (Negligible, Low, Medium, High, Critical)
- **Y-axis:** Impact (Negligible, Low, Medium, High, Critical)
- **Bubble size:** Exposure amount (₵B)
- **Bubble color:** Risk status (green/amber/red)

**Interactions:**
- **Hover bubble:** Tooltip shows risk name, exposure, RWA, trend, and owner
- **Click bubble:** Drill down to risk detail panel with sub-categories and mitigation plans
- **Filter:** By risk type, business unit, or materiality threshold
- **Toggle:** Show/hide risk appetite boundary lines

**Responsive Behavior:**
- Mobile: Scrollable heatmap, list view below
- Tablet+: Full heatmap with zoom/pan

---

## 3. Limit Hierarchy Tree

### 3.1 Component Specification

**Purpose:** Display cascading risk limits from board level down to desk level. Shows limit utilisation, ownership, and approval chain. Critical for understanding limit governance and escalation paths.

**Component Type:** Collapsible Tree / Nested Table
**Dimensions:** 6 columns × 480px height
**Position:** Second row, left

```
┌────────────────────────────────────────────────────────────────────┐
│ Limit Hierarchy Tree                                  [Expand All]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ▼ Board of Directors                                              │
│    └─ ▼ Risk Appetite Statement                                    │
│        ├─ ▼ CET1 Ratio ≥ 10.0%                                     │
│        │   └─ ▼ ALCO Limit: ≥ 11.0%                                │
│        │       ├─ Treasury Desk: ≥ 11.5%  [████████░░░] 85%      │
│        │       └─ Trading Desk: ≥ 11.5%   [██████████░] 92%      │
│        ├─ ▼ LMTD ≥ 100%                                            │
│        │   └─ ▼ ALCO Limit: ≥ 120%                                 │
│        │       ├─ Treasury Desk: ≥ 125%   [████████░░░] 82%      │
│        │       └─ Retail Desk: ≥ 125%     [██████████░] 95%      │
│        ├─ ▼ NIM ≥ 10.0%                                            │
│        │   └─ ALCO Limit: ≥ 11.0%                                    │
│        │       └─ All Desks: ≥ 12.0%      [███████████] 107% 🟡    │
│        └─ ▼ Wholesale Funding ≤ 35%                                  │
│            └─ ALCO Limit: ≤ 30%                                      │
│                └─ Corporate Desk: ≤ 28%   [████████░░░] 82%        │
│                                                                    │
│  Legend: [████████░░░] = Utilisation %  🟡 = Near limit (≥90%)     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Tree Styling:**
```
Indent: 24px per level
Expand icon: ChevronRight (▶) / ChevronDown (▼), 14px, #64748B
Limit value: 13px / 600 / #334155
Utilisation bar: height 8px, border-radius 4px, bg #E2E8F0
  Fill: #3B82F6 (<80%), #F59E0B (80-95%), #F43F5E (>95%)
Percentage: 13px / 500 / #64748B, right-aligned
```

**Demo Data:**
| Level | Limit Name | Threshold | Owner | Utilisation | Status |
|-------|------------|-----------|-------|-------------|--------|
| Board | CET1 Ratio | ≥ 10.0% | Board Risk Committee | 142% | 🟢 |
| Board | LMTD | ≥ 100% | Board Risk Committee | 136% | 🟢 |
| Board | NIM | ≥ 10.0% | Board Risk Committee | 129% | 🟢 |
| ALCO | CET1 Ratio | ≥ 11.0% | ALCO | 129% | 🟢 |
| ALCO | LMTD | ≥ 120% | ALCO | 113% | 🟢 |
| ALCO | NIM | ≥ 11.0% | ALCO | 117% | 🟢 |
| ALCO | Wholesale Funding | ≤ 30% | ALCO | 93% | 🟡 |
| Treasury Desk | CET1 Ratio | ≥ 11.5% | Treasury Head | 123% | 🟢 |
| Treasury Desk | LMTD | ≥ 125% | Treasury Head | 109% | 🟢 |
| Trading Desk | CET1 Ratio | ≥ 11.5% | Trading Head | 123% | 🟢 |
| Retail Desk | LMTD | ≥ 125% | Retail Head | 109% | 🟢 |
| Corporate Desk | Wholesale Funding | ≤ 28% | Corporate Head | 82% | 🟢 |

**Interactions:**
- **Click expand/collapse:** Toggle tree node visibility
- **Click limit row:** Opens limit detail with history, breaches, and approval chain
- **Hover utilisation bar:** Tooltip shows exact utilisation and remaining headroom
- **Right-click:** Edit limit, view audit trail, or request override

**Responsive Behavior:**
- Mobile: Flat list with indentation, scrollable
- Tablet+: Collapsible tree as designed

---

## 4. Breach Dashboard

### 4.1 Component Specification

**Purpose:** Real-time dashboard of all active and historical limit breaches with BoG notification countdown. Critical for compliance and regulatory reporting.

**Component Type:** Status Cards + Countdown Timer
**Dimensions:** 6 columns × 480px height
**Position:** Second row, right

```
┌────────────────────────────────────────────────────────────────────┐
│ Breach Dashboard                                      [View History]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 🔴 RED BREACH — Wholesale Funding Concentration            │   │
│  │    Current: 31.2%  •  Limit: 30.0%  •  Excess: +1.2pp      │   │
│  │    Breached: 25 Jun 2026, 08:15 GMT                        │   │
│  │    Owner: Corporate Banking Head                            │   │
│  │    ⏰ BoG Notification Due: 5 Jul 2026 (10 days remaining)  │   │
│  │    [Acknowledge]  [Escalate]  [View Mitigation]            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 🟡 AMBER BREACH — NIM Approaching Limit                    │   │
│  │    Current: 11.8%  •  Limit: 12.0%  •  Buffer: -0.2pp      │   │
│  │    Breached: 24 Jun 2026, 16:45 GMT                        │   │
│  │    Owner: Treasury Head                                    │   │
│  │    ⏰ BoG Notification Due: 4 Jul 2026 (9 days remaining)  │   │
│  │    [Acknowledge]  [Escalate]  [View Mitigation]            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ ⚫ BLACK BREACH — LMTD Below Minimum (Historical)          │   │
│  │    Value: 98.5%  •  Limit: 100.0%  •  Shortfall: -1.5pp    │   │
│  │    Breached: 15 Mar 2026, 11:20 GMT                        │   │
│  │    Resolved: 16 Mar 2026, 09:00 GMT                        │   │
│  │    BoG Notified: 16 Mar 2026, 10:00 GMT (within 10 days)   │   │
│  │    [View Resolution Report]                                  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  Active Breaches: 2  •  Pending BoG Notification: 1  •  YTD: 5    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Breach Card Styling:**
```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border-radius: 12px
Padding: 16px 20px
Left accent: 4px solid [breach-color]
Margin-bottom: 12px
```

**Breach Severity Colors:**
| Severity | Color | Condition | BoG Notification |
|----------|-------|-----------|------------------|
| Red | `#F43F5E` | Breach > 5% above limit | 10 days |
| Amber | `#F59E0B` | Breach ≤ 5% above limit | 10 days |
| Black | `#1E293B` | Below regulatory minimum | Immediate |
| Green | `#10B981` | Resolved | N/A |

**Countdown Timer:**
```
Font: 14px / 700 / #F43F5E (urgent: <3 days) / #F59E0B (warning: 3-7 days) / #10B981 (safe: >7 days)
Icon: Clock, 16px
Format: "{days} days remaining" or "Overdue: {days} days"
```

**Demo Data:**
| Breach ID | Metric | Current | Limit | Severity | Breach Date | Owner | BoG Due | Status |
|------------|--------|---------|-------|----------|-------------|-------|---------|--------|
| BR-2026-042 | Wholesale Funding | 31.2% | 30.0% | 🔴 Red | 25 Jun 08:15 | Corp Head | 5 Jul | Active |
| BR-2026-041 | NIM | 11.8% | 12.0% | 🟡 Amber | 24 Jun 16:45 | Treasury Head | 4 Jul | Active |
| BR-2026-015 | LMTD | 98.5% | 100.0% | ⚫ Black | 15 Mar 11:20 | Risk Team | 16 Mar | Resolved |
| BR-2026-008 | CET1 | 9.8% | 10.0% | ⚫ Black | 28 Feb 09:30 | CRO Office | 28 Feb | Resolved |

**Interactions:**
- **Click card:** Opens breach detail with root cause, timeline, and resolution tracking
- **Click "Acknowledge":** Logs acknowledgment, starts mitigation timer
- **Click "Escalate":** Triggers escalation workflow to next level (desk → ALCO → board → BoG)
- **Click "View Mitigation":** Opens mitigation plan panel

**Responsive Behavior:**
- Mobile: Full width, stacked cards
- Tablet+: Full layout as designed

---

## 5. 3LoD Org Chart

### 5.1 Component Specification

**Purpose:** Visual representation of the Three Lines of Defence model with role assignments, reporting lines, and CRO independence enforcement. Critical for BoG RMD 2021 compliance.

**Component Type:** Organisational Chart / Flow Diagram
**Library Recommendation:** ECharts (graph/force layout) or custom SVG
**Dimensions:** 6 columns × 480px height
**Position:** Third row, left

```
┌────────────────────────────────────────────────────────────────────┐
│ 3LoD Organisation Chart                              [View Details]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│                    ┌─────────────────────┐                         │
│                    │   BOARD OF DIRECTORS │                         │
│                    │   Risk Committee     │                         │
│                    └──────────┬──────────┘                         │
│                               │                                    │
│              ┌────────────────┼────────────────┐                  │
│              │                │                │                  │
│     ┌────────▼────────┐ ┌────▼────┐ ┌─────────▼─────────┐         │
│     │  1ST LINE       │ │   CRO   │ │   2ND LINE        │         │
│     │  (Business)     │ │(Independent│  (Risk Mgmt)      │         │
│     │                 │ │ per RMD)│ │                   │         │
│     │ • CEO           │ │         │ │ • Risk Framework  │         │
│     │ • CFO*          │ │         │ │ • Limit Monitoring │         │
│     │ • COO*          │ │         │ │ • Model Validation│         │
│     │ • Business Heads│ │         │ │ • Compliance      │         │
│     │                 │ │         │ │                   │         │
│     └─────────────────┘ └─────────┘ └───────────────────┘         │
│              │                                │                    │
│              │         ┌──────────────┐        │                    │
│              │         │  3RD LINE    │        │                    │
│              │         │ (Internal    │        │                    │
│              │         │  Audit)      │        │                    │
│              │         │              │        │                    │
│              │         │ • Independent│        │                    │
│              │         │   Assurance  │        │                    │
│              │         │ • Reports to │        │                    │
│              │         │   Board AC   │        │                    │
│              │         └──────────────┘        │                    │
│                                                                    │
│  * CRO cannot hold CFO, COO, or Internal Audit roles per RMD 2021  │
│  CRO Independence: ✅ Enforced  •  Last Review: 15 Jun 2026       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Org Chart Styling:**
```
Node: border-radius 8px, padding 12px 16px, font 13px / 500
1st Line: bg #EEF2FF, border #3B82F6, text #1E293B
CRO: bg #F3E8FF, border #8B5CF6, text #1E293B (independent highlight)
2nd Line: bg #ECFDF5, border #10B981, text #1E293B
3rd Line: bg #FEF3C7, border #F59E0B, text #1E293B
Board: bg #F1F5F9, border #64748B, text #1E293B
Connector lines: 2px solid #CBD5E1
```

**Role Independence Matrix:**
| Role | CRO | CFO | COO | Internal Audit | Allowed? |
|------|-----|-----|-----|----------------|----------|
| CRO | — | ❌ | ❌ | ❌ | N/A |
| CFO | ❌ | — | ✅ | ❌ | Per RMD 2021 |
| COO | ❌ | ✅ | — | ❌ | Per RMD 2021 |
| Internal Audit | ❌ | ❌ | ❌ | — | Per RMD 2021 |

**Demo Data (Key Roles):**
| Line | Role | Holder | Reports To | Independence |
|------|------|--------|------------|--------------|
| Board | Risk Committee Chair | Board Member | Board | — |
| 1st Line | CEO | K. Osei | Board | — |
| 1st Line | CFO | A. Mensah | CEO | Cannot be CRO |
| 1st Line | COO | J. Addo | CEO | Cannot be CRO |
| CRO | Chief Risk Officer | K. Asante | Board (dotted: CEO) | Independent |
| 2nd Line | Head of Risk Framework | M. Boateng | CRO | — |
| 2nd Line | Head of Compliance | P. Owusu | CRO | — |
| 3rd Line | Head of Internal Audit | L. Darko | Board AC | Independent |

**Interactions:**
- **Click node:** Opens role detail with responsibilities, reporting lines, and independence status
- **Hover connector:** Shows reporting relationship type (solid = direct, dotted = functional)
- **Toggle:** Show/hide independence enforcement rules
- **Click "View Details":** Opens full 3LoD documentation panel

**Responsive Behavior:**
- Mobile: Vertical list of roles with indentation
- Tablet+: Horizontal org chart

---

## 6. Risk Appetite Panel

### 6.1 Component Specification

**Purpose:** Visual gauges showing current risk appetite utilisation for each risk type. Enables rapid assessment of whether the bank is operating within its risk appetite.

**Component Type:** Gauge / Slider Cards
**Dimensions:** 6 columns × 480px height
**Position:** Third row, right

```
┌────────────────────────────────────────────────────────────────────┐
│ Risk Appetite Utilisation                             [Edit] [⋯]   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Credit Risk                                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  0%        25%        50%        75%        100%       125%       │
│  ├──────────────────────────────────────────┤────┤                  │
│  ▲                                         │    ▲                 │
│  Current: 78%                              │    Limit: 100%      │
│  🟢 Within appetite                        │    Buffer: 22%      │
│                                                                    │
│  Liquidity Risk (LMTD)                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  0%        25%        50%        75%        100%       125%       │
│  ├────────────────────────────────────────────────────┤            │
│  ▲                                                   │            │
│  Current: 113%                                       │            │
│  🟢 Within appetite (above minimum)                  │            │
│                                                                    │
│  IRRBB (EVE Δ)                                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  0%        25%        50%        75%        100%       125%       │
│  ├────────────────────────────────────────┤────┤                │
│  ▲                                         │    ▲               │
│  Current: 82%                              │    Limit: 100%      │
│  🟢 Within appetite                        │    Buffer: 18%      │
│                                                                    │
│  Operational Risk                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  0%        25%        50%        75%        100%       125%       │
│  ├──────────────────────────────────────────────────────────┤────│
│  ▲                                                         │    │
│  Current: 95%                                              │    │
│  🟡 Near appetite limit                                    │    │
│                                                                    │
│  Capital Adequacy (CET1)                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  0%        25%        50%        75%        100%       125%       │
│  ├────────────────────────────────────┤                          │
│  ▲                                   │                            │
│  Current: 142%                       │                            │
│  🟢 Strong buffer                    │                            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Gauge Styling:**
```
Track: height 8px, border-radius 4px, bg #E2E8F0
Fill: #3B82F6 (<80%), #F59E0B (80-95%), #F43F5E (>95%)
Marker: 12px triangle, color #1E293B, positioned at current value
Limit marker: 2px dashed line, color #F43F5E, at 100%
Label: 13px / 500 / #334155
Percentage: 14px / 700 / #334155
```

**Demo Data:**
| Risk Type | Current | Limit | Utilisation | Buffer | Status |
|-----------|---------|-------|-------------|--------|--------|
| Credit Risk | 78% | 100% | 78% | 22% | 🟢 |
| Liquidity Risk (LMTD) | 113% | 100% | 113% | +13pp | 🟢 |
| IRRBB (EVE Δ) | 82% | 100% | 82% | 18% | 🟢 |
| Operational Risk | 95% | 100% | 95% | 5% | 🟡 |
| Capital Adequacy (CET1) | 142% | 100% | 142% | +42pp | 🟢 |
| NIM | 117% | 100% | 117% | +17pp | 🟢 |

**Interactions:**
- **Click gauge:** Opens risk detail with historical trend and limit history
- **Hover gauge:** Tooltip shows exact value, limit, and trend direction
- **Click "Edit":** Opens risk appetite configuration panel (board/CRO only)
- **Toggle:** Switch between absolute values and relative utilisation

**Responsive Behavior:**
- Mobile: Full width, stacked gauges
- Tablet+: 2-column grid of gauges

---

## 7. Responsive Layout Summary

| Breakpoint | Risk Heatmap | Limit Tree | Breach Dashboard | 3LoD Chart | Risk Appetite |
|------------|-------------|------------|------------------|------------|---------------|
| Mobile | Full width, scrollable | Full width, flat list | Full width, stacked | Vertical list | Full width, stacked |
| Tablet | Full width | 6 columns | 6 columns | 6 columns | 6 columns |
| Desktop+ | Full width | 6 columns | 6 columns | 6 columns | 6 columns |

---

*GRC & Risk Framework Visuals Version 1.0 — ALM Platform Visual Design Team — June 2026*
