import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createEditorPersistenceRecord,
  deserializeEditorPersistenceRecord,
  createEditorRecoveryController
} from '../../src/storage/editor-persistence.js';
import { createEditorSurface } from '../../src/application/editor-surface.js';

function session() {
  return {
    dirty: false,
    savedAt: null,
    lastCommand: 'save',
    application: {
      version: '1.0.0',
      masterProfile: { careerData: { identity: { fullName: 'Candidate' }, sections: [] } },
      targetedCV: { title: 'CV', configuration: { template: { id: 't01-modern-minimalist-cv-design_modern' } } }
    }
  };
}

function surface() {
  return createEditorSurface({
    profileData: session().application.masterProfile,
    cvData: session().application.targetedCV
  });
}

test('M588-M591: persistence record contains deterministic content identity', () => {
  const record = createEditorPersistenceRecord(session(), {
    revision: 4,
    savedAt: '2026-10-01T04:00:00.000Z'
  });
  assert.match(record.snapshotContentId, /^c-[0-9a-f]{8}$/);
  const restored = deserializeEditorPersistenceRecord(JSON.stringify(record));
  assert.equal(restored.snapshotContentId, record.snapshotContentId);
});

test('M592-M595: tampered content identity is rejected', () => {
  const record = createEditorPersistenceRecord(session(), {
    revision: 4,
    savedAt: '2026-10-01T04:00:00.000Z'
  });
  const tampered = { ...record, snapshotContentId: 'c-00000000' };
  assert.throws(
    () => deserializeEditorPersistenceRecord(JSON.stringify(tampered)),
    /snapshot identity is invalid|snapshot content identity is invalid/
  );
});

test('M596-M599: matching current and persisted content is reported as same', () => {
  const s = surface();
  const record = createEditorPersistenceRecord(s.getState().session, {
    revision: 4,
    savedAt: '2026-10-01T04:00:00.000Z'
  });
  const controller = createEditorRecoveryController(s, {
    load: () => record,
    save: state => createEditorPersistenceRecord(state, { revision: 5, savedAt: '2026-10-01T05:00:00.000Z' }),
    clear() {}
  });
  const state = controller.getRecoveryState();
  assert.equal(state.recoveryContentRelation, 'same');
  controller.destroy();
});

test('M600-M603: changed current content is reported as different', () => {
  const s = surface();
  const record = createEditorPersistenceRecord(s.getState().session, {
    revision: 4,
    savedAt: '2026-10-01T04:00:00.000Z'
  });
  s.dispatch({
    type: 'updateIdentity',
    payload: { fullName: 'Changed Candidate' },
    mutatesData: true
  });
  const controller = createEditorRecoveryController(s, {
    load: () => record,
    save: state => createEditorPersistenceRecord(state, { revision: 5 }),
    clear() {}
  });
  assert.equal(controller.getRecoveryState().recoveryContentRelation, 'different');
  controller.destroy();
});

test('M604-M607: legacy snapshots remain readable with unknown content relation', () => {
  const s = surface();
  const record = createEditorPersistenceRecord(s.getState().session, {
    revision: 4,
    savedAt: '2026-10-01T04:00:00.000Z'
  });
  const { snapshotContentId, ...legacy } = record;
  const controller = createEditorRecoveryController(s, {
    load: () => legacy,
    save: state => createEditorPersistenceRecord(state, { revision: 5 }),
    clear() {}
  });
  assert.equal(controller.getRecoveryState().recoveryContentRelation, 'unknown');
  controller.destroy();
});
