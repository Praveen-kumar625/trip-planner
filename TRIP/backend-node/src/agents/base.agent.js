import { ai } from '../config/gemini.js';
import { logger } from '../utils/logger.js';

export class BaseAgent {
  constructor(name, systemInstruction, tools = []) {
    this.name = name;
    this.systemInstruction = systemInstruction;
    this.tools = tools;
  }

  /**
   * Run the agent with a prompt and context for a single response.
   */
  async execute(prompt, context = '', responseSchema = null, history = []) {
    if (!ai) {
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

      let config = undefined;
      if (responseSchema) {
        config = {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        };
      }

      const historyText = history.length > 0 
        ? `\nChat History:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}` 
        : '';

      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: fullPrompt + historyText }] }],
        config
      });
      
      const text = result.text;
      
      if (responseSchema) {
        try {
          return JSON.parse(text);
        } catch (err) {
          logger.error('Failed to parse JSON response:', text, err);
          throw new Error('Invalid JSON response from AI');
        }
      }
      
      return text;
    } catch (error) {
      logger.error(`[Agent ${this.name}] Execution failed:`, error);
      throw new Error(`AI execution failed in agent: ${this.name}`);
    }
  }

  /**
   * Run the agent using a stream.
   * If a responseSchema is provided, it registers it as a Tool ("update_trip_plan").
   */
  async streamExecution(prompt, context = '', responseSchema = null, history = [], onToken, onToolCall) {
    if (!ai) {
      logger.warn(`[Agent ${this.name}] Gemini model not initialized.`);
      onToken && onToken("AI features are disabled. Please configure GEMINI_API_KEY.");
      return;
    }

    try {
      const fullPrompt = `
      System: ${this.systemInstruction}
      Context: ${context}
      `;

      let config = undefined;
      if (responseSchema) {
        config = {
          tools: [{
            functionDeclarations: [
              {
                name: "update_trip_plan",
                description: "Call this function whenever you have enough information to create or update the detailed trip itinerary JSON. You can chat with the user freely, but call this when the plan changes.",
                parameters: responseSchema
              }
            ]
          }]
        };
      }

      // Convert frontend history format to Gemini contents
      const contents = history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '' }]
      })).filter(m => m.parts[0].text.trim() !== '');

      // Push current user prompt
      contents.push({ role: 'user', parts: [{ text: prompt }] });

      // Add context as a system instruction or prepend to the first message if system instruction is not supported directly in contents.
      // We will just prepend the system prompt and context to the very first message.
      if (contents.length > 0) {
        contents[0].parts[0].text = `${fullPrompt}\n\n${contents[0].parts[0].text}`;
      } else {
        contents.push({ role: 'user', parts: [{ text: `${fullPrompt}\n\nUser Query: ${prompt}` }] });
      }

      const resultStream = await ai.models.generateContentStream({
        model: 'gemini-2.0-flash',
        contents,
        config
      });

      for await (const chunk of resultStream) {
        // Check for function calls
        if (chunk.functionCalls && chunk.functionCalls.length > 0) {
          const call = chunk.functionCalls[0];
          if (call.name === 'update_trip_plan') {
            onToolCall && onToolCall(call.args);
          }
        }
        
        // Safely extract text
        try {
          const textChunk = chunk.text;
          if (textChunk) {
            onToken && onToken(textChunk);
          }
        } catch {
          // No text in this chunk (might just be a function call)
        }
      }
      
    } catch (error) {
      logger.error(`[Agent ${this.name}] Stream execution failed:`, error);
      throw new Error(`AI stream execution failed in agent: ${this.name}`);
    }
  }
}
