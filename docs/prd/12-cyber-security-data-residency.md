# PRD: Cyber Security & Data Residency (CISD 2026 Alignment)

## 1. Overview

### 1.1 Purpose

This PRD defines the security, data residency, and infrastructure requirements for the ALM Platform as mandated by the Bank of Ghana Cyber & Information Security Directive (CISD) 2026. It establishes the control framework, hosting posture, encryption standards, identity architecture, and governance cadences that constrain every other module in the platform. No module may be deployed to production unless it satisfies the requirements in this document.

CISD 2026 requires that:
- Core systems and sensitive customer data remain hosted within Ghana.
- The control framework is aligned to ISO 27001 and NIST Cybersecurity Framework.
- Quarterly penetration testing is conducted and reported to the Board.
- Board-level cyber risk reporting is institutionalised.
- Encryption, least-privilege access, and segregation of duties are enforced by design.

### 1.2 Users & Roles

| Role | Responsibilities |
|------|-----------------|
| **Chief Information Security Officer (CISO)** | Owns the security control framework, leads incident response, reviews pen-test results, reports to Board |
| **Platform Administrator** | Manages infrastructure, identity provider, encryption keys, network segmentation |
| **Compliance Officer** | Validates CISD 2026 compliance, coordinates with BoG cybersecurity examiners, maintains evidence |
| **Internal Auditor** | Reviews security controls, verifies segregation of duties, validates audit logs |
| **Board Risk Committee** | Receives quarterly cyber risk reports, approves security budget and exception requests |
| **Data Engineer** | Ensures data pipelines respect residency rules, masks sensitive fields, manages pseudonymisation |

### 1.3 Dependencies

- **Upstream**: BoG CISD 2026 directive text; ISO 27001:2022; NIST CSF 2.0; national data protection authority guidance
- **Downstream**: All other PRDs (`00`–`13`) — every module must reference this PRD for security and residency constraints
- **External**: Ghana-based sovereign cloud or on-premise data centre; national identity provider (if available); BoG cybersecurity examiner portal

---

## 2. Features

### 2.1 In-Country Hosting & Data Residency

#### Description
All core systems, databases, calculation engines, and sensitive customer data must be physically and logically hosted within Ghana. Only non-sensitive, front-end presentation components (e.g., static HTML, CSS, JavaScript bundles) may be served from edge caches outside Ghana, provided they contain no customer data, no PII, and no regulatory figures.

#### User Stories
- **As a CISO**, I want all production databases and APIs to be hosted in Ghana so that we satisfy CISD 2026 data residency requirements.
- **As a Compliance Officer**, I want a real-time dashboard showing the geographic location of every data store and compute instance so that I can demonstrate residency to BoG examiners.
- **As a Platform Administrator**, I want automated alerts if any service or data replica is provisioned outside Ghana so that I can remediate before audit.

#### Acceptance Criteria
- [ ] All PostgreSQL databases, object storage buckets, and backup archives are provisioned in Ghana regions only
- [ ] All backend API services, calculation engines, and message queues run on compute instances physically located in Ghana
- [ ] Static frontend assets may be served via CDN, but CDN cache rules prohibit caching of any endpoint that returns JSON data, PII, or regulatory figures
- [ ] A "Data Residency Dashboard" lists every infrastructure resource with its region, zone, and data classification
- [ ] Automated compliance scan runs daily; any out-of-region resource triggers a critical alert and is auto-quarantined within 1 hour
- [ ] Cross-border data transfer (e.g., to group headquarters, vendor support) requires Board Risk Committee approval and is encrypted end-to-end

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Data Residency Dashboard                                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Overall Status: ✅ COMPLIANT (All resources in Ghana)      │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Resource Type │ Name          │ Region │ Zone    │ Class    │ │
│  │ Database      │ alm-primary   │ GH-ACC │ Zone A  │ Core     │ │
│  │ Database      │ alm-replica-1 │ GH-ACC │ Zone B  │ Core     │ │
│  │ Storage       │ alm-backups   │ GH-ACC │ Zone A  │ Core     │ │
│  │ Compute       │ api-cluster   │ GH-ACC │ Zone A  │ Core     │ │
│  │ CDN           │ static-assets │ Global │ Edge    │ Non-Sens │ │
│  └────────────────────────────────────────────────────────────┘ │
│  [Run Compliance Scan] [Export Evidence] [View Transfer Log]   │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Cloud provider resource inventory (API)
- Data classification tags per resource
- Approved cross-border transfer register

