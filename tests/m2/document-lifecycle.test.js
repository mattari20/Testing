import test from 'node:test';
import assert from 'node:assert/strict';
import { createMasterProfile, createTargetedCV, addSection, createDocumentSnapshot } from '../../src/core/career-document-core.js';
import { createDocumentRecord, saveDocumentRevision, createRecoveryPoint, restoreRecoveryPoint, archiveDocument, restoreDocument, deleteDocument, getCurrentRevision, listRevisions, validateLifecycleRecord } from '../../src/core/document-lifecycle.js';

function fixture() {
  const profile = createMasterProfile({id:'profile-m2'});
  addSection(profile, {id:'summary', type:'summary', title:'Summary'});
  const cv = createTargetedCV({id:'cv-m2', masterProfileId:profile.id, title:'Engineer CV'});
  return { profile, cv, snapshot: createDocumentSnapshot(profile, cv) };
}

test('creates a lifecycle document record with a current revision', () => {
  const { snapshot } = fixture();
  const record = createDocumentRecord(snapshot);
  assert.equal(validateLifecycleRecord(record).valid, true);
  assert.equal(getCurrentRevision(record).revisionNumber, 1);
});

test('saving creates a new revision and supersedes the previous one', () => {
  const { profile, cv, snapshot } = fixture();
  const record = createDocumentRecord(snapshot);
  profile.careerData.sections[0].title = 'Updated Summary';
  const next = createDocumentSnapshot(profile, cv);
  saveDocumentRevision(record, next, 'edit');
  assert.equal(record.currentRevision, 2);
  assert.equal(getCurrentRevision(record).revisionNumber, 2);
  assert.equal(listRevisions(record).length, 2);
  assert.equal(listRevisions(record)[1].state, 'superseded');
});

test('recovery point can be created and consumed exactly once', () => {
  const { snapshot } = fixture();
  const record = createDocumentRecord(snapshot);
  createRecoveryPoint(record, snapshot);
  assert.equal(restoreRecoveryPoint(record).targetedCVId, 'cv-m2');
  assert.throws(() => restoreRecoveryPoint(record), /not available/);
});

test('archive and restore preserve the document record', () => {
  const { snapshot } = fixture();
  const record = createDocumentRecord(snapshot);
  archiveDocument(record);
  assert.equal(record.lifecycle.kind, 'archived');
  restoreDocument(record);
  assert.equal(record.lifecycle.kind, 'draft');
  assert.equal(validateLifecycleRecord(record).valid, true);
});

test('delete is explicit and does not erase revision history', () => {
  const { snapshot } = fixture();
  const record = createDocumentRecord(snapshot);
  deleteDocument(record);
  assert.equal(record.lifecycle.kind, 'deleted');
  assert.equal(record.revisions.length, 1);
});

test('lifecycle rejects multiple current revisions', () => {
  const { snapshot } = fixture();
  const record = createDocumentRecord(snapshot);
  record.revisions.push({...record.revisions[0], id:'bad'});
  assert.equal(validateLifecycleRecord(record).valid, false);
});
