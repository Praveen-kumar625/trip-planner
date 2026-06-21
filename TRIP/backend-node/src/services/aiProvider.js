import { GoogleGenAI, Type } from '@google/genai';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { withRetry } from '../utils/requestManager.js';

class AIProvider {
  constructor() {
    if (!env.GEMINI_API_KEY) {
      throw new Error('CRITICAL ERROR: GEMINI_API_KEY is missing. The server cannot initialize AI capabilities.');
    }
    this.client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }

  transformSchema(schema) {
    if (!schema) return undefined;
    const newSchema = JSON.parse(JSON.stringify(schema));
    
    const transformNode = (node) => {
      if (node && node.type && typeof node.type === 'string') {
        node.type = Type[node.type.toUpperCase()];
      }
      if (node.properties) {
        for (const key in node.properties) {
          transformNode(node.properties[key]);
        }
      }
      if (node.items) {
        transformNode(node.items);
      }
    };
    
    transformNode(newSchema);
    return newSchema;
  }

  async generate({ model = 'gemini-2.5-pro', systemInstruction, prompt, context = '', responseSchema = null, history = [] }) {
    return await withRetry(async () => {
      const contents = [];
      
      if (history && history.length > 0) {
        history.forEach(m => {
          contents.push({
            role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content || '' }]
          });
        });
      }
      
      contents.push({ role: 'user', parts: [{ text: prompt }] });

      let combinedSystemInstruction = systemInstruction || '';
      if (context) combinedSystemInstruction += `\nContext:\n${context}`;
      if (responseSchema) combinedSystemInstruction += `\nYou must output ONLY valid JSON matching this exact schema: ${JSON.stringify(responseSchema)}`;

      const config = {};
      if (combinedSystemInstruction) {
        config.systemInstruction = combinedSystemInstruction;
      }

      if (responseSchema) {
        config.responseMimeType = "application/json";
        config.responseSchema = this.transformSchema(responseSchema);
      }

      const response = await this.client.models.generateContent({
        model,
        contents,
        config
      });

      const text = response.text;
      
      if (responseSchema) {
        try {
          return JSON.parse(text);
        } catch (err) {
          logger.error(`[AIProvider] Failed to parse JSON response`, { response: text, error: err.message });
          throw new Error('Invalid JSON response from AI');
        }
      }
      
      return text;
    }, 3, 1000);
  }

  async stream({ model = 'gemini-2.5-flash', systemInstruction, prompt, context = '', responseSchema = null, history = [], onToken, onToolCall }) {
    return await withRetry(async () => {
      const contents = [];
      
      if (history && history.length > 0) {
        history.forEach(m => {
          contents.push({
            role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content || '' }]
          });
        });
      }
      
      contents.push({ role: 'user', parts: [{ text: prompt }] });

      let combinedSystemInstruction = systemInstruction || '';
      if (context) combinedSystemInstruction += `\nContext:\n${context}`;

      let config = {};
      if (combinedSystemInstruction) {
        config.systemInstruction = combinedSystemInstruction;
      }
      
      if (responseSchema) {
        config.tools = [{
          functionDeclarations: [{
            name: "update_trip_plan",
            description: "Call this function whenever you have enough information to create or update the detailed trip itinerary JSON. You can chat with the user freely, but call this when the plan changes.",
            parameters: this.transformSchema(responseSchema)
          }]
        }];
      }

      const streamResult = await this.client.models.generateContentStream({
        model,
        contents,
        config
      });

      for await (const chunk of streamResult) {
        if (chunk.functionCalls && chunk.functionCalls.length > 0) {
          const call = chunk.functionCalls[0];
          if (call.args) {
            onToolCall && onToolCall(call.args);
          }
        }
        
        const textParts = chunk.candidates?.[0]?.content?.parts?.filter(p => p.text) || [];
        if (textParts.length > 0) {
          const text = textParts.map(p => p.text).join('');
          if (text) {
            onToken && onToken(text);
          }
        }
      }
    }, 3, 1000);
  }
}

export const aiProvider = new AIProvider();
