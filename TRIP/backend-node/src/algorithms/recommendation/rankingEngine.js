/**
 * Multi-Signal Ranking Engine
 * Calculates the Final Recommendation Score.
 */

export const rankRecommendations = (candidates, unifiedContext, similarity, seasonality) => {
  return candidates.map(candidate => {
    const travelDNAMatch = candidate.dnaMatch || 80;
    const hiddenGemScore = candidate.hiddenGemScore || 50;
    const graphSimilarity = similarity.similarityScore || 70;
    const digitalTwinCompat = candidate.digitalTwinCompat || 85;
    const budgetMatch = candidate.budgetMatch || 90;
    const seasonScore = seasonality.seasonalityScore || 75;
    const sustainability = candidate.sustainabilityScore || 80;
    const consensusCompat = candidate.consensusCompat || 100;

    // Recommendation Formula v2
    const finalScore = 
      (0.25 * travelDNAMatch) +
      (0.20 * hiddenGemScore) +
      (0.15 * graphSimilarity) +
      (0.10 * digitalTwinCompat) +
      (0.10 * budgetMatch) +
      (0.10 * seasonScore) +
      (0.05 * sustainability) +
      (0.05 * consensusCompat);

    return {
      ...candidate,
      metrics: {
        travelDNAMatch,
        hiddenGemScore,
        graphSimilarity,
        digitalTwinCompat,
        budgetMatch,
        seasonScore,
        sustainability,
        consensusCompat
      },
      finalScore: parseFloat(finalScore.toFixed(2))
    };
  }).sort((a, b) => b.finalScore - a.finalScore);
};
