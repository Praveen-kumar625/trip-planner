import { model } from '../config/gemini.js';
import { logger } from '../utils/logger.js';

export class BaseAgent {
  constructor(name, systemInstruction, tools = []) {
    this.name = name;
    this.systemInstruction = systemInstruction;
    this.tools = tools;
  }

  /**
   * Run the agent with a prompt and context.
   * If Gemini needs to call a tool, it will return a tool_call. 
   * This base implementation assumes a single-turn completion for now.
   */
  async execute(prompt, context = '') {
    if (!model) {
      logger.warn(`[Agent ${this.name}] Gemini model not initialized.`);
      return `Mock response from ${this.name}: "Received your prompt: ${prompt}"`;
    }

    try {
      const fullPrompt = `
      System: ${this.systemInstruction}
      Context: ${context}
      User Query: ${prompt}
      `;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      logger.error(`[Agent ${this.name}] Execution failed:`, error);
      throw new Error(`AI execution failed in agent: ${this.name}`);
    }
  }
}
