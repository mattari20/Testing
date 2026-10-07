import { createEditorCommand } from '../application/editor-command-contract.js';

export const EDITOR_DOM_VERSION = '1.19.0';

function parseJson(value, fallback={}) {
  try { return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}
function formatMonthValue(value){
  const raw=String(value||'').trim();
  if(!/^\d{4}-\d{2}$/.test(raw))return raw;
  const [year,month]=raw.split('-').map(Number);
  if(!year||month<1||month>12)return raw;
  return new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(year,month-1,1)));
}
function formatLongDate(value){
  const raw=String(value||'').trim();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const [year,month,day]=raw.split('-').map(Number);
  if(!year||!month||!day)return raw;
  const date=new Date(Date.UTC(year,month-1,day));
  const mod100=day%100;
  const suffix=mod100>=11&&mod100<=13?'th':({1:'st',2:'nd',3:'rd'}[day%10]||'th');
  return day+suffix+' '+new Intl.DateTimeFormat('en-US',{month:'long',timeZone:'UTC'}).format(date)+', '+year;
}
function parseUserMonth(value){
  const raw=String(value||'').trim();
  if(/^\d{4}-\d{2}$/.test(raw))return raw;
  const cleaned=raw.replace(/,/g,' ').replace(/\s+/g,' ').trim();
  const match=cleaned.match(/^([A-Za-z]+)\s+(\d{4})$/)||cleaned.match(/^(\d{4})\s+([A-Za-z]+)$/);
  if(!match)return '';
  const monthName=Number.isNaN(Number(match[1]))?match[1]:match[2];
  const year=Number.isNaN(Number(match[1]))?Number(match[2]):Number(match[1]);
  const months=['january','february','march','april','may','june','july','august','september','october','november','december'];
  const month=months.indexOf(String(monthName).toLowerCase())+1;
  if(!month||year<1900||year>2100)return '';
  return String(year)+'-'+String(month).padStart(2,'0');
}
function parseUserDate(value){
  const raw=String(value||'').trim();
  if(!raw)return '';
  if(/^\d{4}-\d{2}-\d{2}$/.test(raw))return raw;
  const cleaned=raw.replace(/(\d{1,2})(st|nd|rd|th)\b/ig,'$1').replace(/,/g,' ').replace(/\s+/g,' ').trim();
  const match=cleaned.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/)||cleaned.match(/^([A-Za-z]+)\s+(\d{1,2})\s+(\d{4})$/);
  if(!match)return '';
  const first=match[1],second=match[2],year=Number(match[3]);
  const day=Number.isNaN(Number(first))?Number(second):Number(first);
  const monthName=Number.isNaN(Number(first))?first:second;
  const monthNames=['january','february','march','april','may','june','july','august','september','october','november','december'];
  const month=monthNames.indexOf(String(monthName).toLowerCase())+1;
  if(!month||!day||day<1||day>31||year<1900||year>2100)return '';
  const date=new Date(Date.UTC(year,month-1,day));
  if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)return '';
  return String(year).padStart(4,'0')+'-'+String(month).padStart(2,'0')+'-'+String(day).padStart(2,'0');
}



