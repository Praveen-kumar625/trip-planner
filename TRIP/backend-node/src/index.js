import { createServer } from './api/server.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { initWebSocketServer } from './api/websocket.js';

const start = async () => {
  try {
    const app = createServer();
    const port = env.PORT || 8000;

    const server = app.listen(port, () => {
      logger.info(`🚀 WANDERSYNC AI Backend running on port ${port} in ${env.NODE_ENV} mode`);
    });

    // Initialize WebSockets
    initWebSocketServer(server);
    logger.info('🔌 WebSocket server initialized');

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
