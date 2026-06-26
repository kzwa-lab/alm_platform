# ALM Platform — Cyber Security Visual Specification

**Version:** 1.0
**Last Updated:** 2026-06-25
**Screen:** Cyber Security Dashboard
**Context:** Bank of Ghana CISD 2026 cyber security and data residency compliance. Covers data residency map, access control matrix, audit trail, security posture scorecard, and incident response. Designed for CISO, CRO, compliance teams, and BoG regulatory reporting.

---

## 1. Dashboard Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Navigation + Context Switcher (Entity: Ecobank Ghana PLC | Date: 30 Jun 2026 | GRR: 25.50%)│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  DATA RESIDENCY MAP — Ghana In-Country Hosting Compliance                             │  │
│  │  (Full width, 12 columns)                                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  ACCESS CONTROL MATRIX                     │  │  AUDIT TRAIL TIMELINE                │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
│  ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  SECURITY POSTURE SCORECARD                │  │  INCIDENT RESPONSE PANEL             │  │
│  │  (6 columns)                               │  │  (6 columns)                         │  │
│  └────────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Grid:** 12 columns, 24px gutter, 32px margin
**Background:** `#F8FAFC` (light) / `#0F172A` (dark)

---

## 2. Data Residency Map

### 2.1 Component Specification

**Purpose:** Visualise data hosting locations and CISD 2026 compliance status. Shows which systems are hosted in Ghana vs externally, with compliance zoning. Critical for BoG regulatory compliance.

**Chart Type:** Map + Status Cards
**Library Recommendation:** ECharts (map) or custom SVG with status overlays
**Dimensions:** 12 columns (full width) × 480px height
**Position:** Top row, full width

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Data Residency Map — CISD 2026 Compliance               [Legend] [Filter] [⋯] [⬇]         │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                                      │  │
│  │                              ┌─────────────────┐                                   │  │
│  │                              │   GHANA MAP       │                                   │  │
│  │                              │                   │                                   │  │
│  │                              │  [Accra] 🟢       │                                   │  │
│  │                              │  Primary DC       │                                   │  │
│  │                              │  Core Systems     │                                   │  │
│  │                              │                   │                                   │  │
│  │                              │  [Kumasi] 🟢      │                                   │  │
│  │                              │  DR Site          │                                   │  │
│  │                              │  Backup Systems   │                                   │  │
│  │                              │                   │                                   │  │
│  │                              │  [Takoradi] 🟡    │                                   │  │
│  │                              │  Branch DC        │                                   │  │
│  │                              │  Edge Cache       │                                   │  │
│  │                              │                   │                                   │  │
│  │                              └─────────────────┘                                   │  │
│  │                                                                                      │  │
│  │  External (Non-Sensitive Only):                                                      │  │
│  │  [Cloud Front-End] 🟡  — Web portal, mobile app (non-sensitive data only)            │  │
│  │  [Cloud CDN] 🟡  — Static assets, documentation                                      │  │
│  │                                                                                      │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                            │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐         │
│  │ CORE SYSTEMS      │ │ ANALYTICS       │ │ FRONT-END       │ │ BACKUP/DR       │         │
│  │ 🟢 In-Country     │ │ 🟢 In-Country   │ │ 🟡 External     │ │ 🟢 In-Country   │         │
│  │ Accra DC          │ │ Accra DC        │ │ Cloud (EU)      │ │ Kumasi DR       │         │
│  │ 24 systems        │ │ 8 systems       │ │ 2 systems       │ │ 12 systems      │         │
│  │ 100% compliant    │ │ 100% compliant  │ │ Non-sensitive   │ │ 100% compliant  │         │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘         │
│                                                                                            │
│  CISD 2026 Compliance: 46 of 46 systems compliant (100%)  •  Last Audit: 15 Jun 2026    │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Map Location Styling:**
```
Location marker: 24px circle, border 2px #FFFFFF, shadow-md
In-Country (Ghana): bg #10B981
External (Non-Sensitive): bg #F59E0B
External (Sensitive): bg #F43F5E
Location label: 13px / 600 / #334155, below marker
```

