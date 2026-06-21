import BaseAgent from './base.agent.js';
import { runDBSCAN } from '../algorithms/discovery/dbscan.js';
import { analyzeClusters } from '../algorithms/discovery/clusterAnalyzer.js';
import { rankHiddenGems } from '../algorithms/discovery/gemRanker.js';

export class DiscoveryAgent extends BaseAgent {
  constructor() {
    super('DiscoveryAgent', 'Discovers hidden gems and low-pressure authentic experiences.', [
      'Find Hidden Gems',
      'Detect Emerging Trends',
      'Promote Local Experiences'
    ]);
  }

  /**
   * Executes the full discovery pipeline on a raw set of geographic POIs
   */
  async discoverHiddenGems(rawPOIs) {
    this.log(`Initiating Hidden Gem Discovery pipeline for ${rawPOIs.length} POIs...`);

    // 1. DBSCAN Spatial Clustering
    // Epsilon = 1.5km radius, minPts = 3
    const clusteredPOIs = runDBSCAN(rawPOIs, 1.5, 3);
    this.log('DBSCAN spatial clustering complete.');

    // 2. Zone Analysis
    const clusterZones = analyzeClusters(clusteredPOIs);
    this.log('Cluster density and pressure zones mapped.');

    // 3. Gem Ranking & Scoring
    const rankedGems = rankHiddenGems(clusteredPOIs, clusterZones);
    this.log('Hidden Gem Scores calculated and ranked.');

    // 4. Filter for actual 'Hidden Gems' (Score > 75)
    const hiddenGems = rankedGems.filter(poi => poi.discoveryMetrics.hiddenGemScore >= 75);

    return {
      totalAnalyzed: rawPOIs.length,
      gemsFound: hiddenGems.length,
      clusterZones,
      hiddenGems
    };
  }
}
