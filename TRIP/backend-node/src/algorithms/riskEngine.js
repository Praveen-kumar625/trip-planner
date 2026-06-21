/**
 * Travel Risk Engine
 * Evaluates environmental, mobility, and human factors to determine Journey Risk.
 */
export class RiskEngine {
  constructor() {}

  /**
   * Calculates comprehensive risk score based on inputs from environment and fatigue models.
   */
  evaluateRisk(envStress, mobilityFactors, fatigueScore) {
    let riskScore = 0;
    const mitigationActions = [];

    // 1. Environmental Risks
    if (envStress.tempStress > 50) {
      riskScore += 20;
      mitigationActions.push("Extreme heat predicted. Shift outdoor activities to early morning.");
    }
    if (envStress.crowdStress > 85) {
      riskScore += 15;
      mitigationActions.push("High crowd density. Expect significant delays at major attractions.");
    }

    // 2. Mobility Risks
    if (mobilityFactors && mobilityFactors.trafficDelays > 30) {
      riskScore += 25;
      mitigationActions.push(`High traffic delay (${mobilityFactors.trafficDelays} mins). Consider public transit.`);
    }

    // 3. Human Factors
    if (fatigueScore > 75) {
      riskScore += 30;
      mitigationActions.push("Critical fatigue threshold reached. Add a 45-minute recovery period immediately.");
    }

    const finalRisk = Math.min(100, riskScore);

    return {
      riskScore: finalRisk,
      riskLevel: this.getRiskLevel(finalRisk),
      mitigationActions
    };
  }

  getRiskLevel(score) {
    if (score < 20) return 'Low';
    if (score < 50) return 'Moderate';
    if (score < 80) return 'High';
    return 'Severe';
  }
}
