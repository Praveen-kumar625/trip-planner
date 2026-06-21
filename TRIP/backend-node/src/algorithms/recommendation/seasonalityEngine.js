/**
 * Seasonality Engine
 * Evaluates the current month against historical tourism cycles and weather.
 */

export const evaluateSeasonality = (destination, currentMonth, weather) => {
  let seasonalityScore = 50;
  let confidence = 0;

  // Extremely basic mock for demo
  const peakMonths = ['May', 'June', 'October', 'November'];
  const shoulderMonths = ['March', 'April', 'September'];
  
  if (peakMonths.includes(currentMonth)) {
    seasonalityScore = 90;
    confidence = 0.95;
  } else if (shoulderMonths.includes(currentMonth)) {
    seasonalityScore = 80;
    confidence = 0.85;
  } else {
    seasonalityScore = 40; // Off-season or extreme weather
    confidence = 0.90;
  }

  // Adjust for active weather alerts
  if (weather?.activeAlerts?.includes('Heavy Rain')) {
    seasonalityScore -= 30;
  }

  return {
    seasonalityScore: Math.max(0, seasonalityScore),
    bestTravelWindow: shoulderMonths.join(', '),
    confidence
  };
};
