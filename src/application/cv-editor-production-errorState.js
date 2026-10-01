export const CV_EDITOR_PRODUCTION_ERRORSTATE_VERSION='1.0.0';
export function errorState(value, options={}){
 return Object.freeze({hasError:Boolean(value),message:value?.message||String(value||'')});
}