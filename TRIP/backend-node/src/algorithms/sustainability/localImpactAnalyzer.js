/**
 * Local Impact Analyzer
 * Measures how much a trip economically benefits the local community.
 */

export const analyzeLocalImpact = (itinerary) => {
  // Mock logic
  return {
    localBusinessesSupported: 8,
    independentVendors: 5,
    communityExperiences: 2,
    localGuidesEmployed: 1,
    economicLeakageScore: 0.15, // Low is better (money stays local)
    localImpactScore: 88 // Out of 100
  };
};
