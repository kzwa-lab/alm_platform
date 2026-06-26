# ALM Platform PRD vs. Bank of Ghana 2026 Solution Architecture — Gap Analysis

**Date:** 2026-06-25  
**Source requirements:** `BoG_2026_Solution_Architecture.txt`  
**PRD set reviewed:** `docs/prd/00-platform-overview.md` through `docs/prd/13-rtgs-intraday-liquidity.md` (all 14 PRDs)

---

## 1. Executive Summary

The existing PRDs describe a capable, generic European-style ALM platform (LCR/NSFR, IRRBB, IFRS 9 ECL, RWA, FTP, balance-sheet optimization). However, they are **not yet aligned with the Ghana-specific BoG 2026 Prudential Reform Package**.

- Rough alignment: **~45–55%** of the BoG technical architecture is reflected, mostly in broad ALM concepts (LCR/NSFR, EVE/NII, stress testing, RBAC, audit trails).
- The biggest gaps are: **(a) Ghana-specific liquidity monitoring tools (LMTD)**, **(b) recovery planning module**, **(c) BoG regulatory reporting / ORASS integration**, **(d) governance & three-lines-of-defence framework**, and **(e) CISD 2026 data-residency / cyber-security requirements**.
- Existing PRDs also assume EU regulatory terminology (EBA, COREP/FINREP, ECB) rather than Ghanaian terminology (BoG, ORASS, LMTD, LRMD, GoG bills/bonds, GSE equities, Ghana Reference Rate).

The platform described in the PRDs could **evolve** to meet the BoG requirements, but this requires both **new PRDs** for missing modules and **significant updates** to existing PRDs to localize the data model, calculations, reporting, and governance model.

**Update (2026-06-25):** All 14 PRDs have now been created/updated to align with BoG 2026 requirements. See Section 7 for completion status.

---

## 1. Executive Summary

The existing PRDs describe a capable, generic European-style ALM platform (LCR/NSFR, IRRBB, IFRS 9 ECL, RWA, FTP, balance-sheet optimization). However, they are **not yet aligned with the Ghana-specific BoG 2026 Prudential Reform Package**.

- Rough alignment: **~45–55%** of the BoG technical architecture is reflected, mostly in broad ALM concepts (LCR/NSFR, EVE/NII, stress testing, RBAC, audit trails).
- The biggest gaps are: **(a) Ghana-specific liquidity monitoring tools (LMTD)**, **(b) recovery planning module**, **(c) BoG regulatory reporting / ORASS integration**, **(d) governance & three-lines-of-defence framework**, and **(e) CISD 2026 data-residency / cyber-security requirements**.
- Existing PRDs also assume EU regulatory terminology (EBA, COREP/FINREP, ECB) rather than Ghanaian terminology (BoG, ORASS, LMTD, LRMD, GoG bills/bonds, GSE equities, Ghana Reference Rate).

The platform described in the PRDs could **evolve** to meet the BoG requirements, but this requires both **new PRDs** for missing modules and **significant updates** to existing PRDs to localize the data model, calculations, reporting, and governance model.

---

## 2. Comparison Methodology

1. Decomposed the BoG architecture into requirement areas:
   - Context & design principles (CISD, data residency, configuration-over-code)
   - Normalised data layer (classification, encumbrance, bucketing, rate store)
   - Computation modules (Liquidity/ALM, IRRBB, behavioural models, recovery & stress)
   - Governance & control (RMD 2021, 3LoD, CRO independence, limits, audit)
   - Reporting & supervisory (BoG templates, ORASS, cadences)
   - Integration (CBS, treasury, RTGS, market data, GL)
   - Security & data residency
2. Mapped each requirement area to the most relevant existing PRD(s).
3. Assessed coverage as **Covered**, **Partial**, or **Missing** and recorded concrete gaps.

---

## 3. Coverage Matrix

