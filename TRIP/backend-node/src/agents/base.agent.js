import { logger } from '../utils/logger.js';

export class BaseAgent {
  constructor(name, queue) {
    this.name = name;
    this.queue = queue; // Reference to BullMQ queue for dispatching sub-tasks if needed
  }

  async process(_context) {
    logger.info(`🤖 Agent [${this.name}] processing context...`);
    throw new Error('Process method must be implemented by subclass');
  }

  async dispatchEvent(eventName, _payload) {
    // Integrate with event bus / websockets
    logger.info(`📢 Agent [${this.name}] dispatched event: ${eventName}`);
  }
}
