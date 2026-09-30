export const EDITOR_PREVIEW_FRAGMENT_RUNTIME_EVIDENCE_VERSION='1.0.0';
export function createFragmentRuntimeEvidence(runtime={}){
 return Object.freeze({
  version:EDITOR_PREVIEW_FRAGMENT_RUNTIME_EVIDENCE_VERSION,
  pageCount:Number(runtime.layoutResult?.pageCount)||0,
  fragmentCount:Number(runtime.distribution?.fragmentCount)||0,
  continuity:Boolean(runtime.continuity?.valid),
  qualityGeometry:Boolean(runtime.quality?.geometry?.valid),
  qualitySlices:Boolean(runtime.quality?.slices?.valid),
  browserEvidenceRequired:true
 });
}