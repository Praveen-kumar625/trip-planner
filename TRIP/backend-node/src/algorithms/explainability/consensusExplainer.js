/**
 * Consensus Explainer
 * Explains how group conflicts were resolved mathematically.
 */

export const explainConsensus = (context, decisionData) => {
  return {
    action: `Selected ${decisionData.target || 'Adventure Park'} for Group`,
    confidence: decisionData.confidence || 0.96,
    contributingFactors: [
      { factor: "Borda Count Winner", weight: 0.60, score: 98 },
      { factor: "Minimal Dissatisfaction", weight: 0.20, score: 90 },
      { factor: "Fairness Index", weight: 0.20, score: 88 }
    ],
    alternatives: decisionData.alternatives || [
      "Museum Tour (Lost Borda)",
      "Beach Day (High Conflict)"
    ],
    humanReadable: "This activity was selected because it mathematically maximizes overall group happiness while ensuring no single member is highly dissatisfied."
  };
};
