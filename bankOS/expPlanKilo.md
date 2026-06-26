# BankOS Expansion Plan

## Overview
Expand each module page to include tabbed views with detailed feature descriptions, data tables, graphs, and workflow diagrams.

## Modules & Features Structure

### Liquidity Risk Module (7 features → 7 tabs)
| Tab | Feature | Tables | Graphs | Workflow |
|-----|---------|--------|--------|----------|
| 1 | Real-Time LCR Calculator | LCR Components, Cash Outflows | LCR Waterfall, Trend Chart | LCR Calculation Flow |
| 2 | NSFR Monitor | ASF/RSF Components, Projection | ASF vs RSF Bar Chart, 12-month Trend | NSFR Forward Projection |
| 3 | Liquidity Stress Testing | Scenario Parameters, Results Comparison | Liquidity Gap Under Stress, Survival Horizon | Stress Test Execution |
| 4 | CFP Trigger Dashboard | EWI Dashboard | EWI Trend Analysis | CFP Escalation Matrix |
| 5 | Liquidity Gap Report | Behavioral/Contractual View | Gap Analysis Chart, Cumulative Gap | Gap Calculation Flow |
| 6 | Bank-Run Stress Calculator | Stress Assumptions | Remaining Assets/Deposits Chart | Bank-Run Simulation |
| 7 | Significant Currency LCR | Per-Currency LCR | Currency Concentration | FX Liquidity Flow |

### Capital Management Module (7 features → 7 tabs)
| Tab | Feature | Tables | Graphs | Workflow |
|-----|---------|--------|--------|----------|
| 1 | CET1 Capital Calculation | Capital Components, Tier Breakdown | Capital Stack Bar, Trend Line | Capital Calculation Flow |
| 2 | RWA Composition | Credit Risk RWA, Market Risk RWA | RWA by Risk Type, Capital Ratio | RWA Aggregation Flow |
| 3 | Leverage Ratio | Tier 1 Exposure, Adjustments | Leverage Ratio Trend, Comparison | Leverage Ratio Flow |
| 4 | Output Floor Impact | Floor Calculation, Add-ons | Floor Binding Analysis | Output Floor Workflow |
| 5 | Capital Conservation Buffer | Buffer Utilization, Requirements | Buffer Status, Usage Trend | Buffer Monitoring |
| 6 | ICAAP Integration | Scenario Stress, Capital Plans | Capital Adequacy, Stress Impact | ICAAP Process |
| 7 | Regulatory Reporting | Template Mapping, Submission Status | Submission Timeline | Reporting Workflow |

### IRRBB Module (6 features → 6 tabs)
| Tab | Feature | Tables | Graphs | Workflow |
|-----|---------|--------|--------|----------|
| 1 | EVE Sensitivity Analysis | Shock Results, Bucket Impact | EVE Waterfall, Shock Comparison | EVE Calculation |
| 2 | NII Forecast | NII by Bucket, Cumulative NII | NII Projection, Rate Sensitivity | NII Forecast Workflow |
| 3 | Repricing Gap Analysis | Gap by Bucket, Cumulative Gap | Gap Duration Profile, NII Gap Scatter | Gap Analysis Flow |
| 4 | Yield Curve Management | Curve Points, Shocks | Yield Curve, Curve Shifts | Curve Construction |
| 5 | Basis Risk Monitoring | Basis Gap, Valuation Impact | Basis Exposure, Risk Concentration | Basis Risk Identification |
| 6 | SOT Monitoring | Outlier Test Results | Outlier Trend, Trigger Points | SOT Assessment |

### ECL Module (6 features → 6 tabs)
| Tab | Feature | Tables | Graphs | Workflow |
|-----|---------|--------|--------|----------|
| 1 | Stage 1/2/3 Provisions | By Portfolio, Trend | Stage Distribution, Provision Trend | Staging Workflow |
| 2 | SICR Triggers | SICR Events, Indicators | SICR Rate, Trigger Analysis | SICR Identification |
| 3 | Macro Scenarios | Scenario Impact by Bucket | Macro Sensitivity, Stress Results | Scenario Application |
| 4 | PD/LGD/EAD Parameters | Parameter Values, Changes | Parameter Trends, Sensitivity | Parameter Management |
| 5 | Post-Model Adjustments | Adjustment History, justifications | Adjustment Impact | PMA Workflow |
| 6 | IFRS 9 Compliance | Disclosure Checklist, Status | Compliance Trend | Regulatory Workflow |

### FTP Module (6 features → 6 tabs)
| Tab | Feature | Tables | Graphs | Workflow |
|-----|---------|--------|--------|----------|
| 1 | GRR Curve Construction | Curve Points, Tenors | Yield Curve, Spread Analysis | Curve Building |
| 2 | NMD Behavioral Models | Core/Volatile Split, Betas | NMD Decay, Behavior Charts | Behavioral Modeling |
| 3 | Deal Profitability | Deal P&L, Attribution | Profitability Distribution, Trends | Deal Pricing Flow |
| 4 | LTP Attribution | Funding Cost, Liquidity Charge | LTP by Desk, Cost Allocation | LTP Attribution |
| 5 | Transfer Pricing Curves | FTP by Tenor, Product | FTP Distribution, Curves | FTP Setting |
| 6 | Pricing Recommendations | Recommendations, Impact | Pricing Impact, Optimization | Pricing Recommendations |

### Optimization Module (6 features → 6 tabs)
| Tab | Feature | Tables | Graphs | Workflow |
|-----|---------|--------|--------|----------|
| 1 | NIM Decomposition | NIM by Driver, Variance | NIM Waterfall, Variance Analysis | NIM Calculation |
| 2 | What-If Scenarios | Scenario Inputs, Outputs | Scenario Comparison, Impact Charts | Scenario Analysis |
| 3 | Stress Testing | Stress Parameters, Results | Stress Impact, VaR Charts | Stress Testing Flow |
| 4 | Balance Sheet Planning | Plan Assumptions, Targets | Balance Sheet Evolution, Projections | Planning Workflow |
| 5 | Hedge Effectiveness | Hedge Ratios, Effectiveness | Hedge P&L, Effectiveness Charts | Hedge Evaluation |
| 6 | ALCO Pack Generation | Pack Contents, Status | ALCO Metrics Dashboard | ALCO Pack Workflow |

## Implementation Order

1. **Phase 1 (Core UI)**
   - Create tab component in index.html
   - Add tab navigation logic to app.js
   - Style tabs with shadcn-inspired design

2. **Phase 2 (Liquidity Module)** - Deep expand first module
   - Convert existing 2 tables to 2 tabs
   - Add workflow diagrams as ASCII art
   - Add chart placeholders (SVG-based)

3. **Phase 3 (Remaining Modules)**
   - Apply same pattern to Capital, IRRBB, ECL, FTP, Optimization

4. **Phase 4 (Data Relations)**
   - Add relationship diagrams showing module interconnections
   - Cross-module data flow visualization

## File Structure Changes
```
bankOS/
├── index.html (update with tabs)
├── app.js (add tab routing)
├── pages/
│   ├── liquidity.js (expand to tabbed, add graphs/workflows)
│   ├── capital.js (expand)
│   ├── irrbb.js (expand)
│   ├── ecl.js (expand)
│   ├── ftp.js (expand)
│   └── optimization.js (expand)
├── components/
│   └── tabs.js (new - tab component)
└── assets/
    └── diagrams/ (new - workflow SVG files)
```

## Estimated Effort
- Phase 1: 1 hour
- Phase 2: 2-3 hours
- Phase 3: 4-5 hours
- Phase 4: 1-2 hours
- Total: 8-11 hours