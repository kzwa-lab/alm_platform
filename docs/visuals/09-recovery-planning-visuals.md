# ALM Platform — Recovery Planning Visual Specification

**Version:** 1.0
**Last Updated:** 2026-06-25
**Screen:** Recovery Planning Dashboard
**Context:** Bank of Ghana 2026 recovery plan management for ALCO and board risk oversight. Covers recovery triggers, capital restoration options, recovery plan timeline, playbook activation, and BoG submission tracking. Designed for annual recovery plan preparation and real-time trigger monitoring.

---

## 1. Dashboard Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Navigation + Context Switcher (Entity: Ecobank Ghana PLC | Date: 30 Jun 2026 | GRR: 25.50%)│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────────────┐  │
│  │  CET1       │ │  LMTD       │ │  NIM        │ │  PROFIT     │ │  RECOVERY STATUS   │  │
│  │  TRIGGER    │ │  TRIGGER    │ │  TRIGGER    │ │  TRIGGER    │ │  GAUGE             │  │
│  │  (2 cols)   │ │  (2 cols)   │ │  (2 cols)   │ │  (2 cols)   │ │  (4 cols)          │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  CAPITAL RESTORATION WATERFALL — Shortfall → Actions → Target                      │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  RECOVERY OPTIONS PLANNER                  │  │  RECOVERY PLAN TIMELINE              │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  PLAYBOOK ACTIVATION PANEL — Phase status and action items                           │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Grid:** 12 columns, 24px gutter, 32px margin
**Background:** `#F8FAFC` (light) / `#0F172A` (dark)

---

## 2. Recovery Trigger Status Cards

### 2.1 Component Specification

**Purpose:** Show the four BoG-mandated recovery triggers (capital, liquidity, profitability, systemic) with current status against thresholds. Critical for early warning and board reporting.

**Component Type:** Metric Cards (5-column grid)
**Dimensions:** 5 cards × ~220px width each × 200px height
**Position:** Top row

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ CET1 TRIGGER    │ │ LMTD TRIGGER    │ │ NIM TRIGGER     │ │ PROFIT TRIGGER  │ │ OVERALL STATUS  │
│                 │ │                 │ │                 │ │                 │ │                 │
│  Current        │ │  Current        │ │  Current        │ │  Current        │ │  🟢 NORMAL      │
│  14.2%          │ │  136.2%         │ │  12.85%         │ │  ₵2.4B          │ │                 │
│                 │ │                 │ │                 │ │                 │ │  0 of 4         │
│  Warning: 10.5% │ │  Warning: 120%  │ │  Warning: 10% │ │  Warning: ₵1.5B │ │  triggers       │
│  Critical: 8.0% │ │  Critical: 100% │ │  Critical: 8%   │ │  Critical: ₵1B│ │  activated      │
│                 │ │                 │ │                 │ │                 │ │                 │
│  🟢 Normal      │ │  🟢 Normal      │ │  🟢 Normal      │ │  🟢 Normal      │ │  Next BoG       │
│                 │ │                 │ │                 │ │                 │ │  submission:    │
│  Buffer: +4.2pp │ │  Buffer: +16.2pp│ │  Buffer: +2.85pp│ │  Buffer: ₵0.9B│ │  31 Dec 2026    │
│                 │ │                 │ │                 │ │                 │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

**Card Styling:**
```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border-radius: 12px
Padding: 20px
Top accent: 4px solid [status-color]
```

**Status Colors:**
| Status | Color | Condition |
|--------|-------|-----------|
| Normal | `#10B981` | Above warning threshold |
| Warning | `#F59E0B` | Between warning and critical |
| Critical | `#F43F5E` | Below critical threshold |
| Triggered | `#8B5CF6` | Recovery plan activated |

**Demo Data:**
| Trigger | Current | Warning | Critical | Buffer | Status |
|---------|---------|---------|----------|--------|--------|
| CET1 Ratio | 14.2% | 10.5% | 8.0% | +4.2pp | 🟢 |
| LMTD Ratio | 136.2% | 120% | 100% | +16.2pp | 🟢 |
| NIM | 12.85% | 10.0% | 8.0% | +2.85pp | 🟢 |
| Pre-Tax Profit | ₵2.4B | ₵1.5B | ₵1.0B | +₵0.9B | 🟢 |
| Overall | — | — | — | — | 🟢 Normal |

