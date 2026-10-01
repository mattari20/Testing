export const CV_BUILDER_DEPLOYMENT_MANIFEST_VERSION='1.0.0';
export function createCVBuilderDeploymentManifest(options={}){
 return Object.freeze({version:CV_BUILDER_DEPLOYMENT_MANIFEST_VERSION,product:'eStudent CV Builder V2',release:options.release||'2.0.0',entry:options.entry||'/cv-builder-v2/',v1Protected:true,requiredEvidence:Object.freeze(['browser-execution','export-artifact','persistence-recovery','deployment-smoke'])});
}