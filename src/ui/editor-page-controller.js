import { createEditorSurface } from '../application/editor-surface.js';
import { bindEditorFields, bindEditorActions } from './editor-dom-controller.js';

export const EDITOR_PAGE_VERSION = '1.0.0';

export function mountEditorPage(root, input = {}) {
  if (!root) throw new Error('Editor page root is required.');
  const surface = createEditorSurface(input);
  const bindDom = input.bindDom !== false;
  const fieldBinding = bindDom ? bindEditorFields(root, surface) : null;
  const actionBinding = bindDom ? bindEditorActions(root, surface) : null;

  return Object.freeze({
    version: EDITOR_PAGE_VERSION,
    surface,
    destroy() {
      fieldBinding?.destroy();
      actionBinding?.destroy();
    }
  });
}
