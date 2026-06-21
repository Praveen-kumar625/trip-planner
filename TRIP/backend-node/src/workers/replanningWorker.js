import { createQueue, createWorker } from './baseWorker.js';
import { sseManager } from '../api/sse.js';
import { DisruptionAnalyzer } from '../algorithms/adaptive/disruptionAnalyzer.js';
import { ImpactCalculator } from '../algorithms/adaptive/impactCalculator.js';
import { RouteRecompiler } from '../algorithms/adaptive/routeRecompiler.js';
import { logger } from '../utils/logger.js';

export const replanningQueue = createQueue('replanningQueue');

export const replanningWorker = createWorker('replanningQueue', async (job) => {
  const { tripId, currentItinerary, externalEventStream } = job.data;
  logger.info(`🤖 [ReplanningWorker] Autonomous Replanning triggered for trip ${tripId}`);

  // 1. Detect Disruption
  const disruptionAnalyzer = new DisruptionAnalyzer();
  const disruption = disruptionAnalyzer.detect(externalEventStream, currentItinerary);

  if (!disruption) {
    logger.info(`[ReplanningWorker] No actionable disruptions detected.`);
    return { status: 'skipped' };
  }

  // 2. Calculate Impact
  const impactCalculator = new ImpactCalculator();
  const impact = impactCalculator.calculateImpact(disruption, currentItinerary);

  // 3. Recompile Route (Simulated Annealing + Scoring)
  const routeRecompiler = new RouteRecompiler();
  const recompilationResult = routeRecompiler.recompile(currentItinerary, disruption, impact);

  const payload = {
    tripId,
    disruption,
    impact,
    recompilationResult,
    explanation: {
      reason: `Re-routed due to ${disruption.type} alert (${disruption.severity} severity).`,
      benefit: `Recovered ${recompilationResult.optimizationStats.scoreImprovement} Travel Score points.`,
      confidence: 0.95
    }
  };

  // 4. SSE Broadcast to UI (Live Mission Feed)
  const channel = `trip:${tripId}`;
  sseManager.broadcast(channel, {
    type: 'replanning:completed',
    data: payload
  });

  logger.info(`✅ [ReplanningWorker] Autonomous Re-routing successful. Broadcasted to ${channel}`);
  return { status: 'success', data: payload };
});
