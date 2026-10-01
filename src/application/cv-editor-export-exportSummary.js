export const CV_EDITOR_EXPORT_EXPORTSUMMARY_VERSION='1.0.0';
export function exportSummary(value, options={}){
 return Object.freeze({format:value?.format||'pdf',status:value?.status||'idle'});
}