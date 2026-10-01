export const CV_EDITOR_EXPORT_ISEXPORTABLE_VERSION='1.0.0';
export function isExportable(value, options={}){
 return Boolean(value?.valid!==false);
}