import { BaseAgent } from './base.agent.js';
import { plannerQueue } from '../workers/plannerWorker.js';
import { logger } from '../utils/logger.js';

export class PlannerAgent extends BaseAgent {
  constructor() {
    super('PlannerAgent', plannerQueue);
  }

  async process(context) {
    logger.info(`🤖 [PlannerAgent] Extracting intent and structuring travel requirements...`);
    
    // Phase 2A: Generate Travel Vector from User Intent
    const travelVector = this.extractIntentAndVector(context);
    logger.info(`🧭 [PlannerAgent] Generated Travel Vector:`, travelVector);
    
    // Send job to BullMQ for heavy processing (ALNS logic, etc.)
    const job = await this.queue.add('generate-itinerary', {
      ...context,
      travelVector
    }, {
      priority: 1,
      attempts: 3
    });

    this.dispatchEvent('planner_job_started', { jobId: job.id, travelVector });
    
    return { status: 'processing', jobId: job.id, travelVector };
  }

  /**
   * Extracts constraints and builds the multi-dimensional Travel Vector
   * This vector forms the foundation of the Travel DNA and ALNS weighting.
   */
  extractIntentAndVector(context) {
    // In production, this might use an LLM or heuristic parsing.
    // We mock the calculation based on requested budget and style tags.
    const { budget, tags = [], travelerType } = context;

    let budgetScore = 50, adventureScore = 50, cultureScore = 50, 
        foodScore = 50, natureScore = 50, photographyScore = 50, 
        comfortScore = 50, mobilityScore = 50, fatigueTolerance = 50;

    if (budget > 50000) comfortScore += 30;
    if (budget < 15000) budgetScore += 40;

    if (tags.includes('Nature')) natureScore += 40;
    if (tags.includes('Photography')) photographyScore += 40;
    if (tags.includes('Adventure')) {
      adventureScore += 40;
      fatigueTolerance += 20;
    }

    if (travelerType === 'Solo') mobilityScore += 30;

    return {
      budgetScore: Math.min(100, budgetScore),
      adventureScore: Math.min(100, adventureScore),
      cultureScore: Math.min(100, cultureScore),
      foodScore: Math.min(100, foodScore),
      natureScore: Math.min(100, natureScore),
      photographyScore: Math.min(100, photographyScore),
      comfortScore: Math.min(100, comfortScore),
      mobilityScore: Math.min(100, mobilityScore),
      fatigueTolerance: Math.min(100, fatigueTolerance),
      travelStyle: tags.join('-') || 'Balanced'
    };
  }
}
