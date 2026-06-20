import { aiChatSchema } from './schemas.js';
import { TravelOrchestrator } from '../../agents/orchestrator.js';
import { AgentMemory } from '../../memory/session.memory.js';
import { logger } from '../../utils/logger.js';

export const handleQuery = async (req, res, next) => {
  try {
    const { query, sessionId, context, history } = aiChatSchema.parse(req.body);
    const result = await TravelOrchestrator.handleUserQuery(req.user.uid, sessionId, query, context, history);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ status: 'error', errors: error.errors });
    next(error);
  }
};

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
      (token) => {
        res.write(`data: ${JSON.stringify({ type: 'token', content: token })}\n\n`);
      },
      (toolArgs) => {
        res.write(`data: ${JSON.stringify({ type: 'structured', data: toolArgs })}\n\n`);
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
    logger.error('Stream error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'An internal error occurred' })}\n\n`);
    res.end();
  }
};

export const getSessionHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const history = await AgentMemory.getSessionHistory(req.user.uid, sessionId);
    res.status(200).json({ status: 'success', data: history });
  } catch (error) {
    next(error);
  }
};
