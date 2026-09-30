export const EDITOR_PREVIEW_CONTENT_EVIDENCE_VERSION='1.0.0';
export function createEditorPreviewContentEvidence(input={}){
 const checks={pages:input.pages>0,contentMounted:input.contentMounted==='passed',selection:input.selection==='passed'};
 return Object.freeze({version:EDITOR_PREVIEW_CONTENT_EVIDENCE_VERSION,status:Object.values(checks).every(Boolean)?'passed':'incomplete',checks,pageCount:Number(input.pages)||0,currentPage:Number(input.currentPage)||0});
}
