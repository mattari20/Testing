export const CV_EDITOR_PRODUCTION_BROWSERCAPABILITY_VERSION='1.0.0';
export function browserCapability(value, options={}){
 return Object.freeze({supported:Boolean(value),name:options.name||'unknown'});
}