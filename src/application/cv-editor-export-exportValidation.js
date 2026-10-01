export const CV_EDITOR_EXPORT_EXPORTVALIDATION_VERSION='1.0.0';
export function exportValidation(value, options={}){
 return Object.freeze({valid:value?.valid!==false,errors:Array.isArray(value?.errors)?value.errors:[]});
}