/**
 * Tourism Pressure Score
 * Higher pressure = Bad (overtourism). 
 * Hidden Gems thrive where tourism pressure is low.
 */

export const calculateTourismPressureScore = (poi, clusterStats) => {
  // Pressure is derived from:
  // 1. Total review counts (High reviews = high pressure)
  // 2. Cluster density (Dense cluster = high pressure zone)
  
  const reviewCount = poi.userRatingsTotal || 0;
  
  // Normalize review count pressure (Assumes > 5000 is massive pressure)
  const reviewPressure = Math.min(100, (reviewCount / 5000) * 100);
  
  // Cluster density pressure
  const densityPressure = clusterStats && clusterStats.isDenseZone ? 80 : 20;

  // Composite pressure
  const totalPressure = (reviewPressure * 0.6) + (densityPressure * 0.4);

  // We want to return an inverse metric: 100 means NO pressure (good), 0 means Max pressure (bad)
  return Math.max(0, 100 - totalPressure);
};
