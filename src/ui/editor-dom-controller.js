import { createEditorCommand } from '../application/editor-command-contract.js';

export const EDITOR_DOM_VERSION = '1.9.1';

function parseJson(value, fallback={}) {
  try { return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}



function createPhotoCropper(root, surface, asset) {
  const documentRef=root.ownerDocument;
  const source=String(asset?.url||asset?.src||'');
  if(!source)return null;
  const modal=documentRef.createElement('div');
  modal.className='editor-crop-modal';
  modal.innerHTML='<div class="editor-crop-dialog" role="dialog" aria-modal="true" aria-label="Adjust profile photo">'+
    '<div class="editor-crop-head"><div><span class="editor-eyebrow">PHOTO</span><h3>Adjust Photo Crop</h3><p>The crop shape follows the selected CV template.</p></div><button type="button" data-crop-cancel aria-label="Close">×</button></div>'+
    '<div class="editor-crop-work"><div class="editor-crop-preview" data-crop-preview><canvas data-crop-canvas></canvas></div>'+
    '<div class="editor-crop-controls"><label>Zoom <input type="range" min="1" max="3" step="0.01" value="1" data-crop-zoom></label>'+
    '<label>Horizontal <input type="range" min="-1" max="1" step="0.01" value="0" data-crop-x></label>'+
    '<label>Vertical <input type="range" min="-1" max="1" step="0.01" value="0" data-crop-y></label></div></div>'+
    '<div class="editor-crop-actions"><button type="button" data-crop-cancel>Cancel</button><button type="button" class="primary" data-crop-apply>Apply Crop</button></div></div>';
  documentRef.body.appendChild(modal);
  const canvas=modal.querySelector('[data-crop-canvas]');
  const zoom=modal.querySelector('[data-crop-zoom]');
  const xInput=modal.querySelector('[data-crop-x]');
  const yInput=modal.querySelector('[data-crop-y]');
  const img=new Image();
  let loaded=false;
  const shape=String(root.closest('[data-v2-editor-root]')?.getAttribute('data-v2-photo-shape')||'circle');
  const ratio=shape==='portrait'?0.78:shape==='landscape'?1.35:1;
  const outputW=shape==='portrait'?720:720;
  const outputH=Math.round(outputW/ratio);
  canvas.width=outputW;canvas.height=outputH;
  const cropRadius=shape==='circle'?'50%':shape==='square'?'8px':'12px';
  canvas.style.borderRadius=cropRadius;
  canvas.style.overflow='hidden';
  canvas.setAttribute('data-crop-shape',shape);
  const draw=()=>{
    if(!loaded)return;
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,outputW,outputH);
    const scale=Math.max(outputW/img.naturalWidth,outputH/img.naturalHeight)*Number(zoom.value);
    const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
    const maxX=Math.max(0,(w-outputW)/2),maxY=Math.max(0,(h-outputH)/2);
    const dx=(outputW-w)/2+Number(xInput.value)*maxX;
    const dy=(outputH-h)/2+Number(yInput.value)*maxY;
    ctx.drawImage(img,dx,dy,w,h);
  };
  img.onload=()=>{loaded=true;draw();};
  img.src=source;
  [zoom,xInput,yInput].forEach(input=>input.addEventListener('input',draw));
  const close=()=>modal.remove();
  modal.querySelectorAll('[data-crop-cancel]').forEach(button=>button.addEventListener('click',close));
  modal.querySelector('[data-crop-apply]').addEventListener('click',()=>{
    if(!loaded)return;
    canvas.toBlob(blob=>{
      if(!blob)return;
      const reader=new FileReader();
      reader.onload=()=>{
        surface.dispatch(createEditorCommand({
          type:'upload-asset',
          target:{assetId:'profile-photo'},
          payload:{id:'profile-photo',key:'profile-photo',type:'image/png',url:String(reader.result||''),name:asset.name||'profile-photo-cropped.png',size:blob.size,metadata:{crop:{shape,zoom:Number(zoom.value),x:Number(xInput.value),y:Number(yInput.value)}}}
        }));
        close();
      };
      reader.readAsDataURL(blob);
    },'image/png',0.92);
  });
  return Object.freeze({destroy:close});
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
  root.querySelectorAll('[data-v2-editor-photo-crop]').forEach(button => {
    const handler = () => {
      const state = surface.getState();
      const assets = state.session.application.masterProfile.careerData.assets || [];
      const asset = assets.find(item => String(item?.key || item?.id || '') === String(button.dataset.v2EditorPhotoCrop));
      createPhotoCropper(root, surface, asset);
    };
    button.addEventListener('click', handler);
    listeners.push(() => button.removeEventListener('click', handler));
  });
  root.querySelectorAll('[data-v2-editor-photo-remove]').forEach(button => {
    const handler = () => surface.dispatch(createEditorCommand({
      type:'remove-asset',
      target:{assetId:button.getAttribute('data-v2-editor-photo-remove')}
    }));
    button.addEventListener('click', handler);
    listeners.push(() => button.removeEventListener('click', handler));
  });
  root.querySelectorAll('[data-v2-editor-list-style]').forEach(input => {
    const handler = () => surface.dispatch(createEditorCommand({
      type:'set-list-style',
      target:{sectionType:input.dataset.v2EditorListStyle},
      payload:{sectionType:input.dataset.v2EditorListStyle,style:input.value}
    }));
    input.addEventListener('change', handler);
    listeners.push(() => input.removeEventListener('change', handler));
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
