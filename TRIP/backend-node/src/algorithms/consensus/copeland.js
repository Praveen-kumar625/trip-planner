import { logger } from '../../utils/logger.js';

/**
 * Copeland Method Engine
 * Resolves elections by looking at every pairwise comparison (A vs B, B vs C, etc.).
 * Candidates get +1 for a pairwise win, -1 for a loss, 0 for a tie.
 */
export class CopelandMethod {
  /**
   * Resolves preferences using pairwise matrix data.
   */
  calculateWinner(pairwiseMatrix, candidates) {
    logger.debug('⚔️ [CopelandMethod] Running pairwise conflict resolution...');

    const copelandScores = {};
    candidates.forEach(c => copelandScores[c] = { wins: 0, losses: 0, score: 0 });

    for (let i = 0; i < candidates.length; i++) {
      for (let j = i + 1; j < candidates.length; j++) {
        const c1 = candidates[i];
        const c2 = candidates[j];
        
        const c1Votes = pairwiseMatrix[i][j];
        const c2Votes = pairwiseMatrix[j][i];

        if (c1Votes > c2Votes) {
          copelandScores[c1].wins += 1;
          copelandScores[c1].score += 1;
          copelandScores[c2].losses += 1;
          copelandScores[c2].score -= 1;
        } else if (c2Votes > c1Votes) {
          copelandScores[c2].wins += 1;
          copelandScores[c2].score += 1;
          copelandScores[c1].losses += 1;
          copelandScores[c1].score -= 1;
        }
      }
    }

    let winner = null;
    let maxScore = -Infinity;

    Object.entries(copelandScores).forEach(([candidate, stats]) => {
      if (stats.score > maxScore) {
        maxScore = stats.score;
        winner = candidate;
      }
    });

    return { winner, scores: copelandScores };
  }
}