**Data Residency Categories:**
| Category | Location | Systems | Data Type | CISD Status |
|----------|----------|---------|-----------|-------------|
| Core Banking | Accra DC | 12 | Customer data, transactions | 🟢 In-Country |
| Risk Systems | Accra DC | 8 | RWA, ECL, limits | 🟢 In-Country |
| ALM Engine | Accra DC | 4 | LMTD, IRRBB, capital | 🟢 In-Country |
| Data Lake | Accra DC | 6 | All raw data | 🟢 In-Country |
| Analytics | Accra DC | 8 | Aggregated reports | 🟢 In-Country |
| Front-End Portal | Cloud (EU) | 1 | Non-sensitive UI | 🟡 External |
| Mobile App CDN | Cloud (Global) | 1 | Static assets | 🟡 External |
| DR Site | Kumasi | 12 | Replicated core | 🟢 In-Country |
| Branch Cache | Takoradi | 4 | Edge caching | 🟢 In-Country |

**Interactions:**
- **Click location:** Opens system inventory for that location
- **Hover marker:** Tooltip shows system count, data types, and compliance status
- **Click category card:** Filters map to show only that category
- **Click "Legend":** Toggles visibility of compliance categories

**Responsive Behavior:**
- Mobile: Vertical list of locations with status cards
- Tablet+: Map with overlay cards

---

## 3. Access Control Matrix

### 3.1 Component Specification

**Purpose:** Visual matrix showing which roles can access which systems/modules under the 3LoD RBAC framework. Critical for segregation of duties and CRO independence enforcement.

**Component Type:** Matrix / Heatmap Table
**Library Recommendation:** ECharts (heatmap) or custom table
**Dimensions:** 6 columns × 480px height
**Position:** Second row, left

