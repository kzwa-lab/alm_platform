import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    tenantCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    tenantCode: string;
}, {
    password: string;
    email: string;
    tenantCode: string;
}>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodString;
    lineOfDefence: z.ZodEnum<["first", "second", "third"]>;
    tenantId: z.ZodString;
    department: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    password: string;
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    lineOfDefence: "second" | "first" | "third";
    department?: string | undefined;
}, {
    password: string;
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    lineOfDefence: "second" | "first" | "third";
    department?: string | undefined;
}>;
export declare const createTenantSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    type: z.ZodEnum<["bank", "sdi"]>;
    country: z.ZodDefault<z.ZodString>;
    baseCurrency: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    country: string;
    type: "bank" | "sdi";
    code: string;
    baseCurrency: string;
}, {
    name: string;
    type: "bank" | "sdi";
    code: string;
    country?: string | undefined;
    baseCurrency?: string | undefined;
}>;
export declare const kpiMetricSchema: z.ZodObject<{
    moduleId: z.ZodString;
    name: z.ZodString;
    value: z.ZodNumber;
    unit: z.ZodEnum<["percent", "currency", "ratio", "count", "days"]>;
    currency: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["green", "amber", "red", "neutral"]>;
    thresholdGreen: z.ZodOptional<z.ZodNumber>;
    thresholdAmber: z.ZodOptional<z.ZodNumber>;
    thresholdRed: z.ZodOptional<z.ZodNumber>;
    trend: z.ZodEnum<["up", "down", "flat"]>;
    trendValue: z.ZodNumber;
    asOfDate: z.ZodDate;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    tenantId: string;
    value: number;
    status: "green" | "amber" | "red" | "neutral";
    trend: "flat" | "up" | "down";
    trendValue: number;
    moduleId: string;
    unit: "currency" | "days" | "percent" | "ratio" | "count";
    asOfDate: Date;
    currency?: string | undefined;
    thresholdGreen?: number | undefined;
    thresholdAmber?: number | undefined;
    thresholdRed?: number | undefined;
}, {
    name: string;
    tenantId: string;
    value: number;
    status: "green" | "amber" | "red" | "neutral";
    trend: "flat" | "up" | "down";
    trendValue: number;
    moduleId: string;
    unit: "currency" | "days" | "percent" | "ratio" | "count";
    asOfDate: Date;
    currency?: string | undefined;
    thresholdGreen?: number | undefined;
    thresholdAmber?: number | undefined;
    thresholdRed?: number | undefined;
}>;
export declare const dataSourceSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["sql", "api", "sftp", "file", "swift", "rtgs", "queue"]>;
    status: z.ZodDefault<z.ZodEnum<["active", "warning", "error", "paused"]>>;
    frequency: z.ZodEnum<["realtime", "hourly", "daily", "weekly", "monthly"]>;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    tenantId: string;
    type: "file" | "rtgs" | "sql" | "api" | "sftp" | "swift" | "queue";
    status: "error" | "warning" | "active" | "paused";
    frequency: "realtime" | "hourly" | "daily" | "weekly" | "monthly";
}, {
    name: string;
    tenantId: string;
    type: "file" | "rtgs" | "sql" | "api" | "sftp" | "swift" | "queue";
    frequency: "realtime" | "hourly" | "daily" | "weekly" | "monthly";
    status?: "error" | "warning" | "active" | "paused" | undefined;
}>;
export declare const marketDataSchema: z.ZodObject<{
    type: z.ZodEnum<["grr", "bog_policy_rate", "interbank_rate", "gog_tbill_91d", "gog_tbill_182d", "gog_tbill_1y", "gog_tbill_2y", "fx_usd_ghs", "fx_eur_ghs", "fx_gbp_ghs", "gse_equity"]>;
    value: z.ZodNumber;
    currency: z.ZodOptional<z.ZodString>;
    tenor: z.ZodOptional<z.ZodString>;
    asOfDate: z.ZodDate;
    source: z.ZodString;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    value: number;
    source: string;
    type: "grr" | "bog_policy_rate" | "interbank_rate" | "gog_tbill_91d" | "gog_tbill_182d" | "gog_tbill_1y" | "gog_tbill_2y" | "fx_usd_ghs" | "fx_eur_ghs" | "fx_gbp_ghs" | "gse_equity";
    asOfDate: Date;
    currency?: string | undefined;
    tenor?: string | undefined;
}, {
    tenantId: string;
    value: number;
    source: string;
    type: "grr" | "bog_policy_rate" | "interbank_rate" | "gog_tbill_91d" | "gog_tbill_182d" | "gog_tbill_1y" | "gog_tbill_2y" | "fx_usd_ghs" | "fx_eur_ghs" | "fx_gbp_ghs" | "gse_equity";
    asOfDate: Date;
    currency?: string | undefined;
    tenor?: string | undefined;
}>;
export declare const liquidityMetricSchema: z.ZodObject<{
    metricType: z.ZodEnum<["lcr", "nsfr", "bog_narrow_volatile", "bog_narrow_short_term", "bog_narrow_total_assets", "bog_narrow_total_deposits", "bog_broad_volatile", "bog_broad_short_term", "bog_broad_total_assets", "bog_broad_total_deposits", "maturity_mismatch", "funding_concentration", "significant_currency_lcr"]>;
    value: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    status: z.ZodEnum<["green", "amber", "red"]>;
    asOfDate: z.ZodDate;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currency: string;
    tenantId: string;
    value: number;
    status: "green" | "amber" | "red";
    asOfDate: Date;
    metricType: "lcr" | "nsfr" | "bog_narrow_volatile" | "bog_narrow_short_term" | "bog_narrow_total_assets" | "bog_narrow_total_deposits" | "bog_broad_volatile" | "bog_broad_short_term" | "bog_broad_total_assets" | "bog_broad_total_deposits" | "maturity_mismatch" | "funding_concentration" | "significant_currency_lcr";
}, {
    tenantId: string;
    value: number;
    status: "green" | "amber" | "red";
    asOfDate: Date;
    metricType: "lcr" | "nsfr" | "bog_narrow_volatile" | "bog_narrow_short_term" | "bog_narrow_total_assets" | "bog_narrow_total_deposits" | "bog_broad_volatile" | "bog_broad_short_term" | "bog_broad_total_assets" | "bog_broad_total_deposits" | "maturity_mismatch" | "funding_concentration" | "significant_currency_lcr";
    currency?: string | undefined;
}>;
export declare const irrbbEveResultSchema: z.ZodObject<{
    scenario: z.ZodEnum<["parallel_up", "parallel_down", "steepener", "flattener", "short_rate_up", "short_rate_down"]>;
    deltaEve: z.ZodNumber;
    percentOfT1: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    status: z.ZodEnum<["green", "amber", "red"]>;
    asOfDate: z.ZodDate;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currency: string;
    tenantId: string;
    scenario: "parallel_up" | "parallel_down" | "steepener" | "flattener" | "short_rate_up" | "short_rate_down";
    status: "green" | "amber" | "red";
    asOfDate: Date;
    deltaEve: number;
    percentOfT1: number;
}, {
    tenantId: string;
    scenario: "parallel_up" | "parallel_down" | "steepener" | "flattener" | "short_rate_up" | "short_rate_down";
    status: "green" | "amber" | "red";
    asOfDate: Date;
    deltaEve: number;
    percentOfT1: number;
    currency?: string | undefined;
}>;
export declare const capitalRatioSchema: z.ZodObject<{
    ratioType: z.ZodEnum<["cet1", "tier1", "total_capital", "leverage"]>;
    value: z.ZodNumber;
    minimumRequired: z.ZodNumber;
    bufferRequired: z.ZodNumber;
    headroom: z.ZodNumber;
    status: z.ZodEnum<["green", "amber", "red"]>;
    asOfDate: z.ZodDate;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    value: number;
    status: "green" | "amber" | "red";
    asOfDate: Date;
    ratioType: "cet1" | "tier1" | "total_capital" | "leverage";
    minimumRequired: number;
    bufferRequired: number;
    headroom: number;
}, {
    tenantId: string;
    value: number;
    status: "green" | "amber" | "red";
    asOfDate: Date;
    ratioType: "cet1" | "tier1" | "total_capital" | "leverage";
    minimumRequired: number;
    bufferRequired: number;
    headroom: number;
}>;
export declare const eclProvisionSchema: z.ZodObject<{
    stage: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>]>;
    portfolio: z.ZodString;
    exposure: z.ZodNumber;
    provision: z.ZodNumber;
    coverageRatio: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    asOfDate: z.ZodDate;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currency: string;
    tenantId: string;
    coverageRatio: number;
    asOfDate: Date;
    stage: 1 | 3 | 2;
    portfolio: string;
    exposure: number;
    provision: number;
}, {
    tenantId: string;
    coverageRatio: number;
    asOfDate: Date;
    stage: 1 | 3 | 2;
    portfolio: string;
    exposure: number;
    provision: number;
    currency?: string | undefined;
}>;
export declare const ftpCurveSchema: z.ZodObject<{
    currency: z.ZodString;
    tenor: z.ZodString;
    itpRate: z.ZodNumber;
    ltpRate: z.ZodNumber;
    creditSpread: z.ZodNumber;
    totalFtp: z.ZodNumber;
    asOfDate: z.ZodDate;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currency: string;
    tenantId: string;
    tenor: string;
    asOfDate: Date;
    itpRate: number;
    ltpRate: number;
    creditSpread: number;
    totalFtp: number;
}, {
    currency: string;
    tenantId: string;
    tenor: string;
    asOfDate: Date;
    itpRate: number;
    ltpRate: number;
    creditSpread: number;
    totalFtp: number;
}>;
export declare const recoveryTriggerSchema: z.ZodObject<{
    name: z.ZodString;
    metricType: z.ZodString;
    threshold: z.ZodNumber;
    currentValue: z.ZodNumber;
    status: z.ZodEnum<["green", "amber", "red"]>;
    breachDate: z.ZodOptional<z.ZodDate>;
    asOfDate: z.ZodDate;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    tenantId: string;
    threshold: number;
    status: "green" | "amber" | "red";
    asOfDate: Date;
    metricType: string;
    currentValue: number;
    breachDate?: Date | undefined;
}, {
    name: string;
    tenantId: string;
    threshold: number;
    status: "green" | "amber" | "red";
    asOfDate: Date;
    metricType: string;
    currentValue: number;
    breachDate?: Date | undefined;
}>;
export declare const grcLimitSchema: z.ZodObject<{
    name: z.ZodString;
    moduleId: z.ZodString;
    limitValue: z.ZodNumber;
    currentValue: z.ZodNumber;
    unit: z.ZodString;
    status: z.ZodEnum<["green", "amber", "red"]>;
    breachDate: z.ZodOptional<z.ZodDate>;
    notifiedBoG: z.ZodDefault<z.ZodBoolean>;
    boGNotificationDate: z.ZodOptional<z.ZodDate>;
    asOfDate: z.ZodDate;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    tenantId: string;
    status: "green" | "amber" | "red";
    moduleId: string;
    unit: string;
    asOfDate: Date;
    currentValue: number;
    limitValue: number;
    notifiedBoG: boolean;
    breachDate?: Date | undefined;
    boGNotificationDate?: Date | undefined;
}, {
    name: string;
    tenantId: string;
    status: "green" | "amber" | "red";
    moduleId: string;
    unit: string;
    asOfDate: Date;
    currentValue: number;
    limitValue: number;
    breachDate?: Date | undefined;
    notifiedBoG?: boolean | undefined;
    boGNotificationDate?: Date | undefined;
}>;
export declare const regulatoryTemplateSchema: z.ZodObject<{
    name: z.ZodString;
    directive: z.ZodString;
    frequency: z.ZodEnum<["monthly", "quarterly", "annual"]>;
    format: z.ZodEnum<["excel", "xml", "xbrl", "pdf"]>;
    version: z.ZodString;
    dueDay: z.ZodNumber;
    status: z.ZodDefault<z.ZodEnum<["active", "deprecated"]>>;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    tenantId: string;
    format: "excel" | "xml" | "xbrl" | "pdf";
    status: "active" | "deprecated";
    version: string;
    frequency: "monthly" | "quarterly" | "annual";
    directive: string;
    dueDay: number;
}, {
    name: string;
    tenantId: string;
    format: "excel" | "xml" | "xbrl" | "pdf";
    version: string;
    frequency: "monthly" | "quarterly" | "annual";
    directive: string;
    dueDay: number;
    status?: "active" | "deprecated" | undefined;
}>;
export declare const regulatorySubmissionSchema: z.ZodObject<{
    templateId: z.ZodString;
    period: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["draft", "review", "approved", "submitted", "acknowledged", "rejected"]>>;
    submittedAt: z.ZodOptional<z.ZodDate>;
    acknowledgedAt: z.ZodOptional<z.ZodDate>;
    submittedBy: z.ZodOptional<z.ZodString>;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    status: "draft" | "review" | "approved" | "submitted" | "acknowledged" | "rejected";
    templateId: string;
    period: string;
    submittedAt?: Date | undefined;
    acknowledgedAt?: Date | undefined;
    submittedBy?: string | undefined;
}, {
    tenantId: string;
    templateId: string;
    period: string;
    status?: "draft" | "review" | "approved" | "submitted" | "acknowledged" | "rejected" | undefined;
    submittedAt?: Date | undefined;
    acknowledgedAt?: Date | undefined;
    submittedBy?: string | undefined;
}>;
export declare const behaviouralModelSchema: z.ZodObject<{
    modelType: z.ZodEnum<["nmd_core", "cpr", "tdrr"]>;
    category: z.ZodString;
    parameterName: z.ZodString;
    parameterValue: z.ZodNumber;
    boGCap: z.ZodOptional<z.ZodNumber>;
    backtestMape: z.ZodOptional<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<["draft", "review", "approved", "rejected"]>>;
    asOfDate: z.ZodDate;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    category: string;
    status: "draft" | "review" | "approved" | "rejected";
    asOfDate: Date;
    modelType: "nmd_core" | "cpr" | "tdrr";
    parameterName: string;
    parameterValue: number;
    boGCap?: number | undefined;
    backtestMape?: number | undefined;
}, {
    tenantId: string;
    category: string;
    asOfDate: Date;
    modelType: "nmd_core" | "cpr" | "tdrr";
    parameterName: string;
    parameterValue: number;
    status?: "draft" | "review" | "approved" | "rejected" | undefined;
    boGCap?: number | undefined;
    backtestMape?: number | undefined;
}>;
export declare const cyberControlSchema: z.ZodObject<{
    controlId: z.ZodString;
    name: z.ZodString;
    framework: z.ZodEnum<["iso27001", "nist_csf", "cisd2026"]>;
    category: z.ZodString;
    maturityLevel: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>, z.ZodLiteral<5>]>;
    status: z.ZodEnum<["compliant", "partial", "non_compliant", "not_applicable"]>;
    lastAssessedAt: z.ZodDate;
    nextAssessmentAt: z.ZodDate;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    tenantId: string;
    category: string;
    status: "partial" | "compliant" | "non_compliant" | "not_applicable";
    controlId: string;
    framework: "iso27001" | "nist_csf" | "cisd2026";
    maturityLevel: 1 | 3 | 2 | 4 | 5;
    lastAssessedAt: Date;
    nextAssessmentAt: Date;
}, {
    name: string;
    tenantId: string;
    category: string;
    status: "partial" | "compliant" | "non_compliant" | "not_applicable";
    controlId: string;
    framework: "iso27001" | "nist_csf" | "cisd2026";
    maturityLevel: 1 | 3 | 2 | 4 | 5;
    lastAssessedAt: Date;
    nextAssessmentAt: Date;
}>;
export declare const rtgsMessageSchema: z.ZodObject<{
    messageId: z.ZodString;
    messageType: z.ZodEnum<["settlement", "payment", "balance_update", "queue_status"]>;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    status: z.ZodEnum<["confirmed", "queued", "failed"]>;
    timestamp: z.ZodDate;
    latencyMs: z.ZodNumber;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currency: string;
    tenantId: string;
    timestamp: Date;
    status: "failed" | "confirmed" | "queued";
    messageId: string;
    messageType: "settlement" | "payment" | "balance_update" | "queue_status";
    amount: number;
    latencyMs: number;
}, {
    tenantId: string;
    timestamp: Date;
    status: "failed" | "confirmed" | "queued";
    messageId: string;
    messageType: "settlement" | "payment" | "balance_update" | "queue_status";
    amount: number;
    latencyMs: number;
    currency?: string | undefined;
}>;
export declare const intradayLiquiditySchema: z.ZodObject<{
    timestamp: z.ZodDate;
    settlementBalance: z.ZodNumber;
    throughputRatio: z.ZodNumber;
    peakFundingDemand: z.ZodNumber;
    paymentQueueCount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currency: string;
    tenantId: string;
    timestamp: Date;
    settlementBalance: number;
    throughputRatio: number;
    peakFundingDemand: number;
    paymentQueueCount: number;
}, {
    tenantId: string;
    timestamp: Date;
    settlementBalance: number;
    throughputRatio: number;
    peakFundingDemand: number;
    paymentQueueCount: number;
    currency?: string | undefined;
}>;
export declare const auditLogSchema: z.ZodObject<{
    userId: z.ZodString;
    tenantId: z.ZodString;
    action: z.ZodString;
    entityType: z.ZodString;
    entityId: z.ZodString;
    oldValue: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    newValue: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    ipAddress: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    timestamp: Date;
    oldValue?: Record<string, unknown> | undefined;
    newValue?: Record<string, unknown> | undefined;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
}, {
    tenantId: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    timestamp: Date;
    oldValue?: Record<string, unknown> | undefined;
    newValue?: Record<string, unknown> | undefined;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
}>;
export declare const whatIfScenarioSchema: z.ZodObject<{
    moduleId: z.ZodString;
    name: z.ZodString;
    parameters: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    tenantId: string;
    moduleId: string;
    parameters: Record<string, string | number | boolean>;
}, {
    name: string;
    tenantId: string;
    moduleId: string;
    parameters: Record<string, string | number | boolean>;
}>;
export declare const contextBarSchema: z.ZodObject<{
    entityId: z.ZodString;
    reportingDate: z.ZodDate;
    scenario: z.ZodDefault<z.ZodEnum<["base", "upside", "downside", "severe", "recovery"]>>;
    currency: z.ZodDefault<z.ZodString>;
    referenceRate: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    currency: string;
    reportingDate: Date;
    scenario: "base" | "upside" | "downside" | "severe" | "recovery";
    entityId: string;
    referenceRate?: number | undefined;
}, {
    reportingDate: Date;
    entityId: string;
    currency?: string | undefined;
    scenario?: "base" | "upside" | "downside" | "severe" | "recovery" | undefined;
    referenceRate?: number | undefined;
}>;
//# sourceMappingURL=index.d.ts.map