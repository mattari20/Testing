export const CV_EDITOR_EXPORT_EXPORTMETADATA_VERSION='1.0.0';
export function exportMetadata(value, options={}){
 return Object.freeze({...value});
}