/**
 * Explainability Engine
 * Core XAI orchestrator that standardizes explanations across all TPOS subsystems.
 */

import { explainRecommendation } from './recommendationExplainer.js';
import { explainOptimization } from './optimizationExplainer.js';
import { explainSimulation } from './simulationExplainer.js';
import { explainConsensus } from './consensusExplainer.js';
import { traceDecision } from './decisionTraceEngine.js';

export class ExplainabilityEngine {
  constructor() {
    this.history = [];
  }

  generateExplanation(decisionType, context, decisionData) {
    let explanation = {};
    switch (decisionType) {
      case 'RECOMMENDATION':
        explanation = explainRecommendation(context, decisionData);
        break;
      case 'OPTIMIZATION':
        explanation = explainOptimization(context, decisionData);
        break;
      case 'SIMULATION':
        explanation = explainSimulation(context, decisionData);
        break;
      case 'CONSENSUS':
        explanation = explainConsensus(context, decisionData);
        break;
      default:
        throw new Error(`Unknown decision type: ${decisionType}`);
    }

    const trace = traceDecision(decisionType, context, decisionData);
    
    const xaiPayload = {
      ...explanation,
      trace,
      timestamp: new Date().toISOString()
    };

    this.history.push(xaiPayload);
    return xaiPayload;
  }
}

export const explainabilityEngine = new ExplainabilityEngine();
