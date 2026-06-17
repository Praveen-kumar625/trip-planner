import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env.js';

let genAI = null;
let model = null;

if (env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
} else {
  console.warn('⚠️ GEMINI_API_KEY not found. AI features will fail or mock responses.');
}

export { genAI, model };