#### Calculation Logic / Business Rules
- `resource_region` must be in approved Ghana region list (`GH-ACC`, `GH-TAM`, `GH-CAPE`)
- `data_classification` in (`Core`, `Sensitive`, `Restricted`) → must be in Ghana
- `data_classification` = `Non-Sensitive` → may be on global CDN with no PII

#### Validation Rules
- Every database connection string must resolve to a Ghana IP range
- Backup geo-replication must be within Ghana (not cross-border)
- Disaster recovery site must be in a different Ghana region, not a different country

#### Error Handling
- Out-of-region resource detected → critical alert to CISO + Platform Admin + Compliance Officer; auto-quarantine if not remediated within 1 hour
- Backup replication to non-Ghana region → block replication job, alert Engineering
- CDN misconfiguration serving JSON data → block at edge, alert CISO

#### Audit & Compliance Requirements
- Daily residency scan results retained for 7 years
- Cross-border transfer log: who, what, when, to whom, approval reference
- Quarterly attestation by CISO that all resources are in-country
- BoG examiner evidence pack auto-generated on demand

---

### 2.2 Security Control Framework (ISO 27001 / NIST CSF)

#### Description
A documented, continuously monitored security control framework aligned to ISO 27001:2022 and NIST Cybersecurity Framework 2.0. Controls are mapped to CISD 2026 requirements, assigned owners, tested on a schedule, and reported to the Board.

#### User Stories
- **As a CISO**, I want a control register that maps every CISD requirement to an ISO 27001 control so that I can demonstrate compliance during a BoG examination.
- **As an Internal Auditor**, I want to see the last test date and result for every control so that I can plan my audit programme.
- **As a Board Risk Committee member**, I want a quarterly cyber risk report summarising control effectiveness, open findings, and remediation status.

#### Acceptance Criteria
- [ ] Control register contains: control ID, CISD mapping, ISO 27001 mapping, NIST function, owner, test frequency, last test date, status
- [ ] Controls cover: asset management, access control, cryptography, physical security, operations security, communications security, incident management, business continuity, supplier relationships, compliance
- [ ] Automated control tests run where possible (e.g., password policy, encryption status, backup success)
- [ ] Manual control tests are scheduled and tracked with evidence upload
- [ ] Quarterly Board cyber risk report auto-generated: control effectiveness %, open findings, critical/high/medium/low breakdown, trend chart
- [ ] Penetration testing conducted quarterly by a BoG-approved external firm; results logged with remediation plan

#### Screen Layout Description

```
┌──────────────────────────────────────────────────────────────────┐
│  Security Control Framework                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Overall Control Effectiveness: 94% (47/50 controls passed) │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Control Register                                            │ │
│  │ ID   │ Control Name          │ CISD │ ISO    │ Status │    │ │
│  │ C-01 │ Access Control Policy │ 4.2  │ A.9.1  │ ✅     │    │ │
│  │ C-02 │ Encryption at Rest    │ 5.1  │ A.10.1 │ ✅     │    │ │
│  │ C-03 │ Penetration Testing   │ 6.3  │ A.12.6 │ 🟡     │    │ │
│  │ C-04 │ Incident Response     │ 7.2  │ A.16.1 │ ✅     │    │ │
│  └────────────────────────────────────────────────────────────┘ │
│  [Run Tests] [Upload Evidence] [Generate Board Report]        │
└──────────────────────────────────────────────────────────────────┘
```

#### Data Inputs
- Control definitions from CISD 2026 and ISO 27001
- Automated test results from infrastructure APIs
- Manual test evidence uploads
- Penetration test reports (quarterly)

