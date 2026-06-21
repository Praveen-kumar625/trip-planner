/**
 * Sustainability Scorer
 * Fuses carbon, local impact, and diversification into a single Sustainability Score.
 */

import { estimateCarbonFootprint } from './carbonEstimator.js';
import { analyzeLocalImpact } from './localImpactAnalyzer.js';
import { analyzeTourismDiversification } from './tourismDiversification.js';

export const calculateSustainabilityScore = (itinerary) => {
  const carbon = estimateCarbonFootprint({ distanceKm: 250 }, { nights: 4 });
  const local = analyzeLocalImpact(itinerary);
  const diversification = analyzeTourismDiversification(itinerary.destinations);

  // Normalizing carbon (lower is better, assuming <150kg is great)
  const carbonNormalized = Math.max(0, 100 - (carbon.totalCarbonKg / 2));

  // Weighted fusion
  const sustainabilityScore = (carbonNormalized * 0.4) + (local.localImpactScore * 0.4) + (diversification.diversificationScore * 0.2);

  return {
    sustainabilityScore: parseFloat(sustainabilityScore.toFixed(1)),
    carbonScore: carbon,
    localImpactScore: local.localImpactScore,
    localImpactDetails: local,
    tourismPressureReduction: diversification.pressureReductionMetric,
    diversificationScore: diversification.diversificationScore
  };
};
