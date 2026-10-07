import { mountV2EditorRuntime } from '../ui/editor-runtime.js?v=20261007.8';

export const V2_PRODUCTION_ENTRY_VERSION = '1.2.0';

export function createV2ProductionEntry(options = {}) {
  const rootSelector = String(options.rootSelector || '[data-v2-editor-root]');
  const input = options.input || {};
  return Object.freeze({
    version: V2_PRODUCTION_ENTRY_VERSION,
    rootSelector,
    input,
    mount(rootDocument) {
      if (!rootDocument || typeof rootDocument.querySelector !== 'function') {
        throw new Error('A browser document is required.');
      }
      const root = rootDocument.querySelector(rootSelector);
      if (!root) throw new Error('V2 editor root not found: ' + rootSelector);
      return mountV2EditorRuntime(root, input);
    }
  });
}

export function mountV2ProductionEntry(rootDocument, options = {}) {
  return createV2ProductionEntry(options).mount(rootDocument);
}