#### Calculation Logic / Business Rules
```
Control Effectiveness = (Controls Passed / Total Controls) × 100
Control Status:
  ✅ Passed = last test within frequency window and no open findings
  🟡 Warning = last test within window but open medium findings
  🔴 Failed = last test overdue or open critical/high findings
```

#### Validation Rules
- Every CISD requirement must map to at least one control
- Every control must have an owner and a test frequency
- Penetration test must be conducted by a firm on the BoG-approved list
- Board report must be issued within 15 days of quarter-end

#### Error Handling
- Control test overdue → amber alert to owner and CISO; escalate to red after 7 days
- Penetration test not scheduled within quarter → red alert to Board Risk Committee
- Board report generation failure → critical alert, manual fallback to Excel template

#### Audit & Compliance Requirements
- Control register and test evidence retained for 7 years
- Board reports retained for 7 years
- Penetration test reports retained for 7 years
- All findings tracked to closure with before/after evidence

---

### 2.3 Encryption & Cryptographic Controls

#### Description
All data must be encrypted in transit and at rest using approved cryptographic algorithms and key management practices. Key management is centralised in a hardware security module (HSM) or cloud-native key management service (KMS) hosted in Ghana.

#### User Stories
- **As a Platform Administrator**, I want all database volumes encrypted at rest so that stolen physical media cannot be read.
- **As a Data Engineer**, I want all API traffic encrypted with TLS 1.3 so that data cannot be intercepted in transit.
- **As a CISO**, I want encryption key rotation every 90 days with automated re-encryption so that exposure from a compromised key is limited.

#### Acceptance Criteria
- [ ] Encryption at rest: AES-256 for all databases, object storage, backups, and logs
- [ ] Encryption in transit: TLS 1.3 for all API and database connections; no fallback to TLS 1.0/1.1
- [ ] Key management: centralised KMS/HSM in Ghana; keys never exported in plaintext
- [ ] Key rotation: automatic rotation every 90 days for data-encryption keys; annual rotation for root keys
- [ ] Key access: dual-authorisation required for key deletion or export; all key operations logged
- [ ] Sensitive field-level encryption: PII (customer names, IDs, phone numbers) encrypted at the application layer before database write
- [ ] Cryptographic agility: support for algorithm migration (e.g., post-quantum) without application code changes

#### Data Inputs
- KMS/HSM key inventory and metadata
- Certificate expiry dates
- Sensitive field classification from data catalogue

#### Calculation Logic / Business Rules
- `encryption_status` = `encrypted` if `volume_encrypted == true` AND `tls_version >= 1.3`
- `key_age_days` = `today - key_creation_date`; alert if `key_age_days > 90` for DEK, `> 365` for root key
- `sensitive_field` in (`customer_name`, `customer_id`, `phone`, `address`) → must be application-layer encrypted

#### Validation Rules
- No plaintext storage of passwords, API keys, or database credentials
- No hard-coded secrets in source code; all secrets injected at runtime from KMS
- Certificate expiry must be > 30 days; alert if < 30 days

#### Error Handling
- Encryption failure on write → block write, alert Data Engineering and CISO
- TLS handshake failure → block connection, log source IP, alert CISO
- Key rotation failure → freeze key usage, alert CISO, manual intervention required
- Certificate expiry < 7 days → critical alert, auto-renew if Let's Encrypt / ACME; manual if HSM

#### Audit & Compliance Requirements
- Key operations log: who, what, when, key ID, action, result — retained for 7 years
- Encryption status report generated monthly for Compliance Officer
- Certificate inventory reviewed quarterly by Internal Audit

---

### 2.4 Identity & Access Management (IAM)

#### Description
A centralised identity provider integrated with the bank's corporate directory, enforcing multi-factor authentication (MFA), least-privilege access, role-based access control (RBAC), and segregation of duties. All access is governed by the Three Lines of Defence model required by RMD 2021.

