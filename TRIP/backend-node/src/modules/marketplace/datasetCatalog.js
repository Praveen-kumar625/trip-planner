/**
 * Dataset Catalog
 * Handles filtering and querying the marketplace datasets.
 */

import { getRegistry } from './datasetRegistry.js';

export const getCatalogByCategory = (category) => {
  return getRegistry().filter(ds => ds.category === category);
};

export const searchCatalog = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return getRegistry().filter(ds => 
    ds.name.toLowerCase().includes(lowercaseQuery) || 
    ds.region.toLowerCase().includes(lowercaseQuery)
  );
};
