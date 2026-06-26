/mode# PRD Update Plan — Aligning ALM Platform with BoG 2026 Solution Architecture

**Date:** 2026-06-25  
**Goal:** Produce a complete, Ghana-localised set of PRDs that covers every requirement in `BoG_2026_Solution_Architecture.txt`.  
**Status:** Baseline PRDs exist (`docs/prd/00-07`); missing modules and Ghana-specific details must be added.

---

## 1. Guiding Principles

1. **Reuse before rewrite.** Update existing PRDs where the gap is terminology or localisation; create new PRDs only for missing modules.
2. **One module, one PRD.** Keep each PRD focused on a single functional domain with clear inputs, outputs, data model, APIs, and acceptance criteria.
3. **Ghana-first.** Replace EU/EBA references with Bank of Ghana (BoG) terminology, templates, and thresholds.
4. **Configuration over code.** Every threshold, time bucket, shock factor, behavioural scalar, and report template must be versioned configuration.
5. **Regulatory reporting is a first-class module.** Build BoG templates and ORASS integration into a dedicated PRD rather than scattering them.
6. **Security and residency by design.** Address CISD 2026 and data residency in a dedicated PRD that constrains all others.

---

## 2. Deliverables

### 2.1 Updated Existing PRDs

| File | Why it must change | Key additions |
|------|--------------------|---------------|
| `docs/prd/00-platform-overview.md` | Still framed as a generic European ALM platform | Add BoG 2026 context, CISD 2026, in-country hosting, ORASS reporting, phased delivery to Jan 2027, mapping of PRD modules to BoG directives |
| `docs/prd/01-data-foundation.md` | Generic data layer; lacks Ghana-specific classification and dual bucket structures | Add Ghana asset/liability classification engine, encumbrance register, 13 LMTD + 19 IRRBB bucket engines, Ghana Reference Rate / curve store, RTGS connector, rules repository |
| `docs/prd/02-liquidity-risk.md` | Basel LCR/NSFR only; not BoG LMTD/LRMD | Add four BoG prudential ratios (Narrow/Broad, bank/SDI thresholds), 13-band contractual maturity mismatch, funding concentration, significant-currency LCR, intraday liquidity monitor, ILAAP/LAS support, e-money float treatment |
| `docs/prd/03-interest-rate-risk.md` | Generic IRRBB; not standardised-framework-aligned | Add 19 standardised buckets, amenable/less-amenable/not-amenable categorisation, basis risk, yield-curve risk, formal Supervisory Outlier Test (15% Tier 1), Ghana Reference Rate integration, major-currency reporting, BoG IRRBB templates |
| `docs/prd/04-capital-management.md` | Basel/ICAAP; needs BoG ILAAP linkage | Add Ghana-specific capital adequacy context, ILAAP integration with liquidity, BoG CAR/CET1 reporting hooks |
| `docs/prd/05-ecl.md` | IFRS 9 focus; mostly reusable | Add Ghana macro scenario variables, linkage to capital/RWA, but largely already aligned conceptually |
| `docs/prd/06-ftp.md` | Generic FTP curves | Add Ghana Reference Rate-based FTP/ITP/LTP curves, liquidity premium methodology aligned to BoG ratios |
| `docs/prd/07-balance-sheet-optimization.md` | Strategic planning only | Add board risk pack, recovery-indicator integration, public disclosure outputs, ORASS submission orchestration |

### 2.2 New PRDs to Create

| New File | Module | Purpose |
|----------|--------|---------|
| `docs/prd/08-recovery-planning.md` | Recovery & Stress | Recovery plan repository, recovery options menu, quantitative indicators & triggers, real-time recovery MIS, annual self-assessment, Dec 31 submission |
| `docs/prd/09-grc-risk-framework.md` | Governance & Control (RMD 2021) | Digitised RMF, Risk Universe Register, 3LoD RBAC, CRO independence, front/back-office segregation, limit framework, board approvals, audit evidence, 10-day breach notification |
| `docs/prd/10-regulatory-reporting-orass.md` | Reporting & Supervisory | BoG-prescribed Excel/XML/XBRL templates, template engine, ORASS integration endpoint, submission scheduler, public disclosures, ad-hoc re-submission |
| `docs/prd/11-behavioural-model-library.md` | Shared Modelling Service | NMD core/non-core split with regulatory caps, CPR prepayment, TDRR early-redemption, backtesting, versioned assumptions shared by IRRBB and liquidity stress |
| `docs/prd/12-cyber-security-data-residency.md` | Security & Infrastructure | CISD 2026 alignment, Ghana data residency, ISO 27001/NIST controls, quarterly penetration testing, board cyber reporting, encryption, identity provider integration |
| `docs/prd/13-rtgs-intraday-liquidity.md` | Integration & Intraday Module | RTGS/settlement real-time feed, intraday liquidity monitoring, throughput ratios, system-capability demonstration dashboard, fallback/fallback queue |

---

## 3. Implementation Sequence

### Phase 1 — Foundation & Context (Week 1)

1. **Update `00-platform-overview.md`**
   - State the BoG 2026 package as the primary regulatory driver.
   - Add CISD 2026 / data residency constraints.
   - Define the module-to-directive mapping.
   - Add phased delivery timeline (Q3 2026 diagnostic → Jan 2027 go-live).

2. **Create `12-cyber-security-data-residency.md`**
   - Establish hosting, encryption, identity, pen-testing, and board cyber-reporting requirements that constrain all subsequent PRDs.

3. **Update `01-data-foundation.md`**
   - Add Ghana classification engine (Narrow/Broad liquid assets).
   - Add encumbrance register.
   - Add dual bucket structures (13 LMTD + 19 IRRBB).
   - Add Ghana Reference Rate / rate and shock-factor store.
   - Add RTGS connector placeholder (detailed in `13`).
   - Add central rules & configuration repository concept.