| BoG Requirement Area | Relevant PRD(s) | Coverage | Key Gaps |
|----------------------|-----------------|----------|----------|
| **Platform context & Ghana scope** | `00-platform-overview.md` | Partial | No mention of BoG 2026 package, CISD 2026, in-country hosting, ORASS, or phased delivery to Jan 2027. |
| **Normalised data layer — Ghana asset classification** | `01-data-foundation.md` | Partial | Generic product/CoA mapping; missing Narrow/Broad Liquid Asset definitions, GoG T-bills/bonds, GSE equities cap, claims on domestic banks. |
| **Encumbrance register** | `01-data-foundation.md` | Missing | No ledger-reconciled encumbrance register driving Available Unencumbered Assets. |
| **Cash-flow bucketing (13 LMTD + 19 IRRBB bands)** | `01`, `02`, `03` | Partial | Data Foundation lacks dual bucket structures. Liquidity gap uses custom buckets; IRRBB repricing uses 12 buckets, not the prescribed 19. |
| **Rate/curve store (Ghana Reference Rate, shock table)** | `01`, `03`, `06` | Partial | Curves are generic OIS/EURIBOR/swap; no Ghana Reference Rate or versioned BoG shock-factor table. |
| **Liquidity & ALM — LMTD four ratios** | `02-liquidity-risk.md` | Missing | No Narrow/Broad liquid-asset ratios, no bank-vs-SDI thresholds, no 8 ratio variants. |
| **Contractual maturity mismatch (13 bands)** | `02-liquidity-risk.md` | Missing | Liquidity gap exists but does not use the 13 LMTD bands or cumulative net mismatch per significant currency. |
| **Funding concentration / connected counterparties** | `02-liquidity-risk.md` | Missing | No connected-counterparty control/economic-interdependence tests or concentration metrics. |
| **Multi-currency LCR by significant currency** | `02-liquidity-risk.md` | Missing | Only a single-currency LCR/NSFR view; no per-significant-currency LCR or board-set currency limits. |
| **Intraday liquidity / RTGS throughput** | `02-liquidity-risk.md` | Missing | No RTGS/settlement feed, no intraday throughput ratios, no system-capability demonstration features. |
| **LRMD governance (LAS, ILAAP, framework approval)** | `01`, `02` | Partial | CFP/stress testing exist, but no quarterly Liquidity Adequacy Statement, ILAAP integration, or e-money float treatment. |
| **IRRBB standardised framework (19 buckets, categorisation)** | `03-interest-rate-risk.md` | Partial | EVE/NII/gap exist, but no 19 standardised buckets, no amenable/less-amenable/not-amenable slotting. |
| **IRRBB basis risk & yield-curve risk** | `03-interest-rate-risk.md` | Missing | Repricing gap exists but no explicit basis-risk assessment or yield-curve risk modeling. |
| **Supervisory Outlier Test (SOT)** | `03-interest-rate-risk.md` | Partial | EVE vs Tier 1 is mentioned informally; not formalised as the SOT with board/ALCO escalation workflow. |
| **Behavioural model library (NMD caps, CPR, TDRR)** | `03`, `05`, `06` | Partial | NMD/CPR assumptions scattered; no shared library with regulatory caps on core deposits or Term Deposit Redemption Rate (TDRR). |
| **Recovery planning module** | `07-balance-sheet-optimization.md` (closest) | Missing | No recovery plan repository, recovery indicators/triggers, options menu, or real-time recovery MIS. |
| **Governance & RMD 2021 (RMF, 3LoD, CRO independence)** | `00`, `01` | Partial | RBAC/SoD exist but no digitised Risk Management Framework, Risk Universe Register, or CRO non-dual-hat controls. |
| **Front/back office segregation** | `00-platform-overview.md` | Missing | Not explicitly enforced in RBAC design. |
| **Limit framework (liquidity/IRRBB/counterparty)** | `00`, `02`, `03` | Partial | Generic risk limits exist; not mapped to BoG-specific liquidity/IRRBB limits or board-approved RAS. |
| **Climate / ESG / cyber risk register** | — | Missing | No Risk Universe coverage of climate-related financial risk, cyber, reputation, conduct. |
| **BoG regulatory reporting / ORASS** | Several report sections | Missing | No BoG-prescribed Excel/XML/XBRL templates, no ORASS API endpoint, no monthly 9-day submission scheduler. |
| **Public IRRBB disclosures** | `03` | Missing | Only internal reports are specified. |
| **CISD 2026 / data residency** | `00` NFRs | Missing | GDPR focus; no Ghana data residency, ISO 27001/NIST alignment, quarterly pen testing, board cyber reporting. |
| **RTGS / settlement real-time integration** | `01-data-foundation.md` | Missing | Ingestion pipelines do not include RTGS/settlement feed. |
| **Configuration-over-code rules repository** | `00`, `01`, `03` | Partial | Config versioning exists, but not framed as a central rules repository for all thresholds/buckets/shocks/templates. |

