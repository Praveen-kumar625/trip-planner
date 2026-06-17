import { BaseAgent } from './base.agent.js';

const SYSTEM_PROMPT = `
You are the WANDERSYNC Budget & Finance Agent.
Your job is to analyze travel costs, convert currencies, and recommend budget adjustments.
You must return your analysis formatted as purely a JSON object without markdown formatting.

Structure:
{
  "estimatedTotal": number,
  "currency": "String (e.g. INR)",
  "breakdown": {
    "flights": number,
    "hotels": number,
    "food": number
  },
  "tips": ["String"]
}
`;

class BudgetAgent extends BaseAgent {
  constructor() {
    super('BudgetAnalyst', SYSTEM_PROMPT);
  }

  async estimateCosts(destination, travelers, days, context) {
    const prompt = `Estimate the costs for a ${days}-day trip to ${destination} for ${travelers} travelers.`;
    return await this.execute(prompt, context);
  }
}

export const BudgetAnalystAgent = new BudgetAgent();
