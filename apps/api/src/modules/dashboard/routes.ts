import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../../middleware/auth.js';
import { db } from '../../db/index.js';
import { liquidityMetrics, interestRateMetrics, capitalMetrics, eclMetrics, alerts, macroVariables } from '../../db/schema.js';
import { eq, and, desc, gte } from 'drizzle-orm';

const router: Router = Router();

// GET /api/dashboard/summary
router.get('/summary', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  const reportingDate = new Date('2026-06-30');

  const [liquidity] = await db.select().from(liquidityMetrics)
    .where(and(
      eq(liquidityMetrics.tenantId, tenantId),
      eq(liquidityMetrics.reportingDate, reportingDate),
      eq(liquidityMetrics.scenario, 'base')
    )).limit(1);

  const [interestRate] = await db.select().from(interestRateMetrics)
    .where(and(
      eq(interestRateMetrics.tenantId, tenantId),
      eq(interestRateMetrics.reportingDate, reportingDate),
      eq(interestRateMetrics.scenario, 'base')
    )).limit(1);

  const [capital] = await db.select().from(capitalMetrics)
    .where(and(
      eq(capitalMetrics.tenantId, tenantId),
      eq(capitalMetrics.reportingDate, reportingDate),
      eq(capitalMetrics.scenario, 'base')
    )).limit(1);

  const [ecl] = await db.select().from(eclMetrics)
    .where(and(
      eq(eclMetrics.tenantId, tenantId),
      eq(eclMetrics.reportingDate, reportingDate),
      eq(eclMetrics.scenario, 'base')
    )).limit(1);

  const recentAlerts = await db.select().from(alerts)
    .where(and(eq(alerts.tenantId, tenantId), eq(alerts.isRead, false)))
    .orderBy(desc(alerts.createdAt))
    .limit(5);

  res.json({
    liquidity: liquidity || null,
    interestRate: interestRate || null,
    capital: capital || null,
    ecl: ecl || null,
    alerts: recentAlerts,
  });
});

// GET /api/dashboard/trends
router.get('/trends', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  const months = parseInt(req.query.months as string || '12');
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  const lcrTrend = await db.select({
    reportingDate: liquidityMetrics.reportingDate,
    lcr: liquidityMetrics.lcr,
    nsfr: liquidityMetrics.nsfr,
  }).from(liquidityMetrics)
    .where(and(
      eq(liquidityMetrics.tenantId, tenantId),
      gte(liquidityMetrics.reportingDate, cutoffDate),
      eq(liquidityMetrics.scenario, 'base')
    ))
    .orderBy(liquidityMetrics.reportingDate);

  const capitalTrend = await db.select({
    reportingDate: capitalMetrics.reportingDate,
    cet1Ratio: capitalMetrics.cet1Ratio,
    totalCapitalRatio: capitalMetrics.totalCapitalRatio,
  }).from(capitalMetrics)
    .where(and(
      eq(capitalMetrics.tenantId, tenantId),
      gte(capitalMetrics.reportingDate, cutoffDate),
      eq(capitalMetrics.scenario, 'base')
    ))
    .orderBy(capitalMetrics.reportingDate);

  const eclTrend = await db.select({
    reportingDate: eclMetrics.reportingDate,
    stage1Ecl: eclMetrics.stage1Ecl,
    stage2Ecl: eclMetrics.stage2Ecl,
    stage3Ecl: eclMetrics.stage3Ecl,
  }).from(eclMetrics)
    .where(and(
      eq(eclMetrics.tenantId, tenantId),
      gte(eclMetrics.reportingDate, cutoffDate),
      eq(eclMetrics.scenario, 'base')
    ))
    .orderBy(eclMetrics.reportingDate);

  res.json({
    liquidity: lcrTrend,
    capital: capitalTrend,
    ecl: eclTrend,
  });
});

// GET /api/dashboard/macro
router.get('/macro', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const tenantId = req.user!.tenantId;
  const variable = req.query.variable as string;
  const months = parseInt(req.query.months as string || '12');
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  const query = db.select().from(macroVariables)
    .where(and(
      eq(macroVariables.tenantId, tenantId),
      gte(macroVariables.date, cutoffDate),
      ...(variable ? [eq(macroVariables.variable, variable)] : [])
    ))
    .orderBy(macroVariables.date);

  const data = await query;
  res.json(data);
});

export default router;
