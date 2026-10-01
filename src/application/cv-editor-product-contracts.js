export const CV_EDITOR_PRODUCT_CONTRACTS_VERSION='1.0.0';
const fn=(root,path)=>String(path).split('.').reduce((v,k)=>v==null?undefined:v[k],root);
const rules=[
 ['browser','application.page',true],['browser','application.model',true],['browser','application.composition',true],['browser','application.realBrowser',true],
 ['editing','adapter.getState',false],['editing','adapter.edit',false],['editing','adapter.undo',false],['editing','adapter.redo',false],
 ['preview','application.page.render',false],['persistence','application.coordinator',true],['export','application.workflows.exportFlow',true],
 ['intelligence','application.workflows',true],['accessibility','application.keyboard',true],['release','application.productionGate',true]
];
export function inspectCVEditorProductContracts(root){
 const results=rules.map(([domain,path,objectRequired])=>{const value=fn(root,path);const valid=objectRequired?(value!==null&&value!==undefined):typeof value==='function';return {domain,path,valid,type:typeof value};});
 const failed=results.filter(r=>!r.valid);
 return Object.freeze({version:CV_EDITOR_PRODUCT_CONTRACTS_VERSION,valid:failed.length===0,results,failed});
}