**Interactions:**
- **Click card:** Opens historical trend sparkline for that trigger
- **Hover:** Shows tooltip with month-over-month change and trend direction
- **Click "View History":** Opens 24-month historical view with threshold lines

**Responsive Behavior:**
- Mobile: 2 columns × 3 rows (overall status full width)
- Tablet: 5 columns × 1 row

---

## 3. Capital Restoration Waterfall

### 3.1 Component Specification

**Purpose:** Show the step-by-step path from capital shortfall to restoration target through planned actions. Essential for board and BoG reporting on recovery plan viability.

**Chart Type:** Horizontal Waterfall (Bridge) Chart
**Library Recommendation:** ECharts (custom waterfall series)
**Dimensions:** 12 columns (full width) × 420px height
**Position:** Second row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Capital Restoration Plan                                      [Filter] [⋯] [⬇] [📊]         │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  Capital Position (₵B)                                                                    │
│                                                                                            │
│  Current CET1 Capital          ████████████████████████████████████████  ₵42.5B            │
│  ─────────────────────────────────────────────────────────────────────────────             │
│  Stress Capital Shortfall      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  -₵8.2B            │
│  ├─ Credit Loss Shock          ░░░░░░░░                                -₵3.5B            │
│  ├─ Market Value Decline       ░░░░░░░░                                -₵2.8B            │
│  ├─ Operational Loss           ░░░░                                  -₵1.2B            │
│  └─ Other Adjustments          ░░░░                                  -₵0.7B            │
│  ─────────────────────────────────────────────────────────────────────────────             │
│  Recovery Actions (Planned)    ██████████████████████████████████████  +₵12.5B           │
│  ├─ Asset Sales                ████████                              +₵3.5B            │
│  ├─ Cost Reduction Programme   ██████                                +₵2.8B            │
│  ├─ Capital Raise (Rights)     ██████████                            +₵4.2B            │
│  ├─ Business Line Divestment   ████                                  +₵1.5B            │
│  └─ RWA Optimization           ████                                  +₵0.5B            │
│  ─────────────────────────────────────────────────────────────────────────────             │
│  Restored Capital Position     ████████████████████████████████████████████████  ₵46.8B  │
│  Target CET1 Ratio: 12.0%       [============================================]            │
│  🟢 Surplus: +₵4.8B above minimum                                                        │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Bar Style | Legend Label |
|--------|-------|-----------|--------------|
| Current Capital | `#3B82F6` | Solid fill | Current Position |
| Shortfall | `#F43F5E` | Solid fill | Stress Shortfall |
| Recovery Actions | `#10B981` | Solid fill | Planned Actions |
| Restored Position | `#8B5CF6` | Solid fill, bold border | Restored Position |

**Axes:**
- **X-axis:** GHS Billions, tick format: "₵{value}B", min: 0, max: 50
- **Y-axis:** Category labels (Current Capital, Shortfall items, Recovery Actions, Restored Position)

**Demo Data:**
| Category | Value (₵B) | Color |
|----------|-----------|-------|
| Current CET1 Capital | 42.5 | `#3B82F6` |
| Stress Capital Shortfall | -8.2 | `#F43F5E` |
| ├─ Credit Loss Shock | -3.5 | `#FB7185` |
| ├─ Market Value Decline | -2.8 | `#FDA4AF` |
| ├─ Operational Loss | -1.2 | `#FECDD3` |
| └─ Other Adjustments | -0.7 | `#FFE4E6` |
| Recovery Actions (Planned) | +12.5 | `#10B981` |
| ├─ Asset Sales | +3.5 | `#34D399` |
| ├─ Cost Reduction Programme | +2.8 | `#6EE7B7` |
| ├─ Capital Raise (Rights) | +4.2 | `#A7F3D0` |
| ├─ Business Line Divestment | +1.5 | `#D1FAE5` |
| └─ RWA Optimization | +0.5 | `#ECFDF5` |
| **Restored Capital Position** | **46.8** | `#8B5CF6` |