### Phase 2 — Liquidity & IRRBB Localisation (Weeks 2–3)

4. **Create `11-behavioural-model-library.md`**
   - Define shared NMD, CPR, TDRR models.
   - Specify regulatory caps and backtesting.

5. **Update `02-liquidity-risk.md`**
   - Add BoG four-ratio engine.
   - Add 13-band contractual maturity mismatch.
   - Add funding concentration / connected counterparty.
   - Add significant-currency LCR.
   - Add CFP link and ILAAP/LAS hooks.

6. **Create `13-rtgs-intraday-liquidity.md`**
   - Define RTGS/settlement feed integration.
   - Define intraday throughput ratios and system-capability demonstration screen.

7. **Update `03-interest-rate-risk.md`**
   - Add 19 standardised buckets.
   - Add amenable/less-amenable/not-amenable categorisation.
   - Add basis risk and yield-curve risk analysis.
   - Formalise Supervisory Outlier Test workflow.
   - Add Ghana Reference Rate shock scenarios.

### Phase 3 — Recovery, Governance & Reporting (Weeks 4–5)

8. **Create `08-recovery-planning.md`**
   - Recovery plan repository & versioning.
   - Recovery options menu mapped to scenarios.
   - Quantitative indicators / early-warning triggers.
   - Real-time recovery MIS dashboard.
   - Annual self-assessment and Dec 31 submission.

9. **Create `09-grc-risk-framework.md`**
   - Digitised Risk Management Framework.
   - Risk Universe Register (incl. climate, cyber, ESG).
   - 3LoD RBAC with CRO independence and no dual-hatting.
   - Front/back-office segregation.
   - Limit framework tied to RAS.
   - Audit evidence and 10-day breach notification.

10. **Create `10-regulatory-reporting-orass.md`**
    - BoG template catalogue (LMTD, LRMD, IRRBB, Recovery).
    - Template population engine.
    - ORASS secure API client.
    - Submission scheduler (monthly 9 days, quarterly, annual).
    - Public disclosure generator.

### Phase 4 — Cross-Cutting Updates & Consistency (Week 6)

11. **Update `04-capital-management.md`**
    - Link ICAAP to ILAAP and recovery planning.
    - Add Ghana capital adequacy context.

12. **Update `06-ftp.md`**
    - Use Ghana Reference Rate and BoG liquidity classifications.

13. **Update `07-balance-sheet-optimization.md`**
    - Add board risk pack generation.
    - Add recovery-indicator overlay.
    - Add public disclosure and ORASS hand-off.

14. **Consistency review**
    - Ensure all PRDs use the same Ghana data entities (GoG T-bills/bonds, GSE equities, Ghana Reference Rate, operational nostro balances, BoG balances).
    - Ensure API naming and data-model entities are cross-referenced.
    - Ensure every acceptance criterion is testable.

---

## 4. Content Template for Each New/Updated PRD

Each PRD must contain the following sections, aligned with the existing format:

1. **Overview**
   - Purpose (1 paragraph)
   - Users & Roles table
   - Dependencies (upstream/downstream PRDs and external systems)
2. **Features**
   - One subsection per feature
   - Description, User Stories, Acceptance Criteria (checkbox format), Screen Layout, Data Inputs, Calculation Logic, Validation Rules, Error Handling, Audit & Compliance
3. **Data Model**
   - Entities table
   - Key attributes
   - Relationships
4. **API Specification**
   - Endpoints table (Method, Path, Auth, Description)
   - Request/response examples for key flows
5. **Non-Functional Requirements**
   - Performance
   - Security (with reference to `12-cyber-security-data-residency.md`)
   - Availability / RTO / RPO
6. **Reporting & Exports**
   - Report table (Name, Frequency, Format, Recipient)
7. **Appendix**
   - Regulatory references
   - Configuration keys / threshold tables

---

## 5. Definition of Done

- [ ] All 8 existing PRDs are updated with Ghana/BoG-specific requirements.
- [ ] All 6 new PRDs are created and reviewed for consistency.
- [ ] Every BoG requirement in `BoG_2026_Solution_Architecture.txt` is traceable to at least one PRD section.
- [ ] A coverage traceability matrix is appended to this plan or maintained in `findings.md`.
- [ ] All PRDs follow the same content template and terminology.
- [ ] The `prototype/` screens and `docs/visuals/` are flagged for update where new modules require new UI.
- [ ] A follow-up task is created to align `docs/architecture/system-overview.md` and `README.md` with the new PRD set.

---

## 6. Suggested File List After Completion

```text
docs/prd/
├── 00-platform-overview.md              (updated)
├── 01-data-foundation.md                (updated)
├── 02-liquidity-risk.md                 (updated)
├── 03-interest-rate-risk.md             (updated)
├── 04-capital-management.md             (updated)
├── 05-ecl.md                            (lightly updated)
├── 06-ftp.md                            (updated)
├── 07-balance-sheet-optimization.md     (updated)
├── 08-recovery-planning.md              (new)
├── 09-grc-risk-framework.md             (new)
├── 10-regulatory-reporting-orass.md     (new)
├── 11-behavioural-model-library.md      (new)
├── 12-cyber-security-data-residency.md  (new)
└── 13-rtgs-intraday-liquidity.md        (new)
```

---

## 7. Next Immediate Actions

1. **Approve this plan** — confirm the module split and prioritisation.
2. **Create `12-cyber-security-data-residency.md` first** because it constrains hosting and integration choices for all other PRDs.
3. **Create/update data-foundation PRD** next because every downstream module depends on the normalised data layer.
4. **Maintain a live traceability matrix** in `findings.md` as each PRD is completed, marking requirements as covered.

---

*End of update plan.*
