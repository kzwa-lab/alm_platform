# PRD: RTGS Intraday Liquidity Monitoring

## 1. Overview

### 1.1 Purpose

The RTGS Intraday Liquidity Monitoring module implements the Basel Monitoring Tools for Intraday Liquidity Management standard as required by the Bank of Ghana Liquidity Risk Management Directive (LRMD) 2026. It connects to the central Real-Time Gross Settlement (RTGS) / payment clearing system to capture live settlement balances, throughput ratios, and peak intraday funding demands. The module enables the bank to demonstrate its system capability to BoG examiners — proving that the platform can aggregate real-time intraday data and generate accurate liquidity profiles without manual intervention.

This is the most technically demanding integration in the BoG 2026 package and must be de-risked early in the implementation cycle.

### 1.2 Users & Roles

| Role | Responsibilities |
|------|-----------------|
| **Treasury Operations Manager** | Monitors intraday liquidity position, manages payment queues, ensures settlement obligations are met |
| **Liquidity Risk Manager** | Reviews intraday liquidity trends, identifies stress patterns, validates throughput ratios |
| **ALCO Member** | Reviews intraday liquidity snapshots at meetings, approves intraday funding limits |
| **Compliance Officer** | Ensures LRMD system-capability demonstration readiness, coordinates with BoG examiners |
| **Data Engineer** | Maintains RTGS feed integration, monitors feed health, implements fallback mechanisms |
| **BoG Examiner** (external) | Reviews system-capability demonstration, verifies real-time aggregation without manual intervention |

### 1.3 Dependencies

- **Upstream**: RTGS / central payment clearing system (real-time feed); Core Banking System (CBS) — account balances and payment instructions; Treasury / Dealing System — money-market and FX settlement flows
- **Downstream**: Liquidity Risk module (`02-liquidity-risk.md`) — intraday liquidity feeds into daily LCR/NSFR and stress testing; Data Foundation (`01-data-foundation.md`) — ingestion pipeline and data quality
- **External**: Bank of Ghana RTGS / Ghana Interbank Payment and Settlement Systems (GIPSS); CISD 2026 security requirements for real-time data transmission

---

## 2. Features

### 2.1 RTGS Real-Time Feed Integration

#### Description
A high-availability, low-latency integration with the central RTGS / payment clearing system that consumes real-time settlement messages, account balance updates, and payment throughput data. The feed supports both streaming (WebSocket / message queue) and batch reconciliation modes. A near-real-time fallback is provided while the live feed is hardened.

#### User Stories
- **As a Data Engineer**, I want a resilient RTGS connector with automatic failover so that intraday liquidity monitoring is not interrupted by feed failures.
- **As a Treasury Operations Manager**, I want to see live settlement balances updating every few seconds so that I can manage payment queues proactively.
- **As a Compliance Officer**, I want to demonstrate to BoG examiners that our system aggregates RTGS data in real time without manual intervention.

#### Acceptance Criteria
- [ ] RTGS feed integration: real-time streaming via API or message queue (SWIFT MT/MX, ISO 20022, or national standard)
- [ ] Latency: < 5 seconds from settlement event to platform display
- [ ] Availability: 99.9% during business hours (08:00–17:00 GMT)
- [ ] Automatic failover: primary feed → secondary feed → near-real-time batch fallback within 30 seconds
- [ ] Message validation: schema validation, duplicate detection, sequence number checking
- [ ] Data residency: all RTGS data processed and stored within Ghana
- [ ] Encryption: TLS 1.3 for all RTGS API connections; AES-256 for data at rest
- [ ] Audit trail: every RTGS message logged with timestamp, message ID, source, and validation status

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  RTGS Feed Monitor                                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Feed Status: ✅ LIVE │ Latency: 2.3s │ Messages/Min: 1,245 │  │
│  │ Primary: Connected │ Secondary: Standby │ Fallback: Ready   │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Recent Messages (Last 10)                                   │  │
│  │ Time     │ Msg ID    │ Type      │ Amount    │ Status       │  │
│  │ 14:23:01 │ RTGS-4521 │ Settlement│ GHS 5.2M  │ ✅ Confirmed │  │
│  │ 14:22:58 │ RTGS-4520 │ Payment   │ GHS 1.8M  │ ✅ Confirmed │  │
│  │ 14:22:55 │ RTGS-4519 │ Settlement│ GHS 12.5M │ ⚠️ Queued   │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Test Connection] [Switch to Fallback] [View Logs] [Export]    │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Format | Frequency |
|-------|--------|--------|-----------|
| Settlement messages | RTGS / GIPSS | ISO 20022 / SWIFT MT | Real-time (streaming) |
| Account balance updates | RTGS / GIPSS | API | Real-time (streaming) |
| Payment queue status | RTGS / GIPSS | API | Real-time (streaming) |
| End-of-day reconciliation | RTGS / GIPSS | File (batch) | Daily EOD |
| CBS payment instructions | Core Banking System | API | Intraday |

