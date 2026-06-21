import { AgentMemory } from '../memory/session.memory.js';
import { SemanticSearch } from '../rag/semantic_search.js';
import { logger } from '../utils/logger.js';
import { overviewAgent, budgetAgent, stayAgent, itineraryAgent, insightsAgent } from './module.agents.js';
import { overviewSchema, budgetSchema, stayPlanSchema, itinerarySchema, insightsSchema } from './module.schemas.js';

export class TravelOrchestrator {
  static async handleUserQueryStream(userId, sessionId, query, tripContext = {}, frontendHistory = [], onEvent) {
    // Save user query
    await AgentMemory.saveSessionMessage(userId, sessionId, 'user', query);

    // Retrieve Context
    const profileContext = await AgentMemory.getProfileContext(userId);
    const ragContext = await SemanticSearch.retrieveContext(query);
    const memoryHistory = await AgentMemory.getSessionHistory(userId, sessionId);
    
    // Merge frontend history if memory history is empty
    const history = memoryHistory.length > 0 ? memoryHistory : frontendHistory;
    
    const context = `Profile: ${profileContext}\nKnowledge: ${ragContext}\nTrip Context: ${JSON.stringify(tripContext)}`;

    try {
      // Announce generation start
      onEvent({ type: 'status', message: 'Analyzing request and preparing agents...' });

      // Trigger all agents concurrently, but wrap them so we can emit when each finishes
      const agentPromises = [
        this.runModuleAgent(overviewAgent, 'overview', query, context, overviewSchema, history, onEvent),
        this.runModuleAgent(budgetAgent, 'budget', query, context, budgetSchema, history, onEvent),
        this.runModuleAgent(stayAgent, 'hotels', query, context, stayPlanSchema, history, onEvent),
        this.runModuleAgent(itineraryAgent, 'routes', query, context, itinerarySchema, history, onEvent),
        this.runModuleAgent(insightsAgent, 'insights', query, context, insightsSchema, history, onEvent)
      ];

      // Wait for all to finish
      const results = await Promise.allSettled(agentPromises);
      
      const failedModules = results.filter(r => r.status === 'rejected');
      if (failedModules.length > 0) {
        logger.warn(`Some modules failed to generate: ${failedModules.length}`);
      }

      // Generate a quick conversational response to cap it off
      onEvent({ type: 'token', content: 'I have generated a detailed, modular itinerary for you. Let me know if you want to tweak any specific section!' });
      
      await AgentMemory.saveSessionMessage(userId, sessionId, 'model', 'I have generated a detailed, modular itinerary for you. Let me know if you want to tweak any specific section!');

    } catch (e) {
      logger.error("Orchestrator failed:", { error: e, context: 'TravelOrchestrator' });
      onEvent({ type: 'error', message: 'An internal system error occurred.' });
    }
  }

  static async runModuleAgent(agent, moduleName, query, context, schema, history, onEvent) {
    onEvent({ type: 'module_status', module: moduleName, status: 'GENERATING' });
    try {
      // In a real streaming scenario, we might use streamExecution if we want partial JSON, 
      // but for modular generation it's cleaner to wait for the complete JSON for the specific module.
      // Wait, let's just use execute which returns the fully formed JSON object
      const result = await agent.execute(query, context, schema, history);
      
      onEvent({ 
        type: 'module_update', 
        module: moduleName, 
        data: result 
      });
      return result;
    } catch (err) {
      logger.error(`Module ${moduleName} generation failed`, { error: err.message });
      onEvent({ type: 'module_status', module: moduleName, status: 'FAILED', error: err.message });
      throw err;
    }
  }
}
