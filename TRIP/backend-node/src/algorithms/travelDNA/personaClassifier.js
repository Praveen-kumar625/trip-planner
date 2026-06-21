import { logger } from '../../utils/logger.js';

/**
 * Persona Classifier Engine
 * Maps behavior profiles and affinity scores into standard travel personas.
 */
export class PersonaClassifier {
  constructor() {
    this.personas = [
      'Adventure Explorer', 'Luxury Traveler', 'Nature Seeker',
      'Food Nomad', 'Culture Hunter', 'Weekend Escapist',
      'Family Planner', 'Digital Nomad', 'Backpacker', 'Photographer'
    ];
  }

  /**
   * Classifies user into Primary and Secondary personas with a confidence score.
   */
  classify(behaviorScores, affinities) {
    logger.debug('🎭 [PersonaClassifier] Classifying traveler personas...');

    // Mock logic based on input affinities
    let primary = 'Weekend Escapist';
    let secondary = 'Photographer';
    let confidence = 0.75;

    if (affinities.mountainAffinity > 80 && affinities.wildlifeAffinity > 70) {
      primary = 'Nature Seeker';
      secondary = 'Adventure Explorer';
      confidence = 0.91;
    } else if (affinities.foodExperiences > 85) {
      primary = 'Food Nomad';
      secondary = 'Culture Hunter';
      confidence = 0.88;
    }

    return {
      primaryPersona: primary,
      secondaryPersona: secondary,
      confidence
    };
  }
}
