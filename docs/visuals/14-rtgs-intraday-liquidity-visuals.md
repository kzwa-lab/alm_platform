# ALM Platform — RTGS & Intraday Liquidity Visual Specification

**Version:** 1.0
**Last Updated:** 2026-06-25
**Screen:** RTGS & Intraday Liquidity Dashboard
**Context:** Bank of Ghana RTGS (Real-Time Gross Settlement) operations and intraday liquidity monitoring. Covers RTGS feed monitoring, intraday cash position, settlement risk, liquidity forecasting, and transaction logging. Designed for treasury operations, payments team, and ALCO liquidity oversight.

---

## 1. Dashboard Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Navigation + Context Switcher (Entity: Ecobank Ghana PLC | Date: 30 Jun 2026 | GRR: 25.50%)│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  RTGS FEED MONITOR                         │  │  INTRADAY LIQUIDITY POSITION         │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  SETTLEMENT RISK DASHBOARD                 │  │  LIQUIDITY FORECAST                  │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  RTGS TRANSACTION LOG — Large-Value Transactions                                    │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Grid:** 12 columns, 24px gutter, 32px margin
**Background:** `#F8FAFC` (light) / `#0F172A` (dark)

---

## 2. RTGS Feed Monitor

### 2.1 Component Specification

**Purpose:** Real-time monitoring of RTGS transaction flow showing incoming/outgoing volumes, settlement status, and system health. Critical for treasury operations and liquidity management.

**Chart Type:** Real-time Line Chart + Status Cards
**Library Recommendation:** ECharts (dynamic line chart)
**Dimensions:** 6 columns × 480px height
**Position:** Top row, left

```
┌────────────────────────────────────────────────────────────────────┐
│ RTGS Feed Monitor — Real-Time Settlement              [Live] [Pause]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│  │ INCOMING    │ │ OUTGOING    │ │ PENDING     │                │
│  │ ₵2.4B       │ │ ₵1.8B       │ │ ₵0.3B       │                │
│  │ 142 txns    │ │ 98 txns     │ │ 12 txns     │                │
│  │ 🟢 Normal   │ │ 🟢 Normal   │ │ 🟡 Watch    │                │
│  └─────────────┘ └─────────────┘ └─────────────┘                │
│                                                                    │
│  ₵B                                                                 │
│  3.0 ┤                                          ╭────╮           │
│  2.5 ┤                              ╭────╮     ╱      │           │
│  2.0 ┤                  ╭────╮     ╱      │────╯       │           │
│  1.5 ┤    ╭────╮      ╱      │────╯       │            │           │
│  1.0 ┤───╯      │────╯       │            │            │           │
│  0.5 ┤          │            │            │            │           │
│  0.0 ┼──────────┴────────────┴────────────┴────────────┴────────  │
│       08:00   09:00   10:00   11:00   12:00   13:00   14:00       │
│                                                                    │
│  ─ Incoming  ──── Outgoing  ──── Net Position                      │
│                                                                    │
│  System Status: 🟢 BoG RTGS Online  •  Latency: 45ms  •  Uptime: 99.98%│
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Line Style | Legend Label |
|--------|-------|------------|--------------|
| Incoming | `#10B981` | Solid, 3px | Incoming |
| Outgoing | `#F43F5E` | Solid, 3px | Outgoing |
| Net Position | `#3B82F6` | Dashed, 2px | Net Position |

**Axes:**
- **X-axis:** Time of day, format "HH:mm", ticks every hour (08:00–17:00 Ghana time)
- **Y-axis:** GHS Billions, min: -1, max: 3

**Status Cards:**
| Metric | Value | Transactions | Status |
|--------|-------|--------------|--------|
| Incoming | ₵2.4B | 142 | 🟢 Normal |
| Outgoing | ₵1.8B | 98 | 🟢 Normal |
| Pending | ₵0.3B | 12 | 🟡 Watch |

**System Health:**
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| RTGS Status | Online | — | 🟢 |
| Latency | 45ms | < 100ms | 🟢 |
| Uptime | 99.98% | > 99.9% | 🟢 |
| Queue Depth | 12 | < 20 | 🟢 |

