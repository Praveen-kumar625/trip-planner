/**
 * Dataset Registry
 * Centralized catalog of available Tourism Intelligence Datasets.
 */

export const datasetRegistry = [
  {
    id: "ds-dna-001",
    name: "Traveler Behavior & Affinity Trends 2026",
    category: "Travel DNA",
    region: "Madhya Pradesh",
    freshness: "Real-time",
    records: "1.2M",
    pricingTier: "Enterprise",
    accessLevel: "Premium"
  },
  {
    id: "ds-gem-002",
    name: "Hidden Gems & Tourism Pressure Heatmap",
    category: "Hidden Gems",
    region: "Central India",
    freshness: "Daily",
    records: "850K",
    pricingTier: "Government",
    accessLevel: "Regulated"
  },
  {
    id: "ds-city-003",
    name: "Smart City Demand Forecast & Economic Injection",
    category: "Smart City",
    region: "Jabalpur",
    freshness: "Hourly",
    records: "500K",
    pricingTier: "Enterprise",
    accessLevel: "Premium"
  },
  {
    id: "ds-sust-004",
    name: "Carbon Emissions & Local Economy Retention",
    category: "Sustainability",
    region: "National",
    freshness: "Weekly",
    records: "2.1M",
    pricingTier: "Academic",
    accessLevel: "Open Access"
  }
];

export const getRegistry = () => datasetRegistry;
