import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DATA_CLASS,
  VISIBILITY,
  OPERATION,
  createDataClassification,
  createOwnershipRecord,
  isAuthorized,
  createPrivacyPolicy,
  resolvePublicProjection,
  createConsentRecord,
  withdrawConsent,
  createStorageBoundary,
  createDeletionPlan,
  applyUnpublish,
  applyRevoke,
  validateSecurityRecord
} from '../../src/security/security-privacy-engine.js';

test('classifies sensitive regional career data explicitly', () => {
  const result = createDataClassification({ classification: DATA_CLASS.SENSITIVE_CAREER, purpose: 'cv' });
  assert.equal(result.sensitive, true);
});

test('ownership gates protected operations', () => {
  const ownership = createOwnershipRecord({ ownerId: 'user-1', objectType: 'cv', objectId: 'cv-1' });
  assert.equal(isAuthorized(ownership, 'user-1', OPERATION.EDIT), true);
  assert.equal(isAuthorized(ownership, 'user-2', OPERATION.EDIT), false);
});

test('privacy policy defaults to private', () => {
  const policy = createPrivacyPolicy();
  assert.equal(policy.visibility, VISIBILITY.PRIVATE);
  assert.equal(policy.searchIndexing, false);
});

test('public projection exposes only explicitly selected fields', () => {
  const policy = createPrivacyPolicy({ visibility: VISIBILITY.PUBLIC, publicFields: ['name', 'job'] });
  const result = resolvePublicProjection({ name: 'Ali', job: 'Engineer', phone: 'secret' }, policy);
  assert.deepEqual(result, { name: 'Ali', job: 'Engineer' });
});

test('consent can be granted and withdrawn', () => {
  const consent = createConsentRecord({ purpose: 'external-ai', granted: true, policyVersion: '1' });
  assert.equal(consent.state, 'granted');
  const withdrawn = withdrawConsent(consent);
  assert.equal(withdrawn.state, 'withdrawn');
  assert.ok(withdrawn.withdrawnAt);
});

test('storage boundary preserves local-first and optional cloud principles', () => {
  const storage = createStorageBoundary();
  assert.equal(storage.mode, 'local-first');
  assert.equal(storage.cloudOptional, true);
});

test('deletion plan distinguishes recovery and scope', () => {
  const plan = createDeletionPlan({ scope: ['targeted-cv', 'artifact'] });
  assert.deepEqual(plan.scope, ['targeted-cv', 'artifact']);
  assert.equal(plan.preserveRecovery, true);
});

test('unpublish and revoke are distinct from source deletion', () => {
  const record = { visibility: VISIBILITY.PUBLIC, lifecycle: 'active' };
  assert.equal(applyUnpublish(record).lifecycle, 'unpublished');
  assert.equal(applyRevoke(record).lifecycle, 'revoked');
  assert.equal(record.lifecycle, 'active');
});

test('security records require ownership and object identity', () => {
  assert.equal(validateSecurityRecord({ ownerId: 'u', objectType: 'cv', objectId: 'c' }).valid, true);
  assert.equal(validateSecurityRecord({ ownerId: 'u' }).valid, false);
});
