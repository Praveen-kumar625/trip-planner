import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let io;

export const initWebSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [env.FRONTEND_URL, 'http://localhost:5173'],
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    logger.info(`🔌 Client connected to WebSocket: ${socket.id}`);

    // Join user-specific room
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      logger.info(`User ${userId} joined their personal room`);
    });

    // Join trip-specific room for group consensus
    socket.on('join_trip_room', (tripId) => {
      socket.join(`trip_${tripId}`);
      logger.info(`Client joined trip room: ${tripId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Client disconnected from WebSocket: ${socket.id}`);
    });
  });

  return io;
};

export const getWebSocketServer = () => {
  if (!io) {
    throw new Error('WebSocket server not initialized');
  }
  return io;
};
