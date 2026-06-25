# ALM Platform — Navigation Shell Specification

**Version:** 1.0  
**Last Updated:** 2026-06-25  
**Screen:** Global Navigation Shell (All Pages)  
**Context:** Persistent shell wrapping every ALM platform view. Optimized for desktop ALCO displays with collapsible sidebar for maximum content area.

---

## 1. Top Navigation Bar

### 1.1 Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ←≡ │ 🏦 ALM PLATFORM      │  🔍 Search...          │ 🔔 3 │ ⚠ 1 │ 👤 J. Müller │ ? │ 🌙 │
│     │ Global ALM Dashboard │                        │      │     │  CFO          │   │    │
└────────────────────────────────────────────────────────────────────────────────────────────┘
Height: 56px
Background: #FFFFFF (light) / #1E293B (dark)
Border-bottom: 1px solid #E2E8F0 (light) / #334155 (dark)
Position: sticky, top: 0, z-index: 100
Shadow: 0 1px 3px rgba(0,0,0,0.05) (scrolled state)
```

### 1.2 Left Section

#### Hamburger Menu (Mobile/Tablet Only)
```
Width: 40px, Height: 40px
Icon: Menu (≡), 20px, #64748B
Hover: bg #F1F5F9, border-radius 8px
Click: Opens sidebar drawer on mobile/tablet
```

#### Bank Logo + Platform Name
```
Logo: 32px × 32px SVG, bank crest/icon, color #3B82F6
Text: "ALM PLATFORM" (14px / 700 / #1E293B)
Subtext: "Global ALM Dashboard" (11px / 400 / #94A3B8, below on hover)
Gap: 12px between logo and text
Click: Returns to landing dashboard (02-landing-dashboard)
Hover: Logo scales 1.05, text color shifts to #3B82F6
```

#### Context Breadcrumb (Tablet+)
```
Shown when: Navigated into a module
Format: "Liquidity → LCR Analysis" or "Capital → RWA Breakdown"
Font: 13px / 500 / #64748B
Separator: ChevronRight (›), 12px, #CBD5E1
Click: Each segment is clickable, navigates to that level
```

### 1.3 Center Section — Global Search

#### Search Bar
```
Width: 480px (desktop), 320px (tablet), full-width (mobile, expanded)
Height: 40px
Background: #F1F5F9 (light) / #0F172A (dark)
Border: 1px solid transparent
Border-radius: 8px
Padding: 0 16px 0 40px (left icon)
Placeholder: "Search reports, metrics, ISINs, entities..." (13px / #94A3B8)
Icon: Search (🔍), 16px, #94A3B8, left side, 12px from edge

Focus: border #3B82F6, ring 2px #BFDBFE, bg #FFFFFF
Expanded: Dropdown panel below, 560px max-width
```

#### Search Dropdown Panel
```
Background: #FFFFFF, border 1px #E2E8F0, shadow-lg, border-radius 12px
Sections: Recent Searches | Saved Reports | Suggestions | Global Results

Recent Searches:
  - List of last 5 searches, Clock icon, "LCR stress test Q3"
  - Click: Executes search immediately

Saved Reports:
  - Star icon, report name, module tag (pill)
  - "ALCO Pack — July 2026" (Liquidity)

Suggestions (as user types):
  - Categorized: Metrics, Reports, Entities, ISINs
  - Metric: "LCR" → "Liquidity Coverage Ratio: 136.2%"
  - Report: "LCR" → "LCR Waterfall Report"
  - Entity: "LCR" → "LCR Bank Subsidiary (DE)"
  - Keyboard: Up/Down arrows navigate, Enter selects, Escape closes

Global Results:
  - Top 3 matches per category
  - "View all results →" link at bottom
```

### 1.4 Right Section — User & System Controls

#### Notification Bell
```
Icon: Bell (🔔), 20px, #64748B
Badge: Red circle (#F43F5E), 16px diameter, white number, top-right of icon
Badge number: 3 (example), font 10px bold
Hover: bg #F1F5F9, icon color #3B82F6
Click: Opens notification dropdown panel

Notification Panel:
  Width: 400px, max-height 480px, scrollable
  Header: "Notifications" (16px / 600), "Mark all read" link right-aligned
  Sections: Alerts (red), Tasks (blue), System (gray)
  
  Alert Item:
    ┌────────────────────────────────────┐
    │ ⚠  │ LCR below 120% warning          │
    │    │ LCR dropped to 118.3% in DE     │
    │    │ entity. Action required.         │
    │    │ 12 min ago                    [→]│
    └────────────────────────────────────┘
    Icon: AlertTriangle (amber) or XCircle (red) or Info (blue)
    Title: 14px / 600 / #1E293B
    Body: 13px / 400 / #64748B
    Time: 12px / 400 / #94A3B8
    Arrow: ChevronRight, indicates drill-down
    Hover: bg #F8FAFC
    Unread: Left border 3px #3B82F6 (alerts: #F43F5E)
```

#### Task Alert (Approvals)
```
Icon: ClipboardList (📋), 20px, #64748B
Badge: Blue circle (#3B82F6), number
Shows: Pending approvals, review requests, sign-offs needed
Click: Opens task panel with approval queue
```

#### User Avatar Menu
```
Avatar: 36px circle, initials "JM" (14px / 700 / #FFFFFF), bg #3B82F6
Name: "J. Müller" (13px / 500 / #334155), role "CFO" (12px / 400 / #94A3B8)
Dropdown arrow: ChevronDown, 12px, #94A3B8
Click: Opens user dropdown

User Dropdown:
  Width: 240px
  Sections:
    - Profile: Avatar + full name + role + email
    - Divider
    - Status: "Online", "Away", "In ALCO Meeting"
    - Items: "My Profile", "My Reports", "Settings"
    - Divider
    - Theme: "Light Mode" / "Dark Mode" toggle with Sun/Moon icons
    - Language: "English ▾" / "Deutsch ▾" / "Français ▾"
    - Divider
    - "Sign Out" (LogOut icon, #F43F5E text)
```

#### Help Button
```
Icon: HelpCircle (?), 20px, #64748B
Hover: bg #F1F5F9, color #3B82F6
Click: Opens help panel (right slide-over) or documentation link
```

#### Dark Mode Toggle
```
Icon: Sun (☀) / Moon (🌙), 20px, #64748B
Toggle: Click switches theme, icon animates rotation 180°
State: Persistent across sessions (localStorage)
Auto: Switches to dark mode 18:00–08:00 (configurable)
```

---

## 2. Left Sidebar — Module Navigation

### 2.1 Overview

```
┌────────────────────────────────────────────────────┐
│ ALM PLATFORM          │ ≡ (collapse)               │
├────────────────────────────────────────────────────┤
│  📊  Dashboard                                      │
│  💧  Liquidity Risk         ▾                      │
│      ├─ LCR Analysis                               │
│      ├─ NSFR Monitor                               │
│      ├─ Gap Analysis                               │
│      ├─ Stress Testing                             │
│      └─ HQLA Inventory                             │
│  📈  IRRBB                  ▾                      │
│      ├─ EVE Sensitivity                            │
│      ├─ NII Forecast                               │
│      ├─ Repricing Gap                              │
│      ├─ Yield Curve                                │
│      └─ Derivatives                                │
│  🛡  Capital Adequacy      ▾                      │
│      ├─ CET1 & Ratios                              │
│      ├─ RWA Composition                            │
│      ├─ Output Floor                               │
│      ├─ Leverage Ratio                             │
│      └─ FRTB / TLAC                                │
│  ⚠  ECL / Credit Risk     ▾                      │
│      ├─ ECL Trend                                  │
│      ├─ Staging Monitor                            │
│      ├─ SICR Triggers                              │
│      ├─ Scenario Comparison                        │
│      └─ Overlay Governance                         │
│  🔄  FTP & Pricing         ▾                      │
│      ├─ FTP Curve                                  │
│      ├─ NMD Portfolio                              │
│      ├─ Deal Profitability                       │
│      ├─ Loan Pricing Calculator                    │
│      └─ LTP Attribution                            │
│  🎯  Optimization           ▾                      │
│      ├─ NIM Attribution                            │
│      ├─ What-If Builder                            │
│      ├─ Balance Sheet Plan                       │
│      └─ ALCO Pack                                  │
│  📋  Reports & Analytics   ▾                      │
│      ├─ ALCO Reports                               │
│      ├─ Regulatory Submissions                     │
│      ├─ Ad-Hoc Queries                             │
│      └─ Scheduled Reports                          │
├────────────────────────────────────────────────────┤
│  ⚙   Settings                                      │
│  📚  Documentation                                   │
└────────────────────────────────────────────────────┘

Width: 240px (expanded) / 64px (collapsed)
Background: #FFFFFF (light) / #1E293B (dark)
Border-right: 1px solid #E2E8F0 (light) / #334155 (dark)
```

### 2.2 Module Header

```
Text: "ALM PLATFORM" (12px / 700 / #94A3B8, uppercase, letter-spacing 0.1em)
Collapse button: Right-aligned, PanelLeft icon (◀), 16px
Collapsed state: Show only icons, 64px width, tooltip on hover shows name
```

### 2.3 Module Navigation Items

#### Top-Level Item (Collapsed)
```
Height: 44px
Padding: 0 16px
Icon: 20px, #64748B (inactive) / #3B82F6 (active)
Text: 14px / 500 / #334155 (inactive) / #3B82F6 (active)
Background: transparent (inactive) / #EEF2FF (active, light) / #172554 (active, dark)
Left accent: 3px solid transparent (inactive) / #3B82F6 (active)
Hover: bg #F8FAFC, icon #475569
Chevron: Right side, 14px, #94A3B8, rotates 90° when expanded
```

#### Top-Level Item (Expanded)
```
Same as collapsed +:
Text visible: Module name + expand indicator
Gap: 12px between icon and text
```

#### Sub-Item (Child)
```
Height: 36px
Padding: 0 16px 0 48px (indented)
Font: 13px / 400 / #64748B (inactive) / #3B82F6 (active)
Background: transparent (inactive) / #EEF2FF (active, light)
Hover: text #475569, bg #F8FAFC
Active: font-weight 600, left dot indicator 4px #3B82F6
```

### 2.4 Module List with Icons

| Module | Icon | Icon Color | Description |
|--------|------|------------|-------------|
| Dashboard | LayoutDashboard | #3B82F6 | ALCO landing page |
| Liquidity Risk | Droplets | #06B6D4 | LCR, NSFR, gap analysis |
| IRRBB | TrendingUp | #8B5CF6 | EVE, NII, yield curve |
| Capital Adequacy | Shield | #10B981 | CET1, RWA, leverage |
| ECL / Credit Risk | AlertTriangle | #F59E0B | IFRS 9, staging, overlays |
| FTP & Pricing | ArrowLeftRight | #6366F1 | Transfer pricing, deal P&L |
| Optimization | Target | #EC4899 | NIM, what-if, ALCO pack |
| Reports & Analytics | FileBarChart | #64748B | All reports, submissions |

### 2.5 Sidebar Footer

```
Height: 96px (two items)
Border-top: 1px solid #E2E8F0

Settings:
  Icon: Settings (⚙), 20px
  Text: "Settings" (14px / 500)
  Hover: bg #F8FAFC

Documentation:
  Icon: BookOpen (📚), 20px
  Text: "Documentation" (14px / 500)
  Hover: bg #F8FAFC
  Click: Opens docs in new tab or right panel
```

### 2.6 Sidebar States

#### Collapsed State (Icon-Only)
```
Width: 64px
Items: Icon only, 20px, centered
Active: bg #EEF2FF, icon #3B82F6
Tooltip: Hover shows module name + shortcut key
  - Tooltip: 13px, bg #1E293B, text #FFFFFF, border-radius 8px
  - Arrow: 6px, pointing to icon
  - Delay: 300ms
```

#### Expanded State
```
Width: 240px
Full text + icons visible
Sub-items expandable
```

#### Hover-Expand (Tablet/Desktop)
```
Collapsed sidebar → hover for 500ms → temporarily expands to 240px
Mouse leaves sidebar → collapses after 300ms delay
Content area does not shift; sidebar overlays content
```

---

## 3. Breadcrumb Trail

### 3.1 Overview

```
Home › Liquidity Risk › LCR Analysis › Stress Test Results

Position: Below top bar, above page content
Height: 36px
Background: transparent (page bg shows through)
Padding: 0 32px
Font: 13px / 400 / #64748B
```

### 3.2 Breadcrumb Item

```
Home: "Dashboard" text, clickable, links to landing page
Separator: ChevronRight (›), 12px, #CBD5E1, margin 0 8px
Current page: #334155, font-weight 600, not clickable
Previous pages: #64748B, hover: #3B82F6, underline on hover
```

### 3.3 Responsive Behavior

```
Mobile: Truncate middle items, show only first + last + current
  Example: "Home › ... › LCR › Stress Test"
Tablet+: Show all items, truncate if more than 5
Desktop+: Full breadcrumb, all items visible
```

---

## 4. Context Switcher Bar

### 4.1 Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Entity: ▾ Deutsche Bank AG (Consolidated) │ Reporting Date: ▾ 30 Jun 2026 │ Scenario: ▾ Base │
└────────────────────────────────────────────────────────────────────────────────────────────┘

Position: Below breadcrumb, above main content
Height: 52px
Background: #F8FAFC (light) / #0F172A (dark)
Border-bottom: 1px solid #E2E8F0 (light) / #334155 (dark)
Padding: 0 32px
Display: flex, gap 24px, align-items center
```

### 4.2 Entity / Subsidiary Selector

```
Label: "Entity:" (12px / 500 / #64748B, uppercase)
Dropdown: Same as standard Dropdown component, 280px width
Trigger: "Deutsche Bank AG (Consolidated)" (14px / 600 / #334155)
Icon: Building2 (🏢), 16px, left of text

Dropdown Panel:
  Search bar at top: "Search entities..." (13px)
  Grouped by:
    - Consolidated Group
    - Subsidiaries (by country)
    - Branches
    - JVs & Associates
  
  Entity Item:
    ┌────────────────────────────────────┐
    │ 🏢  Deutsche Bank AG              │
    │     DE | LEI: 7LTWFZYICNSXMI7...   │
    │     [Consolidated]  [Primary]       │
    └────────────────────────────────────┘
    
  Selected: Checkmark icon, bg #EEF2FF
  Hover: bg #F8FAFC
  Flags: Country flag emoji or SVG icon (16px)
  LEI: Truncated, 13px / #94A3B8
  Tags: "Consolidated", "Primary" — pill badges
```

### 4.3 Reporting Date Selector

```
Label: "Reporting Date:" (12px / 500 / #64748B, uppercase)
Dropdown: Same as standard Dropdown, 200px width
Trigger: "30 Jun 2026" (14px / 600 / #334155)
Icon: Calendar (📅), 16px, left of text

Dropdown Panel:
  Options: Last 12 month-ends + today + custom
  Recent: "30 Jun 2026", "31 May 2026", "30 Apr 2026"...
  Custom: "Custom Date..." → opens date picker
  
  Date Item:
    Text: "30 Jun 2026" (14px / 500)
    Subtext: "Friday • Q2 2026" (12px / #94A3B8)
    Status: Dot indicator (green = data available, amber = provisional, red = missing)
    Selected: Checkmark, bg #EEF2FF
```

### 4.4 Scenario Selector

```
Label: "Scenario:" (12px / 500 / #64748B, uppercase)
Dropdown: Same as standard Dropdown, 220px width
Trigger: "Base Case" (14px / 600 / #334155)
Icon: Layers (📑), 16px, left of text

Dropdown Panel:
  Sections: Standard Scenarios | Custom Scenarios | Stress Tests
  
  Standard:
    - Base Case (blue dot)
    - Upside (green dot)
    - Downside (amber dot)
    - Severe Downside (red dot)
  
  Custom:
    - "Rates +100bps" (user-defined)
    - "TLTRO Repayment" (user-defined)
  
  Stress Tests:
    - EBA Stress Test 2026
    - Idiosyncratic Liquidity
    - Combined Market + Idiosyncratic
  
  Item Format:
    Text: "Base Case" (14px / 500)
    Description: "Central macro forecast" (12px / #94A3B8)
    Color dot: 8px circle, scenario color, left side
    Selected: Checkmark, bg #EEF2FF
```

### 4.5 Currency Selector (Optional)

```
Label: "Currency:" (12px / 500 / #64748B, uppercase)
Dropdown: 160px width
Trigger: "EUR (€)" (14px / 600 / #334155)
Icon: Globe (🌐), 16px, left of text

Options: EUR (€), USD ($), GBP (£), CHF (Fr), JPY (¥)
All amounts on page recalculate on selection
Conversion rates shown in tooltip: "1 EUR = 1.08 USD (30 Jun 2026)"
```

---

## 5. Quick Actions Bar

### 5.1 Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ⭐ Favorites: ALCO Pack │ LCR Waterfall │ ECL Trend   │ 📌 Recently: NSFR Monitor │ ... │
│            │ 3 reports pinned       │ 5 recently viewed          │ [Edit] │
└────────────────────────────────────────────────────────────────────────────────────────────┘

Position: Below context switcher, optional (collapsible)
Height: 48px
Background: transparent
Padding: 0 32px
Border-bottom: 1px solid #E2E8F0 (only if visible)
```

### 5.2 Favorites Section

```
Label: "⭐ Favorites" (13px / 600 / #64748B)
Items: Horizontal scrollable list, gap 8px

Favorite Item:
  Background: #F1F5F9
  Border: 1px solid #E2E8F0
  Border-radius: 20px (pill)
  Padding: 6px 14px
  Font: 13px / 500 / #334155
  Icon: Module icon (16px), left of text
  Hover: bg #EEF2FF, border #3B82F6, color #3B82F6
  Click: Navigates to that report/view
  Remove: X icon (14px) on hover, top-right, removes from favorites
```

#### Example Favorite Items
| Favorite | Module Icon | Label |
|----------|-------------|-------|
| ALCO Pack | FileBarChart | "ALCO Pack" |
| LCR Waterfall | Droplets | "LCR Waterfall" |
| ECL Trend | AlertTriangle | "ECL Trend" |
| NIM Attribution | Target | "NIM Attribution" |
| Yield Curve | TrendingUp | "Yield Curve" |

### 5.3 Recently Viewed Section

```
Label: "📌 Recently" (13px / 600 / #64748B)
Items: Same pill style as favorites, but muted colors

Recent Item:
  Background: transparent
  Border: 1px solid #CBD5E1
  Border-radius: 20px
  Padding: 6px 14px
  Font: 13px / 400 / #64748B
  Hover: bg #F8FAFC, border #94A3B8
  Time: "2h ago" (11px / #94A3B8, right side)
```

### 5.4 Edit Mode

```
Button: "Edit" (Pencil icon, 14px) → toggles to "Done"
Edit state: Favorites show drag handles, X buttons visible
Drag: Reorder favorites via drag-and-drop
Add: "+ Add Favorite" button opens module picker
```

---

## 6. Notification Center

### 6.1 Overview

The notification center is a dedicated view (accessible from the bell icon) that aggregates all system alerts, threshold breaches, approval requests, and task assignments.

### 6.2 Notification Center Layout

```
┌────────────────────────────────────────────────────────────────────┐
│ Notifications                                     [Mark all read]   │
├────────────────────────────────────────────────────────────────────┤
│ 🔴 Alerts (2)  │ 🟡 Tasks (1)  │ 🔵 System (3)  │ All (6)        │
├────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ ⚠ LCR Below Warning Threshold                                │   │
│ │    LCR in DE entity dropped to 118.3% (threshold: 120%).    │   │
│ │    Liquidity Risk → LCR Analysis        12 min ago   [→]    │   │
│ │    [View Details]  [Dismiss]                                 │   │
│ └──────────────────────────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ 🚨 ECL Overlay Requires Approval                              │   │
│ │    Overlay EUR 4.2M for climate risk needs Risk Committee   │   │
│ │    sign-off by 30 Jun 2026.                                  │   │
│ │    ECL → Overlay Governance             1 hour ago   [→]    │   │
│ │    [Review]  [Approve]  [Reject]                            │   │
│ └──────────────────────────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ ℹ System Maintenance Scheduled                                │   │
│ │    Platform maintenance on 28 Jun 2026, 02:00–04:00 CET.     │   │
│ │    System                               3 hours ago   [→]      │   │
│ │    [Acknowledge]                                              │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                    │
│ [Load more...]                                                     │
└────────────────────────────────────────────────────────────────────┘

Width: 480px (slide-over from right)
Background: #FFFFFF (light) / #1E293B (dark)
Header: 56px height, sticky, border-bottom
```

### 6.3 Alert Categories

#### Threshold Breaches (Red)
```
Icon: AlertTriangle or XCircle, 20px, #F43F5E
Border-left: 4px solid #F43F5E
Background: #FFF1F2 (unread) / #FFFFFF (read)
Title: 14px / 600 / #F43F5E
Body: 13px / 400 / #64748B
Actions: "View Details" (primary), "Dismiss" (ghost)
Priority: Sort by severity (Critical > High > Medium > Low)
```

#### Approval Requests (Amber/Blue)
```
Icon: ClipboardList or CheckCircle, 20px, #3B82F6
Border-left: 4px solid #3B82F6
Background: #EEF2FF (unread) / #FFFFFF (read)
Title: 14px / 600 / #3B82F6
Actions: "Review", "Approve", "Reject" (if applicable)
```

#### System Alerts (Gray)
```
Icon: Info or Settings, 20px, #64748B
Border-left: 4px solid #CBD5E1
Background: #F8FAFC (unread) / #FFFFFF (read)
Title: 14px / 600 / #64748B
Actions: "Acknowledge", "View Details"
```

### 6.4 Alert Detail View

```
Clicking an alert opens a detail panel:

┌────────────────────────────────────────────────────────┐
│ ← Back to notifications                                 │
│                                                        │
│ ⚠ LCR Below Warning Threshold                           │
│ Critical — Liquidity Risk                               │
│                                                        │
│ Entity:        Deutsche Bank AG (DE)                    │
│ Metric:        LCR (Liquidity Coverage Ratio)         │
│ Current Value: 118.3%                                   │
│ Threshold:     120.0% (warning) / 100.0% (minimum)      │
│ Breach:        -1.7 percentage points                   │
│ Since:         25 Jun 2026, 14:32 CET                 │
│                                                        │
│ Chart: [Sparkline showing LCR last 30 days]            │
│                                                        │
│ Root Cause Analysis:                                    │
│ • HQLA decreased by EUR 120M due to bond maturity      │
│ • Wholesale outflows increased by EUR 45M               │
│ • Retail deposit outflows: EUR 30M                     │
│                                                        │
│ Recommended Actions:                                    │
│ 1. Review HQLA portfolio composition                   │
│ 2. Contact treasury for overnight funding              │
│ 3. Assess collateral availability                      │
│                                                        │
│ [View in LCR Dashboard]  [Mark as Resolved]  [Escalate]│
└────────────────────────────────────────────────────────┘
```

---

## 7. Keyboard Shortcuts

### 7.1 Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Open global search |
| `Ctrl + /` / `Cmd + /` | Toggle keyboard shortcut help |
| `Ctrl + B` / `Cmd + B` | Toggle sidebar collapse/expand |
| `Ctrl + D` / `Cmd + D` | Toggle dark mode |
| `Escape` | Close modals, dropdowns, panels |
| `?` | Open help panel |

### 7.2 Navigation Shortcuts

| Shortcut | Action |
|----------|--------|
| `G` then `D` | Go to Dashboard |
| `G` then `L` | Go to Liquidity |
| `G` then `I` | Go to IRRBB |
| `G` then `C` | Go to Capital |
| `G` then `E` | Go to ECL |
| `G` then `F` | Go to FTP |
| `G` then `O` | Go to Optimization |
| `G` then `R` | Go to Reports |

### 7.3 Action Shortcuts

| Shortcut | Action |
|----------|--------|
| `R` | Refresh data |
| `E` | Export current view |
| `P` | Print / ALCO presentation mode |
| `S` | Save current view as report |
| `F` | Toggle filters panel |
| `N` | Open notifications |

---

## 8. ALCO Presentation Mode

### 8.1 Activation

```
Trigger: "P" key or "Present" button in top bar (Monitor icon)
Effect: Full-screen, chromeless view of current dashboard
```

### 8.2 Presentation Mode UI

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                            │
│  [Full-screen dashboard content — no sidebar, no top bar, minimal chrome]                   │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│  │  ALCO Meeting — 25 June 2026    │  Current: Dashboard    │  Next: LCR Waterfall   │   │
│  └──────────────────────────────────────────────────────────────────────────────────┘   │
│  Bottom bar: 56px, semi-transparent bg, visible on hover or keypress                     │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Presentation Controls

| Key | Action |
|-----|--------|
| `→` / `↓` / `Space` | Next slide/view |
| `←` / `↑` | Previous slide/view |
| `Home` | First view |
| `End` | Last view |
| `Esc` | Exit presentation mode |
| `L` | Toggle laser pointer (cursor glow) |
| `D` | Toggle dark mode |
| `F` | Toggle fullscreen (browser native) |

---

## 9. Responsive Behavior Summary

| Breakpoint | Sidebar | Top Bar | Context Bar | Quick Actions |
|------------|---------|---------|-------------|---------------|
| Mobile (<768px) | Hidden, swipe drawer | Hamburger + search icon + bell + avatar | Stacked vertically, full-width | Hidden, accessible via menu |
| Tablet (768–1023px) | Collapsible, default collapsed | Full top bar | Horizontal, 2 selectors per row | Horizontal scroll |
| Desktop (1024–1279px) | Expanded | Full top bar | Horizontal, all in row | Horizontal scroll |
| Wide (1280–1535px) | Collapsible, icon-only | Full top bar | Horizontal, compact | Full visibility |
| Ultrawide (1536px+) | Collapsible, icon-only | Full top bar | Horizontal, full labels | Full visibility |

---

## 10. State Management

### 10.1 Persistent State (Saved to User Profile)

- Sidebar expanded/collapsed preference
- Dark mode preference
- Favorite reports list
- Recently viewed (last 20 items)
- Default entity, date, scenario selections
- Notification read/unread status
- Dashboard layout customization (if enabled)

### 10.2 Session State (Temporary)

- Current search query
- Open dropdowns/panels
- Active filters
- Modal open/closed state
- Chart zoom/pan state

---

*Navigation Shell Version 1.0 — ALM Platform Visual Design Team — June 2026*
