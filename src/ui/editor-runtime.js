import { mountEditorPage } from './editor-page-controller.js?v=20261006.2';
import { bindEditorFields, bindEditorActions, bindEditorLifecycle } from './editor-dom-controller.js?v=20261006.5';
import { renderEditorForm } from './editor-form-renderer.js?v=20261006.5';
import { bindEditorReorder } from './editor-reorder-controller.js?v=20261006.2';
import { createEditorLivePreviewRuntime } from './editor-live-preview-runtime.js?v=20261006.5';
import { createEditorPersistenceAdapter, createEditorRecoveryController } from '../storage/editor-persistence.js';
import { createEditorLifecycleController } from '../application/editor-lifecycle-controller.js';
import { createEditorSessionGuard } from './editor-session-guard.js';

export const EDITOR_RUNTIME_VERSION = '1.12.0';

export function mountV2EditorRuntime(root, input = {}) {
  if (!root) throw new Error('Editor root is required.');
  const mounted = mountEditorPage(root, { ...input, bindDom:false });
  let fieldBinding = null;
  let actionBinding = null;
  let reorderBinding = null;
  let lifecycleBinding = null;
  const previewRoot = input.preview === true ? root.querySelector('[data-v2-editor-preview-root]') : null;
  const previewRuntime = previewRoot
    ? createEditorLivePreviewRuntime(mounted.surface, previewRoot, input.previewOptions || {})
    : null;

  const persistenceOptions = input.persistence || null;
  const persistenceAdapter = persistenceOptions?.adapter
    || (persistenceOptions?.storage
      ? createEditorPersistenceAdapter(persistenceOptions.storage, persistenceOptions.key)
      : null);
  const recoveryController = persistenceAdapter
    ? createEditorRecoveryController(mounted.surface, persistenceAdapter, persistenceOptions.controller || {})
    : null;
  const confirmRecovery = persistenceOptions?.confirmRecovery || ((state) => {
    if (!state?.dirty) return true;
    const view = root.ownerDocument?.defaultView;
    if (typeof view?.confirm !== 'function') return false;
    return view.confirm('You have unsaved CV changes. Recovering will replace them. Continue?');
  });
  const lifecycleController = createEditorLifecycleController(mounted.surface, recoveryController, { confirmRecovery });
  const sessionGuard = createEditorSessionGuard(
    lifecycleController,
    input.sessionGuard?.target || root.ownerDocument?.defaultView || null,
    input.sessionGuard || {}
  );

  const render = () => {
    fieldBinding?.destroy();
    actionBinding?.destroy();
    reorderBinding?.destroy();
    const state = mounted.surface.getState();
    const profile = state.session.application.masterProfile;
    const form = root.querySelector('[data-v2-editor-form]');
    if (form) {
      const holder = root.ownerDocument.createElement('div');
      holder.innerHTML = renderEditorForm(mounted.surface, profile, { photoShape: input.photoShape || root.getAttribute('data-v2-photo-shape') || 'circle' }).html;
      form.replaceChildren(...holder.childNodes);
      fieldBinding = bindEditorFields(form, mounted.surface);
      actionBinding = bindEditorActions(form, mounted.surface);
      reorderBinding = bindEditorReorder(form, mounted.surface);
    }
    return state;
  };

  if (recoveryController && persistenceOptions.autoRecover === true && recoveryController.hasRecovery()
      && !mounted.surface.getState().session.dirty) {
    const initialSession = mounted.surface.getState().session;
    try {
      recoveryController.recover();
    } catch (error) {
      console.warn('[CV Builder V2] automatic recovery was skipped:', error);
      try {
        mounted.surface.restorePersistedState({
          version: '1.0.0',
          savedAt: initialSession.savedAt || null,
          application: initialSession.application,
          session: initialSession.session
        });
      } catch (restoreError) {
        console.warn('[CV Builder V2] initial editor state restore failed:', restoreError);
      }
    }
  }

  render();
  lifecycleBinding = bindEditorLifecycle(root, lifecycleController);
  const refreshPreview = () => previewRuntime?.refresh().catch(error => { console.error('[CV Builder V2] preview refresh failed:', error); });
  refreshPreview();

  const rerenderTypes = new Set([
    'add-section','remove-section','set-section-title','add-field','remove-field','set-field-definition','set-theme-color','set-list-style','set-entry-sort','add-identity-field','remove-identity-field',
    'add-entry','remove-entry','duplicate-entry','set-visibility','reorder','set-template','set-variant',
    'upload-asset','remove-asset','undo','redo','restore'
  ]);
  const unsubscribe = mounted.surface.subscribe((state, command) => {
    if (rerenderTypes.has(command?.type)) {
      render();
      refreshPreview();
    }
  });

  return Object.freeze({
    ...mounted,
    getState() {
      return mounted.surface.getState();
    },
    tools: {},
    previewRuntime,
    persistence: recoveryController,
    lifecycle: lifecycleController,
    sessionGuard,
    save() {
      return lifecycleController.save();
    },
    recover() {
      return lifecycleController.recover();
    },
    clearRecovery() {
      return lifecycleController.clearRecovery();
    },
    render,
    destroy() {
      recoveryController?.flush();
      sessionGuard.destroy();
      lifecycleController.destroy();
      recoveryController?.destroy();
      fieldBinding?.destroy();
      actionBinding?.destroy();
      reorderBinding?.destroy();
      lifecycleBinding?.destroy();
      previewRuntime?.destroy();
      unsubscribe();
      mounted.destroy();
    }
  });
}
