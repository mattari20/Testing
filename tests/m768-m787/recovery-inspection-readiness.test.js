import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorPersistenceRecord, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorLifecycleController } from '../../src/application/editor-lifecycle-controller.js';

function surface(name = 'Candidate') {
  return createEditorSurface({
    profileData: { careerData: { identity: { fullName: name }, sections: [] } },
    cvData: { title: 'CV', configuration: { template: { id: 't01-modern-minimalist-cv-design_modern' } } }
  });
}

function recordFor(s, name = 'Persisted') {
  return createEditorPersistenceRecord(surface(name).getState().session, {
    savedAt: '2026-10-01T08:00:00.000Z',
    revision: 2
  });
}

test('M768-M771: recovery inspection initializes once and exposes readiness', () => {
  const current = surface('Current');
  const record = recordFor(current, 'Current');
  let loads = 0;
  const recovery = createEditorRecoveryController(current, {
    load: () => { loads += 1; return record; },
    save: () => record,
    clear() {}
  });
  const first = recovery.getState();
  const second = recovery.getState();
  assert.equal(first.recoveryInspectionStatus, 'ready');
  assert.equal(first.recoveryInspectionSequence, 1);
  assert.equal(second.recoveryInspectionSequence, 1);
  assert.equal(loads, 1);
  recovery.destroy();
});

test('M772-M775: lifecycle state reads do not duplicate persistence inspection', () => {
  const current = surface('Current');
  const record = recordFor(current, 'Current');
  let loads = 0;
  const recovery = createEditorRecoveryController(current, {
    load: () => { loads += 1; return record; },
    save: () => record,
    clear() {}
  });
  const lifecycle = createEditorLifecycleController(current, recovery);
  const first = lifecycle.getState();
  const second = lifecycle.getState();
  assert.equal(first.recoveryInspectionSequence, 1);
  assert.equal(second.recoveryInspectionSequence, 1);
  assert.equal(loads, 1);
  lifecycle.destroy();
  recovery.destroy();
});

test('M776-M779: editor mutation invalidates inspection and next read rehydrates state', () => {
  const current = surface('Current');
  let stored = recordFor(current, 'Current');
  let loads = 0;
  const recovery = createEditorRecoveryController(current, {
    load: () => { loads += 1; return stored; },
    save: session => {
      stored = createEditorPersistenceRecord(session, { revision: 3 });
      return stored;
    },
    clear() {}
  });
  assert.equal(recovery.getState().recoveryInspectionSequence, 1);
  current.dispatch({ type: 'set-identity', target: { key: 'fullName' }, payload: { value: 'Changed' }, mutatesData: true });
  assert.equal(recovery.getState().recoveryInspectionSequence, 2);
  assert.equal(loads, 2);
  recovery.destroy();
});

test('M780-M783: explicit refresh detects external persistence replacement', () => {
  const current = surface('Current');
  const first = recordFor(current, 'First');
  const second = recordFor(current, 'Second');
  let stored = first;
  const recovery = createEditorRecoveryController(current, {
    load: () => stored,
    save: () => stored,
    clear() {}
  });
  assert.equal(recovery.getState().persistenceSnapshotId, first.snapshotId);
  stored = second;
  assert.equal(recovery.getState().persistenceSnapshotId, first.snapshotId);
  recovery.refreshRecovery();
  assert.equal(recovery.getState().persistenceSnapshotId, second.snapshotId);
  assert.equal(recovery.getState().recoveryInspectionSequence, 2);
  recovery.destroy();
});

test('M784-M787: clear establishes a ready missing inspection state', () => {
  const current = surface('Current');
  const record = recordFor(current, 'Persisted');
  const recovery = createEditorRecoveryController(current, {
    load: () => record,
    save: () => record,
    clear() {}
  });
  recovery.getState();
  recovery.clear();
  const state = recovery.getState();
  assert.equal(state.recoveryInspectionStatus, 'ready');
  assert.equal(state.recoveryStatus, 'missing');
  assert.equal(state.recoveryInspectionSequence, 2);
  assert.equal(state.persistenceRelation, 'missing');
  recovery.destroy();
});
