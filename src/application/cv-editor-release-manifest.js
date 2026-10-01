export const CV_EDITOR_RELEASE_MANIFEST_VERSION='1.0.0';
export function createCVEditorReleaseManifest(options={}){
 return Object.freeze({
  version:CV_EDITOR_RELEASE_MANIFEST_VERSION,
  product:'eStudent CV Builder V2',
  schemaVersion:options.schemaVersion||'2.0.0',
  editorVersion:options.editorVersion||null,
  productionGateVersion:options.productionGateVersion||null,
  v1Isolation:true,
  localFirst:true,
  mandatoryLogin:false,
  externalProviders:options.externalProviders||[],
  releaseState:options.releaseState||'validation-required',
  generatedAt:options.generatedAt||new Date().toISOString()
 });
}
