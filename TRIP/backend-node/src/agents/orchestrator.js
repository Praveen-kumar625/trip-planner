import { model } from '../config/gemini.js';
import { PlannerAgent } from './planner.agent.js';
import { BudgetAnalystAgent } from './budget.agent.js';
import { AgentMemory } from '../memory/session.memory.js';
import { SemanticSearch } from '../rag/semantic_search.js';

/**
 * Supervisor Orchestrator Agent
 * Reads the user intent and routes to the correct specialized sub-agent.
 */
export class TravelOrchestrator {
  static async handleUserQuery(userId, sessionId, query) {
    // 1. Save user query to memory
    await AgentMemory.saveSessionMessage(userId, sessionId, 'user', query);

    // 2. Retrieve Long Term & Short Term Context
    const profileContext = await AgentMemory.getProfileContext(userId);
    const ragContext = await SemanticSearch.retrieveContext(query);
    const context = `Profile: ${profileContext}\nKnowledge: ${ragContext}`;

    // 3. Determine Intent (Supervisor Routing)
    // For a production system, we'd use Gemini Function Calling here to select the agent.
    // We will do a lightweight heuristic/intent parse to decide for this example.
    const intent = await this._determineIntent(query);

    let finalResponseText = '';

    if (intent === 'PLAN_TRIP') {
      // Extract generic parameters - in reality, use structured output from the intent parser
      finalResponseText = await PlannerAgent.generateItinerary('Unknown Destination', 'TBD', 'TBD', context + `\nQuery: ${query}`);
    } else if (intent === 'ESTIMATE_BUDGET') {
      finalResponseText = await BudgetAnalystAgent.estimateCosts('Unknown', 1, 3, context + `\nQuery: ${query}`);
    } else {
      // Fallback to general conversational AI
      finalResponseText = await this._generalConversation(query, context);
    }

    // 4. Save AI Response to memory
    await AgentMemory.saveSessionMessage(userId, sessionId, 'model', finalResponseText);

    return {
      intent,
      response: finalResponseText
    };
  }

  static async _determineIntent(query) {
    if (!model) return 'GENERAL';
    const prompt = `Classify the intent of the following query into exactly one of these categories: PLAN_TRIP, ESTIMATE_BUDGET, GENERAL.\nQuery: "${query}"\nReturn ONLY the category name.`;
    try {
      const result = await model.generateContent(prompt);
      const text = (await result.response).text().trim();
      if (['PLAN_TRIP', 'ESTIMATE_BUDGET', 'GENERAL'].includes(text)) return text;
      return 'GENERAL';
    } catch {
      return 'GENERAL';
    }
  }

  static async _generalConversation(query, context) {
    if (!model) return 'Mock response for general query.';
    const result = await model.generateContent(`System: You are WANDERSYNC AI, a helpful travel assistant.\nContext: ${context}\nUser: ${query}`);
    return (await result.response).text();
  }
}
