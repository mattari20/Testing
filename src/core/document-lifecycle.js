import { toSerializable } from './career-document-core.js';

export const LIFECYCLE_VERSION = '1.0.0';

export const PROFILE_STATES = Object.freeze(['active','archived','deleted']);
export const CV_STATES = Object.freeze(['draft','active','archived','deleted']);
export const REVISION_STATES = Object.freeze(['current','superseded']);
export const RECOVERY_STATES = Object.freeze(['available','consumed','expired']);

const clone = value => JSON.parse(JSON.stringify(value));
const now = () => new Date().toISOString();
const id = prefix => prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
const assert = (condition, message) => { if (!condition) throw new Error(message); };

function makeRevision(snapshot, revisionNumber, reason = 'edit') {
  return {
    id: id('rev'),
    revisionNumber,
    state: 'current',
    reason,
    createdAt: now(),
    snapshot: clone(snapshot)
  };
}

export function createLifecycleState(kind = 'draft') {
  return {
    lifecycleVersion: LIFECYCLE_VERSION,
    kind,
    revision: 1,
    updatedAt: now()
  };
}

export function createDocumentLifecycle(input = {}) {
  assert(input.masterProfileId, 'Document lifecycle requires masterProfileId.');
  assert(input.targetedCVId, 'Document lifecycle requires targetedCVId.');
  return {
    lifecycleVersion: LIFECYCLE_VERSION,
    masterProfileId: String(input.masterProfileId),
    targetedCVId: String(input.targetedCVId),
    kind: input.kind || 'draft',
    revision: 1,
    updatedAt: now()
  };
}

export function createDocumentRecord(snapshot, options = {}) {
  assert(snapshot && snapshot.targetedCVId, 'A targeted CV snapshot is required.');
  return {
    id: id('document'),
    targetedCVId: snapshot.targetedCVId,
    masterProfileId: snapshot.masterProfileId,
    lifecycle: createLifecycleState(options.kind || 'draft'),
    currentRevision: 1,
    revisions: [makeRevision(snapshot, 1, 'initial')],
    recovery: null,
    createdAt: now(),
    updatedAt: now(),
    metadata: clone(options.metadata || {})
  };
}

export function saveDocumentRevision(record, snapshot, reason = 'edit') {
  assert(record && Array.isArray(record.revisions), 'Invalid document record.');
  assert(snapshot && snapshot.targetedCVId === record.targetedCVId, 'Snapshot does not belong to document.');
  const previous = record.revisions.find(r => r.state === 'current');
  if (previous) previous.state = 'superseded';
  const revisionNumber = record.currentRevision + 1;
  const revision = makeRevision(snapshot, revisionNumber, reason);
  record.revisions.push(revision);
  record.currentRevision = revisionNumber;
  record.lifecycle.revision += 1;
  record.lifecycle.updatedAt = now();
  record.updatedAt = now();
  return clone(revision);
}

export function createRecoveryPoint(record, snapshot, reason = 'autosave') {
  assert(record && snapshot, 'Record and snapshot are required.');
  record.recovery = {
    id: id('recovery'),
    state: 'available',
    reason,
    createdAt: now(),
    documentRevision: record.currentRevision,
    snapshot: clone(snapshot)
  };
  record.updatedAt = now();
  return clone(record.recovery);
}

export function restoreRecoveryPoint(record) {
  assert(record && record.recovery, 'No recovery point is available.');
  assert(record.recovery.state === 'available', 'Recovery point is not available.');
  const snapshot = clone(record.recovery.snapshot);
  record.recovery.state = 'consumed';
  record.updatedAt = now();
  return snapshot;
}

export function archiveDocument(record) {
  assert(record.lifecycle.kind !== 'deleted', 'Deleted document cannot be archived.');
  record.lifecycle.kind = 'archived';
  record.lifecycle.revision += 1;
  record.lifecycle.updatedAt = now();
  record.updatedAt = now();
}

export function restoreDocument(record) {
  assert(record.lifecycle.kind === 'archived', 'Only archived documents can be restored.');
  record.lifecycle.kind = 'draft';
  record.lifecycle.revision += 1;
  record.lifecycle.updatedAt = now();
  record.updatedAt = now();
}

export function deleteDocument(record) {
  assert(record.lifecycle.kind !== 'deleted', 'Document is already deleted.');
  record.lifecycle.kind = 'deleted';
  record.lifecycle.revision += 1;
  record.lifecycle.updatedAt = now();
  record.updatedAt = now();
}

export function getCurrentRevision(record) {
  const current = record.revisions.find(r => r.state === 'current');
  return current ? clone(current) : null;
}

export function getRevision(record, revisionNumber) {
  const revision = record.revisions.find(r => r.revisionNumber === revisionNumber);
  return revision ? clone(revision) : null;
}

export function listRevisions(record) {
  return record.revisions
    .slice()
    .sort((a,b) => b.revisionNumber - a.revisionNumber)
    .map(clone);
}

export function validateLifecycleRecord(record) {
  const errors = [];
  if (!record?.id) errors.push('Document record id is required.');
  if (!record?.targetedCVId) errors.push('targetedCVId is required.');
  if (!record?.masterProfileId) errors.push('masterProfileId is required.');
  if (!record?.lifecycle?.kind || !CV_STATES.includes(record.lifecycle.kind)) errors.push('Invalid lifecycle state.');
  if (!Number.isInteger(record?.currentRevision) || record.currentRevision < 1) errors.push('Invalid current revision.');
  const currents = (record?.revisions || []).filter(r => r.state === 'current');
  if (currents.length !== 1) errors.push('Exactly one current revision is required.');
  if (currents[0] && currents[0].revisionNumber !== record.currentRevision) errors.push('Current revision pointer is inconsistent.');
  return { valid: errors.length === 0, errors };
}

export function serializeLifecycleRecord(record) {
  return toSerializable(record);
}
