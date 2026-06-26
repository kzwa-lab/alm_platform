export declare const MODULES: readonly [{
    readonly id: "dashboard";
    readonly label: "Dashboard";
    readonly icon: "layout-dashboard";
    readonly route: "dashboard";
    readonly color: "#3B82F6";
    readonly roles: readonly ["alco_member", "treasurer", "risk_manager", "compliance_officer", "cro", "ceo", "cfo", "board_member"];
}, {
    readonly id: "liquidity";
    readonly label: "Liquidity Risk";
    readonly icon: "droplets";
    readonly color: "#06B6D4";
    readonly route: "liquidity";
    readonly children: readonly [{
        readonly id: "liquidity-lcr";
        readonly label: "LCR Calculator";
        readonly route: "liquidity/lcr";
        readonly roles: readonly ["treasurer", "liquidity_risk_manager", "risk_manager", "compliance_officer", "cro"];
    }, {
        readonly id: "liquidity-bog";
        readonly label: "BoG Ratios";
        readonly route: "liquidity/bog";
        readonly roles: readonly ["treasurer", "liquidity_risk_manager", "compliance_officer", "cro"];
    }, {
        readonly id: "liquidity-gap";
        readonly label: "Maturity Gap";
        readonly route: "liquidity/gap";
        readonly roles: readonly ["treasurer", "liquidity_risk_manager", "risk_manager"];
    }, {
        readonly id: "liquidity-stress";
        readonly label: "Stress Testing";
        readonly route: "liquidity/stress";
        readonly roles: readonly ["treasurer", "liquidity_risk_manager", "risk_manager", "cro"];
    }, {
        readonly id: "liquidity-cfp";
        readonly label: "Contingency Plan";
        readonly route: "liquidity/cfp";
        readonly roles: readonly ["treasurer", "liquidity_risk_manager", "cro", "ceo"];
    }];
    readonly roles: readonly ["treasurer", "liquidity_risk_manager", "risk_manager", "compliance_officer", "cro", "ceo", "cfo"];
}, {
    readonly id: "interest-rate";
    readonly label: "Interest Rate Risk";
    readonly icon: "trending-up";
    readonly color: "#8B5CF6";
    readonly route: "interest-rate";
    readonly children: readonly [{
        readonly id: "irrbb-eve";
        readonly label: "EVE Sensitivity";
        readonly route: "interest-rate/eve";
        readonly roles: readonly ["treasurer", "irrbb_risk_manager", "risk_manager", "cro"];
    }, {
        readonly id: "irrbb-nii";
        readonly label: "NII Forecast";
        readonly route: "interest-rate/nii";
        readonly roles: readonly ["treasurer", "irrbb_risk_manager", "risk_manager"];
    }, {
        readonly id: "irrbb-buckets";
        readonly label: "19-Bucket View";
        readonly route: "interest-rate/buckets";
        readonly roles: readonly ["treasurer", "irrbb_risk_manager", "compliance_officer"];
    }, {
        readonly id: "irrbb-sot";
        readonly label: "SOT Status";
        readonly route: "interest-rate/sot";
        readonly roles: readonly ["treasurer", "irrbb_risk_manager", "compliance_officer", "cro"];
    }, {
        readonly id: "irrbb-hedging";
        readonly label: "Hedge Tracker";
        readonly route: "interest-rate/hedging";
        readonly roles: readonly ["treasurer", "irrbb_risk_manager"];
    }];
    readonly roles: readonly ["treasurer", "irrbb_risk_manager", "risk_manager", "compliance_officer", "cro", "ceo", "cfo"];
}, {
    readonly id: "capital";
    readonly label: "Capital Management";
    readonly icon: "shield";
    readonly color: "#10B981";
    readonly route: "capital";
    readonly children: readonly [{
        readonly id: "capital-ratios";
        readonly label: "Capital Ratios";
        readonly route: "capital/ratios";
        readonly roles: readonly ["capital_manager", "risk_manager", "compliance_officer", "cro", "cfo"];
    }, {
        readonly id: "capital-rwa";
        readonly label: "RWA Engine";
        readonly route: "capital/rwa";
        readonly roles: readonly ["capital_manager", "risk_manager", "compliance_officer"];
    }, {
        readonly id: "capital-icaap";
        readonly label: "ICAAP";
        readonly route: "capital/icaap";
        readonly roles: readonly ["capital_manager", "risk_manager", "cro", "board_member"];
    }, {
        readonly id: "capital-planning";
        readonly label: "Capital Planning";
        readonly route: "capital/planning";
        readonly roles: readonly ["capital_manager", "cfo", "cro", "board_member"];
    }];
    readonly roles: readonly ["capital_manager", "risk_manager", "compliance_officer", "cro", "cfo", "ceo", "board_member"];
}, {
    readonly id: "ecl";
    readonly label: "Expected Credit Loss";
    readonly icon: "alert-circle";
    readonly color: "#F59E0B";
    readonly route: "ecl";
    readonly children: readonly [{
        readonly id: "ecl-calculator";
        readonly label: "ECL Calculator";
        readonly route: "ecl/calculator";
        readonly roles: readonly ["credit_risk_manager", "risk_manager", "finance_accounting"];
    }, {
        readonly id: "ecl-staging";
        readonly label: "Stage Monitoring";
        readonly route: "ecl/staging";
        readonly roles: readonly ["credit_risk_manager", "risk_manager", "finance_accounting"];
    }, {
        readonly id: "ecl-macro";
        readonly label: "Macro Scenarios";
        readonly route: "ecl/macro";
        readonly roles: readonly ["credit_risk_manager", "risk_manager", "model_validator"];
    }, {
        readonly id: "ecl-overlay";
        readonly label: "Overlay Governance";
        readonly route: "ecl/overlay";
        readonly roles: readonly ["credit_risk_manager", "risk_manager", "cro"];
    }];
    readonly roles: readonly ["credit_risk_manager", "risk_manager", "finance_accounting", "compliance_officer", "cro", "cfo"];
}, {
    readonly id: "ftp";
    readonly label: "Funds Transfer Pricing";
    readonly icon: "arrow-left-right";
    readonly color: "#EC4899";
    readonly route: "ftp";
    readonly children: readonly [{
        readonly id: "ftp-curve";
        readonly label: "Curve Manager";
        readonly route: "ftp/curve";
        readonly roles: readonly ["treasurer", "business_unit_head"];
    }, {
        readonly id: "ftp-pricing";
        readonly label: "Deal Pricer";
        readonly route: "ftp/pricing";
        readonly roles: readonly ["treasurer", "business_unit_head"];
    }, {
        readonly id: "ftp-nmd";
        readonly label: "NMD Modeling";
        readonly route: "ftp/nmd";
        readonly roles: readonly ["treasurer", "risk_manager", "model_validator"];
    }, {
        readonly id: "ftp-profitability";
        readonly label: "Profitability";
        readonly route: "ftp/profitability";
        readonly roles: readonly ["treasurer", "business_unit_head", "cfo"];
    }];
    readonly roles: readonly ["treasurer", "business_unit_head", "risk_manager", "cfo", "cro"];
}, {
    readonly id: "balance-sheet";
    readonly label: "Balance Sheet Optimization";
    readonly icon: "bar-chart-3";
    readonly color: "#6366F1";
    readonly route: "balance-sheet";
    readonly children: readonly [{
        readonly id: "bs-simulator";
        readonly label: "Simulator";
        readonly route: "balance-sheet/simulator";
        readonly roles: readonly ["strategic_planning_manager", "treasurer", "cfo", "cro"];
    }, {
        readonly id: "bs-nim";
        readonly label: "NIM Attribution";
        readonly route: "balance-sheet/nim";
        readonly roles: readonly ["strategic_planning_manager", "treasurer", "cfo"];
    }, {
        readonly id: "bs-hedging";
        readonly label: "Hedge Simulator";
        readonly route: "balance-sheet/hedging";
        readonly roles: readonly ["treasurer", "irrbb_risk_manager"];
    }, {
        readonly id: "bs-alco-pack";
        readonly label: "ALCO Pack";
        readonly route: "balance-sheet/alco-pack";
        readonly roles: readonly ["alco_member", "alco_secretary", "board_secretary"];
    }];
    readonly roles: readonly ["strategic_planning_manager", "treasurer", "cfo", "cro", "alco_member", "board_member"];
}, {
    readonly id: "recovery";
    readonly label: "Recovery Planning";
    readonly icon: "life-buoy";
    readonly color: "#F97316";
    readonly route: "recovery";
    readonly children: readonly [{
        readonly id: "recovery-repository";
        readonly label: "Plan Repository";
        readonly route: "recovery/repository";
        readonly roles: readonly ["recovery_planning_officer", "cro", "compliance_officer"];
    }, {
        readonly id: "recovery-options";
        readonly label: "Options Menu";
        readonly route: "recovery/options";
        readonly roles: readonly ["recovery_planning_officer", "cro", "ceo"];
    }, {
        readonly id: "recovery-triggers";
        readonly label: "Trigger Dashboard";
        readonly route: "recovery/triggers";
        readonly roles: readonly ["recovery_planning_officer", "cro", "risk_manager"];
    }, {
        readonly id: "recovery-mis";
        readonly label: "Recovery MIS";
        readonly route: "recovery/mis";
        readonly roles: readonly ["recovery_planning_officer", "cro", "board_member"];
    }];
    readonly roles: readonly ["recovery_planning_officer", "cro", "ceo", "compliance_officer", "board_member"];
}, {
    readonly id: "grc";
    readonly label: "GRC & Risk Framework";
    readonly icon: "shield-check";
    readonly color: "#EF4444";
    readonly route: "grc";
    readonly children: readonly [{
        readonly id: "grc-rmf";
        readonly label: "Risk Framework";
        readonly route: "grc/rmf";
        readonly roles: readonly ["cro", "compliance_officer", "internal_auditor"];
    }, {
        readonly id: "grc-universe";
        readonly label: "Risk Universe";
        readonly route: "grc/universe";
        readonly roles: readonly ["cro", "risk_manager", "compliance_officer"];
    }, {
        readonly id: "grc-limits";
        readonly label: "Limit Framework";
        readonly route: "grc/limits";
        readonly roles: readonly ["cro", "risk_manager", "compliance_officer"];
    }, {
        readonly id: "grc-breaches";
        readonly label: "Breach Tracker";
        readonly route: "grc/breaches";
        readonly roles: readonly ["cro", "compliance_officer", "internal_auditor"];
    }];
    readonly roles: readonly ["cro", "risk_manager", "compliance_officer", "internal_auditor", "ceo", "board_member"];
}, {
    readonly id: "regulatory";
    readonly label: "Regulatory Reporting (ORASS)";
    readonly icon: "file-check";
    readonly color: "#14B8A6";
    readonly route: "regulatory";
    readonly children: readonly [{
        readonly id: "regulatory-templates";
        readonly label: "Templates";
        readonly route: "regulatory/templates";
        readonly roles: readonly ["regulatory_reporting_manager", "compliance_officer"];
    }, {
        readonly id: "regulatory-submissions";
        readonly label: "Submissions";
        readonly route: "regulatory/submissions";
        readonly roles: readonly ["regulatory_reporting_manager", "compliance_officer", "cro"];
    }, {
        readonly id: "regulatory-disclosures";
        readonly label: "Disclosures";
        readonly route: "regulatory/disclosures";
        readonly roles: readonly ["regulatory_reporting_manager", "compliance_officer"];
    }];
    readonly roles: readonly ["regulatory_reporting_manager", "compliance_officer", "cro", "board_member"];
}, {
    readonly id: "behavioural";
    readonly label: "Behavioural Models";
    readonly icon: "brain";
    readonly color: "#A855F7";
    readonly route: "behavioural";
    readonly children: readonly [{
        readonly id: "behavioural-nmd";
        readonly label: "NMD Core Model";
        readonly route: "behavioural/nmd";
        readonly roles: readonly ["model_validator", "risk_manager", "treasurer"];
    }, {
        readonly id: "behavioural-cpr";
        readonly label: "CPR Model";
        readonly route: "behavioural/cpr";
        readonly roles: readonly ["model_validator", "risk_manager"];
    }, {
        readonly id: "behavioural-tdrr";
        readonly label: "TDRR Model";
        readonly route: "behavioural/tdrr";
        readonly roles: readonly ["model_validator", "risk_manager"];
    }, {
        readonly id: "behavioural-backtest";
        readonly label: "Backtesting";
        readonly route: "behavioural/backtest";
        readonly roles: readonly ["model_validator", "risk_manager", "cro"];
    }];
    readonly roles: readonly ["model_validator", "risk_manager", "treasurer", "cro"];
}, {
    readonly id: "cyber";
    readonly label: "Cyber Security";
    readonly icon: "lock";
    readonly color: "#64748B";
    readonly route: "cyber";
    readonly children: readonly [{
        readonly id: "cyber-residency";
        readonly label: "Data Residency";
        readonly route: "cyber/residency";
        readonly roles: readonly ["ciso", "platform_administrator", "compliance_officer"];
    }, {
        readonly id: "cyber-controls";
        readonly label: "Control Framework";
        readonly route: "cyber/controls";
        readonly roles: readonly ["ciso", "it_security_officer", "internal_auditor"];
    }, {
        readonly id: "cyber-pentest";
        readonly label: "Pen-Test Tracker";
        readonly route: "cyber/pentest";
        readonly roles: readonly ["ciso", "it_security_officer", "compliance_officer"];
    }, {
        readonly id: "cyber-reporting";
        readonly label: "Board Reporting";
        readonly route: "cyber/reporting";
        readonly roles: readonly ["ciso", "board_member", "cro"];
    }];
    readonly roles: readonly ["ciso", "platform_administrator", "it_security_officer", "compliance_officer", "board_member", "cro"];
}, {
    readonly id: "rtgs";
    readonly label: "RTGS & Intraday Liquidity";
    readonly icon: "zap";
    readonly color: "#EAB308";
    readonly route: "rtgs";
    readonly children: readonly [{
        readonly id: "rtgs-feed";
        readonly label: "Feed Monitor";
        readonly route: "rtgs/feed";
        readonly roles: readonly ["treasurer", "liquidity_risk_manager", "data_engineer"];
    }, {
        readonly id: "rtgs-intraday";
        readonly label: "Intraday Position";
        readonly route: "rtgs/intraday";
        readonly roles: readonly ["treasurer", "liquidity_risk_manager"];
    }, {
        readonly id: "rtgs-throughput";
        readonly label: "Throughput Ratios";
        readonly route: "rtgs/throughput";
        readonly roles: readonly ["treasurer", "liquidity_risk_manager", "compliance_officer"];
    }];
    readonly roles: readonly ["treasurer", "liquidity_risk_manager", "data_engineer", "compliance_officer", "cro"];
}, {
    readonly id: "data-foundation";
    readonly label: "Data Foundation";
    readonly icon: "database";
    readonly color: "#0EA5E9";
    readonly route: "data-foundation";
    readonly children: readonly [{
        readonly id: "data-ingestion";
        readonly label: "Ingestion";
        readonly route: "data-foundation/ingestion";
        readonly roles: readonly ["data_engineer", "treasurer"];
    }, {
        readonly id: "data-quality";
        readonly label: "Quality";
        readonly route: "data-foundation/quality";
        readonly roles: readonly ["data_engineer", "risk_manager", "compliance_officer"];
    }, {
        readonly id: "data-master";
        readonly label: "Master Data";
        readonly route: "data-foundation/master";
        readonly roles: readonly ["data_engineer", "compliance_officer"];
    }, {
        readonly id: "data-alco";
        readonly label: "ALCO Governance";
        readonly route: "data-foundation/alco";
        readonly roles: readonly ["alco_secretary", "alco_member", "board_secretary"];
    }];
    readonly roles: readonly ["data_engineer", "treasurer", "risk_manager", "compliance_officer", "alco_secretary", "alco_member"];
}];
export declare const BOG_DIRECTIVES: readonly [{
    readonly id: "lmtd";
    readonly name: "Liquidity Monitoring Tools Directive";
    readonly year: 2026;
    readonly modules: readonly ["liquidity", "rtgs"];
}, {
    readonly id: "lrmd";
    readonly name: "Liquidity Risk Management Directive";
    readonly year: 2026;
    readonly modules: readonly ["liquidity", "rtgs", "grc"];
}, {
    readonly id: "irrbb";
    readonly name: "IRRBB Guideline";
    readonly year: 2026;
    readonly modules: readonly ["interest-rate", "behavioural"];
}, {
    readonly id: "recovery";
    readonly name: "Recovery Planning Directive";
    readonly year: 2026;
    readonly modules: readonly ["recovery", "balance-sheet"];
}, {
    readonly id: "rmd";
    readonly name: "Risk Management Directive";
    readonly year: 2021;
    readonly modules: readonly ["grc", "cyber"];
}, {
    readonly id: "cisd";
    readonly name: "Cyber & Information Security Directive";
    readonly year: 2026;
    readonly modules: readonly ["cyber"];
}, {
    readonly id: "capital";
    readonly name: "Capital Adequacy Framework";
    readonly year: 2026;
    readonly modules: readonly ["capital"];
}];
export declare const CURRENCIES: {
    readonly GHS: {
        readonly code: "GHS";
        readonly symbol: "₵";
        readonly name: "Ghana Cedi";
        readonly decimals: 2;
    };
    readonly USD: {
        readonly code: "USD";
        readonly symbol: "$";
        readonly name: "US Dollar";
        readonly decimals: 2;
    };
    readonly EUR: {
        readonly code: "EUR";
        readonly symbol: "€";
        readonly name: "Euro";
        readonly decimals: 2;
    };
    readonly GBP: {
        readonly code: "GBP";
        readonly symbol: "£";
        readonly name: "British Pound";
        readonly decimals: 2;
    };
};
export declare const SIGNIFICANT_CURRENCIES: readonly ["GHS", "USD", "EUR"];
export declare const BOG_RATIOS: readonly [{
    readonly id: "narrow_volatile";
    readonly name: "Narrow Liquid Assets / Volatile Liabilities";
    readonly minBank: 0.2;
    readonly minSdi: 0.15;
}, {
    readonly id: "narrow_short_term";
    readonly name: "Narrow Liquid Assets / Short-term Liabilities";
    readonly minBank: 0.1;
    readonly minSdi: 0.08;
}, {
    readonly id: "narrow_total_assets";
    readonly name: "Narrow Liquid Assets / Total Assets";
    readonly minBank: 0.05;
    readonly minSdi: 0.04;
}, {
    readonly id: "narrow_total_deposits";
    readonly name: "Narrow Liquid Assets / Total Deposits";
    readonly minBank: 0.08;
    readonly minSdi: 0.06;
}, {
    readonly id: "broad_volatile";
    readonly name: "Broad Liquid Assets / Volatile Liabilities";
    readonly minBank: 0.3;
    readonly minSdi: 0.25;
}, {
    readonly id: "broad_short_term";
    readonly name: "Broad Liquid Assets / Short-term Liabilities";
    readonly minBank: 0.15;
    readonly minSdi: 0.12;
}, {
    readonly id: "broad_total_assets";
    readonly name: "Broad Liquid Assets / Total Assets";
    readonly minBank: 0.1;
    readonly minSdi: 0.08;
}, {
    readonly id: "broad_total_deposits";
    readonly name: "Broad Liquid Assets / Total Deposits";
    readonly minBank: 0.12;
    readonly minSdi: 0.1;
}];
export declare const LMTD_BUCKETS: readonly ["overnight", "2_to_7_days", "8_to_30_days", "31_to_90_days", "91_to_180_days", "181_to_365_days", "1_to_2_years", "2_to_5_years", "over_5_years", "non_contractual", "fixed_assets", "undrawn_commitments", "derivatives"];
export declare const IRRBB_BUCKETS: readonly ["overnight", "1_month", "3_months", "6_months", "9_months", "1_year", "1_5_years", "2_years", "3_years", "4_years", "5_years", "6_years", "7_years", "8_years", "9_years", "10_years", "15_years", "20_years", "over_20_years"];
export declare const IRRBB_SHOCK_SCENARIOS: readonly [{
    readonly id: "parallel_up";
    readonly name: "Parallel Up";
    readonly description: "Parallel shift up across all maturities";
}, {
    readonly id: "parallel_down";
    readonly name: "Parallel Down";
    readonly description: "Parallel shift down across all maturities";
}, {
    readonly id: "steepener";
    readonly name: "Steepener";
    readonly description: "Short rates down, long rates up";
}, {
    readonly id: "flattener";
    readonly name: "Flattener";
    readonly description: "Short rates up, long rates down";
}, {
    readonly id: "short_rate_up";
    readonly name: "Short Rate Up";
    readonly description: "Short end rates increase";
}, {
    readonly id: "short_rate_down";
    readonly name: "Short Rate Down";
    readonly description: "Short end rates decrease";
}];
export declare const SOT_THRESHOLD = 0.15;
export declare const CAPITAL_MINIMUMS: {
    readonly cet1: 0.045;
    readonly tier1: 0.06;
    readonly totalCapital: 0.08;
    readonly leverage: 0.03;
};
export declare const CAPITAL_BUFFERS: {
    readonly conservation: 0.025;
    readonly countercyclicalMax: 0.025;
    readonly dSibMin: 0.005;
    readonly dSibMax: 0.02;
};
export declare const NMD_CORE_CAPS: {
    readonly retail: 0.7;
    readonly sme: 0.5;
    readonly corporate: 0.3;
};
export declare const NMD_AVG_MATURITY_CAPS: {
    readonly retail: 4;
    readonly sme: 2;
    readonly corporate: 1;
};
export declare const FTP_TENORS: readonly ["ON", "1W", "1M", "3M", "6M", "1Y", "2Y", "3Y", "5Y", "7Y", "10Y", "15Y", "20Y"];
export declare const GHANA_MACRO_VARIABLES: readonly ["gdp_growth", "inflation", "bog_policy_rate", "ghs_usd", "gog_tbill_yield", "cocoa_price", "gold_price", "oil_price", "unemployment", "fiscal_deficit"];
export declare const RTGS_BUSINESS_HOURS: {
    readonly start: "08:00";
    readonly end: "17:00";
    readonly timezone: "GMT";
};
export declare const BREACH_NOTIFICATION_DAYS = 10;
export declare const ORASS_DEADLINES: {
    readonly monthly: 9;
    readonly quarterly: 15;
    readonly annual: 31;
};
export declare const RECOVERY_PLAN_DUE_DATE = "12-31";
//# sourceMappingURL=index.d.ts.map