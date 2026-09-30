export const EDITOR_PREVIEW_FRAGMENT_EVIDENCE_VERSION='1.0.0';
export function createEditorPreviewFragmentEvidence(input={}){
 const checks={pages:Number(input.pages)>0,fragments:Number(input.fragments)>=0,distribution:input.distribution==='passed',continuity:input.continuity==='passed',overflowControlled:input.overflowControlled==='passed'};
 return Object.freeze({version:EDITOR_PREVIEW_FRAGMENT_EVIDENCE_VERSION,status:Object.values(checks).every(Boolean)?'passed':'incomplete',checks,pageCount:Number(input.pages)||0,fragmentCount:Number(input.fragments)||0});
}