#### User Stories
- **As a Compliance Officer**, I want MFA enforced for all administrative roles so that compromised passwords cannot be used alone.
- **As an Internal Auditor**, I want to see a segregation-of-duties matrix so that I can verify no user has conflicting roles (e.g., model developer + model validator).
- **As a Platform Administrator**, I want automatic deprovisioning of access when an employee leaves so that orphan accounts do not persist.

#### Acceptance Criteria
- [ ] Centralised identity provider (IdP) integrated with HR/Active Directory; daily sync
- [ ] MFA enforced for all roles except read-only business users (optional for them, mandatory for all others)
- [ ] RBAC: roles mapped to ALM modules with permissions (None / View / Edit / Approve / Admin)
- [ ] Segregation of duties enforced at the IdP level: conflicting role pairs blocked at assignment time
- [ ] CRO cannot hold CFO, COO, or Internal Audit roles (RMD 2021)
- [ ] Front-office users cannot have back-office permissions (RMD 2021)
- [ ] Session timeout: 30 minutes of inactivity for sensitive roles, 4 hours for read-only
- [ ] Automatic deprovisioning within 24 hours of HR termination event
- [ ] Quarterly access review: managers certify direct reports' access; exceptions flagged for audit

#### Data Inputs
- HR/Org system user feed
- Role definitions and permission matrices
- Segregation-of-duties rules
- Session and login logs

#### Calculation Logic / Business Rules
```python
# Segregation of duties check
def assign_role(user, new_role):
    for existing_role in user.roles:
        if (existing_role, new_role) in CONFLICTING_PAIRS:
            raise SegregationOfDutiesViolation(
                f"Cannot assign {new_role} to user with {existing_role}"
            )
    user.roles.append(new_role)

CONFLICTING_PAIRS = {
    ("Model_Developer", "Model_Validator"),
    ("Front_Office", "Back_Office"),
    ("CRO", "CFO"), ("CRO", "COO"), ("CRO", "Internal_Audit"),
    ("Treasurer", "Risk_Manager"),  # optional, bank-specific
}
```

#### Validation Rules
- Every user must have exactly one primary role
- No user can have more than one role from a conflicting pair
- MFA must be configured before first login for sensitive roles
- Password policy: minimum 12 characters, complexity, no reuse for 12 generations

#### Error Handling
- Segregation-of-duties violation → block role assignment, alert Compliance Officer
- Failed login > 5 times → lock account, alert user and Platform Admin
- Orphan account detected (no HR match) → suspend account, alert HR and Compliance
- MFA not configured within 48 hours of role assignment → suspend account

#### Audit & Compliance Requirements
- All login/logout events logged with user, IP, timestamp, MFA status, result
- All role changes logged with before/after values and approver
- Quarterly access review reports retained for 7 years
- Failed login attempts retained for 1 year

---

### 2.5 Network Segmentation & Perimeter Security

#### Description
The platform is deployed across multiple network zones with strict traffic controls between them. The core database and calculation engines reside in a private subnet with no direct internet exposure. API gateways and load balancers are the only internet-facing components.

#### User Stories
- **As a CISO**, I want the database subnet to have no public IP addresses so that it cannot be reached from the internet.
- **As a Platform Administrator**, I want automated vulnerability scanning of all internet-facing endpoints so that I can patch before exploitation.
- **As an Internal Auditor**, I want a network diagram showing all subnets, firewall rules, and data flows so that I can verify segregation.

#### Acceptance Criteria
- [ ] Three-tier network: DMZ (web/API), Application (calculation engines), Data (databases, storage, KMS)
- [ ] No public IPs in Application or Data tiers; NAT gateway for outbound only
- [ ] Firewall rules: default deny; explicit allow-list per service/port
- [ ] API gateway: rate limiting (100 req/min per user, 1000 req/min per service account), WAF rules, DDoS protection
- [ ] VPN or private MPLS required for production administrative access; no direct SSH/RDP from internet
- [ ] Vulnerability scanning: weekly automated scans of all internet-facing endpoints; critical findings remediated within 48 hours
- [ ] Intrusion detection / prevention system (IDS/IPS) on DMZ and Application tier

