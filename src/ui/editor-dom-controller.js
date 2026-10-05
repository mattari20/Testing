import { createEditorCommand } from '../application/editor-command-contract.js';

export const EDITOR_DOM_VERSION = '1.6.0';

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
  root.querySelectorAll('[data-v2-editor-photo-input]').forEach(input => {
    const handler = () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!String(file.type || '').startsWith('image/')) { input.value=''; return; }
      if (file.size > 2 * 1024 * 1024) { input.value=''; return; }
      const reader = new FileReader();
      reader.onload = () => {
        surface.dispatch(createEditorCommand({
          type:'upload-asset',
          target:{assetId:'profile-photo'},
          payload:{id:'profile-photo',key:'profile-photo',type:file.type,url:String(reader.result || ''),name:file.name,size:file.size}
        }));
      };
      reader.readAsDataURL(file);
    };
    input.addEventListener('change', handler);
    listeners.push(() => input.removeEventListener('change', handler));
  });
  root.querySelectorAll('[data-v2-editor-photo-remove]').forEach(button => {
    const handler = () => surface.dispatch(createEditorCommand({
      type:'remove-asset',
      target:{assetId:button.getAttribute('data-v2-editor-photo-remove')}
    }));
    button.addEventListener('click', handler);
    listeners.push(() => button.removeEventListener('click', handler));
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
  const handler = event => {
    const element = event.target?.closest?.('[data-v2-editor-command]');
    if (!element || !root.contains(element)) return;
    const type = element.dataset.v2EditorCommand;
    const target = parseJson(element.dataset.v2Target);
    const payload = parseJson(element.dataset.v2Payload);
    surface.dispatch({type,target,payload});
  };
  root.addEventListener('click', handler);
  return Object.freeze({destroy:()=>root.removeEventListener('click', handler)});
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
    root.querySelectorAll('[data-v2-editor-autosave-status]').forEach(element => {
      element.textContent = String(state.autosaveStatus || 'idle');
      element.dataset.v2EditorAutosaveStatus = String(state.autosaveStatus || 'idle');
    });
    root.querySelectorAll('[data-v2-editor-autosave-error]').forEach(element => {
      element.textContent = String(state.lastAutosaveError || '');
      element.dataset.v2EditorAutosaveError = String(state.lastAutosaveError || '');
    });
    root.querySelectorAll('[data-v2-editor-last-autosaved]').forEach(element => {
      element.textContent = String(state.lastAutosavedAt || '');
      element.dataset.v2EditorLastAutosaved = String(state.lastAutosavedAt || '');
    });
    root.querySelectorAll('[data-v2-editor-recovery-status]').forEach(element => {
      element.textContent = String(state.recoveryStatus || 'missing');
      element.dataset.v2EditorRecoveryStatus = String(state.recoveryStatus || 'missing');
    });
    root.querySelectorAll('[data-v2-editor-recovery-error]').forEach(element => {
      element.textContent = String(state.recoveryError || '');
      element.dataset.v2EditorRecoveryError = String(state.recoveryError || '');
    });
    root.querySelectorAll('[data-v2-editor-autosave-retry]').forEach(element => {
      element.textContent = String(state.retryCount || 0);
      element.dataset.v2EditorAutosaveRetry = String(state.retryCount || 0);
      element.dataset.v2EditorAutosaveMaxRetries = String(state.maxRetries ?? 0);
    });
    root.querySelectorAll('[data-v2-editor-save]').forEach(element => {
      element.disabled = state.status === 'saved' || state.status === 'saving';
      element.dataset.v2EditorDirty = String(Boolean(state.dirty));
    });
    root.querySelectorAll('[data-v2-editor-recover]').forEach(element => {
      element.disabled = !state.recoveryAvailable;
      element.dataset.v2EditorRecoveryAvailable = String(Boolean(state.recoveryAvailable));
    });
    root.querySelectorAll('[data-v2-editor-clear-recovery]').forEach(element => {
      element.disabled = !state.recoveryAvailable;
      element.dataset.v2EditorRecoveryAvailable = String(Boolean(state.recoveryAvailable));
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
