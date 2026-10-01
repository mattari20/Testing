import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import {
  createEditorPersistenceRecord,
  serializeEditorPersistenceRecord,
  deserializeEditorPersistenceRecord,
  createEditorPersistenceAdapter,
  createEditorRecoveryController
} from '../../src/storage/editor-persistence.js';

function createMemoryStorage() {
  const data = new Map();
  return {
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); }
  };
}

function createSurface() {
  return createEditorSurface({
    profileData: {
      careerData: {
        identity: { fullName: 'Ali Akbar', jobTitle: 'Engineer' },
        sections: [{
          id: 'experience',
          type: 'experience',
          title: 'Experience',
          fields: [{ id: 'role', label: 'Role', value: 'Engineer' }],
          entries: [{ id: 'job1', values: { company: 'Example Ltd' } }],
          repeatable: true
        }]
      }
    },
    cvData: {
      title: 'Engineer CV',
      configuration: { template: { id: 't01-modern-minimalist-cv-design_modern' } }
    }
  });
}

test('persistence record is versioned, serializable and preserves both profile and targeted CV', () => {
  const surface = createSurface();
  surface.dispatch({ type: 'set-identity', target: { key: 'fullName' }, payload: { value: 'Ali Updated' } });
  const record = createEditorPersistenceRecord(surface.getState().session, { savedAt: '2026-10-01T00:00:00.000Z' });
  const roundTrip = deserializeEditorPersistenceRecord(serializeEditorPersistenceRecord(record));
  assert.equal(roundTrip.version, '1.0.0');
  assert.equal(roundTrip.application.masterProfile.careerData.identity.fullName, 'Ali Updated');
  assert.equal(roundTrip.application.targetedCV.configuration.template.id, 't01-modern-minimalist-cv-design_modern');
});

test('persistence adapter saves, loads and clears without coupling to a storage implementation', () => {
  const storage = createMemoryStorage();
  const adapter = createEditorPersistenceAdapter(storage, 'test-key');
  const surface = createSurface();
  surface.dispatch({ type: 'set-identity', target: { key: 'fullName' }, payload: { value: 'Saved Name' } });
  adapter.save(surface.getState().session);
  assert.equal(adapter.load().application.masterProfile.careerData.identity.fullName, 'Saved Name');
  adapter.clear();
  assert.equal(adapter.load(), null);
});

test('recovery restores the persisted application and clears undo history', () => {
  const storage = createMemoryStorage();
  const adapter = createEditorPersistenceAdapter(storage, 'test-key');
  const source = createSurface();
  source.dispatch({ type: 'set-identity', target: { key: 'fullName' }, payload: { value: 'Recovered Name' } });
  adapter.save(source.getState().session);

  const target = createSurface();
  target.dispatch({ type: 'set-identity', target: { key: 'fullName' }, payload: { value: 'Wrong Name' } });
  const controller = createEditorRecoveryController(target, adapter);
  controller.recover();

  assert.equal(target.getState().session.application.masterProfile.careerData.identity.fullName, 'Recovered Name');
  assert.equal(target.canUndo(), false);
  controller.destroy();
});

test('recovery controller debounces dirty editor writes and flushes immediately', async () => {
  const storage = createMemoryStorage();
  const adapter = createEditorPersistenceAdapter(storage, 'test-key');
  const surface = createSurface();
  const controller = createEditorRecoveryController(surface, adapter, { delayMs: 5 });

  surface.dispatch({ type: 'set-identity', target: { key: 'fullName' }, payload: { value: 'Autosaved Name' } });
  await new Promise(resolve => setTimeout(resolve, 15));
  assert.equal(adapter.load().application.masterProfile.careerData.identity.fullName, 'Autosaved Name');

  surface.dispatch({ type: 'set-identity', target: { key: 'fullName' }, payload: { value: 'Flushed Name' } });
  controller.flush();
  assert.equal(adapter.load().application.masterProfile.careerData.identity.fullName, 'Flushed Name');
  controller.destroy();
});
