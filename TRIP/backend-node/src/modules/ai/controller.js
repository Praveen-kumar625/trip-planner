import { aiChatSchema } from './schemas.js';
import { TravelOrchestrator } from '../../agents/orchestrator.js';
import { AgentMemory } from '../../memory/session.memory.js';
import { logger } from '../../utils/logger.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { randomUUID } from 'crypto';
import { fallbackTripData } from '../../agents/fallback.js';

export const handleQuery = catchAsync(async (req, res, next) => {
  try {
    const { query, sessionId, context, history } = aiChatSchema.parse(req.body);
    const result = await TravelOrchestrator.handleUserQuery(req.user.uid, sessionId, query, context, history);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ status: 'error', errors: error.errors });
    throw error;
  }
});

export const handleStreamQuery = async (req, res, next) => {
  try {
    const { query, sessionId, context, history } = aiChatSchema.parse(req.body);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await TravelOrchestrator.handleUserQueryStream(
      req.user.uid, 
      sessionId, 
      query, 
      context, 
      history,
      (eventObj) => {
        res.write(`data: ${JSON.stringify(eventObj)}\n\n`);
      }
    );

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    if (error.name === 'ZodError') {
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Invalid request parameters' })}\n\n`);
      res.end();
      return;
    }
    
    const incidentId = randomUUID();
    logger.error('Stream controller execution failed', { error: error.message, stack: error.stack, incidentId });

    let errorPayload = { type: 'error', message: 'An internal system error occurred.', incidentId };
    
    const errorMessage = error.message || '';
    if (errorMessage.includes('invalid_api_key') || errorMessage.includes('API key not valid')) {
      errorPayload = { type: 'error', message: 'Invalid API Key. Please check the backend configuration.', code: 'INVALID_API_KEY' };
    } else if (errorMessage.includes('insufficient_quota') || errorMessage.includes('quota') || errorMessage.includes('429')) {
      errorPayload = { type: 'error', message: 'AI request quota exceeded or rate limited.', code: 'QUOTA_EXCEEDED' };
    } else if (errorMessage.includes('content_policy_violation') || errorMessage.includes('safety')) {
      errorPayload = { type: 'error', message: 'The request was blocked by AI safety filters.', code: 'SAFETY_BLOCK' };
    }

    res.write(`data: ${JSON.stringify(errorPayload)}\n\n`);

    // Only send fallback data if it's not a critical config error like invalid API key
    if (errorPayload.code !== 'INVALID_API_KEY' && errorPayload.code !== 'QUOTA_EXCEEDED') {
      res.write(`data: ${JSON.stringify({ type: 'module_update', module: 'fallback', data: fallbackTripData })}\n\n`);
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  }
};

export const getSessionHistory = catchAsync(async (req, res, next) => {
  const { sessionId } = req.params;
  const history = await AgentMemory.getSessionHistory(req.user.uid, sessionId);
  res.status(200).json({ status: 'success', data: history });
});
