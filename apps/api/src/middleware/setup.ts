import express, { Application } from 'express';
import cors from 'cors';
import { config } from '../config/index.js';
import { errorHandler } from './error.js';
import { tenantMiddleware } from './tenant.js';

export function setupMiddleware(app: Application) {
  app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Slug'],
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Tenant resolution on all routes
  app.use(tenantMiddleware);

  // Error handler must be last
  app.use(errorHandler);
}
