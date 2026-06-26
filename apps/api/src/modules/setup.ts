import { Application } from 'express';
import authRoutes from './auth/routes.js';
import dashboardRoutes from './dashboard/routes.js';

export function setupRoutes(app: Application) {
  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}
