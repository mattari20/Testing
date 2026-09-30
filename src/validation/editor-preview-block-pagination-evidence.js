export const EDITOR_PREVIEW_BLOCK_PAGINATION_EVIDENCE_VERSION='1.0.0';

export function createEditorPreviewBlockPaginationEvidence(input={}){
 const checks={
   blocks:Number(input.blocks)>=0,
   pages:Number(input.pages)>0,
   assignments:input.assignments==='passed',
   distribution:input.distribution==='passed'
 };
 return Object.freeze({version:EDITOR_PREVIEW_BLOCK_PAGINATION_EVIDENCE_VERSION,status:Object.values(checks).every(Boolean)?'passed':'incomplete',checks,blockCount:Number(input.blocks)||0,pageCount:Number(input.pages)||0});
}
