export const CV_EDITOR_EXPORT_EXPORTFILENAME_VERSION='1.0.0';
export function exportFilename(value, options={}){
 return String(value||'cv').replace(/[^a-z0-9_-]+/gi,'-')+'.'+String(options.extension||'pdf');
}