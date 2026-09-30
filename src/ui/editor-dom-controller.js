import { createEditorCommand } from '../application/editor-command-contract.js';

export const EDITOR_DOM_VERSION = '1.1.0';

function parseJson(value, fallback={}) {
  try { return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}

export function bindEditorFields(root, surface, options = {}) {
  if (!root || !surface) throw new Error('Editor root and surface are required.');
  const listeners = [];
  root.querySelectorAll(options.selector || '[data-v2-editor-field]').forEach(input => {
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

  root.querySelectorAll('[data-v2-editor-identity-field]').forEach(input => {
    const handler = () => {
      surface.dispatch(createEditorCommand({
        type: 'set-identity',
        target: { key: input.dataset.v2EditorIdentityField },
        payload: { value: input.value }
      }));
    };
    input.addEventListener('input', handler);
    listeners.push(() => input.removeEventListener('input', handler));
  });

  root.querySelectorAll('[data-v2-editor-entry-field]').forEach(input => {
    const handler = () => {
      const target = parseJson(input.dataset.v2EntryTarget);
      const key = String(input.dataset.v2EntryKey || '');
      if (!target.sectionId || !target.entryId || !key) return;
      surface.dispatch(createEditorCommand({
        type: 'update-entry',
        target,
        payload: { values: { [key]: input.value } }
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
      const target = parseJson(element.dataset.v2Target);
      const payload = parseJson(element.dataset.v2Payload);
      surface.dispatch({ type, target, payload });
    };
    element.addEventListener('click', handler);
    listeners.push(() => element.removeEventListener('click', handler));
  });
  return Object.freeze({ destroy: () => listeners.forEach(fn => fn()) });
}
