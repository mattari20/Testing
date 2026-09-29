import { OPERATION, VISIBILITY, createPrivacyPolicy, isAuthorized } from './security-privacy-engine.js';

export const PRODUCTION_SECURITY_VERSION = '1.0.0';

export function authorizeOperation(input = {}) {
  const policy = createPrivacyPolicy(input.policy || {});
  const authorized = isAuthorized(input.ownership, input.actorId, input.operation);
  if (!authorized) return { allowed:false, reason:'OWNER_AUTHORIZATION_REQUIRED', policy };
  if (input.operation === OPERATION.PUBLISH && policy.visibility === VISIBILITY.PRIVATE) {
    return { allowed:false, reason:'PUBLIC_VISIBILITY_REQUIRED_FOR_PUBLISH', policy };
  }
  if (input.operation === OPERATION.SHARE && policy.visibility === VISIBILITY.PRIVATE) {
    return { allowed:false, reason:'SHARE_POLICY_REQUIRED', policy };
  }
  if (input.operation === OPERATION.EXPORT && input.policy?.downloadable === false) {
    return { allowed:false, reason:'DOWNLOAD_DISABLED', policy };
  }
  return { allowed:true, reason:null, policy };
}

export function createPrivacySafeProcessingRequest(input = {}) {
  const policy = createPrivacyPolicy(input.policy || {});
  return Object.freeze({
    version: PRODUCTION_SECURITY_VERSION,
    purpose: String(input.purpose || 'career-document-processing'),
    visibility: policy.visibility,
    allowExternalProcessing: policy.allowExternalProcessing,
    analyticsEnabled: policy.analyticsEnabled,
    dataMinimization: input.fields ? [...new Set(input.fields.map(String))] : [],
    consentRequired: input.externalProcessing === true,
    externalProcessingAllowed: input.externalProcessing === true && policy.allowExternalProcessing === true,
    createdAt: new Date().toISOString()
  });
}
