import {createCVEditorProductionGate} from './cv-editor-production-gate.js';
import {runCVEditorProductionScenario} from './cv-editor-production-scenario.js';
export const CV_EDITOR_PRODUCTION_READINESS_VERSION='1.0.0';
export function inspectCVEditorProductionReadiness(options={}){
 const gate=createCVEditorProductionGate(options);
 const gateReport=gate.inspect();
 const scenario=options.adapter?runCVEditorProductionScenario({adapter:options.adapter,sampleValue:options.sampleValue}):null;
 return Object.freeze({version:CV_EDITOR_PRODUCTION_READINESS_VERSION,gate:gateReport,scenario,ready:gateReport.ready&&(scenario?scenario.passed:true)});
}
