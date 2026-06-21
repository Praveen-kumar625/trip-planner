/**
 * Fatigue Prediction Engine
 * Calculates fatigue accumulation and recovery.
 */
export class FatigueEngine {
  constructor(travelerProfile) {
    this.ageGroup = travelerProfile.ageGroup || 'adult';
    this.travelStyle = travelerProfile.travelStyle || 'balanced';
    this.baseStamina = this.calculateBaseStamina();
  }

  calculateBaseStamina() {
    let stamina = 100;
    if (this.ageGroup === 'senior' || this.ageGroup === 'child') stamina -= 20;
    if (this.travelStyle.includes('Adventure')) stamina += 20;
    if (this.travelStyle.includes('Luxury')) stamina -= 10; // lower tolerance for discomfort
    return stamina;
  }

  /**
   * Predicts fatigue level for a specific activity segment.
   */
  predictFatigueSegment(currentFatigue, activityIntensity, durationMinutes, envStress) {
    // Normalize duration (hours)
    const hours = durationMinutes / 60;
    
    // Accumulation factors
    const intensityLoad = activityIntensity * hours * 0.5;
    const environmentLoad = (envStress.tempStress + envStress.humidityStress + envStress.crowdStress) * 0.05 * hours;
    
    // Recovery (if activity is resting)
    let recovery = 0;
    if (activityIntensity < 20) { // e.g., sitting at a cafe
      recovery = 15 * hours;
    }

    const newFatigue = currentFatigue + intensityLoad + environmentLoad - recovery;
    
    return {
      fatigueScore: Math.min(100, Math.max(0, newFatigue)),
      fatigueLevel: this.getFatigueLevel(newFatigue)
    };
  }

  getFatigueLevel(score) {
    if (score < 30) return 'Low';
    if (score < 60) return 'Moderate';
    if (score < 85) return 'High';
    return 'Critical';
  }
}
