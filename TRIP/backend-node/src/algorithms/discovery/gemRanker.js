import { calculateLocalEconomyScore } from './localEconomyScore.js';
import { calculateTourismPressureScore } from './tourismPressureScore.js';
import { calculateAuthenticityScore } from './authenticityScore.js';

/**
 * Gem Ranker
 * Calculates the definitive 'Hidden Gem Score' using the enhanced formula.
 */

export const rankHiddenGems = (clusteredPoints, clusterZones) => {
  return clusteredPoints.map(poi => {
    // 1. Popularity Inversion (Lower ratings count = higher inversion)
    const reviewCount = poi.userRatingsTotal || 0;
    const popularityInverse = Math.max(0, 100 - (Math.min(reviewCount, 5000) / 50)); 
    
    // 2. Review Quality (Normalize 0-5 to 0-100)
    const reviewQuality = (poi.rating || 0) * 20;
    
    // 3. Authenticity
    const authenticity = calculateAuthenticityScore(poi);
    
    // 4. Accessibility (Mocked for now - assume 70 average)
    const accessibility = 70; 
    
    // 5. Sustainability (Inverse of tourism pressure)
    const zoneInfo = clusterZones[poi.clusterId];
    const sustainability = calculateTourismPressureScore(poi, zoneInfo); // 100 = highly sustainable/low pressure
    
    // 6. Local Economy Impact
    const localEconomy = calculateLocalEconomyScore(poi);

    // Final Formula:
    // 0.25 × Review Quality + 0.20 × Authenticity + 0.15 × Accessibility + 
    // 0.15 × Sustainability + 0.15 × Local Economy + 0.10 × Popularity Inversion
    
    const hiddenGemScore = 
      (0.25 * reviewQuality) +
      (0.20 * authenticity) +
      (0.15 * accessibility) +
      (0.15 * sustainability) +
      (0.15 * localEconomy) +
      (0.10 * popularityInverse);

    return {
      ...poi,
      discoveryMetrics: {
        reviewQuality,
        authenticity,
        accessibility,
        sustainability,
        localEconomy,
        popularityInverse,
        hiddenGemScore: parseFloat(hiddenGemScore.toFixed(2))
      }
    };
  }).sort((a, b) => b.discoveryMetrics.hiddenGemScore - a.discoveryMetrics.hiddenGemScore); // Sort highest gem first
};
