import { logger } from '../../utils/logger.js';

/**
 * Disruption Analyzer
 * Ingests external API signals (Weather, Traffic, Events) and classifies them 
 * as actionable travel disruptions.
 */
export class DisruptionAnalyzer {
  /**
   * Detects disruptions from a raw event stream.
   */
  detect(eventStream, currentItinerary) {
    logger.warn('🌩️ [DisruptionAnalyzer] Scanning event stream for real-time disruptions...');

    // Mock detection for SIH demo readiness: Inject a Heavy Rain Alert
    const mockDisruption = {
      type: "Weather",
      severity: "High",
      affectedActivities: ["Colosseum Tour", "Roman Forum (Walking)"],
      confidence: 0.92,
      description: "Heavy Rain Alert (14:00 - 18:00). Outdoor activities severely impacted."
    };

    return mockDisruption;
  }
}
