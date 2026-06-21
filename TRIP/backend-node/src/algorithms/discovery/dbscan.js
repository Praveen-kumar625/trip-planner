/**
 * DBSCAN (Density-Based Spatial Clustering of Applications with Noise)
 * Used to find spatial clusters of POIs to identify high-density tourist traps 
 * versus low-density 'Hidden Gems'.
 */

// Haversine distance in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
};

const regionQuery = (points, pointIdx, epsilon) => {
  const neighbors = [];
  for (let i = 0; i < points.length; i++) {
    const d = calculateDistance(
      points[pointIdx].lat, points[pointIdx].lng,
      points[i].lat, points[i].lng
    );
    if (d <= epsilon) {
      neighbors.push(i);
    }
  }
  return neighbors;
};

export const runDBSCAN = (points, epsilon = 2.0, minPts = 3) => {
  let clusterId = 0;
  const labels = new Array(points.length).fill(null); // null means unvisited

  for (let i = 0; i < points.length; i++) {
    if (labels[i] !== null) continue; // Already visited

    const neighbors = regionQuery(points, i, epsilon);

    if (neighbors.length < minPts) {
      labels[i] = -1; // -1 means NOISE (Outlier / potential hidden gem)
    } else {
      clusterId++;
      labels[i] = clusterId;

      let j = 0;
      while (j < neighbors.length) {
        const neighborIdx = neighbors[j];
        if (labels[neighborIdx] === -1) {
          labels[neighborIdx] = clusterId; // Noise becomes border point
        }
        if (labels[neighborIdx] === null) {
          labels[neighborIdx] = clusterId;
          const newNeighbors = regionQuery(points, neighborIdx, epsilon);
          if (newNeighbors.length >= minPts) {
            neighbors.push(...newNeighbors);
          }
        }
        j++;
      }
    }
  }

  // Attach cluster labels to points
  return points.map((p, idx) => ({
    ...p,
    clusterId: labels[idx] === -1 ? 'NOISE' : labels[idx]
  }));
};
