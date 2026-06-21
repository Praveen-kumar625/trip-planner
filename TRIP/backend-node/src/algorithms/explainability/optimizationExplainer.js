/**
 * Optimization Explainer
 * Explains why a route or itinerary was optimized in a certain way.
 */

export const explainOptimization = (context, decisionData) => {
  return {
    action: `Optimized Route for ${decisionData.target || 'Day 3'}`,
    confidence: decisionData.confidence || 0.91,
    contributingFactors: [
      { factor: "Distance Minimization", weight: 0.40, score: 85 },
      { factor: "Fatigue Reduction", weight: 0.30, score: 90 },
      { factor: "Traffic Avoidance", weight: 0.30, score: 88 }
    ],
    alternatives: decisionData.alternatives || [],
    humanReadable: "The route was re-ordered to avoid peak traffic congestion at 4 PM, saving 45 minutes and reducing total driving fatigue."
  };
};
