import { logger } from '../utils/logger.js';

export const sseManager = {
  clients: new Map(),

  addClient(req, res, userId) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId).add(res);

    logger.info(`📡 SSE Client connected for user: ${userId}`);

    // Send initial connection success message
    this.sendToUser(userId, 'connected', { status: 'success', message: 'SSE stream established' });

    req.on('close', () => {
      this.removeClient(userId, res);
    });
  },

  removeClient(userId, res) {
    if (this.clients.has(userId)) {
      this.clients.get(userId).delete(res);
      if (this.clients.get(userId).size === 0) {
        this.clients.delete(userId);
      }
      logger.info(`📡 SSE Client disconnected for user: ${userId}`);
    }
  },

  sendToUser(userId, event, data) {
    if (this.clients.has(userId)) {
      const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      this.clients.get(userId).forEach(res => res.write(payload));
    }
  },

  broadcast(event, data) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const connections of this.clients.values()) {
      connections.forEach(res => res.write(payload));
    }
  }
};
