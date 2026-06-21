import { EnvironmentModel } from './environmentModel.js';
import { FatigueEngine } from './fatigueEngine.js';
import { RiskEngine } from './riskEngine.js';
import { logger } from '../utils/logger.js';

/**
 * Day Simulator Engine
 * The core of the Digital Twin. Orchestrates the prediction of a full itinerary day.
 */
export class DaySimulator {
  constructor(itineraryDay, userProfile) {
    this.itineraryDay = itineraryDay || [];
    this.userProfile = userProfile || {};
    this.envModel = new EnvironmentModel('location', 'date');
    this.fatigueEngine = new FatigueEngine(this.userProfile);
    this.riskEngine = new RiskEngine();
  }

  /**
   * Calculates the Journey Load Index (JLI)
   */
  calculateJLI(walkingDistance, elevation, envPredictions, travelDuration, activityIntensity) {
    // JLI Formula
    const jli = 
      (0.25 * Math.min(walkingDistance * 10, 100)) + // Normalize walking (e.g. 10km = 100)
      (0.15 * Math.min(elevation * 0.1, 100)) +      // Normalize elevation
      (0.15 * envPredictions.temperature) +          
      (0.10 * envPredictions.humidity) +             
      (0.15 * envPredictions.crowdDensity) +         
      (0.10 * Math.min(travelDuration * 20, 100)) +  // Normalize duration
      (0.10 * activityIntensity);
      
    return Math.min(100, Math.max(0, jli));
  }

  async simulateDay() {
    logger.info('🔮 [DigitalTwin] Running full day simulation cycle...');
    
    let currentFatigue = 0;
    const timeline = [];
    const warnings = [];

    // Mock an 8AM start
    let currentHour = 8; 

    // Simulate each activity in the day sequentially
    for (const activity of this.itineraryDay) {
      const envPredictions = await this.envModel.getPredictions(currentHour);
      const envStress = this.envModel.calculateEnvironmentalStress(envPredictions);
      
      const jliScore = this.calculateJLI(
        activity.walkingDistance || 2,
        activity.elevation || 10,
        envPredictions,
        activity.travelDuration || 1,
        activity.intensity || 50
      );

      const fatigueResult = this.fatigueEngine.predictFatigueSegment(
        currentFatigue, 
        activity.intensity || 50, 
        activity.durationMinutes || 60, 
        envStress
      );
      currentFatigue = fatigueResult.fatigueScore;

      const riskResult = this.riskEngine.evaluateRisk(
        envStress, 
        { trafficDelays: Math.random() * 20 }, 
        currentFatigue
      );

      if (riskResult.mitigationActions.length > 0) {
        warnings.push(...riskResult.mitigationActions);
      }

      timeline.push({
        time: `${currentHour}:00`,
        activityName: activity.name || 'Transit',
        jliScore: jliScore.toFixed(1),
        fatigueScore: currentFatigue.toFixed(1),
        riskLevel: riskResult.riskLevel
      });

      currentHour += Math.ceil((activity.durationMinutes || 60) / 60);
    }

    return {
      dayScore: 100 - (currentFatigue * 0.3), // Basic mapping
      feasibility: currentFatigue < 85 ? 'Feasible' : 'Unfeasible',
      comfort: 100 - (currentFatigue * 0.5),
      peakFatigue: currentFatigue,
      warnings: [...new Set(warnings)], // unique warnings
      timeline
    };
  }
}