---

## 4. Detailed Gap Analysis by BoG Directive

### 4.1 Directive 1 — Liquidity Monitoring Tools Directive (LMTD)

**What the BoG architecture requires:**

1. **Four prudential liquidity ratios** on **Narrow** and **Broad** liquid-asset bases (8 variants), with distinct **commercial bank** and **SDI** thresholds:
   - Liquid Assets / Volatile Liabilities
   - Liquid Assets / Short-Term Liabilities
   - Liquid Assets / Total Assets
   - Liquid Assets / Total Deposits
2. **Contractual maturity mismatch** mapped to 13 prescribed time bands, showing cumulative net mismatch, with board-set limits per significant currency.
3. **Funding concentration** by counterparty, product, and currency, including connected-counterparty grouping.
4. **Available unencumbered assets** tool driven by a real-time encumbrance register.
5. **LCR by significant currency** (foreign-currency LCR isolation).
6. **Market-related monitoring tools** (equity, interbank spreads, sovereign yields).
7. Monthly submission of prescribed Excel templates within 9 days after month-end, plus ad-hoc more frequent reporting.

**Current PRD coverage:**

- `02-liquidity-risk.md` provides Basel-style LCR/NSFR, generic liquidity gap, bank-run stress, CFP triggers, and stress testing.
- It does **not** include the BoG four-ratio suite, Narrow/Broad definitions, SDI thresholds, 13-band maturity mismatch, connected-counterparty concentration, significant-currency LCR, available unencumbered assets, or BoG templates.

**Gap severity:** **High**. The LMTD ratios and templates are the core deliverable of Directive 1.

---

### 4.2 Directive 2 — Liquidity Risk Management Directive (LRMD)

**What the BoG architecture requires:**

1. **Board-level governance:** annual framework approval, risk appetite/tolerance statement, resource/expertise allocation, quarterly Liquidity Adequacy Statements (LAS), ILAAP integrated with ICAAP.
2. **Stress testing:** idiosyncratic, market-wide, and combined scenarios; annual haircut reassessment; public disclosure of methodologies by 31 March.
3. **Contingency Funding Plan (CFP):** board-approved, linked to stress-test outcomes, with triggers, backstop funding, communications, remedial actions.
4. **Intraday liquidity monitoring:** Basel intraday liquidity monitoring tools, RTGS throughput, real-time aggregation, system-capability demonstration to BoG, no manual intervention.
5. **Specific treatments:** e-money float accounts, prohibition on misclassifying retail deposits as interbank borrowings.

**Current PRD coverage:**

- `02-liquidity-risk.md` has CFP dashboard and stress engine with standard scenarios.
- It lacks LRMD-specific governance (LAS, ILAAP), intraday/RTGS monitoring, system-capability demonstration, e-money float rules, and the annual disclosure requirement.

**Gap severity:** **High**. Intraday liquidity and ILAAP are explicitly called out as regulator-demonstration capabilities.

---

### 4.3 Directive 3 — IRRBB Guidelines

**What the BoG architecture requires:**

1. **Standardised Framework (SF):** 19 defined maturity buckets for cash-flow slotting.
2. **Categorisation:** amenable / less amenable / not amenable to standardisation.
3. **Dual metrics:** ΔEVE and ΔNII across prescribed shock scenarios.
4. **Risk decomposition:** repricing gap, basis risk, yield-curve risk.
5. **Supervisory Outlier Test (SOT):** formal alert when ΔEVE decline exceeds 15% of Tier 1 capital.
6. **Quarterly reporting** to BoG for all major currencies >5% of banking-book assets/liabilities.
7. Board-approved IRRBB framework.

