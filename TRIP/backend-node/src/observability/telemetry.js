/**
 * Core Telemetry Logger
 * Logs system level metrics.
 */

export const logMetric = (metricName, value, tags = {}) => {
  // In production, this ships to Datadog/Prometheus
  console.log(`[TELEMETRY] ${metricName}: ${value}`, tags);
};