#### Data Inputs
- Network topology from cloud provider
- Firewall rule definitions
- Vulnerability scan results
- IDS/IPS alert logs

#### Validation Rules
- Database security group must not allow inbound from `0.0.0.0/0`
- Administrative ports (22, 3389) must not be exposed to internet
- TLS must terminate at the API gateway; no plaintext HTTP allowed
- All outbound traffic from Data tier must pass through NAT gateway with logging

#### Error Handling
- Firewall rule allowing `0.0.0.0/0` to Data tier → critical alert, auto-revoke rule
- Vulnerability scan critical finding → ticket auto-created, assigned to Platform Admin, SLA 48 hours
- IDS/IPS alert on suspicious traffic → alert SOC/CISO, quarantine source IP after 3 alerts in 10 minutes

#### Audit & Compliance Requirements
- Network diagrams and firewall rules versioned and reviewed quarterly
- Vulnerability scan results retained for 3 years
- IDS/IPS logs retained for 1 year
- Change to firewall rules requires dual approval and is logged

---

### 2.6 Incident Response & Business Continuity

#### Description
A documented incident response plan and business continuity plan aligned to CISD 2026. The platform supports automated backup, point-in-time recovery, and disaster recovery to a secondary Ghana region.

#### User Stories
- **As a CISO**, I want a security incident to trigger an automated response playbook so that containment happens within minutes, not hours.
- **As a Platform Administrator**, I want daily backups to a secondary Ghana region so that I can recover from a regional outage.
- **As a Compliance Officer**, I want the incident response log to be immutable so that it cannot be tampered with after the fact.

#### Acceptance Criteria
- [ ] Incident response plan: classification (P1–P4), response team, containment steps, communication templates, escalation matrix
- [ ] Automated alerting: security events (unauthorised access, data exfiltration, DDoS) trigger P1/P2 alerts to SOC/CISO
- [ ] Backup: daily automated backups of all databases and object storage to secondary Ghana region
- [ ] RPO: < 1 hour for core transactional data; < 4 hours for analytical data
- [ ] RTO: < 4 hours for core services; < 8 hours for reporting services
- [ ] Disaster recovery drill: quarterly failover test to secondary region, documented with lessons learned
- [ ] Immutable incident log: append-only, cryptographic checksum, no delete or modify privileges

#### Data Inputs
- Security event logs from all tiers
- Backup job status and metrics
- DR drill schedules and results

#### Calculation Logic / Business Rules
```
Incident Priority:
  P1 (Critical) = data breach, ransomware, unauthorised admin access → immediate response (< 15 min)
  P2 (High) = DDoS, vulnerability exploitation attempt → response < 1 hour
  P3 (Medium) = policy violation, suspicious login → response < 4 hours
  P4 (Low) = informational, minor misconfiguration → response < 24 hours
```

#### Validation Rules
- Incident response plan must be reviewed and approved by Board annually
- Backup restoration test must succeed monthly
- DR drill must be conducted quarterly with documented results
- Immutable log must pass integrity check on every read

#### Error Handling
- Backup failure → retry 3 times; if still failing, alert Platform Admin and CISO; escalate to P2 if > 2 hours unresolved
- DR failover test failure → P2 incident, root cause analysis required, retest within 7 days
- Immutable log tampering detected → P1 incident, immediate investigation

#### Audit & Compliance Requirements
- Incident logs retained for 7 years
- Backup and DR test evidence retained for 7 years
- Annual Board review of incident response plan documented in minutes
- BoG notification of material security incidents within 24 hours (per CISD 2026)

---

## 3. Data Model

