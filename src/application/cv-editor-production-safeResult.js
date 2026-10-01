export const CV_EDITOR_PRODUCTION_SAFERESULT_VERSION='1.0.0';
export function safeResult(value, options={}){
 return value===undefined?null:value;
}