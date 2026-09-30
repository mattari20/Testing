import { createEditorCommand } from '../application/editor-command-contract.js';

export const EDITOR_REORDER_CONTROLLER_VERSION = '1.0.0';

function parseJson(value, fallback = {}) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

export function createReorderCommand(kind, sectionId, orderedIds) {
  if (!['section','field','entry'].includes(kind)) throw new Error('Unsupported reorder kind.');
  if (!Array.isArray(orderedIds)) throw new Error('Ordered ids must be an array.');
  const target = { kind };
  if (kind !== 'section') target.sectionId = String(sectionId);
  return createEditorCommand({ type: 'reorder', target, payload: { order: orderedIds.map(String) } });
}

export function bindEditorReorder(root, surface) {
  if (!root || !surface) throw new Error('Editor root and surface are required.');
  const listeners = [];
  let dragged = null;

  root.querySelectorAll('[data-v2-editor-sortable]').forEach(element => {
    element.setAttribute('draggable', 'true');
    const dragstart = event => {
      dragged = {
        element,
        kind: element.dataset.v2EditorSortable,
        sectionId: element.dataset.v2SectionId || null,
        id: element.dataset.v2ItemId
      };
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', JSON.stringify(dragged));
      }
    };
    const dragover = event => {
      if (dragged) event.preventDefault();
    };
    const drop = event => {
      if (!dragged) return;
      event.preventDefault();
      const targetKind = element.dataset.v2EditorSortable;
      const targetSection = element.dataset.v2SectionId || null;
      if (dragged.kind !== targetKind || (targetKind !== 'section' && dragged.sectionId !== targetSection)) {
        dragged = null;
        return;
      }
      const parent = element.parentElement;
      const siblings = parent ? [...parent.querySelectorAll(':scope > [data-v2-editor-sortable]')] : [];
      const ids = siblings.map(node => String(node.dataset.v2ItemId));
      const from = ids.indexOf(String(dragged.id));
      const to = ids.indexOf(String(element.dataset.v2ItemId));
      if (from < 0 || to < 0 || from === to) { dragged = null; return; }
      ids.splice(from, 1);
      ids.splice(to, 0, String(dragged.id));
      surface.dispatch(createReorderCommand(targetKind, targetSection, ids));
      dragged = null;
    };
    const dragend = () => { dragged = null; };
    element.addEventListener('dragstart', dragstart);
    element.addEventListener('dragover', dragover);
    element.addEventListener('drop', drop);
    element.addEventListener('dragend', dragend);
    listeners.push(() => {
      element.removeEventListener('dragstart', dragstart);
      element.removeEventListener('dragover', dragover);
      element.removeEventListener('drop', drop);
      element.removeEventListener('dragend', dragend);
    });
  });
  return Object.freeze({ version: EDITOR_REORDER_CONTROLLER_VERSION, destroy() { listeners.forEach(fn => fn()); } });
}

export function parseReorderTarget(value) {
  return parseJson(value);
}
