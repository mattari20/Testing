export const CV_EDITOR_EXPORT_EXPORTFORMAT_VERSION='1.0.0';
export function exportFormat(value, options={}){
 return String(value||'pdf').toLowerCase();
}