import express from 'express';
import { errorHandler } from '../src/middlewares/errorHandler';
import { healthCheckRouter } from '../src/routes/healthCheck';
import logger from '../src/utils/logger';

const app = express();

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/health', healthCheckRouter);

// Error handling
app.use(errorHandler);

export default app; 