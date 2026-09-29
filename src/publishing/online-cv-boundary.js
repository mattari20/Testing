import { VISIBILITY, createPrivacyPolicy, resolvePublicProjection } from '../security/security-privacy-engine.js';

export const ONLINE_CV_VERSION = '1.0.0';

export function createOnlineCVPublication(input = {}) {
  const policy = createPrivacyPolicy(input.policy || {});
  if (policy.visibility !== VISIBILITY.PUBLIC && policy.visibility !== VISIBILITY.LINK_ONLY) {
    throw new Error('Online CV publication requires link-only or public visibility.');
  }
  if (!input.documentSnapshot) throw new Error('Online CV publication requires a document snapshot.');
  return Object.freeze({
    version: ONLINE_CV_VERSION,
    publicationId: String(input.publicationId || 'publication_' + Date.now().toString(36)),
    visibility: policy.visibility,
    downloadable: policy.downloadable,
    searchIndexing: policy.searchIndexing,
    publicProjection: resolvePublicProjection(
      input.publicProfile || {},
      policy,
      input.allowedFields || []
    ),
    source: {
      masterProfileId: input.documentSnapshot.masterProfileId || null,
      targetedCVId: input.documentSnapshot.targetedCVId || null,
      targetedCVRevision: input.documentSnapshot.targetedCVRevision || null,
      templateId: input.template?.id || null,
      templateVersion: input.template?.version || null
    },
    state: 'published',
    publishedAt: new Date().toISOString()
  });
}

export function revokeOnlineCVPublication(publication) {
  return {
    ...publication,
    state: 'revoked',
    visibility: VISIBILITY.PRIVATE,
    publicProjection: {},
    revokedAt: new Date().toISOString()
  };
}