#### Calculation Logic / Business Rules
```python
# Feed health check
feed_latency = platform_timestamp - rtgs_message_timestamp
if feed_latency > 5_seconds:
    trigger_alert("RTGS feed latency exceeded threshold")
    if feed_latency > 30_seconds:
        activate_fallback()

# Duplicate detection
if message_id in processed_message_ids:
    log_duplicate(message_id)
    skip_processing()

# Sequence validation
if message_sequence != expected_sequence:
    trigger_alert("Sequence gap detected")
    request_retransmission(expected_sequence, message_sequence)
```

#### Validation Rules
- Every RTGS message must have a valid message ID, timestamp, and amount
- Settlement amounts must be positive
- Account balances must reconcile to CBS balances within 0.1% tolerance at EOD
- All messages must be processed in sequence order
- No manual data entry allowed for RTGS feed data (system-capability demonstration requirement)

#### Error Handling
- Feed latency > 5 seconds → amber alert to Data Engineering
- Feed latency > 30 seconds → activate fallback mode, alert Treasury Operations and CISO
- Sequence gap detected → request retransmission, queue messages for backfill
- Duplicate message detected → log and discard, alert Data Engineering if > 1% of messages
- Feed failure during business hours → P1 incident, activate fallback, alert CISO and Compliance Officer

#### Audit & Compliance Requirements
- All RTGS messages retained for 7 years (regulatory requirement)
- Feed health metrics logged every minute: latency, message count, error rate
- System-capability demonstration evidence: screen recording of real-time aggregation, timestamped logs, examiner sign-off
- Fallback activation events logged with reason, duration, and recovery steps

---

### 2.2 Intraday Liquidity Dashboard

#### Description
A real-time dashboard that presents the bank's intraday liquidity position: settlement account balances, payment throughput, largest expected payments, and net liquidity position throughout the business day. The dashboard updates automatically from the RTGS feed without manual refresh.

#### User Stories
- **As a Treasury Operations Manager**, I want to see our RTGS settlement account balance in real time so that I can ensure we have sufficient funds for outgoing payments.
- **As a Liquidity Risk Manager**, I want to see the throughput ratio (percentage of daily payments settled by midday) so that I can identify operational inefficiencies.
- **As an ALCO Member**, I want an intraday liquidity snapshot in the ALCO pack so that I can understand daily payment patterns.

