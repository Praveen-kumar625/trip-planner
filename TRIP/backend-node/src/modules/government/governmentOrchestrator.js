/**
 * Government Orchestrator
 * Central aggregation layer for the Government Mission Control.
 */

import { generatePolicyIntervention } from './policyEngine.js';
import { assessClimateRisk } from './climateRiskEngine.js';
import { allocateResources } from './resourceAllocationEngine.js';
import { handleEmergency } from './emergencyResponseEngine.js';

export const getGovernmentIntelligence = () => {
  return {
    policies: generatePolicyIntervention(),
    climate: assessClimateRisk('JBP-01'),
    resources: allocateResources(),
    emergencies: handleEmergency({ id: "EMG-01", type: "Heavy Rainfall" })
  };
};
