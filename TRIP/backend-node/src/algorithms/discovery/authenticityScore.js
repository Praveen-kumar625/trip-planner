/**
 * Authenticity Score
 * Analyzes whether a location is a genuine cultural/local experience vs a manufactured tourist trap.
 */

export const calculateAuthenticityScore = (poi) => {
  let score = 50;

  // High rating but lower count often correlates with authenticity (locals love it, tourists don't know it)
  const rating = poi.rating || 0;
  const count = poi.userRatingsTotal || 0;

  if (rating >= 4.5 && count > 10 && count < 500) {
    score += 30; // Strong signal for local secret
  } else if (rating < 4.0 && count > 2000) {
    score -= 20; // Likely a tourist trap
  }

  // Keywords in types/tags
  const types = poi.types || [];
  const authenticKeywords = ['hindu_temple', 'place_of_worship', 'local_government_office', 'library', 'art_gallery', 'bakery'];
  const touristyKeywords = ['tourist_attraction', 'amusement_park', 'casino', 'souvenir_store'];

  const hasAuthentic = authenticKeywords.some(t => types.includes(t));
  const hasTouristy = touristyKeywords.some(t => types.includes(t));

  if (hasAuthentic) score += 20;
  if (hasTouristy) score -= 30;

  return Math.max(0, Math.min(100, score));
};
