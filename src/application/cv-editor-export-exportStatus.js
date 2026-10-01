export const CV_EDITOR_EXPORT_EXPORTSTATUS_VERSION='1.0.0';
export function exportStatus(value, options={}){
 return String(value?.status||'idle');
}