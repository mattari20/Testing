import { createCVWorkspace } from './cv-workspace.js';
import { createCVEditorRuntime } from './cv-editor-runtime.js';
import { createCVEditorBrowserAdapter } from './cv-editor-browser-adapter.js';
import { createTemplateRegistry } from '../templates/template-engine.js';
import { createV2NativeTemplateCatalog } from '../templates/v2-native-template-catalog.js';
export const CV_BUILDER_RUNTIME_ACCEPTANCE_VERSION = '1.0.0';
export function createCVBuilderRuntimeAcceptance(options = {}) {
  const registry = options.registry || createTemplateRegistry(createV2NativeTemplateCatalog());
  const workspace = options.workspace || createCVWorkspace(options.workspaceInput || {});
  const runtime = options.runtime || createCVEditorRuntime({ workspace });
  const adapter = options.adapter || createCVEditorBrowserAdapter({ runtime, registry, templateProvider: () => { const id = runtime.getWorkspace().getActiveDocument()?.configuration?.template?.id; return registry.get(id) || registry.list()[0] || null; } });
  function inspect() {
    const state = adapter.getState(); const preview = adapter.renderPreview(); const failures = [];
    if (!state?.editor) failures.push('editor-state'); if (!state?.form) failures.push('form-state');
    if (!runtime.getState()?.projection) failures.push('projection'); if (!runtime.getState()?.layout) failures.push('layout');
    if (!preview || preview.pageCount < 1) failures.push('preview'); if (!registry.size()) failures.push('template-registry');
    return Object.freeze({ version: CV_BUILDER_RUNTIME_ACCEPTANCE_VERSION, ready: failures.length === 0, failures, templateCount: registry.size(), pageCount: preview?.pageCount || 0 });
  }
  return Object.freeze({ version: CV_BUILDER_RUNTIME_ACCEPTANCE_VERSION, workspace, runtime, adapter, registry, inspect });
}