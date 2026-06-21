import { logger } from '../../utils/logger.js';

/**
 * Pairwise Engine
 * Translates an array of ranked preferences into a mathematical matrix 
 * determining exactly how many times candidate A beat candidate B.
 */
export class PairwiseEngine {
  /**
   * Generates a matrix from raw ballots.
   */
  generateMatrix(rankedBallots, candidates) {
    logger.debug('🧮 [PairwiseEngine] Generating pairwise preference matrix...');

    const size = candidates.length;
    // Create size x size matrix filled with 0s
    const matrix = Array.from({ length: size }, () => Array(size).fill(0));

    rankedBallots.forEach(ballot => {
      // For every pair in the ballot
      for (let i = 0; i < ballot.length; i++) {
        for (let j = i + 1; j < ballot.length; j++) {
          const winnerIndex = candidates.indexOf(ballot[i]);
          const loserIndex = candidates.indexOf(ballot[j]);
          
          if (winnerIndex !== -1 && loserIndex !== -1) {
            matrix[winnerIndex][loserIndex] += 1;
          }
        }
      }
    });

    return { matrix, candidates };
  }
}
