# ALM Platform — Design System Specification

**Version:** 1.0  
**Last Updated:** 2026-06-25  
**Platform:** ALM Banking Platform (ALCO & Treasury Operations)  
**Context:** Dashboards, reports, and analytical tools for Asset-Liability Management. Optimized for large-screen conference room displays and after-hours ALCO meetings.

---

## 1. Color Palette

### 1.1 Primary Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--primary-50` | `#EEF2FF` | rgb(238,242,255) | Light backgrounds, hover states |
| `--primary-100` | `#DBEAFE` | rgb(219,234,254) | Subtle highlights, disabled primary buttons |
| `--primary-200` | `#BFDBFE` | rgb(191,219,254) | Borders, secondary emphasis |
| `--primary-300` | `#93C5FD` | rgb(147,197,253) | Charts — medium emphasis series |
| `--primary-400` | `#60A5FA` | rgb(96,165,250) | Charts — primary data series |
| `--primary-500` | `#3B82F6` | rgb(59,130,246) | **Primary corporate blue** — buttons, active nav, links, key metrics |
| `--primary-600` | `#2563EB` | rgb(37,99,235) | Primary hover, pressed states |
| `--primary-700` | `#1D4ED8` | rgb(29,78,216) | Deep emphasis, chart axis labels |
| `--primary-800` | `#1E3A8A` | rgb(30,58,138) | Header backgrounds, dark mode accent |
| `--primary-900` | `#172554` | rgb(23,37,84) | Deep backgrounds, darkest accent |

### 1.2 Semantic Colors

#### Positive / Compliant (Emerald)
| Token | Hex | Usage |
|-------|-----|-------|
| `--success-50` | `#ECFDF5` | Light backgrounds |
| `--success-100` | `#D1FAE5` | Subtle borders |
| `--success-400` | `#34D399` | Chart series, progress bars |
| `--success-500` | `#10B981` | **Positive indicators** — LCR > 120%, NSFR > 100%, compliant ratios |
| `--success-600` | `#059669` | Hover states, emphasis |
| `--success-700` | `#047857` | Dark mode positive |

#### Warning / Watch (Amber)
| Token | Hex | Usage |
|-------|-----|-------|
| `--warning-50` | `#FFFBEB` | Light backgrounds |
| `--warning-100` | `#FEF3C7` | Subtle borders |
| `--warning-400` | `#FBBF24` | Chart series |
| `--warning-500` | `#F59E0B` | **Warning indicators** — 100% ≤ LCR < 120%, approaching thresholds |
| `--warning-600` | `#D97706` | Hover states |
| `--warning-700` | `#B45309` | Dark mode warning |

#### Alert / Breach (Rose)
| Token | Hex | Usage |
|-------|-----|-------|
| `--alert-50` | `#FFF1F2` | Light backgrounds |
| `--alert-100` | `#FFE4E6` | Subtle borders |
| `--alert-400` | `#FB7185` | Chart series |
| `--alert-500` | `#F43F5E` | **Alert / breach indicators** — LCR < 100%, NSFR < 100%, capital shortfall |
| `--alert-600` | `#E11D48` | Hover states, emphasis |
| `--alert-700` | `#BE123C` | Dark mode alert |

### 1.3 Neutral Grays (Slate)

| Token | Hex | Usage |
|-------|-----|-------|
| `--neutral-50` | `#F8FAFC` | Page background, card background (light mode) |
| `--neutral-100` | `#F1F5F9` | Subtle borders, zebra stripe rows |
| `--neutral-200` | `#E2E8F0` | Card borders, dividers, input borders |
| `--neutral-300` | `#CBD5E1` | Disabled states, placeholder text |
| `--neutral-400` | `#94A3B8` | Secondary text, axis labels, inactive icons |
| `--neutral-500` | `#64748B` | Muted text, metadata, timestamps |
| `--neutral-600` | `#475569` | Body text secondary, legend text |
| `--neutral-700` | `#334155` | Body text primary, headings secondary |
| `--neutral-800` | `#1E293B` | Primary headings, dark mode card backgrounds |
| `--neutral-900` | `#0F172A` | Dark mode page background, deepest text |

### 1.4 Chart-Specific Extended Palette

For multi-series charts requiring more than 3 colors, extend from primary in a fixed order:

