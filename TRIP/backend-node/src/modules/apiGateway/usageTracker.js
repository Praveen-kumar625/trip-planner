/**
 * Usage Tracker
 * Tracks API hits per tenant for billing and rate limiting.
 */

export const trackUsage = (req, res, next) => {
  const tenantId = req.tenant?.id;
  const endpoint = req.path;

  // Production: Increment Redis counter asynchronously
  console.log(`[UsageTracker] Tenant: ${tenantId} | Endpoint: ${endpoint}`);

  next();
};
