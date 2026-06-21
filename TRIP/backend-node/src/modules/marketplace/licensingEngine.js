/**
 * Licensing Engine
 * Manages access control and pricing tiers for data products.
 */

const LICENSES = {
  RESEARCH: { name: 'Academic License', costMultiplier: 0.1, limits: 'Low' },
  GOVERNMENT: { name: 'Government License', costMultiplier: 0.5, limits: 'High' },
  ENTERPRISE: { name: 'Enterprise License', costMultiplier: 1.0, limits: 'Unlimited' }
};

export const evaluateLicense = (tenantType, dataset) => {
  const licenseType = tenantType.toUpperCase();
  const license = LICENSES[licenseType];
  
  if (!license) return { allowed: false, reason: "Invalid License Type" };

  if (dataset.accessLevel === "Regulated" && licenseType !== "GOVERNMENT") {
    return { allowed: false, reason: "Regulated datasets require Government License" };
  }

  return { allowed: true, license, cost: getBaseCost(dataset.pricingTier) * license.costMultiplier };
};

const getBaseCost = (tier) => {
  switch(tier) {
    case 'Enterprise': return 5000;
    case 'Government': return 2500;
    case 'Academic': return 500;
    default: return 1000;
  }
};
