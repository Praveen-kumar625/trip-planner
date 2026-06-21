import { logger } from '../../utils/logger.js';

/**
 * Impact Calculator
 * Determines the exact quantitative damage a disruption causes to the itinerary.
 */
export class ImpactCalculator {
  /**
   * Calculates the delta in metrics.
   */
  calculateImpact(disruption, currentItinerary) {
    logger.debug('📉 [ImpactCalculator] Computing time/cost/fatigue damage...');

    // Mock computation based on the Weather Disruption
    return {
      impactScore: 78,
      travelScoreDelta: -12,
      fatigueDelta: +18, // Extra fatigue navigating rain
      timeLostMinutes: 120,
      costIncrease: 0
    };
  }
}
