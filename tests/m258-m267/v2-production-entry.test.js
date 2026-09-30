import test from 'node:test';
import assert from 'node:assert/strict';
import { createV2ProductionEntry, mountV2ProductionEntry } from '../../src/application/v2-production-entry.js';

test('production entry exposes a stable V2 mount boundary without selecting deployment technology', () => {
  const entry = createV2ProductionEntry();
  assert.equal(entry.version, '1.0.0');
  assert.equal(entry.rootSelector, '[data-v2-editor-root]');
  assert.throws(() => entry.mount(null), /browser document is required/i);
});

test('production entry resolves the configured root before mounting', () => {
  let mounted = false;
  const root = {
    ownerDocument: {
      createElement() {
        return { innerHTML: '', childNodes: [] };
      }
    },
    querySelector() { return null; },
    querySelectorAll() { return []; }
  };
  const documentLike = { querySelector(selector) { assert.equal(selector, '#editor'); return root; } };
  const entry = createV2ProductionEntry({ rootSelector: '#editor' });
  assert.throws(() => entry.mount(documentLike), /data-v2-editor-form|mount/i);
  assert.equal(mounted, false);
});

test('missing production root is rejected explicitly', () => {
  assert.throws(
    () => mountV2ProductionEntry({ querySelector: () => null }),
    /V2 editor root not found/
  );
});
