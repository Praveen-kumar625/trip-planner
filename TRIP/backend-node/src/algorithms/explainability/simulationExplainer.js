/**
 * Simulation Explainer
 * Explains Digital Twin predictions (e.g., fatigue warnings).
 */

export const explainSimulation = (context, decisionData) => {
  return {
    action: `Fatigue Warning for ${decisionData.target || 'Trek Segment'}`,
    confidence: decisionData.confidence || 0.88,
    contributingFactors: [
      { factor: "Elevation Gain", weight: 0.50, score: 95 },
      { factor: "Temperature Stress", weight: 0.30, score: 80 },
      { factor: "Prior Day Load", weight: 0.20, score: 75 }
    ],
    alternatives: decisionData.alternatives || [
      "Add 2 Rest Stops",
      "Switch to easier trail"
    ],
    humanReadable: "Simulated journey load index exceeded safe thresholds due to an extreme elevation gain combined with afternoon heat. Recommending rest stops."
  };
};
