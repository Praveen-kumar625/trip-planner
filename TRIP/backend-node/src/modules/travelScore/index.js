/**
 * Travel Score Engine
 * The central nervous system for ranking and evaluating itineraries.
 */

export class TravelScoreEngine {
  constructor() {
    this.weights = {
      satisfaction: 0.30,
      cost: 0.20,
      comfort: 0.15,
      diversity: 0.15,
      hiddenGemFactor: 0.10,
      sustainability: 0.10
    };
  }

  /**
   * Calculates the master TripScore based on 6 weighted pillars.
   * @param {Object} metrics - The raw metrics from simulation and DNA.
   * @returns {number} The final TripScore (0-100).
   */
  calculateTripScore(metrics) {
    const score = 
      (metrics.satisfaction * this.weights.satisfaction) +
      (metrics.costEfficiency * this.weights.cost) +
      (metrics.comfort * this.weights.comfort) +
      (metrics.diversity * this.weights.diversity) +
      (metrics.hiddenGems * this.weights.hiddenGemFactor) +
      (metrics.sustainability * this.weights.sustainability);

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Evaluate a single activity's isolated contribution.
   */
  scoreActivity(activity, userVector) {
    // Determine activity score against User Travel Vector
    let score = 50; 
    
    // Example: If user has high adventureScore and activity is high adventure, boost score.
    if (userVector && activity.tags) {
      if (userVector.adventureScore > 70 && activity.tags.includes('adventure')) score += 20;
      if (userVector.budgetScore < 30 && activity.cost > 100) score -= 30; // low budget tolerance
    }
    
    return Math.min(100, Math.max(0, score));
  }
}

export const travelScoreEngine = new TravelScoreEngine();
