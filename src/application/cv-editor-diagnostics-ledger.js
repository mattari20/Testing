export const CV_EDITOR_DIAGNOSTICS_LEDGER_VERSION='1.0.0';
export function createCVEditorDiagnosticsLedger(){
 const entries=[];
 function record(type,details={}){const entry=Object.freeze({type,details:{...details},at:new Date().toISOString()});entries.push(entry);return entry;}
 function list(){return entries.map(entry=>({...entry,details:{...entry.details}}));}
 function clear(){entries.length=0;}
 return Object.freeze({version:CV_EDITOR_DIAGNOSTICS_LEDGER_VERSION,record,list,clear});
}