**Interactions:**
- **Hover line:** Tooltip shows exact volume and transaction count for that hour
- **Click "Live":** Toggles real-time updates (every 30 seconds)
- **Click "Pause":** Pauses real-time updates for analysis
- **Click status card:** Opens detailed breakdown by transaction type
- **Click "Pending":** Opens pending transaction queue with priority

**Responsive Behavior:**
- Mobile: Full width, status cards stacked, simplified chart
- Tablet+: Full layout as designed

---

## 3. Intraday Liquidity Position

### 3.1 Component Specification

**Purpose:** Hourly cash position throughout the Ghana business day showing BoG settlement account balance, available liquidity, and peak funding requirements.

**Chart Type:** Area Chart with Threshold Bands
**Library Recommendation:** ECharts
**Dimensions:** 6 columns × 480px height
**Position:** Top row, right

```
┌────────────────────────────────────────────────────────────────────┐
│ Intraday Liquidity Position                           [Today] [Yesterday]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│  │ OPENING     │ │ CURRENT     │ │ MINIMUM     │                │
│  │ ₵8.2B       │ │ ₵6.5B       │ │ ₵4.0B       │                │
│  │ 08:00       │ │ 14:32       │ │ 11:45       │                │
│  │ 🟢          │ │ 🟢          │ │ 🟡          │                │
│  └─────────────┘ └─────────────┘ └─────────────┘                │
│                                                                    │
│  ₵B                                                                 │
│  10 ┤    ╭─╮                                                       │
│   8 ┤───╯   ╰──╮                                                   │
│   6 ┤          ╰──╮        ╭────╮                                  │
│   4 ┤             ╰────────╯    ╰────╮                             │
│   2 ┤                                 ╰────╮                       │
│   0 ┼────────┬────────┬────────┬────────┬────────┬────────       │
│       08:00   09:00   10:00   11:00   12:00   13:00   14:00       │
│                                                                    │
│  ──── Cash Position  ▓▓▓ Minimum Required  ═══ Intraday Limit      │
│                                                                    │
│  Peak Requirement: ₵8.2B at 08:45  •  Average: ₵5.8B               │
│  🟢 Within intraday limit (Limit: ₵10.0B)                        │
│                                                                    │
│  [View Settlement Account]  [View Liquidity Buffer]                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Type | Legend Label |
|--------|-------|------|--------------|
| Cash Position | `#3B82F6` | Area | Cash Position |
| Minimum Required | `#F59E0B` | Dashed line | Minimum Required |
| Intraday Limit | `#F43F5E` | Dashed line | Intraday Limit |
| Average | `#94A3B8` | Dotted line | 30-Day Average |

**Axes:**
- **X-axis:** Time of day, format "HH:mm", Ghana business hours (08:00–17:00)
- **Y-axis:** GHS Billions, min: 0, max: 10

**Demo Data (hourly cash position, ₵B):**
| Time | Cash Position | Minimum Required | Intraday Limit | 30D Average |
|------|---------------|------------------|----------------|-------------|
| 08:00 | 8.2 | 3.0 | 10.0 | 7.5 |
| 09:00 | 6.8 | 3.0 | 10.0 | 6.2 |
| 10:00 | 5.5 | 3.0 | 10.0 | 5.8 |
| 11:00 | 4.8 | 3.0 | 10.0 | 5.2 |
| 12:00 | 4.2 | 3.0 | 10.0 | 4.8 |
| 13:00 | 5.5 | 3.0 | 10.0 | 5.5 |
| 14:00 | 6.5 | 3.0 | 10.0 | 6.2 |
| 15:00 | 7.2 | 3.0 | 10.0 | 6.8 |
| 16:00 | 8.0 | 3.0 | 10.0 | 7.5 |
| 17:00 | 8.5 | 3.0 | 10.0 | 8.0 |

**Key Metrics:**
| Metric | Value | Time | Status |
|--------|-------|------|--------|
| Opening Balance | ₵8.2B | 08:00 | 🟢 |
| Current Balance | ₵6.5B | 14:32 | 🟢 |
| Minimum Balance | ₵4.0B | 11:45 | 🟡 |
| Peak Requirement | ₵8.2B | 08:45 | 🟢 |
| Average | ₵5.8B | — | 🟢 |
| Intraday Limit | ₵10.0B | — | 🟢 |

