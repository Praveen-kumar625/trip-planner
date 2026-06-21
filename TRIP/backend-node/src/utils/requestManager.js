import { logger } from './logger.js';

export class CircuitBreaker {
  constructor(failureThreshold = 5, recoveryTimeout = 30000) {
    this.failureThreshold = failureThreshold;
    this.recoveryTimeout = recoveryTimeout;
    this.failures = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = null;
  }

  async execute(action) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('CircuitBreaker is OPEN: Service is temporarily unavailable.');
      }
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.recoveryTimeout;
      logger.warn(`CircuitBreaker OPENED. Pausing requests for ${this.recoveryTimeout}ms`);
    }
  }
}

const aiCircuitBreaker = new CircuitBreaker(5, 30000);

export const withRetry = async (action, maxRetries = 3, baseDelayMs = 1000) => {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Execute the action wrapped in the circuit breaker
      return await aiCircuitBreaker.execute(action);
    } catch (error) {
      attempt++;
      
      // If CircuitBreaker is OPEN, we shouldn't keep retrying immediately, we should fail fast to fallback
      if (error.message.includes('CircuitBreaker is OPEN')) {
        throw error; 
      }

      // Check if error is a 4xx client error (except 429 rate limit), we shouldn't retry 400s
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }

      if (attempt >= maxRetries) {
        logger.error(`Action failed after ${maxRetries} attempts`, { error: error.message, stack: error.stack });
        throw error;
      }

      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      // Add jitter to avoid thundering herd
      const jitter = Math.random() * 200;
      const finalDelay = delay + jitter;

      logger.warn(`Attempt ${attempt} failed. Retrying in ${Math.round(finalDelay)}ms...`, { error: error.message });
      await new Promise(resolve => setTimeout(resolve, finalDelay));
    }
  }
};
