import { createEditorCommand } from '../application/editor-command-contract.js';

export const EDITOR_DOM_VERSION = '1.0.0';

export function bindEditorFields(root, surface, options = {}) {
  if (!root || !surface) throw new Error('Editor root and surface are required.');
  const selector = options.selector || '[data-v2-editor-field]';
  const listeners = [];
  root.querySelectorAll(selector).forEach(input => {
    const handler = () => {
      const [sectionId, fieldId] = String(input.dataset.v2EditorField || '').split(':');
      if (!sectionId || !fieldId) return;
      surface.dispatch(createEditorCommand({
        type: 'set-field',
        target: { sectionId, fieldId },
        payload: { value: input.value }
      }));
    };
    input.addEventListener('input', handler);
    listeners.push(() => input.removeEventListener('input', handler));
  });
  return Object.freeze({ version: EDITOR_DOM_VERSION, destroy: () => listeners.forEach(fn => fn()) });
}

export function bindEditorActions(root, surface) {
  if (!root || !surface) throw new Error('Editor root and surface are required.');
  const listeners = [];
  root.querySelectorAll('[data-v2-editor-command]').forEach(element => {
    const handler = () => {
      const type = element.dataset.v2EditorCommand;
      const target = element.dataset.v2Target ? JSON.parse(element.dataset.v2Target) : {};
      const payload = element.dataset.v2Payload ? JSON.parse(element.dataset.v2Payload) : {};
      surface.dispatch({ type, target, payload });
    };
    element.addEventListener('click', handler);
    listeners.push(() => element.removeEventListener('click', handler));
  });
  return Object.freeze({ destroy: () => listeners.forEach(fn => fn()) });
}
