export const CV_BUILDER_HEALTH_VERSION='1.0.0';
export function inspectCVBuilderHealth(options={}){
 const checks=[
  ['application',Boolean(options.application)],
  ['adapter',typeof options.adapter?.getState==='function'],
  ['browserPage',Boolean(options.application?.page)],
  ['productionGate',Boolean(options.application?.productionGate)],
  ['v1Isolation',options.v1Path==null||options.v1Path!==options.v2Path]
 ];
 const failures=checks.filter(([,ok])=>!ok).map(([name])=>name);
 return Object.freeze({version:CV_BUILDER_HEALTH_VERSION,healthy:failures.length===0,checks,failures});
}