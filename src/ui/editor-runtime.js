import { mountEditorPage } from './editor-page-controller.js';
import { bindEditorFields, bindEditorActions } from './editor-dom-controller.js';
import { renderEditorForm } from './editor-form-renderer.js';

export const EDITOR_RUNTIME_VERSION = '1.2.0';

export function mountV2EditorRuntime(root, input = {}) {
  if (!root) throw new Error('Editor root is required.');
  const mounted = mountEditorPage(root, input);
  let fieldBinding = null;
  let actionBinding = null;
  const render = () => {
    fieldBinding?.destroy();
    actionBinding?.destroy();
    const state = mounted.surface.getState();
    const profile = state.session.application.masterProfile;
    const form = root.querySelector('[data-v2-editor-form]');
    if (form) {
      const holder = root.ownerDocument.createElement('div');
      holder.innerHTML = renderEditorForm(mounted.surface, profile).html;
      form.replaceChildren(...holder.childNodes);
      fieldBinding = bindEditorFields(form, mounted.surface);
      actionBinding = bindEditorActions(form, mounted.surface);
    }
    return state;
  };
  render();
  const unsubscribe = mounted.surface.subscribe((state, command) => {
    const rerenderTypes = new Set(['add-entry','remove-entry','set-visibility','reorder','set-template','set-variant','upload-asset','remove-asset','undo','redo']);
    if (rerenderTypes.has(command?.type)) render();
  });
  return Object.freeze({
    ...mounted,
    render,
    destroy() {
      fieldBinding?.destroy();
      actionBinding?.destroy();
      unsubscribe();
      mounted.destroy();
    }
  });
}
