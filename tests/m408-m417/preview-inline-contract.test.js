import test from 'node:test';
import assert from 'node:assert/strict';
import { EDITOR_LIVE_PREVIEW_RUNTIME_VERSION, createEditorLivePreviewRuntime } from '../../src/ui/editor-live-preview-runtime.js';
import { listNativeV2Templates } from '../../src/templates/v2-native-template-catalog.js';
import { TEMPLATE_PREVIEW_MOUNTER_VERSION } from '../../src/ui/template-preview-mounter.js';

test('M408-M417 live preview runtime exposes the concrete integration boundary', () => {
  assert.equal(String(EDITOR_LIVE_PREVIEW_RUNTIME_VERSION).split('.').length, 3, 'live preview runtime version should follow semantic versioning');
  assert.equal(String(TEMPLATE_PREVIEW_MOUNTER_VERSION).split('.').length, 3, 'preview mounter version should follow semantic versioning');
  assert.throws(() => createEditorLivePreviewRuntime(null, {}), /editor surface/i);
});

test('all registered Native V2 templates participate in the preview compatibility contract', () => {
  const templates = listNativeV2Templates();
  assert.equal(templates.length, 9);
  for (const template of templates) {
    assert.equal(String(template.version).split('.').length, 3, 'every registered template should expose a semantic version');
    assert.match(template.sourcePath, /^src\/templates\/assets\/v2\//);
    assert.ok(template.supportedSections.length > 0);
    assert.equal(template.capabilities.nativeContract, true);
  }
});
