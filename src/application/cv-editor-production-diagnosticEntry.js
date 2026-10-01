export const CV_EDITOR_PRODUCTION_DIAGNOSTICENTRY_VERSION='1.0.0';
export function diagnosticEntry(value, options={}){
 return Object.freeze({code:options.code||'INFO',message:String(value||'')});
}