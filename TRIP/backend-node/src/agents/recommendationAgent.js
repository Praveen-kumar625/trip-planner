import BaseAgent from './base.agent.js';
import { runRecommendationPipeline } from '../algorithms/recommendation/recommendationEngine.js';

export class RecommendationAgent extends BaseAgent {
  constructor() {
    super('RecommendationAgent', 'Generates highly personalized, explainable recommendations using fused intelligence.', [
      'Context Fusion',
      'Recommendation Generation',
      'Confidence Analysis',
      'Explanation Generation',
      'Alternative Discovery'
    ]);
  }

  async recommend(inputs, candidates) {
    this.log(`Initiating Recommendation Pipeline for ${candidates.length} candidates...`);

    const result = runRecommendationPipeline(inputs, candidates);
    
    this.log(`Top recommendation generated: ${result.topRecommendation.recommendation} (Confidence: ${result.confidence.confidenceScore}%)`);
    this.log(`Generated ${result.topRecommendation.explanation.length} explanation points.`);
    
    return result;
  }
}
