import app from '../src/app';
import { config } from '../src/config';
import logger from '../src/utils/logger';
import { connectQueue } from '../src/services/queueService';

const startServer = async () => {
  try {
    await connectQueue();
    
    app.listen(config.port, () => {
      logger.info(`Notification Service running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 