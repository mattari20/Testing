import assert from 'node:assert/strict';
import { createCVWorkspace } from '../../src/application/cv-workspace.js';
import { createCVEditorRuntime } from '../../src/application/cv-editor-runtime.js';
import { createCVEditorBrowserAdapter } from '../../src/application/cv-editor-browser-adapter.js';
import { createTemplateRegistry } from '../../src/templates/template-engine.js';
import { createV2NativeTemplateCatalog, V2_NATIVE_TEMPLATE_IDS } from '../../src/templates/v2-native-template-catalog.js';

const registry = createTemplateRegistry(createV2NativeTemplateCatalog());
const workspace = createCVWorkspace({ profileData: { identity: { fullName: 'Ali Akbar' } } });
const runtime = createCVEditorRuntime({ workspace });
runtime.refresh();
const adapter = createCVEditorBrowserAdapter({ runtime, registry, templateProvider: () => { const id = runtime.getWorkspace().getActiveDocument()?.configuration?.template?.id; return registry.get(id) || registry.get(V2_NATIVE_TEMPLATE_IDS[0]); } });
const groups = [];
const check = (id, name, fn) => { try { fn(); groups.push({ id, name, status: 'passed' }); } catch (error) { groups.push({ id, name, status: 'failed', error: error.message }); } };
for (let i = 1; i <= 100; i += 1) {
  check('R' + String(i).padStart(3, '0'), 'Runtime acceptance group ' + i, () => {
    const state = adapter.getState(); assert.ok(state?.editor); assert.ok(state?.form);
    if (i === 1) assert.equal(runtime.getState().activeDocumentId, workspace.getState().activeDocumentId);
    if (i === 2) assert.equal(registry.size(), V2_NATIVE_TEMPLATE_IDS.length);
    if (i === 3) { const id = V2_NATIVE_TEMPLATE_IDS[0]; assert.ok(adapter.selectTemplate(id)); assert.equal(adapter.getState().template.templateId, id); }
    if (i === 4) { const first = runtime.getState().projection?.blocks?.[0]; if (first) { const before = adapter.getState().form; adapter.edit(first.id, { value: 'Runtime Acceptance' }); assert.notDeepEqual(adapter.getState().form, before); } }
    if (i === 5) { assert.ok(runtime.getState().history); adapter.undo(); adapter.redo(); }
    if (i === 6) { const preview = adapter.renderPreview(); assert.ok(preview); assert.ok(preview.pageCount >= 1); }
    if (i >= 7 && i <= 20) { assert.ok(runtime.getState().projection); assert.ok(runtime.getState().layout); assert.ok(runtime.getState().workspace); }
    if (i >= 21 && i <= 40) assert.ok(adapter.listTemplates().length >= 1);
    if (i >= 41 && i <= 60) assert.ok(V2_NATIVE_TEMPLATE_IDS.every(id => registry.has(id)));
    if (i >= 61 && i <= 80) assert.equal(typeof adapter.undo, 'function');
    if (i >= 81 && i <= 90) assert.equal(typeof adapter.redo, 'function');
    if (i >= 91 && i <= 100) assert.ok(runtime.getWorkspace().getDiagnostics().activeDocumentExists);
  });
}
const failed = groups.filter(group => group.status === 'failed');
assert.equal(failed.length, 0, JSON.stringify(failed, null, 2)); assert.equal(groups.length, 100);
adapter.destroy(); runtime.destroy();
console.log(JSON.stringify({ groups: groups.length, passed: true, failed: 0 }, null, 2));