import { mountEditorPage } from './editor-page-controller.js?v=20261006.2';
import { bindEditorFields, bindEditorActions, bindEditorLifecycle } from './editor-dom-controller.js?v=20261008.2';
import { renderEditorForm } from './editor-form-renderer.js?v=20261008.2';
import { bindEditorReorder } from './editor-reorder-controller.js?v=20261006.2';
import { createEditorLivePreviewRuntime } from './editor-live-preview-runtime.js?v=20261009.2';
import { createEditorPersistenceAdapter, createEditorRecoveryController } from '../storage/editor-persistence.js';
import { createEditorLifecycleController } from '../application/editor-lifecycle-controller.js';
import { createEditorCommand } from '../application/editor-command-contract.js';
import { createEditorSessionGuard } from './editor-session-guard.js';

export const EDITOR_RUNTIME_VERSION = '1.17.0';

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

  const repairProfessionalSummary=()=>{
    const profile=mounted.surface.getState()?.session?.application?.masterProfile;
    const sections=profile?.careerData?.sections||[];
    let summary=sections.find(s=>String(s.type)==='summary');
    if(!summary){
      mounted.surface.dispatch(createEditorCommand({type:'add-section',payload:{id:'summary',type:'summary',title:'Professional Summary',visibility:true,repeatable:false,fields:[{id:'summaryText',type:'textarea',label:'Summary',value:"Software Engineer with 4+ years of experience building reliable web applications, improving user experiences, and delivering measurable product improvements. Strong in JavaScript, API integration, debugging, and cross-functional collaboration.",visibility:true}]}}));
      return true;
    }
    if(!Array.isArray(summary.fields)||summary.fields.length===0){
      mounted.surface.dispatch(createEditorCommand({type:'add-field',target:{sectionId:summary.id},payload:{id:'summaryText',type:'textarea',label:'Summary',value:"Software Engineer with 4+ years of experience building reliable web applications, improving user experiences, and delivering measurable product improvements. Strong in JavaScript, API integration, debugging, and cross-functional collaboration.",visibility:true}}));
      return true;
    }
    return false;
  };
  repairProfessionalSummary();
  const repairIdentityLocation=()=>{
    const profile=mounted.surface.getState()?.session?.application?.masterProfile;
    const identity=profile?.careerData?.identity;
    if(!identity)return;
    let location=String(identity.location||'').trim();
    const address=String(identity.address||'').trim();
    const cleanRepeated=(value)=>{
      const text=String(value||'').trim().replace(/\s+/g,' ');
      const words=text.split(' ');
      for(let i=Math.ceil(words.length/2);i<words.length;i++){
        const a=words.slice(0,i).join(' ').replace(/[,:;-]+$/,'').toLowerCase();
        const b=words.slice(i).join(' ').replace(/^[,:;-]+/,'').toLowerCase();
        if(a&&b&&a===b)return words.slice(0,i).join(' ');
      }
      return text;
    };
    if(address && !location){
      location=address;
    }else if(address && location.toLowerCase().endsWith(address.toLowerCase()) && location.toLowerCase()!==address.toLowerCase()){
      location=location.slice(0,location.length-address.length).trim().replace(/[,:;-]+$/,'').trim();
    }
    const cleaned=cleanRepeated(location);
    if(cleaned && cleaned!==String(identity.location||'')) mounted.surface.dispatch(createEditorCommand({type:'set-identity',target:{key:'location'},payload:{value:cleaned}}));
    if(address) mounted.surface.dispatch(createEditorCommand({type:'remove-identity-field',target:{key:'address'}}));
  };
  repairIdentityLocation();
  render();
  lifecycleBinding = bindEditorLifecycle(root, lifecycleController);
  const refreshPreview = () => previewRuntime?.refresh().catch(error => { console.error('[CV Builder V2] preview refresh failed:', error); });
  refreshPreview();

  const rerenderTypes = new Set([
    'add-section','remove-section','set-section-title','add-field','remove-field','set-field-definition','set-theme-color','set-section-placement','set-list-style','set-rating-style','set-item-rating','set-entry-sort','add-identity-field','remove-identity-field',
    'add-entry','remove-entry','duplicate-entry','set-visibility','reorder','set-template','set-variant',
    'upload-asset','remove-asset','undo','redo','restore'
  ]);
  const unsubscribe = mounted.surface.subscribe((state, command) => {
    const sortRelevantEntryUpdate = command?.type === 'update-entry'
      && Object.keys(command?.payload?.values || {}).some(key => ['startDate','endDate','dates'].includes(String(key)));
    if (rerenderTypes.has(command?.type) || sortRelevantEntryUpdate) {
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
