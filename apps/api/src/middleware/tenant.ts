import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { tenants } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

interface TenantRequest extends Request {
  tenantId?: number;
}

export async function tenantMiddleware(req: TenantRequest, res: Response, next: NextFunction): Promise<void> {
  const tenantSlug = req.headers['x-tenant-slug'] as string || 'ecobank-gh';
  
  try {
    const tenant = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug)).limit(1);
    
    if (!tenant.length || !tenant[0].isActive) {
      res.status(404).json({ error: 'Tenant not found or inactive' });
      return;
    }

    req.tenantId = tenant[0].id;
    next();
  } catch (err) {
    logger.error('Tenant lookup failed', { error: (err as Error).message, slug: tenantSlug });
    res.status(500).json({ error: 'Tenant lookup failed' });
    return;
  }
}

export { TenantRequest };
