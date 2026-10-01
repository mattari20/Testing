import {CV_EDITOR_E2E_100_GROUPS} from './cv-editor-e2e-100-group-registry.js';
import {inspectCVEditorProductContracts} from './cv-editor-product-contracts.js';
import {runCVEditorE2EWorkflow} from './cv-editor-e2e-runner.js';
export const CV_EDITOR_E2E_RELEASE_VERSION='1.0.0';
export function createCVEditorE2ERelease(options={}){
 const root={application:options.application,adapter:options.adapter};
 function inspect(){
  const contracts=inspectCVEditorProductContracts(root);
  const scenario=options.adapter?runCVEditorE2EWorkflow({adapter:options.adapter,sampleValue:options.sampleValue}):null;
  return Object.freeze({version:CV_EDITOR_E2E_RELEASE_VERSION,groups:CV_EDITOR_E2E_100_GROUPS.length,contracts,scenario,ready:contracts.valid&&(scenario?scenario.passed:false)});
 }
 return Object.freeze({version:CV_EDITOR_E2E_RELEASE_VERSION,inspect});
}
