import express from 'express';
import { simulationQueue } from '../../workers/simulationWorker.js';
import { sseManager } from '../../api/sse.js';

const router = express.Router();

/**
 * POST /api/v1/simulation/start
 * Triggers the Digital Twin Simulation Worker
 */
router.post('/start', async (req, res) => {
  const { tripId, itinerary } = req.body;
  const userId = req.user?.id || 'mock-user-123'; // Mock user

  await simulationQueue.add('simulate-trip', { tripId, userId, itinerary }, {
    priority: 2,
    attempts: 2
  });

  res.status(200).json({ status: 'simulation_queued', tripId });
});

/**
 * GET /api/v1/simulation/:tripId
 * Gets the last calculated simulation state
 */
router.get('/:tripId', async (req, res) => {
  const { tripId } = req.params;
  // Mock response for DB retrieval
  res.status(200).json({ status: 'success', tripId, state: 'No data yet. Run simulation.' });
});

/**
 * GET /api/v1/simulation/:tripId/stream
 * Connects to SSE for live simulation updates
 */
router.get('/:tripId/stream', (req, res) => {
  const userId = req.user?.id || 'mock-user-123';
  sseManager.addClient(req, res, userId);
});

/**
 * POST /api/v1/simulation/recalculate
 * Triggers a recalculation based on changed params
 */
router.post('/recalculate', async (req, res) => {
  const { tripId, itinerary } = req.body;
  const userId = req.user?.id || 'mock-user-123';

  await simulationQueue.add('simulate-trip', { tripId, userId, itinerary }, {
    priority: 1
  });

  res.status(200).json({ status: 'recalculation_queued', tripId });
});

export default router;
