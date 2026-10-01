import { createExportRequest, createExportResult, validateExportRequest, EXPORT_FORMAT } from './cv-export-contract.js';
export const CV_EXPORT_PIPELINE_VERSION='1.0.0';
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
export function createCVExportPipeline(options={}) {
 const runtime=options.runtime; if(!runtime) throw new Error('Export pipeline requires an editor runtime.');
 let destroyed=false;
 return Object.freeze({
  version:CV_EXPORT_PIPELINE_VERSION,
  createRequest(format=EXPORT_FORMAT.PDF,metadata={}){if(destroyed)return null;const state=runtime.getState();return createExportRequest({format,documentSnapshot:{...clone(state.projection),targetedCVId:state.activeDocumentId},layout:clone(state.layout),metadata});},
  validate(request){if(destroyed)return null;return validateExportRequest(request);},
  prepare(format=EXPORT_FORMAT.PDF,metadata={}){if(destroyed)return null;const request=this.createRequest(format,metadata);const diagnostics=[];if(!request.layout)diagnostics.push({code:'LAYOUT_MISSING',severity:'error'});if(!request.documentSnapshot?.targetedCVId)diagnostics.push({code:'DOCUMENT_MISSING',severity:'error'});return createExportResult(request,{status:diagnostics.length?'blocked':'ready',diagnostics});},
  destroy(){destroyed=true;}
 });
}