**Interactions:**
- **Hover area:** Tooltip shows exact balance, minimum, and limit for that hour
- **Click point:** Shows transaction breakdown for that hour
- **Toggle "Today"/"Yesterday":** Compare current vs previous day
- **Click "View Settlement Account":** Opens BoG settlement account detail
- **Click "View Liquidity Buffer":** Shows available liquidity sources

**Responsive Behavior:**
- Mobile: Full width, status cards stacked, simplified chart
- Tablet+: Full layout as designed

---

## 4. Settlement Risk Dashboard

### 4.1 Component Specification

**Purpose:** Monitor counterparty settlement risk and gridlock detection in RTGS. Shows largest exposures, settlement failures, and risk concentration.

**Component Type:** Bar Chart + Risk Cards
**Library Recommendation:** ECharts
**Dimensions:** 6 columns × 480px height
**Position:** Second row, left

```
┌────────────────────────────────────────────────────────────────────┐
│ Settlement Risk Dashboard                             [Counterparty ▾]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│  │ MAX EXPOSURE│ │ SETTLEMENT  │ │ GRIDLOCK    │                │
│  │ ₵450M       │ │ FAILURES    │ │ RISK        │                │
│  │ Ecobank     │ │ 0           │ │ Low         │                │
│  │ 🟢          │ │ 🟢          │ │ 🟢          │                │
│  └─────────────┘ └─────────────┘ └─────────────┘                │
│                                                                    │
│  Counterparty Exposure (₵M)                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                    │
│  Ecobank Ghana      ████████████████████████████████████████  450  │
│  GCB Bank           ██████████████████████████████        320  │
│  Stanbic Bank       ██████████████████████████            280  │
│  Fidelity Bank      ██████████████████████                240  │
│  Absa Bank          ████████████████████                  210  │
│  Standard Chartered ████████████████                      180  │
│  CalBank            ██████████████                        150  │
│  UBA Ghana          ████████████                          120  │
│  ────────────────────────────────────────────────────────────────│
│  Total Exposure: ₵1.95B  •  Average: ₵244M  •  Limit: ₵500M    │
│                                                                    │
│  🟢 Within limit — Largest exposure: ₵450M (90% of limit)        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Legend Label |
|--------|-------|--------------|
| Exposure | `#3B82F6` | Counterparty Exposure |
| Limit | `#F43F5E` | Exposure Limit (dashed line) |

**Axes:**
- **X-axis:** Exposure (₵M), min: 0, max: 500
- **Y-axis:** Counterparty names

**Demo Data:**
| Counterparty | Exposure (₵M) | Limit (₵M) | Utilisation | Status |
|--------------|---------------|------------|-------------|--------|
| Ecobank Ghana | 450 | 500 | 90% | 🟢 |
| GCB Bank | 320 | 400 | 80% | 🟢 |
| Stanbic Bank | 280 | 350 | 80% | 🟢 |
| Fidelity Bank | 240 | 300 | 80% | 🟢 |
| Absa Bank | 210 | 280 | 75% | 🟢 |
| Standard Chartered | 180 | 250 | 72% | 🟢 |
| CalBank | 150 | 200 | 75% | 🟢 |
| UBA Ghana | 120 | 180 | 67% | 🟢 |

**Risk Metrics:**
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Max Exposure | ₵450M | < ₵500M | 🟢 |
| Settlement Failures | 0 | < 5/day | 🟢 |
| Gridlock Risk | Low | — | 🟢 |
| Concentration (Top 3) | 58% | < 70% | 🟢 |

**Interactions:**
- **Hover bar:** Tooltip shows exposure, limit, utilisation, and trend
- **Click bar:** Opens counterparty detail with transaction history and credit info
- **Click "Counterparty" dropdown:** Filter by bank type or exposure range
- **Click risk card:** Opens detailed risk assessment

**Responsive Behavior:**
- Mobile: Full width, horizontal bars
- Tablet+: Full layout as designed

---

## 5. Liquidity Forecast

### 5.1 Component Specification

**Purpose:** Predicted intraday liquidity position based on scheduled payments, known inflows, and historical patterns. Enables proactive liquidity management.

**Chart Type:** Forecast Line Chart with Confidence Bands
**Library Recommendation:** ECharts
**Dimensions:** 6 columns × 480px height
**Position:** Second row, right

