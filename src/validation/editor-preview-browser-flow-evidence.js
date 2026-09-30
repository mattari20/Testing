export const EDITOR_PREVIEW_BROWSER_FLOW_EVIDENCE_VERSION='1.1.0';
export function createBrowserFlowEvidence(input={}){
 const evidence={
  version:EDITOR_PREVIEW_BROWSER_FLOW_EVIDENCE_VERSION,
  render:Boolean(input.render),pagination:Boolean(input.pagination),navigation:Boolean(input.navigation),
  fragments:Boolean(input.fragments),geometry:Boolean(input.geometry),overflowFree:Boolean(input.overflowFree),
  fragmentCount:Number(input.fragmentCount)||0,pageCount:Number(input.pageCount)||0,
  requiresActualExecution:true
 };
 return Object.freeze({...evidence,complete:evidence.render&&evidence.pagination&&evidence.navigation&&evidence.fragments&&evidence.geometry&&evidence.overflowFree&&evidence.fragmentCount>0&&evidence.pageCount>1});
}