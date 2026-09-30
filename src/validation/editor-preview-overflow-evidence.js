export const EDITOR_PREVIEW_OVERFLOW_EVIDENCE_VERSION='1.0.0';

export function createEditorPreviewOverflowEvidence(input={}){
 const overflow=Number(input.overflowBlocks)||0;
 const checks={measured:input.measured==='passed',pagination:input.pagination==='passed',overflowDiagnosed:input.overflowDiagnosed==='passed'};
 return Object.freeze({version:EDITOR_PREVIEW_OVERFLOW_EVIDENCE_VERSION,status:Object.values(checks).every(Boolean)?'passed':'incomplete',checks,overflowBlocks:overflow});
}
