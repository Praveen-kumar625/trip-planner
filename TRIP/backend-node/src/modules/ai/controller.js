import { aiChatSchema } from './schemas.js';
import { TravelOrchestrator } from '../../agents/orchestrator.js';
import { AgentMemory } from '../../memory/session.memory.js';

export const handleQuery = async (req, res, next) => {
  try {
    const { query, sessionId } = aiChatSchema.parse(req.body);
    const result = await TravelOrchestrator.handleUserQuery(req.user.uid, sessionId, query);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ status: 'error', errors: error.errors });
    next(error);
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
