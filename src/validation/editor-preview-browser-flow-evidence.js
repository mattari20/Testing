export const EDITOR_PREVIEW_BROWSER_FLOW_EVIDENCE_VERSION='1.0.0';

export function createBrowserFlowEvidence(input={}){
 return Object.freeze({
  version:EDITOR_PREVIEW_BROWSER_FLOW_EVIDENCE_VERSION,
  render:Boolean(input.render),
  pagination:Boolean(input.pagination),
  navigation:Boolean(input.navigation),
  fragments:Boolean(input.fragments),
  geometry:Boolean(input.geometry),
  overflowFree:Boolean(input.overflowFree),
  requiresActualExecution:true,
  complete:Boolean(input.render&&input.pagination&&input.navigation&&input.fragments&&input.geometry&&input.overflowFree)
 });
}