**Current PRD coverage:**

- `03-interest-rate-risk.md` includes EVE sensitivity, NII forecasting, repricing gap, derivative hedging, and DGAP.
- It uses **12 repricing buckets**, not the prescribed **19**.
- It lacks explicit standardisation categorisation, basis-risk assessment, yield-curve risk modeling, formal SOT workflow, and BoG quarterly submission.

**Gap severity:** **High**. The 19-bucket SF and SOT are central to BoG IRRBB compliance.

---

### 4.4 Directive 4 — Recovery Planning Directive (RPD)

**What the BoG architecture requires:**

1. **Recovery plan repository:** version-controlled plan, scenario library, catalogue of credible recovery options.
2. **Recovery options menu:** capital conservation, liability restructuring, strategic divestments, balance-sheet de-risking.
3. **Quantitative indicators & triggers:** capital, liquidity, earnings, asset-quality metrics calibrated to risk appetite; early-warning and recovery triggers.
4. **Real-time MIS:** continuous automated tracking of recovery indicators.
5. **Governance:** triggers prompt convening of senior management/Board, not automatic actions; annual self-assessment of MIS; submission by 31 December.

**Current PRD coverage:**

- **No dedicated recovery module exists.** `07-balance-sheet-optimization.md` has scenario simulation and ALCO pack generation, but no recovery plan repository, recovery indicators, options menu, or trigger MIS.

**Gap severity:** **Critical**. This entire directive is unaddressed.

---

### 4.5 Directive 5 — Foundational Risk Management Directive (RMD 2021)

**What the BoG architecture requires:**

1. **Digitised Risk Management Framework (RMF):** policies, committee approval workflows, board declarations.
2. **Risk Universe Register:** credit, market, operational, compliance, reputation, cyber, ESG, climate (incl. Climate-Related Financial Risk Directive Jan 2026).
3. **Three Lines of Defence model** enforced in RBAC:
   - CRO independent from business/finance; no dual-hatting as CFO/COO/Internal Audit.
   - CRO reports directly to CEO and has direct Board/Board Risk Committee line.
4. **Front/back office segregation:** logical/system access separation between deal initiation and settlement.
5. **Immutable audit trails** for all transactions, parameter changes, limit overrides.
6. **Limit monitoring:** Board-approved Risk Appetite Statement (RAS) translated into granular limits; automated alerts and hard blocks; rapid exposure aggregation.
7. **Real-time position reporting** for FX net open positions, counterparty concentrations, sovereign bond duration.
8. **Annual independent audit** and Board Risk Management Declaration.
9. **10-day notification** to BoG for significant breaches/material RMF deviations.

**Current PRD coverage:**

- `00-platform-overview.md` and `01-data-foundation.md` provide RBAC, audit trails, ALCO workflow, and generic risk limits.
- They do **not** model the 3LoD, CRO independence, front/back-office segregation, Risk Universe Register, climate/cyber risk categories, real-time position reporting, or the BoG 10-day breach notification workflow.

**Gap severity:** **High**. RMD is the foundational governance layer; many controls are absent or implicit.

---

### 4.6 Cross-Cutting: Reporting, ORASS, Security, Integration

| Requirement | Status | Notes |
|-------------|--------|-------|
| **BoG-prescribed return templates** (LMTD, IRRBB, LRMD, Recovery) | Missing | PRDs reference EBA/COREP/FINREP/XBRL, not BoG Excel/XML templates. |
| **ORASS integration endpoint** | Missing | No secure API client to push returns to the regulator. |
| **Submission scheduler** (monthly 9 days, quarterly IRRBB, annual ILAAP/recovery) | Missing | `07` has a generic regulatory tracker but not BoG cadences/templates. |
| **Public IRRBB disclosures** | Missing | Only internal ALCO/regulatory packs are described. |
| **CISD 2026 / data residency** | Missing | PRDs focus on GDPR; no Ghana in-country hosting mandate. |
| **ISO 27001 / NIST control framework** | Missing | Security section lists TLS/encryption/pen-test but not aligned to ISO 27001/NIST or quarterly pen testing. |
| **Board-level cyber reporting** | Missing | Not mentioned. |
| **RTGS/settlement real-time feed** | Missing | `01` lists SFTP/API/SQL/Excel/SWIFT but not RTGS. |
| **Configuration-over-code rules repository** | Partial | Config versioning exists, but not a unified rules repository for thresholds/buckets/shocks/templates. |

