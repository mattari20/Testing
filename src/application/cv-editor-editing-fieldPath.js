export const CV_EDITOR_EDITING_FIELDPATH_VERSION='1.0.0';
export function fieldPath(value, options={}){
 return [options.sectionId,options.entryId,options.fieldId].filter(Boolean).join('.');
}