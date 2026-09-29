import { mountEditorPage } from './editor-page-controller.js';
import { renderEditorForm } from './editor-form-renderer.js';

export const EDITOR_RUNTIME_VERSION = '1.0.0';

export function mountV2EditorRuntime(root, input = {}) {
  if (!root) throw new Error('Editor root is required.');
  const mounted = mountEditorPage(root, input);
  const render = () => {
    const state = mounted.surface.getState();
    const profile = state.session.application.masterProfile;
    root.querySelector('[data-v2-editor-form]')?.replaceChildren(
      (() => { const holder = root.ownerDocument.createElement('div'); holder.innerHTML = renderEditorForm(mounted.surface, profile).html; return holder; })()
    );
    return state;
  };
  render();
  return Object.freeze({ ...mounted, render });
}
