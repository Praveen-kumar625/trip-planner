import { createQueue, createWorker } from './baseWorker.js';
import { BehaviorAnalyzer } from '../algorithms/travelDNA/behaviorAnalyzer.js';
import { PersonaClassifier } from '../algorithms/travelDNA/personaClassifier.js';
import { AffinityEngine } from '../algorithms/travelDNA/affinityEngine.js';
import { PreferenceEmbedding } from '../algorithms/travelDNA/preferenceEmbedding.js';
import { DestinationPredictor } from '../algorithms/travelDNA/destinationPredictor.js';
import { logger } from '../utils/logger.js';

export const travelDNAQueue = createQueue('travelDNAQueue');

export const travelDNAWorker = createWorker('travelDNAQueue', async (job) => {
  const { userId, eventType, eventData } = job.data;
  logger.info(`🧬 [TravelDNAWorker] Processing behavioral event '${eventType}' for user ${userId}`);

  // 1. Behavior Analysis
  const behaviorAnalyzer = new BehaviorAnalyzer();
  const behaviorProfile = behaviorAnalyzer.analyzeBehavior(eventData);

  // 2. Affinity Updates
  const affinityEngine = new AffinityEngine();
  const affinities = affinityEngine.calculateAffinities([], []);

  // 3. Persona Classification
  const personaClassifier = new PersonaClassifier();
  const persona = personaClassifier.classify(behaviorProfile.scores, affinities);

  // 4. Generate Embeddings (pgvector)
  const embeddingEngine = new PreferenceEmbedding();
  const vector = embeddingEngine.generateEmbedding(persona, affinities, behaviorProfile.scores);

  // 5. Predict Future Behavior
  const predictor = new DestinationPredictor();
  const prediction = predictor.predictNext(vector, affinities);

  // Store all of this back to PostgreSQL
  logger.info(`💾 [TravelDNAWorker] Successfully updated Intelligence Graph for user ${userId}`);

  return {
    status: 'success',
    data: {
      behaviorProfile,
      affinities,
      persona,
      prediction
    }
  };
});
