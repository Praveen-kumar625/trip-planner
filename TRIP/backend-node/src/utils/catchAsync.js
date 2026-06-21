import { logger } from './logger.js';
import { randomUUID } from 'crypto';

export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      const incidentId = randomUUID();
      
      logger.error('Unhandled Controller Error', {
        incidentId,
        path: req.originalUrl,
        method: req.method,
        error: error.message,
        stack: error.stack
      });

      res.status(error.status || 500).json({
        success: false,
        incidentId,
        source: 'backend-api',
        failureType: error.name || 'InternalServerError',
        message: 'An internal system error occurred.',
        recoveryAction: 'Please retry or contact support with the incident ID.'
      });
    });
  };
};
