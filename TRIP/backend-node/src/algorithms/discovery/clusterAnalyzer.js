/**
 * Cluster Analyzer
 * Takes DBSCAN output and classifies areas.
 */

export const analyzeClusters = (clusteredPoints) => {
  const clusterMap = {};

  clusteredPoints.forEach(p => {
    if (!clusterMap[p.clusterId]) {
      clusterMap[p.clusterId] = { points: [], count: 0 };
    }
    clusterMap[p.clusterId].points.push(p);
    clusterMap[p.clusterId].count++;
  });

  const zones = {};

  for (const [clusterId, data] of Object.entries(clusterMap)) {
    if (clusterId === 'NOISE') {
      zones[clusterId] = {
        type: 'ISOLATED_GEMS',
        isDenseZone: false,
        pointCount: data.count
      };
    } else {
      zones[clusterId] = {
        type: data.count > 10 ? 'TOURIST_TRAP_ZONE' : 'MODERATE_ZONE',
        isDenseZone: data.count > 10,
        pointCount: data.count
      };
    }
  }

  return zones;
};
