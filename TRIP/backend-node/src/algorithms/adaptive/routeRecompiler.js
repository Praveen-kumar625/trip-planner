import { logger } from '../../utils/logger.js';
import { SimulatedAnnealing } from './simulatedAnnealing.js';
import { AdaptiveScorer } from './adaptiveScorer.js';

/**
 * Route Recompilation Engine
 * Pipeline orchestrator that takes a disruption, selects candidate alternatives, 
 * runs Simulated Annealing, and calculates the final adaptive score.
 */
export class RouteRecompiler {
  constructor() {
    this.annealer = new SimulatedAnnealing();
    this.scorer = new AdaptiveScorer();
  }

  /**
   * Recompiles the itinerary.
   */
  recompile(currentItinerary, disruption, impact) {
    logger.info('🔄 [RouteRecompiler] Recompiling itinerary based on disruption impact...');

    // 1. Identify candidates (e.g. Indoor activities because of Rain)
    const candidates = ["Vatican Museums", "Pantheon", "Catacombs"];

    // 2. Run Simulated Annealing Optimization
    const optimizationResult = this.annealer.optimize(currentItinerary, disruption, candidates);

    // 3. Compute Resilience KPIs
    const adaptiveScores = this.scorer.calculateScore(impact, optimizationResult);

    return {
      originalRoute: currentItinerary,
      optimizedRoute: optimizationResult.optimizedRoute,
      adaptiveScores,
      optimizationStats: {
        scoreImprovement: optimizationResult.optimizationGain,
        timeSaved: optimizationResult.timeSavedMinutes
      }
    };
  }
}
