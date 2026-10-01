export const CV_EDITOR_SECTIONS_SECTIONSUMMARY_VERSION='1.0.0';
export function sectionSummary(value, options={}){
 return Object.freeze({id:value?.id||null,title:value?.title||'',entries:Array.isArray(value?.entries)?value.entries.length:0});
}