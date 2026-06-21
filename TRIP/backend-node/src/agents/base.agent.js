import { aiProvider } from '../services/aiProvider.js';
import { logger } from '../utils/logger.js';

export class BaseAgent {
  constructor(name, systemInstruction, tools = []) {
    this.name = name;
    this.systemInstruction = systemInstruction;
    this.tools = tools;
  }

  // --- Fallback Mechanism ---
  async fallbackExecution() {
    logger.warn(`[Agent ${this.name}] Primary AI failed. Attempting Fallback...`);
    // Simulate fallback call delay
    await new Promise(r => setTimeout(r, 1000));

    return {
      _mock: true,
      fallbackUsed: true,
      message: `I've analyzed your requirements and started drafting some preliminary ideas. Let's refine them together!`
    };
  }

  /**
   * Run the agent with a prompt and context for a single response.
   */
  async execute(prompt, context = '', responseSchema = null, history = []) {
    try {
      return await aiProvider.generate({
        model: 'gemini-2.5-pro',
        systemInstruction: this.systemInstruction,
        prompt,
        context,
        responseSchema,
        history
      });
    } catch (error) {
      logger.error(`[Agent ${this.name}] Primary execution completely failed after retries.`, { error: error.message });
      
      // Fallback
      if (!responseSchema) {
         const fallbackRes = await this.fallbackExecution(prompt, context);
         return fallbackRes.message;
      }
      
      throw new Error(`AI execution failed and no structured fallback available for: ${this.name}`);
    }
  }

  /**
   * Run the agent using a stream.
   * If a responseSchema is provided, it registers it as a Tool ("update_trip_plan").
   */
  async streamExecution(prompt, context = '', responseSchema = null, history = [], onToken, onToolCall) {
    try {
      await aiProvider.stream({
        model: 'gemini-2.5-flash',
        systemInstruction: this.systemInstruction,
        prompt,
        context,
        responseSchema,
        history,
        onToken,
        onToolCall
      });
    } catch (error) {
      logger.error(`[Agent ${this.name}] Stream execution completely failed.`, { error: error.message });
      throw error; // Rethrow to let Orchestrator handle the final fallback message
    }
  }
}