```
┌────────────────────────────────────────────────────────────────────┐
│ Access Control Matrix — 3LoD RBAC                     [Role ▾]     │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Role / Module      Dash  Liq  IRR  Cap  ECL  FTP  Opt  Rep  Rec  │
│  ───────────────────────────────────────────────────────────────── │
│  CRO (K. Asante)    R/W   R/W  R/W  R/W  R/W  R/W  R/W  R/W  R/W  │
│  CFO (A. Mensah)    R/W   R    R    R/W  R    R/W  R/W  R/W  R    │
│  Treasury Head      R/W   R/W  R/W  R    R    R/W  R    R    R    │
│  Risk Manager       R/W   R/W  R/W  R/W  R/W  R    R/W  R/W  R/W  │
│  Compliance Officer R/W   R    R    R    R    R    R    R/W  R/W  │
│  ALCO Member        R/W   R    R    R    R    R    R    R    R    │
│  Internal Audit     R     R    R    R    R    R    R    R    R/W  │
│  Business User      R     R    R    R    R    R    R    R    —    │
│  ───────────────────────────────────────────────────────────────── │
│                                                                    │
│  Legend: R/W = Read/Write  R = Read-Only  — = No Access            │
│                                                                    │
│  CRO Independence: ✅ Enforced — CRO cannot hold CFO/COO/IA roles   │
│  Segregation of Duties: ✅ Compliant — No conflicts detected        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Matrix Cell Styling:**
```
Cell: 40px × 40px, border-radius 4px, centered text
Read/Write: bg #10B981, text #FFFFFF, font 12px / 700
Read-Only: bg #3B82F6, text #FFFFFF, font 12px / 700
No Access: bg #E2E8F0, text #94A3B8, font 12px / 500
Conflict: bg #F43F5E, text #FFFFFF, font 12px / 700 (with alert icon)
```

**Access Matrix Data:**
| Role | Dashboard | Liquidity | IRRBB | Capital | ECL | FTP | Optimisation | Reports | Recovery |
|------|-----------|-----------|-------|---------|-----|-----|--------------|---------|----------|
| CRO | R/W | R/W | R/W | R/W | R/W | R/W | R/W | R/W | R/W |
| CFO | R/W | R | R | R/W | R | R/W | R/W | R/W | R |
| Treasury Head | R/W | R/W | R/W | R | R | R/W | R | R | R |
| Risk Manager | R/W | R/W | R/W | R/W | R/W | R | R/W | R/W | R/W |
| Compliance Officer | R/W | R | R | R | R | R | R | R/W | R/W |
| ALCO Member | R/W | R | R | R | R | R | R | R | R |
| Internal Audit | R | R | R | R | R | R | R | R | R/W |
| Business User | R | R | R | R | R | R | R | R | — |

**CRO Independence Enforcement:**
| Rule | Status | Description |
|------|--------|-------------|
| CRO ≠ CFO | ✅ | CRO and CFO are separate individuals |
| CRO ≠ COO | ✅ | CRO and COO are separate individuals |
| CRO ≠ Internal Audit | ✅ | CRO and IA Head are separate individuals |
| CRO reports to Board | ✅ | CRO has direct board access (dotted CEO) |

**Interactions:**
- **Click cell:** Opens role-module permission detail with audit trail
- **Hover cell:** Tooltip shows specific permissions (view, edit, approve, export)
- **Click role row:** Filters matrix to show only that role
- **Click "Role" dropdown:** Switch between roles or view all

**Responsive Behavior:**
- Mobile: Scrollable horizontal table, role selector above
- Tablet+: Full matrix as designed

---

## 4. Audit Trail Timeline

### 4.1 Component Specification

**Purpose:** Chronological log of all system access, data changes, approvals, and security events. Critical for compliance, forensic investigation, and BoG audit requirements.

**Component Type:** Timeline / Event Feed
**Dimensions:** 6 columns × 480px height
**Position:** Second row, right

```
┌────────────────────────────────────────────────────────────────────┐
│ Audit Trail Timeline                                  [Filter] [Export]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Today — 25 Jun 2026                                               │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 14:32  👤 K. Asante (CRO)                                   │   │
│  │        Approved Recovery Plan v2.1                         │   │
│  │        Module: Recovery Planning  •  Action: APPROVE       │   │
│  │        [View Details]                                        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 12:15  👤 M. Boateng (Risk Manager)                         │   │
│  │        Updated LMTD limit from 120% to 125%                  │   │
│  │        Module: GRC  •  Action: EDIT  •  Old: 120% → New: 125%│   │
│  │        [View Details]  [Rollback]                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 10:45  🔐 System                                            │   │
│  │        Failed login attempt (3x) — User: unknown             │   │
│  │        Module: Security  •  Action: LOGIN_FAIL  •  IP: 192.168.1.45│   │
│  │        [View Details]  [Block IP]                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 09:20  👤 A. Mensah (CFO)                                   │   │
│  │        Exported ORASS Monthly Return to Excel                │   │
│  │        Module: Regulatory  •  Action: EXPORT  •  File: ORASS-M-2026-06.xlsx│   │
│  │        [View Details]                                        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 08:00  🔐 System                                            │   │
│  │        Daily backup completed — 24 systems backed up         │   │
│  │        Module: System  •  Action: BACKUP  •  Size: 450GB   │   │
│  │        [View Details]                                        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  Yesterday — 24 Jun 2026                                           │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 16:45  👤 P. Owusu (Compliance)                           │   │
│  │        Acknowledged wholesale funding breach (BR-2026-041)   │   │
│  │        Module: GRC  •  Action: ACKNOWLEDGE  •  Breach ID: BR-2026-041│   │
│  │        [View Details]                                        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  [Load more...]                                                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Event Card Styling:**
```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border-radius: 8px
Padding: 12px 16px
Margin-bottom: 8px
Left accent: 3px solid [event-type-color]
```

**Event Type Colors:**
| Event Type | Color | Description |
|------------|-------|-------------|
| User Action | `#3B82F6` | Normal user activity |
| Approval | `#10B981` | Approval or sign-off |
| Security Alert | `#F43F5E` | Failed login, unauthorised access |
| System Event | `#8B5CF6` | Backup, maintenance, scheduled task |
| Data Change | `#F59E0B` | Configuration or limit change |
| Export | `#06B6D4` | Data export or download |

**Demo Data:**
| Time | User | Action | Module | Details | Type |
|------|------|--------|--------|---------|------|
| 14:32 | K. Asante (CRO) | Approved Recovery Plan v2.1 | Recovery | APPROVE | 🟢 |
| 12:15 | M. Boateng (Risk) | Updated LMTD limit 120%→125% | GRC | EDIT | 🟡 |
| 10:45 | System | Failed login (3x) — unknown | Security | LOGIN_FAIL | 🔴 |
| 09:20 | A. Mensah (CFO) | Exported ORASS Monthly | Regulatory | EXPORT | 🔵 |
| 08:00 | System | Daily backup completed | System | BACKUP | 🟣 |
| 16:45 | P. Owusu (Compliance) | Acknowledged breach BR-2026-041 | GRC | ACKNOWLEDGE | 🟢 |

