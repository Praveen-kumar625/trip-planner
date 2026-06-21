/**
 * Recommendation Explainer
 * Generates the Explainable AI (XAI) output to tell the user *why* a place was recommended.
 */

export const generateExplanation = (rankedCandidate, unifiedContext) => {
  const m = rankedCandidate.metrics;
  const reasons = [];

  if (m.travelDNAMatch > 85) {
    reasons.push(`Highly matches your ${unifiedContext.travelerPersona} persona (${m.travelDNAMatch}% DNA Match)`);
  }
  
  if (m.hiddenGemScore > 80) {
    reasons.push(`Classified as a premium Hidden Gem (Score: ${m.hiddenGemScore})`);
  }

  if (m.graphSimilarity > 85) {
    reasons.push(`Loved by travelers with similar preferences to you (${m.graphSimilarity}% overlap)`);
  }

  if (m.seasonScore > 80) {
    reasons.push(`Perfect for the current season with ideal weather conditions`);
  }

  if (m.digitalTwinCompat > 90) {
    reasons.push(`Simulated Digital Twin shows zero fatigue risk for this itinerary`);
  }

  if (m.budgetMatch > 90) {
    reasons.push(`Perfectly aligns with your budget constraints`);
  }

  return {
    recommendation: rankedCandidate.name,
    type: rankedCandidate.type || 'Destination',
    confidence: rankedCandidate.finalScore,
    explanation: reasons
  };
};
