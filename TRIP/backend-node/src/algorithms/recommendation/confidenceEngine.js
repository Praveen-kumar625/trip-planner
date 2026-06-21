/**
 * Confidence Engine
 * Determines how reliable the recommendation is.
 */

export const calculateConfidence = (unifiedContext, graphSimilarity) => {
  let confidenceScore = 80;

  // Increase confidence if we have strong DNA and graph data
  if (unifiedContext.dnaAffinities && Object.keys(unifiedContext.dnaAffinities).length > 3) {
    confidenceScore += 5;
  }

  if (graphSimilarity.similarUsers && graphSimilarity.similarUsers.length > 0) {
    confidenceScore += 10;
  }

  // Deduct if budget or environmental data is missing
  if (!unifiedContext.budgetLimit) confidenceScore -= 10;
  if (unifiedContext.environmentalContext.season === 'Unknown') confidenceScore -= 5;

  return {
    confidenceScore: Math.min(99, confidenceScore), // Never 100%
    explanationConfidence: Math.min(99, confidenceScore + 2),
    dataCoverage: {
      dna: true,
      graph: true,
      digitalTwin: true,
      hiddenGems: true
    }
  };
};
