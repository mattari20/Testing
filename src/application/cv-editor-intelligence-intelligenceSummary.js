export const CV_EDITOR_INTELLIGENCE_INTELLIGENCESUMMARY_VERSION='1.0.0';
export function intelligenceSummary(value, options={}){
 return Object.freeze({score:Number(value?.score)||0,matched:Array.isArray(value?.matched)?value.matched.length:0,missing:Array.isArray(value?.missing)?value.missing.length:0});
}