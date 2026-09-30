export const EDITOR_PREVIEW_LONG_CONTENT_EVIDENCE_VERSION='1.0.0';
export function createEditorPreviewLongContentEvidence(input={}){
 const checks={multiPage:Number(input.pages)>1,fragments:Number(input.fragments)>Number(input.blocks||0),continuity:input.continuity==='passed'};
 return Object.freeze({version:EDITOR_PREVIEW_LONG_CONTENT_EVIDENCE_VERSION,status:Object.values(checks).every(Boolean)?'passed':'incomplete',checks});
}
