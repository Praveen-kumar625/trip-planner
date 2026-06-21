import { createQueue, createWorker } from './baseWorker.js';
import { sseManager } from '../api/sse.js';
import { BordaCount } from '../algorithms/consensus/bordaCount.js';
import { CopelandMethod } from '../algorithms/consensus/copeland.js';
import { PairwiseEngine } from '../algorithms/consensus/pairwiseEngine.js';
import { ConflictAnalyzer } from '../algorithms/consensus/conflictAnalyzer.js';
import { FairnessEngine } from '../algorithms/consensus/fairnessEngine.js';
import { ConsensusScorer } from '../algorithms/consensus/consensusScorer.js';
import { logger } from '../utils/logger.js';

export const consensusQueue = createQueue('consensusQueue');

export const consensusWorker = createWorker('consensusQueue', async (job) => {
  const { groupId, tripId, ballots, candidates, userPreferences } = job.data;
  logger.info(`🤝 [ConsensusWorker] Processing group decision for trip ${tripId}`);

  // 1. Pairwise Matrix
  const pairwiseEngine = new PairwiseEngine();
  const matrixResult = pairwiseEngine.generateMatrix(ballots, candidates);

  // 2. Borda Count
  const bordaEngine = new BordaCount();
  const bordaResult = bordaEngine.calculateWinner(ballots);

  // 3. Copeland Method
  const copelandEngine = new CopelandMethod();
  const copelandResult = copelandEngine.calculateWinner(matrixResult.matrix, candidates);

  // 4. Conflict & Fairness
  const conflictAnalyzer = new ConflictAnalyzer();
  const conflictStats = conflictAnalyzer.analyzeConflicts(userPreferences);

  const fairnessEngine = new FairnessEngine();
  const fairnessStats = fairnessEngine.calculateFairness(bordaResult.winner, userPreferences);

  // 5. Consensus Score
  const scorer = new ConsensusScorer();
  const finalScore = scorer.generateScore(conflictStats, fairnessStats);

  const payload = {
    groupId,
    tripId,
    bordaWinner: bordaResult.winner,
    copelandWinner: copelandResult.winner,
    matrix: matrixResult.matrix,
    conflictStats,
    fairnessStats,
    consensusScore: finalScore,
    recommendations: [
      "Swap Activity B to reduce budget strain",
      "Add Shared Nature Experience to align Personas",
      "Split Day Plan for afternoon activities"
    ]
  };

  // Broadcast results live to the specific group room
  const channel = `group:${groupId}`;
  sseManager.broadcast(channel, {
    type: 'consensus:updated',
    data: payload
  });

  logger.info(`✅ [ConsensusWorker] Successfully resolved group conflicts. Broadcasted to ${channel}`);
  return { status: 'success', data: payload };
});
