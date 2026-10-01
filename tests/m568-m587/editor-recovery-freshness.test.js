import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorPersistenceRecord, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorSurface } from '../../src/application/editor-surface.js';

function session(savedAt = null) {
  return {
    dirty: false,
    savedAt,
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

function controllerFor(savedAt, currentSavedAt = null) {
  const s = surface();
  if (currentSavedAt) s.markSaved(currentSavedAt);
  const record = createEditorPersistenceRecord(session(savedAt), {
    revision: 5,
    savedAt
  });
  const adapter = {
    load: () => record,
    save: state => createEditorPersistenceRecord(state, { revision: 6 }),
    clear() {}
  };
  return { controller: createEditorRecoveryController(s, adapter), surface: s };
}

test('M568-M571: newer persisted snapshot is classified as newer', () => {
  const { controller } = controllerFor('2026-10-01T02:00:00.000Z', '2026-10-01T01:00:00.000Z');
  const state = controller.getRecoveryState();
  assert.equal(state.recoveryRelation, 'newer');
  assert.equal(state.recoveryIsNewer, true);
  controller.destroy();
});

test('M572-M575: equal timestamps are classified as same-time', () => {
  const { controller } = controllerFor('2026-10-01T02:00:00.000Z', '2026-10-01T02:00:00.000Z');
  const state = controller.getRecoveryState();
  assert.equal(state.recoveryRelation, 'same');
  assert.equal(state.recoveryIsNewer, false);
  controller.destroy();
});

test('M576-M579: older persisted snapshot is classified as older', () => {
  const { controller } = controllerFor('2026-10-01T01:00:00.000Z', '2026-10-01T02:00:00.000Z');
  const state = controller.getRecoveryState();
  assert.equal(state.recoveryRelation, 'older');
  assert.equal(state.recoveryIsNewer, false);
  controller.destroy();
});

test('M580-M582: missing current save time makes persisted snapshot newer', () => {
  const { controller } = controllerFor('2026-10-01T02:00:00.000Z');
  const state = controller.getRecoveryState();
  assert.equal(state.recoveryRelation, 'newer');
  assert.equal(state.recoveryIsNewer, true);
  controller.destroy();
});

test('M583-M584: invalid freshness timestamps are reported as unknown', () => {
  const { controller } = controllerFor('not-a-date', 'also-not-a-date');
  const state = controller.getRecoveryState();
  assert.equal(state.recoveryRelation, 'unknown');
  assert.equal(state.recoveryIsNewer, false);
  controller.destroy();
});

test('M585-M587: successful save and recovery normalize freshness to same', () => {
  const s = surface();
  const record = createEditorPersistenceRecord(session(), {
    revision: 5,
    savedAt: '2026-10-01T03:00:00.000Z'
  });
  const adapter = {
    load: () => record,
    save: state => createEditorPersistenceRecord(state, {
      revision: 6,
      savedAt: '2026-10-01T04:00:00.000Z'
    }),
    clear() {}
  };
  const controller = createEditorRecoveryController(s, adapter);
  controller.save();
  assert.equal(controller.getRecoveryState().recoveryRelation, 'same');
  controller.recover();
  assert.equal(controller.getRecoveryState().recoveryRelation, 'same');
  controller.destroy();
});
