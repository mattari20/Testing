export const CV_EDITOR_E2E_EVIDENCE_VERSION='1.0.0';
export function createCVEditorE2EEvidenceCollector(){
 const records=[];
 function record(group,result,details={}){const item=Object.freeze({group:Number(group),result:String(result),details:{...details},at:new Date().toISOString()});records.push(item);return item;}
 function summary(){const passed=records.filter(r=>r.result==='passed').length;const failed=records.filter(r=>r.result==='failed').length;const blocked=records.filter(r=>r.result==='blocked').length;return Object.freeze({version:CV_EDITOR_E2E_EVIDENCE_VERSION,total:records.length,passed,failed,blocked,complete:records.length>0&&failed===0&&blocked===0});}
 function list(){return records.map(r=>({...r,details:{...r.details}}));}
 return Object.freeze({version:CV_EDITOR_E2E_EVIDENCE_VERSION,record,summary,list});
}
