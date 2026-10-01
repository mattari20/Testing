import test from 'node:test';
import assert from 'node:assert/strict';
import { EDITOR_LIVE_PREVIEW_RUNTIME_VERSION, createEditorLivePreviewRuntime } from '../../src/ui/editor-live-preview-runtime.js';
import { listNativeV2Templates } from '../../src/templates/v2-native-template-catalog.js';
import { TEMPLATE_PREVIEW_MOUNTER_VERSION } from '../../src/ui/template-preview-mounter.js';

test('M408-M417 live preview runtime exposes the concrete integration boundary', () => {
  assert.equal(EDITOR_LIVE_PREVIEW_RUNTIME_VERSION, '1.0.0');
  assert.equal(TEMPLATE_PREVIEW_MOUNTER_VERSION, '1.1.0');
  assert.throws(() => createEditorLivePreviewRuntime(null, {}), /editor surface/i);
});

test('all registered Native V2 templates participate in the preview compatibility contract', () => {
  const templates = listNativeV2Templates();
  assert.equal(templates.length, 9);
  for (const template of templates) {
    assert.ok(['2.0.0', '2.1.0'].includes(template.version));
    assert.match(template.sourcePath, /^src\/templates\/assets\/v2\//);
    assert.ok(template.supportedSections.length > 0);
    assert.equal(template.capabilities.nativeContract, true);
  }
});
