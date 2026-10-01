export const CV_BUILDER_ACCEPTANCE_VERSION='1.0.0';
export function evaluateCVBuilderAcceptance(options={}){
 const checks=[
  ['application',Boolean(options.application)],
  ['editorState',typeof options.adapter?.getState==='function'],
  ['editing',typeof options.adapter?.edit==='function'],
  ['undoRedo',typeof options.adapter?.undo==='function'&&typeof options.adapter?.redo==='function'],
  ['preview',typeof options.application?.page?.render==='function'],
  ['persistence',Boolean(options.sessionRuntime)],
  ['export',Boolean(options.printExport)],
  ['v1Isolation',options.v1Path==null||options.v1Path!==options.v2Path]
 ];
 const failures=checks.filter(([,ok])=>!ok).map(([name])=>name);
 return Object.freeze({version:CV_BUILDER_ACCEPTANCE_VERSION,ready:failures.length===0,checks,failures});
}