#### Acceptance Criteria
- [ ] Real-time settlement account balance(s) displayed with "last updated" timestamp
- [ ] Payment throughput ratio: percentage of daily outgoing payments settled within specific hourly windows (e.g., 09:00, 12:00, 15:00)
- [ ] Largest expected incoming and outgoing payments flagged with estimated settlement times
- [ ] Net intraday liquidity position: cumulative inflows minus cumulative outflows, updated every minute
- [ ] Peak intraday funding demand: maximum negative net position during the day
- [ ] Historical comparison: today's pattern vs. average pattern over last 30 days
- [ ] Alert when settlement balance falls below a configurable threshold (e.g., GHS 100M)
- [ ] Auto-refresh: dashboard updates every 5 seconds during business hours

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Intraday Liquidity Dashboard                                     │
│  Date: 2026-06-25 │ Business Day: Open │ Last Update: 14:23:01  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Settlement Account Balances                                 │  │
│  │ Account          │ Balance    │ vs Opening │ Trend          │  │
│  │ RTGS Main        │ GHS 245M   │ -12M       │ ↓              │  │
│  │ RTGS Secondary   │ GHS 89M    │ +5M        │ ↑              │  │
│  │ BoG Reserve      │ GHS 156M   │ 0M         │ →              │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Payment Throughput Ratio                                    │  │
│  │ Window    │ % Settled │ Target │ Status                    │  │
│  │ 09:00     │ 35%       │ 30%    │ ✅                        │  │
│  │ 12:00     │ 62%       │ 60%    │ ✅                        │  │
│  │ 15:00     │ 78%       │ 80%    │ 🟡                        │  │
│  │ EOD       │ 95%       │ 95%    │ 🟡 (projected)            │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Net Intraday Position (Cumulative)                         │  │
│  │ [Line chart: net position from 08:00 to now, with         │  │
│  │  opening balance, peak negative, and current position]   │  │
│  │ Current: -GHS 23M │ Peak Negative: -GHS 67M at 11:45       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Largest Expected Payments                                   │  │
│  │ Direction │ Amount   │ Time    │ Counterparty    │ Status │  │
│  │ Outgoing  │ GHS 45M  │ 15:30   │ Corporate A     │ Scheduled│  │
│  │ Incoming  │ GHS 32M  │ 16:00   │ Government B    │ Expected│  │
│  │ Outgoing  │ GHS 28M  │ 14:45   │ Interbank C     │ Scheduled│  │
│  └────────────────────────────────────────────────────────────┘  │
│  [View Detailed Grid] [Export Snapshot] [Alert Settings]      │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
| Input | Source | Frequency |
|-------|--------|-----------|
| Settlement account balances | RTGS feed | Real-time |
| Payment messages (incoming/outgoing) | RTGS feed | Real-time |
| Scheduled payment instructions | CBS / Treasury system | Intraday |
| Historical intraday patterns | Platform analytics | Daily update |

#### Calculation Logic / Business Rules
```python
# Throughput ratio at time t
throughput_ratio_t = (payments_settled_by_t / total_expected_payments) × 100

# Net intraday position at time t
net_position_t = opening_balance + cumulative_inflows_t - cumulative_outflows_t

# Peak intraday funding demand
peak_demand = min(net_position_t for all t in business_day)

# Alert threshold
if settlement_balance < intraday_alert_threshold:
    trigger_alert("Settlement balance below threshold", priority="high")
```

#### Validation Rules
- Opening balance must reconcile to previous day's closing balance
- Cumulative inflows + outflows must reconcile to total payment volume from RTGS feed
- Throughput ratio must be between 0% and 100%
- Peak demand must be ≤ 0 (negative or zero); positive values indicate surplus

#### Error Handling
- Missing RTGS data for > 5 minutes → show last known value with "stale" badge, activate fallback
- Payment instruction from CBS conflicts with RTGS message → flag for manual review, alert Treasury Operations
- Throughput ratio < target at midday → amber alert, suggest payment queue prioritisation
- Settlement balance < threshold → red alert, trigger liquidity injection workflow

#### Audit & Compliance Requirements
- Intraday dashboard snapshots retained for 1 year (regulatory requirement)
- Throughput ratios logged hourly for trend analysis
- Alert events logged with timestamp, value, threshold, and response action
- System-capability demonstration: dashboard must be shown to BoG examiners with live RTGS data flowing

---

### 2.3 System Capability Demonstration

#### Description
A dedicated mode for demonstrating the platform's real-time intraday liquidity aggregation capability to Bank of Ghana examiners. The demonstration mode shows live data flowing from the RTGS feed through the platform's calculation engine to the dashboard, with no manual intervention required. It includes a " examiner view" that highlights the key LRMD requirements being met.

