/**
 * Marketplace Gateway API
 * Exposes marketplace endpoints to external consumers.
 */

import express from 'express';
import { getRegistry, getCatalogByCategory } from './datasetCatalog.js';
import { evaluateLicense } from './licensingEngine.js';
import { generateDataset } from './datasetGenerator.js';

export const marketplaceRouter = express.Router();

marketplaceRouter.get('/catalog', (req, res) => {
  res.json({ catalog: getRegistry() });
});

marketplaceRouter.get('/datasets', (req, res) => {
  const { category } = req.query;
  const datasets = category ? getCatalogByCategory(category) : getRegistry();
  res.json({ datasets });
});

marketplaceRouter.post('/purchase', async (req, res) => {
  const { tenantType, datasetId } = req.body;
  const dataset = getRegistry().find(d => d.id === datasetId);
  
  if (!dataset) return res.status(404).json({ error: "Dataset not found" });

  const licenseCheck = evaluateLicense(tenantType, dataset);
  
  if (!licenseCheck.allowed) {
    return res.status(403).json({ error: licenseCheck.reason });
  }

  const generated = await generateDataset(datasetId);
  
  res.json({
    message: "Purchase successful",
    license: licenseCheck.license,
    cost: licenseCheck.cost,
    download: generated.downloadUrl
  });
});
