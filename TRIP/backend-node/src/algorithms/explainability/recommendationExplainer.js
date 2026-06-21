/**
 * Recommendation Explainer
 * Generates human-readable explanations for destination and activity recommendations.
 */

export const explainRecommendation = (context, decisionData) => {
  // Mock generation of unified explanation object
  return {
    action: `Recommend ${decisionData.target || 'Tirthan Valley'}`,
    confidence: decisionData.confidence || 0.93,
    contributingFactors: [
      { factor: "Nature Affinity (DNA)", weight: 0.25, score: 92 },
      { factor: "Hidden Gem Score", weight: 0.20, score: 88 },
      { factor: "Community Graph Match", weight: 0.15, score: 85 },
      { factor: "Seasonality Optimal", weight: 0.10, score: 95 }
    ],
    alternatives: decisionData.alternatives || [
      "Jibhi",
      "Kalga",
      "Shangarh"
    ],
    humanReadable: "This location strongly matches your Nature Seeker persona, has very low tourism pressure right now, and is highly rated by travelers with similar interests."
  };
};
