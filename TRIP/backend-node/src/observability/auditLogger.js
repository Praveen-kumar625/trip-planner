/**
 * Audit Logger
 * Tracks sensitive enterprise and government actions.
 */

export const logAudit = (actor, action, resource, metadata = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    actor,
    action,
    resource,
    ...metadata
  };
  // In production, write to immutable storage
  console.log(`[AUDIT]`, logEntry);
};