**Interactions:**
- **Click event:** Opens event detail with full context, before/after values, and related events
- **Click "View Details":** Shows technical details (IP, session, user agent)
- **Click "Rollback":** Initiates rollback workflow for data changes (with approval)
- **Click "Block IP":** Security action for failed login events
- **Filter:** By user, module, action type, or date range
- **Click "Export":** Exports audit trail to CSV/PDF

**Responsive Behavior:**
- Mobile: Full width, stacked event cards
- Tablet+: Full timeline as designed

---

## 5. Security Posture Scorecard

### 5.1 Component Specification

**Purpose:** Compliance scorecard showing percentage completion for each CISD 2026 requirement. Enables rapid assessment of cyber security posture.

**Component Type:** Progress Bars / Gauge Cards
**Dimensions:** 6 columns × 480px height
**Position:** Third row, left

```
┌────────────────────────────────────────────────────────────────────┐
│ Security Posture Scorecard — CISD 2026                [View Report]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Overall Score: 87%  🟡                                           │
│  [████████████████████████████████████░░░░░░░░░░]                │
│                                                                    │
│  Data Residency & Localisation                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  95%  [███████████████████████████████████████████░░░]           │
│  • Core systems in Ghana: 24/24 ✅  •  External: 2 (non-sensitive)│
│                                                                    │
│  Access Control & Identity Management                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  92%  [█████████████████████████████████████████░░░░░]           │
│  • 3LoD RBAC: ✅  •  MFA: 98%  •  Password policy: ✅            │
│                                                                    │
│  Encryption & Data Protection                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  88%  [███████████████████████████████████████░░░░░░░]           │
│  • At-rest: ✅  •  In-transit: ✅  •  Key management: 🟡         │
│                                                                    │
│  Incident Response & Monitoring                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  85%  [█████████████████████████████████████░░░░░░░░░░]           │
│  • SIEM: ✅  •  Playbooks: 🟡  •  Response time: 12min           │
│                                                                    │
│  Business Continuity & DR                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  90%  [█████████████████████████████████████████░░░░░]           │
│  • DR site: ✅  •  RTO: 4hrs  •  RPO: 1hr  •  Tests: 🟡        │
│                                                                    │
│  Vendor & Supply Chain Security                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  78%  [██████████████████████████████████░░░░░░░░░░░░]           │
│  • Vendor assessments: 12/15  •  Contracts: 🟡  •  Monitoring: 🟡 │
│                                                                    │
│  Last Assessment: 15 Jun 2026  •  Next Assessment: 15 Sep 2026   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Progress Bar Styling:**
```
Track: height 12px, border-radius 6px, bg #E2E8F0
Fill: #10B981 (≥90%), #3B82F6 (80-89%), #F59E0B (70-79%), #F43F5E (<70%)
Percentage: 14px / 700 / #334155, right-aligned
```

**CISD 2026 Compliance Data:**
| Category | Score | Status | Key Items |
|----------|-------|--------|-----------|
| Data Residency | 95% | 🟢 | Core systems in Ghana, external only for non-sensitive |
| Access Control | 92% | 🟢 | 3LoD RBAC, MFA, password policy |
| Encryption | 88% | 🟡 | At-rest, in-transit, key management pending |
| Incident Response | 85% | 🟡 | SIEM active, playbooks under review |
| Business Continuity | 90% | 🟢 | DR site, RTO 4hrs, RPO 1hr |
| Vendor Security | 78% | 🟡 | 12/15 vendor assessments complete |
| **Overall** | **87%** | **🟡** | — |

**Interactions:**
- **Click category:** Opens detailed assessment with sub-items and remediation plan
- **Hover progress bar:** Tooltip shows exact score and gap analysis
- **Click "View Report":** Opens full CISD 2026 compliance report
- **Click status indicator:** Shows remediation actions and timeline

**Responsive Behavior:**
- Mobile: Full width, stacked progress bars
- Tablet+: Full layout as designed

---

## 6. Incident Response Panel

### 6.1 Component Specification

**Purpose:** Real-time security incident feed with severity, status, and remediation tracking. Critical for rapid response to cyber threats.

**Component Type:** Alert Feed + Status Cards
**Dimensions:** 6 columns × 480px height
**Position:** Third row, right

```
┌────────────────────────────────────────────────────────────────────┐
│ Incident Response Panel                               [New Incident] │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Active Incidents: 2  •  Resolved (YTD): 12  •  Escalated: 0    │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 🔴 HIGH — Failed Login Attempts (Multiple)                   │   │
│  │    Detected: 25 Jun 2026, 10:45 GMT                        │   │
│  │    Source IP: 192.168.1.45  •  Target: Admin Portal          │   │
│  │    Attempts: 15 (blocked after 3)                          │   │
│  │    Status: CONTAINED  •  Owner: Security Ops               │   │
│  │    [View Details]  [Escalate]  [Mark Resolved]               │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 🟡 MEDIUM — Unusual Data Export Pattern                      │   │
│  │    Detected: 25 Jun 2026, 09:20 GMT                        │   │
│  │    User: A. Mensah (CFO)  •  File: ORASS-M-2026-06.xlsx    │   │
│  │    Size: 45MB  •  Destination: External email                │   │
│  │    Status: INVESTIGATING  •  Owner: Compliance             │   │
│  │    [View Details]  [Approve]  [Block]                        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  Recent Resolved Incidents:                                        │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 🟢 LOW — System Maintenance Alert                            │   │
│  │    Resolved: 25 Jun 2026, 08:15 GMT                        │   │
│  │    Backup completed successfully  •  Duration: 45min       │   │
│  │    [View Details]                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  [View All Incidents]                                              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Incident Card Styling:**
```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border-radius: 12px
Padding: 16px 20px
Margin-bottom: 12px
Left accent: 4px solid [severity-color]
```

