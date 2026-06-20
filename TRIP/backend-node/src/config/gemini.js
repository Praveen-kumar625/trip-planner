import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';

let ai = null;

if (env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
} else {
  console.warn('⚠️ GEMINI_API_KEY not found. AI features will fail or mock responses.');
}

export { ai };
