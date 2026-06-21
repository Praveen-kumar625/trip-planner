/**
 * Local Economy Score
 * Analyzes whether a POI contributes to the local economy.
 * Prefers independent, local businesses over global chains.
 */

export const calculateLocalEconomyScore = (poi) => {
  let score = 50; // Base score

  // Signal: Corporate chain vs independent
  const nameLower = poi.name.toLowerCase();
  const globalChains = ['starbucks', 'mcdonalds', 'kfc', 'subway', 'hilton', 'marriott', 'dominos', 'burger king'];
  
  const isGlobalChain = globalChains.some(chain => nameLower.includes(chain));
  
  if (isGlobalChain) {
    score -= 40; // Penalize heavy corporate footprints
  } else {
    score += 20; // Reward likely local/independent establishments
  }

  // Signal: Local operation tags (if available from metadata)
  if (poi.tags) {
    if (poi.tags.includes('family-owned')) score += 15;
    if (poi.tags.includes('local-craft')) score += 15;
    if (poi.tags.includes('homestay')) score += 20;
    if (poi.tags.includes('community-led')) score += 20;
  }

  // Normalize between 0 and 100
  return Math.max(0, Math.min(100, score));
};
