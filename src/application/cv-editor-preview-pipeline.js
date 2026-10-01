import { createPreviewRequest, createPreviewResult } from '../preview/preview-engine.js';
export const CV_EDITOR_PREVIEW_PIPELINE_VERSION='1.0.0';
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
export function createCVEditorPreviewPipeline(options={}) {
 const runtime=options.runtime;const templateProvider=options.templateProvider;
 if(!runtime||typeof templateProvider!=='function')throw new Error('Preview pipeline requires runtime and templateProvider.');
 let destroyed=false;
 return Object.freeze({
  version:CV_EDITOR_PREVIEW_PIPELINE_VERSION,
  render(){if(destroyed)return null;const s=runtime.getState();const template=templateProvider(s);if(!template)throw new Error('Preview template is required.');const snapshot={...clone(s.projection),targetedCVId:s.activeDocumentId};const req=createPreviewRequest({documentSnapshot:snapshot,template,pageModel:clone(s.layout?.pageModel||{}),presentation:{},viewport:{}});return createPreviewResult(req,s.layout||{pages:[],pageCount:0,hasOverflow:false,diagnostics:[]});},
  destroy(){destroyed=true;}
 });
}