### 3.1 Entities

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| **SecurityControl** | Individual security control | control_id, name, cisd_mapping, iso_mapping, nist_function, owner, test_frequency, last_test_date, status, evidence_url |
| **ControlTest** | Execution of a control test | test_id, control_id, test_date, tester, result, findings, evidence_url |
| **PenTest** | Penetration test record | pentest_id, firm_name, test_date, scope, findings_summary, critical_count, high_count, remediation_plan, status |
| **Incident** | Security or operational incident | incident_id, priority, category, description, detected_at, resolved_at, response_team, root_cause, status |
| **IncidentLog** | Immutable incident event | log_id, incident_id, timestamp, actor, action, details, checksum |
| **Resource** | Infrastructure resource | resource_id, name, type, region, zone, data_classification, encryption_status, tls_version, public_ip_flag |
| **ResidencyScan** | Daily compliance scan | scan_id, date, total_resources, compliant_count, non_compliant_count, findings_json |
| **Key** | Cryptographic key | key_id, key_type, algorithm, creation_date, rotation_date, status, hsm_flag |
| **AccessReview** | Quarterly access review | review_id, quarter, manager_id, total_users, certified_count, exception_count, status |
| **FirewallRule** | Network firewall rule | rule_id, source, destination, port, protocol, action, description, approved_by, created_at |
| **BackupJob** | Backup execution | job_id, resource_id, backup_type, start_time, end_time, status, size_gb, destination_region |

### 3.2 Key Attributes

**SecurityControl.status**: Enum (`passed`, `warning`, `failed`, `overdue`). Derived from the most recent `ControlTest.result` and any open findings.

**Resource.data_classification**: Enum (`Core`, `Sensitive`, `Restricted`, `Non-Sensitive`). Drives residency and encryption rules.

**Key.key_type**: Enum (`DataEncryptionKey`, `RootKey`, `Certificate`, `APIKey`). Rotation frequency varies by type.

### 3.3 Relationships

```
SecurityControl (1) ──► ControlTest (N)
SecurityControl (1) ──► PenTest (N) (via scope reference)
Incident (1) ──► IncidentLog (N)
Resource (1) ──► ResidencyScan (N) (via findings_json reference)
Resource (1) ──► BackupJob (N)
Key (1) ──► Resource (N) (encryption key used by resource)
AccessReview (1) ──► users (N) (via review scope)
```

---

## 4. API Specification

### 4.1 Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/security/controls` | Admin | List security controls |
| GET | `/api/security/controls/{id}` | Admin | Get control detail |
| POST | `/api/security/controls/{id}/test` | Admin | Record control test |
| GET | `/api/security/pentests` | Admin | List penetration tests |
| POST | `/api/security/pentests` | Admin | Add penetration test record |
| GET | `/api/security/incidents` | Admin | List incidents |
| POST | `/api/security/incidents` | Admin | Create incident |
| GET | `/api/security/incidents/{id}/log` | Admin | Get immutable incident log |
| GET | `/api/security/residency` | Admin | Get residency dashboard data |
| POST | `/api/security/residency/scan` | Admin | Trigger compliance scan |
| GET | `/api/security/resources` | Admin | List infrastructure resources |
| GET | `/api/security/keys` | Admin | List cryptographic keys |
| POST | `/api/security/keys/{id}/rotate` | Admin | Trigger key rotation |
| GET | `/api/security/access-reviews` | Admin | List access reviews |
| POST | `/api/security/access-reviews` | Admin | Start quarterly access review |
| GET | `/api/security/backups` | Admin | List backup jobs |
| GET | `/api/security/reports/board` | Admin | Generate quarterly Board cyber risk report |

### 4.2 Request/Response Examples

**Trigger Residency Scan**
```http
POST /api/security/residency/scan
Authorization: Bearer {jwt}

Response: 202 Accepted
{
  "scan_id": "scan-2026-001",
  "status": "running",
  "estimated_completion": "2026-06-25T14:30:00Z"
}
```

**Get Residency Dashboard**
```http
GET /api/security/residency
Authorization: Bearer {jwt}

Response: 200 OK
{
  "overall_status": "compliant",
  "total_resources": 42,
  "compliant_count": 42,
  "non_compliant_count": 0,
  "last_scan": "2026-06-25T14:00:00Z",
  "resources": [
    {
      "resource_id": "db-primary",
      "name": "alm-primary-db",
      "type": "database",
      "region": "GH-ACC",
      "zone": "Zone A",
      "classification": "Core",
      "encryption_status": "encrypted",
      "tls_version": "1.3"
    }
  ]
}
```

