/**
 * Carbon Estimator
 * Calculates the environmental carbon impact of travel routes and accommodations.
 */

export const estimateCarbonFootprint = (transportRoute, accommodation) => {
  // Mock carbon computation
  const transportImpact = transportRoute.distanceKm * 0.12; // kg CO2 per km for avg transport
  const accommodationImpact = accommodation.nights * 15.5; // kg CO2 per night avg
  const activityImpact = 12.0;

  return {
    transportImpact,
    accommodationImpact,
    activityImpact,
    totalCarbonKg: transportImpact + accommodationImpact + activityImpact
  };
};
