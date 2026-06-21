/**
 * Tenant Middleware
 * Injects tenant context into the request for multi-tenant isolation.
 */

export const tenantMiddleware = (req, res, next) => {
  // Production: Lookup tenant based on API key
  req.tenant = {
    id: 'tenant_himachal_tourism_board',
    tier: 'enterprise',
    rateLimit: 1000 // req/sec
  };

  next();
};
