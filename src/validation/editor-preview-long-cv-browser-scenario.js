export const EDITOR_PREVIEW_LONG_CV_BROWSER_SCENARIO_VERSION='1.0.0';

export function createLongCvBrowserScenario(input={}){
  const sections=Array.isArray(input.sections)?input.sections:['summary','experience','education','projects','skills','languages'];
  return Object.freeze({version:EDITOR_PREVIEW_LONG_CV_BROWSER_SCENARIO_VERSION,pageFormat:'A4',minimumPages:Math.max(2,Number(input.minimumPages)||2),sections,requiresRealBrowser:true,assertions:['page-count','fragment-continuity','no-overflow','navigation']});
}