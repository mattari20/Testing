export const CV_EDITOR_TEMPLATES_TEMPLATECOMPATIBILITY_VERSION='1.0.0';
export function templateCompatibility(value, options={}){
 return Object.freeze({supported:Boolean(value?.supported),status:value?.status||'unknown'});
}