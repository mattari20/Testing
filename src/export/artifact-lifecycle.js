import { EXPORT_STATE, validateArtifactRecord } from './export-engine.js';

export const ARTIFACT_LIFECYCLE_VERSION = '1.0.0';

export function createArtifactLifecycle(input = {}) {
  if (!input.artifact) throw new Error('Artifact is required.');
  const validation = validateArtifactRecord(input.artifact);
  if (!validation.valid) throw new Error('Invalid artifact: ' + validation.errors.join(', '));
  return {
    version: ARTIFACT_LIFECYCLE_VERSION,
    artifactId: input.artifact.artifactId,
    outputType: input.artifact.outputType,
    state: input.state || EXPORT_STATE.COMPLETED,
    download: {
      available: input.available !== false,
      filename: input.filename || null,
      contentType: input.contentType || null,
      expiresAt: input.expiresAt || null
    },
    revocable: input.revocable !== false,
    createdAt: input.createdAt || new Date().toISOString()
  };
}

export function revokeArtifact(lifecycle, reason = 'USER_REQUESTED') {
  return {
    ...lifecycle,
    state: EXPORT_STATE.CANCELLED,
    download: { ...lifecycle.download, available: false },
    revokedAt: new Date().toISOString(),
    revokeReason: String(reason)
  };
}

export function markArtifactExpired(lifecycle) {
  return {
    ...lifecycle,
    state: EXPORT_STATE.EXPIRED,
    download: { ...lifecycle.download, available: false },
    expiredAt: new Date().toISOString()
  };
}
