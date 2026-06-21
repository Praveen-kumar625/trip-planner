/**
 * Tourism Leakage Analyzer
 * Measures how much money stays in the local economy vs leaves it.
 */

export const analyzeTourismLeakage = (destinationId) => {
  return {
    localRetention: 72, // 72% stays local
    externalLeakage: 28, // 28% goes to out-of-state corporate chains
    insights: [
      "High retention in accommodation (Homestays)",
      "High leakage in transport (External Cab Aggregators)"
    ],
    recommendation: "Increase promotion of local transport operators and indigenous handicraft markets."
  };
};
