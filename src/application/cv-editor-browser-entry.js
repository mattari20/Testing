import {createCVEditorBrowserApplication} from './cv-editor-browser-application.js';
import {createCVEditorProductionGate} from './cv-editor-production-gate.js';
export const CV_EDITOR_BROWSER_ENTRY_VERSION='1.0.0';
export function createCVEditorBrowserEntry(options={}){
 const application=createCVEditorBrowserApplication(options);
 const gate=createCVEditorProductionGate({application,adapter:options.adapter});
 function start(){
  const report=gate.inspect();
  if(options.enforceProductionGate&& !report.ready)gate.assertReady();
  application.start();
  return Object.freeze({application,gate,report});
 }
 function stop(){application.stop();}
 return Object.freeze({version:CV_EDITOR_BROWSER_ENTRY_VERSION,application,gate,start,stop});
}
