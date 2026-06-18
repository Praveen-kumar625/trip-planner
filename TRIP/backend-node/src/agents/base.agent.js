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
  async execute(prompt, context = '', responseSchema = null, history = []) {
    if (!model) {
      logger.warn(`[Agent ${this.name}] Gemini model not initialized.`);
      if (responseSchema) {
        throw new Error("AI features are disabled. Please configure GEMINI_API_KEY.");
      }
      return { _mock: true, message: `Mock response from ${this.name}: "Received your prompt: ${prompt}"` };
    }

    try {
      const fullPrompt = `
      System: ${this.systemInstruction}
      Context: ${context}
      User Query: ${prompt}
      `;

      let generationConfig = undefined;
      if (responseSchema) {
        generationConfig = {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        };
      }

      // Format history for Gemini API (if needed)
      // For simplicity, we can just append history to the prompt if it's text,
      // or start a chat session. Given we are doing a structured response, generating content is fine.
      const historyText = history.length > 0 
        ? `\nChat History:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}` 
        : '';

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt + historyText }] }],
        generationConfig
      });
      
      const text = result.response.text();
      
      if (responseSchema) {
        try {
          return JSON.parse(text);
        } catch (err) {
          logger.error('Failed to parse JSON response:', text);
          throw new Error('Invalid JSON response from AI');
        }
      }
      
      return text;
    } catch (error) {
      logger.error(`[Agent ${this.name}] Execution failed:`, error);
      throw new Error(`AI execution failed in agent: ${this.name}`);
    }
  }
}
