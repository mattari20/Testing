export const EDITOR_PREVIEW_BROWSER_FRAGMENT_EVIDENCE_VERSION='1.0.0';

export function createBrowserFragmentEvidence(input={}){
 const geometry=Array.isArray(input.geometry)?input.geometry:[];
 const fragments=Number(input.fragmentCount)||0;
 const pages=Number(input.pageCount)||0;
 return Object.freeze({
  version:EDITOR_PREVIEW_BROWSER_FRAGMENT_EVIDENCE_VERSION,
  pageCount:pages,
  fragmentCount:fragments,
  geometryPages:geometry.length,
  continuity:Boolean(input.continuity),
  overflow:Boolean(input.overflow),
  status:pages>0 && fragments>0 && geometry.length===pages && input.continuity && !input.overflow?'ready-for-review':'incomplete'
 });
}