**Interactions:**
- **Hover bar:** Tooltip shows exact value, percentage of target, and implementation timeline
- **Click category:** Drill down to action detail panel with owner, milestones, and dependencies
- **Right-click:** Export to PNG/Excel

**Responsive Behavior:**
- Mobile: Vertical layout, bars stacked with summary cards
- Tablet+: Horizontal layout as designed

---

## 4. Recovery Options Planner

### 4.1 Component Specification

**Purpose:** Interactive table of recovery options with estimated impact, implementation timeline, and approval status. Enables ALCO to compare and select recovery actions.

**Component Type:** Data Table with Progress Bars
**Dimensions:** 6 columns × 480px height
**Position:** Third row, left

```
┌────────────────────────────────────────────────────────────────────┐
│ Recovery Options Planner                              [+ Add Option]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Option                    Impact    Timeline   Cost    Status    │
│  ───────────────────────────────────────────────────────────────── │
│  Asset Sales               ₵3.5B    3-6 months  Low    🟢 Approved│
│  [████████████░░░░░░░░]  70% ready                               │
│  Cost Reduction Programme  ₵2.8B    6-12 months Low    🟡 Pending │
│  [████████░░░░░░░░░░░░]  40% ready                               │
│  Rights Issue (Capital)   ₵4.2B    6-9 months  Medium  🟡 Pending │
│  [██████░░░░░░░░░░░░░░]  30% ready                               │
│  Business Line Divestment  ₵1.5B    9-12 months Medium  ⚪ Proposed │
│  [████░░░░░░░░░░░░░░░░]  20% ready                               │
│  RWA Optimization          ₵0.5B    3-6 months  Low    🟢 Approved│
│  [██████████████░░░░░░]  80% ready                               │
│  Liquidity Buffer Build    ₵2.0B    1-3 months  Low    🟢 Approved│
│  [███████████████░░░░░]  85% ready                               │
│  ───────────────────────────────────────────────────────────────── │
│  Total Selected Impact: ₵13.5B                                    │
│  Target Shortfall: ₵8.2B  🟢 Coverage: 165%                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Table Styling:**
```
Header: bg #F8FAFC, 12px uppercase, #64748B, font-weight 600
Row height: 64px (includes progress bar)
Cell padding: 12px 16px
Font: 13px / 500, JetBrains Mono for numbers
Progress bar: height 6px, border-radius 3px, bg #E2E8F0, fill #3B82F6
```

**Status Colors:**
| Status | Color | Label |
|--------|-------|-------|
| Approved | `#10B981` | 🟢 Approved |
| Pending | `#F59E0B` | 🟡 Pending Approval |
| Proposed | `#94A3B8` | ⚪ Proposed |
| Rejected | `#F43F5E` | 🔴 Rejected |

**Demo Data:**
| Option | Impact (₵B) | Timeline | Cost | Status | Readiness |
|--------|-------------|----------|------|--------|-----------|
| Asset Sales | 3.5 | 3-6 months | Low | 🟢 Approved | 70% |
| Cost Reduction Programme | 2.8 | 6-12 months | Low | 🟡 Pending | 40% |
| Rights Issue (Capital) | 4.2 | 6-9 months | Medium | 🟡 Pending | 30% |
| Business Line Divestment | 1.5 | 9-12 months | Medium | ⚪ Proposed | 20% |
| RWA Optimization | 0.5 | 3-6 months | Low | 🟢 Approved | 80% |
| Liquidity Buffer Build | 2.0 | 1-3 months | Low | 🟢 Approved | 85% |

**Interactions:**
- **Click row:** Opens option detail panel with milestones, dependencies, and risk assessment
- **Sort columns:** Click header to sort by impact, timeline, or status
- **Toggle:** Show/hide rejected options
- **Add Option:** Opens modal to propose new recovery action

**Responsive Behavior:**
- Mobile: Full width, scrollable horizontal table
- Tablet+: Full layout as designed

---

## 5. Recovery Plan Timeline

### 5.1 Component Specification

