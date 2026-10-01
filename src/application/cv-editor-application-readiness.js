import {createCVEditorRuntimeHealth} from './cv-editor-runtime-health.js';
import {createCVEditorReadinessGate} from './cv-editor-readiness-gate.js';
export const CV_EDITOR_APPLICATION_READINESS_VERSION='1.0.0';
export function createCVEditorApplicationReadiness(options={}){const health=createCVEditorRuntimeHealth({adapter:options.adapter});const gate=createCVEditorReadinessGate({health,validation:options.validation});return Object.freeze({version:CV_EDITOR_APPLICATION_READINESS_VERSION,health,gate,check:()=>gate.check(),destroy(){gate.destroy();health.destroy();}});}