function createPhotoCropper(root, surface, asset) {
  const documentRef=root.ownerDocument;
  const source=String(asset?.url||asset?.src||'');
  if(!source)return null;
  const modal=documentRef.createElement('div');
  modal.className='editor-crop-modal';
  modal.innerHTML='<div class="editor-crop-dialog" role="dialog" aria-modal="true" aria-label="Adjust profile photo">'+
    '<div class="editor-crop-head"><div><span class="editor-eyebrow">PHOTO</span><h3>Adjust Photo Crop</h3><p>Position, zoom and rotate your photo. The template shape is preserved.</p></div><button type="button" class="editor-crop-close" data-crop-cancel aria-label="Close">×</button></div>'+
    '<div class="editor-crop-preview" data-crop-preview><canvas data-crop-canvas></canvas></div>'+
    '<div class="editor-crop-controls">'+
      '<div class="editor-crop-control-group"><span>Rotate</span><div class="editor-crop-rotate-actions"><button type="button" data-crop-rotate-left>↶ Left</button><button type="button" data-crop-rotate-right>↷ Right</button><button type="button" data-crop-rotate-reset>Reset</button></div></div>'+
      '<label><span>Zoom</span><input type="range" min="1" max="3" step="0.01" value="1" data-crop-zoom></label>'+
      '<label><span>Horizontal</span><input type="range" min="-1" max="1" step="0.01" value="0" data-crop-x></label>'+
      '<label><span>Vertical</span><input type="range" min="-1" max="1" step="0.01" value="0" data-crop-y></label>'+
    '</div>'+
    '<div class="editor-crop-actions"><button type="button" class="editor-crop-secondary" data-crop-cancel>Cancel</button><button type="button" class="editor-crop-primary" data-crop-apply>Apply Crop</button></div>'+
    '</div>';
  documentRef.body.appendChild(modal);
  const previousOverflow=documentRef.body.style.overflow;
  documentRef.body.style.overflow='hidden';
  const canvas=modal.querySelector('[data-crop-canvas]');
  const zoom=modal.querySelector('[data-crop-zoom]');
  const xInput=modal.querySelector('[data-crop-x]');
  const yInput=modal.querySelector('[data-crop-y]');
  const img=new Image();
  let loaded=false, rotation=0;
  const shape=String(root.closest('[data-v2-editor-root]')?.getAttribute('data-v2-photo-shape')||'circle');
  const ratio=shape==='portrait'?0.78:shape==='landscape'?1.35:1;
  const outputW=720, outputH=Math.round(outputW/ratio);
  canvas.width=outputW; canvas.height=outputH; canvas.setAttribute('data-crop-shape',shape);
  const draw=()=>{
    if(!loaded)return;
    const ctx=canvas.getContext('2d'); ctx.clearRect(0,0,outputW,outputH);
    const scale=Math.max(outputW/img.naturalWidth,outputH/img.naturalHeight)*Number(zoom.value);
    const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
    const maxX=Math.max(0,(w-outputW)/2),maxY=Math.max(0,(h-outputH)/2);
    const dx=(outputW-w)/2+Number(xInput.value)*maxX,dy=(outputH-h)/2+Number(yInput.value)*maxY;
    ctx.save();ctx.translate(outputW/2,outputH/2);ctx.rotate(rotation*Math.PI/180);ctx.drawImage(img,dx-outputW/2,dy-outputH/2,w,h);ctx.restore();
  };
  img.onload=()=>{loaded=true;draw();}; img.src=source;
  [zoom,xInput,yInput].forEach(input=>input.addEventListener('input',draw));
  modal.querySelector('[data-crop-rotate-left]').addEventListener('click',()=>{rotation=(rotation+270)%360;draw();});
  modal.querySelector('[data-crop-rotate-right]').addEventListener('click',()=>{rotation=(rotation+90)%360;draw();});
  modal.querySelector('[data-crop-rotate-reset]').addEventListener('click',()=>{rotation=0;draw();});
  const close=()=>{modal.remove();documentRef.body.style.overflow=previousOverflow;};
  modal.querySelectorAll('[data-crop-cancel]').forEach(button=>button.addEventListener('click',close));
  modal.querySelector('[data-crop-apply]').addEventListener('click',()=>{
    if(!loaded)return;
    canvas.toBlob(blob=>{
      if(!blob)return;
      const reader=new FileReader();
      reader.onload=()=>{
        surface.dispatch(createEditorCommand({type:'upload-asset',target:{assetId:'profile-photo'},payload:{id:'profile-photo',key:'profile-photo',type:'image/png',url:String(reader.result||''),name:asset.name||'profile-photo-cropped.png',size:blob.size,metadata:{crop:{shape,zoom:Number(zoom.value),x:Number(xInput.value),y:Number(yInput.value),rotation}}}}));
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
  root.querySelectorAll('[data-v2-editor-identity-date-display]').forEach(input => {
    const handler = () => {
      const key=String(input.dataset.v2EditorIdentityDateDisplay||'dateOfBirth');
      const parsed=parseUserDate(input.value);
      if(!parsed){
        const stateValue=String(surface.getState()?.session?.application?.masterProfile?.careerData?.identity?.[key]||'');
        input.value=formatLongDate(stateValue);
        return;
      }
      surface.dispatch(createEditorCommand({type:'set-identity',target:{key},payload:{value:parsed}}));
      input.value=formatLongDate(parsed);
    };
    input.addEventListener('change', handler);
    listeners.push(() => input.removeEventListener('change', handler));
  });
  root.querySelectorAll('[data-v2-editor-open-date]').forEach(button => {
    const handler = event => {
      event?.preventDefault?.();
      const picker=button.closest('.editor-identity-date-wrap')?.querySelector('.editor-identity-date-picker');
      if(!picker)return;
      if(typeof picker.showPicker==='function'){ try { picker.showPicker(); return; } catch {} }
      picker.click();
    };
    button.addEventListener('click', handler);
    listeners.push(() => button.removeEventListener('click', handler));
  });
  root.querySelectorAll('[data-v2-editor-identity-field]').forEach(input => {
    const handler = () => {
      const key=String(input.dataset.v2EditorIdentityField||'');
      const value=input.value;
      surface.dispatch(createEditorCommand({type:'set-identity',target:{key},payload:{value}}));
      if(key==='dateOfBirth'){
        const display=input.closest('.editor-identity-date-wrap')?.querySelector('.editor-identity-date-display');
        if(display) display.value=formatLongDate(value);
      }
    };
    const eventType=input.type==='date'?'change':'input';
    input.addEventListener(eventType, handler);
    listeners.push(() => input.removeEventListener(eventType, handler));
  });
  root.querySelectorAll('[data-v2-editor-entry-field]').forEach(input => {
    const handler = () => {
      const target = parseJson(input.dataset.v2EntryTarget);
      const key = String(input.dataset.v2EntryKey || '');
      if (!target.sectionId || !target.entryId || !key) return;
      const value = input.dataset.v2EntryDate === 'month' ? parseUserMonth(input.value) : input.value;
      if(input.dataset.v2EntryDate === 'month' && !value){
        const state=surface.getState();
        const current=String(state?.session?.application?.masterProfile?.careerData?.sections?.find(s=>String(s?.id)===String(target.sectionId))?.entries?.find(e=>String(e?.id)===String(target.entryId))?.values?.[key]||'');
        input.value=current?formatMonthValue(current):'';
        return;
      }
      surface.dispatch(createEditorCommand({type:'update-entry',target,payload:{values:{[key]:value}}}));
    };
    const eventType = ['startDate','endDate','dates'].includes(String(input.dataset.v2EntryKey||'')) ? 'change' : 'input';
    input.addEventListener(eventType, handler);
    listeners.push(() => input.removeEventListener(eventType, handler));
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
    const handler = event => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      const state = surface.getState();
      const assets = state?.session?.application?.masterProfile?.careerData?.assets || [];
      const key=String(button.dataset.v2EditorPhotoCrop||'profile-photo');
      const asset = assets.find(item => String(item?.key || item?.id || '') === key);
      const previewSrc=button.closest('.editor-photo-card')?.querySelector('.editor-photo-preview')?.getAttribute('src')||'';
      const resolvedAsset=asset||{key,id:key,url:previewSrc,name:'profile-photo.png'};
      if(!String(resolvedAsset?.url||resolvedAsset?.src||'')) return;
      createPhotoCropper(root, surface, resolvedAsset);
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
  root.querySelectorAll('[data-v2-editor-entry-sort]').forEach(input => {
    const handler = () => surface.dispatch(createEditorCommand({
      type:'set-entry-sort',
      target:{sectionType:input.dataset.v2EditorEntrySort},
      payload:{sectionType:input.dataset.v2EditorEntrySort,direction:input.value}
    }));
    input.addEventListener('change', handler);
    listeners.push(() => input.removeEventListener('change', handler));
  });
  root.querySelectorAll('[data-v2-editor-identity-add]').forEach(input => {
    const handler = () => {
      const key=String(input.value||'').trim();
      if(!key)return;
      if(key==='custom'){
        const view=root.ownerDocument?.defaultView;
        const label=view?.prompt?.('Field name (for example: CNIC Number)')||'';
        const normalized=String(label).trim().toLowerCase().replace(/[^a-z0-9]+(.)/g,(_,ch)=>String(ch).toUpperCase()).replace(/[^a-zA-Z0-9]/g,'');
        if(!normalized)return;
        surface.dispatch(createEditorCommand({type:'add-identity-field',payload:{key:normalized}}));
      }else{
        surface.dispatch(createEditorCommand({type:'add-identity-field',payload:{key}}));
      }
      input.value='';
    };
    input.addEventListener('change', handler);
    listeners.push(() => input.removeEventListener('change', handler));
  });
  root.querySelectorAll('[data-v2-summary-suggest]').forEach(button => {
    const handler = () => {
      const state=surface.getState();
      const profile=state?.session?.application?.masterProfile;
      const identity=profile?.careerData?.identity||{};
      const sections=profile?.careerData?.sections||[];
      const skillsSection=sections.find(s=>String(s.type)==='skills');
      const skills=skillsSection?.fields?.find(f=>f.visibility!==false)?.value||'';
      const title=String(identity.jobTitle||'Professional').trim();
      const skillText=String(skills).split(/[,\n]+/).map(v=>v.trim()).filter(Boolean).slice(0,6);
      const lower=title.toLowerCase();
      const skillPhrase=skillText.length?' Key strengths include '+skillText.join(', ')+'.':'';
      let focus='delivering practical results, maintaining high standards, and contributing effectively to team goals';
      if(/civil|structural|construction|site|architect|quantity survey|surveying|geotechnical/.test(lower)) focus='delivering safe, practical and cost-effective project outcomes, coordinating technical work, and maintaining quality and schedule standards';
      else if(/software|developer|engineer|programmer|web|mobile|devops|data|cyber|it/.test(lower)) focus='building reliable solutions, improving performance, and delivering measurable technical results';
      else if(/account|finance|bank|audit/.test(lower)) focus='maintaining accuracy, improving financial processes, and supporting sound business decisions';
      else if(/teacher|lecturer|professor|education|trainer/.test(lower)) focus='supporting effective learning, communicating clearly, and helping learners achieve measurable progress';
      else if(/marketing|sales|business development|hr|human resources/.test(lower)) focus='building strong professional relationships, improving business outcomes, and supporting sustainable growth';
      else if(/doctor|nurse|medical|health|pharmac/.test(lower)) focus='delivering high-quality professional service, maintaining safety standards, and supporting positive outcomes';
      const suggestions=[
        title+' focused on '+focus+'.'+skillPhrase,
        'Results-driven '+title+' with a strong commitment to '+focus+' and continuous professional improvement.'+skillPhrase,
        'Motivated '+title+' experienced in '+focus+'.'+skillPhrase
      ];
      const current=sections.find(s=>String(s.type)==='summary');
      const field=current?.fields?.find(f=>f.visibility!==false);
      if(!field)return;
      const next=suggestions.find(v=>v!==String(field.value||''))||suggestions[0];
      surface.dispatch(createEditorCommand({type:'set-field',target:{sectionId:current.id,fieldId:field.id},payload:{value:next}}));
    };
    button.addEventListener('click',handler);
    listeners.push(()=>button.removeEventListener('click',handler));
  });
  root.querySelectorAll('[data-v2-editor-rating-style]').forEach(input => {
    const handler=()=>surface.dispatch(createEditorCommand({type:'set-rating-style',target:{sectionType:input.dataset.v2EditorRatingStyle},payload:{sectionType:input.dataset.v2EditorRatingStyle,style:input.value}}));
    input.addEventListener('change',handler); listeners.push(()=>input.removeEventListener('change',handler));
  });
  root.querySelectorAll('[data-v2-editor-item-rating]').forEach(input => {
    const handler=()=>surface.dispatch(createEditorCommand({type:'set-item-rating',target:{sectionType:input.dataset.v2EditorItemRating},payload:{sectionType:input.dataset.v2EditorItemRating,item:input.dataset.v2RatingItem,rating:Number(input.value)}}));
    input.addEventListener('change',handler); listeners.push(()=>input.removeEventListener('change',handler));
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
  root.querySelectorAll('[data-v2-editor-section-placement]').forEach(input => {
    const handler = () => surface.dispatch(createEditorCommand({
      type:'set-section-placement',
      target:{sectionId:input.dataset.v2EditorSectionPlacement},
      payload:{placement:input.value}
    }));
    input.addEventListener('change',handler);
    listeners.push(()=>input.removeEventListener('change',handler));
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
