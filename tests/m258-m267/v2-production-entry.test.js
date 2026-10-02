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
  const root = {
    querySelector(selector) {
      assert.equal(selector, '[data-v2-editor-form]');
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };
  const documentLike = {
    querySelector(selector) {
      assert.equal(selector, '#editor');
      return root;
    }
  };
  const entry = createV2ProductionEntry({ rootSelector: '#editor' });
  const mounted = entry.mount(documentLike);

  assert.equal(mounted.version, '1.0.0');
  assert.equal(typeof mounted.render, 'function');
  assert.equal(typeof mounted.destroy, 'function');
  mounted.destroy();
});

test('missing production root is rejected explicitly', () => {
  assert.throws(
    () => mountV2ProductionEntry({ querySelector: () => null }),
    /V2 editor root not found/
  );
});


test('production entry page exposes an isolated deployable V2 browser surface', async () => {
  const { readFile } = await import('node:fs/promises');
  const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8');
  assert.match(html, /data-v2-editor-root/);
  assert.match(html, /mountV2ProductionEntry/);
  assert.match(html, /\.\/src\/application\/v2-production-entry\.js/);
  assert.match(html, /data-v2-editor-preview-root/);
  assert.match(html, /localStorage/);
  assert.match(html, /window\.print/);
  assert.match(html, /v2ProductionReady/);
  assert.doesNotMatch(html, /bridge\.php|builder\.html/);
});
