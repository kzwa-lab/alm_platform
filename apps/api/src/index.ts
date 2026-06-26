import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { setupMiddleware } from './middleware/setup.js';
import { setupRoutes } from './modules/setup.js';
import { setupJobs } from './jobs/setup.js';
import express, { Application } from 'express';

const app: Application = express();

setupMiddleware(app);
setupRoutes(app);
setupJobs();

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`ALM API server running on port ${PORT} in ${config.env} mode`);
});

export default app;
