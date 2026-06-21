import { logger } from '../../utils/logger.js';

/**
 * Borda Count Engine
 * Evaluates ranked preferences from multiple users and calculates a mathematical winner
 * by assigning points based on ranking position.
 */
export class BordaCount {
  /**
   * Evaluates an array of ranked arrays.
   * Example: [ ["Beach", "Mountains"], ["Mountains", "Beach"] ]
   */
  calculateWinner(rankedBallots) {
    logger.debug('📊 [BordaCount] Calculating group preferences...');
    
    if (!rankedBallots || rankedBallots.length === 0) return null;

    const scores = {};
    const numCandidates = rankedBallots[0].length;

    rankedBallots.forEach((ballot) => {
      ballot.forEach((item, index) => {
        // N candidates: 1st place gets N-1 points, last place gets 0.
        const points = numCandidates - 1 - index;
        scores[item] = (scores[item] || 0) + points;
      });
    });

    let winner = null;
    let maxScore = -1;

    Object.entries(scores).forEach(([item, score]) => {
      if (score > maxScore) {
        maxScore = score;
        winner = item;
      }
    });

    return { winner, scores };
  }
}
