import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  tenantCode: z.string().min(2),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string(),
  lineOfDefence: z.enum(['first', 'second', 'third']),
  tenantId: z.string().uuid(),
  department: z.string().optional(),
});

// Tenant schemas
export const createTenantSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).max(10),
  type: z.enum(['bank', 'sdi']),
  country: z.string().default('GH'),
  baseCurrency: z.string().default('GHS'),
});

// KPI metric schemas
export const kpiMetricSchema = z.object({
  moduleId: z.string(),
  name: z.string(),
  value: z.number(),
  unit: z.enum(['percent', 'currency', 'ratio', 'count', 'days']),
  currency: z.string().optional(),
  status: z.enum(['green', 'amber', 'red', 'neutral']),
  thresholdGreen: z.number().optional(),
  thresholdAmber: z.number().optional(),
  thresholdRed: z.number().optional(),
  trend: z.enum(['up', 'down', 'flat']),
  trendValue: z.number(),
  asOfDate: z.coerce.date(),
  tenantId: z.string().uuid(),
});

// Data source schemas
export const dataSourceSchema = z.object({
  name: z.string().min(2),
  type: z.enum(['sql', 'api', 'sftp', 'file', 'swift', 'rtgs', 'queue']),
  status: z.enum(['active', 'warning', 'error', 'paused']).default('active'),
  frequency: z.enum(['realtime', 'hourly', 'daily', 'weekly', 'monthly']),
  tenantId: z.string().uuid(),
});

// Market data schemas
export const marketDataSchema = z.object({
  type: z.enum(['grr', 'bog_policy_rate', 'interbank_rate', 'gog_tbill_91d', 'gog_tbill_182d', 'gog_tbill_1y', 'gog_tbill_2y', 'fx_usd_ghs', 'fx_eur_ghs', 'fx_gbp_ghs', 'gse_equity']),
  value: z.number(),
  currency: z.string().optional(),
  tenor: z.string().optional(),
  asOfDate: z.coerce.date(),
  source: z.string(),
  tenantId: z.string().uuid(),
});

// Liquidity metric schemas
export const liquidityMetricSchema = z.object({
  metricType: z.enum(['lcr', 'nsfr', 'bog_narrow_volatile', 'bog_narrow_short_term', 'bog_narrow_total_assets', 'bog_narrow_total_deposits', 'bog_broad_volatile', 'bog_broad_short_term', 'bog_broad_total_assets', 'bog_broad_total_deposits', 'maturity_mismatch', 'funding_concentration', 'significant_currency_lcr']),
  value: z.number(),
  currency: z.string().default('GHS'),
  status: z.enum(['green', 'amber', 'red']),
  asOfDate: z.coerce.date(),
  tenantId: z.string().uuid(),
});

// IRRBB EVE result schemas
export const irrbbEveResultSchema = z.object({
  scenario: z.enum(['parallel_up', 'parallel_down', 'steepener', 'flattener', 'short_rate_up', 'short_rate_down']),
  deltaEve: z.number(),
  percentOfT1: z.number(),
  currency: z.string().default('GHS'),
  status: z.enum(['green', 'amber', 'red']),
  asOfDate: z.coerce.date(),
  tenantId: z.string().uuid(),
});

// Capital ratio schemas
export const capitalRatioSchema = z.object({
  ratioType: z.enum(['cet1', 'tier1', 'total_capital', 'leverage']),
  value: z.number(),
  minimumRequired: z.number(),
  bufferRequired: z.number(),
  headroom: z.number(),
  status: z.enum(['green', 'amber', 'red']),
  asOfDate: z.coerce.date(),
  tenantId: z.string().uuid(),
});

// ECL provision schemas
export const eclProvisionSchema = z.object({
  stage: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  portfolio: z.string(),
  exposure: z.number().positive(),
  provision: z.number().positive(),
  coverageRatio: z.number(),
  currency: z.string().default('GHS'),
  asOfDate: z.coerce.date(),
  tenantId: z.string().uuid(),
});

// FTP curve schemas
export const ftpCurveSchema = z.object({
  currency: z.string(),
  tenor: z.string(),
  itpRate: z.number(),
  ltpRate: z.number(),
  creditSpread: z.number(),
  totalFtp: z.number(),
  asOfDate: z.coerce.date(),
  tenantId: z.string().uuid(),
});

