import { createEditorCommand } from '../application/editor-command-contract.js';

export const EDITOR_PREVIEW_INLINE_VERSION = '1.0.0';

function parseJson(value, fallback = {}) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

export function createPreviewEditCommand(kind, target, value) {
  if (kind === 'identity') {
    return createEditorCommand({ type: 'set-identity', target: { key: String(target.key) }, payload: { value } });
  }
  if (kind === 'field') {
    return createEditorCommand({ type: 'set-field', target: { sectionId: String(target.sectionId), fieldId: String(target.fieldId) }, payload: { value } });
  }
  if (kind === 'entry') {
    return createEditorCommand({ type: 'update-entry', target: { sectionId: String(target.sectionId), entryId: String(target.entryId) }, payload: { values: { [String(target.key)]: value } } });
  }
  throw new Error('Unsupported preview edit kind.');
}

export function bindPreviewInlineEditing(root, surface) {
  if (!root || !surface) throw new Error('Preview root and surface are required.');
  const listeners = [];
  root.querySelectorAll('[data-v2-preview-edit]').forEach(element => {
    const kind = String(element.dataset.v2PreviewEdit);
    const target = parseJson(element.dataset.v2PreviewTarget);
    const eventName = element.matches?.('input,textarea,select') ? 'input' : 'blur';
    const handler = () => {
      const value = element.value !== undefined ? element.value : element.textContent;
      surface.dispatch(createPreviewEditCommand(kind, target, value));
    };
    element.addEventListener(eventName, handler);
    listeners.push(() => element.removeEventListener(eventName, handler));
  });
  return Object.freeze({
    version: EDITOR_PREVIEW_INLINE_VERSION,
    destroy() { listeners.forEach(fn => fn()); }
  });
}
