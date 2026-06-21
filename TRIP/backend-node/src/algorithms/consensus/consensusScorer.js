import { logger } from '../../utils/logger.js';

/**
 * Consensus Scorer
 * Normalizes and combines outputs from Conflict Analyzer, Fairness Engine,
 * and Borda/Copeland methods into a final 0-100 score.
 */
export class ConsensusScorer {
  /**
   * Generates the final Consensus KPI.
   */
  generateScore(conflictStats, fairnessStats) {
    logger.debug('📊 [ConsensusScorer] Computing normalized Consensus KPI...');

    const conflictScore = conflictStats.conflictScore || 0; // 0-100 (high is bad)
    const fairnessScore = fairnessStats.fairnessScore || 0; // 0-100 (high is good)
    
    // Simple heuristic: 100 - conflict + fairness / 2
    const agreementScore = Math.round(((100 - conflictScore) + fairnessScore) / 2);

    return {
      agreementScore,
      conflictScore,
      fairnessScore,
      confidence: 0.92 // Mock confidence
    };
  }
}
