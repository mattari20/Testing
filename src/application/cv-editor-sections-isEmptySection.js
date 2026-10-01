export const CV_EDITOR_SECTIONS_ISEMPTYSECTION_VERSION='1.0.0';
export function isEmptySection(value, options={}){
 return !(Array.isArray(value?.entries)&&value.entries.length);
}