**Purpose:** Gantt-style timeline showing recovery plan milestones, deadlines, and responsible owners. Critical for tracking annual recovery plan preparation and BoG submission.

**Chart Type:** Gantt / Timeline Chart
**Library Recommendation:** ECharts (custom timeline) or custom component
**Dimensions:** 6 columns × 480px height
**Position:** Third row, right

```
┌────────────────────────────────────────────────────────────────────┐
│ Recovery Plan Timeline 2026                           [⋯] [⬇]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Milestone                    Owner        Start      End    Status│
│  ───────────────────────────────────────────────────────────────── │
│  ┌────────────────────────────────────┐                           │
│  │ Trigger Assessment & Scoring       │  Risk Team  Jan  Mar   🟢│
│  └────────────────────────────────────┘                           │
│       ┌────────────────────────────────────────┐                  │
│       │ Recovery Options Identification        │  ALCO  Feb  May   🟢│
│       └────────────────────────────────────────┘                  │
│            ┌──────────────────────────────────────────────┐     │
│            │ Capital Restoration Plan Development           │  Treasury│
│            └──────────────────────────────────────────────┘     │
│                 Apr  Jun   🟡                                     │
│                      ┌─────────────────────────────────────┐      │
│                      │ Board Approval & Risk Committee     │      │
│                      │ Sign-off                              │      │
│                      └─────────────────────────────────────┘      │
│                           Jun  Jul   🟡                           │
│                                ┌────────────────────────────┐     │
│                                │ BoG Submission Preparation │     │
│                                │ (ORASS Integration)          │     │
│                                └────────────────────────────┘     │
│                                     Jul  Sep   🟡                 │
│                                          ┌──────────────┐         │
│                                          │ BoG Filing   │         │
│                                          │ Deadline:    │         │
│                                          │ 31 Dec 2026  │         │
│                                          └──────────────┘         │
│                                               Dec   ⚪            │
│                                                                    │
│  Legend: 🟢 Complete  🟡 In Progress  ⚪ Not Started              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Timeline Bar Colors:**
| Status | Color |
|--------|-------|
| Complete | `#10B981` |
| In Progress | `#3B82F6` |
| Not Started | `#94A3B8` |
| Overdue | `#F43F5E` |
| At Risk | `#F59E0B` |

**Demo Data:**
| Milestone | Owner | Start | End | Status | Progress |
|-----------|-------|-------|-----|--------|----------|
| Trigger Assessment & Scoring | Risk Team | Jan 2026 | Mar 2026 | 🟢 Complete | 100% |
| Recovery Options Identification | ALCO | Feb 2026 | May 2026 | 🟢 Complete | 100% |
| Capital Restoration Plan Development | Treasury | Apr 2026 | Jun 2026 | 🟡 In Progress | 65% |
| Board Approval & Risk Committee Sign-off | CRO Office | Jun 2026 | Jul 2026 | 🟡 In Progress | 40% |
| BoG Submission Preparation | Compliance | Jul 2026 | Sep 2026 | 🟡 In Progress | 25% |
| BoG Filing (Annual Deadline) | CRO Office | Dec 2026 | Dec 2026 | ⚪ Not Started | 0% |

**Interactions:**
- **Click bar:** Opens milestone detail with tasks, dependencies, and documents
- **Hover bar:** Tooltip shows owner, dates, and completion percentage
- **Drag:** Reorder milestones (in edit mode)
- **Filter:** By owner, status, or quarter

**Responsive Behavior:**
- Mobile: Vertical list view with status cards
- Tablet+: Horizontal Gantt timeline

---

## 6. Playbook Activation Panel

### 6.1 Component Specification

**Purpose:** Status dashboard for each recovery playbook phase showing activation criteria, current status, and required actions. Enables rapid response when triggers are breached.