**Generate Board Cyber Risk Report**
```http
GET /api/security/reports/board?quarter=Q2-2026
Authorization: Bearer {jwt}

Response: 200 OK
{
  "quarter": "Q2-2026",
  "control_effectiveness_pct": 94,
  "total_controls": 50,
  "passed": 47,
  "warning": 2,
  "failed": 1,
  "open_findings": {
    "critical": 0,
    "high": 1,
    "medium": 3,
    "low": 5
  },
  "pentest_status": "completed",
  "pentest_critical_findings": 0,
  "incidents_this_quarter": 2,
  "report_url": "/reports/board-cyber-Q2-2026.pdf"
}
```

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Residency scan: < 5 minutes for 100 resources
- Control test recording: < 1 second
- Board report generation: < 30 seconds
- Key rotation: < 2 minutes with zero downtime
- Backup job: < 1 hour for 500 GB database

### 5.2 Security
- All endpoints require Admin or CISO role
- API keys for security endpoints rotated every 30 days
- Security audit logs stored in separate, append-only table with RLS preventing modification
- All security reports digitally signed

### 5.3 Availability
- Residency dashboard: 99.9%
- Incident logging: 99.99% (critical for forensics)
- Backup service: 99.9%
- RTO: 4 hours for security services
- RPO: 1 hour for security logs

---

## 6. Reporting & Exports

| Report | Frequency | Format | Recipient |
|--------|-----------|--------|-----------|
| Data Residency Dashboard | Daily | Web UI | CISO, Compliance Officer |
| Control Effectiveness Report | Monthly | PDF | CISO, Internal Audit |
| Board Cyber Risk Report | Quarterly | PDF | Board Risk Committee |
| Penetration Test Report | Quarterly | PDF | CISO, Board Risk Committee |
| Access Review Summary | Quarterly | PDF | Compliance Officer, HR |
| Backup & DR Status | Weekly | Email + Web | Platform Administrator |
| Incident Summary | Monthly | PDF | CISO, Compliance Officer |
| Security Exception Log | Monthly | Excel | Internal Audit |
| BoG Cyber Examiner Pack | On demand | PDF | Compliance Officer → BoG |

---

## 7. Appendix

### 7.1 Regulatory References
- Bank of Ghana Cyber & Information Security Directive (CISD) 2026
- ISO/IEC 27001:2022 — Information Security Management Systems
- NIST Cybersecurity Framework 2.0
- Banks and Specialised Deposit-Taking Institutions Act, 2016 (Act 930), Section 92(1)

### 7.2 Configuration Keys

| Key | Default | Description |
|-----|---------|-------------|
| `security.residency.approved_regions` | `["GH-ACC", "GH-TAM", "GH-CAPE"]` | Allowed Ghana regions for core data |
| `security.encryption.key_rotation_days_dek` | `90` | Data encryption key rotation frequency |
| `security.encryption.key_rotation_days_root` | `365` | Root key rotation frequency |
| `security.encryption.min_tls_version` | `1.3` | Minimum TLS version |
| `security.iam.session_timeout_minutes` | `30` | Session timeout for sensitive roles |
| `security.iam.mfa_required_roles` | `["Admin", "CISO", "Compliance", "PlatformAdmin"]` | Roles requiring MFA |
| `security.network.rate_limit_per_user` | `100` | API requests per minute per user |
| `security.incident.p1_response_sla_minutes` | `15` | P1 incident response SLA |
| `security.backup.rpo_hours_core` | `1` | Recovery point objective for core data |
| `security.dr.rto_hours_core` | `4` | Recovery time objective for core services |
| `security.pentest.frequency_months` | `3` | Penetration test frequency |

---

*PRD v1.0 — Cyber Security & Data Residency Module*