#### User Stories
- **As a Compliance Officer**, I want to initiate a system-capability demonstration session for BoG examiners so that I can prove our real-time monitoring capability.
- **As a BoG Examiner**, I want to see live RTGS data flowing into the platform and generating accurate liquidity metrics so that I can verify the bank's system capability.
- **As a CISO**, I want the demonstration mode to be read-only and audit-logged so that it cannot be used to manipulate data.

#### Acceptance Criteria
- [ ] Demonstration mode activated by Compliance Officer with dual approval (Compliance + CISO)
- [ ] Live RTGS feed visible to examiner with message-level detail (anonymised counterparty names)
- [ ] Dashboard auto-updates every 5 seconds with no manual refresh required
- [ ] Key LRMD requirements highlighted: real-time aggregation, throughput ratios, peak demand, settlement balance monitoring
- [ ] Read-only mode: examiner cannot modify data, parameters, or thresholds
- [ ] Session logging: all examiner actions (clicks, drill-downs, exports) recorded with timestamp
- [ ] Session report: auto-generated summary of demonstration session for examiner sign-off
- [ ] Timeout: session auto-terminates after 2 hours; reactivation requires new approval

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  System Capability Demonstration — LRMD Compliance                │
│  Session ID: DEMO-2026-001 │ Started: 10:00 │ Examiner: BoG-001  │
│  Status: 🔴 LIVE │ Read-Only Mode │ Auto-Timeout: 11:45          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Live RTGS Feed (Anonymised)                               │  │
│  │ Time     │ Type      │ Amount    │ Status      │ Latency   │  │
│  │ 10:05:23 │ Settlement│ GHS 8.5M  │ ✅ Confirmed│ 1.2s      │  │
│  │ 10:05:20 │ Payment   │ GHS 2.1M  │ ✅ Confirmed│ 1.5s      │  │
│  │ 10:05:18 │ Settlement│ GHS 15.0M │ ⚠️ Queued   │ 2.0s      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ LRMD Requirement Checklist                                │  │
│  │ Requirement                          │ Status │ Evidence  │  │
│  │ Real-time aggregation                  │ ✅     │ Live feed │  │
│  │ Throughput ratio monitoring            │ ✅     │ Dashboard │  │
│  │ Peak intraday funding demand           │ ✅     │ Chart     │  │
│  │ Settlement balance monitoring          │ ✅     │ Real-time │  │
│  │ No manual intervention                 │ ✅     │ Auto-refresh│  │
│  │ System capability demonstration        │ ✅     │ This session│  │
│  └────────────────────────────────────────────────────────────┘  │
│  [End Session] [Export Evidence] [Print Sign-Off Sheet]         │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Live RTGS feed data
- Platform configuration (thresholds, targets, business hours)
- Examiner session metadata (examiner ID, session start, approved by)

#### Calculation Logic / Business Rules
- Demonstration mode flag set in session; all write operations blocked
- RTGS data anonymised: counterparty names replaced with codes (e.g., "CPTY-A")
- All dashboard calculations use the same engine as production (no special demo logic)
- Session timeout: 2 hours from activation; 15-minute warning before timeout

#### Validation Rules
- Demonstration mode requires dual approval (Compliance Officer + CISO)
- Examiner must be authenticated with read-only role
- Session must be scheduled in advance (minimum 24 hours) to ensure feed availability
- All evidence exports must include session ID, timestamp, and digital signature

#### Error Handling
- RTGS feed failure during demonstration → immediate fallback activation, transparent to examiner, alert Compliance Officer
- Session timeout approaching → 15-minute warning, option to extend with new approval
- Examiner attempts write operation → block with explanatory message, log attempt

#### Audit & Compliance Requirements
- All demonstration sessions logged with: session ID, examiner ID, start/end time, approved by, evidence exported
- Session evidence retained for 7 years
- BoG examiner sign-off sheet generated at session end
- Demonstration mode activation/deactivation logged as high-priority audit events

