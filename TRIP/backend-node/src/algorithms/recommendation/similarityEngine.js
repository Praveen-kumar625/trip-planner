/**
 * Graph Similarity Engine
 * Utilizes 768-dimensional embeddings to find similar users, trips, and activities.
 * (Mocked pgvector implementation for MVP).
 */

export const computeSimilarity = (travelDNA, targetGraph) => {
  // In production, this would execute a cosine similarity query via pgvector:
  // SELECT id, 1 - (embedding <=> $1) AS similarity FROM users ORDER BY similarity DESC
  
  // Mock logic for demo
  const similarityScore = Math.random() * 20 + 75; // 75-95 range
  
  const similarUsers = [
    { id: 'usr_819', overlap: 92, persona: 'Nature Seeker' },
    { id: 'usr_211', overlap: 88, persona: 'Photographer' }
  ];

  const similarDestinations = [
    { name: 'Tirthan Valley', match: 94 },
    { name: 'Spiti Valley', match: 89 }
  ];

  return {
    similarityScore: parseFloat(similarityScore.toFixed(2)),
    similarUsers,
    similarDestinations
  };
};
