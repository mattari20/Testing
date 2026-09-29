export const SECURITY_ENGINE_VERSION = '1.0.0';

export const DATA_CLASS = Object.freeze({
  PRODUCT: 'product',
  IDENTITY: 'identity',
  PRIVATE_CAREER: 'private-career',
  SENSITIVE_CAREER: 'sensitive-career',
  SOURCE_DOCUMENT: 'source-document',
  GENERATED_ARTIFACT: 'generated-artifact',
  ANALYSIS: 'analysis',
  AI_SUGGESTION: 'ai-suggestion',
  ENTITLEMENT: 'entitlement',
  ANALYTICS: 'analytics',
  AUDIT: 'audit'
});

export const VISIBILITY = Object.freeze({
  PRIVATE: 'private',
  LINK_ONLY: 'link-only',
  PUBLIC: 'public'
});

export const OWNER_ROLE = Object.freeze({
  ACCOUNT: 'account-owner',
  PROFILE: 'profile-owner',
  CV: 'cv-owner',
  ASSET: 'asset-owner',
  PUBLISHER: 'publisher',
  ENTITLEMENT: 'entitlement-owner'
});

export const OPERATION = Object.freeze({
  VIEW: 'view',
  EDIT: 'edit',
  EXPORT: 'export',
  PUBLISH: 'publish',
  SHARE: 'share',
  DELETE: 'delete',
  REVOKE: 'revoke'
});

export const LIFECYCLE = Object.freeze({
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  UNPUBLISHED: 'unpublished',
  DELETED: 'deleted',
  REVOKED: 'revoked'
});

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const arr = value => Array.isArray(value) ? value : [];

export function createDataClassification(input = {}) {
  const className = Object.values(DATA_CLASS).includes(input.classification) ? input.classification : DATA_CLASS.PRIVATE_CAREER;
  return {
    version: SECURITY_ENGINE_VERSION,
    classification: className,
    sensitive: input.sensitive === true || className === DATA_CLASS.SENSITIVE_CAREER,
    purpose: String(input.purpose || 'career-document'),
    retention: input.retention ? String(input.retention) : null
  };
}

export function createOwnershipRecord(input = {}) {
  if (!input.ownerId) throw new Error('ownerId is required.');
  return {
    version: SECURITY_ENGINE_VERSION,
    ownerId: String(input.ownerId),
    roles: arr(input.roles).map(String),
    objectType: String(input.objectType || 'career-document'),
    objectId: String(input.objectId || ''),
    createdAt: input.createdAt || new Date().toISOString()
  };
}

export function isAuthorized(ownership, actorId, operation) {
  if (!ownership || !actorId || !Object.values(OPERATION).includes(operation)) return false;
  if (String(ownership.ownerId) !== String(actorId)) return false;
  return true;
}

export function createPrivacyPolicy(input = {}) {
  return {
    version: SECURITY_ENGINE_VERSION,
    visibility: Object.values(VISIBILITY).includes(input.visibility) ? input.visibility : VISIBILITY.PRIVATE,
    publicFields: arr(input.publicFields).map(String),
    downloadable: input.downloadable === true,
    searchIndexing: input.searchIndexing === true,
    allowExternalProcessing: input.allowExternalProcessing === true,
    analyticsEnabled: input.analyticsEnabled === true,
    updatedAt: input.updatedAt || new Date().toISOString()
  };
}

export function resolvePublicProjection(profile, policy, allowedFields = []) {
  const source = isObject(profile) ? clone(profile) : {};
  const allow = new Set(arr(allowedFields).map(String));
  const result = {};
  for (const key of Object.keys(source)) {
    if (allow.has(key) || arr(policy?.publicFields).includes(key)) result[key] = source[key];
  }
  return result;
}

export function createConsentRecord(input = {}) {
  if (!input.purpose) throw new Error('Consent purpose is required.');
  return {
    id: String(input.id || 'consent_' + Date.now().toString(36)),
    purpose: String(input.purpose),
    state: input.granted === true ? 'granted' : 'not-granted',
    grantedAt: input.granted === true ? (input.grantedAt || new Date().toISOString()) : null,
    withdrawnAt: null,
    policyVersion: input.policyVersion ? String(input.policyVersion) : null
  };
}

export function withdrawConsent(record) {
  const next = clone(record);
  next.state = 'withdrawn';
  next.withdrawnAt = new Date().toISOString();
  return next;
}

export function createStorageBoundary() {
  return Object.freeze({
    version: SECURITY_ENGINE_VERSION,
    mode: 'local-first',
    cloudOptional: true,
    operations: Object.freeze(['read', 'write', 'remove', 'list', 'export', 'import'])
  });
}

export function createDeletionPlan(input = {}) {
  const scope = arr(input.scope).map(String);
  return {
    version: SECURITY_ENGINE_VERSION,
    scope,
    requestedAt: input.requestedAt || new Date().toISOString(),
    preserveRecovery: input.preserveRecovery !== false,
    sourceDataRetainedFor: arr(input.sourceDataRetainedFor),
    status: LIFECYCLE.ACTIVE
  };
}

export function applyUnpublish(record) {
  const next = clone(record);
  next.visibility = VISIBILITY.PRIVATE;
  next.lifecycle = LIFECYCLE.UNPUBLISHED;
  next.updatedAt = new Date().toISOString();
  return next;
}

export function applyRevoke(record) {
  const next = clone(record);
  next.lifecycle = LIFECYCLE.REVOKED;
  next.updatedAt = new Date().toISOString();
  return next;
}

export function validateSecurityRecord(record = {}) {
  const errors = [];
  if (!record.ownerId) errors.push('OWNER_REQUIRED');
  if (!record.objectType) errors.push('OBJECT_TYPE_REQUIRED');
  if (!record.objectId) errors.push('OBJECT_ID_REQUIRED');
  return { valid: errors.length === 0, errors };
}