---

### 2.4 Fallback & Resilience

#### Description
A multi-layered fallback mechanism that ensures intraday liquidity monitoring continues even if the primary RTGS feed is unavailable. Fallback modes degrade gracefully from real-time streaming to near-real-time batch to manual input (last resort, with full audit trail).

#### User Stories
- **As a Data Engineer**, I want automatic fallback to a secondary RTGS feed if the primary fails so that monitoring continues uninterrupted.
- **As a Treasury Operations Manager**, I want a near-real-time batch fallback if both RTGS feeds fail so that I can still manage payments.
- **As a Compliance Officer**, I want every fallback activation documented so that I can explain any data gaps to BoG examiners.

#### Acceptance Criteria
- [ ] Primary feed: real-time streaming from RTGS
- [ ] Secondary feed: real-time streaming from backup RTGS endpoint or mirror
- [ ] Fallback 1: near-real-time batch (5-minute intervals) from RTGS file drop
- [ ] Fallback 2: manual input mode with full audit trail (last resort, requires Treasurer approval)
- [ ] Automatic detection of feed failure and fallback activation within 30 seconds
- [ ] Graceful degradation: dashboard shows "Fallback Mode" badge with current mode and estimated data latency
- [ ] Recovery: automatic switch back to primary when feed health restored for 5 minutes
- [ ] All fallback transitions logged with timestamp, reason, and approver

#### Data Inputs
- Primary RTGS feed health metrics
- Secondary RTGS feed health metrics
- Batch file availability and freshness
- Manual input forms (Fallback 2 only)

#### Calculation Logic / Business Rules
```python
# Feed health check every 10 seconds
if primary_feed.healthy and primary_feed.latency < 5s:
    use_primary()
elif secondary_feed.healthy and secondary_feed.latency < 5s:
    activate_secondary()
    alert_data_engineering("Primary feed failed, secondary active")
elif batch_file.available and batch_file.freshness < 5min:
    activate_batch_fallback()
    alert_treasury_operations("Near-real-time batch fallback active")
else:
    activate_manual_input()
    alert_compliance_officer("Manual input fallback required")
    require_treasurer_approval()
```

#### Validation Rules
- Fallback mode must be clearly indicated on all dashboards and reports
- Data latency must be displayed for all fallback modes
- Manual input requires dual approval (Treasurer + Compliance Officer)
- Recovery to primary feed must be verified for 5 minutes before switching

#### Error Handling
- Both primary and secondary feeds fail → activate batch fallback, P2 incident
- Batch fallback unavailable → activate manual input, P1 incident, alert CISO and Board
- Manual input data quality issues → block calculation, alert Data Engineering
- Recovery to primary fails → remain on fallback, investigate root cause

#### Audit & Compliance Requirements
- All fallback transitions retained for 7 years
- Manual input records include: who, what, when, source, approver
- Fallback mode duration and impact summary included in quarterly compliance report
- BoG notification required if fallback mode > 2 hours during business hours

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **RTGSMessage** | Individual RTGS message | message_id, timestamp, message_type, amount, currency, sender_account, receiver_account, status, settlement_time, latency_seconds |
| **RTGSFeedHealth** | Feed health metrics | health_id, timestamp, feed_name, status, latency_ms, messages_per_minute, error_rate, fallback_mode |
| **IntradayBalance** | Real-time settlement balance | balance_id, account_id, timestamp, balance, currency, opening_balance, net_change |
| **ThroughputRatio** | Hourly throughput metric | throughput_id, date, hour_window, pct_settled, target, status |
| **IntradayPosition** | Cumulative net position | position_id, timestamp, cumulative_inflows, cumulative_outflows, net_position, peak_negative |
| **ExpectedPayment** | Scheduled/expected payment | payment_id, direction, amount, currency, expected_time, counterparty, status |
| **DemonstrationSession** | System capability demo | session_id, examiner_id, start_time, end_time, approved_by, status, evidence_url |
| **FallbackLog** | Fallback activation record | log_id, timestamp, from_mode, to_mode, reason, approved_by, duration_minutes |
| **ManualInput** | Manual fallback data entry | input_id, timestamp, field_name, value, entered_by, approved_by, reason |