**Gap severity:** **High** for reporting/ORASS and security/residency; these are explicit compliance gates.

---

## 5. Summary of Major Gaps (RESOLVED — See Section 7)

**All major gaps identified in this analysis have been addressed through the creation of 14 PRDs aligned with BoG 2026 requirements.**

The following items were originally identified as gaps and have now been resolved:

1. **Ghana-specific liquidity monitoring tools (LMTD)** — ✅ Addressed in `02-liquidity-risk.md` (BoG four-ratio engine, 13-band maturity mismatch, funding concentration, significant-currency LCR, ILAAP/LAS hooks, e-money float)
2. **Intraday liquidity monitoring** — ✅ Addressed in `13-rtgs-intraday-liquidity.md` (RTGS feed, throughput ratios, system-capability demonstration)
3. **IRRBB standardised framework** — ✅ Addressed in `03-interest-rate-risk.md` (19 buckets, standardisation categorisation, basis risk, yield-curve risk, formal SOT)
4. **Recovery Planning module** — ✅ Addressed in `08-recovery-planning.md` (recovery plan repository, options menu, quantitative triggers, real-time MIS dashboard)
5. **BoG regulatory reporting layer** — ✅ Addressed in `10-regulatory-reporting-orass.md` (BoG templates, ORASS API client, submission scheduler, public disclosures)
6. **RMD 2021 governance controls** — ✅ Addressed in `09-grc-risk-framework.md` (3LoD RBAC, CRO independence, front/back-office segregation, Risk Universe Register, climate/cyber risk)
7. **CISD 2026 cyber/data-residency** — ✅ Addressed in `12-cyber-security-data-residency.md` (Ghana data residency, ISO 27001/NIST, quarterly pen testing, board cyber reporting)
8. **Local Ghana data elements** — ✅ Addressed across all PRDs (Ghana Reference Rate, GoG bills/bonds, GSE equities, operational nostro/BoG balances)
9. **Behavioural model library** — ✅ Addressed in `11-behavioural-model-library.md` (NMD core deposit modeler with BoG caps, CPR modeler, TDRR modeler, assumption set manager)
10. **Configuration-over-code rules repository** — ✅ Addressed in `01-data-foundation.md` (central rules repository for thresholds, buckets, shocks, templates)

---

## 6. Recommendations (COMPLETED)

All recommendations have been implemented:

1. ✅ **Created new PRDs** for missing modules (08, 09, 10, 11, 12, 13)
2. ✅ **Localised existing PRDs** with Ghana-specific data elements, thresholds, and regulators (00-07)
3. ✅ **Treated reporting as a first-class module** with dedicated PRD `10-regulatory-reporting-orass.md`
4. ✅ **Made governance explicit** in dedicated PRD `09-grc-risk-framework.md`
5. ✅ **Addressed cyber/data residency early** in PRD `12-cyber-security-data-residency.md`
6. ✅ **Prioritised LMTD/LRMD liquidity and recovery planning** in PRDs `02-liquidity-risk.md`, `13-rtgs-intraday-liquidity.md`, and `08-recovery-planning.md`

---

## 7. PRD Completion Status

### 7.1 Updated Existing PRDs (8 PRDs)

