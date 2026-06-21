/**
 * Tourism Intelligence Cloud API Gateway
 * Exposes core TPOS intelligence engines as B2B API endpoints.
 */

import express from 'express';
import { apiKeyMiddleware } from './apiKeyMiddleware.js';
import { tenantMiddleware } from './tenantMiddleware.js';
import { trackUsage } from './usageTracker.js';

const router = express.Router();

// Apply global B2B middlewares
router.use(apiKeyMiddleware);
router.use(tenantMiddleware);
router.use(trackUsage);

// 1. Travel DNA API
router.post('/travel-dna/analyze', async (req, res) => {
  // Mock call to Travel DNA Engine
  res.json({
    persona: "Nature Seeker",
    confidence: 0.94,
    affinities: { mountains: 0.9, photography: 0.8 }
  });
});

// 2. Hidden Gem API
router.post('/discovery/gems', async (req, res) => {
  res.json({
    hiddenGems: [
      { name: "Shangarh", authenticityScore: 92, tourismPressure: 12 }
    ]
  });
});

// 3. Recommendation API
router.post('/recommendations', async (req, res) => {
  res.json({
    recommendations: [
      { target: "Tirthan Valley", confidence: 0.93 }
    ]
  });
});

// 4. Digital Twin API
router.post('/simulation', async (req, res) => {
  res.json({
    fatigueScore: 76,
    riskScore: 34
  });
});

// 5. Sustainability API
router.post('/sustainability', async (req, res) => {
  res.json({
    carbonScore: 84,
    localImpactScore: 88
  });
});

export default router;