| Order | Hex | Name | Best Used For |
|-------|-----|------|---------------|
| 1 | `#3B82F6` | Corporate Blue | Primary series, assets, income |
| 2 | `#10B981` | Emerald | Positive series, compliant metrics, inflows |
| 3 | `#F59E0B` | Amber | Warning series, watch metrics, neutral flows |
| 4 | `#F43F5E` | Rose | Alert series, outflows, breaches |
| 5 | `#8B5CF6` | Violet | Overlay, scenario B, alternative series |
| 6 | `#06B6D4` | Cyan | Water, liquidity, counterparty data |
| 7 | `#F97316` | Orange | Heatmap mid-range, secondary emphasis |
| 8 | `#EC4899` | Pink | Scenario C, stress test, female demographic |
| 9 | `#84CC16` | Lime | Yields, growth, new business |
| 10 | `#6366F1` | Indigo | FTP, pricing, transfer rates |

### 1.5 Color Usage Rules for ALM Context

```
┌────────────────────────────────────────────────────────────────────┐
│  COLOR CONSISTENCY RULES (MANDATORY)                              │
├────────────────────────────────────────────────────────────────────┤
│  ✓ Green (#10B981) = Compliant, above buffer, inflow, positive    │
│  ✓ Amber (#F59E0B) = Watch, approaching limit, neutral, pending   │
│  ✓ Rose (#F43F5E) = Breach, below minimum, outflow, negative      │
│  ✓ Never use green for outflows or red for inflows                  │
│  ✓ Never use semantic colors for non-semantic chart series          │
│  ✓ Always provide shape + color differentiation for colorblind users  │
└────────────────────────────────────────────────────────────────────┘
```

#### ALM Metric-Specific Thresholds

| Metric | Green (≥) | Amber | Red (<) |
|--------|-----------|-------|---------|
| LCR | 120% | 100% – 120% | 100% |
| NSFR | 105% | 100% – 105% | 100% |
| CET1 Ratio | 10.5% | 8.0% – 10.5% | 8.0% |
| Leverage Ratio | 4.0% | 3.5% – 4.0% | 3.5% |
| EVE Sensitivity (Δ) | -10% | -15% to -10% | -15% |
| NIM | ≥ 2.0% | 1.5% – 2.0% | < 1.5% |
| Liquidity Survival | ≥ 30 days | 15 – 30 days | < 15 days |

---

## 2. Typography

### 2.1 Font Families

| Role | Font | Fallbacks | Notes |
|------|------|-----------|-------|
| Primary (Sans) | Inter | -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif | Clean, high legibility at small sizes, excellent for data |
| Monospace (Data) | JetBrains Mono | "Fira Code", "Consolas", "Courier New", monospace | Tabular figures, aligned columns, code blocks |
| Display (Headlines) | Inter (ExtraBold) | Same as primary | Only for hero numbers, large KPIs |

### 2.2 Type Scale

| Token | Size | Weight | Line-Height | Letter-Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `hero` | 48px / 3rem | 800 | 1.1 | -0.02em | KPI hero numbers (CET1 12.4%) |
| `h1` | 32px / 2rem | 700 | 1.2 | -0.02em | Page titles, dashboard names |
| `h2` | 24px / 1.5rem | 700 | 1.3 | -0.01em | Section headers, module titles |
| `h3` | 20px / 1.25rem | 600 | 1.4 | -0.01em | Card titles, chart headings |
| `h4` | 16px / 1rem | 600 | 1.5 | 0 | Subsection headers, table group headers |
| `body` | 14px / 0.875rem | 400 | 1.6 | 0 | Body text, descriptions, labels |
| `body-sm` | 13px / 0.8125rem | 400 | 1.5 | 0 | Secondary text, metadata, tooltips |
| `caption` | 12px / 0.75rem | 500 | 1.4 | 0.01em | Axis labels, legend text, timestamps |
| `data` | 14px / 0.875rem | 600 | 1.4 | 0.02em | Table cells, data points, metric values |
| `data-lg` | 18px / 1.125rem | 700 | 1.3 | 0.01em | Prominent data values, summary cards |
| `mono` | 13px / 0.8125rem | 500 | 1.5 | 0 | Code, ISINs, account IDs, amounts in monospace |

### 2.3 ALCO-Specific Typography Rules