| PRD | Status | Key BoG Additions |
|-----|--------|-------------------|
| `00-platform-overview.md` | ✅ Updated | BoG 2026 context, module-to-directive mapping, CISD 2026, phased delivery to Jan 2027 |
| `01-data-foundation.md` | ✅ Updated | Ghana Narrow/Broad classification, encumbrance register, 13 LMTD + 19 IRRBB buckets, Ghana Reference Rate, RTGS connector, rules repository |
| `02-liquidity-risk.md` | ✅ Updated | BoG four prudential ratios, 13-band maturity mismatch, funding concentration, significant-currency LCR, ILAAP/LAS hooks, e-money float |
| `03-interest-rate-risk.md` | ✅ Updated | 19-bucket standardised framework, standardisation categorisation, basis risk, yield-curve risk, formal SOT, Ghana Reference Rate |
| `04-capital-management.md` | ✅ Updated | BoG Capital Adequacy Framework, Ghana-specific risk weights, Pillar 2 add-ons (IRRBB, concentration, liquidity), D-SIB surcharge, capital instrument tracker |
| `05-ecl.md` | ✅ Updated | Ghana macroeconomic scenarios (GDP, inflation, BoG rate, GHS/USD, cocoa/gold/oil), sectoral PD adjustments, Ghana-specific SICR triggers |
| `06-ftp.md` | ✅ Updated | Ghana Reference Rate-based FTP curves, GoG T-Bill curve, BoG policy rate, interbank rate, multi-currency support, Ghana-specific regulatory costs |
| `07-balance-sheet-optimization.md` | ✅ Updated | Recovery trigger integration, Ghana macroeconomic variables, NIM attribution with GRR impact, BoG regulatory submission tracker |

### 7.2 New PRDs Created (6 PRDs)

| PRD | Status | Purpose |
|-----|--------|---------|
| `08-recovery-planning.md` | ✅ Created | Recovery plan repository, options menu, quantitative triggers, real-time MIS dashboard, annual self-assessment, BoG submission |
| `09-grc-risk-framework.md` | ✅ Created | Digitised RMF, Risk Universe Register, 3LoD RBAC, CRO independence, front/back-office segregation, limit framework, 10-day breach notification |
| `10-regulatory-reporting-orass.md` | ✅ Created | BoG template catalogue, template population engine, ORASS API client, submission scheduler, public disclosure generator |
| `11-behavioural-model-library.md` | ✅ Created | NMD core deposit modeler (BoG caps), CPR modeler, TDRR modeler, assumption set manager, backtesting |
| `12-cyber-security-data-residency.md` | ✅ Created | CISD 2026 alignment, Ghana data residency, ISO 27001/NIST, quarterly pen testing, board cyber reporting |
| `13-rtgs-intraday-liquidity.md` | ✅ Created | RTGS real-time feed, intraday liquidity monitoring, throughput ratios, system-capability demonstration, fallback/resilience |

### 7.3 Final PRD Set

```text
docs/prd/
├── 00-platform-overview.md              (updated)
├── 01-data-foundation.md                (updated)
├── 02-liquidity-risk.md                 (updated)
├── 03-interest-rate-risk.md             (updated)
├── 04-capital-management.md             (updated)
├── 05-ecl.md                            (updated)
├── 06-ftp.md                            (updated)
├── 07-balance-sheet-optimization.md       (updated)
├── 08-recovery-planning.md              (new)
├── 09-grc-risk-framework.md             (new)
├── 10-regulatory-reporting-orass.md     (new)
├── 11-behavioural-model-library.md      (new)
├── 12-cyber-security-data-residency.md  (new)
└── 13-rtgs-intraday-liquidity.md        (new)
```

**Total: 14 PRDs covering all BoG 2026 Solution Architecture requirements.**

---

*End of findings — All gaps resolved. See updatePlan.md for implementation details.*
3. **Treat reporting as a first-class module** with its own PRD (BoG templates + ORASS endpoint), not as an afterthought in each module.
4. **Make governance explicit** in a dedicated GRC/RMD PRD, including 3LoD RBAC, CRO independence, and front/back-office segregation.
5. **Address cyber/data residency early** because it drives hosting and integration decisions.
6. **Prioritise LMTD/LRMD liquidity and recovery planning** for Phase 1 delivery, as these are the largest functional gaps with hard January 2027 deadlines.

---

*End of findings.*
