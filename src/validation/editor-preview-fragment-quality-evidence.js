export const EDITOR_PREVIEW_FRAGMENT_QUALITY_EVIDENCE_VERSION='1.0.0';

export function createFragmentQualityEvidence(result={}){
 return Object.freeze({
   version:EDITOR_PREVIEW_FRAGMENT_QUALITY_EVIDENCE_VERSION,
   pages:Array.isArray(result.fragments)?result.fragments.length:0,
   continuity:Boolean(result.continuity?.valid),
   geometry:Boolean(result.quality?.geometry?.valid),
   slices:Boolean(result.quality?.slices?.valid),
   distributionCount:Number(result.distribution?.fragmentCount)||0,
   hasOverflow:Boolean(result.layoutResult?.hasOverflow),
   browserRequired:true
 });
}