For large-screen ALCO meeting displays (55"+ screens, 4-6m viewing distance):

| Element | Minimum Size | Weight | Notes |
|---------|-------------|--------|-------|
| KPI Hero Value | 64px | 800 | Must be readable from 6 meters |
| KPI Label | 20px | 500 | Below hero value |
| Chart Title | 24px | 700 | Top of each chart panel |
| Chart Axis Labels | 16px | 500 | X/Y axis tick labels |
| Chart Legend | 14px | 500 | Must be legible without squinting |
| Table Header | 16px | 600 | Sticky headers |
| Table Cell | 15px | 500 | Minimum for distance reading |
| Alert Banner Text | 18px | 600 | Critical notifications |

---

## 3. Spacing Grid

### 3.1 Base Unit: 4px

All spacing follows a 4px grid. Tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight internal padding, icon gaps |
| `space-2` | 8px | Inline spacing, small gaps |
| `space-3` | 12px | Compact card padding, table cell padding |
| `space-4` | 16px | Standard card padding, section gaps |
| `space-5` | 20px | Form field spacing |
| `space-6` | 24px | Large card padding, modal internal padding |
| `space-8` | 32px | Section separation, dashboard panel gaps |
| `space-10` | 40px | Major section breaks |
| `space-12` | 48px | Page-level padding |
| `space-16` | 64px | Hero section padding |

### 3.2 Layout Grid

| Breakpoint | Columns | Gutter | Margin | Max Width |
|------------|---------|--------|--------|-----------|
| Desktop (≥1280px) | 12 | 24px | 32px | 1440px |
| Tablet (768–1279px) | 8 | 16px | 24px | 100% |
| Mobile (<768px) | 4 | 12px | 16px | 100% |

### 3.3 Card Spacing

```
┌────────────────────────────────────────────┐
│  Card (border-radius: 12px)                │
│  ┌──────────────────────────────────────┐  │
│  │  Padding: 24px (space-6)               │  │
│  │  ┌────────────────────────────────┐  │  │
│  │  │  Content area                    │  │  │
│  │  │  Gap between elements: 16px    │  │  │
│  │  └────────────────────────────────┘  │  │
│  └──────────────────────────────────────┘  │
│  Card gap in grid: 24px                    │
└────────────────────────────────────────────┘
```

### 3.4 Dashboard Panel Layout

Standard dashboard uses a 12-column grid with 24px gutters:

- **Full width:** 12 columns (e.g., LCR waterfall, yield curve)
- **Two-column:** 6 + 6 columns (e.g., side-by-side KPI cards)
- **Three-column:** 4 + 4 + 4 (e.g., top KPI row)
- **Four-column:** 3 + 3 + 3 + 3 (e.g., small metric cards)
- **Asymmetric:** 8 + 4 (e.g., main chart + side panel)

---

## 4. Component Library

### 4.1 Buttons

#### Primary Button
```
Background:   #3B82F6 (--primary-500)
Text:         #FFFFFF
Border:       none
Border-radius: 8px
Padding:      10px 20px (space-2.5 space-5)
Font:         14px / 600
Hover:        #2563EB (--primary-600) with shadow-md
Active:       #1D4ED8 (--primary-700), inset shadow
Disabled:     #93C5FD (--primary-300) bg, #FFFFFF text, cursor: not-allowed
Focus ring:   2px solid #3B82F6, 2px offset
```

#### Secondary Button
```
Background:   #FFFFFF
Text:         #3B82F6 (--primary-500)
Border:       1px solid #CBD5E1 (--neutral-300)
Border-radius: 8px
Padding:      10px 20px
Hover:        #EEF2FF (--primary-50) bg, border #3B82F6
```

#### Danger Button
```
Background:   #F43F5E (--alert-500)
Text:         #FFFFFF
Hover:        #E11D48 (--alert-600)
Used for:     Delete actions, reject approvals, override confirmations
```

#### Ghost Button
```
Background:   transparent
Text:         #64748B (--neutral-500)
Hover:        #F1F5F9 (--neutral-100) bg
Used for:     Toolbar actions, icon-only buttons, less prominent actions
```

#### Icon Button (Circular)
```
Size:         36px × 36px
Border-radius: 50%
Background:   transparent
Hover:        #F1F5F9 (--neutral-100)
Active:       #E2E8F0 (--neutral-200)
Icon size:    16px
```

### 4.2 Input Fields

#### Text Input
```
Height:           40px
Background:       #FFFFFF
Border:           1px solid #CBD5E1 (--neutral-300)
Border-radius:    8px
Padding:          0 12px
Font:             14px / 400
Placeholder:      #94A3B8 (--neutral-400)
Focus:            border-color #3B82F6, ring 2px #BFDBFE
Error:            border-color #F43F5E, ring 2px #FFE4E6
Disabled:         bg #F1F5F9, text #94A3B8
```

#### Number Input (Amounts)
```
Same as Text Input +:
Font-family:      JetBrains Mono
Text-align:       right
Prefix:           € / $ / £ symbol, left-aligned, color #94A3B8
Stepper buttons:  Right side, ± icons, small
```

#### Date Picker
```
Input:            Same as Text Input
Calendar icon:    Right side, 16px, #64748B
Calendar popup:   Below input, z-index 50
Calendar header:  #1E293B bg, #FFFFFF text
Selected date:    #3B82F6 bg, #FFFFFF text
Today:            1px #3B82F6 border
Range selection:  #DBEAFE bg between dates
```

#### Dropdown / Select
```
Trigger:          Same as Text Input, with chevron-down icon (16px)
Dropdown panel:   bg #FFFFFF, border 1px #E2E8F0, shadow-lg
Item height:      40px
Item hover:       #F1F5F9 bg
Selected item:    #EEF2FF bg, #3B82F6 text, checkmark icon
Group header:     12px uppercase, #94A3B8, bg #F8FAFC
Max height:       320px with scroll
```

### 4.3 Toggles & Switches

#### Toggle Switch
```
Track:            44px × 24px, border-radius 12px
Track off:        #CBD5E1 (--neutral-300)
Track on:         #3B82F6 (--primary-500)
Thumb:            20px × 20px, #FFFFFF, shadow-sm
Transition:       200ms ease-in-out
Label:            14px / 400, to the right
```

#### Checkbox
```
Size:             18px × 18px
Border:           2px solid #CBD5E1
Border-radius:    4px
Checked:          bg #3B82F6, border #3B82F6, checkmark icon #FFFFFF
Indeterminate:    bg #3B82F6, horizontal line #FFFFFF
```

#### Radio Button
```
Size:             18px × 18px
Border:           2px solid #CBD5E1
Border-radius:    50%
Selected:         6px inner dot #3B82F6
```

### 4.4 Tabs

#### Horizontal Tabs
```
Container:        border-bottom 1px #E2E8F0
Tab height:       44px
Tab padding:      0 16px
Font:             14px / 500
Inactive:         #64748B text, transparent bg
Hover:            #334155 text, #F1F5F9 bg
Active:           #3B82F6 text, bottom border 2px #3B82F6
Active indicator: 2px solid #3B82F6, bottom of container
```

#### Vertical Tabs (Sidebar Sub-navigation)
```
Width:            240px
Item height:      40px
Item padding:     0 16px 0 12px
Font:             14px / 500
Inactive:         #64748B text, transparent bg
Hover:            #F1F5F9 bg
Active:           #3B82F6 text, #EEF2FF bg, left border 3px #3B82F6
```

### 4.5 Modals

#### Standard Modal
```
Overlay:          #0F172A at 50% opacity, backdrop-blur-sm
Panel:            bg #FFFFFF, border-radius 12px
Max width:        560px (small), 720px (medium), 960px (large)
Padding:          24px (space-6)
Header:           20px font, border-bottom 1px #E2E8F0, pb 16px
Footer:           border-top 1px #E2E8F0, pt 16px, right-aligned buttons
Close button:     Top-right, ghost icon button, × icon
Animation:        Fade in 200ms, scale 0.95 → 1.0
```

#### Confirmation Modal (Destructive)
```
Same as Standard +:
Icon:             Alert triangle, 48px, #F43F5E
Title:            #F43F5E text
Primary button:   Danger style
```

#### Slide-over Panel (Right Drawer)
```
Width:            480px (default), 640px (wide)
Overlay:          Same as modal
Position:         Fixed right
Animation:        Slide in from right 300ms, ease-out
Header:           Sticky top, 56px height, bg #FFFFFF, border-bottom
```

### 4.6 Tooltips

```
Background:       #1E293B (--neutral-800)
Text:             #FFFFFF
Font:             13px / 400
Padding:          8px 12px
Border-radius:    8px
Max width:        280px
Arrow:            6px, same bg color
Delay:            300ms (hover)
Animation:        150ms fade in
```

### 4.7 Cards

#### Standard Card
```
Background:       #FFFFFF
Border:           1px solid #E2E8F0 (--neutral-200)
Border-radius:    12px
Padding:          24px
Shadow:           0 1px 3px rgba(15, 23, 42, 0.08)
Hover shadow:     0 4px 6px rgba(15, 23, 42, 0.1)
```

#### KPI Card (Elevated)
```
Same as Standard +:
Padding:          24px
Top accent:        4px border-top, color based on metric status
  Green:          #10B981
  Amber:          #F59E0B
  Red:            #F43F5E
  Blue:           #3B82F6 (neutral/primary)
```

#### Alert Card
```
Background:       depends on severity
  Info:           #EEF2FF border, #DBEAFE bg
  Success:        #ECFDF5 border, #D1FAE5 bg
  Warning:        #FFFBEB border, #FEF3C7 bg
  Error:          #FFF1F2 border, #FFE4E6 bg
Border-radius:    12px
Padding:          16px 20px
Icon:             20px, left side, color matches severity
```

### 4.8 Tables

#### Data Table
```
Header:           bg #F8FAFC, border-bottom 1px #E2E8F0
Header text:      12px uppercase, #64748B, font-weight 600
Header height:    44px
Row height:       48px
Row border:       bottom 1px #E2E8F0
Row hover:        bg #F8FAFC
Zebra stripe:     bg #F8FAFC on even rows (optional, low contrast)
Cell padding:     12px 16px
Font:             13px / 500, JetBrains Mono for numbers
Number alignment: Right-aligned
Text alignment:   Left-aligned
Sort icon:        Chevron up/down, 14px, #94A3B8 inactive, #3B82F6 active
```

#### Sticky Header Table
```
Same as Data Table +:
Header:           position: sticky; top: 0; z-index: 10
First column:     position: sticky; left: 0; bg: inherit; z-index: 11
Corner cell:      z-index: 12
```

---

## 5. Iconography

### 5.1 Icon Library: Lucide Icons

All icons from **Lucide** (lucide-react / lucide-vue). Consistent stroke width: 1.5px.

#### Financial Concept Icons

| Concept | Icon Name | Unicode | Usage |
|---------|-----------|---------|-------|
| Liquidity | `Droplets` | U+E000 | LCR, NSFR, cash flow modules |
| Capital | `Shield` | U+E001 | CET1, capital ratios, RWA |
| Credit Risk | `AlertTriangle` | U+E002 | ECL, impairment, defaults |
| Interest Rate | `TrendingUp` / `TrendingDown` | U+E003 | IRRBB, NII, yield curve |
| FTP | `ArrowLeftRight` | U+E004 | Transfer pricing, funds transfer |
| Balance Sheet | `Scale` | U+E005 | ALCO, balance sheet view |
| Dashboard | `LayoutDashboard` | U+E006 | Home, landing page |
| Reports | `FileText` | U+E007 | ALCO pack, regulatory reports |
| Calendar | `Calendar` | U+E008 | Reporting dates, ALCO meetings |
| Settings | `Settings` | U+E009 | Configuration, admin |
| Search | `Search` | U+E010 | Global search, filtering |
| Filter | `Filter` | U+E011 | Data filtering, drill-down |
| Download | `Download` | U+E012 | Export to PNG, Excel, PDF |
| Export | `ExternalLink` | U+E013 | Open in new window, drill-down |
| Alert / Notification | `Bell` | U+E014 | Notification center |
| Warning | `AlertCircle` | U+E015 | Threshold breaches |
| Success | `CheckCircle` | U+E016 | Approvals, completions |
| Error | `XCircle` | U+E017 | Breaches, failures |
| Info | `Info` | U+E018 | Tooltips, help text |
| Menu | `Menu` | U+E019 | Mobile navigation |
| Chevron | `ChevronDown` / `ChevronUp` | U+E020 | Expand/collapse |
| More | `MoreHorizontal` | U+E021 | Context menus |
| Edit | `Pencil` | U+E022 | Edit mode, configuration |
| Trash | `Trash2` | U+E023 | Delete, remove |
| Refresh | `RefreshCw` | U+E024 | Data refresh, recalculate |
| Clock | `Clock` | U+E025 | Time-buckets, historical |
| Lock | `Lock` | U+E026 | Secure, restricted access |
| User | `User` | U+E027 | Profile, user menu |
| Users | `Users` | U+E028 | Teams, committees |
| Building | `Building2` | U+E029 | Entity, subsidiary selector |
| Globe | `Globe` | U+E030 | Currency, jurisdiction |
| Calculator | `Calculator` | U+E031 | Pricing tools, calculators |
| Chart | `BarChart3` | U+E032 | Analytics, charts |
| Table | `Table` | U+E033 | Data tables, grids |
| Layers | `Layers` | U+E034 | Scenarios, overlays |
| Zap | `Zap` | U+E035 | Stress tests, shocks |
| Target | `Target` | U+E036 | Targets, limits, goals |
| Percent | `Percent` | U+E037 | Ratios, percentages |
| Wallet | `Wallet` | U+E038 | Funding, deposits |
| Banknote | `Banknote` | U+E039 | Cash, HQLA |
| Landmark | `Landmark` | U+E040 | Central bank, government |
| Trending | `Activity` | U+E041 | Trending metrics, sparklines |
| Minimize | `Minimize2` | U+E042 | Collapse panel |
| Maximize | `Maximize2` | U+E043 | Expand panel, fullscreen chart |
| Pin | `Pin` | U+E044 | Pin to dashboard, favorite |
| Star | `Star` | U+E045 | Favorite, bookmark |
| History | `History` | U+E046 | Audit trail, history |
| Printer | `Printer` | U+E047 | Print report |
| Mail | `Mail` | U+E048 | Notifications, approvals |
| Check | `Check` | U+E049 | Approve, confirm |
| X | `X` | U+E050 | Close, dismiss, reject |
| Plus | `Plus` | U+E051 | Add, create new |
| Minus | `Minus` | U+E052 | Remove, decrease |
| ArrowUp | `ArrowUp` | U+E053 | Increase, upward trend |
| ArrowDown | `ArrowDown` | U+E054 | Decrease, downward trend |
| ArrowRight | `ArrowRight` | U+E055 | Drill-down, navigate |
| GitBranch | `GitBranch` | U+E056 | Scenario branching, version |
| Play | `Play` | U+E057 | Run simulation, scenario |
| Pause | `Pause` | U+E058 | Pause simulation |
| Save | `Save` | U+E059 | Save configuration |
| Upload | `Upload` | U+E060 | Upload data, import |
| Copy | `Copy` | U+E061 | Copy to clipboard |
| Eye | `Eye` | U+E062 | View, show details |
| EyeOff | `EyeOff` | U+E063 | Hide, mask sensitive |
| HelpCircle | `HelpCircle` | U+E064 | Help, documentation |
| BookOpen | `BookOpen` | U+E065 | Documentation, guides |
| ClipboardList | `ClipboardList` | U+E066 | Task list, action items |
| List | `List` | U+E067 | List view, details |
| Grid | `Grid` | U+E068 | Grid view, card layout |
| PanelLeft | `PanelLeft` | U+E069 | Toggle sidebar |
| PanelRight | `PanelRight` | U+E070 | Toggle right panel |
| Sparkles | `Sparkles` | U+E071 | AI insights, recommendations |
| Thermometer | `Thermometer` | U+E072 | Risk heat, stress level |
| Gauge | `Gauge` | U+E073 | Speedometer, ratios |
| PieChart | `PieChart` | U+E074 | Composition, allocation |
| CircleDollarSign | `CircleDollarSign` | U+E075 | Pricing, margins |
| Coins | `Coins` | U+E076 | Funding, liquidity pool |
| Receipt | `Receipt` | U+E077 | Transactions, postings |
| FileSpreadsheet | `FileSpreadsheet` | U+E078 | Excel export, bulk data |
| FileBarChart | `FileBarChart` | U+E079 | Report, analytics file |
| LogOut | `LogOut` | U+E080 | Sign out |
| Moon | `Moon` | U+E081 | Dark mode toggle |
| Sun | `Sun` | U+E082 | Light mode toggle |

---

## 6. Responsive Breakpoints

### 6.1 Breakpoint Definitions

| Name | Min Width | Max Width | Target Device |
|------|-----------|-----------|---------------|
| `mobile` | 0 | 767px | Phones, small tablets |
| `tablet` | 768px | 1023px | Tablets, small laptops |
| `desktop` | 1024px | 1279px | Standard laptops |
| `wide` | 1280px | 1535px | Large monitors, ALCO screens |
| `ultrawide` | 1536px | ∞ | 4K displays, wall screens |

### 6.2 Responsive Behavior by Module

#### Navigation Sidebar
| Breakpoint | Behavior |
|------------|----------|
| mobile | Hidden by default, swipe-in drawer (280px width), overlay backdrop |
| tablet | Collapsible, default collapsed (64px icon-only), expandable to 240px |
| desktop+ | Expanded by default (240px), collapsible to 64px |

#### Dashboard Grid
| Breakpoint | Columns | Card Layout |
|------------|---------|-------------|
| mobile | 1 | Stacked vertically, full-width cards |
| tablet | 2 | 2-column grid, cards span 1 column |
| desktop | 3 | 3-column for KPIs, 2-column for charts |
| wide | 4 | 4-column KPI row, 2-column charts, 3-column tables |
| ultrawide | 4–6 | 4-column KPIs, 3-column charts, full-width detail panels |

#### Chart Responsiveness
| Breakpoint | Behavior |
|------------|----------|
| mobile | Simplify: hide legend (show on tap), reduce data points, single axis |
| tablet | Show legend bottom, reduce tick labels, stack multi-series |
| desktop+ | Full legend, all data points, dual axes when needed |
| wide+ | Full detail, all interactive features enabled |

#### Typography Scale
| Breakpoint | Hero | H1 | H2 | Body | Caption |
|------------|------|----|----|------|---------|
| mobile | 36px | 24px | 20px | 14px | 12px |
| tablet | 40px | 28px | 22px | 14px | 12px |
| desktop | 48px | 32px | 24px | 14px | 13px |
| wide+ | 64px | 36px | 28px | 15px | 14px |

### 6.3 ALCO-Specific Responsive Rules

```
┌────────────────────────────────────────────────────────────────────┐
│  ALCO MEETING DISPLAY RULES (wide / ultrawide, ≥1280px)            │
├────────────────────────────────────────────────────────────────────┤
│  • Minimum font size: 16px for any readable text                   │
│  • KPI values: 64px+ for hero numbers                              │
│  • Chart legends: Never below 14px                                   │
│  • Axis labels: 16px minimum                                         │
│  • Grid lines: Light (#E2E8F0) but visible from 5m                   │
│  • Color contrast: Minimum 4.5:1 for all text                        │
│  • Alert banners: 18px+ text, full-width, persistent                 │
│  • Sidebar: Collapsed to maximize chart area (icon-only mode)        │
└────────────────────────────────────────────────────────────────────┘
```

---

## 7. Dark Mode

### 7.1 Dark Mode Palette

| Token | Light Mode | Dark Mode | Notes |
|-------|------------|-----------|-------|
| Page background | `#F8FAFC` | `#0F172A` | `--neutral-900` |
| Card background | `#FFFFFF` | `#1E293B` | `--neutral-800` |
| Card border | `#E2E8F0` | `#334155` | `--neutral-700` |
| Primary text | `#1E293B` | `#F1F5F9` | `--neutral-100` |
| Secondary text | `#64748B` | `#94A3B8` | `--neutral-400` |
| Primary button | `#3B82F6` | `#60A5FA` | Brighter for dark contrast |
| Primary hover | `#2563EB` | `#93C5FD` | Lighter hover |
| Success | `#10B981` | `#34D399` | Brighter green |
| Warning | `#F59E0B` | `#FBBF24` | Brighter amber |
| Alert | `#F43F5E` | `#FB7185` | Brighter rose |
| Chart grid | `#E2E8F0` | `#334155` | Visible but subdued |
| Tooltip bg | `#1E293B` | `#0F172A` | Same as page bg |

### 7.2 Dark Mode Chart Adjustments

| Element | Light | Dark |
|---------|-------|------|
| Background | `#FFFFFF` | `#1E293B` |
| Grid lines | `#E2E8F0` | `#334155` |
| Axis text | `#64748B` | `#94A3B8` |
| Data labels | `#334155` | `#F1F5F9` |
| Legend text | `#475569` | `#CBD5E1` |
| Series colors | Standard | Brightened by ~10% for visibility |
| Area fill opacity | 0.2 | 0.3 (slightly more opaque) |
| Reference lines | `#CBD5E1` | `#475569` |
| Zero line | `#94A3B8` | `#64748B` |

### 7.3 Dark Mode Component Adjustments

#### Cards
```
Background:    #1E293B
Border:        1px solid #334155
Shadow:        0 1px 3px rgba(0, 0, 0, 0.3)
Hover shadow:  0 4px 6px rgba(0, 0, 0, 0.4)
```

#### Inputs
```
Background:    #0F172A
Border:        1px solid #334155
Text:          #F1F5F9
Placeholder:   #64748B
Focus:         border #60A5FA, ring #1E3A8A
```

#### Tables
```
Header bg:     #1E293B
Row bg:        #0F172A
Row hover:     #1E293B
Border:        #334155
Zebra stripe:  #1E293B (on even rows)
```

#### Modals
```
Overlay:       #000000 at 60% opacity
Panel bg:      #1E293B
Border:        1px solid #334155
```

### 7.4 After-Hours ALCO Meeting Mode

A special preset activated automatically based on time (18:00–08:00) or manually:

```
┌────────────────────────────────────────────────────────────────────┐
│  AFTER-HOURS ALCO MODE                                             │
├────────────────────────────────────────────────────────────────────┤
│  • Full dark mode enabled                                          │
│  • All text brightened by 10%                                      │
│  • Chart series use maximum saturation variants                    │
│  • Alert colors pulse gently (subtle animation) for breaches       │
│  • Background glow: Very subtle blue tint on page bg               │
│  • Sidebar: Fully collapsed, icon-only                             │
│  • Clock widget: Always visible in top bar                         │
│  • Meeting timer: Optional countdown widget for ALCO agendas       │
└────────────────────────────────────────────────────────────────────┘
```

---

## 8. Animation & Motion

### 8.1 Timing Tokens

| Token | Duration | Usage |
|-------|----------|-------|
| `duration-instant` | 0ms | State changes, no animation |
| `duration-fast` | 150ms | Hover states, color changes |
| `duration-normal` | 200ms | Buttons, toggles, small transitions |
| `duration-slow` | 300ms | Modals, panels, page transitions |
| `duration-chart` | 600ms | Chart animations, data updates |

### 8.2 Easing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard transitions |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Entering elements |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Exiting elements |
| `ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Celebratory/attention |

### 8.3 Chart Animations

| Animation | Duration | Easing | Behavior |
|-----------|----------|--------|----------|
| Initial load | 800ms | ease-out | Fade in + slight scale-up |
| Data update | 400ms | ease-default | Smooth transition to new values |
| Hover highlight | 150ms | ease-fast | Brighten series, dim others |
| Tooltip appear | 200ms | ease-out | Fade + slight translateY |
| Drill-down | 300ms | ease-default | Chart morphs to detail view |

### 8.4 ALCO Presentation Mode

When activated for ALCO meetings:

- All animations slow down by 2× (more deliberate)
- Tooltips remain open for 3 seconds minimum
- Chart transitions are smooth but not flashy
- No bouncing or spring animations
- Loading states show progress, not spinners

---

## 9. Accessibility

### 9.1 Color Contrast

| Context | Minimum Ratio | Target Ratio |
|---------|---------------|--------------|
| Normal text | 4.5:1 | 7:1 (AAA) |
| Large text (18px+) | 3:1 | 4.5:1 (AA) |
| UI components | 3:1 | 4.5:1 |
| Chart data (non-text) | N/A | Distinguishable by shape + color |

### 9.2 Colorblind Support

- All semantic indicators use **shape + color + text** (never color alone)
- Green/Red charts include ▲/▼ icons or +/− signs
- Line charts use **dash patterns + markers** in addition to color
- Heatmaps use **brightness + pattern** (subtle hatching for middle values)

### 9.3 Keyboard Navigation

| Element | Focus Behavior |
|---------|--------------|
| Buttons | Visible 2px ring, Enter/Space activates |
| Links | Visible underline + ring |
| Inputs | Border color change + ring |
| Charts | Tab into chart, arrow keys navigate data points, Enter opens tooltip |
| Tables | Arrow keys navigate cells, Enter/Space activates |
| Modals | Trap focus, Escape closes, Tab cycles |

### 9.4 Screen Reader Support

- All charts have `aria-label` with data summary
- KPI cards read as: "{label}: {value} {unit}, {status}"
- Tables have `caption` or `aria-label`
- Status changes announced via `aria-live="polite"`
- Loading states announce "Loading {data type}"

---

## 10. File Organization

```
alm_platform/docs/visuals/
├── 00-design-system.md          ← This file
├── 01-navigation-shell.md
├── 02-landing-dashboard.md
├── 03-liquidity-visuals.md
├── 04-irrbb-visuals.md
├── 05-capital-visuals.md
├── 06-ecl-visuals.md
├── 07-ftp-visuals.md
└── 08-optimization-visuals.md
```

---

*Design System Version 1.0 — ALM Platform Visual Design Team — June 2026*
