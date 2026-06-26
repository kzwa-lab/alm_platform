import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import * as schema from './schema.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://alm:alm@localhost:5432/alm_platform',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log('🌱 Starting seed...');

  // Create demo tenant
  const [tenant] = await db.insert(schema.tenants).values({
    name: 'Ecobank Ghana PLC',
    slug: 'ecobank-gh',
    licenseType: 'bank',
    country: 'GH',
    currency: 'GHS',
  }).returning();

  console.log('✅ Created tenant:', tenant.name);

  // Create demo users
  const passwordHash = await bcrypt.hash('Password123!', 12);
  
  const [adminUser] = await db.insert(schema.users).values({
    tenantId: tenant.id,
    email: 'admin@ecobank.com.gh',
    passwordHash,
    firstName: 'Kwame',
    lastName: 'Asante',
    role: 'admin',
  }).returning();

  const [almManager] = await db.insert(schema.users).values({
    tenantId: tenant.id,
    email: 'alm@ecobank.com.gh',
    passwordHash,
    firstName: 'Ama',
    lastName: 'Mensah',
    role: 'alm_manager',
  }).returning();

  console.log('✅ Created users:', adminUser.email, almManager.email);

  // Seed liquidity metrics (12 months)
  const liquidityData = [
    { reportingDate: '2025-07-31', lcr: '134.5', nsfr: '123.2', hqla: '4200000000', netCashOutflows: '3120000000' },
    { reportingDate: '2025-08-31', lcr: '135.1', nsfr: '123.8', hqla: '4280000000', netCashOutflows: '3170000000' },
    { reportingDate: '2025-09-30', lcr: '133.8', nsfr: '122.5', hqla: '4150000000', netCashOutflows: '3100000000' },
    { reportingDate: '2025-10-31', lcr: '134.2', nsfr: '123.1', hqla: '4180000000', netCashOutflows: '3120000000' },
    { reportingDate: '2025-11-30', lcr: '135.5', nsfr: '124.0', hqla: '4250000000', netCashOutflows: '3140000000' },
    { reportingDate: '2025-12-31', lcr: '134.8', nsfr: '123.5', hqla: '4220000000', netCashOutflows: '3130000000' },
    { reportingDate: '2026-01-31', lcr: '135.2', nsfr: '124.2', hqla: '4300000000', netCashOutflows: '3180000000' },
    { reportingDate: '2026-02-28', lcr: '135.8', nsfr: '124.5', hqla: '4320000000', netCashOutflows: '3180000000' },
    { reportingDate: '2026-03-31', lcr: '136.0', nsfr: '124.6', hqla: '4350000000', netCashOutflows: '3200000000' },
    { reportingDate: '2026-04-30', lcr: '135.5', nsfr: '124.3', hqla: '4330000000', netCashOutflows: '3190000000' },
    { reportingDate: '2026-05-31', lcr: '135.8', nsfr: '124.5', hqla: '4340000000', netCashOutflows: '3190000000' },
    { reportingDate: '2026-06-30', lcr: '136.2', nsfr: '124.8', hqla: '4380000000', netCashOutflows: '3210000000' },
  ];

  for (const row of liquidityData) {
    await db.insert(schema.liquidityMetrics).values({
      tenantId: tenant.id,
      reportingDate: new Date(row.reportingDate),
      scenario: 'base',
      lcr: row.lcr,
      nsfr: row.nsfr,
      hqla: row.hqla,
      netCashOutflows: row.netCashOutflows,
      currency: 'GHS',
    });
  }
  console.log('✅ Seeded liquidity metrics');

  // Seed interest rate metrics
  const interestRateData = [
    { reportingDate: '2025-07-31', eveImpact: '-85000000', niimImpact: '-12000000', rateShockBps: 200 },
    { reportingDate: '2025-08-31', eveImpact: '-82000000', niimImpact: '-11500000', rateShockBps: 200 },
    { reportingDate: '2025-09-30', eveImpact: '-88000000', niimImpact: '-13000000', rateShockBps: 200 },
    { reportingDate: '2025-10-31', eveImpact: '-90000000', niimImpact: '-13500000', rateShockBps: 200 },
    { reportingDate: '2025-11-30', eveImpact: '-86000000', niimImpact: '-12500000', rateShockBps: 200 },
    { reportingDate: '2025-12-31', eveImpact: '-84000000', niimImpact: '-11800000', rateShockBps: 200 },
    { reportingDate: '2026-01-31', eveImpact: '-83000000', niimImpact: '-11000000', rateShockBps: 200 },
    { reportingDate: '2026-02-28', eveImpact: '-81000000', niimImpact: '-10500000', rateShockBps: 200 },
    { reportingDate: '2026-03-31', eveImpact: '-80000000', niimImpact: '-10000000', rateShockBps: 200 },
    { reportingDate: '2026-04-30', eveImpact: '-82000000', niimImpact: '-10800000', rateShockBps: 200 },
    { reportingDate: '2026-05-31', eveImpact: '-83000000', niimImpact: '-11200000', rateShockBps: 200 },
    { reportingDate: '2026-06-30', eveImpact: '-85000000', niimImpact: '-11500000', rateShockBps: 200 },
  ];

  for (const row of interestRateData) {
    await db.insert(schema.interestRateMetrics).values({
      tenantId: tenant.id,
      reportingDate: new Date(row.reportingDate),
      scenario: 'base',
      eveImpact: row.eveImpact,
      niimImpact: row.niimImpact,
      rateShockBps: row.rateShockBps,
      currency: 'GHS',
    });
  }
  console.log('✅ Seeded interest rate metrics');

  // Seed capital metrics
  const capitalData = [
    { reportingDate: '2025-07-31', cet1Ratio: '13.8', tier1Ratio: '14.5', totalCapitalRatio: '17.2', rwa: '28500000000' },
    { reportingDate: '2025-08-31', cet1Ratio: '13.9', tier1Ratio: '14.6', totalCapitalRatio: '17.3', rwa: '28600000000' },
    { reportingDate: '2025-09-30', cet1Ratio: '13.7', tier1Ratio: '14.4', totalCapitalRatio: '17.1', rwa: '28700000000' },
    { reportingDate: '2025-10-31', cet1Ratio: '13.8', tier1Ratio: '14.5', totalCapitalRatio: '17.2', rwa: '28800000000' },
    { reportingDate: '2025-11-30', cet1Ratio: '14.0', tier1Ratio: '14.7', totalCapitalRatio: '17.4', rwa: '28900000000' },
    { reportingDate: '2025-12-31', cet1Ratio: '13.9', tier1Ratio: '14.6', totalCapitalRatio: '17.3', rwa: '29000000000' },
    { reportingDate: '2026-01-31', cet1Ratio: '14.0', tier1Ratio: '14.7', totalCapitalRatio: '17.4', rwa: '29100000000' },
    { reportingDate: '2026-02-28', cet1Ratio: '14.1', tier1Ratio: '14.8', totalCapitalRatio: '17.5', rwa: '29200000000' },
    { reportingDate: '2026-03-31', cet1Ratio: '14.1', tier1Ratio: '14.8', totalCapitalRatio: '17.5', rwa: '29300000000' },
    { reportingDate: '2026-04-30', cet1Ratio: '14.0', tier1Ratio: '14.7', totalCapitalRatio: '17.4', rwa: '29400000000' },
    { reportingDate: '2026-05-31', cet1Ratio: '14.1', tier1Ratio: '14.8', totalCapitalRatio: '17.5', rwa: '29500000000' },
    { reportingDate: '2026-06-30', cet1Ratio: '14.2', tier1Ratio: '14.9', totalCapitalRatio: '17.6', rwa: '29600000000' },
  ];

  for (const row of capitalData) {
    await db.insert(schema.capitalMetrics).values({
      tenantId: tenant.id,
      reportingDate: new Date(row.reportingDate),
      scenario: 'base',
      cet1Ratio: row.cet1Ratio,
      tier1Ratio: row.tier1Ratio,
      totalCapitalRatio: row.totalCapitalRatio,
      rwa: row.rwa,
      currency: 'GHS',
    });
  }
  console.log('✅ Seeded capital metrics');

  // Seed ECL metrics
  const eclData = [
    { reportingDate: '2025-07-31', stage1Ecl: '85000000', stage2Ecl: '95000000', stage3Ecl: '55000000', totalEcl: '235000000', coverageRatio: '2.8' },
    { reportingDate: '2025-08-31', stage1Ecl: '86000000', stage2Ecl: '96000000', stage3Ecl: '56000000', totalEcl: '238000000', coverageRatio: '2.85' },
    { reportingDate: '2025-09-30', stage1Ecl: '88000000', stage2Ecl: '98000000', stage3Ecl: '58000000', totalEcl: '244000000', coverageRatio: '2.9' },
    { reportingDate: '2025-10-31', stage1Ecl: '89000000', stage2Ecl: '99000000', stage3Ecl: '59000000', totalEcl: '247000000', coverageRatio: '2.92' },
    { reportingDate: '2025-11-30', stage1Ecl: '90000000', stage2Ecl: '100000000', stage3Ecl: '60000000', totalEcl: '250000000', coverageRatio: '2.95' },
    { reportingDate: '2025-12-31', stage1Ecl: '91000000', stage2Ecl: '101000000', stage3Ecl: '61000000', totalEcl: '253000000', coverageRatio: '2.98' },
    { reportingDate: '2026-01-31', stage1Ecl: '92000000', stage2Ecl: '102000000', stage3Ecl: '62000000', totalEcl: '256000000', coverageRatio: '3.0' },
    { reportingDate: '2026-02-28', stage1Ecl: '93000000', stage2Ecl: '103000000', stage3Ecl: '63000000', totalEcl: '259000000', coverageRatio: '3.02' },
    { reportingDate: '2026-03-31', stage1Ecl: '94000000', stage2Ecl: '104000000', stage3Ecl: '64000000', totalEcl: '262000000', coverageRatio: '3.05' },
    { reportingDate: '2026-04-30', stage1Ecl: '95000000', stage2Ecl: '105000000', stage3Ecl: '65000000', totalEcl: '265000000', coverageRatio: '3.08' },
    { reportingDate: '2026-05-31', stage1Ecl: '96000000', stage2Ecl: '106000000', stage3Ecl: '66000000', totalEcl: '268000000', coverageRatio: '3.1' },
    { reportingDate: '2026-06-30', stage1Ecl: '97000000', stage2Ecl: '107000000', stage3Ecl: '67000000', totalEcl: '271000000', coverageRatio: '3.12' },
  ];

  for (const row of eclData) {
    await db.insert(schema.eclMetrics).values({
      tenantId: tenant.id,
      reportingDate: new Date(row.reportingDate),
      scenario: 'base',
      stage1Ecl: row.stage1Ecl,
      stage2Ecl: row.stage2Ecl,
      stage3Ecl: row.stage3Ecl,
      totalEcl: row.totalEcl,
      coverageRatio: row.coverageRatio,
      currency: 'GHS',
    });
  }
  console.log('✅ Seeded ECL metrics');

  // Seed macro variables (Ghana-specific)
  const macroData = [
    { date: '2025-07-31', variable: 'gr_rate', value: '29.00', source: 'BOG' },
    { date: '2025-08-31', variable: 'gr_rate', value: '28.50', source: 'BOG' },
    { date: '2025-09-30', variable: 'gr_rate', value: '28.00', source: 'BOG' },
    { date: '2025-10-31', variable: 'gr_rate', value: '27.50', source: 'BOG' },
    { date: '2025-11-30', variable: 'gr_rate', value: '27.00', source: 'BOG' },
    { date: '2025-12-31', variable: 'gr_rate', value: '26.50', source: 'BOG' },
    { date: '2026-01-31', variable: 'gr_rate', value: '26.00', source: 'BOG' },
    { date: '2026-02-28', variable: 'gr_rate', value: '25.80', source: 'BOG' },
    { date: '2026-03-31', variable: 'gr_rate', value: '25.60', source: 'BOG' },
    { date: '2026-04-30', variable: 'gr_rate', value: '25.50', source: 'BOG' },
    { date: '2026-05-31', variable: 'gr_rate', value: '25.50', source: 'BOG' },
    { date: '2026-06-30', variable: 'gr_rate', value: '25.50', source: 'BOG' },
    { date: '2025-07-31', variable: 'inflation', value: '22.5', source: 'GSS' },
    { date: '2025-08-31', variable: 'inflation', value: '22.1', source: 'GSS' },
    { date: '2025-09-30', variable: 'inflation', value: '21.8', source: 'GSS' },
    { date: '2025-10-31', variable: 'inflation', value: '21.5', source: 'GSS' },
    { date: '2025-11-30', variable: 'inflation', value: '21.2', source: 'GSS' },
    { date: '2025-12-31', variable: 'inflation', value: '20.9', source: 'GSS' },
    { date: '2026-01-31', variable: 'inflation', value: '20.5', source: 'GSS' },
    { date: '2026-02-28', variable: 'inflation', value: '20.2', source: 'GSS' },
    { date: '2026-03-31', variable: 'inflation', value: '19.8', source: 'GSS' },
    { date: '2026-04-30', variable: 'inflation', value: '19.5', source: 'GSS' },
    { date: '2026-05-31', variable: 'inflation', value: '19.3', source: 'GSS' },
    { date: '2026-06-30', variable: 'inflation', value: '19.0', source: 'GSS' },
    { date: '2025-07-31', variable: 'tbill_91', value: '25.50', source: 'BOG' },
    { date: '2025-08-31', variable: 'tbill_91', value: '25.20', source: 'BOG' },
    { date: '2025-09-30', variable: 'tbill_91', value: '24.80', source: 'BOG' },
    { date: '2025-10-31', variable: 'tbill_91', value: '24.50', source: 'BOG' },
    { date: '2025-11-30', variable: 'tbill_91', value: '24.20', source: 'BOG' },
    { date: '2025-12-31', variable: 'tbill_91', value: '23.90', source: 'BOG' },
    { date: '2026-01-31', variable: 'tbill_91', value: '23.50', source: 'BOG' },
    { date: '2026-02-28', variable: 'tbill_91', value: '23.20', source: 'BOG' },
    { date: '2026-03-31', variable: 'tbill_91', value: '22.90', source: 'BOG' },
    { date: '2026-04-30', variable: 'tbill_91', value: '22.60', source: 'BOG' },
    { date: '2026-05-31', variable: 'tbill_91', value: '22.40', source: 'BOG' },
    { date: '2026-06-30', variable: 'tbill_91', value: '22.20', source: 'BOG' },
  ];

  for (const row of macroData) {
    await db.insert(schema.macroVariables).values({
      tenantId: tenant.id,
      date: new Date(row.date),
      variable: row.variable,
      value: row.value,
      source: row.source,
    });
  }
  console.log('✅ Seeded macro variables');

  // Seed alerts
  const alertData = [
    { module: 'liquidity', severity: 'warning', title: 'LCR approaching buffer', message: 'LCR at 136.2%, buffer thinning due to GoG securities rollover', metric: 'lcr', threshold: '135.0', actualValue: '136.2' },
    { module: 'interest-rate', severity: 'critical', title: 'EVE sensitivity breach', message: 'EVE impact -₵85M exceeds Board limit of -₵80M under +200bps shock', metric: 'eve_impact', threshold: '-80000000', actualValue: '-85000000' },
    { module: 'capital', severity: 'warning', title: 'CET1 ratio declining', message: 'CET1 ratio at 14.2%, down 30bps QoQ due to RWA inflation', metric: 'cet1_ratio', threshold: '14.5', actualValue: '14.2' },
    { module: 'ecl', severity: 'info', title: 'Stage 2 migration alert', message: 'SME portfolio Stage 2 increased 8% following GSS GDP revision', metric: 'stage2_ecl', threshold: '100000000', actualValue: '107000000' },
    { module: 'ftp', severity: 'warning', title: 'FTP curve inversion', message: '1Y vs 5Y FTP spread turned negative, review pricing strategy', metric: 'ftp_spread', threshold: '0.5', actualValue: '-0.2' },
  ];

  for (const row of alertData) {
    await db.insert(schema.alerts).values({
      tenantId: tenant.id,
      module: row.module,
      severity: row.severity,
      title: row.title,
      message: row.message,
      metric: row.metric,
      threshold: row.threshold,
      actualValue: row.actualValue,
      isRead: false,
    });
  }
  console.log('✅ Seeded alerts');

  // Seed config values
  const configData = [
    { module: 'liquidity', key: 'lcr_minimum', value: '100', dataType: 'number', description: 'BOG minimum LCR requirement' },
    { module: 'liquidity', key: 'nsfr_minimum', value: '100', dataType: 'number', description: 'BOG minimum NSFR requirement' },
    { module: 'capital', key: 'cet1_minimum', value: '10.5', dataType: 'number', description: 'Minimum CET1 ratio for banks' },
    { module: 'capital', key: 'total_capital_minimum', value: '13.0', dataType: 'number', description: 'Minimum total capital ratio' },
    { module: 'interest-rate', key: 'eve_limit', value: '-80000000', dataType: 'number', description: 'Board EVE impact limit (GHS)' },
    { module: 'interest-rate', key: 'niim_limit', value: '-15000000', dataType: 'number', description: 'Board NIM impact limit (GHS)' },
    { module: 'ecl', key: 'coverage_minimum', value: '2.5', dataType: 'number', description: 'Minimum ECL coverage ratio %' },
    { module: 'ftp', key: 'liquidity_premium', value: '0.75', dataType: 'number', description: 'FTP liquidity premium (%)' },
  ];

  for (const row of configData) {
    await db.insert(schema.configValues).values({
      tenantId: tenant.id,
      module: row.module,
      key: row.key,
      value: row.value,
      dataType: row.dataType,
      description: row.description,
    });
  }
  console.log('✅ Seeded config values');

  console.log('\n🎉 Seed complete!');
  console.log('Demo tenant: ecobank-gh');
  console.log('Login: admin@ecobank.com.gh / Password123!');
  console.log('Login: alm@ecobank.com.gh / Password123!');

  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
