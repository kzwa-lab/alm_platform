export interface Tenant {
    id: string;
    name: string;
    code: string;
    type: 'bank' | 'sdi';
    country: string;
    baseCurrency: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    lineOfDefence: LineOfDefence;
    tenantId: string;
    department?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export type Role = 'alco_member' | 'treasurer' | 'risk_manager' | 'model_validator' | 'compliance_officer' | 'business_unit_head' | 'finance_accounting' | 'data_engineer' | 'ciso' | 'cro' | 'recovery_planning_officer' | 'capital_manager' | 'board_secretary' | 'alco_secretary' | 'liquidity_risk_manager' | 'irrbb_risk_manager' | 'credit_risk_manager' | 'strategic_planning_manager' | 'regulatory_reporting_manager' | 'platform_administrator' | 'it_security_officer' | 'internal_auditor' | 'external_auditor' | 'ceo' | 'cfo' | 'board_member';
export type LineOfDefence = 'first' | 'second' | 'third';
export interface AuthContext {
    userId: string;
    tenantId: string;
    role: Role;
    lineOfDefence: LineOfDefence;
    permissions: string[];
}
export interface KpiMetric {
    id: string;
    moduleId: string;
    name: string;
    value: number;
    unit: 'percent' | 'currency' | 'ratio' | 'count' | 'days';
    currency?: string;
    status: 'green' | 'amber' | 'red' | 'neutral';
    thresholdGreen?: number;
    thresholdAmber?: number;
    thresholdRed?: number;
    trend: 'up' | 'down' | 'flat';
    trendValue: number;
    asOfDate: Date;
    tenantId: string;
}
export interface ModuleConfig {
    id: string;
    label: string;
    icon: string;
    color: string;
    route: string;
    parentId?: string;
    children?: ModuleConfig[];
    roles: Role[];
}
export interface DataSource {
    id: string;
    name: string;
    type: 'sql' | 'api' | 'sftp' | 'file' | 'swift' | 'rtgs' | 'queue';
    status: 'active' | 'warning' | 'error' | 'paused';
    lastRunAt?: Date;
    lastRunRows?: number;
    lastRunStatus?: 'success' | 'failed' | 'partial';
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    tenantId: string;
}
export interface MarketDataPoint {
    id: string;
    type: 'grr' | 'bog_policy_rate' | 'interbank_rate' | 'gog_tbill_91d' | 'gog_tbill_182d' | 'gog_tbill_1y' | 'gog_tbill_2y' | 'fx_usd_ghs' | 'fx_eur_ghs' | 'fx_gbp_ghs' | 'gse_equity';
    value: number;
    currency?: string;
    tenor?: string;
    asOfDate: Date;
    source: string;
    tenantId: string;
}
export interface YieldCurvePoint {
    id: string;
    currency: string;
    tenor: string;
    rate: number;
    curveType: 'itp' | 'ltp' | 'credit';
    asOfDate: Date;
    tenantId: string;
}
export interface LiquidityMetric {
    id: string;
    metricType: 'lcr' | 'nsfr' | 'bog_narrow_volatile' | 'bog_narrow_short_term' | 'bog_narrow_total_assets' | 'bog_narrow_total_deposits' | 'bog_broad_volatile' | 'bog_broad_short_term' | 'bog_broad_total_assets' | 'bog_broad_total_deposits' | 'maturity_mismatch' | 'funding_concentration' | 'significant_currency_lcr';
    value: number;
    currency: string;
    status: 'green' | 'amber' | 'red';
    asOfDate: Date;
    tenantId: string;
}
export interface IrrbbEveResult {
    id: string;
    scenario: 'parallel_up' | 'parallel_down' | 'steepener' | 'flattener' | 'short_rate_up' | 'short_rate_down';
    deltaEve: number;
    percentOfT1: number;
    currency: string;
    status: 'green' | 'amber' | 'red';
    asOfDate: Date;
    tenantId: string;
}
export interface CapitalRatio {
    id: string;
    ratioType: 'cet1' | 'tier1' | 'total_capital' | 'leverage';
    value: number;
    minimumRequired: number;
    bufferRequired: number;
    headroom: number;
    status: 'green' | 'amber' | 'red';
    asOfDate: Date;
    tenantId: string;
}
export interface EclProvision {
    id: string;
    stage: 1 | 2 | 3;
    portfolio: string;
    exposure: number;
    provision: number;
    coverageRatio: number;
    currency: string;
    asOfDate: Date;
    tenantId: string;
}
export interface FtpCurve {
    id: string;
    currency: string;
    tenor: string;
    itpRate: number;
    ltpRate: number;
    creditSpread: number;
    totalFtp: number;
    asOfDate: Date;
    tenantId: string;
}
export interface RecoveryTrigger {
    id: string;
    name: string;
    metricType: string;
    threshold: number;
    currentValue: number;
    status: 'green' | 'amber' | 'red';
    breachDate?: Date;
    asOfDate: Date;
    tenantId: string;
}
export interface GrcLimit {
    id: string;
    name: string;
    moduleId: string;
    limitValue: number;
    currentValue: number;
    unit: string;
    status: 'green' | 'amber' | 'red';
    breachDate?: Date;
    notifiedBoG: boolean;
    boGNotificationDate?: Date;
    asOfDate: Date;
    tenantId: string;
}
export interface RegulatoryTemplate {
    id: string;
    name: string;
    directive: string;
    frequency: 'monthly' | 'quarterly' | 'annual';
    format: 'excel' | 'xml' | 'xbrl' | 'pdf';
    version: string;
    dueDay: number;
    status: 'active' | 'deprecated';
    tenantId: string;
}
export interface RegulatorySubmission {
    id: string;
    templateId: string;
    period: string;
    status: 'draft' | 'review' | 'approved' | 'submitted' | 'acknowledged' | 'rejected';
    submittedAt?: Date;
    acknowledgedAt?: Date;
    submittedBy?: string;
    tenantId: string;
}
export interface BehaviouralModel {
    id: string;
    modelType: 'nmd_core' | 'cpr' | 'tdrr';
    category: string;
    parameterName: string;
    parameterValue: number;
    boGCap?: number;
    backtestMape?: number;
    status: 'draft' | 'review' | 'approved' | 'rejected';
    asOfDate: Date;
    tenantId: string;
}
export interface CyberControl {
    id: string;
    controlId: string;
    name: string;
    framework: 'iso27001' | 'nist_csf' | 'cisd2026';
    category: string;
    maturityLevel: 1 | 2 | 3 | 4 | 5;
    status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable';
    lastAssessedAt: Date;
    nextAssessmentAt: Date;
    tenantId: string;
}
export interface RtgsMessage {
    id: string;
    messageId: string;
    messageType: 'settlement' | 'payment' | 'balance_update' | 'queue_status';
    amount: number;
    currency: string;
    status: 'confirmed' | 'queued' | 'failed';
    timestamp: Date;
    latencyMs: number;
    tenantId: string;
}
export interface IntradayLiquidity {
    id: string;
    timestamp: Date;
    settlementBalance: number;
    throughputRatio: number;
    peakFundingDemand: number;
    paymentQueueCount: number;
    currency: string;
    tenantId: string;
}
export interface AuditLog {
    id: string;
    userId: string;
    tenantId: string;
    action: string;
    entityType: string;
    entityId: string;
    oldValue?: Record<string, unknown>;
    newValue?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}
//# sourceMappingURL=index.d.ts.map