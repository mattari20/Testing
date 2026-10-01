export const CV_EDITOR_PRODUCTION_SCENARIO_VERSION='1.0.0';
function step(name,run){try{return {name,ok:true,result:run()};}catch(error){return {name,ok:false,error:{name:error.name,message:error.message}};}}
export function runCVEditorProductionScenario(options={}){
 const adapter=options.adapter;
 if(!adapter)throw new Error('Production scenario requires adapter.');
 const results=[];
 results.push(step('read-state',()=>adapter.getState()));
 results.push(step('refresh',()=>adapter.refresh?.()));
 const state=results[0].result;
 const blockId=state?.projection?.sections?.flatMap?.(section=>section.fields||[])[0]?.id||state?.projection?.blocks?.[0]?.id||null;
 if(blockId)results.push(step('edit-first-block',()=>adapter.edit(blockId,{value:options.sampleValue??'Production verification'})));
 results.push(step('undo',()=>adapter.undo?.()));
 results.push(step('redo',()=>adapter.redo?.()));
 const failed=results.filter(item=>!item.ok);
 return Object.freeze({version:CV_EDITOR_PRODUCTION_SCENARIO_VERSION,passed:failed.length===0,steps:results,failed});
}
