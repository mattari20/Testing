export const CV_EDITOR_PRODUCTION_CONTRACT_VERSION='1.0.0';
const has=(value)=>value!==null&&value!==undefined;
function resolve(root,path){return String(path).split('.').reduce((value,key)=>value==null?undefined:value[key],root);}
export function evaluateProductionGroup(root,group){
 const value=resolve(root,group.target);
 const expectation=group.expectation;
 const valid=expectation==='callable'?typeof value==='function':expectation==='nonNull'?has(value):has(value);
 return Object.freeze({group:group.group,domain:group.domain,name:group.name,target:group.target,expectation,valueType:typeof value,valid,reason:valid?'OK':'MISSING_CONTRACT'});
}
export function evaluateProductionContract(root,groups=[]){
 const results=groups.map(group=>evaluateProductionGroup(root,group));
 const failures=results.filter(result=>!result.valid);
 return Object.freeze({version:CV_EDITOR_PRODUCTION_CONTRACT_VERSION,valid:failures.length===0,total:results.length,passed:results.length-failures.length,failed:failures.length,results,failures});
}
