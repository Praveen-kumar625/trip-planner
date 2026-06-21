import { createQueue, createWorker } from './baseWorker.js';

export const plannerQueue = createQueue('plannerQueue');

export const plannerWorker = createWorker('plannerQueue', async (job) => {
  // TODO: ALNS and multi-agent itinerary generation logic here
  return { status: 'success', data: 'Itinerary generated' };
});