**Component Type:** Status Cards with Action Items
**Dimensions:** 12 columns (full width) × 380px height
**Position:** Bottom row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Playbook Activation Panel                                           [View All Playbooks]   │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐│
│  │ PHASE 1            │  │ PHASE 2            │  │ PHASE 3            │  │ PHASE 4            ││
│  │ Early Warning      │  │ Recovery Options   │  │ Capital Restoration│  │ Resolution         ││
│  │                    │  │                    │  │                    │  │                    ││
│  │  🟢 STANDBY        │  │  🟢 STANDBY        │  │  ⚪ INACTIVE       │  │  ⚪ INACTIVE       ││
│  │                    │  │                    │  │                    │  │                    ││
│  │  Criteria:         │  │  Criteria:         │  │  Criteria:         │  │  Criteria:         ││
│  │  • 1+ trigger      │  │  • 2+ triggers     │  │  • CET1 < 8%       │  │  • CET1 < 5.125%   ││
│  │    breached        │  │    breached        │  │  • LMTD < 100%     │  │  • All options     ││
│  │  • Trend < 30 days │  │  • Trend < 15 days │  │  • NIM < 5%        │  │    exhausted       ││
│  │                    │  │                    │  │                    │  │                    ││
│  │  Actions:          │  │  Actions:          │  │  Actions:          │  │  Actions:          ││
│  │  • Alert ALCO      │  │  • Activate options│  │  • Execute capital │  │  • Contact BoG     ││
│  │  • Daily reporting │  │  • Board briefing  │  │    restoration     │  │  • Resolution      ││
│  │  • Stress test run │  │  • Market comms    │  │  • Asset sales     │  │    planning        ││
│  │                    │  │                    │  │                    │  │                    ││
│  │  [Activate]        │  │  [Activate]        │  │  [Activate]        │  │  [Activate]        ││
│  └────────────────────┘  └────────────────────┘  └────────────────────┘  └────────────────────┘│
│                                                                                            │
│  Last Updated: 25 Jun 2026, 14:32 GMT  •  Next Review: 02 Jul 2026 (ALCO Monthly)       │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Phase Card Styling:**
```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border-radius: 12px
Padding: 20px
Width: ~280px each
Status badge: 8px circle + text, top-right
```

**Status Colors:**
| Status | Badge Color | Background | Description |
|--------|-------------|------------|-------------|
| Standby | `#10B981` | `#ECFDF5` | Monitoring, not triggered |
| Active | `#3B82F6` | `#EEF2FF` | Currently executing |
| Inactive | `#94A3B8` | `#F8FAFC` | Not yet activated |
| Complete | `#8B5CF6` | `#F3E8FF` | Executed and resolved |
| Escalated | `#F43F5E` | `#FFF1F2` | Escalated to board/BoG |

**Demo Data:**
| Phase | Name | Status | Criteria | Key Actions |
|-------|------|--------|----------|-------------|
| Phase 1 | Early Warning | 🟢 Standby | 1+ trigger breached, <30 days | Alert ALCO, daily reporting, stress test |
| Phase 2 | Recovery Options | 🟢 Standby | 2+ triggers breached, <15 days | Activate options, board briefing, market comms |
| Phase 3 | Capital Restoration | ⚪ Inactive | CET1 < 8%, LMTD < 100%, NIM < 5% | Execute capital restoration, asset sales |
| Phase 4 | Resolution | ⚪ Inactive | CET1 < 5.125%, all options exhausted | Contact BoG, resolution planning |

**Interactions:**
- **Click card:** Opens detailed playbook with step-by-step procedures, contact lists, and document templates
- **Click "Activate":** Triggers confirmation modal, logs activation to audit trail, notifies stakeholders
- **Hover:** Shows tooltip with last activation date and outcome (if previously activated)

**Responsive Behavior:**
- Mobile: 2 columns × 2 rows
- Tablet: 4 columns × 1 row

---

## 7. Responsive Layout Summary

| Breakpoint | Trigger Cards | Capital Waterfall | Options Planner | Timeline | Playbook Panel |
|------------|--------------|-------------------|-----------------|----------|--------------|
| Mobile | 2×3 grid | Full width, stacked | Full width | Vertical list | 2×2 grid |
| Tablet | 5×1 grid | Full width | 6 columns | 6 columns | 4×1 grid |
| Desktop+ | 5×1 grid | Full width | 6 columns | 6 columns | 4×1 grid |

---

*Recovery Planning Visuals Version 1.0 — ALM Platform Visual Design Team — June 2026*
