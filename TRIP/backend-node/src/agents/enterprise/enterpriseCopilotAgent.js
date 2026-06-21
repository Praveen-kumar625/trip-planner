import BaseAgent from '../base.agent.js';
import { AnalyticsAgent } from './analyticsAgent.js';
import { ForecastAgent } from './forecastAgent.js';
import { StrategyAgent } from './strategyAgent.js';
import { ReportAgent } from './reportAgent.js';
import { generateStrategy } from '../../algorithms/enterprise/strategyRecommendationEngine.js';

export class EnterpriseCopilotAgent extends BaseAgent {
  constructor() {
    super('EnterpriseCopilotAgent', 'Master conversational agent for Tourism Officers and Executives.', []);
    this.analytics = new AnalyticsAgent();
    this.forecast = new ForecastAgent();
    this.strategy = new StrategyAgent();
    this.report = new ReportAgent();
  }

  async handleQuery(query) {
    this.log(`Received Query: "${query}"`);

    // 1. Data Retrieval
    const analyticsResult = await this.analytics.process(query);
    
    // 2. Forecasting
    const forecastResult = await this.forecast.process(analyticsResult);

    // 3. Strategy Formulation (Using Engine + Agent)
    let challengeType = query.toLowerCase().includes('overcrowded') ? 'Overcrowding' : 'Revenue';
    const strategyEngineResult = generateStrategy(challengeType, analyticsResult);
    const strategyResult = await this.strategy.process(analyticsResult, forecastResult);

    // 4. Report Generation (if asked)
    let reportResult = null;
    if (query.toLowerCase().includes('report')) {
      reportResult = await this.report.process(strategyResult);
    }

    return {
      response: `Based on current analytics, ${analyticsResult.insight}\n\nRecommendation: ${strategyEngineResult.recommendation}\nExpected Impact: ${strategyEngineResult.impact}`,
      data: analyticsResult.dataPoints,
      strategy: strategyEngineResult,
      report: reportResult
    };
  }
}
