import { pgTable, serial, varchar, timestamp, integer, decimal, boolean, text, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';

// ─── Tenants ──────────────────────────────────────────────────────────────
export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  licenseType: varchar('license_type', { length: 50 }).notNull().default('bank'), // bank, sdi, mfb
  country: varchar('country', { length: 50 }).notNull().default('GH'),
  currency: varchar('currency', { length: 3 }).notNull().default('GHS'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex('tenants_slug_idx').on(table.slug),
}));

// ─── Users ────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  email: varchar('email', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('viewer'), // admin, alm_manager, treasury, risk, compliance, viewer
  isActive: boolean('is_active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  emailTenantIdx: uniqueIndex('users_email_tenant_idx').on(table.tenantId, table.email),
  tenantIdx: index('users_tenant_idx').on(table.tenantId),
}));

// ─── Config / Thresholds ──────────────────────────────────────────────────
export const configValues = pgTable('config_values', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  module: varchar('module', { length: 50 }).notNull(),
  key: varchar('key', { length: 100 }).notNull(),
  value: text('value').notNull(),
  dataType: varchar('data_type', { length: 20 }).notNull().default('string'), // string, number, boolean, json
  description: text('description'),
  effectiveFrom: timestamp('effective_from', { withTimezone: true }).defaultNow(),
  effectiveTo: timestamp('effective_to', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  tenantModuleKeyIdx: uniqueIndex('config_tenant_module_key_idx').on(table.tenantId, table.module, table.key),
}));

// ─── Liquidity Metrics ────────────────────────────────────────────────────
export const liquidityMetrics = pgTable('liquidity_metrics', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  reportingDate: timestamp('reporting_date', { withTimezone: true }).notNull(),
  scenario: varchar('scenario', { length: 50 }).notNull().default('base'),
  lcr: decimal('lcr', { precision: 10, scale: 4 }),
  nsfr: decimal('nsfr', { precision: 10, scale: 4 }),
  hqla: decimal('hqla', { precision: 18, scale: 2 }),
  netCashOutflows: decimal('net_cash_outflows', { precision: 18, scale: 2 }),
  availableStableFunding: decimal('available_stable_funding', { precision: 18, scale: 2 }),
  requiredStableFunding: decimal('required_stable_funding', { precision: 18, scale: 2 }),
  currency: varchar('currency', { length: 3 }).notNull().default('GHS'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  tenantDateScenarioIdx: uniqueIndex('liq_tenant_date_scenario_idx').on(table.tenantId, table.reportingDate, table.scenario),
}));

// ─── Interest Rate Risk Metrics ───────────────────────────────────────────
export const interestRateMetrics = pgTable('interest_rate_metrics', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  reportingDate: timestamp('reporting_date', { withTimezone: true }).notNull(),
  scenario: varchar('scenario', { length: 50 }).notNull().default('base'),
  eveImpact: decimal('eve_impact', { precision: 18, scale: 2 }),
  niimImpact: decimal('niim_impact', { precision: 18, scale: 2 }),
  rateShockBps: integer('rate_shock_bps').notNull().default(200),
  currency: varchar('currency', { length: 3 }).notNull().default('GHS'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  tenantDateScenarioIdx: uniqueIndex('irr_tenant_date_scenario_idx').on(table.tenantId, table.reportingDate, table.scenario),
}));

// ─── Capital Metrics ──────────────────────────────────────────────────────
export const capitalMetrics = pgTable('capital_metrics', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  reportingDate: timestamp('reporting_date', { withTimezone: true }).notNull(),
  scenario: varchar('scenario', { length: 50 }).notNull().default('base'),
  cet1Ratio: decimal('cet1_ratio', { precision: 10, scale: 4 }),
  tier1Ratio: decimal('tier1_ratio', { precision: 10, scale: 4 }),
  totalCapitalRatio: decimal('total_capital_ratio', { precision: 10, scale: 4 }),
  leverageRatio: decimal('leverage_ratio', { precision: 10, scale: 4 }),
  rwa: decimal('rwa', { precision: 18, scale: 2 }),
  currency: varchar('currency', { length: 3 }).notNull().default('GHS'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  tenantDateScenarioIdx: uniqueIndex('cap_tenant_date_scenario_idx').on(table.tenantId, table.reportingDate, table.scenario),
}));

// ─── ECL Metrics ──────────────────────────────────────────────────────────
export const eclMetrics = pgTable('ecl_metrics', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  reportingDate: timestamp('reporting_date', { withTimezone: true }).notNull(),
  scenario: varchar('scenario', { length: 50 }).notNull().default('base'),
  stage1Ecl: decimal('stage1_ecl', { precision: 18, scale: 2 }),
  stage2Ecl: decimal('stage2_ecl', { precision: 18, scale: 2 }),
  stage3Ecl: decimal('stage3_ecl', { precision: 18, scale: 2 }),
  totalEcl: decimal('total_ecl', { precision: 18, scale: 2 }),
  coverageRatio: decimal('coverage_ratio', { precision: 10, scale: 4 }),
  currency: varchar('currency', { length: 3 }).notNull().default('GHS'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  tenantDateScenarioIdx: uniqueIndex('ecl_tenant_date_scenario_idx').on(table.tenantId, table.reportingDate, table.scenario),
}));

// ─── FTP Rates ────────────────────────────────────────────────────────────
export const ftpRates = pgTable('ftp_rates', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  effectiveDate: timestamp('effective_date', { withTimezone: true }).notNull(),
  tenor: varchar('tenor', { length: 20 }).notNull(),
  rate: decimal('rate', { precision: 10, scale: 6 }).notNull(),
  curveType: varchar('curve_type', { length: 50 }).notNull().default('base'), // base, liquidity, credit
  currency: varchar('currency', { length: 3 }).notNull().default('GHS'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  tenantDateTenorIdx: uniqueIndex('ftp_tenant_date_tenor_idx').on(table.tenantId, table.effectiveDate, table.tenor, table.curveType),
}));

// ─── Macro Variables (Ghana-specific) ───────────────────────────────────
export const macroVariables = pgTable('macro_variables', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  date: timestamp('date', { withTimezone: true }).notNull(),
  variable: varchar('variable', { length: 50 }).notNull(), // gr_rate, inflation, gdp_growth, exchange_rate, tbill_91, tbill_182, tbill_364
  value: decimal('value', { precision: 18, scale: 6 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('GHS'),
  source: varchar('source', { length: 100 }), // BOG, GSS, GSE, etc.
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  tenantDateVariableIdx: uniqueIndex('macro_tenant_date_var_idx').on(table.tenantId, table.date, table.variable),
}));

// ─── Alerts ───────────────────────────────────────────────────────────────
export const alerts = pgTable('alerts', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  module: varchar('module', { length: 50 }).notNull(),
  severity: varchar('severity', { length: 20 }).notNull(), // critical, warning, info
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  metric: varchar('metric', { length: 100 }),
  threshold: decimal('threshold', { precision: 18, scale: 4 }),
  actualValue: decimal('actual_value', { precision: 18, scale: 4 }),
  isRead: boolean('is_read').notNull().default(false),
  acknowledgedBy: integer('acknowledged_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  tenantUnreadIdx: index('alerts_tenant_unread_idx').on(table.tenantId, table.isRead),
}));

// ─── Audit Log ──────────────────────────────────────────────────────────────
export const auditLog = pgTable('audit_log', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  userId: integer('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: varchar('entity_id', { length: 100 }),
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  tenantCreatedIdx: index('audit_tenant_created_idx').on(table.tenantId, table.createdAt),
}));
