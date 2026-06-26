import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users, tenants } from '../../db/schema.js';
import { config } from '../../config/index.js';
import { authenticateToken, AuthRequest } from '../../middleware/auth.js';

const router: Router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }

  const tenantSlug = req.headers['x-tenant-slug'] as string || 'ecobank-gh';
  const tenant = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug)).limit(1);
  
  if (!tenant.length) {
    res.status(404).json({ error: 'Tenant not found' });
    return;
  }

  const user = await db.select().from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user.length || user[0].tenantId !== tenant[0].id) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, user[0].passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign(
    { userId: user[0].id, tenantId: user[0].tenantId, email: user[0].email },
    config.jwtSecret as jwt.Secret,
    { expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
  );

  res.json({
    token,
    user: {
      id: user[0].id,
      email: user[0].email,
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      role: user[0].role,
      tenantId: user[0].tenantId,
    },
  });
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const user = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);
  if (!user.length) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    id: user[0].id,
    email: user[0].email,
    firstName: user[0].firstName,
    lastName: user[0].lastName,
    role: user[0].role,
    tenantId: user[0].tenantId,
  });
});

export default router;
