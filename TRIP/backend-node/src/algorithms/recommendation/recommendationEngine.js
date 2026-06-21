import { fuseContext } from './contextFusion.js';
import { computeSimilarity } from './similarityEngine.js';
import { evaluateSeasonality } from './seasonalityEngine.js';
import { rankRecommendations } from './rankingEngine.js';
import { calculateConfidence } from './confidenceEngine.js';
import { generateExplanation } from './recommendationExplainer.js';

/**
 * Core Recommendation Intelligence Engine
 * Orchestrates Phase 3B modules.
 */
export const runRecommendationPipeline = (inputs, candidates) => {
  // 1. Context Fusion
  const { unifiedTravelContext } = fuseContext(inputs);

  // 2. Similarity (Graph)
  const similarity = computeSimilarity(inputs.travelDNA, inputs.travelGraph);

  // 3. Seasonality
  const seasonality = evaluateSeasonality('Target', inputs.environmentalConditions?.currentMonth || 'October', inputs.environmentalConditions);

  // 4. Ranking Engine
  const rankedResults = rankRecommendations(candidates, unifiedTravelContext, similarity, seasonality);

  // 5. Confidence Calculation
  const confidenceData = calculateConfidence(unifiedTravelContext, similarity);

  // 6. Explainability
  const explanations = rankedResults.map(r => generateExplanation(r, unifiedTravelContext));

  return {
    unifiedContext: unifiedTravelContext,
    confidence: confidenceData,
    topRecommendation: explanations[0],
    alternatives: explanations.slice(1, 4),
    rankedResults
  };
};
