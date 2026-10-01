export const CV_EDITOR_E2E_RUNNER_VERSION='1.0.0';
const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
function step(name,run){try{return {name,status:'passed',result:clone(run())};}catch(error){return {name,status:'failed',error:{name:error?.name||'Error',message:error?.message||String(error)}};}}
export function runCVEditorE2EWorkflow(options={}){
 const adapter=options.adapter;
 if(!adapter)throw new Error('E2E workflow requires adapter.');
 const results=[];
 results.push(step('state-read',()=>adapter.getState()));
 results.push(step('refresh',()=>adapter.refresh?.()));
 const state=results[0].result;
 const blocks=state?.projection?.blocks||state?.projection?.sections?.flatMap?.(section=>section.fields||[])||[];
 const first=blocks[0]?.id||null;
 if(first){
  results.push(step('edit',()=>adapter.edit(first,{value:options.sampleValue??'End-to-end verification'})));
  results.push(step('undo',()=>adapter.undo?.()));
  results.push(step('redo',()=>adapter.redo?.()));
 }
 const failed=results.filter(item=>item.status==='failed');
 return Object.freeze({version:CV_EDITOR_E2E_RUNNER_VERSION,passed:failed.length===0,steps:results,failed});
}
