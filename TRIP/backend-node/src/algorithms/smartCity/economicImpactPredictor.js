/**
 * Economic Impact Predictor
 * Estimates total expenditure and economic injection into the local economy.
 */

export const predictEconomicImpact = (demandForecast) => {
  return {
    estimatedRevenueUsd: 1250000,
    breakdown: {
      hotels: 650000,
      restaurants: 350000,
      transport: 150000,
      activities: 100000
    },
    leakageRate: 0.22 // 22% of revenue leaves the local economy
  };
};
