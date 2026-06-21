import { createQueue, createWorker } from './baseWorker.js';
import { DaySimulator } from '../algorithms/daySimulator.js';
import { sseManager } from '../api/sse.js';
import { logger } from '../utils/logger.js';

export const simulationQueue = createQueue('simulationQueue');

export const simulationWorker = createWorker('simulationQueue', async (job) => {
  const { tripId, userId, itinerary } = job.data;
  logger.info(`[SimulationWorker] Starting Digital Twin simulation for trip ${tripId}`);

  // Send SSE start event
  sseManager.sendToUser(userId, 'simulation_started', { tripId, status: 'Simulating Journey Load Index...' });

  const simulator = new DaySimulator(itinerary, { ageGroup: 'adult', travelStyle: 'adventure' });
  
  // Pipeline: JLI -> Fatigue -> Risk -> Timeline
  const result = await simulator.simulateDay();

  // Send final result via SSE
  sseManager.sendToUser(userId, 'simulation_completed', { tripId, result });

  // Store result in DB (Mocked for now)
  // await db.query('UPDATE trips SET simulation_results = $1 WHERE id = $2', [result, tripId]);

  return { status: 'success', data: result };
});
