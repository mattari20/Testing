export const CV_EDITOR_EXPORT_EXPORTRESULT_VERSION='1.0.0';
export function exportResult(value, options={}){
 return Object.freeze({status:value?.status||'prepared',format:value?.format||options.format||'pdf'});
}