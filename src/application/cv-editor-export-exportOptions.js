export const CV_EDITOR_EXPORT_EXPORTOPTIONS_VERSION='1.0.0';
export function exportOptions(value, options={}){
 return Object.freeze({...options});
}