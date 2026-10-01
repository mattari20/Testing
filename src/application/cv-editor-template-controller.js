import { resolveTemplateSelection, applyTemplateSelection } from './cv-template-selection.js';
export const CV_EDITOR_TEMPLATE_CONTROLLER_VERSION='1.0.0';
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
export function createCVEditorTemplateController(options={}) {
 const runtime=options.runtime,registry=options.registry;if(!runtime||!registry)throw new Error('Template controller requires runtime and registry.');
 let destroyed=false;
 function current(){return runtime.getState().workspace;}
 return Object.freeze({
  version:CV_EDITOR_TEMPLATE_CONTROLLER_VERSION,
  list(){if(destroyed)return null;return registry.list({status:'published'});},
  select(templateId){if(destroyed)return null;const selection=resolveTemplateSelection(registry,templateId,{status:'published'});const ws=runtime.getWorkspace();const cv=ws.getActiveDocument();const next=clone(cv);next.configuration=applyTemplateSelection(next.configuration,selection);ws.replaceState({...ws.getState(),documents:ws.getState().documents.map(d=>d.id===next.id?next:d)},{type:'select-template'});runtime.refresh();return selection;},
  getState(){if(destroyed)return null;const s=current();return Object.freeze({version:CV_EDITOR_TEMPLATE_CONTROLLER_VERSION,activeDocumentId:s.activeDocumentId,templateId:runtime.getWorkspace().getActiveDocument()?.configuration?.template?.id||null});},
  destroy(){destroyed=true;}
 });
}