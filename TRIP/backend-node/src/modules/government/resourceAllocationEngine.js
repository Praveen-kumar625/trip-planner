/**
 * Resource Allocation Engine
 * Predictively allocates city resources based on tourism demand.
 */

export const allocateResources = (demandForecast) => {
  return {
    deployments: [
      { type: "Police Patrols", location: "Bhedaghat", quantity: "+3 Teams", reason: "Expected weekend surge (140% capacity)" },
      { type: "Medical Units", location: "Kanha Gates", quantity: "+1 Unit", reason: "High risk profile demographic concentration" },
      { type: "Tourism Officers", location: "Airport Kiosks", quantity: "+5 Staff", reason: "Inbound flight volume spike" }
    ]
  };
};