### 3.2 Key Attributes

**RTGSMessage.latency_seconds**: Time between settlement event at RTGS and platform processing. Must be < 5 seconds for primary feed.

**IntradayBalance.net_change**: Cumulative change from opening balance since start of business day. Updated every minute.

**ThroughputRatio.pct_settled**: Percentage of total expected daily payments settled by the hour window. Target: 30% by 09:00, 60% by 12:00, 80% by 15:00, 95% by EOD.

### 3.3 Relationships

```
RTGSFeedHealth (N) ──► RTGSMessage (N) (feed health contextualises messages)
IntradayBalance (N) ──► RTGSMessage (N) (balance derived from messages)
ThroughputRatio (N) ──► RTGSMessage (N) (throughput derived from messages)
IntradayPosition (N) ──► RTGSMessage (N) (position derived from messages)
ExpectedPayment (N) ──► IntradayPosition (N) (expected payments affect projected position)
DemonstrationSession (1) ──► RTGSFeedHealth (N) (session captures feed health evidence)
FallbackLog (N) ──► RTGSFeedHealth (N) (fallback triggered by feed health)
ManualInput (N) ──► FallbackLog (N) (manual input during fallback mode)
```

---

## 4. API Specification

### 4.1 Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/rtgs/health` | Admin | Get RTGS feed health status |
| GET | `/api/rtgs/messages` | Admin | List recent RTGS messages (paginated) |
| GET | `/api/rtgs/balances` | All roles | Get current intraday balances |
| GET | `/api/rtgs/throughput` | All roles | Get throughput ratios |
| GET | `/api/rtgs/position` | All roles | Get net intraday position |
| GET | `/api/rtgs/expected-payments` | All roles | List expected payments |
| POST | `/api/rtgs/demonstration` | Compliance | Start system capability demonstration |
| GET | `/api/rtgs/demonstration/{id}` | All roles | Get demonstration session status |
| DELETE | `/api/rtgs/demonstration/{id}` | Compliance | End demonstration session |
| POST | `/api/rtgs/fallback/activate` | Admin | Manually activate fallback mode |
| POST | `/api/rtgs/fallback/recover` | Admin | Manually recover to primary feed |
| GET | `/api/rtgs/fallback/log` | Admin | List fallback activation history |
| POST | `/api/rtgs/manual-input` | Treasurer | Submit manual input (fallback mode only) |
| GET | `/api/rtgs/reports/intraday` | All roles | Generate intraday liquidity report |
| GET | `/api/rtgs/reports/throughput` | All roles | Generate throughput analysis report |

### 4.2 Request/Response Examples

**Get RTGS Feed Health**
```http
GET /api/rtgs/health
Authorization: Bearer {jwt}

Response: 200 OK
{
  "primary_feed": {
    "status": "healthy",
    "latency_ms": 2300,
    "messages_per_minute": 1245,
    "error_rate": 0.001
  },
  "secondary_feed": {
    "status": "standby",
    "latency_ms": null,
    "messages_per_minute": 0,
    "error_rate": 0.0
  },
  "current_mode": "primary",
  "fallback_active": false,
  "last_message_timestamp": "2026-06-25T14:23:01Z"
}
```

**Start Demonstration Session**
```http
POST /api/rtgs/demonstration
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "examiner_id": "BOG-EXAM-001",
  "examiner_name": "Kwame Asante",
  "requested_by": " compliance_officer_001",
  "approved_by": "ciso_001"
}

Response: 201 Created
{
  "session_id": "DEMO-2026-001",
  "status": "active",
  "start_time": "2026-06-25T10:00:00Z",
  "timeout_at": "2026-06-25T12:00:00Z",
  "read_only": true
}
```

