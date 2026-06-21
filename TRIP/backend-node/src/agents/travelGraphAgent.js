import BaseAgent from './base.agent.js';
import { findSimilarTravelers } from '../algorithms/graph/graphSimilarity.js';
import { detectCommunities } from '../algorithms/graph/communityDetection.js';
import { getCoOccurrences } from '../algorithms/graph/coOccurrenceEngine.js';
import { traverseForRecommendations } from '../algorithms/graph/recommendationTraversal.js';

export class TravelGraphAgent extends BaseAgent {
  constructor() {
    super('TravelGraphAgent', 'Manages, traverses, and discovers relationships within the Travel Intelligence Graph.', [
      'Build Relationships',
      'Run Traversals',
      'Discover Communities',
      'Generate Insights'
    ]);
  }

  async analyzeGraph(userDNA) {
    this.log(`Analyzing Travel Intelligence Graph for User...`);

    // 1. Find Similar Travelers (pgvector)
    const similarity = findSimilarTravelers(userDNA.embedding, userDNA.persona, userDNA.affinities);
    this.log(`Found ${similarity.similarUsers.length} similar travelers.`);

    // 2. Detect Communities
    const communityInfo = detectCommunities();
    this.log(`User assigned to community: ${communityInfo.primaryCommunity.community}`);

    // 3. Co-Occurrences & Traversal
    const coOccurrences = getCoOccurrences('some_dest_id', 'Destination');
    const recommendations = traverseForRecommendations('usr_123', communityInfo.primaryCommunity.community);

    return {
      similarity,
      communityInfo,
      coOccurrences,
      recommendations
    };
  }
}
