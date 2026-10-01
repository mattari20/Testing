export const CV_EDITOR_SECTIONS_SECTIONLABEL_VERSION='1.0.0';
export function sectionLabel(value, options={}){
 return String(value?.title||value?.label||'Section');
}