// Recovery trigger schemas
export const recoveryTriggerSchema = z.object({
  name: z.string(),
  metricType: z.string(),
  threshold: z.number(),
  currentValue: z.number(),
  status: z.enum(['green', 'amber', 'red']),
  breachDate: z.coerce.date().optional(),
  asOfDate: z.coerce.date(),
  tenantId: z.string().uuid(),
});

// GRC limit schemas
export const grcLimitSchema = z.object({
  name: z.string(),
  moduleId: z.string(),
  limitValue: z.number(),
  currentValue: z.number(),
  unit: z.string(),
  status: z.enum(['green', 'amber', 'red']),
  breachDate: z.coerce.date().optional(),
  notifiedBoG: z.boolean().default(false),
  boGNotificationDate: z.coerce.date().optional(),
  asOfDate: z.coerce.date(),
  tenantId: z.string().uuid(),
});

// Regulatory template schemas
export const regulatoryTemplateSchema = z.object({
  name: z.string(),
  directive: z.string(),
  frequency: z.enum(['monthly', 'quarterly', 'annual']),
  format: z.enum(['excel', 'xml', 'xbrl', 'pdf']),
  version: z.string(),
  dueDay: z.number().int().positive(),
  status: z.enum(['active', 'deprecated']).default('active'),
  tenantId: z.string().uuid(),
});

// Regulatory submission schemas
export const regulatorySubmissionSchema = z.object({
  templateId: z.string().uuid(),
  period: z.string(),
  status: z.enum(['draft', 'review', 'approved', 'submitted', 'acknowledged', 'rejected']).default('draft'),
  submittedAt: z.coerce.date().optional(),
  acknowledgedAt: z.coerce.date().optional(),
  submittedBy: z.string().optional(),
  tenantId: z.string().uuid(),
});

// Behavioural model schemas
export const behaviouralModelSchema = z.object({
  modelType: z.enum(['nmd_core', 'cpr', 'tdrr']),
  category: z.string(),
  parameterName: z.string(),
  parameterValue: z.number(),
  boGCap: z.number().optional(),
  backtestMape: z.number().optional(),
  status: z.enum(['draft', 'review', 'approved', 'rejected']).default('draft'),
  asOfDate: z.coerce.date(),
  tenantId: z.string().uuid(),
});

// Cyber control schemas
export const cyberControlSchema = z.object({
  controlId: z.string(),
  name: z.string(),
  framework: z.enum(['iso27001', 'nist_csf', 'cisd2026']),
  category: z.string(),
  maturityLevel: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  status: z.enum(['compliant', 'partial', 'non_compliant', 'not_applicable']),
  lastAssessedAt: z.coerce.date(),
  nextAssessmentAt: z.coerce.date(),
  tenantId: z.string().uuid(),
});

// RTGS message schemas
export const rtgsMessageSchema = z.object({
  messageId: z.string(),
  messageType: z.enum(['settlement', 'payment', 'balance_update', 'queue_status']),
  amount: z.number().positive(),
  currency: z.string().default('GHS'),
  status: z.enum(['confirmed', 'queued', 'failed']),
  timestamp: z.coerce.date(),
  latencyMs: z.number().int().nonnegative(),
  tenantId: z.string().uuid(),
});

// Intraday liquidity schemas
export const intradayLiquiditySchema = z.object({
  timestamp: z.coerce.date(),
  settlementBalance: z.number(),
  throughputRatio: z.number(),
  peakFundingDemand: z.number(),
  paymentQueueCount: z.number().int().nonnegative(),
  currency: z.string().default('GHS'),
  tenantId: z.string().uuid(),
});

// Audit log schemas
export const auditLogSchema = z.object({
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  oldValue: z.record(z.unknown()).optional(),
  newValue: z.record(z.unknown()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  timestamp: z.coerce.date(),
});

// What-if scenario schemas
export const whatIfScenarioSchema = z.object({
  moduleId: z.string(),
  name: z.string(),
  parameters: z.record(z.union([z.number(), z.string(), z.boolean()])),
  tenantId: z.string().uuid(),
});

// Context bar schemas
export const contextBarSchema = z.object({
  entityId: z.string().uuid(),
  reportingDate: z.coerce.date(),
  scenario: z.enum(['base', 'upside', 'downside', 'severe', 'recovery']).default('base'),
  currency: z.string().default('GHS'),
  referenceRate: z.number().optional(),
});