---

## 5. Non-Functional Requirements

### 5.1 Performance
- RTGS message processing latency: < 5 seconds from settlement to dashboard
- Dashboard auto-refresh: every 5 seconds during business hours
- Throughput ratio calculation: < 1 second after each hourly window
- Intraday position update: < 1 second per message batch
- Demonstration session start: < 10 seconds
- Fallback activation: < 30 seconds from feed failure detection

### 5.2 Security
- RTGS feed data classified as strictly confidential (real-time settlement data)
- API access restricted to Treasury, Risk, Compliance, and Data Engineering roles
- Demonstration mode: read-only, no data modification, full session logging
- All RTGS connections encrypted with TLS 1.3
- Data residency: all RTGS data stored in Ghana only
- Penetration testing of RTGS integration quarterly by BoG-approved firm

### 5.3 Availability
- RTGS feed integration: 99.9% during business hours (08:00–17:00 GMT)
- Intraday dashboard: 99.95% during business hours
- Fallback mode: 99.5% (degraded but functional)
- RTO: 1 minute for fallback activation
- RPO: 0 (real-time streaming, no data loss on failover)

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| Intraday Liquidity Dashboard | Real-time | Web UI | Treasury Operations, Risk Manager |
| Throughput Analysis | Daily | PDF | Treasurer, ALCO Members |
| Peak Intraday Funding Demand | Daily | PDF | Treasurer, Risk Manager |
| RTGS Feed Health Report | Daily | Web UI + Email | Data Engineering, CISO |
| System Capability Demonstration Evidence | Per session | PDF | Compliance → BoG |
| Fallback Activation Summary | Monthly | PDF | Compliance, Internal Audit |
| Intraday Liquidity Trends | Monthly | PDF | ALCO, Board Risk Committee |
| Manual Input Log | Monthly | Excel | Compliance, Internal Audit |

---

## 7. Appendix

### 7.1 Regulatory References
- Bank of Ghana Liquidity Risk Management Directive (LRMD), 2026 (Exposure Draft) — Real-time intraday liquidity monitoring and system capability demonstration
- Basel Committee on Banking Supervision — Monitoring Tools for Intraday Liquidity Management (January 2013)
- Bank of Ghana Cyber & Information Security Directive (CISD), 2026
- Banks and Specialised Deposit-Taking Institutions Act, 2016 (Act 930), Section 92(1)

### 7.2 Configuration Keys

| Key | Default | Description |
|-----|---------|-------------|
| `rtgs.primary_feed_url` | — | Primary RTGS feed endpoint |
| `rtgs.secondary_feed_url` | — | Secondary RTGS feed endpoint |
| `rtgs.batch_fallback_interval_seconds` | `300` | Batch fallback file check interval |
| `rtgs.latency_threshold_seconds` | `5` | Maximum acceptable feed latency |
| `rtgs.fallback_activation_seconds` | `30` | Time before fallback activation on feed failure |
| `rtgs.dashboard_refresh_seconds` | `5` | Dashboard auto-refresh interval |
| `rtgs.business_hours_start` | `08:00` | Business day start (GMT) |
| `rtgs.business_hours_end` | `17:00` | Business day end (GMT) |
| `rtgs.throughput_target_09h` | `30` | Target throughput % by 09:00 |
| `rtgs.throughput_target_12h` | `60` | Target throughput % by 12:00 |
| `rtgs.throughput_target_15h` | `80` | Target throughput % by 15:00 |
| `rtgs.throughput_target_eod` | `95` | Target throughput % by EOD |
| `rtgs.intraday_alert_threshold_ghs` | `100000000` | Settlement balance alert threshold (GHS) |
| `rtgs.demonstration_timeout_minutes` | `120` | Maximum demonstration session duration |
| `rtgs.manual_input_requires_approval` | `true` | Whether manual input requires Treasurer approval |

---

*PRD v1.0 — RTGS Intraday Liquidity Monitoring Module*
