import { createEditorCommand } from '../application/editor-command-contract.js';

export const EDITOR_DOM_VERSION = '1.3.0';

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
      surface.dispatch(createEditorCommand({type:'set-field',target:{sectionId,fieldId},payload:{value:input.value}}));
    };
    input.addEventListener('input', handler);
    listeners.push(() => input.removeEventListener('input', handler));
  });
  root.querySelectorAll('[data-v2-editor-identity-field]').forEach(input => {
    const handler = () => surface.dispatch(createEditorCommand({type:'set-identity',target:{key:input.dataset.v2EditorIdentityField},payload:{value:input.value}}));
    input.addEventListener('input', handler);
    listeners.push(() => input.removeEventListener('input', handler));
  });
  root.querySelectorAll('[data-v2-editor-entry-field]').forEach(input => {
    const handler = () => {
      const target = parseJson(input.dataset.v2EntryTarget);
      const key = String(input.dataset.v2EntryKey || '');
      if (!target.sectionId || !target.entryId || !key) return;
      surface.dispatch(createEditorCommand({type:'update-entry',target,payload:{values:{[key]:input.value}}}));
    };
    input.addEventListener('input', handler);
    listeners.push(() => input.removeEventListener('input', handler));
  });
  root.querySelectorAll('[data-v2-editor-section-title]').forEach(input => {
    const handler = () => surface.dispatch(createEditorCommand({type:'set-section-title',target:{sectionId:input.dataset.v2EditorSectionTitle},payload:{title:input.value}}));
    input.addEventListener('change', handler);
    listeners.push(() => input.removeEventListener('change', handler));
  });
  root.querySelectorAll('[data-v2-editor-field-label]').forEach(input => {
    const [sectionId, fieldId] = String(input.dataset.v2EditorFieldLabel || '').split(':');
    if (!sectionId || !fieldId) return;
    const handler = () => surface.dispatch(createEditorCommand({type:'set-field-definition',target:{sectionId,fieldId},payload:{label:input.value}}));
    input.addEventListener('change', handler);
    listeners.push(() => input.removeEventListener('change', handler));
  });
  root.querySelectorAll('[data-v2-editor-field-type]').forEach(input => {
    const [sectionId, fieldId] = String(input.dataset.v2EditorFieldType || '').split(':');
    if (!sectionId || !fieldId) return;
    const handler = () => surface.dispatch(createEditorCommand({type:'set-field-definition',target:{sectionId,fieldId},payload:{type:input.value}}));
    input.addEventListener('change', handler);
    listeners.push(() => input.removeEventListener('change', handler));
  });
  return Object.freeze({version:EDITOR_DOM_VERSION,destroy:()=>listeners.forEach(fn=>fn())});
}

export function bindEditorActions(root, surface) {
  if (!root || !surface) throw new Error('Editor root and surface are required.');
  const listeners = [];
  root.querySelectorAll('[data-v2-editor-command]').forEach(element => {
    const handler = () => {
      const type = element.dataset.v2EditorCommand;
      const target = parseJson(element.dataset.v2Target);
      const payload = parseJson(element.dataset.v2Payload);
      surface.dispatch({type,target,payload});
    };
    element.addEventListener('click', handler);
    listeners.push(() => element.removeEventListener('click', handler));
  });
  return Object.freeze({destroy:()=>listeners.forEach(fn=>fn())});
}

export function bindEditorLifecycle(root, lifecycle) {
  if (!root || !lifecycle) throw new Error('Editor root and lifecycle controller are required.');
  const listeners = [];
  if (typeof root.querySelectorAll !== 'function') return Object.freeze({destroy(){}});
  const update = state => {
    root.querySelectorAll('[data-v2-editor-save-status]').forEach(element => {
      element.textContent = String(state.status || '');
      element.dataset.v2EditorLifecycleStatus = String(state.status || '');
      if ('ariaBusy' in element) element.ariaBusy = state.status === 'saving' ? 'true' : 'false';
    });
    root.querySelectorAll('[data-v2-editor-save]').forEach(element => {
      element.disabled = state.status === 'saved' || state.status === 'saving';
      element.dataset.v2EditorDirty = String(Boolean(state.dirty));
    });
    root.querySelectorAll('[data-v2-editor-recover]').forEach(element => {
      element.disabled = false;
    });
  };

  root.querySelectorAll('[data-v2-editor-save]').forEach(element => {
    const handler = event => {
      event?.preventDefault?.();
      try { lifecycle.save(); } catch (error) {
        element.dataset.v2EditorLifecycleError = String(error?.message || error);
      }
    };
    element.addEventListener('click', handler);
    listeners.push(() => element.removeEventListener('click', handler));
  });

  root.querySelectorAll('[data-v2-editor-recover]').forEach(element => {
    const handler = event => {
      event?.preventDefault?.();
      try { lifecycle.recover(); } catch (error) {
        element.dataset.v2EditorLifecycleError = String(error?.message || error);
      }
    };
    element.addEventListener('click', handler);
    listeners.push(() => element.removeEventListener('click', handler));
  });

  root.querySelectorAll('[data-v2-editor-clear-recovery]').forEach(element => {
    const handler = event => {
      event?.preventDefault?.();
      lifecycle.clearRecovery();
    };
    element.addEventListener('click', handler);
    listeners.push(() => element.removeEventListener('click', handler));
  });

  const unsubscribe = lifecycle.subscribe(update);
  return Object.freeze({
    destroy() {
      unsubscribe();
      listeners.forEach(fn => fn());
    }
  });
}