```
┌────────────────────────────────────────────────────────────────────┐
│ Liquidity Forecast — Predicted Intraday Position      [Run Forecast]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ₵B                                                                 │
│  10 ┤    ╭─╮                                                       │
│   8 ┤───╯   ╰──╮        ╭────╮        ╭────╮                     │
│   6 ┤          ╰────────╯    ╰────────╯    ╰────╮                │
│   4 ┤                                             ╰────╮         │
│   2 ┤                                                  ╰────╮   │
│   0 ┼────────┬────────┬────────┬────────┬────────┬────────    │
│       08:00   09:00   10:00   11:00   12:00   13:00   14:00     │
│                                                                    │
│  ─── Forecast (Base)  ▓▓▓ Confidence Band (80%)  ● Actual        │
│                                                                    │
│  Scheduled Payments Today:                                        │
│  • Govt Securities Maturity: ₵1.2B (inflow, 10:00)                  │
│  • Corporate Tax Payment: ₵0.8B (outflow, 11:00)                │
│  • Interbank Settlement: ₵0.5B (outflow, 12:00)                   │
│  • FX Settlement: ₵0.3B (outflow, 14:00)                        │
│                                                                    │
│  Forecast Accuracy (30-day): 94%  •  RMSE: ₵0.4B                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Data Series:**
| Series | Color | Line Style | Legend Label |
|--------|-------|------------|--------------|
| Forecast (Base) | `#3B82F6` | Solid, 3px | Forecast (Base) |
| Confidence Upper | `#3B82F6` | None, fill at 10% | 80% CI Upper |
| Confidence Lower | `#3B82F6` | None, fill at 10% | 80% CI Lower |
| Actual | `#10B981` | Dots | Actual (observed) |

**Axes:**
- **X-axis:** Time of day, format "HH:mm", Ghana business hours (08:00–17:00)
- **Y-axis:** GHS Billions, min: 0, max: 10

**Scheduled Payments:**
| Time | Description | Amount (₵B) | Type | Status |
|------|-------------|-------------|------|--------|
| 10:00 | Govt Securities Maturity | +1.2 | Inflow | Scheduled |
| 11:00 | Corporate Tax Payment | -0.8 | Outflow | Scheduled |
| 12:00 | Interbank Settlement | -0.5 | Outflow | Scheduled |
| 14:00 | FX Settlement | -0.3 | Outflow | Scheduled |

**Forecast Metrics:**
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Accuracy (30-day) | 94% | ≥ 90% | 🟢 |
| RMSE | ₵0.4B | ≤ ₵0.5B | 🟢 |
| MAE | ₵0.3B | ≤ ₵0.4B | 🟢 |
| Bias | +₵0.1B | ≤ ₵0.2B | 🟢 |

**Interactions:**
- **Hover line:** Tooltip shows forecast, confidence band, and actual (if observed)
- **Click scheduled payment:** Opens payment detail with counterparty and purpose
- **Click "Run Forecast":** Triggers fresh forecast with latest data
- **Toggle confidence band:** Show/hide 80% confidence interval

**Responsive Behavior:**
- Mobile: Full width, simplified chart
- Tablet+: Full layout as designed

---

## 6. RTGS Transaction Log

### 6.1 Component Specification

**Purpose:** Table of large-value RTGS transactions with status, counterparty, and settlement details. Critical for audit, reconciliation, and fraud monitoring.