**Severity Colors:**
| Severity | Color | Description | Response Time |
|----------|-------|-------------|---------------|
| Critical | `#F43F5E` | Data breach, system compromise | 15 min |
| High | `#F97316` | Multiple failed logins, malware | 30 min |
| Medium | `#F59E0B` | Unusual activity, policy violation | 2 hours |
| Low | `#3B82F6` | Minor alert, informational | 24 hours |
| Info | `#8B5CF6` | System events, maintenance | 48 hours |

**Incident Status:**
| Status | Color | Description |
|--------|-------|-------------|
| New | `#F43F5E` | Just detected, not yet assigned |
| Investigating | `#F59E0B` | Under investigation |
| Contained | `#3B82F6` | Threat contained, remediation in progress |
| Resolved | `#10B981` | Incident resolved, post-incident review pending |
| Closed | `#94A3B8` | Fully closed with lessons learned |

**Demo Data:**
| ID | Severity | Title | Detected | Status | Owner | Response Time |
|----|----------|-------|----------|--------|-------|---------------|
| INC-2026-089 | 🔴 High | Failed Login Attempts | 25 Jun 10:45 | Contained | Security Ops | 15 min |
| INC-2026-088 | 🟡 Medium | Unusual Data Export | 25 Jun 09:20 | Investigating | Compliance | 45 min |
| INC-2026-087 | 🟢 Low | System Maintenance | 25 Jun 08:00 | Resolved | System Admin | 15 min |
| INC-2026-086 | 🟢 Low | Password Expiry | 24 Jun 16:00 | Resolved | Security Ops | 2 hours |

**Interactions:**
- **Click incident:** Opens incident detail with timeline, evidence, and actions taken
- **Click "Escalate":** Triggers escalation to next level (Security → CISO → CRO → Board)
- **Click "Mark Resolved":** Closes incident with resolution notes
- **Click "New Incident":** Opens incident creation modal
- **Click "View All Incidents":** Opens full incident management view

**Responsive Behavior:**
- Mobile: Full width, stacked incident cards
- Tablet+: Full layout as designed

---

## 7. Responsive Layout Summary

| Breakpoint | Residency Map | Access Matrix | Audit Trail | Scorecard | Incident Panel |
|------------|--------------|---------------|-------------|-----------|----------------|
| Mobile | Vertical list | Scrollable table | Stacked cards | Full width | Stacked cards |
| Tablet | Full width | 6 columns | 6 columns | 6 columns | 6 columns |
| Desktop+ | Full width | 6 columns | 6 columns | 6 columns | 6 columns |

---

*Cyber Security Visuals Version 1.0 — ALM Platform Visual Design Team — June 2026*
