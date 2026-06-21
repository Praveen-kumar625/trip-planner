/**
 * API Key Middleware
 * Validates enterprise API keys for B2B API access.
 */

export const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing x-api-key header' });
  }

  // Production: Validate against database/Redis
  // Mock validation
  if (apiKey !== 'demo-enterprise-key-123') {
    return res.status(403).json({ error: 'Invalid API Key' });
  }

  next();
};
