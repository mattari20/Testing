import test from 'node:test';
import assert from 'node:assert/strict';
import { mountV2EditorRuntime } from '../../src/ui/editor-runtime.js';

function createMemoryStorage() {
  const data = new Map();
  return {
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); }
  };
}

function createRoot() {
  const form = { replaceChildren() {} };
  return {
    querySelector(selector) {
      if (selector === '[data-v2-editor-form]') return form;
      return null;
    },
    ownerDocument: {
      createElement() {
        return {
          childNodes: [],
          set innerHTML(value) { this.childNodes = []; }
        };
      }
    }
  };
}

test('editor runtime accepts an injected persistence storage and exposes recovery controls', () => {
  const storage = createMemoryStorage();
  const runtime = mountV2EditorRuntime(createRoot(), {
    persistence: {
      storage,
      key: 'runtime-test-key'
    }
  });

  assert.ok(runtime.persistence);
  assert.equal(typeof runtime.persistence.flush, 'function');
  assert.equal(typeof runtime.persistence.recover, 'function');
  assert.equal(runtime.persistence.hasRecovery(), false);

  runtime.destroy();
});

test('editor runtime auto-recovers a persisted session before initial render', () => {
  const storage = createMemoryStorage();

  const first = mountV2EditorRuntime(createRoot(), {
    persistence: {
      storage,
      key: 'runtime-recovery-key'
    }
  });
  first.surface.dispatch({
    type: 'set-identity',
    target: { key: 'fullName' },
    payload: { value: 'Recovered Runtime Name' }
  });
  first.persistence.flush();
  first.destroy();

  const second = mountV2EditorRuntime(createRoot(), {
    persistence: {
      storage,
      key: 'runtime-recovery-key',
      autoRecover: true
    }
  });

  assert.equal(
    second.surface.getState().session.application.masterProfile.careerData.identity.fullName,
    'Recovered Runtime Name'
  );
  assert.equal(second.surface.canUndo(), false);
  second.destroy();
});
