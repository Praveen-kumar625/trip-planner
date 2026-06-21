/**
 * Co-Occurrence Engine
 * Analyzes FREQUENTLY_COMBINED edges in the graph to discover hidden relationships.
 */

export const getCoOccurrences = (entityId, entityType) => {
  // Production: SELECT entity_b_id, correlation_type, frequency_weight 
  // FROM GraphCorrelations WHERE entity_a_id = $1 AND correlation_type = 'FREQUENTLY_COMBINED'

  // Mock output
  return [
    { relatedEntity: 'Jibhi', type: 'Destination', frequency: 85 },
    { relatedEntity: 'Kalga', type: 'Destination', frequency: 72 },
    { relatedEntity: 'Shoja', type: 'Destination', frequency: 68 },
    { relatedEntity: 'Jalori Pass', type: 'Activity', frequency: 94 }
  ];
};
