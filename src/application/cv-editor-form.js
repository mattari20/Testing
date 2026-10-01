export const CV_EDITOR_FORM_VERSION='1.0.0';
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
function fieldView(field){return {id:field.id,label:field.label,type:field.type,value:clone(field.value),visibility:field.visibility!==false};}
function entryView(entry){return {id:entry.id,values:clone(entry.values),visibility:entry.visibility!==false};}
export function createCVEditorFormModel(options={}) {
 const runtime=options.runtime;if(!runtime)throw new Error('Form model requires a runtime.');let destroyed=false;
 function build(){const s=runtime.getState();const p=s.projection||{};return Object.freeze({version:CV_EDITOR_FORM_VERSION,targetedCVId:s.activeDocumentId,sections:(p.sections||[]).map(x=>Object.freeze({id:x.id,title:x.title,visibility:x.visibility!==false,fields:(x.fields||[]).map(fieldView),entries:(x.entries||[]).map(entryView)}))});}
 function edit(blockId,patch){if(destroyed)return null;runtime.edit(blockId,patch);return build();}
 return Object.freeze({version:CV_EDITOR_FORM_VERSION,getState:build,edit,refresh(){if(destroyed)return null;runtime.refresh();return build();},destroy(){destroyed=true;}});
}