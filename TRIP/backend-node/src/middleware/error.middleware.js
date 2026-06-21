import { logger } from '../utils/logger.js';
import { randomUUID } from 'crypto';

export const errorHandler = (err, req, res, next) => {
  const incidentId = randomUUID();

  logger.error('Unhandled System Error:', {
    incidentId,
    path: req.originalUrl,
    method: req.method,
    error: err.message,
    stack: err.stack,
    body: req.body
  });

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      incidentId,
      source: 'backend-validation',
      failureType: 'ValidationError',
      message: 'Input validation failed',
      errors: err.errors,
      recoveryAction: 'Please check your input and try again.',
    });
  }

  // Gemini specific error mapping
  const errorMessage = err.message || '';
  let statusCode = err.status || err.statusCode || 500;
  let failureType = err.name || 'InternalServerError';
  let recoveryAction = 'Please retry or contact support with the incident ID.';

  if (errorMessage.includes('API key not valid') || errorMessage.includes('API_KEY_INVALID')) {
    statusCode = 401;
    failureType = 'InvalidApiKeyError';
    recoveryAction = 'Please check the Gemini API key configuration in the backend.';
  } else if (errorMessage.includes('quota') || errorMessage.includes('429')) {
    statusCode = 429;
    failureType = 'QuotaExceededError';
    recoveryAction = 'AI request quota exceeded. Please try again later or upgrade the plan.';
  } else if (errorMessage.includes('safety') || errorMessage.includes('block')) {
    statusCode = 403;
    failureType = 'SafetyBlockError';
    recoveryAction = 'The request was blocked by AI safety filters. Please adjust your prompt.';
  } else if (errorMessage.includes('timeout') || err.code === 'ETIMEDOUT') {
    statusCode = 504;
    failureType = 'TimeoutError';
    recoveryAction = 'The AI service timed out. Please try again.';
  }
  
  res.status(statusCode).json({
    success: false,
    incidentId,
    source: 'backend-express',
    failureType,
    message: err.message || 'An internal system error occurred.',
    recoveryAction,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