**Component Type:** Data Table with Filters
**Dimensions:** 12 columns (full width) × 420px height
**Position:** Bottom row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ RTGS Transaction Log                                     [Filter] [Export] [⋯] [⬇]         │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  Time    Reference   Counterparty      Amount    Type      Status    Settlement   Flags  │
│  ──────────────────────────────────────────────────────────────────────────────────────────│
│  14:32  RTGS-4521   GCB Bank           ₵125.0M   Outgoing  🟢 Settled  RTGS          —      │
│  14:28  RTGS-4520   Stanbic Bank      ₵85.5M    Incoming  🟢 Settled  RTGS          —      │
│  14:15  RTGS-4519   Fidelity Bank    ₵45.2M    Outgoing  🟢 Settled  RTGS          —      │
│  14:10  RTGS-4518   Absa Bank         ₵32.8M    Incoming  🟢 Settled  RTGS          —      │
│  14:05  RTGS-4517   Standard Chartered ₵28.5M   Outgoing  🟡 Pending  RTGS          —      │
│  13:55  RTGS-4516   CalBank           ₵18.2M    Incoming  🟢 Settled  RTGS          —      │
│  13:48  RTGS-4515   UBA Ghana         ₵15.5M    Outgoing  🟢 Settled  RTGS          —      │
│  13:42  RTGS-4514   Ecobank Ghana    ₵12.4M    Incoming  🟢 Settled  RTGS          —      │
│  13:35  RTGS-4513   GCB Bank           ₵8.5M     Outgoing  🟢 Settled  RTGS          —      │
│  ──────────────────────────────────────────────────────────────────────────────────────────│
│                                                                                            │
│  Showing 10 of 142 transactions  •  Total Volume: ₵2.4B  •  Total Count: 142              │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Table Styling:**
```
Header: bg #F8FAFC, 12px uppercase, #64748B, font-weight 600
Row height: 48px
Cell padding: 12px 16px
Font: 13px / 500, JetBrains Mono for amounts and references
Status badge: pill, 12px, color-coded
```

**Transaction Status Colors:**
| Status | Color | Description |
|--------|-------|-------------|
| Settled | `#10B981` | Successfully settled |
| Pending | `#F59E0B` | Awaiting settlement |
| Failed | `#F43F5E` | Settlement failed |
| Reversed | `#8B5CF6` | Reversed after settlement |
| Queued | `#3B82F6` | Queued for settlement |

**Demo Data:**
| Time | Reference | Counterparty | Amount | Type | Status | Settlement | Flags |
|------|-----------|--------------|--------|------|--------|------------|-------|
| 14:32 | RTGS-4521 | GCB Bank | ₵125.0M | Outgoing | 🟢 Settled | RTGS | — |
| 14:28 | RTGS-4520 | Stanbic Bank | ₵85.5M | Incoming | 🟢 Settled | RTGS | — |
| 14:15 | RTGS-4519 | Fidelity Bank | ₵45.2M | Outgoing | 🟢 Settled | RTGS | — |
| 14:10 | RTGS-4518 | Absa Bank | ₵32.8M | Incoming | 🟢 Settled | RTGS | — |
| 14:05 | RTGS-4517 | Standard Chartered | ₵28.5M | Outgoing | 🟡 Pending | RTGS | — |
| 13:55 | RTGS-4516 | CalBank | ₵18.2M | Incoming | 🟢 Settled | RTGS | — |
| 13:48 | RTGS-4515 | UBA Ghana | ₵15.5M | Outgoing | 🟢 Settled | RTGS | — |
| 13:42 | RTGS-4514 | Ecobank Ghana | ₵12.4M | Incoming | 🟢 Settled | RTGS | — |
| 13:35 | RTGS-4513 | GCB Bank | ₵8.5M | Outgoing | 🟢 Settled | RTGS | — |

**Transaction Flags:**
| Flag | Description |
|------|-------------|
| — | No flags |
| 🚩 | Large value (>₵100M) |
| ⚠️ | Unusual pattern |
| 🔒 | High priority |
| 🔄 | Recurring payment |

**Interactions:**
- **Click row:** Opens transaction detail with full audit trail and counterparty info
- **Sort columns:** Click header to sort by time, amount, or status
- **Filter:** By counterparty, type, status, or amount range
- **Click "Export":** Exports log to Excel/CSV
- **Click flag:** Opens alert detail (if flagged)

**Responsive Behavior:**
- Mobile: Card list view with key fields
- Tablet+: Full table as designed

---

## 7. Responsive Layout Summary

| Breakpoint | RTGS Monitor | Intraday Position | Settlement Risk | Forecast | Transaction Log |
|------------|-------------|-------------------|-----------------|----------|-----------------|
| Mobile | Full width | Full width | Full width | Full width | Card list |
| Tablet | 6 columns | 6 columns | 6 columns | 6 columns | Full width |
| Desktop+ | 6 columns | 6 columns | 6 columns | 6 columns | Full width |

---

*RTGS & Intraday Liquidity Visuals Version 1.0 — ALM Platform Visual Design Team — June 2026*
